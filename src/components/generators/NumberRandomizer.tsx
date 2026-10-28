"use client";

import { useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { createRng, newSeed } from "@/lib/randomGenerators";
import { drawNumbers, MAX_NUMBERS } from "@/lib/generators/picker";
import { typingTarget, usePreset } from "./QuickSet";

interface Preset { id: string; label: string; min: number; max: number; n?: number; unique?: boolean; sorted?: boolean }
const PRESETS: Preset[] = [
  { id: "1-2", label: "1 or 2", min: 1, max: 2 },
  { id: "1-3", label: "1–3", min: 1, max: 3 },
  { id: "1-10", label: "1–10", min: 1, max: 10 },
  { id: "1-100", label: "1–100", min: 1, max: 100 },
  { id: "1-1000", label: "1–1000", min: 1, max: 1000 },
  { id: "dice", label: "Dice 🎲", min: 1, max: 6 },
  { id: "lottery", label: "Lottery 6/49", min: 1, max: 49, n: 6, unique: true, sorted: true },
];
const GENERATOR_PRESETS: Preset[] = [
  { id: "1-10", label: "1–10", min: 1, max: 10 },
  { id: "1-100", label: "1–100", min: 1, max: 100 },
  { id: "0-9", label: "0–9", min: 0, max: 9 },
  { id: "1-1000", label: "1–1000", min: 1, max: 1000 },
  { id: "1-1000000", label: "1–1,000,000", min: 1, max: 1000000 },
  { id: "1-2", label: "Coin 1–2", min: 1, max: 2 },
  { id: "1-3", label: "1–3", min: 1, max: 3 },
  { id: "dice", label: "d6", min: 1, max: 6 },
  { id: "d20", label: "d20", min: 1, max: 20 },
  { id: "lottery", label: "Lottery 6/49", min: 1, max: 49, n: 6, unique: true, sorted: true },
];
const ALL_PRESETS = [...PRESETS, ...GENERATOR_PRESETS.filter((g) => !PRESETS.some((p) => p.id === g.id))];
const fmt = (n: number) => n.toLocaleString("en-US");

/** `variant="generator"` powers /random-number-generator: same engine, more presets, its own analytics name. */
export default function NumberRandomizer({ variant = "randomizer" }: { variant?: "randomizer" | "generator" }) {
  const presets = variant === "generator" ? GENERATOR_PRESETS : PRESETS;
  const pageId = variant === "generator" ? "random_number_generator" : "number_randomizer";
  const ev = { tool_type: pageId, locale: "en" };
  const [min, setMin] = useState("1");
  const [max, setMax] = useState("100");
  const [count, setCount] = useState("1");
  const [unique, setUnique] = useState(true);
  const [sorted, setSorted] = useState(false);
  const [across, setAcross] = useState(false);
  const [result, setResult] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [flash, setFlash] = useState("");
  const [note, setNote] = useState("");
  // Numbers already shown for the current range when "Don't repeat across clicks" is on.
  const seen = useRef<{ key: string; set: Set<number> }>({ key: "", set: new Set() });

  // Restore a shared setup or result (?min=1&max=100&n=5&u=0&r=7,12) after hydration.
  useEffect(() => {
    const restore = () => {
      const q = new URLSearchParams(window.location.search);
      const num = (k: string) => (q.get(k) && /^-?\d{1,10}$/.test(q.get(k) as string) ? (q.get(k) as string) : null);
      if (num("min")) setMin(num("min") as string);
      if (num("max")) setMax(num("max") as string);
      if (num("n")) setCount(num("n") as string);
      if (q.get("u") === "0") setUnique(false);
      const r = (q.get("r") ?? "").split(",").filter((x) => /^-?\d{1,10}$/.test(x)).slice(0, 50).map(Number);
      if (r.length) { setResult(r); setHistory([r.map(fmt).join(", ")]); }
    };
    void Promise.resolve().then(restore);
  }, []);

  type Run = { min: string; max: string; n: string; unique: boolean; sorted: boolean };
  const generate = (o: Partial<Run> = {}, source = "button") => {
    const lo = o.min ?? min, hi = o.max ?? max, n = o.n ?? count, uq = o.unique ?? unique, so = o.sorted ?? sorted;
    const a = Number(lo), b = Number(hi), want = Number(n);
    let draw: { numbers: number[]; error?: string };
    setNote("");
    if (across && Number.isInteger(a) && Number.isInteger(b) && Math.abs(b - a) < 20000) {
      // Draw from numbers not yet shown for this range; start over once they run out.
      const lowest = Math.min(a, b), size = Math.abs(b - a) + 1, key = `${lowest}:${size}`;
      if (seen.current.key !== key) seen.current = { key, set: new Set() };
      let pool = Array.from({ length: size }, (_, i) => lowest + i).filter((x) => !seen.current.set.has(x));
      if (pool.length < want) { seen.current.set.clear(); pool = Array.from({ length: size }, (_, i) => lowest + i); setNote("Every number in this range has been shown, so the pool was refilled."); }
      const idx = drawNumbers(0, pool.length - 1, want, true, createRng(newSeed()));
      draw = idx.error ? idx : { numbers: idx.numbers.map((i) => pool[i]) };
      draw.numbers.forEach((x) => seen.current.set.add(x));
    } else {
      draw = drawNumbers(a, b, want, uq, createRng(newSeed()));
    }
    if (draw.error) { setError(draw.error); setResult([]); return; }
    setError("");
    const numbers = so ? [...draw.numbers].sort((x, y) => x - y) : draw.numbers;
    setResult(numbers);
    setHistory((h) => [numbers.map(fmt).join(", "), ...h].slice(0, 12));
    const params = new URLSearchParams({ min: lo, max: hi, n });
    if (!uq) params.set("u", "0");
    if (numbers.length <= 50) params.set("r", numbers.join(","));
    window.history.replaceState(null, "", `${window.location.pathname}?${params}`);
    track("generate_success", { ...ev, result_count: numbers.length, unique: uq, range: Math.abs(Number(hi) - Number(lo)) + 1 });
    track(`${pageId}_use`, { ...ev, result_count: numbers.length, content_source: source });
  };

  const applyPreset = (p: Preset, source = "preset") => {
    const o: Run = { min: String(p.min), max: String(p.max), n: String(p.n ?? 1), unique: p.unique ?? true, sorted: p.sorted ?? false };
    setMin(o.min); setMax(o.max); setCount(o.n); setUnique(o.unique); setSorted(o.sorted);
    generate(o, `${source}_${p.id}`);
  };
  usePreset("numbers", (id) => { const p = ALL_PRESETS.find((x) => x.id === id); if (p) applyPreset(p, "section"); });

  // Space or Enter draws again when focus is not in a field.
  const keyRef = useRef<() => void>(() => {});
  useEffect(() => { keyRef.current = () => generate({}, "keyboard"); });
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if ((e.key === " " || e.key === "Enter") && !typingTarget(e.target) && !e.metaKey && !e.ctrlKey) { e.preventDefault(); keyRef.current(); }
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);

  const flashFor = (what: string) => { setFlash(what); window.setTimeout(() => setFlash(""), 1500); };
  const field = "w-full bg-[var(--bg-secondary)] border border-white/10 rounded-xl px-3 py-2 text-lg text-[var(--text-primary)] tabular-nums";
  const label = "block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1";
  const ghost = "px-4 py-2 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors";

  return (
    <section id="tool" className="max-w-3xl mx-auto px-4 sm:px-6 scroll-mt-20">
      <div className="glass-card p-4 sm:p-8">
        <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Presets">
          {presets.map((p) => (
            <button key={p.id} type="button" className={ghost} onClick={() => applyPreset(p)}>{p.label}</button>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          <label><span className={label}>From</span><input inputMode="numeric" value={min} onChange={(e) => setMin(e.target.value.replace(/[^\d-]/g, ""))} className={field} /></label>
          <label><span className={label}>To</span><input inputMode="numeric" value={max} onChange={(e) => setMax(e.target.value.replace(/[^\d-]/g, ""))} className={field} /></label>
          <label><span className={label}>How many</span><input inputMode="numeric" value={count} onChange={(e) => setCount(e.target.value.replace(/\D/g, "").slice(0, 4))} className={field} /></label>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 mt-4 text-center min-h-32 sm:min-h-36 flex items-center justify-center" aria-live="polite">
          {error ? <p className="text-[var(--neon-pink)] text-sm">{error}</p>
            : result.length === 1 ? <p className="text-7xl sm:text-8xl font-extrabold tabular-nums break-all" style={{ fontFamily: "var(--font-display)" }} data-number-result>{fmt(result[0])}</p>
            : result.length ? <ul className="flex flex-wrap justify-center gap-2" data-number-result>{result.map((n, i) => <li key={i} className="px-3 py-1.5 rounded-lg bg-white/[0.06] text-2xl font-bold tabular-nums">{fmt(n)}</li>)}</ul>
            : <p className="text-[var(--text-muted)]">Pick a preset or press Generate 🎲</p>}
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <button type="button" onClick={() => generate()} className="btn-generate">🎲 {result.length ? "Generate again" : "Generate"}</button>
          {result.length > 0 && <button type="button" className={ghost} onClick={async () => { if (await copyText(result.join(", "))) { flashFor("copy"); track("copy_result", ev); } }}>{flash === "copy" ? "Copied ✓" : "Copy"}</button>}
          {result.length > 0 && <button type="button" className={ghost} onClick={async () => { if (await copyText(window.location.href)) { flashFor("link"); track(`${pageId}_share`, { ...ev, share_method: "link" }); } }}>{flash === "link" ? "Link copied ✓" : "Copy result link"}</button>}
        </div>
        {note && <p className="text-xs text-center text-[var(--neon-cyan)] mt-2" role="status">{note}</p>}
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1 mt-3 text-sm text-[var(--text-secondary)]">
          <label className="flex items-center gap-2 min-h-8"><input type="checkbox" checked={unique || across} disabled={across} onChange={(e) => setUnique(e.target.checked)} /> No repeats in a batch</label>
          <label className="flex items-center gap-2 min-h-8"><input type="checkbox" checked={across} onChange={(e) => { setAcross(e.target.checked); seen.current = { key: "", set: new Set() }; }} /> Never repeat across clicks</label>
          <label className="flex items-center gap-2 min-h-8"><input type="checkbox" checked={sorted} onChange={(e) => setSorted(e.target.checked)} /> Sort results</label>
        </div>
        <p className="text-xs text-center text-[var(--text-muted)] mt-2">Press Space or Enter to draw again · up to {MAX_NUMBERS.toLocaleString("en-US")} numbers · ranges up to ±1 billion.</p>
        {history.length > 1 && <p className="text-sm text-[var(--text-secondary)] mt-3"><span className="text-xs uppercase tracking-widest text-[var(--text-muted)]">History: </span>{history.slice(1, 9).join(" · ")}</p>}
      </div>
    </section>
  );
}
