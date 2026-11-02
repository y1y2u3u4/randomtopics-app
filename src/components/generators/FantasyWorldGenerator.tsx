"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { worldFilters, worldGenerator } from "@/lib/generators/fantasyWorld";

export default function FantasyWorldGenerator() {
  return (
    <GeneratorUI
      toolType="fantasy_world_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={worldFilters}
      counts={[1, 3, 5, 10]}
      defaultCount={5}
      poolSize={worldGenerator.poolSize}
      generate={worldGenerator.generate}
      resolve={worldGenerator.resolve}
      layout="list"
    />
  );
}
