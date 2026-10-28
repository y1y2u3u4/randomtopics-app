"use client";

import { useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";

export type NextActionsKind = "speech" | "debate";

interface Props {
  kind: NextActionsKind;
  busy: boolean;
  onReroll: () => void;
  resetKey: string;
}

const MINUTES = [1, 2, 3] as const;
const CRITERIA = ["Content", "Structure", "Delivery"] as const;
const BTN = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:border-[var(--neon-cyan)]/40 hover:text-[var(--neon-cyan)] disabled:opacity-60";

function fmt(ms: number) {
  const s = Math.max(0, Math.ceil(ms / 1000));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** Client-only follow-up actions shown directly under a generated speech/debate topic. */
export default function ResultNextActions({ kind, busy, onReroll, resetKey }: Props) {
  const [timerOpen, setTimerOpen] = useState(false);
  const [endAt, setEndAt] = useState<number | null>(null);
  const [left, setLeft] = useState(0);
  const [done, setDone] = useState(false);
  const [rubricOpen, setRubricOpen] = useState(false);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [copied, setCopied] = useState(false);
  const tick = useRef<number | null>(null);

  const stop = () => { if (tick.current) window.clearInterval(tick.current); tick.current = null; setEndAt(null); };

  // A new topic resets the timer and the self-score.
  useEffect(() => {
    if (tick.current) window.clearInterval(tick.current);
    tick.current = null;
    setEndAt(null); setDone(false); setScores({}); setCopied(false);
  }, [resetKey]);
  useEffect(() => () => { if (tick.current) window.clearInterval(tick.current); }, []);

  const start = (minutes: number) => {
    stop();
    const end = Date.now() + minutes * 60000;
    setEndAt(end); setLeft(minutes * 60000); setDone(false);
    tick.current = window.setInterval(() => {
      const remaining = end - Date.now();
      if (remaining <= 0) {
        if (tick.current) window.clearInterval(tick.current);
        tick.current = null; setEndAt(null); setLeft(0); setDone(true);
        try { navigator.vibrate?.(300); } catch { /* optional */ }
      } else setLeft(remaining);
    }, 250);
    track(`${kind}_timer_start`, { tool_type: "topic_generator", seconds: minutes * 60 });
  };

  const total = CRITERIA.reduce((sum, c) => sum + (scores[c] ?? 0), 0);
  const scoreText = `${kind === "speech" ? "Speech" : "Debate"} self-score\n` +
    CRITERIA.map((c) => `${c}: ${scores[c] ?? "-"}/5`).join("\n") + `\nTotal: ${total}/15`;

  return (
    <div className="mb-4 glass-card border-[var(--neon-cyan)]/20 p-4 sm:p-5" aria-label={kind === "speech" ? "Speech practice actions" : "Debate practice actions"}>
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        <button type="button" className={BTN} aria-expanded={timerOpen} onClick={() => setTimerOpen((v) => !v)}>
          <span aria-hidden="true">⏱</span> Start timer
        </button>
        <button type="button" className={BTN} disabled={busy} onClick={() => { track(`${kind}_reroll`, { tool_type: "topic_generator" }); onReroll(); }}>
          <span aria-hidden="true">🎲</span> {kind === "speech" ? "Another topic like this" : "Another topic"}
        </button>
        {kind === "speech" && (
          <button type="button" className={BTN} aria-expanded={rubricOpen} onClick={() => {
            if (!rubricOpen) track("speech_rubric_open", { tool_type: "topic_generator" });
            setRubricOpen((v) => !v);
          }}>
            <span aria-hidden="true">📝</span> Scoring rubric
          </button>
        )}
      </div>

      {timerOpen && (
        <div className="mt-4 text-center">
          <div className="flex justify-center gap-2" role="group" aria-label="Timer length">
            {MINUTES.map((m) => (
              <button key={m} type="button" className={BTN} onClick={() => start(m)}>{m} min</button>
            ))}
          </div>
          {endAt !== null && (
            <p className="mt-3 text-3xl font-bold tabular-nums text-[var(--text-primary)]" role="timer" aria-live="off">
              {fmt(left)} <button type="button" className="ml-2 align-middle text-sm font-normal text-[var(--text-muted)] underline" onClick={stop}>Stop</button>
            </p>
          )}
          {done && (
            <p role="alert" className="mt-3 rounded-xl border-2 border-[var(--neon-cyan)] px-4 py-3 text-lg font-bold text-[var(--neon-cyan)] motion-safe:animate-pulse">
              Time&apos;s up! Finish your last sentence.
            </p>
          )}
        </div>
      )}

      {kind === "speech" && rubricOpen && (
        <div className="mt-4 space-y-3">
          {CRITERIA.map((c) => (
            <div key={c} className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-sm font-semibold text-[var(--text-primary)]">
                {c} <span className="font-normal text-[var(--text-muted)]">{c === "Content" ? "- clear point, example" : c === "Structure" ? "- opening, 3 points, close" : "- pace, pauses, eye contact"}</span>
              </span>
              <div className="flex gap-1" role="radiogroup" aria-label={`${c} score`}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" role="radio" aria-checked={scores[c] === n}
                    onClick={() => setScores((s) => ({ ...s, [c]: n }))}
                    className={`h-11 w-11 rounded-lg border text-sm font-semibold ${scores[c] === n ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)]" : "border-white/15 text-[var(--text-secondary)]"}`}>{n}</button>
                ))}
              </div>
            </div>
          ))}
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm text-[var(--text-secondary)]">Total: {total}/15</span>
            <button type="button" className={BTN} onClick={async () => { setCopied(await copyText(scoreText)); window.setTimeout(() => setCopied(false), 1800); }}>
              {copied ? "Copied ✓" : "Copy"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
