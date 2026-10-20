# CTR title changes — 2026-10-21

Traffic push 10/21. URLs, core content and ad settings unchanged; /charades title intentionally kept.

**Re-check: 2026-11-04** in GSC (28-day compare vs. the 28 days before 10/21), per page:
CTR and clicks. If CTR drops at similar average position, revert that page's title to the
"Old" value below (single-line change). Keep the rest.

## Title changes

| Page | Old title | New title |
|---|---|---|
| /question-of-the-day | Question of the Day: Today's QOTD + 120 Question Ideas | Question of the Day for {Month D} + 120 QOTD Ideas (date refreshes hourly via ISR) |
| /conversation | Random Conversation Generator: 300+ Topics to Talk About | Random Conversation Generator: 320 Topics to Talk About (2026) |
| /topics/ethical-dilemma-questions | Ethical Dilemma Questions: 65+ Moral Dilemmas to Discuss | Ethical Dilemma Questions: 66 Moral Dilemmas to Discuss (2026) |
| /speech | Speech Topic Generator: 290+ Topics & Practice Timer (Free) | Speech Topic Generator: 296 Topics & Practice Timer (2026) |
| /debate | Debate Topic Generator: 300+ Random Debate Topics (Free) | Debate Topic Generator: 308 Random Debate Topics (2026) |
| /random-subject-generator | Random Subject Generator — Free Subject Picker \| Random Topics | Random Subject Generator: Pick From 16 School Subjects (2026) |
| /hot-seat-questions | Hot Seat Questions — Spicy (but Clean) Questions to Ask Friends (+ template suffix) | 75 Hot Seat Questions to Ask Friends: Spicy but Clean (2026) |
| /es | Generador de Temas Aleatorios \| Más de 500 Ideas Gratis | Generador de Temas Aleatorios: Más de 500 Ideas Gratis (2026) |
| /es/most-likely-to | Preguntas de Quién Es Más Probable — Generador Gratis \| Random Topics | Preguntas de Quién Es Más Probable: Generador Gratis (2026) |
| /categories/* | Random {Label} Topics - {Label} Discussion Ideas & Prompts (+ suffix) | Random {Label} Topics: {count} Discussion Ideas & Prompts (2026) |

/topics/two-truths-and-a-lie-ideas: title kept (pinned by scripts/two-truths-regression.mjs); freshness + internal links only.

Declining pages also got a freshness line and extra internal links (see PR diff).

## New localized pages (two-way hreflang)

Spanish:
- /es/hot-seat-questions ↔ /hot-seat-questions
- /es/question-of-the-day ↔ /question-of-the-day
- /es/random-subject-generator ↔ /random-subject-generator

Portuguese (pt-BR, no ad slots):
- /pt/temas-para-conversar ↔ /conversation
- /pt/temas-para-debate ↔ /debate
- /pt/temas-para-apresentacao ↔ /speech
- /pt/pergunta-do-dia ↔ /question-of-the-day
- /pt/gerador-de-materias-aleatorias ↔ /random-subject-generator

The EN home deliberately has no pt alternate (home CLS frozen until 10/26).

## Note

/tiles 33→0 clicks: ghost URL that 404s, no page ever existed in the app — no action.
