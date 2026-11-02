import { comboGenerator, pick } from "./core";
import { glossed } from "./rootNames";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

// Real given names (with meaning, era and gender) combined with real surnames
// (with meaning). Used by the language/culture name pages; each page brings its
// own lists and its own "special" style (noble "von", middle name, …).
export type Sex = "male" | "female";
export interface Given { name: string; meaning: string; era: string; gender: Sex }
export interface Gloss { name: string; meaning: string }

export const given = (era: string, gender: Sex, list: string): Given[] => glossed(list).map((g) => ({ ...g, era, gender }));

export const SEX_FILTER: FilterGroup = {
  id: "gender",
  label: "Gender",
  multi: true,
  options: [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
  ],
};

interface Extra { style: string; surname: Gloss | null; special: Gloss | null }

export function realNameGenerator(config: {
  names: Given[];
  surnames: Gloss[];
  eras: { id: string; short: string }[];
  flag: string;
  /** The page's own style, e.g. "noble" -> "von Falkenstein". */
  special: {
    id: string;
    pool: (n: Given) => Gloss[];
    /** Also add a surname, e.g. first + middle + last. */
    withSurname?: boolean;
    title: (n: Given, s: Gloss, surname: Gloss | null) => string;
    note: (s: Gloss) => string;
    variety: number;
  };
}) {
  const surnameBy = new Map(config.surnames.map((s) => [s.name, s]));
  const eraLabel = (id: string) => config.eras.find((e) => e.id === id)?.short ?? id;
  return comboGenerator<Given, Extra>({
    items: config.names,
    baseKey: (n) => n.name,
    facets: { era: (n) => [n.era], gender: (n) => [n.gender] },
    extra: (n, rng, filters) => {
      const style = filters.style?.[0] ?? "full";
      if (style === config.special.id) {
        const special = pick(config.special.pool(n), rng);
        return { style, special, surname: config.special.withSurname ? pick(config.surnames, rng) : null };
      }
      return { style, surname: style === "full" ? pick(config.surnames, rng) : null, special: null };
    },
    extraKey: (e) => [e.special ? `s:${e.special.name}` : "", e.surname ? `f:${e.surname.name}` : ""].filter(Boolean).join("~"),
    extraFromKey: (n, key) => {
      const parts = key ? key.split("~") : [];
      const s = parts.find((p) => p.startsWith("s:"));
      const f = parts.find((p) => p.startsWith("f:"));
      const special = s ? config.special.pool(n).find((x) => x.name === s.slice(2)) : null;
      const surname = f ? surnameBy.get(f.slice(2)) : null;
      if ((s && !special) || (f && !surname) || parts.length !== Number(!!s) + Number(!!f)) return null;
      if (special && !!surname !== !!config.special.withSurname) return null;
      return { style: special ? config.special.id : surname ? "full" : "first", special: special ?? null, surname: surname ?? null };
    },
    toResult: (n, { surname, special }) => ({
      title: special ? config.special.title(n, special, surname) : surname ? `${n.name} ${surname.name}` : n.name,
      subtitle: `${config.flag} ${eraLabel(n.era)} · ${n.gender}`,
      detail: [`${n.name}: ${n.meaning}`, surname ? `${surname.name}: ${surname.meaning}` : "", special ? config.special.note(special) : ""]
        .filter(Boolean)
        .join(" · "),
    }),
    variety: (filters) => {
      const style = filters.style?.[0] ?? "full";
      return style === config.special.id ? config.special.variety * (config.special.withSurname ? config.surnames.length : 1) : style === "first" ? 1 : config.surnames.length;
    },
  });
}
