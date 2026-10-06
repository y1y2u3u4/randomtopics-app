# Speech mobile first-screen follow-up — 2026-10-06

Baseline: `9246e8ad73e7904577edd89553159ffae94bbc9c`, verified on both the original remote branch and `randomtopics.app` before editing/release.

With the optional replay notice still unanswered, the 390×844 first-visit Generate button previously ended at 856.625px. This patch makes the English Speech hub use a compact phone hero: the decorative illustration is desktop-only, heading/hero whitespace and the controls card's padding are smaller. Narrow Generate buttons allow enlarged text to wrap without clipping. Other generator pages retain their existing defaults; desktop spacing and illustration are retained.

Privacy copy, Allow/Continue buttons, consent storage, replay gating, CMP, ad eligibility, entitlements, business requests and analytics events are unchanged. No new event schema or funnel definition is introduced. Existing QA event tagging and once-per-action semantics remain intact.

## Verification

- Production build: 379 routes; TypeScript passes; lint has zero errors and the existing unused `feedback` warning in `speech-evidence-live-check.mjs`.
- All 46 existing `*regression.mjs` scripts pass.
- `scripts/speech-firstscreen-browser.mjs`: 13 isolated, built-page cases pass. Normal first-visit portrait: 360×800, 375×667, 390×844 and 412×915 fully contain Generate while both privacy choices remain unanswered. 320×568, 844×390, desktop 1280×900, and 200% root text at 320/390/844px are covered with scrollable, readable Generate controls. Enlarged narrow filter submission is also checked.
- Unknown, declined and explicitly allowed replay choices each survive generated-topic Back/reload and rotation. Restoring topics produces no second generation event. Unknown/declined never load replay; allowed loads only a synthetic SDK, with analytics consent granted and ad consent denied, then supports switching off. The private saved library has no active replay.
- The browser uses fresh contexts and blocks all real external collectors, non-GET and `/api/` requests. The local build uses a synthetic replay project ID only. No production configuration is changed and no real recording, model, payment, ad or analytics call is made by these tests.

The first 320px/200% run exposed button text clipping; the scoped padding/wrapping fix passes the final run. One intermediate font/Turbopack build failed; its log and generated cache were retained outside the repository, and a clean-cache rebuild plus the final rebuild passed without dependency changes.

Evidence is saved alongside the isolated worktree in task-5: `speech-firstscreen-local-release-20261006.json`, its viewport screenshots, `speech-firstscreen-regression-20261006.json`, and the build/type/lint logs. The production deployment SHA, ID and post-release checks are recorded separately in the task handoff after release.

These checks use isolated Chromium with CSS text enlargement. Actual iOS Safari/system text settings and real replay/ad delivery are not claimed as verified. Existing site-wide navigation is outside this Speech hero patch.

Original worktree branch, tracked changes and user-owned untracked files remain untouched. Only metadata is compared for the two preserved user evidence files; their contents are not read or staged.
