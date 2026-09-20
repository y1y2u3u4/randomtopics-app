# RandomTopics login email setup

The owner has signed into Resend. No API key has been generated or custom SMTP
enabled yet. The dedicated Supabase project is `randomtopics-speech`
(`ubqmwhrylrhxlquszvze`). Its email confirmation remains enabled.

## Prepared sending domain

Use `auth.randomtopics.app` for login mail, with sender
`RandomTopics <noreply@auth.randomtopics.app>`. The domain setup is open in
Resend's manual DNS step, using its North Virginia region. It has not yet been
verified. Receiving is disabled. Before using login links, disable click/open
tracking so the authentication URL is not rewritten.

Authoritative DNS is Cloudflare (`daisy.ns.cloudflare.com` and
`titan.ns.cloudflare.com`), not Vercel. The Cloudflare login page is open for the
owner. Do not change nameservers or the website's existing records.

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
Only the three required records above are currently planned.

## SMTP configuration after domain verification

Create a new key named `RandomTopics Auth SMTP` with **Sending access**, scoped
only to `auth.randomtopics.app`. The current key form offered only All domains
while the domain setup was incomplete, so that draft was canceled without
creating a broader credential. Obtain confirmation for the new scoped sending
credential at creation time and store it in the dedicated Supabase SMTP settings.

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

Verify delivery and the complete website email-link/recovery flow before
enabling `SPEECH_EMAIL_ENABLED`. A synthetic confirmed account or an admin
generated link does not verify email delivery. Production additionally needs
its speech database connection, explicit speech flags, and separate live
billing configuration before sales can open.
