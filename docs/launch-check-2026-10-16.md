# Launch check 2026-10-16 — classroom pages, batch 1

Pages: `/this-or-that/kids`, `/would-you-rather/kids`, `/topics/get-to-know-you-questions-for-students`.
Also changed (links only, titles / H1 / body untouched): `/this-or-that`, `/would-you-rather` (Everyone / Kids switch), `/classroom-packs` (free classroom tools strip), `/categories/education` (one entry line).

## Acceptance (CL, docs/random-generators-inner-pages-20261010.md)
| # | Check | Result |
|---|---|---|
| CL1 | 3 pages 200, in sitemap, IndexNow, indexing queue | local build: all 3 static; sitemap entries added; IndexNow + queue after deploy |
| CL2 | every kids item tagged `audience: "kids"`; 100-question spot check | 335 items tagged (115 + 100 + 120); seeded random 100 read by hand: 98 OK, 2 changed (school-vs-home lunch, "rainbow-colored skin"); full read changed 3 more (family/siblings, family tradition, bath or shower); blocklist test in `scripts/classroom-kids-regression.mjs` |
| CL3 | projector: full screen, big text, arrow keys; 375px no horizontal scroll | Chrome (localhost): open → ← → keys, T timer, Esc close, body scroll restored; 375px iframe: scrollWidth 375 on all 7 touched pages, projector 363/363 |
| CL5 | price, payment, ads untouched; `generators:test` + build green | only existing `ClassroomPackCard` reused; no API / Stripe / ad config change; generators, handoff, growth, topics, classroom tests + `next build` pass |

## Local walk (Chrome, localhost:3041, `?usage_qa=1`)
- `/this-or-that/kids`: grade + theme chips filter (K–2 → 96 questions), Get a question → "Juice or milk?", projector shows left / right sides, 1/96 counter.
- `/would-you-rather/kids`: projector splits "Would you rather…" into two sides; "Print 10 (1 page)"; pack card + free tools strip render; no console errors.
- Existing pages keep their titles and H1s (checked: This or That Questions, Would You Rather Generator, Classroom Packs for Teachers, Education Topic Generator).

## Production walk
Filled in after deploy (site_walk severe count + 200 checks).
