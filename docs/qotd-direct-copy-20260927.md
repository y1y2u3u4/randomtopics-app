# QOTD direct list copying — September 27, 2026 (Asia/Shanghai)

## Decision and page brief

Optimize the existing /question-of-the-day owner for readers who already selected a question from the visible 120-item bank. Previously copying required opening a disclosure. Expose one compact Copy question button next to Save or share this question; retain the original question, corpus, category ordering, saved identity and secondary shared action component. The daily question, random generator, audience preference, weekly planners, title, canonical, locale and index policy remain unchanged. No new pages or keyword variants.

The existing private report motivates testing this lower-friction entry but does not establish that hidden actions caused low use. This is one versioned usability release, not a randomized experiment or proven growth intervention. Spanish round restoration stays a separate follow-up.

## Behavior

Copy the exact selected list question. Reuse the bounded Clipboard API/browser fallback. If unavailable, display a labeled read-only copy field next to the action; focusing selects its text. Retry clears failure state. A pending guard prevents double requests. Secondary save/share still mounts only after disclosure, using the same qotd-index favorite identity. A list question is never a generated result.

## Measurement

- qotd_list_copy_view_v2: usable direct-copy button >=50% visible for one continuous focused foreground second, once per mounted question, using the existing tested visibility observer. DOM mount or a quick click does not manufacture exposure. Event users across questions are deduplicated by GA4, but event counts are not unique visits.
- qotd_list_copy_click_v2: explicit direct-copy request, including fast clicks without a preceding qualified exposure.
- qotd_list_quick_copy_v2 / qotd_list_quick_copy_error_v2: automatic result, separate from displaying/selecting manual text.
- Existing copy_result/copy_error → qotd_list_copy/error series remains continuous. The new successful series is a subset; do not add them together. No question text or index is sent in the new params, no post_generate event is emitted, and independent event users are not an ordered funnel.

Release is September 27 in Beijing and September 26 UTC / US reporting date; new Core Usage rows use September 26 as the first possible date, without backfill. First complete US-calendar post-release window is September 27–October 3, subject to actual source latency. Confirm non-QA receipt at a normal sync before evaluating adoption. Existing SEO-title observation remains unchanged; keep this usability version stable for a full observation window absent a defect.

## Validation

Actual component regression checks direct copy before expansion, exact failure text, retry success, preserved saved identity, private event params, no fabricated generation, and observer cleanup. The existing visibility regression covers continuous exposure, below-threshold glimpses, hidden tabs, lost focus, disabled controls, deduplication and unmount cleanup. Run growth/handoff regressions, lint, TypeScript production build and SEO audit. Production acceptance must check direct list copy, secondary save/readback, retry messaging where observable, unchanged daily/random behavior and metadata. Record browser limitations separately from passed checks in the PR. Build/deploy success is not growth verification.
