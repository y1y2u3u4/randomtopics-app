"use client";
import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";
import QotdDailyRitual from "@/components/QotdDailyRitual";
import { QOTD_QUESTIONS, qotdIndexForCategory, type QotdCategory } from "@/data/questionOfTheDay";

// Today's question-of-the-day vote, embedded on inner pages. Same daily
// question, votes and streak as /question-of-the-day; the index is computed in
// the visitor's own timezone after mount so it matches the hub.
const subscribe = () => () => {};
const localDay = () => { const d = new Date(); return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; };
export default function QotdVoteCard({ category = "all", source }: { category?: QotdCategory | "all"; source: string }) {
  const dayKey = useSyncExternalStore(subscribe, localDay, () => null);
  const state = useMemo(() => {
    if (!dayKey) return null;
    const [y, m, d] = dayKey.split("-").map(Number);
    const date = new Date(y, m, d, 12);
    return { idx: qotdIndexForCategory(date, category), dateLabel: date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" }) };
  }, [dayKey, category]);
  const question = state ? QOTD_QUESTIONS[state.idx]?.q : null;
  return (
    <section aria-labelledby="daily-vote" className="max-w-3xl mx-auto px-4 sm:px-6 pt-10" data-qotd-vote-card>
      <div className="glass-card p-6 sm:p-8">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--neon-cyan)]">Today&apos;s daily vote{state ? ` · ${state.dateLabel}` : ""}</p>
        <h2 id="daily-vote" className="section-heading text-xl sm:text-2xl mt-2 text-[var(--text-primary)]">{question ?? "Loading today's question…"}</h2>
        <p className="text-sm text-[var(--text-muted)] mt-2">One new question every day. Vote, see how everyone answered and keep your streak going.</p>
        {state && question ? <QotdDailyRitual key={state.idx} questionIndex={state.idx} question={question} dateLabel={state.dateLabel} source={source} /> : null}
        <p className="text-sm mt-4">
          <Link href="/question-of-the-day" className="text-[var(--neon-cyan)] hover:underline">See every question of the day →</Link>
        </p>
      </div>
    </section>
  );
}
