"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { wizardFilters, wizardGenerator } from "@/lib/generators/wizard";

export default function WizardNameGenerator() {
  return (
    <GeneratorUI
      toolType="wizard_name_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={wizardFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={wizardGenerator.poolSize}
      generate={wizardGenerator.generate}
      resolve={wizardGenerator.resolve}
      layout="list"
    />
  );
}
