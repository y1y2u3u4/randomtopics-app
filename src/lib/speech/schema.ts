import { z } from "zod";

export const MAX_AUDIO_BYTES = 3_500_000;
export const MAX_SECONDS = 120;
export const MODEL = "google/gemini-2.5-flash";
const note = z.string().trim().min(1).max(700);
const observation = z.object({ quote: z.string().max(400), observation: note });
export const focusSchema = z.enum(["relevance", "point", "example", "ending", "concise"]);
export type SpeechFocus = z.infer<typeof focusSchema>;
export const criterionSchema = z.object({
  status: z.enum(["met", "partial", "missing", "unclear"]),
  quote: z.string().max(240),
  explanation: z.string().trim().min(1).max(300),
});
const savedCriterionSchema = criterionSchema.extend({
  status: z.enum(["met", "partial", "missing", "unclear", "not_assessed"]),
});
export const assessmentSchema = z.object({
  relevance: criterionSchema, point: criterionSchema,
  example: criterionSchema, ending: criterionSchema,
});
const savedAssessmentSchema = z.object({
  relevance: savedCriterionSchema, point: savedCriterionSchema,
  example: savedCriterionSchema, ending: savedCriterionSchema,
});
export const drillSchema = z.object({
  target: focusSchema,
  kind: z.enum(["fix", "refine", "check"]),
  seconds: z.literal(20),
  instruction: z.string().min(1).max(400),
  starter: z.string().min(1).max(260),
  successCriterion: z.string().min(1).max(240),
});
export const feedbackSchema = z.object({
  version: z.literal("v5").optional(),
  scope: z.enum(["full", "focused"]).optional(),
  assessment: savedAssessmentSchema.optional(),
  drill: drillSchema.optional(),
  strength: observation,
  priority: observation.extend({ nextStep: note }),
  structure: z.object({ point: note, example: note, ending: note }),
  comparison: z.object({
    outcome: z.enum([
      "improved",
      "similar",
      "mixed",
      "insufficient_evidence",
      "first_attempt",
    ]),
    beforeQuote: z.string().max(400),
    afterQuote: z.string().max(400),
    explanation: note,
  }),
});
export type SpeechFeedback = z.infer<typeof feedbackSchema>;
// A first attempt has no comparison to generate. Keep that bookkeeping out of
// the model schema, then attach a deterministic first-attempt marker server-side.
export const firstFeedbackSchema = feedbackSchema.omit({ comparison: true });
export function firstAttemptFeedback(value: z.infer<typeof firstFeedbackSchema>): SpeechFeedback {
  return { ...value, comparison: {
    outcome: "first_attempt", beforeQuote: "", afterQuote: "",
    explanation: "This is your first attempt. Practice the same topic again to compare.",
  } };
}
export const transcriptSchema = z.object({
  transcript: z.string().trim().max(10000),
});
// Share the saved-target exception with the generation contract. It only
// permits missing *before* evidence, never an unsupported current comparison.
export function comparisonCanOmitBeforeQuote(previousFeedback?: SpeechFeedback) {
  const target = previousFeedback?.drill?.target;
  return Boolean(target && target !== "concise" &&
    previousFeedback?.assessment?.[target]?.status === "missing");
}
export function validateFeedback(
  value: unknown,
  transcript: string,
  previous?: string,
  previousFeedback?: SpeechFeedback,
) {
  const result = feedbackSchema.parse(value);
  for (const item of [result.strength, result.priority]) {
    if (item.quote && !transcript.includes(item.quote))
      throw new Error("ungrounded_quote");
  }
  for (const item of Object.values(result.assessment ?? {})) {
    if (item.quote && !transcript.includes(item.quote)) throw new Error("ungrounded_quote");
  }
  if (
    result.comparison.afterQuote &&
    !transcript.includes(result.comparison.afterQuote)
  )
    throw new Error("ungrounded_quote");
  if (
    result.comparison.beforeQuote &&
    !previous?.includes(result.comparison.beforeQuote)
  )
    throw new Error("ungrounded_quote");
  if (!previous && result.comparison.outcome !== "first_attempt")
    throw new Error("invalid_comparison");
  if (previous && result.comparison.outcome === "first_attempt")
    throw new Error("invalid_comparison");
  if (
    previous &&
    result.comparison.outcome !== "insufficient_evidence" &&
    ((!result.comparison.beforeQuote && !(
      result.version === "v5" && comparisonCanOmitBeforeQuote(previousFeedback)
    )) || !result.comparison.afterQuote)
  )
    throw new Error("missing_comparison_evidence");
  if (
    !previous &&
    (result.comparison.beforeQuote || result.comparison.afterQuote)
  )
    throw new Error("unexpected_comparison_quote");
  return result;
}
