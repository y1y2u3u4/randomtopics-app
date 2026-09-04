import "server-only";

import {
  getAnalyticsSheetSnapshot,
  getGoogleReportingAccessToken,
  type GaEventRow,
  type GscQueryPageRow,
  type GrowthPageRow,
} from "@/lib/googleReporting";

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
const DAILY_SUMMARY_COLUMN_COUNT = 29;
const STRICT_DAILY_HEADERS = [
  "Conversion Metric Version",
  "Post-Generate Copy Users",
  "Post-Generate Copy / Action-Bar User Rate",
  "Post-Generate Save Users",
  "Post-Generate Save / Action-Bar User Rate",
  "Post-Generate Share Users",
  "Post-Generate Share / Action-Bar User Rate",
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

  const dailySummary = (metadata.sheets ?? []).find(
    (sheet) => sheet.properties?.title === "Daily Summary"
  )?.properties;
  const columnCount = dailySummary?.gridProperties?.columnCount ?? 0;
  if (dailySummary?.sheetId === undefined || columnCount === 0) {
    throw new AnalyticsSheetError("daily_summary_grid_missing");
  }
  if (columnCount < DAILY_SUMMARY_COLUMN_COUNT) {
    await sheetsRequest(
      `${sheetId}:batchUpdate`,
      {
        method: "POST",
        body: JSON.stringify({
          requests: [{
            appendDimension: {
              sheetId: dailySummary.sheetId,
              dimension: "COLUMNS",
              length: DAILY_SUMMARY_COLUMN_COUNT - columnCount,
            },
          }],
        }),
      },
      "daily_summary_expand_failed"
    );
  }
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

function normalizePage(value: string): string {
  try {
    return new URL(value).pathname;
  } catch {
    return value;
  }
}

function pageDecision(page: GrowthPageRow): string {
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
    return "Scale";
  }
  return search.impressions >= 100 ? "Improve" : "Observe";
}

function queryOpportunityScore(row: GscQueryPageRow): number {
  const clickGap = Math.max(0, 0.05 - row.ctr);
  const positionFactor = Math.max(0.2, (21 - row.position) / 16);
  return Math.round(row.impressions * clickGap * positionFactor * 100) / 100;
}

function queryOpportunities(
  rows: GscQueryPageRow[],
  snapshotDate: string
): unknown[][] {
  const candidates = rows
    .filter(
      (row) =>
        row.impressions >= 50 &&
        row.position >= 5 &&
        row.position <= 20 &&
        row.ctr < 0.05
    )
    .map((row) => ({ row, score: queryOpportunityScore(row) }))
    .sort((left, right) => right.score - left.score)
    .slice(0, 200);

  if (candidates.length === 0) {
    return [[snapshotDate, "No qualifying query", null, 0, 0, 0, 0, 0, "Review", "Observe until more data accrues", "Observe", "No query met the configured opportunity threshold."]];
  }

  return candidates.map(({ row, score }) => [
    snapshotDate,
    row.query,
    normalizePage(row.page),
    row.clicks,
    row.impressions,
    row.ctr,
    row.position,
    score,
    "Review",
    normalizePage(row.page) === "/"
      ? "Assess independent use case; build only if intent is distinct"
      : "Improve the owning page, snippet, and internal links",
    "Candidate",
    "High impressions, position 5–20, and CTR below 5%.",
  ]);
}

function landingPageRows(
  pages: GrowthPageRow[],
  snapshotDate: string
): unknown[][] {
  return pages.map((page) => [
    snapshotDate,
    "Last complete 7 days",
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
    pageDecision(page),
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
  ];

  const pageRows = landingPageRows(
    snapshot.growthPages,
    snapshot.searchConsole.latestDate
  );
  const opportunityRows = queryOpportunities(
    snapshot.searchConsole.queryPages28,
    snapshot.searchConsole.latestDate
  );
  const dailyTargetRow = nextRowForDate(dailyDates, snapshot.reportDate);
  const runTargetRow = nextRunLogRow(runLog);

  await clearRanges(sheetId, [
    "'Landing Pages'!A2:O1000",
    "'Query Opportunities'!A2:L1000",
  ]);
  await writeRanges(sheetId, [
    {
      range: "'Daily Summary'!W1:AC1",
      values: [[...STRICT_DAILY_HEADERS]],
    },
    {
      range: "'Landing Pages'!F1:I1",
      values: [["Generated Users", "Strict Post-Generate Copy Users", "Strict Post-Generate Save Users", "Strict Post-Generate Share Users"]],
    },
    {
      range: `'Daily Summary'!A${dailyTargetRow}:AC${dailyTargetRow}`,
      values: [dailyRow],
    },
    {
      range: `'Landing Pages'!A2:O${pageRows.length + 1}`,
      values: pageRows,
    },
    {
      range: `'Query Opportunities'!A2:L${opportunityRows.length + 1}`,
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
        "GA4, Search Console, and opportunity data synchronized.",
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
