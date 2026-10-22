"use client";

import { useMemo, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { newSeed } from "@/lib/randomGenerators";
import { HEADCANON_CATEGORIES, MAX_CHARACTER_NAME, drawHeadcanons } from "@/lib/generators/headcanons";

const TOOL = "headcanon_generator";
const FIRST_SEED = 2026;
const btn = "px-4 py-2.5 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-yellow)]/60 hover:text-[var(--text-primary)] transition-colors";
const chip = (on: boolean) =>
  `px-3 py-1.5 rounded-full text-sm border transition-colors ${on ? "border-[var(--neon-yellow)] text-[var(--neon-yellow)] bg-[var(--neon-yellow)]/10" : "border-white/10 text-[var(--text-secondary)] hover:border-white/30"}`;

export default function HeadcanonGenerator() {
  const [name, setName] = useState("");
  const [cats, setCats] = useState<string[]>([]);
  const [count, setCount] = useState(3);
  const [seed, setSeed] = useState(FIRST_SEED);
  const [flash, setFlash] = useState("");

  const { items } = useMemo(() => drawHeadcanons(name, cats, count, seed), [name, cats, count, seed]);

  const say = (what: string) => { setFlash(what); setTimeout(() => setFlash(""), 1600); };
  const reroll = () => { setSeed(newSeed()); track("generate_success", { tool_type: TOOL, result_count: count, locale: "en" }); };
  const toggle = (c: string) => setCats((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));
  const copy = async (id: string, text: string) => {
    if (await copyText(text)) { say(id); track("copy_result", { tool_type: TOOL, locale: "en" }); }
  };
  const copyAll = async () => {
    if (await copyText(items.map((i) => i.text).join("\n"))) { say("all"); track("copy_result", { tool_type: TOOL, result_count: items.length, locale: "en" }); }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-5 sm:p-8">
        <label htmlFor="hc-name" className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
          Character name <span className="font-normal text-[var(--text-muted)]">(optional)</span>
        </label>
        <input
          id="hc-name"
          type="text"
          value={name}
          maxLength={MAX_CHARACTER_NAME}
          placeholder="e.g. Luna, Kakashi, my OC"
          onChange={(e) => setName(e.target.value)}
          className="w-full bg-[var(--bg-secondary)] border border-white/10 rounded-xl px-4 py-3 text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--neon-yellow)]"
        />

        <p className="text-sm font-semibold text-[var(--text-primary)] mt-5 mb-2">Category</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Category">
          <button type="button" aria-pressed={cats.length === 0} onClick={() => setCats([])} className={chip(cats.length === 0)}>All</button>
          {Object.entries(HEADCANON_CATEGORIES).map(([id, label]) => (
            <button key={id} type="button" aria-pressed={cats.includes(id)} onClick={() => toggle(id)} className={chip(cats.includes(id))}>{label}</button>
          ))}
        </div>

        <p className="text-sm font-semibold text-[var(--text-primary)] mt-5 mb-2">How many?</p>
        <div className="flex gap-2" role="group" aria-label="Number of headcanons">
          {[1, 3, 5, 10].map((k) => (
            <button key={k} type="button" aria-pressed={count === k} onClick={() => setCount(k)} className={chip(count === k)}>{k}</button>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" onClick={reroll} className="btn-generate !px-6">🎲 New headcanons</button>
          <button type="button" onClick={copyAll} className={btn}>{flash === "all" ? "Copied!" : "📋 Copy all"}</button>
        </div>

        <ul aria-live="polite" className="mt-6 space-y-3">
          {items.map((h) => (
            <li key={h.id} className="rounded-2xl border border-white/10 bg-black/30 p-4 sm:p-5">
              <p className="text-[11px] uppercase tracking-widest text-[var(--text-muted)] mb-1">{HEADCANON_CATEGORIES[h.cat] ?? h.cat}</p>
              <p className="text-[var(--text-primary)] leading-relaxed">{h.text}</p>
              <button type="button" onClick={() => copy(h.id, h.text)} className={`${btn} mt-3 !py-1.5`}>{flash === h.id ? "Copied!" : "Copy"}</button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
