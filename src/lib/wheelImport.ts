// Hand-written CSV/TXT import for the wheel (no parsing library). Client-side only:
// the file never leaves the browser. Loaded on demand, only after a file is chosen.

export interface WheelImport { names: string[]; weights: Record<string, number> }

/** Split one CSV line into cells, honouring "quoted, cells" and "" escapes. */
export function splitCsvLine(line: string, delim: string): string[] {
  const out: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"') { if (line[i + 1] === '"') { cell += '"'; i++; } else quoted = false; }
      else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === delim) { out.push(cell); cell = ""; }
    else cell += ch;
  }
  out.push(cell);
  return out.map((c) => c.trim());
}

/**
 * Read names (first column) and an optional numeric weight (second column) from
 * CSV or TXT text. A header row such as "name,weight" is skipped.
 */
export function parseWheelFile(text: string, max = 200): WheelImport {
  const lines = text.replace(/^﻿/, "").split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const delim = lines.some((l) => l.includes("\t")) ? "\t" : lines.some((l) => l.includes(";") && !l.includes(",")) ? ";" : ",";
  const rows = lines.map((l) => splitCsvLine(l, delim));
  const first = rows[0]?.[0]?.toLowerCase() ?? "";
  const hasHeader = rows.length > 1 && /^(names?|entries|entry|student|students|label|item|items|option|options|participant|participants)$/.test(first);
  const body = hasHeader ? rows.slice(1) : rows;
  const names: string[] = [];
  const weights: Record<string, number> = {};
  for (const row of body) {
    const name = (row[0] ?? "").replace(/^\s*(?:\d+[.)]|[-*•])\s+/, "").trim();
    if (!name) continue;
    names.push(name);
    const w = Number(row[1]);
    if (row.length > 1 && Number.isFinite(w) && w >= 1) weights[name] = Math.min(100, Math.round(w));
    if (names.length >= max) break;
  }
  return { names, weights };
}
