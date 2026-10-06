# Speech discovery audit — 2026-10-06

## Confirmed defect and scope

At 2026-10-06 00:23 UTC, read-only HTTP requests to production found
`X-Robots-Tag: noindex, nofollow` on `/speech`, `/speech/persuasive`,
`/speech/informative`, and `/speech/politics`. All four returned 200, declared
indexable HTML robots metadata and self-canonicals, and appeared in the sitemap.
The restrictive HTTP directive overrides the intended public indexing policy.

Commit `f44b15e18835421bac5dfe2cbbbdfd4a94e49544` (2026-09-21 08:57:36
America/Los_Angeles, PR #54) expanded the private `/speech/account` header rule
to `/speech/:path*`. The commit timestamp is not proof of its first production
deployment or Google's first crawl. GSC indexing/crawl evidence is still needed
to estimate the effect on traffic. A 55.7% fall in `/speech` landing sessions
alone does not establish ranking loss or a decline in all Speech usage.

The patch retains `Referrer-Policy: no-referrer` throughout `/speech`, and
restricts the HTTP noindex rule to `/speech/account/:path*` and
`/speech/practice/:path*`. Speech APIs keep their private/no-store/noindex policy.
Existing HTML noindex for unapproved category pages remains unchanged.
Canonical, hreflang, sitemap, navigation, payment, analytics, and ad code are
unchanged. `/es/speech` already returns an indexable 200 and uses the correct
English counterpart; its generator/timer-only scope is intentional.

The existing SEO audit checked HTML noindex but missed restrictive HTTP
directives. It now checks both and matches wildcard build-manifest header
rules using Next's generated regex. A new local-only HTTP check covers public,
private, and excluded-category pages, reciprocal locale links and the sitemap.

## Existing event boundaries — no schema change

| Event | Actual boundary / limitation |
| --- | --- |
| `speech_first_attempt_start` | First user start action; microphone permission can still fail. `speech_record_start` is actual recording start. Uploads use the existing upload path. |
| `speech_feedback_v5_request` / `speech_transcribe_start` | Explicit audio submission after the in-flight guard; neither means feedback is ready. |
| `speech_feedback_ready` | Client received matching attempt ID, complete status and feedback; does not prove the result was seen. |
| `speech_feedback_view` | Result heading meets the existing qualified-visibility rule. Do not sum it with its versioned/first/retry aliases. |
| `speech_quota_hit` | Transcription returned 402; retained audio and a plan link are available. This is separate from an exhausted-allowance hint on successful feedback. |
| `speech_plan_view` / `speech_plan_v2_action_view` | Priced result card / its actionable link are qualified separately. Compact hints and quota links retain their existing distinct events. |
| `speech_checkout_offer_view` | Loaded, billing-enabled, non-subscriber account plan is visibly qualified. |
| `speech_checkout_action_view` | Qualified enabled action; `outcome` distinguishes `choose_plan`, `email`, and `checkout`. |
| `speech_checkout_start` | Subscribe-button intent. An unverified account emits it before email confirmation, with no Checkout API call. It is not a created session. |
| `speech_checkout_request` | Verified client is about to call the checkout helper. Network/session failure is still possible. |
| `speech_checkout_redirect` | Server URL received and account identity still current, before navigation. Server may reuse an open session; this does not prove a new session, arrival, or payment. |
| `speech_payment_confirmed` / `purchase` | Existing owner-confirmed paid receipt matches this browser's pending opaque transaction reference. No-return, cross-device, storage restrictions and blocked analytics can undercount. |

Visibility requires at least 50% intersection, a visible focused document and
one continuous second. Buttons must be enabled. Fast clicks do not manufacture
impressions. Existing component guards deduplicate concurrent submit/checkout
actions; exposures are scoped to mounted context, not lifetime-unique users.

`track` retains `schema_version=1`, derives `environment=production|local_preview`
and `is_test`, and preserves historical `qa_` names. Speech retains
`measurement_version=speech-v2`, `exposure_version=expanded_v1`, safe source,
attempt ordinal, purpose and bounded status/timing fields. No transcript,
topic, email, auth ID or attempt UUID is added to analytics. No GA filters or
custom dimensions were changed. Local tests dispatch only local diagnostics.

For a trustworthy funnel, use an ordered journey for the same observed
anonymous browser/session with one chosen event per stage, a fixed time window,
production non-test traffic and supported version/source filters. Separate
landing sessions, in-site Speech entry, first attempts, retries, visibility,
and purchase intent. A fast-action cohort can legitimately lack a qualified
impression. Independent event-user counts are descriptive, not conditional
conversion rates. Missing/unregistered dimensions and legacy events require an
explicit compatibility caveat; do not silently include them in the new cohort.
Neither this audit nor GA's one `speech_checkout_start` establishes backend
Checkout-created counts. No live payment/provider data was queried.

## Validation and remaining acceptance

- Build and TypeScript pass; lint has zero errors and one pre-existing unused
  variable warning in `scripts/speech-evidence-live-check.mjs`.
- All 44 existing regression scripts pass, including mocked billing,
  idempotency, privacy, session recovery, analytics isolation and allowance.
- HTTP indexing boundary: 10/10. Existing SEO audit: 57 pages, 202 sitemap URLs,
  redirects and robots pass against both HTTP and build artifacts. A temporary
  manifest containing the original wildcard noindex is correctly rejected.
- Isolated browsers at 390px and 1280px: account 19/19 each; complete practice,
  visible feedback, quota/offer and mock checkout 21/21 each. Navigation and
  reciprocal English/Spanish switching pass with no runtime errors.
- An exploratory email-disabled/billing-enabled mock was rejected as an invalid
  server state: `billingReady()` already requires email availability. Temporary
  UI/test edits were removed. No payment defect is claimed from that experiment.
- Zero real analytics, ads, paid-model, email or order requests. No shared
  desktop/browser, credentials, GA settings or user-owned untracked files used.

The original audit branch started from production commit
`26c0877a62e0dbab7b267da588a0cc96e599ad2c`; its isolated SEO commit was
`9e5cf46679aa18aad59d880bed7b3853ae9fa485`. The subsequent local branch
`codex/randomtopics-release-candidate-20261006` applies that SEO patch on top of
CMP commit `7e56598873b5111a86907854f75ffa05013ab6fa`, preserving both fixes.
This combination is local only. Neither creating this branch nor validating it
authorizes or performs a push or deployment.

After an authorized release, verify the actual production response headers,
private-page exclusions and aliases, then inspect GSC's last crawl and indexed
status and compare page/query impressions and clicks over complete LA days.
Google reprocessing and traffic recovery have not been verified.

References: [Google robots directives](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag)
and [Next.js response headers](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers).
