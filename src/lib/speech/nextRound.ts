import type { SpeechFeedback, SpeechFocus } from "./schema";
import { focusLabels } from "./practiceLabels";

// A positive comparison alone is not mastery: the current criterion must also
// be met. Concision has no saved criterion, so never infer transfer readiness.
export function nextRound(feedback: SpeechFeedback) {
  const drill = feedback.drill;
  const target = drill?.target;
  const transfer = Boolean(target && target !== "concise" &&
    feedback.assessment?.[target]?.status === "met" &&
    feedback.comparison.outcome === "improved");
  const review = drill?.kind === "check" || feedback.comparison.outcome === "insufficient_evidence";
  return {
    mode: review ? "review" as const : transfer ? "transfer" as const : "retry" as const,
    target,
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
