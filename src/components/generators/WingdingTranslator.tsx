"use client";

import { useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { DIGITS, LOWER, PUNCT, UPPER, fromWingdings, symbolFor, toWingdings, wingdingsPairs } from "@/lib/generators/wingdings";

type Dir = "encode" | "decode";
const SAMPLES = ["Hello", "I love you", "Wingdings", "Happy birthday", "NYC"];
const EV = { tool_type: "wingding_translator", locale: "en" };

export default function WingdingTranslator() {
  const [dir, setDir] = useState<Dir>("encode");
  const [input, setInput] = useState("");
  const [showLetters, setShowLetters] = useState(false);
  const [flash, setFlash] = useState("");

  const encode = dir === "encode";
  const output = input ? (encode ? toWingdings(input) : fromWingdings(input)) : "";
  const pairs = wingdingsPairs(encode ? input : fromWingdings(input));

  const flashFor = (what: string) => { setFlash(what); window.setTimeout(() => setFlash(""), 1500); };
  const swap = () => {
    setInput(output);
    setDir(encode ? "decode" : "encode");
    track("wingding_translator_use", { ...EV, content_source: "swap" });
  };
  const onCopy = async () => {
    if (output && (await copyText(output))) { flashFor("copy"); track("copy_result", EV); }
  };
  const add = (ch: string) => setInput((v) => v + (encode ? ch : (symbolFor(ch) ?? ch)));

  const label = "block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1";
  const box = "w-full bg-[var(--bg-secondary)] border border-white/10 rounded-xl px-3 py-3 text-lg text-[var(--text-primary)] min-h-28";
  const ghost = "px-4 py-2 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors";
  const tab = (on: boolean) => `px-4 py-2 rounded-xl text-sm border transition-colors ${on ? "border-[var(--neon-cyan)] text-[var(--text-primary)] bg-white/[0.06]" : "border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50"}`;

  return (
    <section id="tool" className="max-w-3xl mx-auto px-4 sm:px-6 scroll-mt-20">
      <div className="glass-card p-4 sm:p-8">
        <div className="flex flex-wrap gap-2 mb-4" role="group" aria-label="Translation direction">
          <button type="button" className={tab(encode)} aria-pressed={encode} onClick={() => dir !== "encode" && swap()}>English → Wingdings</button>
          <button type="button" className={tab(!encode)} aria-pressed={!encode} onClick={() => dir !== "decode" && swap()}>Wingdings → English</button>
        </div>

        <label className="block">
          <span className={label}>{encode ? "Your text" : "Paste Wingdings symbols"}</span>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={3}
            placeholder={encode ? "Type or paste English text…" : "Paste symbols like ✡ ☜ ♌ ♌ ●…"}
            className={box}
            spellCheck={false}
          />
        </label>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          {SAMPLES.map((s) => (
            <button key={s} type="button" className={ghost} onClick={() => { setDir("encode"); setInput(s); track("wingding_translator_use", { ...EV, content_source: "sample" }); }}>{s}</button>
          ))}
          {input && <button type="button" className={ghost} onClick={() => setInput("")}>Clear</button>}
        </div>

        <div className="mt-4">
          <span className={label}>{encode ? "Wingdings symbols" : "English text"}</span>
          <div className={`${box} whitespace-pre-wrap break-words ${encode ? "text-2xl leading-relaxed" : ""}`} aria-live="polite" data-wingdings-output>
            {output || <span className="text-[var(--text-muted)] text-base">Your translation appears here as you type.</span>}
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <button type="button" className="btn-generate" onClick={onCopy} disabled={!output}>{flash === "copy" ? "Copied ✓" : "Copy result"}</button>
          <button type="button" className={ghost} onClick={swap} disabled={!output}>⇄ Swap direction</button>
        </div>

        <label className="flex items-center justify-center gap-2 min-h-8 mt-3 text-sm text-[var(--text-secondary)]">
          <input type="checkbox" checked={showLetters} onChange={(e) => setShowLetters(e.target.checked)} /> Show the letter under each symbol
        </label>

        {showLetters && pairs.length > 0 && (
          <ul className="flex flex-wrap gap-1.5 mt-3 justify-center" aria-label="Symbol and letter pairs">
            {pairs.slice(0, 200).map((p, i) =>
              p.src === " " ? <li key={i} className="w-4" aria-hidden /> : p.src === "\n" ? <li key={i} className="basis-full" aria-hidden /> : (
                <li key={i} className="flex flex-col items-center rounded-lg bg-white/[0.06] px-2 py-1 min-w-9">
                  <span className="text-2xl leading-tight">{p.sym}</span>
                  <span className="text-xs text-[var(--text-muted)]">{p.src}</span>
                </li>
              ))}
          </ul>
        )}

        <p className="text-xs text-center text-[var(--text-muted)] mt-4">
          Runs in your browser; nothing is sent anywhere. A few symbols may show as empty boxes on older phones or computers that lack a font for them. Newer Windows, macOS, Android and iOS cover most of them.
        </p>
      </div>

      <div className="glass-card p-4 sm:p-6 mt-6" id="chart">
        <h2 className="text-lg font-bold text-[var(--text-primary)] mb-1">Wingdings chart: letters, numbers and punctuation</h2>
        <p className="text-sm text-[var(--text-secondary)] mb-4">Tap any cell to add it to the box above.</p>
        {([["Uppercase", UPPER], ["Lowercase", LOWER], ["Numbers", DIGITS], ["Punctuation", PUNCT]] as const).map(([title, chars]) => (
          <div key={title} className="mb-4">
            <p className={label}>{title}</p>
            <ul className="flex flex-wrap gap-1.5">
              {chars.map((c) => (
                <li key={c}>
                  <button type="button" onClick={() => add(c)} className="flex flex-col items-center rounded-lg border border-white/10 bg-white/[0.04] px-2 py-1 min-w-10 hover:border-[var(--neon-cyan)]/50 transition-colors" aria-label={`${c} is ${symbolFor(c)}`}>
                    <span className="text-xl leading-tight">{symbolFor(c)}</span>
                    <span className="text-xs text-[var(--text-muted)]">{c}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
