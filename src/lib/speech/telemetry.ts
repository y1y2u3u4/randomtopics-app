"use client";
import { track } from "@/lib/track";
import { isProductionHost } from "@/lib/analyticsEnvironment";
import { SPEECH_ISSUE_CODES, type SpeechEvent } from "./events";
import { readCheckoutIntent } from "./checkoutIntent";
import { SPEECH_EXPOSURE_VERSION, speechEntrySource } from "./exposure";

type Properties = {
  content_source: string;
  entry_surface?: "primary" | "example" | "desktop_nav" | "mobile_nav";
  attempt?: number;
  input_method?: "microphone" | "upload";
  duration_seconds?: number;
  elapsed_ms?: number;
  error_code?: string;
  status_code?: number;
  transcript_edited?: boolean;
  outcome?: string;
  reason?: string;
};
export function trackSpeech(event: SpeechEvent, properties: Properties) {
  // Deliberately no transcript, topic, email, file name, auth ID or attempt UUID.
  const safe: Record<string, string | number | boolean> = {
    measurement_version: "speech-v2", exposure_version: SPEECH_EXPOSURE_VERSION,
  };
  const entrySource = properties.content_source === "speech_account"
    ? readCheckoutIntent()?.entrySource : speechEntrySource(properties.content_source);
  if (entrySource) safe.entry_source = entrySource;
  for (const key of ["content_source", "entry_surface", "input_method", "error_code", "outcome", "reason"] as const) {
    const value = properties[key];
    if (typeof value === "string" && /^[a-z0-9_]{1,80}$/.test(value)) safe[key] = value;
  }
  for (const key of ["attempt", "duration_seconds", "elapsed_ms", "status_code"] as const) {
    const value = properties[key];
    if (typeof value === "number" && Number.isFinite(value) && value >= 0) safe[key] = value;
  }
  if (typeof properties.transcript_edited === "boolean") safe.transcript_edited = properties.transcript_edited;
  const qa = speechQaSession();
  const eventName = qa ? `qa_${event}` : event;
  track(eventName, safe);
  if (qa && typeof window !== "undefined" && isProductionHost(window.location.hostname)) {
    window.dispatchEvent(new CustomEvent("rt:analytics", { detail: { event: eventName, params: safe } }));
  }
  if (event.endsWith("_error") && SPEECH_ISSUE_CODES.some((code) => code === safe.error_code)) {
    track(`${qa ? "qa_" : ""}speech_issue_${safe.error_code}`, safe);
  }
  try {
  if (!qa && typeof window !== "undefined" && window.clarity && window.__rtReplayActive) {
    window.clarity("event", event);
    if (safe.content_source) window.clarity("set", "speech_source", safe.content_source);
    if (properties.attempt) window.clarity("set", "speech_attempt", String(properties.attempt));
    if (safe.error_code) window.clarity("set", "speech_error", safe.error_code);
  }
  } catch { /* Replay must never interrupt practice. */ }
}

export function speechQaSession() {
  if (typeof window === "undefined") return false;
  const choice = new URLSearchParams(window.location?.search || "").get("speech_qa");
  try {
    if (choice === "1") sessionStorage.setItem("rt_speech_qa", "1");
    if (choice === "0") sessionStorage.removeItem("rt_speech_qa");
    return choice === "1" || sessionStorage.getItem("rt_speech_qa") === "1";
  } catch { return choice === "1"; }
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

export function trackConfirmedSpeechPurchase(purchase: unknown) {
  const p = purchase as { transactionId?: string; value?: number; currency?: string } | null;
  if (!p || !/^[a-f0-9]{64}$/.test(p.transactionId || "") || p.value !== 12 || p.currency !== "USD") return;
  try {
    // Tie the Stripe-confirmed receipt to this browser's actual Checkout launch.
    // A copied return URL, a historical purchase or a different device cannot create this event.
    if (sessionStorage.getItem("rt_speech_checkout_pending") !== p.transactionId) return;
    const key = `rt_speech_paid_${p.transactionId}`;
    if (localStorage.getItem(key)) return;
    trackSpeech("speech_payment_confirmed", { content_source: "speech_account" });
    track(speechQaSession() ? "qa_purchase" : "purchase", {
      transaction_id: p.transactionId, value: p.value, currency: p.currency,
      measurement_version: "speech-v2",
      items: [{ item_id: "randomtopics_speech_monthly", item_name: "RandomTopics Speech Coach", price: 12, quantity: 1 }],
    });
    localStorage.setItem(key, "1");
    sessionStorage.removeItem("rt_speech_checkout_pending");
  } catch { /* Storage restrictions and analytics failures never affect access. */ }
}
