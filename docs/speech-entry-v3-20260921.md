# Speech entry v3: concrete feedback and qualified exposure

The first generated topic is immediately followed by the primary free-practice
action and an illustrative feedback example. Further topics, regeneration and
exploration follow it. The coach remains mounted outside keyed result animations,
so generating another batch does not discard existing recording/feedback state.
Before a topic exists, the primary action generates a topic and opens practice;
the example is usable without generation. The existing generator fallback remains.

The promise is a 60-second answer and one specific improvement to its point,
example or ending. The static demonstration is labeled as illustrative. It makes
no voice/accent scoring or guaranteed improvement claim. No email/card is needed
for the two free attempts; existing billing and authentication rules remain.

## Measurement contract

- `speech_entry_v3_page`: new entry mounted once per page instance.
- `speech_entry_v3_view`: primary button is enabled, connected, at least half
  visible and in a visible, focused document continuously for 1000 ms. Scrolling
  below the threshold, backgrounding, blur, busy state or unmount resets the wait.
  Once per mounted entry. An unavailable observer emits no fabricated exposure.
- `speech_entry_v3_click`: actual primary or example-to-practice intent, including
  clicks faster than the exposure threshold. `entry_surface` is primary/example.
- `speech_coach_v3_open`: topic obtained and practice expanded for the first time.
- `speech_example_open`: first deliberate expansion of the illustrative example.
- `speech_example_practice`: click on the practice action inside the example.
- `speech_entry_v3_error`: no topic could be obtained; does not mean practice opened.

Existing practice/audio/feedback events remain. The original weak
`speech_entry_view` stops being emitted by this entry; its historical funnel is
labeled legacy. Do not compare its percentage directly with the stricter v3
exposure percentage. Exact event names avoid custom-dimension registration.
New event columns are appended to Speech Daily to preserve historical columns.

Two closed user funnels distinguish qualified exposure to first feedback and
example opening to actual practice. Each adjacent step is within 24 hours.
The private dashboard includes hourly independent user counts with the GA
property's time zone. Do not sum hourly users into a daily unique total or divide
independent event totals as though they were ordered conversions.

## QA and live verification

Use preview `?measure=1` for local event inspection without sending GA4 events.
Production `?speech_qa=1&measure=1` uses `qa_` speech event names and local
inspection; the marker stays in sessionStorage across navigation, and
`?speech_qa=0` clears it. QA events are absent from the natural speech event
allowlist and funnels. Generic page/generator activity may still affect whole-site
traffic; do not describe the whole-site denominator as completely QA-free.
This flag never changes authentication, quotas, payment or backend behavior.

Required verification: desktop and mobile layout; example open/close; starting
before generation; a generated batch of multiple topics; correct selected topic;
hide/reopen and regeneration without losing the active practice; keyboard access;
no fabricated fast-click exposure; valid server response and feedback rendering;
natural/QA reporting separation and live GA reception. Billing regressions cover
unchanged payment/ownership boundaries. Real card charging is not QA.

Evaluate production by the release time and full post-release hours. Keep v3
traffic and qualified funnels separate from the 00:00–08:59 legacy baseline.
Initial small samples are descriptive, not proof of uplift or absent demand.
The next useful question is whether visitors inspect the example, then begin and
complete an attempt. A first review target of 100–200 qualified exposures is a
sample-collection goal, not a claim of statistical significance.
# Browser verification (2026-09-21)

Preview `dpl_Fv7SpCLGY5QgsFz3Je8J9gW55udT` built successfully. Chrome extension checks passed at desktop and 390×844: initial enabled CTA, illustrative example, example CTA generates a topic and opens practice, qualified exposure emitted once, regeneration with three topics keeps the active practice, entry follows the first result, hide/continue preserves it, keyboard Enter works, and no console errors were observed. Viewport override reset afterward.

The daily private reporting job also reads natural and `qa_` realtime event aggregates separately, enabling verification of GA ingestion without placing QA events in the natural funnel. Generic site pageviews and topic events are not covered by speech QA isolation.
