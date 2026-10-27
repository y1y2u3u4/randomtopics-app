"use client";

import { useRef, useState } from "react";
import { track } from "@/lib/track";
import { secureInt } from "@/lib/generators/secure";

type Side = "H" | "T";
const COUNTS = [1, 2, 3, 5, 10];
const ev = { tool_type: "flip_a_coin", locale: "en" };

function Coin({ side, flipping, size }: { side: Side | null; flipping: boolean; size: number }) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-extrabold shadow-lg select-none"
      style={{
        width: size, height: size, fontSize: size * 0.34, fontFamily: "var(--font-display)",
        background: side === "T" ? "radial-gradient(circle at 30% 30%, #e8eef5, #9aa7b8)" : "radial-gradient(circle at 30% 30%, #ffe27a, #d99a14)",
        color: side === "T" ? "#2c3645" : "#6b4300", border: "4px solid rgba(255,255,255,0.35)",
        animation: flipping ? "coinflip 0.9s ease-in-out" : undefined,
      }}
      aria-hidden="true"
    >
      {side === null ? "?" : side === "H" ? "Heads" : "Tails"}
    </div>
  );
}

export default function CoinFlip() {
  const [count, setCount] = useState(1);
  const [coins, setCoins] = useState<Side[]>([]);
  const [flipping, setFlipping] = useState(false);
  const [history, setHistory] = useState<Side[]>([]);
  const [anim, setAnim] = useState(0);
  const timer = useRef<number | null>(null);

  const heads = history.filter((s) => s === "H").length;
  const tails = history.length - heads;
  let streak = 0;
  for (let i = history.length - 1; i >= 0 && history[i] === history[history.length - 1]; i--) streak++;
  let longest = 0, run = 0;
  history.forEach((s, i) => { run = i > 0 && history[i - 1] === s ? run + 1 : 1; if (run > longest) longest = run; });

  const flip = () => {
    if (flipping) return;
    const next = Array.from({ length: count }, () => (secureInt(2) === 0 ? "H" : "T") as Side);
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    setFlipping(!reduced);
    setAnim((a) => a + 1);
    if (timer.current) window.clearTimeout(timer.current);
    const commit = () => { setCoins(next); setHistory((h) => [...h, ...next].slice(-500)); setFlipping(false); track("generate_success", { ...ev, result_count: next.length }); };
    if (reduced) commit(); else timer.current = window.setTimeout(commit, 900);
  };

  const pct = history.length ? Math.round((heads / history.length) * 100) : 0;
  const chip = (on: boolean) => `px-4 py-2 rounded-xl text-sm border transition-colors ${on ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/15" : "border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50"}`;
  const size = count === 1 ? 160 : count <= 3 ? 104 : 76;
  const headline = coins.length === 1 ? (coins[0] === "H" ? "Heads" : "Tails") : coins.length ? `${coins.filter((s) => s === "H").length} heads · ${coins.filter((s) => s === "T").length} tails` : "";

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6">
      <style>{`@keyframes coinflip{0%{transform:rotateX(0) translateY(0) scale(1)}50%{transform:rotateX(900deg) translateY(-48px) scale(1.12)}100%{transform:rotateX(1800deg) translateY(0) scale(1)}}`}</style>
      <div className="glass-card p-5 sm:p-8 text-center">
        <div className="flex flex-wrap justify-center gap-2 mb-5" role="group" aria-label="Number of coins">
          {COUNTS.map((n) => <button key={n} type="button" aria-pressed={count === n} className={chip(count === n)} onClick={() => setCount(n)}>{n} {n === 1 ? "coin" : "coins"}</button>)}
        </div>
        <div key={anim} className="flex flex-wrap items-center justify-center gap-4 min-h-44" style={{ perspective: 600 }}>
          {(coins.length && !flipping ? coins : Array.from({ length: count }, () => null as Side | null)).map((s, i) => (
            <Coin key={i} side={s} flipping={flipping} size={size} />
          ))}
        </div>
        <p className="text-3xl sm:text-4xl font-extrabold mt-4 min-h-10" style={{ fontFamily: "var(--font-display)" }} aria-live="polite" data-coin-result>
          {flipping ? "Flipping…" : headline || "Heads or tails?"}
        </p>
        <button type="button" onClick={flip} disabled={flipping} className="btn-generate mt-4">🪙 {history.length ? "Flip again" : "Flip the coin"}</button>

        {history.length > 0 && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-left">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div><p className="text-2xl font-bold tabular-nums">{heads}</p><p className="text-xs text-[var(--text-muted)]">Heads ({pct}%)</p></div>
              <div><p className="text-2xl font-bold tabular-nums">{tails}</p><p className="text-xs text-[var(--text-muted)]">Tails ({100 - pct}%)</p></div>
              <div><p className="text-2xl font-bold tabular-nums">{streak}</p><p className="text-xs text-[var(--text-muted)]">Current streak ({history[history.length - 1] === "H" ? "heads" : "tails"})</p></div>
              <div><p className="text-2xl font-bold tabular-nums">{longest}</p><p className="text-xs text-[var(--text-muted)]">Longest streak</p></div>
            </div>
            <p className="mt-4 text-xs uppercase tracking-widest text-[var(--text-muted)]">Last {Math.min(history.length, 30)} flips</p>
            <p className="mt-1 flex flex-wrap gap-1" aria-label="Flip history">
              {history.slice(-30).map((s, i) => <span key={i} className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center ${s === "H" ? "bg-[#e6b422] text-[#5b3a00]" : "bg-[#aab6c6] text-[#27313f]"}`}>{s}</span>)}
            </p>
            <button type="button" className="mt-3 text-xs underline text-[var(--text-muted)]" onClick={() => { setHistory([]); setCoins([]); }}>Reset counts</button>
          </div>
        )}
        <p className="text-xs text-[var(--text-muted)] mt-4">Each flip is exactly 50/50 and independent of the last one — streaks happen by chance.</p>
      </div>
    </section>
  );
}
