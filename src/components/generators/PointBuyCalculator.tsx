"use client";

import { useMemo, useState } from "react";
import {
  ABILITIES, ABILITY_NAMES, MAX_SCORE, MIN_SCORE, POINT_BUDGET, POINT_BUY_PRESETS, POINT_COST, RACES_2014, SCORE_CAP,
  fmtMod, modifier, totalCost,
} from "@/lib/generators/pointBuy";
import { track } from "@/lib/track";

type Rules = "2024" | "2014";
type BonusMode = "21" | "111" | "race";

const chip = (on: boolean) =>
  `px-3 py-1.5 rounded-lg text-sm border transition-colors ${on ? "border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-white/[0.06]" : "border-white/10 text-[var(--text-secondary)] bg-white/[0.02] hover:border-white/30"}`;
const stepBtn =
  "w-9 h-9 rounded-lg border border-white/15 text-lg leading-none text-[var(--text-primary)] disabled:opacity-30 disabled:cursor-not-allowed hover:border-[var(--neon-cyan)]";
const selectCls = "w-full rounded-lg border border-white/15 bg-[#0f0f1a] text-sm text-[var(--text-primary)] px-2 py-2";

export default function PointBuyCalculator() {
  const [scores, setScores] = useState<number[]>(Array(6).fill(8));
  const [rules, setRules] = useState<Rules>("2024");
  const [mode, setMode] = useState<BonusMode>("21");
  const [plus2, setPlus2] = useState(0);
  const [plus1, setPlus1] = useState(1);
  const [threes, setThrees] = useState<number[]>([0, 1, 2]);
  const [race, setRace] = useState(0);

  const effectiveMode: BonusMode = rules === "2024" && mode === "race" ? "21" : mode;
  const bonus = useMemo(() => {
    const b = Array(6).fill(0) as number[];
    if (effectiveMode === "21") {
      b[plus2] += 2;
      if (plus1 !== plus2) b[plus1] += 1;
    } else if (effectiveMode === "111") {
      threes.forEach((i) => (b[i] += 1));
    } else {
      RACES_2014[race].bonus.forEach((v, i) => (b[i] = v));
    }
    return b;
  }, [effectiveMode, plus2, plus1, threes, race]);

  const spent = totalCost(scores);
  const left = POINT_BUDGET - spent;
  const over = left < 0;
  const finals = scores.map((s, i) => Math.min(SCORE_CAP, s + bonus[i]));
  const modSum = finals.reduce((s, v) => s + modifier(v), 0);
  const stdSum = [15, 14, 13, 12, 10, 8].reduce((s, v) => s + modifier(v), 0);

  const bump = (i: number, d: number) => {
    setScores((prev) => {
      const next = prev.slice();
      const v = next[i] + d;
      if (v < MIN_SCORE || v > MAX_SCORE) return prev;
      next[i] = v;
      return next;
    });
  };
  const toggleThree = (i: number) =>
    setThrees((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : prev.length >= 3 ? prev : [...prev, i].sort()));
  const applyPreset = (id: string, s: number[]) => {
    setScores(s.slice());
    track("point_buy_preset", { tool_type: "point_buy_calculator", locale: "en", preset: id });
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Points remaining</p>
            <p
              className={`text-3xl font-bold ${over ? "text-red-400" : left === 0 ? "text-emerald-400" : "text-[var(--text-primary)]"}`}
              style={{ fontFamily: "var(--font-display)" }}
              aria-live="polite"
            >
              {left} <span className="text-base font-normal text-[var(--text-muted)]">/ {POINT_BUDGET}</span>
            </p>
          </div>
          <button type="button" onClick={() => setScores(Array(6).fill(8))} className={chip(false)}>Reset to 8s</button>
        </div>

        {over && (
          <p role="alert" className="mb-3 rounded-lg border border-red-400/40 bg-red-500/10 px-3 py-2 text-sm text-red-300">
            Over budget by {-left} point{-left === 1 ? "" : "s"}. Lower a score: this build is not legal under the 27-point rule.
          </p>
        )}
        {!over && left > 0 && (
          <p className="mb-3 text-sm text-[var(--text-muted)]">
            {left} point{left === 1 ? "" : "s"} unspent. That is allowed, but the points are lost.
          </p>
        )}
        {!over && left === 0 && <p className="mb-3 text-sm text-emerald-400">All 27 points spent. This is a legal build.</p>}

        <div className="grid grid-cols-[2.6rem_1fr_2rem_2.6rem_2.4rem] sm:grid-cols-[4rem_1fr_3rem_4rem_3.5rem] gap-x-1.5 sm:gap-x-3 items-center text-[11px] uppercase tracking-wide text-[var(--text-muted)] px-1 pb-1">
          <span>Ability</span><span className="text-center">Base score (cost)</span><span className="text-center">Bonus</span><span className="text-center">Final</span><span className="text-center">Mod</span>
        </div>
        <ul className="divide-y divide-white/5">
          {ABILITIES.map((a, i) => (
            <li key={a} className="grid grid-cols-[2.6rem_1fr_2rem_2.6rem_2.4rem] sm:grid-cols-[4rem_1fr_3rem_4rem_3.5rem] gap-x-1.5 sm:gap-x-3 items-center py-2 px-1">
              <span className="font-bold text-[var(--text-primary)]" title={ABILITY_NAMES[i]}>{a}</span>
              <span className="flex items-center justify-center gap-1.5">
                <button type="button" className={stepBtn} onClick={() => bump(i, -1)} disabled={scores[i] <= MIN_SCORE} aria-label={`Lower ${ABILITY_NAMES[i]}`}>−</button>
                <span className="w-12 text-center leading-tight">
                  <span className="block text-lg font-semibold text-[var(--text-primary)]">{scores[i]}</span>
                  <span className="block text-[10px] text-[var(--text-muted)]">{POINT_COST[scores[i]]} pt</span>
                </span>
                <button type="button" className={stepBtn} onClick={() => bump(i, 1)} disabled={scores[i] >= MAX_SCORE} aria-label={`Raise ${ABILITY_NAMES[i]}`}>+</button>
              </span>
              <span className={`text-center text-sm ${bonus[i] ? "text-[var(--neon-cyan)]" : "text-[var(--text-muted)]"}`}>{bonus[i] ? `+${bonus[i]}` : "–"}</span>
              <span className="text-center text-xl font-bold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>{finals[i]}</span>
              <span className="text-center text-sm font-semibold text-[var(--text-secondary)]">{fmtMod(modifier(finals[i]))}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-[var(--text-muted)]">
          Sum of modifiers: <strong className="text-[var(--text-secondary)]">{fmtMod(modSum)}</strong> (the standard array alone gives {fmtMod(stdSum)} with no bonuses). Scores cap at {SCORE_CAP} after bonuses.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-5 space-y-3">
        <p className="text-sm font-semibold text-[var(--text-primary)]">Quick builds (each costs exactly 27 points)</p>
        <div className="flex flex-wrap gap-2">
          {POINT_BUY_PRESETS.map((p) => (
            <button key={p.id} type="button" onClick={() => applyPreset(p.id, p.scores)} className={chip(scores.join() === p.scores.join())}>{p.label}</button>
          ))}
        </div>
        <p className="text-xs text-[var(--text-muted)]">Presets fill STR, DEX, CON, INT, WIS, CHA in that order. Adjust any score afterwards.</p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-3 sm:p-5 space-y-3">
        <p className="text-sm font-semibold text-[var(--text-primary)]">Ability score increases</p>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={chip(rules === "2024")} onClick={() => setRules("2024")}>2024 rules (background)</button>
          <button type="button" className={chip(rules === "2014")} onClick={() => setRules("2014")}>2014 rules (race)</button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" className={chip(effectiveMode === "21")} onClick={() => setMode("21")}>+2 / +1</button>
          <button type="button" className={chip(effectiveMode === "111")} onClick={() => setMode("111")}>+1 / +1 / +1</button>
          {rules === "2014" && <button type="button" className={chip(effectiveMode === "race")} onClick={() => setMode("race")}>Pick a race</button>}
        </div>

        {effectiveMode === "21" && (
          <div className="grid grid-cols-2 gap-3 max-w-md">
            <label className="text-xs text-[var(--text-muted)]">+2 to
              <select className={selectCls} value={plus2} onChange={(e) => setPlus2(Number(e.target.value))}>
                {ABILITIES.map((a, i) => <option key={a} value={i}>{ABILITY_NAMES[i]}</option>)}
              </select>
            </label>
            <label className="text-xs text-[var(--text-muted)]">+1 to
              <select className={selectCls} value={plus1} onChange={(e) => setPlus1(Number(e.target.value))}>
                {ABILITIES.map((a, i) => <option key={a} value={i}>{ABILITY_NAMES[i]}</option>)}
              </select>
            </label>
            {plus1 === plus2 && <p className="col-span-2 text-xs text-amber-300">Choose two different abilities: the +1 is ignored while both match.</p>}
          </div>
        )}
        {effectiveMode === "111" && (
          <div>
            <p className="text-xs text-[var(--text-muted)] mb-2">Choose three different abilities for +1 each ({threes.length}/3 chosen).</p>
            <div className="flex flex-wrap gap-2">
              {ABILITIES.map((a, i) => (
                <button key={a} type="button" className={chip(threes.includes(i))} onClick={() => toggleThree(i)} aria-pressed={threes.includes(i)}>{a}</button>
              ))}
            </div>
          </div>
        )}
        {effectiveMode === "race" && (
          <label className="block text-xs text-[var(--text-muted)] max-w-md">Race (2014 Player&apos;s Handbook)
            <select className={selectCls} value={race} onChange={(e) => setRace(Number(e.target.value))}>
              {RACES_2014.map((r, i) => <option key={r.id} value={i}>{r.label}</option>)}
            </select>
          </label>
        )}
        <p className="text-xs text-[var(--text-muted)]">
          {rules === "2024"
            ? "In the 2024 rules your background lists three abilities; pick +2/+1 or +1/+1/+1 among them. Choose only abilities your background offers."
            : "In the 2014 rules your race sets the bonus. Custom +2/+1 and +1/+1/+1 cover variant and homebrew options."}
        </p>
      </div>
    </div>
  );
}
