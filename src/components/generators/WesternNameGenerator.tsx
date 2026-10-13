"use client";

import { useMemo } from "react";
import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { westernFilters, westernNameGenerator } from "@/lib/generators/westernNames";

export default function WesternNameGenerator() {
  const gen = useMemo(() => westernNameGenerator(), []);
  const filters = useMemo(() => westernFilters(), []);
  return (
    <GeneratorUI
      toolType="western_baby_name_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={filters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={gen.poolSize}
      generate={gen.generate}
      resolve={gen.resolve}
    />
  );
}
