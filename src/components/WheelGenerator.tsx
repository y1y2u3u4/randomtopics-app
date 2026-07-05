"use client";

import { useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CATEGORIES, Category, Mode } from "@/data/types";
import { topics } from "@/data/topics";
import TopicCard from "./TopicCard";
import type { Topic } from "@/data/types";
import { Locale, defaultLocale } from "@/i18n/config";
import { getDict, CATEGORY_LABELS } from "@/i18n/dictionaries";

interface WheelGeneratorProps {
  /** Optional mode preset — when set, landed topics are filtered to this mode. */
  mode?: Mode | null;
  title?: string;
  subtitle?: string;
  locale?: Locale;
}

const CX = 170;
const CY = 170;
const R = 150;
const SEG = 360 / CATEGORIES.length; // 22.5° for 16 categories

// Convert "degrees clockwise from top (12 o'clock)" → SVG coordinates.
function pointOnCircle(deg: number, radius: number) {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: CX + radius * Math.cos(a), y: CY + radius * Math.sin(a) };
}

function segmentPath(i: number) {
  const p0 = pointOnCircle(i * SEG, R);
  const p1 = pointOnCircle((i + 1) * SEG, R);
  return `M ${CX} ${CY} L ${p0.x.toFixed(2)} ${p0.y.toFixed(2)} A ${R} ${R} 0 0 1 ${p1.x.toFixed(2)} ${p1.y.toFixed(2)} Z`;
}

export default function WheelGenerator({ mode = null, title, subtitle, locale = defaultLocale }: WheelGeneratorProps) {
  const t = getDict(locale);
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Topic | null>(null);
  const [landedCat, setLandedCat] = useState<Category | null>(null);
  const pendingWinner = useRef<number | null>(null);

  const spin = useCallback(() => {
    if (spinning) return;
    setResult(null);
    setSpinning(true);

    const winner = Math.floor(Math.random() * CATEGORIES.length);
    pendingWinner.current = winner;

    // Land the winning segment's centre under the top pointer, plus a small
    // in-segment jitter so it doesn't always stop dead-centre.
    const winnerCenter = winner * SEG + SEG / 2;
    const finalMod = (360 - (winnerCenter % 360)) % 360;
    const currentMod = ((rotation % 360) + 360) % 360;
    let delta = finalMod - currentMod;
    if (delta < 0) delta += 360;
    const jitter = (Math.random() - 0.5) * (SEG - 6);
    const total = delta + 360 * 5 + jitter;
    setRotation((r) => r + total);
  }, [rotation, spinning]);

  const onComplete = useCallback(() => {
    const winner = pendingWinner.current;
    if (winner === null) return;
    const cat = CATEGORIES[winner].id;
    setLandedCat(cat);

    let pool = topics.filter((t) => t.category === cat);
    if (mode) pool = pool.filter((t) => t.modes.includes(mode));
    if (pool.length === 0) pool = topics.filter((t) => t.category === cat);
    const picked = pool[Math.floor(Math.random() * pool.length)] || null;

    setResult(picked);
    setSpinning(false);
  }, [mode]);

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20">
      <div className="text-center mb-10">
        <h1
          className="section-heading text-4xl sm:text-6xl font-extrabold mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {title || t.wheel.title}
        </h1>
        <p className="text-[var(--text-muted)] max-w-xl mx-auto">
          {subtitle || t.wheel.subtitle}
        </p>
      </div>

      <div className="glass-card p-6 sm:p-10 flex flex-col items-center">
        {/* Wheel + pointer */}
        <div className="relative" style={{ width: "min(100%, 340px)" }}>
          {/* Pointer */}
          <div
            className="absolute left-1/2 -translate-x-1/2 z-10"
            style={{ top: "-6px" }}
            aria-hidden
          >
            <svg width="34" height="30" viewBox="0 0 34 30">
              <polygon points="17,30 2,0 32,0" fill="var(--neon-pink)" />
            </svg>
          </div>

          <motion.div
            animate={{ rotate: rotation }}
            transition={{ duration: 4.2, ease: [0.16, 1, 0.3, 1] }}
            onAnimationComplete={() => {
              if (spinning) onComplete();
            }}
            style={{ transformOrigin: "50% 50%" }}
          >
            <svg viewBox="0 0 340 340" width="100%" role="img" aria-label="Topic category wheel">
              {CATEGORIES.map((cat, i) => {
                const hue = (i * 42) % 360;
                const fill = `hsl(${hue}, 60%, ${i % 2 === 0 ? 26 : 20}%)`;
                const mid = pointOnCircle(i * SEG + SEG / 2, R * 0.66);
                return (
                  <g key={cat.id}>
                    <path d={segmentPath(i)} fill={fill} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
                    <text
                      x={mid.x}
                      y={mid.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontSize="18"
                    >
                      {cat.emoji}
                    </text>
                  </g>
                );
              })}
              {/* Hub */}
              <circle cx={CX} cy={CY} r="26" fill="#0e0e1a" stroke="var(--neon-cyan)" strokeWidth="2" />
              <text x={CX} y={CY} textAnchor="middle" dominantBaseline="central" fontSize="22">
                🎲
              </text>
            </svg>
          </motion.div>
        </div>

        <button onClick={spin} disabled={spinning} className="btn-generate mt-8 disabled:opacity-70">
          <span>🎡</span> {spinning ? t.wheel.spinning : result ? t.wheel.spinAgain : t.wheel.spin}
        </button>

        {landedCat && !spinning && (
          <p className="text-xs text-[var(--text-muted)] mt-4">
            {t.wheel.landedOn}{" "}
            <span className="text-[var(--neon-cyan)] font-semibold">
              {CATEGORIES.find((c) => c.id === landedCat)?.emoji}{" "}
              {CATEGORY_LABELS[locale][landedCat].label}
            </span>
          </p>
        )}
      </div>

      {/* Result */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={result.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-8"
          >
            <TopicCard topic={result} locale={locale} />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
