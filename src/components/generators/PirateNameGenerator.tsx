"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { pirateFilters, pirateGenerator } from "@/lib/generators/pirate";

export default function PirateNameGenerator() {
  return (
    <GeneratorUI
      toolType="pirate_name_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={pirateFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={pirateGenerator.poolSize}
      generate={pirateGenerator.generate}
      resolve={pirateGenerator.resolve}
      layout="list"
    />
  );
}
