// Trivia questions: the question banks, filters, the no-repeat draw, multiple
// choice options and the host-mode scoreboard. Everything here is pure (no DOM,
// no network) so it renders on the server, runs in the client and is covered
// by scripts/trivia-regression.mjs.
import general from "@/data/trivia/general.json";
import kids from "@/data/trivia/kids.json";
import math from "@/data/trivia/math.json";
import science from "@/data/trivia/science.json";
import history from "@/data/trivia/history.json";
import geography from "@/data/trivia/geography.json";
import movies from "@/data/trivia/movies.json";
import music from "@/data/trivia/music.json";
import sports from "@/data/trivia/sports.json";
import food from "@/data/trivia/food.json";
import halloween from "@/data/trivia/halloween.json";
import christmas from "@/data/trivia/christmas.json";
import { createRng, shuffle, type Rng } from "@/lib/randomGenerators";

export { createRng };

export const TRIVIA_CATEGORY_IDS = [
  "general", "kids", "math", "science", "history", "geography", "movies", "music", "sports", "food",
] as const;
export type TriviaCategory = (typeof TRIVIA_CATEGORY_IDS)[number];
export type TriviaBank = TriviaCategory | "halloween" | "christmas";
/** Seasonal banks get their own page and stay out of the main pool. */
export type SeasonalBank = "halloween" | "christmas";

export const TRIVIA_CATEGORIES: Record<TriviaCategory, { label: string; emoji: string }> = {
  general: { label: "General knowledge", emoji: "🧠" },
  kids: { label: "Kids", emoji: "🧒" },
  math: { label: "Math", emoji: "➗" },
  science: { label: "Science", emoji: "🔬" },
  history: { label: "History", emoji: "🏛️" },
  geography: { label: "Geography", emoji: "🌍" },
  movies: { label: "Movies", emoji: "🎬" },
  music: { label: "Music", emoji: "🎵" },
  sports: { label: "Sports", emoji: "⚽" },
  food: { label: "Food & drink", emoji: "🍕" },
};

export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export interface TriviaQuestion {
  id: string;
  question: string;
  answer: string;
  /** Two or three wrong answers for multiple-choice play. */
  distractors: string[];
  category: TriviaBank;
  difficulty: Difficulty;
  /** One sentence stating the basis of the answer. */
  explanation: string;
}

export const TRIVIA_BANKS: Record<TriviaBank, TriviaQuestion[]> = {
  general, kids, math, science, history, geography, movies, music, sports, food, halloween, christmas,
} as Record<TriviaBank, TriviaQuestion[]>;

/** The ten evergreen categories (the main page's pool). */
export const CATEGORY_TRIVIA: TriviaQuestion[] = TRIVIA_CATEGORY_IDS.flatMap((c) => TRIVIA_BANKS[c]);
export const ALL_TRIVIA: TriviaQuestion[] = [...CATEGORY_TRIVIA, ...TRIVIA_BANKS.halloween, ...TRIVIA_BANKS.christmas];

export interface TriviaFilters {
  category: TriviaBank | "all";
  difficulty: Difficulty | "all";
}

export function filterTrivia(pool: readonly TriviaQuestion[], f: TriviaFilters): TriviaQuestion[] {
  return pool.filter(
    (q) => (f.category === "all" || q.category === f.category) && (f.difficulty === "all" || q.difficulty === f.difficulty),
  );
}

export interface TriviaDraw {
  question: TriviaQuestion | null;
  used: string[];
  /** True when every question matching the filters has been played this game. */
  finished: boolean;
}

/** Next question nobody has seen this game; never repeats, returns null when the pool is used up. */
export function drawQuestion(pool: readonly TriviaQuestion[], used: readonly string[], rng: Rng): TriviaDraw {
  const usedSet = new Set(used);
  const fresh = pool.filter((q) => !usedSet.has(q.id));
  if (!fresh.length) return { question: null, used: used.slice(), finished: pool.length > 0 };
  const question = fresh[Math.floor(rng() * fresh.length)];
  return { question, used: [...used, question.id], finished: false };
}

/** Answer plus distractors in random order, for multiple-choice play. */
export function choicesFor(q: TriviaQuestion, rng: Rng): string[] {
  return shuffle([q.answer, ...q.distractors], rng);
}

/* ---------------- host mode ---------------- */

export const MIN_TEAMS = 2;
export const MAX_TEAMS = 8;
export const TIMER_OPTIONS = [0, 10, 15, 20, 30, 45, 60, 90] as const;
export const DEFAULT_TIMER = 20;

export interface Team { name: string; score: number }

const clampTeams = (n: number) => Math.min(MAX_TEAMS, Math.max(MIN_TEAMS, Math.floor(n) || MIN_TEAMS));

export function createScoreboard(teams: number): Team[] {
  return Array.from({ length: clampTeams(teams) }, (_, i) => ({ name: `Team ${i + 1}`, score: 0 }));
}

/** Change the number of teams, keeping existing names and scores. */
export function resizeScoreboard(board: readonly Team[], teams: number): Team[] {
  const n = clampTeams(teams);
  return Array.from({ length: n }, (_, i) => board[i] ?? { name: `Team ${i + 1}`, score: 0 });
}

/**
 * Add or subtract points. Scores may go below zero on purpose: hosts use
 * minus points as a penalty for wrong buzz-ins.
 */
export function adjustScore(board: Team[], index: number, delta: number): Team[] {
  if (index < 0 || index >= board.length) return board;
  return board.map((t, i) => (i === index ? { ...t, score: t.score + delta } : t));
}

/** Indexes of the team(s) in the lead; empty while nobody has scored. */
export function leaders(board: readonly Team[]): number[] {
  const top = Math.max(...board.map((t) => t.score));
  if (board.every((t) => t.score === top)) return [];
  return board.flatMap((t, i) => (t.score === top ? [i] : []));
}

export function formatSeconds(s: number): string {
  const v = Math.max(0, Math.ceil(s));
  return `${Math.floor(v / 60)}:${String(v % 60).padStart(2, "0")}`;
}

/* ---------------- static list ---------------- */

/** A fixed, difficulty-mixed sample per category for the readable Q&A list. */
export function staticList(perCategory: number): { category: TriviaCategory; questions: TriviaQuestion[] }[] {
  return TRIVIA_CATEGORY_IDS.map((category, i) => ({ category, questions: sampleBank(TRIVIA_BANKS[category], perCategory, 20261014 + i) }));
}

export function sampleBank(bank: readonly TriviaQuestion[], count: number, seed: number): TriviaQuestion[] {
  const rng = createRng(seed);
  const share = { easy: 0.4, medium: 0.4, hard: 0.2 } as const;
  const picks = DIFFICULTIES.flatMap((d) =>
    shuffle(bank.filter((q) => q.difficulty === d), rng).slice(0, Math.max(1, Math.round(count * share[d]))),
  );
  const order = new Map(DIFFICULTIES.map((d, i) => [d, i]));
  return picks.slice(0, count).sort((a, b) => order.get(a.difficulty)! - order.get(b.difficulty)!);
}
