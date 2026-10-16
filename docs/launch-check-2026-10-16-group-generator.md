# Launch check 2026-10-16 — /random-group-generator

Dispatch: steward/dispatch/2026-10-16-graded-opportunities.md §A. Keywords: random group generator (19,354 clicks/mo), group generator (14,165). Top results: classtools.net, randomlists.com.
New page: `/random-group-generator` (H1 "Random Group Generator"). `/random-team-generator` title, H1 and copy untouched — one link list item added; the two pages link to each other.

What it does beyond classtools / randomlists: split by people per group (pairs, trios…) or number of groups; sizes never differ by more than one; **keep together / keep apart rules** (one pair per line, chains like "Kai + Luna + Mateo"), rules that can't be met are named in a warning instead of silently dropped, rule lines with unknown names are flagged; random **group roles** (Leader, Recorder, Timekeeper, Reporter…); optional fun group names; color-coded cards; full-screen board view (Space reshuffles, Esc closes); copy and print; class lists saved in the browser (shared with the team generator). No API calls, no sign-up. Classroom pack card added; prices unchanged.

## Checks
| Check | Result |
|---|---|
| Logic | `src/lib/groupRules.ts`; regression: 300 seeds × 3 group counts, 23 names, 4 together + 4 apart rules → everyone exactly once, sizes ±1, 0 broken rules; impossible rules reported; name parsing case-insensitive |
| Chrome localhost | sample class 16 → 4 groups of 4 with roles, Ava+Ben together, Diego/Emma and Kai/Luna apart; unknown-name warning shown; 3 mutually-apart names in 2 groups → warning names the broken pair; board view: Space reshuffles, Esc closes; 375px iframe scrollWidth 375, board view 375/375; no console errors |
| Bug caught in walk | server page imported a constant from the client component → moved `GROUP_ROLES` to the lib |
| Tests + build | generators (29 classroom-kids tests, 3 new), handoff, growth, topics, classroom, seo-routing, question-bank-copy, gsc-page + tsc + eslint + `next build` pass |

## Production walk
Deployed 1971ee5 (PR #137, Vercel Production success). First curl right after the deploy got a cached 404; 20 s later 200 with `x-matched-path: /random-group-generator`.
- 200: /random-group-generator, og card, hero image; sitemap.xml lists the URL; /random-team-generator title unchanged and links to the new page.
- `site_walk.py --only` (new page + 3 linked pages, 115 internal links, 36 assets): **severe 0, medium 0**, low 5 (3 existing long titles; new page description 175 chars → shortened to ~145 in this follow-up).
- IndexNow 200 (2 URLs); added to `opportunity-hub/steward/indexing/queue.md`.
