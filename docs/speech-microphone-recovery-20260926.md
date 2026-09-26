# Microphone permission recovery

The practice panel previously had no way to leave a pending microphone request. Hiding and reopening the panel left it waiting until the browser eventually answered. Permission denial also focused the record button while the explanation and upload alternative could be below the viewport.

## Behavior

- A waiting request offers **Cancel waiting · use an audio file**. This releases the panel and focuses its file input without uploading or opening the microphone.
- Denial and recording errors bring the explanation into view, with a direct **Choose an audio file** action. Recording remains available if the user fixes their browser permission.
- Hiding the panel or backgrounding the tab abandons a pending request. Unmounting also invalidates it.
- Browser permission requests cannot be aborted by the page. A late stream is stopped immediately; a late rejection is ignored. Neither can overwrite a chosen file, reset a submitted request, stop a newer recording, or release a newer operation's busy state.
- Recording and file selection still require an explicit **Get my feedback** action before sending audio. API, quotas, consent, authentication and payment rules are unchanged.

## Verification

`npm run speech:recording-browser` starts a loopback-only fixture page at `http://127.0.0.1:4687/?speech_qa=1`. Open it in the connected Chrome browser and choose **Run regression**. It renders the actual `SpeechCoach`, defers synthetic microphone results, and substitutes audio conversion, API calls and result rendering. It never accesses a physical microphone, real account, model, database or payment provider.

Seven browser scenarios cover cancellation followed by a late grant; an old denial during a newer recording; late permission during file submission; denial followed by file recovery; hiding/reopening; backgrounding; and unmounting. The fixture chain also checks explicit submission, no duplicate requests and QA telemetry. This verifies the changed browser state transitions, not model accuracy or commercial effect.

For comparison, `node scripts/speech-recording-browser.mjs --baseline=be95b2f` serves the previous component at port 4688. The original six-case run reproduced the missing cancellation/recovery controls and the stuck hide/reopen state (one passed, five failed). The final working-tree run passed all seven cases. At 390×844, the denied-permission explanation and its direct file action are visible and focused; browser warning/error logs were empty.

The speech and billing regression suites, TypeScript, focused ESLint and whitespace checks pass. Release/build evidence and production effect belong in the private task report.

## Measurement and remaining acceptance

- `speech_permission_cancel` records only a closed reason: `choose_upload`, `panel_hidden` or `tab_hidden`. QA uses the existing `qa_` namespace.
- `permission_recovery` is an ordered funnel from permission denial through audio ready and submission to first feedback visible. The existing denial event permits a historical baseline.
- `permission_cancel_recovery` starts with the new cancellation event. Before release, this event was unavailable; its absence is not a historical zero.
- Compare Beijing-aligned windows around the actual production release, with independent event counts separate from ordered users. Report sampling/threshold flags. Do not add overlapping error/cancellation populations.
- [ ] Natural users recover from refusal or cancellation and reach feedback after this release.
- [ ] Observe whether entry click → submission improves without hurting feedback reliability; report sample sizes and uncertainty.
- [ ] Paid conversion remains a separate outcome. Browser fixtures and recovered free practice do not prove subscription demand or payment success.
