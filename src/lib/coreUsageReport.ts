const qotd = "/question-of-the-day", speech = "/speech", article = "/es/topics/most-likely-to-questions", tool = "/es/most-likely-to";
export const CORE_USAGE_STAGES: readonly (readonly [string, string, string])[] = [
  ...["daily", "random", "list"].flatMap(source => ["copy", "save", "share", "copy_error", "save_error", "share_error"].map(action =>
    [qotd, `qotd_${source}_${action}`, `${source}: ${action}; success only after browser API succeeds; errors separate`] as const)),
  [qotd, "qotd_usage_visit", "Page-view event; not a unique visit or action-bar exposure"],
  [qotd, "qotd_list_open", "Explicitly expanded an existing list question's actions; not generation or viewport exposure"],
  [qotd, "qotd_return_after_use", "Same browser after successful copy/save/share, >=30min tracked inactivity, within 30 days; not D1/D7 cohort retention"],
  [speech, "timer_first_start", "First start since reset, preset change or topic mount; pause resume excluded"],
  [speech, "timer_complete", "Timer deadline reached; not proof the user spoke"],
  [speech, "timer_restart", "Restart after timer completion in the same mounted timer; not a resume"],
  [speech, "practice_self_review", "User-selected reflection, not an AI assessment"],
  [speech, "speech_feedback_v5_request", "Explicit request for existing AI feedback; not feedback success"],
  [speech, "speech_after_timer_feedback_request", "First feedback request in same tab within 30min after timer completion; topic identity not verified"],
  [speech, "speech_return_after_use", "Same-browser return after successful action, timer complete or feedback view; >=30min inactivity, within 30 days"],
  [article, "party_article_to_tool", "Clicked continuous-tool link; destination load not implied"],
  [article, "party_tool_entry_with_unfinished", "Tool-link click with an unfinished round marker in this tab; not abandonment"],
  [tool, "party_tool_to_article", "Clicked curated-round link; destination load not implied"],
  [article, "party_revisit_unfinished", "Article page view with uncompleted round marker from same tab; marker does not restore content"],
  [article, "party_round_complete", "Walked through round; does not prove oral participation"],
  [article, "party_round_skip", "Explicitly skipped a question"],
  ...["copy", "save", "share", "copy_error", "save_error", "share_error"].map(action =>
    [article, `party_round_${action}`, `Whole-round ${action}; excludes per-question actions. Share API completion or clipboard fallback is not proof of delivery.`] as const),
  [article, "repeat_generate", "Prepared another round in the mounted article tool"],
  [article, "party_return_after_use", "Same-browser return after successful action or round completion; >=30min inactivity, within 30 days"],
  [tool, "party_return_after_use", "Return to continuous tool after meaningful use of either party surface; browser-local"],
];
export function coreUsageRows(rows: (string | number | boolean)[][], period: string, start: string, end: string, limited = false) {
  return CORE_USAGE_STAGES.map(([path, event, definition]) => {
    const row = rows.find(r => r[0] === period && r[3] === path && r[4] === event);
    const count = row ? Number(row[5]) : 0, users = row ? Number(row[6]) : 0;
    return [period, start, end, path, event, count, users,
      limited ? "limited_report" : count > 0 ? "received" : end < "2026-09-22" ? "before_release_no_new_signal" : "no_events_in_window",
      definition, "Independent event users; do not divide rows into an ordered funnel. New events cannot backfill. QA names excluded."];
  });
}
