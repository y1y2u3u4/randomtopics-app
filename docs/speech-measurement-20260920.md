# Speech measurement v2

The optional practice flow now measures page arrival, usable entry exposure,
practice intent, actual audio, transcription, generated feedback, visible feedback,
helpfulness, retry, comparison and an optional future-payment-interest question.
The event registry and report definitions are in `src/lib/speech/events.ts`.

## Reports and interpretation

- `/internal/analytics#speech-analytics`: password-protected, 7/28 complete days.
- Three closed, ordered GA4 user funnels: arrival to first feedback; first feedback
  to retry feedback; visible feedback to an affirmative interest answer. Each next
  step must occur within 24 hours. Version is `speech-v2`, production hosts only.
- Funnels count users, not attempts. They can span sessions and do not prove all
  steps belong to one recording. Cookie resets and other devices affect identity.
- Event/device/source tables contain independent counts/users, not ordered rates.
- Helpfulness is yes / (yes + no) among explicit responses. Unanswered is not no.
- Payment interest has no price, checkout or charge. It is not payment conversion.
- Request failures include permission, device, silence, quota and service issues.
  Successful requests slower than 15 seconds are counted separately. History
  feedback recovery is a separate action and is not attributed to the main funnel.
- Unavailable reporting APIs show unavailable, never fabricated zero conversion.
- The existing daily Sheets job creates/upserts `Speech Daily`, one row per date,
  with event counts and users. It is an event report, not an ordered funnel.

## Privacy and replay

Clarity project: `yl2amulnso` (RandomTopics).
Set `NEXT_PUBLIC_CLARITY_PROJECT_ID` at build time. No secret is needed.
Replay loads only after optional adult consent, only on production `/speech`,
with no query/hash. This excludes student pages, account/history, private admin
pages and query-tagged landing visits. It is a subset of traffic, not a full census.
Leaving this page stops replay. Preference can be changed; consent expires in
180 days. Advertising storage is denied. Speech text, feedback, audio controls
and email are masked; analytics payloads allow only fixed action metadata.
No transcript, topic text, audio, email, filename, auth ID or attempt ID is sent
in speech event payloads. Clarity receives the same action names for filtering.

## Verification and rollout

Preview hostnames do not send GA4, Umami or Clarity traffic. On previews only,
`?measure=1` displays a local event inspector. Automated measurement regression
checks production/version isolation, event privacy, error handling and funnel
header parsing. Existing speech/growth regression also covers report-sheet
creation and expansion. Live reception and replay are checked after deployment;
local tests do not establish third-party receipt.

Billing and email recovery remain disabled; payment uses the owner's separate
chain. Real microphone capture on mobile Safari remains a manual verification
limitation of the cloud browser, which has no microphone device.
