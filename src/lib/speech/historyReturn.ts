import { validPracticeReference } from "./checkoutIntent";
// Navigation only; owned history is always revalidated by the API.
const key = "rt_speech_history_return_v1";
const lifetime = 24 * 60 * 60 * 1000;
type HistoryReturn = { attemptId: string; createdAt: number; qa: boolean };
export function clearHistoryReturn() {
  try { localStorage.removeItem(key); } catch { /* Optional navigation state. */ }
}
export function readHistoryReturn(): HistoryReturn | null {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "null");
    if (!value || !validPracticeReference(value.attemptId) || typeof value.qa !== "boolean" ||
      typeof value.createdAt !== "number" || !Number.isFinite(value.createdAt) ||
      value.createdAt > Date.now() || Date.now() - value.createdAt >= lifetime) {
      clearHistoryReturn(); return null;
    }
    return { attemptId: value.attemptId, createdAt: value.createdAt, qa: value.qa };
  } catch { return null; }
}
export function rememberHistoryReturn(attemptId: string, qa: boolean) {
  if (!validPracticeReference(attemptId)) return;
  try { localStorage.setItem(key, JSON.stringify({ attemptId, qa, createdAt: Date.now() })); } catch { /* Explicit URL still works. */ }
}
