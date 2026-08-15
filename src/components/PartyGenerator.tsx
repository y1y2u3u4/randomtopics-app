"use client";

import { useCallback, useMemo, useState } from "react";
import { track } from "@/lib/track";
import { motion, AnimatePresence } from "framer-motion";
import PrintButton from "./PrintButton";
import { Locale, defaultLocale } from "@/i18n/config";
import { getDict } from "@/i18n/dictionaries";

interface PartyGeneratorProps {
  questions: string[];
  title: string;
  subtitle: string;
  emoji: string;
  locale?: Locale;
  filters?: { id: string; label: string; prefix: string }[];
}

/**
 * Lightweight generator for fixed question lists (Would You Rather,
 * Never Have I Ever). Cycles without repeats until the pool is exhausted.
 */
export default function PartyGenerator({ questions, title, subtitle, emoji, locale = defaultLocale, filters = [] }: PartyGeneratorProps) {
  const t = getDict(locale);
  const [current, setCurrent] = useState<string | null>(null);
  const [used, setUsed] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const activeQuestions = useMemo(() => {
    if (activeFilter === "all") return questions;
    const prefix = filters.find((filter) => filter.id === activeFilter)?.prefix;
    return prefix ? questions.filter((question) => question.startsWith(prefix)) : questions;
  }, [activeFilter, filters, questions]);

  const generate = useCallback(() => {
    track("deal_party_question", { deck: title });
    let pool = activeQuestions.map((_, i) => i).filter((i) => !used.has(i));
    let nextUsed = used;
    if (pool.length === 0) {
      // all used — reset the cycle
      nextUsed = new Set();
      pool = activeQuestions.map((_, i) => i);
    }
    const idx = pool[Math.floor(Math.random() * pool.length)];
    const s = new Set(nextUsed);
    s.add(idx);
    setUsed(s);
    setCurrent(activeQuestions[idx]);
    setCopied(false);
  }, [activeQuestions, title, used]);

  function changeFilter(id: string) {
    setActiveFilter(id);
    setCurrent(null);
    setUsed(new Set());
    setCopied(false);
    track("filter_party_questions", { deck: title, filter: id });
  }

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
        {filters.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mb-6" aria-label={`${title} filters`}>
            {[{ id: "all", label: "Mix" }, ...filters].map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => changeFilter(filter.id)}
                aria-pressed={activeFilter === filter.id}
                className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all ${
                  activeFilter === filter.id
                    ? "border-[var(--neon-cyan)]/50 bg-[rgba(0,229,255,0.1)] text-[var(--neon-cyan)]"
                    : "border-white/10 text-[var(--text-muted)] hover:border-white/20 hover:text-[var(--text-primary)]"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        )}
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
              {t.party.firstPrompt} {emoji}
            </p>
          )}
        </AnimatePresence>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <button onClick={generate} className="btn-generate">
            <span>{emoji}</span> {current ? t.party.next : t.party.generate}
          </button>
          {current && (
            <button
              onClick={copy}
              className="px-5 py-2.5 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors"
            >
              {copied ? t.party.copied : t.party.copy}
            </button>
          )}
          <PrintButton
            heading={title}
            items={activeQuestions}
            intro={t.print.footerNote(activeQuestions.length)}
            label={t.party.printDeck}
            locale={locale}
          />
        </div>
        <p className="text-xs text-[var(--text-muted)] mt-4">
          {activeQuestions.length} {t.party.deckInfo}
        </p>
      </div>
    </section>
  );
}
