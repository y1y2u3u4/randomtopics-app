// Only the existing verified subscription determines paid ad exclusion.
// Practice quota, checkout return parameters and client receipts are not proof.
export type SpeechAdEntitlement = {
  version: "speech-ad-v1";
  audience: "signed_out" | "verified_session";
  adFree: boolean;
};

export function subscriptionAdFree(account: {
  subscription_active: boolean;
  period_start: string | null;
  period_end: string | null;
} | null, now = Date.now()): boolean {
  if (account === null) return false;
  if (typeof account.subscription_active !== "boolean") throw new Error("entitlement_unavailable");
  if (!account.subscription_active) return false;
  const start = Date.parse(account.period_start ?? ""), end = Date.parse(account.period_end ?? "");
  if (!Number.isFinite(start) || !Number.isFinite(end) || start >= end) throw new Error("entitlement_unavailable");
  return start <= now && now < end;
}

export function parseAdEntitlement(value: unknown): SpeechAdEntitlement {
  const result = value as Partial<SpeechAdEntitlement> | null;
  if (!result || result.version !== "speech-ad-v1" ||
    !["signed_out", "verified_session"].includes(result.audience ?? "") ||
    typeof result.adFree !== "boolean" || (result.audience === "signed_out" && result.adFree)) {
    throw new Error("entitlement_unavailable");
  }
  return { version: "speech-ad-v1", audience: result.audience!, adFree: result.adFree };
}
