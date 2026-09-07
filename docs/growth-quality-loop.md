# Growth quality iteration

This release turns existing collections into repeatable activities and makes private reporting comparable. Traffic data stays in the private reporting channel.

| Priority | Surface | Action | Validation |
| --- | --- | --- | --- |
| P0 | Query opportunities | Filter malformed and instruction-style noise; show exact 28-day dates | Synthetic quality and writer regression |
| P0 | Writing intent | Mark non-owner visibility for review; observe the recent ownership release | Owner mapping, 14-day guard, contextual links |
| P0 | Ethical and Toastmasters articles | Middle/end entries reuse the original filtered generator | Same pool, no repeats, focus and generation events |
| P0 | Spanish Most Likely To | Move utility before the article; add category filters and local saving | Filter-specific results, copy, save, localized library |
| P1 | Generated result actions | Copy a complete group message; open the saved collection | Clipboard payload, persistence, strict action event |
| P1 | Conversation hub | Link to question, Hot Seat, and Two Truths use cases | Existing destinations, canonical and metadata audit |
| P1 | Existing opportunity pages | Add six pages to the measured cohort | Zero-data rows retained; true prior-week baselines |

## Intent ownership

| Intent | Owner | Review condition |
| --- | --- | --- |
| Writing topic generator | `/writing-topic-generator` | Other modes or home appear for the same query |
| Speech topic generator | `/speech` | Generic and speech intent mix |
| Conversation topic to talk about | `/conversation` | Other modes appear for the same query |
| QOTD | `/question-of-the-day` | Distinguish the broad daily prompt from audience leaves |
| Moral and ethical dilemmas | `/topics/ethical-dilemma-questions` | Distinguish scenarios from personality-test explanations |
| Spanish Most Likely To list | `/es/topics/most-likely-to-questions` | Keep friends/couples/intense collections distinct |

Multiple visible URLs can include sitelinks. Review the search result and ownership over time before calling the pattern cannibalization or removing useful links.

## Page brief

- Audience: discussion facilitators, speaking-practice participants, and Spanish-speaking friends and couples.
- Corpus: preserve the visible original collections and truthful item counts. No additional thin pages.
- Filters: real editorial sections; middle/end entries preserve the selected category and used-item history.
- Output: one question plus the existing ethical discussion or PREP framework where applicable.
- Actions: next prompt, plain copy, group-message copy, local save, saved-library entry, existing share and print controls.
- Links: parent/child collections and relevant tools; new entry links remain within the current article.
- Measurement: generation start/success, repeat generation, entry surface, strict post-generation actions, and saved-library navigation. A copied group message is not a sent share.

## Acceptance and follow-up

1. Run lint, TypeScript, `growth:test`, production build, and `seo:audit`.
2. Validate the exact preview commit before merging; verify the production build and public page responses afterwards.
3. In the browser, filter, generate repeatedly, use the middle/end entry, copy the message, save, open the saved library, and check console errors.
4. Confirm production report synchronization expands existing grids, preserves historical columns, and writes separate GA4/GSC dates plus prior non-overlapping windows. Until a real sync runs, report this check as pending rather than complete.
5. Keep recent titles and primary intents stable. Review query ownership after 7–14 complete days, then compare traffic and strict user conversion over equal periods.
6. Consider a new leaf only when a distinct use case has sustained real impressions and can support an original useful interaction. A score or a high-CTR small sample does not automatically qualify.

Implementation validation and measured growth are separate outcomes; launch-day checks cannot prove incremental traffic.
