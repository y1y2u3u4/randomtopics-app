# Topic costs and selected-topic activation — 2026-09-28

Ordinary English topic draws previously called Gemini 2.5 Flash for every request,
including topic acquisition before the first speech practice. English and Spanish
now draw locally from their existing collections. The legacy POST endpoint uses the
same curated English corpus with bounded, validated filters and no model call.
Direct callers and old tabs cannot bypass this cost policy.

Each matching pool is exhausted before repeating within the open component. A batch
never contains duplicate IDs. Empty category/depth combinations are disabled;
changing mode/category can clear incompatible filters with a visible explanation.
The UI reports actual matching counts and clamps the displayed batch to that pool.
Reviewed existing prompts received writing/icebreaker tags to fill six previously empty
mode/category pools, so fixed category pages remain usable. Topic text and IDs stay
unchanged. Claims of unlimited AI-generated novelty have been removed from product copy and
structured metadata. The corpus is finite (512 English topics at this release).

`generate_success` retains its meaning of a completed draw, with
`result_source=curated_pool` (English) or `localized_pool` (Spanish),
`generation_policy=curated_v1` and `provider_requests=0`. These are usage events,
not payments. Historical generations must not be relabeled or retroactively assigned
zero cost. No topic text enters analytics.

The selected-topic handoff from home and the wheel now offers the existing speech
coach with exactly the chosen topic, alongside the timer. Opening practice does not
record, upload, or invoke a model. The timer bridge uses the same source and topic.
`handoff_home` and `handoff_wheel` are closed attribution values retained in existing
speech telemetry, stored attempts, checkout intent, and private server reports.
They become eligible only after this release, and must not be compared against the
prior three-page exposure cohort as though the population were unchanged.
QA navigation carries both usage and speech QA flags, including without `measure=1`.

Personal transcription/feedback models, quality checks, quota reservations, billing
and email verification are unchanged. Known stored speech costs now appear in the
private analytics dashboard and owner-only report job, separated into explicit QA,
explicit non-QA, and unclassified records. Provider retries and earlier feedback
versions are counted; operations without saved usage are explicitly excluded.
Failed response diagnostics now retain only validated numeric USD cost alongside
existing safe token metadata. This is not a complete OpenRouter ledger.

Validation: topic API/corpus regression (all 408 filter combinations), actual English
component completion with no network and same-tick double-click protection, growth,
speech, handoff regressions, TypeScript, lint, build, and Chrome selected-topic flow.
No live model generation, email, or payment is necessary to validate these changes.
