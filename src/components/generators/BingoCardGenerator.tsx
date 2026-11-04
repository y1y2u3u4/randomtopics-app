"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { track } from "@/lib/track";
import { copyText } from "@/lib/clipboard";
import { secureInt } from "@/lib/generators/secure";
import { BINGO_THEMES, type BingoStyle } from "@/data/bingoThemes";

type Mode = "words" | "numbers" | "blank";
type Cell = { text: string; free?: boolean };
interface Card { id: number; cells: Cell[] }

const ev = { tool_type: "bingo_card_generator", locale: "en" };
const STORE = "rt-bingo-v1";
const MAX_CARDS = 500;
const LETTERS = ["B", "I", "N", "G", "O"];
const STYLES: Record<BingoStyle, { label: string; head: string; headText: string; border: string; free: string; accent: string }> = {
  christmas: { label: "Christmas", head: "#B3263A", headText: "#FFF7EC", border: "#1E5B3A", free: "#1E5B3A", accent: "#F4E3C3" },
  winter: { label: "Winter blue", head: "#2B5E9C", headText: "#FFFFFF", border: "#2B5E9C", free: "#7FA8D9", accent: "#E6F0FA" },
  classic: { label: "Classic", head: "#5B4BC4", headText: "#FFFFFF", border: "#5B4BC4", free: "#E8A33D", accent: "#EFEBFF" },
  ink: { label: "Ink saver", head: "#FFFFFF", headText: "#111111", border: "#111111", free: "#FFFFFF", accent: "#FFFFFF" },
};

// Deterministic shuffle for the first render so server and client markup match.
function seeded(seed: number) {
  let a = seed;
  return (n: number) => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return Math.floor((((t ^ (t >>> 14)) >>> 0) / 4294967296) * n);
  };
}
function shuffle<T>(list: readonly T[], int: (n: number) => number): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) { const j = int(i + 1); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}
const parseWords = (raw: string) => [...new Set(raw.split(/\n|,/).map((w) => w.trim()).filter(Boolean))].slice(0, 300);
const numberLabel = (n: number) => `${LETTERS[Math.floor((n - 1) / 15)]}-${n}`;
// "B-12" on the caller, "12" on the card.
const callText = (call: string) => call.replace(/^[BINGO]-/, "");
const newSeed = () => secureInt(2 ** 31 - 1) + 1;
const gameCode = (seed: number) => seed.toString(36).toUpperCase().slice(-5);

// Players' phone link: the game settings travel in the URL, each player draws their own card.
interface PlayConfig { t: string; m: "words" | "numbers"; s: number; f: boolean; w?: string[] }
function encodePlay(cfg: PlayConfig) {
  const bytes = new TextEncoder().encode(JSON.stringify(cfg));
  let bin = "";
  bytes.forEach((b) => { bin += String.fromCharCode(b); });
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function decodePlay(raw: string): PlayConfig | null {
  try {
    const bin = atob(raw.replace(/-/g, "+").replace(/_/g, "/"));
    const o = JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0))));
    if (!o || (o.m !== "words" && o.m !== "numbers")) return null;
    const size = o.m === "numbers" ? 5 : [3, 4, 5].includes(o.s) ? o.s : 5;
    const words = o.m === "words" && Array.isArray(o.w) ? o.w.filter((x: unknown) => typeof x === "string").map((x: string) => x.slice(0, 60)).slice(0, 300) : undefined;
    if (o.m === "words" && !words?.length) return null;
    return { t: typeof o.t === "string" ? o.t.slice(0, 40) : "Bingo", m: o.m, s: size, f: o.f !== false, w: words };
  } catch { return null; }
}
function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text.replace(/^([BINGO])-(\d+)$/, "$1, $2"));
  u.rate = 0.95;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

function buildCards(mode: Mode, size: number, free: boolean, words: string[], count: number, int: (n: number) => number): Card[] {
  const center = size % 2 === 1 && free ? Math.floor((size * size) / 2) : -1;
  const seen = new Set<string>();
  const cards: Card[] = [];
  for (let id = 1; id <= count; id++) {
    let cells: Cell[] = [];
    for (let attempt = 0; attempt < 40; attempt++) {
      if (mode === "numbers") {
        // US 75-ball: each column draws 5 numbers from its own range of 15.
        const cols = LETTERS.map((_, c) => shuffle(Array.from({ length: 15 }, (_, i) => c * 15 + i + 1), int).slice(0, 5));
        cells = Array.from({ length: 25 }, (_, i) => ({ text: String(cols[i % 5][Math.floor(i / 5)]) }));
      } else if (mode === "blank") {
        cells = Array.from({ length: size * size }, () => ({ text: "" }));
      } else {
        const need = size * size - (center >= 0 ? 1 : 0);
        const pool = shuffle(words, int);
        // Short lists repeat rather than leaving gaps; the panel warns about it.
        const picked = Array.from({ length: need }, (_, i) => pool[i % Math.max(pool.length, 1)] ?? "");
        cells = picked.map((text) => ({ text }));
        if (center >= 0) cells.splice(center, 0, { text: "" });
      }
      if (center >= 0) cells[center] = { text: "FREE", free: true };
      const key = cells.map((c) => c.text).join("|");
      if (mode === "blank" || !seen.has(key)) { seen.add(key); break; }
    }
    cards.push({ id, cells });
  }
  return cards;
}

function winningLine(marked: Set<number>, size: number) {
  const lines: number[][] = [];
  for (let r = 0; r < size; r++) lines.push(Array.from({ length: size }, (_, c) => r * size + c));
  for (let c = 0; c < size; c++) lines.push(Array.from({ length: size }, (_, r) => r * size + c));
  lines.push(Array.from({ length: size }, (_, i) => i * size + i), Array.from({ length: size }, (_, i) => i * size + (size - 1 - i)));
  return lines.find((l) => l.every((i) => marked.has(i))) ?? null;
}

function textSize(text: string, size: number, print: number) {
  const base = print ? { 3: 22, 4: 16, 5: 12 }[size]! * print : { 3: 18, 4: 14, 5: 12 }[size]!;
  const len = text.length;
  // Shrink long single words (e.g. "Gingerbread") so they never break mid-word.
  const longest = Math.max(0, ...text.split(/\s+/).map((w) => w.length));
  const room = print ? 7.5 : 8.5;
  const fit = longest > room ? room / longest : 1;
  return (len > 22 ? base * 0.68 : len > 14 ? base * 0.8 : len > 8 ? base * 0.9 : /^\d+$/.test(text) ? base * 1.5 : base) * fit;
}

interface CardProps { card: Card; size: number; title: string; header: boolean; style: BingoStyle; print?: number; marked?: Set<number>; onMark?: (i: number) => void; win?: number[] | null; code?: string }
function BingoCard({ card, size, title, header, style, print, marked, onMark, win, code }: CardProps) {
  const s = STYLES[style];
  const letters = size === 5 && header;
  return (
    <div className="bingo-card" style={{ border: `3px solid ${s.border}`, background: "#fff", color: "#1d2230", borderRadius: print ? 10 : 14, overflow: "hidden", fontFamily: "'Avenir Next', 'Helvetica Neue', Arial, sans-serif" }}>
      <div style={{ background: s.head, color: s.headText, textAlign: "center", padding: print ? "10px 8px 6px" : "8px 6px 4px", borderBottom: style === "ink" ? `2px solid ${s.border}` : undefined }}>
        <div style={{ fontWeight: 800, fontSize: print ? 26 * print : 17, lineHeight: 1.15, letterSpacing: ".01em" }}>{title || "Bingo"}</div>
        {letters && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", fontWeight: 900, fontSize: print ? 28 * print : 22, lineHeight: 1.2, marginTop: 2 }}>
            {LETTERS.map((l) => <span key={l}>{l}</span>)}
          </div>
        )}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}>
        {card.cells.map((cell, i) => {
          const on = marked?.has(i);
          const inWin = win?.includes(i);
          return (
            <button
              key={i}
              type="button"
              tabIndex={print || !onMark ? -1 : 0}
              aria-pressed={onMark ? !!on : undefined}
              onClick={onMark ? () => onMark(i) : undefined}
              style={{
                aspectRatio: "1 / 1", minWidth: 0, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center",
                padding: print ? 6 : 3, fontSize: textSize(cell.text, size, print ?? 0), fontWeight: cell.free ? 900 : 650, lineHeight: 1.12, overflowWrap: "break-word",
                borderRight: (i + 1) % size ? `1.5px solid ${s.border}` : "none", borderBottom: i < size * (size - 1) ? `1.5px solid ${s.border}` : "none",
                background: cell.free ? s.free : inWin ? "#FFF2B8" : "#fff", color: cell.free ? (style === "ink" ? "#111" : "#fff") : "#1d2230",
                cursor: onMark ? "pointer" : "default",
              }}
            >
              {cell.free ? (style === "ink" ? "★ FREE ★" : <span>★<br />FREE</span>) : cell.text}
              {on && !cell.free && <span aria-hidden style={{ position: "absolute", inset: "12%", borderRadius: "50%", background: style === "winter" ? "rgba(43,94,156,.35)" : "rgba(179,38,58,.35)" }} />}
            </button>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: print ? 11 : 10, padding: print ? "4px 10px" : "3px 8px", color: "#6b7080", background: s.accent }}>
        <span>Card #{card.id}{code ? ` · Game ${code}` : ""}</span><span>randomtopics.app/bingo-card-generator</span>
      </div>
    </div>
  );
}

export default function BingoCardGenerator() {
  const [themeId, setThemeId] = useState("christmas");
  const [mode, setMode] = useState<Mode>("words");
  const [size, setSize] = useState(5);
  const [free, setFree] = useState(true);
  const [header, setHeader] = useState(true);
  const [title, setTitle] = useState("Christmas Bingo");
  const [style, setStyle] = useState<BingoStyle>("christmas");
  const [raw, setRaw] = useState(BINGO_THEMES[0].words.join("\n"));
  const [count, setCount] = useState(8);
  const [perPage, setPerPage] = useState(2);
  const [callSheet, setCallSheet] = useState(true);
  const [cards, setCards] = useState<Card[]>(() => buildCards("words", 5, true, BINGO_THEMES[0].words, 8, seeded(7)));
  const [marked, setMarked] = useState<Record<number, Set<number>>>({});
  const [called, setCalled] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [seed, setSeed] = useState(7);
  const [auto, setAuto] = useState(false);
  const [speed, setSpeed] = useState(8);
  const [voice, setVoice] = useState(true);
  const [checkId, setCheckId] = useState("");
  const [flash, setFlash] = useState("");
  const [player, setPlayer] = useState<{ cfg: PlayConfig; card: Card; key: string } | null>(null);
  const [playerMarks, setPlayerMarks] = useState<Set<number>>(new Set());

  const words = useMemo(() => parseWords(raw), [raw]);
  const gridSize = mode === "numbers" ? 5 : size;
  const hasFree = gridSize % 2 === 1 && free;
  const need = gridSize * gridSize - (hasFree ? 1 : 0);
  const callList = mode === "numbers" ? Array.from({ length: 75 }, (_, i) => numberLabel(i + 1)) : mode === "words" ? words : [];

  /* eslint-disable react-hooks/set-state-in-effect -- one-time restore of saved settings and portal mount after hydration */
  useEffect(() => {
    setMounted(true);
    try {
      const s = JSON.parse(localStorage.getItem(STORE) ?? "null");
      if (s && typeof s === "object") {
        if (s.themeId) setThemeId(s.themeId);
        if (["words", "numbers", "blank"].includes(s.mode)) setMode(s.mode);
        if ([3, 4, 5].includes(s.size)) setSize(s.size);
        if (typeof s.title === "string") setTitle(s.title);
        if (s.style in STYLES) setStyle(s.style);
        if (typeof s.raw === "string" && s.raw.trim()) setRaw(s.raw);
        if (typeof s.free === "boolean") setFree(s.free);
        if (typeof s.header === "boolean") setHeader(s.header);
        const m: Mode = ["words", "numbers", "blank"].includes(s.mode) ? s.mode : "words";
        const sz = m === "numbers" ? 5 : [3, 4, 5].includes(s.size) ? s.size : 5;
        const list = typeof s.raw === "string" && s.raw.trim() ? parseWords(s.raw) : BINGO_THEMES[0].words;
        // Same seed + settings rebuild the exact batch, so "Check a card" still works after a reload.
        const sd = Number.isInteger(s.seed) && s.seed > 0 ? s.seed : newSeed();
        const n = Number.isInteger(s.count) ? Math.min(MAX_CARDS, Math.max(1, s.count)) : 8;
        setSeed(sd); setCount(n);
        setCards(buildCards(m, sz, typeof s.free === "boolean" ? s.free : true, list, n, seeded(sd)));
      }
    } catch { /* storage blocked: keep defaults */ }
    const play = new URLSearchParams(location.search).get("play");
    const cfg = play ? decodePlay(play) : null;
    if (cfg) {
      const key = `rt-bingo-play-${play!.slice(-24)}`;
      let saved: { seed?: number; marks?: number[] } = {};
      try { saved = JSON.parse(localStorage.getItem(key) ?? "{}") ?? {}; } catch { /* ignore */ }
      const sd = Number.isInteger(saved.seed) ? saved.seed! : newSeed();
      const card = buildCards(cfg.m, cfg.s, cfg.f, cfg.w ?? [], 1, seeded(sd))[0];
      setPlayer({ cfg, card: { ...card, id: (sd % 900) + 100 }, key });
      setPlayerMarks(new Set(Array.isArray(saved.marks) ? saved.marks : []));
      try { localStorage.setItem(key, JSON.stringify({ seed: sd, marks: saved.marks ?? [] })); } catch { /* ignore */ }
      track("bingo_play_open", { ...ev, mode: cfg.m });
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem(STORE, JSON.stringify({ themeId, mode, size, title, style, raw, free, header, seed, count: cards.length })); } catch { /* ignore */ }
  }, [mounted, themeId, mode, size, title, style, raw, free, header, seed, cards.length]);

  const generate = (opts?: Partial<{ mode: Mode; size: number; free: boolean; words: string[]; count: number }>) => {
    const m = opts?.mode ?? mode;
    const sz = m === "numbers" ? 5 : (opts?.size ?? size);
    const list = opts?.words ?? words;
    const n = opts?.count ?? count;
    const sd = newSeed();
    setSeed(sd);
    setCards(buildCards(m, sz, opts?.free ?? free, list, n, seeded(sd)));
    setMarked({});
    setCalled([]);
    setAuto(false);
    track("generate_success", { ...ev, result_count: n, mode: m, grid: sz });
  };

  const pickTheme = (id: string) => {
    const t = BINGO_THEMES.find((x) => x.id === id);
    if (!t) return;
    setThemeId(id); setTitle(t.title); setStyle(t.style); setRaw(t.words.join("\n")); setMode("words");
    generate({ mode: "words", words: t.words });
  };
  const setModeAndGo = (m: Mode) => {
    setMode(m);
    if (m === "numbers") { setTitle("BINGO"); setHeader(true); }
    generate({ mode: m });
  };

  const toggleMark = (cardId: number, i: number) => setMarked((prev) => {
    const next = new Set(prev[cardId] ?? []);
    if (next.has(i)) next.delete(i); else next.add(i);
    return { ...prev, [cardId]: next };
  });
  const markSet = (card: Card) => {
    const s = new Set(marked[card.id] ?? []);
    card.cells.forEach((c, i) => c.free && s.add(i));
    return s;
  };

  const callNext = () => {
    const left = callList.filter((c) => !called.includes(c));
    if (!left.length) { setAuto(false); return; }
    const pick = left[secureInt(left.length)];
    setCalled((c) => [pick, ...c]);
    if (voice) speak(pick);
    track("bingo_call", { ...ev, called: called.length + 1, auto });
  };
  // The auto-caller timer always runs the latest callNext (fresh called list and settings).
  const callRef = useRef(callNext);
  useEffect(() => { callRef.current = callNext; });
  useEffect(() => {
    if (!auto) return;
    const t = window.setInterval(() => callRef.current(), speed * 1000);
    return () => window.clearInterval(t);
  }, [auto, speed]);

  const calledTexts = new Set(called.map(callText));
  const checked = (() => {
    const id = Number(checkId);
    const card = cards.find((c) => c.id === id);
    if (!card) return null;
    const m = new Set<number>();
    card.cells.forEach((c, i) => { if (c.free || calledTexts.has(c.text)) m.add(i); });
    return { card, marked: m, win: winningLine(m, gridSize), full: m.size === card.cells.length };
  })();

  const flashFor = (what: string) => { setFlash(what); window.setTimeout(() => setFlash(""), 1800); };
  const sharePlay = async () => {
    if (mode === "blank") return;
    const cfg: PlayConfig = mode === "numbers" ? { t: title, m: "numbers", s: 5, f: true } : { t: title, m: "words", s: gridSize, f: free, w: words };
    const url = `${location.origin}${location.pathname}?play=${encodePlay(cfg)}`;
    track("bingo_play_share", { ...ev, mode });
    if (await copyText(url)) { flashFor("play"); return; }
    if (navigator.share) { try { await navigator.share({ title, text: `Join ${title || "bingo"} — open the link to get your own card`, url }); } catch { /* dismissed */ } }
  };
  const togglePlayerMark = (i: number) => {
    if (!player) return;
    setPlayerMarks((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      // Idempotent write, safe if React calls the updater twice.
      try { const saved = JSON.parse(localStorage.getItem(player.key) ?? "{}"); localStorage.setItem(player.key, JSON.stringify({ ...saved, marks: [...next] })); } catch { /* ignore */ }
      return next;
    });
  };
  const newPlayerCard = () => {
    if (!player) return;
    const sd = newSeed();
    const card = buildCards(player.cfg.m, player.cfg.s, player.cfg.f, player.cfg.w ?? [], 1, seeded(sd))[0];
    setPlayer({ ...player, card: { ...card, id: (sd % 900) + 100 } });
    setPlayerMarks(new Set());
    try { localStorage.setItem(player.key, JSON.stringify({ seed: sd, marks: [] })); } catch { /* ignore */ }
  };

  const print = () => {
    track("print_click", { ...ev, result_count: cards.length, per_page: perPage });
    window.print();
  };

  const shortList = mode === "words" && words.length < need;
  const chip = (on: boolean) => `px-3 py-2 rounded-xl text-sm border transition-colors ${on ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/15" : "border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50"}`;
  const label = "block text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2";
  const pages: Card[][] = [];
  for (let i = 0; i < cards.length; i += perPage) pages.push(cards.slice(i, i + perPage));
  const preview = cards.slice(0, 2);

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6">
      <style>{`
        #bingo-print-root{display:none}
        @media print{
          @page{size:letter portrait;margin:0.35in}
          html,body{background:#fff !important}
          body > *:not(#bingo-print-root){display:none !important}
          #bingo-print-root{display:block}
          .bingo-page{break-after:page;page-break-after:always;display:grid;gap:0.3in;align-content:start}
          .bingo-page:last-child{break-after:auto;page-break-after:auto}
          .bingo-page.pp1{grid-template-columns:7in;justify-content:center}
          .bingo-page.pp2{grid-template-columns:3.3in;justify-content:center}
          .bingo-page.pp4{grid-template-columns:3.4in 3.4in;justify-content:center}
          .bingo-card{break-inside:avoid;-webkit-print-color-adjust:exact;print-color-adjust:exact}
          .bingo-card button{border-top:0;border-left:0}
        }`}</style>

      {player && (
        <div className="glass-card p-5 sm:p-7 mb-5" id="bingo-player" data-bingo-player>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div>
              <h2 className="text-lg font-bold">Your card: {player.cfg.t || "Bingo"}</h2>
              <p className="text-sm text-[var(--text-secondary)]">Tap a square when it is called. Your card and marks stay on this phone if you reload.</p>
            </div>
            <button type="button" onClick={newPlayerCard} className={chip(false)}>New card</button>
          </div>
          {(() => {
            const m = new Set(playerMarks);
            player.card.cells.forEach((c, i) => c.free && m.add(i));
            const win = winningLine(m, player.cfg.s);
            return (
              <div className="max-w-md mx-auto">
                <BingoCard card={player.card} size={player.cfg.s} title={player.cfg.t} header={player.cfg.s === 5} style={player.cfg.m === "numbers" ? "classic" : style} marked={m} win={win} onMark={togglePlayerMark} />
                {win && <p className="text-center font-extrabold text-2xl mt-3 text-amber-300" role="status">🎉 BINGO! Read your highlighted line back to the caller.</p>}
              </div>
            );
          })()}
          <p className="text-xs text-[var(--text-muted)] mt-3 text-center">Hosting your own game? Make cards below.</p>
        </div>
      )}

      <div className="glass-card p-5 sm:p-7">
        <span className={label}>1 · Pick a template</span>
        <div className="flex flex-wrap gap-2 mb-5" role="group" aria-label="Bingo templates">
          {BINGO_THEMES.map((t) => (
            <button key={t.id} type="button" aria-pressed={mode === "words" && themeId === t.id} className={chip(mode === "words" && themeId === t.id)} onClick={() => pickTheme(t.id)}>{t.emoji} {t.label}</button>
          ))}
          <button type="button" aria-pressed={mode === "numbers"} className={chip(mode === "numbers")} onClick={() => setModeAndGo("numbers")}>🔢 Numbers 1–75</button>
          <button type="button" aria-pressed={mode === "blank"} className={chip(mode === "blank")} onClick={() => setModeAndGo("blank")}>⬜ Blank template</button>
        </div>

        <div className="grid gap-5 md:grid-cols-[1fr_1.15fr]">
          <div className="space-y-4">
            <label className="block">
              <span className={label}>Card title</span>
              <input value={title} maxLength={40} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[var(--text-primary)]" />
            </label>
            {mode === "words" && (
              <label className="block">
                <span className={label}>Words or phrases — one per line ({words.length}, need {need}+)</span>
                <textarea value={raw} onChange={(e) => setRaw(e.target.value)} rows={7} className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--text-primary)]" />
                {shortList && <span className="block text-xs text-amber-300 mt-1">Add {need - words.length} more so every square is different — short lists repeat words.</span>}
              </label>
            )}
            {mode !== "numbers" && (
              <div>
                <span className={label}>Grid size</span>
                <div className="flex flex-wrap gap-2" role="group" aria-label="Grid size">
                  {[3, 4, 5].map((n) => <button key={n} type="button" aria-pressed={size === n} className={chip(size === n)} onClick={() => { setSize(n); generate({ size: n }); }}>{n}×{n}</button>)}
                </div>
              </div>
            )}
            <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--text-secondary)]">
              <label className={`flex items-center gap-2 ${gridSize % 2 ? "" : "opacity-50"}`}><input type="checkbox" checked={free} disabled={gridSize % 2 === 0} onChange={(e) => { setFree(e.target.checked); generate({ free: e.target.checked }); }} /> Free center square</label>
              <label className={`flex items-center gap-2 ${gridSize === 5 ? "" : "opacity-50"}`}><input type="checkbox" checked={header} disabled={gridSize !== 5} onChange={(e) => setHeader(e.target.checked)} /> B-I-N-G-O header</label>
            </div>
            <div>
              <span className={label}>Card style</span>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Card style">
                {(Object.keys(STYLES) as BingoStyle[]).map((k) => (
                  <button key={k} type="button" aria-pressed={style === k} className={chip(style === k)} onClick={() => setStyle(k)}>
                    <span aria-hidden className="inline-block w-3 h-3 rounded-full mr-1.5 align-middle border border-white/30" style={{ background: STYLES[k].head === "#FFFFFF" ? "#fff" : STYLES[k].head }} />{STYLES[k].label}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-end gap-4">
              <label className="block">
                <span className={label}>How many cards</span>
                <input type="number" min={1} max={MAX_CARDS} value={count} onChange={(e) => setCount(Math.min(MAX_CARDS, Math.max(1, Number(e.target.value) || 1)))} onBlur={() => generate()} className="w-24 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[var(--text-primary)] tabular-nums" />
              </label>
              <div>
                <span className={label}>Cards per page</span>
                <div className="flex gap-2" role="group" aria-label="Cards per page">
                  {[1, 2, 4].map((n) => <button key={n} type="button" aria-pressed={perPage === n} className={chip(perPage === n)} onClick={() => setPerPage(n)}>{n}</button>)}
                </div>
              </div>
            </div>
            {callList.length > 0 && (
              <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]"><input type="checkbox" checked={callSheet} onChange={(e) => setCallSheet(e.target.checked)} /> Add a caller&apos;s checklist page</label>
            )}
            <div className="flex flex-wrap gap-3 pt-1">
              <button type="button" onClick={() => generate()} className="btn-generate">🎲 Shuffle {count} unique card{count > 1 ? "s" : ""}</button>
              <button type="button" onClick={print} className="px-5 py-3 rounded-2xl border border-[var(--neon-cyan)]/60 text-[var(--text-primary)] font-semibold hover:bg-[var(--neon-cyan)]/10">🖨️ Print / save PDF</button>
            </div>
          </div>

          <div>
            <span className={label}>Preview · tap squares to mark them</span>
            <div className={`grid gap-3 ${gridSize === 5 ? "sm:grid-cols-1 lg:grid-cols-1" : "grid-cols-2"}`} data-bingo-preview>
              {(gridSize === 5 ? preview.slice(0, 1) : preview).map((c) => {
                const m = markSet(c);
                const win = winningLine(m, gridSize);
                return (
                  <div key={c.id}>
                    <BingoCard card={c} size={gridSize} title={title} header={header} style={style} marked={m} win={win} onMark={(i) => toggleMark(c.id, i)} code={gameCode(seed)} />
                    {win && <p className="text-center font-extrabold text-xl mt-2 text-amber-300" role="status">🎉 BINGO!</p>}
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-2">{cards.length} card{cards.length > 1 ? "s" : ""} ready · {pages.length} page{pages.length > 1 ? "s" : ""} at {perPage} per page{callSheet && callList.length ? " + caller's checklist" : ""}. Choose &quot;Save as PDF&quot; in the print dialog to download.</p>
          </div>
        </div>
      </div>

      {callList.length > 0 && (
        <div className="glass-card p-5 sm:p-7 mt-5" id="bingo-caller">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">Bingo caller</h2>
              <p className="text-sm text-[var(--text-secondary)]">Draw calls one at a time with no repeats, by hand or on a timer with a voice — for a party, a classroom or a video call.</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={callNext} disabled={called.length >= callList.length} className="btn-generate">📣 Call next</button>
              <button type="button" aria-pressed={auto} onClick={() => { setAuto(!auto); if (!auto) track("bingo_auto_call", { ...ev, speed }); }} disabled={called.length >= callList.length} className={chip(auto)}>{auto ? "⏸ Pause auto" : "▶ Auto-call"}</button>
              <button type="button" onClick={() => setCalled((c) => c.slice(1))} disabled={!called.length} className={chip(false)}>↶ Undo</button>
              <button type="button" onClick={() => { setCalled([]); setAuto(false); }} className={chip(false)}>Reset</button>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-[var(--text-secondary)]">
            <label className="flex items-center gap-2">Every
              <select value={speed} onChange={(e) => setSpeed(Number(e.target.value))} className="rounded-lg border border-white/10 bg-[var(--bg-secondary)] px-2 py-1 text-[var(--text-primary)]">
                {[5, 8, 12, 20].map((n) => <option key={n} value={n}>{n} seconds</option>)}
              </select>
            </label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={voice} onChange={(e) => setVoice(e.target.checked)} /> Read calls aloud</label>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4" aria-live="polite">
            <div className="min-w-32 min-h-20 px-5 rounded-2xl bg-white text-[#16202e] flex items-center justify-center text-2xl sm:text-3xl font-extrabold shadow-md text-center" data-bingo-current>{called[0] ?? "—"}</div>
            <p className="text-sm text-[var(--text-secondary)]">{called.length} of {callList.length} called{called.length > 1 ? <>; before that: <span className="text-[var(--text-primary)]">{called.slice(1, 6).join(" · ")}</span></> : ""}</p>
          </div>

          <div className="mt-4" aria-label="Called board">
            {mode === "numbers" ? (
              <div className="space-y-1 overflow-x-auto">
                {LETTERS.map((l, r) => (
                  <div key={l} className="flex gap-1 min-w-max">
                    <span className="w-7 h-7 flex items-center justify-center rounded-md bg-[var(--neon-cyan)]/20 font-extrabold text-sm">{l}</span>
                    {Array.from({ length: 15 }, (_, i) => r * 15 + i + 1).map((n) => {
                      const on = calledTexts.has(String(n));
                      return <span key={n} className={`w-7 h-7 flex items-center justify-center rounded-md text-xs tabular-nums ${on ? "bg-amber-300 text-[#16202e] font-bold" : "bg-white/[0.04] text-[var(--text-muted)]"}`}>{n}</span>;
                    })}
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {callList.map((w) => <span key={w} className={`px-2 py-1 rounded-md text-xs ${calledTexts.has(w) ? "bg-amber-300 text-[#16202e] font-semibold" : "bg-white/[0.04] text-[var(--text-muted)]"}`}>{w}</span>)}
              </div>
            )}
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <h3 className="font-bold">Check a winner</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Someone shouted Bingo? Type their card number to check it against the calls so far.</p>
              <label className="mt-3 flex items-center gap-2 text-sm">Card #
                <input type="number" min={1} max={cards.length} value={checkId} onChange={(e) => setCheckId(e.target.value)} className="w-24 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[var(--text-primary)] tabular-nums" placeholder="1" />
              </label>
              {checkId && !checked && <p className="text-sm text-amber-300 mt-2">This batch has cards #1–#{cards.length}.</p>}
              {checked && (
                <div className="mt-3 max-w-64" data-bingo-check>
                  <p className={`font-extrabold mb-2 ${checked.win ? "text-amber-300" : "text-[var(--text-secondary)]"}`} role="status">
                    {checked.full ? "✅ Blackout — every square is called" : checked.win ? "✅ Valid BINGO" : `❌ Not yet — ${checked.marked.size} of ${checked.card.cells.length} squares called`}
                  </p>
                  <BingoCard card={checked.card} size={gridSize} title={title} header={header} style={style} marked={checked.marked} win={checked.win} code={gameCode(seed)} />
                </div>
              )}
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <h3 className="font-bold">Play on phones (virtual bingo)</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-1">Send one link to everyone. Each player gets their own random card to tap on their phone; you call from this page or share your screen, and winners read their line back. No app or sign-up.</p>
              <button type="button" onClick={sharePlay} className={`${chip(false)} mt-3`}>{flash === "play" ? "Link copied ✓" : "📱 Copy players' link"}</button>
            </div>
          </div>
        </div>
      )}

      {mounted && createPortal(
        <div id="bingo-print-root">
          {pages.map((pg, i) => (
            <div key={i} className={`bingo-page pp${perPage}`}>
              {pg.map((c) => <BingoCard key={c.id} card={c} size={gridSize} title={title} header={header} style={style} print={perPage === 1 ? 1.6 : 1} code={gameCode(seed)} />)}
            </div>
          ))}
          {callSheet && callList.length > 0 && (
            <div className="bingo-page" style={{ fontFamily: "Arial, sans-serif", color: "#111" }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{title} — caller&apos;s checklist</h2>
                <p style={{ fontSize: 12, marginBottom: 12 }}>Read the calls in any order and tick each one off. {cards.length} cards printed (#1–#{cards.length}), game {gameCode(seed)}.</p>
                <ol style={{ columns: mode === "numbers" ? 5 : 3, fontSize: mode === "numbers" ? 14 : 13, lineHeight: 1.9, listStyle: "none", padding: 0 }}>
                  {callList.map((c) => <li key={c}>☐ {c}</li>)}
                </ol>
              </div>
            </div>
          )}
        </div>,
        document.body,
      )}
    </section>
  );
}
