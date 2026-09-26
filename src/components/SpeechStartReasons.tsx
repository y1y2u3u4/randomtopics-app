"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SPEECH_START_REASON_EVENTS, type SpeechStartReason } from "@/lib/speech/events";
import { observeVisibleContent } from "@/lib/speech/visibleAction";
import { trackSpeech } from "@/lib/speech/telemetry";

const choices: readonly [SpeechStartReason, string, string][] = [
  ["busy", "I can’t speak right now", "You can use an existing recording above, or return when you have a quiet moment."],
  ["unsure", "I’m not sure what to say", "Try: “My point is … For example … That matters because …” Use your own words; your answer doesn’t need to be perfect."],
  ["privacy", "I’m concerned about audio privacy", "Nothing is uploaded until you choose “Get my feedback”. That sends audio through OpenRouter to a model provider. We save your transcript and feedback privately, not the audio."],
  ["exploring", "I’m just exploring", "You can keep using the topics and timer. Recording is optional."],
];

export default function SpeechStartReasons({ visible, contentSource }: {
  visible: boolean; contentSource: string;
}) {
  const prompt = useRef<HTMLParagraphElement>(null);
  const seen = useRef(false);
  const chosen = useRef(false);
  const [answer, setAnswer] = useState<SpeechStartReason | null>(null);
  useEffect(() => {
    if (!visible || !prompt.current || seen.current) return;
    return observeVisibleContent(prompt.current, () => {
      seen.current = true;
      trackSpeech("speech_start_reason_view", { content_source: contentSource, attempt: 1 });
    });
  }, [visible, contentSource]);
  return <div className="space-y-2 text-sm text-[var(--text-muted)]" aria-label="Optional help before recording">
    <p ref={prompt}>Not ready to record? You can tell us why — optional.</p>
    {answer ? <p role="status" className="leading-relaxed">
      {choices.find(([key]) => key === answer)?.[2]}
      {answer === "privacy" && <> <Link className="underline" href="/privacy">Privacy details</Link></>}
    </p> : <div className="flex flex-wrap gap-2">
      {choices.map(([reason, label]) => <button type="button" key={reason}
        className="min-h-11 rounded-lg border border-white/15 px-3 py-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--neon-cyan)]"
        onClick={() => {
          if (chosen.current) return;
          chosen.current = true;
          setAnswer(reason);
          const props = { content_source: contentSource, attempt: 1, reason };
          trackSpeech("speech_start_reason_select", props);
          trackSpeech(SPEECH_START_REASON_EVENTS[reason], props);
        }}>{label}</button>)}
    </div>}
  </div>;
}
