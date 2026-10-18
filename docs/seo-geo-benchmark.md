# SEO / GEO benchmark — randomtopics.app (2026-10-18)

Branch `seo/geo-benchmark`. Brief: `opportunity-hub/steward/seo-geo-benchmark-brief-live-sites-20261018.md`.
Re-test GSC and GEO baselines between **2026-11-01 and 2026-11-15** (section 7).

## 1. GSC baseline (last 28 days, to 2026-10-17)

| Metric | Value |
|---|---|
| Clicks | 56.3K |
| Impressions | 874K |
| CTR | 6.4% |
| Avg. position | 6.0 |

Top queries (clicks / impressions / position):

| Query | Clicks | Impr. | Pos. |
|---|---|---|---|
| random topic generator | 5,804 | 21,430 | 2.7 |
| question of the day | 1,732 | 49,755 | 4.5 |
| charades generator | 393 | 22,886 | 7.5 |

Position 4–20 queries with no dedicated page (the new pages target these):

| Query | Impr. | Pos. | New page |
|---|---|---|---|
| philosophical questions | 677 | 13.8 | /philosophical-questions |
| random idea generator | 656 | 6.8 | /random-idea-generator |
| random category generator | 654 | 8.3 | /random-category-generator |
| topic of the day | 559 | 4.1 | /topic-of-the-day |
| moral dilemmas examples | 472 | – | /moral-dilemma-examples |

Low-CTR pages: /charades 1.7%, /categories 1.2%, /icebreaker 0.8%. Title rewrites for these are in PR #144 (not touched here to avoid overlap).

## 2. SERP comparison (Google US, 2026-10-18)

| Query | Top 3 | Us | AI Overview |
|---|---|---|---|
| random topic generator | randomtopics.app, … | #1 | yes, cites us |
| question of the day | randomtopics.app, nulab.com, qotd.collegeboard.org (then teamretro, teambuilding.com, enboarder) | #1 | yes |
| charades generator | randomwordgenerator.com/charades.php, play.gameonfamily.com, getcharadesideas.com (then cardyard.ai, thegamegal, actzcharades) | not top 6 | yes |
| random category generator | piliapp.com, spineverything.com, wordwall.net (then spinacountry, writecream) | not top 6, no dedicated page | yes |
| ethical dilemma questions | areyousittingdown.games, reddit r/Ethics, uncg.edu PDF (then makeheadway) | not top 6 | no |

What the top results have that we lacked:

- **Charades**: a big printable word list with counts per difficulty, a 3-step "how to play" and a timer. We had the tool and timer, but no fact block or HowTo.
- **Category generator**: wheel/letter pickers (Scattergories). We had no page for this.
- **QOTD**: nulab/teamretro are "100 examples" lists. We beat them with a daily question plus 120 ideas, but had no numeric fact block or HowTo.
- **Dilemmas**: list articles with 30–50 items and short explanations. We had /topics/ethical-dilemma-questions but no "examples" page with an explanation for each dilemma.

## 3. GEO baseline

| Engine | Question | We appear? | Who is cited |
|---|---|---|---|
| Google AIO | random topic generator | **yes** — cites our mode/category/depth filters and "Speech & Timer" | randomtopics.app, CodeBeautify (1,300 single-word topics) |
| Google AIO | question of the day | AIO present, we rank #1 organically | – |
| ChatGPT (temp chat, web search) | best free random topic generator website | no answer captured (empty response) | – |
| ChatGPT | question of the day site for team/class | **no** | manymini.app, animalpersonalityquiz.com QOTD generator, classeem.com, questionsotd.com, kraftylab.com |
| ChatGPT | free charades word generator | blocked (Cloudflare challenge) | – |
| ChatGPT | ethical dilemma questions websites | blocked (Cloudflare challenge) | – |

Not bypassed: the Cloudflare challenge on ChatGPT (no CAPTCHA solving). Perplexity was not tested in this round.

Takeaway: ChatGPT cites sites that state concrete facts ("updates at midnight UTC", "110 questions in 5 categories", "no signup"). Our pages had those facts but scattered in prose. The fix is fact blocks with numbers, /facts and llms.txt key facts.

## 4. Gap table (top 10, sorted by impact × difficulty)

| # | Gap | Impact | Difficulty | Status |
|---|---|---|---|---|
| 1 | No pages for 5 rank-4–20 queries (~3K impr./28d) | high | medium | **Done** — 5 new pages (section 5) |
| 2 | No citable fact blocks (counts, steps, tables) on QOTD and charades | high | low | **Done** — FactSheet + HowTo JSON-LD, appended below existing content |
| 3 | No brand facts page | high (GEO) | low | **Done** — /facts (what it is, who for, price $0, privacy, counts, vs competitors) |
| 4 | llms.txt had no key facts and no new pages | medium (GEO) | low | **Done** — "Key facts" + "Pages added 2026-10-18" |
| 5 | robots.txt did not name AI crawlers | medium (GEO) | low | **Done** — GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, Claude-SearchBot, Google-Extended, Applebot-Extended, Bingbot allowed |
| 6 | 49 pages had no OG/Twitter cards | medium | low | **Done** — `withSocial` helper (src/lib/metadata/social.ts) |
| 7 | Low CTR on /charades, /categories, /icebreaker | high | low | **Not done here** — titles handled by PR #144 |
| 8 | Home CLS 0.208 (perf 81) | medium | medium | **Not done** — home page is frozen until 10/26 |
| 9 | Charades not in top 6 (competitors: big printable lists) | high | high | **Partly** — fact block + HowTo added; ranking needs links and time |
| 10 | Backlinks and GSC indexing for new pages | high | – | **To-do only** — no backlinks or GSC submissions per brief |

Also done: WebApplication (tools) or Article + ItemList (dilemmas) or AboutPage + Organization (/facts), plus FAQPage and BreadcrumbList, on the new pages; HowTo where a FactSheet has steps; updated date and "Random Topics editors" team line in each FactSheet; all new pages in sitemap.xml, EN_ONLY_PATHS, related-tools links and the AdSense public-path list (/facts stays ad-free).

## 5. New pages

| URL | Target query | What beats the SERP top 3 |
|---|---|---|
| /random-category-generator | random category generator | Editor-written categories by group, letter roll with "skip hard letters", no repeats, print all |
| /random-idea-generator | random idea generator | Ideas grouped (things to do, creative projects, drawing, writing, side projects, cooking, with friends or family), filter, print |
| /philosophical-questions | philosophical questions | Questions grouped by theme (life & meaning, mind, ethics, free will…), question of the day, no repeats, print |
| /moral-dilemma-examples | moral dilemmas examples | Each dilemma states the tension it tests, grouped from classic thought experiments to easy ones for kids, ItemList + Article schema, print |
| /topic-of-the-day | topic of the day | Same topic for everyone each day (local date), topics from the past 7 days, regenerated hourly |
| /facts | (brand / GEO) | Numbers and comparison table for AI answers |

Each has: a 40–60 word direct answer as the first paragraph, title ≤60 characters, canonical, OG and Twitter, FAQ, FactSheet, updated date.

## 6. Protected pages

Protected = any page with GSC clicks (311 pages; 56 with ≥100 clicks) or cited by AI (home, /question-of-the-day).

Rules followed:
- No URL changed, no paragraph removed. The original text is the `main` branch (git), so the diff shows exactly what was added.
- On protected pages the only changes are (a) metadata wrapped in `withSocial` (title and description unchanged), and (b) on /question-of-the-day and /charades, a FactSheet section appended below the existing content.
- Home page, first screen and all AdSense units/layout untouched.

Protected pages edited: /question-of-the-day, /charades, /categories, /most-likely-to, /would-you-rather, /truth-or-dare, /this-or-that, /two-truths-and-a-lie, /never-have-i-ever, /hot-seat-questions, /paranoia-questions, /funny, /topics, /speech, /speech/informative, /speech/persuasive, /debate/*, /impromptu-speech-topics, /table-topics-generator, /group-discussion-topics, /essay-topic-generator, /journal-prompts, /question-generator, /random-subject-generator, /argument-generator, /pro-and-con-debate-topics, /spin-the-wheel, /es/* (metadata only).

## 7. Lighthouse (mobile)

"Before" = live randomtopics.app (Vercel CDN). "After" = local production build (`next start`, no CDN), so its LCP is ~2 s slower; a same-day control run on live gave /question-of-the-day 95/100 (LCP 1.6 s) and /charades 96/100 (LCP 1.8 s), i.e. no regression from these changes. TBT is 0 ms and CLS ~0 on every "after" page.

| Page | Before perf / SEO (live) | After perf / SEO (local build) |
|---|---|---|
| home | 81 / 100 (CLS 0.208) | not changed (frozen) |
| /question-of-the-day | 96 / 100 | 90 / 100 (live control: 95 / 100) |
| /charades | 92 / 100 | 91 / 100 (live control: 96 / 100) |
| /topics/ethical-dilemma-questions | 96 / 100 | not changed |
| /most-likely-to | 95 / 100 | 92 / 100 |
| /facts | – | 92 / 100 |
| /random-category-generator | – | 91 / 100 |
| /random-idea-generator | – | 91 / 100 |
| /philosophical-questions | – | 91 / 100 |
| /moral-dilemma-examples | – | 91 / 100 |
| /topic-of-the-day | – | 90 / 100 |

Site walk (local build, 8 pages, 100 internal links): 0 broken links. Remaining flags are the localhost canonical false positive and `_next/image` at w=3840 returning 400 locally on /question-of-the-day (the same URL returns 200 on live).

## 8. Re-test plan (2026-11-01 → 11-15)

1. GSC: the 5 target queries — position and clicks vs section 1. Expect the new pages indexed and ranking inside the top 20.
2. GSC: CTR of /charades, /categories, /icebreaker after PR #144.
3. ChatGPT (temporary chat, web search): the same 4 questions + "random category generator", "philosophical questions to ask". Record whether randomtopics.app is cited.
4. Google AIO for the 5 SERP queries in section 2.
5. Lighthouse on home after the freeze ends (10/26) — fix CLS then.
