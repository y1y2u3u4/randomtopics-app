"use client";

import { useState } from "react";
import { track } from "@/lib/track";

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
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const copyAll = async () => {
    try {
      await navigator.clipboard.writeText(questions.map((q, i) => `${i + 1}. ${q}`).join("\n"));
      track("copy_deck", { deck: heading, deck_size: questions.length });
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  const copyOne = async (q: string, i: number) => {
    try {
      await navigator.clipboard.writeText(q);
      track("copy_question", { deck: heading });
      setCopiedIdx(i);
      setTimeout(() => setCopiedIdx(null), 1200);
    } catch {
      /* clipboard unavailable */
    }
  };

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
            onClick={copyAll}
            className="flex-shrink-0 text-xs px-3 py-1.5 rounded-lg border border-[rgba(255,255,255,0.08)] text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/40 transition-all"
          >
            {copiedAll ? "✓ Copied all" : "Copy full list"}
          </button>
        </div>
        {intro && (
          <p className="text-[var(--text-secondary)] text-sm leading-relaxed mb-6">{intro}</p>
        )}
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
          {questions.map((q, i) => (
            <li key={i} className="flex items-start gap-2.5 group">
              <span className="flex-shrink-0 w-6 text-right text-xs font-bold text-[var(--text-muted)] mt-0.5 tabular-nums">
                {i + 1}.
              </span>
              <button
                onClick={() => copyOne(q, i)}
                title="Click to copy"
                className="text-left text-[var(--text-secondary)] text-xs sm:text-sm leading-relaxed hover:text-[var(--text-primary)] transition-colors"
              >
                {copiedIdx === i ? <span className="text-[var(--neon-cyan)]">✓ Copied</span> : q}
              </button>
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
