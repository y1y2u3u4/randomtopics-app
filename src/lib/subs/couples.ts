// Couples Daily Question: pure logic (no network, no DB). Used by the API route,
// the regression script and, for types only, the client. The question pools
// live in src/data/couplesDaily.ts and must stay server-side.
import { COUPLES_QUESTIONS_EN, COUPLES_QUESTIONS_ES } from "@/data/couplesDaily";

export type CoupleLang = "en" | "es";
export const TRIAL_DAYS = 3;
export const MAX_ANSWER = 2000;
export const CODE_PATTERN = /^[A-Za-z0-9]{10,16}$/;
const CODE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function coupleLang(value: unknown): CoupleLang {
  return value === "es" ? "es" : "en";
}

export function questionPool(lang: CoupleLang): readonly string[] {
  return lang === "es" ? COUPLES_QUESTIONS_ES : COUPLES_QUESTIONS_EN;
}

/** 12 random letters and digits (crypto, rejection sampling so every char is uniform). */
export function roomCode(length = 12): string {
  const out: string[] = [];
  const limit = 256 - (256 % CODE_CHARS.length);
  while (out.length < length) {
    const bytes = new Uint8Array(length * 2);
    globalThis.crypto.getRandomValues(bytes);
    for (const b of bytes) {
      if (b < limit && out.length < length) out.push(CODE_CHARS[b % CODE_CHARS.length]);
    }
  }
  return out.join("");
}

export function validCode(value: unknown): string | null {
  return typeof value === "string" && CODE_PATTERN.test(value) ? value : null;
}

/** YYYY-MM-DD of an instant in an IANA time zone (UTC when the zone is unknown). */
export function dayIn(at: Date | string, timeZone: string): string {
  const date = typeof at === "string" ? new Date(at) : at;
  try {
    return new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" }).format(date);
  } catch {
    return date.toISOString().slice(0, 10);
  }
}

/** Whole days from one YYYY-MM-DD to another (b - a). */
export function daysBetween(a: string, b: string): number {
  return Math.round((Date.parse(`${b}T00:00:00Z`) - Date.parse(`${a}T00:00:00Z`)) / 86_400_000);
}

export function addDays(day: string, n: number): string {
  return new Date(Date.parse(`${day}T00:00:00Z`) + n * 86_400_000).toISOString().slice(0, 10);
}

/** Room day number: 0 on the day the room was created (in the room's time zone). */
export function dayIndex(createdAt: Date | string, today: string, timeZone: string): number {
  return Math.max(0, daysBetween(dayIn(createdAt, timeZone), today));
}

/** Free window: room days 0, 1 and 2. */
export function trialOpen(createdAt: Date | string, today: string, timeZone: string): boolean {
  return dayIndex(createdAt, today, timeZone) < TRIAL_DAYS;
}

export function trialDaysLeft(createdAt: Date | string, today: string, timeZone: string): number {
  return Math.max(0, TRIAL_DAYS - dayIndex(createdAt, today, timeZone));
}

// Seeded shuffle (xmur3 string hash + mulberry32).
function seed(text: string): () => number {
  let h = 1779033703 ^ text.length;
  for (let i = 0; i < text.length; i++) {
    h = Math.imul(h ^ text.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = (Math.imul(h ^ (h >>> 16), 2246822507) ^ Math.imul(h ^ (h >>> 13), 3266489909)) >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Which pool index a room sees on a given day: a permutation per cycle, seeded by the room id. */
export function questionIndex(roomId: string, day: number, size: number, lang: CoupleLang = "en"): number {
  const d = Math.max(0, Math.floor(day));
  const cycle = Math.floor(d / size);
  const rand = seed(`${roomId}:${lang}:${cycle}`);
  const order = Array.from({ length: size }, (_, i) => i);
  for (let i = size - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order[d % size];
}

/** Deterministic daily question; no repeats until the whole pool has been used. */
export function questionForDay(roomId: string, day: number, lang: CoupleLang): string {
  const pool = questionPool(lang);
  return pool[questionIndex(roomId, day, pool.length, lang)];
}

/** Days (YYYY-MM-DD) both partners answered. */
export function daysBothAnswered(rows: { day: string; user_id: string }[]): string[] {
  const seen = new Map<string, Set<string>>();
  for (const r of rows) {
    const set = seen.get(r.day) ?? new Set<string>();
    set.add(r.user_id);
    seen.set(r.day, set);
  }
  return [...seen.entries()].filter(([, users]) => users.size >= 2).map(([day]) => day).sort();
}

/**
 * Consecutive days both answered. Today does not break the streak while it is
 * still open: the run may end today or yesterday.
 */
export function streak(bothDays: string[], today: string): number {
  const set = new Set(bothDays);
  let cursor = set.has(today) ? today : addDays(today, -1);
  let n = 0;
  while (set.has(cursor)) {
    n++;
    cursor = addDays(cursor, -1);
  }
  return n;
}

export function cleanAnswer(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text.length >= 1 && text.length <= MAX_ANSWER ? text : null;
}

export interface TodayRow { user_id: string; answer: string }

/**
 * The only place that decides what a member may see of today's answers.
 * The partner's text is returned only when both have answered; before that
 * the caller gets booleans, never the partner's words.
 */
export function shapeToday(rows: TodayRow[], me: string) {
  const mine = rows.find((r) => r.user_id === me);
  const theirs = rows.find((r) => r.user_id !== me);
  const both = Boolean(mine && theirs);
  return {
    answered: { me: Boolean(mine), partner: Boolean(theirs) },
    answers: both ? { mine: mine!.answer, theirs: theirs!.answer } : null,
  };
}

export interface RoomLike { id: string; owner_id: string; partner_id: string | null }

export function isMember(room: RoomLike, userId: string): boolean {
  return room.owner_id === userId || room.partner_id === userId;
}

export type JoinResult = { ok: true; already: boolean } | { ok: false; status: number; error: string };

/** Join rules: owner cannot be the partner, room holds two people, one room per person. */
export function joinCheck(room: RoomLike | null, userId: string, inOtherRoom: boolean): JoinResult {
  if (!room) return { ok: false, status: 404, error: "That invite link is not valid." };
  if (room.owner_id === userId) return { ok: false, status: 400, error: "This is your own room. Send the link to your partner." };
  if (room.partner_id === userId) return { ok: true, already: true };
  if (room.partner_id) return { ok: false, status: 409, error: "This room already has two people." };
  if (inOtherRoom) return { ok: false, status: 409, error: "You are already in a room." };
  return { ok: true, already: false };
}

/** May this member add an answer on a given room day? */
export function canAnswerToday(trial: boolean, hasPlan: boolean): boolean {
  return trial || hasPlan;
}
