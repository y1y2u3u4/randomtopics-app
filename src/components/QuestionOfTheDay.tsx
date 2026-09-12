"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import PrintButton from "./PrintButton";
import Link from "next/link";
import GeneratedResultActions from "./GeneratedResultActions";
import { drawUnseen } from "@/lib/topicPool";
import {
  QOTD_QUESTIONS,
  QOTD_CATEGORIES,
  QotdCategory,
  qotdIndexForDate,
} from "@/data/questionOfTheDay";
import { track } from "@/lib/track";

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

  // Random-mode state
  const [category, setCategory] = useState<QotdCategory | "all">("all");
  const [randomQ, setRandomQ] = useState<{ q: string; c: QotdCategory } | null>(null);
  const [used, setUsed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const refreshDate = () => {
      const now = new Date();
      setTodayIdx(qotdIndexForDate(now));
      setDateLabel(
        now.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
      );
    };
    const timeout = window.setTimeout(refreshDate, 0);
    const interval = window.setInterval(refreshDate, 60_000);
    return () => { window.clearTimeout(timeout); window.clearInterval(interval); };
  }, []);

  const pool = useMemo(
    () => QOTD_QUESTIONS.filter((x) => category === "all" || x.c === category),
    [category]
  );

  const deal = useCallback(() => {
    if (pool.length === 0) return;
    if (randomQ) track("repeat_generate", { tool_type: "question_of_the_day", content_source: "qotd_hub", locale: "en" });
    track("generate_start", {
      tool_type: "question_of_the_day",
      content_source: "qotd_hub",
      generator_category: category,
      requested_count: 1,
      locale: "en",
    });
    const draw = drawUnseen(pool, new Set([...used, QOTD_QUESTIONS[todayIdx].q]), (item) => item.q);
    const pick = draw.picked[0];
    setUsed(draw.used);
    setRandomQ(pick);
    track("generate_success", {
      tool_type: "question_of_the_day",
      content_source: "qotd_hub",
      generator_category: category,
      result_category: pick.c,
      result_count: 1,
      result_source: "editorial_pool",
      locale: "en",
    });
  }, [pool, used, category, randomQ, todayIdx]);

  const changeCategory = useCallback((nextCategory: QotdCategory | "all") => {
    setCategory(nextCategory);
    track("filter_select", {
      tool_type: "question_of_the_day",
      content_source: "qotd_hub",
      filter_name: "category",
      filter_value: nextCategory,
      locale: "en",
    });
  }, []);

  const shown = randomQ ?? QOTD_QUESTIONS[todayIdx];
  const catMeta = shown ? QOTD_CATEGORIES.find((c) => c.id === shown.c) : null;
  const isToday = randomQ === null;

  const planLinks = [
    { href: "/question-of-the-day-for-students", label: "Plan 5 classroom questions", audience: "classroom" },
    { href: "/question-of-the-day-for-work", label: "Plan 5 team questions", audience: "work" },
  ];

  return (
    <section id="qotd-generator" aria-label="Daily and random question generator" className="max-w-3xl mx-auto px-4 sm:px-6 scroll-mt-24">
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
              onClick={() => { setRandomQ(null); track("qotd_return_today", { tool_type: "question_of_the_day", content_source: "qotd_hub", locale: "en" }); }}
              className="px-5 py-2.5 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors"
            >
              ✨ Back to today&apos;s
            </button>
          )}
          <PrintButton
            heading="Questions of the Day"
            items={pool.map((x) => x.q)}
            intro={`${pool.length} questions — print for a month of daily prompts.`}
            label="Print questions"
          />
        </div>

        {shown ? <div className="mt-5">
          <GeneratedResultActions
            key={`${isToday ? "today" : "random"}-${shown.q}`}
            text={shown.q}
            copyValue={`💬 ${isToday ? `Question of the day · ${dateLabel}` : "A question for the group"}\n${shown.q}\nEveryone is welcome to answer or pass.`}
            copyLabel="Copy for group chat"
            copyAsGroupMessage
            shareTitle="Question of the Day"
            saveTopic={{ id: `qotd-${QOTD_QUESTIONS.findIndex((item) => item.q === shown.q)}`, text: shown.q, category: "relationships", modes: ["conversation", "icebreaker"], depth: shown.c === "deep" ? "deep" : "light", talkingPoints: [] }}
            toolType="question_of_the_day"
            contentSource="qotd_hub"
            isPostGenerate={!isToday}
          />
        </div> : null}

        {/* Category filter for random mode */}
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          <button
            onClick={() => changeCategory("all")}
            aria-pressed={category === "all"}
            className={`min-h-11 text-xs px-3 py-1.5 rounded-full border transition-all ${
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
              onClick={() => changeCategory(c.id)}
              aria-pressed={category === c.id}
              className={`min-h-11 text-xs px-3 py-1.5 rounded-full border transition-all ${
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
          {pool.length} questions in this filter. Filters apply to your next random draw; your current question stays visible.
        </p>
        <p className="text-xs text-[var(--text-muted)] text-center mt-2">Today&apos;s question follows your local date and changes at midnight · {QOTD_QUESTIONS.length} questions in rotation.</p>
        <div className="mt-6 border-t border-white/10 pt-5">
          <p className="text-center text-sm font-semibold">Ready for next week?</p>
          <div className="mt-3 flex flex-wrap justify-center gap-3">
            {planLinks.map((link) => <Link key={link.href} href={link.href} onClick={() => track("weekly_plan_entry", { tool_type: "question_of_the_day", content_source: "qotd_hub", plan_audience: link.audience, locale: "en" })} className="inline-flex min-h-11 items-center rounded-xl border border-[var(--neon-cyan)]/30 px-4 py-2 text-sm text-[var(--neon-cyan)]">{link.label} →</Link>)}
          </div>
        </div>
      </div>
    </section>
  );
}
