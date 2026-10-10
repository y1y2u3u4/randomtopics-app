"use client";

import { useMemo } from "react";
import GeneratorUI, { GENERATOR_STRINGS_EN, GENERATOR_STRINGS_ES } from "./GeneratorUI";
import { lastNameFilters, lastNameGenerator } from "@/lib/generators/lastNames";

export default function LastNameGenerator({ locale = "en" }: { locale?: "en" | "es" }) {
  const gen = useMemo(() => lastNameGenerator(locale), [locale]);
  const filters = useMemo(() => lastNameFilters(locale), [locale]);
  return (
    <GeneratorUI
      toolType="last_name_generator"
      locale={locale}
      strings={locale === "es" ? GENERATOR_STRINGS_ES : GENERATOR_STRINGS_EN}
      filters={filters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={gen.poolSize}
      generate={gen.generate}
      resolve={gen.resolve}
    />
  );
}
