"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { track } from "@/lib/track";
import { secureInt } from "@/lib/generators/secure";
import { BINGO_THEMES, type BingoStyle } from "@/data/bingoThemes";

type Mode = "words" | "numbers" | "blank";
type Cell = { text: string; free?: boolean };
interface Card { id: number; cells: Cell[] }

const ev = { tool_type: "bingo_card_generator", locale: "en" };
const STORE = "rt-bingo-v1";
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

interface CardProps { card: Card; size: number; title: string; header: boolean; style: BingoStyle; print?: number; marked?: Set<number>; onMark?: (i: number) => void; win?: number[] | null }
function BingoCard({ card, size, title, header, style, print, marked, onMark, win }: CardProps) {
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
        <span>Card #{card.id}</span><span>randomtopics.app/bingo-card-generator</span>
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
        setCards(buildCards(m, sz, typeof s.free === "boolean" ? s.free : true, list, 8, secureInt));
      }
    } catch { /* storage blocked: keep defaults */ }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!mounted) return;
    try { localStorage.setItem(STORE, JSON.stringify({ themeId, mode, size, title, style, raw, free, header })); } catch { /* ignore */ }
  }, [mounted, themeId, mode, size, title, style, raw, free, header]);

  const generate = (opts?: Partial<{ mode: Mode; size: number; free: boolean; words: string[]; count: number }>) => {
    const m = opts?.mode ?? mode;
    const sz = m === "numbers" ? 5 : (opts?.size ?? size);
    const list = opts?.words ?? words;
    const n = opts?.count ?? count;
    setCards(buildCards(m, sz, opts?.free ?? free, list, n, secureInt));
    setMarked({});
    setCalled([]);
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
    if (!left.length) return;
    setCalled((c) => [left[secureInt(left.length)], ...c]);
    track("bingo_call", { ...ev, called: called.length + 1 });
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
                <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(Math.min(100, Math.max(1, Number(e.target.value) || 1)))} onBlur={() => generate()} className="w-24 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2 text-[var(--text-primary)] tabular-nums" />
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
                    <BingoCard card={c} size={gridSize} title={title} header={header} style={style} marked={m} win={win} onMark={(i) => toggleMark(c.id, i)} />
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
        <div className="glass-card p-5 sm:p-7 mt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">Bingo caller</h2>
              <p className="text-sm text-[var(--text-secondary)]">Draw calls one at a time, no repeats — for a party, a classroom or a video call.</p>
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={callNext} disabled={called.length >= callList.length} className="btn-generate">📣 Call next</button>
              <button type="button" onClick={() => setCalled([])} className={chip(false)}>Reset</button>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4" aria-live="polite">
            <div className="min-w-32 min-h-20 px-5 rounded-2xl bg-white text-[#16202e] flex items-center justify-center text-2xl sm:text-3xl font-extrabold shadow-md text-center">{called[0] ?? "—"}</div>
            <p className="text-sm text-[var(--text-secondary)]">{called.length} of {callList.length} called{called.length > 1 ? <>: <span className="text-[var(--text-primary)]">{called.slice(1, 25).join(" · ")}</span>{called.length > 25 ? " …" : ""}</> : ""}</p>
          </div>
        </div>
      )}

      {mounted && createPortal(
        <div id="bingo-print-root">
          {pages.map((pg, i) => (
            <div key={i} className={`bingo-page pp${perPage}`}>
              {pg.map((c) => <BingoCard key={c.id} card={c} size={gridSize} title={title} header={header} style={style} print={perPage === 1 ? 1.6 : 1} />)}
            </div>
          ))}
          {callSheet && callList.length > 0 && (
            <div className="bingo-page" style={{ fontFamily: "Arial, sans-serif", color: "#111" }}>
              <div>
                <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6 }}>{title} — caller&apos;s checklist</h2>
                <p style={{ fontSize: 12, marginBottom: 12 }}>Read the calls in any order and tick each one off. {cards.length} cards printed (#1–#{cards.length}).</p>
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
