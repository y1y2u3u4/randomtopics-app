"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { SpeechFeedback } from "@/lib/speech/schema";
import { nextRound } from "@/lib/speech/nextRound";
import { observeVisibleContent } from "@/lib/speech/visibleAction";
import { trackSpeech } from "@/lib/speech/telemetry";
import { purposeLabels, speechPurpose, type SpeechPurpose } from "@/lib/speech/purpose";

// Render only an attempt returned by authenticated, ownership-filtered history.
export default function SpeechCheckoutContext({ attempt }: { attempt: { id: string; feedback: SpeechFeedback; purpose?: SpeechPurpose } }) {
  const title = useRef<HTMLHeadingElement>(null);
  const seen = useRef(false);
  const purpose = speechPurpose(attempt.purpose);
  const next = nextRound(attempt.feedback, purpose);
  useEffect(() => {
    if (!title.current || seen.current) return;
    return observeVisibleContent(title.current, () => {
      seen.current = true;
      trackSpeech("speech_checkout_context_view", { content_source: "speech_account", outcome: next.mode });
    });
  }, [next.mode]);
  const outcome = attempt.feedback.comparison.outcome;
  return <aside data-clarity-mask="true" className="space-y-2 rounded-xl border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 p-4" aria-label="Your saved practice goal">
    <p className="text-xs font-semibold uppercase tracking-wide">{purpose === "unspecified" ? "Continue your saved goal" : purposeLabels[purpose]}</p>
    <h3 ref={title} className="font-semibold">{next.title}</h3>
    <p className="text-sm">{outcome === "improved" ? "Your last feedback identified a change that helped."
      : outcome === "similar" ? "Your last comparison found about the same result so far."
      : outcome === "mixed" ? "Your last comparison found progress with a trade-off."
      : outcome === "insufficient_evidence" ? "Your last feedback did not have enough evidence to compare."
      : "Your first feedback is saved."} {next.mode === "transfer" ? "Use this skill on a fresh topic; your next answer is assessed on its own."
        : next.mode === "retry" ? "Stay with this topic and work on this one goal. Improvement is not guaranteed." : next.description}</p>
    <p className="text-sm">{next.why}</p>
    {next.check && <p className="text-sm"><strong>Next check: </strong>{next.check}</p>}
    <Link href={`/speech/practice?attempt=${attempt.id}&next=1`} className="inline-block min-h-11 py-2 text-sm underline">
      {next.mode === "review" ? "Review my saved evidence" : "Preview this practice"}
    </Link>
  </aside>;
}
