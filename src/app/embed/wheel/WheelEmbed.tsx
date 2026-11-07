"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { topics } from "@/data/topics";
import { CATEGORIES, type Category, type Mode } from "@/data/types";
import { embedFont, embedTheme } from "../embedTheme";

// Eight classroom-friendly categories on the wheel (no politics).
const WHEEL: Category[] = ["science", "technology", "history", "food-travel", "entertainment", "sports", "nature", "weird-fun"];
const COLORS = ["#ff2d78", "#ff6b35", "#ffb020", "#22c55e", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"];
const MODES: Mode[] = ["conversation", "writing", "debate", "speech", "icebreaker"];
const SLICE = 360 / WHEEL.length;

function slicePath(i: number): string {
  const a0 = ((i * SLICE - 90) * Math.PI) / 180;
  const a1 = (((i + 1) * SLICE - 90) * Math.PI) / 180;
  const r = 100;
  return `M100 100 L${100 + r * Math.cos(a0)} ${100 + r * Math.sin(a0)} A${r} ${r} 0 0 1 ${100 + r * Math.cos(a1)} ${100 + r * Math.sin(a1)} Z`;
}

export default function WheelEmbed() {
  const params = useSearchParams();
  const t = embedTheme(params.get("theme"));
  const rawMode = params.get("mode") as Mode | null;
  const mode = rawMode && MODES.includes(rawMode) ? rawMode : null;
  const pools = useMemo(
    () => WHEEL.map((c) => topics.filter((x) => x.category === c && (!mode || x.modes.includes(mode)))),
    [mode],
  );
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<{ cat: Category; text: string } | null>(null);

  const spin = () => {
    if (spinning) return;
    const live = WHEEL.map((_, i) => i).filter((i) => pools[i].length > 0);
    const target = live[Math.floor(Math.random() * live.length)];
    // Pointer is at the top; land somewhere inside the target slice.
    const within = SLICE * (0.2 + Math.random() * 0.6);
    const landing = 360 - (target * SLICE + within);
    const base = rotation - (rotation % 360);
    setRotation(base + 360 * 5 + landing);
    setSpinning(true);
    setResult(null);
    window.setTimeout(() => {
      const pool = pools[target];
      setResult({ cat: WHEEL[target], text: pool[Math.floor(Math.random() * pool.length)].text });
      setSpinning(false);
    }, 3200);
  };

  const info = result ? CATEGORIES.find((c) => c.id === result.cat) : null;

  return (
    <div style={{ fontFamily: embedFont, background: t.bg, color: t.text, minHeight: "100vh", boxSizing: "border-box", padding: 14, display: "flex", flexDirection: "column", alignItems: "center", gap: 10 }}>
      <div style={{ position: "relative", width: "min(240px, 70vw)", aspectRatio: "1 / 1" }}>
        <svg viewBox="0 0 200 200" width="100%" height="100%" style={{ transform: `rotate(${rotation}deg)`, transition: spinning ? "transform 3.2s cubic-bezier(0.17, 0.67, 0.12, 0.99)" : "none" }} aria-hidden="true">
          {WHEEL.map((c, i) => {
            const mid = ((i + 0.5) * SLICE - 90) * (Math.PI / 180);
            const emoji = CATEGORIES.find((x) => x.id === c)?.emoji ?? "";
            return (
              <g key={c}>
                <path d={slicePath(i)} fill={COLORS[i]} stroke={t.bg} strokeWidth={1.5} />
                <text x={100 + 64 * Math.cos(mid)} y={100 + 64 * Math.sin(mid)} fontSize="20" textAnchor="middle" dominantBaseline="central">{emoji}</text>
              </g>
            );
          })}
          <circle cx="100" cy="100" r="16" fill={t.bg} stroke={t.border} />
        </svg>
        <div style={{ position: "absolute", top: -4, left: "50%", transform: "translateX(-50%)", width: 0, height: 0, borderLeft: "10px solid transparent", borderRight: "10px solid transparent", borderTop: `18px solid ${t.text}` }} />
      </div>
      <button
        type="button"
        onClick={spin}
        disabled={spinning}
        style={{ background: `linear-gradient(135deg, ${t.accent}, ${t.accent2})`, color: "#fff", border: 0, borderRadius: 999, padding: "9px 22px", fontSize: 14, fontWeight: 800, cursor: spinning ? "default" : "pointer", opacity: spinning ? 0.7 : 1 }}
      >
        {spinning ? "Spinning…" : result ? "Spin again" : "Spin the wheel"}
      </button>
      <div aria-live="polite" style={{ minHeight: 64, width: "100%", textAlign: "center" }}>
        {result && (
          <>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: t.muted }}>{info?.emoji} {info?.label}</div>
            <p style={{ margin: "4px 0 0", fontSize: 16, fontWeight: 800, lineHeight: 1.35 }}>{result.text}</p>
          </>
        )}
      </div>
      <a href="https://randomtopics.app/spin-the-wheel?ref=embed_wheel" target="_blank" rel="noopener" style={{ marginTop: "auto", fontSize: 11, color: t.muted, textDecoration: "none" }}>
        Powered by Random Topics
      </a>
    </div>
  );
}
