"use client";
import { useEffect, useRef, useState } from "react";
import { SPEECH_PLAN_REASON_EVENTS, type SpeechPlanReason } from "@/lib/speech/events";
import { observeVisibleContent } from "@/lib/speech/visibleAction";
import { trackSpeech } from "@/lib/speech/telemetry";

const choices: readonly [SpeechPlanReason, string][] = [
  ["once", "I only needed this practice"],
  ["value", "I need to see more value"],
  ["subscription", "I don’t want a subscription"],
  ["price", "The price doesn’t fit"],
  ["later", "I may practice later"],
];
export default function SpeechPlanReasons({ visible, attempt, contentSource }: {
  visible: boolean; attempt: number; contentSource: string;
}) {
  const prompt = useRef<HTMLParagraphElement>(null);
  const seen = useRef(false);
  const chosen = useRef(false);
  const [answered, setAnswered] = useState(false);
  useEffect(() => {
    if (!visible || !prompt.current || seen.current) return;
    return observeVisibleContent(prompt.current, () => {
      seen.current = true;
      trackSpeech("speech_plan_reason_view", { content_source: contentSource, attempt });
    });
  }, [visible, attempt, contentSource]);
  return <div className="space-y-2 text-xs text-[var(--text-muted)]" aria-label="Optional practice plan feedback">
    <p ref={prompt}>Not continuing today? You can tell us why — optional.</p>
    {answered ? <p role="status">Thanks for sharing.</p> : <div className="flex flex-wrap gap-2">
      {choices.map(([reason, label]) => <button key={reason} type="button"
        className="min-h-11 rounded-lg border border-white/15 px-3 py-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--neon-cyan)]"
        onClick={() => {
          if (chosen.current) return;
          chosen.current = true;
          setAnswered(true);
          const props = { content_source: contentSource, attempt, reason };
          trackSpeech("speech_plan_reason_select", props);
          trackSpeech(SPEECH_PLAN_REASON_EVENTS[reason], props);
        }}>{label}</button>)}
    </div>}
  </div>;
}
