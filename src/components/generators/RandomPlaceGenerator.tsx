"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { placeFilters, placeGenerator } from "@/lib/generators/randomPlace";

export default function RandomPlaceGenerator() {
  return (
    <GeneratorUI
      toolType="random_place_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={placeFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={placeGenerator.poolSize}
      generate={placeGenerator.generate}
      resolve={placeGenerator.resolve}
      layout="list"
    />
  );
}
