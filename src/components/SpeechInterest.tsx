"use client";
import { useEffect, useRef, useState } from "react";
import { trackSpeech } from "@/lib/speech/telemetry";

export default function SpeechInterest({ attempt, contentSource, visible }: {
  attempt: number; contentSource: string; visible: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useRef(false);
  const [choice, setChoice] = useState<string | null>(null);
  useEffect(() => {
    if (!visible || seen.current || !ref.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || seen.current) return;
      seen.current = true;
      trackSpeech("speech_offer_view", { content_source: contentSource, attempt });
      observer.disconnect();
    }, { threshold: 0.5 });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [attempt, contentSource, visible]);
  return <div ref={ref} className="rounded-xl border border-white/10 p-4 space-y-3">
    <p className="font-semibold">Would you consider paying for more practice feedback?</p>
    <p className="text-sm text-[var(--text-muted)]">Help shape future practice packs. This is a question, not a purchase. No charge or signup.</p>
    {choice ? <p role="status" className="text-sm">Thanks — your answer helps us decide what to build next.</p> :
      <div className="flex flex-wrap gap-2">{([
        ["yes", "Yes, if it helps me improve"], ["unsure", "Not sure yet"], ["no", "I only want free practice"],
      ] as const).map(([value, label]) => <button key={value} type="button"
        className="min-h-11 rounded-xl border border-white/20 px-4 py-2 text-sm"
        onClick={() => {
          if (!seen.current) {
            seen.current = true;
            trackSpeech("speech_offer_view", { content_source: contentSource, attempt });
          }
          setChoice(value);
          trackSpeech(`speech_paid_interest_${value}`, { content_source: contentSource, attempt });
        }}>
        {label}
      </button>)}</div>}
  </div>;
}
