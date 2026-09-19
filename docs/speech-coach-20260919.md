# Optional speech coaching — preview rollout

The existing generator, copy/save actions, PREP notes and timer remain available.
The English speech flow adds an optional panel. Microphone access requires an
explicit Start action; audio stays in the page until the user submits it. The
first attempt and same-topic retry are free, without a card or email.

## Included

- One or two minute recording, local playback/download, stop on tab hide.
- Server-validated mono WAV (5–120 seconds), OpenRouter transcription and review.
- Evidence-checked quotations, one priority drill, point/example/ending feedback.
- Same-topic comparison that can report mixed or insufficient evidence.
- Guest sessions, optional email linking, private history, addressable attempts,
  content deletion with retained usage ledger.
- Atomic reservation and feedback claims, idempotent submission IDs, user quotas,
  network rate limits and a 200 model-call/day beta budget.
- Server-verified Stripe price ($12 USD/month), 40 attempts per billing month,
  signed webhooks, owner-bound customer portal and separate live-billing gate.

## Configuration

Use a dedicated Supabase project. Apply
`supabase/migrations/20260919_speech.sql` once. Anonymous sign-in and manual
linking must be enabled; keep email confirmation enabled. Configure the exact
account callback URL for each trusted preview/production origin. Public email
delivery needs a configured mail provider; default Supabase email has restrictions.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SPEECH_COACH_ENABLED=true` | Build-time UI switch |
| `SPEECH_COACH_ENABLED=true` | Server switch |
| `OPENROUTER_API_KEY` | Server-only model credential |
| `NEXT_PUBLIC_SUPABASE_URL` | Dedicated project URL |
| `SUPABASE_ANON_KEY` | Public authentication key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only private database access |
| `SPEECH_BILLING_ENABLED=true` | Enable configured Stripe checkout |
| `SPEECH_EMAIL_ENABLED=true` | Show email linking after SMTP and exact callback URLs are verified |
| `STRIPE_SECRET_KEY` | Use sandbox `sk_test_` key during verification |
| `STRIPE_WEBHOOK_SECRET` | Signature for `/api/speech/webhook` |
| `SPEECH_STRIPE_PRICE_ID` | Dedicated $12 monthly price, not another app's price |
| `SPEECH_SITE_URL` | Exact trusted origin for payment returns |
| `SPEECH_LIVE_BILLING_ENABLED=true` | Separate explicit live-payment gate |

Subscribe to `customer.subscription.created`, `customer.subscription.updated`,
and `customer.subscription.deleted`. Enable cancellation in the customer portal.
Use the stable branch preview for sandbox webhooks and returns. Do not expose
another product's billing configuration or copy its customer records.

## Verification

Run `npm run speech:test`, `npm run growth:test`, `npm run lint`,
`npx tsc --noEmit`, and `npm run build`. A network with a managed certificate
may need `NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1` for Google Fonts.
Do not disable TLS verification.

Before production: verify audible recordings on Safari/Chrome, microphone denial,
hide/return, an interrupted upload, model failure recovery, two different users'
history isolation, email recovery, sandbox checkout, subscription renewal/cancel,
webhook replay, and actual model costs. Automated tests do not establish these
external-service outcomes.

## Measurement

GA events contain action/source/attempt counts, never voice, transcript or email:
`speech_coach_open`, `speech_record_start`, `speech_record_complete`,
`speech_record_error`, `speech_transcript_ready`, `speech_feedback_view`,
`speech_feedback_helpful`, `speech_retry_start`.

Compare recording completion, feedback-to-retry users, second-attempt completion,
helpful feedback and later return usage. Treat event totals as counts, not an
ordered conversion funnel. Paid conversion must be calculated from verified
Stripe subscriptions; the return URL does not prove payment. Neither price nor
retention is validated by this implementation. During the beta, the global cost
limit can temporarily stop new requests; tune it from actual usage before scaling.

Production feature flags remain off until external-service verification completes.

## Preview evidence (September 19)

- PR #34, initial deployment `1328214`: Vercel Ready, 57-second cloud build.
- Browser: topic generation opens the optional practice panel; existing PREP and
  timer remain available. Guest authentication and API-backed private history load.
- SMTP is not configured; hide email recovery until a mail provider is verified.
- Stripe native sandbox setup reaches **Accept and Create** (binding terms and
  account metadata sharing). This action has not been accepted.
- Automatic approval review blocked a combined action that would add preview
  auth callbacks and start microphone recording. Neither was performed; these
  need user confirmation before live browser recording verification continues.
- No real audio, model feedback or payment has been verified end to end yet.
