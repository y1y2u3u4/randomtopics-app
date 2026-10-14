"use client";
import SpeechPlanReasons from "./SpeechPlanReasons";
import SpeechPackOffer from "./SpeechPackOffer";
import { useEffect, useRef, useState } from "react";
import { speechBillingAvailable } from "@/lib/speech/client";
import { trackSpeech } from "@/lib/speech/telemetry";
import { observeVisibleContent } from "@/lib/speech/visibleAction";
import { purposeLabels, type SpeechPurpose } from "@/lib/speech/purpose";

export default function SpeechPlanTeaser({ attempt, contentSource, visible, compact = false, purpose, nextCheck, onReview }: {
  attempt: number; contentSource: string; visible: boolean; compact?: boolean; focusLabel?: string; attemptId?: string;
  purpose?: SpeechPurpose; nextCheck?: string; onReview?: () => void;
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
      trackSpeech(compact ? "speech_plan_hint_view" : "speech_plan_view", { content_source: contentSource, attempt, purpose });
      if (!compact) {
        trackSpeech("speech_plan_v2_view", { content_source: contentSource, attempt, purpose });
        // The $12 offer is visible under the feedback card.
        trackSpeech("speech_checkout_offer_view", { content_source: contentSource, attempt, purpose });
      }
    });
  }, [available, visible, contentSource, attempt, compact, purpose]);
  if (!available) return null;
  if (compact) return <section ref={card} aria-label="More speech practice"><p className="text-sm text-[var(--text-muted)]">Your first two attempts are free (spoken or typed), including retries. Need more? 5 AI feedback rounds for $2.99 — one-time, no subscription.</p></section>;
  return <><section ref={card} aria-label="Keep practicing" className="space-y-3 rounded-xl border border-[var(--neon-cyan)]/30 bg-[var(--neon-cyan)]/5 p-5">
    {purpose && purpose !== "unspecified" && <p className="text-xs text-[var(--text-muted)]">Your purpose: {purposeLabels[purpose]}</p>}
    {nextCheck && <p className="text-sm"><strong>Your next recording would check: </strong>{nextCheck}</p>}
    {attempt === 1 && <p className="text-sm text-[var(--text-muted)]">Your first two attempts are free (spoken or typed), including retries.</p>}
    <SpeechPackOffer contentSource={contentSource} attempt={attempt} />
  </section>
    <SpeechPlanReasons key={attempt} visible={visible} attempt={attempt} contentSource={contentSource} purpose={purpose} onReview={onReview} />
  </>;
}
