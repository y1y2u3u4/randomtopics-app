"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { countryFilters, countryGenerator } from "@/lib/generators/geo";

export default function RandomCountryGenerator() {
  return (
    <GeneratorUI
      toolType="random_country_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={countryFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={1}
      poolSize={countryGenerator.poolSize}
      generate={countryGenerator.generate}
      resolve={countryGenerator.resolve}
      layout="list"
    />
  );
}
