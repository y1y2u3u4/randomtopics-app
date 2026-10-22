"use client";

import { useMemo, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { newSeed } from "@/lib/randomGenerators";
import { MAX_CHARACTERS, MOOD_LABELS, drawQuotes, parseCharacterNames, type Mood } from "@/lib/generators/incorrectQuotes";

const TOOL = "incorrect_quote_generator";
const FIRST_SEED = 2026;
const btn = "px-4 py-2.5 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-yellow)]/60 hover:text-[var(--text-primary)] transition-colors";
const chip = (on: boolean) =>
  `px-3 py-1.5 rounded-full text-sm border transition-colors ${on ? "border-[var(--neon-yellow)] text-[var(--neon-yellow)] bg-[var(--neon-yellow)]/10" : "border-white/10 text-[var(--text-secondary)] hover:border-white/30"}`;

export default function IncorrectQuoteGenerator() {
  const [namesText, setNamesText] = useState("");
  const [n, setN] = useState(2);
  const [moods, setMoods] = useState<Mood[]>([]);
  const [count, setCount] = useState(3);
  const [seed, setSeed] = useState(FIRST_SEED);
  const [flash, setFlash] = useState("");

  const typed = useMemo(() => parseCharacterNames(namesText), [namesText]);
  const { quotes } = useMemo(() => drawQuotes(typed, n, moods, count, seed), [typed, n, moods, count, seed]);

  const say = (what: string) => { setFlash(what); setTimeout(() => setFlash(""), 1600); };
  const reroll = () => { setSeed(newSeed()); track("generate_success", { tool_type: TOOL, result_count: count, locale: "en" }); };
  const toggleMood = (m: Mood) => setMoods((cur) => (cur.includes(m) ? cur.filter((x) => x !== m) : [...cur, m]));

  const copy = async (id: string, text: string) => {
    if (await copyText(text)) { say(id); track("copy_result", { tool_type: TOOL, locale: "en" }); }
  };
  const copyAll = async () => {
    if (await copyText(quotes.map((q) => q.text).join("\n\n"))) { say("all"); track("copy_result", { tool_type: TOOL, result_count: quotes.length, locale: "en" }); }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-5 sm:p-8">
        <label htmlFor="iq-names" className="block text-sm font-semibold text-[var(--text-primary)] mb-2">
          Character names <span className="font-normal text-[var(--text-muted)]">(1–{MAX_CHARACTERS}, separated by commas)</span>
        </label>
        <input
          id="iq-names"
          type="text"
          value={namesText}
          maxLength={160}
          placeholder="e.g. Maya, Theo, Priya"
          onChange={(e) => {
            const value = e.target.value;
            setNamesText(value);
            const k = parseCharacterNames(value).length;
            if (k > 0) setN(Math.max(1, k));
          }}
          className="w-full bg-[var(--bg-secondary)] border border-white/10 rounded-xl px-4 py-3 text-base text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--neon-yellow)]"
        />
        <p className="text-xs text-[var(--text-muted)] mt-2">Leave it empty to use placeholder names. Missing names are filled in automatically.</p>

        <div className="mt-5">
          <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">How many characters?</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Number of characters">
            {[1, 2, 3, 4, 5, 6].map((k) => (
              <button key={k} type="button" aria-pressed={n === k} onClick={() => setN(k)} className={chip(n === k)}>{k}</button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-x-8 gap-y-4">
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">Mood</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Mood">
              <button type="button" aria-pressed={moods.length === 0} onClick={() => setMoods([])} className={chip(moods.length === 0)}>All</button>
              {(Object.keys(MOOD_LABELS) as Mood[]).map((m) => (
                <button key={m} type="button" aria-pressed={moods.includes(m)} onClick={() => toggleMood(m)} className={chip(moods.includes(m))}>{MOOD_LABELS[m]}</button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)] mb-2">How many quotes?</p>
            <div className="flex gap-2" role="group" aria-label="Number of quotes">
              {[1, 3, 5].map((k) => (
                <button key={k} type="button" aria-pressed={count === k} onClick={() => setCount(k)} className={chip(count === k)}>{k}</button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button type="button" onClick={reroll} className="btn-generate !px-6">🎲 New quotes</button>
          <button type="button" onClick={copyAll} className={btn}>{flash === "all" ? "Copied!" : "📋 Copy all"}</button>
        </div>

        <ul aria-live="polite" className="mt-6 space-y-3">
          {quotes.map((q) => (
            <li key={q.id} className="rounded-2xl border border-white/10 bg-black/30 p-4 sm:p-5">
              <p className="text-[11px] uppercase tracking-widest text-[var(--text-muted)] mb-2">{q.mood}</p>
              <p className="whitespace-pre-line text-[var(--text-primary)] leading-relaxed">{q.text}</p>
              <button type="button" onClick={() => copy(q.id, q.text)} className={`${btn} mt-3 !py-1.5`}>{flash === q.id ? "Copied!" : "Copy"}</button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
