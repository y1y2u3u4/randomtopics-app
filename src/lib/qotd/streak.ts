import { previousDayKey } from "@/lib/qotd/vote";

// Daily-return helpers for /question-of-the-day (2026-11-06). Pure functions: the
// components keep storage in try/catch and fall back to in-memory state.

export type Streak = { last: string; count: number; best: number };
export const EMPTY_STREAK: Streak = { last: "", count: 0, best: 0 };

/** Streak as it stands today: a missed day shows 0 until the next check-in. */
export function currentStreak(streak: Streak | null | undefined, today: string): Streak {
  if (!streak || typeof streak.count !== "number" || typeof streak.last !== "string") return { ...EMPTY_STREAK };
  const alive = streak.last === today || streak.last === previousDayKey(today);
  return { last: streak.last, count: alive ? streak.count : 0, best: Math.max(streak.best || 0, streak.count) };
}

/**
 * A day counts once, whether the visitor answered or only opened the page: the first
 * check-in of a day extends the streak (or restarts it at 1 after a gap), later ones do nothing.
 */
export function recordCheckIn(streak: Streak | null | undefined, today: string): Streak {
  const before = currentStreak(streak, today);
  if (before.last === today) return before;
  const count = before.count + 1;
  return { last: today, count, best: Math.max(before.best, count) };
}

/** Time left until local midnight, as HH:MM (rounded up, so "00:01" is the last minute). */
export function untilTomorrow(now: Date): string {
  const next = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
  const minutes = Math.max(0, Math.ceil((next.getTime() - now.getTime()) / 60_000));
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

/** Monday to Friday of the school week to print: the current one, or the coming one on Saturday and Sunday. */
export function weekdayDates(now: Date): Date[] {
  const dow = now.getDay(); // 0 Sunday
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (dow === 0 ? 1 : dow === 6 ? 2 : 1 - dow));
  return Array.from({ length: 5 }, (_, i) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i));
}

export type SaveHint = "ios" | "android" | "desktop" | "installed";

/** Which "keep this page handy" tip to show; `installed` means it already runs from the home screen. */
export function saveHint(userAgent: string, standalone: boolean): SaveHint {
  if (standalone) return "installed";
  if (/iPhone|iPad|iPod/i.test(userAgent)) return "ios";
  if (/Android/i.test(userAgent)) return "android";
  return "desktop";
}
