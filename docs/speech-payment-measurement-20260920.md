# Speech payment conversion measurement

The ordered GA4 `speech-v2` journey now includes entry, first feedback, priced
offer, subscribe click, Checkout redirect, and server-confirmed payment on
return. Email-link start/sent/error, verified-account and recovery start/sent/error
events make the authentication step visible. Current-day and yesterday views
join the existing 7/28 complete-day reports; current-day data is provisional.
Source/medium, landing page (without query strings), and device tables contain
independent event-user counts, not conditional conversion rates.

From the September 21 payment launch, an unverified visitor can click Subscribe;
the click emits `speech_checkout_start` and focuses email verification. This
avoids losing purchase intent behind a disabled control. It does not create a
Stripe session or grant access until the same account verifies its email.
Distinguish this click from `speech_checkout_redirect` and actual paid receipts.

The server reads completed Checkout sessions using the existing dedicated
restricted Stripe key. A receipt requires the correct billing mode, product,
configured price, account owner, complete status, paid payment status, USD and
exactly 1200 cents. It exposes a SHA-256 opaque order identifier to that owner,
never Stripe customer/session IDs, email, audio or transcript in analytics.
The browser stores the opaque identifier when starting Checkout and emits
`speech_payment_confirmed` and standard GA4 `purchase` only for a matching
server-confirmed receipt. Local deduplication and GA4 transaction IDs prevent
refreshes from becoming additional purchases. The return query alone proves
nothing and never changes entitlement.

Browser measurement misses customers who do not return, use another device,
block analytics or restrict browser storage. `/api/internal/analytics/payments`
and the protected dashboard separately read Stripe truth. They paginate all
Checkout history to distinguish first buyers from later subscription checkouts.
The report is a **Checkout-created cohort**, with current payment status, for
the last 1/7/28 rolling days. It is not payment-date revenue, net revenue,
refund reconciliation or subscription-renewal reporting. A renewal does not
create a new Checkout. Incomplete pagination is explicitly flagged and first
buyer figures must not be treated as complete. Test mode is explicitly labeled.
Do not divide Stripe account/checkout totals by GA4 user totals.

Automated regression covers mode/price/owner/amount/payment-status rejection,
opaque receipts, pagination and first/repeat classification, pending-checkout
matching, repeat-refresh suppression, private-field exclusion and preview
analytics isolation. Actual live charges are not part of QA.

A one-time current-task follow-up (`randomtopics`) is scheduled for September 21
at 21:00 Asia/Shanghai. Check actual launch time, provisional GA4 availability,
source and landing-page mix, ordered step loss, email recovery and independent
Stripe live evidence. Report insufficient samples and missing attribution
honestly; an unopened feature's zero funnel is not evidence of lack of demand.
