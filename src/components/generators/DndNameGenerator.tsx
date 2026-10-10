"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { dndFilters, dndGenerator } from "@/lib/generators/dnd";

export default function DndNameGenerator() {
  return (
    <GeneratorUI
      toolType="dnd_name_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={dndFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={dndGenerator.poolSize}
      generate={dndGenerator.generate}
      resolve={dndGenerator.resolve}
    />
  );
}
