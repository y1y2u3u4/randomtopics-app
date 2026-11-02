"use client";

import { useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { DEFAULT_FOUR_DIGIT, MAX_COUNT, generateFourDigit, type FourDigitOptions, type FourDigitResult } from "@/lib/generators/fourDigit";

const EV = { tool_type: "random_4_digit_number_generator", locale: "en" };

export default function FourDigitGenerator() {
  const [o, setO] = useState<FourDigitOptions>({ ...DEFAULT_FOUR_DIGIT, count: 10 });
  const [countText, setCountText] = useState("10");
  const [res, setRes] = useState<FourDigitResult | null>(null);
  const [flash, setFlash] = useState("");

  const run = (next: FourDigitOptions = o, source = "button") => {
    const r = generateFourDigit(next);
    setRes(r);
    track("generate_success", { ...EV, result_count: r.numbers.length });
    track("random_4_digit_number_generator_use", { ...EV, content_source: source });
  };
  const set = (patch: Partial<FourDigitOptions>) => {
    const next = { ...o, ...patch };
    setO(next);
    if (res) run(next, "option");
  };
  const flashFor = (what: string) => { setFlash(what); window.setTimeout(() => setFlash(""), 1500); };
  const copy = async (text: string, key: string) => { if (await copyText(text)) { flashFor(key); track("copy_result", EV); } };
  const onCount = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 3);
    setCountText(digits);
    const n = Math.max(1, Math.min(MAX_COUNT, Number(digits) || 1));
    setO((cur) => ({ ...cur, count: n }));
  };

  const label = "block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1";
  const field = "w-full bg-[var(--bg-secondary)] border border-white/10 rounded-xl px-3 py-2 text-lg text-[var(--text-primary)] tabular-nums";
  const ghost = "px-4 py-2 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors";
  const tab = (on: boolean) => `px-4 py-2 rounded-xl text-sm border transition-colors ${on ? "border-[var(--neon-cyan)] text-[var(--text-primary)] bg-white/[0.06]" : "border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50"}`;
  const chk = "flex items-center gap-2 min-h-8";

  return (
    <section id="tool" className="max-w-3xl mx-auto px-4 sm:px-6 scroll-mt-20">
      <div className="glass-card p-4 sm:p-8">
        <div className="grid sm:grid-cols-[8rem_1fr] gap-4 items-end">
          <label>
            <span className={label}>How many (1–{MAX_COUNT})</span>
            <input inputMode="numeric" value={countText} onChange={(e) => onCount(e.target.value)} onBlur={() => setCountText(String(o.count))} className={field} />
          </label>
          <div role="group" aria-label="Range">
            <span className={label}>Range</span>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={tab(o.range === "pin")} aria-pressed={o.range === "pin"} onClick={() => set({ range: "pin" })}>0000–9999 (PIN style)</button>
              <button type="button" className={tab(o.range === "no-zero")} aria-pressed={o.range === "no-zero"} onClick={() => set({ range: "no-zero" })}>1000–9999</button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-5 gap-y-1 mt-4 text-sm text-[var(--text-secondary)]">
          <label className={chk}><input type="checkbox" checked={o.unique} onChange={(e) => set({ unique: e.target.checked })} /> No repeats in the list</label>
          <label className={chk}><input type="checkbox" checked={o.noRepeatedDigits} onChange={(e) => set({ noRepeatedDigits: e.target.checked })} /> No repeated digits (4 different digits)</label>
          <label className={chk}><input type="checkbox" checked={o.avoidWeak} onChange={(e) => set({ avoidWeak: e.target.checked })} /> Avoid weak PINs (1234, 0000, 1212…)</label>
          <label className={chk}><input type="checkbox" checked={o.avoidYears} onChange={(e) => set({ avoidYears: e.target.checked })} /> Avoid years 1950–2030</label>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 mt-4 text-center min-h-32 flex items-center justify-center" aria-live="polite">
          {!res ? <p className="text-[var(--text-muted)]">Press Generate for your numbers 🎲</p>
            : !res.numbers.length ? <p className="text-[var(--neon-pink)] text-sm">{res.note}</p>
            : res.numbers.length === 1 ? <p className="text-7xl sm:text-8xl font-extrabold tabular-nums" style={{ fontFamily: "var(--font-display)" }} data-four-digit-result>{res.numbers[0]}</p>
            : <ul className="flex flex-wrap justify-center gap-2" data-four-digit-result>{res.numbers.map((n, i) => <li key={`${n}-${i}`}><button type="button" onClick={() => copy(n, `n${i}`)} title="Copy this number" className="px-3 py-1.5 rounded-lg bg-white/[0.06] text-2xl font-bold tabular-nums hover:bg-white/[0.12]">{flash === `n${i}` ? "✓" : n}</button></li>)}</ul>}
        </div>
        {res?.note && res.numbers.length > 0 && <p className="text-xs text-center text-[var(--neon-cyan)] mt-2" role="status">{res.note}</p>}

        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <button type="button" className="btn-generate" onClick={() => run()}>🎲 {res ? "Generate again" : "Generate"}</button>
          {res && res.numbers.length > 0 && <button type="button" className={ghost} onClick={() => copy(res.numbers.join(", "), "all")}>{flash === "all" ? "Copied ✓" : "Copy all"}</button>}
          {res && res.numbers.length > 1 && <button type="button" className={ghost} onClick={() => copy(res.numbers.join("\n"), "lines")}>{flash === "lines" ? "Copied ✓" : "Copy one per line"}</button>}
        </div>
        <p className="text-xs text-center text-[var(--text-muted)] mt-3">
          Made in your browser with the Web Crypto random generator; nothing is sent or stored. Tap a number to copy it. {res && res.poolSize > 0 ? `${res.poolSize.toLocaleString("en-US")} numbers match your settings.` : ""}
        </p>
      </div>
    </section>
  );
}
