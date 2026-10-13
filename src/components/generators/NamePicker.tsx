"use client";

import { useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { createRng, newSeed, parseNames } from "@/lib/randomGenerators";
import { pickNames, randomOrder } from "@/lib/generators/picker";

const STORAGE = "rt_name_picker_names";
const SAMPLE = "Ava\nBen\nChloe\nDiego\nEmma\nFinn\nGrace\nHiro\nIsla\nJonah\nKai\nLuna";
const ev = { tool_type: "random_name_picker", locale: "en" };

export default function NamePicker() {
  const [text, setText] = useState("");
  const [count, setCount] = useState(1);
  const [removePicked, setRemovePicked] = useState(true);
  const [remaining, setRemaining] = useState<string[] | null>(null);
  const [winners, setWinners] = useState<string[]>([]);
  const [order, setOrder] = useState<string[]>([]);
  const [rolling, setRolling] = useState<string | null>(null);
  const [history, setHistory] = useState<string[][]>([]);
  const [flash, setFlash] = useState("");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  // The list stays on this device only.
  useEffect(() => {
    const restore = () => { try { const saved = localStorage.getItem(STORAGE); if (saved) setText(saved); } catch { /* storage blocked */ } };
    void Promise.resolve().then(restore);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, []);
  const updateText = (value: string) => {
    setText(value);
    setRemaining(null);
    try { localStorage.setItem(STORAGE, value); } catch { /* storage blocked */ }
  };

  const names = parseNames(text);
  const pool = remaining ?? names;

  const pick = () => {
    if (!pool.length || rolling) return;
    const rng = createRng(newSeed());
    const result = pickNames(pool, count, removePicked, rng);
    setOrder([]);
    const finish = () => {
      setRolling(null);
      setWinners(result.picked);
      setHistory((h) => [result.picked, ...h].slice(0, 20));
      if (removePicked) setRemaining(result.remaining);
      track("generate_success", { ...ev, result_count: result.picked.length, remove_picked: removePicked });
    };
    const reduced = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduced || pool.length < 2) { finish(); return; }
    let steps = 0;
    timer.current = setInterval(() => {
      setRolling(pool[Math.floor(Math.random() * pool.length)]);
      if (++steps >= 14) { if (timer.current) clearInterval(timer.current); timer.current = null; finish(); }
    }, 60);
  };

  const shuffleAll = () => {
    if (!names.length) return;
    setWinners([]);
    setOrder(randomOrder(names, createRng(newSeed())));
    track("generate_success", { ...ev, generator_mode: "order", result_count: names.length });
  };

  const copy = async (value: string, key: string) => {
    if (await copyText(value)) { setFlash(key); window.setTimeout(() => setFlash(""), 1500); track("copy_result", ev); }
  };

  const field = "w-full bg-[var(--bg-secondary)] border border-white/10 rounded-xl px-3 py-2 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]";
  const ghost = "px-4 py-2 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors disabled:opacity-40";

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-5 sm:p-8 grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div>
          <label htmlFor="name-list" className="block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1">Names (one per line or comma-separated)</label>
          <textarea id="name-list" value={text} onChange={(e) => updateText(e.target.value)} rows={10} placeholder={"Ava\nBen\nChloe…"} className={`${field} font-mono text-sm`} />
          <div className="flex flex-wrap items-center justify-between gap-2 mt-2 text-xs text-[var(--text-muted)]">
            <span>{names.length} names{remaining && removePicked ? ` · ${remaining.length} left in the hat` : ""}</span>
            <span className="flex gap-3">
              {!text && <button type="button" className="text-[var(--neon-cyan)] hover:underline" onClick={() => updateText(SAMPLE)}>Use a sample class list</button>}
              {text && <button type="button" className="hover:text-[var(--text-primary)]" onClick={() => updateText("")}>Clear</button>}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-[var(--text-secondary)]">
            <label className="flex items-center gap-2">Pick
              <select value={count} onChange={(e) => setCount(Number(e.target.value))} className="bg-[var(--bg-secondary)] border border-white/10 rounded-lg px-2 py-1.5 text-[var(--text-primary)]">
                {[1, 2, 3, 4, 5, 6, 8, 10].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
              {count === 1 ? "name" : "names"}
            </label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={removePicked} onChange={(e) => { setRemovePicked(e.target.checked); setRemaining(null); }} /> Remove picked names (no repeats)</label>
          </div>
          <p className="text-xs text-[var(--text-muted)] mt-3">Your list is saved only in this browser.</p>
        </div>

        <div className="flex flex-col">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-center min-h-48 flex flex-col items-center justify-center" aria-live="polite">
            {rolling ? (
              <p className="text-4xl sm:text-5xl font-extrabold text-[var(--text-muted)]" style={{ fontFamily: "var(--font-display)" }}>{rolling}</p>
            ) : winners.length ? (
              <>
                <p className="text-xs uppercase tracking-widest text-[var(--neon-cyan)] mb-2">{winners.length === 1 ? "Picked" : `${winners.length} picked`}</p>
                <ul className="space-y-1" data-name-picker-result>
                  {winners.map((w, i) => <li key={`${w}-${i}`} className={`${winners.length === 1 ? "text-4xl sm:text-6xl" : "text-2xl sm:text-3xl"} font-extrabold break-words`} style={{ fontFamily: "var(--font-display)" }}>{w}</li>)}
                </ul>
              </>
            ) : order.length ? (
              <>
                <p className="text-xs uppercase tracking-widest text-[var(--neon-cyan)] mb-2">Random order</p>
                <ol className="list-decimal pl-6 text-left text-lg max-h-64 overflow-y-auto" data-name-picker-order>
                  {order.map((n, i) => <li key={`${n}-${i}`}>{n}</li>)}
                </ol>
              </>
            ) : (
              <p className="text-[var(--text-muted)]">{names.length ? "Press Pick a name 🎩" : "Add some names, then press Pick a name 🎩"}</p>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-3 mt-4">
            <button type="button" onClick={pick} disabled={!pool.length || Boolean(rolling)} className="btn-generate disabled:opacity-40">🎩 {count === 1 ? "Pick a name" : `Pick ${count} names`}</button>
            <button type="button" onClick={shuffleAll} disabled={!names.length} className={ghost}>Random order for everyone</button>
            {(winners.length > 0 || order.length > 0) && <button type="button" className={ghost} onClick={() => copy((winners.length ? winners : order.map((n, i) => `${i + 1}. ${n}`)).join("\n"), "res")}>{flash === "res" ? "Copied ✓" : "Copy"}</button>}
            {remaining && removePicked && <button type="button" className={ghost} onClick={() => { setRemaining(null); setWinners([]); }}>Put everyone back</button>}
          </div>
          {removePicked && remaining && !remaining.length && <p className="text-sm text-center text-[var(--neon-cyan)] mt-3">Everyone has been picked. Press “Put everyone back” to start again.</p>}
          {history.length > 1 && (
            <div className="mt-5 text-sm text-[var(--text-secondary)]">
              <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1">Earlier picks</p>
              <p>{history.slice(1).map((h) => h.join(", ")).join(" · ")}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
