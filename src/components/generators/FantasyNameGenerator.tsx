"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { fantasyFilters, fantasyNames } from "@/lib/generators/fantasy";

export default function FantasyNameGenerator() {
  return (
    <GeneratorUI
      toolType="fantasy_name_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={fantasyFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={fantasyNames.poolSize}
      generate={fantasyNames.generate}
      resolve={fantasyNames.resolve}
      layout="list"
    />
  );
}
