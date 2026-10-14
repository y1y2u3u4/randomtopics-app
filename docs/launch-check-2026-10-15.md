# Launch check 2026-10-15 — speech coach exposure + typed answers

PRs: #127 (typed answer, feedback button first) · #128 (entries on /debate, /question-of-the-day, after timer rounds)

## Baseline (GA, 10/7–10/13, users; property time zone America/Los_Angeles)
| Step | Users |
|---|---|
| Coach page opened (speech_page_view) | 2,243 |
| Entry button visible | 1,856 |
| Entry clicked | 384 |
| Start screen visible (speech_start_v2_view) | 386 |
| Attempt started (speech_start_v2_begin) | 150 |
| Recording finished (speech_record_complete) | 103 |
| Feedback requested (speech_feedback_v5_request) | 71 |
| Feedback seen (speech_first_feedback_view) | 59 |
| Nav link seen / clicked | 6,751 / 171 |
| Timer completed (any page) | 148 |

Compare from 10/21 (one full week after 10/15): typed share of starts (`speech_typed_submit`), start rate (begin ÷ start view), submit rate, `handoff_debate|qotd|timer_*`, `speech_timer_invite_*`, and weekly first-feedback users.

## Checks
- Machine walk (site_walk.py, production): /speech, /table-topics-generator, /impromptu-speech-topics, /terms → severe 0, medium 0. /debate, /question-of-the-day, /topics/toastmasters-table-topics, /speech → severe 0, medium 0. Low items are pre-existing long titles/descriptions and /debate og:image.
- Production, QA session (`?speech_qa=1`): typed answer on /speech → feedback in ~15 s, "1 free attempt remaining" shown.
- Local Chrome: QOTD button carries the question to /speech#selected-topic with a return link to /question-of-the-day; /debate button under "Prepare my argument"; Toastmasters timer finish shows "Want feedback on that answer?".
- Not done: 375 px phone emulation (Chrome window stayed at desktop width). Layout uses the same wrapping flex rows as neighbouring buttons.

## Deferred
- Nav label "Speech + AI" wording — the nav renders on the home page, which is frozen until 10/26.
- Feedback footnote says "the words we heard" also for typed answers; wording tweak later.
