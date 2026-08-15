# SEO growth release baseline

## Measurement window

- Recent period: 2026-07-16 through 2026-08-12
- Previous period: 2026-06-18 through 2026-07-15
- Clicks: 9,968 vs 2,160 (+361.5%)
- Impressions: 118,721 vs 35,300 (+236.3%)
- CTR: 8.4% vs 6.1%
- Average position: 9.0 vs 12.2

This release protects the pages driving the increase, restores indexing only for
mode/category combinations with demonstrated demand, and shortens titles on
high-impression pages whose clicks did not keep pace.

## Priority cohorts

| Cohort | URLs | 28-day signal | Release goal |
| --- | --- | --- | --- |
| Winners | `/`, `/spin-the-wheel`, `/es`, `/es/most-likely-to` | Majority of net click growth | Protect behavior and strengthen internal links |
| CTR recovery | `/debate`, `/question-of-the-day`, `/icebreaker`, `/topics/toastmasters-table-topics` | Impressions grew faster than clicks | Shorter intent-matched titles and clearer utility |
| Selective combinations | `/writing/philosophy`, `/writing/psychology`, `/speech/politics`, `/debate/technology`, `/conversation/philosophy` | Existing clicks or sustained impressions | Index + sitemap; keep all other combinations noindex |
| Spanish expansion | `/es`, `/es/most-likely-to`, `/es/spin-the-wheel`, `/es/topics/ethical-dilemma-questions` | Spain and Mexico both accelerated | Correct language signals and pass homepage authority |

## Release validation

Run the app in production mode, then execute:

```bash
npm run build
npm run start
npm run seo:audit
```

To audit the generated files without opening a local HTTP port:

```bash
SEO_BUILD_DIR=.next/server/app npm run seo:audit
```

To test another environment:

```bash
SEO_BASE_URL=https://example.com npm run seo:audit
```

The audit checks critical titles, canonical URLs, index/noindex policy,
reciprocal hreflang, Spanish language boundaries, sitemap membership,
robots.txt, and the legacy `/article/*` redirect.

## GSC follow-up

Evaluate technical indexing separately from traffic impact:

1. After deploy: verify rendered metadata, sitemap membership, status codes and
   the Vercel deployment status.
2. After 7 days: compare clicks and impressions for each priority URL against
   the seven days before release. Do not reverse a change on one-day volatility.
3. After 28 days: use an equal-period comparison for page CTR and query mix.
4. Keep a combination page indexable only if it earns clicks or sustained
   impressions and its content remains meaningfully differentiated.

Immediate success means the technical signals are present in production.
Ranking and traffic changes require Google to recrawl and are judged on the
7-day and 28-day windows above.
