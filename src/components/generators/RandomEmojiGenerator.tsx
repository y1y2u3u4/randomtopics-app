"use client";

import { useState } from "react";
import { EMOJI, EMOJI_CATEGORIES, type Emoji, type EmojiCategory } from "@/data/emoji";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { secureInt } from "@/lib/generators/secure";

const COUNTS = [1, 5, 10, 20];
const ev = { tool_type: "random_emoji_generator", locale: "en" };

function draw(cats: EmojiCategory[], count: number, avoid: Set<string>): Emoji[] {
  const pool = EMOJI.filter((e) => (cats.length === 0 || cats.includes(e.category)));
  let fresh = pool.filter((e) => !avoid.has(e.char));
  if (fresh.length < count) fresh = pool;
  const copy = fresh.slice();
  const out: Emoji[] = [];
  while (out.length < count && copy.length) out.push(copy.splice(secureInt(copy.length), 1)[0]);
  return out;
}

export default function RandomEmojiGenerator() {
  const [cats, setCats] = useState<EmojiCategory[]>([]);
  const [count, setCount] = useState(1);
  const [result, setResult] = useState<Emoji[]>([]);
  const [seen, setSeen] = useState<Set<string>>(new Set());
  const [flash, setFlash] = useState("");

  const toggle = (c: EmojiCategory) => setCats((cur) => (cur.includes(c) ? cur.filter((x) => x !== c) : [...cur, c]));
  const pool = EMOJI.filter((e) => cats.length === 0 || cats.includes(e.category)).length;

  const generate = () => {
    const next = draw(cats, count, seen);
    const nextSeen = new Set(seen.size + next.length > pool ? [] : seen);
    next.forEach((e) => nextSeen.add(e.char));
    setSeen(nextSeen);
    setResult(next);
    track("generate_success", { ...ev, result_count: next.length });
  };
  const copy = async (text: string, id: string) => {
    if (await copyText(text)) { setFlash(id); window.setTimeout(() => setFlash(""), 1400); track("copy_result", ev); }
  };

  const chip = (on: boolean) => `px-3 py-1.5 rounded-full text-sm border transition-colors ${on ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/15 text-[var(--text-primary)]" : "border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50"}`;

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-5 sm:p-8">
        <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">Category <span className="normal-case tracking-normal">(none selected = all {EMOJI.length})</span></p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Emoji categories">
          {EMOJI_CATEGORIES.map((c) => (
            <button key={c.id} type="button" aria-pressed={cats.includes(c.id)} className={chip(cats.includes(c.id))} onClick={() => toggle(c.id)}>{c.icon} {c.label}</button>
          ))}
        </div>
        <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mt-4 mb-2">How many</p>
        <div className="flex gap-2" role="group" aria-label="How many emoji">
          {COUNTS.map((n) => <button key={n} type="button" aria-pressed={count === n} className={chip(count === n)} onClick={() => setCount(n)}>{n}</button>)}
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 mt-5 text-center min-h-40 flex items-center justify-center" aria-live="polite">
          {result.length === 0 ? <p className="text-[var(--text-muted)]">Press the button for a random emoji 🎲</p>
            : result.length === 1 ? (
              <div>
                <p className="text-8xl sm:text-9xl leading-none" data-emoji-result>{result[0].char}</p>
                <p className="mt-3 text-lg font-semibold capitalize" style={{ fontFamily: "var(--font-display)" }}>{result[0].name}</p>
              </div>
            ) : (
              <ul className="flex flex-wrap justify-center gap-2" data-emoji-result>
                {result.map((e) => (
                  <li key={e.char}>
                    <button type="button" title={`${e.name} — tap to copy`} onClick={() => copy(e.char, e.char)} className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/[0.05] hover:bg-white/[0.1] text-4xl sm:text-5xl transition-colors">
                      {flash === e.char ? "✓" : e.char}
                    </button>
                  </li>
                ))}
              </ul>
            )}
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <button type="button" onClick={generate} className="btn-generate">🎲 {result.length ? "Another random emoji" : "Random emoji"}</button>
          {result.length > 0 && (
            <button type="button" onClick={() => copy(result.map((e) => e.char).join(" "), "all")} className="px-4 py-2 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors">
              {flash === "all" ? "Copied ✓" : result.length === 1 ? "Copy emoji" : "Copy all"}
            </button>
          )}
        </div>
        <p className="text-xs text-center text-[var(--text-muted)] mt-3">{pool.toLocaleString("en-US")} emoji in this selection · no repeats until you have seen them all{result.length > 1 ? " · tap an emoji to copy just that one" : ""}</p>
      </div>
    </section>
  );
}
