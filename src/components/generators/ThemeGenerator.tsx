"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { themeFilters, themeGenerator } from "@/lib/generators/themes";

export default function ThemeGenerator() {
  return (
    <GeneratorUI
      toolType="random_theme_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={themeFilters}
      counts={[1, 3, 5, 10]}
      defaultCount={3}
      poolSize={themeGenerator.poolSize}
      generate={themeGenerator.generate}
      resolve={themeGenerator.resolve}
      layout="list"
      trackToolUse
    />
  );
}
