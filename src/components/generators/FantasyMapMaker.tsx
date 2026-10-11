"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { newSeed, parseSeed } from "@/lib/randomGenerators";
import { SEA_LEVEL, cellColor, generateFantasyMap, type MapShape, type MapStyle } from "@/lib/generators/fantasyMap";

const SCALE = 4;
const SHAPES: { id: MapShape; label: string }[] = [
  { id: "continent", label: "Continent" },
  { id: "archipelago", label: "Islands" },
  { id: "pangaea", label: "Supercontinent" },
];

function draw(canvas: HTMLCanvasElement, seed: number, shape: MapShape, style: MapStyle) {
  const map = generateFantasyMap(seed, shape);
  const w = map.width * SCALE, h = map.height * SCALE;
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return map;
  const img = ctx.createImageData(w, h);
  for (let y = 0; y < map.height; y++) {
    for (let x = 0; x < map.width; x++) {
      const i = y * map.width + x;
      const e = map.elevation[i];
      let [r, g, b] = cellColor(e, map.moisture[i], style);
      // Darken coast cells so the outline reads at a glance.
      const land = e >= SEA_LEVEL;
      const neighbours = [i - 1, i + 1, i - map.width, i + map.width].filter((n) => n >= 0 && n < map.elevation.length);
      if (land && neighbours.some((n) => map.elevation[n] < SEA_LEVEL)) { r *= 0.62; g *= 0.62; b *= 0.62; }
      for (let dy = 0; dy < SCALE; dy++) for (let dx = 0; dx < SCALE; dx++) {
        const o = ((y * SCALE + dy) * w + (x * SCALE + dx)) * 4;
        img.data[o] = r; img.data[o + 1] = g; img.data[o + 2] = b; img.data[o + 3] = 255;
      }
    }
  }
  ctx.putImageData(img, 0, 0);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  for (const label of map.labels) {
    const size = label.kind === "realm" ? 22 : 16;
    ctx.font = `${label.kind === "sea" ? "italic " : ""}600 ${size}px Georgia, "Times New Roman", serif`;
    const x = label.x * SCALE, y = label.y * SCALE;
    if (label.kind === "peak") { ctx.fillStyle = "#2b2116"; ctx.beginPath(); ctx.moveTo(x, y - 10); ctx.lineTo(x - 8, y + 4); ctx.lineTo(x + 8, y + 4); ctx.fill(); }
    ctx.lineWidth = 4;
    ctx.strokeStyle = style === "parchment" ? "rgba(245,232,200,0.9)" : "rgba(255,255,255,0.85)";
    ctx.fillStyle = label.kind === "sea" ? "#1d3557" : "#2b2116";
    const ty = label.kind === "peak" ? y + 18 : y;
    ctx.strokeText(label.name, x, ty);
    ctx.fillText(label.name, x, ty);
  }
  // Simple compass rose.
  const cx = w - 60, cy = h - 60;
  ctx.fillStyle = "#2b2116";
  ctx.beginPath(); ctx.moveTo(cx, cy - 30); ctx.lineTo(cx + 8, cy); ctx.lineTo(cx, cy + 30); ctx.lineTo(cx - 8, cy); ctx.closePath(); ctx.fill();
  ctx.font = "700 14px Georgia, serif";
  ctx.fillText("N", cx, cy - 42);
  return map;
}

export default function FantasyMapMaker() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [seed, setSeed] = useState(20261011);
  const [shape, setShape] = useState<MapShape>("continent");
  const [style, setStyle] = useState<MapStyle>("color");
  const [names, setNames] = useState<string[]>([]);
  const [flash, setFlash] = useState("");

  useEffect(() => {
    const restore = () => {
      const params = new URLSearchParams(window.location.search);
      const s = parseSeed(params.get("seed"));
      if (s) setSeed(s);
      const sh = params.get("shape");
      if (sh && SHAPES.some((x) => x.id === sh)) setShape(sh as MapShape);
      if (params.get("style") === "parchment") setStyle("parchment");
    };
    void Promise.resolve().then(restore);
  }, []);

  useEffect(() => {
    if (!canvas.current) return;
    const map = draw(canvas.current, seed, shape, style);
    const id = requestAnimationFrame(() => setNames(map.labels.map((l) => l.name)));
    return () => cancelAnimationFrame(id);
  }, [seed, shape, style]);

  const writeUrl = useCallback((s: number, sh: MapShape, st: MapStyle) => {
    const params = new URLSearchParams({ seed: String(s) });
    if (sh !== "continent") params.set("shape", sh);
    if (st !== "color") params.set("style", st);
    window.history.replaceState(null, "", `${window.location.pathname}?${params}`);
  }, []);

  const newMap = () => {
    const s = newSeed();
    setSeed(s);
    writeUrl(s, shape, style);
    track("generate_success", { tool_type: "fantasy_map_maker", generator_mode: shape, locale: "en" });
  };

  const download = () => {
    canvas.current?.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `fantasy-map-${seed}.png`;
      a.click();
      URL.revokeObjectURL(url);
      track("download_result", { tool_type: "fantasy_map_maker", locale: "en" });
    }, "image/png");
  };

  const chip = (active: boolean) => `text-sm px-3 py-1.5 rounded-lg border transition-all ${active ? "border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[rgba(0,229,255,0.08)]" : "border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/40"}`;
  const ghost = "px-4 py-2 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors";

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-5 sm:p-8">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs uppercase tracking-widest text-[var(--text-muted)] mr-1">Land</span>
          {SHAPES.map((s) => <button key={s.id} type="button" aria-pressed={shape === s.id} className={chip(shape === s.id)} onClick={() => { setShape(s.id); writeUrl(seed, s.id, style); }}>{s.label}</button>)}
          <span className="text-xs uppercase tracking-widest text-[var(--text-muted)] ml-3 mr-1">Style</span>
          {(["color", "parchment"] as const).map((st) => <button key={st} type="button" aria-pressed={style === st} className={chip(style === st)} onClick={() => { setStyle(st); writeUrl(seed, shape, st); }}>{st === "color" ? "Colored" : "Parchment"}</button>)}
        </div>
        <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#264f7c]" style={{ aspectRatio: "8 / 5" }}>
          <canvas ref={canvas} className="w-full h-full block" role="img" aria-label={`Randomly generated fantasy map${names.length ? ` with ${names.join(", ")}` : ""}`} />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
          <button type="button" onClick={newMap} className="btn-generate"><span aria-hidden="true">🗺️</span> New map</button>
          <button type="button" onClick={download} className={ghost}>Download PNG</button>
          <button type="button" className={ghost} onClick={async () => { if (await copyText(window.location.href)) { setFlash("share"); setTimeout(() => setFlash(""), 1200); } }}>{flash === "share" ? "Link copied ✓" : "Copy share link"}</button>
        </div>
        <p className="text-xs text-[var(--text-muted)] text-center mt-3">Map #{seed} · same number, same map — share the link to send this exact world.</p>
      </div>
    </section>
  );
}
