"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { womanFilters, womanGenerator } from "@/lib/generators/womanNames";

export default function WomanNameGenerator() {
  return (
    <GeneratorUI
      toolType="woman_name_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={womanFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={womanGenerator.poolSize}
      generate={womanGenerator.generate}
      resolve={womanGenerator.resolve}
      layout="list"
    />
  );
}
