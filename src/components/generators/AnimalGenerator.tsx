"use client";

import { useMemo } from "react";
import GeneratorUI, { GENERATOR_STRINGS_EN, GENERATOR_STRINGS_ES } from "./GeneratorUI";
import { animalFilters, animalGenerator } from "@/lib/generators/animals";

export default function AnimalGenerator({ locale = "en" }: { locale?: "en" | "es" }) {
  const gen = useMemo(() => animalGenerator(locale), [locale]);
  const filters = useMemo(() => animalFilters(locale), [locale]);
  return (
    <GeneratorUI
      toolType="random_animal_generator"
      locale={locale}
      strings={locale === "es" ? GENERATOR_STRINGS_ES : GENERATOR_STRINGS_EN}
      filters={filters}
      counts={[1, 3, 6, 9, 12]}
      defaultCount={3}
      poolSize={gen.poolSize}
      generate={gen.generate}
      resolve={gen.resolve}
      layout="cards"
    />
  );
}
