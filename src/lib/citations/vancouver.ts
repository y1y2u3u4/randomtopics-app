// Vancouver (ICMJE / NLM "Citing Medicine") formatter for /vancouver-citation-generator.
// Pure functions: a VSource in, plain strings out (Vancouver uses no italics or bold).
// Rules follow Citing Medicine, 2nd ed. (NLM) and the ICMJE Recommendations
// "Sample References": up to six authors then "et al.", initials without periods,
// abbreviated journal titles, "Year Mon Day;Vol(Issue):pages", shortened page ranges.
import { cleanText } from "./format";

export type VType = "journal" | "book" | "chapter" | "web" | "report" | "thesis";

/** A person. `initials` (PubMed style, e.g. "WF") wins over `given`. */
export interface VPerson { given: string; family: string; org?: boolean; initials?: string; suffix?: string }

export interface VSource {
  type: VType;
  authors: VPerson[];
  editors?: VPerson[];
  title: string;
  /** Journal (full name), book title for a chapter, or website/publisher for web pages. */
  container?: string;
  /** NLM journal abbreviation, e.g. "N Engl J Med". */
  abbrev?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  year?: string;
  /** 1-12 */
  month?: number;
  day?: number;
  edition?: string;
  publisher?: string;
  place?: string;
  doi?: string;
  pmid?: string;
  url?: string;
  /** ISO date (YYYY-MM-DD) the page was consulted. */
  accessed?: string;
  /** Report number, or thesis kind ("dissertation", "master's thesis"). */
  detail?: string;
}

export const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** ICMJE: list the first six authors followed by "et al." when there are seven or more. */
export const MAX_AUTHORS = 6;

/* --------------------------------- names --------------------------------- */

/** "Scott D." → "SD", "Jean-Paul" → "JP", "WF" → "WF", "B. Montgomery" → "BM". */
export function vInitials(given: string): string {
  return cleanText(given).split(/\s+/).filter(Boolean).map((tok) => {
    if (/^[A-Z]{2,4}$/.test(tok)) return tok; // already PubMed-style initials
    return tok.split("-").map((p) => p.replace(/[.’']/g, "")).filter(Boolean).map((p) => p[0].toUpperCase()).join("");
  }).join("");
}

export function vPerson(p: VPerson): string {
  const family = cleanText(p.family);
  if (p.org || (!p.given && !p.initials)) return family;
  const ini = p.initials ?? vInitials(p.given);
  return [family, ini, cleanText(p.suffix)].filter(Boolean).join(" ");
}

/** "Halpern SD, Ubel PA, et al." (no final period). */
function nameList(list: VPerson[]): string {
  const people = list.filter((p) => cleanText(p.family));
  const shown = people.slice(0, MAX_AUTHORS).map(vPerson);
  if (people.length > MAX_AUTHORS) shown.push("et al.");
  return shown.join(", ");
}

const withStop = (s: string) => (/[.?!]$/.test(s) ? s : `${s}.`);

/** Author block with its closing period, e.g. "Halpern SD, Ubel PA, Caplan AL." */
export function authorsBlock(list: VPerson[]): string {
  const s = nameList(list);
  return s ? withStop(s) : "";
}

function editorsBlock(list: VPerson[]): string {
  const people = list.filter((p) => cleanText(p.family));
  if (!people.length) return "";
  // "Vogelstein B, Kinzler KW, editors." / "Rose NR, et al., editors."
  return `${nameList(list)}, ${people.length === 1 ? "editor" : "editors"}.`;
}

/* --------------------------------- pages ---------------------------------- */

/**
 * NLM drops the repeated leading digits of the second page number:
 * 284-287 → 284-7, 123-128 → 123-8, 1203-1210 → 1203-10, 99-101 stays 99-101.
 * Ranges with letters (e1234, S12-S15), different lengths or a descending range are kept.
 */
export function shortenPages(raw?: string): string {
  const s = cleanText(raw).replace(/\s*[-‐‑–—]\s*/g, "-");
  const m = /^(\d+)-(\d+)$/.exec(s);
  if (!m) return s;
  const [, a, b] = m;
  if (a.length !== b.length || Number(b) <= Number(a)) return s;
  let i = 0;
  while (i < a.length - 1 && a[i] === b[i]) i++;
  return `${a}-${b.slice(i)}`;
}

/* --------------------------------- dates ---------------------------------- */

/** "2002 Jul 25", "2002 Jul", "2002". */
export function vDate(year?: string, month?: number, day?: number): string {
  const y = cleanText(year);
  if (!y) return "";
  if (!month || month < 1 || month > 12) return y;
  return `${y} ${MON[month - 1]}${day ? ` ${day}` : ""}`;
}

/** ISO date → "2026 Oct 28" (the "[cited …]" date). */
export function citedDate(iso?: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? "");
  return m ? `${m[1]} ${MON[Number(m[2]) - 1]} ${Number(m[3])}` : "";
}

const ordinalEd = (ed?: string) => {
  const n = cleanText(ed).replace(/\s*ed(ition)?\.?$/i, "");
  if (!n) return "";
  const digits = /^(\d+)(st|nd|rd|th)?$/i.exec(n);
  if (!digits) return `${n} ed.`;
  const v = Number(digits[1]), last2 = v % 100;
  const suffix = last2 >= 11 && last2 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[v % 10] ?? "th";
  return v === 1 ? "" : `${v}${suffix} ed.`; // a first edition is not stated
};

/* ------------------------- journal abbreviations -------------------------- */

// Well-known NLM abbreviations (from the NLM Catalog), used when none is typed.
// Keyed by lower-case full title; anything else must be looked up in the NLM Catalog.
const ABBREV_ENTRIES: [string, string][] = [
  ["The New England journal of medicine|New England Journal of Medicine", "N Engl J Med"],
  ["JAMA", "JAMA"], ["JAMA: the journal of the American Medical Association|Journal of the American Medical Association", "JAMA"],
  ["JAMA Internal Medicine", "JAMA Intern Med"], ["JAMA Pediatrics", "JAMA Pediatr"], ["JAMA Network Open", "JAMA Netw Open"],
  ["JAMA Oncology", "JAMA Oncol"], ["JAMA Psychiatry", "JAMA Psychiatry"], ["JAMA Surgery", "JAMA Surg"],
  ["The Lancet|Lancet", "Lancet"], ["The Lancet Oncology", "Lancet Oncol"], ["The Lancet Infectious Diseases", "Lancet Infect Dis"],
  ["The Lancet Neurology", "Lancet Neurol"], ["The Lancet Psychiatry", "Lancet Psychiatry"], ["The Lancet Public Health", "Lancet Public Health"],
  ["BMJ|British Medical Journal", "BMJ"], ["BMJ Open", "BMJ Open"], ["BMC Medicine", "BMC Med"], ["BMC Public Health", "BMC Public Health"],
  ["BMC Health Services Research", "BMC Health Serv Res"], ["BMC Cancer", "BMC Cancer"],
  ["Nature", "Nature"], ["Nature Medicine", "Nat Med"], ["Nature Genetics", "Nat Genet"], ["Nature Communications", "Nat Commun"],
  ["Nature Reviews Cancer", "Nat Rev Cancer"], ["Nature Reviews Immunology", "Nat Rev Immunol"], ["Nature Neuroscience", "Nat Neurosci"],
  ["Science", "Science"], ["Cell", "Cell"], ["Scientific Reports", "Sci Rep"], ["PLoS ONE|PLOS ONE", "PLoS One"], ["PLoS Medicine|PLOS Medicine", "PLoS Med"],
  ["PLoS Biology|PLOS Biology", "PLoS Biol"], ["Proceedings of the National Academy of Sciences|Proceedings of the National Academy of Sciences of the United States of America", "Proc Natl Acad Sci U S A"],
  ["Annals of Internal Medicine", "Ann Intern Med"], ["Archives of Internal Medicine", "Arch Intern Med"], ["Journal of Clinical Investigation", "J Clin Invest"],
  ["Journal of Biological Chemistry", "J Biol Chem"], ["Nucleic Acids Research", "Nucleic Acids Res"], ["Circulation", "Circulation"],
  ["Circulation Research", "Circ Res"], ["Journal of the American College of Cardiology", "J Am Coll Cardiol"], ["European Heart Journal", "Eur Heart J"],
  ["Blood", "Blood"], ["Cancer", "Cancer"], ["Cancer Research", "Cancer Res"], ["Journal of Clinical Oncology", "J Clin Oncol"],
  ["Pediatrics", "Pediatrics"], ["Diabetes Care", "Diabetes Care"], ["Diabetes", "Diabetes"], ["Diabetologia", "Diabetologia"],
  ["American Journal of Public Health", "Am J Public Health"], ["American Journal of Epidemiology", "Am J Epidemiol"],
  ["International Journal of Epidemiology", "Int J Epidemiol"], ["American Journal of Medicine", "Am J Med"],
  ["American Journal of Psychiatry", "Am J Psychiatry"], ["American Journal of Respiratory and Critical Care Medicine", "Am J Respir Crit Care Med"],
  ["Cochrane Database of Systematic Reviews", "Cochrane Database Syst Rev"], ["Clinical Infectious Diseases", "Clin Infect Dis"],
  ["Journal of Infectious Diseases", "J Infect Dis"], ["Emerging Infectious Diseases", "Emerg Infect Dis"],
  ["Mayo Clinic Proceedings", "Mayo Clin Proc"], ["Gut", "Gut"], ["Gastroenterology", "Gastroenterology"], ["Hepatology", "Hepatology"],
  ["Neurology", "Neurology"], ["Stroke", "Stroke"], ["Brain", "Brain"], ["Journal of Neuroscience", "J Neurosci"],
  ["Frontiers in Psychology", "Front Psychol"], ["Frontiers in Immunology", "Front Immunol"], ["Frontiers in Public Health", "Front Public Health"],
  ["Frontiers in Neuroscience", "Front Neurosci"], ["Nutrients", "Nutrients"], ["International Journal of Molecular Sciences", "Int J Mol Sci"],
  ["Journal of Medical Internet Research", "J Med Internet Res"], ["Journal of the American Geriatrics Society", "J Am Geriatr Soc"],
  ["Obesity", "Obesity (Silver Spring)"], ["Thorax", "Thorax"], ["Chest", "Chest"], ["Radiology", "Radiology"], ["Anesthesiology", "Anesthesiology"],
  ["Journal of the American Academy of Dermatology", "J Am Acad Dermatol"], ["Journal of Pediatrics", "J Pediatr"],
  ["Annals of Surgery", "Ann Surg"], ["Surgery", "Surgery"], ["Psychological Medicine", "Psychol Med"], ["Addiction", "Addiction"],
];
const ABBREV = new Map<string, string>();
for (const [names, ab] of ABBREV_ENTRIES) for (const n of names.split("|")) ABBREV.set(n.toLowerCase(), ab);

/** NLM abbreviation for a well-known journal, or undefined. */
export function knownAbbrev(journal?: string): string | undefined {
  const key = cleanText(journal).toLowerCase();
  return ABBREV.get(key) ?? ABBREV.get(key.replace(/^the /, ""));
}

/** Crossref/ISO short titles carry periods; Vancouver abbreviations do not. */
export const stripAbbrevPeriods = (s: string) => cleanText(s).replace(/\./g, "").replace(/\s+/g, " ").trim();

/* ------------------------------- formatting ------------------------------- */

const doiOf = (s: VSource) => cleanText(s.doi).replace(/^(https?:\/\/(dx\.)?doi\.org\/|doi:\s*)/i, "");
const titleStop = (t: string) => withStop(cleanText(t));
const availableFrom = (s: VSource) => (cleanText(s.url) ? `Available from: ${cleanText(s.url)}` : "");

function imprint(s: VSource): string {
  const place = cleanText(s.place), pub = cleanText(s.publisher), year = cleanText(s.year);
  const left = [place, pub].filter(Boolean).join(": ");
  return [left, year].filter(Boolean).join("; ");
}

/** Journal part after the title: "N Engl J Med. 2002 Jul 25;347(4):284-7." */
function journalTail(s: VSource): string {
  const name = cleanText(s.abbrev) || knownAbbrev(s.container) || cleanText(s.container);
  const date = vDate(s.year, s.month, s.day);
  const vol = cleanText(s.volume), iss = cleanText(s.issue), pages = shortenPages(s.pages);
  let loc = vol ? `${vol}${iss ? `(${iss})` : ""}` : iss ? `(${iss})` : "";
  if (pages) loc += loc || date ? `:${pages}` : pages;
  const dateLoc = date && loc ? `${date};${loc}` : date || loc;
  return [name ? withStop(name) : "", dateLoc ? withStop(dateLoc) : ""].filter(Boolean).join(" ");
}

export function formatVancouver(s: VSource): string {
  const authors = authorsBlock(s.authors);
  const doi = doiOf(s);
  const parts: (string | false | undefined)[] = [authors];
  switch (s.type) {
    case "journal":
      parts.push(titleStop(s.title), journalTail(s), doi && `doi:${doi}`, !doi && availableFrom(s));
      break;
    case "book": {
      parts.push(titleStop(s.title), ordinalEd(s.edition), imprint(s) && withStop(imprint(s)), doi && `doi:${doi}`, !doi && availableFrom(s));
      break;
    }
    case "chapter": {
      const eds = editorsBlock(s.editors ?? []);
      const pages = shortenPages(s.pages);
      parts.push(titleStop(s.title), (eds || s.container) && `In: ${[eds, s.container ? titleStop(s.container) : ""].filter(Boolean).join(" ")}`,
        ordinalEd(s.edition), imprint(s) && withStop(imprint(s)), pages && `p. ${pages}.`, doi && `doi:${doi}`, !doi && availableFrom(s));
      break;
    }
    case "report":
      parts.push(titleStop(s.title), imprint(s) && withStop(imprint(s)), cleanText(s.detail) && withStop(`Report No.: ${cleanText(s.detail)}`), doi && `doi:${doi}`, !doi && availableFrom(s));
      break;
    case "thesis": {
      const kind = cleanText(s.detail) || "dissertation";
      parts.push(`${cleanText(s.title).replace(/[.]$/, "")} [${kind}].`, imprint(s) && withStop(imprint(s)), doi && `doi:${doi}`, !doi && availableFrom(s));
      break;
    }
    case "web": {
      const title = cleanText(s.title).replace(/[.]$/, "");
      const site = [cleanText(s.place), cleanText(s.publisher || s.container)].filter(Boolean).join(": ");
      const date = vDate(s.year, s.month, s.day);
      const cited = citedDate(s.accessed);
      const tail = [site, [date, cited && `[cited ${cited}]`].filter(Boolean).join(" ")].filter(Boolean).join("; ");
      parts.push(`${title} [Internet].`, tail && withStop(tail), availableFrom(s));
      break;
    }
  }
  return parts.filter(Boolean).join(" ").replace(/\s+/g, " ").trim();
}

export type MarkerStyle = "brackets" | "parentheses" | "superscript";

/** In-text number for reference n: [3], (3) or ³ (superscript). */
export function marker(n: number, style: MarkerStyle = "brackets"): string {
  if (style === "parentheses") return `(${n})`;
  if (style === "superscript") return String(n).split("").map((d) => "⁰¹²³⁴⁵⁶⁷⁸⁹"[Number(d)]).join("");
  return `[${n}]`;
}

/** Plain-text numbered list: "1. …" per line. */
export function numberedText(refs: string[]): string {
  return refs.map((r, i) => `${i + 1}. ${r}`).join("\n");
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/** Numbered list as HTML for rich paste into Word / Docs. */
export function numberedHtml(refs: string[]): string {
  return `<ol style="margin:0;padding-left:2em">${refs.map((r) => `<li style="margin:0 0 0.5em">${esc(r)}</li>`).join("")}</ol>`;
}

/** Move item i by delta (−1 up, +1 down); returns a new array. */
export function moveItem<T>(list: T[], i: number, delta: number): T[] {
  const j = i + delta;
  if (i < 0 || j < 0 || i >= list.length || j >= list.length) return list;
  const next = [...list];
  [next[i], next[j]] = [next[j], next[i]];
  return next;
}
