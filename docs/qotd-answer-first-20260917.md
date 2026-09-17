# Daily-question entry and navigation — September 17, 2026

## Decision and ownership

Optimize `/question-of-the-day`, the existing owner of general daily-question
and QOTD ideas intent. Keep student, work, and funny audience destinations in
their existing roles. No new route, title change, canonical/hreflang change,
index-policy change, or question-bank expansion is included.

The opportunity is to help visitors use the featured answer before drawing
another, and to browse the complete existing collection deliberately. On the
previous public page, random draw and print controls appeared before copy/save/
share. The full collection lacked category jump links and return links. The
featured server-rendered question also began at opacity zero until animation.

Private search and analytics details are intentionally excluded. The available
query report is a 28-day opportunity snapshot; it cannot isolate changing query
mix between two seven-day periods or prove why aggregate CTR changed.

## Page brief and changes

- Audience: someone seeking today's question or an existing general QOTD idea.
- Output: the existing date-based daily question, or a filtered random draw.
- Put copy/save/share directly after the question, before replacement controls.
- Present category filters before the draw button; preserve the current question
  until the visitor draws another. Keep default actions out of strict generated
  metrics and retain current no-repeat behavior.
- Render the featured question visibly from initial HTML, use a heading for its
  daily/random label, and reduce excess vertical spacing.
- Clarify the hero and description around today's answer, group-chat copying,
  the existing 120 ideas, and no-signup use. This is a description change, not a
  promise about the snippet Google will show.
- Add a normal category-anchor index, accurate counts, and return links to the
  complete server-rendered collection. Anchor navigation must preserve the
  selected filter and current random result.
- Preserve existing classroom/work weekly planner links and their distinct
  collections. No question is transferred or relabelled as audience-matched.

## Validation and observation

Run existing growth regression (including copy failure, default attribution,
random non-repetition, and weekly plans), lint, TypeScript/production build,
and SEO audit with category-anchor checks and all 120 questions. Review React
rendering and accessibility; no new dependencies, subscriptions, or events.

Public acceptance: default copy content, save/read-back/remove, share fallback,
filtered draws, return to today's question, category anchors and state retention,
and weekly planner destinations. Record actual results and deployment SHA in
the PR. Do not claim preview UI, real-device testing, server logs, or live GA4
ingestion without verification.

Hold this description/content iteration stable through October 1, 2026, barring
functional defects. Other title observation windows remain unchanged. Compare
complete post-release periods, keeping GA4 and GSC cutoff dates distinct. Track
broad default-question actions alongside strict post-generation actions. Event
user ratios are not ordered funnels, and launch-day QA is not organic adoption.

Implementation acceptance and improved traffic/conversion are separate claims.
Revert this PR through the existing GitHub-to-Vercel integration for a serious
regression.
