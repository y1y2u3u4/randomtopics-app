import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import VancouverGenerator from "@/components/generators/VancouverGenerator";
import CitationTabs from "@/components/generators/CitationTabs";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import { formatVancouver, marker, type VSource } from "@/lib/citations/vancouver";

const PATH = "/vancouver-citation-generator";
const TITLE = "Vancouver Citation Generator — Reference Maker with PMID & DOI Autofill";
const DESCRIPTION =
  "Free Vancouver citation and reference generator (ICMJE/NLM): paste a PMID, DOI, ISBN or URL, get a correctly formatted reference with the NLM journal abbreviation, and build a numbered reference list. No signup.";

const SOCIAL = generatorSocial({ card: "vancouver-citation-generator", title: TITLE, description: DESCRIPTION, alt: "Vancouver Citation Generator — numbered Vancouver references from a PMID or DOI" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["vancouver citation generator", "vancouver reference generator", "vancouver referencing", "vancouver style citation", "vancouver referencing generator", "vancouver reference style", "pubmed citation generator", "icmje citation format", "nlm citation format"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const P = (given: string, family: string) => ({ given, family });
const EXAMPLES: { label: string; note: string; source: VSource }[] = [
  { label: "Journal article (3 authors, with DOI)", note: "Journal name abbreviated as in the NLM Catalog; month and day come from the publication date.", source: { type: "journal", authors: [P("Scott D.", "Halpern"), P("Peter A.", "Ubel"), P("Arthur L.", "Caplan")], title: "Solid-organ transplantation in HIV-infected patients", container: "New England Journal of Medicine", abbrev: "N Engl J Med", volume: "347", issue: "4", pages: "284-287", year: "2002", month: 7, day: 25, doi: "10.1056/nejmsb020632" } },
  { label: "Journal article (more than six authors)", note: "Seven or more authors: list the first six, then et al. (invented authors, for illustration).", source: { type: "journal", authors: [P("Ana", "Lopez"), P("Ben", "Okafor"), P("Chen", "Wei"), P("Dara", "Singh"), P("Eli", "Novak"), P("Fatima", "Haddad"), P("Gus", "Moreau")], title: "Illustration of a paper with seven authors", container: "BMJ", abbrev: "BMJ", volume: "380", pages: "e072364", year: "2023", month: 3, day: 8 } },
  { label: "Book (second or later edition)", note: "The edition is written as 4th ed.; a first edition is left out.", source: { type: "book", authors: [P("Noel R.", "Rose"), P("Ian R.", "Mackay")], title: "The autoimmune diseases", edition: "4", place: "St. Louis", publisher: "Elsevier", year: "2006" } },
  { label: "Chapter in an edited book", note: "Chapter authors, then “In:” the editors and the book title, and the page range after “p.”.", source: { type: "chapter", authors: [P("Paul S.", "Meltzer"), P("Anita", "Kallioniemi"), P("Jeffrey M.", "Trent")], title: "Chromosome alterations in human solid tumors", container: "The genetic basis of human cancer", editors: [P("Bert", "Vogelstein"), P("Kenneth W.", "Kinzler")], place: "New York", publisher: "McGraw-Hill", year: "2002", pages: "93-113" } },
  { label: "Webpage by an organization", note: "[Internet] after the title, the date you looked at it in [cited …], then Available from.", source: { type: "web", authors: [{ given: "", family: "World Health Organization", org: true }], title: "Diabetes", place: "Geneva", publisher: "World Health Organization", year: "2024", month: 11, day: 14, url: "https://www.who.int/news-room/fact-sheets/detail/diabetes", accessed: "2026-10-28" } },
  { label: "Report", note: "Corporate author, place, publisher and year; add the report number if there is one (Report No.: …).", source: { type: "report", authors: [{ given: "", family: "World Health Organization", org: true }], title: "Global report on infection prevention and control", place: "Geneva", publisher: "World Health Organization", year: "2022" } },
  { label: "Thesis or dissertation", note: "The kind of work goes in square brackets after the title (invented example, for illustration).", source: { type: "thesis", authors: [P("Maria", "Lopez")], title: "Sleep and recovery after surgery", detail: "dissertation", place: "Boston", publisher: "Harvard University", year: "2019" } },
];

const FAQ = [
  { question: "What is a Vancouver citation?", answer: "A Vancouver citation is a numbered reference in the style used by medical and health journals, set out in the ICMJE Recommendations and the NLM guide Citing Medicine. In the text you write a number such as [1]; the reference list gives the sources in the order you first cite them, with authors as surname and initials, for example Halpern SD." },
  { question: "How do I make a Vancouver reference list?", answer: "Add each source with the Cite box or the form, in the order it first appears in your paper. The list numbers itself 1, 2, 3 and keeps that order; use the arrows to move an entry, then copy the numbered list into Word or Google Docs or download it." },
  { question: "How many authors do you list in Vancouver style?", answer: "ICMJE style lists up to six authors. With seven or more, give the first six followed by et al. For an organization as author, write its full name once, for example World Health Organization. This generator applies the rule automatically." },
  { question: "How do you write journal names in Vancouver referencing?", answer: "Use the abbreviation in the NLM Catalog, without periods: N Engl J Med, not New England Journal of Medicine. A PMID or a DOI fills it in for you from PubMed; for other journals type it in, or look it up in the NLM Catalog (the link is under the field)." },
  { question: "How do you cite a website in Vancouver style?", answer: "Author or organization, title, [Internet], place and publisher, the date published, [cited YYYY Mon DD] and Available from: the URL. Example: World Health Organization. Diabetes [Internet]. Geneva: World Health Organization; 2024 Nov 14 [cited 2026 Oct 28]. Available from: https://www.who.int/news-room/fact-sheets/detail/diabetes" },
  { question: "How do I shorten page numbers in Vancouver style?", answer: "NLM drops the repeated leading digits of the last page: 284-287 becomes 284-7, 123-128 becomes 123-8 and 1203-1210 becomes 1203-10. Ranges that differ in length, such as 99-101, stay in full. The generator does this for you." },
  { question: "Do I put the DOI in a Vancouver reference?", answer: "Yes, if the source has one: add doi:10.xxxx/xxxx at the end with no full stop after it. Without a DOI, web sources end with Available from: and the URL." },
  { question: "Should in-text citations use brackets, parentheses or superscript?", answer: "All three are accepted; follow your journal or university guide. Brackets [1] and parentheses (1) sit on the line, superscript ¹ is raised. Use the same number every time you cite the same source, and write a range as [1-3] or a list as [1,4,7]." },
  { question: "Is Vancouver the same as APA or Harvard?", answer: "No. Vancouver and APA both have a reference list, but Vancouver numbers sources in citation order and abbreviates journals, while APA and Harvard use author and year in the text and an alphabetical list. See the comparison table above for the same article in all three." },
  { question: "Where does the data come from, and is it stored?", answer: "A PMID is looked up on PubMed and a DOI on Crossref directly from your browser; a web address is read once by our server for its title and author. Your reference list is saved only in your own browser, so clear your browser data and it is gone." },
];

const RULES: [string, string][] = [
  ["In-text numbering", "Arabic numerals in order of first citation: [1], (1) or superscript. Reuse the same number for the same source; ranges as [1-3], lists as [1,4,7]."],
  ["Reference list order", "Numbered, in the order cited in the text, not alphabetical."],
  ["Authors", "Surname then initials with no periods or spaces between initials: Halpern SD. Separate with commas. Organization: full name."],
  ["More than six authors", "List the first six, then et al. (ICMJE). Some journals list three; follow yours."],
  ["Journal title", "NLM abbreviation, no periods: N Engl J Med. Not in italics."],
  ["Date and location", "Year Mon Day;Volume(Issue):pages — 2002 Jul 25;347(4):284-7."],
  ["Page ranges", "Repeated leading digits of the last page are dropped: 284-7, 123-8, 1203-10. 99-101 stays."],
  ["Book", "Authors. Title. Edition ed. Place: Publisher; Year. The first edition is not stated."],
  ["Webpage", "Title [Internet]. Place: Publisher; date published [cited YYYY Mon DD]. Available from: URL"],
  ["DOI", "doi:10.xxxx/xxxx at the end, no full stop after it."],
];

const COMPARE_ARTICLE = {
  vancouver: formatVancouver(EXAMPLES[0].source),
  apa: <>Halpern, S. D., Ubel, P. A., &amp; Caplan, A. L. (2002). Solid-organ transplantation in HIV-infected patients. <em>New England Journal of Medicine, 347</em>(4), 284–287. https://doi.org/10.1056/nejmsb020632</>,
  harvard: <>Halpern, S.D., Ubel, P.A. and Caplan, A.L. (2002) &lsquo;Solid-organ transplantation in HIV-infected patients&rsquo;, <em>New England Journal of Medicine</em>, 347(4), pp. 284–287. doi:10.1056/nejmsb020632.</>,
};

export default function VancouverCitationGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Vancouver Citation Generator"
      heading={["Vancouver Citation", "Generator"]}
      intro="Paste a PMID, DOI, ISBN or web address, or type the details, and get a correct Vancouver reference: authors as Surname Initials (six, then et al.), the NLM journal abbreviation, shortened page ranges and numbered in-text citations. Build a numbered reference list you can reorder and copy into Word. Free, no signup."
      description={DESCRIPTION}
      updated="2026-10-28"
      faq={FAQ}
      related={[{ href: "/apa-citation-generator", label: "APA citation generator" }, { href: "/acs-citation-generator", label: "ACS citation generator (numbered)" }, { href: "/chicago-citation-generator", label: "Chicago style citation generator" }, { href: "/research-topic-generator", label: "Research topic generator" }]}
      inShort={`A Vancouver reference gives authors as surname and initials (up to six, then “et al.”), the title, the journal's NLM abbreviation and Year Mon Day;Volume(Issue):pages, for example ${formatVancouver({ ...EXAMPLES[0].source, doi: undefined })} Sources are numbered ${marker(1)}, ${marker(2)}, ${marker(3)} in the order you first cite them, and the reference list keeps that order.`}
      content={
        <>
          <SectionTitle>Vancouver referencing rules at a glance</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="text-left border-b border-white/15"><th className="py-2 pr-3">Part</th><th className="py-2">Rule</th></tr></thead>
              <tbody>
                {RULES.map(([k, v]) => (
                  <tr key={k} className="border-b border-white/10 align-top"><td className="py-2 pr-3 text-[var(--text-primary)] whitespace-nowrap">{k}</td><td className="py-2">{v}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[var(--text-muted)]">Summarized from the ICMJE Recommendations (Sample References) and Citing Medicine, 2nd ed. (NLM). Universities and journals vary the details, so check your own guide.</p>

          <SectionTitle>Vancouver citation examples for each source type</SectionTitle>
          <p>Each example below is produced by the same formatter as the generator above.</p>
          <div className="space-y-4">
            {EXAMPLES.map((ex) => (
              <div key={ex.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                <p className="text-xs uppercase tracking-widest text-[var(--text-muted)] mb-1">{ex.label}</p>
                <p className="text-[var(--text-primary)] break-words">{formatVancouver(ex.source)}</p>
                <p className="text-xs mt-1 text-[var(--text-muted)]">{ex.note}</p>
              </div>
            ))}
          </div>

          <SectionTitle>How to use the Vancouver reference generator</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Paste a PMID (12140307), a DOI, an ISBN or a page address and press Cite — or choose the source type and fill in the form.</li>
            <li>Check the journal abbreviation and every field against the source. A PMID or DOI fills in the NLM abbreviation; other journals may need it from the NLM Catalog.</li>
            <li>Press <strong>Add to reference list</strong> in the order you first cite each source. Use the arrows to reorder and Edit to correct an entry.</li>
            <li>Copy the numbered list for Word or Google Docs, or download it as .doc or .txt. Write the number in your text as {marker(1)}, (1) or ¹.</li>
          </ol>

          <SectionTitle>Vancouver vs APA vs Harvard</SectionTitle>
          <p>The same journal article in three styles:</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead><tr className="text-left border-b border-white/15"><th className="py-2 pr-3">Style</th><th className="py-2 pr-3">In-text</th><th className="py-2 pr-3">List order</th><th className="py-2">Reference</th></tr></thead>
              <tbody>
                <tr className="border-b border-white/10 align-top"><td className="py-2 pr-3 text-[var(--text-primary)]">Vancouver</td><td className="py-2 pr-3">{marker(1)}</td><td className="py-2 pr-3">Order of citation</td><td className="py-2">{COMPARE_ARTICLE.vancouver}</td></tr>
                <tr className="border-b border-white/10 align-top"><td className="py-2 pr-3 text-[var(--text-primary)]">APA 7</td><td className="py-2 pr-3">(Halpern et al., 2002)</td><td className="py-2 pr-3">Alphabetical</td><td className="py-2">{COMPARE_ARTICLE.apa}</td></tr>
                <tr className="border-b border-white/10 align-top"><td className="py-2 pr-3 text-[var(--text-primary)]">Harvard</td><td className="py-2 pr-3">(Halpern, Ubel and Caplan, 2002)</td><td className="py-2 pr-3">Alphabetical</td><td className="py-2">{COMPARE_ARTICLE.harvard}</td></tr>
              </tbody>
            </table>
          </div>
          <ul className="list-disc pl-5 space-y-2">
            <li>Vancouver is shortest: abbreviated journal, no italics, initials without periods, shortened pages.</li>
            <li>APA and Harvard put the year first after the authors and sort alphabetically; Vancouver sorts by where you cite.</li>
            <li>Harvard has many local versions; Vancouver also varies a little between universities (brackets or superscript, three or six authors).</li>
          </ul>
          <p>
            Need another style? The{" "}
            <Link prefetch={false} href="/apa-citation-generator" className={linkClass}>APA citation generator</Link> covers APA 7,{" "}
            <Link prefetch={false} href="/acs-citation-generator" className={linkClass}>ACS</Link> is the numbered style for chemistry, and{" "}
            <Link prefetch={false} href="/chicago-citation-generator" className={linkClass}>Chicago</Link> covers history and the humanities. Still choosing what to write about? Try the{" "}
            <Link prefetch={false} href="/research-topic-generator" className={linkClass}>research topic generator</Link>.
          </p>
        </>
      }
    >
      <CitationTabs current="vancouver" />
      <VancouverGenerator />
    </GeneratorPageShell>
  );
}
