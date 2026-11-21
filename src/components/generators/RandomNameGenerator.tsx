"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN, GENERATOR_STRINGS_ES } from "./GeneratorUI";
import { randomNameFiltersFor, randomNamesFor } from "@/lib/generators/randomName";

export default function RandomNameGenerator({ locale = "en" }: { locale?: "en" | "es" } = {}) {
  const names = randomNamesFor(locale);
  return (
    <GeneratorUI
      toolType="random_name_generator"
      locale={locale}
      strings={locale === "es" ? GENERATOR_STRINGS_ES : GENERATOR_STRINGS_EN}
      filters={randomNameFiltersFor(locale)}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={names.poolSize}
      generate={names.generate}
      resolve={names.resolve}
      layout="list"
    />
  );
}
