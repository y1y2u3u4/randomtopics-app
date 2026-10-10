import { parseAdEntitlement, type SpeechAdEntitlement } from "./adEntitlement";

export type SpeechAdGateState = "pending" | "free" | "paid" | "unavailable" | "retired";

/**
 * A permission gate, not an isolation boundary. A surface must own a real way
 * to dispose its whole ad document before wiring begin() to a third-party SDK.
 * It must also apply regional CMP/privacy/host/placement rules independently.
 */
export function createSpeechAdGate(options: {
  query: (signal: AbortSignal) => Promise<SpeechAdEntitlement>;
  changed: (state: SpeechAdGateState) => void;
  retire: () => void;
  timeoutMs?: number;
}) {
  let state: SpeechAdGateState = "pending";
  let sequence = 0, started = false, disposed = false, retired = false;
  let request: AbortController | undefined;
  let deadline: ReturnType<typeof setTimeout> | undefined;
  const publish = (next: SpeechAdGateState) => { state = next; options.changed(next); };
  const cancel = () => {
    sequence++;
    request?.abort(); request = undefined;
    if (deadline !== undefined) clearTimeout(deadline);
    deadline = undefined;
  };
  const retire = () => {
    if (retired) return;
    retired = true; cancel(); publish("retired"); options.retire();
  };
  return {
    get state() { return state; },
    // Call synchronously before starting any SDK/CMP/ad document. Once only.
    begin() {
      if (disposed || retired || started || state !== "free") return false;
      started = true;
      return true;
    },
    // Re-check immediately before releasing a prepared request. No permission
    // during initial or subsequent pending queries, or after an identity change.
    mayRequest() { return !disposed && !retired && state === "free"; },
    suspend() {
      if (disposed || retired) return;
      cancel(); publish("pending");
    },
    invalidateIdentity() {
      if (disposed || retired) return;
      cancel();
      if (started) retire();
      else publish("pending");
    },
    async refresh() {
      if (disposed || retired) return;
      cancel();
      const ticket = sequence;
      request = new AbortController();
      const signal = request.signal;
      publish("pending");
      const fail = () => {
        if (disposed || retired || ticket !== sequence) return;
        cancel();
        if (started) retire();
        else publish("unavailable");
      };
      deadline = setTimeout(fail, options.timeoutMs ?? 8000);
      try {
        const result = parseAdEntitlement(await options.query(signal));
        if (disposed || retired || ticket !== sequence) return;
        clearTimeout(deadline); deadline = undefined;
        if (result.adFree && started) retire();
        else publish(result.adFree ? "paid" : "free");
      } catch { fail(); }
    },
    dispose() {
      if (disposed) return;
      cancel();
      if (started && !retired) retire();
      disposed = true;
    },
  };
}
