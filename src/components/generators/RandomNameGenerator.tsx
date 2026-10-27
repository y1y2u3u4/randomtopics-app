"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { randomNameFilters, randomNames } from "@/lib/generators/randomName";

export default function RandomNameGenerator() {
  return (
    <GeneratorUI
      toolType="random_name_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={randomNameFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={randomNames.poolSize}
      generate={randomNames.generate}
      resolve={randomNames.resolve}
      layout="list"
    />
  );
}
