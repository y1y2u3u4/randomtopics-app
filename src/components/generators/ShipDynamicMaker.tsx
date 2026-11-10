"use client";

import { useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import {
  EXAMPLES, HEADINGS, LIMITS, PANEL_COUNTS, PRESETS, PRESET_BY_ID, cardSize, cloneCard, drawCard, encodeShip, panelFor, shipFromHash,
  type Heads, type Panel, type ShipCard,
} from "@/lib/generators/shipDynamic";

const TOOL = "ship_dynamic_template";
const PATH = "/ship-dynamic-template";

function loadImage(src: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function Preview({ card, heads, label }: { card: ShipCard; heads: Heads; label: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [W, H] = cardSize(card.panels.length);
  useEffect(() => {
    const c = ref.current;
    const ctx = c?.getContext("2d");
    if (!c || !ctx) return;
    c.width = W; c.height = H;
    drawCard(ctx, card, heads);
  }, [card, heads, W, H]);
  return (
    <canvas
      ref={ref}
      width={W}
      height={H}
      role="img"
      aria-label={label}
      className="mx-auto block h-auto w-full max-w-[19rem] sm:max-w-md rounded-xl border border-white/10 bg-[#f4f1ea]"
      data-ship-preview
    />
  );
}

async function renderBlob(card: ShipCard, heads: Heads): Promise<Blob | null> {
  const [W, H] = cardSize(card.panels.length);
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  drawCard(ctx, card, heads);
  return new Promise((r) => c.toBlob((b) => r(b), "image/png"));
}

const describe = (c: ShipCard) =>
  c.panels.map((p) => `${p.heading}: ${PRESET_BY_ID.get(p.preset)?.label ?? ""}${p.nameA || p.nameB ? ` (${[p.nameA, p.nameB].filter(Boolean).join(" × ")})` : ""}`).join("; ");

export default function ShipDynamicMaker() {
  const [card, setCard] = useState<ShipCard>(() => cloneCard(EXAMPLES[0].card));
  const [received, setReceived] = useState<ShipCard | null>(null);
  const [sel, setSel] = useState(0);
  const [heads, setHeads] = useState<Heads>({});
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const fileA = useRef<HTMLInputElement>(null);
  const fileB = useRef<HTMLInputElement>(null);

  const flash = (t: string) => { setNote(t); window.setTimeout(() => setNote((x) => (x === t ? "" : x)), 2800); };

  useEffect(() => {
    const read = () => {
      const c = shipFromHash(window.location.hash);
      if (!c) return;
      setReceived(c);
      track("tool_use", { tool_type: TOOL, locale: "en", action: "open_shared" });
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const i = Math.min(sel, card.panels.length - 1);
  const cur = card.panels[i];
  const setPanel = (patch: Partial<Panel>) => setCard((c) => ({ ...c, panels: c.panels.map((p, j) => (j === i ? { ...p, ...patch } : p)) }));

  // Keep user-typed captions/headings; only replace text that was the old preset's default.
  const switchTo = (p: { id: string; caption: string; label: string }): Partial<Panel> => {
    const old = PRESET_BY_ID.get(cur.preset);
    const headingWasLabel = !!old && cur.heading.trim().toLowerCase() === old.label.toLowerCase();
    return {
      preset: p.id,
      caption: !cur.caption || cur.caption === old?.caption ? p.caption : cur.caption,
      ...(headingWasLabel ? { heading: p.label } : {}),
    };
  };

  const choosePreset = (id: string) => {
    const p = PRESET_BY_ID.get(id);
    if (!p) return;
    setPanel(switchTo(p));
    track("filter_select", { tool_type: TOOL, locale: "en", filter: "dynamic", value: id });
  };

  const setCount = (n: number) => {
    setCard((c) => {
      const panels = c.panels.slice(0, n);
      while (panels.length < n) {
        const k = panels.length;
        panels.push(panelFor(PRESETS[(k * 3 + 2) % PRESETS.length].id, k === 1 ? HEADINGS[1] : HEADINGS[0]));
      }
      return { ...c, panels };
    });
    if (sel >= n) setSel(0);
    track("filter_select", { tool_type: TOOL, locale: "en", filter: "panels", value: String(n) });
  };

  const upload = async (side: "a" | "b", files: FileList | null) => {
    const f = files?.[0];
    if (!f || !f.type.startsWith("image/")) return;
    const img = await loadImage(URL.createObjectURL(f));
    if (!img) { flash("That picture could not be read — try a JPG or PNG."); return; }
    setHeads((h) => ({ ...h, [`${i}${side}`]: img }));
    const ref = side === "a" ? fileA : fileB;
    if (ref.current) ref.current.value = "";
    track("tool_use", { tool_type: TOOL, locale: "en", action: "upload_head" });
  };
  const clearHead = (side: "a" | "b") => setHeads((h) => ({ ...h, [`${i}${side}`]: null }));

  const applyExample = (id: string) => {
    const ex = EXAMPLES.find((e) => e.id === id);
    if (!ex) return;
    setCard(cloneCard(ex.card)); setSel(0); setHeads({});
    track("filter_select", { tool_type: TOOL, locale: "en", filter: "example", value: id });
  };

  const randomize = () => {
    const pick = PRESETS[Math.floor(Math.random() * PRESETS.length)];
    setPanel(switchTo(pick));
    track("generate_success", { tool_type: TOOL, generator_mode: "random", result_count: 1, locale: "en" });
  };

  const shareUrl = (c: ShipCard) => `${window.location.origin}${PATH}#s=${encodeShip(c)}`;
  const copyLink = async () => {
    window.history.replaceState(null, "", `${PATH}#s=${encodeShip(card)}`);
    const uploaded = Object.values(heads).some(Boolean);
    if (await copyText(shareUrl(card))) {
      flash(uploaded ? "Link copied ✓ — uploaded pictures stay on your device; friends see stick-figure heads." : "Link copied ✓ — send it to a friend");
      track("copy_result", { tool_type: TOOL, locale: "en", result_count: card.panels.length });
    } else flash("Could not copy — the link is now in your address bar.");
  };

  const exportPng = async (c: ShipCard, h: Heads, mode: "download" | "share") => {
    setBusy(true);
    const blob = await renderBlob(c, h);
    setBusy(false);
    if (!blob) { flash("Could not create the image."); return; }
    const first = c.panels[0];
    const slug = `${first.nameA}-${first.nameB}-ship-dynamic`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "ship-dynamic";
    const file = new File([blob], `${slug}.png`, { type: "image/png" });
    track("generate_success", { tool_type: TOOL, generator_mode: mode, result_count: c.panels.length, locale: "en" });
    if (mode === "share" && navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ files: [file], title: first.heading || HEADINGS[0] }); return; } catch { /* cancelled → download */ }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = file.name; document.body.appendChild(a); a.click(); a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const field = "w-full min-w-0 rounded-lg border border-white/15 bg-black/30 px-2.5 py-1.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--neon-cyan)]";
  const btn = "rounded-lg px-3 py-2 text-sm font-bold transition-colors disabled:opacity-60";
  const primary = `${btn} bg-[var(--neon-cyan)] text-[#0a0a12] hover:brightness-110`;
  const ghost = `${btn} border border-white/20 text-[var(--text-primary)] hover:border-[var(--neon-cyan)]/60`;
  const chip = (on: boolean) => `shrink-0 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${on ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/15 text-[var(--text-primary)]" : "border-white/15 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/60"}`;

  if (received) {
    const c = received;
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-6">
        <div className="glass-card p-4 sm:p-7 space-y-4">
          <p className="text-center text-sm text-[var(--text-secondary)]">Someone sent you their ship dynamic{c.by ? ` — by ${c.by}` : ""}:</p>
          <Preview card={c} heads={{}} label={describe(c)} />
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" className={primary} onClick={() => { window.history.replaceState(null, "", PATH); setReceived(null); }}>Make your own</button>
            <button type="button" className={ghost} disabled={busy} onClick={() => exportPng(c, {}, "download")}>Save as PNG</button>
            <button type="button" className={ghost} onClick={() => { setCard(cloneCard(c)); setHeads({}); window.history.replaceState(null, "", PATH); setReceived(null); }}>Edit a copy</button>
          </div>
          {note && <p className="text-center text-xs text-[var(--neon-cyan)]" role="status">{note}</p>}
        </div>
      </section>
    );
  }

  const headA = heads[`${i}a`], headB = heads[`${i}b`];
  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-6">
      <div className="glass-card p-3 sm:p-7 space-y-3">
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr] sm:items-start">
          <div className="space-y-2">
            <Preview card={card} heads={heads} label={describe(card)} />
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button type="button" className={primary} disabled={busy} onClick={() => exportPng(card, heads, "download")}>{busy ? "Making…" : "⬇ Download PNG"}</button>
              <button type="button" className={ghost} onClick={copyLink}>🔗 Copy link</button>
              <button type="button" className={`${ghost} sm:hidden`} disabled={busy} onClick={() => exportPng(card, heads, "share")}>Share</button>
            </div>
            {note && <p className="text-center text-xs text-[var(--neon-cyan)]" role="status">{note}</p>}
          </div>

          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-muted)]">Panels</span>
              {PANEL_COUNTS.map((n) => (
                <button key={n} type="button" className={chip(card.panels.length === n)} onClick={() => setCount(n)} aria-pressed={card.panels.length === n}>{n}</button>
              ))}
            </div>
            {card.panels.length > 1 && (
              <div className="flex gap-1.5 overflow-x-auto" role="tablist" aria-label="Choose a panel to edit">
                {card.panels.map((p, j) => (
                  <button key={j} type="button" role="tab" aria-selected={i === j} className={chip(i === j)} onClick={() => setSel(j)}>
                    Panel {j + 1}
                  </button>
                ))}
              </div>
            )}
            <label className="block text-xs text-[var(--text-muted)]">Heading
              <input className={`${field} mt-1`} list="ship-headings" value={cur.heading} maxLength={LIMITS.heading} onChange={(e) => setPanel({ heading: e.target.value })} />
              <datalist id="ship-headings">
                {HEADINGS.map((h) => <option key={h} value={h} />)}
                <option value="My OTP" />
                <option value="My roman empire" />
                <option value="Ship dynamic I'm weak for" />
              </datalist>
            </label>
            <div className="flex gap-1.5">
              {HEADINGS.map((h) => (
                <button key={h} type="button" className={chip(cur.heading === h)} onClick={() => setPanel({ heading: h })}>{h.includes("least") ? "💔 Least favorite" : "💖 Favorite"}</button>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="block text-xs text-[var(--text-muted)]">Left name
                <input className={`${field} mt-1`} value={cur.nameA} maxLength={LIMITS.name} placeholder="Character A" onChange={(e) => setPanel({ nameA: e.target.value })} />
              </label>
              <label className="block text-xs text-[var(--text-muted)]">Right name
                <input className={`${field} mt-1`} value={cur.nameB} maxLength={LIMITS.name} placeholder="Character B" onChange={(e) => setPanel({ nameB: e.target.value })} />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {(["a", "b"] as const).map((s) => {
                const has = s === "a" ? headA : headB;
                return (
                  <div key={s} className="flex items-center gap-1.5">
                    <button type="button" className="rounded-lg border border-dashed border-white/25 px-2 py-1 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/60" onClick={() => (s === "a" ? fileA : fileB).current?.click()}>
                      {has ? "Change face" : "＋ Face pic"}
                    </button>
                    {has && <button type="button" className="text-[var(--text-muted)] hover:text-red-400" onClick={() => clearHead(s)} aria-label="Remove picture">✕</button>}
                  </div>
                );
              })}
              <input ref={fileA} type="file" accept="image/*" className="hidden" onChange={(e) => void upload("a", e.target.files)} />
              <input ref={fileB} type="file" accept="image/*" className="hidden" onChange={(e) => void upload("b", e.target.files)} />
            </div>
            <label className="block text-xs text-[var(--text-muted)]">Caption
              <input className={`${field} mt-1`} value={cur.caption} maxLength={LIMITS.caption} onChange={(e) => setPanel({ caption: e.target.value })} />
            </label>
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold text-[var(--text-secondary)]">Pick the dynamic{card.panels.length > 1 ? ` for panel ${i + 1}` : ""}</p>
            <button type="button" className="text-xs font-semibold text-[var(--neon-cyan)] hover:underline" onClick={randomize}>🎲 Random</button>
          </div>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3" data-presets>
            {PRESETS.map((p) => (
              <button
                key={p.id}
                type="button"
                aria-pressed={cur.preset === p.id}
                onClick={() => choosePreset(p.id)}
                className={`rounded-lg border px-2 py-1.5 text-left text-xs font-semibold transition-colors ${cur.preset === p.id ? "border-[var(--neon-cyan)] bg-[var(--neon-cyan)]/15 text-[var(--text-primary)]" : "border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50"}`}
              >
                <span aria-hidden>{p.emoji}</span> {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 border-t border-white/10 pt-2">
          <span className="text-xs text-[var(--text-muted)]">Start from:</span>
          {EXAMPLES.map((e) => <button key={e.id} type="button" className={chip(false)} onClick={() => applyExample(e.id)}>{e.label}</button>)}
          <label className="ml-auto flex items-center gap-1 text-xs text-[var(--text-muted)]">Signed
            <input className={`${field} w-28`} value={card.by} maxLength={LIMITS.by} placeholder="@you" onChange={(e) => setCard((c) => ({ ...c, by: e.target.value }))} />
          </label>
        </div>
        <p className="text-[11px] text-[var(--text-muted)]">Face pictures never leave your device. Share links carry only the text.</p>
      </div>
    </section>
  );
}
