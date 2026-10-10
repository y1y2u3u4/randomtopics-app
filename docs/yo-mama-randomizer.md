# Yo Mama Randomizer: intent, behavior and release checks

This is a user-requested new-keyword experiment. GSC demand, search volume and keyword difficulty for this cluster are unknown. Public search research indicates a mixture of text-joke and video-meme intent; this page explicitly serves original text jokes and text remixing. It makes no traffic or ranking promise.

| Priority | Intent | Owner / action | Evidence and boundary |
| --- | --- | --- | --- |
| 1 | Yo mama randomizer; yo momma randomizer; yo mama joke generator | Create `/yo-mama-randomizer` | Explicit user request; distinct text-output task; no existing dedicated route |
| — | Viral video/animation randomizer | Not offered | Page explains text-only output and no official affiliation with video channels |
| Existing | Funny conversation topics | Keep `/funny` | Conversation prompts remain its role; add a contextual tool link |
| Existing | Funny question of the day | Keep `/funny-question-of-the-day` | Daily question and planning role stays separate |

One canonical English URL covers spelling variants. No parallel synonym or untranslated Spanish route is created. Homepage → new tool and `/funny` → new tool links accompany the tool's links back to the hub and relevant daily-question/game pages. Existing hub titles, canonicals and redirects are unchanged.

## Page brief and content

- Audience: people who want a quick lighthearted text joke or deliberately absurd remix to read or copy.
- Clean is the default: 72 authored complete jokes, six themes with 12 each.
- Remix uses 24 authored setups and 24 authored endings: 576 unique pairs across all themes; 16 pairs within each theme. New setup keeps the ending; New ending keeps the setup. These are real independently selectable parts, not a second label for the clean-joke list.
- The complete 72-line collection and all 48 remix parts are server rendered. Counts derive from the actual corpus. Editorial checks cover exact internal duplicates, full-line overlap with existing collections, readable template composition and friendly subject matter. This does not establish global internet uniqueness.
- No jokes are fetched from competitor feeds. No external AI generation, voice imitation, video material, signup or payment is involved. Familiar comic formats and accidental similarity remain possible.
- The tool remembers seen IDs in component memory for this visit. Theme changes preserve history. Explicit new round resets only the selected style; reload resets both. A remix part may recur in a new pair, but a complete pair cannot recur until an explicit reset after eligible exhaustion.
- Clipboard and share use the existing result-action component. Failure exposes the exact selectable result; regenerating removes the old manual-copy text. Cancelling share does not count as success or failure.

## Measurement

Reuse `generate_start`, `generate_success`, `filter_change`, `copy_result`, `copy_error`, `share_result`, `share_error` and strict `post_generate_*` actions. Generated-result exposure keeps the existing qualified one-second rule and `exposure_rule=visible_1s`. The initial starter is not a generation or strict generated-action result.

Closed parameters include `tool_type=yo_mama_randomizer`, `content_source=yo_mama_randomizer`, `result_type=joke`, output style, theme and generation action. Result-action surfaces distinguish `yo_mama_clean_result` and `yo_mama_remix_result`. No joke text, fragment IDs, generated pair IDs or user input is sent to analytics. Existing QA/environment fields and consent behavior stay in place; Clarity remains on its existing allowlist.

## Verification and growth observation

- Data regression: all 72/576 full cycles, six real filters, exhausted pool behavior, cross-filter history, fixed-part remix, source overlap and one-URL ownership.
- Browser regression: desktop/mobile clean default, keyboard focus, complete corpus, copy success/failure, share cancellation, qualified exposure, private QA payloads, theme exhaustion, partial remix and refresh boundary. External analytics and all business API traffic are blocked during testing.
- Release: lint, type checking, build, existing regression suite, SEO audit, sitemap/IndexNow inventory parity, full server-rendered collection, protected deployment preview, then production interactions and deployment-to-commit checks.
- Technical acceptance and growth acceptance are separate. Keep intent/title stable for 7–14 days unless technically wrong. At 2–7 days review discovery and relevant query assignment; at 7–14 days review early impressions and use; at 28 days assess clicks and useful actions on complete comparable windows. None is proven on launch day.

The existing Speech Daily v2 writer, its next scheduled first write, billing/login flows and previously released tools are outside this patch.
