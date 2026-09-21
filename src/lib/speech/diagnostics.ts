export type SpeechFailureStage =
  | "actor" | "load_attempt" | "load_previous" | "claim_feedback"
  | "model_request" | "model_timeout" | "model_http" | "response_json"
  | "content_json" | "model_schema" | "feedback_evidence" | "feedback_save";

// Closed categories only: no Error object, content, identifiers or request headers.
export function logSpeechFailure(operation: "transcribe" | "feedback", stage: SpeechFailureStage,
  elapsedMs: number, providerStatus?: number) {
  try {
    console.error(JSON.stringify({
      event: "speech_service_failure", operation, stage,
      elapsed_ms: Number.isFinite(elapsedMs) ? Math.max(0, Math.round(elapsedMs)) : 0,
      ...(typeof providerStatus === "number" && Number.isInteger(providerStatus) && providerStatus >= 100 && providerStatus <= 599
        ? { provider_status: providerStatus } : {}),
    }));
  } catch { /* Diagnostic failures must not alter the customer response. */ }
}
