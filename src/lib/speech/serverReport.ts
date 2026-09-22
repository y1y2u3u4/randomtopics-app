import "server-only";
import { database } from "./server";
import { SPEECH_EXPOSURE_VERSION, SPEECH_ENTRY_SOURCES } from "./exposure";

type Row = { id: string; user_id: string; previous_id: string | null; status: string;
  created_at: string; usage: { context?: { version?: string; qa?: boolean; practiceMode?: string; exposureVersion?: string; entrySource?: string } } | null };

// This aggregate intentionally never returns speech text, feedback, or identifiers.
function counts(rows: Row[]) {
  const qa = rows.filter(row => row.usage?.context?.qa === true);
  const cohort = rows.filter(row => row.usage?.context?.version === "v5" && row.usage.context.qa === false);
  const first = cohort.filter(row => !row.previous_id);
  const completedFirst = first.filter(row => row.status === "complete");
  const retry = cohort.filter(row => row.previous_id);
  const completedRetry = retry.filter(row => row.status === "complete");
  const paired = completedFirst.filter(row => completedRetry.some(next => next.previous_id === row.id &&
    next.user_id === row.user_id && next.created_at > row.created_at));
  return {
    total: rows.length, qa: qa.length, unclassified: rows.length - qa.length - cohort.length,
    attempts: cohort.length, accounts: new Set(cohort.map(row => row.user_id)).size,
    firstAttempts: first.length, firstComplete: completedFirst.length,
    retryAttempts: retry.length, retryComplete: completedRetry.length,
    firstWithCompletedRetry: paired.length,
    failed: cohort.filter(row => row.status === "failed").length,
    pending: cohort.filter(row => !["complete", "failed"].includes(row.status)).length,
  };
}

export function summarizeSpeechAttempts(rows: Row[]) {
  const expanded = rows.filter(row => row.usage?.context?.exposureVersion === SPEECH_EXPOSURE_VERSION &&
    row.usage.context.version === "v5" && row.usage.context.qa === false);
  return { ...counts(rows), expandedExposure: {
    version: SPEECH_EXPOSURE_VERSION, ...counts(expanded),
    sources: SPEECH_ENTRY_SOURCES.map(source => ({ source, ...counts(expanded.filter(row =>
      (row.usage?.context?.entrySource ?? "unknown") === source)) })),
  } };
}

export async function getSpeechServerReport(now = new Date()) {
  const start = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const end = now.toISOString();
  const rows: Row[] = [];
  // Paginate below the service's row limit; a bounded incomplete result is labeled.
  let complete = false;
  for (let offset = 0; offset < 5000; offset += 500) {
    const { data, error } = await database().from("speech_attempts")
      .select("id,user_id,previous_id,status,created_at,usage")
      .gte("created_at", start).lt("created_at", end)
      .order("created_at").order("id").range(offset, offset + 499);
    if (error) throw error;
    rows.push(...data);
    if (data.length < 500) { complete = true; break; }
  }
  return { start, end, complete, ...summarizeSpeechAttempts(rows) };
}
