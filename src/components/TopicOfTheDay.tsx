"use client";
import { useEffect, useState } from "react";
import type { Topic } from "@/data/types";
import GeneratedResultActions from "@/components/GeneratedResultActions";
import { track } from "@/lib/track";
import { DAY, localDay, topicIndexForDay } from "@/lib/topicOfTheDay";

/**
 * One topic per calendar day, the same for everyone on that date. The server
 * renders the UTC date; the browser switches to the viewer's local date.
 */
export default function TopicOfTheDay({ topics, initialDay }: { topics: Topic[]; initialDay: number }) {
  const [today, setToday] = useState(initialDay);
  const [offset, setOffset] = useState(0);
  /* eslint-disable react-hooks/set-state-in-effect -- switch from the server's UTC date to the viewer's local date */
  useEffect(() => { setToday(localDay(new Date())); }, []);
  /* eslint-enable react-hooks/set-state-in-effect */
  const day = today + offset;
  const topic = topics[topicIndexForDay(day, topics.length)];
  const label = new Date(day * DAY).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", timeZone: "UTC" });
  const move = (by: number) => { const next = Math.min(0, offset + by); setOffset(next); track("topic_of_the_day_browse", { action_surface: "topic_of_the_day", offset: next }); };
  return <section className="glass-card p-4 sm:p-6" aria-label="Topic of the day">
    <p className="text-xs uppercase tracking-wide text-[var(--text-secondary)]">{offset === 0 ? "Today" : "Past topic"} · <time>{label}</time></p>
    <div aria-live="polite" className="min-h-48">
      <h2 className="text-xl sm:text-2xl font-bold mt-2 leading-snug">{topic.text}</h2>
      <p className="mt-2 text-xs text-[var(--text-secondary)] capitalize">{topic.category.replace(/-/g, " ")} · {topic.depth} · good for {topic.modes.join(", ")}</p>
      {topic.talkingPoints.length > 0 && <>
        <h3 className="mt-4 text-sm font-semibold">Talking points</h3>
        <ul className="list-disc pl-5 mt-2 space-y-1 text-sm text-[var(--text-secondary)]">{topic.talkingPoints.map(t => <li key={t}>{t}</li>)}</ul>
      </>}
    </div>
    <div className="mt-4">
      <GeneratedResultActions text={topic.text} copyValue={[topic.text, ...topic.talkingPoints.map(t => `• ${t}`)].join("\n")} shareTitle="Topic of the day" copyLabel="Copy" toolType="topic_of_the_day" contentSource="topic_of_the_day" actionSurface="topic_of_the_day" compact showSavedLink saveTopic={topic} />
    </div>
    <div className="flex flex-wrap items-center gap-3 mt-4 border-t border-white/10 pt-4">
      <button type="button" className="min-h-11 px-4 rounded-xl border border-white/15 text-sm" onClick={() => move(-1)}>← Previous day</button>
      {offset < 0 && <button type="button" className="min-h-11 px-4 rounded-xl border border-white/15 text-sm" onClick={() => move(1)}>Next day →</button>}
      {offset < 0 && <button type="button" className="min-h-11 text-sm underline underline-offset-4 text-[var(--neon-cyan)]" onClick={() => setOffset(0)}>Back to today</button>}
    </div>
    <p className="mt-3 text-xs text-[var(--text-secondary)]">A new topic at midnight your time. Everyone sees the same topic on the same date.</p>
  </section>;
}
