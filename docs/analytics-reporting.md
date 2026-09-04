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
- Copy, save, and share conversion cards use unique event users and sessions rather than raw event counts. This prevents one visitor repeatedly generating topics from being counted as many converted visitors.
- Technical success rate is the ratio of `generate_success` events to `generate_start` events. User conversion is intentionally calculated separately.

The growth scorecard always returns every monitored URL, including zero-data rows. Its page list covers the four premium collections plus the highest-opportunity parent pages, so newly launched pages do not disappear merely because they have not entered a top-pages report yet.

## Durable daily report

The production cron calls `/api/cron/analytics-report` every day at `02:30 UTC` and writes only aggregate reporting data to the private `RandomTopics Analytics Daily` spreadsheet. The service-account credentials, access tokens, dashboard password, and cron secret are never written to the spreadsheet.

The destination spreadsheet must contain these tabs:

- `Overview`
- `Daily Summary`
- `Landing Pages`
- `Query Opportunities`
- `Run Log`

Share only this spreadsheet with the reporting service account as an editor. The account keeps read-only GA4 and Search Console permissions; spreadsheet editor access applies only to the selected report file.

`Daily Summary` is upserted by GA4 report date, so a retry does not duplicate the same day. `Landing Pages` and `Query Opportunities` are refreshed snapshots, while `Run Log` records each successful sync. Query opportunities follow the growth rule: at least 50 impressions, average position 5–20, and CTR below 5%. They remain review candidates until their search intent is judged independent.
