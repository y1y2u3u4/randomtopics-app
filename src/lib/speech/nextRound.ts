import type { SpeechFeedback, SpeechFocus } from "./schema";
import { focusLabels } from "./practiceLabels";
import type { SpeechPurpose } from "./purpose";

// A positive comparison alone is not mastery: the current criterion must also
// be met. Concision has no saved criterion, so never infer transfer readiness.
export function nextRound(feedback: SpeechFeedback, purpose: SpeechPurpose = "unspecified") {
  const drill = feedback.drill;
  const target = drill?.target;
  const transfer = Boolean(target && target !== "concise" &&
    feedback.assessment?.[target]?.status === "met" &&
    feedback.comparison.outcome === "improved");
  const review = drill?.kind === "check" || feedback.comparison.outcome === "insufficient_evidence";
  const why = review ? "Check whether the saved words and quoted evidence are right before deciding what to practice. Reviewing them uses no attempts."
    : purpose === "once" && transfer ? "This goal is present in this answer. If that completes your preparation, you can finish here. A new topic is optional."
    : purpose === "once" ? "Use the next attempt to rehearse this specific part for your talk. You can keep the parts that already work."
    : purpose === "habit" && transfer ? "The next check is whether you can use this skill on a different topic, without copying the sentence frame. One improved answer does not establish a lasting skill."
    : purpose === "habit" ? "Work on this same goal before trying it on a different topic. Your saved answers let you check what actually changed."
    : purpose === "explore" ? "You can finish after this round. Continue only if you want to test this goal in another answer."
    : transfer ? "This goal is present in this answer. A new topic checks whether you can use it in a fresh answer too."
    : drill?.kind === "refine" ? "This is an optional refinement. You can keep your current answer if it already does what you need."
    : "Another attempt checks this one goal. Keep the parts of your answer that already work.";
  return {
    mode: review ? "review" as const : transfer ? "transfer" as const : "retry" as const,
    target,
    why,
    check: review ? undefined : drill?.successCriterion,
    title: review ? "Check the evidence before another attempt" : transfer
      ? `Try ${focusLabels[target!]} on a new topic`
      : target ? `Keep practicing ${focusLabels[target]}` : "Keep working on this change",
    description: review ? "Read the transcript and quoted passages first. You do not need another recording to check what we heard."
      : transfer ? "Use the same skill in a fresh answer. We’ll assess that answer on its own, then you can retry on the new topic."
      : "Stay with this topic and the same goal. Another short attempt is optional; improvement is not guaranteed.",
  };
}

export const retryLabels: Record<SpeechFocus, string> = {
  relevance: "Try a direct answer", point: "Try a clearer point", example: "Try one concrete example",
  ending: "Try a complete ending", concise: "Try a shorter answer",
};

export const transferInstructions: Record<SpeechFocus, string> = {
  relevance: "Answer this new question directly, then give one reason and an example.",
  point: "Make your position clear on this new topic, then support it with one example.",
  example: "Give your view on this new topic and one specific scene that supports it.",
  ending: "Give your view and an example, then finish with a complete thought that connects to your point.",
  concise: "Give a short answer that keeps your point and strongest support.",
};
