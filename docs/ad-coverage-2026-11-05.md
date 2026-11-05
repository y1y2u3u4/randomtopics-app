# Ad coverage 2026-11-05: AdSense page views vs Umami

Window: 2026-10-29 – 2026-11-04 (Pacific). AdSense API (`PAGE_VIEWS`, randomtopics.app) vs Umami page views.

| | Umami page views | AdSense page views | Ratio |
|---|---|---|---|
| All | 40,112 | 21,351 | 53% |
| Mobile | 18,938 | 11,901 | 63% |
| Laptop + desktop | 20,238 | 8,855 | 44% |
| US / IN / GB | 8,888 / 4,465 / 1,305 | 5,276 / 2,149 / 681 | 59% / 48% / 52% |
| DE / BR | 584 / 1,504 | 194 / 500 | 33% / 33% |

## Where the gap comes from

1. **Pages without ads by policy, ~14% of views.** `/speech` (paid practice, ~10%, stays ad-free), `/pt` (1.6%, ad-free since PR #166), kids and classroom pages (~1.2%), account, legal and subscription landing pages (~1%). Every other sitemap page already loads Auto ads, and client-side navigation between pages forces a fresh document (`AdDocumentBoundary`), so route changes are not a gap.
2. **Ad blockers, mostly desktop.** Umami is self-hosted, so blockers that stop `adsbygoogle.js` still let it count. That explains most of the 44% desktop ratio. A code change cannot recover this without breaking policy.
3. **Late first request on mobile.** After policy exclusions, about 71% of the remaining mobile views were counted. Before any ad request, every page waited for `/api/speech/config` (a no-store serverless call), the Supabase client and `getSession()`, even for visitors who never signed in. If that took longer than 8 s, or failed, the gate answered "unavailable" and the page got no ads at all. 79% of visits are single-page bounces, so every second before the first request costs page views.
4. **EEA/UK consent refusals** (DE 33%), which are correct behaviour.

## Changes (this PR)

- `/pt` pages now load Auto ads, except child-directed pages (`/pt/...criancas`, which also stay non-personalized). The CMP message uses `hl=pt`, and the privacy-choices link has a Portuguese label. This adds 31 pages, for 397 of 452 sitemap pages in total.
- Signed-out fast path in `observeSpeechAdEntitlement`. With no `sb-*-auth-token` key in localStorage, the visitor gets the fixed signed-out answer locally, with no config fetch and no Supabase client. A sign-in from another tab arrives as a storage event, which falls back to the full check. Blocked storage also uses the full check. Sign-in only happens on ad-free pages (`/speech`, `/account`, `/writing-journal`), so an ad document cannot gain a session in the same tab.

Expected effect: the ratio rises from ~53% to roughly 58–62%. Reaching 90% is not possible while `/speech` stays ad-free and ad blockers are counted by Umami. A realistic ceiling is about 65–70%.

## AdSense console steps for the owner (not done by code)

1. **Link GA4:** AdSense → Account → Access and authorization → Google Analytics integration → Link → choose property `G-C23RTYX4QS` (randomtopics.app) → Save.
2. **Turn off in-page Auto ads (keep anchor and vignette):** AdSense → Ads → By site → randomtopics.app → edit (pencil) → Ad formats → In-page ads off; keep Anchor and Vignette on → Apply to site.
3. Optional, not recommended under the no-popup rule: Privacy & messaging → Ad blocking recovery would show a dismissible message to blocker users.

Recheck 2026-11-09: rerun the same comparison for 11-06 – 11-08 and confirm RPM did not drop.
