"use client";
import { PracticeRequestError, speechClient } from "@/lib/speech/client";
import { track } from "@/lib/track";
import { subCents, type SubPlan, type SubProduct } from "./products";

export type SubStep =
  | "entry_view" | "entry_click" | "landing_view" | "trial_start" | "paywall_view" | "plan_select" | "checkout_start" | "purchase";
export type SubUsage = "teacher_present" | "bot_message_sent" | "journal_entry_saved" | "couples_reveal" | "wheel_list_saved";

/** Funnel event: {product}_{step} in GA4 and Umami (localhost and ?usage_qa=1 are excluded by track()). */
export function trackSub(product: SubProduct, step: SubStep, params: { plan?: SubPlan; value?: number; entry_page?: string; locale?: string } = {}) {
  track(`${product}_${step}`, { ...params, product, tool_type: `sub_${product}`, ...(step === "purchase" && params.value ? { currency: "USD" } : {}) });
}
export function trackSubUsage(event: SubUsage, product: SubProduct, params: Record<string, string | number> = {}) {
  track(event, { ...params, product, tool_type: `sub_${product}` });
}

/** Session token. A guest (anonymous) session is created only when `create` is true. */
export async function subSession(create: boolean) {
  const auth = (await speechClient()).auth;
  const { data } = await auth.getSession();
  if (data.session || !create) return data.session;
  const result = await auth.signInAnonymously();
  if (result.error || !result.data.session) throw new PracticeRequestError("We could not start a secure session. Please try again.", false, 503);
  return result.data.session;
}

/** Calls /api/sub/{path} with the session token. Returns null when there is no session and `create` is false. */
export async function subFetch<T = Record<string, unknown>>(path: string, body: unknown = {}, create = false): Promise<T | null> {
  const current = await subSession(create);
  if (!current) return null;
  const res = await fetch(`/api/sub/${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${current.access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new PracticeRequestError(result.error || "Please try again.", false, res.status);
  return result as T;
}

export interface SubStatus {
  access: Record<SubProduct, boolean>;
  granted: { product: SubProduct; plan: SubPlan; value: number }[];
  guest: boolean;
  email: string | null;
}

/** Plan state for visitors who already have a session; null for everyone else (no account is created). */
export async function subStatus(sessionId?: string): Promise<SubStatus | null> {
  try {
    return await subFetch<SubStatus>("status", sessionId ? { sessionId } : {});
  } catch {
    return null;
  }
}

export async function startSubCheckout(product: SubProduct, plan: SubPlan) {
  trackSub(product, "checkout_start", { plan, value: subCents(product, plan) / 100 });
  const result = await subFetch<{ url?: string }>("checkout", { product, plan, returnPath: window.location.pathname }, true);
  if (!result?.url) throw new PracticeRequestError("Checkout is temporarily unavailable. Please try again.", false, 503);
  window.location.assign(result.url);
}

/** Reads and strips ?sub_session= from the URL (the return from Stripe Checkout). */
export function takeReturnSession(): string | null {
  const params = new URLSearchParams(window.location.search);
  const session = params.get("sub_session");
  if (!session) return null;
  params.delete("sub_session");
  const rest = params.toString();
  window.history.replaceState(null, "", `${window.location.pathname}${rest ? `?${rest}` : ""}${window.location.hash}`);
  return session;
}

export function readLocal<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw === null ? fallback : (JSON.parse(raw) as T); } catch { return fallback; }
}
export function writeLocal(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage may be blocked */ }
}
