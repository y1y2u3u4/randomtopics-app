"use client";

import { useMemo } from "react";
import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { letterFilters, letterGenerator } from "@/lib/generators/letters";

const PRESETS = [
  { id: "any", label: "Random letter A–Z", filters: { set: ["all"] }, count: 1 },
  { id: "vowel", label: "Vowel", filters: { set: ["vowels"] }, count: 1 },
  { id: "consonant", label: "Consonant", filters: { set: ["consonants"] }, count: 1 },
  { id: "scattergories", label: "Scattergories", filters: { set: ["easy"] }, count: 1 },
  { id: "alphabet", label: "Shuffled A–Z", filters: { set: ["all"] }, count: 26 },
];

export default function LetterGenerator() {
  const gen = useMemo(() => letterGenerator(), []);
  return (
    <GeneratorUI
      toolType="random_letter_generator"
      locale="en"
      strings={{ ...GENERATOR_STRINGS_EN, poolSize: (n) => `${n} letters in this set · no repeats until every letter has been drawn` }}
      filters={letterFilters}
      counts={[1, 2, 3, 5, 10, 26]}
      defaultCount={1}
      poolSize={gen.poolSize}
      generate={gen.generate}
      resolve={gen.resolve}
      layout="tiles"
      pageId="random_letter_generator"
      presets={PRESETS}
    />
  );
}
