# Launch check: /story-prompt-generator (2026-10-17)

Keyword: story prompt generator: 1,300/mo, KD 38, weak SERP; 546 clicks in the last 4 weeks went to other sites.

## What shipped
- `/story-prompt-generator`: 140 original prompts, tagged by 9 genres × 3 age groups (Kids 6–12 / Teens 13–17 / Adults) × 3 lengths (flash, short, novel idea).
- Filters for genre, age and length; 1/3/5 per draw; no repeats within a round (the round is kept for the browser tab, survives reloads); optional writing challenge (22, matched to the age group).
- Save → /saved-topics (GeneratedResultActions), copy/share, print the whole current selection (PrintButton).
- The full bank is crawlable on the page (grouped by genre, then age), with how-to steps, filter explanations, 6 FAQs plus FAQPage and WebApplication JSON-LD.
- Kids content: romance only for teens and adults; spooky prompts for kids are gentle. The page is general-audience, so ads and personalization follow the normal rules (path is not child-directed).
- Links:
  - Into the page from /writing (tool grid + kids paragraph), /writing-topic-generator (related links), /journal-prompts and /topics/writing-prompts-for-kids. It also appears in the Keep playing picks (creative + classroom groups).
  - Out from the page to the same pages, plus the character, name and map tools.
- Wiring: sitemap, EN_ONLY_PATHS, RELATED_TOOLS, adPublicPaths.json (210 of 253).

## Compared with the top results
- Reedsy's prompt list has a much larger bank but filters by genre only.
- AI generators (Squibler and similar) give one generated line, with no age or length filters, no saving and no print.
- Ours adds three filters, kid-safe tagging, challenges, no-repeat rounds, saving and print. The bank is smaller than Reedsy's, so it can be grown later.
- This comparison comes from what those sites are known to offer; they were not re-checked live today.

## Checks
- `tsc`, `eslint` on the changed files, `growth:test`, `generators:test`, `ads:test`, `seo-routing-regression`: all pass.
- Production build with the ad env: pass; the route is static.
- Browser script (Chrome, 390 and 1280): 22 of 22 pass. It covers:
  - the default prompt, the filtered draw of 3 and no repeats;
  - the challenge, save, print label and the kids + romance empty state;
  - restore after reload, no horizontal scroll and no console errors.
- On mobile, the first prompt sits above the filters, so it is visible on the first screen.
- site_walk on the 5 pages: the 5 "severe" findings are all localhost canonical findings (expected, since the canonical points at production). There are 0 other severe or medium findings.

## Follow-up: daily entry (10/17, second dispatch)
- "📅 Today's story prompt" picks the same prompt for every visitor on a local date (rotates through all 140). It also has a link to answer today's question of the day.
- Browser script 26/26 at 390 and 1280: the daily prompt is stable on repeat and the link to the question of the day is visible.
- site_walk on /story-prompt-generator and /question-of-the-day: 0 real severe findings.
  - 1 severe finding is the expected localhost canonical.
  - 3 severe findings are `_next/image` returning 400 on the question-of-the-day classroom preview images. They happen with local `next start` only (the same URLs return 200 in production), and that page is unchanged in this PR.
- Hero art: still open. It must come from ChatGPT web, and saving the file needs the user's download approval.
