# Private analytics reporting

The private dashboard at `/internal/analytics` reads GA4 and Search Console through a read-only Google service account. It does not depend on a browser Google session.

## Production environment

Configure these variables in the production environment only:

- `GOOGLE_SERVICE_ACCOUNT_JSON_BASE64`: base64-encoded service-account JSON, stored as a secret.
- `ANALYTICS_DASHBOARD_SECRET`: a unique dashboard password of at least 32 characters, stored as a secret.
- `GA4_PROPERTY_ID`: the numeric GA4 property ID.
- `GSC_SITE_URL`: the Search Console property identifier, such as a domain property.
- `ANALYTICS_REPORT_SHEET_ID`: the private Google Sheet ID used for durable daily reports.
- `CRON_SECRET`: a unique value of at least 32 characters, stored as a secret. Vercel sends it as a bearer token when invoking the daily report job.

Never commit the service-account JSON, its private key, or decoded credentials. Do not expose these variables to client-side code or use a `NEXT_PUBLIC_` prefix.

## Access and validation

- `/internal/analytics` requires the dashboard password and stores only a signed, HTTP-only session cookie.
- `/api/internal/analytics/summary` requires the same authenticated session and returns private, non-cacheable data.
- `/api/internal/analytics/health` verifies both upstream APIs but deliberately returns only configuration and connectivity status, never traffic metrics or credential details.
- Internal pages and APIs are excluded by both robots rules and `X-Robots-Tag` headers.

After changing production environment variables, trigger a production deployment and verify the health endpoint. Rotate the service-account key immediately if it is ever exposed, then replace the production secret and redeploy.

## Conversion definitions

- `generate_start` records an attempt.
- `generate_success` is the primary generation outcome and the only generation event used in current conversion reporting.
- `generate_topic` is a retired historical event. It stopped emitting on 2026-09-01 and must not be added to current-period conversion totals.
- From the October 2026 visibility fix, `post_generate_actions_view` requires at least 50% of the generated-result action bar to be in view for one continuous second while the document is visible and focused. It includes `exposure_rule=visible_1s`. Before this cutover, mounting the component emitted the event, including offscreen results. Do not compare those denominators as equivalent; the LA 2026-10-03 daily row is a partial cutover and subsequent daily rows use `strict-post-gen-visible-1s-v2`.
- `post_generate_copy`, `post_generate_save`, and `post_generate_share` are the strict secondary conversion events. They emit only for an action taken on a result produced in the current generator state.
- Existing strict copy, save, and share cards divide independent event-user counts by `post_generate_actions_view` users. These are descriptive ratios, **not cohort conversion rates**; a fast action can precede a qualified exposure and a ratio can exceed 100%. Historical `copy_result`, `save_result`, and `share_result` remain wider all-surface usage metrics; they include daily prompts, editorial picks, saved items, and shared pages and must not replace the strict events. To measure a funnel, use an ordered, same-user/session analysis with matching period, environment, consent and QA exclusions.
- `save_error` records a failed persistence attempt. `print_open` is the current successful print-dialog event; the legacy `print_content` event remains readable for historical continuity.
- Technical success rate is the ratio of `generate_success` events to `generate_start` events. User conversion is intentionally calculated separately.

### GA4 key-event settings and editable rounds

- Mark `generate_success` and `copy_result` as key events in the GA4 property. This is a property setting, not a source-code event rename. The second remains a broad all-surface usage outcome, not the strict post-generation copy rate.
- A key-event setting change does not change historical data; record the actual configuration cutover in private reporting and avoid comparing the generic key-event total across that cutover. See [Google's key-event documentation](https://support.google.com/analytics/answer/13128484?hl=en).
- The Two Truths ideas builder emits generation start/success for drawing three suggestions, not for viewing the initial example or selecting a lie. `round_lie_select` and `round_reveal` describe explicit controls, not inferred personal truths.
- Actions on the initial example are excluded from strict post-generation events. After a draw, the action bar becomes eligible only when the round has three distinct non-empty statements and the user has chosen a lie.
- Editable results can supply a local `actionViewIdentity` so each keystroke does not become a new action-view identity. This ID, edited statements, and the selected answer are never included in action-event parameters. The selected statement number is sent only on the explicit `round_lie_select` control event; no statement text accompanies it.
- Saved rounds contain only player-facing statements, without the answer. Middle/end return links scroll to the existing editor without drawing again or emitting generation success.

The growth scorecard always returns every monitored URL, including zero-data rows. Its page list covers the premium collections, focused generators, and highest-opportunity parent pages, so newly launched pages do not disappear merely because they have not entered a top-pages report yet.

## Durable daily report

The production cron calls `/api/cron/analytics-report` every day at `02:30 UTC` and writes only aggregate reporting data to the private `RandomTopics Analytics Daily` spreadsheet. The service-account credentials, access tokens, dashboard password, and cron secret are never written to the spreadsheet.

The destination spreadsheet must contain these tabs:

- `Overview`
- `Daily Summary`
- `Landing Pages`
- `Query Opportunities`
- `Run Log`

Share only this spreadsheet with the reporting service account as an editor. The account keeps read-only GA4 and Search Console permissions; spreadsheet editor access applies only to the selected report file.

`Daily Summary` is upserted by GA4 report date, so a retry does not duplicate the same day. Columns A:V retain their original definitions, including the all-visitor action rates in the legacy copy/save/share columns. Columns W:AD append the versioned strict conversion series:

- W: conversion metric version (`strict-post-gen-v1`; the 2026-09-04 deployment day is explicitly marked `partial-cutover`)
- X:Y: strict post-generate copy users and copy users / action-bar users
- Z:AA: strict post-generate save users and save users / action-bar users
- AB:AC: strict post-generate share users and share users / action-bar users

The reporting job expands `Daily Summary` to at least 30 columns before writing W:AD. The strict series begins at its deployment cutover and is not backfilled by reinterpreting older broad events. `Landing Pages` is a refreshed snapshot and its Copy / Save / Share user columns also use the strict post-generate events; `Query Opportunities` is refreshed while `Run Log` records each successful sync. Query opportunities follow the growth rule: at least 50 impressions, average position 5–20, and CTR below 5%. They remain review candidates until their search intent is judged independent.


## Opportunity quality and comparable windows

- Query Opportunities uses the last **28 complete GSC days**; M:Q records the window, exact dates, intended canonical owner, and ownership review. It must not be compared directly with the 7-day page snapshot.
- Exclude empty, control-character, oversized (over 240 characters or 40 words), and instruction-style queries before scoring. Ordinary questions, multilingual queries, and AI-related topics remain eligible. The Run Log includes the excluded query/page row count.
- Multiple URLs appearing for one query is a review signal, including possible sitelinks, not proof of cannibalization. Scores are per query/page candidates and are not additive click forecasts.
- Existing intents route to existing pages. Unassigned queries require editorial intent review; a threshold never authorizes automatic page creation.
- The report observes recently revised owners for 14 days from the recorded revision date, using the complete GSC date. High CTR is labeled Maintain rather than automatically Scale.
- Landing Pages retains its tab name for compatibility, but GA4 metrics use **pagePath** (visited pages), not session landing-page attribution. Session conversion is generation-success sessions on the page divided by sessions visiting that page.
- Landing Pages P:S records independent GA4/GSC 7-day windows. T:W records eligible action-bar users and strict copy/save/share rates. X:AC records the previous non-overlapping 7-day users, sessions, clicks, impressions, CTR, and position. Do not interpret adjacent rolling snapshots as independent weekly comparisons.
- Daily Summary AD stores the strict eligible-user denominator; old days remain blank until a real eligible-user count is available.
- Group-chat copying emits `copy_result` and `post_generate_copy` with `copy_format=group_message`. Copying a message is not reported as a sent share. `article_generate_entry` identifies middle/end reading entries and reuses the primary generator's start/success events. `open_saved_topics` records the next step after saving. No prompt text or query-string data is sent with those events.

Validation: `npm run growth:test` (Node 22.18+), `npm run lint`, TypeScript, production build, and `npm run seo:audit`.

## Sitewide growth coverage (2026-09-21)

The fixed 24-page scorecard remains unchanged. The existing daily production job now also refreshes 13 additive private tabs: `GSC Totals`, `GSC Pages`, `GSC Queries`, `GSC Query Pages`, `GSC Segments`, `GA4 Totals`, `GA4 Pages`, `GA4 Landing`, `GA4 Geography`, `GA4 Channels`, `GA4 Audience`, `GA4 Actions`, and `Report Coverage`.

- Totals, pages, queries, geography/device, channels and audience use independent current/prior 7-day and 28-day windows. Query/page ownership uses both 28-day windows. Page/event actions use both 7-day windows.
- GSC explicitly requests final Web data. GA4 uses production hostnames only, with its latest populated completed date from the property's relative-date report; this does not guarantee GA4 late-arriving data has settled. Dates and returned timezone are recorded rather than treating refresh time as the statistical cutoff.
- GA4 `pagePath` describes visited pages; `landingPage` describes session entry. Page users/sessions must not be summed as site totals. Event users are independent, not an ordered funnel. `newVsReturning` is an audience breakdown, not cohort retention. No private event text, recordings, credentials or query parameters are exported.
- GSC rows are paged in 10,000-row requests with a 50,000-row safety cap per dimension/window. GA4 uses the same pagination cap and records API rowCount. GSC still exposes only available top rows and omits anonymous queries; it cannot certify an exhaustive query census. Report Coverage records caps, GA4 sampling/threshold flags and row loss. Compare raw page-level totals carefully with property-level totals.
- All upstream reads must succeed before Sheet writes begin. `Report Coverage` is cleared before snapshot publication and written last as a completion marker. Partial write failures do not advertise a complete snapshot; readers must verify this marker's timestamp and all expected rows. Other, pre-existing report tabs are preserved.
- The private dashboard exposes a same-origin POST sync form at `/api/internal/analytics/sitewide`; it requires the existing signed dashboard session, rejects cross-origin requests and returns no credentials. It writes to the same configured private report only. The existing cron retains its bearer-secret authentication. No new schedule or public reporting endpoint is created.
- Validation: `node scripts/sitewide-report-regression.mjs`, existing growth regression, lint, TypeScript, production build and SEO audit. Production acceptance additionally requires a successful authenticated sync, actual Sheet headers/rows and coverage readback; deployment status alone is insufficient.

## Speech Daily schema migration (October 2026)

The legacy `Speech Daily` wide table is preserved in place. Its header was rebuilt from the current event list, so a 144-column historical row must never be interpreted under the later 554-column header. The old measurement labels do not uniquely identify the original column order. Without a verified original schema, those historical metrics are unknown; do not backfill zero, infer payment, or repair by array offset.

The existing cron now writes `Speech Daily v2` in the same private workbook using the existing access. It has six fixed columns: report date, schema, event name, event count, total users, and measurement note. Each row carries `speech-daily-v2`. The key is `(report date, event name)`; reruns update that key, new events/dates append, and the grid expands by rows. Event-list insertion/reordering cannot relabel old records. The writer validates headers and existing row keys before clearing or writing any report data. Unknown schemas, missing numeric values and duplicate keys fail closed. Old tabs and records are not migrated, deleted or overwritten.

Consumers should use `readSpeechDailyRow` from `src/lib/speech/dailySchema.ts` and join by `eventName`. Missing rows are unknown; explicit zero means a completed report found no matching event. Counts and users are independent aggregates, not an ordered cohort. First production acceptance is the next successful scheduled sync and a readback of the new tab and unchanged legacy rows.

Speech funnel boundaries remain the existing `speech_*` events: explicit practice start, explicit audio submission, feedback ready versus feedback actually visible, qualified allowance/offer visibility versus action click, account arrival/readiness, email confirmation, checkout start/request/redirect, and server-confirmed payment. A client redirect is not payment. Do not create a funnel by dividing unrelated event users or mixing first attempts with retries. QA uses the existing test/environment fields and QA event namespace; no production filter or credentials are changed.
