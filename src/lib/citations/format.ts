// Citation engine for the citation generator pages (ASA, ACS, Chicago).
// Pure functions: a Source in, rich-text Segments out. The rules follow:
// - ASA Style Guide, 7th ed. (2022)
// - ACS Guide to Scholarly Communication (2020)
// - The Chicago Manual of Style, 18th ed. (2024), notes-bibliography and author-date

export type SourceType = "journal" | "book" | "chapter" | "web";
export type StyleId = "asa" | "acs" | "chicago-nb" | "chicago-ad";

/** A person, or an organization when only `family` is set and `org` is true. */
export interface Person { given: string; family: string; org?: boolean }

export interface Source {
  type: SourceType;
  authors: Person[];
  title: string;
  /** Journal, website or (for chapters) book title. */
  container?: string;
  /** ACS: abbreviated journal title (CASSI), when known. */
  containerShort?: string;
  editors?: Person[];
  volume?: string;
  issue?: string;
  pages?: string;
  year?: string;
  month?: number;
  day?: number;
  publisher?: string;
  place?: string;
  edition?: string;
  doi?: string;
  url?: string;
  /** ISO date (YYYY-MM-DD) the page was consulted. */
  accessed?: string;
}

export interface Segment { t: string; i?: boolean; b?: boolean; sup?: boolean }

export interface Formatted {
  reference: Segment[];
  /** Parenthetical citation, note or numbered marker, by style. */
  inText: { label: string; value: Segment[] }[];
}

export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/* ------------------------------ text helpers ------------------------------ */

/** Strip markup and stray spacing that metadata sources leave in titles. */
export function cleanText(s: string | undefined): string {
  return (s ?? "")
    .replace(/<[^>]+>/g, "")
    .replace(/[\u0000-\u001f\u007f-\u009f]/g, "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .replace(/[   \s]+/g, " ")
    .replace(/\s+([,.:;?!])/g, "$1")
    .trim();
}

const endsWithStop = (s: string) => /[.?!]$/.test(s.trim());
/** Add a period unless the text already ends with terminal punctuation. */
const stop = (s: string) => (endsWithStop(s) ? s : `${s}.`);
/** Page ranges take an en dash. */
export const pageRange = (p?: string) => cleanText(p).replace(/\s*[-‐‑–—]\s*/g, "–");
const bareDoi = (doi?: string) => cleanText(doi).replace(/^(https?:\/\/(dx\.)?doi\.org\/|doi:\s*)/i, "");

const MINOR = new Set(["a", "an", "the", "and", "but", "for", "or", "nor", "as", "at", "by", "in", "of", "off", "on", "per", "to", "up", "via", "vs", "vs.", "from", "into", "onto", "over", "with", "upon", "about", "among", "between", "through", "during", "without", "within", "under", "against", "toward", "towards", "than", "like", "near", "past"]);

/**
 * Headline-style capitalization (Chicago 8.159; ASA follows it): capitalize the
 * first and last words and the first word after a colon; lowercase articles,
 * coordinating conjunctions and prepositions. Words with capitals after the
 * first letter (acronyms, iPhone, McDonald) are left as they are.
 */
export function headlineCase(title: string): string {
  const words = cleanText(title).split(" ");
  return words.map((w, i) => {
    const bare = w.replace(/^[“"‘'(\[]+|[”"’'),.:;?!\]]+$/g, "");
    if (!bare || /[A-Z].*[A-Z]|[a-z][A-Z]|\d/.test(bare.slice(1)) || /^[a-z]+[A-Z]/.test(bare)) return w;
    const afterColon = i > 0 && /[:?!]$/.test(words[i - 1]);
    const edge = i === 0 || i === words.length - 1 || afterColon;
    const lower = bare.toLowerCase();
    const next = !edge && MINOR.has(lower) ? lower : bare.split("-").map((p) => (p ? p[0].toUpperCase() + p.slice(1) : p)).join("-");
    return w.replace(bare, next);
  }).join(" ");
}

/* -------------------------------- names -------------------------------- */

/** "Matthew" → "M.", "Robin R. R." → "R. R. R.", "Jean-Paul" → "J.-P." */
export function initials(given: string): string {
  return cleanText(given).split(/\s+/).filter(Boolean)
    .map((part) => part.split("-").map((p) => (p.replace(/\./g, "") ? `${p.replace(/\./g, "")[0].toUpperCase()}.` : "")).join("-"))
    .join(" ");
}

const direct = (p: Person) => (p.org || !p.given ? p.family : `${p.given} ${p.family}`);
const inverted = (p: Person) => (p.org || !p.given ? p.family : `${p.family}, ${p.given}`);

/** Parse "Given Family", "Family, Given" or an organization name. */
export function parsePerson(raw: string): Person | null {
  const s = cleanText(raw);
  if (!s) return null;
  if (s.includes(",")) {
    const [family, ...rest] = s.split(",");
    return { family: family.trim(), given: rest.join(",").trim() };
  }
  const parts = s.split(" ");
  if (parts.length === 1) return { family: s, given: "" };
  // Keep particles with the family name: "Ludwig van Beethoven", "Julio de Paula".
  let start = parts.length - 1;
  while (start > 1 && /^(van|von|der|de|del|della|da|di|du|la|le|bin|al|dos|das|ter|ten)$/i.test(parts[start - 1])) start--;
  return { given: parts.slice(0, start).join(" "), family: parts.slice(start).join(" ") };
}

/** Join names as "A, B, and C" (serial comma; ASA also puts the comma with two names). */
function joinAnd(names: string[], commaWithTwo: boolean): string {
  if (names.length <= 1) return names[0] ?? "";
  if (names.length === 2) return `${names[0]}${commaWithTwo ? "," : ""} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

/* ------------------------------- dates -------------------------------- */

const yearOf = (s: Source) => cleanText(s.year) || "n.d.";
const monthDay = (s: Source) => (s.month ? `${MONTHS[s.month - 1]}${s.day ? ` ${s.day}` : ""}` : "");
function fullDate(s: Source): string {
  if (!s.year) return "";
  const md = monthDay(s);
  return md ? `${md}, ${s.year}` : s.year;
}
function accessedLong(iso?: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso ?? "");
  return m ? `${MONTHS[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}` : "";
}

const ordinal = (ed?: string) => {
  const n = cleanText(ed);
  if (!n) return "";
  if (!/^\d+$/.test(n)) return n.replace(/\s*ed\.?$/i, "");
  const v = Number(n), last2 = v % 100;
  const suffix = last2 >= 11 && last2 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[v % 10] ?? "th";
  return `${v}${suffix}`;
};

/* ------------------------------ segments ------------------------------ */

class Out {
  segs: Segment[] = [];
  add(t: string, style: Omit<Segment, "t"> = {}) {
    if (!t) return this;
    const last = this.segs[this.segs.length - 1];
    if (last && !style.i && !style.b && !style.sup && !last.i && !last.b && !last.sup) last.t += t;
    else this.segs.push({ t, ...style });
    return this;
  }
  i(t: string) { return this.add(t, { i: true }); }
}

export const plainText = (segs: Segment[]) => segs.map((s) => s.t).join("");
const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export const toHtml = (segs: Segment[]) => segs.map((s) => {
  let h = esc(s.t);
  if (s.i) h = `<i>${h}</i>`;
  if (s.b) h = `<b>${h}</b>`;
  if (s.sup) h = `<sup>${h}</sup>`;
  return h;
}).join("");

/* --------------------------------- ASA --------------------------------- */

function asaNames(list: Person[]): string {
  const shown = list.length > 10 ? list.slice(0, 7) : list;
  const names = shown.map((p, i) => (i === 0 ? inverted(p) : direct(p)));
  if (list.length > 10) return `${names.join(", ")}, et al`;
  return joinAnd(names, true);
}

function asaInText(s: Source, page?: string): Segment[][] {
  const fam = s.authors.map((a) => a.family);
  const year = yearOf(s);
  const pg = page ? `:${page}` : "";
  const sep = year === "n.d." ? ", " : " ";
  const who = (names: string) => `(${names}${sep}${year}${pg})`;
  if (!fam.length) return [[{ t: who(`“${shortTitle(s.title)}”`) }]];
  if (fam.length === 1) return [[{ t: who(fam[0]) }]];
  if (fam.length === 2) return [[{ t: who(`${fam[0]} and ${fam[1]}`) }]];
  if (fam.length === 3) return [[{ t: who(`${fam[0]}, ${fam[1]}, and ${fam[2]}`) }], [{ t: who(`${fam[0]} et al.`) }]];
  return [[{ t: who(`${fam[0]} et al.`) }]];
}

function formatAsa(src: Source, opts: FormatOptions): Formatted {
  const s = withTitle(src, opts);
  const o = new Out();
  const lead = s.authors.length ? asaNames(s.authors) : "";
  const title = cleanText(s.title);
  const container = cleanText(s.container);
  const doi = bareDoi(s.doi);
  const link = doi ? `https://doi.org/${doi}` : cleanText(s.url);
  if (lead) o.add(`${stop(lead)} ${yearOf(s)}. `);
  else if (s.type === "web" && container) o.add(`${stop(container)} ${yearOf(s)}. `);
  if (s.type === "book") {
    o.i(stop(title)).add(" ");
    if (s.edition) o.add(`${ordinal(s.edition)} ed. `);
    const pub = [s.place && `${cleanText(s.place)}:`, cleanText(s.publisher)].filter(Boolean).join(" ");
    if (pub) o.add(`${stop(pub)} `);
  } else {
    o.add(`“${stop(title)}” `);
    if (s.type === "journal") {
      if (container) o.i(container);
      const vol = cleanText(s.volume), iss = cleanText(s.issue), pages = pageRange(s.pages);
      if (vol) o.add(` ${vol}${iss ? `(${iss})` : ""}`);
      if (pages) o.add(`${vol ? ":" : " "}${pages}`);
      o.add(". ");
    } else if (s.type === "chapter") {
      const pages = pageRange(s.pages);
      o.add(pages ? `Pp. ${pages} in ` : "In ");
      if (container) o.i(container);
      if (s.editors?.length) o.add(`, edited by ${joinAnd(s.editors.map(direct), false)}`);
      o.add(". ");
      if (s.edition) o.add(`${ordinal(s.edition)} ed. `);
      const pub = [s.place && `${cleanText(s.place)}:`, cleanText(s.publisher)].filter(Boolean).join(" ");
      if (pub) o.add(`${stop(pub)} `);
    } else {
      if (container && lead) o.i(container);
      const md = monthDay(s);
      if (container && lead) o.add(`${md ? `, ${md}` : ""}. `);
      else if (md) o.add(`${md}. `);
    }
  }
  if (link) o.add(link);
  return {
    reference: trimEnd(o.segs),
    inText: asaInText(s, opts.page).map((value, i, all) => ({ label: all.length > 1 ? (i === 0 ? "First citation" : "Later citations") : "In-text citation", value })),
  };
}

/* --------------------------------- ACS --------------------------------- */

const acsName = (p: Person) => (p.org || !p.given ? p.family : `${p.family}, ${initials(p.given)}`);
function acsNames(list: Person[]): string {
  const shown = list.slice(0, 10).map(acsName);
  return list.length > 10 ? `${shown.join("; ")}; et al.` : shown.join("; ");
}

function formatAcs(src: Source, opts: FormatOptions): Formatted {
  const s = withTitle(src, opts);
  const o = new Out();
  const title = cleanText(s.title);
  const doi = bareDoi(s.doi);
  const url = cleanText(s.url);
  const authors = s.authors.length ? stop(acsNames(s.authors)) : "";
  if (authors) o.add(`${authors} `);
  if (s.type === "journal") {
    o.add(`${stop(title)} `);
    const journal = cleanText(s.containerShort) || cleanText(s.container);
    if (journal) o.i(journal).add(" ");
    o.add(s.year ? s.year : "n.d.", { b: true });
    const vol = cleanText(s.volume), iss = cleanText(s.issue), pages = pageRange(s.pages);
    if (vol) o.add(", ").i(vol);
    if (iss) o.add(` (${iss})`);
    if (pages) o.add(`, ${pages}`);
    o.add(".");
  } else if (s.type === "book" || s.type === "chapter") {
    if (s.type === "chapter") {
      o.add(`${stop(title)} In `);
      o.i(cleanText(s.container));
    } else {
      o.i(title);
    }
    if (s.edition) o.add(`, ${ordinal(s.edition)} ed.`);
    o.add(";");
    if (s.type === "chapter" && s.editors?.length) {
      o.add(` ${s.editors.map(acsName).join(", ")}, ${s.editors.length > 1 ? "Eds." : "Ed."};`);
    }
    const publisher = cleanText(s.publisher), place = cleanText(s.place);
    o.add(` ${[publisher && place ? `${publisher}: ${place}` : publisher || place, s.year || "n.d."].filter(Boolean).join(", ")}`);
    const pages = pageRange(s.pages);
    if (s.type === "chapter" && pages) o.add(`; pp ${pages}`);
    o.add(".");
  } else {
    o.i(stop(title)).add(" ");
    const site = cleanText(s.container);
    const date = fullDate(s);
    const tail = [site, date].filter(Boolean).join(", ");
    if (tail) o.add(`${stop(tail)} `);
  }
  if (doi) o.add(` DOI: ${doi}`);
  else if (url) o.add(` ${url}${s.accessed ? ` (accessed ${s.accessed})` : ""}.`);
  const n = String(opts.number ?? 1);
  return {
    reference: trimEnd(o.segs, true),
    inText: [
      { label: "Superscript number", value: [{ t: n, sup: true }] },
      { label: "Italic number in parentheses", value: [{ t: "(" }, { t: n, i: true }, { t: ")" }] },
    ],
  };
}

/* ------------------------------- Chicago ------------------------------- */

function chicagoBibNames(list: Person[]): string {
  if (list.length > 6) return `${[inverted(list[0]), ...list.slice(1, 3).map(direct)].join(", ")}, et al`;
  return joinAnd(list.map((p, i) => (i === 0 ? inverted(p) : direct(p))), true);
}
function chicagoNoteNames(list: Person[], short = false): string {
  const name = (p: Person) => (short ? p.family : direct(p));
  if (list.length === 1) return name(list[0]);
  if (list.length === 2) return `${name(list[0])} and ${name(list[1])}`;
  return `${name(list[0])} et al.`;
}

/** Chicago short title: the main title (before a colon), at most four words. */
export function shortTitle(title: string): string {
  const main = cleanText(title).split(/:\s/)[0];
  const words = main.split(" ");
  return words.length > 4 ? words.slice(0, 4).join(" ") : main;
}

function chicagoTail(o: Out, s: Source, mode: "bib" | "note" | "ad") {
  const doi = bareDoi(s.doi);
  const link = doi ? `https://doi.org/${doi}` : cleanText(s.url);
  if (link) o.add(mode === "note" ? `, ${link}` : ` ${link}`);
}

function formatChicago(src: Source, opts: FormatOptions, authorDate: boolean): Formatted {
  const s = withTitle(src, opts);
  const title = cleanText(s.title);
  const container = cleanText(s.container);
  const publisher = cleanText(s.publisher);
  const vol = cleanText(s.volume), iss = cleanText(s.issue), pages = pageRange(s.pages);
  const ed = s.edition ? `${ordinal(s.edition)} ed.` : "";
  const editors = s.editors?.length ? joinAnd(s.editors.map(direct), false) : "";
  const noDate = !s.year;

  // Bibliography (NB) or reference list (AD) entry.
  const o = new Out();
  const lead = s.authors.length ? chicagoBibNames(s.authors) : "";
  if (lead) o.add(`${stop(lead)} `);
  if (authorDate && (lead || s.type !== "web")) o.add(`${yearOf(s)}. `);
  if (s.type === "book") {
    o.i(stop(title)).add(" ");
    if (ed) o.add(`${ed} `);
    if (authorDate) o.add(publisher ? stop(publisher) : "");
    else o.add(`${[publisher, s.year || "n.d."].filter(Boolean).join(", ")}.`);
  } else if (s.type === "journal") {
    o.add(`“${stop(title)}” `).i(container);
    if (authorDate) o.add(`${vol ? ` ${vol}` : ""}${iss ? ` (${iss})` : ""}${pages ? `: ${pages}` : ""}.`);
    else o.add(`${vol ? ` ${vol}` : ""}${iss ? `, no. ${iss}` : ""} (${s.year || "n.d."})${pages ? `: ${pages}` : ""}.`);
  } else if (s.type === "chapter") {
    o.add(`“${stop(title)}” In `).i(container);
    if (ed) o.add(`, ${ed}`);
    if (editors) o.add(`, edited by ${editors}`);
    o.add(". ");
    if (authorDate) o.add(publisher ? stop(publisher) : "");
    else o.add(`${[publisher, s.year || "n.d."].filter(Boolean).join(", ")}.`);
  } else {
    o.add(`“${stop(title)}” `);
    if (container) o.add(container);
    const when = authorDate ? monthDay(s) : fullDate(s);
    if (when) o.add(`${container ? ", " : ""}${when}.`);
    else if (container) o.add(".");
    if (authorDate && !lead) o.add(` ${yearOf(s)}.`);
    if (noDate && s.accessed) o.add(` Accessed ${accessedLong(s.accessed)}.`);
  }
  chicagoTail(o, s, "bib");
  if (cleanText(s.doi) || cleanText(s.url)) o.add(".");

  const page = opts.page ? cleanText(opts.page) : "";
  if (authorDate) {
    const fam = s.authors.map((a) => a.family);
    const who = !fam.length ? `“${shortTitle(title)}”` : fam.length === 1 ? fam[0] : fam.length === 2 ? `${fam[0]} and ${fam[1]}` : `${fam[0]} et al.`;
    return { reference: trimEnd(o.segs), inText: [{ label: "In-text citation", value: [{ t: `(${who} ${yearOf(s)}${page ? `, ${page}` : ""})` }] }] };
  }

  // Full note.
  const n = new Out();
  const noteLead = s.authors.length ? chicagoNoteNames(s.authors) : "";
  if (noteLead) n.add(`${noteLead}, `);
  if (s.type === "book") {
    n.i(title);
    if (ed) n.add(`, ${ed}`);
    n.add(` (${[publisher, s.year || "n.d."].filter(Boolean).join(", ")})`);
    if (page) n.add(`, ${page}`);
  } else if (s.type === "journal") {
    n.add(`“${title},” `).i(container).add(`${vol ? ` ${vol}` : ""}${iss ? `, no. ${iss}` : ""} (${s.year || "n.d."})`);
    if (page || pages) n.add(`: ${page || pages}`);
  } else if (s.type === "chapter") {
    n.add(`“${title},” in `).i(container);
    if (ed) n.add(`, ${ed}`);
    if (editors) n.add(`, ed. ${editors}`);
    n.add(` (${[publisher, s.year || "n.d."].filter(Boolean).join(", ")})`);
    if (page) n.add(`, ${page}`);
  } else {
    n.add(`“${title},” `);
    const parts = [container, fullDate(s) || (s.accessed ? `accessed ${accessedLong(s.accessed)}` : "")].filter(Boolean);
    n.add(parts.join(", "));
  }
  chicagoTail(n, s, "note");
  n.add(".");

  const sh = new Out();
  if (s.authors.length) sh.add(`${chicagoNoteNames(s.authors, true)}, `);
  if (s.type === "book") sh.i(shortTitle(title));
  else sh.add(`“${shortTitle(title)}”`);
  if (page) sh.add(`, ${page}`);
  sh.add(".");
  // A quoted short title takes the comma inside the closing quote.
  // A title ending in ? or ! takes no comma after it.
  const fixQuotes = (x: Segment) => ({ ...x, t: x.t.replace(/”, /g, ",” ").replace(/,,”/g, ",”").replace(/([?!]),”/g, "$1”").replace(/”\.$/, ".”") });
  sh.segs = sh.segs.map(fixQuotes);
  n.segs = n.segs.map((x) => ({ ...x, t: x.t.replace(/([?!]),”/g, "$1”").replace(/”\.$/, ".”") }));

  return {
    reference: trimEnd(o.segs),
    inText: [
      { label: "Full note (first citation)", value: trimEnd(n.segs) },
      { label: "Short note (later citations)", value: sh.segs },
    ],
  };
}

/* ------------------------------ dispatch ------------------------------ */

export interface FormatOptions {
  /** Page cited, for in-text citations and notes. */
  page?: string;
  /** ACS reference number. */
  number?: number;
  /** Apply headline-style capitalization to titles (ASA and Chicago). */
  headline?: boolean;
}

function withTitle(s: Source, opts: FormatOptions): Source {
  if (!opts.headline) return s;
  return { ...s, title: headlineCase(s.title), container: s.container ? headlineCase(s.container) : s.container };
}

function trimEnd(segs: Segment[], acs = false): Segment[] {
  const out = segs.map((s) => ({ ...s }));
  while (out.length && !out[out.length - 1].t.trim()) out.pop();
  if (out.length) {
    const last = out[out.length - 1];
    last.t = last.t.replace(/\s+$/, "").replace(/\s{2,}/g, " ");
    if (!acs && !/[.?!”)]$/.test(last.t) && !/^https?:/.test(last.t.split(" ").pop() ?? "")) last.t += ".";
  }
  for (const s of out) s.t = s.t.replace(/ {2,}/g, " ").replace(/\.\./g, ".");
  return out;
}

export function formatCitation(style: StyleId, source: Source, opts: FormatOptions = {}): Formatted {
  if (style === "asa") return formatAsa(source, opts);
  if (style === "acs") return formatAcs(source, opts);
  return formatChicago(source, opts, style === "chicago-ad");
}

/** Reference-list order: ACS keeps citation order; ASA and Chicago sort by author, then year. */
export function sortForStyle<T extends { source: Source }>(style: StyleId, items: T[]): T[] {
  if (style === "acs") return items.slice();
  const key = (s: Source) => `${(s.authors[0] ? s.authors[0].family : cleanText(s.title).replace(/^(the|a|an)\s+/i, "")).toLowerCase()} ${s.year ?? "9999"}`;
  return items.slice().sort((a, b) => key(a.source).localeCompare(key(b.source)));
}
