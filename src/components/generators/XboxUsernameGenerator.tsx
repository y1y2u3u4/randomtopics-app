"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { xboxFilters, xboxGenerator } from "@/lib/generators/xbox";

export default function XboxUsernameGenerator() {
  return (
    <GeneratorUI
      toolType="xbox_username_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={xboxFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={xboxGenerator.poolSize}
      generate={xboxGenerator.generate}
      resolve={xboxGenerator.resolve}
      layout="list"
    />
  );
}
