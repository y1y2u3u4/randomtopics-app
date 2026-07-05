"use client";

import { useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PrintButton from "./PrintButton";

interface PartyGeneratorProps {
  questions: string[];
  title: string;
  subtitle: string;
  emoji: string;
}

/**
 * Lightweight generator for fixed question lists (Would You Rather,
 * Never Have I Ever). Cycles without repeats until the pool is exhausted.
 */
export default function PartyGenerator({ questions, title, subtitle, emoji }: PartyGeneratorProps) {
  const [current, setCurrent] = useState<string | null>(null);
  const [used, setUsed] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    let pool = questions.map((_, i) => i).filter((i) => !used.has(i));
    let nextUsed = used;
    if (pool.length === 0) {
      // all used — reset the cycle
      nextUsed = new Set();
      pool = questions.map((_, i) => i);
    }
    const idx = pool[Math.floor(Math.random() * pool.length)];
    const s = new Set(nextUsed);
    s.add(idx);
    setUsed(s);
    setCurrent(questions[idx]);
    setCopied(false);
  }, [questions, used]);

  const copy = useCallback(async () => {
    if (!current) return;
    try {
      await navigator.clipboard.writeText(current);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }, [current]);

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20">
      <div className="text-center mb-10">
        <h1
          className="section-heading text-4xl sm:text-6xl font-extrabold mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title}
        </h1>
        <p className="text-[var(--text-muted)] max-w-xl mx-auto">{subtitle}</p>
      </div>

      <div className="glass-card p-8 sm:p-10 text-center">
        <AnimatePresence mode="wait">
          {current ? (
            <motion.p
              key={current}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] min-h-[4rem] flex items-center justify-center"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {current}
            </motion.p>
          ) : (
            <p className="text-lg text-[var(--text-muted)] min-h-[4rem] flex items-center justify-center">
              Hit the button to get your first question {emoji}
            </p>
          )}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <button onClick={generate} className="btn-generate">
            <span>{emoji}</span> {current ? "Next Question" : "Generate"}
          </button>
          {current && (
            <button
              onClick={copy}
              className="px-5 py-2.5 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors"
            >
              {copied ? "✅ Copied" : "📋 Copy"}
            </button>
          )}
          <PrintButton
            heading={title}
            items={questions}
            intro={`${questions.length} questions — a free printable deck from randomtopics.app`}
            label="🖨️ Print deck"
          />
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-4">
          {questions.length} questions in this deck · no repeats until you&apos;ve seen them all
        </p>
      </div>
    </section>
  );
}
