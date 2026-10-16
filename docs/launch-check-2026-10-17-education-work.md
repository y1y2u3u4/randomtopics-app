# Launch check — education/work pages (2026-10-17)

Pages: /topics/book-club-questions (new), /research-topic-generator (24 → 96 topics + full bank), /debate/high-school (60 resolutions with format tags).

- site_walk (`--only` the 3 pages, local production build): **severe 0 real**. The 3 "canonical points to another domain" items are the expected production canonical (https://randomtopics.app/...) on a localhost build. Low: description length (trimmed to 159–170 chars), no og:image on /research-topic-generator (pre-existing).
- Manual walk: book club random picker draws without repeats and filters by section; print button present; FAQ, related links OK. Debate HS bank at 375 px: no horizontal scroll, format tags wrap under each topic.
- Tests: seo-routing (252 sitemap URLs), growth, generators, ads:test (209 of 252 paths ad-eligible; the new page is included), tsc, eslint.
- Also fixed: double-encoded em dashes ("â€”") on /debate/high-school, /debate/college, /debate/middle-school.
- Existing already (no new page): /question-of-the-day-for-work (since 8/31, but **0 GSC impressions in 28 days** → added to the indexing queue as P1), /morning-meeting-questions (10/16, classroom, ad-free by rule).
- Art: book club hero generated in ChatGPT web (conversation "Create Book Club Illustration"); saving it to public/art/topics/book-club.jpg needs a download approval. The page renders without it (ClassroomArt shows nothing until the file exists); docs/art-requests.json item `book-club-hero` is pending.

Competitor comparison (book club questions): top results are plain lists of 20–50 generic questions. This page has 116 questions in 12 sections (openers → ending, nonfiction/memoir, mystery, fantasy, host wrap-up), a no-repeat random picker with section filters, a printable list, and hosting guidance in the FAQ.
