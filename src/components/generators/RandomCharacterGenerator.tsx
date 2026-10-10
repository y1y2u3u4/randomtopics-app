"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { characterFilters, randomCharacterGenerator } from "@/lib/generators/characters";

export default function RandomCharacterGenerator() {
  return (
    <GeneratorUI
      toolType="random_character_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={characterFilters}
      counts={[1, 3, 5, 10, 20]}
      defaultCount={3}
      poolSize={randomCharacterGenerator.poolSize}
      generate={randomCharacterGenerator.generate}
      resolve={randomCharacterGenerator.resolve}
    />
  );
}
