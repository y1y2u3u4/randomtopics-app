"use client";

import { useEffect, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { createRng, newSeed } from "@/lib/randomGenerators";
import { drawNumbers, MAX_NUMBERS } from "@/lib/generators/picker";

const PRESETS = [
  { label: "1–10", min: 1, max: 10 },
  { label: "1–100", min: 1, max: 100 },
  { label: "1–1000", min: 1, max: 1000 },
  { label: "Dice 🎲", min: 1, max: 6 },
];
const ev = { tool_type: "number_randomizer", locale: "en" };
const fmt = (n: number) => n.toLocaleString("en-US");

export default function NumberRandomizer() {
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("1");
  const [unique, setUnique] = useState(true);
  const [sorted, setSorted] = useState(false);
  const [result, setResult] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [flash, setFlash] = useState(false);

  // Restore a shared setup (?min=1&max=100&n=5&u=0) after hydration.
  useEffect(() => {
    const restore = () => {
      const q = new URLSearchParams(window.location.search);
      const num = (k: string) => (q.get(k) && /^-?\d{1,10}$/.test(q.get(k) as string) ? (q.get(k) as string) : null);
      if (num("min")) setMin(num("min") as string);
      if (num("max")) setMax(num("max") as string);
      if (num("n")) setCount(num("n") as string);
      if (q.get("u") === "0") setUnique(false);
    };
    void Promise.resolve().then(restore);
  }, []);

  const generate = (lo = min, hi = max) => {
    const draw = drawNumbers(Number(lo), Number(hi), Number(count), unique, createRng(newSeed()));
    if (draw.error) { setError(draw.error); setResult([]); return; }
    setError("");
    const numbers = sorted ? [...draw.numbers].sort((a, b) => a - b) : draw.numbers;
    setResult(numbers);
    setHistory((h) => [numbers.map(fmt).join(", "), ...h].slice(0, 12));
    const params = new URLSearchParams({ min: lo, max: hi, n: count });
    if (!unique) params.set("u", "0");
    window.history.replaceState(null, "", `${window.location.pathname}?${params}`);
    track("generate_success", { ...ev, result_count: numbers.length, unique, range: Number(hi) - Number(lo) + 1 });
  };

  const field = "w-full bg-[var(--bg-secondary)] border border-white/10 rounded-xl px-3 py-2 text-lg text-[var(--text-primary)] tabular-nums";
  const label = "block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1";
  const ghost = "px-4 py-2 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors";

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-5 sm:p-8">
        <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Presets">
          {PRESETS.map((p) => (
            <button key={p.label} type="button" className={ghost} onClick={() => { setMin(String(p.min)); setMax(String(p.max)); generate(String(p.min), String(p.max)); }}>{p.label}</button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          <label><span className={label}>From</span><input inputMode="numeric" value={min} onChange={(e) => setMin(e.target.value.replace(/[^\d-]/g, ""))} className={field} /></label>
          <label><span className={label}>To</span><input inputMode="numeric" value={max} onChange={(e) => setMax(e.target.value.replace(/[^\d-]/g, ""))} className={field} /></label>
          <label><span className={label}>How many</span><input inputMode="numeric" value={count} onChange={(e) => setCount(e.target.value.replace(/\D/g, "").slice(0, 4))} className={field} /></label>
        </div>
        <div className="flex flex-wrap gap-4 mt-3 text-sm text-[var(--text-secondary)]">
          <label className="flex items-center gap-2"><input type="checkbox" checked={unique} onChange={(e) => setUnique(e.target.checked)} /> No repeats</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={sorted} onChange={(e) => setSorted(e.target.checked)} /> Sort results</label>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 mt-5 text-center min-h-36 flex items-center justify-center" aria-live="polite">
          {error ? <p className="text-[var(--neon-pink)] text-sm">{error}</p>
            : result.length === 1 ? <p className="text-6xl sm:text-8xl font-extrabold tabular-nums" style={{ fontFamily: "var(--font-display)" }} data-number-result>{fmt(result[0])}</p>
            : result.length ? <ul className="flex flex-wrap justify-center gap-2" data-number-result>{result.map((n, i) => <li key={i} className="px-3 py-1.5 rounded-lg bg-white/[0.06] text-xl font-bold tabular-nums">{fmt(n)}</li>)}</ul>
            : <p className="text-[var(--text-muted)]">Set a range and press Generate 🎲</p>}
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <button type="button" onClick={() => generate()} className="btn-generate">🎲 Generate</button>
          {result.length > 0 && <button type="button" className={ghost} onClick={async () => { if (await copyText(result.join(", "))) { setFlash(true); window.setTimeout(() => setFlash(false), 1500); track("copy_result", ev); } }}>{flash ? "Copied ✓" : "Copy"}</button>}
          {result.length > 0 && <button type="button" className={ghost} onClick={async () => { await copyText(window.location.href); }}>Copy link to this setup</button>}
        </div>
        <p className="text-xs text-center text-[var(--text-muted)] mt-3">Up to {MAX_NUMBERS.toLocaleString("en-US")} numbers at once · ranges up to ±1 billion · with No repeats on, each number appears once, like drawing raffle tickets.</p>
        {history.length > 1 && <p className="text-sm text-[var(--text-secondary)] mt-4"><span className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Earlier: </span>{history.slice(1, 6).join(" · ")}</p>}
      </div>
    </section>
  );
}
