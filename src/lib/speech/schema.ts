import { z } from "zod";

export const MAX_AUDIO_BYTES = 3_500_000;
export const MAX_SECONDS = 120;
export const MODEL = "google/gemini-2.5-flash";
const note = z.string().trim().min(1).max(700);
const observation = z.object({ quote: z.string().max(400), observation: note });
export const feedbackSchema = z.object({
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
export const transcriptSchema = z.object({
  transcript: z.string().trim().max(10000),
});
export function validateFeedback(
  value: unknown,
  transcript: string,
  previous?: string,
) {
  const result = feedbackSchema.parse(value);
  for (const item of [result.strength, result.priority]) {
    if (item.quote && !transcript.includes(item.quote))
      throw new Error("ungrounded_quote");
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
    (!result.comparison.beforeQuote || !result.comparison.afterQuote)
  )
    throw new Error("missing_comparison_evidence");
  if (
    !previous &&
    (result.comparison.beforeQuote || result.comparison.afterQuote)
  )
    throw new Error("unexpected_comparison_quote");
  return result;
}
