"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PRESETS = [
  { label: "1 min", seconds: 60 },
  { label: "2 min", seconds: 120 },
  { label: "3 min", seconds: 180 },
  { label: "5 min", seconds: 300 },
];

export default function SpeechTimer() {
  const [totalSeconds, setTotalSeconds] = useState(60);
  const [remaining, setRemaining] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (!isRunning || remaining <= 0) return;
    const interval = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning, remaining]);

  const selectPreset = useCallback((seconds: number) => {
    setTotalSeconds(seconds);
    setRemaining(seconds);
    setIsRunning(false);
    setIsFinished(false);
  }, []);

  const toggleRun = useCallback(() => {
    if (isFinished) {
      setRemaining(totalSeconds);
      setIsFinished(false);
    }
    setIsRunning((prev) => !prev);
  }, [isFinished, totalSeconds]);

  const reset = useCallback(() => {
    setRemaining(totalSeconds);
    setIsRunning(false);
    setIsFinished(false);
  }, [totalSeconds]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const progress = totalSeconds > 0 ? remaining / totalSeconds : 1;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className="glass-card p-6 sm:p-8">
      <h3
        className="text-lg font-bold mb-5 text-center"
        style={{ fontFamily: "var(--font-display)" }}
      >
        <span className="mr-2">⏱️</span>
        Speech <span className="gradient-text">Timer</span>
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
                isFinished
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
                    Time&apos;s Up!
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
          {isFinished ? "▶ Restart" : isRunning ? "⏸ Pause" : "▶ Start"}
        </button>
        <button
          onClick={reset}
          className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all border border-[rgba(255,255,255,0.08)] text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[rgba(255,255,255,0.04)]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          ↺ Reset
        </button>
      </div>
    </div>
  );
}
