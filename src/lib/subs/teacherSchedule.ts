// Teacher warm-ups: a fixed schedule over school days (Mon–Fri from Aug 1).
// Pure date math, safe for client and server; the prompt pools live in teacher.ts (server).

export type GradeBand = "k5" | "g68" | "g912";
export const GRADE_BANDS: { id: GradeBand; label: string }[] = [
  { id: "k5", label: "Grades K–5" },
  { id: "g68", label: "Grades 6–8" },
  { id: "g912", label: "Grades 9–12" },
];
export function gradeBand(value: unknown): GradeBand | null {
  return value === "k5" || value === "g68" || value === "g912" ? value : null;
}

export type WarmupKind = "qotd" | "debate" | "wyr" | "ethics" | "fun";
/** Monday … Friday. */
export const WEEKDAY_KIND: WarmupKind[] = ["qotd", "debate", "wyr", "ethics", "fun"];

export function isDay(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(`${value}T00:00:00Z`));
}
function utc(day: string) { return new Date(`${day}T00:00:00Z`); }
export function addDays(day: string, n: number): string {
  const d = utc(day);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
/** 0 = Monday … 6 = Sunday. */
export function weekday(day: string): number {
  return (utc(day).getUTCDay() + 6) % 7;
}
/** A weekend date moves to the next Monday. */
export function schoolDay(day: string): string {
  const w = weekday(day);
  return w >= 5 ? addDays(day, 7 - w) : day;
}
export function mondayOf(day: string): string {
  return addDays(day, -weekday(day));
}
/** School year starts Aug 1: 2026-09-10 → 2026, 2027-03-01 → 2026. */
export function schoolYear(day: string): number {
  const [y, m] = day.split("-").map(Number);
  return m >= 8 ? y : y - 1;
}
/** How many earlier school days of the same weekday this year (0 for the first). */
export function weekdayIndex(day: string): number {
  const start = `${schoolYear(day)}-08-01`;
  const days = Math.round((utc(day).getTime() - utc(start).getTime()) / 86400000);
  const first = (weekday(day) - weekday(start) + 7) % 7;
  return Math.floor((days - first) / 7);
}

function hash(text: string): number {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) { h ^= text.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
/** Deterministic shuffle of 0..n-1 (mulberry32 + Fisher–Yates). */
export function permutation(n: number, seed: string): number[] {
  let a = hash(seed);
  const rand = () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const out = Array.from({ length: n }, (_, i) => i);
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(rand() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  return out;
}
/** Index into a pool of `size` for this school day: no repeats within the school year while the pool lasts. */
export function scheduleIndex(day: string, grade: GradeBand, size: number): number {
  const kind = WEEKDAY_KIND[weekday(day)];
  const order = permutation(size, `${schoolYear(day)}:${grade}:${kind}`);
  return order[weekdayIndex(day) % size];
}
