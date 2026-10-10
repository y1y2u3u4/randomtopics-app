import en from "@/data/generators/wordsEn.json";
import es from "@/data/generators/wordsEs.json";
import { listGenerator } from "./core";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

export interface Word { w: string; pos: "noun" | "verb" | "adjective" | "adverb"; level: "easy" | "medium" | "hard"; draw: boolean }

export const WORDS: Record<"en" | "es", Word[]> = { en: en as Word[], es: es as Word[] };

/** First letter for filtering: accents folded (á → a), ñ kept as its own letter. */
export function initialOf(word: string): string {
  const first = word.charAt(0).toLowerCase();
  if (first === "ñ") return "ñ";
  return first.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

export function lengthBand(word: string): "short" | "medium" | "long" {
  const n = [...word].length;
  return n <= 4 ? "short" : n <= 7 ? "medium" : "long";
}

const LABELS = {
  en: {
    pos: { label: "Part of speech", noun: "Nouns", verb: "Verbs", adjective: "Adjectives", adverb: "Adverbs" },
    level: { label: "Difficulty", easy: "Easy", medium: "Medium", hard: "Hard" },
    length: { label: "Length", short: "Short (3–4)", medium: "Medium (5–7)", long: "Long (8+)" },
    use: { label: "Use", draw: "🎨 Drawable / actable only" },
    letter: { label: "Starts with", any: "Any letter" },
  },
  es: {
    pos: { label: "Categoría", noun: "Sustantivos", verb: "Verbos", adjective: "Adjetivos", adverb: "Adverbios" },
    level: { label: "Dificultad", easy: "Fácil", medium: "Media", hard: "Difícil" },
    length: { label: "Longitud", short: "Cortas (3–4)", medium: "Medias (5–7)", long: "Largas (8+)" },
    use: { label: "Uso", draw: "🎨 Solo para dibujar / mímica" },
    letter: { label: "Empieza por", any: "Cualquier letra" },
  },
} as const;

const SINGULAR = {
  en: { noun: "noun", verb: "verb", adjective: "adjective", adverb: "adverb" },
  es: { noun: "sustantivo", verb: "verbo", adjective: "adjetivo", adverb: "adverbio" },
} as const;

export function wordFilters(locale: "en" | "es"): FilterGroup[] {
  const l = LABELS[locale];
  const letters = [..."abcdefghijklmnopqrstuvwxyz", ...(locale === "es" ? ["ñ"] : [])];
  return [
    { id: "pos", label: l.pos.label, multi: true, options: (["noun", "verb", "adjective", "adverb"] as const).map((v) => ({ value: v, label: l.pos[v] })) },
    { id: "level", label: l.level.label, multi: true, options: (["easy", "medium", "hard"] as const).map((v) => ({ value: v, label: l.level[v] })) },
    { id: "length", label: l.length.label, multi: true, options: (["short", "medium", "long"] as const).map((v) => ({ value: v, label: l.length[v] })) },
    { id: "use", label: l.use.label, multi: true, options: [{ value: "draw", label: l.use.draw }] },
    { id: "letter", label: l.letter.label, options: [{ value: "any", label: l.letter.any }, ...letters.map((c) => ({ value: c, label: c.toUpperCase() }))] },
  ];
}

export function wordGenerator(locale: "en" | "es") {
  const l = LABELS[locale];
  return listGenerator<Word>({
    items: WORDS[locale],
    key: (w) => w.w,
    facets: {
      pos: (w) => [w.pos],
      level: (w) => [w.level],
      length: (w) => [lengthBand(w.w)],
      use: (w) => (w.draw ? ["draw"] : []),
      // "any" is the default single choice; every word carries it.
      letter: (w) => ["any", initialOf(w.w)],
    },
    toResult: (w) => ({
      key: w.w,
      title: w.w,
      subtitle: `${SINGULAR[locale][w.pos]} · ${l.level[w.level]}`,
    }),
  });
}
