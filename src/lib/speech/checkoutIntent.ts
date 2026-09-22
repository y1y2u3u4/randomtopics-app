import { speechEntrySource, type SpeechEntrySource } from "./exposure";
// UI navigation only. This never authorizes Checkout or grants paid access.
const key = "rt_speech_checkout_intent_v1";
const lifetime = 24 * 60 * 60 * 1000;
export type CheckoutIntent = { createdAt: number; qa: boolean; entrySource?: SpeechEntrySource };
export function readCheckoutIntent(): CheckoutIntent | null {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    if (!value || typeof value.createdAt !== "number" || !Number.isFinite(value.createdAt) ||
      value.createdAt > Date.now() || Date.now() - value.createdAt >= lifetime || typeof value.qa !== "boolean") {
      localStorage.removeItem(key);
      return null;
    }
    const entrySource = speechEntrySource(value.entrySource);
    return { createdAt: value.createdAt, qa: value.qa, ...(entrySource ? { entrySource } : {}) };
  } catch { return null; }
}
export function rememberCheckoutIntent(qa: boolean, source?: string) {
  const entrySource = source === undefined ? readCheckoutIntent()?.entrySource : speechEntrySource(source);
  try { localStorage.setItem(key, JSON.stringify({ createdAt: Date.now(), qa, ...(entrySource ? { entrySource } : {}) })); } catch { /* Navigation still works without storage. */ }
}
export function clearCheckoutIntent() {
  try { localStorage.removeItem(key); } catch { /* optional UI state */ }
}
export const speechPlanPath = "/speech/account?plan=monthly#speech-plan";
