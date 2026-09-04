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
- `post_generate_actions_view` identifies users who were actually shown the upgraded action bar on a generated result. It is the eligible-user denominator, so tools without Copy / Save / Share controls do not dilute the funnel.
- `post_generate_copy`, `post_generate_save`, and `post_generate_share` are the strict secondary conversion events. They emit only for an action taken on a result produced in the current generator state.
- Strict copy, save, and share conversion cards divide each strict event's unique users by `post_generate_actions_view` unique users. Historical `copy_result`, `save_result`, and `share_result` remain available in the event table as wider all-surface usage metrics; they can include actions on daily prompts, editorial picks, saved items, and shared pages and must not be substituted into the strict funnel.
- `save_error` records a failed persistence attempt. `print_open` is the current successful print-dialog event; the legacy `print_content` event remains readable for historical continuity.
- Technical success rate is the ratio of `generate_success` events to `generate_start` events. User conversion is intentionally calculated separately.

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

`Daily Summary` is upserted by GA4 report date, so a retry does not duplicate the same day. Columns A:V retain their original definitions, including the all-visitor action rates in the legacy copy/save/share columns. Columns W:AC append the versioned strict conversion series:

- W: conversion metric version (`strict-post-gen-v1`; the 2026-09-04 deployment day is explicitly marked `partial-cutover`)
- X:Y: strict post-generate copy users and copy users / action-bar users
- Z:AA: strict post-generate save users and save users / action-bar users
- AB:AC: strict post-generate share users and share users / action-bar users

The reporting job expands `Daily Summary` to at least 29 columns before writing W:AC. The strict series begins at its deployment cutover and is not backfilled by reinterpreting older broad events. `Landing Pages` is a refreshed snapshot and its Copy / Save / Share user columns also use the strict post-generate events; `Query Opportunities` is refreshed while `Run Log` records each successful sync. Query opportunities follow the growth rule: at least 50 impressions, average position 5–20, and CTR below 5%. They remain review candidates until their search intent is judged independent.
