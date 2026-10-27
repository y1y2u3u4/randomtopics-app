"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { nounFilters, nounGenerator } from "@/lib/generators/nouns";

export default function RandomNounGenerator() {
  return (
    <GeneratorUI
      toolType="random_noun_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={nounFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={5}
      poolSize={nounGenerator.poolSize}
      generate={nounGenerator.generate}
      resolve={nounGenerator.resolve}
      layout="words"
    />
  );
}
