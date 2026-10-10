# Non-European RDP gate repair

Scope: the existing 20 reviewed public advertising pages only, based on paid-ad-exclusion commit `26c0877`. No Speech advertising, account privacy setting, CMP message, price, analytics event or permission is added. This implements the approved policy for known non-European visitors, including US visitors, using the existing NPA/PPT/RDP settings.

## Official integration evidence checked on 2026-10-06

- [Google AdSense RDP tags](https://support.google.com/adsense/answer/9598414?hl=en): the asynchronous AdSense `ins` uses `data-restrict-data-processing="1"`; the documented wire indicator is `rdp=1`. Per-request RDP applies globally. This patch preserves the existing attribute and additionally refuses preparation/release if it is missing.
- [Google Privacy & Messaging API](https://developers.google.com/funding-choices/fc-api-docs): `CONSENT_API_READY` means APIs are defined, not that consent was granted. The four initial US enum values distinguish unknown, non-applicable, not opted out and opted out. Read the initial getter only in `INITIAL_US_STATES_OPT_OUT_DATA_READY`; subsequent decisions require GPP.
- [Google GPP support](https://support.google.com/adsense/answer/14126816?hl=en): GPP/CMP is not mandatory for US ads; EEA/UK/Switzerland continue to use certified TCF. Google's accepted US sections expose sale/sharing/targeted-advertising opt-outs. Our product policy is stricter than merely serving RDP after an opt-out: explicit opt-out means no ad request.
- [IAB GPP 1.1 API](https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/blob/main/Core/CMP%20API%20Specification.md): `addEventListener` returns `pingData`; `loaded` plus `ready` and `applicableSections=[-1]` is the non-applicable signal. Parsed sections contain arrays of segment objects, including an optional GPC segment. Unknown or malformed sections stay blocked.
- [IAB US National fields](https://github.com/InteractiveAdvertisingBureau/Global-Privacy-Platform/tree/main/Sections/US-National): the opt-out fields use 0 for not applicable, 1 for opted out, and 2 for not opted out. These values are not consent grants.

## Policy and lifecycle

| Input | Result |
| --- | --- |
| TCF missing, failed/loading or `gdprApplies` unknown | Pause; no geographic inference from US API absence |
| `gdprApplies=true` | Preserve final TCF choice, purpose 1 and Google vendor 755 requirements |
| `gdprApplies=false`, optional US/GPP APIs absent | Release only the existing mandatory NPA/PPT/RDP request |
| Installed US API has not called back, throws, or supplies unknown/malformed data | Pause |
| Initial US `NOT_OPTED_OUT` | May use RDP once the live GPP observer also has a ready, non-opted-out/non-applicable snapshot |
| GPP installed but loading/error/unsupported/malformed | Pause for non-European traffic |
| Explicit US/GPP opt-out or GPC | No request, including when TCF consent exists |
| Paid or entitlement pending/failed | Preserve the existing pre-SDK/CMP exclusion |

`unavailable` records that an optional API was not provided. It is never written as consent, a US exemption, or proof that the visitor is outside the US. Requiring live GPP for a configured applicable US message ensures later decisions can be observed; it does not reintroduce a global US API dependency for the actual missing-interface case.

A later explicit opt-out/GPC or final EU refusal pauses requests and retires the already requesting document to the existing same-content `rt_ads=off` URL. It does not refill an ad or merely hide the old runtime. EU message-open states stay paused without interrupting the message. GPC is checked initially, immediately before release, and on focus/visibility boundaries. Paid-user entitlement and cross-route document retirement remain unchanged.

Only coarse in-memory statuses are retained. No TC/GPP strings, user IDs, IPs or new analytics fields are stored or emitted. The existing English/Spanish privacy notice already describes non-personalized ads with restricted processing and regional choices; no copy or backend configuration change was required.

## Verification and effect boundary

Pure policy/US/GPP tests, actual React component tests and built-page tests cover the missing API/no callback, empty optional namespace, incomplete API, unknown/failed region, EU consent/refusal, installed US/GPP waiting states, explicit opt-outs, GPC, duplicate callbacks, subsequent withdrawal, paid users, entitlement errors, upgrades, account changes and fixed-slot behavior. Existing whole-project regressions, lint, typecheck and build protect the prior work. Browser tests intercept every ad/CMP request with mocks and block production analytics, account and payment endpoints.

The documented RDP attribute and pre-request NPA/PPT configuration are verified locally and in deployed static/mocked pages. No real ad request is made to inspect a real `rdp=1` wire request, no real ad is clicked, and no real paid account is queried. Actual regional CMP choices and fill/revenue changes remain observational production acceptance rather than automated traffic generation.

Pre-fix baseline supplied by the coordinating task: as of Beijing 2026-10-06 07:08, Shanghai reporting dates October 5–6, 20 ad requests / 19 impressions / estimated USD 0.01 / 0 clicks; site Ready and ads.txt Authorized. This is a pre-fix baseline, not evidence of this change's outcome.
