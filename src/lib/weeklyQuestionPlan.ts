import type { PremiumPromptItem } from "@/data/premiumTypes";
import { drawUnseen } from "@/lib/topicPool";

export const PLAN_WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export function buildWeeklyQuestionPlan(pool: PremiumPromptItem[], first?: PremiumPromptItem | null) {
  const anchor = first && pool.find((item) => item.id === first.id);
  const remaining = anchor ? pool.filter((item) => item.id !== anchor.id) : pool;
  const { picked } = drawUnseen(remaining, new Set<string>(), (item) => item.id, anchor ? 4 : 5);
  return anchor ? [anchor, ...picked] : picked;
}

export function replaceWeeklyQuestion(plan: PremiumPromptItem[], pool: PremiumPromptItem[], dayIndex: number) {
  if (!plan[dayIndex]) return plan;
  const selected = new Set(plan.map((item) => item.id));
  const { picked } = drawUnseen(pool.filter((item) => !selected.has(item.id)), new Set<string>(), (item) => item.id);
  return picked.length ? plan.map((item, index) => index === dayIndex ? picked[0] : item) : plan;
}

export function weeklyQuestionDayText(item: PremiumPromptItem, dayIndex: number) {
  return [
    `${PLAN_WEEKDAYS[dayIndex]}: ${item.prompt}`,
    ...item.followUps.map((followUp) => `Follow-up: ${followUp}`),
    ...(item.facilitationTip ? [`Facilitator note: ${item.facilitationTip}`] : []),
  ].join("\n");
}

export const WEEKLY_PLAN_INVITATION = "Everyone is welcome to answer or pass. Offer a quiet thinking moment before inviting responses.";

export function weeklyQuestionPlanText(plan: PremiumPromptItem[], title: string, url: string) {
  return [`${title} — ${plan.length}-day plan`, WEEKLY_PLAN_INVITATION, ...plan.map(weeklyQuestionDayText), url].join("\n\n");
}
