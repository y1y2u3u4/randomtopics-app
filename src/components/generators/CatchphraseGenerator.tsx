"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { catchFilters, catchGenerator } from "@/lib/generators/catchphrase";

export default function CatchphraseGenerator() {
  return (
    <GeneratorUI
      toolType="catchphrase_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={catchFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={catchGenerator.poolSize}
      generate={catchGenerator.generate}
      resolve={catchGenerator.resolve}
      layout="list"
    />
  );
}
