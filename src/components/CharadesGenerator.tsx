"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PrintButton from "./PrintButton";
import { CHARADES_WORDS, CHARADES_CATEGORIES, type CharadesCategory } from "@/data/charades";
import { CHARADES_WORDS_ES, CHARADES_CATEGORIES_ES } from "@/data/charades.es";
import { CHRISTMAS_CHARADES_WORDS, CHRISTMAS_CHARADES_CATEGORIES } from "@/data/charadesChristmas";
import { drawUnseen } from "@/lib/topicPool";
import { track } from "@/lib/track";

const TIMER_OPTIONS = [0, 30, 60, 90, 120] as const;
const TEAM_OPTIONS = [0, 2, 3, 4] as const;
// One-tap decks for the most-searched charades themes.
const QUICK_DECKS = [
  { id: "movies", category: "movies", difficulty: 0 },
  { id: "animals", category: "animals", difficulty: 0 },
  { id: "kids", category: "kids-family", difficulty: 1 },
  { id: "actions", category: "actions", difficulty: 0 },
  { id: "hard", category: "all", difficulty: 3 },
] as const;

const UI = {
  en: {
    difficulties: ["Any", "Easy", "Medium", "Hard"], category: "Category", all: "All", difficulty: "Difficulty", timer: "Round timer", off: "Off",
    filtersNote: "Filters apply to your next word. Changing filters keeps your current word, timer and seen-word history. Unavailable difficulty levels are disabled.",
    noMatch: "No words match this category and difficulty. Your current word is unchanged.", anyDifficulty: "Use any difficulty",
    hiddenLabel: "Word hidden from the group", actorOnly: "For the actor only", readyToAct: "Ready to act?", empty: "Pass the screen to the actor, then deal a word 🎭",
    reveal: "Reveal word", hide: "Hide word", timeLeft: "Time remaining", timeUp: "Time’s up!", paused: "Paused", running: "Act silently. Your team guesses.", ready: "Read your word first. Start when ready.",
    pause: "Pause timer", resume: "Resume timer", restart: "Restart timer", start: "Start round", reset: "Reset timer",
    hideNote: "Starting hides the word. Reveal it again whenever the actor needs a reminder.", timerOff: "Timer off — play at your own pace.",
    next: "Next Word", deal: "Deal a Word", printHeading: "Charades Words", printLabel: "Print this deck", allCategories: "All categories",
    printIntro: (n: number, cat: string, diff: string) => `${n} words · ${cat} · ${diff} difficulty. Print and cut into cards.`,
    deckLine: (n: number, left: number) => `${n} words in this deck · ${left} unseen · ${left ? "no repeats before reshuffle" : n ? "next draw reshuffles this deck" : "choose another difficulty"}`,
    browse: (n: number) => `Browse all ${n} words by category ↓`, aria: "Charades word generator",
    quick: "Quick decks", quickLabels: { movies: "🎬 Movies", animals: "🐾 Animals", kids: "🧒 Kids", actions: "🏃 Actions", hard: "🔥 Hard" },
    teamsLabel: "Teams & scoring", teamNames: ["Team A", "Team B", "Team C", "Team D"],
    turnOf: (team: string) => `${team} is up`, gotIt: (team: string) => `✓ Got it · +1 ${team}`, missed: "✗ Missed / pass",
    scored: (team: string) => `Point to ${team}! Deal the next word for the next team.`, noPoint: (team: string) => `No point for ${team}. Next team’s turn.`,
    resetScores: "Reset scores", leader: (team: string, n: number) => `${team} leads with ${n}`,
    fullscreen: "⛶ Fullscreen big text", exitFullscreen: "Exit fullscreen",
  },
  es: {
    difficulties: ["Cualquiera", "Fácil", "Media", "Difícil"], category: "Categoría", all: "Todas", difficulty: "Dificultad", timer: "Tiempo por ronda", off: "Sin tiempo",
    filtersNote: "Los filtros se aplican a la siguiente palabra. Cambiarlos no borra la palabra actual, el cronómetro ni el historial. Los niveles sin palabras aparecen desactivados.",
    noMatch: "No hay palabras con esta categoría y dificultad. Tu palabra actual no cambia.", anyDifficulty: "Usar cualquier dificultad",
    hiddenLabel: "Palabra oculta para el grupo", actorOnly: "Solo para quien actúa", readyToAct: "¿Listo para actuar?", empty: "Pasa la pantalla a quien actúa y saca una palabra 🎭",
    reveal: "Mostrar palabra", hide: "Ocultar palabra", timeLeft: "Tiempo restante", timeUp: "¡Se acabó el tiempo!", paused: "En pausa", running: "Actúa sin hablar. Tu equipo adivina.", ready: "Lee tu palabra primero. Empieza cuando quieras.",
    pause: "Pausar", resume: "Reanudar", restart: "Reiniciar", start: "Empezar ronda", reset: "Poner a cero",
    hideNote: "Al empezar se oculta la palabra. Puedes volver a mostrarla si quien actúa la necesita.", timerOff: "Sin cronómetro: jugad a vuestro ritmo.",
    next: "Otra palabra", deal: "Sacar palabra", printHeading: "Palabras para mímica", printLabel: "Imprimir tarjetas", allCategories: "Todas las categorías",
    printIntro: (n: number, cat: string, diff: string) => `${n} palabras · ${cat} · dificultad: ${diff}. Imprime y recorta en tarjetas.`,
    deckLine: (n: number, left: number) => `${n} palabras en este mazo · ${left} sin salir · ${left ? "sin repetir hasta barajar" : n ? "la próxima vez se baraja de nuevo" : "elige otra dificultad"}`,
    browse: (n: number) => `Ver las ${n} palabras por categoría ↓`, aria: "Generador de palabras para mímica",
    quick: "Mazos rápidos", quickLabels: { movies: "🎬 Películas", animals: "🐾 Animales", kids: "🧒 Niños", actions: "🏃 Acciones", hard: "🔥 Difícil" },
    teamsLabel: "Equipos y puntos", teamNames: ["Equipo A", "Equipo B", "Equipo C", "Equipo D"],
    turnOf: (team: string) => `Le toca a ${team}`, gotIt: (team: string) => `✓ Acertado · +1 ${team}`, missed: "✗ Fallado / pasar",
    scored: (team: string) => `¡Punto para ${team}! Saca otra palabra para el siguiente equipo.`, noPoint: (team: string) => `Sin punto para ${team}. Turno del siguiente equipo.`,
    resetScores: "Poner puntos a cero", leader: (team: string, n: number) => `${team} va ganando con ${n}`,
    fullscreen: "⛶ Pantalla completa", exitFullscreen: "Salir de pantalla completa",
  },
} as const;
const buttonClass = "min-h-11 rounded-xl border px-3 py-2 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--neon-cyan)]";
const idleClass = "border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/40";
const selectedClass = "border-[var(--neon-cyan)] bg-[rgba(0,229,255,0.08)] text-[var(--neon-cyan)]";

// Stable per-locale references so memoized callbacks don't change identity.
const DATA = {
  en: { words: CHARADES_WORDS, categories: CHARADES_CATEGORIES, eventParams: { tool_type: "charades_generator", content_source: "charades_hub", locale: "en" } },
  es: { words: CHARADES_WORDS_ES, categories: CHARADES_CATEGORIES_ES, eventParams: { tool_type: "charades_generator", content_source: "charades_hub", locale: "es" } },
};
// Seasonal decks replace the word list and categories and hide the quick decks.
const DECKS = {
  christmas: { words: CHRISTMAS_CHARADES_WORDS, categories: CHRISTMAS_CHARADES_CATEGORIES, eventParams: { tool_type: "charades_generator", content_source: "charades_christmas", locale: "en" } },
};
type Category = CharadesCategory | (typeof CHRISTMAS_CHARADES_CATEGORIES)[number]["id"];
type Word = { w: string; c: Category; d: 1 | 2 | 3 };

export default function CharadesGenerator({ locale = "en", deck }: { locale?: "en" | "es"; deck?: keyof typeof DECKS } = {}) {
  const t = UI[locale];
  const { words: WORDS, categories: CATEGORIES, eventParams } = (deck ? DECKS[deck] : DATA[locale]) as {
    words: readonly Word[];
    categories: readonly { id: Category; label: string; emoji: string }[];
    eventParams: Record<string, string>;
  };
  const DIFFICULTIES = t.difficulties.map((label, id) => ({ id: id as 0 | 1 | 2 | 3, label }));
  const [category, setCategory] = useState<Category | "all">("all");
  const [difficulty, setDifficulty] = useState<0 | 1 | 2 | 3>(0);
  const [timerLength, setTimerLength] = useState(60);
  const [current, setCurrent] = useState<Word | null>(null);
  const [hidden, setHidden] = useState(false);
  const [usedKeys, setUsedKeys] = useState<Set<string>>(new Set());
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [timerState, setTimerState] = useState<"ready" | "running" | "paused" | "complete">("ready");
  const deadline = useRef<number | null>(null);
  const remainingMs = useRef(60_000);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);
  const [teamCount, setTeamCount] = useState(2);
  const [scores, setScores] = useState([0, 0, 0, 0]);
  const [turn, setTurn] = useState(0);
  const [turnDone, setTurnDone] = useState(false);
  const [turnNote, setTurnNote] = useState("");
  const [big, setBig] = useState(false);

  const pool = useMemo(() => WORDS.filter((word) =>
    (category === "all" || word.c === category) && (difficulty === 0 || word.d === difficulty)), [WORDS, category, difficulty]);
  const categoryWords = useMemo(() => WORDS.filter((word) => category === "all" || word.c === category), [WORDS, category]);

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
  }, [clearClock, eventParams, timerLength]);
  useEffect(() => {
    document.addEventListener("visibilitychange", tick);
    return () => { clearClock(); document.removeEventListener("visibilitychange", tick); };
  }, [clearClock, tick]);

  // Big-text stage: a fixed overlay (works everywhere) plus the browser's
  // Fullscreen API where it is allowed. Esc or leaving fullscreen closes it.
  const exitBig = useCallback(() => {
    setBig(false);
    if (typeof document !== "undefined" && document.fullscreenElement) document.exitFullscreen?.().catch(() => {});
  }, []);
  useEffect(() => {
    if (!big) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") exitBig(); };
    const onChange = () => { if (!document.fullscreenElement) setBig(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("fullscreenchange", onChange);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("fullscreenchange", onChange);
      document.body.style.overflow = "";
    };
  }, [big, exitBig]);
  const enterBig = () => {
    setBig(true);
    document.documentElement.requestFullscreen?.().catch(() => {});
    track("fullscreen_open", eventParams);
  };
  const teamName = (index: number) => t.teamNames[index];
  const endTurn = (scored: boolean) => {
    if (!current || turnDone) return;
    clearClock();
    remainingMs.current = timerLength * 1000;
    setSecondsLeft(timerLength);
    setTimerState("ready");
    setHidden(false);
    setTurnDone(true);
    if (!teamCount) return;
    if (scored) setScores((prev) => prev.map((value, index) => index === turn ? value + 1 : value));
    setTurnNote(scored ? t.scored(teamName(turn)) : t.noPoint(teamName(turn)));
    setTurn((prev) => (prev + 1) % teamCount);
    track(scored ? "score_point" : "charades_pass", { ...eventParams, team_count: teamCount });
  };

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
  const changeCategory = (next: Category | "all") => {
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
    setTurnDone(false);
    setTurnNote("");
    resetTimer(timerLength);
    track("generate_success", { ...params, result_category: pick.c, result_difficulty: pick.d, result_count: 1, result_source: "editorial_pool" });
  };
  const remaining = pool.filter((word) => !usedKeys.has(word.w)).length;
  const resultCategory = CATEGORIES.find((item) => item.id === current?.c);
  const timeUp = timerState === "complete";
  const best = Math.max(...scores.slice(0, teamCount || 1));
  const leaderIndex = scores.indexOf(best);
  const scoreboard = teamCount > 0 && <div data-charades-scoreboard className="mb-4 flex flex-wrap items-center justify-center gap-2">
    {scores.slice(0, teamCount).map((score, index) => <span key={index} className={`rounded-xl border px-3 py-2 text-sm tabular-nums ${index === turn ? selectedClass : "border-white/10 text-[var(--text-secondary)]"}`}>{teamName(index)} <strong className="text-lg">{score}</strong></span>)}
    <button type="button" onClick={() => { setScores([0, 0, 0, 0]); setTurn(0); setTurnNote(""); track("score_reset", eventParams); }} className={`${buttonClass} ${idleClass}`}>{t.resetScores}</button>
  </div>;

  return (
    <section id="charades-generator" aria-label={t.aria} className="max-w-3xl mx-auto px-4 sm:px-6 scroll-mt-24">
      <div className="glass-card p-5 sm:p-8">
        {!deck && <fieldset>
          <legend className="mb-2 text-xs uppercase tracking-widest text-[var(--text-muted)]">{t.quick}</legend>
          <div className="mb-5 flex flex-wrap gap-2" data-charades-quick>
            {QUICK_DECKS.map((deck) => {
              const on = category === deck.category && difficulty === deck.difficulty;
              return <button type="button" key={deck.id} aria-pressed={on} onClick={() => {
                setCategory(deck.category); setDifficulty(deck.difficulty);
                track("filter_select", { ...eventParams, filter_name: "quick_deck", filter_value: deck.id });
              }} className={`${buttonClass} ${on ? selectedClass : idleClass}`}>{t.quickLabels[deck.id]}</button>;
            })}
          </div>
        </fieldset>}
        <fieldset>
          <legend className="mb-2 text-xs uppercase tracking-widest text-[var(--text-muted)]">{t.category}</legend>
          <div className="mb-5 flex flex-wrap gap-2">
            <button type="button" aria-pressed={category === "all"} onClick={() => changeCategory("all")} className={`${buttonClass} ${category === "all" ? selectedClass : idleClass}`}>{t.all}</button>
            {CATEGORIES.map((item) => <button type="button" key={item.id} aria-pressed={category === item.id} onClick={() => changeCategory(item.id)} className={`${buttonClass} ${category === item.id ? selectedClass : idleClass}`}>{item.emoji} {item.label}</button>)}
          </div>
        </fieldset>
        <div className="mb-5 flex flex-col gap-4 sm:flex-row">
          <fieldset>
            <legend className="mb-2 text-xs uppercase tracking-widest text-[var(--text-muted)]">{t.difficulty}</legend>
            <div className="flex flex-wrap gap-2">
              {DIFFICULTIES.map((item) => {
                const count = categoryWords.filter((word) => !item.id || word.d === item.id).length;
                return <button type="button" key={item.id} aria-pressed={difficulty === item.id} disabled={!count} onClick={() => changeDifficulty(item.id)} className={`${buttonClass} ${difficulty === item.id ? selectedClass : idleClass} disabled:opacity-40 disabled:cursor-not-allowed`}>{item.label}{!count ? " (0)" : ""}</button>;
              })}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-xs uppercase tracking-widest text-[var(--text-muted)]">{t.timer}</legend>
            <div className="flex flex-wrap gap-2">
              {TIMER_OPTIONS.map((seconds) => <button type="button" key={seconds} aria-pressed={timerLength === seconds} onClick={() => {
                setTimerLength(seconds); resetTimer(seconds);
                track("timer_preset_select", { ...eventParams, timer_seconds: seconds });
              }} className={`${buttonClass} ${timerLength === seconds ? selectedClass : idleClass}`}>{seconds ? `${seconds}s` : t.off}</button>)}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-xs uppercase tracking-widest text-[var(--text-muted)]">{t.teamsLabel}</legend>
            <div className="flex flex-wrap gap-2">
              {TEAM_OPTIONS.map((count) => <button type="button" key={count} aria-pressed={teamCount === count} onClick={() => {
                setTeamCount(count); setScores([0, 0, 0, 0]); setTurn(0); setTurnNote("");
                track("team_count_select", { ...eventParams, team_count: count });
              }} className={`${buttonClass} ${teamCount === count ? selectedClass : idleClass}`}>{count || t.off}</button>)}
            </div>
          </fieldset>
        </div>
        <p className="mb-4 text-xs leading-relaxed text-[var(--text-muted)]">{t.filtersNote}</p>
        {!pool.length && <div role="status" className="mb-4 rounded-xl border border-amber-300/30 bg-amber-300/5 p-4">
          <p className="text-sm">{t.noMatch}</p>
          <button type="button" onClick={() => changeDifficulty(0)} className={`${buttonClass} ${idleClass} mt-3`}>{t.anyDifficulty}</button>
        </div>}
        {!big && scoreboard}
        <div data-charades-stage={big ? "fullscreen" : "inline"} role={big ? "dialog" : undefined} aria-modal={big || undefined} aria-label={big ? t.aria : undefined} className={`text-center ${big ? "fixed inset-0 z-[70] flex flex-col justify-center overflow-y-auto bg-[var(--bg-primary)] p-6" : "rounded-2xl border p-6 sm:p-10"} ${timeUp ? "border-[var(--neon-pink)]/60 bg-[rgba(255,45,120,0.06)]" : "border-white/10 bg-white/[0.02]"}`}>
          {big && <div className="mb-6 flex flex-col items-center gap-3">
            <button type="button" onClick={exitBig} className={`${buttonClass} ${idleClass} self-end`}>✕ {t.exitFullscreen}</button>
            {scoreboard}
          </div>}
          {teamCount > 0 && current && !turnDone && <p className="mb-2 text-sm font-semibold text-[var(--neon-cyan)]">{t.turnOf(teamName(turn))}</p>}
          <div aria-live="polite" className="flex min-h-28 flex-col items-center justify-center gap-3">
            {current ? <>
              <p className="text-xs uppercase tracking-widest text-[var(--neon-cyan)]">{hidden ? t.hiddenLabel : t.actorOnly}</p>
              <p data-charades-result="true" className={`break-words font-extrabold leading-tight ${big ? "text-5xl sm:text-8xl" : "text-3xl sm:text-5xl"}`} style={{ fontFamily: "var(--font-display)" }}>{hidden ? t.readyToAct : current.w}</p>
              {!hidden && <p className="text-xs text-[var(--text-muted)]">{resultCategory?.emoji} {resultCategory?.label} · {DIFFICULTIES[current.d].label}</p>}
            </> : <p className="text-lg text-[var(--text-muted)]">{t.empty}</p>}
          </div>
          {current && <button type="button" aria-pressed={hidden} onClick={() => {
            setHidden(!hidden); track(hidden ? "charades_word_reveal" : "charades_word_hide", eventParams);
          }} className={`${buttonClass} ${idleClass} mt-4`}>{hidden ? t.reveal : t.hide}</button>}
          {current && timerLength > 0 && <div className="mx-auto mt-5 max-w-sm">
            <div className="h-2 overflow-hidden rounded-full bg-white/10" aria-hidden="true"><div className={`h-full ${secondsLeft <= 10 ? "bg-[var(--neon-pink)]" : "bg-[var(--neon-cyan)]"}`} style={{ width: `${secondsLeft / timerLength * 100}%` }} /></div>
            <p role="timer" aria-label={t.timeLeft} aria-live="off" className={`mt-2 font-bold tabular-nums ${big ? "text-6xl" : "text-3xl"}`}>{secondsLeft}s</p>
            <p role="status" className="mt-1 text-sm text-[var(--text-muted)]">{timeUp ? t.timeUp : timerState === "paused" ? t.paused : timerState === "running" ? t.running : t.ready}</p>
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              {timerState === "running" ? <button type="button" onClick={pauseTimer} className={`${buttonClass} ${selectedClass}`}>{t.pause}</button> : <button type="button" onClick={startTimer} className={`${buttonClass} ${selectedClass}`}>{timerState === "paused" ? t.resume : timeUp ? t.restart : t.start}</button>}
              {timerState !== "ready" && <button type="button" onClick={() => { resetTimer(timerLength); track("timer_reset", { ...eventParams, timer_seconds: timerLength }); }} className={`${buttonClass} ${idleClass}`}>{t.reset}</button>}
            </div>
            <p className="mt-3 text-xs text-[var(--text-muted)]">{t.hideNote}</p>
          </div>}
          {current && !timerLength && <p className="mt-4 text-sm text-[var(--text-muted)]">{t.timerOff}</p>}
          {current && teamCount > 0 && !turnDone && <div className="mt-5 flex flex-wrap justify-center gap-2" data-charades-score-buttons>
            <button type="button" onClick={() => endTurn(true)} className={`${buttonClass} ${selectedClass} font-semibold`}>{t.gotIt(teamName(turn))}</button>
            <button type="button" onClick={() => endTurn(false)} className={`${buttonClass} ${idleClass}`}>{t.missed}</button>
          </div>}
          {turnNote && <p role="status" className="mt-4 text-sm text-[var(--text-secondary)]">{turnNote}{best > 0 ? ` ${t.leader(teamName(leaderIndex), best)}.` : ""}</p>}
          {big && <div className="mt-6 flex justify-center"><button type="button" onClick={deal} className="btn-generate disabled:opacity-40" disabled={!pool.length}>🎭 {current ? t.next : t.deal}</button></div>}
        </div>
        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button type="button" onClick={deal} className="btn-generate disabled:opacity-40" disabled={!pool.length}>🎭 {current ? t.next : t.deal}</button>
          <button type="button" onClick={enterBig} className={`${buttonClass} ${idleClass}`} data-charades-fullscreen>{t.fullscreen}</button>
          {pool.length > 0 && <PrintButton heading={t.printHeading} items={pool.map((word) => `${word.w} — ${DIFFICULTIES[word.d].label}`)} intro={t.printIntro(pool.length, category === "all" ? t.allCategories : CATEGORIES.find((item) => item.id === category)?.label ?? "", DIFFICULTIES[difficulty].label)} label={t.printLabel} />}
        </div>
        <p className="mt-4 text-center text-xs text-[var(--text-muted)]">{t.deckLine(pool.length, remaining)}</p>
        <p className="mt-3 text-center"><a href="#charades-word-bank" className="inline-flex min-h-11 items-center text-sm text-[var(--neon-cyan)] underline underline-offset-4">{t.browse(WORDS.length)}</a></p>
      </div>
    </section>
  );
}
