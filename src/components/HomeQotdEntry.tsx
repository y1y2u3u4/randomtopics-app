"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { QOTD_QUESTIONS, qotdIndexForDate } from "@/data/questionOfTheDay";
import { track } from "@/lib/track";

// Home "today" entry for the question-of-the-day ritual. The home page is
// static, so the question is picked for the visitor's local date after mount;
// the box keeps a fixed height so nothing shifts when it fills in.
export default function HomeQotdEntry() {
  const [today, setToday] = useState<{ q: string; streak: number; answered: boolean } | null>(null);
  useEffect(() => {
    const id = window.setTimeout(() => {
      const now = new Date();
      const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const y = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
      const yesterday = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, "0")}-${String(y.getDate()).padStart(2, "0")}`;
      let streak = 0, answered = false;
      try {
        const s = JSON.parse(localStorage.getItem("rt-qotd-streak") || "null");
        if (s && (s.last === key || s.last === yesterday)) streak = Number(s.count) || 0;
        answered = Boolean(JSON.parse(localStorage.getItem("rt-qotd-answers") || "{}")?.[key]);
      } catch { /* Storage blocked: show the question without a streak. */ }
      setToday({ q: QOTD_QUESTIONS[qotdIndexForDate(now)].q, streak, answered });
    }, 0);
    return () => window.clearTimeout(id);
  }, []);
  return <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-8" aria-labelledby="home-qotd">
    <Link prefetch={false} href="/question-of-the-day" onClick={() => track("home_qotd_entry_click", { tool_type: "question_of_the_day", content_source: "homepage", answered_today: today?.answered ?? false, streak_days: today?.streak ?? 0, locale: "en" })}
      className="glass-card block p-5 sm:p-6 border-[var(--neon-yellow)]/25 hover:border-[var(--neon-yellow)]/50 transition-colors min-h-[8.5rem]">
      <p id="home-qotd" className="text-xs font-bold uppercase tracking-widest text-[var(--neon-yellow)]">☀️ Today&apos;s question{today?.streak ? ` · 🔥 ${today.streak}-day streak` : ""}</p>
      <p className="mt-2 text-base sm:text-lg font-semibold text-[var(--text-primary)] line-clamp-2">{today?.q ?? " "}</p>
      <p className="mt-2 text-sm font-semibold text-[var(--neon-cyan)]">{today?.answered ? "See how everyone answered →" : "Answer it and see how everyone answered →"}</p>
    </Link>
  </section>;
}
