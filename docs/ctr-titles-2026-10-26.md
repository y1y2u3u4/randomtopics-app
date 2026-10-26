# Top-impression pages push (2026-10-26, growth review §1)

GSC 28d baseline: question of the day 51.4k impr pos 4.6 · charades generator 25.6k pos 7.3 · yo mama randomizer 12.9k pos 3.9.
Recheck: 2026-11-09 (position + CTR per query, Umami PV per page). Earlier title tests still running: /charades (10/20, recheck 10/31) and /question-of-the-day (10/21, recheck 11/04), so their titles were NOT changed here.

| Page | Old title | New title |
|---|---|---|
| /question-of-the-day | Question of the Day for {date} + 120 QOTD Ideas | unchanged (test running); definition paragraph moved below the widget |
| /charades | Charades Generator: Random Charades Word Generator (528 Words) | unchanged (test running); hero tightened, copy-all on the word bank |
| /yo-mama-randomizer | Yo Mama Randomizer: 72 Clean Yo Mama Jokes + Joke Remixer | Yo Mama Randomizer & Generator: 72 Clean Yo Mama Jokes + Joke Remixer |
| /icebreaker | Ice Breaker Questions Generator: 300+ Random Icebreakers | Ice Breaker Questions Generator: 91 Random Icebreakers (Free) — old count was false |
| /funny | Funny Random Topic Generator \| Hilarious Questions & Weird Discussion Topics | Funny Random Topic Generator: Free Hilarious Questions & Weird Discussion Topics |

Sections added: full grouped list + copy-all/print on /icebreaker (91) and /funny (32); copy-all on the /charades word bank (528); illustration moved under the generator on /icebreaker.
Contextual links: in-body links to /question-of-the-day and /charades with varied anchors on spin-the-wheel, debate, conversation, this-or-that, writing, funny, icebreaker, would-you-rather, truth-or-dare, question-generator, random-subject-generator, most-likely-to.

## AdSense coverage audit (AdSense 2.8k PV vs Umami 7.8k PV/day)
- 82.9% of 7-day Umami PVs land on ad-allowed paths (270 of 337 sitemap paths). Uncovered pages are intentional: /speech (paid product), kids/students/classroom, /yo-mama-randomizer, account/legal.
- Template coverage is not the main gap. Contributors: ad blockers and EEA consent refusals; GPC; ~900 retirement reloads/week (`rt_ads=off`); query strings fail closed.
- Fixed here: campaign-only queries (`utm_*`, e.g. ChatGPT's `?utm_source=chatgpt.com`, ~240 docs/week) no longer block ads; any other query still fails closed.
- Not changed: retirement over-triggering (entitlement refresh failure → reload without ads) — worth a separate look.
