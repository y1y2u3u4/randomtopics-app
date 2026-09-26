"use client";
import Link from "next/link";
import { useEffect, useRef, type ReactNode } from "react";
import { observeVisibleContent } from "@/lib/speech/visibleAction";
import { trackSpeech } from "@/lib/speech/telemetry";

const events = {
  card: ["speech_plan_v2_action_view", "speech_plan_v2_click"],
  hint: ["speech_plan_hint_action_view", "speech_plan_hint_click"],
  quota: ["speech_quota_plan_view", "speech_quota_plan_click"],
} as const;

// Observe the actionable link itself. Card visibility never substitutes for it,
// and a fast click never manufactures an impression.
export default function SpeechPlanLink({ surface, visible, attempt, contentSource, href, className, children, onClick }: {
  surface: keyof typeof events; visible: boolean; attempt: number; contentSource: string;
  href: string; className: string; children: ReactNode; onClick?: () => void;
}) {
  const link = useRef<HTMLAnchorElement>(null);
  const seen = useRef(new Set<string>());
  useEffect(() => {
    const key = `${surface}:${attempt}`;
    if (!visible || !link.current || seen.current.has(key)) return;
    return observeVisibleContent(link.current, () => {
      seen.current.add(key);
      trackSpeech(events[surface][0], { content_source: contentSource, attempt });
    });
  }, [visible, surface, attempt, contentSource]);
  return <Link ref={link} href={href} className={className} onClick={() => {
    trackSpeech(events[surface][1], { content_source: contentSource, attempt });
    onClick?.();
  }}>{children}</Link>;
}
