# One-minute task, saved answer card and bounded return practice

The release targets the start/first-value/return boundary identified on September 30. The latest processed ordered cohorts were 59 start controls → 17 begins → 6 feedback views, and separately 9 suggestions → 5 retries → 4 comparisons → 2 priced-plan actions → 0 clicks. These are different starting cohorts, exclude marked QA only, and are not evidence that price or the model caused abandonment.

## Experience

The first recording presents one small task: a point, an example, and a complete thought. Optional purpose choices move below the primary action into an explicit disclosure. Recording and uploading remain deliberate, with local audio until submission. Existing permission denial, cancellation and upload recovery remain intact.

Every feedback result offers a private answer card assembled from its saved transcript, a verbatim strength quote when present in that transcript, and its evidence-based next goal. A short retry is labeled as a short retry, never a complete rewritten speech. Copy success and failure are distinguished; blocked clipboard access leaves the exact text available for manual copying. Cards remain available in owned history. No card contents enter analytics, URLs or browser persistent storage. No new model operation is added.

After the first completed answer/retry pair with server-saved `journeyVersion=task_v1`, a free account with no more than two nonfailed recordings earns one extra recording after 24 hours. This is once per account, without requiring a positive rating, email signup or subscription. It is not a daily reset, does not include another free retry, and makes no promise of a reminder email. The account ledger persists when content is deleted. The existing network/day and global/day cost caps remain.

## Database release order

Apply `supabase/migrations/20261001003000_speech_return_trial.sql` to the dedicated RandomTopics project before deploying the new routes. The additive columns, completion trigger and versioned `reserve_speech_attempt_v6` RPC preserve the old deployment's 2/40 RPC. Anonymous/authenticated clients have no direct execute/table permissions; server-side actor ownership checks and the shared advisory quota lock remain. Signed-in paid accounts keep 40 attempts per billing period.

No existing account or historical pair is granted extra quota retrospectively. A failed extra recording releases its quota, but still counts against provider cost caps. A completed extra attempt cannot be reclaimed by deleting its transcript. Roll back code independently; keep the additive schema so newer records remain readable. Disable future scheduling by removing the completion trigger only if necessary; do not erase grants already promised to users.

## Measurement

- `speech_task_start_view/begin`: new first-attempt start cohort; no fabricated exposure on fast action.
- `speech_card_view/copy`: qualified card-heading exposure and successful clipboard write. Copying does not prove later use.
- `speech_return_trial_offer_view`: a scheduled grant is visibly explained.
- `speech_return_trial_available_view`: currently usable grant displayed from the server allowance.
- `speech_return_trial_open/begin`: deliberate navigation and input attempt; not completed audio or quota consumption.
- `speech_return_trial_feedback_view`: feedback visibly rendered for an attempt labeled `return_trial` by the database reservation, not client claims.
- `task_start`, `answer_card`, `return_trial` ordered GA funnels join the private dashboard. Each starts independently. The return funnel starts at available-credit exposure, not a previous day's offer; a one-day GA step limit must not be used to claim full retention.
- Server reports separately count extra-credit attempts and completed feedback, excluding marked QA. Attempt creation windows and GA user windows are not interchangeable; completed feedback is not observed feedback.

## Verification and next decision

Use real PostgreSQL migration tests plus connected-Chrome controlled tests for copy failures, hidden exposure, optional goal selection, input recovery, owned-history restoration and stale-account responses. Controlled data proves implementation behavior, not natural return, email delivery, real payment or conversion uplift. Production QA must remain tagged.

The next commercial experiment is a nonrenewing focused practice pack (candidate USD 4.99 / at most 6 recordings, 3 answer/retry rounds). It is intentionally not advertised or sold in this release. First establish whether this task produces completed useful rounds and actual return. A later pack release needs its own Stripe one-time Price, verified paid-session fulfilment, idempotent credit ledger, refund policy, pack/subscription precedence, separate conversion cohorts and tests. Retain the existing USD 12 / 40-recording subscription in this release so the value/return experiment has a stable purchase offer.

### Release checks on 2026-10-01

- Connected Chrome controlled component checks: recording 20/20, feedback/plan 21/21, next-round restoration 9/9, account/checkout restoration 14/14 (64 total). The next-round suite explicitly changes the server fixture from scheduled/zero to available/one and verifies foreground refresh without an audio, model or Checkout request.
- PostgreSQL migration regression, speech/payment/growth regression, TypeScript, lint and production build passed. Lint retains one pre-existing unused-variable warning in the live-evidence helper.
- The dedicated production database reports the new RPC/column/trigger present, service-role execution allowed, anonymous/authenticated execution blocked, and zero retrospective grants before this app release.
- A 390px Chrome fixture shows the private answer card and next goal without horizontal overflow. These use synthetic saved content; they do not demonstrate real audio quality, email delivery, payment or natural return.
