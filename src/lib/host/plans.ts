// Host Pass plans (approved 2026-10-24). USD only; the 30-day pass is the main offer.
export const HOST_PLANS = {
  pass30: { cents: 499, label: "$4.99", per: "30 days", mode: "payment" as const, name: "RandomTopics Host Pass · 30 days" },
  monthly: { cents: 299, label: "$2.99", per: "month", mode: "subscription" as const, interval: "month" as const, name: "RandomTopics Host Pass · Monthly" },
  yearly: { cents: 1999, label: "$19.99", per: "year", mode: "subscription" as const, interval: "year" as const, name: "RandomTopics Host Pass · Yearly" },
};
export type HostPlan = keyof typeof HOST_PLANS;
export const HOST_PLAN_ORDER: HostPlan[] = ["pass30", "monthly", "yearly"];
export const DEFAULT_HOST_PLAN: HostPlan = "pass30";

export function hostPlan(value: unknown): HostPlan | null {
  return typeof value === "string" && Object.hasOwn(HOST_PLANS, value) ? (value as HostPlan) : null;
}

/** Prompts a free visitor can present before the paywall. */
export const HOST_TRIAL_PROMPTS = 5;
