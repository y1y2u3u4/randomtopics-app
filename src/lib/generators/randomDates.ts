// Random date picker. All maths is done on UTC day numbers so time zones and
// daylight-saving changes can never shift a date or drop the end of a range.

import type { Rng } from "@/lib/randomGenerators";

export type DateFormat = "iso" | "us" | "eu" | "long";
export const MAX_DATES = 100;
const DAY = 86_400_000;
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** "2026-10-19" → day number (days since 1970-01-01), or null if invalid. */
export function parseIso(value: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const t = Date.UTC(y, mo - 1, d);
  const back = new Date(t);
  if (back.getUTCFullYear() !== y || back.getUTCMonth() !== mo - 1 || back.getUTCDate() !== d) return null;
  return Math.round(t / DAY);
}

const parts = (day: number) => {
  const d = new Date(day * DAY);
  return { y: d.getUTCFullYear(), m: d.getUTCMonth() + 1, d: d.getUTCDate(), w: d.getUTCDay() };
};
const pad = (n: number) => String(n).padStart(2, "0");
export const isWeekend = (day: number) => { const w = parts(day).w; return w === 0 || w === 6; };
export const weekday = (day: number) => WEEKDAYS[parts(day).w];

export function formatDay(day: number, format: DateFormat): string {
  const p = parts(day);
  if (format === "us") return `${pad(p.m)}/${pad(p.d)}/${p.y}`;
  if (format === "eu") return `${pad(p.d)}/${pad(p.m)}/${p.y}`;
  if (format === "long") return `${WEEKDAYS[p.w]}, ${MONTHS[p.m - 1]} ${p.d}, ${p.y}`;
  return `${p.y}-${pad(p.m)}-${pad(p.d)}`;
}

/** Number of days in [start, end] that pass the filter. */
export function countEligible(start: number, end: number, excludeWeekends: boolean): number {
  if (end < start) return 0;
  const total = end - start + 1;
  if (!excludeWeekends) return total;
  let weekends = 0;
  // Whole weeks have exactly 2 weekend days; walk only the leftover days.
  const full = Math.floor(total / 7);
  weekends += full * 2;
  for (let day = start + full * 7; day <= end; day++) if (isWeekend(day)) weekends++;
  return total - weekends;
}

/** The k-th eligible day (0-based) in the range, without listing the range. */
function nthEligible(start: number, k: number, excludeWeekends: boolean): number {
  if (!excludeWeekends) return start + k;
  // Five weekdays per seven days: jump whole weeks, then step.
  let day = start + Math.floor(k / 5) * 7;
  let left = k % 5;
  while (isWeekend(day)) day++;
  while (left > 0) { day++; if (!isWeekend(day)) left--; }
  return day;
}

export interface DateOptions {
  excludeWeekends?: boolean;
  unique?: boolean;
  sort?: boolean;
}

/**
 * Pick `count` random days in [start, end] (both inclusive). With unique set,
 * no day repeats and the count is capped at the number of eligible days.
 */
export function pickDates(start: number, end: number, count: number, opts: DateOptions, rng: Rng): number[] {
  const { excludeWeekends = false, unique = true, sort = false } = opts;
  const n = countEligible(start, end, excludeWeekends);
  if (!n) return [];
  const want = Math.max(1, Math.min(MAX_DATES, Math.floor(count), unique ? n : MAX_DATES));
  const out: number[] = [];
  const seen = new Set<number>();
  while (out.length < want) {
    const k = Math.floor(rng() * n);
    if (unique && seen.has(k)) continue;
    seen.add(k);
    out.push(nthEligible(start, k, excludeWeekends));
  }
  return sort ? out.sort((a, b) => a - b) : out;
}

export function datesCsv(days: number[]): string {
  const rows = days.map((d) => [formatDay(d, "iso"), formatDay(d, "us"), formatDay(d, "eu"), weekday(d)].join(","));
  return ["iso,us,eu,weekday", ...rows].join("\n");
}
