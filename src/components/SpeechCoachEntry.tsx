"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import type { Topic } from "@/data/types";
import { track } from "@/lib/track";
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
  if (process.env.NEXT_PUBLIC_SPEECH_COACH_ENABLED !== "true") return null;
  return (
    <section
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
            if (!open)
              track("speech_coach_open", { content_source: contentSource });
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
