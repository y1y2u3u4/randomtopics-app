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
]);
const schemaCodes = new Set(["invalid_type", "invalid_value", "too_small", "too_big", "invalid_format", "unrecognized_keys"]);
export function speechSchemaIssues(error: unknown) {
  if (!(error instanceof z.ZodError)) return [];
  return error.issues.slice(0, 8).map(issue => {
    const field = issue.path.join(".");
    return { field: schemaFields.has(field) ? field || "$" : "other",
      code: schemaCodes.has(issue.code) ? issue.code : "other" };
  });
}

// Closed categories only: no Error object, content, identifiers or request headers.
export function logSpeechFailure(operation: "transcribe" | "feedback", stage: SpeechFailureStage,
  elapsedMs: number, providerStatus?: number,
  details?: { attempt: 1 | 2; retrying: boolean; issues?: ReturnType<typeof speechSchemaIssues> }) {
  try {
    console.error(JSON.stringify({
      event: "speech_service_failure", operation, stage,
      elapsed_ms: Number.isFinite(elapsedMs) ? Math.max(0, Math.round(elapsedMs)) : 0,
      ...(typeof providerStatus === "number" && Number.isInteger(providerStatus) && providerStatus >= 100 && providerStatus <= 599
        ? { provider_status: providerStatus } : {}),
      ...(details ? { attempt: details.attempt, retrying: details.retrying,
        ...(details.issues?.length ? { schema_issues: details.issues } : {}) } : {}),
    }));
  } catch { /* Diagnostic failures must not alter the customer response. */ }
}

export function logSpeechRecovery(elapsedMs: number) {
  try {
    console.info(JSON.stringify({ event: "speech_service_recovered", operation: "feedback", attempt: 2,
      elapsed_ms: Math.max(0, Math.round(elapsedMs)) }));
  } catch { /* Keep diagnostics separate from the customer response. */ }
}
