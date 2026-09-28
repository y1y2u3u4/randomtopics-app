# Optional everyday warm-up

The September 21–27 Beijing-day audit showed separate ordered funnels of 1,125 entry impressions → 200 clicks, 49 first feedback views → 13 retry clicks → 9 retry feedback views, and 15 full-plan views → 0 plan clicks. These are different cohorts, not one 15,225 → 49 → 13 → 15 funnel. Only three people had effective views of the newer plan button. Natural behavior may include unmarked tests.

The newer start cohort was 27 effective start-control views → 9 beginnings → 5 audio-ready → 4 submissions → 2 first feedback views. The optional reason questions received impressions but no answers in the audited window; motives remain unknown. Existing microphone recovery and timer bridges remain in place.

## Hypothesis and change

A production Chrome visit to the first-practice action selected “Coral spawning: the largest synchronized reproduction event on Earth” even at light depth. Speaking immediately about a knowledge-heavy topic may add preparation friction. This observation is a plausible usability problem, not proof that it caused the measured drop-offs.

Before beginning a first attempt, users can explicitly select a local everyday topic about a helpful small habit, with a 20-second goal and a short sentence starter. The original topic is still the default. Switching back restores its exact topic and time goal. There is no extra step required, network request, microphone access, or model call when choosing either topic.

Once an attempt begins, the warm-up chooser is removed. Retries keep their comparison topic. First-use and retry quotas, privacy consent at explicit submission, model validation, and paid plan remain unchanged. A switch away from a timer topic is not counted as a same-topic timer completion.

## Measurement

- `speech_warmup_offer_view`: optional choice button at least half visible in foreground continuously for one second; once per mounted coach.
- `speech_warmup_select` / `speech_warmup_return`: explicit topic selection / return. Choosing a topic is not beginning an attempt.
- `speech_warmup_begin`, `speech_warmup_audio_ready`, `speech_warmup_submit`: first-attempt stages while using the warm-up topic.
- `speech_warmup_feedback_view` / `speech_warmup_retry_view`: actual result heading visible for one second in this coach; first and retry results separate. History recovery uses existing history events.
- QA names are prefixed `qa_`; no question, speech, transcript, audio, or personal identifier is sent to analytics.

Private analytics includes choice exposure → choice, choice → first feedback, and first feedback → retry result → paid-plan button exposure/click as separate ordered funnels. Fast choices do not manufacture exposure. No historical zeroes are backfilled.

The primary evaluation is successful first feedback, then repeated practice and plan intent. Choice clicks alone are not success. Opt-in cohorts differ, so higher completion among warm-up users would be descriptive, not causal proof. Changes before/after release cannot isolate this change from the earlier topic-cost and handoff release.

## Validation

Actual component Chrome fixtures cover opt-in and double-click behavior, restore, no premature media/API calls, correct topic in submission, unchanged two-request sequence, timer attribution, hidden/fast/reopened exposure, retry topic protection, and result visibility. These fixtures use mocked media and API responses; they are not real feedback quality, microphone permission, mail delivery, payment, or customer conversion tests.
