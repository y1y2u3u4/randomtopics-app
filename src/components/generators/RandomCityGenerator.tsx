"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { cityFilters, cityGenerator } from "@/lib/generators/geo";

export default function RandomCityGenerator() {
  return (
    <GeneratorUI
      toolType="random_city_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={cityFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={1}
      poolSize={cityGenerator.poolSize}
      generate={cityGenerator.generate}
      resolve={cityGenerator.resolve}
      layout="list"
    />
  );
}
