"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import {
  KINDS, SLOT_COUNT, coverCrop, decodeShare, encodeShare, gridLayout, lookupItems, placeItem, searchItems, swapSlots,
  type GridItem, type GridKind, type Slots,
} from "@/lib/generators/nineGrid";

const empty = (): Slots => Array.from({ length: SLOT_COUNT }, () => null);

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function fitText(ctx: CanvasRenderingContext2D, text: string, max: number): string {
  if (ctx.measureText(text).width <= max) return text;
  let t = text;
  while (t.length > 1 && ctx.measureText(`${t}…`).width > max) t = t.slice(0, -1);
  return `${t.trimEnd()}…`;
}

async function renderGrid(slots: Slots, kind: GridKind, title: string, byline: string, captions: boolean, light: boolean, story: boolean): Promise<Blob | null> {
  const cfg = KINDS[kind];
  const L = gridLayout(cfg.aspect, captions, Boolean(byline.trim()), story ? 1920 : 1080);
  const titleY = L.header - (byline.trim() ? 64 : 34);
  const canvas = document.createElement("canvas");
  canvas.width = L.width;
  canvas.height = L.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const ink = light ? "#1d2130" : "#f5f6fb", muted = light ? "#5b6175" : "#a3a8bd";
  ctx.fillStyle = light ? "#f6f3ec" : "#11131c";
  ctx.fillRect(0, 0, L.width, L.height);
  const font = (weight: number, size: number) => `${weight} ${size}px "Helvetica Neue", Arial, "Hiragino Sans", "Noto Sans JP", sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = ink;
  ctx.font = font(800, 60);
  ctx.fillText(fitText(ctx, title.trim() || cfg.defaultTitle, L.width - L.pad * 2), L.width / 2, titleY);
  if (byline.trim()) {
    ctx.fillStyle = muted;
    ctx.font = font(500, 28);
    ctx.fillText(fitText(ctx, byline.trim(), L.width - L.pad * 2), L.width / 2, titleY + 40);
  }
  const images = await Promise.all(slots.map((s) => (s ? loadImage(s.image) : Promise.resolve(null))));
  slots.forEach((slot, i) => {
    const { x, y } = L.tiles[i];
    ctx.fillStyle = light ? "#e6e1d6" : "#1d2130";
    ctx.fillRect(x, y, L.tileW, L.tileH);
    const img = images[i];
    if (img) {
      const c = coverCrop(img.naturalWidth, img.naturalHeight, L.tileW, L.tileH);
      ctx.drawImage(img, c.sx, c.sy, c.sw, c.sh, x, y, L.tileW, L.tileH);
    }
    if (captions && slot) {
      ctx.fillStyle = ink;
      ctx.font = font(700, 22);
      ctx.fillText(fitText(ctx, slot.title, L.tileW - 8), x + L.tileW / 2, y + L.tileH + 26);
      if (slot.subtitle) {
        ctx.fillStyle = muted;
        ctx.font = font(500, 18);
        ctx.fillText(fitText(ctx, slot.subtitle, L.tileW - 8), x + L.tileW / 2, y + L.tileH + 48);
      }
    }
  });
  return new Promise((resolve) => {
    try { canvas.toBlob((b) => resolve(b), "image/png"); } catch { resolve(null); }
  });
}

export default function NineGridMaker({ kind }: { kind: GridKind }) {
  const cfg = KINDS[kind];
  const [slots, setSlots] = useState<Slots>(empty);
  const [selected, setSelected] = useState<number | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GridItem[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "empty">("idle");
  const [title, setTitle] = useState(cfg.defaultTitle);
  const [byline, setByline] = useState("");
  const [captions, setCaptions] = useState(kind !== "any");
  const [light, setLight] = useState(false);
  const [story, setStory] = useState(false);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const dragFrom = useRef<number | null>(null);
  const searchSeq = useRef(0);

  const flash = (text: string) => { setNote(text); window.setTimeout(() => setNote((n) => (n === text ? "" : n)), 2200); };

  const writeUrl = useCallback((next: Slots, nextTitle: string) => {
    if (kind === "any") return;
    const qs = encodeShare(next, nextTitle, cfg.defaultTitle);
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  }, [cfg.defaultTitle, kind]);

  // Restore a shared grid (?i=id.id._.id&t=title) after hydration.
  useEffect(() => {
    const restore = async () => {
      const { ids, title: sharedTitle } = decodeShare(window.location.search);
      if (sharedTitle) setTitle(sharedTitle);
      if (!ids.some(Boolean)) return;
      try {
        const found = await lookupItems(kind, ids);
        setSlots(ids.map((id) => (id ? found.get(id) ?? null : null)));
      } catch { /* keep an empty grid */ }
    };
    void Promise.resolve().then(restore);
  }, [kind]);

  // Debounced search.
  useEffect(() => {
    if (kind === "any") return;
    const term = query.trim();
    const seq = ++searchSeq.current;
    const timer = window.setTimeout(async () => {
      if (term.length < 2) { setResults([]); setStatus("idle"); return; }
      setStatus("loading");
      try {
        const found = await searchItems(kind, term);
        if (seq !== searchSeq.current) return;
        setResults(found);
        setStatus(found.length ? "idle" : "empty");
      } catch {
        if (seq === searchSeq.current) { setResults([]); setStatus("error"); }
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [kind, query]);

  const commit = (next: Slots) => { setSlots(next); writeUrl(next, title); };

  const add = (item: GridItem) => {
    if (slots.some((s) => s?.id && s.id === item.id)) { flash(`That ${cfg.noun} is already in your grid.`); return; }
    const placed = placeItem(slots, item, selected);
    if (!placed) { flash("Your grid is full — remove one (×) or pick a square to replace."); return; }
    commit(placed.slots);
    setSelected(null);
    setAdded(`Added “${item.title}” to square ${placed.index + 1} · ${placed.slots.filter(Boolean).length}/9`);
    track("generator_pick", { tool_type: cfg.toolType, slot: placed.index + 1, locale: "en" });
  };

  const tapSlot = (i: number) => {
    if (selected === null) { setSelected(i); return; }
    if (selected === i) { setSelected(null); return; }
    commit(swapSlots(slots, selected, i));
    setSelected(null);
  };

  const remove = (i: number) => {
    const next = slots.slice();
    next[i] = null;
    commit(next);
    setSelected(null);
  };

  const upload = (files: FileList | null) => {
    if (!files?.length) return;
    let next = slots;
    let target = selected;
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      const placed = placeItem(next, { title: file.name.replace(/\.[^.]+$/, "").slice(0, 40), image: URL.createObjectURL(file) }, target);
      if (!placed) { flash("Your grid is full — remove one first."); break; }
      next = placed.slots;
      target = null;
    }
    commit(next);
    setSelected(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const exportPng = async (mode: "download" | "share") => {
    if (!slots.some(Boolean)) { flash(`Add at least one ${cfg.noun} first.`); return; }
    setBusy(true);
    const blob = await renderGrid(slots, kind, title, byline, captions, light, story);
    setBusy(false);
    if (!blob) { flash("Could not create the image — try removing a cover that did not load."); return; }
    const name = `${(title.trim() || cfg.defaultTitle).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "my-9"}.png`;
    const file = new File([blob], name, { type: "image/png" });
    track("generate_success", { tool_type: cfg.toolType, generator_mode: story ? `${mode}_story` : mode, result_count: slots.filter(Boolean).length, locale: "en" });
    if (mode === "share" && navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ files: [file], title: title.trim() || cfg.defaultTitle }); return; } catch { /* cancelled: fall through to download */ }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const copyLink = async () => {
    if (await copyText(window.location.href)) {
      flash(slots.some((s) => s && !s.id) ? "Link copied — uploaded pictures are not included in links." : "Link copied ✓");
      track("copy_result", { tool_type: cfg.toolType, locale: "en" });
    }
  };

  const filled = slots.filter(Boolean).length;
  const ghost = "px-4 py-2 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors disabled:opacity-50";
  const field = "w-full bg-[var(--bg-secondary)] border border-white/10 rounded-xl px-3 py-2 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]";
  const aspectClass = cfg.aspect === 1 ? "aspect-square" : "aspect-[3/4]";

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-5 sm:p-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <label className="text-xs uppercase tracking-widest text-[var(--text-muted)] col-span-2 sm:col-span-1">Title
              <input value={title} maxLength={60} onChange={(e) => { setTitle(e.target.value); writeUrl(slots, e.target.value); }} className={`${field} mt-1 normal-case tracking-normal text-sm`} />
            </label>
            <label className="text-xs uppercase tracking-widest text-[var(--text-muted)] col-span-2 sm:col-span-1">Your name (optional)
              <input value={byline} maxLength={40} placeholder="@yourname" onChange={(e) => setByline(e.target.value)} className={`${field} mt-1 normal-case tracking-normal text-sm`} />
            </label>
          </div>

          <ul className="grid grid-cols-3 gap-2 max-w-[20rem] sm:max-w-none mx-auto" aria-label={`Your ${cfg.defaultTitle} grid`} data-nine-grid>
            {slots.map((slot, i) => (
              <li key={i} className="relative">
                <button type="button" onClick={() => tapSlot(i)} aria-pressed={selected === i}
                  aria-label={slot ? `Square ${i + 1}: ${slot.title}. Tap, then tap another square to swap.` : `Square ${i + 1}: empty. Tap to choose where the next ${cfg.noun} goes.`}
                  draggable={Boolean(slot)}
                  onDragStart={() => { dragFrom.current = i; }}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => { e.preventDefault(); if (dragFrom.current !== null && dragFrom.current !== i) commit(swapSlots(slots, dragFrom.current, i)); dragFrom.current = null; }}
                  className={`${aspectClass} w-full rounded-lg overflow-hidden border-2 flex items-center justify-center text-2xl text-[var(--text-muted)] bg-white/[0.04] transition-colors ${selected === i ? "border-[var(--neon-cyan)]" : "border-transparent hover:border-white/20"}`}>
                  {slot ? (
                    // eslint-disable-next-line @next/next/no-img-element -- remote cover, drawn into the PNG with CORS
                    <img src={slot.image} alt={slot.title} crossOrigin="anonymous" className="w-full h-full object-cover" draggable={false} />
                  ) : <span aria-hidden="true">{i + 1}</span>}
                </button>
                {slot && (
                  <button type="button" onClick={() => remove(i)} aria-label={`Remove ${slot.title}`}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white text-sm leading-6">×</button>
                )}
              </li>
            ))}
          </ul>
          <p className="text-xs text-[var(--text-muted)] mt-2">{filled}/9 · tap a square, then another to swap (or drag) · × removes · picking a square first puts the next {cfg.noun} there.</p>

          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-[var(--text-secondary)]">
            <label className="flex items-center gap-2"><input type="checkbox" checked={captions} onChange={(e) => setCaptions(e.target.checked)} /> Show titles</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={light} onChange={(e) => setLight(e.target.checked)} /> Light background</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={story} onChange={(e) => setStory(e.target.checked)} /> Story size (1080×1920)</label>
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-5">
            <button type="button" className="btn-generate" disabled={busy} onClick={() => exportPng("download")}><span aria-hidden="true">⬇️</span> {busy ? "Making image…" : "Download PNG"}</button>
            <button type="button" className={ghost} disabled={busy} onClick={() => exportPng("share")}>Share image</button>
            {kind !== "any" && <button type="button" className={ghost} onClick={copyLink}>Copy link</button>}
            <button type="button" className={ghost} onClick={() => { commit(empty()); setSelected(null); }}>Clear</button>
          </div>
          <p className="text-sm text-[var(--neon-cyan)] mt-3 min-h-5" aria-live="polite">{note}</p>
        </div>

        <div>
          {kind !== "any" && (
            <>
              <label htmlFor="nine-grid-search" className="text-xs uppercase tracking-widest text-[var(--text-muted)]">Search</label>
              <input id="nine-grid-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder={cfg.placeholder} autoComplete="off" className={`${field} mt-1`} />
              <p className="text-xs text-[var(--neon-cyan)] mt-2 min-h-4" aria-live="polite">{added}</p>
              <div className="mt-2 min-h-24" aria-live="polite">
                {status === "loading" && <p className="text-sm text-[var(--text-muted)]">Searching…</p>}
                {status === "empty" && <p className="text-sm text-[var(--text-muted)]">No covers found — try another spelling, or upload your own picture below.</p>}
                {status === "error" && <p className="text-sm text-[var(--text-muted)]">Search is unavailable right now — you can still upload your own pictures below.</p>}
                {status === "idle" && !results.length && <p className="text-sm text-[var(--text-muted)]">Type at least 2 letters, then tap a cover to add it to the next empty square.</p>}
                {results.length > 0 && (
                  <ul className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-[30rem] overflow-y-auto pr-1">
                    {results.map((item) => {
                      const used = slots.some((s) => s?.id === item.id);
                      return (
                        <li key={item.id}>
                          <button type="button" onClick={() => add(item)} disabled={used} title={[item.title, item.subtitle].filter(Boolean).join(" — ")}
                            className="w-full text-left disabled:opacity-40 group">
                            {/* eslint-disable-next-line @next/next/no-img-element -- remote cover thumbnail */}
                            <img src={item.thumb ?? item.image} alt="" crossOrigin="anonymous" loading="lazy" className={`${aspectClass} w-full object-cover rounded-md border border-white/10 group-hover:border-[var(--neon-cyan)]`} />
                            <span className="block text-xs text-[var(--text-primary)] mt-1 line-clamp-2">{item.title}</span>
                            {item.subtitle && <span className="block text-[11px] text-[var(--text-muted)] truncate">{item.subtitle}</span>}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </>
          )}
          <div className={kind !== "any" ? "mt-5 pt-5 border-t border-white/10" : ""}>
            <p className="text-sm text-[var(--text-secondary)] mb-2">{kind === "any" ? "Add up to 9 pictures from your device — they stay in your browser." : `Can't find one? Upload your own picture — it stays in your browser.`}</p>
            <input ref={fileRef} type="file" accept="image/*" multiple onChange={(e) => upload(e.target.files)} className="text-sm text-[var(--text-secondary)] file:mr-3 file:px-4 file:py-2 file:rounded-xl file:border-0 file:bg-white/10 file:text-[var(--text-primary)]" />
          </div>
          {cfg.source && (
            <p className="text-[11px] text-[var(--text-muted)] mt-4">Covers load from <a href={cfg.source.href} className="underline" rel="noopener nofollow" target="_blank">{cfg.source.label}</a> straight into your browser; we don&apos;t store them. Artwork belongs to its owners.</p>
          )}
        </div>
      </div>
    </section>
  );
}
