"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Topic } from "@/data/types";
import { observeVisibleContent } from "@/lib/speech/visibleAction";
import { trackSpeech } from "@/lib/speech/telemetry";
import PracticeSelectedTopic from "./PracticeSelectedTopic";

/** After a timer round on a page without its own coach: carry the topic to /speech. */
export default function SpeechTimerInvite({ topic, contentSource }: { topic: Topic | null; contentSource: string }) {
  const box = useRef<HTMLDivElement>(null);
  const seen = useRef(false);
  useEffect(() => {
    if (!box.current || seen.current) return;
    return observeVisibleContent(box.current, () => {
      seen.current = true;
      trackSpeech("speech_timer_invite_view", { content_source: contentSource });
    });
  }, [contentSource]);
  const click = () => trackSpeech("speech_timer_invite_click", { content_source: contentSource });
  const action = "min-h-11 w-full rounded-xl bg-[var(--neon-cyan)] px-4 py-3 text-center font-semibold text-black";
  return <div ref={box} className="mb-5 space-y-3 rounded-xl border border-[var(--neon-cyan)]/30 p-4 text-sm" aria-label="AI feedback on your answer">
    <h4 className="font-semibold">Want feedback on that answer?</h4>
    <p className="text-xs leading-relaxed text-[var(--text-muted)]">This timer doesn’t record you. Say it once more — or type it — and the AI coach gives you one clear change for your point, example or ending.</p>
    {topic ? <div onClickCapture={click}>
      <PracticeSelectedTopic topic={topic} source="timer" className={action} label="Get free AI feedback on this topic →" />
    </div> : <Link prefetch={false} href="/speech" onClick={click} className={`${action} block`}>Get free AI feedback →</Link>}
    <p className="text-xs text-[var(--text-muted)]">Two free attempts, no sign-up.</p>
  </div>;
}
