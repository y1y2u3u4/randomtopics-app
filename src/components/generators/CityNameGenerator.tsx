"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { cityFilters, cityGenerator } from "@/lib/generators/cityNames";

export default function CityNameGenerator() {
  return (
    <GeneratorUI
      toolType="city_name_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={cityFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={cityGenerator.poolSize}
      generate={cityGenerator.generate}
      resolve={cityGenerator.resolve}
      layout="list"
      trackToolUse
    />
  );
}
