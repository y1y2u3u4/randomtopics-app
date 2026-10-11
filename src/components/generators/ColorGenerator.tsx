"use client";

import { useCallback, useEffect, useState } from "react";
import { copyText } from "@/lib/clipboard";
import { track } from "@/lib/track";
import { createRng, newSeed } from "@/lib/randomGenerators";
import { PALETTE_MODES, formatColor, generatePalette, hexToRgb, readableText, type PaletteMode } from "@/lib/generators/colors";

type Format = "hex" | "rgb" | "hsl";
const COUNTS = [1, 2, 3, 4, 5, 6, 8, 10];
const initial = generatePalette("random", [], new Set(), 5, createRng(7));

export default function ColorGenerator() {
  const [mode, setMode] = useState<PaletteMode>("random");
  const [count, setCount] = useState(5);
  const [colors, setColors] = useState<string[]>(initial);
  const [locked, setLocked] = useState<Set<number>>(new Set());
  const [format, setFormat] = useState<Format>("hex");
  const [flash, setFlash] = useState<string>("");

  const writeUrl = useCallback((next: string[], nextMode: PaletteMode, nextLocked: Set<number>) => {
    const params = new URLSearchParams();
    params.set("c", next.map((c) => c.slice(1)).join("-"));
    if (nextMode !== "random") params.set("m", nextMode);
    if (nextLocked.size) params.set("l", [...nextLocked].join("."));
    window.history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
  }, []);

  // Restore a shared palette (?c=FF0000-00FF00&m=triadic&l=0.2) after hydration.
  useEffect(() => {
    const restore = () => {
      const params = new URLSearchParams(window.location.search);
      const shared = (params.get("c") ?? "").split("-").map((c) => `#${c.toUpperCase()}`).filter((c) => hexToRgb(c)).slice(0, 10);
      const m = params.get("m");
      if (m && PALETTE_MODES.some((x) => x.id === m)) setMode(m as PaletteMode);
      if (shared.length) {
        setColors(shared);
        setCount(shared.length);
        setLocked(new Set((params.get("l") ?? "").split(".").map(Number).filter((n) => Number.isInteger(n) && n >= 0 && n < shared.length)));
      }
    };
    void Promise.resolve().then(restore);
  }, []);

  const generate = useCallback((nextCount = count, nextMode = mode) => {
    const next = generatePalette(nextMode, colors, locked, nextCount, createRng(newSeed()));
    setColors(next);
    writeUrl(next, nextMode, locked);
    track("generate_success", { tool_type: "random_color_generator", generator_mode: nextMode, result_count: next.length, locked: locked.size, locale: "en" });
  }, [colors, count, locked, mode, writeUrl]);

  // Space bar generates, like most palette tools (ignored while typing in a field).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (e.code !== "Space" || target?.closest("input, textarea, select, button, a")) return;
      e.preventDefault();
      generate();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [generate]);

  const toggleLock = (i: number) => {
    const next = new Set(locked);
    if (next.has(i)) next.delete(i); else next.add(i);
    setLocked(next);
    writeUrl(colors, mode, next);
  };

  const copy = async (text: string, key: string) => {
    if (await copyText(text)) {
      setFlash(key);
      setTimeout(() => setFlash(""), 1200);
      track("copy_result", { tool_type: "random_color_generator", locale: "en" });
    }
  };

  const chip = (active: boolean) => `text-sm px-3 py-1.5 rounded-lg border transition-all ${active ? "border-[var(--neon-cyan)] text-[var(--neon-cyan)] bg-[rgba(0,229,255,0.08)]" : "border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/40"}`;
  const ghost = "px-4 py-2 rounded-xl text-sm border border-white/10 text-[var(--text-secondary)] hover:border-[var(--neon-cyan)]/50 transition-colors";

  return (
    <section className="max-w-5xl mx-auto px-4 sm:px-6">
      <div className="glass-card p-5 sm:p-8">
        <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-2">Palette rule</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {PALETTE_MODES.map((m) => (
            <button key={m.id} type="button" title={m.hint} aria-pressed={mode === m.id} className={chip(mode === m.id)}
              onClick={() => { setMode(m.id); generate(count, m.id); }}>{m.label}</button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-[var(--text-secondary)]">
          <label className="flex items-center gap-2">How many
            <select value={count} onChange={(e) => { const n = Number(e.target.value); setCount(n); setLocked(new Set([...locked].filter((i) => i < n))); generate(n); }}
              className="bg-[var(--bg-secondary)] border border-white/10 rounded-lg px-2 py-1.5 text-[var(--text-primary)]">
              {COUNTS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
          <span className="flex items-center gap-2">Show
            {(["hex", "rgb", "hsl"] as const).map((f) => <button key={f} type="button" aria-pressed={format === f} className={chip(format === f)} onClick={() => setFormat(f)}>{f.toUpperCase()}</button>)}
          </span>
        </div>

        <ul className="grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,minmax(0,1fr))] gap-3" aria-live="polite" data-color-results>
          {colors.map((hex, i) => {
            const f = formatColor(hex);
            const ink = readableText(hex);
            const value = f[format];
            return (
              <li key={i} className="rounded-2xl overflow-hidden border border-white/10 flex flex-col">
                <button type="button" onClick={() => copy(value, `c${i}`)} className="h-32 sm:h-44 flex items-end justify-center pb-3 text-sm font-semibold"
                  style={{ background: hex, color: ink }} aria-label={`Copy ${value}`}>
                  {flash === `c${i}` ? "Copied ✓" : value}
                </button>
                <div className="flex items-center justify-between px-3 py-2 bg-white/[0.03] text-xs text-[var(--text-muted)]">
                  <span className="truncate">{format === "hex" ? f.rgb : f.hex}</span>
                  <button type="button" onClick={() => toggleLock(i)} aria-pressed={locked.has(i)} aria-label={locked.has(i) ? `Unlock ${hex}` : `Lock ${hex}`}
                    className={locked.has(i) ? "text-[var(--neon-yellow)]" : "hover:text-[var(--text-primary)]"}>
                    {locked.has(i) ? "🔒" : "🔓"}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6">
          <button type="button" onClick={() => generate()} className="btn-generate"><span aria-hidden="true">🎨</span> Generate colors</button>
          <button type="button" className={ghost} onClick={() => copy(colors.map((c) => formatColor(c)[format]).join("\n"), "all")}>{flash === "all" ? "Copied ✓" : `Copy all ${format.toUpperCase()}`}</button>
          <button type="button" className={ghost} onClick={() => copy(colors.map((c, i) => `--color-${i + 1}: ${c};`).join("\n"), "css")}>{flash === "css" ? "Copied ✓" : "Copy as CSS"}</button>
          <button type="button" className={ghost} onClick={() => copy(window.location.href, "share")}>{flash === "share" ? "Link copied ✓" : "Copy share link"}</button>
        </div>
        <p className="text-xs text-[var(--text-muted)] text-center mt-3">Tip: press the space bar to generate · lock a color to keep it while the others change · click a swatch to copy it.</p>
      </div>
    </section>
  );
}
