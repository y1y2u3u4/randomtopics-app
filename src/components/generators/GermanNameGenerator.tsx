"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { germanFilters, germanGenerator } from "@/lib/generators/germanNames";

export default function GermanNameGenerator() {
  return (
    <GeneratorUI
      toolType="german_name_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={germanFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={germanGenerator.poolSize}
      generate={germanGenerator.generate}
      resolve={germanGenerator.resolve}
      layout="list"
    />
  );
}
