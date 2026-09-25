import { z } from "zod";

export type SpeechFailureStage =
  | "actor" | "load_attempt" | "load_previous" | "claim_feedback"
  | "model_request" | "model_timeout" | "model_http" | "response_json"
  | "content_json" | "model_schema" | "feedback_evidence" | "feedback_save";

const schemaFields = new Set([
  "", "transcript", "strength", "strength.quote", "strength.observation",
  "priority", "priority.quote", "priority.observation", "priority.nextStep",
  "structure", "structure.point", "structure.example", "structure.ending",
  "comparison", "comparison.outcome", "comparison.beforeQuote", "comparison.afterQuote", "comparison.explanation",
  "assessment", "focus", "focus.status", "focus.quote", "focus.explanation",
  ...["relevance", "point", "example", "ending"].flatMap(criterion =>
    [`assessment.${criterion}`, ...["status", "quote", "explanation"].map(field => `assessment.${criterion}.${field}`)]),
]);
const schemaCodes = new Set(["invalid_type", "invalid_value", "too_small", "too_big", "invalid_format", "unrecognized_keys"]);
const evidenceIssues = ["ungrounded_quote", "missing_assessment_evidence", "missing_comparison_evidence",
  "invalid_comparison", "unexpected_comparison_quote", "missing_assessment"] as const;
type SpeechEvidenceIssue = typeof evidenceIssues[number] | "invalid_feedback_structure";
export function speechEvidenceIssue(error: unknown): SpeechEvidenceIssue | undefined {
  if (error instanceof z.ZodError) return "invalid_feedback_structure";
  return error instanceof Error && evidenceIssues.some(issue => issue === error.message)
    ? error.message as SpeechEvidenceIssue : undefined;
}
export function speechSchemaIssues(error: unknown) {
  if (!(error instanceof z.ZodError)) return [];
  return error.issues.slice(0, 8).map(issue => {
    const field = issue.path.join(".");
    return { field: schemaFields.has(field) ? field || "$" : "other",
      code: schemaCodes.has(issue.code) ? issue.code : "other" };
  });
}

const finishReasons = new Set(["stop", "length", "content_filter", "tool_calls", "function_call", "error"]);
function object(value: unknown): Record<string, unknown> | undefined {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown> : undefined;
}
function tokenCount(value: unknown): number | undefined {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0 && value <= 10_000_000
    ? value : undefined;
}

// Diagnose HTTP-200 output failures without logging text, provider errors or IDs.
// Select every field explicitly; the provider response must never be spread here.
export function speechModelOutput(data: unknown) {
  const envelope = object(data);
  const choice = Array.isArray(envelope?.choices) ? object(envelope.choices[0]) : undefined;
  const message = object(choice?.message);
  const content = message?.content;
  const usage = object(envelope?.usage);
  const finishReason = choice?.finish_reason;
  return {
    finish_reason: finishReason == null ? "missing"
      : typeof finishReason === "string" && finishReasons.has(finishReason) ? finishReason : "other",
    content_state: content === undefined ? "missing" : content === null ? "null"
      : typeof content !== "string" ? "other_type" : content.length === 0 ? "empty"
      : content.trim().length === 0 ? "whitespace" : "text",
    ...(typeof content === "string" ? {
      content_chars: Math.min(content.length, 1_000_000),
      content_fenced: content.trimStart().startsWith("```"),
    } : {}),
    has_response_error: Boolean(envelope?.error || choice?.error),
    has_refusal: Boolean(message?.refusal),
    prompt_tokens: tokenCount(usage?.prompt_tokens),
    completion_tokens: tokenCount(usage?.completion_tokens),
    reasoning_tokens: tokenCount(object(usage?.completion_tokens_details)?.reasoning_tokens),
  };
}

// Only schema-owned paths and numeric limits may enter recovery instructions.
// Never include rejected text, arbitrary property names, or Zod error messages.
export function speechLengthRecoveryHint(error: unknown): string {
  if (!(error instanceof z.ZodError)) return "";
  const limits = error.issues.flatMap(issue => {
    const field = issue.path.join(".");
    return issue.code === "too_big" && issue.origin === "string" &&
      schemaFields.has(field) && field !== "" &&
      typeof issue.maximum === "number" && Number.isSafeInteger(issue.maximum) &&
      issue.maximum > 0 && issue.maximum <= 10000
      ? [`${field}: at most ${issue.maximum} characters, including spaces and punctuation`] : [];
  }).slice(0, 8);
  if (!limits.length) return "";
  return `\nThe rejected response exceeded these specific limits: ${limits.join("; ")}. Aim well below each limit. For a quote, select a shorter exact contiguous substring that still supports the assessment; do not paraphrase, join passages, or add ellipses. For an explanation, write a shorter complete sentence. Return every required field.`;
}

// Closed categories only: no Error object, content, identifiers or request headers.
export function logSpeechFailure(operation: "transcribe" | "feedback", stage: SpeechFailureStage,
  elapsedMs: number, providerStatus?: number,
  details?: { attempt: 1 | 2; retrying: boolean; issues?: ReturnType<typeof speechSchemaIssues>; evidenceIssue?: SpeechEvidenceIssue; modelOutput?: ReturnType<typeof speechModelOutput> }) {
  try {
    console.error(JSON.stringify({
      event: "speech_service_failure", operation, stage,
      elapsed_ms: Number.isFinite(elapsedMs) ? Math.max(0, Math.round(elapsedMs)) : 0,
      ...(typeof providerStatus === "number" && Number.isInteger(providerStatus) && providerStatus >= 100 && providerStatus <= 599
        ? { provider_status: providerStatus } : {}),
      ...(details ? { attempt: details.attempt, retrying: details.retrying,
        ...(details.issues?.length ? { schema_issues: details.issues } : {}),
        ...(details.modelOutput ? { model_output: details.modelOutput } : {}),
        ...(details.evidenceIssue ? { evidence_issue: details.evidenceIssue } : {}) } : {}),
    }));
  } catch { /* Diagnostic failures must not alter the customer response. */ }
}

export function logSpeechRecovery(operation: "transcribe" | "feedback", elapsedMs: number) {
  try {
    console.info(JSON.stringify({ event: "speech_service_recovered", operation, attempt: 2,
      elapsed_ms: Math.max(0, Math.round(elapsedMs)) }));
  } catch { /* Keep diagnostics separate from the customer response. */ }
}
