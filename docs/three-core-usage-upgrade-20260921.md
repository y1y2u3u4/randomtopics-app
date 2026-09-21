# Three core usage flows — September 21, 2026

## Scope and ownership

The user explicitly requested improvements to all three existing core directions,
not only a newly discovered page. This release covers QOTD, speech and Spanish
Most Likely To. No new route, search title, canonical, hreflang or index change.
Private search/analytics data remains outside this public repository.

| Priority | Intent owner | Action and expected user value |
| --- | --- | --- |
| 1 | `/question-of-the-day` | Remember a daily audience and return to a suitable daily prompt; make saved default prompts accessible. |
| 2 | `/speech` | Reach unrecorded timed practice directly, then choose one self-review focus for a repeat attempt. |
| 3 | `/es/topics/most-likely-to-questions` and `/es/most-likely-to` | Choose a real article category for a round; distinguish curated rounds from continuous single-question play. |

These directions were selected using the already reviewed full-site report.
Concurrent speech AI entry/feedback/billing work is retained; this release does
not alter its backend, recording consent, quota, checkout or paid promises.

## Page briefs

### Daily question

Keep the existing 120 questions, 24 per category. A separate daily-audience
selector picks a deterministic question for the visitor's local date. Save only
the category string in this browser, validate stored values, and retain an
in-memory fallback if writing is blocked. Hydration and midnight changes never
emit generation success. Random filters remain explicitly independent. Choosing
a daily category returns from random mode to the daily question. No question is
borrowed from the student/work planner collections.

Default-question save now offers Open my saved topics, without reclassifying
that save as a strict generated action. Copy/share still contain the displayed
question and existing group invitation. Existing student/work planner links
and question-bank navigation remain intact. FAQ explains same-category/date
consistency rather than implying every personalized visitor sees one global item.

### Speech

Add a direct link beside the existing AI entry to the unrecorded timer. Display
the chosen topic above practice; the timer comes before notes on narrow screens.
Keep PREP in an optional disclosure, preserving draft values, complete/incomplete
exports and per-topic draft identity. Do not require notes or recording to start.

After time expires, offer three self-review focuses: state the point sooner, add
a concrete example, or end with a takeaway. Clearly call this the user's own
reflection, not an assessment. Existing Restart practices the same topic and
keeps the chosen focus visible. A new topic/new batch resets this local focus.
No transcript, notes or topic text is sent with the new events.

### Spanish party questions

Add a category-to-round action after each of the article's actual sections. The
existing mounted round accepts only a valid group index, selects that category
and announces it. It does not generate or replace a round until the host presses
Prepare. Existing question counts, skip handling, copy/save/share, corpus and
return anchors remain unchanged.

The continuous generator now visibly links to category-based 5/10-question
rounds. Explain that the two pages use different decks and do not transfer the
current question. Do not label multiple query-visible URLs as cannibalization.

## Measurement and observation

New events: qotd_daily_category_select, practice_timer_entry,
practice_self_review (enum-only review_focus), party_category_entry. Existing
all-site GA4 Actions reads all event names by page. Default QOTD actions stay
outside post_generate metrics; daily preference is not retention. Timer expiry
and party completion do not prove a spoken answer or offline participation.

Functional release is not growth validation. This release changes several
flows at the user's explicit request; do not causally attribute site-wide gains
to one feature. Observe these functional changes from September 21, 2026, with
2–7-day collection checks, a 7–14-day usage review and a 28-day search comparison.
QOTD's prior description/content comparison is interrupted by this authorized
upgrade: restart its observation window through October 5. Titles remain stable.

## Validation and release record

- Existing growth and speech regression; new daily-category tests cover all
  categories over 24 days, invalid preferences, default attribution, restored
  preference and blocked-storage fallback.
- Extended timer regression covers self-review, event enums and retained focus
  after restarting. Existing precise pause/completion tests remain.
- Extended Spanish round regression covers article selection without overwriting
  the current round, valid category corpus on explicit prepare, and bad indices.
- Lint, TypeScript/production build and SEO audit; retain truthful collection
  counts, canonical/indexability and existing headings.
- Public production acceptance must exercise daily selection/reload/copy/save
  readback; speech timer completion/review/restart and optional draft export;
  Spanish category/round/copy and reciprocal navigation.
- Record actual deployment SHA and acceptance in the PR. Do not claim protected
  preview UI, real devices, paid AI results or live ingestion unless observed.
