"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PrintButton from "./PrintButton";
import { CHARADES_WORDS, CHARADES_CATEGORIES, type CharadesCategory, type CharadesWord } from "@/data/charades";
import { drawUnseen } from "@/lib/topicPool";
import { track } from "@/lib/track";

const DIFFICULTIES = [{ id: 0, label: "Any" }, { id: 1, label: "Easy" }, { id: 2, label: "Medium" }, { id: 3, label: "Hard" }] as const;
const TIMER_OPTIONS = [0, 30, 60, 90, 120] as const;
const eventParams = { tool_type: "charades_generator", content_source: "charades_hub", locale: "en" };
const buttonClass = "min-h-11 rounded-xl border px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--neon-cyan)]";
const idleClass = "border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/40";
const selectedClass = "border-[var(--neon-cyan)] bg-[rgba(0,229,255,0.08)] text-[var(--neon-cyan)]";

export default function CharadesGenerator() {
  const [category, setCategory] = useState<CharadesCategory | "all">("all");
  const [difficulty, setDifficulty] = useState<0 | 1 | 2 | 3>(0);
  const [timerLength, setTimerLength] = useState(60);
  const [current, setCurrent] = useState<CharadesWord | null>(null);
  const [hidden, setHidden] = useState(false);
  const [usedKeys, setUsedKeys] = useState<Set<string>>(new Set());
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [timerState, setTimerState] = useState<"ready" | "running" | "paused" | "complete">("ready");
  const deadline = useRef<number | null>(null);
  const remainingMs = useRef(60_000);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  const pool = useMemo(() => CHARADES_WORDS.filter((word) =>
    (category === "all" || word.c === category) && (difficulty === 0 || word.d === difficulty)), [category, difficulty]);
  const categoryWords = useMemo(() => CHARADES_WORDS.filter((word) => category === "all" || word.c === category), [category]);

  const clearClock = useCallback(() => {
    if (interval.current !== null) clearInterval(interval.current);
    interval.current = null;
    deadline.current = null;
  }, []);
  const resetTimer = useCallback((seconds: number) => {
    clearClock();
    remainingMs.current = seconds * 1000;
    setSecondsLeft(seconds);
    setTimerState("ready");
  }, [clearClock]);
  const tick = useCallback(() => {
    if (deadline.current === null) return;
    remainingMs.current = Math.max(0, deadline.current - Date.now());
    setSecondsLeft(Math.ceil(remainingMs.current / 1000));
    if (remainingMs.current === 0) {
      clearClock();
      setTimerState("complete");
      track("timer_complete", { ...eventParams, timer_seconds: timerLength });
    }
  }, [clearClock, timerLength]);
  useEffect(() => {
    document.addEventListener("visibilitychange", tick);
    return () => { clearClock(); document.removeEventListener("visibilitychange", tick); };
  }, [clearClock, tick]);

  const startTimer = () => {
    if (!current || !timerLength || deadline.current !== null) return;
    if (timerState === "complete") remainingMs.current = timerLength * 1000;
    deadline.current = Date.now() + remainingMs.current;
    setSecondsLeft(Math.ceil(remainingMs.current / 1000));
    setTimerState("running");
    setHidden(true);
    interval.current = setInterval(tick, 250);
    track(timerState === "paused" ? "timer_resume" : "timer_start", { ...eventParams, timer_seconds: timerLength });
  };
  const pauseTimer = () => {
    tick();
    if (deadline.current === null) return; // An overdue pause completes once.
    clearClock();
    setTimerState("paused");
    track("timer_pause", { ...eventParams, timer_seconds: timerLength });
  };
  const changeCategory = (next: CharadesCategory | "all") => {
    setCategory(next);
    track("filter_select", { ...eventParams, filter_name: "category", filter_value: next });
  };
  const changeDifficulty = (next: 0 | 1 | 2 | 3) => {
    setDifficulty(next);
    track("filter_select", { ...eventParams, filter_name: "difficulty", filter_value: next });
  };
  const deal = () => {
    if (!pool.length) return;
    const params = { ...eventParams, generator_category: category, generator_difficulty: difficulty || "any", requested_count: 1 };
    track("generate_start", params);
    if (current) track("repeat_generate", params);
    const draw = drawUnseen(pool, usedKeys, (word) => word.w);
    const pick = draw.picked[0];
    setUsedKeys(draw.used);
    setCurrent(pick);
    setHidden(false);
    resetTimer(timerLength);
    track("generate_success", { ...params, result_category: pick.c, result_difficulty: pick.d, result_count: 1, result_source: "editorial_pool" });
  };
  const remaining = pool.filter((word) => !usedKeys.has(word.w)).length;
  const resultCategory = CHARADES_CATEGORIES.find((item) => item.id === current?.c);
  const timeUp = timerState === "complete";

  return (
    <section id="charades-generator" aria-label="Charades word generator" className="max-w-3xl mx-auto px-4 sm:px-6 scroll-mt-24">
      <div className="glass-card p-5 sm:p-8">
        <fieldset>
          <legend className="mb-2 text-xs uppercase tracking-widest text-[var(--text-muted)]">Category</legend>
          <div className="mb-5 flex flex-wrap gap-2">
            <button type="button" aria-pressed={category === "all"} onClick={() => changeCategory("all")} className={`${buttonClass} ${category === "all" ? selectedClass : idleClass}`}>All</button>
            {CHARADES_CATEGORIES.map((item) => <button type="button" key={item.id} aria-pressed={category === item.id} onClick={() => changeCategory(item.id)} className={`${buttonClass} ${category === item.id ? selectedClass : idleClass}`}>{item.emoji} {item.label}</button>)}
          </div>
        </fieldset>
        <div className="mb-5 flex flex-col gap-4 sm:flex-row">
          <fieldset>
            <legend className="mb-2 text-xs uppercase tracking-widest text-[var(--text-muted)]">Difficulty</legend>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTIES.map((item) => {
                const count = categoryWords.filter((word) => !item.id || word.d === item.id).length;
                return <button type="button" key={item.id} aria-pressed={difficulty === item.id} disabled={!count} onClick={() => changeDifficulty(item.id)} className={`${buttonClass} ${difficulty === item.id ? selectedClass : idleClass} disabled:opacity-40 disabled:cursor-not-allowed`}>{item.label}{!count ? " (0)" : ""}</button>;
              })}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-xs uppercase tracking-widest text-[var(--text-muted)]">Round timer</legend>
            <div className="flex flex-wrap gap-2">
              {TIMER_OPTIONS.map((seconds) => <button type="button" key={seconds} aria-pressed={timerLength === seconds} onClick={() => {
                setTimerLength(seconds); resetTimer(seconds);
                track("timer_preset_select", { ...eventParams, timer_seconds: seconds });
              }} className={`${buttonClass} ${timerLength === seconds ? selectedClass : idleClass}`}>{seconds ? `${seconds}s` : "Off"}</button>)}
            </div>
          </fieldset>
        </div>
        <p className="mb-4 text-xs leading-relaxed text-[var(--text-muted)]">Filters apply to your next word. Changing filters keeps your current word, timer and seen-word history. Unavailable difficulty levels are disabled.</p>
        {!pool.length && <div role="status" className="mb-4 rounded-xl border border-amber-300/30 bg-amber-300/5 p-4">
          <p className="text-sm">No words match this category and difficulty. Your current word is unchanged.</p>
          <button type="button" onClick={() => changeDifficulty(0)} className={`${buttonClass} ${idleClass} mt-3`}>Use any difficulty</button>
        </div>}
        <div className={`rounded-2xl border p-6 sm:p-10 text-center ${timeUp ? "border-[var(--neon-pink)]/60 bg-[rgba(255,45,120,0.06)]" : "border-white/10 bg-white/[0.02]"}`}>
          <div aria-live="polite" className="flex min-h-28 flex-col items-center justify-center gap-3">
            {current ? <>
              <p className="text-xs uppercase tracking-widest text-[var(--neon-cyan)]">{hidden ? "Word hidden from the group" : "For the actor only"}</p>
              <p data-charades-result="true" className="break-words text-3xl sm:text-5xl font-extrabold leading-tight" style={{ fontFamily: "var(--font-display)" }}>{hidden ? "Ready to act?" : current.w}</p>
              {!hidden && <p className="text-xs text-[var(--text-muted)]">{resultCategory?.emoji} {resultCategory?.label} · {DIFFICULTIES[current.d].label}</p>}
            </> : <p className="text-lg text-[var(--text-muted)]">Pass the screen to the actor, then deal a word 🎭</p>}
          </div>
          {current && <button type="button" aria-pressed={hidden} onClick={() => {
            setHidden(!hidden); track(hidden ? "charades_word_reveal" : "charades_word_hide", eventParams);
          }} className={`${buttonClass} ${idleClass} mt-4`}>{hidden ? "Reveal word" : "Hide word"}</button>}
          {current && timerLength > 0 && <div className="mx-auto mt-5 max-w-sm">
            <div className="h-2 overflow-hidden rounded-full bg-white/10" aria-hidden="true"><div className={`h-full ${secondsLeft <= 10 ? "bg-[var(--neon-pink)]" : "bg-[var(--neon-cyan)]"}`} style={{ width: `${secondsLeft / timerLength * 100}%` }} /></div>
            <p role="timer" aria-label="Time remaining" aria-live="off" className="mt-2 text-3xl font-bold tabular-nums">{secondsLeft}s</p>
            <p role="status" className="mt-1 text-sm text-[var(--text-muted)]">{timeUp ? "Time’s up!" : timerState === "paused" ? "Paused" : timerState === "running" ? "Act silently. Your team guesses." : "Read your word first. Start when ready."}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {timerState === "running" ? <button type="button" onClick={pauseTimer} className={`${buttonClass} ${selectedClass}`}>Pause timer</button> : <button type="button" onClick={startTimer} className={`${buttonClass} ${selectedClass}`}>{timerState === "paused" ? "Resume timer" : timeUp ? "Restart timer" : "Start round"}</button>}
              {timerState !== "ready" && <button type="button" onClick={() => { resetTimer(timerLength); track("timer_reset", { ...eventParams, timer_seconds: timerLength }); }} className={`${buttonClass} ${idleClass}`}>Reset timer</button>}
            </div>
            <p className="mt-3 text-xs text-[var(--text-muted)]">Starting hides the word. Reveal it again whenever the actor needs a reminder.</p>
          </div>}
          {current && !timerLength && <p className="mt-4 text-sm text-[var(--text-muted)]">Timer off — play at your own pace.</p>}
        </div>
        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button type="button" onClick={deal} className="btn-generate disabled:opacity-40" disabled={!pool.length}>🎭 {current ? "Next Word" : "Deal a Word"}</button>
          {pool.length > 0 && <PrintButton heading="Charades Words" items={pool.map((word) => `${word.w} — ${DIFFICULTIES[word.d].label}`)} intro={`${pool.length} words · ${category === "all" ? "All categories" : CHARADES_CATEGORIES.find((item) => item.id === category)?.label} · ${DIFFICULTIES[difficulty].label} difficulty. Print and cut into cards.`} label="Print this deck" />}
        </div>
        <p className="mt-4 text-center text-xs text-[var(--text-muted)]">{pool.length} words in this deck · {remaining} unseen · {remaining ? "no repeats before reshuffle" : pool.length ? "next draw reshuffles this deck" : "choose another difficulty"}</p>
        <p className="mt-3 text-center"><a href="#charades-word-bank" className="inline-flex min-h-11 items-center text-sm text-[var(--neon-cyan)] underline underline-offset-4">Browse all {CHARADES_WORDS.length} words by category ↓</a></p>
      </div>
    </section>
  );
}
