# /decision-maker — launch notes (2026-10-24)

Source: steward dispatch (newpipe dispatch-queue.md, /decision-maker). Signal: Similarweb weekly visits 85 → 1,646; easydecisionmaker.com ~2,337 clicks, justdecideapp.com ~384.
Phrasings targeted: decision maker / random decision maker / decision maker wheel / yes or no decision maker / help me decide / make a decision for me.

## Competitors (first screen, 1440×757)

| | easydecisionmaker.com | justdecideapp.com | wheeldecide.com | randomtopics.app/decision-maker |
|---|---|---|---|---|
| Look | Plain Bootstrap form, blue header | Blank white page, 3 instructions | Black page, rainbow canvas wheel | Dark site theme, cream/gouache palette, custom SVG wheel |
| Modes | One “Answer” | Shuffle a list | Wheel only | Wheel + Draw lots + Yes/no in one tool |
| Weights | No | No | Paid / login | ×1 / ×2 / ×3 per option, slice size matches |
| No-repeat | No | No | Remove-winner option | “No repeats” lots until the cup is empty |
| Starter lists | No | “Load a list” | Wheel gallery | 6 presets (dinner, movie, weekend, chores, workout, date) |
| Daily hook | No | No | No | Decision of the day (same for everyone) |
| Share | No | No | Saving needs login | 1080 result card (PNG/share) + link that reopens the same options |
| History | No | No | Login | Last 6 decisions, in this browser only |

Where we win: three modes in one, weights, no-repeat lots, presets, daily question, share card + link, no login. Side-by-side first-screen screenshot attached to the steward report.

## Implementation
- `src/components/generators/DecisionMaker.tsx` (client), data in `src/data/decisionMaker.ts`, page `src/app/decision-maker/page.tsx` on `GeneratorPageShell` (FAQ schema, WebApplication schema, In short, FactTable).
- Primary button sits next to the question input; hero image is hidden on viewports ≤900px tall (`heroHideOnShort`) so the tool is usable on the first screen.
- Wheel coordinates are rounded to 2 decimals (server/client float mismatch caused a hydration error).
- Art: ChatGPT web gouache illustration → `public/og/decision-maker.jpg` + `public/generators/hero/decide.webp`.

## Ads
AdSense only, no paywall. Added to `ADSENSE_RESULT_PATHS` (result unit under the tool) and `adPublicPaths.json`.

## Events
`tool_type: "decision_maker"`: generate_start, generate_success, copy_result, share_result, decision_mode_select, decision_list_load, decision_link_open.

## Locales
EN only for now (`EN_ONLY_PATHS`), like /random-name-picker and the other newer pickers. Revisit es/pt once GSC shows EN impressions.

## Cross-links
/spin-the-wheel and /random-name-picker link here (body sentence; name picker also in Related). Registry (crossLinkOnly), relatedTools, sitemap, llms.txt updated.
