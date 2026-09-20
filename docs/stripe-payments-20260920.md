# RandomTopics speech payments

## Product and credential boundary

The agreed baseline in the speech-coach branch is **RandomTopics Speech Coach**:
USD 12.00 every month, 40 recorded attempts per paid period (retries included),
up to two minutes per attempt. Unused attempts do not roll over. No trial or
promotional price is configured. The first two free attempts do not need a card.

Create a new Stripe product and price, a NEW service-specific restricted API key,
a dedicated webhook endpoint, and a dedicated customer portal configuration.
Never copy FlashcardMaker's secret, signing secret, customer IDs, or portal defaults.
The application reads only `SPEECH_STRIPE_*` variables and does not fall back to
generic `STRIPE_*` variables.

Stripe products have Product/Price IDs, not individual API keys. Restricted keys
are account-level permissions for API resource types; a different key does not
by itself isolate other customers or orders in the same Stripe account. Use a
separate Stripe account if these are independently operated businesses and need
separate reporting, customer data, or statement branding. Account activation and
business verification must be completed by the account owner.

Official references:
- https://docs.stripe.com/keys
- https://docs.stripe.com/keys/restricted-api-keys
- https://docs.stripe.com/get-started/account/multiple-accounts

## Dashboard setup

Use a NEW, separate Stripe account for RandomTopics, as explicitly required by
the owner. Do not use the FlashcardMaker account even with a new restricted key.
Choose "Create a separate account", not an organization that shares data with
FlashcardMaker. The owner must personally complete the financial-account
creation and verify its operating country and business information. Begin in
that account's dedicated sandbox. Live and test resources and keys must be
configured separately.

1. Create **RandomTopics Speech Coach** with the description above. Add product
   metadata `product=randomtopics_speech`. Add a flat recurring USD 12.00 monthly
   price, per unit, quantity 1, licensed usage. Record its `prod_` and `price_` IDs.
2. Create a NEW restricted key named **RandomTopics Speech — Sandbox**. Starting
   with no permissions, grant Prices/Products read, Customers write (includes
   read), Checkout Sessions write (includes read), Subscriptions read, and
   Customer Portal write. Dashboard labels may differ; verify each exercised
   API in sandbox and add only a demonstrably required permission. No payouts,
   transfers, account administration, product mutation or refund permission is
   needed by this application's runtime.
3. Create a dedicated portal configuration with invoice history, payment method
   updates and cancellation **at period end**. Disable subscription switching,
   quantity changes and trial/discount offers. Use RandomTopics business links
   and the trusted `/speech/account` return URL. Record the `bpc_` ID. If the
   dashboard does not expose multiple configurations, create this configuration
   through Stripe's documented API using a dedicated setup credential, never
   by editing another product's default configuration.
4. Create the webhook `<trusted-origin>/api/speech/webhook` for
   `customer.subscription.created`, `customer.subscription.updated`, and
   `customer.subscription.deleted`. Record this endpoint's new signing secret.
   Its API version should match the installed stripe-node SDK's default version.
5. Store these values ONLY in the RandomTopics Vercel project's encrypted
   environment variables. Sandbox credentials go to the payment preview branch.
   Live credentials go only to Production. Do not paste secrets into chat, commit
   them, or store them as `NEXT_PUBLIC_*` values. Hosted Checkout requires no
   publishable key in this integration.

Required environment names are listed in `.env.example`. `SPEECH_SITE_URL` must
be an explicit HTTPS origin, with no path, query, credentials or fragment.
HTTP localhost is permitted only with test credentials. Live credentials are
rejected in a Vercel Preview deployment, even when copied with live flags.

## Verified behavior in code

- Only a verified, recoverable account can create Checkout; configuration alone
  does not enable sales until `SPEECH_EMAIL_ENABLED` and `SPEECH_BILLING_ENABLED`
  are true. Live mode additionally needs `SPEECH_LIVE_BILLING_ENABLED=true`.
- Checkout verifies product identity, metadata, price, mode and billing interval.
  It verifies the saved Stripe customer's application and user metadata before
  creating a session or granting portal access.
- The browser cannot choose a price/customer. Pending sessions can be reused
  only for this product, price, owner and return origin. Existing subscriptions
  block another purchase; requests use Stripe idempotency keys.
- The portal uses the configured `bpc_` rather than an account-wide default.
- Signed webhook snapshots belonging to other products are ignored before an
  API read. Matching events re-read current subscription state and update only
  the linked user/customer. Older events cannot replace newer persisted state.
  Replays do not append credits or extend periods.
- The account page shows the server-confirmed subscription state. Visiting a
  `payment=return` URL never grants access. Refresh loads persisted webhook state.
- Closing new sales does not stop fulfillment or cancellation for existing
  customers while the dedicated billing configuration remains present.
- The existing speech analytics and consented Clarity integration are preserved.
  A visible-price/subscribe/Checkout-redirect funnel measures progress to Stripe,
  explicitly not payment success. Checkout/portal failures use sanitized issue
  categories; no checkout URL, customer ID, email or credential enters analytics.

## Verification and current external blockers

Run `npm run billing:test`, `npm run speech:test`, `npm run growth:test`,
`npm run lint`, and `npx tsc --noEmit`. Tests use synthetic keys and mocked
Stripe/Supabase responses; they do not establish a successful Stripe payment.

As of September 20, Chrome is connected and the owner has signed into Stripe.
The signed-in account is named `flashcardmaker` (`acct_1T8KebRoDWT36vrx`).
The following resources were created in its **test mode** before the owner
clarified that an entirely separate Stripe account is required. They are
**unused and must not be configured in RandomTopics**:

- Product: `prod_VIGrzHwEI2zFyQ` (RandomTopics Speech Coach).
- Price: `price_1UHgK8RoDWT36vrxa54iObNp` (USD 12.00 monthly).
- Product metadata: `product=randomtopics_speech`.
- Subscription statement descriptor: `RANDOMTOPICS`.

The old-account restricted-key draft has been cancelled. No API key, portal
configuration or webhook was created in that account by this task, no
FlashcardMaker credential has been copied or reused, and none of the above IDs
has been stored in Vercel.
The earlier request to approve a key in the old account is superseded.

The owner completed creation of a separate `RandomTopics` Stripe account:
`acct_1UHgTpRGH4CTejf9`. Its dedicated `RandomTopics 沙盒` uses
`acct_1UHgTxEXV3G3z9Pt`. Both are different from the FlashcardMaker account.
The initial website/business-description onboarding is complete, with recurring
subscriptions selected. All new product, price, restricted-key, portal and
webhook work must now take place in this RandomTopics sandbox. The owner has now completed live activation. The account-status page shows
Payments and Payouts active, with no pending tasks.
The live onboarding business type is explicitly **Individual**, based in Hong
Kong. The owner reused the existing personal legal entity. This is separate
from API credentials and does not merge the two Stripe accounts. Do not change
shared identity details; Stripe warns these synchronize between accounts.
Stripe's legal-entity-sharing documentation distinguishes copied business
profile/support details from shared legal-entity details. The live draft now uses
`https://randomtopics.app`, statement descriptor `RANDOMTOPICS` and prefix
`RNDMTOPICS`, plus a RandomTopics speech-software service description. A separate
read-only check confirmed FlashcardMaker still displays its own website and
statement descriptor. The RandomTopics draft uses included Radar Lite and opts
out of the optional Tax service and Climate revenue donation. The owner personally completed final account activation. This task did not
accept the agreement or submit the application.

Created and verified in the dedicated RandomTopics sandbox:

- Product `prod_VIH4VEqdqHLB8Q`, with the description/metadata above.
- Monthly USD 12 price `price_1UHgWbEXV3G3z9Ptg7GFOynC`.
- Portal configuration `bpc_1UHgYREXV3G3z9PtHSueij2Y`, with invoice history,
  payment-method updates and cancellation at period end; no plan/quantity
  switching or retention coupons.
- Portal title: `Manage your RandomTopics Speech Coach subscription`.
- Portal policy links were verified as `https://randomtopics.app/terms` and
  `https://randomtopics.app/privacy` after updating sandbox public business links.

Those three resource IDs and `SPEECH_SITE_URL` have been saved only in Vercel
Preview for branch `codex/randomtopics-stripe-20260920`. The trusted origin is
`https://randomtopics-git-codex-randomtopics-s-f41608-y1y2u3u4s-projects.vercel.app`;
the portal returns to `/speech/account`. After explicit owner confirmation, the dedicated
restricted sandbox key was created with exactly the six permissions listed
above and stored through Chrome as a Vercel Secret (`type=sensitive`), only in
Preview for `codex/randomtopics-stripe-20260920`. The full key was not printed,
committed, copied to another project, or stored in Production.

The sandbox webhook is `randomtopics-speech-preview`
(`we_1UHipTEXV3G3z9Pt66Pp862S`), with the three subscription events above and
API version `2026-08-26.dahlia` (matching stripe-node). Following owner approval,
a dedicated Vercel automation bypass named
`RandomTopics Stripe sandbox webhook — payment preview` was created and added
to this endpoint's URL. Preview deployment protection remains enabled. This is
a project-scoped bypass, not a route-scoped permission; keep its value secret.
The endpoint's signing secret is encrypted in Vercel Preview only for the payment
branch. Neither credential is recorded in this document or source control.

Created in the activated, independent RandomTopics **live** account:

- Product `prod_VIHW7H83g7LygR`.
- Monthly USD 12 price `price_1UHgx2RGH4CTejf9rqvnlV7i`.
- Portal `bpc_1UHgz8RGH4CTejf9DcCx4zZ3`, period-end cancellation and payment-method
  updates enabled; plan and quantity changes disabled; no retention coupon.
- Portal title `Manage your RandomTopics Speech Coach subscription`, returning
  to `https://randomtopics.app/speech/account`.
- Live public support, privacy and terms URLs point to `/contact`, `/privacy`
  and `/terms` on `https://randomtopics.app`; saved values were re-opened and verified.

The corresponding product, price, portal IDs and `SPEECH_SITE_URL` are stored
only in Vercel Production. The live webhook
`we_1UHjXZRGH4CTejf9oAwZ8rxu` (`randomtopics-speech-production`) now points to
`https://randomtopics.app/api/speech/webhook`, with only the three subscription
events and API version `2026-08-26.dahlia`. Its dedicated signing secret is saved
as a Secret in Vercel Production only; the sandbox signing secret is unchanged.
The owner completed Stripe's email identity verification. The approved live
restricted key `RandomTopics Speech — Production` was created and saved as
`SPEECH_STRIPE_SECRET_KEY`, using Vercel's Secret type in Production only.
The saved Stripe key summary was reopened and confirmed exactly three read
permissions (Products, Prices, Subscriptions) and three write permissions
(Customers, Customer Portal, Checkout Sessions). Vercel's environment listing
confirms encrypted Production storage. The one-time key dialog was closed and
the transfer variables were cleared without printing or persisting the key.
No live billing flag has been enabled.
No successful live webhook delivery or live payment has been established.

The owner approved the sending delegation and domain-only SMTP key. The three
Cloudflare records are saved, public DNS resolves them, and Resend has verified
`auth.randomtopics.app`. The new `RandomTopics Auth SMTP` key has Sending access
only for that domain. Custom SMTP is enabled in Supabase and persisted settings
were verified after reloading. The exact payment-preview `/speech/account`
callback preserves the three existing callbacks. Actual recipient delivery and
account recovery remain pending owner test-email consent. See
`docs/speech-email-setup-20260920.md`. A confirmed synthetic account was used
for payment QA; generating its test sign-in link does not establish that a real
customer can receive recovery email.

Payment code commit `67e9329` includes the latest `main` speech analytics and
consented Clarity work. Billing, speech/measurement and growth regression,
ESLint, TypeScript and diff checks pass. Initial deployment smoke checks showed
no browser warnings/errors. Actual sandbox integration QA subsequently ran on
Ready deployment `dpl_5gNJPzF37PBnWGwA7tG13ZPgMd2g`, using a synthetic confirmed
account and temporary branch-only billing/email flags. No real payment card,
fund transfer or model inference was used.

## Actual sandbox verification, September 20

- A signed Stripe fixture event reached the protected webhook and returned
  HTTP 200. An unsigned request returned HTTP 400 `Invalid signature`.
- Website Checkout used the dedicated USD 12 monthly plan. Stripe's official
  decline card was rejected and no subscription entitlement was granted.
- Stripe's official 3DS card completed its test challenge. The payment returned
  to the account page, the real subscription webhook updated the database,
  and the page displayed active access through October 20.
- A second purchase while subscribed returned HTTP 409. The browser could not
  select another customer's portal by submitting forged owner identifiers.
- The actual quota function accepted attempt 40, rejected attempt 41 and did
  not consume an extra slot for an identical request. Forty previous-period
  fixtures did not consume the new period's allowance. All practice fixtures
  were removed; no inference request was sent.
- A second synthetic user could not read the first user's private attempt or
  open their portal. Unauthenticated history returned HTTP 401.
- The actual customer portal showed the dedicated RandomTopics title, correct
  monthly price, payment method and invoice history. Cancel-at-period-end
  preserved paid access. Replaying the older subscription-created event did
  not overwrite the newer account state, extend its period or add usage rows.
- A Stripe test clock advanced the test customer through a monthly renewal.
  Invoice `in_1UHjGFEXV3G3z9PtzlklIY3e` was `paid`, for USD 12, with reason
  `subscription_cycle`; the webhook moved the stored period to October 20–
  November 20. Stripe's virtual clock does not change the application's clock,
  so the API correctly did not activate a period whose start is in its future.
- Switching that synthetic subscription to Stripe's documented
  `pm_card_chargeCustomerFail` fixture and advancing another month produced
  `past_due`. The webhook set `subscription_active=false`.
- The synthetic subscription was finally canceled without proration or a new
  invoice. Stripe showed `canceled`, and the website retained no paid access.

Audit references (sandbox only): customer `cus_VIJeWxDg18fme8`, subscription
`sub_1UHj3HEXV3G3z9Ptt38mTHch`, test clock
`clock_1UHjFpEXV3G3z9PtSpZ8gwv8`. They are not runtime configuration values.
Temporary branch-only `SPEECH_BILLING_ENABLED=true` and
`SPEECH_EMAIL_ENABLED=true` overrides were removed after QA. Replacement preview
`dpl_9dwhx3AennnsicoaqaECzG82yYyA` is Ready and owns the stable branch alias.
Its actual history API reports both flags unavailable; Checkout returns HTTP
503 `Subscriptions are not open yet.` Chrome confirmed the customer portal
still opens with the paid/failed test invoice history when new sales are off.
Production sales remain disabled.
The synthetic Supabase QA users and their practice/account rows were removed
after verification. The browser was signed out of the QA account, and the
temporary local sign-in helper was stopped. Stripe sandbox records remain as
an audit trail; the test subscription is canceled.

## Production preparation and conversion reporting, September 20

The sandbox webhook is now **disabled**, and its dedicated Vercel automation
bypass was revoked after QA. Vercel Standard Protection remains enabled. The
other, pre-existing system bypass was not changed.

Before moving the dedicated database connection, a read-only audit found zero
linked billing customers, zero active billing accounts and five existing speech
practice rows. The Supabase Marketplace connection now targets **Production
only**, with Sensitive storage selected. Development and Preview no longer
receive this database in new deployments. This promotes the existing dedicated
database; it does not create a physically separate database. Older immutable
protected previews retain their build-time connection. Keep their billing off;
future payment QA needs a separate test database and an intentionally restored
sandbox workflow.

Production now has explicit coach switches enabled and email, billing and live
billing switches set false. Deploy the code with these gates before opening
sales. The temporary protected email-verification preview remains
`dpl_8ne9BDHsaBLvN5BtbBNz1KHWQJJ2`; its email switch is on and billing is off.

Server-confirmed paid Checkout receipts, GA4 purchase deduplication, email and
recovery events, current-day/yesterday funnel reports and a separate protected
Stripe checkout-cohort report are implemented. All billing, speech/measurement,
growth, lint and TypeScript checks passed. See
`docs/speech-payment-measurement-20260920.md` for measurement limits and the
September 21 follow-up.

Before enabling sales, verify actual email delivery and account recovery, and
the deployed production configuration. Sandbox success alone does not establish
a live payment or reliable mail delivery. No real card was charged.
