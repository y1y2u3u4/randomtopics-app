# Effective-page growth task — 2026-10-27

## Decision

Optimize existing pages before adding new URLs. QOTD already supports a daily category, local streak, classroom/team planning and audience subpages. Charades already supports categories, difficulty, timers, printable cards and a full crawlable collection. Do not rebuild those features.

This branch fixes a factual mismatch: the This or That parent metadata advertised 182 picks while the parent generator serves 38. The metadata, subtitle and collection heading now derive their count from the same `THIS_OR_THAT` dataset. Child-page collections are not counted as parent-page inventory.

## Intent ownership

| Intent | Owner | Decision |
| --- | --- | --- |
| Broad this or that questions / random either-or generator | `/this-or-that` | Optimize and keep the complete parent deck crawlable |
| This or that for kids | `/this-or-that/kids` | Existing audience owner; verify its independent corpus |
| This or that for couples | `/this-or-that/couples` | Existing audience owner; do not create synonyms |
| Hard this or that questions | `/this-or-that/hard` | Existing difficulty owner |
| This or that for work | `/this-or-that/work` | Existing workplace owner |
| Daily question, broad audience | `/question-of-the-day` | Observe recent changes; keep its daily workflow |
| Charades generator, category/difficulty/timer | `/charades` | Observe recent changes; do not split generic variants |

## Next growth experiment brief

Audience: a facilitator opening the existing This or That parent page for a short mixed-group icebreaker.

Corpus: the actual parent deck, with child decks linked as distinct versions. Any future corpus addition must be original, useful for this audience and checked for exact overlap with related pages.

Output: one either-or question, the full visible list, and the existing printable deck.

Actions: generate without repeats, copy a question or full list, print, save where currently supported, and select a relevant audience version. Do not add polling, accounts or a room system until analytics and user evidence justify the extra task.

Internal links: keep the existing parent-to-audience versions, party-game siblings, QOTD and Charades links. Check that audience pages link back to the parent without competing for its broad intent.

Measurement: first audit existing `generate`, `copy` and `share` event properties; reuse existing names when possible. Report unique sessions doing each action and destination clicks; never divide unrelated raw events to claim user conversion. If missing, add low-cardinality `tool`, `action`, `placement` properties using the existing analytics helper. Never log question answers or private user content.

## Prerequisites for a new page

Obtain current and previous complete 7/28-day GSC query × page data, country and device where relevant. Confirm a distinct query cluster, identify its canonical owner and check for competing existing pages. No current GSC query data was retrieved in this task, so no new SEO page is approved by this brief.

## Verification and review

- Local: check title/subtitle/list count against `THIS_OR_THAT.length`; lint/type-check if the full repository runtime is available. This small factual fix needs no new test suite.
- Preview: verify rendered title, H1, actual deck count, generate/no-repeat, print and related links; preserve canonical and hreflang.
- Production after approved merge: confirm the same output, page status and no new site-owned console error. This task does not deploy.
- Discovery: keep the existing URL; no new sitemap URL or resubmission is needed for this count correction.
- Day 7: verify query relevance and intended URL ownership; compare useful actions by session. Do not treat crawl requests as ranking evidence.
- Day 14: inspect impressions, rankings, CTR and cannibalization together; hold titles stable unless factually incorrect.
- Day 28: compare clicks, relevant landing sessions and successful use with the prior comparable window; record seasonality and other concurrent changes.

Implementation verification and demonstrated growth are separate. A merged factual fix is not proof of incremental traffic.
