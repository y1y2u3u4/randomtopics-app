"use client";
import SpeechPlanLink from "./SpeechPlanLink";
import SpeechPlanReasons from "./SpeechPlanReasons";
import { useEffect, useRef, useState } from "react";
import { speechBillingAvailable } from "@/lib/speech/client";
import { speechQaSession, trackSpeech } from "@/lib/speech/telemetry";
import { rememberCheckoutIntent, speechPlanPath } from "@/lib/speech/checkoutIntent";
import { observeVisibleContent } from "@/lib/speech/visibleAction";

export default function SpeechPlanTeaser({ attempt, contentSource, visible, compact = false, focusLabel }: {
  attempt: number; contentSource: string; visible: boolean; compact?: boolean; focusLabel?: string;
}) {
  const [available, setAvailable] = useState(false);
  const card = useRef<HTMLElement>(null);
  const seen = useRef(new Set<string>());
  useEffect(() => {
    let active = true;
    speechBillingAvailable().then(value => { if (active) setAvailable(value); }).catch(() => {});
    return () => { active = false; };
  }, []);
  useEffect(() => {
    const surface = `${compact ? "hint" : "card"}:${attempt}`;
    if (!available || !visible || !card.current || seen.current.has(surface)) return;
    return observeVisibleContent(card.current, () => {
      seen.current.add(surface);
      trackSpeech(compact ? "speech_plan_hint_view" : "speech_plan_view", { content_source: contentSource, attempt });
      if (!compact) trackSpeech("speech_plan_v2_view", { content_source: contentSource, attempt });
    });
  }, [available, visible, contentSource, attempt, compact]);
  if (!available) return null;
  if (compact) return <section ref={card} aria-label="More speech practice"><p className="text-sm text-[var(--text-muted)]">Your first two recorded attempts are free, including retries. <SpeechPlanLink surface="hint" visible={visible} attempt={attempt} contentSource={contentSource} href={speechPlanPath} onClick={() => {
    rememberCheckoutIntent(speechQaSession(), contentSource);
  }} className="underline">More practice: $12/month</SpeechPlanLink>.</p></section>;
  return <><section ref={card} aria-label="Keep practicing" className="space-y-3 rounded-xl border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 p-5">
    <h4 className="font-semibold">{focusLabel ? `Your next practice: ${focusLabel}` : "Turn your feedback into another practice"}</h4>
    <p className="text-sm">Choose your next topic, record an answer, then retry one suggested change. Compare those two answers to see what changed. Your saved feedback stays available to revisit.</p>
    <p className="text-sm"><strong>$12/month</strong> · 40 attempts per billing month, including retries · up to 2 minutes each. Unused attempts do not roll over.</p>
    {attempt === 1 && <p className="text-sm text-[var(--text-muted)]">Your first two recorded attempts are free, including retries.</p>}
    <SpeechPlanLink surface="card" visible={visible} attempt={attempt} contentSource={contentSource} href={speechPlanPath} onClick={() => {
      rememberCheckoutIntent(speechQaSession(), contentSource);
      trackSpeech("speech_plan_click", { content_source: contentSource, attempt });
    }} className="inline-flex min-h-11 items-center rounded-xl bg-[var(--neon-cyan)] px-4 py-2 text-sm font-semibold text-black">
      View the $12/month plan
    </SpeechPlanLink>
    <p className="text-xs text-[var(--text-muted)]">Renews monthly until canceled. Review the plan before secure checkout.</p>
  </section>
    <SpeechPlanReasons key={attempt} visible={visible} attempt={attempt} contentSource={contentSource} />
  </>;
}
