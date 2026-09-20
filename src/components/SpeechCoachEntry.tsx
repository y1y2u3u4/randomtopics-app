"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import type { Topic } from "@/data/types";
import { trackSpeech } from "@/lib/speech/telemetry";
const Coach = dynamic(() => import("./SpeechCoach"), {
  loading: () => (
    <p role="status" className="p-4">
      Opening your practice…
    </p>
  ),
});
export default function SpeechCoachEntry({
  topics,
  contentSource,
}: {
  topics: Topic[];
  contentSource: string;
}) {
  const [topic, setTopic] = useState<Topic | null>(null);
  const [open, setOpen] = useState(false);
  const entry = useRef<HTMLElement>(null);
  const viewed = useRef(false);
  const opened = useRef(false);
  const landed = useRef(false);
  const enabled = process.env.NEXT_PUBLIC_SPEECH_COACH_ENABLED === "true";
  useEffect(() => {
    if (!enabled || landed.current) return;
    landed.current = true;
    trackSpeech("speech_page_view", { content_source: contentSource });
  }, [enabled, contentSource]);
  useEffect(() => {
    if (!enabled || !topics.length || !entry.current || viewed.current) return;
    const observer = new IntersectionObserver(([item]) => {
      if (!item?.isIntersecting || viewed.current) return;
      viewed.current = true;
      trackSpeech("speech_entry_view", { content_source: contentSource });
      observer.disconnect();
    }, { threshold: 0.5 });
    observer.observe(entry.current);
    return () => observer.disconnect();
  }, [enabled, topics.length, contentSource]);
  if (process.env.NEXT_PUBLIC_SPEECH_COACH_ENABLED !== "true") return null;
  return (
    <section
      ref={entry}
      className="mb-6 rounded-2xl border border-[var(--neon-cyan)]/25 bg-[var(--neon-cyan)]/5 p-4 sm:p-5"
      aria-label="Optional speech feedback"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold">
            Find out what to improve in your next attempt
          </p>
          <p className="mt-1 text-sm text-[var(--text-muted)]">
            One free practice and a retry. No card required.
          </p>
        </div>
        <button
          type="button"
          disabled={!topic && !topics.length}
          aria-expanded={open}
          aria-controls="speech-coach-panel"
          onClick={() => {
            if (!topic) setTopic(topics[0]);
            setOpen(!open);
            if (!open) {
              if (!viewed.current) {
                viewed.current = true;
                trackSpeech("speech_entry_view", { content_source: contentSource });
              }
              trackSpeech(opened.current ? "speech_coach_return" : "speech_coach_open", { content_source: contentSource });
              opened.current = true;
            }
          }}
          className="min-h-11 rounded-xl border border-[var(--neon-cyan)]/40 px-4 py-2 text-sm font-semibold text-[var(--neon-cyan)] disabled:opacity-50"
        >
          {open
            ? "Hide practice"
            : topic
              ? "Return to your practice"
              : "Practice a topic · Get feedback"}
        </button>
      </div>
      {!topics.length && !topic && (
        <p className="mt-2 text-sm text-[var(--text-muted)]">
          Generate a topic above to begin. You can still use the timer below.
        </p>
      )}
      {topic && (
        <div id="speech-coach-panel" hidden={!open}>
          <Coach
            topic={topic}
            topics={topics}
            onTopicChange={setTopic}
            contentSource={contentSource}
            visible={open}
          />
        </div>
      )}
    </section>
  );
}
