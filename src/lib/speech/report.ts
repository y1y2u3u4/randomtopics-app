import { SPEECH_FUNNELS } from "./events";
export type FunnelRows = {
  dimensionHeaders?: { name: string }[];
  metricHeaders?: { name: string }[];
  rows?: { dimensionValues?: { value: string }[]; metricValues?: { value: string }[] }[];
  metadata?: { samplingMetadatas?: unknown[]; subjectToThresholding?: boolean };
};
export const productionFilter = {
  filter: { fieldName: "hostName", inListFilter: { values: ["randomtopics.app", "www.randomtopics.app"] } },
};
export function funnelRequest(definition: typeof SPEECH_FUNNELS[number], days: number) {
  return {
    dateRanges: [{ startDate: days === 0 ? "today" : `${days}daysAgo`, endDate: days === 0 ? "today" : "yesterday" }],
    dimensionFilter: productionFilter,
    funnel: { isOpenFunnel: false, steps: definition.steps.map(([name, eventName], index) => ({
      name,
      ...(index ? { withinDurationFromPriorStep: "86400s" } : {}),
      // These event names were introduced by speech-v2. Filtering the unregistered
      // measurement_version parameter makes GA4 reject the entire funnel.
      filterExpression: { funnelEventFilter: { eventName } },
    })) },
  };
}
export function funnelCounts(report: FunnelRows, labels: readonly string[]) {
  const dimension = report.dimensionHeaders?.findIndex((h) => h.name === "funnelStepName") ?? -1;
  const metric = report.metricHeaders?.findIndex((h) => h.name === "activeUsers") ?? -1;
  if (dimension < 0 || metric < 0) throw new Error("invalid_funnel_headers");
  return labels.map((label, index) => {
    const row = report.rows?.find((r) => r.dimensionValues?.[dimension]?.value === `${index + 1}. ${label}`);
    const value = Number(row?.metricValues?.[metric]?.value ?? 0);
    if (!Number.isFinite(value) || value < 0) throw new Error("invalid_funnel_count");
    return { label, users: value };
  });
}
