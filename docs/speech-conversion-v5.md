# Speech conversion improvement v5

Goal: make first feedback trustworthy and easy to reach, make a short second attempt produce visible progress, and verify the effect on actual conversion. A passing model/API test is not proof of commercial improvement.

## Requirements and evidence

- [x] Feedback does not invent a missing point, reject a valid personal example, punish a balanced thesis, or mistake an empty closing phrase for a conclusion. Evidence: semantic review of live model cases, including the observed failures.
- [x] Each result separates missing work from optional refinement and offers a concrete short drill with a sentence scaffold and success criterion.
- [x] One explicit action submits recorded audio for transcription and feedback; transcript review remains available and errors preserve recoverable work.
- [x] Focused retries assess the stated goal, without penalizing a short passage for omitting a complete speech.
- [x] Progress comparison is shown first after a retry; the main next action remains visible on mobile.
- [x] Recording is not silently uploaded; privacy text matches actual behavior. Consent and quotas remain intact.
- [x] Incorrect transcription can be corrected without pretending cached feedback changed.
- [x] History supports recovery and continuing a saved practice; legacy results remain readable.
- [x] Actual remaining allowance controls any claim that a retry is free; quota errors provide a clear plan path.
- [x] QA is excluded in both front-end and server reporting. Exposure, intent, completion and payment remain separate.
- [x] Measurement captures the short practice funnel and optional reasons for stopping, without speech content or account identifiers.
- [x] Existing authentication, payment, ownership, quote validation and bounded provider requests remain covered by tests.
- [x] The actual browser → API → data → rendered result flow is verified; synthetic fixtures are labeled and do not count as customers.
- [x] Production release and post-release error/latency checks are verified. Continue checking new runtime failures as traffic arrives.
- [ ] Real user outcomes show improvement in feedback completion and repeated practice without worsening reliability; report sample sizes and uncertainty, then iterate.

## Scoring (100 total)

- Feedback correctness and actionable coaching: 30.
- Complete user flow and accessible mobile interaction: 25.
- Reliability, privacy, allowance and recovery: 20.
- Measurement validity and QA separation: 10.
- Observed production conversion and retention effect: 15.

Award points only against recorded evidence. Critical incorrect feedback, broken core flow, privacy/authorization issues, or missing production outcome evidence prevent 100. A score of 100 means all acceptance criteria are supported, not a claim of 100% visitor conversion. Do not shrink these requirements to make the score pass.

## Baseline

24h ending 2026-09-21 22:53 Asia/Shanghai: ordered page → open → first feedback 146 → 9 → 2; prepared audio → submit 7 → 3; feedback → repeat start → repeat feedback 2 → 1 → 0. V4 qualified exposure → click 30 → 5. New plan exposure 1, plan clicks 0, Stripe checkout creation/payment 0. GA processing lag and unmarked historical QA limit inference. See the task's diagnostic report for exact definitions.

## Validation so far (2026-09-21)

- Two live model rounds used synthetic answers only. The expanded 17-case suite passed semantic expectations, including valid personal examples, balanced conclusions, paraphrases, prompt injection, an empty closing phrase, unchanged/off-topic focused retries, and unclear transcription. This bounded test set is not an estimate of real-user accuracy.
- `npm run build`, the speech regression suite, and the billing regression suite pass. V5 regressions verify explicit corrections, idempotency, preserved prior feedback after failure, claim rejection, grounded evidence, goal selection, and QA-separated aggregates.
- The additive `claim_speech_feedback_v5` migration was applied to the dedicated speech database. Verified anon/authenticated cannot execute it; service_role can. Live synthetic SQL checks verified ownership, unchanged/no-revision behavior, transcript limits, concurrent admission of one request, and the three-call cap. Test rows and guest were removed; the two budget claims remain conservatively counted.
- A separate local UI harness imports copies of the product components, uses synthetic audio rather than a microphone, and keeps fixtures out of the product repository. Its live mode uses the real API routes, model and database with QA tagging. First feedback completed through browser recording → WAV conversion → authenticated API → model → saved result → visible drill; one remaining free attempt was confirmed. Mobile viewport 390×844 showed the next-action button in view. Subsequent verification continues below.
- React review kept model schemas/prompts out of client imports and added keyboard focus for results and transcript correction. Already-paid accounts are not shown a duplicate subscription prompt.

The observed conversion/retention requirement remains open. No 100-point claim is made from software tests alone.

- Completed mobile UI checks: real focused retry produced a grounded improvement comparison before other content; correcting punctuation regenerated matching feedback without another attempt; history restored the saved correction and showed progress before optional practice; history continuation honored exhausted allowance.
- Fixture UI checks covered transcription failure/retry, feedback failure/retry without retranscription, optional review before feedback, quota fallback, and separate inaccurate/later reasons. The 390px viewport had no horizontal overflow and the browser warning/error log was empty. All QA events used the `qa_` namespace; both real-model browser attempts were confirmed as QA in the database.
- Latest local webpack production build, speech/billing suites, TypeScript and focused ESLint checks passed. A previous Turbopack build also passed; after replacing the inherited dependency symlink with a clean installation, the verification harness used its own copied source files to avoid cross-directory development resolution issues.

## Evidence recovery follow-up (2026-09-22)

- PR #54 was released at 2026-09-21 15:58:34 UTC; production synthetic first/repeat practice, history, idempotency and quota checks passed. QA rows and the temporary guest were removed.
- At 22:10 UTC, two explicitly v5, non-QA first attempts were saved: one complete and one still transcribed, with no submitted repeat. The pending attempt coincides with two HTTP 503 responses at the evidence-validation stage. These are two requests for one attempt, not two failed users. Server submissions do not measure page visits, feedback views or motives for leaving. GA and payment reporting were unavailable in this follow-up.
- Evidence validation now participates in the existing feedback recovery boundary. A rejected quote, absent required evidence or invalid comparison can trigger one fresh generation, while strict validation still rejects an invalid second response. Format and evidence recovery share at most two provider calls and the same 45-second deadline, with one feedback claim and both successful-recovery calls in the usage ledger. Refusals, arbitrary application errors and insufficient remaining time do not retry.
- Diagnostics record only closed evidence categories. They exclude transcripts, quotes, account identifiers, provider content and arbitrary error messages.
- Synthetic live-model checks passed for an invented quote, missing evidence for a met criterion, and a comparison quoting the wrong answer. Each recovered with one real provider request after an injected invalid response. The regression suite also covers exhaustion, the shared format/evidence budget, deadlines, privacy and preserved retryable state. These tests establish bounded recovery behavior, not real-user improvement or guaranteed recovery from every model response.
