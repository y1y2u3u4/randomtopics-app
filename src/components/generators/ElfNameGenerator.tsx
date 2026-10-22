"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { elfFilters, elfGenerator } from "@/lib/generators/elf";

export default function ElfNameGenerator() {
  return (
    <GeneratorUI
      toolType="elf_name_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={elfFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={elfGenerator.poolSize}
      generate={elfGenerator.generate}
      resolve={elfGenerator.resolve}
      layout="list"
    />
  );
}
