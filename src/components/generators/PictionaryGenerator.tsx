"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { drawUnseen } from "@/lib/topicPool";
import ClassroomProjector from "@/components/ClassroomProjector";
import {
  PICTIONARY_PHRASES, PICTIONARY_THEMES, PICTIONARY_WORDS, levelLabel, wordsIn,
  type PictionaryEntry, type PictionaryLevel, type PictionaryTheme,
} from "@/data/pictionary";

const TIMERS = [0, 30, 60, 90];
const button = "min-h-11 rounded-xl border px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--neon-cyan)]";
const idle = "border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/40";
const selected = "border-[var(--neon-cyan)] bg-[rgba(0,229,255,0.08)] text-[var(--neon-cyan)]";
const label = "block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2";

// Random Pictionary word / phrase picker: theme and difficulty chips, no
// repeats until the pool runs out, a hide-from-the-team flow for the drawer,
// a round timer, two-team scoring and a projector view for classrooms.
export default function PictionaryGenerator({ mode = "word" }: { mode?: "word" | "phrase" }) {
  const list = mode === "phrase" ? PICTIONARY_PHRASES : PICTIONARY_WORDS;
  const ev = useMemo(() => ({ tool_type: `pictionary_${mode}`, locale: "en" }), [mode]);
  const [theme, setTheme] = useState<PictionaryTheme | "all">("all");
  const [level, setLevel] = useState<PictionaryLevel | 0>(0);
  const [timer, setTimer] = useState(60);
  const [current, setCurrent] = useState<PictionaryEntry | null>(null);
  const [hidden, setHidden] = useState(false);
  const [used, setUsed] = useState<Set<string>>(new Set());
  const [left, setLeft] = useState(0);
  const [running, setRunning] = useState(false);
  const [score, setScore] = useState<[number, number]>([0, 0]);
  const [team, setTeam] = useState<0 | 1>(0);
  const [deck, setDeck] = useState<string[] | null>(null);
  const [flash, setFlash] = useState(false);
  const deadline = useRef(0);

  const pool = useMemo(() => wordsIn(list, theme, level), [list, theme, level]);
  const remaining = pool.filter((e) => !used.has(e.w)).length;

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      const s = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
      setLeft(s);
      if (!s) { setRunning(false); track("timer_complete", { ...ev, timer_seconds: timer }); }
    }, 250);
    return () => clearInterval(id);
  }, [running, ev, timer]);

  const deal = () => {
    if (!pool.length) return;
    const draw = drawUnseen(pool, used, (e) => e.w);
    setUsed(draw.used);
    setCurrent(draw.picked[0]);
    setHidden(false);
    setRunning(false);
    setLeft(timer);
    track("generate_success", { ...ev, generator_category: theme, generator_difficulty: level || "any", result_count: 1 });
  };
  const start = () => {
    if (!timer) return;
    deadline.current = Date.now() + (left || timer) * 1000;
    setLeft(left || timer);
    setHidden(true);
    setRunning(true);
    track("timer_start", { ...ev, timer_seconds: timer });
  };
  const point = () => {
    setScore((s) => (team === 0 ? [s[0] + 1, s[1]] : [s[0], s[1] + 1]));
    setTeam((t) => (t === 0 ? 1 : 0));
    setRunning(false);
    track("score_point", ev);
  };
  const project = () => {
    const d = drawUnseen(pool, new Set(), (e) => e.w, Math.min(30, pool.length)).picked.map((e) => e.w);
    setDeck(d);
    track("projector_open", { ...ev, deck_size: d.length });
  };
  const copy = async () => {
    if (!current || !(await copyText(current.w))) return;
    setFlash(true);
    setTimeout(() => setFlash(false), 1500);
    track("copy_result", ev);
  };
  const themeInfo = PICTIONARY_THEMES.find((t) => t.id === current?.t);
  const noun = mode === "phrase" ? "phrase" : "word";
  const timeUp = Boolean(timer && current && !running && left === 0);

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-5 sm:p-8">
        <span className={label}>Theme</span>
        <div className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={theme === "all"} onClick={() => setTheme("all")} className={`${button} ${theme === "all" ? selected : idle}`}>🎲 All</button>
          {PICTIONARY_THEMES.map((t) => (
            <button type="button" key={t.id} aria-pressed={theme === t.id} onClick={() => setTheme(t.id)} className={`${button} ${theme === t.id ? selected : idle}`}>{t.emoji} {t.label}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <div>
            <span className={label}>Difficulty</span>
            <div className="flex flex-wrap gap-2">
              {([0, 1, 2, 3] as const).map((d) => (
                <button type="button" key={d} aria-pressed={level === d} onClick={() => setLevel(d)} className={`${button} ${level === d ? selected : idle}`}>{d ? levelLabel(d) : "Any"}</button>
              ))}
            </div>
          </div>
          <div>
            <span className={label}>Round timer</span>
            <div className="flex flex-wrap gap-2">
              {TIMERS.map((s) => (
                <button type="button" key={s} aria-pressed={timer === s} onClick={() => { setTimer(s); setRunning(false); setLeft(s); }} className={`${button} ${timer === s ? selected : idle}`}>{s ? `${s}s` : "Off"}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button type="button" onClick={deal} className="btn-generate" data-pictionary-generate>
            <span aria-hidden="true">✏️</span> {current ? `Next ${noun}` : `Get a ${noun}`}
          </button>
          <button type="button" onClick={project} className={`${button} ${idle}`} data-pictionary-projector>📽 Projector mode</button>
        </div>
        <p className="text-xs text-[var(--text-muted)] text-center mt-3">{pool.length} {noun}s in this mix · {remaining} not drawn yet · no repeats until the mix runs out</p>

        <div aria-live="polite" className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center min-h-44 flex flex-col items-center justify-center" data-pictionary-result>
          {current ? (
            <>
              <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{themeInfo?.emoji} {themeInfo?.label} · {levelLabel(current.d)}</p>
              <p className="mt-2 text-4xl sm:text-6xl font-extrabold gradient-text break-words max-w-full" style={{ fontFamily: "var(--font-display)" }}>
                {hidden ? "• • •" : current.w}
              </p>
              {timer > 0 && <p className={`mt-3 text-3xl font-bold tabular-nums ${timeUp ? "text-[var(--neon-pink)]" : "text-[var(--text-primary)]"}`}>{timeUp ? "Time's up!" : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`}</p>}
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <button type="button" onClick={() => setHidden((h) => !h)} className={`${button} ${idle}`}>{hidden ? "Show again" : "Hide from team"}</button>
                {timer > 0 && !running && !timeUp && <button type="button" onClick={start} className={`${button} ${selected}`}>Start {timer}s</button>}
                {running && <button type="button" onClick={() => setRunning(false)} className={`${button} ${selected}`}>Pause</button>}
                <button type="button" onClick={copy} className={`${button} ${idle}`}>{flash ? "Copied ✓" : "Copy"}</button>
              </div>
            </>
          ) : (
            <p className="text-[var(--text-secondary)]">Pick a theme and difficulty, then press the button. Turn the screen to the drawer only.</p>
          )}
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3" data-pictionary-score>
          {(["Team A", "Team B"] as const).map((name, i) => (
            <div key={name} className={`rounded-xl border p-3 text-center ${team === i ? "border-[var(--neon-cyan)]" : "border-white/10"}`}>
              <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">{name}{team === i ? " · drawing" : ""}</p>
              <p className="text-3xl font-bold tabular-nums text-[var(--text-primary)]">{score[i]}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2 mt-3">
          <button type="button" onClick={point} disabled={!current} className={`${button} ${selected} disabled:opacity-40`}>✓ Guessed — point to Team {team === 0 ? "A" : "B"}</button>
          <button type="button" onClick={() => { setTeam((t) => (t === 0 ? 1 : 0)); setRunning(false); }} className={`${button} ${idle}`}>Pass turn</button>
          <button type="button" onClick={() => { setScore([0, 0]); setTeam(0); }} className={`${button} ${idle}`}>Reset score</button>
        </div>
      </div>
      {deck && <ClassroomProjector deck={deck} title={mode === "phrase" ? "Pictionary phrases" : "Pictionary words"} source={`pictionary_${mode}`} color="#2f6fd6" onClose={() => setDeck(null)} />}
    </section>
  );
}
