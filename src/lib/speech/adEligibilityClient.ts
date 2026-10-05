"use client";
import type { SupabaseClient } from "@supabase/supabase-js";
import { speechClient } from "./client";
import { parseAdEntitlement } from "./adEntitlement";
import { createSpeechAdGate, type SpeechAdGateState } from "./adGate";

type Auth = Pick<SupabaseClient["auth"], "getSession" | "onAuthStateChange">;

export async function readSpeechAdEntitlement(auth: Pick<Auth, "getSession">, signal: AbortSignal,
  acceptIdentity?: (identity: string | null) => boolean) {
  const { data: { session }, error } = await auth.getSession();
  if (error || signal.aborted) throw new Error("entitlement_unavailable");
  if (acceptIdentity && !acceptIdentity(session?.user.id ?? null)) throw new Error("identity_changed");
  const result = await fetch("/api/speech/ad-entitlement", {
    method: "GET", cache: "no-store", credentials: "omit", redirect: "error", referrerPolicy: "no-referrer", signal,
    headers: session ? { Authorization: `Bearer ${session.access_token}` } : {},
  });
  if (!result.ok) throw new Error("entitlement_unavailable");
  const entitlement = parseAdEntitlement(await result.json());
  if (entitlement.audience !== (session ? "verified_session" : "signed_out")) throw new Error("entitlement_unavailable");
  return entitlement;
}

/** Private-origin observer. Never send its token, user ID or auth object to an ad origin. */
export function observeSpeechAdEntitlement(options: {
  changed: (state: SpeechAdGateState) => void;
  retire: () => void;
  // Local harness injection; production uses the existing speechClient only.
  auth?: () => Promise<Auth>;
}) {
  let active = true, identity: string | null | undefined;
  let subscription: { unsubscribe(): void } | undefined;
  let deferred: ReturnType<typeof setTimeout> | undefined;
  let auth: Auth | undefined;
  const gate = createSpeechAdGate({
    query: async signal => {
      const currentAuth: Auth = auth ?? await (options.auth ? options.auth() : speechClient().then(client => client.auth));
      auth = currentAuth;
      if (!active || signal.aborted) throw new Error("entitlement_unavailable");
      if (!subscription) {
        subscription = currentAuth.onAuthStateChange((event, session) => {
          const next = session?.user.id ?? null;
          if (identity !== undefined && identity !== next) gate.invalidateIdentity();
          else if (event !== "INITIAL_SESSION") gate.suspend();
          identity = next;
          if (event !== "INITIAL_SESSION") schedule();
        }).data.subscription;
      }
      return readSpeechAdEntitlement(currentAuth, signal, current => {
        if (identity !== undefined && identity !== current) { gate.invalidateIdentity(); schedule(); return false; }
        identity = current;
        return true;
      });
    },
    changed: options.changed,
    retire: options.retire,
  });
  // Supabase callbacks must not synchronously re-enter auth methods.
  function schedule() {
    if (!active) return;
    if (deferred !== undefined) clearTimeout(deferred);
    deferred = setTimeout(() => { deferred = undefined; if (active) void gate.refresh(); }, 0);
  }
  const focus = () => { if (document.visibilityState === "visible") schedule(); };
  const restored = (event: PageTransitionEvent) => {
    if (event.persisted) { gate.invalidateIdentity(); schedule(); }
  };
  window.addEventListener("focus", focus);
  window.addEventListener("pageshow", restored);
  document.addEventListener("visibilitychange", focus);
  // Detect server webhook updates without a new login event. This is bounded
  // polling, not a promise of instantaneous cross-device payment detection.
  const poll = setInterval(focus, 30000);
  schedule();
  return {
    gate,
    dispose() {
      active = false;
      if (deferred !== undefined) clearTimeout(deferred);
      clearInterval(poll); subscription?.unsubscribe();
      window.removeEventListener("focus", focus);
      window.removeEventListener("pageshow", restored);
      document.removeEventListener("visibilitychange", focus);
      gate.dispose();
    },
  };
}
