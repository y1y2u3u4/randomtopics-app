# Timer completion to the next recorded practice

## Scope and hypothesis

The timer already helps visitors practice aloud. Its completion state now offers a deliberate next recorded attempt on the same topic in the three English pages that already contain a coach: `/speech`, `/impromptu-speech-topics`, and `/table-topics-generator`. The previous timer did not record or assess speech. No microphone, upload, account or payment request starts when the timer ends or the bridge opens.

Historical ordered observations for September 23–25 (Asia/Shanghai) included 101 timer completers, 4 subsequent feedback submissions and 3 visible first feedback results. That was an all-site timer cohort, **not** the eligible denominator for this narrower change. This release tests a continuation hypothesis; it does not establish demand for a monthly subscription. Pricing, feedback models, free allowance and email/payment authorization remain unchanged.

## Behavior and ownership

The timer captures its topic at the first start of a round, preserves it while paused and when generator topics change, and captures again on reset/restart. A practice-panel selection takes precedence over the generator's first topic. A timer without a known topic asks for explicit topic text rather than silently generating one. Topics and recordings are never added to event properties or URLs.

A page-local registry connects each timer to its matching source's coach. No host means no bridge. Disabled coaching and Spanish timers keep their existing behavior. Same-topic practice resumes intact. A different topic offers a choice: preserve the current practice or explicitly replace it. Replacement remounts the coach so old media is stopped and old responses cannot overwrite the new practice. Saved feedback remains in history. There is no new storage or persistent account state.

## Measurement

All events go through existing `trackSpeech`, including QA isolation. `speech_timer_eligible_complete` means a timer ended on a supported English page with a registered coach. It does not imply that the CTA was visible.

- `speech_timer_bridge_view`: an enabled CTA was at least 50% visible in the foreground continuously for one second, once per completed round.
- `speech_timer_bridge_click`: deliberate click, guarded against duplicate dispatch. Fast clicks never manufacture a view.
- `speech_timer_coach_open`: a **new** timer-origin practice was created, including an explicit replacement.
- `speech_timer_topic_conflict` and `speech_timer_practice_resume`: existing-work choices, not new timer-origin practice.
- `speech_timer_attempt_start`, `speech_timer_audio_ready`, `speech_timer_submit`: first-attempt events derived only within the new timer-origin coach.
- `speech_timer_feedback_view`, `speech_timer_retry_view`: actual qualified visibility of feedback headings, not merely a completed server request.

Timer origin is local to the mounted practice. Reloading or opening saved history does not reconstruct that origin. A preexisting practice resumed from the bridge is never retroactively relabeled. GA4 funnels deduplicate users and can span sessions or attempts; they are not recording-level joins. The private dashboard adds `timer_bridge`, `timer_opportunity`, and `timer_value` ordered funnels plus independent event/device counts. New events are not backfilled.

## Verification and effect boundaries

`npm run speech:timer-browser` serves a local Chrome fixture at port 4690. It renders the actual timer, entry, coach, feedback and topic-selection components. Only media, clock advancement, lazy loading and API responses are controlled fixtures. The regression covers completion/pauses, frozen and selected topics, own-topic input, recording/upload through feedback, duplicate actions, retained recordings, explicit replacement, media cleanup, late responses, restart/reset, source/language isolation, and qualified CTA exposure. These checks are not real model runs, email delivery, customer sessions or payments.

Production verification must separately exercise the real timer and lazy-loaded entry with `speech_qa=1&usage_qa=1`, verify QA event receipt, and inspect natural post-release data. Log the deployment time and first full minute rather than blending the release hour. Compare qualified opportunities, starts, actual visible feedback, retries and plan/checkout/payment outcomes. A small zero cohort or a successful synthetic test is not evidence of business lift. Without randomized controls, before/after changes remain observational.
