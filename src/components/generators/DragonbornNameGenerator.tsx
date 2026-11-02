"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { dragonbornFilters, dragonbornGenerator } from "@/lib/generators/dragonborn";

export default function DragonbornNameGenerator() {
  return (
    <GeneratorUI
      toolType="dragonborn_name_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={dragonbornFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={dragonbornGenerator.poolSize}
      generate={dragonbornGenerator.generate}
      resolve={dragonbornGenerator.resolve}
      layout="list"
    />
  );
}
