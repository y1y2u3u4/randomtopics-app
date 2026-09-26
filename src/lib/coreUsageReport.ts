const qotd = "/question-of-the-day", speech = "/speech", article = "/es/topics/most-likely-to-questions", tool = "/es/most-likely-to";
export const CORE_USAGE_STAGES: readonly (readonly [string, string, string])[] = [
  ...["/two-truths-and-a-lie", "/this-or-that", "/truth-or-dare", "/never-have-i-ever", "/most-likely-to", "/paranoia-questions", "/hot-seat-questions", "/would-you-rather"].flatMap(path =>
    ["question", "deck"].flatMap(scope => ["copy", "copy_error"].map(action => [path, `bank_${scope}_${action}`, "Existing list action; not generation. Success requires clipboard API/fallback success; manual text selection is not verified copying."] as const))),
  ...[["home", "/", "/speech"], ["wheel", "/spin-the-wheel", "/speech"], ["es_article", "/es/topics/public-speaking-topics-for-beginners", "/es/speech"]].flatMap(([source, origin, target]) => [
    ...(source === "es_article" ? ["click", "error"] : ["click", "error", "return"]).map(action => [origin, `handoff_${source}_${action}`, "Selected-topic handoff in this tab; return is navigation, not cohort retention"] as const),
    ...["load", "timer_first_start", "timer_complete", "timer_restart", "copy", "save", "share", "copy_error", "save_error", "share_error"].map(action => [target, `handoff_${source}_${action}`, "Same-topic practice action; load is not generation, timer completion is not proof of speech"] as const),
  ]),
  ["/spin-the-wheel", "spin_start", "Spin requested"],
  ["/spin-the-wheel", "spin_success", "Completed spin with a topic; use this denominator, not generate_success"],
  ...["copy", "save", "share", "copy_error", "save_error", "share_error"].map(action => ["/spin-the-wheel", `post_spin_${action}`, "Action on a completed spin result only; excludes restored selection"] as const),
  ...["open", "start", "copy", "share", "copy_error", "share_error"].map(action => ["/debate", `debate_prep_${action}`, "Explicit preparation action; notes stay in the browser and are not sent to analytics"] as const),
  ...["open", "start", "copy", "share", "copy_error", "share_error"].map(action => ["/debate/motions", `motion_prep_${action}`, "Preparation of an existing editorial motion; not generation. Notes are not sent to analytics; share does not prove delivery."] as const),
  ...["copy", "save", "share", "copy_error", "save_error", "share_error"].map(action => ["/topics/ethical-dilemma-questions", `ethics_card_${action}`, `Existing discussion card ${action}; not generation. API success does not prove delivery or discussion.`] as const),
  ...["friends", "group", "classroom", "deep"].map(scene => ["/question-generator", `question_scenario_${scene}`, "Clicked a matching existing collection; not destination arrival or successful use"] as const),
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
    const releaseDate = event.startsWith("motion_prep_") || event.startsWith("bank_") ? "2026-09-26" : "2026-09-22";
    return [period, start, end, path, event, count, users,
      limited ? "limited_report" : count > 0 ? "received" : end < releaseDate ? "before_release_no_new_signal" : "no_events_in_window",
      definition, "Independent event users; do not divide rows into an ordered funnel. New events cannot backfill. QA names excluded."];
  });
}
