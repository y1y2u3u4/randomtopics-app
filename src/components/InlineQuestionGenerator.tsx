"use client";

import { useCallback, useState } from "react";
import { track } from "@/lib/track";
import type { Locale } from "@/i18n/config";

interface InlineQuestionGeneratorProps {
  items: string[];
  title: string;
  description: string;
  source: string;
  locale?: Locale;
  actionLabel?: string;
}

export default function InlineQuestionGenerator({
  items,
  title,
  description,
  source,
  locale = "en",
  actionLabel,
}: InlineQuestionGeneratorProps) {
  const isSpanish = locale === "es";
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [used, setUsed] = useState<Set<number>>(new Set());
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);

  const current = currentIndex === null ? null : items[currentIndex];

  const generate = useCallback(() => {
    if (items.length === 0) return;
    track("generate_start", {
      tool_type: "inline_question_generator",
      content_source: source,
      requested_count: 1,
      locale,
    });

    let candidates = items.map((_, index) => index).filter((index) => !used.has(index));
    let nextUsed = used;
    if (candidates.length === 0) {
      nextUsed = new Set();
      candidates = items.map((_, index) => index);
    }
    const nextIndex = candidates[Math.floor(Math.random() * candidates.length)];
    const nextSet = new Set(nextUsed);
    nextSet.add(nextIndex);
    setUsed(nextSet);
    setCurrentIndex(nextIndex);
    setCopied(false);
    setShared(false);
    track("generate_success", {
      tool_type: "inline_question_generator",
      content_source: source,
      result_count: 1,
      result_source: "article_collection",
      locale,
    });
  }, [items, locale, source, used]);

  const copy = useCallback(async () => {
    if (!current) return;
    try {
      await navigator.clipboard.writeText(current);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
      track("copy_result", {
        tool_type: "inline_question_generator",
        content_source: source,
        locale,
      });
    } catch {
      setCopied(false);
    }
  }, [current, locale, source]);

  const share = useCallback(async () => {
    if (!current) return;
    try {
      if (typeof navigator.share === "function") {
        await navigator.share({ title, text: current, url: window.location.href });
        track("share_result", {
          tool_type: "inline_question_generator",
          content_source: source,
          share_method: "native",
          locale,
        });
      } else {
        await navigator.clipboard.writeText(`${current}\n${window.location.href}`);
        track("share_result", {
          tool_type: "inline_question_generator",
          content_source: source,
          share_method: "clipboard",
          locale,
        });
      }
      setShared(true);
      window.setTimeout(() => setShared(false), 1600);
    } catch {
      setShared(false);
    }
  }, [current, locale, source, title]);

  return (
    <div className="glass-card p-6 sm:p-8 border-[var(--neon-cyan)]/20 bg-gradient-to-br from-[rgba(0,229,255,0.05)] to-[rgba(255,45,120,0.04)]">
      <div className="text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--neon-cyan)]">
          {isSpanish ? "Generador incluido" : "Built-in generator"}
        </p>
        <h2 className="mt-2 text-xl sm:text-2xl font-bold text-[var(--text-primary)]">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{description}</p>
      </div>

      <div className="mt-6 min-h-[9rem] rounded-2xl border border-white/10 bg-black/10 px-6 py-8 flex items-center justify-center text-center" aria-live="polite">
        <p className={`leading-relaxed ${current ? "text-xl sm:text-2xl font-semibold text-[var(--text-primary)]" : "text-sm text-[var(--text-muted)]"}`}>
          {current ?? (isSpanish ? "Pulsa el botón para sacar una pregunta al azar." : "Choose a random prompt from the complete collection.")}
        </p>
      </div>

      <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
        <button type="button" onClick={generate} className="btn-generate">
          <span aria-hidden="true">🎲</span> {current
            ? (isSpanish ? "Siguiente pregunta" : "Next Prompt")
            : (actionLabel ?? (isSpanish ? "Sacar una pregunta" : "Pick a Random Prompt"))}
        </button>
        {current && (
          <>
            <button type="button" onClick={copy} className="px-5 py-2.5 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors">
              {copied ? (isSpanish ? "Copiado ✓" : "Copied ✓") : (isSpanish ? "Copiar" : "Copy")}
            </button>
            <button type="button" onClick={share} className="px-5 py-2.5 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-pink)]/50 transition-colors">
              {shared ? (isSpanish ? "Listo ✓" : "Shared ✓") : (isSpanish ? "Compartir" : "Share")}
            </button>
          </>
        )}
      </div>
      <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
        {items.length} {isSpanish ? "opciones · sin repeticiones hasta completar la lista" : "prompts · no repeats until the collection is complete"}
      </p>
    </div>
  );
}
