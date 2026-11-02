"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { personFilters, personGenerator } from "@/lib/generators/randomPerson";

export default function RandomPersonGenerator() {
  return (
    <GeneratorUI
      toolType="random_person_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={personFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={personGenerator.poolSize}
      generate={personGenerator.generate}
      resolve={personGenerator.resolve}
      layout="list"
    />
  );
}
