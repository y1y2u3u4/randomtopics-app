// Subscription products (approved 2026-10-24). USD only, monthly or yearly.
export const SUB_PRODUCTS = {
  teacher: {
    title: "Teacher Warm-ups",
    landing: "/teacher-warm-ups",
    monthly: 300,
    yearly: 2400,
    stripeName: "RandomTopics Teacher Warm-ups — daily bell-ringer by grade, week planner, Google Classroom copy, no ads",
    includes: ["A new warm-up every school day, by grade band", "Plan any day or the whole week", "Copy for Google Classroom in one click", "Fullscreen for the projector", "No ads on randomtopics.app"],
  },
  bot: {
    title: "Team Icebreaker Bot",
    landing: "/slack-icebreaker-bot",
    monthly: 700,
    yearly: 5900,
    stripeName: "RandomTopics Team Icebreaker Bot — daily question posted to your Slack, Discord or Teams channel (per workspace)",
    includes: ["A question posted to your channel on schedule", "Slack, Discord and Microsoft Teams", "Pick the category, days and time", "Up to 3 channels in one workspace", "No ads on randomtopics.app"],
  },
  journal: {
    title: "Daily Writing Journal",
    landing: "/writing-journal",
    monthly: 399,
    yearly: 2999,
    stripeName: "RandomTopics Daily Writing Journal — daily prompt, unlimited saved entries, streaks, monthly PDF export",
    includes: ["A fresh writing prompt every day", "Unlimited saved entries", "Writing streak", "Export any month as PDF", "No ads on randomtopics.app"],
  },
  couples: {
    title: "Couples Daily Question",
    landing: "/couples-daily-question",
    monthly: 499,
    yearly: 2999,
    stripeName: "RandomTopics Couples Daily Question — one question a day for two, answers revealed together (covers both partners)",
    includes: ["One question a day for the two of you", "Answers reveal only when you both answered", "Shared history and streak", "One plan covers both partners", "No ads on randomtopics.app"],
  },
  wheel: {
    title: "Class Roster Wheel Pro",
    landing: "/spin-the-wheel",
    monthly: 299,
    yearly: 1999,
    stripeName: "RandomTopics Class Roster Wheel Pro — saved class lists on any device, no-repeat picks, random groups, pick history",
    includes: ["Save class lists, open them on any device", "No-repeat picks until everyone had a turn", "Random groups in one click", "Pick history", "No ads on randomtopics.app"],
  },
} as const;

export type SubProduct = keyof typeof SUB_PRODUCTS;
export type SubPlan = "monthly" | "yearly";
export const SUB_PRODUCT_LIST = Object.keys(SUB_PRODUCTS) as SubProduct[];
export const SUB_PLANS: SubPlan[] = ["monthly", "yearly"];

export function subProduct(value: unknown): SubProduct | null {
  return typeof value === "string" && Object.hasOwn(SUB_PRODUCTS, value) ? (value as SubProduct) : null;
}
export function subPlan(value: unknown): SubPlan | null {
  return value === "monthly" || value === "yearly" ? value : null;
}
export function subCents(product: SubProduct, plan: SubPlan): number {
  return SUB_PRODUCTS[product][plan];
}
export function usd(cents: number): string {
  return `$${(cents / 100).toFixed(cents % 100 ? 2 : 0)}`;
}
