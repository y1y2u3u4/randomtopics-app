"use client";

import GeneratorUI, { GENERATOR_STRINGS_EN } from "./GeneratorUI";
import { historicalEventFilters, historicalEventGenerator } from "@/lib/generators/historicalEvents";

export default function HistoricalEventGenerator() {
  return (
    <GeneratorUI
      toolType="random_historical_event_generator"
      locale="en"
      strings={GENERATOR_STRINGS_EN}
      filters={historicalEventFilters}
      counts={[1, 5, 10, 20]}
      defaultCount={10}
      poolSize={historicalEventGenerator.poolSize}
      generate={historicalEventGenerator.generate}
      resolve={historicalEventGenerator.resolve}
      layout="list"
    />
  );
}
