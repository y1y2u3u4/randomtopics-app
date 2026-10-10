# Paid-user exclusion on the existing public advertising pages

The 20 reviewed public pages now check the current browser's existing Speech subscription before starting either the Google CMP or AdSense SDK. Speech routes remain outside the advertising allowlist. No regional consent rules, publisher configuration, prices, quotas, analytics schema or billing flow change.

## Entitlement contract

`GET /api/speech/ad-entitlement` responds with private, no-store JSON:

```json
{"version":"speech-ad-v1","audience":"verified_session","adFree":true}
```

The only other audience is `signed_out`. No authorization header returns `signed_out` and `adFree:false`, without creating a guest. A supplied bearer must pass the existing server-side actor validation; failure must not become a signed-out success. For a verified session, the server selects only `subscription_active,period_start,period_end` from that user's existing `speech_accounts` row. An active subscription within its valid period is ad-free, including an exhausted practice allowance or cancellation scheduled for period end. There is no separate one-time/lifetime ad-free product in the current implementation. Invalid active-period data or a failed query closes the gate.

The response contains no user ID, token, email, history, transcript, payment details or remaining quota. No new analytics event is sent. The existing client session is reused; the observer never calls guest signup, checkout, history or a model endpoint.

## Document lifecycle

The ad component additionally retains its existing host, route, query, QA, GPC, viewport and regional CMP checks. Initial pending, paid and unavailable states start neither SDK nor CMP. Each document can start the SDK and release its prepared slot only once. Late responses from an earlier identity cannot grant access.

The observer synchronously suspends on auth events and rechecks on visible focus, return to visibility and every 30 seconds while visible. A persisted BFCache restoration invalidates an already started document. A paid result, identity change, failed/expired recheck, or same-route component disposal retires any started advertising document. It first pauses requests and then uses `location.replace` to the same path/query/anchor with `rt_ads=off`; the existing query exclusion prevents SDK startup in the replacement document. Removing script tags or hiding an already loaded slot is not used as the runtime boundary. Cross-route navigation continues to use the existing `AdDocumentBoundary`.

This is not instantaneous cross-device payment recognition: detection depends on the existing subscription update reaching the database, followed by a focus/visibility check or the bounded poll and request latency. A signed-out browser cannot identify a paid person from another browser. A browser with an old production document needs a normal refresh/navigation to receive this code. Whole-document retirement can clear transient unsaved UI state on a public generator; persisted saved topics remain available.

The pending recheck pauses requests. A successful same-identity free result does not refresh a previously filled slot. Retirement is one-way for that document and does not cause an ad refill loop.

## Verification and remaining acceptance

Local tests use synthetic sessions, fake database responses, mock SDK/CMP and blocked external requests. Coverage includes active/expired/canceled subscriptions, exhausted allowance, invalid auth/data, timeout, account switch, logout, repeated submit/events, stale responses, BFCache and full document replacement. Built-page tests cover all 20 paid routes, all 20 free routes, representative narrow/desktop widths, failure states, public/Speech navigation and wheel use. Existing generation/library and Speech funnel checks protect the business flows.

Run `node scripts/speech-ad-entitlement-regression.mjs`, `node scripts/adsense-regression.mjs`, and all existing `scripts/*regression.mjs`; also run lint, TypeScript and production build. `scripts/adsense-browser.mjs` exercises the actual component with mock auth. `scripts/adsense-pages-browser.mjs` runs against a built local Next server through a production-hostname proxy with synthetic Supabase sessions and mock endpoints. Never let these fixtures call production auth, database, payment, analytics or ad services.

A formal-domain check must bind the deployed commit to the deployment and use isolated synthetic entitlement/auth responses with all Google/analytics traffic intercepted. Such checks establish deployed client behavior, not a real paid-account/database or genuine regional consent/ad-fill result. Do not turn a production ad fill into an automated test. Production paid-account acceptance with an owner-controlled test account remains separate if required.

This change does not complete the separate Speech advertising design. Top-level scripts on public pages still share that origin's browser storage capabilities. A separately approved public content origin and its applicable CMP/site configuration remain prerequisites for further Speech advertising work; this patch creates none.
