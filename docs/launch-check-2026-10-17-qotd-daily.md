# Launch check: question of the day daily ritual (2026-10-17)

Dispatch: add a daily mechanic on top of /question-of-the-day. The asks were a streak, a share card, anonymous "today's top answers", a home entry, and a reason to return tomorrow. It must not slow LCP and the ad position stays the same.

## What shipped (this PR)
- **Answer today:** each of the 120 questions has 4 editor-written answers plus "Something else" (`src/data/qotdAnswers.ts`). One tap records an anonymous vote. Tapping another choice changes it.
- **Today's answers across the site:**
  - Percentage bars, the top answer and the total count. They are fetched only after answering, when the panel is near the screen (IntersectionObserver).
  - API: `/api/qotd/vote`. GET counts are cached for 30 s.
- **Streak:** kept in localStorage (`rt-qotd-streak`). It shows "🔥 N-day streak · best M". A missed day resets it at the next answer. Changing today's answer does not count twice.
- **Share card:** a 1080×1080 PNG drawn in the browser with the question, my answer, "% answered the same" and the streak. It uses the native share sheet with the file where supported, otherwise it downloads.
- **Come back tomorrow:** "Tomorrow's question unlocks at midnight in HH:MM:SS". The countdown is local time and only ticks while the tab is visible.
- **Privacy and abuse:**
  - The table is service-role only, with RLS on.
  - It stores HMAC hashes of a random per-browser id and of day+IP. It keeps no raw IP and no text answers, so there is no user-generated content to moderate.
  - Limits: one vote per browser per question per day, and at most 30 browsers per IP hash per question per day. There is also an in-memory rate limit of 20 per 10 minutes. Rows older than 45 days are removed.
  - Only a question that really is today's (for any daily category) is accepted, and only within ±1 day of UTC.
- **Migration** `supabase/migrations/20261017120000_qotd_votes.sql`: applied to the production project (randomtopics-speech) on 10/17. It is additive. A smoke test of insert → change vote → count → delete passed, and the test row was removed.

## Not in this PR
- The home "today" entry is a separate PR, because the home page is frozen until 10/26 (title/CTR test). Merge it on or after 10/26.

## Checks
- tsc, eslint, growth (adds `scripts/qotd-ritual-regression.mjs`: 120 answer rows, vote validation, day keys, tally), generators, ads, seo-routing: all pass.
- Production build with the ad env: pass. `/question-of-the-day` stays static ISR; `/api/qotd/vote` is dynamic.
- Chrome browser script, vote API mocked, at 390 and 1280: 30 of 30 pass. It covers:
  - the streak before and after, countdown, no request before answering, the vote payload;
  - percentages, top answer and total, the share card PNG, changing the answer without changing the streak;
  - restore after reload, a graceful message when the API is down, no horizontal scroll and no page errors.
- LCP element unchanged (hero text / question text). The panel renders in the static HTML (no layout shift); no network request before an answer.
- Ad placement: `adsense-pages-browser.mjs` 70/70 (includes "Ad stays outside first viewport"); `ad-auto-bootstrap-browser.mjs` pass. PublicAdPlacement position in the page is unchanged.
