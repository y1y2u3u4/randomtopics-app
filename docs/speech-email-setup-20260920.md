# RandomTopics login email setup

The owner approved the scoped sending delegation and SMTP key. Resend domain
verification and encrypted Supabase custom SMTP setup are complete. The dedicated Supabase project is `randomtopics-speech`
(`ubqmwhrylrhxlquszvze`). Its email confirmation remains enabled.

## Prepared sending domain

Use `auth.randomtopics.app` for login mail, with sender
`RandomTopics <noreply@auth.randomtopics.app>`. The domain is verified in Resend's North Virginia region. Receiving is disabled.
No tracking subdomain is configured: the tracking screen offers a new setup,
which was left uncreated so auth links are not rewritten.

Authoritative DNS is Cloudflare (`daisy.ns.cloudflare.com` and
`titan.ns.cloudflare.com`), not Vercel. The owner has logged into Cloudflare.
Zone `c5d3283ede3349de2591b1a5177ae98c` preserves the original website and Google
verification records. The three required records below are saved and were also
verified through public DNS. Resend reported DNS verified at 23:12 and domain
verified at 23:13 China time on September 20.

Resend's current setup page requests these three new records, relative to the
`randomtopics.app` zone, all with automatic TTL. Re-read the current setup page
before applying them in case the domain draft has been regenerated:

| Type | Name | Content | Proxy |
| --- | --- | --- | --- |
| TXT | `resend._domainkey.auth` | The DKIM public key shown below | N/A |
| CNAME | `rsend.auth` | `rsend.forge.rmta.net` | DNS only |
| CNAME | `send.auth` | `send.forge.rmta.net` | DNS only |

DKIM **public DNS value**, not an API secret:

```text
p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDKMasUzLiiojP74Xs1+PnBp8Z60RhdOQorVyihiLNNWnJ5g1mvjNyaNvrwKWxGvY+vluVYYhlJtMOXer5kNhoLbLxoEhKLtOsnqVbkdOyRowJecHnqsHcv8bAsrxZNmdk07c9OCGvSCfTcBW6RXqcfEYOe8ojQCOJU+TIR1ielaQIDAQAB
```

The optional root `_dmarc` suggestion must not overwrite an existing policy.
Only the three required records above were added; root DMARC was unchanged.

## SMTP configuration after domain verification

The approved `RandomTopics Auth SMTP` key has **Sending access**, scoped only
to `auth.randomtopics.app`. Its key ID is `4c43f62c-751d-4a44-bda4-63b3c9a31630`.
It was transferred in browser memory to Supabase SMTP and saved encrypted.
Reloading Supabase confirms SMTP enabled with the provider settings below.
The key value was not printed, committed or saved in a temporary file.

The official Resend Supabase SMTP guide specifies:

| Setting | Value |
| --- | --- |
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | Newly approved domain-scoped Resend sending key |
| Sender | `noreply@auth.randomtopics.app` |
| Sender name | `RandomTopics` |

Reference: https://resend.com/docs/send-with-supabase-smtp

Actual delivery and the complete website email-link/recovery flow are still
pending owner test-email consent. The payment branch has `SPEECH_EMAIL_ENABLED=true`
for verification only, while billing remains disabled. Preview deployment
`dpl_8ne9BDHsaBLvN5BtbBNz1KHWQJJ2` is Ready and shows the real link-email form.
Do not enable production email/sales until the complete flow passes. A synthetic confirmed account or an admin
generated link does not verify email delivery. The dedicated database now
connects only to new Production deployments; the protected verification preview
retains its existing connection. Production speech switches are prepared, and
email/billing/live-billing remain explicitly false pending end-to-end checks.
