# Purchase continuity and first-retry measurement

Released behavior
- A priced plan link carries only a validated practice reference. A 24-hour local intent preserves it through same-browser email confirmation. The account history API still filters by authenticated owner. No feedback, transcript, email, token, price or entitlement is stored in the intent or added to speech telemetry.
- The plan page shows the owned saved goal, a cautious summary of the last model comparison and a real next-practice link. Missing/foreign history uses an explicit fallback. Switching accounts clears prior private state and ignores stale responses.
- A selected plan directly shows its email form. There is no preliminary “Continue with email” click for that route. Email verification still precedes a separate, explicit Stripe checkout action. Existing subscribers only manage their subscription.
- Account failures have a retry or reconnect action. Reconnect renews the current session; it never silently creates a replacement guest. If the session is lost, only an already linked email can recover the account. Auth refreshes may supersede an in-flight history request; recovery success is emitted after the latest owned load succeeds.
- The first result puts the one-goal short retry before the supporting quote and expandable details. The quote remains visible, and quota/review restrictions are unchanged. No additional model request or free allowance was added.

New events (QA keeps the qa_ namespace)
- speech_account_arrive: account component initialized, before auth/config/history completes.
- speech_account_load_start/ready/error: actual history loading; ready means server response accepted, not screen exposure. Existing load requests have a 15-second fetch timeout. Safe elapsed/error labels are recorded; provider responses and content are not.
- speech_account_reconnect_start/ready/error: explicit session recovery, including an overlapping auth refresh.
- speech_checkout_action_view: the actual enabled action is at least half visible in the foreground for one second. outcome is email, checkout or choose_plan. This is distinct from whole-card exposure; fast actions never synthesize a view.
- speech_checkout_context_view: the owned goal heading is qualified as visible. Only next-mode labels are sent.
- speech_checkout_email_error: purchase-related email request failure. A sent event means request accepted, not delivered.
- speech_first_retry_action_view/click: an available retry action on the first result; the denominator excludes quota exhaustion and review-only results. It does not require a preceding heading impression.
- speech_first_retry_unavailable_view: the first result heading is visible but retry is unavailable, with quota/review reason. It is not evidence that all explanatory text was read.

The existing private analytics report automatically includes coverage plus account_arrival, plan_account_load, purchase_email_action, account_recovery and first_retry_action ordered funnels. Do not backfill their pre-release absence as zero activity. Historical checkout_start is not a required step for directly submitting the selected-plan email form. GA funnels remain user-based, may span sessions, and do not establish same-recording causality.

Validation
- speech:test, billing:test, growth:test; TypeScript and targeted ESLint.
- Actual React components in connected Chrome via scripts/speech-account-browser.mjs and scripts/speech-plan-browser.mjs. All auth, history, email and Checkout services in these fixtures are simulated. No real messages, model generation or payment.
- Account cases include owned/missing goal, direct email, email failure, session expiry, 401 recovery, overlapping token refresh, 503 retry, verification return, QA restoration, qualified action exposure, duplicate purchase clicks, cross-account stale checkout/history and existing subscriptions.
- UI checks at a 390px iframe width. A local checkout destination checks the navigation action separately from Stripe processing.

Live email delivery, a real payment and natural conversion lift remain observational outcomes, not established by these controlled checks.

