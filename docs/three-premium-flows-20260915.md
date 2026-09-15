# Three existing-page practice flows — September 15, 2026

This iteration improves three established search-intent owners: `/speech` for choosing and practicing a speech, `/question-of-the-day` with its existing student/work planners for recurring sessions, and `/es/topics/most-likely-to-questions` for hosting a Spanish party round. Private traffic and query reports are not included in this repository.

## Problems and resulting behavior

- Speech previously exported placeholder hints as if they were completed notes, and selecting another topic lost the draft. Empty notes now have no export action; partial and complete PREP outlines are clearly labelled and contain only actual notes. Each topic keeps its own draft while switching within a batch. A new generated batch remounts the practice panel, clearing drafts, selection, and timer even when it contains the same topic ID. Explicit Save remains local to the browser; notes never enter analytics.
- The daily-question hub links directly to the existing student/work weekly planners. A planner can keep its own matching current question for Monday, replace one day without changing the others, and copy or print the full questions, follow-ups, and facilitation notes. Sparse filters produce the actual number of days. Failed automatic copying provides selectable text without recording success. The hub does not silently transfer a question into a different audience's collection. Plans remain in the open page and changing filters clears them, as disclosed beside the controls.
- The Spanish party page uses the existing 100 questions in eight categories to prepare five- or ten-question rounds. The host can advance, skip, export an individual question or the whole selection, and return from the article without losing the round. Skipped questions leave the round export; pending questions remain, as stated in the interface. Changing the controls prepares the next round without clearing the active one. Replacing an unfinished round does not record completion.
- Returning to the default daily question in `PremiumPromptTool` clears generated status, even if that same question had appeared in a random draw. Default copies/saves/shares remain outside strict post-generation metrics.

## Measurement and observation

The existing Landing Pages report remains a **visited page (`pagePath`)** report, not landing sessions. Its original 45 columns are preserved; columns AT–BC append timer start/complete events, practice draft events/users, outline-ready events/users, party completion events/users, skipped-question events, and weekly single-day replacements. The writer expands the existing grid as needed during the normal sync. Existing broad and strict action columns remain distinct.

`practice_draft_start` and `practice_outline_ready` mark transitions in edited notes, not generated topics. Re-entering a state can produce another event, so event counts and unique event users are both exported. `party_round_complete` means that the host has advanced or skipped through the round; it does not prove a group played aloud, and a fully skipped round can complete. Its event parameters include played/skipped counts. A round produces one `generate_success` with its actual question count; navigation does not produce another generation. Weekly planner actions remain separate from single-question generation.

These are aggregate events, not an ordered user-linked funnel. Zero-denominator ratios are unavailable for analysis. Do not call low-volume or delayed events failed conversions. Verify that the new event columns populate after a successful scheduled report sync before drawing conclusions; browser UI checks and synthetic tests do not prove GA4 ingestion.

Titles, canonical/hreflang rules, index policy, and routes are unchanged. Existing title observation deadlines remain September 18 for the September 4 speech/writing/ethical/Toastmasters changes and September 26 for Two Truths. The September 14 Spanish conversation content/description observation window remains September 28. Assess this September 15 utility release using complete post-release GA4 and GSC periods with their actual, potentially different cutoff dates. Start with usage and task completion; traffic changes cannot be attributed to this release merely because it shipped.

## Verification

- `growth:test` includes actual component-handler regression scripts for speech draft switching and new-batch remounting, planner pin/replace/export/failure paths and default attribution, Spanish full-corpus non-repetition and skipped exports, and the actual GA event reducer/Sheets writer using synthetic data.
- Required release gates: lint, TypeScript/production build, and build/production SEO audit, including existing collection counts and metadata.
- Production acceptance: speech edit/switch/copy/save/read-back/timer; daily hub entry and both audience planners with one-day replacement/full export/print; Spanish filter preservation/skip/full round export/save/read-back/completion/return links.
- Record actual deployment and browser results in the PR. Provider-restricted previews, unavailable runtime logs/mobile emulation, and unverified analytics ingestion must not be presented as passed checks.

Rollback is a revert of this release through the existing GitHub-to-Vercel integration if production has a serious regression.
