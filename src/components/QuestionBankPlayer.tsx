"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { track } from "@/lib/track";
import { copyText } from "@/lib/clipboard";

// First-screen player for the two question-bank pages. The 300+ questions are
// server-rendered in the page (crawlable, printable); this component reads them
// back out of the DOM ([data-qb] items) so no question text is shipped twice.

type Kind = "wyr" | "tod";
interface Item { i: number; cat: string; text: string; a?: string; b?: string; type?: "truth" | "dare" }
interface Cat { id: string; label: string }

const CFG = {
  wyr: { tool: "would_you_rather_questions", path: "/topics/would-you-rather-questions", votes: "rt_wyr_bank_votes_v1" },
  tod: { tool: "truth_or_dare_questions", path: "/topics/truth-or-dare-questions", votes: "" },
} as const;

const btn = "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 py-2 text-sm font-semibold text-[var(--text-secondary)] transition-colors hover:border-[var(--neon-cyan)]/50 hover:text-[var(--neon-cyan)]";
const chip = (on: boolean) => `inline-flex min-h-9 items-center rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${on ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)]" : "border-white/10 text-[var(--text-muted)] hover:border-white/30"}`;
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function readStore<T>(key: string, fallback: T): T {
  try { const v = localStorage.getItem(key); return v ? (JSON.parse(v) as T) : fallback; } catch { return fallback; }
}
function writeStore(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* storage can be blocked */ }
}

function readItems(kind: Kind): Item[] {
  const out: Item[] = [];
  document.querySelectorAll<HTMLElement>("[data-qb]").forEach((el, i) => {
    const text = el.textContent?.trim() ?? "";
    if (!text) return;
    const group = el.closest<HTMLElement>("[data-cat]");
    const o = el.querySelectorAll("[data-o]");
    out.push({
      i, cat: group?.dataset.cat ?? "", text,
      a: o[0]?.textContent ?? undefined, b: o[1]?.textContent ?? undefined,
      type: kind === "tod" ? (group?.dataset.type === "dare" ? "dare" : "truth") : undefined,
    });
  });
  return out;
}

export default function QuestionBankPlayer({ kind, cats, initial }: { kind: Kind; cats: Cat[]; initial?: { a: string; b: string } }) {
  const cfg = CFG[kind];
  const [items, setItems] = useState<Item[]>([]);
  const [cat, setCat] = useState("all");
  const [cur, setCur] = useState<number | null>(null); // index into items
  const seen = useRef<Set<number>>(new Set());
  const [msg, setMsg] = useState("");
  const [present, setPresent] = useState(false);
  // WYR
  const [votes, setVotes] = useState<Record<string, [number, number]>>({});
  // ToD
  const [players, setPlayers] = useState<string[]>([]);
  const [turn, setTurn] = useState(0);
  const [name, setName] = useState("");
  const [pick, setPick] = useState<"truth" | "dare" | null>(null);

  useEffect(() => {
    const list = readItems(kind);
    setItems(list);
    if (kind === "wyr") setVotes(readStore(cfg.votes, {}));
    else setPlayers(readStore<string[]>("rt_tod_bank_players_v1", []));
    const m = /#q=(\d+)/.exec(window.location.hash);
    if (m && list[Number(m[1])]) {
      const n = Number(m[1]);
      setCur(n);
      seen.current.add(n);
      if (kind === "tod") setPick(list[n].type ?? "truth");
    }
  }, [kind, cfg.votes]);

  const flash = (t: string) => { setMsg(t); window.setTimeout(() => setMsg(""), 1800); };

  const pool = useCallback((type?: "truth" | "dare") => items.filter((it) => (cat === "all" || it.cat === cat) && (!type || it.type === type)), [items, cat]);

  const draw = useCallback((type?: "truth" | "dare") => {
    let p = pool(type);
    if (!p.length) return;
    let fresh = p.filter((it) => !seen.current.has(it.i));
    if (!fresh.length) { p.forEach((it) => seen.current.delete(it.i)); fresh = p.filter((it) => it.i !== cur); if (!fresh.length) fresh = p; }
    p = fresh;
    const next = p[Math.floor(Math.random() * p.length)];
    seen.current.add(next.i);
    setCur(next.i);
    track("generate_success", { tool_type: cfg.tool, result_count: 1, locale: "en", mode: kind === "wyr" ? "random" : (type ?? "any") });
    track(`${cfg.tool}_use`, { tool_type: cfg.tool, mode: kind === "wyr" ? "random" : (type ?? "any"), locale: "en" });
  }, [pool, cur, cfg.tool, kind]);

  const item = cur !== null ? items[cur] : undefined;
  const key = item ? String(item.i) : "initial";
  const tally: [number, number] = votes[key] ?? [0, 0];
  const total = tally[0] + tally[1];

  const vote = (side: 0 | 1) => {
    const t: [number, number] = [...tally] as [number, number];
    t[side] += 1;
    const nv = { ...votes, [key]: t };
    setVotes(nv);
    writeStore(cfg.votes, nv);
    track(`${cfg.tool}_use`, { tool_type: cfg.tool, mode: "vote", locale: "en" });
  };
  const resetVotes = () => { const nv = { ...votes }; delete nv[key]; setVotes(nv); writeStore(cfg.votes, nv); };

  const link = () => `${window.location.origin}${cfg.path}${cur !== null ? `#q=${cur}` : ""}`;
  const shareTrack = (method: string) => {
    track("share_click", { tool_type: cfg.tool, share_method: method, locale: "en" });
    track(`${cfg.tool}_share`, { tool_type: cfg.tool, share_method: method, locale: "en" });
  };
  const copyLink = async () => {
    if (await copyText(link())) { flash("Link copied"); shareTrack("copy_link"); } else flash("Copy failed");
  };
  const player = players.length ? players[turn % players.length] : undefined;
  const shareImage = async () => {
    try {
      const m = await import("@/lib/qbankShareCanvas");
      let r: "shared" | "downloaded";
      if (kind === "wyr") {
        const a = item?.a ?? initial?.a ?? "", b = item?.b ?? initial?.b ?? "";
        r = await m.shareWyrImage(a, b, total ? tally : undefined);
      } else {
        if (!item) return;
        r = await m.shareTodImage(item.type ?? "truth", item.text, player);
      }
      flash(r === "shared" ? "Image ready" : "Image saved");
      shareTrack("image");
    } catch { flash("Could not make the image"); }
  };

  const addPlayer = () => {
    const n = name.trim().slice(0, 20);
    if (!n || players.length >= 12 || players.includes(n)) { setName(""); return; }
    const np = [...players, n];
    setPlayers(np); writeStore("rt_tod_bank_players_v1", np); setName("");
  };
  const removePlayer = (n: string) => {
    const np = players.filter((p) => p !== n);
    setPlayers(np); writeStore("rt_tod_bank_players_v1", np); setTurn(0);
  };
  const choose = (type: "truth" | "dare") => { setPick(type); draw(type); };
  const nextTurn = () => { setTurn((t) => t + 1); setPick(null); setCur(null); };

  useEffect(() => {
    if (!present) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPresent(false);
      else if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); draw(); }
      else if (kind === "wyr" && e.key === "1") vote(0);
      else if (kind === "wyr" && e.key === "2") vote(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const a = item?.a ?? initial?.a ?? "";
  const b = item?.b ?? initial?.b ?? "";
  const filterChips = useMemo(() => (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Category">
      <button type="button" className={chip(cat === "all")} aria-pressed={cat === "all"} onClick={() => { setCat("all"); }}>All</button>
      {cats.map((c) => (
        <button key={c.id} type="button" className={chip(cat === c.id)} aria-pressed={cat === c.id} onClick={() => setCat(c.id)}>{c.label}</button>
      ))}
    </div>
  ), [cat, cats]);

  const wyrCard = (big: boolean) => (
    <div>
      <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-[var(--neon-yellow,#FFE234)]">Would you rather...</p>
      <div className={`mt-3 grid gap-3 ${big ? "sm:grid-cols-2 sm:gap-6" : "sm:grid-cols-2"} relative`}>
        {([[a, 0, "var(--neon-cyan)", "A"], [b, 1, "var(--neon-pink)", "B"]] as const).map(([t, side, color, letter]) => {
          const pct = total ? Math.round((tally[side] / total) * 100) : 0;
          return (
            <button key={side} type="button" onClick={() => vote(side)} aria-label={`Vote ${letter}: ${t}`}
              className={`relative flex ${big ? "min-h-48 sm:min-h-72" : "min-h-28"} flex-col items-center justify-center overflow-hidden rounded-2xl border-2 p-4 text-center transition-transform active:scale-[0.98]`}
              style={{ borderColor: color, background: `color-mix(in srgb, ${color} 10%, transparent)` }}>
              {total > 0 && <span aria-hidden="true" className="absolute inset-x-0 bottom-0 transition-all" style={{ height: `${pct}%`, background: `color-mix(in srgb, ${color} 22%, transparent)` }} />}
              <span className="relative text-[10px] font-extrabold tracking-widest" style={{ color }}>{letter}</span>
              <span className={`relative mt-1 font-bold leading-snug text-[var(--text-primary)] ${big ? "text-2xl sm:text-4xl" : "text-base sm:text-lg"}`}>{cap(t)}</span>
              {total > 0 && <span className="relative mt-2 text-xs font-semibold text-[var(--text-secondary)]">{tally[side]} vote{tally[side] === 1 ? "" : "s"} · {pct}%</span>}
            </button>
          );
        })}
        <span aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-[#FFE234] bg-[#14122b] text-xs font-extrabold text-[#FFE234] sm:flex">OR</span>
      </div>
      <p className="mt-2 text-center text-xs text-[var(--text-muted)]">
        {total > 0 ? `Your group's votes on this device: ${total}. ` : "Tap an option to vote. Each tap adds one vote from your group, saved only in this browser. "}
        {total > 0 && <button type="button" className="underline underline-offset-2" onClick={resetVotes}>Reset votes</button>}
      </p>
    </div>
  );

  const todCard = (big: boolean) => {
    const type = item?.type ?? pick ?? "truth";
    const color = type === "truth" ? "var(--neon-cyan)" : "var(--neon-pink)";
    return (
      <div>
        <p className="text-center text-sm font-semibold text-[var(--text-secondary)]">
          {player ? <><span className="text-[#FFE234]">{player}</span>, your turn. Truth or dare?</> : "Truth or dare?"}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <button type="button" onClick={() => choose("truth")} className={`min-h-14 rounded-xl border-2 text-lg font-extrabold uppercase tracking-wide transition-transform active:scale-[0.97] ${pick === "truth" ? "bg-[var(--neon-cyan)]/20" : ""}`} style={{ borderColor: "var(--neon-cyan)", color: "var(--neon-cyan)" }}>Truth</button>
          <button type="button" onClick={() => choose("dare")} className={`min-h-14 rounded-xl border-2 text-lg font-extrabold uppercase tracking-wide transition-transform active:scale-[0.97] ${pick === "dare" ? "bg-[var(--neon-pink)]/20" : ""}`} style={{ borderColor: "var(--neon-pink)", color: "var(--neon-pink)" }}>Dare</button>
        </div>
        <div className={`mt-3 flex ${big ? "min-h-52" : "min-h-24"} items-center justify-center rounded-2xl border-2 border-dashed p-4 text-center`} style={{ borderColor: item ? color : "rgba(255,255,255,0.15)" }} aria-live="polite">
          {item ? (
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-[0.2em]" style={{ color }}>{type}</span>
              <p className={`mt-1 font-bold leading-snug text-[var(--text-primary)] ${big ? "text-2xl sm:text-4xl" : "text-lg sm:text-xl"}`}>{item.text}</p>
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">Pick truth or dare to draw a prompt from {cat === "all" ? "all categories" : cats.find((c) => c.id === cat)?.label}.</p>
          )}
        </div>
      </div>
    );
  };

  const actions = (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
      {kind === "wyr" ? (
        <button type="button" className="btn-generate inline-flex min-h-11 items-center gap-2 px-5 py-2 text-sm" onClick={() => draw()}>Random question</button>
      ) : item ? (
        <>
          <button type="button" className="btn-generate inline-flex min-h-11 items-center gap-2 px-5 py-2 text-sm" onClick={nextTurn}>{players.length ? "Done, next player" : "Done, next round"}</button>
          <button type="button" className={btn} onClick={() => draw(item.type)}>Skip</button>
        </>
      ) : null}
      <button type="button" className={btn} onClick={() => setPresent(true)}>{kind === "wyr" ? "One question per screen" : "Full screen"}</button>
      <button type="button" className={btn} onClick={shareImage} disabled={kind === "tod" && !item}>Save image</button>
      <button type="button" className={btn} onClick={copyLink}>Copy link</button>
    </div>
  );

  return (
    <section aria-label={kind === "wyr" ? "Would you rather picker" : "Truth or dare party mode"} className="glass-card p-4 sm:p-6" data-qb-player>
      {filterChips}
      <div className="mt-4">{kind === "wyr" ? wyrCard(false) : todCard(false)}</div>
      {actions}
      {kind === "tod" && (
        <div className="mt-4 border-t border-white/10 pt-4">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">Players (optional, saved on this device)</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            {players.map((p, i) => (
              <span key={p} className={`inline-flex min-h-9 items-center gap-1 rounded-full border px-3 text-xs ${i === turn % players.length ? "border-[#FFE234] text-[#FFE234]" : "border-white/15 text-[var(--text-secondary)]"}`}>
                {p}
                <button type="button" aria-label={`Remove ${p}`} className="ml-1 px-1 text-[var(--text-muted)] hover:text-[var(--neon-pink)]" onClick={() => removePlayer(p)}>x</button>
              </span>
            ))}
            <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); addPlayer(); }}>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Add a name" aria-label="Player name" maxLength={20}
                className="min-h-11 w-32 rounded-lg border border-white/15 bg-transparent px-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] sm:w-40" />
              <button type="submit" className={btn}>Add</button>
            </form>
          </div>
        </div>
      )}
      <p className="mt-2 min-h-4 text-center text-xs text-[var(--neon-cyan)]" role="status">{msg}</p>

      {present && (
        <div role="dialog" aria-modal="true" aria-label="One question per screen" className="fixed inset-0 z-[100] flex flex-col overflow-y-auto bg-[#0a0e1f] p-4 sm:p-8">
          <div className="flex items-center justify-between gap-2">
            {filterChips}
            <button type="button" className={btn} onClick={() => setPresent(false)}>Close</button>
          </div>
          <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center py-6">
            {kind === "wyr" ? wyrCard(true) : todCard(true)}
            {actions}
          </div>
        </div>
      )}
    </section>
  );
}
