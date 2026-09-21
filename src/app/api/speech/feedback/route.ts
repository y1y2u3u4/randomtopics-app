import { z } from "zod";
import {
  actor,
  failure,
  modelCall,
  readJson,
  response,
  SpeechError,
} from "@/lib/speech/server";
import { feedbackSchema, validateFeedback, type SpeechFeedback } from "@/lib/speech/schema";
import { assembleFeedback, coachingInstruction, firstAssessmentSchema, focusedAssessmentSchema, repeatAssessmentSchema, type CoachingResult } from "@/lib/speech/coaching";
import { speechAllowance } from "@/lib/speech/allowance";
import { logSpeechFailure, type SpeechFailureStage } from "@/lib/speech/diagnostics";
export const runtime = "nodejs";
export const maxDuration = 60;
export async function POST(request: Request) {
  const started = Date.now();
  let stage: SpeechFailureStage = "actor";
  try {
    const { db, user } = await actor(request);
    const parsed = z
      .object({
        id: z.uuid(),
        transcript: z.string().trim().min(20).max(10000),
        revise: z.boolean().default(false),
      })
      .safeParse(await readJson(request));
    if (!parsed.success)
      throw new SpeechError(
        400,
        "Please check the transcript before requesting feedback.",
      );
    const { id, transcript, revise } = parsed.data;
    stage = "load_attempt";
    const { data: attempt, error } = await db
      .from("speech_attempts")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .single();
    if (error || !attempt) throw new SpeechError(404, "Practice not found.");
    if (attempt.status === "complete" && (!revise || transcript === attempt.transcript)) {
      const {
        id,
        topic,
        transcript,
        duration,
        feedback,
        status,
        previous_id,
        created_at,
      } = attempt;
      return response({
        id,
        topic,
        transcript,
        duration,
        feedback,
        status,
        previous_id,
        created_at,
        allowance: await speechAllowance(db, user.id).catch(() => undefined),
        correctionsRemaining: Math.max(0, 3 - attempt.feedback_calls),
      });
    }
    let previous: { transcript: string; feedback: SpeechFeedback } | null = null;
    if (attempt.previous_id) {
      stage = "load_previous";
      const result = await db
        .from("speech_attempts")
        .select("transcript,feedback")
        .eq("id", attempt.previous_id)
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .single();
      if (result.error || !result.data?.transcript)
        throw new SpeechError(
          409,
          "The earlier attempt is no longer available. Start a new practice round.",
        );
      previous = { transcript: result.data.transcript, feedback: feedbackSchema.parse(result.data.feedback) };
    }
    stage = "claim_feedback";
    const claim = await db.rpc("claim_speech_feedback_v5", {
      p_id: id,
      p_user: user.id,
      p_transcript: transcript,
      p_revision: revise,
    });
    if (claim.error || !claim.data)
      throw new SpeechError(
        409,
        "This feedback is processing or cannot be retried. Check your history, or start another attempt.",
      );
    try {
      stage = "model_request";
      const focused = attempt.usage?.context?.practiceMode === "focused" && Boolean(previous?.feedback.drill);
      const result = await modelCall(
        (focused ? focusedAssessmentSchema : previous ? repeatAssessmentSchema : firstAssessmentSchema) as z.ZodType<CoachingResult>,
        "speech_feedback",
        coachingInstruction(previous?.feedback, focused),
        JSON.stringify({ topic: attempt.topic, transcript, previous,
          practiceGoal: previous?.feedback.drill ?? previous?.feedback.priority,
          scope: focused ? "focused" : "full" }),
      );
      stage = "feedback_evidence";
      const feedback = validateFeedback(
        assembleFeedback(result.value, transcript, previous?.feedback, focused),
        transcript,
        previous?.transcript,
        previous?.feedback,
      );
      stage = "feedback_save";
      const { data, error: saveError } = await db
        .from("speech_attempts")
        .update({
          status: "complete",
          feedback,
          model: result.model,
          usage: { ...attempt.usage, feedback: result.usage,
            ...(revise ? { earlierFeedbackUsage: [...(attempt.usage?.earlierFeedbackUsage ?? []), attempt.usage?.feedback ?? {}] } : {}) },
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .select(
          "id,topic,transcript,duration,feedback,status,previous_id,created_at",
        )
        .single();
      if (saveError) throw saveError;
      return response({ ...data, allowance: await speechAllowance(db, user.id).catch(() => undefined),
        correctionsRemaining: Math.max(0, 2 - attempt.feedback_calls) });
    } catch (error) {
      await db
        .from("speech_attempts")
        .update({
          status: attempt.status === "complete" ? "complete" : attempt.feedback_calls >= 2 ? "failed" : "transcribed",
          ...(attempt.status === "complete" ? { transcript: attempt.transcript } : {}),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", user.id)
        .eq("status", "processing");
      throw error;
    }
  } catch (error) {
    // modelCall logs its own precise failure stage. Keep validation/storage failures
    // distinguishable without exposing transcript, quotes, account or provider data.
    if (!stage.startsWith("model_") && (!(error instanceof SpeechError) || error.status >= 500))
      logSpeechFailure("feedback", stage, Date.now() - started);
    return failure(error);
  }
}
