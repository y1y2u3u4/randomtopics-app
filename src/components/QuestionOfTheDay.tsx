"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import PrintButton from "./PrintButton";
import {
  QOTD_QUESTIONS,
  QOTD_CATEGORIES,
  QotdCategory,
  qotdIndexForDate,
} from "@/data/questionOfTheDay";

interface QuestionOfTheDayProps {
  /** Server-computed (UTC) index so today's question is in the static HTML. */
  initialIdx: number;
  /** Server-formatted date label matching initialIdx. */
  initialDateLabel: string;
}

export default function QuestionOfTheDay({ initialIdx, initialDateLabel }: QuestionOfTheDayProps) {
  // Seeded from the server render (crawlable), then corrected to the visitor's
  // local date after hydration — a no-op for most visitors, a seamless swap
  // for timezones on the other side of midnight.
  const [todayIdx, setTodayIdx] = useState<number>(initialIdx);
  const [dateLabel, setDateLabel] = useState(initialDateLabel);
  const [copied, setCopied] = useState(false);

  // Random-mode state
  const [category, setCategory] = useState<QotdCategory | "all">("all");
  const [randomQ, setRandomQ] = useState<{ q: string; c: QotdCategory } | null>(null);
  const [used, setUsed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const now = new Date();
    setTodayIdx(qotdIndexForDate(now));
    setDateLabel(
      now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    );
  }, []);

  const pool = useMemo(
    () => QOTD_QUESTIONS.filter((x) => category === "all" || x.c === category),
    [category]
  );

  const deal = useCallback(() => {
    if (pool.length === 0) return;
    let candidates = pool.filter((x) => !used.has(x.q));
    let nextUsed = used;
    if (candidates.length === 0) {
      nextUsed = new Set();
      candidates = pool;
    }
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    const s = new Set(nextUsed);
    s.add(pick.q);
    setUsed(s);
    setRandomQ(pick);
  }, [pool, used]);

  const shown = randomQ ?? QOTD_QUESTIONS[todayIdx];
  const catMeta = shown ? QOTD_CATEGORIES.find((c) => c.id === shown.c) : null;
  const isToday = randomQ === null;

  const copy = useCallback(async () => {
    if (!shown) return;
    try {
      await navigator.clipboard.writeText(shown.q);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }, [shown]);

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-6 sm:p-8">
        {/* Question card */}
        <div
          className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-8 sm:p-12 text-center min-h-[11rem] flex flex-col items-center justify-center"
          aria-live="polite"
        >
          {shown ? (
            <motion.div
              key={shown.q + (isToday ? "-t" : "-r")}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              className="flex flex-col items-center gap-4"
            >
              <span className="text-xs uppercase tracking-widest text-[var(--neon-cyan)]">
                {isToday ? `✨ Today's Question · ${dateLabel}` : "🎲 Random Question"}
              </span>
              <p
                className="text-xl sm:text-3xl font-semibold text-[var(--text-primary)] leading-snug max-w-xl"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {shown.q}
              </p>
              {catMeta && (
                <span className="px-2.5 py-1 rounded-full border border-[rgba(255,255,255,0.1)] text-[var(--text-muted)] text-xs">
                  {catMeta.emoji} {catMeta.label}
                </span>
              )}
            </motion.div>
          ) : (
            <p className="text-lg text-[var(--text-muted)]">Loading today&apos;s question…</p>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <button onClick={deal} className="btn-generate">
            <span>🎲</span> Random Question
          </button>
          {randomQ && (
            <button
              onClick={() => setRandomQ(null)}
              className="px-5 py-2.5 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors"
            >
              ✨ Back to today&apos;s
            </button>
          )}
          <button
            onClick={copy}
            className="px-5 py-2.5 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors"
          >
            {copied ? "Copied ✓" : "Copy"}
          </button>
          <PrintButton
            heading="Questions of the Day"
            items={pool.map((x) => x.q)}
            intro={`${pool.length} questions — print for a month of daily prompts.`}
            label="Print questions"
          />
        </div>

        {/* Category filter for random mode */}
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          <button
            onClick={() => { setCategory("all"); setUsed(new Set()); }}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
              category === "all"
                ? "border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[rgba(0,229,255,0.08)]"
                : "border-[rgba(255,255,255,0.08)] text-[var(--text-muted)] hover:border-[var(--neon-cyan)]/40"
            }`}
          >
            All
          </button>
          {QOTD_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => { setCategory(c.id); setUsed(new Set()); }}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                category === c.id
                  ? "border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[rgba(0,229,255,0.08)]"
                  : "border-[rgba(255,255,255,0.08)] text-[var(--text-muted)] hover:border-[var(--neon-cyan)]/40"
              }`}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>
        <p className="text-xs text-[var(--text-muted)] text-center mt-4">
          Today&apos;s question is the same for everyone and changes at midnight · {QOTD_QUESTIONS.length} questions in rotation
        </p>
      </div>
    </section>
  );
}
