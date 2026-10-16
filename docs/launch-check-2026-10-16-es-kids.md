# Launch check 2026-10-16 — Spanish kids classroom pages

Pages: `/es/this-or-that/kids`, `/es/would-you-rather/kids`.
Also changed (sections / links only, titles / H1 / body untouched): `/es/topics/writing-prompts-for-kids` (kids journal generator section, 52 prompts), `/es/this-or-that`, `/es/would-you-rather` (Para todos / Versión niños switch). English `/this-or-that/kids` and `/would-you-rather/kids` now emit an `es` hreflang twin.

## Acceptance
| Check | Result |
|---|---|
| Content clean | Spanish banks written in Spanish (96 / 70 / 52); Unicode-aware blocklist test; 43 sampled items read by hand, all OK |
| Projector, filters, print | Chrome (localhost:3041): grade + theme filter (K–2 + Animales → 14), Dame una pregunta, projector left/right sides, → advances 1/14 → 2/14; journal block generates a prompt |
| 375px | iframe scrollWidth 375 on both new pages; no console or server errors |
| hreflang | es pages: canonical self, en ↔ es ↔ x-default; English kids pages now list the es twin |
| Price / payment / ads | untouched; Spanish pages do not show the English slide packs |
| Tests | generators (classroom kids 31), handoff, growth, topics, eslint, tsc, `next build` pass; PR #139 checks green |

## Production walk
Deployed d91c7e3 (PR #139).
- 200 on both new pages; sitemap.xml lists both.
- `site_walk.py --only` (2 new + 5 touched pages, 150 internal links, 34 assets): **severe 0, medium 0**, low 9. Two of the low ones were on new pages, fixed in this follow-up: `/es/this-or-that/kids` title 72 → 66 chars, `/es/would-you-rather/kids` description 173 → 144 chars. The rest are existing pages, left as-is.
- IndexNow 200 (2 new pages + /es/topics/writing-prompts-for-kids); added to `opportunity-hub/steward/indexing/queue.md`.
- Art: reuses the English hero images (same scenes, Spanish alt text).
