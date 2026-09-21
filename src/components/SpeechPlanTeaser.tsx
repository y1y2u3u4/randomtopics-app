"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { speechBillingAvailable } from "@/lib/speech/client";
import { speechQaSession, trackSpeech } from "@/lib/speech/telemetry";
import { rememberCheckoutIntent, speechPlanPath } from "@/lib/speech/checkoutIntent";
import { observeVisibleContent } from "@/lib/speech/visibleAction";

export default function SpeechPlanTeaser({ attempt, contentSource, visible }: {
  attempt: number; contentSource: string; visible: boolean;
}) {
  const [available, setAvailable] = useState(false);
  const card = useRef<HTMLElement>(null);
  const seen = useRef(false);
  useEffect(() => {
    let active = true;
    speechBillingAvailable().then(value => { if (active) setAvailable(value); }).catch(() => {});
    return () => { active = false; };
  }, []);
  useEffect(() => {
    if (!available || !visible || !card.current || seen.current) return;
    return observeVisibleContent(card.current, () => {
      seen.current = true;
      trackSpeech("speech_plan_view", { content_source: contentSource, attempt });
    });
  }, [available, visible, contentSource, attempt]);
  if (!available) return null;
  return <section ref={card} aria-label="Keep practicing" className="space-y-3 rounded-xl border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 p-5">
    <h4 className="font-semibold">Keep improving, one answer at a time</h4>
    <p className="text-sm">Practice your point, example and ending. Get a specific suggestion, then compare your next attempt.</p>
    <p className="text-sm"><strong>$12/month</strong> · 40 attempts per billing month, including retries · up to 2 minutes each. Unused attempts do not roll over.</p>
    {attempt === 1 && <p className="text-sm text-[var(--text-muted)]">Your first two recorded attempts are free, including retries.</p>}
    <Link href={speechPlanPath} onClick={() => {
      rememberCheckoutIntent(speechQaSession());
      trackSpeech("speech_plan_click", { content_source: contentSource, attempt });
    }} className="inline-flex min-h-11 items-center rounded-xl bg-[var(--neon-cyan)] px-4 py-2 text-sm font-semibold text-black">
      View the $12/month plan
    </Link>
    <p className="text-xs text-[var(--text-muted)]">Renews monthly until canceled. Review the plan before secure checkout.</p>
  </section>;
}
