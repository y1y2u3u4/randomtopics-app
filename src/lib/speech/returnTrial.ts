export type SpeechAllowance = {
  remaining: number; included: number; paid: boolean;
  returnTrial?: { availableAt: string; state: "scheduled" | "available" | "used" };
};

export function returnTrialState(availableAt: unknown, used: number, paid: boolean, now = Date.now()): SpeechAllowance["returnTrial"] {
  if (paid || typeof availableAt !== "string") return undefined;
  const at = Date.parse(availableAt);
  if (!Number.isFinite(at)) return undefined;
  return { availableAt, state: used >= 3 ? "used" : at > now ? "scheduled" : "available" };
}
