# Selected-topic use, 2026-09-22

## Page brief and ownership

Improve the next action after selection on existing pages. Home owns broad topic selection; `/spin-the-wheel` owns wheel selection; `/debate` owns debate-topic preparation; `/es/topics/public-speaking-topics-for-beginners` owns the curated Spanish collection. Practice stays on the existing English/Spanish speech page. No new indexable page, title change or ownership merge.

The opportunity is meaningful use of existing selections, not a claim that a new feature already increased search traffic. Private reporting remains outside the repository. Preserve the separate feedback work in PR #59.

## Changes

- Home and English wheel offer practice of the exact selected topic, including its talking points. Spanish article items offer the exact Spanish prompt in Spanish practice.
- The handoff is versioned, tab-local and expires after two hours. It validates shape, source and locale. No prompt text appears in the URL or event parameters. Blocked storage keeps the user on the source with a visible fallback; missing/expired selections show an honest message. Ordinary speech-page visits do not automatically open stale handoffs.
- Returning to home/wheel exposes the selected topic and its actions. This preserves the chosen topic, not the whole generator batch, timer or wheel history. Spanish return links point to the original list item.
- Wheel draws avoid repeats within the currently mounted category pool until exhausted. Animation completion consumes the pending winner once. Restored topics do not count as spin success or post-spin actions.
- Debate preparation accepts the user's position, counterargument, evidence to verify and opening. Copy/share contains only the chosen topic and nonempty notes; empty hints are not exported. Drafts stay mounted locally; the UI asks users to copy before choosing again or leaving. No claim of verified evidence or AI coaching.

## Measurement

Core Usage reports spin starts/successes and strict `post_spin_*`; never use generic generation as the wheel denominator. Source-specific `handoff_*` distinguish click, load, return navigation, first timer start, timer completion/restart and successful/failed copy/save/share. `debate_prep_*` distinguishes opening, actual typing and export outcomes.

An imported or restored topic is not generation. Timer completion does not prove spoken participation; return navigation is not cohort retention; independent event users are not an ordered user funnel. Existing same-browser return measurement remains active. QA names and storage are separate. New report rows require the next normal sync; do not claim actual GA4 receipt from browser diagnostics alone.

## Validation and observation

`npm run handoff:test` covers exact Spanish payload, malformed/expired/future/source rejection, empty-note export, no-repeat cycle, strict spin attribution, blocked-storage event derivation and QA report exclusion. Run existing growth/topic/speech/billing regressions, lint, TypeScript, production build and SEO audit. Production acceptance is recorded in the PR after deployment.

Observe the first complete post-release seven-day window (September 23–29 in the reporting source's timezone), compared with September 16–22 while noting the release day in the baseline. Read each source's actual latest complete date. Keep existing QOTD/ethics/question-generator and Charades observation windows; no same-day causal growth claim. Review source-specific loads and meaningful actions before adding more steps or pages.
