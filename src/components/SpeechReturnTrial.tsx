"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { SpeechAllowance } from "@/lib/speech/returnTrial";
import { observeVisibleContent } from "@/lib/speech/visibleAction";
import { trackSpeech } from "@/lib/speech/telemetry";
import type { SpeechPurpose } from "@/lib/speech/purpose";

export default function SpeechReturnTrial({ allowance, attemptId, visible, purpose, contentSource }: {
  allowance?: SpeechAllowance; attemptId: string; visible: boolean; purpose?: SpeechPurpose; contentSource: string;
}) {
  const trial = allowance?.returnTrial;
  const heading = useRef<HTMLParagraphElement>(null), seen = useRef(new Set<string>());
  useEffect(() => {
    if (!visible || !trial || trial.state === "used" || !heading.current || seen.current.has(trial.state)) return;
    return observeVisibleContent(heading.current, () => {
      seen.current.add(trial.state);
      trackSpeech(trial.state === "available" ? "speech_return_trial_available_view" : "speech_return_trial_offer_view", { content_source: contentSource, purpose });
    });
  }, [visible, trial, contentSource, purpose]);
  if (!trial || trial.state === "used") return null;
  return <aside aria-label="Your return practice" className="space-y-2 rounded-xl border border-[var(--neon-cyan)]/30 p-4 text-sm">
    <p ref={heading} className="font-semibold">{trial.state === "available" ? "Your return practice is ready — one recording free" : "Come back for one more recording, free"}</p>
    <p>{trial.state === "available" ? "Use your saved goal to check what you remember. This is one extra recording, available once per account." : `After ${new Date(trial.availableAt).toLocaleString()}, this account can use one extra recording to revisit this goal. No subscription needed.`}</p>
    <p>Use the same browser, or link your email in practice history to return on another device. No reminder email is sent.</p>
    <Link className="inline-flex min-h-11 items-center underline" href={`/speech/practice?attempt=${attemptId}&next=1`}
      onClick={() => trackSpeech("speech_return_trial_open", { content_source: contentSource, purpose, outcome: trial.state })}>
      {trial.state === "available" ? "Open my return practice" : "Open my saved practice"}
    </Link>
  </aside>;
}
