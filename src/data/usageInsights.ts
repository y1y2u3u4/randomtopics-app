// Usage Insights dataset for /stats — REAL numbers only.
//
// Source: GA4 property G-C23RTYX4QS. Conversion-safe event taxonomy from
// 2026-08-31 (older names remain available in GA4 for historical periods):
//   generate_start   { tool_type, generator_*, requested_count, locale }
//   generate_success { tool_type, generator_*, result_count, result_source, locale }
//   copy_result      { tool_type, result_type / content_source, locale }
//   save_result      { tool_type, result_type, locale }
//   share_result     { tool_type, share_method, locale }
//   page_view        { page_path, page_location, page_title, page_language }
//   clear_recent_topics
//   copy_deck       { deck, deck_size }
//   copy_question   { deck }
//   spin_start / spin_success
//
// Monthly refresh pipeline (manual, ~10 min):
//   1. GA4 → Reports → Engagement → Events (set date range to the full month)
//   2. For generate_success, read event-parameter breakdowns for tool_type,
//      generator_category / generator_mode / generator_depth
//   3. Fill the structure below with the real counts and set `updated`
//   4. Commit. The /stats page renders the section only when `updated` is set.
//
// HONESTY RULE: never estimate or extrapolate these numbers. If GA is
// unavailable for a month, skip the month — the page shows its "collecting"
// state whenever `updated` is null.

export interface UsageInsights {
  /** ISO date the numbers were pulled, e.g. "2026-09-01". null = no data yet. */
  updated: string | null;
  /** Human label for the covered window, e.g. "August 2026". */
  window: string | null;
  totalGenerations: number | null;
  /** Top categories by generate_success count, descending. */
  topCategories: { category: string; count: number }[];
  /** Generation share by mode, descending. */
  topModes: { mode: string; count: number }[];
  /** Depth split of generations. */
  depthSplit: { depth: "light" | "medium" | "deep" | "any"; count: number }[];
  /** Most-copied party decks (copy_deck + copy_question combined), descending. */
  topDecks: { deck: string; count: number }[];
}

export const usageInsights: UsageInsights = {
  updated: null, // ← telemetry went live 2026-07-23; first pull after 30 full days
  window: null,
  totalGenerations: null,
  topCategories: [],
  topModes: [],
  depthSplit: [],
  topDecks: [],
};
