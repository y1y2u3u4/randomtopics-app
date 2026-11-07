"use client";

import { useEffect, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { wrapLines } from "@/lib/shareImage";
import {
  STYLES, EXAMPLES, MAX_TRACKS, MIN_SUGGESTED, LIMITS, styleById, blankMix, cloneMix, normalize, encodeMix, mixFromLocation,
  sides, searchLinks, cassetteSvg, safeMusicUrl, type Mixtape, type Track,
} from "@/lib/generators/mixtape";

const TOOL = "mixtape_for_you";
const PATH = "/mixtape-for-you";
const FONT = "ui-rounded, 'Trebuchet MS', 'Segoe UI', system-ui, sans-serif";

const input = "w-full min-w-0 rounded-lg border border-white/15 bg-black/30 px-2.5 py-1.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--neon-cyan)]";

async function renderCard(m: Mixtape): Promise<Blob | null> {
  const n = normalize(m);
  const s = styleById(n.style);
  const W = 1080, H = 1350;
  const c = document.createElement("canvas");
  c.width = W; c.height = H;
  const ctx = c.getContext("2d");
  if (!ctx) return null;
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#15151c"); g.addColorStop(1, "#0b0b10");
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = s.shell; ctx.globalAlpha = 0.16; ctx.beginPath(); ctx.arc(W - 120, 140, 320, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;

  const svg = cassetteSvg(n);
  const img = new Image();
  img.decoding = "async";
  img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  try { await img.decode(); } catch { return null; }
  ctx.drawImage(img, 120, 70, 840, 532);

  let y = 650;
  ctx.textAlign = "center";
  if (n.note) {
    ctx.fillStyle = "#f3ead7"; ctx.font = `italic 600 34px ${FONT}`;
    for (const line of wrapLines(ctx, `“${n.note}”`, 900).slice(0, 3)) { ctx.fillText(line, W / 2, y); y += 46; }
    y += 14;
  }
  const [a, b] = sides(n.tracks);
  const colW = 450;
  const drawSide = (label: string, list: Track[], x: number, start: number) => {
    ctx.textAlign = "left";
    ctx.fillStyle = s.stripe; ctx.font = `800 30px ${FONT}`; ctx.fillText(label, x, y);
    let yy = y + 50;
    list.forEach((tr, i) => {
      ctx.fillStyle = "#ffffff"; ctx.font = `700 27px ${FONT}`;
      const num = `${start + i}. `;
      let title = tr.title || tr.artist;
      while (ctx.measureText(num + title).width > colW - 10 && title.length > 4) title = `${title.slice(0, -2)}…`;
      ctx.fillText(num + title, x, yy);
      if (tr.title && tr.artist) {
        ctx.fillStyle = "#a9a7b5"; ctx.font = `500 22px ${FONT}`;
        let artist = tr.artist;
        while (ctx.measureText(artist).width > colW - 50 && artist.length > 4) artist = `${artist.slice(0, -2)}…`;
        ctx.fillText(artist, x + 36, yy + 30);
      }
      yy += 70;
    });
  };
  drawSide("SIDE A", a, 90, 1);
  if (b.length) drawSide("SIDE B", b, 560, a.length + 1);

  ctx.textAlign = "center"; ctx.fillStyle = "#77758a"; ctx.font = `500 24px ${FONT}`;
  ctx.fillText("Make one back: randomtopics.app/mixtape-for-you", W / 2, H - 48);
  return new Promise((r) => { try { c.toBlob((bl) => r(bl), "image/png"); } catch { r(null); } });
}

function Cassette({ mix, spin }: { mix: Mixtape; spin?: boolean }) {
  return <div className="mx-auto w-full max-w-[22rem] sm:max-w-md drop-shadow-xl" dangerouslySetInnerHTML={{ __html: cassetteSvg(normalize(mix), { spin }) }} />;
}

function TrackList({ mix }: { mix: Mixtape }) {
  const n = normalize(mix);
  const [a, b] = sides(n.tracks);
  const row = (x: Track, i: number) => {
    const links = searchLinks(x);
    return (
      <li key={i} className="flex items-baseline justify-between gap-2 border-b border-white/5 py-1.5">
        <span className="min-w-0"><span className="font-semibold text-[var(--text-primary)]">{x.title || x.artist}</span>{x.title && x.artist && <span className="text-[var(--text-muted)]"> — {x.artist}</span>}</span>
        <span className="shrink-0 text-xs">
          {x.url ? (
            <a href={x.url} target="_blank" rel="noopener noreferrer nofollow" className="text-[var(--neon-cyan)] hover:underline">▶ Play</a>
          ) : (
            <>
              <a href={links.youtube} target="_blank" rel="noopener noreferrer nofollow" className="text-[var(--neon-cyan)] hover:underline">YouTube</a>
              <span className="text-[var(--text-muted)]"> · </span>
              <a href={links.spotify} target="_blank" rel="noopener noreferrer nofollow" className="text-[var(--neon-cyan)] hover:underline">Spotify</a>
            </>
          )}
        </span>
      </li>
    );
  };
  return (
    <div className="grid gap-4 sm:grid-cols-2 text-sm">
      <div><p className="mb-1 text-xs font-bold tracking-widest text-[var(--neon-cyan)]">SIDE A</p><ol>{a.map((x, i) => row(x, i))}</ol></div>
      {b.length > 0 && <div><p className="mb-1 text-xs font-bold tracking-widest text-[var(--neon-cyan)]">SIDE B</p><ol>{b.map((x, i) => row(x, i + a.length))}</ol></div>}
    </div>
  );
}

export default function MixtapeMaker() {
  const [mix, setMix] = useState<Mixtape>(() => cloneMix(EXAMPLES[0].mix));
  const [received, setReceived] = useState<Mixtape | null>(null);
  const [linkRows, setLinkRows] = useState<Record<number, boolean>>({});
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const flash = (text: string) => { setNote(text); window.setTimeout(() => setNote((x) => (x === text ? "" : x)), 2400); };

  useEffect(() => {
    const read = () => {
      const m = mixFromLocation(window.location.hash, window.location.search);
      if (m) { setReceived(m); track("tool_use", { tool_type: TOOL, locale: "en", action: "open_shared" }); }
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const set = <K extends keyof Mixtape>(k: K, v: Mixtape[K]) => setMix((m) => ({ ...m, [k]: v }));
  const setTrack = (i: number, patch: Partial<Track>) => setMix((m) => ({ ...m, tracks: m.tracks.map((x, j) => (j === i ? { ...x, ...patch } : x)) }));
  const move = (i: number, d: -1 | 1) => setMix((m) => {
    const j = i + d;
    if (j < 0 || j >= m.tracks.length) return m;
    const tracks = [...m.tracks];
    [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
    return { ...m, tracks };
  });
  const remove = (i: number) => setMix((m) => ({ ...m, tracks: m.tracks.filter((_, j) => j !== i) }));
  const add = () => setMix((m) => (m.tracks.length >= MAX_TRACKS ? m : { ...m, tracks: [...m.tracks, { title: "", artist: "" }] }));

  const applyExample = (id: string) => {
    const ex = EXAMPLES.find((e) => e.id === id);
    if (!ex) return;
    setMix(cloneMix(ex.mix)); setLinkRows({});
    track("filter_select", { tool_type: TOOL, locale: "en", filter: "example", value: id });
  };
  const startBlank = () => { setMix(blankMix()); setLinkRows({}); track("filter_select", { tool_type: TOOL, locale: "en", filter: "example", value: "blank" }); };

  const ready = (m: Mixtape) => normalize(m).tracks.length > 0;

  const shareUrl = (m: Mixtape) => `${window.location.origin}${PATH}#m=${encodeMix(m)}`;

  const copyLink = async () => {
    if (!ready(mix)) { flash("Add at least one song first."); return; }
    const url = shareUrl(mix);
    window.history.replaceState(null, "", `${PATH}#m=${encodeMix(mix)}`);
    setReceived(null);
    const n = normalize(mix);
    if (await copyText(url)) {
      flash(n.tracks.length < MIN_SUGGESTED ? `Link copied ✓ (tip: most mixtapes have ${MIN_SUGGESTED}–${MAX_TRACKS} songs)` : "Link copied ✓ — send it to them");
      track("copy_result", { tool_type: TOOL, locale: "en", result_count: n.tracks.length });
    } else flash("Could not copy — the link is now in your address bar.");
  };

  const exportPng = async (m: Mixtape, mode: "download" | "share") => {
    if (!ready(m)) { flash("Add at least one song first."); return; }
    setBusy(true);
    const blob = await renderCard(m);
    setBusy(false);
    if (!blob) { flash("Could not create the image."); return; }
    const n = normalize(m);
    const name = `${(n.title || "mixtape-for-you").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "mixtape-for-you"}.png`;
    const file = new File([blob], name, { type: "image/png" });
    track("generate_success", { tool_type: TOOL, generator_mode: mode, result_count: n.tracks.length, locale: "en" });
    if (mode === "share" && navigator.canShare?.({ files: [file] })) {
      try { await navigator.share({ files: [file], title: n.title || "A mixtape for you", url: shareUrl(m) }); return; } catch { /* cancelled → download */ }
    }
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 4000);
  };

  const btn = "rounded-lg px-3 py-2 text-sm font-bold transition-colors disabled:opacity-60";
  const primary = `${btn} bg-[var(--neon-cyan)] text-[#0a0a12] hover:brightness-110`;
  const ghost = `${btn} border border-white/20 text-[var(--text-primary)] hover:border-[var(--neon-cyan)]/60`;

  if (received) {
    const n = received;
    return (
      <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-6">
        <style>{`@keyframes mtspin{to{transform:rotate(360deg)}}.mt-reel{animation:mtspin 3.5s linear infinite}@media (prefers-reduced-motion:reduce){.mt-reel{animation:none}}`}</style>
        <div className="glass-card p-4 sm:p-7 space-y-4">
          <p className="text-center text-sm font-semibold text-[var(--neon-cyan)]">🎁 {n.from ? `${n.from} made you a mixtape` : "Someone made you a mixtape"}{n.to ? `, ${n.to}` : ""}</p>
          <Cassette mix={n} spin />
          {n.note && <p className="text-center italic text-[var(--text-primary)]">“{n.note}”</p>}
          <TrackList mix={n} />
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            <button type="button" className={primary} onClick={() => { window.history.replaceState(null, "", PATH); setReceived(null); startBlank(); }}>Make one back</button>
            <button type="button" className={ghost} disabled={busy} onClick={() => exportPng(n, "download")}>Save as PNG</button>
            <button type="button" className={ghost} onClick={() => { setMix(cloneMix(n)); window.history.replaceState(null, "", PATH); setReceived(null); }}>Edit a copy</button>
          </div>
          {note && <p className="text-center text-xs text-[var(--neon-cyan)]" role="status">{note}</p>}
        </div>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-6">
      <div className="glass-card p-4 sm:p-7 space-y-4">
        <Cassette mix={mix} />
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button type="button" className={primary} onClick={copyLink}>🔗 Copy share link</button>
          <button type="button" className={ghost} disabled={busy} onClick={() => exportPng(mix, "download")}>Download PNG</button>
          <button type="button" className={`${ghost} sm:hidden`} disabled={busy} onClick={() => exportPng(mix, "share")}>Share</button>
        </div>
        {note && <p className="text-center text-xs text-[var(--neon-cyan)]" role="status">{note}</p>}

        <div className="grid grid-cols-2 gap-2">
          <label className="col-span-2 block text-xs text-[var(--text-muted)]">Mixtape title
            <input className={input} value={mix.title} maxLength={LIMITS.title} placeholder="e.g. Songs for the drive" onChange={(e) => set("title", e.target.value)} />
          </label>
          <label className="block text-xs text-[var(--text-muted)]">For
            <input className={input} value={mix.to} maxLength={LIMITS.to} placeholder="Their name" onChange={(e) => set("to", e.target.value)} />
          </label>
          <label className="block text-xs text-[var(--text-muted)]">From
            <input className={input} value={mix.from} maxLength={LIMITS.from} placeholder="Your name" onChange={(e) => set("from", e.target.value)} />
          </label>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-[var(--text-secondary)]">Songs <span className="font-normal text-[var(--text-muted)]">· {normalize(mix).tracks.length}/{MAX_TRACKS} — first half is Side A, the rest Side B</span></p>
          <ol className="space-y-1.5">
            {mix.tracks.map((x, i) => (
              <li key={i} className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-5 shrink-0 text-right text-xs text-[var(--text-muted)]">{i + 1}</span>
                  <input aria-label={`Song ${i + 1} title`} className={input} value={x.title} maxLength={LIMITS.song} placeholder="Song" onChange={(e) => setTrack(i, { title: e.target.value })} />
                  <input aria-label={`Song ${i + 1} artist`} className={input} value={x.artist} maxLength={LIMITS.artist} placeholder="Artist" onChange={(e) => setTrack(i, { artist: e.target.value })} />
                  <button type="button" title="Add a Spotify / YouTube link" aria-pressed={!!linkRows[i]} onClick={() => setLinkRows((r) => ({ ...r, [i]: !r[i] }))} className={`shrink-0 rounded px-1 text-sm ${linkRows[i] || x.url ? "text-[var(--neon-cyan)]" : "text-[var(--text-muted)]"}`}>🔗</button>
                  <span className="hidden sm:flex shrink-0">
                    <button type="button" title="Move up" onClick={() => move(i, -1)} className="px-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]">↑</button>
                    <button type="button" title="Move down" onClick={() => move(i, 1)} className="px-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]">↓</button>
                  </span>
                  <button type="button" title="Remove song" onClick={() => remove(i)} className="shrink-0 px-1 text-[var(--text-muted)] hover:text-red-400">✕</button>
                </div>
                {(linkRows[i] || x.url) && (
                  <div className="pl-6">
                    <input aria-label={`Song ${i + 1} link`} className={input} value={x.url ?? ""} maxLength={LIMITS.url} placeholder="https://open.spotify.com/track/… or a YouTube link (optional)" onChange={(e) => setTrack(i, { url: e.target.value })} />
                    {x.url && !safeMusicUrl(x.url) && <p className="mt-0.5 text-[11px] text-amber-300">Only Spotify, YouTube, Apple Music, SoundCloud, Deezer, Tidal and Bandcamp links are kept.</p>}
                  </div>
                )}
              </li>
            ))}
          </ol>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" className={ghost} disabled={mix.tracks.length >= MAX_TRACKS} onClick={add}>+ Add song</button>
            <button type="button" className={ghost} onClick={startBlank}>Start blank</button>
          </div>
        </div>

        <label className="block text-xs text-[var(--text-muted)]">Note for them (optional)
          <textarea className={`${input} resize-y`} rows={2} value={mix.note} maxLength={LIMITS.note} placeholder="Why you made this…" onChange={(e) => set("note", e.target.value)} />
        </label>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-[var(--text-secondary)]">Cassette</p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:flex-wrap">
            {STYLES.map((s) => (
              <button key={s.id} type="button" aria-pressed={mix.style === s.id} onClick={() => set("style", s.id)}
                className={`flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${mix.style === s.id ? "border-[var(--neon-cyan)] text-[var(--text-primary)]" : "border-white/15 text-[var(--text-secondary)]"}`}>
                <span className="h-3 w-3 rounded-full" style={{ background: s.shell, boxShadow: `inset 0 0 0 2px ${s.stripe}` }} />{s.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-semibold text-[var(--text-secondary)]">Start from an example</p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:flex-wrap">
            {EXAMPLES.map((e) => (
              <button key={e.id} type="button" onClick={() => applyExample(e.id)} className="shrink-0 rounded-full border border-white/15 px-3 py-1 text-xs font-semibold text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/60">{e.label}</button>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-4">
          <p className="mb-2 text-xs font-semibold text-[var(--text-secondary)]">What they will see</p>
          <TrackList mix={mix} />
        </div>
      </div>
    </section>
  );
}
