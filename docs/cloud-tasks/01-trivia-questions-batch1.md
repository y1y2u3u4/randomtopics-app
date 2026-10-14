# Cloud task 01 — Trivia questions, batch 1: /trivia-questions/ + /trivia-questions/halloween/

**First:** run `echo $CLAUDE_CODE_REMOTE`. If it is not `true`, stop — this brief is for a Claude Code cloud session only.

Open **ONE PR** against `main`. **Do not merge it.** The local orchestrator checks and merges.

## Goal
RandomTopics (randomtopics.app) has party / classroom question banks (topics, debate, charades, paranoia…) but no trivia page. Build the first batch of a playable trivia bank, zero API cost:

1. `/trivia-questions/` (P0) — targets "trivia questions" (69.7k/mo, KD 38), "trivia questions and answers" (40.5k/mo, KD 26), "trivia generator" (KD 33).
2. `/trivia-questions/halloween/` (P1, seasonal — must ship before 10/20) — "halloween trivia".

Out of scope for this PR (later batches): the 10 category pages, `/es/preguntas-de-trivia/`, `/trivia-maker/`. Do **not** touch pricing, Stripe, speech coach, classroom packs, login, credits, ads config, env vars, Vercel config or the homepage.

## Step 0 — competitor benchmark (put it in the PR body)
Open the current top-3 Google results for "trivia questions" and "halloween trivia" (expect today.com, rd.com, quizandsurveymaster.com / triviamaker.com). For each record: what is above the fold, number and type of images, whether there is a tool (draw / score / timer), structure (list length, answers shown how), FAQ. Table in the PR body plus **the one thing we do better** (target: a game starts in the first screen — host mode + timer + 2–8 team scoreboard — while they are static 100-question articles).

Launch bar (must meet all): tool or answer in the first screen; a hero visual slot; one-sentence short answer; 300–500 words of explanation; FAQ with FAQPage JSON-LD; "Updated" date; internal links to/from related existing pages (paranoia-questions, charades, party questions hubs); at least one point that beats the competitors.

## Files (follow existing patterns)
- Study first: `src/app/paranoia-questions/page.tsx`, `src/app/random-movie-generator/page.tsx`, `src/data/paranoia.ts`, `src/data/generators/movies.json`, `src/data/internalLinks.ts`, the sitemap source, and `scripts/random-movie-regression.mjs` (test style: plain `node scripts/*.mjs`).
- New data: `src/data/trivia/*.json` — one file per category (general, kids, math, science, history, geography, movies, music, sports, food) + `halloween.json`. Each item: `id`, `question`, `answer`, `distractors` (2–3), `category`, `difficulty` (easy|medium|hard), `explanation` (one sentence, states the basis). **Total ≥ 800 questions**, halloween ≥ 50, every category ≥ 60 (the category files are reused by the later category pages).
- New pages: `src/app/trivia-questions/page.tsx`, `src/app/trivia-questions/halloween/page.tsx`, shared client component(s) for the drawer/host mode.
- Register both URLs in the sitemap and in the internal-links data; add metadata (title, description, canonical with trailing slash as the site uses).
- New test: `scripts/trivia-regression.mjs`, appended to the `generators:test` npm script.

## Page spec — /trivia-questions/
- First screen: pick category + difficulty → "Next question" → "Show answer"; toggle multiple-choice (answer + distractors shuffled) vs open answer.
- Host mode: full screen, per-question countdown timer (adjustable), scoreboard for 2–8 teams with +/− buttons, no repeats within a game.
- Below: 100-question static list with answers (collapsible) for the "questions and answers" reading intent, grouped by category; then explanation, FAQ, updated date.
- Halloween page: same component preset to the halloween bank; ≥ 50 questions listed; seasonal copy.

## Content rules (strict)
- Write every question originally. Do **not** copy today.com, rd.com or any list article.
- Facts must be stable: no "current / latest / reigning…" questions, nothing that can go out of date. Each explanation states the basis.
- Exclude politics, religion, disasters, real people's private lives. Kids category: suitable for ages 8–12 only.
- Halloween: folklore, history of the holiday, candy, pumpkins, classic monsters in the public domain — no copyrighted film plot details beyond titles/years.
- Spot-check 50 random questions yourself for accuracy and list them (question → answer → OK/fixed) in the PR body.

## Tests first (write before the pages)
`scripts/trivia-regression.mjs` must check:
- T1: draw sequence has no repeats within a game; category and difficulty filters only return matching items; scoreboard add/subtract math (including going below zero is allowed/blocked — pick one and test it) for 2 and 8 teams.
- T3: JSON schema of every file (required fields, 2–3 distinct distractors not equal to the answer, valid difficulty, unique ids across files), total ≥ 800, halloween ≥ 50, each category ≥ 60, no duplicate question text.
- Both new URLs present in the sitemap source.

## Images — do NOT generate with any API
Create `docs/art-requests.json` if missing:
```json
{ "_readme": "Image requests. Cloud sessions ADD items with status \"pending\"; the local session generates them in ChatGPT web, saves the jpg at `path` (under public/), sets status \"done\" and opens a PR. Pages pick the file up automatically when it exists.", "requests": [] }
```
Add 2 pending requests: `/trivia-questions/` hero (flat illustration: question cards + scoreboard, 1600×900) at `public/art/trivia/hero.jpg`, and the halloween hero at `public/art/trivia/halloween-hero.jpg`. Each item: `id`, `page`, `path`, `prompt`, `alt`, `status: "pending"`. Pages render the image when the file exists, otherwise a CSS/SVG placeholder of the same aspect ratio (no layout shift). Any test about art requests must accept `pending|done`.

## Verify (all must pass before opening the PR)
```
npm ci
npm run generators:test
npm run lint
npm run build
npx next start -p 3055 &
curl -s -o /dev/null -w "%{http_code}" http://localhost:3055/trivia-questions/        # 200
curl -s -o /dev/null -w "%{http_code}" http://localhost:3055/trivia-questions/halloween/  # 200
curl -s http://localhost:3055/sitemap.xml | grep trivia-questions
curl -s -o /dev/null -w "%{http_code}" http://localhost:3055/paranoia-questions/       # still 200
```
Also confirm both pages have no `noindex`, include FAQPage JSON-LD, and render the tool in the first screen at 390px width.

## PR body must contain
1. Competitor benchmark table + the point we beat them on.
2. 50-question accuracy spot-check list.
3. Test/build output summary.
4. **Local follow-ups** section:
   - 出图 2 张 (docs/art-requests.json → ChatGPT web, daily-inner-page-polish).
   - IndexNow push for the 2 new URLs; add them to `opportunity-hub/steward/indexing/queue.md` (P0).
   - Update `opportunity-hub/sites/randomtopics/inner-page-backlog.md` rows (trivia P0 + halloween → 已上线).
   - Next batches: 10 category pages + Spanish page; then /trivia-maker/.

Branch name: whatever the cloud session assigns. If `gh pr create` returns 403, open the PR via `gh api repos/y1y2u3u4/randomtopics-app/pulls`. Don't edit `.github/workflows/*` (no permission from the cloud).
