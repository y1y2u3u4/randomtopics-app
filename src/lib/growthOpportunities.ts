/** Editorial routing rules, not proof that multiple search results compete. */
export const INTENT_OWNERS = [
  { match: /^(random )?writing topic generator$|^random topic generator to write about$/, path: "/writing-topic-generator" },
  { match: /^(random )?(speech|speak) topic (gen|generator)$/, path: "/speech" },
  { match: /^(qotd|question of the day|what is the question of the day|topic of the day)$/, path: "/question-of-the-day" },
  { match: /^(random )?topics? (generator )?to talk about$/, path: "/conversation" },
  { match: /^(random subject generator|give me a random subject)$/, path: "/random-subject-generator" },
  { match: /^(dilemmas|ethical dilemmas|moral dilemma|moral questions|ethical questions|debating ethical dilemmas)$/, path: "/topics/ethical-dilemma-questions" },
  { match: /^(preguntas )?quien es mas probable( que)?$/, path: "/es/topics/most-likely-to-questions" },
  { match: /^(good |funny )?(two|2) truths? and (a |1 )?lie (ideas|examples)( for (work|students|friends))?$/, path: "/topics/two-truths-and-a-lie-ideas" },
  { match: /^(random topic generator|give me (a )?(random )?topic|free topic)$/, path: "/" },
] as const;

// Editorial observation dates protect recent releases from repeated rewrites.
const RECENT_REVISIONS: Record<string, string> = {
  "/topics/two-truths-and-a-lie-ideas": "2026-09-12",
  "/speech": "2026-09-04",
  "/writing": "2026-09-04",
  "/writing-topic-generator": "2026-09-04",
  "/topics/ethical-dilemma-questions": "2026-09-04",
  "/topics/toastmasters-table-topics": "2026-09-04",
  "/5-minute-speech-topics": "2026-09-01",
  "/funny-question-of-the-day": "2026-09-01",
};

export function inObservationWindow(path: string, date: string): boolean {
  const changed = RECENT_REVISIONS[path];
  if (!changed) return false;
  const elapsed = (Date.parse(date) - Date.parse(changed)) / 86_400_000;
  return elapsed < 14;
}

export function normalizeQuery(query: string): string {
  return query.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().trim().replace(/[.?!]+$/, "").replace(/\s+/g, " ");
}

export function queryNoiseReason(query: string): string | null {
  const value = query.trim();
  if (!value || value === "(not set)") return "empty_query";
  if (value.length > 240 || value.split(/\s+/u).length > 40) return "oversized_query";
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/u.test(value)) return "control_characters";
  // Require instruction syntax, not just a word such as "prompt" or "AI".
  if (/\b(ignore (all |the )?(previous|prior) instructions|system prompt|output (only )?(valid )?json|you are (an? )?(expert|assistant))\b/i.test(value)) return "instruction_query";
  return null;
}

export function normalizePage(value: string): string {
  try { return new URL(value).pathname.replace(/\/$/, "") || "/"; }
  catch { return value.split(/[?#]/)[0].replace(/\/$/, "") || "/"; }
}

type QueryPageRow = {
  query: string; page: string; clicks: number; impressions: number; ctr: number; position: number;
};
export type ReportRange = { startDate: string; endDate: string };

export function buildQueryOpportunities(rows: QueryPageRow[], range: ReportRange) {
  const clean = rows.filter((row) => !queryNoiseReason(row.query));
  const excludedRows = rows.length - clean.length;
  const pagesByQuery = new Map<string, Set<string>>();
  for (const row of clean) {
    const key = normalizeQuery(row.query);
    const pages = pagesByQuery.get(key) ?? new Set<string>();
    pages.add(normalizePage(row.page));
    pagesByQuery.set(key, pages);
  }
  const candidates = clean.filter((row) => row.impressions >= 50 && row.position >= 5 && row.position <= 20 && row.ctr < 0.05)
    .map((row) => ({ row, score: Math.round(row.impressions * (0.05 - row.ctr) * Math.max(0.2, (21 - row.position) / 16) * 100) / 100 }))
    .sort((a, b) => b.score - a.score).slice(0, 200);
  const values = candidates.map(({ row, score }) => {
    const query = normalizeQuery(row.query);
    const page = normalizePage(row.page);
    const owner = INTENT_OWNERS.find((rule) => rule.match.test(query))?.path;
    const multiPage = (pagesByQuery.get(query)?.size ?? 0) > 1;
    const held = inObservationWindow(owner ?? page, range.endDate);
    const offOwner = owner && owner !== page;
    return [range.endDate, row.query, page, row.clicks, row.impressions, row.ctr, row.position, score,
      owner ? "Existing intent" : "Review",
      held ? "Observe recent release; verify query ownership before another rewrite"
        : offOwner ? "Review owner alignment and contextual links; do not create another URL"
          : owner ? "Optimize the existing owner after checking query intent"
            : "Review intent and existing pages before deciding optimize or create",
      held ? "Observe" : "Candidate",
      multiPage ? "Multiple URLs are visible; sitelinks may explain this. Do not sum impressions or assume cannibalization."
        : "CTR threshold is a discovery filter, not a forecast or a build decision.",
      "Last complete 28 days", range.startDate, range.endDate, owner ?? "Unassigned — review required",
      offOwner ? "Non-owner visible — review" : owner ? "Owner visible" : "Unassigned",
    ];
  });
  if (!values.length) values.push([range.endDate, "No qualifying query", "", 0, 0, 0, 0, 0, "Review", "Observe until more relevant data accrues", "Observe", "No eligible queries after quality filtering.", "Last complete 28 days", range.startDate, range.endDate, "", ""]);
  return { values, excludedRows };
}
