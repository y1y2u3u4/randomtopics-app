# Two Truths ideas iteration — 2026-09-11

Prepared on 2026-09-11; production release authorized on 2026-09-12. The release observation guard starts on 2026-09-12. Deployment verification is recorded in the pull request; measured growth remains a post-release check.

## Opportunity map

| Intent / surface | Decision | Evidence and boundary |
| --- | --- | --- |
| Two Truths ideas and examples | Optimize `/topics/two-truths-and-a-lie-ideas` | Existing article, links, and search-intent owner. Its old corpus mixed 34 prompt/example entries with 11 rules or tips under a 120-idea promise. Use one clear counting unit. |
| Themed Two Truths prompts | Maintain `/two-truths-and-a-lie`; add a contextual link | The existing 30-prompt tool supplies themes, while the article supplies specific editable statements. Do not merge these different jobs or create another synonymous URL. |
| Recently revised speech, writing, ethics, and QOTD pages | Observe | Keep current titles and primary intents stable; this iteration is not another rewrite of those pages. |
| Generation and copy measurement | Correct property settings and preserve strict reporting | Broad GA4 key events and strict post-generation user conversion answer different questions. No historical event relabeling or new reporting denominator. |

Private search queries and traffic measurements belong in the private growth review, not this repository.

## Page brief

- Audience: coworkers, students, friends, and facilitators who need three personalized statements for an immediate game.
- Existing canonical, H1, title, English/Spanish alternates, publication date, and related destinations remain intact. The description now describes the actual workflow and the article's modification date reflects this substantive revision.
- Corpus: exactly 120 original individual statement ideas, in four groups of 30 (Work, Students, Funny, Everyday life). Rules and advice are outside the numbered corpus. One data source feeds the visible article, printable list, and builder.
- Utility: deterministic initial example; category selection including All; three-at-a-time no-repeat draws; three editable labeled fields; explicit user-selected lie; answer reveal. The tool neither invents biographical facts nor assigns truths automatically.
- Output: copy, share, and local saving include only the three player-facing statements, never the selected answer. The editor is explicitly private, since its selected radio identifies the lie.
- Recovery: blank or duplicate statements block actions; filters do not overwrite current edits; return-to-editor links do not draw again. Existing clipboard failure, manual-copy, share-cancel, and storage-error handling is reused.
- Links: reciprocal connections between the examples article and the themed generator; existing parent hubs and relevant collections remain. No new route, dependency, analytics text capture, or external API.
- Design: preserve the current dark/neon utility style. Put the builder before the article introduction; use 44px-or-larger main controls, visible labels, keyboard focus, live status, and reduced-motion-aware return navigation.

## Measurement hypothesis

Making the count truthful and shortening the path from browsing to a usable round may improve relevant click-through and post-generation use. Implementation tests cannot establish that it does.

Keep the search title stable for this iteration. After production release, record the actual release date in the private change log and the editorial observation guard; compare equal, non-overlapping complete periods after 7–14 days. Review the 28-day intent distribution separately from the 7-day page funnel. The existing reporting cohort already contains this URL.

Measure page clicks/impressions/CTR and generated-result success users, eligible action-bar users, strict copy/save/share users, and repeat generation. Exclude the prefilled example from the strict funnel. Do not interpret GA4's key-event setting cutover as organic conversion growth, sum query/page impressions, or promise a fixed traffic uplift.

## Acceptance checklist

- [x] Exactly 120 unique ideas; 30 in every category; visible and printable data match.
- [x] Unit checks cover no-repeat cycles, pool exhaustion, filter-history preservation, incomplete and duplicate rounds.
- [x] Actual component-handler tests cover draw, edit, lie selection, reveal/hide, answer-safe copy/save payloads, private analytics, UUID-based save identity, and non-destructive return links.
- [x] Existing report regression, lint, and TypeScript pass.
- [x] Production-mode build passes (366 prerendered pages); built-HTML SEO audit passes for 54 pages, 197 sitemap URLs, redirects, and robots.txt, including the exact 120-item collection.
- [ ] Exact preview commit receives a browser check before a production release: mobile/desktop, keyboard, actual clipboard, local storage, and share behavior.
- [ ] Production release and public response checks.
- [ ] Post-release analytics and search observation. No growth result is claimed at implementation time.

## Verification commands

```sh
npm run growth:test
npm run lint
npx tsc --noEmit
npm run build
SEO_BUILD_DIR=.next/server/app npm run seo:audit
```

The managed execution environment may need `NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1` for the build to trust the configured system certificate chain when fetching the existing Google Fonts. Do not disable certificate verification or replace production fonts merely to make a local check pass.
