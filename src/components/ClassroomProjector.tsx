"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { track } from "@/lib/track";
import { splitChoice } from "@/data/kidsQuestions";

const UI = {
  en: { wyr: "Would you rather…", tot: "This or that?", left: "⬅ Left side of the room", right: "Right side of the room ➡", answer: "Answer", show: "Show answer (Space)", hideTimer: "Hide timer", timer: "Timer (T)", full: "Full screen (F)", close: "Close ✕", prev: "Previous question", next: "Next question", length: "Timer length", sec: "sec", min: "min", pause: "Pause", start: "Start", reset: "Reset", keys: "← → or Space to move · F full screen · T timer · Esc close" },
  es: { wyr: "¿Qué prefieres…?", tot: "¿Esto o aquello?", left: "⬅ Lado izquierdo del aula", right: "Lado derecho del aula ➡", answer: "Respuesta", show: "Ver respuesta (Espacio)", hideTimer: "Ocultar temporizador", timer: "Temporizador (T)", full: "Pantalla completa (F)", close: "Cerrar ✕", prev: "Pregunta anterior", next: "Pregunta siguiente", length: "Duración", sec: "s", min: "min", pause: "Pausa", start: "Iniciar", reset: "Reiniciar", keys: "← → o Espacio para avanzar · F pantalla completa · T temporizador · Esc cerrar" },
};

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

// Free projector view for the kids / student question pages: same look as the
// classroom-pack presenter (cream screen, huge text, arrow keys, F full screen,
// T timer) but driven by the page's own deck, so nothing is fetched or locked.
// Either/or prompts are split into "left side of the room / right side";
// riddles hide the answer until the next key press.
export default function ClassroomProjector({ deck, title, split, source, kickers, answers, color = "#6b5bd2", locale = "en", onClose }: {
  deck: string[];
  title: string;
  split?: boolean;
  source: string;
  /** Small label above each slide (e.g. the morning meeting step). */
  kickers?: string[];
  /** Hidden answer per slide; the first "next" reveals it. */
  answers?: (string | undefined)[];
  color?: string;
  locale?: "en" | "es";
  onClose: () => void;
}) {
  const t = UI[locale];
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [timerOn, setTimerOn] = useState(false);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [seconds, setSeconds] = useState(30);
  const root = useRef<HTMLDivElement>(null);
  const count = deck.length;

  const go = useCallback((next: number) => {
    setIndex(Math.max(0, Math.min(count - 1, next)));
    setRevealed(false);
    setElapsed(0);
    setRunning(false);
  }, [count]);
  const hasAnswer = Boolean(answers?.[index]);
  const forward = useCallback(() => {
    if (hasAnswer && !revealed) { setRevealed(true); return; }
    go(index + 1);
  }, [hasAnswer, revealed, go, index]);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  useEffect(() => {
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    root.current?.focus();
    return () => { document.body.style.overflow = overflow; };
  }, []);

  const close = useCallback(() => {
    if (document.fullscreenElement) void document.exitFullscreen().catch(() => {});
    onClose();
  }, [onClose]);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await root.current?.requestFullscreen();
      track("classroom_projector_fullscreen", { content_source: source });
    } catch { /* not supported (e.g. iOS Safari) */ }
  }, [source]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLSelectElement || e.metaKey || e.ctrlKey || e.altKey) return;
      if (["ArrowRight", "ArrowDown", "PageDown", " ", "Enter"].includes(e.key)) { e.preventDefault(); forward(); }
      else if (["ArrowLeft", "ArrowUp", "PageUp"].includes(e.key)) { e.preventDefault(); go(index - 1); }
      else if (e.key === "Home") go(0);
      else if (e.key === "End") go(count - 1);
      else if (e.key === "Escape" && !document.fullscreenElement) close();
      else if (e.key === "f" || e.key === "F") void toggleFullscreen();
      else if (e.key === "t" || e.key === "T") { setTimerOn(true); setRunning((r) => !r); }
      else if (e.key === "r" || e.key === "R") { setElapsed(0); setRunning(false); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, forward, index, count, toggleFullscreen, close]);

  const text = deck[index] ?? "";
  const sides = split ? splitChoice(text) : null;
  const left = Math.max(0, seconds - elapsed);
  const signal = left === 0 ? "#d2405f" : left <= 5 ? "#e2b100" : "#1b1b2f";

  return (
    <div ref={root} tabIndex={-1} role="dialog" aria-modal="true" aria-label={`${title} — projector mode`}
      className="fixed inset-0 z-[100] flex flex-col overflow-y-auto overflow-x-hidden bg-[#fffdf8] text-[#1b1b2f] outline-none"
      style={{ borderLeft: `12px solid ${color}` }} data-classroom-projector={source}>
      <header className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-10 pt-4 text-sm text-[#5b5b70]">
        <span className="font-semibold" style={{ color }}>{title}</span>
        <div className="flex flex-wrap items-center gap-2">
          <span aria-live="polite">{index + 1} / {count}</span>
          <button type="button" onClick={() => setTimerOn((v) => !v)} className="rounded-lg border border-[#d9d4c8] px-3 py-1.5">{timerOn ? t.hideTimer : t.timer}</button>
          <button type="button" onClick={() => void toggleFullscreen()} className="hidden sm:inline-block rounded-lg border border-[#d9d4c8] px-3 py-1.5">{t.full}</button>
          <button type="button" onClick={close} className="rounded-lg border border-[#d9d4c8] px-3 py-1.5">{t.close}</button>
        </div>
      </header>

      <main className="flex-1 flex flex-col justify-center px-4 sm:px-16 py-6"
        onClick={(e) => { if ((e.target as HTMLElement).closest("button,a,select")) return; forward(); }}>
        {sides ? (
          <>
            <p className="text-center text-base sm:text-2xl font-bold uppercase tracking-wider" style={{ color }}>
              {/^(Would you rather|¿Qué prefieres)/.test(text) ? t.wyr : t.tot}
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl border-4 border-[#1f9d68] bg-white p-5 sm:p-8 text-center">
                <p className="text-sm sm:text-lg font-bold uppercase tracking-wider text-[#1f9d68]">{t.left}</p>
                <p className="mt-3 font-bold leading-tight break-words" style={{ fontSize: "clamp(1.7rem, 4.6vw, 4.4rem)" }}>{sides[0]}</p>
              </div>
              <div className="rounded-3xl border-4 border-[#2f6fd6] bg-white p-5 sm:p-8 text-center">
                <p className="text-sm sm:text-lg font-bold uppercase tracking-wider text-[#2f6fd6]">{t.right}</p>
                <p className="mt-3 font-bold leading-tight break-words" style={{ fontSize: "clamp(1.7rem, 4.6vw, 4.4rem)" }}>{sides[1]}</p>
              </div>
            </div>
          </>
        ) : (
          <>
            {kickers?.[index] && <p className="text-sm sm:text-xl font-bold uppercase tracking-wider" style={{ color }}>{kickers[index]}</p>}
            <h2 className="mt-3 font-bold leading-tight break-words" style={{ fontSize: text.length > 80 ? "clamp(1.8rem, 4.2vw, 4rem)" : "clamp(2rem, 5.4vw, 5.2rem)" }}>{text}</h2>
            {hasAnswer && (revealed
              ? <p className="mt-8 text-2xl sm:text-5xl font-bold text-[#1f9d68]" data-projector-answer>{t.answer}: {answers![index]}</p>
              : <button type="button" onClick={() => setRevealed(true)} className="mt-8 self-start rounded-xl border-2 border-[#1f9d68] px-5 py-3 text-lg sm:text-2xl font-semibold text-[#1f9d68]">{t.show}</button>)}
          </>
        )}
      </main>

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-10 pb-5">
        <div className="flex gap-2">
          <button type="button" onClick={() => go(index - 1)} disabled={index === 0} className="rounded-xl border border-[#d9d4c8] px-5 py-3 text-lg disabled:opacity-40" aria-label={t.prev}>←</button>
          <button type="button" onClick={forward} disabled={index >= count - 1 && !(hasAnswer && !revealed)} className="rounded-xl px-5 py-3 text-lg text-white disabled:opacity-40" style={{ background: color }} aria-label={t.next}>→</button>
        </div>
        {timerOn && (
          <div className="flex flex-wrap items-center gap-3" data-classroom-timer>
            <select aria-label={t.length} value={seconds} onChange={(e) => { setSeconds(Number(e.target.value)); setElapsed(0); }} className="rounded-lg border border-[#d9d4c8] bg-white px-2 py-2">
              {[15, 30, 60, 120].map((s) => <option key={s} value={s}>{s < 60 ? `${s} ${t.sec}` : `${s / 60} ${t.min}`}</option>)}
            </select>
            <span className="font-mono text-4xl sm:text-5xl font-bold tabular-nums" style={{ color: signal }} aria-live="off">{clock(left)}</span>
            <button type="button" onClick={() => setRunning((r) => !r)} className="rounded-lg border border-[#d9d4c8] px-3 py-2">{running ? t.pause : t.start}</button>
            <button type="button" onClick={() => { setElapsed(0); setRunning(false); }} className="rounded-lg border border-[#d9d4c8] px-3 py-2">{t.reset}</button>
          </div>
        )}
        <p className="hidden lg:block text-xs text-[#8a8a9a]">{t.keys}</p>
      </div>
    </div>
  );
}
