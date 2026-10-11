import { createRng, type Rng } from "@/lib/randomGenerators";

export type MapShape = "continent" | "archipelago" | "pangaea";
export type MapStyle = "color" | "parchment";

export interface FantasyMap {
  width: number;
  height: number;
  /** Elevation 0..1 per cell, row-major; sea level is SEA_LEVEL. */
  elevation: Float32Array;
  moisture: Float32Array;
  labels: { x: number; y: number; name: string; kind: "realm" | "peak" | "sea" }[];
  landRatio: number;
}

export const SEA_LEVEL = 0.5;

// Value noise with smooth interpolation, seeded per map.
function makeNoise(rng: Rng, size = 64) {
  const grid = Float32Array.from({ length: size * size }, () => rng());
  const at = (x: number, y: number) => grid[((y % size) + size) % size * size + (((x % size) + size) % size)];
  const smooth = (t: number) => t * t * (3 - 2 * t);
  return (x: number, y: number) => {
    const x0 = Math.floor(x), y0 = Math.floor(y);
    const tx = smooth(x - x0), ty = smooth(y - y0);
    const a = at(x0, y0), b = at(x0 + 1, y0), c = at(x0, y0 + 1), d = at(x0 + 1, y0 + 1);
    return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
  };
}

function fractal(noise: (x: number, y: number) => number, x: number, y: number, octaves = 5) {
  let sum = 0, amp = 1, freq = 1, norm = 0;
  for (let o = 0; o < octaves; o++) {
    sum += noise(x * freq, y * freq) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }
  return sum / norm;
}

const SYLLABLES = {
  start: ["Ael", "Bar", "Cal", "Dor", "El", "Fen", "Gal", "Hal", "Ir", "Kar", "Lor", "Mor", "Nar", "Or", "Quel", "Ral", "Sar", "Thal", "Ul", "Val", "Wyn", "Zar"],
  mid: ["a", "e", "i", "o", "an", "en", "ar", "or", "is", "ul", "ae", "ir"],
  end: ["dor", "mere", "heim", "wyn", "gard", "moor", "fell", "reach", "vale", "march", "holt", "rith", "thas", "mar"],
};

// Combinations that would echo famous fictional places.
const RESERVED = new Set(["mordor", "gondor", "rohan", "narnia", "westeros", "valinor", "arrakis", "hogwarts"]);

export function placeName(rng: Rng): string {
  const pickFrom = (list: string[]) => list[Math.floor(rng() * list.length)];
  for (;;) {
    const name = pickFrom(SYLLABLES.start) + (rng() < 0.5 ? pickFrom(SYLLABLES.mid) : "") + pickFrom(SYLLABLES.end);
    if (!RESERVED.has(name.toLowerCase())) return name;
  }
}

/** Generate a map deterministically from a seed. */
export function generateFantasyMap(seed: number, shape: MapShape = "continent", width = 240, height = 150): FantasyMap {
  const rng = createRng(seed);
  const elevNoise = makeNoise(rng);
  const moistNoise = makeNoise(rng);
  const scale = shape === "archipelago" ? 7 : 4.2;
  const ox = rng() * 64, oy = rng() * 64;
  const elevation = new Float32Array(width * height);
  const moisture = new Float32Array(width * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const nx = x / width, ny = y / height;
      const n = fractal(elevNoise, ox + nx * scale, oy + ny * scale * (height / width));
      // Fall off towards the edges so land forms in the middle and the map has a coast.
      const dx = nx * 2 - 1, dy = ny * 2 - 1;
      const edge = Math.sqrt(dx * dx * 0.9 + dy * dy * 1.1);
      const falloff = shape === "pangaea" ? 0.35 * edge * edge : shape === "archipelago" ? 0.22 * edge + Math.max(0, edge - 0.8) * 1.5 : 0.55 * edge * edge;
      const lift = shape === "pangaea" ? 0.14 : shape === "archipelago" ? 0.05 : 0.1;
      elevation[y * width + x] = Math.max(0, Math.min(1, n + lift - falloff));
      moisture[y * width + x] = fractal(moistNoise, ox * 0.5 + nx * 3, oy * 0.5 + ny * 3, 3);
    }
  }
  let land = 0;
  for (const e of elevation) if (e >= SEA_LEVEL) land++;

  // Labels: realms on large land cells spread apart, the highest peak, one sea.
  const labels: FantasyMap["labels"] = [];
  const farFrom = (x: number, y: number, min: number) => labels.every((l) => (l.x - x) ** 2 + (l.y - y) ** 2 > min * min);
  let peak = { x: 0, y: 0, e: 0 };
  for (let i = 0; i < elevation.length; i++) if (elevation[i] > peak.e) peak = { x: i % width, y: Math.floor(i / width), e: elevation[i] };
  if (peak.e >= SEA_LEVEL) labels.push({ x: peak.x, y: peak.y, name: `Mount ${placeName(rng)}`, kind: "peak" });
  for (let tries = 0; tries < 400 && labels.filter((l) => l.kind === "realm").length < 5; tries++) {
    const x = Math.floor(width * (0.1 + rng() * 0.8)), y = Math.floor(height * (0.12 + rng() * 0.76));
    const e = elevation[y * width + x];
    if (e > SEA_LEVEL + 0.03 && e < 0.78 && farFrom(x, y, width * 0.16)) labels.push({ x, y, name: placeName(rng), kind: "realm" });
  }
  for (let tries = 0; tries < 200; tries++) {
    const x = Math.floor(width * (0.08 + rng() * 0.84)), y = Math.floor(height * (0.1 + rng() * 0.8));
    if (elevation[y * width + x] < SEA_LEVEL - 0.08 && farFrom(x, y, width * 0.14)) {
      labels.push({ x, y, name: `${["Sea", "Bay", "Gulf"][Math.floor(rng() * 3)]} of ${placeName(rng)}`, kind: "sea" });
      break;
    }
  }
  return { width, height, elevation, moisture, labels, landRatio: land / elevation.length };
}

/** RGB color for one cell. */
export function cellColor(e: number, m: number, style: MapStyle): [number, number, number] {
  if (style === "parchment") {
    if (e < SEA_LEVEL) { const d = (SEA_LEVEL - e) / SEA_LEVEL; return [Math.round(214 - 40 * d), Math.round(196 - 34 * d), Math.round(156 - 20 * d)]; }
    if (e > 0.86) return [120, 92, 60];
    if (e > 0.76) return [158, 128, 88];
    return m > 0.55 ? [176, 160, 110] : [228, 210, 168];
  }
  if (e < SEA_LEVEL - 0.12) return [38, 84, 140];
  if (e < SEA_LEVEL) return [62, 122, 176];
  if (e < SEA_LEVEL + 0.02) return [222, 206, 150];
  if (e > 0.88) return [240, 240, 244];
  if (e > 0.77) return [128, 116, 104];
  if (e > 0.71) return [104, 132, 78];
  if (m > 0.62) return [46, 112, 64];
  if (m > 0.45) return [96, 150, 74];
  return [176, 172, 104];
}
