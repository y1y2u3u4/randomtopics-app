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

Use the account verified as belonging to RandomTopics. Begin in a dedicated
sandbox. Live and test resources and keys must be configured separately.

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

## Verification and current external blockers

Run `npm run billing:test`, `npm run speech:test`, `npm run growth:test`,
`npm run lint`, and `npx tsc --noEmit`. Tests use synthetic keys and mocked
Stripe/Supabase responses; they do not establish a successful Stripe payment.

As of September 20, the requested Chrome extension is installed, but browser
discovery in this task returns only the in-app browser and selecting Chrome
returns unavailable. No Stripe product, price, API key, portal configuration or
webhook has been created during this task. No FlashcardMaker key has been read
or reused. RandomTopics's configured preview environment contains no Stripe
credential and no enabled email recovery flag. Existing documentation records
SMTP as unconfigured; delivery has not been verified in this task.

Before enabling sales, finish Chrome connection and Dashboard setup, configure
and verify email recovery, then exercise real sandbox Checkout (success,
decline, 3DS, cancel), confirmed access/40-attempt quota, owner isolation,
renewal/failure, cancellation, and replayed/out-of-order webhook deliveries.
Verify portal branding and its period-end cancellation setting. Keep live sales
off until these external checks pass.
