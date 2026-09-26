# Paid practice bridge, 2026-09-26

Recent production evidence (Beijing Sep 23–25): 7 GA users saw retry feedback, 6 subsequently qualified for full-plan-card exposure, and none clicked the plan. These are small observational cohorts, not evidence that the price is wrong. The prior card observer did not measure its CTA, the quota link had no click event, and stopping reasons required another click before answering.

## Behavior

- Keep the first free result's compact price hint and free retry, the $12 monthly price, 40 attempts including retries, two-minute limit, expiration and renewal terms.
- After a retry or exhausted allowance, explain the existing next-practice loop: select another topic, answer, retry one suggestion and compare those two answers. It does not promise comparisons between unrelated topics, new courses or guaranteed improvement.
- Observe the full-card CTA, compact price link and quota recovery link themselves for one continuous foreground second at >=50% visibility. A card impression never substitutes for a CTA impression; a fast click never manufactures one.
- Keep legacy full-card events for continuity and add `speech_plan_v2_view`, `speech_plan_v2_action_view`, `speech_plan_v2_click`. New events cannot be backfilled. The legacy series now spans both versions and is not a simultaneous control.
- Measure quota link exposure/click separately without changing its allowance-page destination or automatically starting Checkout.
- Show a skippable, one-click, closed-choice question only with the full unpaid plan. Count question exposure, answer and reason separately. Ignore repeat selection within the same mounted result. Unanswered remains unknown. An answer never hides the purchase link or navigates away.
- Paid users and unavailable billing do not get another subscription offer or the plan question. First free feedback does not get this question.
- Existing account/email ownership, duplicate-purchase checks, dedicated live product and Stripe payment truth are unchanged. QA naming and checkout-intent propagation remain in force; no personal text or practice IDs enter the new events.

## Reporting

`plan_action_v2` starts with the actionable CTA's exposure, then click, account offer, subscribe, redirect and confirmed return payment. It does not require a prior card event because observers can qualify concurrently. Independent click counts also include fast clicks outside this ordered cohort.

`quota_plan` starts at the quota link's exposure. `plan_reason` starts at the question's exposure, with independent answers retained for fast responses. Individual reason counts can overlap across separate practices and are not unique people. The dashboard shows these definitions and counts. Stripe remains the source of payment truth, including payments without a browser return.

## Verification and effect boundary

Run `npm run speech:test`, `npm run billing:test`, `npx tsc --noEmit`, ESLint on changed components and the production build. `node scripts/speech-plan-browser.mjs` serves actual components with local fixtures at `http://127.0.0.1:4689/?speech_qa=1`; use connected Chrome, click Run regression and inspect the rendered result. It tests independent/continuous exposure, hidden/reopened content, fast clicks, legacy/new events, QA intent, quota navigation, closed-choice/double-click behavior, unavailable billing and paid accounts. No real audio, account, email or payment is used.

After release, record the exact deployment/ready time, confirm QA events are received, and query new non-QA events plus independent Stripe live aggregates. A browser/test pass proves functionality, not paid conversion improvement. New copy and the optional question are one release bundle; a before/after difference alone cannot attribute causality to either change. Do not change price or introduce another variant just because the initial new-version cohort is empty.
