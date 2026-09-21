# Speech conversion v4

## Changed journey

The free-practice entry now shows a short illustrative feedback example beneath its existing CTA. The result screen links to the real $12/month, 40-attempt plan instead of ending at a future-payment survey. The account page places this plan before history, explains the email step, and restores the selected plan after same-browser email confirmation.

The existing exact `/speech/account` email redirect is retained. UI intent expires after 24 hours, stores only a timestamp and QA flag, and never grants access. Another browser may lose this navigation hint but still sees the plan at the top. Email verification and subscription entitlement remain server-authoritative. Payment is requested only after a deliberate click; no automatic payment or checkout after verification.

Auth notifications refresh the account outside the Supabase callback to avoid lock reentry. Foreground return and a manual confirmation check cover an already-open tab. Owner changes invalidate in-flight history and billing responses. Duplicate actions are guarded, and an active subscription removes the purchase CTA.

## Measurement

- `speech_entry_v4_page/view/click`, `speech_coach_v4_open`, `speech_entry_v4_example_view`: the new entry cohort. Qualified visibility requires half the element in a focused foreground tab for one continuous second. Fast clicks are not retroactively converted to exposures.
- `speech_plan_view/click`: result-screen plan exposure and click after showing the actual price. Availability is based on the public billing flag; no Stripe credential is sent to the browser.
- `speech_checkout_email_step_view`: the purchase email section was visible. It can precede the subscription button click, so the ordered recovery funnel does not incorrectly require it afterward.
- `speech_checkout_email_start/sent`: email linking or existing-account sign-in requested in purchase context. Provider acceptance is not proof of delivery.
- `speech_checkout_resume_view/continue`: a verified purchaser saw the usable checkout button / deliberately continued.
- Existing checkout request, redirect, error and Stripe-confirmed purchase events remain. `speech_email_verified` is deduplicated per mounted account identity so automatic refreshes do not inflate it.

QA uses `qa_` event names and stays out of the natural funnels. A saved QA flag survives the same-browser confirmation redirect, including a new tab. v3 compatibility events continue after this release; they are not a randomized control cohort. Event counts and independently deduplicated users are not ordered conversion rates. New events cannot reconstruct history. Stripe is the payment authority; a redirect is not a sale.

## Validation

- TypeScript, ESLint, speech, billing and growth regressions pass.
- New regression tests cover intent expiry/storage failures, auth callback deferral, notification coalescing, identity invalidation, cross-tab signout and cleanup.
- Chrome extension with actual account/plan components and isolated mocked providers: plan CTA navigation, failed email feedback, existing-account email path, automatic verified-state refresh, selected-plan restoration without query parameters, explicit checkout navigation, one request on double-click, old-account checkout response rejected, old history response ignored after signout, and active-subscriber purchase CTA suppression. No browser console warnings/errors in this controlled check.
- This controlled check does not establish real email delivery, a live charge, or conversion lift. Production UI and GA receipt are checked after deployment, and natural outcomes require a later observation window.

## Cohort checks after release

The full entry funnel starts at page arrival. A separate closed exposure-to-click funnel starts at qualified button visibility, with the same 24-hour step limit. These answer different questions; an arrival outside the query window, missing arrival event or a different sequence can keep a click out of the full funnel. Do not reinterpret its zero as zero clicks among everyone exposed. Both v4 and the historical v3 compatibility view have this explicit exposure cohort; v3 is still not a control group.

A private raw-GA audit confirmed that the parser preserves a known QA sequence (1 → 1 → 1 → 1). The raw natural full funnel and short exposure funnel can differ; one short response was flagged as sampled, so its 3 → 1 is not a stable conversion benchmark. The result-screen plan funnel now starts with `speech_plan_view`, excluding historical feedback from before the priced card existed. This changes reporting definitions only, not recorded events or the payment flow.
