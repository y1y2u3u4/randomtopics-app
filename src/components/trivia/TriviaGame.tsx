"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { track } from "@/lib/track";
import {
  DEFAULT_TIMER, DIFFICULTIES, MAX_TEAMS, MIN_TEAMS, TIMER_OPTIONS, TRIVIA_BANKS, TRIVIA_CATEGORIES, TRIVIA_CATEGORY_IDS, CATEGORY_TRIVIA,
  adjustScore, choicesFor, createRng, createScoreboard, drawQuestion, filterTrivia, formatSeconds, leaders, resizeScoreboard,
  type Difficulty, type Team, type TriviaBank, type TriviaFilters, type TriviaQuestion,
} from "@/lib/trivia";

const TOOL = "trivia_questions";

const chip = (active: boolean) =>
  `text-sm px-3 py-1.5 rounded-lg border transition-all ${
    active
      ? "border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[rgba(0,229,255,0.08)]"
      : "border-[rgba(255,255,255,0.08)] text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/40"
  }`;
const ghostBtn =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:border-[var(--neon-cyan)]/40 hover:text-[var(--neon-cyan)] disabled:opacity-40";
const scoreBtn =
  "h-9 w-9 shrink-0 rounded-lg border border-white/10 text-lg font-bold text-[var(--text-primary)] hover:border-[var(--neon-cyan)]/50 hover:text-[var(--neon-cyan)]";

const DIFF_LABEL: Record<Difficulty, string> = { easy: "Easy", medium: "Medium", hard: "Hard" };
const CATEGORY_LABEL = (c: TriviaBank) => (c === "halloween" ? "Halloween" : TRIVIA_CATEGORIES[c].label);
const CATEGORY_EMOJI = (c: TriviaBank) => (c === "halloween" ? "🎃" : TRIVIA_CATEGORIES[c].emoji);

interface Props {
  /** "halloween" presets the game to the seasonal bank and hides the category picker. */
  bank?: "categories" | "halloween";
  /** Fixed seed for the first card so the server HTML already shows a real question. */
  seed: number;
}

interface Card { q: TriviaQuestion; choices: string[] }

function Filters({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <p className="text-[11px] uppercase tracking-widest text-[var(--text-muted)] mb-1.5">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

export default function TriviaGame({ bank = "categories", seed }: Props) {
  const pool = bank === "halloween" ? TRIVIA_BANKS.halloween : CATEGORY_TRIVIA;
  const [filters, setFilters] = useState<TriviaFilters>({ category: "all", difficulty: "all" });
  const [multipleChoice, setMultipleChoice] = useState(true);
  const first = useMemo<Card>(() => {
    const rng = createRng(seed);
    const q = drawQuestion(pool, [], rng).question!;
    return { q, choices: choicesFor(q, rng) };
  }, [pool, seed]);
  const [card, setCard] = useState<Card | null>(first);
  const [used, setUsed] = useState<string[]>([first.q.id]);
  const [revealed, setRevealed] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [asked, setAsked] = useState(1);

  // Host mode
  const [host, setHost] = useState(false);
  const [board, setBoard] = useState<Team[]>(() => createScoreboard(2));
  const [timer, setTimer] = useState<number>(DEFAULT_TIMER);
  const [left, setLeft] = useState<number>(DEFAULT_TIMER);
  const [running, setRunning] = useState(false);

  const matching = useMemo(() => filterTrivia(pool, filters), [pool, filters]);
  const remaining = useMemo(() => {
    const u = new Set(used);
    return matching.filter((q) => !u.has(q.id)).length;
  }, [matching, used]);

  const restartTimer = useCallback((seconds: number) => {
    setLeft(seconds);
    setRunning(seconds > 0);
  }, []);

  const next = useCallback(
    (f: TriviaFilters = filters) => {
      const out = drawQuestion(filterTrivia(pool, f), used, Math.random);
      setRevealed(false);
      setPicked(null);
      if (!out.question) {
        setCard(null);
        setRunning(false);
        return;
      }
      setCard({ q: out.question, choices: choicesFor(out.question, Math.random) });
      setUsed(out.used);
      setAsked((n) => n + 1);
      if (host) restartTimer(timer);
      track("generate_success", { tool_type: TOOL, result_count: 1, result_source: "editorial_pool", locale: "en", host_mode: host });
    },
    [filters, pool, used, host, timer, restartTimer],
  );

  const reveal = useCallback(() => {
    setRevealed(true);
    setRunning(false);
  }, []);

  const changeFilters = (f: TriviaFilters) => {
    setFilters(f);
    next(f);
  };

  const newGame = () => {
    setUsed([]);
    setBoard((b) => b.map((t) => ({ ...t, score: 0 })));
    setAsked(0);
    const out = drawQuestion(matching, [], Math.random);
    setRevealed(false);
    setPicked(null);
    if (out.question) {
      setCard({ q: out.question, choices: choicesFor(out.question, Math.random) });
      setUsed(out.used);
      setAsked(1);
      if (host) restartTimer(timer);
    }
  };

  // Countdown: deadline-based so a throttled background tab stays accurate.
  useEffect(() => {
    if (!running) return;
    const deadline = Date.now() + left * 1000;
    const id = window.setInterval(() => {
      const s = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      setLeft(s);
      if (s === 0) {
        setRunning(false);
        try { navigator.vibrate?.(200); } catch { /* unsupported */ }
      }
    }, 250);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restart only when the timer is (re)started
  }, [running]);

  const openHost = () => {
    setHost(true);
    restartTimer(timer);
    track("trivia_host_mode", { tool_type: TOOL, locale: "en" });
    try { void document.documentElement.requestFullscreen?.().catch(() => {}); } catch { /* not allowed: the overlay still covers the page */ }
  };
  const closeHost = () => {
    setHost(false);
    setRunning(false);
    try { if (document.fullscreenElement) void document.exitFullscreen(); } catch { /* ignore */ }
  };

  useEffect(() => {
    if (!host) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeHost();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [host]);

  const lead = leaders(board);

  const questionCard = (big: boolean) =>
    card ? (
      <div>
        <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)] mb-3">
          <span className="rounded-full border border-white/10 px-2.5 py-1">{CATEGORY_EMOJI(card.q.category)} {CATEGORY_LABEL(card.q.category)}</span>
          <span className="rounded-full border border-white/10 px-2.5 py-1">{DIFF_LABEL[card.q.difficulty]}</span>
          <span className="ml-auto">Q{asked} · {remaining} left</span>
        </div>
        <p
          className={`${big ? "text-2xl sm:text-4xl" : "text-xl sm:text-2xl"} font-bold text-[var(--text-primary)] leading-snug`}
          style={{ fontFamily: "var(--font-display)" }}
          aria-live="polite"
        >
          {card.q.question}
        </p>
        {multipleChoice && (
          <div className={`grid gap-2 mt-4 ${big ? "sm:grid-cols-2" : "grid-cols-1 sm:grid-cols-2"}`}>
            {card.choices.map((c, i) => {
              const isAnswer = c === card.q.answer;
              const state = revealed ? (isAnswer ? "right" : picked === c ? "wrong" : "idle") : "idle";
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => { if (!revealed) { setPicked(c); reveal(); } }}
                  className={`min-h-11 rounded-xl border px-4 py-2.5 text-left text-sm sm:text-base font-semibold transition-colors ${
                    state === "right"
                      ? "border-emerald-400 bg-emerald-400/15 text-emerald-200"
                      : state === "wrong"
                        ? "border-rose-400 bg-rose-400/10 text-rose-200"
                        : "border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50"
                  }`}
                >
                  <span className="text-[var(--text-muted)] mr-2">{String.fromCharCode(65 + i)}.</span>{c}
                </button>
              );
            })}
          </div>
        )}
        {revealed && (
          <div className="mt-4 rounded-xl border border-[var(--neon-cyan)]/30 bg-[rgba(0,229,255,0.05)] p-4">
            <p className="text-sm text-[var(--text-muted)]">Answer</p>
            <p className="text-lg font-bold text-[var(--neon-cyan)]">{card.q.answer}</p>
            <p className="text-sm text-[var(--text-secondary)] mt-1">{card.q.explanation}</p>
          </div>
        )}
      </div>
    ) : (
      <div className="text-center py-6">
        <p className="text-lg font-bold text-[var(--text-primary)]">That&apos;s every question for these filters.</p>
        <p className="text-sm text-[var(--text-muted)] mt-1">No repeats in a game: start a new game or pick another category.</p>
        <button type="button" onClick={newGame} className="btn-generate mt-4">New game</button>
      </div>
    );

  const actions = (
    <div className="flex flex-wrap gap-2 mt-5">
      <button type="button" onClick={() => next()} className="btn-generate flex-1 sm:flex-none">Next question →</button>
      <button type="button" onClick={reveal} disabled={!card || revealed} className={ghostBtn}>Show answer</button>
    </div>
  );

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6" aria-label="Trivia game">
      <div className="glass-card p-4 sm:p-7">
        <div className="mb-1">
          {bank === "categories" && (
            <Filters label="Category">
              <button type="button" className={chip(filters.category === "all")} onClick={() => changeFilters({ ...filters, category: "all" })}>🎲 Mixed</button>
              {TRIVIA_CATEGORY_IDS.map((c) => (
                <button key={c} type="button" className={chip(filters.category === c)} onClick={() => changeFilters({ ...filters, category: c })}>
                  {TRIVIA_CATEGORIES[c].emoji} {TRIVIA_CATEGORIES[c].label}
                </button>
              ))}
            </Filters>
          )}
          <div className="flex flex-wrap gap-x-6">
            <Filters label="Difficulty">
              {(["all", ...DIFFICULTIES] as const).map((d) => (
                <button key={d} type="button" className={chip(filters.difficulty === d)} onClick={() => changeFilters({ ...filters, difficulty: d })}>
                  {d === "all" ? "Any" : DIFF_LABEL[d]}
                </button>
              ))}
            </Filters>
            <Filters label="Answers">
              <button type="button" className={chip(multipleChoice)} onClick={() => setMultipleChoice(true)} aria-pressed={multipleChoice}>Multiple choice</button>
              <button type="button" className={chip(!multipleChoice)} onClick={() => setMultipleChoice(false)} aria-pressed={!multipleChoice}>Open answer</button>
            </Filters>
          </div>
        </div>

        <div className="border-t border-white/5 pt-4">{questionCard(false)}</div>
        {card && actions}

        <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-white/5 pt-4">
          <button type="button" onClick={openHost} className={ghostBtn}>📺 Host mode: timer + scoreboard</button>
          <p className="text-xs text-[var(--text-muted)]">{matching.length} questions match · no repeats this game</p>
        </div>
      </div>

      <div
        className={host ? "fixed inset-0 z-[100] overflow-y-auto bg-[var(--bg-primary,#05070d)]" : "hidden"}
        role="dialog"
        aria-modal="true"
        aria-label="Trivia host mode"
      >
        {host && (
          <div className="mx-auto max-w-5xl px-4 py-4 sm:py-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <p className="font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>📺 Host mode</p>
              <label className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                Timer
                <select
                  value={timer}
                  onChange={(e) => { const v = Number(e.target.value); setTimer(v); restartTimer(v); }}
                  className="rounded-lg border border-white/10 bg-transparent px-2 py-1 text-sm text-[var(--text-primary)]"
                >
                  {TIMER_OPTIONS.map((s) => <option key={s} value={s} className="bg-black">{s ? `${s}s` : "Off"}</option>)}
                </select>
              </label>
              <label className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                Teams
                <select
                  value={board.length}
                  onChange={(e) => setBoard((b) => resizeScoreboard(b, Number(e.target.value)))}
                  className="rounded-lg border border-white/10 bg-transparent px-2 py-1 text-sm text-[var(--text-primary)]"
                >
                  {Array.from({ length: MAX_TEAMS - MIN_TEAMS + 1 }, (_, i) => i + MIN_TEAMS).map((n) => (
                    <option key={n} value={n} className="bg-black">{n}</option>
                  ))}
                </select>
              </label>
              <button type="button" onClick={newGame} className="text-xs text-[var(--text-muted)] hover:text-[var(--neon-cyan)] underline">New game</button>
              <button type="button" onClick={closeHost} className={`${ghostBtn} ml-auto`} aria-label="Close host mode">✕ Close</button>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
              <div className="glass-card p-5 sm:p-8">
                {timer > 0 && card && (
                  <div className="flex items-center gap-3 mb-4">
                    <span
                      className={`text-3xl sm:text-5xl font-extrabold tabular-nums ${left === 0 ? "text-rose-400" : left <= 5 ? "text-amber-300" : "text-[var(--neon-cyan)]"}`}
                      aria-live={left <= 5 ? "assertive" : "off"}
                    >
                      {left === 0 && !revealed ? "Time!" : formatSeconds(left)}
                    </span>
                    <div className="h-2 flex-1 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full bg-[var(--neon-cyan)] transition-[width] duration-200" style={{ width: `${(left / timer) * 100}%` }} />
                    </div>
                    <button type="button" className="text-xs underline text-[var(--text-muted)]" onClick={() => (running ? setRunning(false) : left > 0 ? setRunning(true) : restartTimer(timer))}>
                      {running ? "Pause" : left > 0 ? "Resume" : "Restart"}
                    </button>
                  </div>
                )}
                {questionCard(true)}
                {card && actions}
              </div>

              <div className="glass-card p-4">
                <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-3">Scoreboard</p>
                <ul className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                  {board.map((t, i) => (
                    <li
                      key={i}
                      className={`rounded-xl border p-2.5 ${lead.includes(i) ? "border-amber-300/60 bg-amber-300/5" : "border-white/10"}`}
                    >
                      <input
                        value={t.name}
                        onChange={(e) => setBoard((b) => b.map((x, j) => (j === i ? { ...x, name: e.target.value.slice(0, 24) } : x)))}
                        aria-label={`Team ${i + 1} name`}
                        className="w-full bg-transparent text-sm font-semibold text-[var(--text-primary)] outline-none"
                      />
                      <div className="mt-1.5 flex items-center gap-2">
                        <button type="button" className={scoreBtn} onClick={() => setBoard((b) => adjustScore(b, i, -1))} aria-label={`${t.name} minus one`}>−</button>
                        <span className="flex-1 text-center text-2xl font-extrabold tabular-nums text-[var(--text-primary)]">
                          {lead.includes(i) && <span aria-label="leading">👑 </span>}{t.score}
                        </span>
                        <button type="button" className={scoreBtn} onClick={() => setBoard((b) => adjustScore(b, i, 1))} aria-label={`${t.name} plus one`}>+</button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
