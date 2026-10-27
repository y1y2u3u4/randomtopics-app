"use client";

import { useEffect, useMemo, useState } from "react";
import SpinWheel from "./SpinWheel";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { fromBase64Url, parseNames, toBase64Url } from "@/lib/randomGenerators";
import { secureInt } from "@/lib/generators/secure";

const SAMPLE = "Alex\nBlake\nCasey\nDana\nEllis\nFinn\nGray\nHarper";
const MAX = 200;
const ev = { tool_type: "wheel_of_names", locale: "en" };

export default function WheelOfNames() {
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
  }, []);

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
  };
  const flashMsg = (m: string) => { setFlash(m); window.setTimeout(() => setFlash(""), 1500); };
  const share = async () => {
    const url = `${window.location.origin}${window.location.pathname}?names=${toBase64Url(names.join("\n"))}`;
    if (await copyText(url)) { flashMsg("link"); track("copy_result", ev); }
  };

  const segments = shown.map((label) => ({ label }));
  const btn = "px-3 py-1.5 rounded-lg text-xs border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors";

  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-4 sm:p-8 grid md:grid-cols-2 gap-6 items-start">
        <div>
          {shown.length >= 2 ? (
            <SpinWheel segments={segments} target={target} onDone={done} ariaLabel={`Wheel with ${shown.length} names`} />
          ) : (
            <div className="aspect-square max-w-[360px] mx-auto rounded-full border-2 border-dashed border-white/15 flex items-center justify-center text-center p-8 text-[var(--text-muted)]">Add at least two names to spin the wheel</div>
          )}
          <div className="text-center mt-4 min-h-20" aria-live="polite">
            {spinning ? <p className="text-xl text-[var(--text-muted)]">Spinning…</p>
              : winner ? <><p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Winner</p><p className="text-3xl sm:text-4xl font-extrabold gradient-text break-words" style={{ fontFamily: "var(--font-display)" }} data-wheel-winner>{winner}</p></>
              : <p className="text-[var(--text-muted)]">Press Spin to pick a name</p>}
          </div>
          <div className="flex justify-center"><button type="button" className="btn-generate" disabled={spinning || names.length < 2} onClick={spin}>🎡 {winner ? "Spin again" : "Spin the wheel"}</button></div>
        </div>
        <div>
          <label htmlFor="wheel-names" className="block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1">Names on the wheel ({names.length}{names.length >= MAX ? `, max ${MAX}` : ""})</label>
          <textarea id="wheel-names" value={text} onChange={(e) => setText(e.target.value)} disabled={spinning} rows={10} spellCheck={false}
            className="w-full bg-[var(--bg-secondary)] border border-white/10 rounded-xl px-3 py-2 text-[var(--text-primary)] text-base leading-relaxed" placeholder={"One name per line\n(or separate with commas)"} />
          <div className="flex flex-wrap gap-2 mt-2">
            <button type="button" className={btn} disabled={spinning} onClick={() => setText(names.map((n) => [secureInt(1e9), n] as const).sort((a, b) => a[0] - b[0]).map((x) => x[1]).join("\n"))}>Shuffle</button>
            <button type="button" className={btn} disabled={spinning} onClick={() => setText([...names].sort((a, b) => a.localeCompare(b)).join("\n"))}>Sort A–Z</button>
            <button type="button" className={btn} disabled={spinning} onClick={() => setText(SAMPLE)}>Reset</button>
            <button type="button" className={btn} disabled={spinning} onClick={() => { setText(""); setWinner(""); }}>Clear</button>
            <button type="button" className={btn} onClick={share} disabled={names.length === 0}>{flash === "link" ? "Link copied ✓" : "Copy link to this wheel"}</button>
          </div>
          <label className="flex items-center gap-2 mt-3 text-sm text-[var(--text-secondary)]"><input type="checkbox" checked={removeWinner} onChange={(e) => setRemoveWinner(e.target.checked)} /> Remove the winner after each spin</label>
          {history.length > 0 && <p className="text-sm text-[var(--text-secondary)] mt-3"><span className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Past winners: </span>{history.join(" · ")}</p>}
          <p className="text-xs text-[var(--text-muted)] mt-3">Your names never leave your browser. The winner is chosen with your device&apos;s secure random generator before the wheel starts turning, so every name has the same chance.</p>
        </div>
      </div>
    </section>
  );
}
