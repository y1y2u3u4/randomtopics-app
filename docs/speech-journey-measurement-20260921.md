# Speech journey measurement

The owner's report described no events in a recent window as “未记录”. First
attempt, transcription, feedback success/failure/view, and Checkout redirect
were already instrumented. The report now lists every journey stage, including
zero counts, and distinguishes an empty successful query from an unavailable
report. A zero is not evidence that a handler is missing, that a feature is
broken, or that there is no demand. New events cannot backfill earlier visits.

Additional signals:

| Event | Definition |
| --- | --- |
| `speech_record_controls_view` | Usable recording button at least half visible in a focused foreground tab continuously for one second; once per first/retry phase in the mounted coach. No click synthesizes exposure. |
| `speech_upload_open` | File-input activation. Does not imply a file was chosen or the browser accepted the chooser request. |
| `speech_upload_cancel` | Native input `cancel` event. No attempt or audio-ready event is fabricated. Requires browser support for this event. |
| `speech_coach_hide` | User collapses an open practice panel. Returning keeps its separate event. |
| `speech_checkout_email_required` | Subscribe intent from an unverified account, prompting email verification. Does not call Checkout. |
| `speech_checkout_request` | Verified account invokes the Checkout client flow. Separate from subscribe intent and the eventual redirect or error. |

The file input is cleared after each selection, so re-selecting the same file
remains a real selection. Cancel handling uses a native listener with cleanup;
React's current input props do not expose this event. Reference:
[MDN input cancel](https://developer.mozilla.org/en-US/docs/Web/API/HTMLInputElement/cancel_event).

Existing event definitions are preserved. Additive ordered funnels show first
attempt → audio ready → transcription → feedback generation → actual feedback
view, and subscribe intent → Checkout request → redirect. GA user funnels can
span sessions and attempts; they are not per-recording failure rates. The coverage
table contains independent event counts, not conversion rates. QA names are
disjoint from natural traffic. Production QA can inspect dispatched events with
`/speech?speech_qa=1&measure=1`; GA receipt must be checked independently.

No speech content, filenames, email addresses, auth IDs, attempt IDs, or Checkout
URLs are added to analytics. Payment completion still requires the existing
server-verified paid receipt and attribution checks, never a return URL alone.

Validation before release: speech and billing regression suites, coverage/QA/null
report cases, continuous exposure observer cases, TypeScript and lint. Deployment
and actual browser/GA receipt evidence are recorded in the owner's follow-up
report, with browser, backend, and prior sandbox results kept distinct.

The production browser check also exposed a lazy-load scroll timing problem:
the entry scrolled a small loading placeholder into view, then the real recording
controls mounted below the viewport. The coach now reveals and focuses the actual
recording action after mounting (or returning to its ready stage), without starting
the microphone. The animation frame is canceled on hide/unmount. This is a
reproduced usability issue, not proof of why every earlier visitor left.
