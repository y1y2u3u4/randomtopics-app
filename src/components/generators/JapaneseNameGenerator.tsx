"use client";

import { useMemo } from "react";
import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { japaneseFilters, japaneseNameGenerator, withOrder } from "@/lib/generators/japanese";

export default function JapaneseNameGenerator() {
  const gen = useMemo(() => withOrder(japaneseNameGenerator()), []);
  return (
    <GeneratorUI
      toolType="japanese_name_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={japaneseFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={gen.poolSize}
      generate={gen.generate}
      resolve={gen.resolve}
    />
  );
}
