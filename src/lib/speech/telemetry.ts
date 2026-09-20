"use client";
import { track } from "@/lib/track";
import { SPEECH_ISSUE_CODES, type SpeechEvent } from "./events";

type Properties = {
  content_source: string;
  attempt?: number;
  input_method?: "microphone" | "upload";
  duration_seconds?: number;
  elapsed_ms?: number;
  error_code?: string;
  status_code?: number;
  transcript_edited?: boolean;
  outcome?: string;
};
export function trackSpeech(event: SpeechEvent, properties: Properties) {
  // Deliberately no transcript, topic, email, file name, auth ID or attempt UUID.
  const safe: Record<string, string | number | boolean> = { measurement_version: "speech-v2" };
  for (const key of ["content_source", "input_method", "error_code", "outcome"] as const) {
    const value = properties[key];
    if (typeof value === "string" && /^[a-z0-9_]{1,80}$/.test(value)) safe[key] = value;
  }
  for (const key of ["attempt", "duration_seconds", "elapsed_ms", "status_code"] as const) {
    const value = properties[key];
    if (typeof value === "number" && Number.isFinite(value) && value >= 0) safe[key] = value;
  }
  if (typeof properties.transcript_edited === "boolean") safe.transcript_edited = properties.transcript_edited;
  track(event, safe);
  if (event.endsWith("_error") && SPEECH_ISSUE_CODES.some((code) => code === safe.error_code)) {
    track(`speech_issue_${safe.error_code}`, safe);
  }
  try {
  if (typeof window !== "undefined" && window.clarity && window.__rtReplayActive) {
    window.clarity("event", event);
    if (safe.content_source) window.clarity("set", "speech_source", safe.content_source);
    if (properties.attempt) window.clarity("set", "speech_attempt", String(properties.attempt));
    if (safe.error_code) window.clarity("set", "speech_error", safe.error_code);
  }
  } catch { /* Replay must never interrupt practice. */ }
}

export function speechErrorCode(error: unknown): string {
  const status = (error as { status?: number } | null)?.status;
  if (status === 402) return "quota";
  if (status === 429) return "daily_limit";
  if (status === 422) return "insufficient_speech";
  if (status === 401) return "session";
  if (status === 409) return "conflict";
  if (status && status >= 500) return "service";
  if (status === 400) return "invalid_audio_or_text";
  if (error instanceof DOMException) {
    if (error.name === "NotAllowedError") return "permission_denied";
    if (error.name === "NotFoundError") return "no_device";
    if (error.name === "NotReadableError") return "device_busy";
  }
  return "client_or_network";
}
