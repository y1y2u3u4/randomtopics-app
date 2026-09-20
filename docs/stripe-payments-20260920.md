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
the portal returns to `/speech/account`. A redeploy is still needed after all
configuration is complete. After explicit owner confirmation, the dedicated
restricted sandbox key was created with exactly the six permissions listed
above and stored through Chrome as a Vercel Secret (`type=sensitive`), only in
Preview for `codex/randomtopics-stripe-20260920`. The full key was not printed,
committed, copied to another project, or stored in Production.

The webhook draft is `randomtopics-speech-preview`, with the three subscription
events above and API version `2026-08-26.dahlia` (matching stripe-node). Creation
is pending approval for a dedicated Vercel automation bypass token so Stripe can
reach the protected preview. No webhook signing secret has been created yet.

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
only in Vercel Production. There is still no live API key or webhook credential,
and no live billing flag has been enabled. Production email recovery and all
required sandbox verification remain gates before launch.

RandomTopics's configured preview environment now contains its dedicated
restricted Stripe secret but no webhook signing secret or enabled email recovery flag. Existing documentation records SMTP as
unconfigured; the dedicated Supabase project's SMTP dashboard also confirms
custom SMTP is disabled. The exact payment-preview `/speech/account` callback
has been added, preserving the three existing callback URLs. Email delivery
has not been verified in this task. The Vercel preview is
protected, so the webhook's public delivery route also needs to be resolved
before end-to-end testing.

Payment code commit `67e9329` includes the latest `main` speech analytics and
consented Clarity work. Billing, speech/measurement and growth regression,
ESLint, TypeScript and diff checks pass. Vercel deployment
`dpl_8bKShVs5weKzdwurX57PHLRxsQRe` is Ready. Chrome verified that the stable
preview account page loads its private history, correctly shows subscriptions
and email recovery as unavailable, and reports no browser warnings/errors.
This smoke check does not establish a working Checkout, webhook or mail delivery.

Before enabling sales, finish Dashboard setup, configure
and verify email recovery, then exercise real sandbox Checkout (success,
decline, 3DS, cancel), confirmed access/40-attempt quota, owner isolation,
renewal/failure, cancellation, and replayed/out-of-order webhook deliveries.
Verify portal branding and its period-end cancellation setting. Keep live sales
off until these external checks pass.
