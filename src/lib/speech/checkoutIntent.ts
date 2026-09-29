import { speechEntrySource, type SpeechEntrySource } from "./exposure";
// UI navigation only. This never authorizes Checkout or grants paid access.
const key = "rt_speech_checkout_intent_v1";
const lifetime = 24 * 60 * 60 * 1000;
export type CheckoutIntent = { createdAt: number; qa: boolean; entrySource?: SpeechEntrySource; attemptId?: string };
// An opaque navigation reference only. The history API must check ownership;
// never persist feedback, transcripts, credentials or entitlement here.
export function validPracticeReference(value: unknown): value is string {
  return typeof value === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
export function readCheckoutIntent(): CheckoutIntent | null {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    if (!value || typeof value.createdAt !== "number" || !Number.isFinite(value.createdAt) ||
      value.createdAt > Date.now() || Date.now() - value.createdAt >= lifetime || typeof value.qa !== "boolean") {
      localStorage.removeItem(key);
      return null;
    }
    const entrySource = speechEntrySource(value.entrySource);
    return { createdAt: value.createdAt, qa: value.qa, ...(entrySource ? { entrySource } : {}),
      ...(validPracticeReference(value.attemptId) ? { attemptId: value.attemptId } : {}) };
  } catch { return null; }
}
export function rememberCheckoutIntent(qa: boolean, source?: string, reference?: string | null) {
  const saved = readCheckoutIntent();
  const entrySource = source === undefined ? saved?.entrySource : speechEntrySource(source);
  const attemptId = reference === undefined ? saved?.attemptId : reference;
  try { localStorage.setItem(key, JSON.stringify({ createdAt: Date.now(), qa, ...(entrySource ? { entrySource } : {}),
    ...(validPracticeReference(attemptId) ? { attemptId } : {}) })); } catch { /* Navigation still works without storage. */ }
}
export function clearCheckoutIntent() {
  try { localStorage.removeItem(key); } catch { /* optional UI state */ }
}
export const speechPlanPath = "/speech/account?plan=monthly#speech-plan";
export function speechPlanPathForAttempt(attemptId?: string) {
  return validPracticeReference(attemptId) ? `/speech/account?plan=monthly&attempt=${attemptId}#speech-plan` : speechPlanPath;
}
