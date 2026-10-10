"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { gnomeFilters, gnomeGenerator } from "@/lib/generators/gnome";

export default function GnomeNameGenerator() {
  return (
    <GeneratorUI
      toolType="gnome_name_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={gnomeFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={gnomeGenerator.poolSize}
      generate={gnomeGenerator.generate}
      resolve={gnomeGenerator.resolve}
      layout="list"
    />
  );
}
