import type { Metadata } from "next";
import GeneratorPageShell, { SectionTitle } from "@/components/generators/GeneratorPageShell";
import CitationGenerator from "@/components/generators/CitationGenerator";
import CitationTabs from "@/components/generators/CitationTabs";
import CitationExamples from "@/components/generators/CitationExamples";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/chicago-citation-generator";
const TITLE = "Chicago Style Citation Generator — Notes-Bibliography & Author-Date (18th ed.), Free";
const DESCRIPTION =
  "Free Chicago style citation generator for the Chicago Manual of Style, 18th edition: paste a DOI, ISBN or URL and get footnotes, short notes and bibliography entries — or author-date references and (Author Year, page) citations. Journal articles, books, chapters, websites. No signup.";

const SOCIAL = generatorSocial({ card: "chicago-citation-generator", title: TITLE, description: DESCRIPTION, alt: "Chicago Style Citation Generator \u2014 reference list and in-text citation" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["chicago style citation generator", "chicago citation generator", "chicago manual of style citation", "chicago footnote generator", "chicago bibliography generator", "chicago author date citation", "chicago 18th edition citation"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "What is the difference between notes-bibliography and author-date?", answer: "Notes-bibliography puts citations in numbered footnotes or endnotes and lists sources in a bibliography. Author-date puts short (Author Year, page) citations in the text and lists sources in a reference list where the year comes right after the author. Use the one your instructor or journal asks for; the generator does both." },
  { question: "What changed in the 18th edition of Chicago?", answer: "Among the changes: place of publication is no longer needed for books; bibliographies list up to six authors (more than six become three plus “et al.”); notes use “et al.” for three or more authors; short notes are preferred over “ibid.”; and chapter page ranges are optional in the bibliography." },
  { question: "How do I write a Chicago short note?", answer: "Give the author's last name, a short title of up to four words (italic for books, in quotation marks for articles and chapters) and the page: Desmond, <em>Evicted</em>, 95. The generator builds it for you next to the full note." },
  { question: "Do websites need an access date in Chicago?", answer: "Only when the page has no publication or revision date. Then add “Accessed Month Day, Year.” before the URL." },
  { question: "Is my data stored?", answer: "No. DOIs and ISBNs are looked up directly from Crossref and Open Library in your browser. A web address is read once by our server to get the page title and author. Your list is saved only in your browser." },
];

export default function ChicagoCitationGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Chicago Style Citation Generator"
      heading={["Chicago Style", "Citation Generator"]}
      intro="Footnotes, short notes and bibliography — or author-date — from a DOI, ISBN or web address. Chicago 18th edition, free."
      description={DESCRIPTION}
      updated="2026-10-12"
      faq={FAQ.map((f) => ({ ...f, answer: f.answer.replace(/<[^>]+>/g, "") }))}
      related={[{ href: "/asa-citation-generator", label: "ASA citation generator" }, { href: "/acs-citation-generator", label: "ACS citation generator" }, { href: "/writing", label: "Writing prompts" }, { href: "/random-word-generator", label: "Random word generator" }]}
      inShort="Paste a DOI, ISBN or URL and copy a Chicago Manual of Style (18th ed.) bibliography entry together with its full footnote and short note. You can also switch to author-date and get a reference-list entry with an (Author Year, page) citation. It covers journal articles, books, chapters and websites, keeps italics when pasted into Word or Google Docs, and saves your list only in your browser."
      content={
        <>
          <SectionTitle>Chicago Style Citation rules at a glance</SectionTitle>
          <ul className="list-disc pl-5 space-y-2">
            <li dangerouslySetInnerHTML={{ __html: "Chicago has two systems. <strong>Notes and bibliography</strong> (common in history and the humanities) uses footnotes or endnotes plus a bibliography. <strong>Author-date</strong> (common in the sciences and social sciences) uses (Author Year, page) in the text plus a reference list." }} />
            <li dangerouslySetInnerHTML={{ __html: "Notes: the first citation of a source is a full note (Matthew Desmond, <em>Evicted</em> (Crown, 2016), 95). Later citations are shortened notes — author, short title of up to four words, page — which the 18th edition prefers to “ibid.”" }} />
            <li dangerouslySetInnerHTML={{ __html: "In notes and in author-date text citations, name one or two authors. With three or more, give the first author followed by “et al.”" }} />
            <li dangerouslySetInnerHTML={{ __html: "Bibliography and reference-list entries are alphabetical. The first author's name is inverted. List up to six authors; with more than six, list the first three followed by “et al.”" }} />
            <li dangerouslySetInnerHTML={{ __html: "Place of publication is no longer required for books (18th ed.), so book entries end with Publisher, Year." }} />
            <li dangerouslySetInnerHTML={{ __html: "Journal articles: “Article Title.” <em>Journal</em> volume, no. issue (Year): pages. A month or season can usually be left out when there are volume and issue numbers. Include the DOI as a link." }} />
            <li dangerouslySetInnerHTML={{ __html: "The page range of a chapter in an edited book is no longer required in the bibliography, but a note still gives the page cited." }} />
            <li dangerouslySetInnerHTML={{ __html: "Web pages give the title, the site name and the publication or revision date. If there is no date, give the date you accessed the page. Titles use headline-style capitalization." }} />
          </ul>
          <p className="text-xs text-[var(--text-muted)]" dangerouslySetInnerHTML={{ __html: "Summarized from <em>The Chicago Manual of Style</em>, 18th edition (University of Chicago Press, 2024), and library guides to its changes." }} />
          <SectionTitle>Examples</SectionTitle>
          <p>Real sources, formatted by this generator (page 12 shown in the in-text citations):</p>
          <CitationExamples style="chicago-nb" ids={["desmond", "marucho", "evicted", "atkins", "gray", "un"]} headline={true} />
          <p className="pt-2">The same sources in <strong>author-date</strong> style:</p>
          <CitationExamples style="chicago-ad" ids={["desmond", "marucho", "evicted"]} />
          <SectionTitle>How to use it</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Paste a DOI, an ISBN or the page address and press Cite — or choose the source type and type the details.</li>
            <li>Check every field against the source. Metadata databases are not always complete, so fix names, capitalization and pages here.</li>
            <li>Copy the reference and the in-text citation, or add the source to your list and copy the whole list at the end.</li>
          </ol>
        </>
      }
    >
      <CitationTabs current="chicago" />
      <CitationGenerator family="chicago" />
    </GeneratorPageShell>
  );
}
