"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { shareCanvasPng, wrapLines } from "@/lib/shareImage";
import {
  HEATS, LIMITS, MAX_TRAITS, TRAITS, cleanName, encodeRoast, matchTraits, nextRoast, roastFromHash, roastKey, roastOfTheDay, roastText, traitById,
  type Heat, type Roast,
} from "@/lib/generators/roast";

const TOOL = "roast_one_sentence";
const PATH = "/roast-me-in-one-sentence";
const FONT = `"Helvetica Neue", Arial, "Hiragino Sans", sans-serif`;

const shareUrl = (r: Roast) => `${window.location.origin}${PATH}#r=${encodeRoast(r)}`;

function renderCanvas(r: Roast): HTMLCanvasElement | null {
  const W = 1080, H = 1080, pad = 90;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, "#2a0a12"); g.addColorStop(0.55, "#170a1f"); g.addColorStop(1, "#0d0f17");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W / 2, H + 120, 40, W / 2, H + 120, 760);
  glow.addColorStop(0, "rgba(255,107,53,0.55)"); glow.addColorStop(1, "rgba(255,107,53,0)");
  ctx.fillStyle = glow; ctx.fillRect(0, 0, W, H);

  const heat = HEATS.find((h) => h.id === r.heat)!;
  ctx.textAlign = "center";
  ctx.fillStyle = "#ff8a5c"; ctx.font = `800 30px ${FONT}`;
  ctx.fillText(`${heat.label.toUpperCase()} ROAST ${heat.emoji}`, W / 2, 150);
  ctx.fillStyle = "#f5f6fb"; ctx.font = `700 40px ${FONT}`;
  ctx.fillText(r.name ? `${r.name} got roasted` : "Roasted in one sentence", W / 2, 215);

  const text = `“${roastText(r)}”`;
  let size = 64, lines: string[] = [];
  for (; size >= 40; size -= 4) {
    ctx.font = `800 ${size}px ${FONT}`;
    lines = wrapLines(ctx, text, W - pad * 2);
    if (lines.length * size * 1.25 <= 560) break;
  }
  const lh = size * 1.25;
  let y = H / 2 + 40 - ((lines.length - 1) * lh) / 2;
  ctx.fillStyle = "#ffffff";
  for (const l of lines) { ctx.fillText(l, W / 2, y); y += lh; }

  const tr = traitById(r.trait);
  if (tr) { ctx.fillStyle = "#a3a8bd"; ctx.font = `600 28px ${FONT}`; ctx.fillText(`${tr.emoji} ${tr.label}`, W / 2, H - 150); }
  ctx.fillStyle = "#8a8fa6"; ctx.font = `500 26px ${FONT}`;
  ctx.fillText("Get yours: randomtopics.app/roast-me-in-one-sentence", W / 2, H - 70);
  return c;
}

function RoastCard({ roast, big }: { roast: Roast; big?: boolean }) {
  const heat = HEATS.find((h) => h.id === roast.heat)!;
  const tr = traitById(roast.trait);
  return (
    <figure className="relative overflow-hidden rounded-2xl border border-[var(--neon-orange)]/30 bg-gradient-to-br from-[#2a0a12] via-[#170a1f] to-[#0d0f17] px-5 py-6 sm:px-8 sm:py-9 text-center" data-roast-card>
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-24 h-48 bg-[radial-gradient(closest-side,rgba(255,107,53,0.45),transparent)]" />
      <p className="relative text-[11px] font-extrabold tracking-[0.18em] text-[var(--neon-orange)]">{heat.label.toUpperCase()} ROAST {heat.emoji}</p>
      {roast.name && <p className="relative mt-1 text-sm font-semibold text-[var(--text-secondary)]">{roast.name} got roasted</p>}
      <blockquote className={`relative mt-3 font-extrabold leading-snug text-white ${big ? "text-2xl sm:text-3xl" : "text-lg sm:text-xl"}`} aria-live="polite">
        “{roastText(roast)}”
      </blockquote>
      {tr && <figcaption className="relative mt-3 text-xs text-[var(--text-muted)]">{tr.emoji} {tr.label}</figcaption>}
    </figure>
  );
}

export default function RoastOneSentence() {
  const [name, setName] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [describe, setDescribe] = useState("");
  const [heat, setHeat] = useState<Heat>("spicy");
  const [roast, setRoast] = useState<Roast | null>(null);
  const [received, setReceived] = useState<Roast | null>(null);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const seen = useRef<Set<string>>(new Set());
  const resultRef = useRef<HTMLDivElement>(null);
  const daily = useMemo(() => roastOfTheDay(new Date()), []);

  const flash = (t: string) => { setNote(t); window.setTimeout(() => setNote((x) => (x === t ? "" : x)), 2600); };

  useEffect(() => {
    const read = () => { const r = roastFromHash(window.location.hash); if (r) setReceived(r); };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const matched = useMemo(() => matchTraits(describe).filter((id) => !picked.includes(id)), [describe, picked]);
  const traits = useMemo(() => [...picked, ...matched].slice(0, MAX_TRAITS * 2), [picked, matched]);

  const toggle = (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= MAX_TRAITS ? [...p.slice(1), id] : [...p, id]));

  const fire = (h: Heat = heat, via = "roast") => {
    const r = nextRoast(traits, h, name, seen.current, Math.random());
    seen.current.add(roastKey(r));
    setRoast(r);
    track("generate_success", { tool_type: TOOL, generator_mode: `${h}_${via}`, result_count: traits.length, locale: "en" });
    window.requestAnimationFrame(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  };

  const copyLine = async (r: Roast) => {
    if (await copyText(roastText(r))) { flash("Roast copied ✓"); track("copy_result", { tool_type: TOOL, locale: "en", result_count: 1 }); }
    else flash("Could not copy — select the text instead.");
  };
  const copyLink = async (r: Roast) => {
    const url = shareUrl(r);
    if (await copyText(url)) { flash("Link copied ✓ — your friend sees this exact roast"); track("share_result", { tool_type: TOOL, locale: "en", share_method: "link" }); }
    else { window.history.replaceState(null, "", url); flash("Could not copy — the link is now in your address bar."); }
  };
  const savePng = async (r: Roast) => {
    setBusy(true);
    try {
      const c = renderCanvas(r);
      if (!c) { flash("Could not create the image."); return; }
      const file = `roast-${(r.name || "me").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "me"}.png`;
      const how = await shareCanvasPng(c, file, "Roast me in one sentence", shareUrl(r));
      track("share_result", { tool_type: TOOL, locale: "en", share_method: how === "shared" ? "image_share" : "image_download" });
    } catch { flash("Could not create the image."); } finally { setBusy(false); }
  };

  const btn = "rounded-lg px-3 py-2 text-sm font-bold transition-colors disabled:opacity-60";
  const primary = `${btn} bg-[var(--neon-orange)] text-[#140a05] hover:brightness-110`;
  const ghost = `${btn} border border-white/20 text-[var(--text-primary)] hover:border-[var(--neon-orange)]/60`;
  const field = "w-full min-w-0 rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--neon-orange)]";

  const actions = (r: Roast) => (
    <div className="flex flex-wrap justify-center gap-2">
      <button type="button" className={ghost} onClick={() => copyLine(r)}>Copy roast</button>
      <button type="button" className={ghost} onClick={() => copyLink(r)}>🔗 Share link</button>
      <button type="button" className={ghost} disabled={busy} onClick={() => savePng(r)}>{busy ? "Making…" : "Save image"}</button>
    </div>
  );

  if (received) {
    return (
      <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-6">
        <div className="glass-card p-4 sm:p-7 space-y-4">
          <RoastCard roast={received} big />
          {actions(received)}
          <div className="flex flex-wrap justify-center gap-2">
            <button type="button" className={primary} onClick={() => { window.history.replaceState(null, "", PATH); setReceived(null); track("generate_click", { tool_type: TOOL, generator_mode: "roast_back", locale: "en" }); }}>
              🔥 Roast them back
            </button>
          </div>
          {note && <p className="text-center text-xs text-[var(--neon-orange)]" role="status">{note}</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-2xl mx-auto px-4 sm:px-6 pb-6">
      <div className="glass-card p-4 sm:p-7 space-y-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
          <label className="block text-xs font-semibold text-[var(--text-secondary)]">Name (optional — yours or a friend’s)
            <input className={`${field} mt-1`} value={name} maxLength={LIMITS.name} placeholder="e.g. Sam" autoComplete="off" onChange={(e) => setName(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") fire(); }} />
          </label>
          <div role="radiogroup" aria-label="Roast heat" className="flex rounded-lg border border-white/15 p-0.5">
            {HEATS.map((h) => (
              <button key={h.id} type="button" role="radio" aria-checked={heat === h.id} title={h.hint} onClick={() => { setHeat(h.id); if (roast) fire(h.id, "heat"); }}
                className={`flex-1 rounded-md px-3 py-1.5 text-xs font-bold whitespace-nowrap ${heat === h.id ? "bg-[var(--neon-orange)] text-[#140a05]" : "text-[var(--text-secondary)]"}`}>
                {h.label} {h.emoji}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-[var(--text-secondary)]">Pick up to {MAX_TRAITS} things that are painfully true</p>
          <div className="flex max-h-[7.5rem] flex-wrap gap-1.5 overflow-y-auto sm:max-h-none" data-roast-traits>
            {TRAITS.map((tr) => {
              const on = picked.includes(tr.id) || matched.includes(tr.id);
              return (
                <button key={tr.id} type="button" aria-pressed={on} onClick={() => toggle(tr.id)}
                  className={`rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors ${on ? "border-[var(--neon-orange)] bg-[var(--neon-orange)]/15 text-white" : "border-white/15 text-[var(--text-secondary)] hover:border-white/30"}`}>
                  {tr.emoji} {tr.label}
                </button>
              );
            })}
          </div>
        </div>

        <label className="block text-xs font-semibold text-[var(--text-secondary)]">…or describe yourself in a few words
          <input className={`${field} mt-1`} value={describe} maxLength={LIMITS.describe} placeholder="e.g. always late, lives on iced coffee, never texts back" autoComplete="off" onChange={(e) => setDescribe(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") fire(); }} />
          {describe.trim() && <span className="mt-1 block text-[11px] font-normal text-[var(--text-muted)]">{matched.length ? `Picked up: ${matched.map((id) => traitById(id)?.label).join(", ")}` : "No trait matched — you’ll get an all-purpose roast. Try words like gym, coffee, late, gamer."}</span>}
        </label>

        <button type="button" className={`${primary} w-full py-3 text-base`} onClick={() => fire()}>{roast ? "🔥 Roast me again" : "🔥 Roast me"}</button>

        <div ref={resultRef} className="space-y-3">
          {roast && (
            <>
              <RoastCard roast={roast} big />
              {actions(roast)}
            </>
          )}
          {note && <p className="text-center text-xs text-[var(--neon-orange)]" role="status">{note}</p>}
        </div>

        <div className="rounded-xl border border-white/10 p-3">
          <p className="text-xs font-semibold text-[var(--text-secondary)]">Roast of the day <span className="font-normal text-[var(--text-muted)]">— same for everyone today, new one at midnight UTC</span></p>
          <p className="mt-1 text-sm font-bold text-[var(--text-primary)]">“{roastText(daily)}”</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" className={`${ghost} px-2.5 py-1 text-xs`} onClick={() => copyLink({ ...daily, name: cleanName(name) })}>Send it to a friend</button>
          </div>
        </div>
      </div>
    </section>
  );
}
