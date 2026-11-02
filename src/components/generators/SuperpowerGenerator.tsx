"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { superpowerFilters, superpowerGenerator } from "@/lib/generators/superpower";

export default function SuperpowerGenerator() {
  return (
    <GeneratorUI
      toolType="superpower_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={superpowerFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={superpowerGenerator.poolSize}
      generate={superpowerGenerator.generate}
      resolve={superpowerGenerator.resolve}
      layout="list"
    />
  );
}
