"use client";

import { useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { drawUnseen } from "@/lib/topicPool";
import {
  GUESS_SECRETS, GUESS_STARTERS, KNOW_QUESTIONS, KNOW_SETS, MAX_QUESTIONS, type KnowSet,
} from "@/data/twentyOneQuestions";

const button = "min-h-11 rounded-xl border px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--neon-cyan)]";
const idle = "border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/40";
const selected = "border-[var(--neon-cyan)] bg-[rgba(0,229,255,0.08)] text-[var(--neon-cyan)]";
const label = "block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2";
const ev = { tool_type: "21_questions", locale: "en" };

type Mode = "know" | "guess";

// 21 Questions in two modes. "know": draw open questions from a set with an
// x/21 counter. "guess": deal a secret thing to the answerer, then count the
// guessers' yes/no questions to 21 with optional starter hints.
export default function TwentyOneQuestions() {
  const [mode, setMode] = useState<Mode>("know");
  const [set, setSet] = useState<KnowSet>("friends");
  const [used, setUsed] = useState<Set<string>>(new Set());
  const [current, setCurrent] = useState("");
  const [asked, setAsked] = useState(0);
  const [secret, setSecret] = useState<{ w: string; c: string } | null>(null);
  const [showSecret, setShowSecret] = useState(false);
  const [solved, setSolved] = useState(false);
  const [flash, setFlash] = useState(false);

  const reset = (next?: { mode?: Mode; set?: KnowSet }) => {
    if (next?.mode) setMode(next.mode);
    if (next?.set) setSet(next.set);
    setUsed(new Set());
    setCurrent("");
    setAsked(0);
    setSecret(null);
    setShowSecret(false);
    setSolved(false);
  };

  const drawKnow = () => {
    if (asked >= MAX_QUESTIONS) return;
    const d = drawUnseen(KNOW_QUESTIONS[set], used, (q) => q);
    setUsed(d.used);
    setCurrent(d.picked[0]);
    setAsked((n) => n + 1);
    track("generate_success", { ...ev, generator_category: set, question_number: asked + 1 });
  };
  const dealSecret = () => {
    const d = drawUnseen(GUESS_SECRETS, used, (s) => s.w);
    setUsed(d.used);
    setSecret(d.picked[0]);
    setShowSecret(true);
    setAsked(0);
    setSolved(false);
    track("generate_success", { ...ev, generator_category: "guess" });
  };
  const askOne = () => {
    if (asked >= MAX_QUESTIONS || solved) return;
    setAsked((n) => n + 1);
  };
  const copy = async () => {
    if (!current || !(await copyText(current))) return;
    setFlash(true);
    setTimeout(() => setFlash(false), 1500);
    track("copy_result", ev);
  };

  const done = asked >= MAX_QUESTIONS;
  const hint = mode === "guess" && secret && !solved && !done ? GUESS_STARTERS[asked % GUESS_STARTERS.length] : "";

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-5 sm:p-8">
        <span className={label}>Mode</span>
        <div className="grid grid-cols-2 gap-2">
          <button type="button" aria-pressed={mode === "know"} onClick={() => reset({ mode: "know" })} className={`${button} ${mode === "know" ? selected : idle}`} data-q21-mode="know">💬 Get to know each other</button>
          <button type="button" aria-pressed={mode === "guess"} onClick={() => reset({ mode: "guess" })} className={`${button} ${mode === "guess" ? selected : idle}`} data-q21-mode="guess">🔍 Guess the thing</button>
        </div>

        {mode === "know" && (
          <div className="mt-4">
            <span className={label}>Question set</span>
            <div className="flex flex-wrap gap-2">
              {KNOW_SETS.map((s) => (
                <button type="button" key={s.id} aria-pressed={set === s.id} onClick={() => reset({ set: s.id })} className={`${button} ${set === s.id ? selected : idle}`}>{s.emoji} {s.label}</button>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-between gap-3">
          <p className="text-sm text-[var(--text-secondary)]">Question</p>
          <p className="text-2xl font-bold tabular-nums text-[var(--text-primary)]" data-q21-counter>{asked}/{MAX_QUESTIONS}</p>
        </div>
        <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden" aria-hidden="true">
          <div className="h-full bg-[var(--neon-cyan)] transition-all" style={{ width: `${(asked / MAX_QUESTIONS) * 100}%` }} />
        </div>

        <div aria-live="polite" className="mt-5 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center min-h-40 flex flex-col items-center justify-center" data-q21-result>
          {mode === "know" ? (
            current ? (
              <>
                <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Question {asked}</p>
                <p className="mt-2 text-2xl sm:text-3xl font-bold text-[var(--text-primary)] break-words max-w-full" style={{ fontFamily: "var(--font-display)" }}>{current}</p>
                {done && <p className="mt-3 text-sm text-[var(--neon-cyan)]">That&apos;s all 21. Swap who answers and start again.</p>}
              </>
            ) : (
              <p className="text-[var(--text-secondary)]">Pick a set and draw the first question. Take turns answering; everyone can pass once.</p>
            )
          ) : secret ? (
            <>
              <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Secret for the answerer · {secret.c}</p>
              <p className="mt-2 text-4xl sm:text-5xl font-extrabold gradient-text break-words max-w-full" style={{ fontFamily: "var(--font-display)" }}>{showSecret || solved || done ? secret.w : "• • •"}</p>
              {solved && <p className="mt-3 text-sm text-[var(--neon-cyan)]">Guessed in {asked} question{asked === 1 ? "" : "s"}!</p>}
              {done && !solved && <p className="mt-3 text-sm text-[var(--neon-pink)]">21 questions used — the answerer wins.</p>}
              {hint && <p className="mt-3 text-sm text-[var(--text-muted)]">Stuck? Try asking: “{hint}”</p>}
            </>
          ) : (
            <p className="text-[var(--text-secondary)]">The answerer presses the button, memorises the secret, then hides it. Everyone else asks yes/no questions.</p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
          {mode === "know" ? (
            <>
              <button type="button" onClick={drawKnow} disabled={done} className="btn-generate disabled:opacity-50" data-q21-draw>
                <span aria-hidden="true">🎲</span> {current ? "Next question" : "Draw a question"}
              </button>
              {current && <button type="button" onClick={copy} className={`${button} ${idle}`}>{flash ? "Copied ✓" : "Copy"}</button>}
            </>
          ) : (
            <>
              <button type="button" onClick={dealSecret} className="btn-generate" data-q21-draw>
                <span aria-hidden="true">🤫</span> {secret ? "New secret" : "Deal a secret"}
              </button>
              {secret && <button type="button" onClick={() => setShowSecret((s) => !s)} className={`${button} ${idle}`}>{showSecret ? "Hide secret" : "Peek"}</button>}
              {secret && !solved && !done && <button type="button" onClick={askOne} className={`${button} ${selected}`} data-q21-ask>+1 question asked</button>}
              {secret && !solved && !done && <button type="button" onClick={() => { setSolved(true); track("score_point", ev); }} className={`${button} ${idle}`}>✓ Guessed it</button>}
            </>
          )}
          <button type="button" onClick={() => reset()} className={`${button} ${idle}`}>Reset</button>
        </div>
      </div>
    </section>
  );
}
