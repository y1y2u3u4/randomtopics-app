"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PrintButton from "./PrintButton";
import {
  CHARADES_WORDS,
  CHARADES_CATEGORIES,
  CharadesCategory,
} from "@/data/charades";

const DIFFICULTIES = [
  { id: 0, label: "Any" },
  { id: 1, label: "Easy" },
  { id: 2, label: "Medium" },
  { id: 3, label: "Hard" },
] as const;

const TIMER_OPTIONS = [0, 30, 60, 90, 120] as const;

const DIFFICULTY_BADGE: Record<1 | 2 | 3, { label: string; cls: string }> = {
  1: { label: "Easy", cls: "text-green-400 border-green-400/30" },
  2: { label: "Medium", cls: "text-yellow-400 border-yellow-400/30" },
  3: { label: "Hard", cls: "text-pink-400 border-pink-400/30" },
};

export default function CharadesGenerator() {
  const [category, setCategory] = useState<CharadesCategory | "all">("all");
  const [difficulty, setDifficulty] = useState<0 | 1 | 2 | 3>(0);
  const [timerLength, setTimerLength] = useState<number>(60);
  const [current, setCurrent] = useState<{ w: string; c: CharadesCategory; d: 1 | 2 | 3 } | null>(null);
  const [usedKeys, setUsedKeys] = useState<Set<string>>(new Set());
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);
  const [timeUp, setTimeUp] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const pool = useMemo(
    () =>
      CHARADES_WORDS.filter(
        (x) => (category === "all" || x.c === category) && (difficulty === 0 || x.d === difficulty)
      ),
    [category, difficulty]
  );

  const stopTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = null;
    setSecondsLeft(null);
  }, []);

  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (timerLength === 0) {
      setSecondsLeft(null);
      return;
    }
    setTimeUp(false);
    setSecondsLeft(timerLength);
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s === null || s <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = null;
          setTimeUp(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, [timerLength]);

  useEffect(() => () => stopTimer(), [stopTimer]);

  const deal = useCallback(() => {
    if (pool.length === 0) return;
    let candidates = pool.filter((x) => !usedKeys.has(x.w));
    let nextUsed = usedKeys;
    if (candidates.length === 0) {
      nextUsed = new Set();
      candidates = pool;
    }
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    const s = new Set(nextUsed);
    s.add(pick.w);
    setUsedKeys(s);
    setCurrent(pick);
    setTimeUp(false);
    startTimer();
  }, [pool, usedKeys, startTimer]);

  const catMeta = current ? CHARADES_CATEGORIES.find((c) => c.id === current.c) : null;
  const remaining = pool.filter((x) => !usedKeys.has(x.w)).length;
  const timerPct = secondsLeft !== null && timerLength > 0 ? (secondsLeft / timerLength) * 100 : 0;

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-6 sm:p-8">
        {/* Category filter */}
        <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">Category</p>
        <div className="flex flex-wrap gap-2 mb-5">
          <button
            onClick={() => { setCategory("all"); setUsedKeys(new Set()); }}
            className={`text-sm px-3.5 py-1.5 rounded-lg border transition-all ${
              category === "all"
                ? "border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[rgba(0,229,255,0.08)]"
                : "border-[rgba(255,255,255,0.08)] text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/40"
            }`}
          >
            All
          </button>
          {CHARADES_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => { setCategory(c.id); setUsedKeys(new Set()); }}
              className={`text-sm px-3.5 py-1.5 rounded-lg border transition-all ${
                category === c.id
                  ? "border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[rgba(0,229,255,0.08)]"
                  : "border-[rgba(255,255,255,0.08)] text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/40"
              }`}
            >
              {c.emoji} {c.label}
            </button>
          ))}
        </div>

        {/* Difficulty + timer */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-5 mb-6">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">Difficulty</p>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => { setDifficulty(d.id as 0 | 1 | 2 | 3); setUsedKeys(new Set()); }}
                  className={`text-sm px-3.5 py-1.5 rounded-lg border transition-all ${
                    difficulty === d.id
                      ? "border-[var(--neon-pink)] text-[var(--neon-pink)] bg-[rgba(255,45,120,0.08)]"
                      : "border-[rgba(255,255,255,0.08)] text-[var(--text-secondary)] hover:border-[var(--neon-pink)]/40"
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">Round timer</p>
            <div className="flex flex-wrap gap-2">
              {TIMER_OPTIONS.map((t) => (
                <button
                  key={t}
                  onClick={() => { setTimerLength(t); stopTimer(); setTimeUp(false); }}
                  className={`text-sm px-3.5 py-1.5 rounded-lg border transition-all ${
                    timerLength === t
                      ? "border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[rgba(0,229,255,0.08)]"
                      : "border-[rgba(255,255,255,0.08)] text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/40"
                  }`}
                >
                  {t === 0 ? "Off" : `${t}s`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Word card */}
        <div
          className={`rounded-2xl border p-8 sm:p-12 text-center transition-colors min-h-[11rem] flex flex-col items-center justify-center ${
            timeUp
              ? "border-[var(--neon-pink)]/60 bg-[rgba(255,45,120,0.06)]"
              : "border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]"
          }`}
          aria-live="polite"
        >
          <AnimatePresence mode="wait">
            {current ? (
              <motion.div
                key={current.w}
                initial={{ opacity: 0, scale: 0.92, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                transition={{ duration: 0.22 }}
                className="flex flex-col items-center gap-3"
              >
                <p
                  className="text-3xl sm:text-5xl font-extrabold text-[var(--text-primary)] leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {current.w}
                </p>
                <div className="flex items-center gap-2 text-xs">
                  {catMeta && (
                    <span className="px-2.5 py-1 rounded-full border border-[rgba(255,255,255,0.1)] text-[var(--text-muted)]">
                      {catMeta.emoji} {catMeta.label}
                    </span>
                  )}
                  <span className={`px-2.5 py-1 rounded-full border ${DIFFICULTY_BADGE[current.d].cls}`}>
                    {DIFFICULTY_BADGE[current.d].label}
                  </span>
                </div>
              </motion.div>
            ) : (
              <p className="text-lg text-[var(--text-muted)]">
                Pick your filters, then deal the first word 🎭
              </p>
            )}
          </AnimatePresence>

          {/* Timer bar */}
          {secondsLeft !== null && (
            <div className="w-full max-w-sm mt-6">
              <div className="h-2 rounded-full bg-[rgba(255,255,255,0.06)] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                    secondsLeft <= 10 ? "bg-[var(--neon-pink)]" : "bg-[var(--neon-cyan)]"
                  }`}
                  style={{ width: `${timerPct}%` }}
                />
              </div>
              <p
                className={`mt-2 text-2xl font-bold tabular-nums ${
                  timeUp ? "text-[var(--neon-pink)]" : secondsLeft <= 10 ? "text-[var(--neon-pink)]" : "text-[var(--text-secondary)]"
                }`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {timeUp ? "⏰ Time's up!" : `${secondsLeft}s`}
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <button onClick={deal} className="btn-generate" disabled={pool.length === 0}>
            <span>🎭</span> {current ? "Next Word" : "Deal a Word"}
          </button>
          <PrintButton
            heading="Charades Words"
            items={pool.map((x) => x.w)}
            intro={`${pool.length} charades words — print and cut into cards for offline play.`}
            label="Print this deck"
          />
        </div>
        <p className="text-xs text-[var(--text-muted)] text-center mt-4">
          {pool.length} words in this deck · {remaining} left before reshuffle · no repeats until the deck is done
        </p>
      </div>
    </section>
  );
}
