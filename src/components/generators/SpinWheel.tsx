"use client";

import { useEffect, useRef, useState } from "react";

export interface WheelSegment { label: string; weight?: number; color?: string }

const PALETTE = ["#00b8d9", "#ff4fa3", "#ffb020", "#7c5cff", "#2ec27e", "#ff6b4a", "#4fc3f7", "#c05cff", "#9bdc3d", "#ff8fb3"];
const R = 200;

const polar = (deg: number, r: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [R + r * Math.cos(a), R + r * Math.sin(a)] as const;
};

/**
 * A spinning wheel drawn as SVG. The caller decides the winner (so the draw
 * can use a secure random source); the wheel animates to that segment and
 * calls onDone when it stops. Segment widths follow their weights.
 */
export default function SpinWheel({ segments, target, onDone, ariaLabel, duration = 4.6 }: {
  segments: WheelSegment[];
  /** Change `nonce` to start a spin that lands on `index`. */
  target: { index: number; nonce: number } | null;
  onDone: (index: number) => void;
  ariaLabel: string;
  duration?: number;
}) {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const rotRef = useRef(0);
  const doneRef = useRef(onDone);
  const segRef = useRef(segments);
  useEffect(() => { doneRef.current = onDone; segRef.current = segments; });
  const last = useRef(-1);

  const total = segments.reduce((s, x) => s + (x.weight ?? 1), 0) || 1;
  let acc = 0;
  const spans = segments.map((s) => { const w = ((s.weight ?? 1) / total) * 360; const from = acc; acc += w; return { from, to: acc, mid: from + w / 2, w }; });

  useEffect(() => {
    if (!target || target.nonce === last.current) return;
    last.current = target.nonce;
    const segs = segRef.current;
    const t = segs.reduce((s, x) => s + (x.weight ?? 1), 0) || 1;
    let a = 0, from = 0, w = 0;
    segs.forEach((s, i) => { const width = ((s.weight ?? 1) / t) * 360; if (i === target.index) { from = a; w = width; } a += width; });
    // Land anywhere inside the winning slice (not only its middle), away from the edges.
    const within = from + w * (0.15 + 0.7 * (crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296));
    const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const turns = reduced ? 0 : 5 + Math.floor(Math.random() * 3);
    const current = rotRef.current;
    const base = Math.ceil(current / 360) * 360;
    const next = base + turns * 360 + (360 - within);
    rotRef.current = next;
    setSpinning(true);
    setRotation(next);
    const ms = reduced ? 50 : duration * 1000 + 80;
    const id = window.setTimeout(() => { setSpinning(false); doneRef.current(target.index); }, ms);
    return () => window.clearTimeout(id);
  }, [target, duration]);

  const showLabels = segments.length <= 36;
  const fontSize = segments.length <= 8 ? 20 : segments.length <= 16 ? 15 : segments.length <= 26 ? 12 : 10;
  const maxChars = segments.length <= 8 ? 14 : segments.length <= 16 ? 12 : 10;

  return (
    <div className="relative mx-auto w-full max-w-[min(420px,86vw)] aspect-square select-none">
      <div className="absolute left-1/2 -top-1 -translate-x-1/2 z-10" aria-hidden="true">
        <svg width="34" height="40" viewBox="0 0 34 40"><path d="M17 40 L2 6 Q17 -4 32 6 Z" fill="var(--neon-pink, #ff4fa3)" stroke="#fff" strokeWidth="2" /></svg>
      </div>
      <svg viewBox="0 0 400 400" role="img" aria-label={ariaLabel} className="w-full h-full drop-shadow-lg">
        <g style={{ transformOrigin: "200px 200px", transform: `rotate(${rotation}deg)`, transition: spinning ? `transform ${duration}s cubic-bezier(0.12, 0.65, 0.08, 1)` : "none" }}>
          {segments.length === 1 ? (
            <circle cx={R} cy={R} r={R - 4} fill={segments[0].color ?? PALETTE[0]} />
          ) : spans.map((sp, i) => {
            const [x1, y1] = polar(sp.from, R - 4);
            const [x2, y2] = polar(sp.to, R - 4);
            const color = segments[i].color ?? PALETTE[i % PALETTE.length];
            const [tx, ty] = polar(sp.mid, R * 0.6);
            const label = segments[i].label.length > maxChars ? `${segments[i].label.slice(0, maxChars - 1)}…` : segments[i].label;
            return (
              <g key={i}>
                <path d={`M${R} ${R} L${x1} ${y1} A${R - 4} ${R - 4} 0 ${sp.w > 180 ? 1 : 0} 1 ${x2} ${y2} Z`} fill={color} stroke="#fff" strokeWidth="1.5" />
                {showLabels && sp.w > 6 && (
                  <text x={tx} y={ty} fill="#fff" fontSize={fontSize} fontWeight="700" textAnchor="middle" dominantBaseline="middle"
                    transform={`rotate(${sp.mid - 90} ${tx} ${ty})`} style={{ paintOrder: "stroke", stroke: "rgba(0,0,0,0.35)", strokeWidth: 2.5 }}>{label}</text>
                )}
              </g>
            );
          })}
          <circle cx={R} cy={R} r="22" fill="#fff" stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}
