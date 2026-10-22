import data from "@/data/generators/incorrectQuotes.json";
import { listGenerator } from "./core";
import type { FilterGroup, FilterState } from "@/components/generators/GeneratorUI";

export type Mood = "chaotic" | "wholesome" | "sarcastic";
export interface QuoteTemplate { id: string; n: number; mood: Mood; lines: [number, string][] }

export const QUOTES = data as QuoteTemplate[];
export const MAX_CHARACTERS = 6;
export const MAX_NAME_LENGTH = 24;
export const DEFAULT_NAMES = ["Alex", "Sam", "Riley", "Jordan", "Casey", "Morgan"];

export const MOOD_LABELS: Record<Mood, string> = { chaotic: "Chaotic", wholesome: "Wholesome", sarcastic: "Sarcastic" };

export const quoteFilters: FilterGroup[] = [
  {
    id: "chars",
    label: "Characters",
    options: [1, 2, 3, 4, 5, 6].map((n) => ({ value: String(n), label: n === 1 ? "1 character" : `${n} characters` })),
  },
  {
    id: "mood",
    label: "Mood",
    multi: true,
    options: (Object.keys(MOOD_LABELS) as Mood[]).map((m) => ({ value: m, label: MOOD_LABELS[m] })),
  },
];

/** Split on commas / new lines / semicolons, trim, dedupe, cap at 6 names. */
export function parseCharacterNames(text: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of text.split(/[,;\n]+/)) {
    const name = raw.replace(/\s+/g, " ").trim().slice(0, MAX_NAME_LENGTH).trim();
    if (!name || seen.has(name.toLowerCase())) continue;
    seen.add(name.toLowerCase());
    out.push(name);
    if (out.length === MAX_CHARACTERS) break;
  }
  return out;
}

/** Names for `n` speakers: typed names first, then defaults that do not clash. */
export function namesFor(typed: readonly string[], n: number): string[] {
  const out = typed.slice(0, n);
  const taken = new Set(out.map((s) => s.toLowerCase()));
  for (const d of DEFAULT_NAMES) {
    if (out.length >= n) break;
    if (!taken.has(d.toLowerCase())) { out.push(d); taken.add(d.toLowerCase()); }
  }
  return out;
}

/** Render a template with the given names (speaker numbers are 1-based). */
export function buildQuote(q: QuoteTemplate, names: readonly string[]): string {
  const full = namesFor(names, q.n);
  return q.lines.map(([who, text]) => (q.n === 1 ? `${full[0]}: ${text}` : `${full[who - 1]}: ${text}`)).join("\n");
}

export const quoteGenerator = listGenerator<QuoteTemplate>({
  items: QUOTES,
  key: (q) => q.id,
  facets: { chars: (q) => [String(q.n)], mood: (q) => [q.mood] },
  toResult: (q) => {
    const names = DEFAULT_NAMES.slice(0, q.n);
    const rendered = buildQuote(q, names).split("\n");
    return {
      key: q.id,
      title: rendered[0],
      subtitle: `${q.n} ${q.n === 1 ? "character" : "characters"} · ${q.mood}`,
      detail: rendered.slice(1).join("\n") || undefined,
      emoji: "💬",
    };
  },
});

/** Draw `count` quotes for the chosen cast size and moods; same seed, same quotes. */
export function drawQuotes(typed: readonly string[], n: number, moods: string[], count: number, seed: number, used: string[] = []) {
  const filters: FilterState = { chars: [String(n)], mood: moods };
  const { results, used: nextUsed } = quoteGenerator.generate(filters, count, used, seed);
  const byId = new Map(QUOTES.map((q) => [q.id, q]));
  return {
    used: nextUsed,
    quotes: results.map((r) => {
      const q = byId.get(r.key)!;
      return { id: q.id, mood: q.mood, text: buildQuote(q, typed) };
    }),
  };
}
