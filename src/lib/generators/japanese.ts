import data from "@/data/generators/japaneseNames.json";
import { comboGenerator, pick } from "./core";
import type { FilterGroup, FilterState } from "@/components/generators/GeneratorUI";

interface Given { romaji: string; kana: string; kanji: string; gender: "male" | "female" | "neutral"; meaning: string }
interface Family { romaji: string; kana: string; kanji: string; meaning: string }

export const JP_GIVEN = data.given as Given[];
export const JP_FAMILY = data.family as Family[];
const familyBy = new Map(JP_FAMILY.map((f) => [f.romaji, f]));

export const japaneseFilters: FilterGroup[] = [
  {
    id: "gender",
    label: "Gender",
    multi: true,
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
      { value: "neutral", label: "Gender-neutral" },
    ],
  },
  {
    id: "order",
    label: "Name order",
    options: [
      { value: "western", label: "Given + family (Haruto Tanaka)" },
      { value: "japanese", label: "Family + given (Tanaka Haruto)" },
    ],
  },
];

const japaneseOrder = (filters: FilterState) => filters.order?.[0] === "japanese";

export function japaneseNameGenerator() {
  return comboGenerator<Given, Family>({
    items: JP_GIVEN,
    baseKey: (g) => `${g.romaji}-${g.gender}`,
    facets: { gender: (g) => [g.gender] },
    extra: (_g, rng) => pick(JP_FAMILY, rng),
    extraKey: (f) => f.romaji,
    extraFromKey: (_g, key) => familyBy.get(key) ?? null,
    toResult: (g, f) => ({
      title: `${g.romaji} ${f.romaji}`,
      subtitle: `${f.kanji} ${g.kanji} · ${f.kana} ${g.kana} · ${g.gender}`,
      detail: `${g.romaji} (${g.kanji}): ${g.meaning} · ${f.romaji} (${f.kanji}): ${f.meaning}`,
    }),
    variety: () => JP_FAMILY.length,
  });
}

/** Swap to Japanese order (family name first) when requested. */
export function withOrder(gen: ReturnType<typeof japaneseNameGenerator>) {
  const flip = <T extends { title: string }>(r: T, filters: FilterState): T =>
    japaneseOrder(filters) ? { ...r, title: r.title.split(" ").reverse().join(" ") } : r;
  return {
    poolSize: gen.poolSize,
    generate: (filters: FilterState, count: number, used: string[], seed: number) => {
      const out = gen.generate(filters, count, used, seed);
      return { ...out, results: out.results.map((r) => flip(r, filters)) };
    },
    resolve: (key: string, filters: FilterState) => {
      const r = gen.resolve(key, filters);
      return r ? flip(r, filters) : null;
    },
  };
}
