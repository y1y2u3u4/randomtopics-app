"use client";

import { useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { wrapLines } from "@/lib/shareImage";
import { coverCrop, lookupItems, searchItems, type GridItem } from "@/lib/generators/nineGrid";
import {
  CELL_COUNT, DEFAULT_TITLE, EMOJIS, EXAMPLES, LIMITS, blankCard, cardFromHash, cloneCard, emptyCell, encodeCard, filledCount, portraitSvg,
  type Card, type Cell,
} from "@/lib/generators/fourCharacters";

const TOOL = "four_characters_i_like";
const PATH = "/4-characters-i-like";
const FONT = `"Helvetica Neue", Arial, "Hiragino Sans", "Noto Sans JP", sans-serif`;

const svgUrl = (svg: string) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

function loadImage(src: string, cors: boolean): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    if (cors) img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function fit(ctx: CanvasRenderingContext2D, text: string, max: number): string {
  if (ctx.measureText(text).width <= max) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > max) t = t.slice(0, -1);
  return `${t.trimEnd()}…`;
}

async function renderCard(card: Card): Promise<Blob | null> {
  const W = 1080, H = 1350, pad = 60, gap = 40;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#151826"); g.addColorStop(1, "#0d0f17");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.textAlign = "center";
  ctx.fillStyle = "#f5f6fb"; ctx.font = `800 58px ${FONT}`;
  ctx.fillText(fit(ctx, card.title.trim() || DEFAULT_TITLE, W - pad * 2), W / 2, 100);
  if (card.by.trim()) { ctx.fillStyle = "#a3a8bd"; ctx.font = `500 28px ${FONT}`; ctx.fillText(fit(ctx, card.by.trim(), W - pad * 2), W / 2, 142); }

  const top = 180, tileW = (W - pad * 2 - gap) / 2, imgH = 380, rowH = 520;
  const imgs = await Promise.all(card.cells.map((x, i) => (x.image ? loadImage(x.image, !x.image.startsWith("blob:")) : Promise.resolve(null)).then((im) => im ?? loadImage(svgUrl(portraitSvg(x, i)), false))));
  card.cells.forEach((x, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const tx = pad + col * (tileW + gap), ty = top + row * rowH;
    ctx.save();
    ctx.beginPath(); ctx.roundRect(tx, ty, tileW, imgH, 24); ctx.clip();
    ctx.fillStyle = "#1d2130"; ctx.fillRect(tx, ty, tileW, imgH);
    const im = imgs[i];
    if (im) { const cr = coverCrop(im.naturalWidth || 300, im.naturalHeight || 400, tileW, imgH); ctx.drawImage(im, cr.sx, cr.sy, cr.sw, cr.sh, tx, ty, tileW, imgH); }
    ctx.restore();
    const cx = tx + tileW / 2;
    let y = ty + imgH + 44;
    ctx.fillStyle = "#ffffff"; ctx.font = `800 32px ${FONT}`;
    ctx.fillText(fit(ctx, x.name || `Character ${i + 1}`, tileW - 10), cx, y);
    if (x.from) { y += 32; ctx.fillStyle = "#7fe3ff"; ctx.font = `600 22px ${FONT}`; ctx.fillText(fit(ctx, x.from, tileW - 10), cx, y); }
    if (x.line) {
      ctx.fillStyle = "#c9cce0"; ctx.font = `italic 500 23px ${FONT}`;
      wrapLines(ctx, x.line, tileW - 20).slice(0, 2).forEach((l) => { y += 30; ctx.fillText(l, cx, y); });
    }
  });
  if (card.common.trim()) {
    ctx.fillStyle = "#f5f6fb"; ctx.font = `700 28px ${FONT}`;
    ctx.fillText(fit(ctx, `What they have in common: ${card.common.trim()}`, W - pad * 2), W / 2, H - 92);
  }
  ctx.fillStyle = "#6f748a"; ctx.font = `500 22px ${FONT}`;
  ctx.fillText("randomtopics.app/4-characters-i-like", W / 2, H - 40);
  return new Promise((r) => { try { c.toBlob((b) => r(b), "image/png"); } catch { r(null); } });
}

function Tile({ cell, index, selected, onClick }: { cell: Cell; index: number; selected?: boolean; onClick?: () => void }) {
  const inner = (
    <>
      <div className="aspect-[3/4] w-full overflow-hidden rounded-xl bg-white/[0.04]">
        {/* eslint-disable-next-line @next/next/no-img-element -- searched/uploaded picture or generated card */}
        <img src={cell.image || svgUrl(portraitSvg(cell, index))} alt={cell.name || `Character ${index + 1}`} crossOrigin={cell.image && !cell.image.startsWith("blob:") ? "anonymous" : undefined} className="h-full w-full object-cover" draggable={false} />
      </div>
      <span className="mt-1 block truncate text-sm font-bold text-[var(--text-primary)]">{cell.name || <span className="text-[var(--text-muted)] font-normal">Tap to add</span>}</span>
      {cell.from && <span className="block truncate text-[11px] text-[var(--neon-cyan)]">{cell.from}</span>}
      {cell.line && <span className="block text-[11px] italic leading-snug text-[var(--text-secondary)] line-clamp-2">{cell.line}</span>}
    </>
  );
  if (!onClick) return <div className="min-w-0 text-center">{inner}</div>;
  return (
    <button type="button" onClick={onClick} aria-pressed={selected} aria-label={`Character ${index + 1}${cell.name ? `: ${cell.name}` : " (empty)"} — edit`}
      className={`min-w-0 rounded-2xl border-2 p-1 text-center transition-colors ${selected ? "border-[var(--neon-cyan)]" : "border-transparent hover:border-white/20"}`}>
      {inner}
    </button>
  );
}

export default function FourCharactersMaker() {
  const [card, setCard] = useState<Card>(() => cloneCard(EXAMPLES[0].card));
  const [received, setReceived] = useState<Card | null>(null);
  const [sel, setSel] = useState(0);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GridItem[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "empty">("idle");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const seq = useRef(0);

  const flash = (t: string) => { setNote(t); window.setTimeout(() => setNote((x) => (x === t ? "" : x)), 2600); };

  // Open a shared card (#c=…) and reload searched pictures by id.
  useEffect(() => {
    const read = async () => {
      const c = cardFromHash(window.location.hash);
      if (!c) return;
      setReceived(c);
      track("tool_use", { tool_type: TOOL, locale: "en", action: "open_shared" });
      const ids = c.cells.map((x) => x.id ?? "");
      if (!ids.some(Boolean)) return;
      try {
        const found = await lookupItems("characters", ids);
        setReceived({ ...c, cells: c.cells.map((x) => (x.id && found.get(x.id) ? { ...x, image: found.get(x.id)!.image } : x)) });
      } catch { /* keep generated cards */ }
    };
    void read();
    const onHash = () => void read();
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    const term = query.trim();
    const s = ++seq.current;
    const timer = window.setTimeout(async () => {
      if (term.length < 2) { setResults([]); setStatus("idle"); return; }
      setStatus("loading");
      try {
        const found = await searchItems("characters", term);
        if (s !== seq.current) return;
        setResults(found.slice(0, 12));
        setStatus(found.length ? "idle" : "empty");
      } catch { if (s === seq.current) { setResults([]); setStatus("error"); } }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [query]);

  const setCell = (i: number, patch: Partial<Cell>) => setCard((c) => ({ ...c, cells: c.cells.map((x, j) => (j === i ? { ...x, ...patch } : x)) }));
  const nextEmpty = (c: Card, from: number) => { for (let k = 1; k <= CELL_COUNT; k++) { const j = (from + k) % CELL_COUNT; if (!c.cells[j].name && !c.cells[j].image) return j; } return from; };

  const pick = (item: GridItem) => {
    setCell(sel, { id: item.id, name: item.title.slice(0, LIMITS.name), from: (item.subtitle ?? "").slice(0, LIMITS.from), image: item.image });
    setQuery(""); setResults([]);
    track("generator_pick", { tool_type: TOOL, slot: sel + 1, locale: "en" });
    setSel((s) => nextEmpty({ ...card, cells: card.cells.map((x, j) => (j === s ? { ...x, name: item.title } : x)) }, s));
  };

  const upload = (files: FileList | null) => {
    const f = files?.[0];
    if (!f || !f.type.startsWith("image/")) return;
    setCell(sel, { image: URL.createObjectURL(f), id: undefined, name: card.cells[sel].name || f.name.replace(/\.[^.]+$/, "").slice(0, LIMITS.name) });
    if (fileRef.current) fileRef.current.value = "";
  };

  const applyExample = (id: string) => {
    const ex = EXAMPLES.find((e) => e.id === id);
    if (!ex) return;
    setCard(cloneCard(ex.card)); setSel(0);
    track("filter_select", { tool_type: TOOL, locale: "en", filter: "example", value: id });
  };
  const startBlank = () => { setCard(blankCard()); setSel(0); track("filter_select", { tool_type: TOOL, locale: "en", filter: "example", value: "blank" }); };

  const shareUrl = (c: Card) => `${window.location.origin}${PATH}#c=${encodeCard(c)}`;
  const copyLink = async () => {
    if (!card.cells.some((x) => x.name)) { flash("Add at least one character name first."); return; }
    window.history.replaceState(null, "", `${PATH}#c=${encodeCard(card)}`);
    const uploaded = card.cells.some((x) => x.image?.startsWith("blob:"));
    if (await copyText(shareUrl(card))) {
      flash(uploaded ? "Link copied ✓ — uploaded pictures stay on your device; friends see a generated card instead." : "Link copied ✓ — send it to a friend");
      track("copy_result", { tool_type: TOOL, locale: "en", result_count: filledCount(card) });
    } else flash("Could not copy — the link is now in your address bar.");
  };

  const exportPng = async (c: Card, mode: "download" | "share") => {
    if (!filledCount(c)) { flash("Add at least one character first."); return; }
    setBusy(true);
    const blob = await renderCard(c);
    setBusy(false);
    if (!blob) { flash("Could not create the image — try removing a picture that did not load."); return; }
    const name = `${(c.title.trim() || DEFAULT_TITLE).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "4-characters-i-like"}.png`;
    const file = new File([blob], name, { type: "image/png" });
    track("generate_success", { tool_type: TOOL, generator_mode: mode, result_count: filledCount(c), locale: "en" });
    if (mode === "share" && navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ files: [file], title: c.title || DEFAULT_TITLE }); return; } catch { /* cancelled → download */ }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const field = "w-full min-w-0 rounded-lg border border-white/15 bg-black/30 px-2.5 py-1.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--neon-cyan)]";
  const btn = "rounded-lg px-3 py-2 text-sm font-bold transition-colors disabled:opacity-60";
  const primary = `${btn} bg-[var(--neon-cyan)] text-[#0a0a12] hover:brightness-110`;
  const ghost = `${btn} border border-white/20 text-[var(--text-primary)] hover:border-[var(--neon-cyan)]/60`;
  const chip = "shrink-0 rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/60";

  if (received) {
    const c = received;
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-6">
        <div className="glass-card p-4 sm:p-7 space-y-4">
          <div className="text-center">
            <h2 className="text-xl font-extrabold text-[var(--text-primary)]">{c.title || DEFAULT_TITLE}</h2>
            {c.by && <p className="text-sm text-[var(--text-muted)]">by {c.by}</p>}
          </div>
          <div className="mx-auto grid max-w-md grid-cols-2 gap-3">{c.cells.map((x, i) => <Tile key={i} cell={x} index={i} />)}</div>
          {c.common && <p className="text-center text-sm text-[var(--text-primary)]"><strong>What they have in common:</strong> {c.common}</p>}
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" className={primary} onClick={() => { window.history.replaceState(null, "", PATH); setReceived(null); startBlank(); }}>Make your own</button>
            <button type="button" className={ghost} disabled={busy} onClick={() => exportPng(c, "download")}>Save as PNG</button>
            <button type="button" className={ghost} onClick={() => { setCard(cloneCard(c)); window.history.replaceState(null, "", PATH); setReceived(null); }}>Edit a copy</button>
          </div>
          {note && <p className="text-center text-xs text-[var(--neon-cyan)]" role="status">{note}</p>}
        </div>
      </section>
    );
  }

  const cur = card.cells[sel];
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-6">
      <div className="glass-card p-3 sm:p-7 space-y-3">
        <input aria-label="Card title" className={`${field} text-center font-bold`} value={card.title} maxLength={LIMITS.title} onChange={(e) => setCard((c) => ({ ...c, title: e.target.value }))} />
        <div className="mx-auto grid max-w-[19rem] sm:max-w-md grid-cols-2 gap-1.5 sm:gap-3" data-four-grid>
          {card.cells.map((x, i) => <Tile key={i} cell={x} index={i} selected={sel === i} onClick={() => setSel(i)} />)}
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button type="button" className={primary} onClick={copyLink}>🔗 Copy share link</button>
          <button type="button" className={ghost} disabled={busy} onClick={() => exportPng(card, "download")}>{busy ? "Making…" : "Download PNG"}</button>
          <button type="button" className={`${ghost} sm:hidden`} disabled={busy} onClick={() => exportPng(card, "share")}>Share</button>
        </div>
        {note && <p className="text-center text-xs text-[var(--neon-cyan)]" role="status">{note}</p>}

        <div className="rounded-xl border border-white/10 p-3 space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[var(--text-secondary)]">Editing character {sel + 1} of {CELL_COUNT}</p>
            <button type="button" className="text-xs text-[var(--text-muted)] hover:text-red-400" onClick={() => setCell(sel, emptyCell())}>Clear</button>
          </div>
          <label className="block text-xs text-[var(--text-muted)]">Search anime &amp; manga characters (optional)
            <input type="search" className={field} value={query} placeholder="e.g. Gojo, Zoro, Frieren…" autoComplete="off" onChange={(e) => setQuery(e.target.value)} />
          </label>
          <div aria-live="polite" className="min-h-4">
            {status === "loading" && <p className="text-xs text-[var(--text-muted)]">Searching…</p>}
            {status === "empty" && <p className="text-xs text-[var(--text-muted)]">No match — just type the name below.</p>}
            {status === "error" && <p className="text-xs text-[var(--text-muted)]">Search is unavailable — type the name below.</p>}
            {results.length > 0 && (
              <ul className="flex gap-2 overflow-x-auto pb-1">
                {results.map((r) => (
                  <li key={r.id} className="w-16 shrink-0">
                    <button type="button" onClick={() => pick(r)} title={[r.title, r.subtitle].filter(Boolean).join(" — ")} className="w-full text-left">
                      {/* eslint-disable-next-line @next/next/no-img-element -- AniList thumbnail */}
                      <img src={r.thumb ?? r.image} alt="" loading="lazy" crossOrigin="anonymous" className="aspect-[3/4] w-full rounded-md border border-white/10 object-cover" />
                      <span className="mt-0.5 block truncate text-[10px] text-[var(--text-primary)]">{r.title}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <label className="block text-xs text-[var(--text-muted)]">Name
              <input className={field} value={cur.name} maxLength={LIMITS.name} placeholder="Character name" onChange={(e) => setCell(sel, { name: e.target.value, id: undefined })} />
            </label>
            <label className="block text-xs text-[var(--text-muted)]">From
              <input className={field} value={cur.from} maxLength={LIMITS.from} placeholder="Show, game or book" onChange={(e) => setCell(sel, { from: e.target.value })} />
            </label>
          </div>
          <label className="block text-xs text-[var(--text-muted)]">Why you like them (one line)
            <input className={field} value={cur.line} maxLength={LIMITS.line} placeholder="e.g. Chaotic but loyal" onChange={(e) => setCell(sel, { line: e.target.value })} />
          </label>
          <div>
            <p className="mb-1 text-xs text-[var(--text-muted)]">No picture? Pick an icon for a generated card</p>
            <div className="flex gap-1 overflow-x-auto pb-1 sm:flex-wrap">
              {EMOJIS.map((e) => (
                <button key={e} type="button" aria-pressed={cur.emoji === e} onClick={() => setCell(sel, { emoji: cur.emoji === e ? "" : e })}
                  className={`h-8 w-8 shrink-0 rounded-lg border text-base ${cur.emoji === e ? "border-[var(--neon-cyan)] bg-white/10" : "border-white/10"}`}>{e}</button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <label className={`${ghost} cursor-pointer`}>📷 Upload picture
              <input ref={fileRef} type="file" accept="image/*" className="sr-only" onChange={(e) => upload(e.target.files)} />
            </label>
            {cur.image && <button type="button" className={ghost} onClick={() => setCell(sel, { image: undefined, id: undefined })}>Use generated card</button>}
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">Uploaded pictures stay in your browser. Search results load from AniList; we don&apos;t store them.</p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2">
          <label className="block text-xs text-[var(--text-muted)]">What they have in common (optional)
            <input className={field} value={card.common} maxLength={LIMITS.common} placeholder="e.g. They all hide how much they care" onChange={(e) => setCard((c) => ({ ...c, common: e.target.value }))} />
          </label>
          <label className="block text-xs text-[var(--text-muted)]">Your name (optional)
            <input className={field} value={card.by} maxLength={LIMITS.by} placeholder="@yourname" onChange={(e) => setCard((c) => ({ ...c, by: e.target.value }))} />
          </label>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-[var(--text-secondary)]">Start from an example</p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:flex-wrap">
            {EXAMPLES.map((e) => <button key={e.id} type="button" className={chip} onClick={() => applyExample(e.id)}>{e.label}</button>)}
            <button type="button" className={chip} onClick={startBlank}>Start blank</button>
          </div>
        </div>
      </div>
    </section>
  );
}
