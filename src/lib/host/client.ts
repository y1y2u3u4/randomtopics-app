"use client";
import { PracticeRequestError, speechClient } from "@/lib/speech/client";
import { track } from "@/lib/track";
import type { HostPlan } from "./plans";

export type HostEvent =
  | "host_entry_view" | "host_entry_click" | "host_trial_start" | "host_trial_end" | "host_paywall_view"
  | "host_plan_select" | "host_checkout_start" | "host_purchase" | "host_session_start" | "timer_set" | "no_repeat_reset";

export function trackHost(event: HostEvent, params: { generator: string; plan?: HostPlan; seconds?: number; value?: number }) {
  track(event, { ...params, tool_type: "host_mode", ...(event === "host_purchase" && params.value ? { currency: "USD" } : {}) });
}

/** Session token; a guest session is created only for checkout. */
async function session(create: boolean) {
  const auth = (await speechClient()).auth;
  const { data } = await auth.getSession();
  if (data.session || !create) return data.session;
  const result = await auth.signInAnonymously();
  if (result.error || !result.data.session) throw new PracticeRequestError("We could not start a secure checkout. Please try again.", false, 503);
  return result.data.session;
}

async function hostFetch(path: string, body: unknown, create = false) {
  const current = await session(create);
  if (!current) return null;
  const res = await fetch(`/api/host/${path}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${current.access_token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const result = await res.json().catch(() => ({}));
  if (!res.ok) throw new PracticeRequestError(result.error || "Please try again.", false, res.status);
  return result;
}

export interface HostStatus { active: boolean; plan: HostPlan | null; expiresAt: string | null; granted: HostPlan[] }

/** Pass state for visitors who already have a session; null for everyone else (no account is created). */
export async function hostStatus(sessionId?: string): Promise<HostStatus | null> {
  try {
    return (await hostFetch("status", sessionId ? { sessionId } : {})) as HostStatus | null;
  } catch {
    return null;
  }
}

export async function startHostCheckout(plan: HostPlan, generator: string) {
  trackHost("host_checkout_start", { generator, plan });
  const result = await hostFetch("checkout", { plan, returnPath: window.location.pathname }, true);
  if (!result?.url) throw new PracticeRequestError("Checkout is temporarily unavailable. Please try again.", false, 503);
  window.location.assign(result.url);
}
