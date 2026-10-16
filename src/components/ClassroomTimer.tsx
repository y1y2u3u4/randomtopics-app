"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/track";
import { BRAIN_BREAKS, TIMER_PRESETS, TIMER_ROUTINES, clock, type QuestionSource } from "@/data/classroomTimer";
import { KIDS_JOURNAL_PROMPTS, KIDS_WOULD_YOU_RATHER } from "@/data/kidsQuestions";
import { MORNING_SHARE } from "@/data/morningMeeting";

const POOLS: Record<QuestionSource, string[]> = {
  discussion: MORNING_SHARE.map((q) => q.text),
  "would-you-rather": KIDS_WOULD_YOU_RATHER.map((q) => q.text),
  journal: KIDS_JOURNAL_PROMPTS.map((q) => q.text),
  "brain-break": BRAIN_BREAKS,
};
const randomFrom = (list: string[], not?: string | null) => {
  const pool = list.length > 1 ? list.filter((x) => x !== not) : list;
  return pool[Math.floor(Math.random() * pool.length)];
};
const presetLabel = (s: number) => (s < 60 ? `${s} sec` : `${s / 60} min`);

// Three short beeps, synthesised (no audio file). The context is created on the
// first Start click so browsers allow it to play later.
function chime(ctx: AudioContext | null) {
  if (!ctx) return;
  try {
    for (let i = 0; i < 3; i++) {
      const osc = ctx.createOscillator(), gain = ctx.createGain();
      const t = ctx.currentTime + i * 0.35;
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.3);
    }
  } catch { /* audio unavailable */ }
}

const chip = (active: boolean) => `min-h-11 text-xs font-semibold px-3 sm:px-4 py-2 rounded-full border transition-all ${
  active
    ? "border-[var(--neon-cyan)]/50 bg-[rgba(0,229,255,0.1)] text-[var(--neon-cyan)]"
    : "border-white/10 text-[var(--text-muted)] hover:border-white/20 hover:text-[var(--text-primary)]"
}`;

/**
 * Classroom timer: big countdown ring, presets and custom length, routines
 * (think–pair–share, discussion, quick write, brain break, clean-up) that run
 * their phases back to back, an optional random question, a chime at the end
 * and a full-screen projector view.
 */
export default function ClassroomTimer() {
  const [routineId, setRoutineId] = useState("timer");
  const [custom, setCustom] = useState(300);
  const [phase, setPhase] = useState(0);
  const [remaining, setRemaining] = useState(300);
  const [endAt, setEndAt] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);
  const [sound, setSound] = useState(true);
  const [big, setBig] = useState(false);
  const [question, setQuestion] = useState<string | null>(null);
  const audio = useRef<AudioContext | null>(null);
  const bigRoot = useRef<HTMLDivElement>(null);

  const routine = TIMER_ROUTINES.find((r) => r.id === routineId)!;
  const phases = useMemo(() => (routine.id === "timer" ? [{ ...routine.phases[0], seconds: custom }] : routine.phases), [routine, custom]);
  const current = phases[phase];
  const running = endAt !== null;
  const source = current.question;

  const reset = useCallback((nextPhases = phases) => {
    setEndAt(null);
    setFinished(false);
    setPhase(0);
    setRemaining(nextPhases[0].seconds);
  }, [phases]);

  const chooseRoutine = (id: string) => {
    const r = TIMER_ROUTINES.find((x) => x.id === id)!;
    setRoutineId(id);
    const next = id === "timer" ? [{ ...r.phases[0], seconds: custom }] : r.phases;
    reset(next);
    const q = next[0].question;
    setQuestion(q ? randomFrom(POOLS[q]) : null);
    track("filter_select", { content_source: "classroom_timer", filter_name: "routine", filter_value: id });
  };

  const setLength = (seconds: number) => {
    const s = Math.max(5, Math.min(99 * 60, Math.round(seconds)));
    setCustom(s);
    if (routineId === "timer" && !running) { setRemaining(s); setFinished(false); setPhase(0); }
  };

  const start = useCallback(() => {
    if (!audio.current && typeof window !== "undefined" && "AudioContext" in window) {
      try { audio.current = new AudioContext(); } catch { /* no audio */ }
    }
    void audio.current?.resume?.();
    const from = finished ? phases[0].seconds : remaining;
    if (finished) { setPhase(0); setFinished(false); }
    setEndAt(Date.now() + from * 1000);
    track("timer_start", { content_source: "classroom_timer", generator_filter: routineId, value: from });
  }, [finished, phases, remaining, routineId]);

  const pause = useCallback(() => {
    if (endAt) setRemaining(Math.max(0, Math.ceil((endAt - Date.now()) / 1000)));
    setEndAt(null);
  }, [endAt]);

  const newQuestion = useCallback(() => {
    if (!source) return;
    setQuestion((q) => randomFrom(POOLS[source], q));
    track("generate_success", { tool_type: "party_question_generator", content_source: "classroom_timer", generator_filter: source, result_count: 1 });
  }, [source]);

  // Tick against a wall-clock end time, so a background tab stays accurate.
  useEffect(() => {
    if (endAt === null) return;
    const id = setInterval(() => {
      const left = Math.ceil((endAt - Date.now()) / 1000);
      if (left > 0) { setRemaining(left); return; }
      if (sound) chime(audio.current);
      if (phase < phases.length - 1) {
        const next = phase + 1;
        setPhase(next);
        setRemaining(phases[next].seconds);
        setEndAt(Date.now() + phases[next].seconds * 1000);
      } else {
        setRemaining(0);
        setEndAt(null);
        setFinished(true);
        track("timer_finish", { content_source: "classroom_timer", generator_filter: routineId });
      }
    }, 200);
    return () => clearInterval(id);
  }, [endAt, phase, phases, sound, routineId]);

  // Remaining time in the tab title while it runs.
  useEffect(() => {
    if (!running && !finished) return;
    const before = document.title;
    document.title = finished ? "⏰ Time's up! — Classroom Timer" : `${clock(remaining)} ${current.label} — Classroom Timer`;
    return () => { document.title = before; };
  }, [running, finished, remaining, current.label]);

  const openBig = useCallback(async () => {
    setBig(true);
    track("classroom_projector_open", { content_source: "classroom_timer", generator_filter: routineId });
    try { await document.documentElement.requestFullscreen?.(); } catch { /* not supported */ }
  }, [routineId]);
  const closeBig = useCallback(() => {
    setBig(false);
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === " ") { e.preventDefault(); if (running) pause(); else start(); }
      else if (e.key === "r" || e.key === "R") reset();
      else if (e.key === "f" || e.key === "F") { if (big) closeBig(); else void openBig(); }
      else if (e.key === "n" || e.key === "N") newQuestion();
      else if (e.key === "Escape" && big && !document.fullscreenElement) closeBig();
      else if ((e.key === "ArrowUp" || e.key === "ArrowDown") && routineId === "timer" && !running) { e.preventDefault(); setLength(custom + (e.key === "ArrowUp" ? 60 : -60)); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    if (!big) return;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    bigRoot.current?.focus();
    const onFs = () => { if (!document.fullscreenElement) setBig(false); };
    document.addEventListener("fullscreenchange", onFs);
    return () => { document.body.style.overflow = overflow; document.removeEventListener("fullscreenchange", onFs); };
  }, [big]);

  const total = current.seconds;
  const fraction = finished ? 0 : Math.max(0, Math.min(1, remaining / total));
  const color = finished ? "#d2405f" : fraction > 0.5 ? "#1f9d68" : fraction > 0.2 ? "#e2a100" : "#d2405f";
  const R = 90, C = 2 * Math.PI * R;

  const ring = (size: string, light: boolean) => (
    <div className={`relative mx-auto ${size}`} data-timer-ring>
      <svg viewBox="0 0 200 200" className="w-full h-full -rotate-90" aria-hidden="true">
        <circle cx="100" cy="100" r={R} fill="none" stroke={light ? "#ece6d8" : "rgba(255,255,255,0.08)"} strokeWidth="14" />
        <circle cx="100" cy="100" r={R} fill="none" stroke={color} strokeWidth="14" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C * (1 - fraction)} style={{ transition: "stroke-dashoffset 0.25s linear, stroke 0.3s" }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`font-mono font-bold tabular-nums ${finished ? "animate-pulse" : ""}`} style={{ color: finished ? color : light ? "#1b1b2f" : "var(--text-primary)", fontSize: "clamp(2.2rem, 11vw, 9rem)", lineHeight: 1 }} data-timer-display>
          {finished ? "0:00" : clock(remaining)}
        </span>
        <span className="mt-2 text-xs sm:text-base font-semibold uppercase tracking-wider" style={{ color }}>
          {finished ? "Time's up!" : phases.length > 1 ? `${current.label} · ${phase + 1}/${phases.length}` : running ? "Running" : "Ready"}
        </span>
      </div>
    </div>
  );

  const controls = (light: boolean) => {
    const ghost = light ? "border-[#d9d4c8] text-[#1b1b2f]" : "border-white/15 text-[var(--text-primary)]";
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <button type="button" onClick={running ? pause : start} className={light ? "rounded-xl px-6 py-3 text-lg font-bold text-white bg-[#1f9d68]" : "btn-generate"} data-timer-start>
          {running ? "⏸ Pause" : finished ? "↻ Again" : remaining < phases[phase].seconds ? "▶ Resume" : "▶ Start"}
        </button>
        <button type="button" onClick={() => reset()} className={`min-h-11 rounded-xl border px-4 py-2 text-sm font-semibold ${ghost}`}>Reset</button>
        {source && <button type="button" onClick={newQuestion} className={`min-h-11 rounded-xl border px-4 py-2 text-sm font-semibold ${ghost}`}>🎲 New {source === "brain-break" ? "activity" : "question"}</button>}
        <button type="button" onClick={() => setSound((s) => !s)} aria-pressed={sound} className={`min-h-11 rounded-xl border px-4 py-2 text-sm font-semibold ${ghost}`}>{sound ? "🔔 Sound on" : "🔕 Sound off"}</button>
      </div>
    );
  };

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-16">
      <div className="text-center mb-8">
        <h1 className="section-heading text-4xl sm:text-6xl font-extrabold mb-4" style={{ fontFamily: "var(--font-display)" }}>Classroom Timer</h1>
        <p className="text-[var(--text-muted)] max-w-xl mx-auto">A big, free countdown for the board — plus ready-made routines like think–pair–share that run each step for you, with a question to talk about. Full screen, nothing to install, no sign-up.</p>
      </div>

      <div className="glass-card p-5 sm:p-10" data-classroom-timer-tool>
        <div className="flex flex-wrap justify-center gap-2" role="group" aria-label="Routine">
          {TIMER_ROUTINES.map((r) => (
            <button key={r.id} type="button" onClick={() => chooseRoutine(r.id)} aria-pressed={routineId === r.id} className={chip(routineId === r.id)} disabled={running}>{r.emoji} {r.name}</button>
          ))}
        </div>
        <p className="mt-3 text-center text-xs text-[var(--text-muted)]">{routine.summary}</p>

        {routineId === "timer" && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            {TIMER_PRESETS.map((s) => (
              <button key={s} type="button" onClick={() => setLength(s)} disabled={running} aria-pressed={custom === s} className={chip(custom === s)}>{presetLabel(s)}</button>
            ))}
            <label className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <span className="sr-only">Minutes</span>
              <input type="number" min={0} max={99} value={Math.floor(custom / 60)} disabled={running} onChange={(e) => setLength(Number(e.target.value) * 60 + (custom % 60))}
                className="w-14 rounded-lg border border-white/15 bg-transparent px-2 py-2 text-center text-[var(--text-primary)]" aria-label="Minutes" /> min
            </label>
            <label className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
              <input type="number" min={0} max={59} step={5} value={custom % 60} disabled={running} onChange={(e) => setLength(Math.floor(custom / 60) * 60 + Number(e.target.value))}
                className="w-14 rounded-lg border border-white/15 bg-transparent px-2 py-2 text-center text-[var(--text-primary)]" aria-label="Seconds" /> sec
            </label>
          </div>
        )}

        <div className="mt-6">{ring("w-64 h-64 sm:w-80 sm:h-80", false)}</div>
        {(current.instruction || question) && (
          <div className="mt-5 text-center space-y-2" aria-live="polite">
            {current.instruction && <p className="text-sm text-[var(--text-secondary)]">{current.instruction}</p>}
            {source && question && <p className="text-lg sm:text-xl font-semibold text-[var(--text-primary)]" data-timer-question>{question}</p>}
          </div>
        )}
        <div className="mt-6">{controls(false)}</div>
        <div className="mt-4 flex justify-center">
          <button type="button" onClick={() => void openBig()} data-projector-open className="min-h-11 rounded-xl border border-[var(--neon-cyan)]/40 px-5 py-3 text-sm font-semibold text-[var(--neon-cyan)] hover:bg-[rgba(0,229,255,0.08)]">📺 Full screen for the board (F)</button>
        </div>
        <p className="mt-4 text-center text-xs text-[var(--text-muted)]">Space start / pause · R reset · F full screen · N new question · ↑ ↓ change minutes</p>
      </div>

      {big && (
        <div ref={bigRoot} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Classroom timer — full screen"
          className="fixed inset-0 z-[100] flex flex-col overflow-y-auto overflow-x-hidden bg-[#fffdf8] text-[#1b1b2f] outline-none" style={{ borderLeft: `12px solid ${color}` }} data-classroom-projector="classroom_timer">
          <header className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-10 pt-4 text-sm text-[#5b5b70]">
            <span className="font-semibold">{routine.emoji} {routine.name}</span>
            <button type="button" onClick={closeBig} className="rounded-lg border border-[#d9d4c8] px-3 py-1.5">Close ✕</button>
          </header>
          <main className="flex-1 flex flex-col items-center justify-center gap-6 px-4 py-6 text-center">
            {ring("w-[min(78vw,62vh)] h-[min(78vw,62vh)]", true)}
            {current.instruction && <p className="text-lg sm:text-3xl text-[#5b5b70] max-w-4xl">{current.instruction}</p>}
            {source && question && <p className="font-bold leading-tight max-w-5xl break-words" style={{ fontSize: "clamp(1.5rem, 3.6vw, 3.4rem)" }}>{question}</p>}
          </main>
          <div className="px-4 pb-6">{controls(true)}</div>
        </div>
      )}
    </section>
  );
}
