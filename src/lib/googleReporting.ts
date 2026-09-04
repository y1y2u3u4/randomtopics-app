import "server-only";

import { createSign } from "node:crypto";

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const ANALYTICS_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
const SEARCH_CONSOLE_SCOPE =
  "https://www.googleapis.com/auth/webmasters.readonly";
const SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
const REQUEST_TIMEOUT_MS = 15_000;
const DASHBOARD_CACHE_MS = 5 * 60 * 1000;

type ServiceAccountCredentials = {
  client_email: string;
  private_key: string;
  project_id?: string;
  type?: string;
};

type GoogleTokenResponse = {
  access_token?: string;
  expires_in?: number;
};

type GaRow = {
  dimensionValues?: Array<{ value?: string }>;
  metricValues?: Array<{ value?: string }>;
};

type GaReportResponse = {
  rows?: GaRow[];
};

type GscRow = {
  keys?: string[];
  clicks?: number;
  impressions?: number;
  ctr?: number;
  position?: number;
};

type GscResponse = {
  rows?: GscRow[];
};

export type GaSummary = {
  activeUsers: number;
  sessions: number;
  screenPageViews: number;
  engagedSessions: number;
  userEngagementDuration: number;
  eventCount: number;
  keyEvents: number;
};

export type GaEventRow = {
  eventName: string;
  eventCount: number;
  keyEvents: number;
  totalUsers: number;
  sessions: number;
};

export type GaPageRow = {
  path: string;
  activeUsers: number;
  screenPageViews: number;
  keyEvents: number;
};

export type GrowthPageFunnel = {
  starts: number;
  successes: number;
  successUsers: number;
  successSessions: number;
  errors: number;
  postGenerateActionViews: number;
  postGenerateActionUsers: number;
  copies: number;
  copyUsers: number;
  saves: number;
  saveUsers: number;
  shares: number;
  shareUsers: number;
  postGenerateCopies: number;
  postGenerateCopyUsers: number;
  postGenerateSaves: number;
  postGenerateSaveUsers: number;
  postGenerateShares: number;
  postGenerateShareUsers: number;
  timerStarts: number;
  timerCompletes: number;
};

export type GrowthPageRow = {
  label: string;
  path: string;
  launchedRecently: boolean;
  ga4: {
    current7: Pick<GaSummary, "activeUsers" | "sessions" | "screenPageViews">;
    previous7: Pick<GaSummary, "activeUsers" | "sessions" | "screenPageViews">;
    funnel7: GrowthPageFunnel;
  };
  searchConsole: {
    current7: GscSummary;
    previous7: GscSummary;
  };
};

export type GaDailyRow = GaSummary & { date: string };

export type GscSummary = {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
};

export type GscDimensionRow = GscSummary & { key: string };

export type GscQueryPageRow = GscSummary & {
  query: string;
  page: string;
};

export type AnalyticsSheetSnapshot = {
  generatedAt: string;
  reportDate: string;
  ga4: {
    yesterday: GaSummary;
    eventsYesterday: GaEventRow[];
  };
  searchConsole: {
    latestDate: string;
    latestDay: GscSummary;
    queryPages28: GscQueryPageRow[];
  };
  growthPages: GrowthPageRow[];
};

export type AnalyticsDashboardData = {
  generatedAt: string;
  ga4: {
    today: GaSummary;
    yesterday: GaSummary;
    current7: GaSummary;
    previous7: GaSummary;
    current28: GaSummary;
    previous28: GaSummary;
    events7: GaEventRow[];
    previousEvents7: GaEventRow[];
    events28: GaEventRow[];
    pages28: GaPageRow[];
    daily28: GaDailyRow[];
  };
  searchConsole: {
    latestDate: string;
    current7Range: { startDate: string; endDate: string };
    previous7Range: { startDate: string; endDate: string };
    current28Range: { startDate: string; endDate: string };
    previous28Range: { startDate: string; endDate: string };
    current7: GscSummary;
    previous7: GscSummary;
    current28: GscSummary;
    previous28: GscSummary;
    pages28: GscDimensionRow[];
    queries28: GscDimensionRow[];
    daily28: GscDimensionRow[];
  };
  growthPages: GrowthPageRow[];
};

const MONITORED_GROWTH_PAGES = [
  { label: "QOTD · Students", path: "/question-of-the-day-for-students", launchedRecently: true },
  { label: "QOTD · Work", path: "/question-of-the-day-for-work", launchedRecently: true },
  { label: "Ethical · Students", path: "/topics/ethical-dilemmas-for-students", launchedRecently: true },
  { label: "Ethical · Workplace", path: "/topics/workplace-ethical-dilemmas", launchedRecently: true },
  { label: "Ethical · Adults", path: "/topics/ethical-dilemmas-for-adults", launchedRecently: true },
  { label: "Deep Conversation", path: "/deep-conversation-question-generator", launchedRecently: true },
  { label: "Speech · 5 Minute", path: "/5-minute-speech-topics", launchedRecently: true },
  { label: "QOTD · Funny", path: "/funny-question-of-the-day", launchedRecently: true },
  { label: "Ethical hub", path: "/topics/ethical-dilemma-questions", launchedRecently: false },
  { label: "Question of the Day", path: "/question-of-the-day", launchedRecently: false },
  { label: "Toastmasters", path: "/topics/toastmasters-table-topics", launchedRecently: false },
  { label: "Spanish Most Likely To", path: "/es/topics/most-likely-to-questions", launchedRecently: false },
  { label: "Conversation", path: "/conversation", launchedRecently: false },
  { label: "Writing", path: "/writing", launchedRecently: false },
  { label: "Writing Topic Generator", path: "/writing-topic-generator", launchedRecently: false },
  { label: "Speech", path: "/speech", launchedRecently: false },
  { label: "Table Topics Generator", path: "/table-topics-generator", launchedRecently: false },
  { label: "Random Subject", path: "/random-subject-generator", launchedRecently: false },
] as const;

const FUNNEL_EVENT_NAMES = [
  "generate_start",
  "generate_success",
  "generate_error",
  "post_generate_actions_view",
  "copy_result",
  "save_result",
  "share_result",
  "post_generate_copy",
  "post_generate_save",
  "post_generate_share",
  "timer_start",
  "timer_complete",
] as const;

class ReportingError extends Error {
  constructor(public readonly code: string) {
    super(code);
    this.name = "ReportingError";
  }
}
let cachedToken: { value: string; expiresAt: number } | null = null;
let cachedDashboard:
  | { value: AnalyticsDashboardData; expiresAt: number }
  | null = null;

function base64Url(value: string): string {
  return Buffer.from(value).toString("base64url");
}

function unwrapCredentialValue(value: string): string {
  let candidate = value.trim();
  const assignmentPrefix = "GOOGLE_SERVICE_ACCOUNT_JSON_BASE64=";
  if (candidate.startsWith(assignmentPrefix)) {
    candidate = candidate.slice(assignmentPrefix.length).trim();
  }

  if (
    (candidate.startsWith("'") && candidate.endsWith("'")) ||
    (candidate.startsWith('"') && candidate.endsWith('"'))
  ) {
    candidate = candidate.slice(1, -1).trim();
  }
  return candidate;
}

function parseCredentials(): ServiceAccountCredentials {
  const configured = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64;
  if (!configured?.trim()) {
    throw new ReportingError("service_account_not_configured");
  }

  const value = unwrapCredentialValue(configured);
  const json = value.startsWith("{")
    ? value
    : Buffer.from(value.replace(/\s+/g, ""), "base64").toString("utf8").trim();

  let parsed: ServiceAccountCredentials;
  try {
    parsed = JSON.parse(json) as ServiceAccountCredentials;
  } catch {
    throw new ReportingError("service_account_json_invalid");
  }

  if (parsed.type !== "service_account") {
    throw new ReportingError("service_account_type_invalid");
  }
  if (!parsed.client_email?.endsWith(".iam.gserviceaccount.com")) {
    throw new ReportingError("service_account_email_invalid");
  }
  if (!parsed.private_key?.includes("BEGIN PRIVATE KEY")) {
    throw new ReportingError("service_account_private_key_invalid");
  }

  return parsed;
}

function requiredEnv(name: "GA4_PROPERTY_ID" | "GSC_SITE_URL"): string {
  const value = process.env[name]?.trim();
  if (!value) throw new ReportingError(`${name.toLowerCase()}_not_configured`);
  return value;
}

export async function getGoogleReportingAccessToken(
  forceRefresh = false
): Promise<string> {
  if (
    !forceRefresh &&
    cachedToken &&
    cachedToken.expiresAt > Date.now() + 60_000
  ) {
    return cachedToken.value;
  }

  const credentials = parseCredentials();
  const issuedAt = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = base64Url(
    JSON.stringify({
      iss: credentials.client_email,
      scope: `${ANALYTICS_SCOPE} ${SEARCH_CONSOLE_SCOPE} ${SHEETS_SCOPE}`,
      aud: GOOGLE_TOKEN_URL,
      iat: issuedAt,
      exp: issuedAt + 3600,
    })
  );
  const unsignedJwt = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsignedJwt);
  signer.end();
  const assertion = `${unsignedJwt}.${signer
    .sign(credentials.private_key)
    .toString("base64url")}`;

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });

  if (!response.ok) throw new ReportingError("google_token_exchange_failed");
  const body = (await response.json()) as GoogleTokenResponse;
  if (!body.access_token) throw new ReportingError("google_token_missing");

  cachedToken = {
    value: body.access_token,
    expiresAt: Date.now() + (body.expires_in ?? 3600) * 1000,
  };
  return body.access_token;
}

async function postGoogleJson<T>(
  url: string,
  body: unknown,
  errorCode: string
): Promise<T> {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const token = await getGoogleReportingAccessToken(attempt > 0);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });

    if (response.status === 401 && attempt === 0) {
      cachedToken = null;
      continue;
    }
    if (!response.ok) throw new ReportingError(`${errorCode}_${response.status}`);
    return (await response.json()) as T;
  }

  throw new ReportingError(errorCode);
}

async function runGaReport(input: {
  startDate: string;
  endDate: string;
  dimensions?: string[];
  metrics: string[];
  dimensionFilter?: unknown;
  orderBys?: unknown[];
  limit?: number;
}): Promise<GaReportResponse> {
  const propertyId = requiredEnv("GA4_PROPERTY_ID");
  if (!/^\d+$/.test(propertyId)) {
    throw new ReportingError("ga4_property_id_invalid");
  }

  return postGoogleJson<GaReportResponse>(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      dateRanges: [{ startDate: input.startDate, endDate: input.endDate }],
      dimensions: input.dimensions?.map((name) => ({ name })),
      metrics: input.metrics.map((name) => ({ name })),
      dimensionFilter: input.dimensionFilter,
      orderBys: input.orderBys,
      limit: input.limit,
      keepEmptyRows: false,
    },
    "ga4_report_failed"
  );
}

async function querySearchConsole(input: {
  startDate: string;
  endDate: string;
  dimensions?: string[];
  rowLimit?: number;
}): Promise<GscResponse> {
  const siteUrl = requiredEnv("GSC_SITE_URL");
  return postGoogleJson<GscResponse>(
    `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
      siteUrl
    )}/searchAnalytics/query`,
    {
      startDate: input.startDate,
      endDate: input.endDate,
      dimensions: input.dimensions,
      rowLimit: input.rowLimit ?? 25_000,
      aggregationType: "auto",
    },
    "gsc_query_failed"
  );
}

function metricValue(row: GaRow | undefined, index: number): number {
  const value = Number(row?.metricValues?.[index]?.value ?? 0);
  return Number.isFinite(value) ? value : 0;
}

async function getGaSummary(
  startDate: string,
  endDate: string
): Promise<GaSummary> {
  const response = await runGaReport({
    startDate,
    endDate,
    metrics: [
      "activeUsers",
      "sessions",
      "screenPageViews",
      "engagedSessions",
      "userEngagementDuration",
      "eventCount",
      "keyEvents",
    ],
  });
  const row = response.rows?.[0];
  return {
    activeUsers: metricValue(row, 0),
    sessions: metricValue(row, 1),
    screenPageViews: metricValue(row, 2),
    engagedSessions: metricValue(row, 3),
    userEngagementDuration: metricValue(row, 4),
    eventCount: metricValue(row, 5),
    keyEvents: metricValue(row, 6),
  };
}

async function getGaEvents(
  startDate: string,
  endDate: string
): Promise<GaEventRow[]> {
  const trackedEvents = [
    "generate_start",
    "generate_success",
    "generate_topic",
    "generate_error",
    "repeat_generate",
    "copy_result",
    "copy_error",
    "post_generate_actions_view",
    "post_generate_copy",
    "save_result",
    "save_error",
    "remove_saved_result",
    "unsave_result",
    "post_generate_save",
    "share_result",
    "share_error",
    "post_generate_share",
    "print_open",
    "print_content",
    "timer_start",
    "timer_complete",
    "spin_success",
  ];
  const response = await runGaReport({
    startDate,
    endDate,
    dimensions: ["eventName"],
    metrics: ["eventCount", "keyEvents", "totalUsers", "sessions"],
    dimensionFilter: {
      filter: {
        fieldName: "eventName",
        inListFilter: { values: trackedEvents, caseSensitive: true },
      },
    },
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    limit: trackedEvents.length,
  });

  return (response.rows ?? []).map((row) => ({
    eventName: row.dimensionValues?.[0]?.value ?? "unknown",
    eventCount: metricValue(row, 0),
    keyEvents: metricValue(row, 1),
    totalUsers: metricValue(row, 2),
    sessions: metricValue(row, 3),
  }));
}

async function getGaEventWindows(): Promise<{
  current7: GaEventRow[];
  previous7: GaEventRow[];
  current28: GaEventRow[];
}> {
  // Keep these sequential so one dashboard refresh stays below the GA Data
  // API's concurrent-request quota for a property.
  const current7 = await getGaEvents("7daysAgo", "yesterday");
  const previous7 = await getGaEvents("14daysAgo", "8daysAgo");
  const current28 = await getGaEvents("28daysAgo", "yesterday");
  return { current7, previous7, current28 };
}

type GrowthGaPeriod = Pick<GaSummary, "activeUsers" | "sessions" | "screenPageViews">;

function emptyGaPeriod(): GrowthGaPeriod {
  return { activeUsers: 0, sessions: 0, screenPageViews: 0 };
}

function emptyGrowthFunnel(): GrowthPageFunnel {
  return {
    starts: 0,
    successes: 0,
    successUsers: 0,
    successSessions: 0,
    errors: 0,
    postGenerateActionViews: 0,
    postGenerateActionUsers: 0,
    copies: 0,
    copyUsers: 0,
    saves: 0,
    saveUsers: 0,
    shares: 0,
    shareUsers: 0,
    postGenerateCopies: 0,
    postGenerateCopyUsers: 0,
    postGenerateSaves: 0,
    postGenerateSaveUsers: 0,
    postGenerateShares: 0,
    postGenerateShareUsers: 0,
    timerStarts: 0,
    timerCompletes: 0,
  };
}

function monitoredPathFilter() {
  return {
    filter: {
      fieldName: "pagePath",
      inListFilter: {
        values: MONITORED_GROWTH_PAGES.map((page) => page.path),
        caseSensitive: true,
      },
    },
  };
}

async function getGaGrowthPagePeriod(
  startDate: string,
  endDate: string
): Promise<Map<string, GrowthGaPeriod>> {
  const response = await runGaReport({
    startDate,
    endDate,
    dimensions: ["pagePath"],
    metrics: ["activeUsers", "sessions", "screenPageViews"],
    dimensionFilter: monitoredPathFilter(),
    limit: MONITORED_GROWTH_PAGES.length,
  });

  return new Map(
    (response.rows ?? []).map((row) => [
      row.dimensionValues?.[0]?.value ?? "",
      {
        activeUsers: metricValue(row, 0),
        sessions: metricValue(row, 1),
        screenPageViews: metricValue(row, 2),
      },
    ])
  );
}

async function getGaGrowthPageFunnel(): Promise<Map<string, GrowthPageFunnel>> {
  const response = await runGaReport({
    startDate: "7daysAgo",
    endDate: "yesterday",
    dimensions: ["pagePath", "eventName"],
    metrics: ["eventCount", "totalUsers", "sessions"],
    dimensionFilter: {
      andGroup: {
        expressions: [
          monitoredPathFilter(),
          {
            filter: {
              fieldName: "eventName",
              inListFilter: {
                values: [...FUNNEL_EVENT_NAMES],
                caseSensitive: true,
              },
            },
          },
        ],
      },
    },
    limit: MONITORED_GROWTH_PAGES.length * FUNNEL_EVENT_NAMES.length,
  });

  const result = new Map<string, GrowthPageFunnel>();
  for (const row of response.rows ?? []) {
    const path = row.dimensionValues?.[0]?.value ?? "";
    const event = row.dimensionValues?.[1]?.value ?? "";
    const funnel = result.get(path) ?? emptyGrowthFunnel();
    const value = metricValue(row, 0);
    if (event === "generate_start") funnel.starts = value;
    if (event === "generate_success") {
      funnel.successes = value;
      funnel.successUsers = metricValue(row, 1);
      funnel.successSessions = metricValue(row, 2);
    }
    if (event === "generate_error") funnel.errors = value;
    if (event === "post_generate_actions_view") {
      funnel.postGenerateActionViews = value;
      funnel.postGenerateActionUsers = metricValue(row, 1);
    }
    if (event === "copy_result") {
      funnel.copies = value;
      funnel.copyUsers = metricValue(row, 1);
    }
    if (event === "save_result") {
      funnel.saves = value;
      funnel.saveUsers = metricValue(row, 1);
    }
    if (event === "share_result") {
      funnel.shares = value;
      funnel.shareUsers = metricValue(row, 1);
    }
    if (event === "post_generate_copy") {
      funnel.postGenerateCopies = value;
      funnel.postGenerateCopyUsers = metricValue(row, 1);
    }
    if (event === "post_generate_save") {
      funnel.postGenerateSaves = value;
      funnel.postGenerateSaveUsers = metricValue(row, 1);
    }
    if (event === "post_generate_share") {
      funnel.postGenerateShares = value;
      funnel.postGenerateShareUsers = metricValue(row, 1);
    }
    if (event === "timer_start") funnel.timerStarts = value;
    if (event === "timer_complete") funnel.timerCompletes = value;
    result.set(path, funnel);
  }
  return result;
}

async function getGaGrowthPages(): Promise<{
  current7: Map<string, GrowthGaPeriod>;
  previous7: Map<string, GrowthGaPeriod>;
  funnels: Map<string, GrowthPageFunnel>;
}> {
  // Run sequentially to preserve reporting API concurrency headroom.
  const current7 = await getGaGrowthPagePeriod("7daysAgo", "yesterday");
  const previous7 = await getGaGrowthPagePeriod("14daysAgo", "8daysAgo");
  const funnels = await getGaGrowthPageFunnel();
  return { current7, previous7, funnels };
}

async function getGaPages(): Promise<GaPageRow[]> {
  const response = await runGaReport({
    startDate: "28daysAgo",
    endDate: "today",
    dimensions: ["pagePath"],
    metrics: ["activeUsers", "screenPageViews", "keyEvents"],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: 20,
  });

  return (response.rows ?? []).map((row) => ({
    path: row.dimensionValues?.[0]?.value ?? "(not set)",
    activeUsers: metricValue(row, 0),
    screenPageViews: metricValue(row, 1),
    keyEvents: metricValue(row, 2),
  }));
}

async function getGaDaily(): Promise<GaDailyRow[]> {
  const response = await runGaReport({
    startDate: "28daysAgo",
    endDate: "yesterday",
    dimensions: ["date"],
    metrics: [
      "activeUsers",
      "sessions",
      "screenPageViews",
      "engagedSessions",
      "userEngagementDuration",
      "eventCount",
      "keyEvents",
    ],
    orderBys: [{ dimension: { dimensionName: "date" }, desc: false }],
    limit: 40,
  });

  return (response.rows ?? []).map((row) => ({
    date: row.dimensionValues?.[0]?.value ?? "",
    activeUsers: metricValue(row, 0),
    sessions: metricValue(row, 1),
    screenPageViews: metricValue(row, 2),
    engagedSessions: metricValue(row, 3),
    userEngagementDuration: metricValue(row, 4),
    eventCount: metricValue(row, 5),
    keyEvents: metricValue(row, 6),
  }));
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function offsetDate(dateString: string, days: number): string {
  const date = new Date(`${dateString}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return toIsoDate(date);
}

function gscSummary(row?: GscRow): GscSummary {
  return {
    clicks: Number(row?.clicks ?? 0),
    impressions: Number(row?.impressions ?? 0),
    ctr: Number(row?.ctr ?? 0),
    position: Number(row?.position ?? 0),
  };
}

async function getLatestGscDate(): Promise<string> {
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const endDate = toIsoDate(yesterday);
  const startDate = offsetDate(endDate, -13);
  const response = await querySearchConsole({
    startDate,
    endDate,
    dimensions: ["date"],
    rowLimit: 20,
  });
  const dates = (response.rows ?? [])
    .map((row) => row.keys?.[0])
    .filter((date): date is string => Boolean(date))
    .sort();
  return dates.at(-1) ?? offsetDate(endDate, -2);
}

async function getGscSummary(
  startDate: string,
  endDate: string
): Promise<GscSummary> {
  const response = await querySearchConsole({ startDate, endDate, rowLimit: 1 });
  return gscSummary(response.rows?.[0]);
}

async function getGscDimension(
  startDate: string,
  endDate: string,
  dimension: "page" | "query" | "date",
  rowLimit: number
): Promise<GscDimensionRow[]> {
  const response = await querySearchConsole({
    startDate,
    endDate,
    dimensions: [dimension],
    rowLimit,
  });
  return (response.rows ?? []).map((row) => ({
    key: row.keys?.[0] ?? "(not set)",
    ...gscSummary(row),
  }));
}

async function getGscQueryPages(
  startDate: string,
  endDate: string
): Promise<GscQueryPageRow[]> {
  const response = await querySearchConsole({
    startDate,
    endDate,
    dimensions: ["query", "page"],
    rowLimit: 25_000,
  });

  return (response.rows ?? []).map((row) => ({
    query: row.keys?.[0] ?? "(not set)",
    page: row.keys?.[1] ?? "(not set)",
    ...gscSummary(row),
  }));
}

async function getGscGrowthPages(
  current7Range: { startDate: string; endDate: string },
  previous7Range: { startDate: string; endDate: string }
): Promise<{
  current7: Map<string, GscSummary>;
  previous7: Map<string, GscSummary>;
}> {
  const mapRows = (rows: GscDimensionRow[]) => {
    const result = new Map<string, GscSummary>();
    for (const row of rows) {
      try {
        const url = new URL(row.key);
        result.set(url.pathname, {
          clicks: row.clicks,
          impressions: row.impressions,
          ctr: row.ctr,
          position: row.position,
        });
      } catch {
        // Ignore malformed page keys instead of failing the entire dashboard.
      }
    }
    return result;
  };

  // The property has fewer than 200 indexable URLs, so reading the page
  // dimension once per period is cheaper and more reliable than one request
  // per monitored page. Missing rows are intentionally represented as zero.
  const current7Rows = await getGscDimension(
    current7Range.startDate,
    current7Range.endDate,
    "page",
    1_000
  );
  const previous7Rows = await getGscDimension(
    previous7Range.startDate,
    previous7Range.endDate,
    "page",
    1_000
  );
  return { current7: mapRows(current7Rows), previous7: mapRows(previous7Rows) };
}

function emptyGscSummary(): GscSummary {
  return { clicks: 0, impressions: 0, ctr: 0, position: 0 };
}

export function reportingConfigurationStatus() {
  return {
    credentials: Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_JSON_BASE64?.trim()),
    ga4Property: Boolean(process.env.GA4_PROPERTY_ID?.trim()),
    searchConsoleProperty: Boolean(process.env.GSC_SITE_URL?.trim()),
    reportSheet: Boolean(process.env.ANALYTICS_REPORT_SHEET_ID?.trim()),
  };
}

function errorCode(error: unknown): string {
  return error instanceof ReportingError ? error.code : "unexpected_error";
}

export async function probeReportingAccess() {
  const [ga4, searchConsole] = await Promise.allSettled([
    getGaSummary("7daysAgo", "yesterday"),
    getLatestGscDate(),
  ]);

  return {
    checkedAt: new Date().toISOString(),
    configured: reportingConfigurationStatus(),
    ga4:
      ga4.status === "fulfilled"
        ? { ok: true as const }
        : { ok: false as const, code: errorCode(ga4.reason) },
    searchConsole:
      searchConsole.status === "fulfilled"
        ? { ok: true as const, latestCompleteDate: searchConsole.value }
        : { ok: false as const, code: errorCode(searchConsole.reason) },
  };
}

export async function getAnalyticsDashboardData(
  forceRefresh = false
): Promise<AnalyticsDashboardData> {
  if (
    !forceRefresh &&
    cachedDashboard &&
    cachedDashboard.expiresAt > Date.now()
  ) {
    return cachedDashboard.value;
  }

  const latestDate = await getLatestGscDate();
  const current7Range = {
    startDate: offsetDate(latestDate, -6),
    endDate: latestDate,
  };
  const previous7Range = {
    startDate: offsetDate(latestDate, -13),
    endDate: offsetDate(latestDate, -7),
  };
  const current28Range = {
    startDate: offsetDate(latestDate, -27),
    endDate: latestDate,
  };
  const previous28Range = {
    startDate: offsetDate(latestDate, -55),
    endDate: offsetDate(latestDate, -28),
  };

  const [
    gaToday,
    gaYesterday,
    gaCurrent7,
    gaPrevious7,
    gaCurrent28,
    gaPrevious28,
    gaEventWindows,
    gaPages,
    gaDaily,
    gaGrowthPages,
    gscCurrent7,
    gscPrevious7,
    gscCurrent28,
    gscPrevious28,
    gscPages,
    gscQueries,
    gscDaily,
    gscGrowthPages,
  ] = await Promise.all([
    getGaSummary("today", "today"),
    getGaSummary("yesterday", "yesterday"),
    getGaSummary("7daysAgo", "yesterday"),
    getGaSummary("14daysAgo", "8daysAgo"),
    getGaSummary("28daysAgo", "yesterday"),
    getGaSummary("56daysAgo", "29daysAgo"),
    getGaEventWindows(),
    getGaPages(),
    getGaDaily(),
    getGaGrowthPages(),
    getGscSummary(current7Range.startDate, current7Range.endDate),
    getGscSummary(previous7Range.startDate, previous7Range.endDate),
    getGscSummary(current28Range.startDate, current28Range.endDate),
    getGscSummary(previous28Range.startDate, previous28Range.endDate),
    getGscDimension(
      current28Range.startDate,
      current28Range.endDate,
      "page",
      20
    ),
    getGscDimension(
      current28Range.startDate,
      current28Range.endDate,
      "query",
      30
    ),
    getGscDimension(
      current28Range.startDate,
      current28Range.endDate,
      "date",
      40
    ),
    getGscGrowthPages(current7Range, previous7Range),
  ]);

  const growthPages: GrowthPageRow[] = MONITORED_GROWTH_PAGES.map((page) => ({
    ...page,
    ga4: {
      current7: gaGrowthPages.current7.get(page.path) ?? emptyGaPeriod(),
      previous7: gaGrowthPages.previous7.get(page.path) ?? emptyGaPeriod(),
      funnel7: gaGrowthPages.funnels.get(page.path) ?? emptyGrowthFunnel(),
    },
    searchConsole: {
      current7: gscGrowthPages.current7.get(page.path) ?? emptyGscSummary(),
      previous7: gscGrowthPages.previous7.get(page.path) ?? emptyGscSummary(),
    },
  }));

  const value: AnalyticsDashboardData = {
    generatedAt: new Date().toISOString(),
    ga4: {
      today: gaToday,
      yesterday: gaYesterday,
      current7: gaCurrent7,
      previous7: gaPrevious7,
      current28: gaCurrent28,
      previous28: gaPrevious28,
      events7: gaEventWindows.current7,
      previousEvents7: gaEventWindows.previous7,
      events28: gaEventWindows.current28,
      pages28: gaPages,
      daily28: gaDaily,
    },
    searchConsole: {
      latestDate,
      current7Range,
      previous7Range,
      current28Range,
      previous28Range,
      current7: gscCurrent7,
      previous7: gscPrevious7,
      current28: gscCurrent28,
      previous28: gscPrevious28,
      pages28: gscPages,
      queries28: gscQueries,
      daily28: gscDaily,
    },
    growthPages,
  };

  cachedDashboard = { value, expiresAt: Date.now() + DASHBOARD_CACHE_MS };
  return value;
}

function gaDateToIso(value?: string): string {
  if (value && /^\d{8}$/.test(value)) {
    return `${value.slice(0, 4)}-${value.slice(4, 6)}-${value.slice(6, 8)}`;
  }
  const yesterday = new Date();
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  return toIsoDate(yesterday);
}

export async function getAnalyticsSheetSnapshot(
  forceRefresh = true
): Promise<AnalyticsSheetSnapshot> {
  const dashboard = await getAnalyticsDashboardData(forceRefresh);
  const current28Range = dashboard.searchConsole.current28Range;
  const [eventsYesterday, latestDay, queryPages28] = await Promise.all([
    getGaEvents("yesterday", "yesterday"),
    getGscSummary(
      dashboard.searchConsole.latestDate,
      dashboard.searchConsole.latestDate
    ),
    getGscQueryPages(current28Range.startDate, current28Range.endDate),
  ]);

  return {
    generatedAt: new Date().toISOString(),
    reportDate: gaDateToIso(dashboard.ga4.daily28.at(-1)?.date),
    ga4: {
      yesterday: dashboard.ga4.yesterday,
      eventsYesterday,
    },
    searchConsole: {
      latestDate: dashboard.searchConsole.latestDate,
      latestDay,
      queryPages28,
    },
    growthPages: dashboard.growthPages,
  };
}
