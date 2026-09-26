# First practice: clear preparation and optional context

Sep 23–25 Beijing's click-started ordered cohort was 121 → 57 first attempts → 44 audio ready → 39 submissions → 31 first feedback views. Mobile was 58 → 23 → 15 → 13 → 10. Beginning is emitted before permission; the missing 64 starts cannot all be blamed on microphone denial. These observations prioritize investigation but do not prove why individuals left.

This release clarifies the existing one-minute target as optional, gives a point-plus-example starting structure, and places the existing local-until-submit audio behavior before the recording button. The idle first-attempt 00:00 display is hidden to keep preparation and actions together on small screens; the live recording timer and retry timer remain. It does not shorten the audio minimum, alter model input, auto-start recording, auto-upload, change pricing, or modify the paid bridge shipped in PR66.

Below the recording and upload actions, first-time users can optionally explain why they are not ready: unable to speak now, unsure what to say, audio privacy, or exploring. Each response gives relevant help while leaving both recording paths available. No answer is required. Questions disappear after an attempt begins, are absent for retries, and capture no free text or personal content. Unanswered reasons remain unknown; listed choices are not an exhaustive account of everyone who leaves.

## Measurement

- `speech_start_v2_view` observes the available start button, at least half visible for a continuous foreground second. It is first-attempt only and separate from the legacy controls series.
- `speech_start_v2_begin` records the first explicit recording request or file selection once per coach instance. It includes invalid file selections, like the existing first-attempt event. It is not recording permission, valid audio, upload or feedback success. Fast actions do not manufacture impressions.
- `speech_start_reason_view/select` and the closed-choice `speech_start_reason_*` events distinguish question exposure from one explicit answer. A selection does not itself begin a practice or imply abandonment.
- The dashboard adds action → begin → audio → submit → feedback and question → answer → begin ordered funnels, independent reason counts, and new first-start columns in device/source/landing splits. Group columns are independent users, not ordered conversion rates. Core event names need no custom GA dimension.
- New version events start at deployment, never backfill history. QA uses the existing separate event namespace. Existing topic, duration and privacy controls stay functional. Changed guidance and optional help ship together; an observational change cannot isolate either one's contribution.

## Verification

The actual-component Chrome fixture harness verifies optional responses, double clicks, hidden/fast/deduplicated exposures, explicit upload and recording completion, microphone cancellation, late permission grants, quota preservation, and no automatic API call. Local fixtures prove behavior, not real transcription, email, payment, or conversion lift. Record release time, production QA ingestion and subsequent non-QA/Stripe aggregates separately.
