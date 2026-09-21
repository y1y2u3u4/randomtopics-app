"use client";
import { practiceFetch } from "./client";
import { speechErrorCode, trackSpeech } from "./telemetry";

export async function resumeHistoryFeedback(attempt: {
  id: string;
  transcript: string;
  previous_id?: string | null;
}) {
  const properties = { content_source: "speech_account", attempt: attempt.previous_id ? 2 : 1 };
  const started = performance.now();
  trackSpeech("speech_history_resume", properties);
  trackSpeech("speech_history_feedback_start", properties);
  try {
    const result = await practiceFetch("feedback", { id: attempt.id, transcript: attempt.transcript });
    if (result.id !== attempt.id || result.status !== "complete" || !result.feedback)
      throw new Error("Feedback is not ready yet. Your transcript is saved; please refresh your history.");
    trackSpeech("speech_history_feedback_ready", { ...properties, elapsed_ms: Math.round(performance.now() - started) });
    return result;
  } catch (error) {
    trackSpeech("speech_history_feedback_error", {
      ...properties, error_code: speechErrorCode(error), elapsed_ms: Math.round(performance.now() - started),
    });
    throw error;
  }
}
