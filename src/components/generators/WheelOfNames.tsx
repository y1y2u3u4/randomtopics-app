"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import SpinWheel from "./SpinWheel";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { fromBase64Url, parseNames, toBase64Url } from "@/lib/randomGenerators";
import { secureInt, weightedIndex } from "@/lib/generators/secure";

const SAMPLE = "Alex\nBlake\nCasey\nDana\nEllis\nFinn\nGray\nHarper";
const MAX = 200;
const SAVED_KEY = "rt_picker_lists_v1";
const LAST_KEY = "rt_picker_last_v1";
const MAX_SAVED = 20;
type Saved = { name: string; text: string };
const QUICK: { label: string; text: string }[] = [
  { label: "Yes / No", text: "Yes\nNo" },
  { label: "Dinner", text: "Pizza\nTacos\nSushi\nBurgers\nPasta\nCurry\nSalad\nStir fry" },
  { label: "Truth or dare", text: "Truth\nDare" },
  { label: "1 to 10", text: "1\n2\n3\n4\n5\n6\n7\n8\n9\n10" },
  { label: "Who goes first", text: "Player 1\nPlayer 2\nPlayer 3\nPlayer 4" },
];

export type WheelOfNamesOptions = {
  /** Event prefix: fires {pageId}_use on every spin and {pageId}_share on share. */
  pageId: string;
  /** Adds import (CSV/TXT), per-entry weights, spin counts and Ctrl+Enter to spin. */
  pro?: boolean;
  /** Preloaded entries for a template page. Skips the "last list" restore and save. */
  preset?: string;
  /** Start with "remove the winner after each spin" ticked (raffles, roll calls). */
  removeDefault?: boolean;
};

const encodeWeights = (names: string[], weights: Record<string, number>) =>
  [...new Set(names)].filter((n) => (weights[n] ?? 1) !== 1).map((n) => `${n.replace(/[\t\n]/g, " ")}\t${weights[n]}`).join("\n");
const decodeWeights = (raw: string) => {
  const out: Record<string, number> = {};
  for (const line of raw.split("\n")) { const [n, w] = line.split("\t"); const v = Math.round(Number(w)); if (n && v >= 1 && v <= 100) out[n] = v; }
  return out;
};

export default function WheelOfNames({ extended }: { extended?: WheelOfNamesOptions } = {}) {
  const ev = { tool_type: extended ? extended.pageId : "wheel_of_names", locale: "en" };
  const [saved, setSaved] = useState<Saved[]>([]);
  const [listName, setListName] = useState("");
  const ready = useRef(false);
  const pro = Boolean(extended?.pro);
  const preset = extended?.preset;
  const [text, setText] = useState(preset ?? SAMPLE);
  const [weights, setWeights] = useState<Record<string, number>>({});
  const [useWeights, setUseWeights] = useState(false);
  const [spins, setSpins] = useState(0);
  const [importMsg, setImportMsg] = useState("");
  const spinRef = useRef<() => void>(() => {});
  const [removeWinner, setRemoveWinner] = useState(Boolean(extended?.removeDefault));
  const [target, setTarget] = useState<{ index: number; nonce: number } | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [tally, setTally] = useState<Record<string, number>>({});
  const [flash, setFlash] = useState("");
  const names = useMemo(() => parseNames(text).slice(0, MAX), [text]);
  // The wheel shows the list as it was when the spin started.
  const [frozen, setFrozen] = useState<string[] | null>(null);
  const shown = frozen ?? names;

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("names");
    const decoded = raw ? fromBase64Url(raw) : null;
    if (decoded && parseNames(decoded).length >= 2) {
      void Promise.resolve().then(() => setText(decoded.slice(0, 8000)));
      const wRaw = new URLSearchParams(window.location.search).get("w");
      const wDec = wRaw ? fromBase64Url(wRaw) : null;
      const w = wDec ? decodeWeights(wDec) : {};
      if (Object.keys(w).length) void Promise.resolve().then(() => { setWeights(w); setUseWeights(true); });
      if (new URLSearchParams(window.location.search).get("el") === "1") void Promise.resolve().then(() => setRemoveWinner(true));
    } else if (extended && !preset) {
      try {
        const last = localStorage.getItem(LAST_KEY);
        if (last && parseNames(last).length >= 2) void Promise.resolve().then(() => setText(last.slice(0, 8000)));
      } catch { /* optional */ }
    }
    if (extended) {
      try { const raw = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"); if (Array.isArray(raw)) void Promise.resolve().then(() => setSaved(raw.filter((x) => x && typeof x.name === "string" && typeof x.text === "string").slice(0, MAX_SAVED))); } catch { /* optional */ }
    }
    void Promise.resolve().then(() => { ready.current = true; });
  }, [extended, preset]);

  useEffect(() => {
    if (!extended || preset || !ready.current) return;
    try { localStorage.setItem(LAST_KEY, text.slice(0, 8000)); } catch { /* optional */ }
  }, [text, extended, preset]);
  const persist = (next: Saved[]) => { setSaved(next); try { localStorage.setItem(SAVED_KEY, JSON.stringify(next)); } catch { /* optional */ } };
  const saveList = () => {
    const name = listName.trim().slice(0, 40) || `List ${saved.length + 1}`;
    if (names.length < 2) return;
    persist([{ name, text }, ...saved.filter((x) => x.name !== name)].slice(0, MAX_SAVED));
    setListName("");
    flashMsg("saved");
  };

  const weightOf = (n: string) => (useWeights ? Math.max(1, Math.min(100, Math.round(weights[n] ?? 1))) : 1);
  const spin = () => {
    if (spinning || names.length < 2) return;
    const index = useWeights ? weightedIndex(names.map(weightOf)) : secureInt(names.length);
    setFrozen(names);
    setWinner("");
    setSpinning(true);
    setTarget({ index, nonce: Date.now() });
  };
  const done = (index: number) => {
    const name = (frozen ?? names)[index];
    setWinner(name);
    setHistory((h) => [name, ...h].slice(0, pro ? 200 : 15));
    setTally((t) => ({ ...t, [name]: (t[name] ?? 0) + 1 }));
    setSpins((n) => n + 1);
    setSpinning(false);
    setFrozen(null);
    if (removeWinner) setText(parseNames(text).filter((n, i) => !(i === index && n === name)).join("\n"));
    track("generate_success", { ...ev, result_count: 1, entries: names.length });
    if (extended) track(`${extended.pageId}_use`, { ...ev, result_count: 1, entries: names.length });
  };
  const flashMsg = (m: string) => { setFlash(m); window.setTimeout(() => setFlash(""), 1500); };
  const share = async () => {
    let url = `${window.location.origin}${window.location.pathname}?names=${toBase64Url(names.join("\n"))}`;
    if (pro) {
      const w = useWeights ? encodeWeights(names, weights) : "";
      if (w) url += `&w=${toBase64Url(w)}`;
      if (removeWinner) url += "&el=1";
    }
    if (await copyText(url)) { flashMsg("link"); track("copy_result", ev); if (extended) track(`${extended.pageId}_share`, { ...ev, share_method: "link" }); }
  };

  const segments = shown.map((label) => ({ label, weight: weightOf(label) }));
  spinRef.current = spin;
  useEffect(() => {
    if (!pro) return;
    const onKey = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key === "Enter") { e.preventDefault(); spinRef.current(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pro]);
  const importFile = async (file: File | undefined) => {
    if (!file) return;
    if (file.size > 1_000_000) { setImportMsg("That file is too large (1 MB max)."); return; }
    const { parseWheelFile } = await import("@/lib/wheelImport");
    const res = parseWheelFile(await file.text(), MAX);
    if (res.names.length < 2) { setImportMsg("Found fewer than two names in that file."); return; }
    setText(res.names.join("\n"));
    if (Object.keys(res.weights).length) { setWeights(res.weights); setUseWeights(true); }
    setImportMsg(`Imported ${res.names.length} entries from ${file.name.slice(0, 40)}.`);
  };
  const tallyRows = Object.entries(tally).sort((a, b) => b[1] - a[1]);
  const btn = "px-3 py-1.5 rounded-lg text-xs border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors";

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-4 sm:p-8 grid md:grid-cols-2 gap-6 items-start">
        <div className={extended ? "flex flex-col" : undefined}>
          {shown.length >= 2 ? (
            <div className={extended ? "order-2 w-full max-w-[250px] sm:max-w-[360px] md:max-w-none mx-auto" : undefined}>
            <SpinWheel segments={segments} target={target} onDone={done} ariaLabel={`Wheel with ${shown.length} names`} />
            </div>
          ) : (
            <div className={`${extended ? "order-2 " : ""}aspect-square max-w-[360px] mx-auto rounded-full border-2 border-dashed border-white/15 flex items-center justify-center text-center p-8 text-[var(--text-muted)]`}>Add at least two names to spin the wheel</div>
          )}
          <div className={`text-center ${extended ? "order-3 mt-3 min-h-16" : "mt-4 min-h-20"}`} aria-live="polite">
            {spinning ? <p className="text-xl text-[var(--text-muted)]">Spinning…</p>
              : winner ? <><p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Winner</p><p className="text-3xl sm:text-4xl font-extrabold gradient-text break-words" style={{ fontFamily: "var(--font-display)" }} data-wheel-winner>{winner}</p></>
              : <p className="text-[var(--text-muted)]">Press Spin to pick a name</p>}
          </div>
          <div className={`flex justify-center ${extended ? "order-1 mb-3 md:order-4 md:mb-0" : ""}`}><button type="button" className="btn-generate" disabled={spinning || names.length < 2} onClick={spin}>🎡 {winner ? "Spin again" : "Spin the wheel"}</button></div>
        </div>
        <div>
          <label htmlFor="wheel-names" className="block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1">{extended ? "Names or choices on the wheel (" : "Names on the wheel ("}{names.length}{names.length >= MAX ? `, max ${MAX}` : ""})</label>
          <textarea id="wheel-names" value={text} onChange={(e) => setText(e.target.value)} disabled={spinning} rows={10} spellCheck={false}
            className="w-full bg-[var(--bg-secondary)] border border-white/10 rounded-xl px-3 py-2 text-[var(--text-primary)] text-base leading-relaxed" placeholder={"One name per line\n(or separate with commas)"} />
          <div className="flex flex-wrap gap-2 mt-2">
            <button type="button" className={btn} disabled={spinning} onClick={() => setText(names.map((n) => [secureInt(1e9), n] as const).sort((a, b) => a[0] - b[0]).map((x) => x[1]).join("\n"))}>Shuffle</button>
            <button type="button" className={btn} disabled={spinning} onClick={() => setText([...names].sort((a, b) => a.localeCompare(b)).join("\n"))}>Sort A–Z</button>
            <button type="button" className={btn} disabled={spinning} onClick={() => setText(preset ?? SAMPLE)}>Reset</button>
            <button type="button" className={btn} disabled={spinning} onClick={() => { setText(""); setWinner(""); }}>Clear</button>
            <button type="button" className={btn} onClick={share} disabled={names.length === 0}>{flash === "link" ? "Link copied ✓" : "Copy link to this wheel"}</button>
          </div>
          {extended && (
            <div className="mt-3 rounded-xl border border-white/10 p-3" data-picker-lists>
              <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">Saved lists (kept in this browser)</p>
              <div className="flex gap-2">
                <input value={listName} onChange={(e) => setListName(e.target.value)} maxLength={40} placeholder="Name this list" aria-label="List name"
                  className="min-w-0 flex-1 bg-[var(--bg-secondary)] border border-white/10 rounded-lg px-3 py-1.5 text-base text-[var(--text-primary)]" />
                <button type="button" className={btn} disabled={names.length < 2} onClick={saveList}>{flash === "saved" ? "Saved ✓" : "Save list"}</button>
              </div>
              {saved.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-2">
                  {saved.map((l) => (
                    <li key={l.name} className="inline-flex items-center rounded-lg border border-white/10 text-xs">
                      <button type="button" className="px-2.5 py-1.5 hover:text-[var(--neon-cyan)]" disabled={spinning} onClick={() => setText(l.text)}>{l.name} · {parseNames(l.text).length}</button>
                      <button type="button" aria-label={`Delete ${l.name}`} className="px-2 py-1.5 text-[var(--text-muted)] hover:text-white" onClick={() => persist(saved.filter((x) => x.name !== l.name))}>×</button>
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mt-3 mb-2">Quick lists</p>
              <div className="flex flex-wrap gap-2">
                {QUICK.map((q) => <button key={q.label} type="button" className={btn} disabled={spinning} onClick={() => setText(q.text)}>{q.label}</button>)}
              </div>
            </div>
          )}
          {pro && (
            <div className="mt-3 rounded-xl border border-white/10 p-3 space-y-3" data-wheel-pro>
              <div className="flex flex-wrap items-center gap-2">
                <label className={`${btn} cursor-pointer`}>
                  Import CSV or TXT
                  <input type="file" accept=".txt,.csv,text/plain,text/csv" className="sr-only" disabled={spinning} onChange={(e) => { void importFile(e.target.files?.[0]); e.target.value = ""; }} />
                </label>
                <span className="text-xs text-[var(--text-muted)]">First column = name, optional second column = weight. Read in your browser, never uploaded.</span>
              </div>
              {importMsg && <p className="text-xs text-[var(--neon-cyan)]" role="status">{importMsg}</p>}
              <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"><input type="checkbox" checked={useWeights} disabled={spinning} onChange={(e) => setUseWeights(e.target.checked)} /> Give entries different odds (weights)</label>
              {useWeights && (
                <ul className="max-h-48 overflow-y-auto space-y-1 pr-1" aria-label="Entry weights">
                  {[...new Set(names)].map((n) => (
                    <li key={n} className="flex items-center gap-2 text-sm">
                      <span className="min-w-0 flex-1 truncate text-[var(--text-secondary)]">{n}</span>
                      <input type="number" min={1} max={100} value={weights[n] ?? 1} disabled={spinning} aria-label={`Weight for ${n}`}
                        onChange={(e) => setWeights((w) => ({ ...w, [n]: Math.max(1, Math.min(100, Math.round(Number(e.target.value)) || 1)) }))}
                        className="w-16 bg-[var(--bg-secondary)] border border-white/10 rounded-lg px-2 py-1 text-base text-[var(--text-primary)]" />
                    </li>
                  ))}
                </ul>
              )}
              <p className="text-xs text-[var(--text-muted)]">Shortcut: press Ctrl+Enter (Cmd+Enter on Mac) to spin.</p>
            </div>
          )}
          <label className="flex items-center gap-2 mt-3 text-sm text-[var(--text-secondary)]"><input type="checkbox" checked={removeWinner} onChange={(e) => setRemoveWinner(e.target.checked)} /> Remove the winner after each spin</label>
          {pro && spins > 0 && (
            <div className="mt-3 rounded-xl border border-white/10 p-3 text-sm text-[var(--text-secondary)]" data-wheel-history>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Spin history · {spins} {spins === 1 ? "spin" : "spins"}</span>
                <button type="button" className="text-xs text-[var(--text-muted)] hover:text-white" onClick={() => { setHistory([]); setTally({}); setSpins(0); }}>Clear history</button>
              </div>
              <p>{tallyRows.map(([n, c]) => `${n} ×${c}`).join(" · ")}</p>
              <p className="mt-1 text-xs text-[var(--text-muted)]">Latest first: {history.slice(0, 10).join(" → ")}</p>
            </div>
          )}
          {!pro && history.length > 0 && <p className="text-sm text-[var(--text-secondary)] mt-3"><span className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Past winners: </span>{history.join(" · ")}</p>}
          <p className="text-xs text-[var(--text-muted)] mt-3">{extended ? "Your lists never leave your browser." : "Your names never leave your browser."} The winner is chosen with your device&apos;s secure random generator before the wheel starts turning, so every name has the same chance.</p>
        </div>
      </div>
    </section>
  );
}
