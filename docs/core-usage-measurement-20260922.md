# Core usage measurement and direct question actions

## Decision and ownership

The owner explicitly requested these three paths be progressed together. The
latest available private report predates the preceding UI release, so there is
no post-release evidence for another redesign, new SEO page or progress recovery
feature. This release fixes measurement gaps and directly enables taking a
chosen question from the existing QOTD list. Private figures and queries are not
published here.

| Priority / intent owner | Decision / evidence | Audience and change |
| --- | --- | --- |
| 1: `/question-of-the-day` | Optimize existing list: only the generator had actions; default/random actions lacked separate report rows | A reader can expand any of the real 120 questions and copy just that question, save or share it. Favorites use the same ID as daily/random results. |
| 2: `/speech` | Measure: legacy timer start also fires on resume | Keep direct practice and optional notes. Add first-start excluding resume, retain completed restart, observe actual feedback requests after timer completion. |
| 3: `/es/topics/most-likely-to-questions` and `/es/most-likely-to` | Measure: visible reciprocal links lacked dedicated events | Preserve browse/curated-round versus continuous-play ownership. Measure entry clicks, whole-round successful actions, and returns with an unfinished marker. |

No URL ownership conflict is established. Existing language, title, canonical,
hreflang, index policy and corpora remain. QOTD content/action observation resets
with this explicit owner-requested change on September 22; review through October
6. Existing student/work planners and their real corpora remain unchanged.

## Measurement contract

- `qotd_daily_*`, `qotd_random_*`, `qotd_list_*` split successful copy/save/share
  and separate errors. Defaults and list actions never emit generation success
  or strict post-generate events. `qotd_list_open` means the disclosure was opened,
  not viewport exposure. Saved removal is not successful saving.
- `timer_first_start` means first start since reset/preset/topic mount. Existing
  `timer_start` retains its old semantics, including resume; never sum it with
  first-start. `timer_restart` requires a completed timer in the same mounted
  component. Completion does not prove the visitor spoke.
- `speech_after_timer_feedback_request` is the first explicit existing v5
  feedback request within 30 minutes after a timer completion in the same tab.
  It does not establish that the topic is identical or that feedback succeeded.
- `party_article_to_tool` / `party_tool_to_article` mean link intent, not loaded
  destination. `party_round_copy/save/share` count collection actions only.
  Sharing may use clipboard fallback; it does not prove delivery to a group.
- `party_tool_entry_with_unfinished` and `party_revisit_unfinished` use a same-tab
  unfinished marker cleared by round completion and ignored after 30 days.
  Reload and back navigation can qualify; this is an indication to investigate
  recovery needs, not proof of abandonment or a persisted playable round.
- `*_return_after_use`: same browser after successful copy/save/share (speech
  also timer completion or actual feedback view; party also round completion),
  at least 30 minutes without a tracked event in that flow, within 30 days.
  Immediate reloads are excluded. This is not D1/D7 cohort retention, cross-device
  identity, or proof of causal lift. Clearing/blocking storage limits coverage.

Storage holds only coarse usage times and temporary markers. No topic text,
draft, recording, query string, user ID or session ID is added. Natural and QA
markers use separate namespaces. Storage failure cannot block primary events or
the user's action. The privacy page explains the new markers.

## Reporting and QA

The existing private sitewide sync now derives a `Core Usage` tab from exact
page/event rows in `GA4 Actions`, for current7 and previous7. No custom GA
dimensions or new permissions are required. QA-prefixed events are excluded.
Rows carry precise definitions, observed event/user counts and coverage status.
Limited, sampled, thresholded or capped source data is labeled limited. An
upstream read failure stops sync before any Sheet modification; stale snapshots
must still be detected from Report Coverage and Run Log. No rows are converted
into ordered funnels or retention rates. Zero pre-release signals cannot be
interpreted as demand failure. Actual new-tab creation and ingestion require the
next successful normal sync; code support is not proof that the Sheet changed.

Production functional QA uses `?usage_qa=1&measure=1`. The visible diagnostic
panel reports emitted events with `qa_` names and excludes content. This QA mode
persists in the tab across navigation; `?usage_qa=0` exits. Existing speech QA
continues to work. Browser emission is not evidence of GA receipt.

Validation: full growth/speech regression, lint, TypeScript production build,
SEO audit; production list copy text/save read-back, default/random/list event
separation, actual timer pause/resume/complete/restart, reciprocal party entry
and whole-round copy. Deterministic tests cover storage denial, clock gaps,
expiry, absent/expired timer markers, QA isolation and report coverage.

Do not falsify browser time or natural visits to manufacture retention. Browser
production results, deployment SHA, and any unverified scenarios are recorded in
the PR acceptance notes. Next review waits for complete post-release data.
