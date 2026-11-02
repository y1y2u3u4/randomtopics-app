"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { godFilters, godGenerator } from "@/lib/generators/god";

export default function GodNameGenerator() {
  return (
    <GeneratorUI
      toolType="god_name_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={godFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={godGenerator.poolSize}
      generate={godGenerator.generate}
      resolve={godGenerator.resolve}
      layout="list"
    />
  );
}
