import { QOTD_CATEGORIES, qotdIndexForCategory } from "@/data/questionOfTheDay";
import { QOTD_ANSWERS } from "@/data/qotdAnswers";

export const QOTD_CHOICE_COUNT = 5;

/** Local calendar day as YYYY-MM-DD (the key the vote and the streak use). */
export function localDayKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Previous calendar day for a YYYY-MM-DD key. */
export function previousDayKey(day: string) {
  const [y, m, d] = day.split("-").map(Number);
  return localDayKey(new Date(y, m - 1, d - 1));
}

/**
 * A vote is accepted only for a question that really is "today's" for some
 * daily category on that date, and only for a date within a day of the
 * server's UTC date (every timezone is covered).
 */
export function validQotdVote(day: unknown, question: unknown, choice: unknown, now = new Date()): { day: string; question: number; choice: number } | null {
  if (typeof day !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(day)) return null;
  if (!Number.isInteger(question) || !Number.isInteger(choice)) return null;
  const q = question as number, c = choice as number;
  if (c < 0 || c >= QOTD_CHOICE_COUNT || q < 0 || q >= QOTD_ANSWERS.length) return null;
  const [y, m, d] = day.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  if (localDayKey(date) !== day) return null;
  const utc = Date.UTC(y, m - 1, d), today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  if (Math.abs(utc - today) > 86_400_000) return null;
  const allowed = new Set(["all" as const, ...QOTD_CATEGORIES.map((item) => item.id)].map((category) => qotdIndexForCategory(date, category)));
  return allowed.has(q) ? { day, question: q, choice: c } : null;
}

/** Five counts in choice order, from the database rows. */
export function qotdTally(rows: { choice: number; votes: number | string }[] | null | undefined) {
  const counts = Array.from({ length: QOTD_CHOICE_COUNT }, () => 0);
  for (const row of rows ?? []) if (row.choice >= 0 && row.choice < QOTD_CHOICE_COUNT) counts[row.choice] = Number(row.votes) || 0;
  return counts;
}
