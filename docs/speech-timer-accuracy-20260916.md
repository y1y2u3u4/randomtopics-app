# Speech timer accuracy — September 16, 2026

The existing speech practice flow remains the focus; no new pages, titles,
metadata, or query ownership changes are introduced.

## Reproduced problem

The timer previously subtracted one second per browser callback. A controlled
test of the actual component delayed its first callback by six seconds: a
one-minute timer displayed 0:59 instead of 0:54. Background scheduling or a busy
page could therefore extend a practice session beyond its chosen duration.
This reproduction is a deterministic component test, not a measured incidence
rate among production users or a mobile-device test.

## Behavior

- Running timers use an absolute deadline and catch up after delayed callbacks.
- Visibility changes refresh the display, including completion after expiry.
- Pausing preserves fractional remaining time; paused time is excluded.
- Completion is emitted once per run, including a pause clicked after expiry.
- Reset, presets, restart, and unmount cancel the previous run appropriately.
- Existing one/two/three/five-minute choices, translations, and Toastmasters
  green/yellow/red cues remain unchanged. No new events or private data are sent.

## Verification and observation

`scripts/speech-timer-regression.mjs` runs the actual component with a controlled
clock and delayed callbacks. It covers catch-up, precise pause/resume, visibility
refresh, single completion, reset, restart, presets, timing cues, and cleanup.
It is included in `npm run growth:test`.

Release gates include lint, production build/TypeScript, the existing SEO audit,
and public-domain timer interactions. Record actual results in the PR. Preview
authentication and inaccessible provider logs must not be represented as tested.

This release fixes timing correctness; it does not establish a traffic or
conversion lift. Continue the existing title observation windows and evaluate
practice usage only after complete post-release reporting periods. Timer event
counts alone are not an ordered user funnel or evidence of spoken participation.
