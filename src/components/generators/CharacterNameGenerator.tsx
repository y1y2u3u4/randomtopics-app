"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { characterFilters, characterNameGenerator } from "@/lib/generators/characters";

export default function CharacterNameGenerator() {
  return (
    <GeneratorUI
      toolType="character_name_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={characterFilters}
      counts={[1, 3, 5, 10, 20]}
      defaultCount={10}
      poolSize={characterNameGenerator.poolSize}
      generate={characterNameGenerator.generate}
      resolve={characterNameGenerator.resolve}
    />
  );
}
