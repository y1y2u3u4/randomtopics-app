"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import SpinWheel from "./SpinWheel";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { fromBase64Url, parseNames, toBase64Url } from "@/lib/randomGenerators";
import { secureInt } from "@/lib/generators/secure";

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
};

export default function WheelOfNames({ extended }: { extended?: WheelOfNamesOptions } = {}) {
  const ev = { tool_type: extended ? extended.pageId : "wheel_of_names", locale: "en" };
  const [saved, setSaved] = useState<Saved[]>([]);
  const [listName, setListName] = useState("");
  const ready = useRef(false);
  const [text, setText] = useState(SAMPLE);
  const [removeWinner, setRemoveWinner] = useState(false);
  const [target, setTarget] = useState<{ index: number; nonce: number } | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [flash, setFlash] = useState("");
  const names = useMemo(() => parseNames(text).slice(0, MAX), [text]);
  // The wheel shows the list as it was when the spin started.
  const [frozen, setFrozen] = useState<string[] | null>(null);
  const shown = frozen ?? names;

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("names");
    const decoded = raw ? fromBase64Url(raw) : null;
    if (decoded && parseNames(decoded).length >= 2) void Promise.resolve().then(() => setText(decoded.slice(0, 8000)));
    else if (extended) {
      try {
        const last = localStorage.getItem(LAST_KEY);
        if (last && parseNames(last).length >= 2) void Promise.resolve().then(() => setText(last.slice(0, 8000)));
      } catch { /* optional */ }
    }
    if (extended) {
      try { const raw = JSON.parse(localStorage.getItem(SAVED_KEY) || "[]"); if (Array.isArray(raw)) void Promise.resolve().then(() => setSaved(raw.filter((x) => x && typeof x.name === "string" && typeof x.text === "string").slice(0, MAX_SAVED))); } catch { /* optional */ }
    }
    void Promise.resolve().then(() => { ready.current = true; });
  }, [extended]);

  useEffect(() => {
    if (!extended || !ready.current) return;
    try { localStorage.setItem(LAST_KEY, text.slice(0, 8000)); } catch { /* optional */ }
  }, [text, extended]);
  const persist = (next: Saved[]) => { setSaved(next); try { localStorage.setItem(SAVED_KEY, JSON.stringify(next)); } catch { /* optional */ } };
  const saveList = () => {
    const name = listName.trim().slice(0, 40) || `List ${saved.length + 1}`;
    if (names.length < 2) return;
    persist([{ name, text }, ...saved.filter((x) => x.name !== name)].slice(0, MAX_SAVED));
    setListName("");
    flashMsg("saved");
  };

  const spin = () => {
    if (spinning || names.length < 2) return;
    const index = secureInt(names.length);
    setFrozen(names);
    setWinner("");
    setSpinning(true);
    setTarget({ index, nonce: Date.now() });
  };
  const done = (index: number) => {
    const name = (frozen ?? names)[index];
    setWinner(name);
    setHistory((h) => [name, ...h].slice(0, 15));
    setSpinning(false);
    setFrozen(null);
    if (removeWinner) setText(parseNames(text).filter((n, i) => !(i === index && n === name)).join("\n"));
    track("generate_success", { ...ev, result_count: 1, entries: names.length });
    if (extended) track(`${extended.pageId}_use`, { ...ev, result_count: 1, entries: names.length });
  };
  const flashMsg = (m: string) => { setFlash(m); window.setTimeout(() => setFlash(""), 1500); };
  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}?names=${toBase64Url(names.join("\n"))}`;
    if (await copyText(url)) { flashMsg("link"); track("copy_result", ev); if (extended) track(`${extended.pageId}_share`, { ...ev, share_method: "link" }); }
  };

  const segments = shown.map((label) => ({ label }));
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
            <button type="button" className={btn} disabled={spinning} onClick={() => setText(SAMPLE)}>Reset</button>
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
          <label className="flex items-center gap-2 mt-3 text-sm text-[var(--text-secondary)]"><input type="checkbox" checked={removeWinner} onChange={(e) => setRemoveWinner(e.target.checked)} /> Remove the winner after each spin</label>
          {history.length > 0 && <p className="text-sm text-[var(--text-secondary)] mt-3"><span className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Past winners: </span>{history.join(" · ")}</p>}
          <p className="text-xs text-[var(--text-muted)] mt-3">{extended ? "Your lists never leave your browser." : "Your names never leave your browser."} The winner is chosen with your device&apos;s secure random generator before the wheel starts turning, so every name has the same chance.</p>
        </div>
      </div>
    </section>
  );
}
