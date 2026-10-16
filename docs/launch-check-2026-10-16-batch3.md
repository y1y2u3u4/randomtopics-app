# Launch check 2026-10-16 — classroom pages, batch 3

New page: `/classroom-timer` (H1 "Classroom Timer"). Hero art made in ChatGPT web → `public/art/classroom/classroom-timer.jpg`, `docs/art-requests.json` marked done. og paper card `public/og/classroom-timer.jpg`.

What it does (vs online-stopwatch / classroomscreen / toytheater / classroomtimers.app): big countdown ring that turns green → yellow → red, presets 30 s–20 min plus custom min/sec, routines that run their steps back to back (think–pair–share 1/2/1 min, group discussion 2/1, quick write 5, brain break 1, clean-up 2) with a chime between steps and a random kids question / journal prompt / brain break on screen, full-screen board view, keyboard (Space, R, F, N, ↑↓), remaining time in the tab title, wall-clock based so background tabs stay accurate. No API calls, no sign-up.

## Acceptance (CL)
| # | Check | Result |
|---|---|---|
| CL1 | page 200, sitemap, IndexNow, queue | production 200, in sitemap.xml, IndexNow 200, queued |
| CL2 | question sources | reuses audited banks only (morning sharing 90, kids would-you-rather 100, kids journal 59) + 12 new brain breaks (blocklist test) |
| CL3 | projector, 375px | Chrome localhost: think–pair–share 0:58 Think 1/3 → Pair 2/3 → Share 3/3 → Time's up (clock skew test); pause holds 0:58; ↑ gives 6:00, F opens full screen, Space runs (5:59), R resets, Esc closes; 375px iframe scrollWidth 375, full-screen view 363/363; no console errors |
| CL5 | no price / payment / ad change; tests + build | existing pack card only; generators (26 classroom-kids tests), handoff, growth, topics, classroom, seo-routing, question-bank-copy, gsc-page tests + eslint (1 old warning) + tsc + `next build` pass |

## Production walk
Deployed 808df5e (PR #135, Vercel Production success).
- 200: /classroom-timer, og card, hero image; sitemap.xml lists the URL; /categories/education links it.
- `site_walk.py --only` (new page + 4 touched/linked pages, 100 internal links, 44 assets): **severe 0, medium 0**, low 5 (3 existing long titles; new page description 237 chars → shortened to 158 in this follow-up).
- IndexNow 200 (2 URLs); added to `opportunity-hub/steward/indexing/queue.md`; backlog row marked live.
