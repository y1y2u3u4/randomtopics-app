"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { businessNameFilters, businessNameGenerator } from "@/lib/generators/businessNames";

export default function BusinessNameGenerator() {
  return (
    <GeneratorUI
      toolType="business_name_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={businessNameFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={businessNameGenerator.poolSize}
      generate={businessNameGenerator.generate}
      resolve={businessNameGenerator.resolve}
      layout="list"
    />
  );
}
