"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { ocFilters, ocGenerator } from "@/lib/generators/oc";

export default function OcNameGenerator() {
  return (
    <GeneratorUI
      toolType="oc_name_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={ocFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={ocGenerator.poolSize}
      generate={ocGenerator.generate}
      resolve={ocGenerator.resolve}
      layout="list"
    />
  );
}
