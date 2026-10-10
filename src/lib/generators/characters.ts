import names from "@/data/generators/characterNames.json";
import traits from "@/data/generators/characterTraits.json";
import { comboGenerator, pick } from "./core";
import type { FilterGroup, FilterState } from "@/components/generators/GeneratorUI";
import type { Rng } from "@/lib/randomGenerators";

type Genre = "fantasy" | "scifi" | "modern" | "historical";
interface CharFirst { name: string; gender: "male" | "female" | "neutral"; genres: Genre[]; meaning: string }
interface CharLast { name: string; genres: Genre[]; meaning: string }

export const CHAR_FIRST = names.first as CharFirst[];
export const CHAR_LAST = names.last as CharLast[];
export const TRAITS = traits as Record<"personality" | "appearance" | "motivation" | "secret" | "occupation" | "quirk" | "flaw", string[]>;
const TRAIT_KEYS = ["occupation", "personality", "appearance", "motivation", "secret", "quirk", "flaw"] as const;

export const GENRES: { id: Genre; label: string }[] = [
  { id: "fantasy", label: "🐉 Fantasy" },
  { id: "scifi", label: "🚀 Sci-fi" },
  { id: "modern", label: "🏙️ Modern" },
  { id: "historical", label: "🏰 Historical" },
];

export const characterFilters: FilterGroup[] = [
  { id: "genre", label: "Genre", multi: true, options: GENRES.map((g) => ({ value: g.id, label: g.label })) },
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
];

const lastByName = new Map(CHAR_LAST.map((l) => [l.name, l]));

/** A surname sharing a genre with the first name (and the chosen genres, if any). */
function lastFor(first: CharFirst, filters: FilterState, rng: Rng): CharLast {
  const wanted = filters.genre?.length ? first.genres.filter((g) => filters.genre.includes(g)) : first.genres;
  const genres = wanted.length ? wanted : first.genres;
  const fits = CHAR_LAST.filter((l) => l.genres.some((g) => genres.includes(g)));
  return pick(fits.length ? fits : CHAR_LAST, rng);
}

export const characterNameGenerator = comboGenerator<CharFirst, CharLast>({
  items: CHAR_FIRST,
  baseKey: (f) => f.name,
  facets: { genre: (f) => f.genres, gender: (f) => [f.gender] },
  extra: (f, rng, filters) => lastFor(f, filters, rng),
  extraKey: (l) => l.name,
  extraFromKey: (_f, key) => lastByName.get(key) ?? null,
  toResult: (f, l) => ({
    title: `${f.name} ${l.name}`,
    subtitle: `${f.genres.map((g) => GENRES.find((x) => x.id === g)?.label.replace(/^\S+\s/, "")).join(" / ")} · ${f.gender}`,
    detail: `${f.name} — ${f.meaning} · ${l.name} — ${l.meaning}`,
  }),
  variety: () => Math.round(CHAR_LAST.length / 3),
});

interface Profile { last: CharLast; picks: number[] }

export const randomCharacterGenerator = comboGenerator<CharFirst, Profile>({
  items: CHAR_FIRST,
  baseKey: (f) => f.name,
  facets: { genre: (f) => f.genres, gender: (f) => [f.gender] },
  extra: (f, rng, filters) => ({
    last: lastFor(f, filters, rng),
    picks: TRAIT_KEYS.map((k) => Math.floor(rng() * TRAITS[k].length)),
  }),
  extraKey: (p) => `${p.last.name}|${p.picks.join(".")}`,
  extraFromKey: (_f, key) => {
    const [lastName, idx] = key.split("|");
    const last = lastByName.get(lastName);
    const picks = (idx ?? "").split(".").map(Number);
    if (!last || picks.length !== TRAIT_KEYS.length || picks.some((n, i) => !Number.isInteger(n) || n < 0 || n >= TRAITS[TRAIT_KEYS[i]].length)) return null;
    return { last, picks };
  },
  toResult: (f, p) => {
    const t = Object.fromEntries(TRAIT_KEYS.map((k, i) => [k, TRAITS[k][p.picks[i]]])) as Record<(typeof TRAIT_KEYS)[number], string>;
    return {
      title: `${f.name} ${p.last.name}`,
      subtitle: t.occupation,
      detail: [
        `Personality: ${t.personality}`,
        `Looks: ${t.appearance}`,
        `Motivation: ${t.motivation}`,
        `Secret: ${t.secret}`,
        `Quirk: ${t.quirk}`,
        `Flaw: ${t.flaw}`,
      ].join("\n"),
    };
  },
  variety: () => TRAIT_KEYS.reduce((n, k) => n * TRAITS[k].length, 1),
});
