"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { catFilters, catGenerator } from "@/lib/generators/warriorCat";

export default function WarriorCatNameGenerator() {
  return (
    <GeneratorUI
      toolType="warrior_cat_name_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={catFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={catGenerator.poolSize}
      generate={catGenerator.generate}
      resolve={catGenerator.resolve}
      layout="list"
    />
  );
}
