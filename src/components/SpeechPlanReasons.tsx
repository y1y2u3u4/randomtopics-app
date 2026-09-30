"use client";
import { useEffect, useRef, useState } from "react";
import { SPEECH_PLAN_NEED_EVENTS, type SpeechPlanNeed } from "@/lib/speech/events";
import { observeVisibleContent } from "@/lib/speech/visibleAction";
import { trackSpeech } from "@/lib/speech/telemetry";
import type { SpeechPurpose } from "@/lib/speech/purpose";

const choices: readonly [SpeechPlanNeed, string][] = [
  ["done", "I finished what I came to do"],
  ["value", "I don’t yet see a useful change"],
  ["subscription", "I want more practice, but not a subscription"],
  ["price", "I want more practice, but the price doesn’t fit"],
  ["later", "I want to return another day"],
];
const responses: Record<SpeechPlanNeed, string> = {
  done: "Your feedback stays saved. You can finish here without subscribing.",
  value: "Check the quoted evidence against your answer. You can skip a suggestion that does not help; reviewing your result uses no attempts.",
  subscription: "Your preference is recorded. The current paid option renews monthly; you can still review your saved feedback without subscribing.",
  price: "Your preference is recorded. Reviewing your saved feedback remains free.",
  later: "Your result stays in practice history in this browser. Open that practice when you want to continue.",
};
export default function SpeechPlanReasons({ visible, attempt, contentSource, purpose, onReview }: {
  visible: boolean; attempt: number; contentSource: string;
  purpose?: SpeechPurpose; onReview?: () => void;
}) {
  const prompt = useRef<HTMLParagraphElement>(null);
  const seen = useRef(false);
  const chosen = useRef(false);
  const [answered, setAnswered] = useState<SpeechPlanNeed | null>(null);
  useEffect(() => {
    if (!visible || !prompt.current || seen.current) return;
    return observeVisibleContent(prompt.current, () => {
      seen.current = true;
      trackSpeech("speech_plan_need_view", { content_source: contentSource, attempt, purpose });
    });
  }, [visible, attempt, contentSource, purpose]);
  return <div className="space-y-2 text-xs text-[var(--text-muted)]" aria-label="Optional practice plan feedback">
    <p ref={prompt}>Do you need more practice? Tell us what fits — optional.</p>
    {answered ? <div role="status" className="space-y-2"><p>Thanks for sharing. {responses[answered]}</p>
      {answered === "value" && onReview && <button type="button" className="min-h-11 underline" onClick={onReview}>Review my evidence</button>}
    </div> : <div className="flex flex-wrap gap-2">
      {choices.map(([reason, label]) => <button key={reason} type="button"
        className="min-h-11 rounded-lg border border-white/15 px-3 py-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--neon-cyan)]"
        onClick={() => {
          if (chosen.current) return;
          chosen.current = true;
          setAnswered(reason);
          const props = { content_source: contentSource, attempt, reason, purpose };
          trackSpeech("speech_plan_need_select", props);
          trackSpeech(SPEECH_PLAN_NEED_EVENTS[reason], props);
        }}>{label}</button>)}
    </div>}
  </div>;
}
