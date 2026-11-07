"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { createRng, fromBase64Url, newSeed, parseNames, shuffle, toBase64Url } from "@/lib/randomGenerators";
import { bracketSizeFor, buildSlots, resolveBracket, roundCount, roundName } from "@/lib/bracket";

interface Shared { t: string; n: string[]; s: number[]; p: number[][] }

const SAMPLES: Record<string, { title: string; names: string[] }> = {
  snacks: { title: "Best Snack", names: ["Popcorn", "Pizza rolls", "Nachos", "Pretzels", "Chips & salsa", "Cookies", "Fries", "Gummy bears"] },
  movies: { title: "Best Pixar Movie", names: ["Toy Story", "Finding Nemo", "Up", "WALL·E", "Inside Out", "Coco", "Ratatouille", "The Incredibles"] },
  players: { title: "Ping Pong Tournament", names: ["Ava", "Ben", "Chloe", "Diego", "Emma", "Finn", "Grace", "Hiro", "Isla", "Jonah"] },
};

export default function BracketMaker() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [randomSeed, setRandomSeed] = useState(true);
  const [names, setNames] = useState<string[]>([]);
  const [slots, setSlots] = useState<number[]>([]);
  const [picks, setPicks] = useState<number[][]>([]);
  const [flash, setFlash] = useState("");

  const typed = useMemo(() => parseNames(text).slice(0, 64), [text]);

  useEffect(() => {
    let live = true;
    void Promise.resolve().then(() => {
      if (!live) return;
      const d = new URLSearchParams(window.location.search).get("d");
      const raw = d ? fromBase64Url(d) : null;
      if (!raw) return;
      try {
        const s = JSON.parse(raw) as Shared;
        if (!Array.isArray(s.n) || !Array.isArray(s.s)) return;
        const n = s.n.slice(0, 64).map(String);
        const size = s.s.length;
        if (![4, 8, 16, 32, 64].includes(size)) return;
        setTitle(String(s.t ?? "").slice(0, 80));
        setText(n.join("\n"));
        setNames(n);
        setSlots(s.s.map((i) => (Number.isInteger(i) && i >= 0 && i < n.length ? i : -1)));
        setPicks(Array.isArray(s.p) ? s.p.map((row) => (Array.isArray(row) ? row.map((v) => Number(v)) : [])) : []);
      } catch {
        /* ignore malformed links */
      }
    });
    return () => {
      live = false;
    };
  }, []);

  const rounds = useMemo(() => (slots.length ? resolveBracket(slots, picks) : []), [slots, picks]);
  const total = slots.length ? roundCount(slots.length) : 0;
  const champion = rounds.length ? rounds[rounds.length - 1][0].winner : -1;

  const share = useCallback((n: string[], s: number[], p: number[][], t: string) => {
    const encoded = toBase64Url(JSON.stringify({ t, n, s, p } satisfies Shared));
    const qs = encoded.length < 6000 ? `?d=${encoded}` : "";
    window.history.replaceState(null, "", `${window.location.pathname}${qs}${window.location.hash}`);
  }, []);

  const build = (list = typed, t = title, shuffleIt = randomSeed) => {
    if (list.length < 2) return;
    const order = list.map((_, i) => i);
    const seeded = shuffleIt ? shuffle(order, createRng(newSeed())) : order;
    const s = buildSlots(seeded, bracketSizeFor(list.length));
    setNames(list);
    setSlots(s);
    setPicks([]);
    share(list, s, [], t);
    track("generate_success", { tool_type: "bracket_maker", result_count: s.length, requested_count: list.length, locale: "en" });
    window.setTimeout(() => document.getElementById("bracket-board")?.scrollIntoView({ block: "nearest", behavior: "smooth" }), 60);
  };

  const loadSample = (id: string) => {
    const sample = SAMPLES[id];
    setTitle(sample.title);
    setText(sample.names.join("\n"));
    build(sample.names, sample.title, true);
  };

  const choose = (r: number, m: number, who: number) => {
    if (who < 0) return;
    const next = picks.map((row) => row.slice());
    while (next.length <= r) next.push([]);
    next[r][m] = next[r][m] === who ? -1 : who;
    setPicks(next);
    share(names, slots, next, title);
    if (r === total - 1 && next[r][m] >= 0) track("tool_use", { tool_type: "bracket_maker", action: "champion", locale: "en" });
  };

  const label = (i: number) => (i >= 0 ? names[i] : "");
  const asText = () => {
    const lines = [title || "Bracket"];
    rounds.forEach((matches, r) => {
      lines.push("", roundName(r, total));
      matches.forEach((mt) => {
        const a = mt.a >= 0 ? label(mt.a) : "BYE";
        const b = mt.b >= 0 ? label(mt.b) : "BYE";
        lines.push(`${a} vs ${b}${mt.winner >= 0 ? ` → ${label(mt.winner)}` : ""}`);
      });
    });
    if (champion >= 0) lines.push("", `Champion: ${label(champion)}`);
    return lines.join("\n");
  };

  const flashFor = (what: string) => {
    setFlash(what);
    window.setTimeout(() => setFlash(""), 1500);
  };

  const ghost = "px-4 py-2 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors";
  const chip = "text-sm px-3.5 py-1.5 rounded-lg border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/40 transition-all";
  const size = bracketSizeFor(Math.max(typed.length, 2));
  const byes = typed.length >= 2 ? size - typed.length : 0;

  return (
    <section id="tool" className="max-w-6xl mx-auto px-4 sm:px-6 scroll-mt-20">
      <div className="glass-card p-5 sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr]">
          <div className="print:hidden">
            <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Sample brackets">
              <button type="button" className={chip} onClick={() => loadSample("snacks")}>🍿 Best snack</button>
              <button type="button" className={chip} onClick={() => loadSample("movies")}>🎬 Best movie</button>
              <button type="button" className={chip} onClick={() => loadSample("players")}>🏓 10 players</button>
            </div>
            <label htmlFor="bracket-title" className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Bracket title</label>
            <input
              id="bracket-title"
              value={title}
              maxLength={80}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Office Ping Pong Cup"
              className="mt-2 mb-4 w-full rounded-xl bg-[var(--bg-secondary)] border border-white/10 p-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-cyan)]/60"
            />
            <label htmlFor="bracket-names" className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Teams, players or options — one per line</label>
            <textarea
              id="bracket-names"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={"Lions\nTigers\nBears\nWolves\nEagles\nSharks"}
              rows={9}
              className="mt-2 w-full rounded-xl bg-[var(--bg-secondary)] border border-white/10 p-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--neon-cyan)]/60"
            />
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {typed.length} entr{typed.length === 1 ? "y" : "ies"}
              {typed.length >= 2 && <> · {size}-slot bracket{byes > 0 && <>, {byes} bye{byes === 1 ? "" : "s"}</>}</>}
              {typed.length >= 64 && <> · max 64</>}
            </p>
            <label className="flex items-center gap-2 mt-3 text-sm text-[var(--text-secondary)]">
              <input type="checkbox" checked={randomSeed} onChange={(e) => setRandomSeed(e.target.checked)} />
              Random seeding (off = keep my order)
            </label>
            <button
              type="button"
              onClick={() => build()}
              disabled={typed.length < 2}
              className="mt-4 w-full rounded-xl px-5 py-3 font-semibold text-black bg-[var(--neon-cyan)] disabled:opacity-40"
            >
              {slots.length ? "Make a new bracket" : "Make bracket"}
            </button>
            {typed.length < 2 && <p className="text-xs text-[var(--text-muted)] mt-2">Add at least two entries, or tap a sample above.</p>}
          </div>

          <div id="bracket-board" className="min-w-0">
            {!slots.length ? (
              <div className="h-full min-h-[240px] rounded-2xl border border-dashed border-white/10 flex items-center justify-center text-center p-6 text-sm text-[var(--text-muted)]">
                Your bracket appears here. Tap a name in each match to send it to the next round.
              </div>
            ) : (
              <>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h2 className="text-lg font-bold text-[var(--text-primary)]">{title || "My bracket"}</h2>
                  <div className="flex flex-wrap gap-2 print:hidden">
                    <button type="button" className={ghost} onClick={async () => { if (await copyText(asText())) flashFor("copy"); }}>{flash === "copy" ? "Copied ✓" : "Copy as text"}</button>
                    <button type="button" className={ghost} onClick={async () => { if (await copyText(window.location.href)) flashFor("link"); track("share_result", { tool_type: "bracket_maker", locale: "en" }); }}>{flash === "link" ? "Link copied ✓" : "Copy share link"}</button>
                    <button type="button" className={ghost} onClick={() => window.print()}>Print</button>
                  </div>
                </div>
                {champion >= 0 && (
                  <p className="mb-3 rounded-xl border border-[var(--neon-yellow)]/40 bg-[rgba(255,230,0,0.06)] px-4 py-3 text-[var(--text-primary)]">
                    🏆 Champion: <strong>{label(champion)}</strong>
                  </p>
                )}
                <div className="overflow-x-auto pb-2">
                  <div className="flex gap-4 min-w-max">
                    {rounds.map((matches, r) => (
                      <div key={r} className="flex flex-col w-44">
                        <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">{roundName(r, total)}</p>
                        <div className="flex flex-col justify-around flex-1 gap-3">
                          {matches.map((mt, m) => (
                            <div key={m} className="rounded-xl border border-white/10 bg-[var(--bg-secondary)] overflow-hidden">
                              {[mt.a, mt.b].map((who, side) => {
                                const won = who >= 0 && mt.winner === who;
                                const lost = who >= 0 && mt.winner >= 0 && mt.winner !== who;
                                const playable = who >= 0 && mt.a >= 0 && mt.b >= 0;
                                return (
                                  <button
                                    key={side}
                                    type="button"
                                    disabled={!playable}
                                    onClick={() => choose(r, m, who)}
                                    className={`block w-full text-left px-3 py-2 text-sm truncate ${side === 0 ? "border-b border-white/10" : ""} ${won ? "text-[var(--neon-cyan)] font-semibold" : lost ? "text-[var(--text-muted)] line-through" : "text-[var(--text-primary)]"} ${playable ? "hover:bg-white/5" : ""}`}
                                    title={who >= 0 ? label(who) : undefined}
                                  >
                                    {who >= 0 ? label(who) : r === 0 ? <span className="text-[var(--text-muted)] italic">bye</span> : <span className="text-[var(--text-muted)]">—</span>}
                                  </button>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-2 print:hidden">Tap a name to advance it; tap again to undo. The link updates as you go, so you can share the live bracket.</p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
