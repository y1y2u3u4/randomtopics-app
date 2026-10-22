"use client";

import { useMemo, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { newSeed } from "@/lib/randomGenerators";
import { FINGER_CATEGORIES, START_FINGERS, drawStatements, fingersAfter, statementText } from "@/lib/generators/fingerDown";

const TOOL = "put_a_finger_down";
const FIRST_SEED = 2026;
const btn = "px-4 py-2.5 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-yellow)]/60 hover:text-[var(--text-primary)] transition-colors";
const chip = (on: boolean) =>
  `px-3 py-1.5 rounded-full text-sm border transition-colors ${on ? "border-[var(--neon-yellow)] text-[var(--neon-yellow)] bg-[var(--neon-yellow)]/10" : "border-white/10 text-[var(--text-secondary)] hover:border-white/30"}`;

export default function PutAFingerDownGame() {
  const [cats, setCats] = useState<string[]>([]);
  const [seed, setSeed] = useState(FIRST_SEED);
  const [used, setUsed] = useState<string[]>([]);
  const [fingers, setFingers] = useState(START_FINGERS);
  const [flash, setFlash] = useState(false);

  // The current statement is the first draw for this seed, excluding what was already shown.
  const current = useMemo(() => drawStatements(cats, 1, seed, used).items[0], [cats, seed, used]);

  const next = () => {
    if (current) setUsed((u) => [...u, current.id]);
    setSeed(newSeed());
    track("generate_success", { tool_type: TOOL, result_count: 1, locale: "en" });
  };
  const down = () => {
    setFingers((f) => fingersAfter(f));
    track("finger_down", { tool_type: TOOL, locale: "en" });
    next();
  };
  const reset = () => { setFingers(START_FINGERS); setUsed([]); setSeed(newSeed()); track("game_reset", { tool_type: TOOL, locale: "en" }); };
  const toggle = (c: string) => { setCats((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c])); setUsed([]); };
  const copy = async () => {
    if (current && (await copyText(statementText(current)))) {
      setFlash(true); setTimeout(() => setFlash(false), 1600);
      track("copy_result", { tool_type: TOOL, locale: "en" });
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-5 sm:p-8">
        <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">Category</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Category">
          <button type="button" aria-pressed={cats.length === 0} onClick={() => { setCats([]); setUsed([]); }} className={chip(cats.length === 0)}>All</button>
          {Object.entries(FINGER_CATEGORIES).map(([id, label]) => (
            <button key={id} type="button" aria-pressed={cats.includes(id)} onClick={() => toggle(id)} className={chip(cats.includes(id))}>{label}</button>
          ))}
        </div>

        <div aria-live="polite" className="mt-6 rounded-2xl border border-[var(--neon-yellow)]/30 bg-black/40 p-6 sm:p-8 text-center">
          <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-3">
            {current ? FINGER_CATEGORIES[current.cat] : ""}
          </p>
          <p className="text-2xl sm:text-3xl font-extrabold leading-snug text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
            {current ? statementText(current) : "No statements left."}
          </p>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Fingers up</p>
          <p className="text-5xl font-extrabold text-[var(--neon-yellow)]" aria-label={`${fingers} fingers up`}>{fingers}</p>
          <div className="flex justify-center gap-1 mt-2 text-2xl" aria-hidden="true">
            {Array.from({ length: START_FINGERS }, (_, i) => (
              <span key={i} className={i < fingers ? "" : "opacity-20 grayscale"}>☝️</span>
            ))}
          </div>
          {fingers === 0 && <p className="mt-3 font-semibold text-[var(--text-primary)]">All fingers down. Game over!</p>}
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button type="button" onClick={down} disabled={fingers === 0} className="btn-generate !px-6 disabled:opacity-40">👇 Finger down</button>
          <button type="button" onClick={next} className={btn}>⏭️ Next statement</button>
          <button type="button" onClick={copy} className={btn}>{flash ? "Copied!" : "📋 Copy"}</button>
          <button type="button" onClick={reset} className={btn}>↺ Reset</button>
        </div>
        <p className="text-xs text-center text-[var(--text-muted)] mt-3">Tap Finger down when the statement is true for you. Next statement skips without losing a finger.</p>
      </div>
    </section>
  );
}
