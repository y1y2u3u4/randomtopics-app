"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { vampireFilters, vampireGenerator } from "@/lib/generators/vampire";

export default function VampireNameGenerator() {
  return (
    <GeneratorUI
      toolType="vampire_name_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={vampireFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={vampireGenerator.poolSize}
      generate={vampireGenerator.generate}
      resolve={vampireGenerator.resolve}
      layout="list"
    />
  );
}
