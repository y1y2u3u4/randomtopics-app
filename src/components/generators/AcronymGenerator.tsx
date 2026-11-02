"use client";

import { useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { newSeed } from "@/lib/randomGenerators";
import { DEFAULT_OPTIONS, MAX_BACKRONYM_LETTERS, THEME_IDS, backronyms, cleanLetters, makeAcronym, themeLabel, type AcronymOptions, type ThemeId } from "@/lib/generators/acronym";

type Mode = "acronym" | "backronym";
const EV = { tool_type: "acronym_generator", locale: "en" };
const PHRASE_SAMPLES = ["United States of America", "Frequently Asked Questions", "Laugh Out Loud", "Self Contained Underwater Breathing Apparatus"];
const LETTER_SAMPLES = ["TEAM", "CODE", "HAPPY", "NOVA"];

export default function AcronymGenerator() {
  const [mode, setMode] = useState<Mode>("acronym");
  const [phrase, setPhrase] = useState("");
  const [opts, setOpts] = useState<AcronymOptions>(DEFAULT_OPTIONS);
  const [letters, setLetters] = useState("");
  const [themes, setThemes] = useState<ThemeId[]>([]);
  const [seed, setSeed] = useState(0);
  const [flash, setFlash] = useState("");

  const flashFor = (what: string) => { setFlash(what); window.setTimeout(() => setFlash(""), 1500); };
  const doCopy = async (text: string, key: string) => {
    if (text && (await copyText(text))) { flashFor(key); track("copy_result", EV); }
  };

  const res = makeAcronym(phrase, opts);
  const clean = cleanLetters(letters);
  const ideas = seed && clean ? backronyms(clean, themes, 10, seed) : [];

  const reroll = (source = "button") => {
    const s = newSeed();
    setSeed(s);
    track("generate_success", { ...EV, result_count: 10 });
    track("acronym_generator_use", { ...EV, content_source: source });
  };
  const toggleTheme = (t: ThemeId) => { setThemes((cur) => (cur.includes(t) ? cur.filter((x) => x !== t) : [...cur, t])); if (seed) setSeed(newSeed()); };

  const label = "block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1";
  const field = "w-full bg-[var(--bg-secondary)] border border-white/10 rounded-xl px-3 py-2 text-lg text-[var(--text-primary)]";
  const ghost = "px-4 py-2 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors";
  const tab = (on: boolean) => `px-4 py-2 rounded-xl text-sm border transition-colors ${on ? "border-[var(--neon-cyan)] text-[var(--text-primary)] bg-white/[0.06]" : "border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50"}`;
  const chk = "flex items-center gap-2 min-h-8";

  return (
    <section id="tool" className="max-w-3xl mx-auto px-4 sm:px-6 scroll-mt-20">
      <div className="glass-card p-4 sm:p-8">
        <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Mode">
          <button type="button" className={tab(mode === "acronym")} aria-pressed={mode === "acronym"} onClick={() => setMode("acronym")}>Phrase → acronym</button>
          <button type="button" className={tab(mode === "backronym")} aria-pressed={mode === "backronym"} onClick={() => setMode("backronym")}>Letters → meanings (backronym)</button>
        </div>

        {mode === "acronym" ? (
          <>
            <label className="block">
              <span className={label}>Your phrase</span>
              <input value={phrase} onChange={(e) => setPhrase(e.target.value)} placeholder="e.g. North Atlantic Treaty Organization" className={field} autoComplete="off" />
            </label>
            <div className="flex flex-wrap gap-2 mt-3">
              {PHRASE_SAMPLES.map((s) => (
                <button key={s} type="button" className={ghost} onClick={() => { setPhrase(s); track("acronym_generator_use", { ...EV, content_source: "sample" }); }}>{s.length > 24 ? `${s.slice(0, 22)}…` : s}</button>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-4 text-sm text-[var(--text-secondary)]">
              <label className={chk}><input type="checkbox" checked={opts.skipSmall} onChange={(e) => setOpts({ ...opts, skipSmall: e.target.checked })} /> Skip small words (of, and, the…)</label>
              <label className={chk}><input type="checkbox" checked={opts.periods} onChange={(e) => setOpts({ ...opts, periods: e.target.checked })} /> Use periods (U.S.A.)</label>
              <label className={chk}><input type="checkbox" checked={opts.upper} onChange={(e) => setOpts({ ...opts, upper: e.target.checked })} /> All caps</label>
              <label className={chk}><input type="checkbox" checked={opts.numbers === "keep"} onChange={(e) => setOpts({ ...opts, numbers: e.target.checked ? "keep" : "drop" })} /> Keep numbers</label>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 mt-4 text-center min-h-28 flex flex-col items-center justify-center" aria-live="polite">
              {res.acronym ? (
                <>
                  <p className="text-5xl sm:text-6xl font-extrabold break-all" style={{ fontFamily: "var(--font-display)" }} data-acronym-result>{res.acronym}</p>
                  <ul className="flex flex-wrap justify-center gap-1.5 mt-3">
                    {res.used.map((u, i) => (
                      <li key={i} className="px-2 py-1 rounded-lg bg-white/[0.06] text-sm text-[var(--text-secondary)]"><strong className="text-[var(--neon-cyan)]">{u.part}</strong>{u.word.slice(u.part.length)}</li>
                    ))}
                  </ul>
                  {res.skipped.length > 0 && <p className="text-xs text-[var(--text-muted)] mt-2">Left out: {res.skipped.join(", ")}</p>}
                </>
              ) : <p className="text-[var(--text-muted)]">Type a phrase and the acronym appears here.</p>}
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              <button type="button" className="btn-generate" disabled={!res.acronym} onClick={() => doCopy(res.acronym, "acr")}>{flash === "acr" ? "Copied ✓" : "Copy acronym"}</button>
            </div>
          </>
        ) : (
          <>
            <label className="block">
              <span className={label}>Letters (up to {MAX_BACKRONYM_LETTERS})</span>
              <input
                value={letters}
                onChange={(e) => { setLetters(e.target.value.replace(/[^A-Za-z]/g, "").slice(0, MAX_BACKRONYM_LETTERS)); if (seed) setSeed(newSeed()); }}
                onKeyDown={(e) => { if (e.key === "Enter" && clean) reroll("keyboard"); }}
                placeholder="e.g. TEAM"
                className={`${field} uppercase tracking-widest`}
                autoComplete="off"
                autoCapitalize="characters"
                spellCheck={false}
              />
            </label>
            <div className="flex flex-wrap gap-2 mt-3">
              {LETTER_SAMPLES.map((s) => (
                <button key={s} type="button" className={ghost} onClick={() => { setLetters(s); setSeed(newSeed()); track("acronym_generator_use", { ...EV, content_source: "sample" }); }}>{s}</button>
              ))}
            </div>
            <div className="mt-4" role="group" aria-label="Themes">
              <span className={label}>Themes {themes.length === 0 && "(all)"}</span>
              <div className="flex flex-wrap gap-2">
                {THEME_IDS.map((t) => (
                  <button key={t} type="button" aria-pressed={themes.includes(t)} className={tab(themes.includes(t))} onClick={() => toggleTheme(t)}>{themeLabel(t)}</button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mt-5">
              <button type="button" className="btn-generate" disabled={!clean} onClick={() => reroll()}>🎲 {ideas.length ? "Re-roll 10 ideas" : "Get 10 meanings"}</button>
              {ideas.length > 0 && <button type="button" className={ghost} onClick={() => doCopy(ideas.map((i) => i.text).join("\n"), "all")}>{flash === "all" ? "Copied ✓" : "Copy all"}</button>}
            </div>
            {ideas.length > 0 && (
              <ol className="mt-5 space-y-2" aria-live="polite" data-backronym-results>
                {ideas.map((idea, i) => (
                  <li key={`${seed}-${i}`} className="flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">
                    <div className="min-w-0">
                      <p className="text-base sm:text-lg break-words">
                        {idea.words.map((w, j) => (
                          <span key={j} className="mr-2 inline-block"><strong className="text-[var(--neon-cyan)]">{w[0]}</strong>{w.slice(1)}</span>
                        ))}
                      </p>
                      <p className="text-xs text-[var(--text-muted)]">{themeLabel(idea.theme)}</p>
                    </div>
                    <button type="button" className={ghost} onClick={() => doCopy(idea.text, `i${i}`)} aria-label={`Copy ${idea.text}`}>{flash === `i${i}` ? "✓" : "Copy"}</button>
                  </li>
                ))}
              </ol>
            )}
            {!ideas.length && <p className="text-sm text-center text-[var(--text-muted)] mt-4">Enter letters such as TEAM, then press the button. Every letter gets a word that starts with it.</p>}
          </>
        )}
      </div>
    </section>
  );
}
