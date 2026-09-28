# Guided practice rounds — 2026-09-28

The prior result already supported short retries and evidence-backed comparison. This revision makes the entire round legible and carries an attained goal into a new topic without adding a model operation.

## Experience

- Entry describes an answer → one suggestion → short retry → comparison. A four-step indicator follows the current stage, including the result viewport. Two lifetime free recordings still include the retry.
- First feedback places its validated priority quote beside the suggestion. Missing evidence is stated plainly; no sample quote is substituted into a real result. Retry buttons name the actual skill.
- An explicit “Not yet” response removes plan/next-round promotion from that result and exposes the saved evidence, a practical sentence frame, and correction when available. Reviewing evidence is free; correction retains the existing bounded feedback-call limit and does not reserve another recorded attempt.
- Unclear/insufficient evidence leads to review before another recording or purchase. Honest similar/mixed comparisons remain valid outcomes.
- `nextRound` chooses a new topic only when the current saved criterion is `met` AND the comparison is `improved`. Concision has no saved criterion and therefore never infers transfer readiness. Other results retain the original topic/goal or ask for review.
- A source link in history restores the goal. Eligible rounds offer a small set of existing light speech topics, excluding the old topic. Free quota previews a suggested next topic and discloses the plan requirement. Existing paid accounts see renewal information, never another subscription pitch.

## Server and cost boundaries

`goalSourceId` is optional on a full transcription request. Before reserving quota or invoking a provider, the server requires an owned, complete, undeleted source with eligible saved feedback, a different topic, and no same-topic `previousId`. Only the source-derived target enters `usage.context`; client targets are ignored.

A transferred answer receives the existing full assessment. The server keeps the carried target when selecting the drill. There is no previous transcript in this operation and no cross-topic improvement claim. Subsequent short retries compare only that new answer on its own topic, using existing RPC validation. A round still uses one transcription and one feedback operation per recording, with the existing bounded provider repair, quota, and privacy rules. No new Stripe price, credential, subscription term, grant, or database migration.

Resume views reload owned history on relevant auth/foreground changes. An identity change clears private state, unmounts the coach, and invalidates late responses. Email confirmation and Checkout authorization remain server-controlled. After purchase, history offers the saved goal link; no automatic recording or Checkout is triggered by opening a round.

## Measurement

New named events are registered in the existing private GA report allowlist and use the existing QA namespace. No topic, transcript, saved attempt ID, account ID, or quotes enter telemetry.

- `speech_round_suggestion_view` / `speech_round_compare_view`: qualified result-heading exposure, one continuous foreground second; they do not prove every quote was read.
- `speech_round_retry_click`: deliberate goal-specific retry action.
- `speech_round_next_view` / `speech_round_next_click`: separate actionable-link exposure/click. Fast clicks never fabricate exposure. Closed `outcome` reports transfer/retry, not personal content.
- `speech_round_evidence_open`: explicit evidence-help button action, not every manual details expansion.
- `speech_round_transfer_begin` / `speech_round_transfer_ready`: new-topic input started / feedback returned. Ready is not result exposure.
- `guided_round`: suggestion → retry → comparison → next-link view → next-link click.
- `goal_transfer`: next-link click → new-topic input → returned feedback. Next-link denominator includes retry previews; it is not a pure transfer-eligibility conversion rate.
- `guided_purchase`: suggestion → retry → comparison → priced-plan button view/click → checkout request/redirect → Stripe-confirmed payment. Existing email-verification funnels remain separate so verified customers need not pass through another email request.

These are GA ordered user funnels, not a same-round session audit. Historical versions are not randomized controls. Retain independent event counts alongside funnels and separate QA/unattributed tests. No commercial uplift is established by controlled tests.

## Verification

`npm run speech:test` includes source ownership, same-topic rejection, honest transfer assessment, quota/no-extra-call, and existing model/evidence regressions. `npm run billing:test`, growth/handoff regressions, TypeScript, lint, and production build cover retained behavior.

Connected Chrome only: actual components run under local controlled media/network fixtures via `speech:recording-browser`, `speech:plan-browser`, and `speech:round-browser`. Tests cover recovery, round stages, feedback evidence, quota/purchase visibility, next-goal preservation, and stale auth responses. The 390px iframe checks responsive layout using real CSS. These are not live provider, email delivery, paid checkout, or natural conversion tests.
