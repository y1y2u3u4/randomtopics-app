"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { megacorpFilters, megacorpGenerator } from "@/lib/generators/megacorpNames";

export default function MegacorpNameGenerator() {
  return (
    <GeneratorUI
      toolType="megacorp_name_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={megacorpFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={megacorpGenerator.poolSize}
      generate={megacorpGenerator.generate}
      resolve={megacorpGenerator.resolve}
      layout="list"
    />
  );
}
