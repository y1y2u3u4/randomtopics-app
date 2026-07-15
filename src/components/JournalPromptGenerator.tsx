"use client";

import { useCallback, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PrintButton from "./PrintButton";
import {
  JOURNAL_PROMPTS,
  JOURNAL_CATEGORIES,
  JournalCategory,
} from "@/data/journalPrompts";

export default function JournalPromptGenerator() {
  const [category, setCategory] = useState<JournalCategory | "all">("all");
  const [current, setCurrent] = useState<{ p: string; c: JournalCategory } | null>(null);
  const [used, setUsed] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const pool = useMemo(
    () => JOURNAL_PROMPTS.filter((x) => category === "all" || x.c === category),
    [category]
  );

  const deal = useCallback(() => {
    if (pool.length === 0) return;
    let candidates = pool.filter((x) => !used.has(x.p));
    let nextUsed = used;
    if (candidates.length === 0) {
      nextUsed = new Set();
      candidates = pool;
    }
    const pick = candidates[Math.floor(Math.random() * candidates.length)];
    const s = new Set(nextUsed);
    s.add(pick.p);
    setUsed(s);
    setCurrent(pick);
    setCopied(false);
  }, [pool, used]);

  const copy = useCallback(async () => {
    if (!current) return;
    try {
      await navigator.clipboard.writeText(current.p);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }, [current]);

  const catMeta = current ? JOURNAL_CATEGORIES.find((c) => c.id === current.c) : null;

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-6 sm:p-8">
        {/* Category filter */}
        <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">Journal style</p>
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => { setCategory("all"); setUsed(new Set()); }}
            className={`text-sm px-3.5 py-1.5 rounded-lg border transition-all ${
              category === "all"
                ? "border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[rgba(0,229,255,0.08)]"
                : "border-[rgba(255,255,255,0.08)] text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/40"
            }`}
          >
            All
          </button>
          {JOURNAL_CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => { setCategory(c.id); setUsed(new Set()); }}
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

        {/* Prompt card */}
        <div
          className="rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-8 sm:p-12 text-center min-h-[10rem] flex flex-col items-center justify-center"
          aria-live="polite"
        >
          <AnimatePresence mode="wait">
            {current ? (
              <motion.div
                key={current.p}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22 }}
                className="flex flex-col items-center gap-4"
              >
                <p
                  className="text-xl sm:text-3xl font-semibold text-[var(--text-primary)] leading-snug max-w-xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {current.p}
                </p>
                {catMeta && (
                  <span className="px-2.5 py-1 rounded-full border border-[rgba(255,255,255,0.1)] text-[var(--text-muted)] text-xs">
                    {catMeta.emoji} {catMeta.label}
                  </span>
                )}
              </motion.div>
            ) : (
              <p className="text-lg text-[var(--text-muted)]">
                Pick a style — or leave it on All — and deal your first prompt 📓
              </p>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <button onClick={deal} className="btn-generate">
            <span>📓</span> {current ? "Next Prompt" : "Get a Journal Prompt"}
          </button>
          {current && (
            <button
              onClick={copy}
              className="px-5 py-2.5 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors"
            >
              {copied ? "Copied ✓" : "Copy"}
            </button>
          )}
          <PrintButton
            heading="Journal Prompts"
            items={pool.map((x) => x.p)}
            intro={`${pool.length} journal prompts — print for offline journaling.`}
            label="Print prompts"
          />
        </div>
        <p className="text-xs text-[var(--text-muted)] text-center mt-4">
          {pool.length} prompts in this set · no repeats until you&apos;ve seen them all
        </p>
      </div>
    </section>
  );
}
