"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { orcFilters, orcGenerator } from "@/lib/generators/orc";

export default function OrcNameGenerator() {
  return (
    <GeneratorUI
      toolType="orc_name_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={orcFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={orcGenerator.poolSize}
      generate={orcGenerator.generate}
      resolve={orcGenerator.resolve}
      layout="list"
    />
  );
}
