import type { Metadata } from "next";
import GeneratorPageShell, { SectionTitle } from "@/components/generators/GeneratorPageShell";
import CitationGenerator from "@/components/generators/CitationGenerator";
import CitationTabs from "@/components/generators/CitationTabs";
import CitationExamples from "@/components/generators/CitationExamples";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/asa-citation-generator";
const TITLE = "ASA Citation Generator — Free ASA Style (7th Edition) References & In-Text Citations";
const DESCRIPTION =
  "Free ASA citation generator for the ASA Style Guide, 7th edition: paste a DOI, ISBN or URL and get the reference-list entry and the (Author Year:page) in-text citation for journal articles, books, chapters and websites. Copy with italics, build your References list, no signup.";

const SOCIAL = generatorSocial({ card: "asa-citation-generator", title: TITLE, description: DESCRIPTION, alt: "ASA Citation Generator \u2014 reference list and in-text citation" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["asa citation generator", "asa format citation", "asa style citation", "asa reference generator", "asa 7th edition citation", "asa in-text citation", "american sociological association citation"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "What is ASA citation style?", answer: "ASA style is the American Sociological Association's citation format, used in sociology and related social sciences. It pairs short author–date citations in the text, like (Desmond 2012:95), with a References list at the end of the paper." },
  { question: "Which edition of ASA does this generator use?", answer: "The ASA Style Guide, 7th edition (2022). Its changes include writing DOIs as links and listing full author names in the reference list." },
  { question: "How do I cite a source with three or more authors in ASA?", answer: "With three authors, name all three in the first in-text citation and use the first author plus “et al.” afterwards. With four or more authors, use the first author plus “et al.” every time. The reference list still names every author (up to ten)." },
  { question: "Do I need an access date for websites in ASA?", answer: "No, ASA does not require access dates. The exception is a page that changes often, such as a wiki, where your instructor may ask for one." },
  { question: "Is my data stored?", answer: "No. DOIs and ISBNs are looked up directly from Crossref and Open Library in your browser. A web address is read once by our server to pull the page title and author. Your reference list is saved only in your browser." },
];

export default function AsaCitationGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="ASA Citation Generator"
      heading={["ASA Citation", "Generator"]}
      intro="Paste a DOI, ISBN or web address — get an ASA 7th-edition reference and in-text citation in one click. Free, no signup."
      description={DESCRIPTION}
      updated="2026-10-12"
      faq={FAQ.map((f) => ({ ...f, answer: f.answer.replace(/<[^>]+>/g, "") }))}
      related={[{ href: "/acs-citation-generator", label: "ACS citation generator" }, { href: "/chicago-citation-generator", label: "Chicago style citation generator" }, { href: "/writing", label: "Writing prompts" }, { href: "/random-word-generator", label: "Random word generator" }]}
      inShort="Paste a DOI, ISBN or URL, check the filled-in fields, and copy an ASA Style Guide (7th ed.) reference such as Desmond, Matthew. 2012. “Title.” American Journal of Sociology 118(1):88–133, plus the in-text citation (Desmond 2012:95). Add each source to a References list that stays in your browser and copy it with italics into Word or Google Docs."
      content={
        <>
          <SectionTitle>ASA Citation rules at a glance</SectionTitle>
          <ul className="list-disc pl-5 space-y-2">
            <li dangerouslySetInnerHTML={{ __html: "In the text, cite the author's last name and the year with no comma between them: (Desmond 2012). For a quotation or a specific passage, add the page after a colon with no space: (Desmond 2012:95)." }} />
            <li dangerouslySetInnerHTML={{ __html: "Two authors: give both names (Innocente and Baker 2018). Three authors: all three names the first time, then the first author followed by “et al.” Four or more authors: always the first author followed by “et al.”" }} />
            <li dangerouslySetInnerHTML={{ __html: "The list at the end is headed <em>References</em>, in alphabetical order by the first author's last name, double-spaced with a hanging indent." }} />
            <li dangerouslySetInnerHTML={{ __html: "Write the first author's name last name first (Desmond, Matthew) and every other author in normal order, using full first names when they are available. Join the last author with “and”, not “&”." }} />
            <li dangerouslySetInnerHTML={{ __html: "The year follows the authors. Article and chapter titles go in quotation marks; book and journal titles are italic." }} />
            <li dangerouslySetInnerHTML={{ __html: "Journal articles are cited as volume(issue):pages, for example 118(1):88–133. Include the DOI when there is one." }} />
            <li dangerouslySetInnerHTML={{ __html: "Books give the place of publication and the publisher (Ithaca, NY: Cornell University Press). For New York City write only “New York.” Chapters read “Pp. 55–64 in <em>Book Title</em>, edited by …”." }} />
            <li dangerouslySetInnerHTML={{ __html: "Access dates are not required for web pages unless the content changes often, such as a wiki." }} />
          </ul>
          <p className="text-xs text-[var(--text-muted)]" dangerouslySetInnerHTML={{ __html: "Summarized from the <em>ASA Style Guide</em>, 7th edition (American Sociological Association, 2022), and university library guides based on it." }} />
          <SectionTitle>Examples</SectionTitle>
          <p>Real sources, formatted by this generator (page 12 shown in the in-text citations):</p>
          <CitationExamples style="asa" ids={["desmond", "innocente", "marucho", "evicted", "gray", "un"]} headline={true} />
          <SectionTitle>How to use it</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Paste a DOI, an ISBN or the page address and press Cite — or choose the source type and type the details.</li>
            <li>Check every field against the source. Metadata databases are not always complete, so fix names, capitalization and pages here.</li>
            <li>Copy the reference and the in-text citation, or add the source to your list and copy the whole list at the end.</li>
          </ol>
        </>
      }
    >
      <CitationTabs current="asa" />
      <CitationGenerator family="asa" />
    </GeneratorPageShell>
  );
}
