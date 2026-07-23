// Usage Insights dataset for /stats — REAL numbers only.
//
// Source: GA4 property G-C23RTYX4QS, custom events added 2026-07-23:
//   generate_topic  { gen_mode, gen_category, gen_depth, gen_count, gen_locale }
//   copy_topic      { topic_id, topic_category }
//   save_topic      { topic_id }
//   copy_deck       { deck, deck_size }
//   copy_question   { deck }
//   deal_party_question { deck }
//   spin_wheel
//
// Monthly refresh pipeline (manual, ~10 min):
//   1. GA4 → Reports → Engagement → Events (set date range to the full month)
//   2. For generate_topic, read the event-parameter breakdowns for
//      gen_category / gen_mode / gen_depth (Explore → free-form works too)
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
  /** Top categories by generate_topic count, descending. */
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
