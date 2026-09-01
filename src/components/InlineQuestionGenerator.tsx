"use client";

import { useCallback, useState } from "react";
import { track } from "@/lib/track";
import type { Locale } from "@/i18n/config";
import { copyText } from "@/lib/clipboard";

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
  const [manualCopyText, setManualCopyText] = useState<string | null>(null);

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
    setManualCopyText(null);
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
    const copiedSuccessfully = await copyText(current);
    if (!copiedSuccessfully) {
      setCopied(false);
      setManualCopyText(current);
      track("copy_error", {
        tool_type: "inline_question_generator",
        content_source: source,
        locale,
      });
      return;
    }
    setManualCopyText(null);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
    track("copy_result", {
      tool_type: "inline_question_generator",
      content_source: source,
      locale,
    });
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
        const shareText = `${current}\n${window.location.href}`;
        const copiedSuccessfully = await copyText(shareText);
        if (!copiedSuccessfully) {
          setManualCopyText(shareText);
          track("share_error", {
            tool_type: "inline_question_generator",
            content_source: source,
            share_method: "clipboard",
            locale,
          });
          return;
        }
        track("share_result", {
          tool_type: "inline_question_generator",
          content_source: source,
          share_method: "clipboard",
          locale,
        });
      }
      setManualCopyText(null);
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
      {manualCopyText ? (
        <div className="mx-auto mt-4 max-w-xl rounded-xl border border-amber-300/20 bg-amber-300/5 p-3 text-left">
          <label className="text-xs text-amber-100" htmlFor={`manual-copy-${source}`}>
            {isSpanish
              ? "La copia automática está bloqueada. Selecciona el texto:"
              : "Automatic copying is blocked. Select the text below:"}
          </label>
          <textarea
            id={`manual-copy-${source}`}
            readOnly
            value={manualCopyText}
            rows={3}
            onFocus={(event) => event.currentTarget.select()}
            className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-sm text-white outline-none focus:border-amber-300/40"
          />
        </div>
      ) : null}
      <p className="mt-4 text-center text-xs text-[var(--text-muted)]">
        {items.length} {isSpanish ? "opciones · sin repeticiones hasta completar la lista" : "prompts · no repeats until the collection is complete"}
      </p>
    </div>
  );
}
