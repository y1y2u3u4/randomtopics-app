import type { Rng } from "@/lib/randomGenerators";

export type Hsl = { h: number; s: number; l: number };
export type PaletteMode = "random" | "analogous" | "complementary" | "triadic" | "monochrome" | "pastel";

export const PALETTE_MODES: { id: PaletteMode; label: string; hint: string }[] = [
  { id: "random", label: "Random", hint: "Any colors" },
  { id: "analogous", label: "Analogous", hint: "Neighbours on the color wheel" },
  { id: "complementary", label: "Complementary", hint: "A hue and its opposite" },
  { id: "triadic", label: "Triadic", hint: "Three evenly spaced hues" },
  { id: "monochrome", label: "Monochrome", hint: "One hue, different lightness" },
  { id: "pastel", label: "Pastel", hint: "Soft, light colors" },
];

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));
const wrap = (h: number) => ((h % 360) + 360) % 360;

export function hslToRgb({ h, s, l }: Hsl): [number, number, number] {
  const sat = s / 100;
  const light = l / 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = sat * Math.min(light, 1 - light);
  const f = (n: number) => light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [Math.round(f(0) * 255), Math.round(f(8) * 255), Math.round(f(4) * 255)];
}

export function rgbToHex([r, g, b]: [number, number, number]): string {
  return `#${[r, g, b].map((v) => clamp(v, 0, 255).toString(16).padStart(2, "0")).join("").toUpperCase()}`;
}

export function hexToRgb(hex: string): [number, number, number] | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHsl([r, g, b]: [number, number, number]): Hsl {
  const rn = r / 255, gn = g / 255, bn = b / 255;
  const max = Math.max(rn, gn, bn), min = Math.min(rn, gn, bn);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === rn ? (gn - bn) / d + (gn < bn ? 6 : 0) : max === gn ? (bn - rn) / d + 2 : (rn - gn) / d + 4;
  return { h: Math.round(h * 60), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function formatColor(hex: string) {
  const rgb = hexToRgb(hex) ?? [0, 0, 0];
  const hsl = rgbToHsl(rgb);
  return { hex, rgb: `rgb(${rgb.join(", ")})`, hsl: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` };
}

/** Black or white text, whichever reads better on this background (WCAG luminance). */
export function readableText(hex: string): "#000000" | "#FFFFFF" {
  const rgb = hexToRgb(hex) ?? [0, 0, 0];
  const lum = rgb.map((v) => { const c = v / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; });
  const y = 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2];
  return y > 0.179 ? "#000000" : "#FFFFFF";
}

const between = (rng: Rng, lo: number, hi: number) => lo + rng() * (hi - lo);

/** Hues (and s/l) for `count` colors following a classic palette rule. */
export function paletteHsl(mode: PaletteMode, count: number, rng: Rng): Hsl[] {
  const base = between(rng, 0, 360);
  return Array.from({ length: count }, (_, i): Hsl => {
    switch (mode) {
      case "analogous":
        return { h: wrap(base + (i - (count - 1) / 2) * 24 + between(rng, -4, 4)), s: between(rng, 55, 85), l: between(rng, 38, 64) };
      case "complementary":
        return { h: wrap(base + (i % 2 ? 180 : 0) + between(rng, -8, 8)), s: between(rng, 50, 85), l: between(rng, 30, 70) };
      case "triadic":
        return { h: wrap(base + (i % 3) * 120 + between(rng, -6, 6)), s: between(rng, 50, 85), l: between(rng, 35, 65) };
      case "monochrome":
        return { h: wrap(base + between(rng, -4, 4)), s: between(rng, 45, 80), l: clamp(18 + (i * 64) / Math.max(1, count - 1) + between(rng, -3, 3), 10, 90) };
      case "pastel":
        return { h: wrap(base + i * (360 / count) + between(rng, -15, 15)), s: between(rng, 55, 80), l: between(rng, 78, 88) };
      default:
        return { h: between(rng, 0, 360), s: between(rng, 25, 95), l: between(rng, 20, 80) };
    }
  });
}

/**
 * New palette of `count` hex colors; positions listed in `locked` keep their
 * current color. Every color in the result is distinct.
 */
export function generatePalette(mode: PaletteMode, current: readonly string[], locked: ReadonlySet<number>, count: number, rng: Rng): string[] {
  const fresh = paletteHsl(mode, count, rng).map((hsl) => rgbToHex(hslToRgb(hsl)));
  const out: string[] = [];
  for (let i = 0; i < count; i++) {
    const keep = locked.has(i) && current[i];
    let color = keep ? current[i] : fresh[i];
    // Nudge rare exact duplicates so every swatch is different.
    let guard = 0;
    while (!keep && out.includes(color) && guard++ < 20) {
      const hsl = rgbToHsl(hexToRgb(color)!);
      color = rgbToHex(hslToRgb({ ...hsl, l: clamp(hsl.l + (hsl.l > 50 ? -3 : 3), 0, 100) }));
    }
    out.push(color);
  }
  return out;
}
