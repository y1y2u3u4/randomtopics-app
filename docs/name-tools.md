# Band and Dragon name tools

Two exploratory English tools own separate intents: `/band-name-generator` names music projects; `/dragon-name-generator` names fantasy characters. `/country-name-generator` retains fictional country naming. There are no new synonym routes, Spanish mirrors, accounts, model calls, or paid APIs. Search demand and traffic gains have not been validated with GSC.

## Collection and interaction

- Band: 108 authored starting names; Indie/alternative, Rock/punk, Electronic; 12 names for each style/word-count pair. Each has one explicit seed-word recipe. Optional one-word seed (20 Unicode letters), up to five avoid terms, and batches of 1/3/5. Seeded duplicates are removed before displaying the actual eligible count.
- Dragon: 48 authored names; Ember, Tide, Gale, Stone; six short and six long names per element. Each has a suggested pronunciation and an optional original story title. These are creative settings, not translations or historical etymologies.
- Generation draws from a finite eligible pool without replacement. The starting example counts as used. Case, spacing and title changes do not create a different identity. Filtering and changing a seed keep used-name history. A short final batch is labelled; only the explicit fresh-round button resets history. Maximum history is 5,000 identities.
- Copy a result or batch, share with native-sheet/clipboard fallback, and save up to 30 names in each tool's own shortlist. Native share cancellation is neither success nor error. Clipboard failure exposes exact selectable text. In-flight actions are guarded; stale completions cannot label a replacement result or emit its success.
- Round state uses `sessionStorage` key `rt_name_round_{band|dragon}_v1`, corpus version 1 and a 24-hour TTL. It validates schema, filters, recipe references and result membership before restoring. Shortlists use separate `localStorage` keys `rt_name_shortlist_{band|dragon}_v1`; they persist until removed or browser data is cleared. Existing Topic favorites are not read, rewritten or coerced into name records.
- Names, seeds and avoid terms stay in browser state/storage; copy/share sends user-selected text only through that explicit browser action. Storage failure permits generation/copy, explains restoration limits, and reports a save failure rather than claiming persistence.

## Measurement contract

Reuse existing event names; no synonym/version event family was introduced.

| Event | Trigger and boundary |
|---|---|
| `page_view` | Existing page measurement. Not a tool use. |
| `generate_start` | One accepted explicit generation action. Double clicks in the same rendering frame are ignored. |
| `generate_success` | The local draw committed a nonempty result batch to UI state. This measures result preparation, not viewport exposure. |
| `copy_result` / `copy_error` | Browser copy helper succeeds/fails; batch is one action, regardless of result count. |
| `save_result` / `save_error` | Shortlist storage write succeeds/fails. |
| `remove_saved_result` | Explicit removal writes successfully. |
| `share_result` / `share_error` | Native share completes or fallback copy succeeds / both paths fail. Cancellation emits neither. |

Common application parameters: `tool_type=band_name|dragon_name`, `content_source=band_name_generator|dragon_name_generator`, `result_type=name`, `locale=en`, `action_surface=name_generator|name_result|name_shortlist|name_batch`; `category` and `output_style` are fixed filter enums (or `mixed` for a mixed batch); `count=1|3|5` is the selected batch size. `has_seed`, `has_avoid_words`, `with_title` are booleans. Actions add `result_source=starter|generated|shortlist|batch`; generation and batch copy add actual `result_count`. Sharing adds `share_method=native|clipboard`. The shared transport supplies `schema_version=1`, `environment`, `is_test`, and query-free page fields.

No seed, avoid text, name, recipe ID, shortlist text, new user ID or new session ID is an analytics field. Per-result metadata uses that result's style/length/seed/title; mixed shortlist copy describes actual items, not the currently selected filter. `has_avoid_words` describes current filter context. QA uses the existing `qa_` convention; localhost is `local_preview`, `is_test=true`, and custom events are not dispatched to GA there.

Initial examples, restoring state, applying filters, exhausting a pool, and starting a fresh round emit no generation event. A restored generated result retains its generated source; a new same-visit generation must be established by event order, not inferred from that source value alone.

### Trustworthy funnel

Use an ordered funnel within the same available anonymous GA session and same `tool_type`: page visit → accepted `generate_start` → `generate_success` → at least one successful copy/save/share after that success. Segment generated-result or batch actions; report starter/shortlist actions separately. Count distinct qualifying sessions, or clearly label action counts. Exclude `is_test=true`, nonproduction `environment`, and QA-prefixed events when supported by the export/report; do not change GA production filters. If parameters are not registered or session-level sequence data is unavailable, report only raw event counts with that limitation. Never divide independent event user counts and call the result cohort conversion. Do not equate prepared results with visible results or real growth.

## Discovery and scope

Both pages are index/follow with self canonical, WebApplication JSON-LD, en/x-default alternates, complete SSR collections, home/writing entry links, and reciprocal context links. Sitemap and IndexNow URL inventory include both pages; no IndexNow submission was made by this work. No advertising or replay whitelist was expanded.

## Local verification

`node scripts/name-generators-regression.mjs` checks corpus, actual filters, finite rounds, normalization, persistence, privacy and route ownership. `scripts/name-generators-browser.mjs` accepts `NAME_TOOLS_BASE_URL` on localhost only and `NAME_TOOLS_EVIDENCE`; it uses isolated Chromium, blocks all external/API/non-GET traffic, and mocks clipboard/share/storage. `PLAYWRIGHT_MODULE` may reference an existing local Playwright install. No paid dependency is needed by the product.

Run the repository lint, TypeScript check, build, existing regression scripts and `scripts/seo-audit.mjs` as well. Browser evidence covers mobile and desktop, 200% font sizing, actual generation/filtering, copy/share errors and cancellation, shortlist persistence, return restoration, blocked/corrupt storage, finite pools and anonymous event boundaries. Native Safari/iOS share sheets, production discovery and real usage remain separate acceptance steps after explicit publishing approval.
