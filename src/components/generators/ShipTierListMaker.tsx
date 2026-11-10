"use client";

import { useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";

const TOOL = "ship_tier_list";
const PATH = "/ship-tier-list";
const FONT = `"Helvetica Neue", Arial, "Hiragino Sans", "Noto Sans JP", sans-serif`;

const TIERS = [
  { id: "S", color: "#ff7f7f" },
  { id: "A", color: "#ffbf7f" },
  { id: "B", color: "#ffdf7f" },
  { id: "C", color: "#ffff7f" },
  { id: "D", color: "#bfff7f" },
  { id: "F", color: "#7fbfff" },
] as const;
const POOL = "pool";
type Row = (typeof TIERS)[number]["id"] | typeof POOL;

interface Item { id: string; text: string; img?: string }
interface State { title: string; rows: Record<Row, Item[]> }

const LIMITS = { title: 60, text: 40, items: 60 } as const;
const emptyRows = (): Record<Row, Item[]> => ({ S: [], A: [], B: [], C: [], D: [], F: [], pool: [] });
let uid = 0;
const mk = (text: string, img?: string): Item => ({ id: `i${Date.now().toString(36)}${(uid++).toString(36)}`, text: text.slice(0, LIMITS.text), img });

const EXAMPLES: { id: string; label: string; title: string; mode: "ships" | "characters"; items: string[] }[] = [
  {
    id: "dynamics", label: "Ship dynamics", title: "Ship dynamics tier list", mode: "ships",
    items: ["Grumpy × Sunshine", "Enemies to lovers", "Tall × Short", "Rivals to lovers", "Golden retriever × Black cat", "Mutual pining", "Bodyguard × Prince", "Childhood friends", "Fake dating", "Chaos × Calm", "Falls first × Falls harder", "Bickering old couple"],
  },
  {
    id: "tropes", label: "Romance tropes", title: "Romance tropes tier list", mode: "ships",
    items: ["Only one bed", "Forced proximity", "Second chance", "Slow burn", "Love triangle", "Arranged marriage", "Secret identity", "Amnesia", "Hurt / comfort", "Soulmates", "Office romance", "Time travel"],
  },
  {
    id: "moe", label: "Moe archetypes", title: "Moe archetype tier list", mode: "characters",
    items: ["Tsundere", "Kuudere", "Dandere", "Yandere", "Deredere", "Genki girl", "Onee-san", "Imouto", "Ojou-sama", "Meganekko", "Chuunibyou", "Himedere"],
  },
];

function toB64Url(s: string): string {
  let b = "";
  new TextEncoder().encode(s).forEach((x) => { b += String.fromCharCode(x); });
  return btoa(b).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
function fromB64Url(s: string): string {
  const b = atob(s.replace(/-/g, "+").replace(/_/g, "/"));
  return new TextDecoder().decode(Uint8Array.from(b, (c) => c.charCodeAt(0)));
}

const ROW_KEYS: Row[] = [...TIERS.map((t) => t.id), POOL];

function encode(s: State): string {
  return toB64Url(JSON.stringify([1, s.title, ROW_KEYS.map((k) => s.rows[k].map((x) => x.text))]));
}
function decode(code: string): State | null {
  try {
    if (!code || code.length > 6000) return null;
    const d = JSON.parse(fromB64Url(code));
    if (!Array.isArray(d) || d[0] !== 1 || !Array.isArray(d[2])) return null;
    const rows = emptyRows();
    let n = 0;
    ROW_KEYS.forEach((k, i) => {
      const arr = Array.isArray(d[2][i]) ? d[2][i] : [];
      for (const t of arr) if (typeof t === "string" && t.trim() && n++ < LIMITS.items) rows[k].push(mk(t));
    });
    return { title: typeof d[1] === "string" ? d[1].slice(0, LIMITS.title) : "", rows };
  } catch {
    return null;
  }
}

const fromExample = (id: string): State => {
  const ex = EXAMPLES.find((e) => e.id === id) ?? EXAMPLES[0];
  const rows = emptyRows();
  rows.pool = ex.items.map((t) => mk(t));
  return { title: ex.title, rows };
};

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, max: number, maxLines: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const out: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (ctx.measureText(next).width > max && cur) { out.push(cur); cur = w; } else cur = next;
  }
  if (cur) out.push(cur);
  if (out.length > maxLines) { out.length = maxLines; out[maxLines - 1] = `${out[maxLines - 1].replace(/.$/, "")}…`; }
  return out.map((l) => {
    let t = l;
    while (t.length > 1 && ctx.measureText(t).width > max) t = t.slice(0, -2) + "…";
    return t;
  });
}

async function render(s: State): Promise<Blob | null> {
  const W = 1200, label = 150, pad = 24, tile = 150, gap = 10;
  const perRow = Math.floor((W - label - pad * 2 - gap) / (tile + gap));
  const header = 110, foot = 50;
  const heights = TIERS.map((t) => Math.max(1, Math.ceil(s.rows[t.id].length / perRow)) * (tile + gap) + gap);
  const H = header + heights.reduce((a, b) => a + b, 0) + foot;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  ctx.fillStyle = "#1a1a22"; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#ffffff"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.font = `800 52px ${FONT}`;
  ctx.fillText(s.title || "Ship tier list", W / 2, header / 2 + 4, W - pad * 2);
  const imgs = new Map<string, HTMLImageElement | null>();
  await Promise.all(ROW_KEYS.flatMap((k) => s.rows[k]).filter((x) => x.img).map(async (x) => imgs.set(x.id, await loadImage(x.img!))));
  let y = header;
  TIERS.forEach((t, ti) => {
    const h = heights[ti];
    ctx.fillStyle = "#2a2a35"; ctx.fillRect(pad, y, W - pad * 2, h - 4);
    ctx.fillStyle = t.color; ctx.fillRect(pad, y, label - pad, h - 4);
    ctx.fillStyle = "#1a1a22"; ctx.font = `900 64px ${FONT}`; ctx.fillText(t.id, pad + (label - pad) / 2, y + (h - 4) / 2 + 2);
    s.rows[t.id].forEach((it, k) => {
      const col = k % perRow, row = Math.floor(k / perRow);
      const x = label + gap + col * (tile + gap), ty = y + gap + row * (tile + gap);
      const img = imgs.get(it.id);
      ctx.save();
      ctx.beginPath(); ctx.roundRect(x, ty, tile, tile, 12); ctx.clip();
      if (img) {
        const sc = Math.max(tile / img.naturalWidth, tile / img.naturalHeight);
        ctx.drawImage(img, x + (tile - img.naturalWidth * sc) / 2, ty + (tile - img.naturalHeight * sc) / 2, img.naturalWidth * sc, img.naturalHeight * sc);
        if (it.text) {
          ctx.fillStyle = "rgba(0,0,0,0.6)"; ctx.fillRect(x, ty + tile - 36, tile, 36);
          ctx.fillStyle = "#ffffff"; ctx.font = `700 18px ${FONT}`;
          ctx.fillText(wrapText(ctx, it.text, tile - 12, 1)[0] ?? "", x + tile / 2, ty + tile - 18);
        }
      } else {
        ctx.fillStyle = "#f4f1ea"; ctx.fillRect(x, ty, tile, tile);
        ctx.fillStyle = "#1b1b1f"; ctx.font = `700 22px ${FONT}`;
        const lines = wrapText(ctx, it.text, tile - 16, 4);
        lines.forEach((l, li) => ctx.fillText(l, x + tile / 2, ty + tile / 2 + (li - (lines.length - 1) / 2) * 26));
      }
      ctx.restore();
    });
    y += h;
  });
  ctx.fillStyle = "#8a8a99"; ctx.font = `600 22px ${FONT}`;
  ctx.fillText("randomtopics.app/ship-tier-list", W / 2, H - foot / 2);
  return new Promise((r) => c.toBlob((b) => r(b), "image/png"));
}

export default function ShipTierListMaker() {
  const [s, setS] = useState<State>(() => fromExample("dynamics"));
  const [received, setReceived] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [overRow, setOverRow] = useState<Row | null>(null);
  const [text, setText] = useState("");
  const [mode, setMode] = useState<"ships" | "characters">("ships");
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const flash = (t: string) => { setNote(t); window.setTimeout(() => setNote((x) => (x === t ? "" : x)), 2800); };
  const count = ROW_KEYS.reduce((n, k) => n + s.rows[k].length, 0);
  const ranked = TIERS.reduce((n, t) => n + s.rows[t.id].length, 0);

  useEffect(() => {
    const read = () => {
      const v = new URLSearchParams(window.location.hash.replace(/^#/, "")).get("t");
      const d = v ? decode(v) : null;
      if (!d) return;
      setS(d); setReceived(true);
      track("tool_use", { tool_type: TOOL, locale: "en", action: "open_shared" });
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const move = (id: string, to: Row, before?: string) => {
    setS((st) => {
      let item: Item | undefined;
      const rows = emptyRows();
      for (const k of ROW_KEYS) rows[k] = st.rows[k].filter((x) => (x.id === id ? ((item = x), false) : true));
      if (!item) return st;
      const idx = before ? rows[to].findIndex((x) => x.id === before) : -1;
      if (idx >= 0) rows[to].splice(idx, 0, item); else rows[to].push(item);
      return { ...st, rows };
    });
    setPicked(null);
    if (to !== POOL) track("generator_pick", { tool_type: TOOL, slot: to, locale: "en" });
  };
  const remove = (id: string) => { setS((st) => { const rows = emptyRows(); for (const k of ROW_KEYS) rows[k] = st.rows[k].filter((x) => x.id !== id); return { ...st, rows }; }); setPicked(null); };

  const add = (t: string, img?: string) => {
    const v = t.trim();
    if (!v && !img) return;
    if (count >= LIMITS.items) { flash(`Up to ${LIMITS.items} items.`); return; }
    setS((st) => ({ ...st, rows: { ...st.rows, pool: [...st.rows.pool, mk(v, img)] } }));
  };
  const addTyped = () => {
    if (mode === "ships") {
      if (!a.trim() || !b.trim()) { flash("Type both names."); return; }
      add(`${a.trim()} × ${b.trim()}`); setA(""); setB("");
    } else {
      const parts = text.split(/[\n,]/).map((x) => x.trim()).filter(Boolean);
      parts.slice(0, LIMITS.items - count).forEach((p) => add(p));
      setText("");
    }
  };
  const upload = (files: FileList | null) => {
    Array.from(files ?? []).filter((f) => f.type.startsWith("image/")).slice(0, LIMITS.items - count).forEach((f) => add(f.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "), URL.createObjectURL(f)));
    if (fileRef.current) fileRef.current.value = "";
  };

  const loadExample = (id: string) => {
    const ex = EXAMPLES.find((e) => e.id === id);
    setS(fromExample(id)); setPicked(null);
    if (ex) setMode(ex.mode);
    track("filter_select", { tool_type: TOOL, locale: "en", filter: "example", value: id });
  };
  const reset = () => setS((st) => { const rows = emptyRows(); rows.pool = ROW_KEYS.flatMap((k) => st.rows[k]); return { ...st, rows }; });
  const clearAll = () => { setS({ title: s.title, rows: emptyRows() }); setPicked(null); };

  const copyLink = async () => {
    if (!count) { flash("Add something to rank first."); return; }
    const code = encode(s);
    window.history.replaceState(null, "", `${PATH}#t=${code}`);
    const uploaded = ROW_KEYS.some((k) => s.rows[k].some((x) => x.img));
    if (await copyText(`${window.location.origin}${PATH}#t=${code}`)) {
      flash(uploaded ? "Link copied ✓ — pictures stay on your device; friends see the names." : "Link copied ✓");
      track("copy_result", { tool_type: TOOL, locale: "en", result_count: ranked });
    } else flash("Could not copy — the link is now in your address bar.");
  };
  const exportPng = async (share: boolean) => {
    if (!ranked) { flash("Drag at least one item into a tier first."); return; }
    setBusy(true);
    const blob = await render(s);
    setBusy(false);
    if (!blob) { flash("Could not create the image."); return; }
    const name = `${(s.title || "ship tier list").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "ship-tier-list"}.png`;
    const file = new File([blob], name, { type: "image/png" });
    track("generate_success", { tool_type: TOOL, generator_mode: share ? "share" : "download", result_count: ranked, locale: "en" });
    if (share && navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ files: [file], title: s.title }); return; } catch { /* fall back */ }
    }
    const url = URL.createObjectURL(blob);
    const el = document.createElement("a");
    el.href = url; el.download = name; document.body.appendChild(el); el.click(); el.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const field = "w-full min-w-0 rounded-lg border border-white/15 bg-black/30 px-2.5 py-1.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--neon-cyan)]";
  const btn = "rounded-lg px-3 py-2 text-sm font-bold transition-colors disabled:opacity-60";
  const primary = `${btn} bg-[var(--neon-cyan)] text-[#0a0a12] hover:brightness-110`;
  const ghost = `${btn} border border-white/20 text-[var(--text-primary)] hover:border-[var(--neon-cyan)]/60`;
  const chip = "shrink-0 rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/60";

  const Tile = ({ it }: { it: Item }) => (
    <div
      draggable={!received}
      onDragStart={(e) => { e.dataTransfer.setData("text/plain", it.id); e.dataTransfer.effectAllowed = "move"; }}
      onDragOver={(e) => { if (!received) e.preventDefault(); }}
      onDrop={(e) => { e.preventDefault(); e.stopPropagation(); const id = e.dataTransfer.getData("text/plain"); const row = ROW_KEYS.find((k) => s.rows[k].some((x) => x.id === it.id)); if (id && row && id !== it.id) move(id, row, it.id); setOverRow(null); }}
      onClick={() => !received && setPicked((p) => (p === it.id ? null : it.id))}
      className={`group relative flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 cursor-pointer select-none items-center justify-center overflow-hidden rounded-lg text-center text-[10px] sm:text-[11px] font-bold leading-tight ${it.img ? "bg-black" : "bg-[#f4f1ea] text-[#1b1b1f]"} ${picked === it.id ? "ring-2 ring-[var(--neon-cyan)] ring-offset-2 ring-offset-[#0a0a12]" : ""}`}
      title={it.text}
    >
      {it.img ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={it.img} alt={it.text} className="h-full w-full object-cover" draggable={false} />
          {it.text && <span className="absolute inset-x-0 bottom-0 truncate bg-black/60 px-1 text-white">{it.text}</span>}
        </>
      ) : (
        <span className="line-clamp-4 px-1 break-words">{it.text}</span>
      )}
      {!received && (
        <button type="button" aria-label={`Remove ${it.text}`} onClick={(e) => { e.stopPropagation(); remove(it.id); }} className="absolute right-0.5 top-0.5 hidden h-4 w-4 rounded-full bg-black/70 text-[10px] leading-4 text-white group-hover:block">×</button>
      )}
    </div>
  );

  const dropProps = (row: Row) => ({
    onDragOver: (e: React.DragEvent) => { if (received) return; e.preventDefault(); setOverRow(row); },
    onDragLeave: () => setOverRow((r) => (r === row ? null : r)),
    onDrop: (e: React.DragEvent) => { e.preventDefault(); const id = e.dataTransfer.getData("text/plain"); if (id) move(id, row); setOverRow(null); },
    onClick: () => { if (picked) move(picked, row); },
  });

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-6">
      <div className="glass-card p-3 sm:p-6 space-y-3">
        {received ? (
          <h2 className="text-center text-lg font-extrabold text-[var(--text-primary)]">{s.title || "Ship tier list"}</h2>
        ) : (
          <input aria-label="Tier list title" className={`${field} text-center font-bold`} value={s.title} maxLength={LIMITS.title} onChange={(e) => setS((st) => ({ ...st, title: e.target.value }))} />
        )}
        {picked && <p className="text-center text-xs text-[var(--neon-cyan)]" role="status">Now tap a tier row to place it (or tap the item again to cancel).</p>}

        <div className="overflow-hidden rounded-xl border border-white/10" data-tier-board>
          {TIERS.map((t) => (
            <div key={t.id} {...dropProps(t.id)} className={`flex min-h-[4.5rem] sm:min-h-[5.5rem] border-b border-white/10 last:border-b-0 ${overRow === t.id || (picked && !received) ? "bg-white/[0.06]" : "bg-white/[0.02]"} ${picked ? "cursor-pointer" : ""}`}>
              <div className="flex w-12 sm:w-16 shrink-0 items-center justify-center text-2xl font-black text-[#1a1a22]" style={{ background: t.color }}>{t.id}</div>
              <div className="flex flex-1 flex-wrap content-start gap-1.5 p-1.5">
                {s.rows[t.id].map((it) => <Tile key={it.id} it={it} />)}
              </div>
            </div>
          ))}
        </div>

        {!received && (
          <div {...dropProps(POOL)} className={`rounded-xl border border-dashed p-2 ${overRow === POOL ? "border-[var(--neon-cyan)]" : "border-white/15"}`}>
            <p className="mb-1.5 text-xs text-[var(--text-muted)]">{s.rows.pool.length ? "Unranked — drag into a tier, or tap an item then tap a row" : "Everything is ranked 🎉 — add more below"}</p>
            <div className="flex flex-wrap gap-1.5">{s.rows.pool.map((it) => <Tile key={it.id} it={it} />)}</div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2">
          {received ? (
            <>
              <button type="button" className={primary} onClick={() => { window.history.replaceState(null, "", PATH); setReceived(false); reset(); }}>Rank them yourself</button>
              <button type="button" className={ghost} disabled={busy} onClick={() => exportPng(false)}>Save as PNG</button>
              <button type="button" className={ghost} onClick={() => { window.history.replaceState(null, "", PATH); setReceived(false); }}>Edit a copy</button>
            </>
          ) : (
            <>
              <button type="button" className={primary} disabled={busy} onClick={() => exportPng(false)}>{busy ? "Making…" : "⬇ Download PNG"}</button>
              <button type="button" className={ghost} onClick={copyLink}>🔗 Copy link</button>
              <button type="button" className={`${ghost} sm:hidden`} disabled={busy} onClick={() => exportPng(true)}>Share</button>
            </>
          )}
        </div>
        {note && <p className="text-center text-xs text-[var(--neon-cyan)]" role="status">{note}</p>}

        {!received && (
          <div className="space-y-2 rounded-xl border border-white/10 p-3">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[var(--text-muted)]">Add</span>
              {(["ships", "characters"] as const).map((m) => (
                <button key={m} type="button" aria-pressed={mode === m} onClick={() => setMode(m)} className={`${chip} ${mode === m ? "border-[var(--neon-cyan)] text-[var(--text-primary)]" : ""}`}>{m === "ships" ? "💞 Ships (A × B)" : "✨ Characters / moe"}</button>
              ))}
            </div>
            <form className="flex gap-1.5" onSubmit={(e) => { e.preventDefault(); addTyped(); }}>
              {mode === "ships" ? (
                <>
                  <input aria-label="First name" className={field} value={a} maxLength={18} placeholder="Name A" onChange={(e) => setA(e.target.value)} />
                  <span className="self-center text-[var(--text-muted)]">×</span>
                  <input aria-label="Second name" className={field} value={b} maxLength={18} placeholder="Name B" onChange={(e) => setB(e.target.value)} />
                </>
              ) : (
                <input aria-label="Items to add" className={field} value={text} placeholder="Tsundere, Kuudere, Yandere…" onChange={(e) => setText(e.target.value)} />
              )}
              <button type="submit" className={primary}>Add</button>
            </form>
            <div className="flex flex-wrap items-center gap-1.5">
              <button type="button" className={chip} onClick={() => fileRef.current?.click()}>🖼 Add pictures</button>
              <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => upload(e.target.files)} />
              <button type="button" className={chip} onClick={reset}>↺ Unrank all</button>
              <button type="button" className={chip} onClick={clearAll}>Clear</button>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 border-t border-white/10 pt-2">
              <span className="text-xs text-[var(--text-muted)]">Templates:</span>
              {EXAMPLES.map((e) => <button key={e.id} type="button" className={chip} onClick={() => loadExample(e.id)}>{e.label}</button>)}
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">Pictures stay on your device. Share links carry only the names and their tiers.</p>
          </div>
        )}
      </div>
    </section>
  );
}

