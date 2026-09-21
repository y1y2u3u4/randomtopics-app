# First-feedback format failure and recovery

The production feedback route returned 503 at 2026-09-21 11:59:49 Asia/Shanghai.
Its safe diagnostic was `model_schema`, with provider HTTP 200 and 3477 ms.
The old log has no field details, so the exact historical response cannot be
reconstructed. No customer transcript or model response was added to logs.

A four-case synthetic probe against the actual configured model reproduced a
specific first-attempt failure: `comparison.explanation` was empty. The provider
returned complete JSON (`finish_reason=stop`), but the application's non-empty
string requirement rejected the whole feedback object. There was no previous
speech to compare, and the UI does not show a comparison for a first attempt.
The other three baseline samples passed; this is a reproduction, not a failure-rate
estimate or proof that every historical schema failure had this same field.

## Change

- First attempts request only strength, priority and structure. The server adds
  the deterministic `first_attempt` comparison marker and empty before/after
  quotes. Actual improvements and advice still come from the model and undergo
  the original strict validation.
- Repeat attempts still require the full comparison schema, a non-empty
  explanation, and quotes grounded in both transcripts.
- Feedback JSON/structure errors get one fresh generation attempt. Both calls
  share a 45-second model budget; recovery starts only with at least five seconds
  remaining. Transcription retains its existing behavior. No recovery is added
  for arbitrary HTTP/network failures or filtered responses.
- The feedback route claims the existing attempt once. Automatic recovery does
  not create another attempt or claim another unit of practice allowance. Both
  provider usage records are retained under `usage.feedback.attempts` when a retry
  occurs; single-call usage remains unchanged.
- Exhausted generation failures use the existing retryable-state handling. The
  transcript stays attached to the same attempt within its existing retry limit.
- Failure diagnostics add attempt/retry status plus allowlisted schema field
  names and error categories, never values or messages. Successful format recovery
  is recorded separately from terminal user-visible failure.

## Verification

`npm run speech:test` includes the reproduced empty first-comparison case,
invalid JSON/schema followed by success, two failures, shared deadline,
single quota claim, retryable state, comparison requirements, quote validation,
usage accounting and private-field exclusion. TypeScript, ESLint and payment
regressions also pass.

`scripts/speech-feedback-live-check.mjs` is an explicit server-side check using
synthetic text and the real model service, with authentication and storage
fixtures. It writes no customer records or analytics events. First, short,
off-topic and repeat responses all passed. An injected format error followed by
a real provider response also recovered successfully; all five checks returned
200 with grounded quotations, in approximately 1.5–2.4 seconds. The live check
does not by itself prove browser rendering or database persistence.

Provider documentation explains that structured output supports a JSON Schema
subset and that values still need application validation:
[Google structured output](https://ai.google.dev/gemini-api/docs/generate-content/structured-output?hl=en),
[OpenRouter structured output](https://openrouter.ai/docs/guides/features/structured-outputs).
These are design references, not evidence for the specific historical incident.
