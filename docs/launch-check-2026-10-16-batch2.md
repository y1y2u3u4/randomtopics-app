# Launch check 2026-10-16 — classroom pages, batch 2 + batch 1 art

New pages: `/morning-meeting-questions`, `/riddles-for-kids`. Added section: `/journal-prompts#kids` (title, H1 and existing copy untouched).
Art: 5 hero images made in ChatGPT web (3 for batch 1, 2 for batch 2) → `public/art/classroom/*.jpg`, `docs/art-requests.json` marked done.

## Acceptance (CL)
| # | Check | Result |
|---|---|---|
| CL1 | pages 200, sitemap, IndexNow, queue | local build: both pages static, sitemap entries added; production results below |
| CL2 | audience tags + 100-item spot check | riddles 211, morning sharing 90 (+30 greetings, 30 activities), kids journal 59 — all `audience: "kids"`. Seeded random 100 (riddles 52, morning 30, journal 18): 98 OK, 2 changed (NOON wording, pencil joke). While writing, 18 weak riddles were cut (unclear answers, duplicates) |
| CL3 | projector, 375px | Chrome localhost: morning meeting projector shows 4 labelled steps (→, Esc); riddles: first Space reveals answer, second moves on (1/211 → 2/211); 375px iframe scrollWidth 375 on 6 pages, projector 363/363 |
| CL4 | morning meeting same question all day | reload in Chrome showed identical 4 cards for Fri Oct 16; regression test: 07:05 vs 22:40 same set, 30 consecutive days 30 different questions |
| CL5 | no price / payment / ad change; tests + build | existing pack card only; generators (24 classroom-kids tests), handoff, growth, topics, classroom, seo-routing, question-bank-copy, gsc-page tests + `next build` pass |

## Production walk
Filled in after deploy.
