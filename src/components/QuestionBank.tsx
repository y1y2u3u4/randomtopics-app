"use client";

import { useId, useRef, useState } from "react";
import { track } from "@/lib/track";
import { copyText } from "@/lib/clipboard";

// Full browsable question bank for the party-game pages. The curated decks
// used to live only inside the client generator — invisible as page content.
// Surfacing the whole deck server-rendered turns each game page into the
// canonical reference for its niche (browsable, Ctrl-F-able, copyable),
// instead of a thin wrapper around a button.

interface QuestionBankProps {
  questions: string[];
  heading: string;
  intro?: string;
}

export default function QuestionBank({ questions, heading, intro }: QuestionBankProps) {
  const [result, setResult] = useState<{ index: number | null; text: string; success: boolean } | null>(null);
  const [pending, setPending] = useState(false);
  const copying = useRef(false);
  const fallbackId = useId();
  const copy = async (index: number | null) => {
    if (copying.current) return;
    copying.current = true;
    setPending(true);
    setResult(null);
    const text = index === null ? questions.map((q, i) => `${i + 1}. ${q}`).join("\n") : questions[index];
    let success = false;
    try {
      success = await copyText(text);
    } catch { /* Preserve manual access even if a browser API fails unexpectedly. */ }
    finally {
      copying.current = false;
      setPending(false);
    }
    setResult({ index, text, success });
    const params = { content_source: "question_bank", copy_scope: index === null ? "deck" : "question", deck_size: questions.length };
    track(`bank_${index === null ? "deck" : "question"}_copy${success ? "" : "_error"}`, params);
    // Keep the historical successful-action series; manual selection is not success.
    if (success) track(index === null ? "copy_deck" : "copy_question", { deck: heading, deck_size: questions.length });
  };
  const manualFallback = result && !result.success ? <div className="mt-3 w-full rounded-lg border border-amber-300/30 p-3">
    <p role="status" className="text-sm text-amber-100">Automatic copy was blocked. Select the text below to copy it manually, or try the copy button again.</p>
    <label htmlFor={fallbackId} className="block mt-2 text-xs text-[var(--text-secondary)]">Text to copy manually</label>
    <textarea id={fallbackId} readOnly value={result.text} rows={result.index === null ? 6 : 3} onFocus={event => event.currentTarget.select()} className="mt-1 w-full rounded-lg border border-white/20 bg-black/20 p-3 text-sm text-[var(--text-primary)]" />
  </div> : null;

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
      <div className="glass-card p-8 sm:p-10">
        <div className="flex items-start justify-between gap-4 mb-3">
          <h2
            className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {heading}
          </h2>
          <button
            onClick={() => copy(null)}
            disabled={pending}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/40 transition-all"
          >
            {result?.success && result.index === null ? "✓ Copied all" : pending ? "Copying…" : "Copy full list"}
          </button>
        </div>
        {intro && (
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">{intro}</p>
        )}
        {result?.index === null && manualFallback}
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
          {questions.map((q, i) => (
            <li key={i} className="flex items-start gap-2.5 group">
              <span className="flex-shrink-0 w-6 text-right text-xs font-bold text-[var(--text-muted)] mt-0.5 tabular-nums">
                {i + 1}.
              </span>
              <div className="min-w-0 flex-1">
              <button
                onClick={() => copy(i)}
                disabled={pending}
                title="Click to copy"
                className="text-left text-[var(--text-secondary)] text-xs sm:text-sm leading-relaxed hover:text-[var(--text-primary)] transition-colors"
              >
                {q}{result?.success && result.index === i && <span className="ml-2 text-[var(--neon-cyan)]" role="status">✓ Copied</span>}
              </button>
              {result?.index === i && manualFallback}
              </div>
            </li>
          ))}
        </ol>
        <p className="text-xs text-[var(--text-muted)] mt-6">
          Click any question to copy it, or grab the whole numbered list for slides, handouts, or a
          group chat. Same deck the generator above deals from — curated in-house, clean and
          party-safe.
        </p>
      </div>
    </section>
  );
}
