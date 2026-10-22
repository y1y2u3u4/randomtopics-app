import data from "@/data/generators/headcanons.json";
import { listGenerator } from "./core";
import type { FilterGroup, FilterState } from "@/components/generators/GeneratorUI";

export interface Headcanon { id: string; cat: string; text: string }

export const HEADCANONS = data as Headcanon[];
export const MAX_CHARACTER_NAME = 40;

export const HEADCANON_CATEGORIES: Record<string, string> = {
  wholesome: "🌼 Wholesome",
  funny: "😂 Funny",
  "angsty-lite": "🌧️ Angsty-lite",
  habits: "🔁 Habits & quirks",
  relationships: "🏡 Found family",
  "modern-au": "☕ Modern AU",
};

export const headcanonFilters: FilterGroup[] = [
  { id: "cat", label: "Category", multi: true, options: Object.entries(HEADCANON_CATEGORIES).map(([value, label]) => ({ value, label })) },
];

export function cleanCharacterName(input: string): string {
  return input.replace(/\s+/g, " ").trim().slice(0, MAX_CHARACTER_NAME).trim();
}

/** Fill `{character}`; with no name it reads "Your character ..." / "your character". */
export function fillHeadcanon(text: string, name: string): string {
  const clean = cleanCharacterName(name);
  if (clean) return text.split("{character}").join(clean);
  return text.replace(/^\{character\}/, "Your character").split("{character}").join("your character");
}

export const headcanonGenerator = listGenerator<Headcanon>({
  items: HEADCANONS,
  key: (h) => h.id,
  facets: { cat: (h) => [h.cat] },
  toResult: (h) => ({ key: h.id, title: fillHeadcanon(h.text, ""), subtitle: HEADCANON_CATEGORIES[h.cat] ?? h.cat, emoji: "✨" }),
});

export function drawHeadcanons(name: string, cats: string[], count: number, seed: number, used: string[] = []) {
  const filters: FilterState = { cat: cats };
  const { results, used: nextUsed } = headcanonGenerator.generate(filters, count, used, seed);
  const byId = new Map(HEADCANONS.map((h) => [h.id, h]));
  return {
    used: nextUsed,
    items: results.map((r) => {
      const h = byId.get(r.key)!;
      return { id: h.id, cat: h.cat, text: fillHeadcanon(h.text, name) };
    }),
  };
}
