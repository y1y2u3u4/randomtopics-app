import "server-only";

import {
  getAnalyticsSheetSnapshot,
  getGoogleReportingAccessToken,
  type GaEventRow,
  type AnalyticsSheetSnapshot,
  type GrowthPageRow,
} from "@/lib/googleReporting";

import { buildQueryOpportunities, inObservationWindow } from "@/lib/growthOpportunities";

const SHEETS_API_BASE = "https://sheets.googleapis.com/v4/spreadsheets";
const REQUEST_TIMEOUT_MS = 25_000;
const REQUIRED_TABS = [
  "Overview",
  "Daily Summary",
  "Landing Pages",
  "Query Opportunities",
  "Run Log",
] as const;

const STRICT_CONVERSION_VERSION = "strict-post-gen-v1";
const STRICT_CONVERSION_START_DATE = "2026-09-04";
const REPORT_WIDTHS: Record<string, number> = { "Daily Summary": 30, "Landing Pages": 45, "Query Opportunities": 17 };
const STRICT_DAILY_HEADERS = [
  "Conversion Metric Version",
  "Post-Generate Copy Users",
  "Post-Generate Copy / Action-Bar User Rate",
  "Post-Generate Save Users",
  "Post-Generate Save / Action-Bar User Rate",
  "Post-Generate Share Users",
  "Post-Generate Share / Action-Bar User Rate",
  "Post-Generate Action-Bar Users",
] as const;

type SheetMetadataResponse = {
  sheets?: Array<{
    properties?: {
      sheetId?: number;
      title?: string;
      gridProperties?: { columnCount?: number };
    };
  }>;
};

type ValueRangeResponse = {
  values?: unknown[][];
};

export type AnalyticsSheetSyncResult = {
  generatedAt: string;
  reportDate: string;
  gscDate: string;
  dailyRows: number;
  pageRows: number;
  queryRows: number;
};

class AnalyticsSheetError extends Error {
  constructor(public readonly code: string) {
    super(code);
    this.name = "AnalyticsSheetError";
  }
}

function requiredSheetId(): string {
  const value = process.env.ANALYTICS_REPORT_SHEET_ID?.trim();
  if (!value) throw new AnalyticsSheetError("report_sheet_not_configured");
  if (!/^[A-Za-z0-9_-]{20,}$/.test(value)) {
    throw new AnalyticsSheetError("report_sheet_id_invalid");
  }
  return value;
}

function rangePath(range: string): string {
  return encodeURIComponent(range);
}

async function sheetsRequest<T>(
  path: string,
  init: RequestInit,
  errorCode: string
): Promise<T> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const token = await getGoogleReportingAccessToken(attempt > 0);
    const response = await fetch(`${SHEETS_API_BASE}/${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        ...init.headers,
      },
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (response.status === 401 && attempt === 0) continue;
    if (!response.ok) {
      throw new AnalyticsSheetError(`${errorCode}_${response.status}`);
    }
    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  }

  throw new AnalyticsSheetError(errorCode);
}

async function getValues(sheetId: string, range: string): Promise<unknown[][]> {
  const response = await sheetsRequest<ValueRangeResponse>(
    `${sheetId}/values/${rangePath(range)}?majorDimension=ROWS`,
    { method: "GET" },
    "sheet_values_read_failed"
  );
  return response.values ?? [];
}

async function clearRanges(sheetId: string, ranges: string[]): Promise<void> {
  await sheetsRequest(
    `${sheetId}/values:batchClear`,
    { method: "POST", body: JSON.stringify({ ranges }) },
    "sheet_clear_failed"
  );
}

async function writeRanges(
  sheetId: string,
  data: Array<{ range: string; values: unknown[][] }>
): Promise<void> {
  await sheetsRequest(
    `${sheetId}/values:batchUpdate`,
    {
      method: "POST",
      body: JSON.stringify({ valueInputOption: "RAW", data }),
    },
    "sheet_write_failed"
  );
}

async function assertExpectedTabs(sheetId: string): Promise<void> {
  const metadata = await sheetsRequest<SheetMetadataResponse>(
    `${sheetId}?fields=sheets.properties(sheetId,title,gridProperties.columnCount)`,
    { method: "GET" },
    "sheet_metadata_failed"
  );
  const existing = new Set(
    (metadata.sheets ?? [])
      .map((sheet) => sheet.properties?.title)
      .filter((title): title is string => Boolean(title))
  );
  const missing = REQUIRED_TABS.filter((title) => !existing.has(title));
  if (missing.length > 0) {
    throw new AnalyticsSheetError("report_sheet_tabs_missing");
  }

  const requests = [];
  for (const [title, requiredWidth] of Object.entries(REPORT_WIDTHS)) {
    const properties = metadata.sheets?.find((sheet) => sheet.properties?.title === title)?.properties;
    const columns = properties?.gridProperties?.columnCount ?? 0;
    if (properties?.sheetId === undefined || !columns) throw new AnalyticsSheetError("report_grid_missing");
    if (columns < requiredWidth) requests.push({ appendDimension: { sheetId: properties.sheetId, dimension: "COLUMNS", length: requiredWidth - columns } });
  }
  if (requests.length) await sheetsRequest(`${sheetId}:batchUpdate`, {
    method: "POST", body: JSON.stringify({ requests }),
  }, "report_grid_expand_failed");
}

function safeRate(numerator: number, denominator: number): number {
  return denominator > 0 ? numerator / denominator : 0;
}

function eventByName(events: GaEventRow[], name: string): GaEventRow {
  return (
    events.find((event) => event.eventName === name) ?? {
      eventName: name,
      eventCount: 0,
      keyEvents: 0,
      totalUsers: 0,
      sessions: 0,
    }
  );
}

function pageDecision(page: GrowthPageRow, snapshotDate: string): string {
  if (inObservationWindow(page.path, snapshotDate)) return "Observe recent release";
  const search = page.searchConsole.current7;
  if (page.launchedRecently && search.impressions < 30) return "Observe";
  if (
    search.impressions >= 100 &&
    search.position >= 5 &&
    search.position <= 20 &&
    search.ctr < 0.05
  ) {
    return "Improve";
  }
  if (search.impressions >= 50 && search.position <= 10 && search.ctr >= 0.05) {
    return "Maintain; review distinct sub-intents";
  }
  return search.impressions >= 100 ? "Improve" : "Observe";
}

function landingPageRows(
  pages: GrowthPageRow[],
  snapshot: AnalyticsSheetSnapshot
): unknown[][] {
  return pages.map((page) => [
    snapshot.searchConsole.latestDate,
    "Last complete 7 days (GA4 / GSC dates differ)",
    page.path,
    page.ga4.current7.activeUsers,
    page.ga4.current7.sessions,
    page.ga4.funnel7.successUsers,
    page.ga4.funnel7.postGenerateCopyUsers,
    page.ga4.funnel7.postGenerateSaveUsers,
    page.ga4.funnel7.postGenerateShareUsers,
    safeRate(page.ga4.funnel7.successSessions, page.ga4.current7.sessions),
    page.searchConsole.current7.clicks,
    page.searchConsole.current7.impressions,
    page.searchConsole.current7.ctr,
    page.searchConsole.current7.position,
    pageDecision(page, snapshot.searchConsole.latestDate),
    snapshot.ga4.current7Range.startDate,
    snapshot.ga4.current7Range.endDate,
    snapshot.searchConsole.current7Range.startDate,
    snapshot.searchConsole.current7Range.endDate,
    page.ga4.funnel7.postGenerateActionUsers,
    safeRate(page.ga4.funnel7.postGenerateCopyUsers, page.ga4.funnel7.postGenerateActionUsers),
    safeRate(page.ga4.funnel7.postGenerateSaveUsers, page.ga4.funnel7.postGenerateActionUsers),
    safeRate(page.ga4.funnel7.postGenerateShareUsers, page.ga4.funnel7.postGenerateActionUsers),
    page.ga4.previous7.activeUsers,
    page.ga4.previous7.sessions,
    page.searchConsole.previous7.clicks,
    page.searchConsole.previous7.impressions,
    page.searchConsole.previous7.ctr,
    page.searchConsole.previous7.position,
    page.ga4.current7.screenPageViews,
    page.ga4.funnel7.starts,
    page.ga4.funnel7.successes,
    page.ga4.funnel7.errors,
    safeRate(page.ga4.funnel7.successes, page.ga4.funnel7.starts),
    page.ga4.funnel7.copies,
    page.ga4.funnel7.copyUsers,
    page.ga4.funnel7.saves,
    page.ga4.funnel7.saveUsers,
    page.ga4.funnel7.shares,
    page.ga4.funnel7.shareUsers,
    page.ga4.funnel7.weeklyPlanGenerates,
    page.ga4.funnel7.weeklyPlanUsers,
    page.ga4.funnel7.weeklyPlanCopies,
    page.ga4.funnel7.weeklyPlanCopyUsers,
    page.ga4.previous7.screenPageViews,
  ]);
}

function nextRowForDate(rows: unknown[][], reportDate: string): number {
  const index = rows.findIndex((row) => String(row[0] ?? "") === reportDate);
  if (index >= 0) return index + 2;
  const placeholder = String(rows[0]?.[0] ?? "").toLowerCase();
  if (!placeholder || placeholder === "pending" || placeholder.startsWith("awaiting")) {
    return 2;
  }
  return rows.length + 2;
}

function nextRunLogRow(rows: unknown[][]): number {
  const firstStatus = String(rows[0]?.[1] ?? "").toLowerCase();
  if (rows.length === 0 || firstStatus === "pending") return 2;
  return rows.length + 2;
}

export async function syncAnalyticsReportToSheet(): Promise<AnalyticsSheetSyncResult> {
  const sheetId = requiredSheetId();
  await assertExpectedTabs(sheetId);

  const snapshot = await getAnalyticsSheetSnapshot(true);
  const [dailyDates, runLog] = await Promise.all([
    getValues(sheetId, "'Daily Summary'!A2:A1000"),
    getValues(sheetId, "'Run Log'!A2:B1000"),
  ]);

  const start = eventByName(snapshot.ga4.eventsYesterday, "generate_start");
  const success = eventByName(snapshot.ga4.eventsYesterday, "generate_success");
  const copy = eventByName(snapshot.ga4.eventsYesterday, "copy_result");
  const save = eventByName(snapshot.ga4.eventsYesterday, "save_result");
  const share = eventByName(snapshot.ga4.eventsYesterday, "share_result");
  const postGenerateActionView = eventByName(
    snapshot.ga4.eventsYesterday,
    "post_generate_actions_view"
  );
  const postGenerateCopy = eventByName(
    snapshot.ga4.eventsYesterday,
    "post_generate_copy"
  );
  const postGenerateSave = eventByName(
    snapshot.ga4.eventsYesterday,
    "post_generate_save"
  );
  const postGenerateShare = eventByName(
    snapshot.ga4.eventsYesterday,
    "post_generate_share"
  );
  const users = snapshot.ga4.yesterday.activeUsers;
  const strictVersion = snapshot.reportDate < STRICT_CONVERSION_START_DATE
    ? ""
    : snapshot.reportDate === STRICT_CONVERSION_START_DATE
      ? `${STRICT_CONVERSION_VERSION}-partial-cutover`
      : STRICT_CONVERSION_VERSION;
  const strictValue = (value: number) => strictVersion ? value : "";
  const dailyRow = [
    snapshot.reportDate,
    snapshot.generatedAt,
    users,
    snapshot.ga4.yesterday.sessions,
    snapshot.ga4.yesterday.screenPageViews,
    snapshot.ga4.yesterday.engagedSessions,
    safeRate(snapshot.ga4.yesterday.userEngagementDuration, users),
    start.totalUsers,
    success.totalUsers,
    safeRate(success.eventCount, start.eventCount),
    copy.totalUsers,
    safeRate(copy.totalUsers, users),
    save.totalUsers,
    safeRate(save.totalUsers, users),
    share.totalUsers,
    safeRate(share.totalUsers, users),
    snapshot.searchConsole.latestDate,
    snapshot.searchConsole.latestDay.clicks,
    snapshot.searchConsole.latestDay.impressions,
    snapshot.searchConsole.latestDay.ctr,
    snapshot.searchConsole.latestDay.position,
    "Complete",
    strictVersion,
    strictValue(postGenerateCopy.totalUsers),
    strictValue(safeRate(postGenerateCopy.totalUsers, postGenerateActionView.totalUsers)),
    strictValue(postGenerateSave.totalUsers),
    strictValue(safeRate(postGenerateSave.totalUsers, postGenerateActionView.totalUsers)),
    strictValue(postGenerateShare.totalUsers),
    strictValue(safeRate(postGenerateShare.totalUsers, postGenerateActionView.totalUsers)),
    strictValue(postGenerateActionView.totalUsers),
  ];

  const pageRows = landingPageRows(
    snapshot.growthPages,
    snapshot
  );
  const opportunities = buildQueryOpportunities(
    snapshot.searchConsole.queryPages28,
    snapshot.searchConsole.current28Range
  );
  const opportunityRows = opportunities.values;
  const dailyTargetRow = nextRowForDate(dailyDates, snapshot.reportDate);
  const runTargetRow = nextRunLogRow(runLog);

  await clearRanges(sheetId, [
    "'Landing Pages'!A2:AS1000",
    "'Query Opportunities'!A2:Q1000",
  ]);
  await writeRanges(sheetId, [
    { range: "'Landing Pages'!C1:C1", values: [["Visited Page (GA4 pagePath)"]] },
    {
      range: "'Landing Pages'!P1:AC1",
      values: [["GA4 Window Start", "GA4 Window End", "GSC Window Start", "GSC Window End", "Action-Bar Users", "Strict Copy / Action-Bar User Rate", "Strict Save / Action-Bar User Rate", "Strict Share / Action-Bar User Rate", "Previous 7d GA4 Active Users", "Previous 7d GA4 Sessions", "Previous 7d GSC Clicks", "Previous 7d GSC Impressions", "Previous 7d GSC CTR", "Previous 7d GSC Position"]],
    },
    {
      range: "'Landing Pages'!AD1:AS1",
      values: [["GA4 Page Views", "Generate Start Events", "Generate Success Events", "Generate Error Events", "Technical Generate Success Rate", "Copy Events", "Copy Users", "Save Events", "Save Users", "Share Events", "Share Users", "Weekly Plan Generate Events", "Weekly Plan Users", "Weekly Plan Copy Events", "Weekly Plan Copy Users", "Previous 7d GA4 Page Views"]],
    },
    {
      range: "'Query Opportunities'!M1:Q1",
      values: [["Window", "Window Start", "Window End", "Intended Canonical Owner", "Ownership Review"]],
    },
    {
      range: "'Daily Summary'!W1:AD1",
      values: [[...STRICT_DAILY_HEADERS]],
    },
    {
      range: "'Landing Pages'!F1:I1",
      values: [["Generated Users", "Strict Post-Generate Copy Users", "Strict Post-Generate Save Users", "Strict Post-Generate Share Users"]],
    },
    {
      range: `'Daily Summary'!A${dailyTargetRow}:AD${dailyTargetRow}`,
      values: [dailyRow],
    },
    {
      range: `'Landing Pages'!A2:AS${pageRows.length + 1}`,
      values: pageRows,
    },
    {
      range: `'Query Opportunities'!A2:Q${opportunityRows.length + 1}`,
      values: opportunityRows,
    },
    {
      range: `'Run Log'!A${runTargetRow}:H${runTargetRow}`,
      values: [[
        snapshot.generatedAt,
        "Success",
        snapshot.reportDate,
        snapshot.searchConsole.latestDate,
        1,
        pageRows.length,
        opportunityRows.length,
        `Synchronized. Filtered ${opportunities.excludedRows} noisy query/page rows. Query window: 28 days; page window: 7 days.`,
      ]],
    },
  ]);

  return {
    generatedAt: snapshot.generatedAt,
    reportDate: snapshot.reportDate,
    gscDate: snapshot.searchConsole.latestDate,
    dailyRows: 1,
    pageRows: pageRows.length,
    queryRows: opportunityRows.length,
  };
}

export function analyticsSheetErrorCode(error: unknown): string {
  return error instanceof AnalyticsSheetError ? error.code : "unexpected_error";
}
