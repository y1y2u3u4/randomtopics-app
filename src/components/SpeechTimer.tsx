"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Locale, defaultLocale } from "@/i18n/config";
import { track } from "@/lib/track";

const PRESETS = [
  { label: "1 min", seconds: 60 },
  { label: "2 min", seconds: 120 },
  { label: "3 min", seconds: 180 },
  { label: "5 min", seconds: 300 },
];

const STRINGS: Record<Locale, {
  timer: React.ReactNode;
  done: string;
  restart: string;
  pause: string;
  start: string;
  reset: string;
  toastmastersCues: string;
  beforeGreen: string;
  greenCue: string;
  yellowCue: string;
  redCue: string;
}> = {
  en: {
    timer: (
      <>
        Speech <span className="gradient-text">Timer</span>
      </>
    ),
    done: "Time's Up!",
    restart: "▶ Restart",
    pause: "⏸ Pause",
    start: "▶ Start",
    reset: "↺ Reset",
    toastmastersCues: "Toastmasters timing cues",
    beforeGreen: "Build your answer · green at 1:00",
    greenCue: "Green · 1:00 reached",
    yellowCue: "Yellow · 1:30 reached",
    redCue: "Red · 2:00 reached",
  },
  es: {
    timer: (
      <>
        Cronómetro de <span className="gradient-text">Discurso</span>
      </>
    ),
    done: "¡Se acabó el tiempo!",
    restart: "▶ Reiniciar",
    pause: "⏸ Pausar",
    start: "▶ Iniciar",
    reset: "↺ Restablecer",
    toastmastersCues: "Señales de tiempo de Toastmasters",
    beforeGreen: "Desarrolla tu respuesta · verde al 1:00",
    greenCue: "Verde · alcanzado 1:00",
    yellowCue: "Amarillo · alcanzado 1:30",
    redCue: "Rojo · alcanzado 2:00",
  },
};

export default function SpeechTimer({
  locale = defaultLocale,
  defaultSeconds = 60,
  contentSource = "speech_hub",
  toastmastersCues = false,
}: {
  locale?: Locale;
  defaultSeconds?: number;
  contentSource?: string;
  toastmastersCues?: boolean;
}) {
  const t = STRINGS[locale] || STRINGS.en;
  const initialSeconds = PRESETS.some((preset) => preset.seconds === defaultSeconds) ? defaultSeconds : 60;
  const [totalSeconds, setTotalSeconds] = useState(initialSeconds);
  const [remaining, setRemaining] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isRunning || remaining <= 0) return;
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsFinished(true);
          track("timer_complete", {
            tool_type: "speech_timer",
            content_source: contentSource,
            timer_seconds: totalSeconds,
            locale,
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, remaining, totalSeconds, locale, contentSource]);

  const selectPreset = useCallback((seconds: number) => {
    setTotalSeconds(seconds);
    setRemaining(seconds);
    setIsRunning(false);
    setIsFinished(false);
    track("timer_preset_select", { tool_type: "speech_timer", content_source: contentSource, timer_seconds: seconds, locale });
  }, [locale, contentSource]);

  const toggleRun = useCallback(() => {
    const restarting = isFinished;
    if (isFinished) {
      setRemaining(totalSeconds);
      setIsFinished(false);
    }
    track(restarting ? "timer_restart" : isRunning ? "timer_pause" : "timer_start", {
      tool_type: "speech_timer",
      content_source: contentSource,
      timer_seconds: totalSeconds,
      locale,
    });
    setIsRunning((prev) => !prev);
  }, [isFinished, isRunning, totalSeconds, locale, contentSource]);

  const reset = useCallback(() => {
    setRemaining(totalSeconds);
    setIsRunning(false);
    setIsFinished(false);
    track("timer_reset", { tool_type: "speech_timer", content_source: contentSource, timer_seconds: totalSeconds, locale });
  }, [totalSeconds, locale, contentSource]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const progress = totalSeconds > 0 ? remaining / totalSeconds : 1;
  const toastmastersTimingActive = toastmastersCues && totalSeconds === 120;
  const elapsed = totalSeconds - remaining;
  const toastmastersCue = !toastmastersTimingActive
    ? null
    : elapsed >= 120
      ? { label: t.redCue, color: "#ff4d6d", background: "rgba(255,77,109,0.1)" }
      : elapsed >= 90
        ? { label: t.yellowCue, color: "var(--neon-yellow)", background: "rgba(255,226,52,0.08)" }
        : elapsed >= 60
          ? { label: t.greenCue, color: "var(--neon-green)", background: "rgba(0,255,136,0.08)" }
          : { label: t.beforeGreen, color: "var(--neon-cyan)", background: "rgba(0,229,255,0.08)" };
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="glass-card p-6 sm:p-8">
      <h3
        className="text-lg font-bold mb-5 text-center"
        style={{ fontFamily: "var(--font-display)" }}
      >
        <span className="mr-2">⏱️</span>
        {t.timer}
      </h3>

      {/* Preset buttons */}
      <div className="flex justify-center gap-2 mb-6">
        {PRESETS.map((p) => (
          <button
            key={p.seconds}
            onClick={() => selectPreset(p.seconds)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              totalSeconds === p.seconds && !isRunning
                ? "bg-[rgba(0,229,255,0.12)] border border-[var(--neon-cyan)] text-[var(--neon-cyan)] shadow-[0_0_10px_rgba(0,229,255,0.1)]"
                : "border border-[rgba(255,255,255,0.06)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.04)]"
            }`}
            disabled={isRunning}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Circular timer */}
      <div className="flex justify-center mb-6">
        <div className="relative w-36 h-36">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="6"
            />
            {/* Progress circle */}
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={
                toastmastersCue
                  ? toastmastersCue.color
                  : isFinished
                  ? "var(--neon-pink)"
                  : remaining <= 10 && remaining > 0
                  ? "var(--neon-yellow)"
                  : "var(--neon-cyan)"
              }
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              style={{
                filter: isFinished
                  ? "drop-shadow(0 0 8px rgba(255,45,120,0.6))"
                  : "drop-shadow(0 0 6px rgba(0,229,255,0.4))",
                transition: "stroke-dashoffset 0.3s ease, stroke 0.3s ease",
              }}
            />
          </svg>
          {/* Time display */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              {isFinished ? (
                <motion.div
                  key="done"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center"
                >
                  <div className="text-2xl mb-1">🎉</div>
                  <div
                    className="text-xs font-bold text-[var(--neon-pink)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {t.done}
                  </div>
                </motion.div>
              ) : (
                <motion.span
                  key="time"
                  className="text-3xl font-bold tabular-nums"
                  style={{
                    fontFamily: "var(--font-display)",
                    color:
                      remaining <= 10 && isRunning
                        ? "var(--neon-yellow)"
                        : "var(--text-primary)",
                  }}
                >
                  {minutes}:{seconds.toString().padStart(2, "0")}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {toastmastersCue && (
        <div className="mb-6" aria-live="polite">
          <p className="mb-2 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--text-muted)]">
            {t.toastmastersCues}
          </p>
          <p
            className="rounded-lg border px-3 py-2 text-center text-xs font-bold"
            style={{
              color: toastmastersCue.color,
              background: toastmastersCue.background,
              borderColor: toastmastersCue.color,
            }}
          >
            {toastmastersCue.label}
          </p>
          <div className="mt-2 grid grid-cols-3 gap-2 text-center text-[10px] font-semibold">
            <span className="rounded-md border border-[var(--neon-green)]/30 px-2 py-1 text-[var(--neon-green)]">Green 1:00</span>
            <span className="rounded-md border border-[var(--neon-yellow)]/30 px-2 py-1 text-[var(--neon-yellow)]">Yellow 1:30</span>
            <span className="rounded-md border border-[#ff4d6d]/30 px-2 py-1 text-[#ff4d6d]">Red 2:00</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="flex justify-center gap-3">
        <button
          onClick={toggleRun}
          className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all"
          style={{
            fontFamily: "var(--font-display)",
            background: isRunning
              ? "rgba(255,226,52,0.12)"
              : "rgba(0,255,136,0.12)",
            border: `1px solid ${isRunning ? "var(--neon-yellow)" : "var(--neon-green)"}`,
            color: isRunning ? "var(--neon-yellow)" : "var(--neon-green)",
            boxShadow: `0 0 12px ${
              isRunning ? "rgba(255,226,52,0.1)" : "rgba(0,255,136,0.1)"
            }`,
          }}
        >
          {isFinished ? t.restart : isRunning ? t.pause : t.start}
        </button>
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-[rgba(255,255,255,0.08)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.04)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {t.reset}
        </button>
      </div>
    </div>
  );
}
