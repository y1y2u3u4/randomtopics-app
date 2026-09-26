# Existing motion → own preparation (2026-09-26)

## Page brief and ownership

- Owner: `/debate/motions`, for browsing parliamentary / This House motions and preparing a chosen motion. `/debate` remains the random topic tool; `/debate/questions` retains question-form intent.
- Gap: a reader choosing a bank motion had no preparation control attached to that exact text. Generic generator navigation does not preserve a selected motion.
- Scope: three existing bank motions (AI labels, financial literacy, four-day week), with definition, clash, two-sided burdens and evidence-to-investigate prompts. These are editorial starting points, not factual claims, sourced evidence, or finished cases.
- Reuse the existing preparation component. Each card owns its draft, retains it across disclosure close/reopen, and exports only the exact motion plus nonblank user notes. Notes do not persist across navigation/reload; the existing notice asks users to copy before leaving.
- No new URL, title, canonical, language, hreflang or indexing changes. The original bank and numbering remain intact. Only the three supported list entries link to preparation cards; a visible top entry links to the examples.
- Writing ownership audit: retain `/writing-topic-generator`; both homepage and writing hub already link to it. Multiple URLs receiving query impressions alone do not establish cannibalization. Private analytics and query rows stay outside the repository.
- Existing QOTD, Charades and Spanish conversation observation windows remain intact.

## Measurement and acceptance

`motion_prep_open/start/copy/share/copy_error/share_error` are distinct from the debate hub and from generation. Copy/share actions are derived only for `/debate/motions` and `debate_motion_preparation`. No notes, motion text or personal identifiers enter analytics. API success does not establish delivery or an actual debate. Independent event users are not an ordered funnel.

Core Usage rows recognize the September 26 release date; earlier windows show `before_release_no_new_signal`. Actual receipt must be checked after a normal report sync. First full post-release observation: September 27–October 3, subject to source latency. Judge use and query/page clicks separately; deployment is not evidence of traffic growth.

Release gates: existing handoff/growth regressions, ESLint, TypeScript production build, SEO audit. Added checks cover exact bank membership, own-note-only export, action-source separation, false-generation exclusion and release-aware reporting. Production acceptance belongs in the PR release record: each card opens, different card notes remain isolated, close/reopen preserves notes, copy contains the selected motion and real notes, share fallback is accurate, navigation anchors work, and canonical/title remain stable. Do not claim GA4 receipt from browser acceptance alone.
