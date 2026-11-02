"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { englishFilters, englishGenerator } from "@/lib/generators/englishNames";

export default function EnglishNameGenerator() {
  return (
    <GeneratorUI
      toolType="english_name_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={englishFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={englishGenerator.poolSize}
      generate={englishGenerator.generate}
      resolve={englishGenerator.resolve}
      layout="list"
    />
  );
}
