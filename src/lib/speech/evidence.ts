import { z } from "zod";
import { comparisonCanOmitBeforeQuote, criterionSchema, type SpeechFeedback } from "./schema";
import { firstAssessmentSchema, repeatAssessmentSchema } from "./coaching";

// Gemini structured output supports enums, but does not enforce maxLength.
// Select short source excerpts by ID instead of asking it to recopy long quotes.
function excerpts(transcript: string): string[] {
  const values = new Set<string>();
  for (let start = 0; start < transcript.length;) {
    let end = Math.min(start + 180, transcript.length);
    if (end < transcript.length) {
      const boundary = transcript.lastIndexOf(" ", end);
      if (boundary > start + 80) end = boundary;
      if (/[\uD800-\uDBFF]/.test(transcript[end - 1]) && /[\uDC00-\uDFFF]/.test(transcript[end])) end--;
    }
    const value = transcript.slice(start, end).trim();
    if (value) values.add(value);
    if (end === transcript.length) break;
    // Overlap adjacent windows so an example crossing a boundary stays usable.
    const overlap = transcript.lastIndexOf(" ", end - 40);
    start = overlap > start + 40 ? overlap + 1 : end;
  }
  // Complete short sentences make more precise evidence than a window alone.
  const sentences = [...new Intl.Segmenter("en", { granularity: "sentence" }).segment(transcript)]
    .map(item => item.segment.trim()).filter(value => value.length >= 12 && value.length <= 180);
  const step = Math.max(1, Math.ceil(sentences.length / 64));
  for (let i = 0; i < sentences.length; i += step) values.add(sentences[i]);
  return [...values];
}

export function evidenceCoaching(transcript: string, previousTranscript?: string, focused = false, previousFeedback?: SpeechFeedback) {
  const entries = (text: string, prefix: string) => Object.fromEntries(
    excerpts(text).map((quote, index) => [`${prefix}${index + 1}`, quote]),
  );
  const current = entries(transcript, "c");
  const previous = entries(previousTranscript ?? "", "p");
  const quote = (source: Record<string, string>, optional = true) => z.enum(optional ? ["", ...Object.keys(source)] : Object.keys(source))
    .describe(optional
      ? "Select one supplied evidence ID, or an empty string when evidence is absent. Never output the quotation text."
      : "Select one supplied evidence ID. An empty string is not allowed. Never output the quotation text.")
    .transform(id => id === "" ? "" : source[id]);
  const currentQuote = quote(current);
  const criterion = criterionSchema.extend({ quote: currentQuote });
  const first = firstAssessmentSchema.extend({ assessment: z.object({
    relevance: criterion, point: criterion, example: criterion, ending: criterion,
  }) });
  const mayOmitBefore = comparisonCanOmitBeforeQuote(previousFeedback);
  // Make the model's available choices agree with validateFeedback. A missing
  // target in the earlier answer does not make an empty afterQuote sufficient
  // for claiming improvement, similarity, or a mixed result.
  const comparison = z.discriminatedUnion("outcome", [
    repeatAssessmentSchema.shape.comparison.extend({
      outcome: z.enum(["improved", "similar", "mixed"]),
      beforeQuote: quote(previous, mayOmitBefore), afterQuote: quote(current, false),
    }),
    repeatAssessmentSchema.shape.comparison.extend({
      outcome: z.literal("insufficient_evidence"),
      beforeQuote: quote(previous), afterQuote: currentQuote,
    }),
  ]);
  return {
    schema: focused ? z.object({ focus: criterion, comparison })
      : previousTranscript !== undefined ? first.extend({ comparison }) : first,
    sources: { current, previous },
    instruction: "\nEvidence selection: the user payload contains evidence.current and evidence.previous maps. Read the full transcripts to assess meaning, then put a single evidence ID (c1, c2, etc. for current evidence; p1, p2, etc. for beforeQuote) in each quote field. These IDs replace quotation text in this response. Choose the excerpt that supports your judgment. Use an empty string only when the normal evidence rules allow absence. The server restores the exact source text; do not write or edit quotation text yourself." +
      (previousTranscript === undefined ? "" : `\nComparison evidence: improved, similar and mixed require a non-empty afterQuote from evidence.current. If you cannot support the comparison with current evidence, use insufficient_evidence and explain the limitation; do not invent a quotation or improvement. An empty beforeQuote ${mayOmitBefore ? "is allowed because the saved practice target was missing" : "is allowed only for insufficient_evidence"}. The saved missing-target exception never permits an empty afterQuote for improved, similar or mixed.`),
  };
}
