# Vercel bill verification — 2026-11-16

Scope: bill-1116 only; no push, deployment or Vercel settings changed.

## Changes and existing safeguards

- `/api/adslot` is country-dependent (`x-vercel-ip-country`, configurable country exclusions), sets a 24h geo cookie, and must remain private. Shared caching would mix countries and change ad eligibility. Added document-level promise deduplication; existing cookie still avoids calls across documents. AdSense placement and all paid/privacy/host/QA gates remain intact.
- SpeechPlanTeaser now reads billing configuration only when its speech surface is visible. Existing config promise deduplicates concurrent consumers; added a concurrency assertion. SpeechCoachEntry already lazy-loads the coach only after opening.
- Exception to “no speech calls on non-speech pages”: signed-in visitors still require the existing private ad-entitlement lookup to preserve paid ad-free behavior. Anonymous visitors with no stored session already use a local signed-out answer. Removing authenticated entitlement requests would violate the ad behavior requirement. Storage-denied browsers also retain the conservative existing auth path.
- Link regression now includes PartyFlowLink; wrapper enforces prefetch=false after spreading props. All 643 TSX files checked. Existing list/footer/language links already disable prefetch.
- Added 7-day cache headers for manifest/images/fonts with one-day stale revalidation. Regression checks actual Next path matching and header value.
- All existing page revalidate literals are >=3600; no ISR or static route declarations changed.
- Build ignore: first deploy builds; preview branches build only on main or preview/*; docs/**, *.md, reports/**, data/snapshots/** and data/reports/** alone skip. Runtime src/data and arbitrary JSON still build. Git errors and empty diff build. Ten isolated fake-git environment cases assert Vercel's 0=skip/1=build semantics.

## Commands

`npm run cost:test`: headers, ISR, config/geo deduplication, build-ignore, links, and actual SpeechCoach blocked-state render with quota and daily-limit payment action visible.

`npm run ads:test`, `npm run billing:test`, `npm run speech:test`: all passed (outputs adjacent). Tests are synthetic, not real payments or revenue evidence.

`npx tsc --noEmit`, targeted `npx eslint next.config.ts src/lib/adslotClient.ts src/components/AdsterraNative.tsx src/components/PartyFlowLink.tsx src/components/SpeechPlanTeaser.tsx`: exit 0.

`npm run build` before, `npx next build --webpack` after: external Google Fonts DNS failure; logs adjacent. Offline builds use Next's NEXT_FONT_GOOGLE_MOCKED_RESPONSES with identical fixture before/after; no production font source changed.

## Measurement limits and expected savings

Dispatch/user baseline: 12h 69k CDN requests, 21 days 153 deployments (84 previews), 221 build minutes; homepage 26 same-origin requests (21 static, 3 speech, 1 adslot), 272 internal links. These are supplied production measurements, not re-measured here. No deployed after measurements exist. Do not infer savings from link count: prefetch was already disabled for ordinary links.

Expected: fewer duplicate geo requests, no hidden speech offer config request, browser reuse of public assets, fewer preview and documentation builds. Paid signed-in ad checks and geo-specific private caching intentionally remain.

## Existing anti-patterns found

Hidden component eagerly fetching billing configuration; Link wrapper exemption from regression checks; no explicit public asset cache policy; all preview/docs commits eligible for builds. Multiple parent/worktree lockfiles also trigger Next workspace-root warnings (not changed in this scope).

## Coordinator: after deployment

```bash
curl -sSI https://randomtopics.app/
curl -sSI https://randomtopics.app/topic-of-the-day
curl -sSI https://randomtopics.app/site.webmanifest
curl -sSI https://randomtopics.app/favicon-32x32.png
curl -sSI https://randomtopics.app/api/adslot/
curl -sSI https://randomtopics.app/api/speech/config
```

Expect HTML 200 and indexable metadata unchanged; manifest/image cache policy as specified; both private APIs remain private/no-store. Validate geo using actual regional requests (do not treat spoofed request headers as geo verification). Browser: anonymous homepage without opening speech; then open speech; quota/daily block exposes payment action; paid user remains ad-free. Compare same-window 12h CDN/functions and build CPU after 24h. Confirm main auto-deploy and preview/* convention in actual Vercel builds.

## Build outcome

Before compiled in 3.4min; after in 3.5min using identical font mocks. Both completed TypeScript and page-data collection, then failed exporting /es/opengraph-image because cdn.jsdelivr.net DNS is blocked. Both partial outputs contain 104 HTML files including homepage. Complete route tables unavailable: no successful full build or complete static route comparison is claimed. Route declarations unchanged. measurements.json compares partial HTML asset URLs, not browser requests. Re-run full build with network before deployment.
