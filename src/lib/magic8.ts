import { CLASSIC_ANSWERS, DAILY_QUESTIONS, type AnswerKind, type BallAnswer } from "@/data/magic8";
import { createRng, type Rng } from "@/lib/randomGenerators";

export { CLASSIC_ANSWERS, DAILY_QUESTIONS };
export type { AnswerKind, BallAnswer };

export const MAX_CUSTOM = 30;
export const MAX_ANSWER_LENGTH = 40;
export type CustomMode = "mix" | "only";
export interface CustomAnswers { answers: string[]; mode: CustomMode }
export const EMPTY_CUSTOM: CustomAnswers = { answers: [], mode: "mix" };

/** Trim, collapse spaces, cap length, drop empties and duplicates (case-insensitive), cap the list. */
export function cleanCustom(list: readonly unknown[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const item of list) {
    if (typeof item !== "string") continue;
    const text = item.replace(/\s+/g, " ").trim().slice(0, MAX_ANSWER_LENGTH).trim();
    const key = text.toLowerCase();
    if (!text || seen.has(key)) continue;
    seen.add(key);
    out.push(text);
    if (out.length >= MAX_CUSTOM) break;
  }
  return out;
}

/** Parse what localStorage returned; anything unexpected becomes the empty default. */
export function parseCustom(raw: string | null): CustomAnswers {
  if (!raw) return EMPTY_CUSTOM;
  try {
    const v = JSON.parse(raw) as { answers?: unknown; mode?: unknown };
    const answers = Array.isArray(v.answers) ? cleanCustom(v.answers) : [];
    return { answers, mode: v.mode === "only" && answers.length > 0 ? "only" : "mix" };
  } catch { return EMPTY_CUSTOM; }
}

/** The answers the ball can give: the 20 classics, plus yours, or only yours. */
export function answerPool(custom: CustomAnswers): BallAnswer[] {
  const mine: BallAnswer[] = custom.answers.map((text) => ({ text, kind: "maybe" as const }));
  if (custom.mode === "only" && mine.length > 0) return mine;
  return [...CLASSIC_ANSWERS, ...mine];
}

export function pickAnswer(pool: readonly BallAnswer[], rng: Rng): BallAnswer {
  return pool[Math.floor(rng() * pool.length)];
}

/** Share of the 20 classics per kind, for the on-page explainer. */
export function classicOdds() {
  const n = CLASSIC_ANSWERS.length;
  const count = (k: AnswerKind) => CLASSIC_ANSWERS.filter((a) => a.kind === k).length;
  return { total: n, yes: count("yes"), maybe: count("maybe"), no: count("no") };
}

/* ---- daily question of the day (UTC day, same for everyone) ---- */

export function dayNumber(date = new Date()): number {
  return Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000);
}

export function dailyQuestion(day: number): string {
  // A fixed rotation (shuffled by a constant seed) avoids repeats for DAILY_QUESTIONS.length days.
  const order = DAILY_QUESTIONS.map((_, i) => i);
  const fixed = createRng(8888);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(fixed() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return DAILY_QUESTIONS[order[((day % order.length) + order.length) % order.length]];
}

export function dateLabel(day: number): string {
  return new Date(day * 86_400_000).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

export interface Streak { last: number; count: number; best: number }
export const EMPTY_STREAK: Streak = { last: 0, count: 0, best: 0 };

export function parseStreak(raw: string | null): Streak {
  if (!raw) return EMPTY_STREAK;
  try {
    const v = JSON.parse(raw) as Partial<Streak>;
    const ok = (n: unknown) => typeof n === "number" && Number.isInteger(n) && n >= 0;
    return ok(v.last) && ok(v.count) && ok(v.best) ? { last: v.last as number, count: v.count as number, best: v.best as number } : EMPTY_STREAK;
  } catch { return EMPTY_STREAK; }
}

/** Streak as it stands on `today`: a missed day shows 0 until the next daily answer. */
export function streakOn(s: Streak, today: number): Streak {
  return s.last === today || s.last === today - 1 ? s : { ...s, count: 0 };
}

/** Record today's daily answer. Asking twice on the same day does not add to the streak. */
export function recordDaily(s: Streak, today: number): Streak {
  if (s.last === today) return s;
  const count = s.last === today - 1 ? s.count + 1 : 1;
  return { last: today, count, best: Math.max(s.best, count) };
}

export function resultText(question: string, answer: string): string {
  return [question.trim() ? `Q: ${question.trim()}` : "", `🎱 ${answer}`, "https://randomtopics.app/magic-8-ball"].filter(Boolean).join("\n");
}

export function dailyShareText(day: number, question: string, answer: string, streak: number): string {
  return [`Magic 8 Ball question of the day · ${dateLabel(day)}`, `Q: ${question}`, `🎱 ${answer}`, streak > 1 ? `🔥 ${streak}-day streak` : "", "https://randomtopics.app/magic-8-ball"].filter(Boolean).join("\n");
}
