"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { vikingFilters, vikingGenerator } from "@/lib/generators/viking";

export default function VikingNameGenerator() {
  return (
    <GeneratorUI
      toolType="viking_name_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={vikingFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={vikingGenerator.poolSize}
      generate={vikingGenerator.generate}
      resolve={vikingGenerator.resolve}
    />
  );
}
