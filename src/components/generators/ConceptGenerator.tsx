"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { conceptFilters, conceptGenerator } from "@/lib/generators/concepts";

export default function ConceptGenerator() {
  return (
    <GeneratorUI
      toolType="random_concept_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={conceptFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={conceptGenerator.poolSize}
      generate={conceptGenerator.generate}
      resolve={conceptGenerator.resolve}
      layout="list"
    />
  );
}
