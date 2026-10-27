"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { sentenceFilters, sentenceGenerator } from "@/lib/generators/sentences";

export default function RandomSentenceGenerator() {
  return (
    <GeneratorUI
      toolType="random_sentence_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={sentenceFilters}
      counts={[1, 5, 10]}
      defaultCount={5}
      poolSize={sentenceGenerator.poolSize}
      generate={sentenceGenerator.generate}
      resolve={sentenceGenerator.resolve}
      layout="list"
    />
  );
}
