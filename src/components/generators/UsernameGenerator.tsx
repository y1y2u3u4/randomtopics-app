"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { usernameFilters, usernameGenerator } from "@/lib/generators/username";

export default function UsernameGenerator() {
  return (
    <GeneratorUI
      toolType="username_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={usernameFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={usernameGenerator.poolSize}
      generate={usernameGenerator.generate}
      resolve={usernameGenerator.resolve}
      layout="list"
      trackToolUse
    />
  );
}
