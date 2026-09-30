"use client";
import SpeechPlanLink from "./SpeechPlanLink";
import SpeechPlanReasons from "./SpeechPlanReasons";
import { useEffect, useRef, useState } from "react";
import { speechBillingAvailable } from "@/lib/speech/client";
import { speechQaSession, trackSpeech } from "@/lib/speech/telemetry";
import { rememberCheckoutIntent, speechPlanPathForAttempt } from "@/lib/speech/checkoutIntent";
import { observeVisibleContent } from "@/lib/speech/visibleAction";
import { purposeLabels, type SpeechPurpose } from "@/lib/speech/purpose";

export default function SpeechPlanTeaser({ attempt, contentSource, visible, compact = false, focusLabel, attemptId, purpose, nextCheck, onReview }: {
  attempt: number; contentSource: string; visible: boolean; compact?: boolean; focusLabel?: string; attemptId?: string;
  purpose?: SpeechPurpose; nextCheck?: string; onReview?: () => void;
}) {
  const speechPlanPath = speechPlanPathForAttempt(attemptId);
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
      trackSpeech(compact ? "speech_plan_hint_view" : "speech_plan_view", { content_source: contentSource, attempt, purpose });
      if (!compact) trackSpeech("speech_plan_v2_view", { content_source: contentSource, attempt, purpose });
    });
  }, [available, visible, contentSource, attempt, compact, purpose]);
  if (!available) return null;
  if (compact) return <section ref={card} aria-label="More speech practice"><p className="text-sm text-[var(--text-muted)]">Your first two recorded attempts are free, including retries. <SpeechPlanLink surface="hint" purpose={purpose} visible={visible} attempt={attempt} contentSource={contentSource} href={speechPlanPath} onClick={() => {
    rememberCheckoutIntent(speechQaSession(), contentSource, attemptId ?? null, purpose);
  }} className="underline">More practice: $12/month</SpeechPlanLink>.</p></section>;
  return <><section ref={card} aria-label="Keep practicing" className="space-y-3 rounded-xl border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 p-5">
    {purpose && purpose !== "unspecified" && <p className="text-xs text-[var(--text-muted)]">Your purpose: {purposeLabels[purpose]}</p>}
    <h4 className="font-semibold">{focusLabel ? `Your next practice: ${focusLabel}` : "Turn your feedback into another practice"}</h4>
    {nextCheck && <p className="text-sm"><strong>Your next recording would check: </strong>{nextCheck}</p>}
    <p className="text-sm">Continue from your saved goal in practice history. Record, try one suggested change, and compare your two answers. Each recording uses one attempt.</p>
    {purpose === "once" && <p className="text-sm">If this one practice was enough, your feedback stays available without subscribing. This plan is for additional recorded practice.</p>}
    {purpose === "habit" && <p className="text-sm">Work on one goal across different topics and return to your saved answers to review the evidence.</p>}
    <p className="text-sm"><strong>$12/month</strong> · 40 attempts per billing month, including retries · up to 2 minutes each. Unused attempts do not roll over.</p>
    {attempt === 1 && <p className="text-sm text-[var(--text-muted)]">Your first two recorded attempts are free, including retries.</p>}
    <SpeechPlanLink surface="card" purpose={purpose} visible={visible} attempt={attempt} contentSource={contentSource} href={speechPlanPath} onClick={() => {
      rememberCheckoutIntent(speechQaSession(), contentSource, attemptId ?? null, purpose);
      trackSpeech("speech_plan_click", { content_source: contentSource, attempt, purpose });
    }} className="inline-flex min-h-11 items-center rounded-xl bg-[var(--neon-cyan)] px-4 py-2 text-sm font-semibold text-black">
      View the $12/month plan
    </SpeechPlanLink>
    <p className="text-xs text-[var(--text-muted)]">Renews monthly until canceled. Review the plan before secure checkout.</p>
  </section>
    <SpeechPlanReasons key={attempt} visible={visible} attempt={attempt} contentSource={contentSource} purpose={purpose} onReview={onReview} />
  </>;
}
