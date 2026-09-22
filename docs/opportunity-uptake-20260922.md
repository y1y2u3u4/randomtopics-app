# Existing opportunity uptake — 2026-09-22

## Scope and ownership

User-authorized follow-up to the core usage release. Baseline: main after PR #56.
No private traffic rows, queries or credentials are published here.

| Intent | Existing owner | Decision |
| --- | --- | --- |
| Ethical dilemma cases for discussion | /topics/ethical-dilemma-questions | Add three worked discussion cards from the existing corpus |
| Random questions for a situation | /question-generator | Add explicit links to existing matching collections |
| Writing topics by output format | /writing-topic-generator | Existing homepage and /writing links verified; preserve |
| Broad writing prompts | /writing | Verify PR #53 recovery and production generation; no duplicate rewrite |
| Charades | /charades | Observe the September 21 release |

## Page brief

Ethics cards serve readers who have chosen a case and need to use it immediately.
Each card reuses an exact existing scenario with two defensible starting positions,
explicit costs, two follow-ups, full-card copy/save/share and focused printing.
These are discussion exercises, not an answer key, a binary-only decision or
professional advice. Existing 66-item corpus and category generator remain intact.
The three worked cases are not counted as additional unique questions.

Question scenarios link to adult get-to-know-you, daily group-chat question,
student daily questions and partner deep questions. They open existing collections;
they do not relabel a generic pool or imply applying a generator filter. The general
generator stays available. Existing title, canonical, hreflang and index policies
are unchanged. No new SEO routes are created.

## Measurement

- ethics_card_copy/save/share and corresponding errors derive only from shared
  action API results on the ethics page with action_surface=ethics_card.
- Default discussion cards are not generation and emit no strict post-generate action.
- question_scenario_friends/group/classroom/deep record explicit outbound clicks,
  not arrival, successful use or a user-ordered funnel.
- Focused print uses existing print_open/print_error; opening print is not completion.
- Exact page/event rows are included in the existing Core Usage report writer.
  Normal sync and actual event receipt still require post-release verification.
- Production acceptance uses usage_qa=1&measure=1. QA events remain separate.

## Observation and validation

Content observation for ethics and question-generator resets September 22 through
October 6. Titles stay stable. Preserve existing core-flow, Spanish-conversation,
Two Truths and Charades observation windows. Sparse new data is not failed demand.

Validate regression, topic-provider recovery, speech regression, lint, TypeScript,
production build and SEO audit. Regression checks exact corpus identity, all export
fields, saved readback payload, five print sections, no fake generation, and
scenario targets/events. Production acceptance must inspect full copied content,
save/readback, print document, scenario navigation and general writing generation.
Protected preview URLs are not bypassed. GitHub/Vercel status alone is not functional
acceptance. Record actual production acceptance in the PR description.

A successful smoke test is not proof that all historic generation errors are fixed.
Compare complete post-PR #53 periods before drawing that conclusion. A second
success event without a matching start is a measurement issue, not >100% success.
