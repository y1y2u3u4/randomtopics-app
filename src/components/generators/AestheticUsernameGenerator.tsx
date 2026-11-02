"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { aestheticFilters, aestheticGenerator } from "@/lib/generators/aestheticUsername";

export default function AestheticUsernameGenerator() {
  return (
    <GeneratorUI
      toolType="aesthetic_username_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={aestheticFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={aestheticGenerator.poolSize}
      generate={aestheticGenerator.generate}
      resolve={aestheticGenerator.resolve}
      layout="list"
    />
  );
}
