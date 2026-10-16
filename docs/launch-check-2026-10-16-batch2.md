# Launch check 2026-10-16 — classroom pages, batch 2 + batch 1 art

New pages: `/morning-meeting-questions`, `/riddles-for-kids`. Added section: `/journal-prompts#kids` (title, H1 and existing copy untouched).
Art: 5 hero images made in ChatGPT web (3 for batch 1, 2 for batch 2) → `public/art/classroom/*.jpg`, `docs/art-requests.json` marked done.

## Acceptance (CL)
| # | Check | Result |
|---|---|---|
| CL1 | pages 200, sitemap, IndexNow, queue | production 200, in sitemap.xml, IndexNow 200, queued |
| CL2 | audience tags + 100-item spot check | riddles 211, morning sharing 90 (+30 greetings, 30 activities), kids journal 59 — all `audience: "kids"`. Seeded random 100 (riddles 52, morning 30, journal 18): 98 OK, 2 changed (NOON wording, pencil joke). While writing, 18 weak riddles were cut (unclear answers, duplicates) |
| CL3 | projector, 375px | Chrome localhost: morning meeting projector shows 4 labelled steps (→, Esc); riddles: first Space reveals answer, second moves on (1/211 → 2/211); 375px iframe scrollWidth 375 on 6 pages, projector 363/363 |
| CL4 | morning meeting same question all day | reload in Chrome showed identical 4 cards for Fri Oct 16; regression test: 07:05 vs 22:40 same set, 30 consecutive days 30 different questions |
| CL5 | no price / payment / ad change; tests + build | existing pack card only; generators (24 classroom-kids tests), handoff, growth, topics, classroom, seo-routing, question-bank-copy, gsc-page tests + `next build` pass |

## Production walk
Deployed 22968b3 (PR #133, Vercel Production success).
- 200: both new pages, /journal-prompts, og cards and hero images; /this-or-that/kids now serves its hero image; sitemap.xml lists both new URLs.
- /journal-prompts `<title>` unchanged in production.
- `site_walk.py --only` (2 new + 5 touched pages, 92 internal links, 43 assets): **severe 0, medium 0**, low 8 (long titles / descriptions; the /journal-prompts title is the existing one, left as-is).
- IndexNow 200 (3 URLs); added to `opportunity-hub/steward/indexing/queue.md`; backlog rows marked live.
