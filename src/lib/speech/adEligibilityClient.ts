"use client";
import type { SupabaseClient } from "@supabase/supabase-js";
import { speechClient } from "./client";
import { parseAdEntitlement } from "./adEntitlement";
import { createSpeechAdGate, type SpeechAdGateState } from "./adGate";

type Auth = Pick<SupabaseClient["auth"], "getSession" | "onAuthStateChange">;

export async function readSpeechAdEntitlement(auth: Pick<Auth, "getSession">, signal: AbortSignal,
  acceptIdentity?: (identity: string | null) => boolean) {
  let identity: string | null | undefined;
  for (let attempt = 0; attempt < 2; attempt++) {
    if (signal.aborted) throw new Error("entitlement_unavailable");
    // Recheck before a retry; never send an earlier identity's credential or
    // reinterpret a changed/failed session as a signed-out visitor.
    const { data: { session }, error } = await auth.getSession();
    if (error || signal.aborted) throw new Error("entitlement_unavailable");
    const current = session?.user.id ?? null;
    if ((identity !== undefined && identity !== current) || (acceptIdentity && !acceptIdentity(current))) {
      throw new Error("identity_changed");
    }
    identity = current;
    const request = new AbortController();
    const abort = () => request.abort(signal.reason);
    signal.addEventListener("abort", abort, { once: true });
    if (signal.aborted) abort();
    // Both attempts remain inside the gate's original eight-second signal.
    // A shorter transport deadline leaves room for one recovery attempt.
    const deadline = setTimeout(() => request.abort(), 3500);
    try {
      if (signal.aborted) throw new Error("entitlement_unavailable");
      let result: Response;
      try {
        result = await fetch("/api/speech/ad-entitlement", {
          method: "GET", cache: "no-store", credentials: "omit", redirect: "error", referrerPolicy: "no-referrer", signal: request.signal,
          headers: session ? { Authorization: `Bearer ${session.access_token}` } : {},
        });
      } catch (error) {
        // Classify only fetch transport errors. Body decoding, schema and
        // audience failures below must never be reinterpreted as retryable.
        if (attempt === 0 && !signal.aborted && (request.signal.aborted || error instanceof TypeError)) continue;
        throw error;
      }
      if (signal.aborted || request.signal.aborted) throw new Error("entitlement_unavailable");
      if (!result.ok) {
        if (attempt === 0 && [500, 502, 503, 504].includes(result.status)) {
          request.abort();
          continue;
        }
        throw new Error("entitlement_unavailable");
      }
      const value: unknown = await result.json();
      if (signal.aborted || request.signal.aborted) throw new Error("entitlement_unavailable");
      const entitlement = parseAdEntitlement(value);
      if (entitlement.audience !== (session ? "verified_session" : "signed_out")) throw new Error("entitlement_unavailable");
      return entitlement;
    } catch {
      throw new Error("entitlement_unavailable");
    } finally {
      clearTimeout(deadline);
      signal.removeEventListener("abort", abort);
      request.abort();
    }
  }
  throw new Error("entitlement_unavailable");
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
