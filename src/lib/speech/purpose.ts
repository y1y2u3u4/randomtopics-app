// Optional, closed choices only. Never store a personal task or free text here.
export const SPEECH_PURPOSES = ["once", "habit", "explore", "unspecified"] as const;
export type SpeechPurpose = typeof SPEECH_PURPOSES[number];
export function speechPurpose(value: unknown): SpeechPurpose {
  return SPEECH_PURPOSES.find(purpose => purpose === value) ?? "unspecified";
}
export function purposeFromUsage(usage: unknown): SpeechPurpose {
  const value = usage as { context?: { purpose?: unknown } } | null;
  return speechPurpose(value?.context?.purpose);
}
export const purposeLabels: Record<SpeechPurpose, string> = {
  once: "Prepare one talk", habit: "Build a speaking habit", explore: "Just try the feedback", unspecified: "No purpose selected",
};
export const purposeGuidance: Record<SpeechPurpose, string> = {
  once: "Rehearse this answer for a talk. Check one specific part, then decide whether you have what you need.",
  habit: "Practice one skill, then test it on a different topic. Each new answer is assessed on its own.",
  explore: "Try one suggestion and compare. You can stop after this round; a subscription is optional.",
  unspecified: "Start whenever you are ready. Choosing a purpose is optional.",
};
export const PURPOSE_STAGES = ["select", "begin", "submit", "feedback", "retry", "next", "return", "offer", "plan", "checkout", "redirect", "paid", "done", "value", "subscription", "price", "later"] as const;
export type PurposeStage = typeof PURPOSE_STAGES[number];
export const purposeEvent = (purpose: SpeechPurpose, stage: PurposeStage) => `speech_goal_${purpose}_${stage}` as const;
export const PURPOSE_EVENTS = SPEECH_PURPOSES.flatMap(purpose => PURPOSE_STAGES.map(stage => purposeEvent(purpose, stage)));
// Select the purpose at each actual action, never from a later choice in storage.
export const PURPOSE_EVENT_STAGES: Readonly<Record<string, PurposeStage>> = {
  speech_purpose_select: "select", speech_first_attempt_start: "begin",
  speech_feedback_v5_request: "submit", speech_round_suggestion_view: "feedback",
  speech_round_retry_click: "retry", speech_round_next_click: "next", speech_history_continue: "return",
  speech_plan_v2_action_view: "offer", speech_plan_hint_action_view: "offer", speech_quota_plan_view: "offer",
  speech_plan_v2_click: "plan", speech_plan_hint_click: "plan", speech_quota_plan_click: "plan",
  speech_checkout_request: "checkout", speech_checkout_redirect: "redirect", speech_payment_confirmed: "paid",
  speech_plan_need_done: "done", speech_plan_need_value: "value", speech_plan_need_subscription: "subscription",
  speech_plan_need_price: "price", speech_plan_need_later: "later",
};
