"use client";

import { useState } from "react";
import { track } from "@/lib/track";
import { secureInt } from "@/lib/generators/secure";

const SIDES = [4, 6, 8, 10, 12, 20, 100];
const ev = { tool_type: "dice_roller", locale: "en" };
const PIPS = ["", "⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

interface Roll { dice: number[]; sides: number; mod: number; total: number }

export default function DiceRoller() {
  const [count, setCount] = useState(2);
  const [sides, setSides] = useState(6);
  const [mod, setMod] = useState(0);
  const [roll, setRoll] = useState<Roll | null>(null);
  const [history, setHistory] = useState<Roll[]>([]);
  const [tick, setTick] = useState(0);

  const doRoll = () => {
    const dice = Array.from({ length: count }, () => secureInt(sides) + 1);
    const r: Roll = { dice, sides, mod, total: dice.reduce((a, b) => a + b, 0) + mod };
    setRoll(r);
    setTick((t) => t + 1);
    setHistory((h) => [r, ...h].slice(0, 10));
    track("generate_success", { ...ev, result_count: count, sides });
  };
  const notation = (r: { dice: number[]; sides: number; mod: number }) => `${r.dice.length}d${r.sides}${r.mod ? (r.mod > 0 ? `+${r.mod}` : r.mod) : ""}`;
  const chip = (on: boolean) => `px-3 py-2 rounded-xl text-sm border transition-colors ${on ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/15" : "border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50"}`;
  const label = "block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2";
  const sum = roll ? roll.dice.reduce((a, b) => a + b, 0) : 0;

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6">
      <style>{`@keyframes dieroll{0%{transform:rotate(-200deg) scale(.4);opacity:0}60%{transform:rotate(15deg) scale(1.1);opacity:1}100%{transform:rotate(0) scale(1)}}`}</style>
      <div className="glass-card p-5 sm:p-8">
        <span className={label}>Number of dice</span>
        <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Number of dice">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => <button key={n} type="button" aria-pressed={count === n} className={`${chip(count === n)} w-11 text-center`} onClick={() => setCount(n)}>{n}</button>)}
        </div>
        <span className={label}>Sides per die</span>
        <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Sides per die">
          {SIDES.map((s) => <button key={s} type="button" aria-pressed={sides === s} className={chip(sides === s)} onClick={() => setSides(s)}>d{s}</button>)}
        </div>
        <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)]">
          <span className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Modifier</span>
          <button type="button" className={chip(false)} aria-label="Decrease modifier" onClick={() => setMod((m) => Math.max(-20, m - 1))}>−</button>
          <span className="w-10 text-center tabular-nums text-[var(--text-primary)] text-lg">{mod > 0 ? `+${mod}` : mod}</span>
          <button type="button" className={chip(false)} aria-label="Increase modifier" onClick={() => setMod((m) => Math.min(20, m + 1))}>+</button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 mt-5 text-center min-h-40 flex flex-col items-center justify-center" aria-live="polite">
          {roll ? (
            <>
              <ul key={tick} className="flex flex-wrap justify-center gap-2" data-dice-result>
                {roll.dice.map((d, i) => (
                  <li key={i} className="min-w-14 h-14 px-2 rounded-xl bg-white text-[#16202e] text-2xl font-extrabold flex items-center justify-center shadow-md tabular-nums" style={{ animation: "dieroll .45s ease-out" }} title={`d${roll.sides}`}>
                    {roll.sides === 6 ? <span className="text-4xl leading-none" aria-label={String(d)}>{PIPS[d]}</span> : d}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[var(--text-muted)] text-sm">{notation(roll)}{roll.mod ? ` = ${sum} ${roll.mod > 0 ? "+" : "−"} ${Math.abs(roll.mod)}` : ""}</p>
              <p className="text-5xl sm:text-6xl font-extrabold tabular-nums" style={{ fontFamily: "var(--font-display)" }}>Total: {roll.total}</p>
            </>
          ) : <p className="text-[var(--text-muted)]">Choose your dice and press Roll 🎲</p>}
        </div>
        <div className="flex justify-center mt-4"><button type="button" onClick={doRoll} className="btn-generate">🎲 Roll {count}d{sides}{mod ? (mod > 0 ? `+${mod}` : mod) : ""}</button></div>
        {history.length > 1 && (
          <p className="text-sm text-[var(--text-secondary)] mt-4"><span className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Earlier: </span>
            {history.slice(1, 7).map((h) => `${notation(h)} → ${h.total}`).join(" · ")}</p>
        )}
      </div>
    </section>
  );
}
