"use client";

import { useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { drawUnseen } from "@/lib/topicPool";
import PrintButton from "@/components/PrintButton";
import { PICTIONARY_THEMES, PICTIONARY_WORDS, levelLabel, type PictionaryEntry } from "@/data/pictionary";

const button = "min-h-11 rounded-xl border px-3 py-2 text-sm transition-colors border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/40";
const ev = { tool_type: "pictionary_words", locale: "en" };

// Top-of-page helper for the word list: one-click random pick from the whole
// list, plus copy-all and print for people who want the list on paper.
export default function PictionaryQuickPick() {
  const [used, setUsed] = useState<Set<string>>(new Set());
  const [current, setCurrent] = useState<PictionaryEntry | null>(null);
  const [flash, setFlash] = useState(false);

  const pick = () => {
    const d = drawUnseen(PICTIONARY_WORDS, used, (e) => e.w);
    setUsed(d.used);
    setCurrent(d.picked[0]);
    track("generate_success", { ...ev, result_count: 1 });
  };
  const copyAll = async () => {
    const text = PICTIONARY_THEMES.map((t) => `${t.label}\n${PICTIONARY_WORDS.filter((e) => e.t === t.id).map((e) => e.w).join("\n")}`).join("\n\n");
    if (!(await copyText(text))) return;
    setFlash(true);
    setTimeout(() => setFlash(false), 1500);
    track("copy_result", { ...ev, format: "all" });
  };
  const theme = PICTIONARY_THEMES.find((t) => t.id === current?.t);

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-5 sm:p-8 text-center">
        <div aria-live="polite" className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 min-h-36 flex flex-col items-center justify-center" data-pictionary-result>
          {current ? (
            <>
              <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{theme?.emoji} {theme?.label} · {levelLabel(current.d)}</p>
              <p className="mt-2 text-4xl sm:text-6xl font-extrabold gradient-text break-words max-w-full" style={{ fontFamily: "var(--font-display)" }}>{current.w}</p>
            </>
          ) : (
            <p className="text-[var(--text-secondary)]">{PICTIONARY_WORDS.length} Pictionary words below. Press the button to pick one at random.</p>
          )}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
          <button type="button" onClick={pick} className="btn-generate" data-pictionary-generate>
            <span aria-hidden="true">🎲</span> {current ? "Pick another" : "Pick a random word"}
          </button>
          <button type="button" onClick={copyAll} className={button}>{flash ? "Copied ✓" : "Copy the whole list"}</button>
          <PrintButton heading="Pictionary Word List" intro="Cut along the lines and draw from a hat. randomtopics.app/pictionary-words" items={PICTIONARY_WORDS.map((e) => e.w)} label="Print / PDF" />
        </div>
      </div>
    </section>
  );
}
