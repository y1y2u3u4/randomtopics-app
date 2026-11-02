"use client";

import { useEffect, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { MAX_NAME_LENGTH, convertName, morae, toRomaji } from "@/lib/generators/japaneseConverter";

type Order = "western" | "jp";
const EV = { tool_type: "japanese_name_converter", locale: "en" };
const SAMPLES = ["Emily Johnson", "Michael", "Olivia Smith", "Liam", "Sophia Brown", "Daniel"];

export default function JapaneseNameConverter() {
  const [name, setName] = useState("");
  const [order, setOrder] = useState<Order>("western");
  const [flash, setFlash] = useState("");
  const [canSpeak, setCanSpeak] = useState(false);

  // Shared links carry ?name=…; read it once on the client so the page stays static.
  useEffect(() => {
    const shared = new URLSearchParams(location.search).get("name");
    if (shared) { setName(shared.slice(0, MAX_NAME_LENGTH)); track("japanese_name_converter_use", { ...EV, content_source: "shared_link" }); }
    setCanSpeak(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  const res = convertName(name, order);
  const resultKey = res?.katakana ?? "";
  useEffect(() => {
    if (!resultKey) return;
    // Count a conversion once the visitor pauses typing, not on every keystroke.
    const t = window.setTimeout(() => track("generate_success", { ...EV, result_count: 1 }), 900);
    return () => window.clearTimeout(t);
  }, [resultKey]);

  const flashFor = (what: string) => { setFlash(what); window.setTimeout(() => setFlash(""), 1500); };
  const doCopy = async (text: string, key: string) => {
    if (text && (await copyText(text))) { flashFor(key); track("copy_result", EV); }
  };
  const share = async () => {
    if (!res) return;
    const url = `${location.origin}${location.pathname}?name=${encodeURIComponent(name.trim())}`;
    const text = `My name in Japanese: ${res.katakana} (${res.romaji})`;
    track("japanese_name_converter_use", { ...EV, content_source: "share" });
    if (navigator.share) { try { await navigator.share({ title: "My name in Japanese", text, url }); return; } catch { /* fall back to copy */ } }
    if (await copyText(`${text} ${url}`)) flashFor("share");
  };
  const speak = () => {
    if (!res || !canSpeak) return;
    const u = new SpeechSynthesisUtterance(res.katakana.replace(/・/g, " "));
    u.lang = "ja-JP";
    u.rate = 0.85;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
    track("japanese_name_converter_use", { ...EV, content_source: "listen" });
  };

  const label = "block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1";
  const field = "w-full bg-[var(--bg-secondary)] border border-white/10 rounded-xl px-3 py-2 text-lg text-[var(--text-primary)]";
  const ghost = "px-4 py-2 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors";
  const tab = (on: boolean) => `px-4 py-2 rounded-xl text-sm border transition-colors ${on ? "border-[var(--neon-cyan)] text-[var(--text-primary)] bg-white/[0.06]" : "border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50"}`;

  return (
    <section id="tool" className="max-w-3xl mx-auto px-4 sm:px-6 scroll-mt-20">
      <div className="glass-card p-4 sm:p-8">
        <label className="block">
          <span className={label}>Your English name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, MAX_NAME_LENGTH))}
            placeholder="e.g. Emily Johnson"
            className={field}
            autoComplete="off"
            spellCheck={false}
            data-converter-input
          />
        </label>
        <div className="flex flex-wrap gap-2 mt-3">
          {SAMPLES.map((s) => (
            <button key={s} type="button" className={ghost} onClick={() => { setName(s); track("japanese_name_converter_use", { ...EV, content_source: "sample" }); }}>{s}</button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-4" role="group" aria-label="Name order">
          <span className="text-xs uppercase tracking-widest text-[var(--text-muted)] mr-1">Order</span>
          <button type="button" className={tab(order === "western")} aria-pressed={order === "western"} onClick={() => setOrder("western")}>Given name first</button>
          <button type="button" className={tab(order === "jp")} aria-pressed={order === "jp"} onClick={() => setOrder("jp")}>Family name first (Japanese style)</button>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 mt-4 text-center min-h-32 flex flex-col items-center justify-center" aria-live="polite">
          {res ? (
            <>
              <p className="text-4xl sm:text-6xl font-extrabold break-words" lang="ja" data-katakana-result>{res.katakana}</p>
              <p className="text-lg mt-2 text-[var(--neon-cyan)]">{res.romaji}</p>
              <p className="text-sm text-[var(--text-muted)] mt-1" lang="ja">Hiragana: {res.hiragana}</p>
            </>
          ) : <p className="text-[var(--text-muted)]">Type a name and the katakana, romaji and kanji appear here.</p>}
        </div>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          <button type="button" className="btn-generate" disabled={!res} onClick={() => res && doCopy(res.katakana, "kata")}>{flash === "kata" ? "Copied ✓" : "Copy katakana"}</button>
          <button type="button" className={ghost} disabled={!res} onClick={() => res && doCopy(`${res.katakana}\n${res.romaji}\n${res.hiragana}`, "all")}>{flash === "all" ? "Copied ✓" : "Copy all spellings"}</button>
          <button type="button" className={ghost} disabled={!res} onClick={share}>{flash === "share" ? "Link copied ✓" : "Share"}</button>
          {canSpeak && <button type="button" className={ghost} disabled={!res} onClick={speak}>🔊 Listen</button>}
        </div>

        {res && (
          <div className="mt-6 space-y-5" data-converter-parts>
            {res.parts.map((p, pi) => (
              <div key={`${p.input}-${pi}`} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-lg font-bold"><span className="capitalize">{p.input.toLowerCase()}</span> → <span lang="ja">{p.katakana}</span> <span className="text-[var(--text-muted)] text-sm font-normal">{p.romaji}</span></h3>
                  <span className="text-xs text-[var(--text-muted)]">{p.source === "dictionary" ? "Standard spelling" : "Spelled by sound"}</span>
                </div>
                <ul className="flex flex-wrap gap-1.5 mt-3" aria-label="Syllables">
                  {morae(p.katakana).map((m, mi) => (
                    <li key={mi} className="px-2 py-1 rounded-lg bg-white/[0.06] text-center leading-tight">
                      <span className="block text-lg" lang="ja">{m}</span>
                      <span className="block text-[10px] text-[var(--text-muted)]">{m === "ッ" ? "pause" : m === "ー" ? "long" : toRomaji(m) || "·"}</span>
                    </li>
                  ))}
                </ul>
                {p.kanji.length > 0 && (
                  <div className="mt-4">
                    <p className={label}>Kanji spellings (ateji, chosen by sound)</p>
                    <ol className="grid gap-2 sm:grid-cols-3">
                      {p.kanji.map((option, oi) => {
                        const text = option.map((k) => k.kanji).join("");
                        return (
                          <li key={oi} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-3xl font-bold" lang="ja">{text}</span>
                              <button type="button" className="text-xs text-[var(--text-secondary)] hover:text-[var(--neon-cyan)]" onClick={() => doCopy(text, `k${pi}-${oi}`)} aria-label={`Copy ${text}`}>{flash === `k${pi}-${oi}` ? "✓" : "Copy"}</button>
                            </div>
                            <ul className="mt-2 space-y-0.5 text-sm text-[var(--text-secondary)]">
                              {option.map((k, ki) => (
                                <li key={ki}><strong lang="ja" className="text-[var(--text-primary)]">{k.kanji}</strong> <span className="text-[var(--text-muted)]">{k.reading}</span> — {k.meaning}</li>
                              ))}
                            </ul>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {!res && <p className="text-sm text-center text-[var(--text-muted)] mt-4">Works for first names, surnames and full names (up to 4 words). Everything runs in your browser — nothing is uploaded.</p>}
      </div>
    </section>
  );
}
