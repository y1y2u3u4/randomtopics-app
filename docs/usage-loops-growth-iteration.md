# Existing-page usage improvements — September 12, 2026

The iteration improves completion of existing visitor tasks. No new indexable route is introduced. Search titles on speech, writing, ethical dilemmas, and the recently revised Two Truths page remain unchanged. Private traffic data and query exports stay outside this repository.

## Changes

- Spanish topic generation uses the real localized pool to disable empty choices, clear an incompatible depth when changing category, show the available count, and cap batches. Static draws complete their current filtered pool before repeating and never mutate prior history. The Spanish conversation FAQ describes the actual collection instead of claiming unlimited AI generation.
- Question of the Day and shared party generators use the standard copy, local save, share, and manual-copy recovery controls. Today's question remains a default display, excluded from strict post-generation actions. Random draws retain history; daily question dates refresh after local midnight. The daily page renders all 120 questions and links to existing classroom and team weekly planners.
- All 55 Spanish controversial discussion questions receive two question-specific perspectives and a follow-up. The existing URL includes category draws, complete-card actions, crawlable expandable details, and complete printable cards. Its actual modification date is updated.
- The ethical dilemma generator appears before the introduction. The Spanish Most Likely To page has a more compact hero and return links that preserve the current question.
- The speech generator connects the selected result to an editable PREP outline and timer. Copy and explicit local saving include that outline. Choosing a new topic resets the practice card and timer. Edited notes receive a new local save identity and are never included in analytics. Timer completion is recorded outside React state updaters.

## Measurement

`generate_start` and `generate_success` identify intentional draws. `post_generate_actions_view`, `post_generate_copy`, `post_generate_save`, and `post_generate_share` remain separate from broad actions on initial cards. A failed automatic copy emits `copy_error` and exposes selectable text, without recording copy success. Group messages and share links exclude URL query strings. Practice selection records a source and action, never the question or notes.

Compare equal complete periods after rollout. Use page visits as page visits, not landing sessions; event-user ratios are not an ordered, user-linked funnel. Show zero-denominator rates as unavailable in analysis. Recent SEO title changes keep their existing observation windows. Do not attribute traffic or conversion changes to this release before enough post-release data exists.

## Verification and release checklist

- `npm run growth:test`: real UI handlers for all 48 Spanish conversation combinations, finite-pool exhaustion, immutable histories, daily/default distinction, party actions, all 55 discussion-card mappings, copy recovery and event privacy, selected speech topic, plus previous growth and Two Truths checks.
- `npm run lint`, TypeScript checking through `npm run build`, and `SEO_BUILD_DIR=.next/server/app npm run seo:audit`.
- Vercel preview: Spanish empty-filter recovery and sparse batches; daily default/random/back-to-today with group copy and weekly links; Spanish discussion generation/copy/save/print; speech prompt/outline/copy/timer; ethical and Spanish party entry points.
- After merging the verified head, confirm the production deployment status, run the SEO audit against the official origin, and repeat key public-domain interactions. Inspect the page console for application errors and layout overflow.
- Browser UI verification does not establish GA4 ingestion or replace a provider runtime-log check. Confirm ingestion in the next available analytics report. If provider log access is unavailable, record that verification limit.

Rollback uses the previous production commit or a revert of this pull request through the established GitHub deployment integration.
