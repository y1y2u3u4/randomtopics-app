"use client";

import { useEffect, useMemo, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { fromBase64Url, newSeed, parseNames, toBase64Url } from "@/lib/randomGenerators";
import { drawSecretSanta, parseExclusions } from "@/lib/secretSanta";

interface Reveal { g: string; r: string; e?: string; b?: string; d?: string }

const SAMPLE = ["Ava", "Ben", "Chloe", "Diego", "Emma", "Finn"];

export default function SecretSantaGenerator() {
  const [text, setText] = useState("");
  const [rules, setRules] = useState("");
  const [eventName, setEventName] = useState("");
  const [budget, setBudget] = useState("");
  const [date, setDate] = useState("");
  const [pairs, setPairs] = useState<number[] | null>(null);
  const [drawnNames, setDrawnNames] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [shown, setShown] = useState<number | null>(null);
  const [seen, setSeen] = useState<Set<number>>(new Set());
  const [flash, setFlash] = useState("");
  const [reveal, setReveal] = useState<Reveal | null>(null);
  const [opened, setOpened] = useState(false);

  const names = useMemo(() => Array.from(new Set(parseNames(text))).slice(0, 200), [text]);

  useEffect(() => {
    let live = true;
    void Promise.resolve().then(() => {
      if (!live) return;
      const s = new URLSearchParams(window.location.search).get("s");
      const raw = s ? fromBase64Url(s) : null;
      if (!raw) return;
      try {
        const v = JSON.parse(raw) as Reveal;
        if (typeof v.g === "string" && typeof v.r === "string") setReveal(v);
      } catch {
        /* ignore malformed links */
      }
    });
    return () => {
      live = false;
    };
  }, []);

  const flashFor = (what: string) => {
    setFlash(what);
    window.setTimeout(() => setFlash(""), 1500);
  };

  const draw = () => {
    setError("");
    if (names.length < 3) {
      setError("Add at least 3 people. With 2 people each just buys for the other.");
      return;
    }
    const blocked = parseExclusions(rules, names);
    const result = drawSecretSanta(names.length, blocked, newSeed());
    if (!result) {
      setPairs(null);
      setError("No valid draw is possible with these rules. Remove an exclusion or add more people.");
      return;
    }
    setPairs(result);
    setDrawnNames(names);
    setShown(null);
    setSeen(new Set());
    track("generate_success", { tool_type: "secret_santa_generator", result_count: result.length, requested_count: names.length, locale: "en", exclusions: blocked.length });
  };

  const linkFor = (g: number) => {
    if (!pairs) return "";
    const payload: Reveal = { g: drawnNames[g], r: drawnNames[pairs[g]] };
    if (eventName.trim()) payload.e = eventName.trim().slice(0, 60);
    if (budget.trim()) payload.b = budget.trim().slice(0, 20);
    if (date) payload.d = date;
    return `${window.location.origin}${window.location.pathname}?s=${toBase64Url(JSON.stringify(payload))}`;
  };

  const allLinks = () => (pairs ? drawnNames.map((n, i) => `${n}: ${linkFor(i)}`).join("\n") : "");
  const allPairs = () => (pairs ? drawnNames.map((n, i) => `${n} → ${drawnNames[pairs[i]]}`).join("\n") : "");

  const ghost = "px-4 py-2 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors";
  const field = "mt-2 w-full rounded-xl bg-[var(--bg-secondary)] border border-white/10 p-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-cyan)]/60";
  const lbl = "text-xs uppercase tracking-widest text-[var(--text-muted)]";

  if (reveal) {
    return (
      <section id="tool" className="max-w-xl mx-auto px-4 sm:px-6 scroll-mt-20">
        <div className="glass-card p-6 sm:p-8 text-center">
          <p className="text-sm text-[var(--text-muted)]">{reveal.e || "Secret Santa"}</p>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mt-1">Hi {reveal.g}! 🎅</h2>
          {!opened ? (
            <>
              <p className="text-[var(--text-secondary)] mt-3">Make sure nobody is looking at your screen.</p>
              <button type="button" onClick={() => { setOpened(true); track("tool_use", { tool_type: "secret_santa_generator", action: "reveal_link", locale: "en" }); }} className="mt-5 rounded-xl px-6 py-3 font-semibold text-black bg-[var(--neon-cyan)]">🎁 Reveal my person</button>
            </>
          ) : (
            <>
              <p className="text-[var(--text-secondary)] mt-4">You are buying a gift for</p>
              <p className="text-4xl font-black text-[var(--neon-pink)] mt-2 break-words">{reveal.r}</p>
              <div className="mt-4 text-sm text-[var(--text-secondary)] space-y-1">
                {reveal.b && <p>Budget: <strong>{reveal.b}</strong></p>}
                {reveal.d && <p>Gift exchange: <strong>{reveal.d}</strong></p>}
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-5">Keep it secret! You can open this link again any time.</p>
            </>
          )}
          {/* Full reload on purpose: clears the ?s= reveal state that a same-route <Link> would keep. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/secret-santa-generator" className="inline-block mt-6 text-sm underline text-[var(--text-muted)] hover:text-[var(--text-primary)]">Organise your own Secret Santa</a>
        </div>
      </section>
    );
  }

  return (
    <section id="tool" className="max-w-5xl mx-auto px-4 sm:px-6 scroll-mt-20">
      <div className="glass-card p-5 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <label htmlFor="ss-names" className={lbl}>Who is taking part? One name per line</label>
            <textarea id="ss-names" value={text} onChange={(e) => setText(e.target.value)} rows={7} placeholder={"Ava\nBen\nChloe\nDiego\nEmma\nFinn"} className={field} />
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {names.length} {names.length === 1 ? "person" : "people"}
              {!text && <> · <button type="button" className="underline hover:text-[var(--text-primary)]" onClick={() => setText(SAMPLE.join("\n"))}>Try a sample group</button></>}
            </p>
            <label htmlFor="ss-rules" className={`${lbl} block mt-4`}>Who can&apos;t draw each other? (optional)</label>
            <textarea id="ss-rules" value={rules} onChange={(e) => setRules(e.target.value)} rows={3} placeholder={"Ava, Ben\nChloe & Diego"} className={field} />
            <p className="text-xs text-[var(--text-muted)] mt-1">One couple or household per line. They won&apos;t draw each other in either direction.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div>
                <label htmlFor="ss-event" className={lbl}>Event</label>
                <input id="ss-event" value={eventName} onChange={(e) => setEventName(e.target.value)} maxLength={60} placeholder="Office party" className={field} />
              </div>
              <div>
                <label htmlFor="ss-budget" className={lbl}>Budget</label>
                <input id="ss-budget" value={budget} onChange={(e) => setBudget(e.target.value)} maxLength={20} placeholder="$25" className={field} />
              </div>
              <div>
                <label htmlFor="ss-date" className={lbl}>Date</label>
                <input id="ss-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} className={field} />
              </div>
            </div>
            <button type="button" onClick={draw} className="mt-5 w-full rounded-xl px-5 py-3 font-semibold text-black bg-[var(--neon-cyan)]">{pairs ? "Draw again" : "Draw names"}</button>
            {error && <p className="text-sm text-[var(--neon-pink)] mt-2" role="alert">{error}</p>}
          </div>

          <div>
            {!pairs ? (
              <div className="h-full min-h-[240px] rounded-2xl border border-dashed border-white/10 flex items-center justify-center text-center p-6 text-sm text-[var(--text-muted)]">
                After the draw, send each person their private link — or pass one phone around and let everyone tap their own name.
              </div>
            ) : (
              <>
                <p className={lbl}>Send each person their private link</p>
                <ul className="mt-2 space-y-2">
                  {drawnNames.map((n, i) => (
                    <li key={n} className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-[var(--bg-secondary)] px-3 py-2">
                      <span className="text-sm text-[var(--text-primary)] truncate">
                        {n}
                        {shown === i && <> → <strong className="text-[var(--neon-pink)]">{drawnNames[pairs[i]]}</strong></>}
                        {seen.has(i) && shown !== i && <span className="text-xs text-[var(--text-muted)]"> · seen</span>}
                      </span>
                      <span className="flex gap-1 shrink-0">
                        <button type="button" className="text-xs px-2.5 py-1 rounded-lg border border-white/10 hover:border-[var(--neon-cyan)]/50" onClick={async () => { if (await copyText(linkFor(i))) flashFor(`l${i}`); }}>{flash === `l${i}` ? "Copied ✓" : "Copy link"}</button>
                        <button
                          type="button"
                          className="text-xs px-2.5 py-1 rounded-lg border border-white/10 hover:border-[var(--neon-cyan)]/50"
                          onClick={() => {
                            setShown(shown === i ? null : i);
                            setSeen((s) => new Set(s).add(i));
                          }}
                        >
                          {shown === i ? "Hide" : "Reveal"}
                        </button>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-2 mt-4">
                  <button type="button" className={ghost} onClick={async () => { if (await copyText(allLinks())) flashFor("links"); track("share_result", { tool_type: "secret_santa_generator", locale: "en" }); }}>{flash === "links" ? "Copied ✓" : "Copy all links"}</button>
                  <button type="button" className={ghost} onClick={async () => { if (await copyText(allPairs())) flashFor("pairs"); }}>{flash === "pairs" ? "Copied ✓" : "Copy full list (organiser)"}</button>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-3">Nothing is uploaded or emailed: the draw happens in your browser and each link carries only that person&apos;s match.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
