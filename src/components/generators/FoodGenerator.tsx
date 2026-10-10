"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { foodFilters, foodGenerator } from "@/lib/generators/foods";

export default function FoodGenerator() {
  return (
    <GeneratorUI
      toolType="random_food_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={foodFilters}
      counts={[1, 3, 6, 9]}
      defaultCount={3}
      poolSize={foodGenerator.poolSize}
      generate={foodGenerator.generate}
      resolve={foodGenerator.resolve}
      layout="cards"
    />
  );
}
