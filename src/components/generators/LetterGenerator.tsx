"use client";

import { useMemo } from "react";
import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { letterFilters, letterGenerator } from "@/lib/generators/letters";

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
    />
  );
}
