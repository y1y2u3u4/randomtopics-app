// Long format: event names travel with every row, so new/reordered events never
// move old metrics. The legacy wide sheet is an immutable, untrusted archive.
export const SPEECH_DAILY_TAB = "Speech Daily v2";
export const SPEECH_DAILY_SCHEMA = "speech-daily-v2";
export const SPEECH_DAILY_HEADERS = [
  "Report date", "Schema", "Event name", "Event count", "Total users",
  "Measurement: independent event counts/users; not an ordered cohort",
] as const;

type EventMetric = { eventName: string; eventCount: number; totalUsers: number };
const validDate = (value: unknown): value is string => typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value);
const validEvent = (value: unknown): value is string => typeof value === "string" && /^[a-z][a-z0-9_]*$/.test(value);

export function readSpeechDailyRow(row: unknown[]) {
  if (!validDate(row[0]) || row[1] !== SPEECH_DAILY_SCHEMA || !validEvent(row[2]) ||
      ![row[3], row[4]].every(value => typeof value === "number" && Number.isFinite(value) && value >= 0)) {
    return { status: "unknown_schema_or_values" as const };
  }
  return { status: "known" as const, date: row[0], eventName: row[2], eventCount: row[3] as number, totalUsers: row[4] as number };
}

export function planSpeechDailyWrite(existing: unknown[][], date: string, names: readonly string[], metrics: EventMetric[]) {
  if (!validDate(date)) throw new Error("speech_daily_date_invalid");
  if (existing.length && (existing[0].length !== SPEECH_DAILY_HEADERS.length ||
      existing[0].some((value, index) => value !== SPEECH_DAILY_HEADERS[index]))) {
    throw new Error("speech_daily_schema_unknown");
  }
  const rowsByKey = new Map<string, number>();
  existing.slice(1).forEach((row, index) => {
    if (row.every(value => value === "" || value == null)) return;
    const parsed = readSpeechDailyRow(row);
    if (parsed.status !== "known") throw new Error("speech_daily_row_unknown");
    const key = `${parsed.date}/${parsed.eventName}`;
    if (rowsByKey.has(key)) throw new Error("speech_daily_duplicate_key");
    rowsByKey.set(key, index + 2);
  });
  if (new Set(names).size !== names.length || names.some(name => !validEvent(name))) throw new Error("speech_daily_events_invalid");
  const metricsByName = new Map(metrics.map(metric => [metric.eventName, metric]));
  let nextRow = Math.max(2, existing.length + 1);
  const writes = names.map(name => {
    const metric = metricsByName.get(name);
    const values = [date, SPEECH_DAILY_SCHEMA, name, metric?.eventCount ?? 0, metric?.totalUsers ?? 0, "independent-events"];
    if (readSpeechDailyRow(values).status !== "known") throw new Error("speech_daily_metric_invalid");
    return { row: rowsByKey.get(`${date}/${name}`) ?? nextRow++, values };
  }).sort((a, b) => a.row - b.row);
  // Batch adjacent rows while retaining any unrelated dates/events in place.
  const ranges: Array<{ range: string; values: unknown[][] }> = existing.length ? [] : [{ range: `'${SPEECH_DAILY_TAB}'!A1:F1`, values: [[...SPEECH_DAILY_HEADERS]] }];
  let lastRow = -1;
  for (const write of writes) {
    if (write.row === lastRow + 1) ranges[ranges.length - 1].values.push(write.values);
    else ranges.push({ range: `'${SPEECH_DAILY_TAB}'!A${write.row}`, values: [write.values] });
    lastRow = write.row;
  }
  return { ranges, requiredRows: Math.max(existing.length, nextRow - 1, 2) };
}
