import "server-only";
import { getGoogleReportingAccessToken, querySearchConsole, runGaReport } from "@/lib/googleReporting";
import { coreUsageRows } from "@/lib/coreUsageReport";

type Cell = string | number | boolean;
type Table = { name: string; headers: string[]; rows: Cell[][] };
type Window = { period: string; startDate: string; endDate: string };
const PAGE_SIZE = 10_000;
const MAX_ROWS = 50_000;
const offset = (date: string, days: number) => {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
};
export const reportWindows = (end: string): Window[] => [
  { period: "current7", startDate: offset(end, -6), endDate: end },
  { period: "previous7", startDate: offset(end, -13), endDate: offset(end, -7) },
  { period: "current28", startDate: offset(end, -27), endDate: end },
  { period: "previous28", startDate: offset(end, -55), endDate: offset(end, -28) },
];
const baseHeaders = ["Period", "Start date", "End date"];
const prefix = (w: Window): Cell[] => [w.period, w.startDate, w.endDate];
const number = (v?: string) => Number(v ?? 0);
const publicHost = { filter: { fieldName: "hostName", inListFilter: { values: ["randomtopics.app", "www.randomtopics.app"] } } };
const gaMetrics = ["activeUsers", "sessions", "screenPageViews", "engagedSessions", "userEngagementDuration"];

/** Private aggregates only. Raw search rows stay in the existing private Sheet. */
export async function collectSitewideReport() {
  const generatedAt = new Date().toISOString();
  const gscDates = await querySearchConsole({ startDate: offset(generatedAt.slice(0, 10), -14), endDate: offset(generatedAt.slice(0, 10), -1), dimensions: ["date"] });
  const gscEnd = gscDates.rows?.map(r => r.keys?.[0] ?? "").sort().at(-1);
  const gaDates = await runGaReport({ startDate: "7daysAgo", endDate: "yesterday", dimensions: ["date"], metrics: ["sessions"], dimensionFilter: publicHost });
  const gaLast = gaDates.rows?.map(r => r.dimensionValues?.[0]?.value ?? "").sort().at(-1);
  if (!gscEnd || !gaLast || !/^\d{8}$/.test(gaLast)) throw new Error("sitewide_dates_unavailable");
  const gaEnd = `${gaLast.slice(0, 4)}-${gaLast.slice(4, 6)}-${gaLast.slice(6)}`;
  const tables = new Map<string, Table>();
  const table = (name: string, headers: string[]) => {
    if (!tables.has(name)) tables.set(name, { name, headers, rows: [] });
    return tables.get(name)!;
  };
  const coverage = table("Report Coverage", ["Generated at", "Source", "Table", ...baseHeaders, "Returned rows", "API row count", "Hit row cap", "Thresholded", "Other row loss", "Sampled", "Timezone", "Notes"]);
  const jobs: Array<() => Promise<void>> = [];
  for (const w of reportWindows(gscEnd)) {
    for (const [name, dimensions] of [
      ["GSC Totals", []], ["GSC Pages", ["page"]], ["GSC Queries", ["query"]],
      ["GSC Segments", ["country", "device"]],
      ...(w.period.endsWith("28") ? [["GSC Query Pages", ["query", "page"]]] : []),
    ] as Array<[string, string[]]>) {
      const target = table(name, [...baseHeaders, ...dimensions, "Clicks", "Impressions", "CTR", "Position"]);
      jobs.push(async () => {
        let count = 0;
        let capped = false;
        for (let startRow = 0; startRow < MAX_ROWS; startRow += PAGE_SIZE) {
          const result = await querySearchConsole({ ...w, dimensions, rowLimit: PAGE_SIZE, startRow });
          const rows = result.rows ?? [];
          count += rows.length;
          for (const r of rows) target.rows.push([...prefix(w), ...(r.keys ?? []), r.clicks ?? 0, r.impressions ?? 0, r.ctr ?? 0, r.position ?? 0]);
          if (rows.length < PAGE_SIZE) break;
          if (startRow + PAGE_SIZE === MAX_ROWS) capped = true;
        }
        coverage.rows.push([generatedAt, "GSC", name, ...prefix(w), count, "Not exposed", capped, "Not exposed", "Not exposed", "Not exposed", "America/Los_Angeles", "Final web data; API top rows only. Anonymous queries omitted; page and property aggregation differ. No opportunity filter."]);
      });
    }
  }
  for (const w of reportWindows(gaEnd)) {
    for (const [name, dimensions, metrics] of [
      ["GA4 Totals", [], gaMetrics],
      ["GA4 Pages", ["pagePath"], gaMetrics],
      ["GA4 Landing", ["landingPage", "sessionDefaultChannelGroup"], gaMetrics],
      ["GA4 Geography", ["country", "deviceCategory"], gaMetrics],
      ["GA4 Channels", ["sessionDefaultChannelGroup", "sessionSourceMedium"], gaMetrics],
      ["GA4 Audience", ["newVsReturning"], ["activeUsers", "sessions"]],
      ...(!w.period.endsWith("28") ? [["GA4 Actions", ["pagePath", "eventName"], ["eventCount", "totalUsers"]]] : []),
    ] as Array<[string, string[], string[]]>) {
      const target = table(name, [...baseHeaders, ...dimensions, ...metrics]);
      jobs.push(async () => {
        let count = 0;
        let expected = 0;
        let metadata: Awaited<ReturnType<typeof runGaReport>>["metadata"];
        for (let start = 0; start < MAX_ROWS; start += PAGE_SIZE) {
          const result = await runGaReport({ ...w, dimensions, metrics, dimensionFilter: publicHost,
            orderBys: dimensions.map(dimensionName => ({ dimension: { dimensionName } })), limit: PAGE_SIZE, offset: start });
          metadata = result.metadata;
          const rows = result.rows ?? [];
          expected = result.rowCount ?? rows.length;
          for (const r of rows) target.rows.push([...prefix(w), ...(r.dimensionValues ?? []).map(v => v.value ?? ""), ...(r.metricValues ?? []).map(v => number(v.value))]);
          count += rows.length;
          if (count >= expected || rows.length < PAGE_SIZE) break;
        }
        coverage.rows.push([generatedAt, "GA4", name, ...prefix(w), count, expected, count < expected, metadata?.subjectToThresholding ?? false, metadata?.dataLossFromOtherRow ?? false, Boolean(metadata?.samplingMetadatas?.length), metadata?.timeZone ?? gaDates.metadata?.timeZone ?? "Not exposed", "Production hosts only. pagePath = visited page; landingPage = session entry. Users and sessions are not additive across pages. Independent event users are not ordered funnels; returning users are not cohort retention."]);
      });
    }
  }
  // Bounded concurrency protects the property quota and the existing production job.
  let next = 0;
  await Promise.all(Array.from({ length: 4 }, async () => {
    while (next < jobs.length) await jobs[next++]();
  }));
  const core = table("Core Usage", [...baseHeaders, "Visited page", "Event", "Event count", "Event users", "Status", "Definition", "Interpretation"]);
  for (const w of reportWindows(gaEnd).filter(w => !w.period.endsWith("28"))) {
    const evidence = coverage.rows.find(r => r[2] === "GA4 Actions" && r[3] === w.period);
    const limited = !evidence || evidence.slice(8, 12).some(value => value === true);
    core.rows.push(...coreUsageRows(tables.get("GA4 Actions")?.rows ?? [], w.period, w.startDate, w.endDate, limited));
  }
  for (const t of tables.values()) t.rows.sort((a, b) => String(a[0]).localeCompare(String(b[0])));
  return { generatedAt, gaEnd, gscEnd, tables: [...tables.values()] };
}

async function sheetRequest(path: string, method = "GET", body?: unknown) {
  const token = await getGoogleReportingAccessToken();
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${path}`, {
    method, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}), cache: "no-store", signal: AbortSignal.timeout(25_000),
  });
  if (!response.ok) throw new Error(`sitewide_sheet_${response.status}`);
  return response.json();
}

let inFlight: Promise<{ generatedAt: string; gaEnd: string; gscEnd: string; tables: Array<{ name: string; rows: number }> }> | undefined;
export function syncSitewideReport() {
  if (inFlight) return inFlight;
  inFlight = sync().finally(() => { inFlight = undefined; });
  return inFlight;
}
async function sync() {
  const id = process.env.ANALYTICS_REPORT_SHEET_ID?.trim();
  if (!id || !/^[\w-]{20,}$/.test(id)) throw new Error("sitewide_sheet_not_configured");
  const report = await collectSitewideReport(); // All upstream reads succeed before modifying sheets.
  const metadata = await sheetRequest(`${id}?fields=sheets.properties`);
  const requests: unknown[] = [];
  for (const t of report.tables) {
    const existing = metadata.sheets?.find((s: { properties: { title: string } }) => s.properties.title === t.name)?.properties;
    const rows = Math.max(1000, t.rows.length + 1);
    const columns = Math.max(26, t.headers.length);
    if (!existing) requests.push({ addSheet: { properties: { title: t.name, gridProperties: { rowCount: rows, columnCount: columns, frozenRowCount: 1 } } } });
    else {
      if (existing.gridProperties.rowCount < rows) requests.push({ appendDimension: { sheetId: existing.sheetId, dimension: "ROWS", length: rows - existing.gridProperties.rowCount } });
      if (existing.gridProperties.columnCount < columns) requests.push({ appendDimension: { sheetId: existing.sheetId, dimension: "COLUMNS", length: columns - existing.gridProperties.columnCount } });
    }
  }
  if (requests.length) await sheetRequest(`${id}:batchUpdate`, "POST", { requests });
  // Coverage is the completion marker. Clear it first, publish it only after every table is written.
  await sheetRequest(`${id}/values:batchClear`, "POST", { ranges: ["'Report Coverage'!A:Z"] });
  for (const t of [...report.tables.filter(t => t.name !== "Report Coverage"), report.tables.find(t => t.name === "Report Coverage")!]) {
    await sheetRequest(`${id}/values:batchClear`, "POST", { ranges: [`'${t.name}'!A:Z`] });
    const values = [t.headers, ...t.rows];
    for (let start = 0; start < values.length; start += 5000) {
      await sheetRequest(`${id}/values:batchUpdate`, "POST", { valueInputOption: "RAW", data: [{ range: `'${t.name}'!A${start + 1}`, values: values.slice(start, start + 5000) }] });
    }
  }
  return { generatedAt: report.generatedAt, gaEnd: report.gaEnd, gscEnd: report.gscEnd, tables: report.tables.map(t => ({ name: t.name, rows: t.rows.length })) };
}
