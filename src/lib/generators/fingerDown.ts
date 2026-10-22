import data from "@/data/generators/fingerDown.json";
import { listGenerator } from "./core";
import type { FilterGroup, FilterState } from "@/components/generators/GeneratorUI";

export interface FingerStatement { id: string; cat: string; text: string }

export const FINGER_STATEMENTS = data as FingerStatement[];
export const START_FINGERS = 10;

export const FINGER_CATEGORIES: Record<string, string> = {
  clean: "👨‍👩‍👧 Clean / family",
  teens: "🧑‍🎤 Teens",
  friends: "🫶 Friends",
  couples: "💞 Couples",
  school: "🎒 School",
  work: "💼 Work",
  funny: "😂 Funny",
  gamers: "🎮 Gamers",
  juicy: "🌶️ Juicy (PG-13)",
};

export const fingerFilters: FilterGroup[] = [
  { id: "cat", label: "Category", multi: true, options: Object.entries(FINGER_CATEGORIES).map(([value, label]) => ({ value, label })) },
];

export function statementText(s: FingerStatement): string {
  return `Put a finger down if ${s.text}.`;
}

export const fingerGenerator = listGenerator<FingerStatement>({
  items: FINGER_STATEMENTS,
  key: (s) => s.id,
  facets: { cat: (s) => [s.cat] },
  toResult: (s) => ({ key: s.id, title: statementText(s), subtitle: FINGER_CATEGORIES[s.cat] ?? s.cat, emoji: "☝️" }),
});

export function drawStatements(cats: string[], count: number, seed: number, used: string[] = []) {
  const filters: FilterState = { cat: cats };
  const { results, used: nextUsed } = fingerGenerator.generate(filters, count, used, seed);
  const byId = new Map(FINGER_STATEMENTS.map((s) => [s.id, s]));
  return { used: nextUsed, items: results.map((r) => byId.get(r.key)!) };
}

/** Fingers left after a "finger down" press; never below zero. */
export function fingersAfter(current: number): number {
  return Math.max(0, current - 1);
}
