# Charades: complete deck and actor-ready rounds — 2026-09-21

## Decision and ownership

Optimize the existing `/charades` owner of charades generator, word-list and
random-charades intent. The private full-site report supplies search and usage
evidence; raw queries, traffic values and credentials are not stored here.
Keep the current title, URL, canonical, locale and index policy. Add no routes.

Priority review: QOTD remains under its September 17 observation window; speech
has newly shipped entry improvements. Spanish party pages continue observation.
Charades has a verified empty-filter dead end (Kids & Family + Hard, or Sports
& Games + Hard), a timer that starts before the actor is ready, and only sample
lists despite a larger real deck. Address this coherent group first.

## Page brief

- Audience: a family, classroom or party host and the next actor.
- Corpus: the existing 528 unique words across nine categories, no padding.
- Output: one unseen word, category and editorial difficulty.
- Preparation: deal, read, hide/reveal, then start when ready. Starting hides the
  word. The screen is for the actor; this is not a heads-up game mode.
- Timer: 30/60/90/120 seconds or Off; pause/resume/reset/restart. Deadline-based
  timing catches up after delayed callbacks or a backgrounded tab. No audio.
- Filters apply to the next draw and retain the current word, timer and seen-word
  history. Unavailable difficulty buttons are disabled; crossing categories into
  an empty combination offers an explicit Any-difficulty recovery.
- Actions: print the actual filtered deck with difficulty labels; hide printing
  when the deck is empty. Existing print failure telemetry remains unchanged.
- Content: complete server-rendered expandable lists, nine short acting guides,
  accurate counts, category navigation and return links. Existing game-night
  sibling links retained. FAQ and visible rules match the revised timer flow.
- Save/share/copy were not part of this game and are not added to inflate usage.

## Measurement

Keep generate_start/success for explicit draws only; repeat_generate for later
words. timer_start and timer_resume are distinct; timer_complete fires once at
expiry and is not a correct guess or proof of real-world participation. Add
charades_word_hide/reveal and timer_pause/reset. No word or personal answer text
is transmitted in these events. The existing all-site GA4 Actions report reads
all events by page, so no fixed-column migration is required. New event ingestion
must be checked after the next complete reporting day; production QA is not
organic adoption. Historic automatic-timer completion rates are not comparable
to the new explicit-start completion rates without separating release periods.

## Validation

Automated: execute the real component with a controlled clock to cover empty
recovery, no-repeat exhaustion, filter history, word hiding, explicit starts,
fractional pause, delayed callbacks, background return, completion once, changes
to timer presets, Next Word cancellation, filtered print data and unmount cleanup.
Run growth regression, lint, TypeScript/production build and SEO audit. SEO audit
requires 528 HTML word entries, canonical and indexability, unchanged title and
no obsolete auto-start instructions. Review React hooks, keyboard controls,
pressed states, timer announcements and mobile layout.

Preview: use GitHub deployment status; protected previews are not bypassed.
Production: verify the same affected workflow on the public domain, print output,
word count and metadata. Record actual outcome in the PR, including limitations.
If a serious regression occurs, revert this change through the same integration.

## Observation

This is implementation work, not demonstrated growth. Keep this description and
content iteration stable through October 5, 2026 unless a defect requires repair.
At 2–7 days check event availability and relevant query ownership; at 7–14 days
check impressions and usage, with separate GSC/GA4 cutoffs. At 28 days compare
clicks and useful actions with the previous complete window. Report ordered
conversion only if a real ordered user funnel is available.
