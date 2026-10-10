"use client";

import { useMemo } from "react";
import GeneratorUI, { GENERATOR_STRINGS_EN, GENERATOR_STRINGS_ES } from "./GeneratorUI";
import { wordFilters, wordGenerator } from "@/lib/generators/words";

export default function WordGenerator({ locale = "en" }: { locale?: "en" | "es" }) {
  const gen = useMemo(() => wordGenerator(locale), [locale]);
  const filters = useMemo(() => wordFilters(locale), [locale]);
  return (
    <GeneratorUI
      toolType="random_word_generator"
      locale={locale}
      strings={locale === "es" ? GENERATOR_STRINGS_ES : GENERATOR_STRINGS_EN}
      filters={filters}
      counts={[1, 3, 5, 10, 20, 50]}
      defaultCount={5}
      poolSize={gen.poolSize}
      generate={gen.generate}
      resolve={gen.resolve}
      layout="words"
    />
  );
}
