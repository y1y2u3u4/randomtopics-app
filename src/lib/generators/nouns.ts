import { WORDS, initialOf, lengthBand } from "./words";
import { listGenerator } from "./core";
import type { FilterGroup } from "@/components/generators/GeneratorUI";

const NOUNS = WORDS.en.filter((w) => w.pos === "noun");
export const NOUN_COUNT = NOUNS.length;

export const nounFilters: FilterGroup[] = [
  { id: "level", label: "Difficulty", multi: true, options: [{ value: "easy", label: "Easy" }, { value: "medium", label: "Medium" }, { value: "hard", label: "Hard" }] },
  { id: "length", label: "Length", multi: true, options: [{ value: "short", label: "Short (3–4)" }, { value: "medium", label: "Medium (5–7)" }, { value: "long", label: "Long (8+)" }] },
  { id: "use", label: "Use", multi: true, options: [{ value: "draw", label: "🎨 Drawable / actable only" }] },
  { id: "letter", label: "Starts with", options: [{ value: "any", label: "Any letter" }, ..."abcdefghijklmnopqrstuvwxyz".split("").map((c) => ({ value: c, label: c.toUpperCase() }))] },
];

export const nounGenerator = listGenerator({
  items: NOUNS,
  key: (w) => w.w,
  facets: {
    level: (w) => [w.level], length: (w) => [lengthBand(w.w)], use: (w) => (w.draw ? ["draw"] : []), letter: (w) => ["any", initialOf(w.w)],
  },
  toResult: (w) => ({ key: w.w, title: w.w, subtitle: `noun · ${w.level}${w.draw ? " · drawable" : ""}` }),
});
