"use client";
import { useEffect, useRef } from "react";
import { purposeGuidance, purposeLabels, type SpeechPurpose } from "@/lib/speech/purpose";
import { observeVisibleContent } from "@/lib/speech/visibleAction";
import { trackSpeech } from "@/lib/speech/telemetry";

export default function SpeechPurposeChoice({ value, onChange, visible, contentSource }: {
  value: SpeechPurpose; onChange: (value: SpeechPurpose) => void; visible: boolean; contentSource: string;
}) {
  const question = useRef<HTMLLegendElement>(null);
  const seen = useRef(false);
  useEffect(() => {
    if (!visible || !question.current || seen.current) return;
    return observeVisibleContent(question.current, () => {
      seen.current = true;
      trackSpeech("speech_purpose_view", { content_source: contentSource });
    });
  }, [visible, contentSource]);
  return <fieldset className="mb-4 space-y-2 text-sm">
    <legend ref={question} className="font-semibold">What brings you here? <span className="font-normal text-[var(--text-muted)]">Optional</span></legend>
    <div className="flex flex-wrap gap-2">
      {(["once", "habit", "explore"] as const).map(purpose => <button key={purpose} type="button" aria-pressed={value === purpose}
        className={`min-h-11 rounded-lg border px-3 py-2 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--neon-cyan)] ${value === purpose ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/10" : "border-white/15"}`}
        onClick={() => {
          const next = value === purpose ? "unspecified" : purpose;
          onChange(next);
          trackSpeech("speech_purpose_select", { content_source: contentSource, purpose: next });
        }}>{purposeLabels[purpose]}</button>)}
    </div>
    <p aria-live="polite" className="text-xs leading-relaxed text-[var(--text-muted)]">{purposeGuidance[value]}</p>
  </fieldset>;
}
