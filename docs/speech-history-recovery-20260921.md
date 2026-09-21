# History feedback recovery and measurement

A saved transcript could be resumed from the account page, but only the resume click was measured. Success, failure and visible saved feedback were absent from reporting. The component also awaited a second history request after feedback had already been saved; failure of that refresh could make a successful recovery appear unsuccessful.

The account now displays the saved feedback response directly. Recovery emits separate history start/ready/error events, while a dedicated summary component emits a history view only after at least half of the actual advice is visible in a focused foreground tab continuously for one second. Views are deduplicated per mounted summary. These events remain separate from first-attempt feedback and use the existing QA namespace and private-field allowlist. A separate ordered history recovery funnel and explicit report cards keep these outcomes visible without changing the original entry funnel.

Verification:

- Speech regressions, TypeScript, ESLint and whitespace checks passed.
- Regression checks cover pending requests, successful response reuse without another request, failed and incomplete results, content/identifier exclusion, foreground visibility, interruption, deduplication and cleanup.
- Chrome extension controlled UI check used the actual changed account/summary/helper source with synthetic data and mocked API responses. The first feedback request failed with 503, leaving the transcript and retry action available. The second succeeded and showed the saved feedback even though a subsequent history request was configured to fail. Start/error/start/ready events appeared, followed by a view only when the advice became visible. Expanding the feedback displayed the full result.
- The controlled page used plain styles because the local optional native CSS dependency was unavailable; it is a functional check, not a production visual or live-model check. No credentials, real accounts, audio, payments or production analytics were involved. Full production build is checked separately by Vercel.

The original feedback schema failure and bounded model retry were already fixed by PR 47. This change closes the history measurement and refresh-error gap; it does not claim the earlier incident was caused by history refresh, nor that organic conversion has improved.
