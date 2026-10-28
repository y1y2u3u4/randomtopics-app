"use client";

import { useEffect, useRef, useState } from "react";
import { track } from "@/lib/track";
import { secureInt } from "@/lib/generators/secure";
import { copyText } from "@/lib/clipboard";

type Side = "H" | "T";
const COUNTS = [1, 2, 3, 5, 10];
const SERIES = [0, 3, 5, 7];
const LIFE_KEY = "rt_coin_life_v1";
type Life = { flips: number; heads: number; calls: number; callsWon: number; series: number };
const NO_LIFE: Life = { flips: 0, heads: 0, calls: 0, callsWon: 0, series: 0 };
const name = (s: Side) => (s === "H" ? "Heads" : "Tails");

export type CoinFlipOptions = {
  /** Event prefix: fires {pageId}_use on every flip and {pageId}_share on share. */
  pageId: string;
  /** Adds call-it, best-of-N series, all-time stats and sharing; compact layout with the button above the options. */
  cricket?: boolean;
};

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

export default function CoinFlip({ extended }: { extended?: CoinFlipOptions } = {}) {
  const ev = { tool_type: extended ? extended.pageId : "flip_a_coin", locale: "en" };
  const [count, setCount] = useState(1);
  const [coins, setCoins] = useState<Side[]>([]);
  const [flipping, setFlipping] = useState(false);
  const [history, setHistory] = useState<Side[]>([]);
  const [anim, setAnim] = useState(0);
  const timer = useRef<number | null>(null);
  const [call, setCall] = useState<Side | null>(null);
  const [best, setBest] = useState(0);
  const [score, setScore] = useState({ H: 0, T: 0 });
  const [life, setLife] = useState<Life>(NO_LIFE);
  const [flash, setFlash] = useState("");
  const [lastCall, setLastCall] = useState<{ call: Side; won: boolean } | null>(null);
  const lifeLoaded = useRef(false);

  useEffect(() => {
    if (!extended) return;
    let raw: string | null = null;
    try { raw = localStorage.getItem(LIFE_KEY); } catch { /* optional */ }
    void Promise.resolve().then(() => {
      if (raw) { try { setLife({ ...NO_LIFE, ...JSON.parse(raw) }); } catch { /* optional */ } }
      lifeLoaded.current = true;
    });
  }, [extended]);
  useEffect(() => {
    if (!extended || !lifeLoaded.current) return;
    try { localStorage.setItem(LIFE_KEY, JSON.stringify(life)); } catch { /* optional */ }
  }, [life, extended]);

  const need = best ? Math.ceil(best / 2) : 0;
  const seriesWinner: Side | null = best ? (score.H >= need ? "H" : score.T >= need ? "T" : null) : null;

  const heads = history.filter((s) => s === "H").length;
  const tails = history.length - heads;
  let streak = 0;
  for (let i = history.length - 1; i >= 0 && history[i] === history[history.length - 1]; i--) streak++;
  let longest = 0, run = 0;
  history.forEach((s, i) => { run = i > 0 && history[i - 1] === s ? run + 1 : 1; if (run > longest) longest = run; });

  const flip = () => {
    if (flipping) return;
    const next = Array.from({ length: extended && best ? 1 : count }, () => (secureInt(2) === 0 ? "H" : "T") as Side);
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    setFlipping(!reduced);
    setAnim((a) => a + 1);
    if (timer.current) window.clearTimeout(timer.current);
    const commit = () => {
      setCoins(next); setHistory((h) => [...h, ...next].slice(-500)); setFlipping(false);
      track("generate_success", { ...ev, result_count: next.length });
      if (!extended) return;
      track(`${extended.pageId}_use`, { ...ev, result_count: next.length, mode: best ? `best_of_${best}` : "single", called: call ? 1 : 0 });
      const won = call ? next[0] === call : false;
      if (call) setLastCall({ call, won });
      let seriesDone = false;
      if (best) {
        const base = seriesWinner ? { H: 0, T: 0 } : score;
        const ns = { H: base.H + (next[0] === "H" ? 1 : 0), T: base.T + (next[0] === "T" ? 1 : 0) };
        setScore(ns);
        seriesDone = ns.H >= need || ns.T >= need;
      }
      setLife((l) => ({ flips: l.flips + next.length, heads: l.heads + next.filter((x) => x === "H").length, calls: l.calls + (call ? 1 : 0), callsWon: l.callsWon + (won ? 1 : 0), series: l.series + (seriesDone ? 1 : 0) }));
    };
    if (reduced) commit(); else timer.current = window.setTimeout(commit, 900);
  };

  const pct = history.length ? Math.round((heads / history.length) * 100) : 0;
  const chip = (on: boolean) => `px-4 py-2 rounded-xl text-sm border transition-colors ${on ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/15" : "border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50"}`;
  const effCount = extended && best ? 1 : count;
  const size = extended ? (effCount === 1 ? 128 : effCount <= 3 ? 88 : 68) : count === 1 ? 160 : count <= 3 ? 104 : 76;
  const headline = coins.length === 1 ? (coins[0] === "H" ? "Heads" : "Tails") : coins.length ? `${coins.filter((s) => s === "H").length} heads · ${coins.filter((s) => s === "T").length} tails` : "";
  const callLine = extended && lastCall && coins.length === 1 && !flipping
    ? lastCall.won ? `You called ${name(lastCall.call)}: you win the toss.${extended.cricket ? " Choose to bat or bowl." : ""}` : `You called ${name(lastCall.call)}: you lose the toss.${extended.cricket ? " The other captain chooses to bat or bowl." : ""}`
    : "";
  const seriesLine = extended && best ? (seriesWinner ? `${name(seriesWinner)} wins the series ${Math.max(score.H, score.T)}–${Math.min(score.H, score.T)}` : `Best of ${best}: first to ${need}`) : "";
  const share = async () => {
    const text = extended && best && seriesWinner ? `${name(seriesWinner)} won a best-of-${best} coin toss ${Math.max(score.H, score.T)}–${Math.min(score.H, score.T)}` : coins.length === 1 ? `The coin landed on ${headline}` : `Coin flip result: ${headline}`;
    if (await copyText(`${text}. Flip your own: ${window.location.origin}${window.location.pathname}`)) {
      setFlash("copied"); window.setTimeout(() => setFlash(""), 1600);
      track(`${extended!.pageId}_share`, { ...ev, share_method: "copy" });
    }
  };
  const lifeSection = extended && life.flips > 0 && (
    <p className="mt-3 text-xs text-[var(--text-muted)]" data-coin-life>
      All-time in this browser: {life.flips} flips, {Math.round((life.heads / life.flips) * 100)}% heads
      {life.calls > 0 && <>, {life.callsWon} of {life.calls} calls right</>}
      {life.series > 0 && <>, {life.series} series played</>}.{" "}
      <button type="button" className="underline" onClick={() => setLife(NO_LIFE)}>Clear</button>
    </p>
  );
  const callBox = extended && (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-3" role="group" aria-label="Call it before the toss">
      <span className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Call it</span>
      {(["H", "T"] as Side[]).map((s) => <button key={s} type="button" aria-pressed={call === s} className={chip(call === s)} onClick={() => setCall(call === s ? null : s)}>{name(s)}</button>)}
    </div>
  );
  const countBox = (
    <div className="flex flex-wrap justify-center gap-2 mb-5" role="group" aria-label="Number of coins">
      {COUNTS.map((n) => <button key={n} type="button" aria-pressed={effCount === n} disabled={!!(extended && best)} className={`${chip(effCount === n)} disabled:opacity-40`} onClick={() => setCount(n)}>{n} {n === 1 ? "coin" : "coins"}</button>)}
    </div>
  );
  const seriesBox = extended && (
    <div className="flex flex-wrap items-center justify-center gap-2 mb-3" role="group" aria-label="Best of series">
      <span className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Series</span>
      {SERIES.map((n) => <button key={n} type="button" aria-pressed={best === n} className={chip(best === n)} onClick={() => { setBest(n); setScore({ H: 0, T: 0 }); }}>{n ? `Best of ${n}` : "Single"}</button>)}
    </div>
  );
  const coinArea = (
    <div key={anim} className={`flex flex-wrap items-center justify-center gap-4 ${extended ? "min-h-32" : "min-h-44"}`} style={{ perspective: 600 }}>
      {(coins.length && !flipping ? coins : Array.from({ length: effCount }, () => null as Side | null)).map((s, i) => (
        <Coin key={i} side={s} flipping={flipping} size={size} />
      ))}
    </div>
  );
  const verb = extended?.cricket ? "Toss" : "Flip";
  const flipLabel = seriesWinner ? "New series" : history.length ? `${verb} again` : `${verb} the coin`;
  const flipButton = <button type="button" onClick={flip} disabled={flipping} className={`btn-generate ${extended ? "mt-3" : "mt-4"}`}>🪙 {flipLabel}</button>;

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6">
      <style>{`@keyframes coinflip{0%{transform:rotateX(0) translateY(0) scale(1)}50%{transform:rotateX(900deg) translateY(-48px) scale(1.12)}100%{transform:rotateX(1800deg) translateY(0) scale(1)}}`}</style>
      <div className={`glass-card ${extended ? "p-4" : "p-5"} sm:p-8 text-center`}>
        {!extended && countBox}
        {coinArea}
        <p className={`${extended ? "text-2xl sm:text-4xl mt-2 min-h-8" : "text-3xl sm:text-4xl mt-4 min-h-10"} font-extrabold`} style={{ fontFamily: "var(--font-display)" }} aria-live="polite" data-coin-result>
          {flipping ? (extended?.cricket ? "Tossing…" : "Flipping…") : headline || "Heads or tails?"}
        </p>
        {extended && (
          <p className="text-sm text-[var(--text-secondary)] min-h-5" aria-live="polite">{flipping ? "" : callLine || seriesLine}</p>
        )}
        {extended && best > 0 && (
          <p className="text-sm tabular-nums text-[var(--text-secondary)]" data-coin-score>Heads {score.H} – {score.T} Tails</p>
        )}
        {flipButton}
        {extended && coins.length > 0 && !flipping && (
          <button type="button" onClick={share} className="ml-2 mt-3 px-4 py-2 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50">{flash === "copied" ? "Copied ✓" : "Copy result"}</button>
        )}
        {extended && <div className="mt-5">{callBox}{seriesBox}{countBox}</div>}

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
            <button type="button" className="mt-3 text-xs underline text-[var(--text-muted)]" onClick={() => { setHistory([]); setCoins([]); setScore({ H: 0, T: 0 }); setLastCall(null); }}>Reset counts</button>
          </div>
        )}
        {lifeSection}
        <p className="text-xs text-[var(--text-muted)] mt-4">Each flip is exactly 50/50 and independent of the last one — streaks happen by chance.</p>
      </div>
    </section>
  );
}
