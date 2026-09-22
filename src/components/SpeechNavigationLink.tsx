"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { trackSpeech } from "@/lib/speech/telemetry";
import { observeVisibleContent } from "@/lib/speech/visibleAction";

export default function SpeechNavigationLink({ className, mobile = false, onClick }: {
  className: string; mobile?: boolean; onClick?: () => void;
}) {
  const link = useRef<HTMLAnchorElement>(null);
  const seen = useRef(false);
  useEffect(() => {
    if (!link.current || seen.current) return;
    return observeVisibleContent(link.current, () => {
      seen.current = true;
      trackSpeech("speech_nav_view", { content_source: "navigation", entry_surface: mobile ? "mobile_nav" : "desktop_nav" });
    });
  }, [mobile]);
  return <Link ref={link} href="/speech" className={className} title="Speech topics and AI feedback · two free attempts"
    onClick={() => {
      trackSpeech("speech_nav_click", { content_source: "navigation", entry_surface: mobile ? "mobile_nav" : "desktop_nav" });
      onClick?.();
    }}><span className="mr-1" aria-hidden="true">🎤</span>{mobile ? "Speech topics + AI feedback" : "Speech + AI"}</Link>;
}
