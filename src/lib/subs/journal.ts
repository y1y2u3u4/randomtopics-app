// Pure logic for the Daily Writing Journal: the daily prompt, the writing streak,
// the free-entry limit and day validation. No I/O, so the API and the page share it.
import { JOURNAL_PROMPTS } from "@/data/journalPrompts";
import { STORY_CHALLENGES, STORY_PROMPTS } from "@/data/storyPrompts";

export const FREE_ENTRIES = 3;
export const MAX_BODY = 20000;
export const BACKFILL_DAYS = 7;
const DAY_RE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function isDay(value: unknown): value is string {
  if (typeof value !== "string") return false;
  const m = DAY_RE.exec(value);
  if (!m) return false;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
  return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3];
}
export function isMonth(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-(0[1-9]|1[0-2])$/.test(value);
}
const dayNumber = (day: string) => Math.round(Date.parse(`${day}T00:00:00Z`) / 86400000);
export function addDays(day: string, n: number): string {
  return new Date((dayNumber(day) + n) * 86400000).toISOString().slice(0, 10);
}
export function daysBetween(from: string, to: string) { return dayNumber(to) - dayNumber(from); }

const LENSES = [
  "Answer as if you were writing to a close friend.",
  "Answer as a letter to yourself a year from now.",
  "Answer honestly, even where it is messy.",
  "Answer with one small, specific memory.",
  "Answer in the voice you use when you are most relaxed.",
];

// Prompt pool (about 380): reflection prompts, story openers for teens and adults,
// story openers paired with a craft challenge, and reflection prompts with a lens.
// Larger than a leap year so a calendar year never repeats a prompt.
function buildPool(): string[] {
  const stories = STORY_PROMPTS.filter((s) => s.audience !== "kids").map((s) => s.text);
  const challenges = STORY_CHALLENGES.filter((c) => c.audiences.some((a) => a !== "kids")).map((c) => c.text);
  const pool: string[] = [];
  for (const j of JOURNAL_PROMPTS) pool.push(j.p);
  for (const s of stories) pool.push(`Write the opening of this story: ${s}`);
  stories.forEach((s, i) => pool.push(`Write a short scene: ${s} Challenge: ${challenges[i % challenges.length]}`));
  JOURNAL_PROMPTS.forEach((j, i) => pool.push(`${j.p} ${LENSES[i % LENSES.length]}`));
  return pool;
}
const POOL = buildPool();
export const PROMPT_POOL_SIZE = POOL.length;

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const permutations = new Map<number, number[]>();
function permutationFor(year: number): number[] {
  let p = permutations.get(year);
  if (!p) {
    p = POOL.map((_, i) => i);
    const rand = mulberry32(year * 2654435761 + 12345);
    for (let i = p.length - 1; i > 0; i--) {
      const j = Math.floor(rand() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    permutations.set(year, p);
  }
  return p;
}

/** The prompt for a day. Stable per date; different on each day of a year. */
export function promptForDay(day: string): string {
  if (!isDay(day)) throw new Error("Invalid day");
  const year = +day.slice(0, 4);
  const index = daysBetween(`${year}-01-01`, day);
  return POOL[permutationFor(year)[index % POOL.length]];
}

/** Consecutive written days ending today, or yesterday if today is not written yet. */
export function streak(days: string[], today: string): number {
  const set = new Set(days.filter(isDay));
  let cursor = set.has(today) ? today : addDays(today, -1);
  let n = 0;
  while (set.has(cursor)) { n++; cursor = addDays(cursor, -1); }
  return n;
}

export type JournalCheck = { ok: true; body: string } | { ok: false; error: string };
export function validateEntry(input: { day: unknown; body: unknown }, today: string): JournalCheck {
  if (!isDay(input.day)) return { ok: false, error: "Choose a valid day." };
  if (input.day > today) return { ok: false, error: "You can't write entries for future days." };
  if (daysBetween(input.day, today) > BACKFILL_DAYS) return { ok: false, error: "You can add or edit entries from the last 7 days." };
  if (typeof input.body !== "string" || input.body.trim().length < 1) return { ok: false, error: "Write something first." };
  if (input.body.length > MAX_BODY) return { ok: false, error: `Entries can be up to ${MAX_BODY.toLocaleString("en-US")} characters.` };
  return { ok: true, body: input.body };
}

/** Free users can add FREE_ENTRIES days; editing an existing day is always allowed. */
export function canSave(opts: { hasPlan: boolean; isNewDay: boolean; entryCount: number }): boolean {
  return opts.hasPlan || !opts.isNewDay || opts.entryCount < FREE_ENTRIES;
}
export function freeLeft(entryCount: number) { return Math.max(0, FREE_ENTRIES - entryCount); }
