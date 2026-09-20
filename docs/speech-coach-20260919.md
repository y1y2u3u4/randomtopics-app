# Optional speech coaching — preview rollout

The existing generator, copy/save actions, PREP notes and timer remain available.
The English speech flow adds an optional panel. Microphone access requires an
explicit Start action; audio stays in the page until the user submits it. The
first attempt and same-topic retry are free, without a card or email.

## Included

- One or two minute recording, existing audio upload, local playback/download,
  stop on tab hide, actionable missing/busy microphone messages.
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
| `SPEECH_STRIPE_SECRET_KEY` | NEW dedicated RandomTopics sandbox `rk_test_` key; no generic fallback |
| `SPEECH_STRIPE_WEBHOOK_SECRET` | Dedicated signature for `/api/speech/webhook` |
| `SPEECH_STRIPE_PRODUCT_ID` | Dedicated RandomTopics Speech Coach product |
| `SPEECH_STRIPE_PRICE_ID` | Dedicated $12 monthly price, not another app's price |
| `SPEECH_STRIPE_PORTAL_CONFIGURATION_ID` | Dedicated RandomTopics customer portal configuration |
| `SPEECH_SITE_URL` | Exact trusted origin for payment returns |
| `SPEECH_LIVE_BILLING_ENABLED=true` | Separate explicit live-payment gate |

Subscribe to `customer.subscription.created`, `customer.subscription.updated`,
and `customer.subscription.deleted`. Enable cancellation in the customer portal.
Use the stable branch preview for sandbox webhooks and returns. Do not expose
another product's billing configuration or copy its customer records.
New sales also require verified email recovery (`SPEECH_EMAIL_ENABLED=true`).
Product metadata must include `product=randomtopics_speech`. See
`docs/stripe-payments-20260920.md` for independent credential setup and remaining
external verification. Disabling new sales preserves webhooks and the customer
portal for existing subscribers.

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

## Preview evidence (September 19–20)

- PR #34, initial deployment `1328214`: Vercel Ready, 57-second cloud build.
- Browser: topic generation opens the optional practice panel; existing PREP and
  timer remain available. Guest authentication and API-backed private history load.
- SMTP is not configured; hide email recovery until a mail provider is verified.
- The user excluded new Stripe setup because they have a separate payment flow.
  No terms were accepted, no Stripe account was installed, and billing stays off.
- After explicit authorization, the stable preview account callback was added to
  Supabase. This does not establish email delivery: SMTP is still unconfigured.
- The cloud browser has no microphone device (NotFoundError). Existing audio
  upload was added and tested against the real deployed API and OpenRouter.
- Two synthetic spoken WAV samples (18s and 28s) completed transcription,
  editable transcript review, feedback, same-topic comparison, and private storage.
  They are functional fixtures, not real-user outcome or accent benchmarks.
- First UBI answer used general claims. Feedback correctly identified missing
  specifics and requested one reason plus an example. The second answer added a
  childcare example; comparison quoted both attempts and correctly marked this
  particular change improved. One transcription phrase needed manual correction;
  the editable review step worked.
- The second answer also exposed an unfair demand to choose an extreme despite
  an explicit conditional stance. Commit bbc2eb2 changes the coaching rubric to
  accept nuanced positions and request refinements without inventing deficits.
- Another guest, using a known first-attempt URL, received no saved attempts.
  The first guest could refresh history and see both saved results. Supabase
  RLS is enabled; anon/authenticated cannot directly SELECT the private tables.
- A third attempt for the first guest was denied at the allowance boundary;
  playback/download stayed available. No extra model call should occur because
  reservation precedes transcription.
- Commit bbc2eb2 also preserves full feedback/comparison in history and returns
  a new-attempt retry signal immediately after a failed transcription reservation
  is successfully released. Regression covers both release success and failure.
- Targeted regression, ESLint and TypeScript checks passed; Vercel preview for
  bbc2eb2 reached Ready after a 56-second cloud build.
- Deployed silence test (6s WAV): no invented transcript, explicit insufficient
  speech message, saved failed state, and allowance released. Two subsequent
  32s spoken attempts were both accepted, confirming silence did not consume one.
- Nuanced-position retest on universal happiness: the model explicitly praised
  the clear nuanced thesis (desirable direction, unrealistic permanent condition),
  then requested more explanation of one supporting point rather than forcing a
  binary answer. This is one successful regression example, not a broad benchmark.
- One feedback request failed with a sanitized error. The transcript remained
  available in the panel and history; retry succeeded without retranscription.
  The provider/validation failure cause was not exposed or diagnosed.
- Reusing the identical spoken answer for the second attempt returned **similar**
  with matching before/after quotes and an explanation that the transcript was
  identical, rather than claiming improvement.
- Expanded history restored the strength, priority, structural notes and transcript.

Remaining production gates: physical microphone capture on desktop/mobile,
Safari behavior, interrupted uploads, actual email delivery/recovery when enabled,
and integration with the user's separate payment path. Production is unchanged.
