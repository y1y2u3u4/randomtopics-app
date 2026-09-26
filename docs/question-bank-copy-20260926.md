# Question bank copy recovery — September 26, 2026

## Scope

The shared QuestionBank used direct Clipboard API writes and silently swallowed failures. Reuse the existing bounded-time copyText helper (Clipboard API then browser fallback). If both fail, show a labeled read-only textarea next to the selected question or below the full-list action. Focus selects the actual payload for manual copying. Retrying clears stale failure state. Keep the original question visible after success. Serialize pending copy actions so a delayed result cannot replace another selection's recovery text.

Existing owners: /two-truths-and-a-lie, /this-or-that, /truth-or-dare, /never-have-i-ever, /most-likely-to, /paranoia-questions, /hot-seat-questions, /would-you-rather. No new pages or changes to question corpus, search titles, canonical, locale, indexing or existing generator behavior.

## Measurement

New bank_question_copy/error and bank_deck_copy/error series are spelled bank_question_copy, bank_question_copy_error, bank_deck_copy, bank_deck_copy_error. They enter Core Usage for the eight exact existing pages with a September 26 release boundary. Successful actions retain historical copy_question/copy_deck events; do not sum the old and new series as independent actions. New event params contain scope and deck size, not question text. No generation or post-generate action is emitted by the list. Showing or selecting manual text does not prove a successful copy and records no success.

## Verification and observation

Actual-component regression covers failed single/deck operations, exact manual payload, unexpected rejection, retry success, preserved question text, pending click serialization, private-safe event params, no fabricated generation, and pre-release reporting. Run existing growth/handoff regressions, ESLint, production build including TypeScript, and SEO audit. Production QA uses usage_qa=1 and verifies list controls, success messages, original question visibility and unchanged metadata; record any browser clipboard-readback limit in the PR.

This repair does not prove a traffic lift or the historical frequency of copy failures. After the normal sync, check new events by page, error/retry behavior and whether new data covers the full September 27–October 3 period. QOTD entry visibility and Spanish round restoration remain separate follow-ups, subject to their evidence and observation windows. No fresh traffic sample was collected for this repair; private reporting stays outside the repository.
