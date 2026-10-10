import type { ListGenerator } from "./core";
import { createRng, drawUnique } from "@/lib/randomGenerators";
import type { FilterGroup, FilterState, GeneratorResult } from "@/components/generators/GeneratorUI";

const VOWELS = new Set(["A", "E", "I", "O", "U"]);
// Letters that start very few English words — handy to drop for word games.
const HARD = new Set(["Q", "X", "Z", "J", "K", "V", "Y"]);

interface Letter { upper: string; nato: string }
const NATO = ["Alfa", "Bravo", "Charlie", "Delta", "Echo", "Foxtrot", "Golf", "Hotel", "India", "Juliett", "Kilo", "Lima", "Mike", "November", "Oscar", "Papa", "Quebec", "Romeo", "Sierra", "Tango", "Uniform", "Victor", "Whiskey", "X-ray", "Yankee", "Zulu"];
export const LETTERS: Letter[] = NATO.map((nato, i) => ({ upper: String.fromCharCode(65 + i), nato }));

export const letterFilters: FilterGroup[] = [
  {
    id: "set",
    label: "Letters",
    options: [
      { value: "all", label: "All 26" },
      { value: "easy", label: "No hard letters (Q X Z J K V Y)" },
      { value: "vowels", label: "Vowels" },
      { value: "consonants", label: "Consonants" },
    ],
  },
  {
    id: "case",
    label: "Case",
    options: [
      { value: "upper", label: "UPPERCASE" },
      { value: "lower", label: "lowercase" },
    ],
  },
];

const inSet = (l: Letter, set: string) =>
  set === "easy" ? !HARD.has(l.upper) : set === "vowels" ? VOWELS.has(l.upper) : set === "consonants" ? !VOWELS.has(l.upper) : true;

export function letterGenerator(): ListGenerator {
  const pool = (filters: FilterState) => LETTERS.filter((l) => inSet(l, filters.set?.[0] ?? "all"));
  const toResult = (l: Letter, filters: FilterState): GeneratorResult => ({
    key: l.upper,
    title: (filters.case?.[0] ?? "upper") === "lower" ? l.upper.toLowerCase() : l.upper,
    subtitle: `NATO: ${l.nato}`,
  });
  return {
    poolSize: (filters) => pool(filters).length,
    generate(filters, count, used, seed) {
      const out = drawUnique(pool(filters), count, (l) => l.upper, used, createRng(seed));
      return { results: out.picks.map((l) => toResult(l, filters)), used: out.used };
    },
    resolve(key, filters) {
      const l = LETTERS.find((x) => x.upper === key.toUpperCase());
      return l ? toResult(l, filters) : null;
    },
  };
}
