// Autofill for the Vancouver generator: PMID → PubMed E-utilities, DOI → Crossref
// (+ the NLM journal abbreviation from PubMed), ISBN → Open Library, URL → our page reader.
// Crossref, PubMed and Open Library all send CORS headers, so the browser calls them directly.
import type { Person, Source } from "./format";
import { cleanText } from "./format";
import { detectInput, fromCrossref, lookupIsbn, lookupUrl, type CrossrefWork } from "./lookup";
import { MON, stripAbbrevPeriods, type VPerson, type VSource, type VType } from "./vancouver";

type Fetch = typeof fetch;
const EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils";

export type VInput = { kind: "pmid" | "doi" | "isbn" | "url" | "unknown"; value: string };

/** A bare PMID (1–9 digits), "PMID: 123", or a pubmed.ncbi.nlm.nih.gov link. */
export function detectVInput(raw: string): VInput {
  const s = raw.trim();
  const pm = /^(?:pmid:?\s*)?(\d{1,9})$/i.exec(s) ?? /^https?:\/\/(?:www\.)?(?:pubmed\.ncbi\.nlm\.nih\.gov|ncbi\.nlm\.nih\.gov\/pubmed)\/(\d{1,9})\/?(?:[?#].*)?$/i.exec(s);
  if (pm) return { kind: "pmid", value: pm[1] };
  return detectInput(s);
}

const toVPerson = (p: Person): VPerson => ({ given: p.given, family: p.family, org: p.org });

/** Map the shared lookup shape onto the Vancouver model. */
export function toVSource(s: Source, type?: VType): VSource {
  return {
    type: type ?? s.type,
    authors: s.authors.map(toVPerson),
    editors: s.editors?.map(toVPerson),
    title: s.title,
    container: s.container,
    abbrev: s.containerShort ? stripAbbrevPeriods(s.containerShort) : undefined,
    volume: s.volume, issue: s.issue, pages: s.pages, year: s.year, month: s.month, day: s.day,
    edition: s.edition, publisher: s.publisher, place: s.place, doi: s.doi, url: s.url, accessed: s.accessed,
  };
}

/** "de Azevedo WF Jr" → { family: "de Azevedo", initials: "WF", suffix: "Jr" } (PubMed author names). */
export function parsePubMedAuthor(name: string): VPerson | null {
  const parts = cleanText(name).split(" ");
  if (!parts[0]) return null;
  let suffix: string | undefined;
  if (parts.length > 2 && /^(Jr|Sr|II|III|IV|2nd|3rd)$/.test(parts[parts.length - 1])) suffix = parts.pop();
  if (parts.length === 1) return { given: "", family: parts[0], org: true };
  const initials = parts.pop() as string;
  return { given: "", family: parts.join(" "), initials, suffix };
}

export interface PubMedSummary {
  uid?: string;
  pubdate?: string;
  source?: string;
  authors?: { name?: string; authtype?: string }[];
  title?: string;
  volume?: string;
  issue?: string;
  pages?: string;
  articleids?: { idtype?: string; value?: string }[];
}

/** "2019 Jun 1" / "2019 Jun" / "2019" / "2018 Winter" → year, month, day. */
export function parsePubDate(d?: string): { year?: string; month?: number; day?: number } {
  const m = /^(\d{4})(?:\s+([A-Za-z]{3})[a-z]*)?(?:\s+(\d{1,2}))?/.exec(cleanText(d));
  if (!m) return {};
  const month = m[2] ? MON.findIndex((x) => x.toLowerCase() === m[2].toLowerCase()) + 1 || undefined : undefined;
  return { year: m[1], month, day: month && m[3] ? Number(m[3]) : undefined };
}

export function fromPubMed(r: PubMedSummary): VSource {
  const { year, month, day } = parsePubDate(r.pubdate);
  const id = (t: string) => r.articleids?.find((a) => a.idtype === t)?.value;
  return {
    type: "journal",
    authors: (r.authors ?? []).filter((a) => !a.authtype || a.authtype === "Author").map((a) => parsePubMedAuthor(a.name ?? "")).filter(Boolean) as VPerson[],
    title: cleanText(r.title).replace(/\.$/, ""),
    abbrev: cleanText(r.source) || undefined,
    volume: cleanText(r.volume) || undefined,
    issue: cleanText(r.issue) || undefined,
    pages: cleanText(r.pages) || undefined,
    year, month, day,
    doi: id("doi") || undefined,
    pmid: r.uid ?? id("pubmed"),
  };
}

export async function lookupPmid(pmid: string, f: Fetch = fetch): Promise<VSource> {
  if (!/^\d{1,9}$/.test(pmid)) throw new Error("A PMID is a number of up to 9 digits.");
  const res = await f(`${EUTILS}/esummary.fcgi?db=pubmed&id=${pmid}&retmode=json`);
  if (!res.ok) throw new Error(`PubMed answered ${res.status}. Try again in a moment.`);
  const json = await res.json();
  const rec = json?.result?.[pmid] as (PubMedSummary & { error?: string }) | undefined;
  if (!rec || rec.error || !rec.title) throw new Error("No PubMed record for that PMID.");
  return fromPubMed(rec);
}

/** Best effort: PubMed record for a DOI (gives the NLM abbreviation and PMID). */
async function pubmedByDoi(doi: string, f: Fetch): Promise<VSource | null> {
  try {
    const q = new URLSearchParams({ db: "pubmed", term: `${doi}[AID]`, retmode: "json", retmax: "1" });
    const res = await f(`${EUTILS}/esearch.fcgi?${q}`, { signal: AbortSignal.timeout(6000) });
    if (!res.ok) return null;
    const id = (await res.json())?.esearchresult?.idlist?.[0];
    return typeof id === "string" && /^\d+$/.test(id) ? await lookupPmid(id, f) : null;
  } catch {
    return null;
  }
}

const REPORT_TYPES = new Set(["report", "report-component", "report-series", "standard"]);

export async function lookupVDoi(doi: string, f: Fetch = fetch): Promise<VSource> {
  const res = await f(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(res.status === 404 ? "No record for that DOI." : `Crossref ${res.status}`);
  const work = (await res.json()).message as CrossrefWork;
  const base = fromCrossref(work);
  const type: VType = work.type === "dissertation" ? "thesis" : REPORT_TYPES.has(work.type ?? "") ? "report" : base.type;
  const out = toVSource(base, type);
  const short = cleanText(work["short-container-title"]?.[0]);
  if (type === "journal") {
    out.abbrev = short ? stripAbbrevPeriods(short) : undefined;
    const pm = await pubmedByDoi(doi, f);
    if (pm?.abbrev) out.abbrev = pm.abbrev;
    if (pm?.pmid) out.pmid = pm.pmid;
    // PubMed has the full publication date (month and day) that Crossref often lacks.
    if (pm && pm.year === out.year && pm.month && !out.month) { out.month = pm.month; out.day = pm.day; }
  } else if (type === "thesis") out.detail = "dissertation";
  return out;
}

/** One entry point for every kind of input; throws a readable Error. */
export async function lookupVancouver(raw: string, today: string, f: Fetch = fetch): Promise<VSource> {
  const input = detectVInput(raw);
  switch (input.kind) {
    case "pmid": return lookupPmid(input.value, f);
    case "doi": return lookupVDoi(input.value, f);
    case "isbn": return toVSource(await lookupIsbn(input.value, f));
    case "url": return toVSource(await lookupUrl(input.value, today, f));
    default: throw new Error("Paste a PMID, a DOI (10.xxxx/…), an ISBN or a full web address.");
  }
}
