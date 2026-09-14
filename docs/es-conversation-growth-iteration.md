# Spanish conversation: useful answers on the existing owner

## Release scope

September 14, 2026: follow the reporting prerequisite in PR #29 with one existing-page content experiment on `/es/conversation`. No new indexable routes. No changes to the existing title, canonical, hreflang, or other pages' title windows.

The broad Spanish conversation-topic intent belongs to this page. Specific couples, teenagers, language-practice, party, and debate intents keep their existing collection pages. Exact broad-query routing is now explicit in the opportunity report; it does not claim that other visible URLs cause cannibalization.

## Page brief

People looking for something to talk about can either use the existing 320-topic random generator or jump directly from the hero to 12 editorial questions. Each question has two original follow-ups, copy/save/share actions, and group-message copy. The examples are separate from the generator pool and do not add to its stated count. All questions and follow-ups are rendered as HTML, including the contents of native disclosure elements. The existing collection section has a direct hero anchor for choosing a group or situation.

Examples use `isPostGenerate=false`, the `editorial_card` surface, and `es_conversation_examples` content source. They must never emit generation success or strict post-generate action events. Copy payload and saved topic include both follow-ups. Analytics must not include prompt text or URL query strings.

## Observation

Hold this page's content and description experiment through September 28 unless a functional defect requires repair. Protect the pre-existing September 18 and September 26 title windows elsewhere. The private Sheet contains demand evidence; private metrics and queries are not stored in the repository.

After release, first verify public generation/filtering, the hero anchors, all 12 crawlable cards, expanded copy payloads, saved readback, share/fallback behavior, and SEO audit. Keep release QA traffic in mind when interpreting small samples.

Then compare source-specific complete seven-day periods, distinguishing GSC's latest complete date from GA4's. Track broad-query ownership, impressions, position and CTR together. Split editorial `copy_result` actions from strict generated actions. The current report does not isolate example-card events by content source, so a page-wide copy increase alone is not evidence that these cards caused it. Use event-level data when available; otherwise disclose that gap. A successful deployment is not proof of traffic growth.

## Ordered follow-up queue

1. Confirm the next successful Sheets refresh uses PR #29's aggregation and investigate anomalous URL rows before attributing losses.
2. Observe Spanish conversation search and useful-action metrics; avoid another immediate rewrite.
3. Evaluate QOTD's existing weekly-plan entrances and Spanish discussion-card discovery with sufficient post-release data.
4. Keep speech and existing child pages in their observation windows. Research relevant distribution channels before any external posting; this release authorizes no outbound messages.
