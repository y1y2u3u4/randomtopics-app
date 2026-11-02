# CTR titles, 2026-11-02

**Goal:** the November steward dispatch asks to lift CTR on the 19 tracked pages that rank 5–9, from 1.86% toward 6%. The whole site averages 5.70%.

**What changed:**
- Only `<title>`, the meta description, and their Open Graph copies.
- H1, intro, FAQ, body and URLs are unchanged.
- Every existing selling point is kept (counts, meanings, kanji, pictures, timer).

**Skipped:** 5 of the 19 pages, whose titles changed between 10/19 and 10/21 and are still being observed:
- `/charades`
- `/conversation`
- `/writing`
- `/topics/ethical-dilemma-questions`
- `/topics/two-truths-and-a-lie-ideas`

**Method:** each new title leads with the page's highest-impression query that the old title did not match word for word (GSC, 10/05–11/01).

## Baseline (GSC, 10/05–11/01, 28 days)

| Page | Clicks | Impressions | CTR | Position |
|---|---|---|---|---|
| /japanese-name-generator | 351 | 25,414 | 1.38% | 7.6 |
| /random-animal-generator | 249 | 27,416 | 0.91% | 8.4 |
| /group-discussion-topics | 141 | 12,291 | 1.15% | 7.9 |
| /random-character-generator | 232 | 12,137 | 1.91% | 8.2 |
| /question-generator | 277 | 8,748 | 3.17% | 7.6 |
| /last-name-generator | 194 | 12,190 | 1.59% | 8.3 |
| /topics/toastmasters-table-topics | 241 | 8,436 | 2.86% | 8.6 |
| /es/topics/conversation-starters-for-couples | 350 | 26,869 | 1.30% | 6.6 |
| /es/conversation | 192 | 18,809 | 1.02% | 5.6 |
| /es/topics/controversial-topics-to-discuss | 150 | 13,973 | 1.07% | 7.1 |
| /es/topics/public-speaking-topics-for-beginners | 242 | 11,016 | 2.20% | 5.8 |
| /es/topics/conversation-topics-for-teens | 165 | 10,188 | 1.62% | 6.6 |
| /es/topics/couples-game-night-questions | 256 | 9,636 | 2.66% | 7.9 |
| /es/topics/debate-topics-for-students | 61 | 6,210 | 0.98% | 9.3 |
| **14 pages** | **3,101** | **203,333** | **1.53%** | |

## Old → new titles

| Page | Old title | New title | Query it targets |
|---|---|---|---|
| /japanese-name-generator | Japanese Name Generator: 387 Real Names, Kanji & Meanings | Japanese Name Generator with Meanings: 387 Names in Kanji | "japanese name generator with meanings" (high CTR); "random japanese name generator" |
| /random-animal-generator | Random Animal Generator: 383 Animals With Pictures & Facts | Random Animal Generator: 383 Random Animals With Pictures | "give me a random animal" (3.8k impressions, 0.1% CTR); "random animal" |
| /group-discussion-topics | 100+ Group Discussion Topics for 2026 \| Random Topics | GD Topics 2026: 100+ Current Group Discussion Topics | "gd topics"; "current gd topics" |
| /random-character-generator | Random Character Generator — Name, Personality, Secret & More | Random Character Generator: Free Traits, Backstory & Secrets | "random character generator" (5.2k impressions) |
| /question-generator | Random Question Generator — 500+ Questions to Ask Anyone | Random Question Generator: 500+ Questions to Ask Friends | the "…for friends" variants (high CTR) |
| /last-name-generator | Last Name Generator — Random Surnames by Origin, with Meanings | Random Last Name Generator: Surnames with Meanings & Origin | "random last name"; "surname generator"; "…with meanings" (14.6% CTR) |
| /topics/toastmasters-table-topics | 120 Toastmasters Table Topics Questions + Random Timer | 120 Table Topics Questions for Toastmasters + Random Timer | "table topics questions" |
| /es/topics/conversation-starters-for-couples | Temas para Hablar con tu Pareja: 60 Temas Profundos y Divertidos | Temas de Conversación con tu Pareja o Novia: 60 Ideas | "temas de conversacion" (2.4k impressions); "con mi novia" |
| /es/conversation | Temas de Conversación: 300+ Temas para Hablar (Generador Random) | Temas de Conversación: 320 Temas para Hablar o por Chat | "temas de conversación" (3.8k impressions, 0.6% CTR); "temas de conversación por chat" |
| /es/topics/controversial-topics-to-discuss | 55 Temas Polémicos y Controversiales para Debatir (2026) | Temas Polémicos y Controversiales para Debatir: 55 Ideas | "temas polemicos" leads the title |
| /es/topics/public-speaking-topics-for-beginners | 45 Temas para Oratoria Fáciles e Interesantes \| RandomTopics | 45 Temas de Oratoria Fáciles e Interesantes para Exponer | "temas de oratoria" |
| /es/topics/conversation-topics-for-teens | 50 Temas para Adolescentes: Hablar y Debatir \| RandomTopics | Temas para Hablar con Adolescentes: 50 Ideas y Debates | "temas para hablar con adolescentes" |
| /es/topics/couples-game-night-questions | 60 preguntas para una noche de juegos en pareja y una cita divertida \| RandomTopics | Juego de Preguntas para Parejas: 60 Preguntas Divertidas | "preguntas para parejas juego" (1.4k impressions); "juego de preguntas para parejas" |
| /es/topics/debate-topics-for-students | Los 75 mejores temas de debate para estudiantes en 2026 \| RandomTopics | Temas de Debate para Estudiantes: 75 Ideas Interesantes 2026 | "temas de debate" (student page, no ads) |

**Descriptions:** each one now opens with the same query phrase. The rest of the copy (selling points) is unchanged.

**Titles are 52–60 characters.** In `scripts/seo-audit.mjs`, `titleHas` was updated to match the new titles. `titleMax` was not changed.

## Recheck
- **2026-11-16** (14 days):
  - CTR per page and for the 14-page group.
  - Position must not drop more than 1.0.
- **2026-11-23** (21 days): the final decision.
- **Roll back** any page whose CTR falls below its baseline while its position holds.
