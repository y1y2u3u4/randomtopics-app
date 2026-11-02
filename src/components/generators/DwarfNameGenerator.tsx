"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { dwarfFilters, dwarfGenerator } from "@/lib/generators/dwarf";

export default function DwarfNameGenerator() {
  return (
    <GeneratorUI
      toolType="dwarf_name_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={dwarfFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={dwarfGenerator.poolSize}
      generate={dwarfGenerator.generate}
      resolve={dwarfGenerator.resolve}
      layout="list"
    />
  );
}
