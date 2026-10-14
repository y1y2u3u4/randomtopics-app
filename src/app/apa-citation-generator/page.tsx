import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import CitationGenerator from "@/components/generators/CitationGenerator";
import CitationTabs from "@/components/generators/CitationTabs";
import CitationExamples from "@/components/generators/CitationExamples";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/apa-citation-generator";
const TITLE = "APA Citation Generator (7th Ed.) — Free Reference Page Maker";
const DESCRIPTION =
  "Free APA 7 citation generator: paste DOIs, ISBNs or URLs, get references and in-text citations, then copy or download a full APA reference page. No signup.";

const SOCIAL = generatorSocial({ card: "apa-citation-generator", title: TITLE, description: DESCRIPTION, alt: "APA Citation Generator — APA 7 reference page and in-text citations" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["apa citation generator", "apa reference page generator", "apa 7 citation generator", "apa reference generator", "apa in-text citation", "apa format citation", "apa references list generator", "apa 7th edition"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "Which edition of APA does this generator use?", answer: "APA 7th edition (Publication Manual of the American Psychological Association, 2020), the current version used by most schools and journals. It lists up to 20 authors, writes DOIs as https://doi.org/ links and leaves out the publisher location for books." },
  { question: "How do I make an APA reference page?", answer: "Add each source to the list, or paste several DOIs, ISBNs or URLs at once, one per line. The generator sorts them into APA order, adds a, b, c to works by the same author in the same year, and lets you copy the page with italics or download it as a Word file with the bold, centered “References” heading, double spacing and 0.5-inch hanging indent." },
  { question: "How should the references be ordered in APA 7?", answer: "Alphabetically by the first author's last name, then by initials. Works by the same author go from oldest to newest, with undated (n.d.) works first. A work with no author is filed by the first significant word of its title, ignoring A, An and The." },
  { question: "What is the difference between a parenthetical and a narrative citation?", answer: "A parenthetical citation puts the author and year in brackets at the end of the sentence: (Desmond, 2012, p. 95). A narrative citation makes the author part of the sentence: Desmond (2012) argues… Two authors are joined with “&” in brackets and “and” in the sentence; three or more use the first author and “et al.” from the first citation." },
  { question: "Why does APA use sentence case for titles?", answer: "APA 7 writes article, book, chapter and web page titles in sentence case — only the first word, the first word after a colon and proper nouns are capitalized. Journal and website names keep title case. Databases often return titles in title case, so the generator converts them; check that names of people, places and organizations are still capitalized." },
  { question: "Is my data stored?", answer: "No. DOIs and ISBNs are looked up directly from Crossref and Open Library in your browser. A web address is read once by our server to pull the page title and author. Your reference page is saved only in your browser." },
];

export default function ApaCitationGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="APA Citation Generator"
      heading={["APA Citation", "Generator"]}
      intro="Paste a DOI, ISBN or web address — or a whole list of them — and get APA 7 references, in-text citations and a ready-to-submit reference page. Free, no signup."
      description={DESCRIPTION}
      updated="2026-10-14"
      faq={FAQ}
      related={[{ href: "/asa-citation-generator", label: "ASA citation generator" }, { href: "/chicago-citation-generator", label: "Chicago style citation generator" }, { href: "/acs-citation-generator", label: "ACS citation generator" }, { href: "/research-topic-generator", label: "Research topic generator" }]}
      inShort="Paste one DOI, ISBN or URL — or up to 50 at once, one per line — check the filled-in fields, and copy an APA 7th edition reference such as Desmond, M. (2012). Eviction and the reproduction of urban poverty. American Journal of Sociology, 118(1), 88–133, with its in-text citations (Desmond, 2012, p. 95) and Desmond (2012). The reference page sorts itself into APA order and downloads as a Word file with the bold “References” heading, double spacing and hanging indents."
      content={
        <>
          <SectionTitle>APA 7 references at a glance</SectionTitle>
          <ul className="list-disc pl-5 space-y-2">
            <li>Authors are written last name first with initials: Desmond, M. Separate authors with commas and put “&amp;” before the last one. List up to 20 authors; with 21 or more, give the first 19, an ellipsis, then the last author.</li>
            <li>The date follows the authors in parentheses: (2012). Web pages with a full date use (2024, March 5). Use (n.d.) when there is no date.</li>
            <li>Article, book, chapter and web page titles are in <em>sentence case</em>. Book and web page titles are italic; article and chapter titles are not.</li>
            <li>Journal articles end with the journal name and volume in italics, the issue in parentheses, the page range and the DOI: <em>American Journal of Sociology, 118</em>(1), 88–133. https://doi.org/10.1086/666082</li>
            <li>Books give the edition in parentheses after the title and the publisher — not the city. Chapters read “In E. Editor (Ed.), <em>Book title</em> (pp. 55–64). Publisher.”</li>
            <li>Leave out the website name when it is the same as the author, and use “Retrieved … from” only for pages designed to change.</li>
          </ul>
          <SectionTitle>How to format an APA reference page</SectionTitle>
          <ul className="list-disc pl-5 space-y-2">
            <li>Start the list on a new page with the heading <strong>References</strong>, bold and centered.</li>
            <li>Double-space every entry and give each one a 0.5-inch hanging indent.</li>
            <li>Order entries alphabetically by the first author&apos;s last name. One author&apos;s works go oldest first; works by the same author in the same year get letters: (2020a), (2020b).</li>
            <li>Every source cited in the text must appear on the reference page, and every entry must be cited in the text.</li>
          </ul>
          <p className="text-xs text-[var(--text-muted)]">Summarized from the <em>Publication Manual of the American Psychological Association</em>, 7th edition (2020), chapters 8–10, and the APA Style website.</p>
          <SectionTitle>Examples</SectionTitle>
          <p>Real sources, formatted by this generator (page 12 shown in the in-text citations):</p>
          <CitationExamples style="apa" ids={["desmond", "innocente", "marucho", "evicted", "gray", "un"]} headline={true} />
          <SectionTitle>How to use it</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Paste a DOI, an ISBN or the page address and press Cite — or choose the source type and type the details.</li>
            <li>Check every field against the source. Titles are converted to sentence case, so re-capitalize proper nouns.</li>
            <li>Copy the reference and the in-text citation, or add the source to your reference page.</li>
            <li>For a whole bibliography, paste all your DOIs, ISBNs and links at once, then copy the page or download it for Word or Google Docs.</li>
          </ol>
          <p>
            Writing in another style? Use the{" "}
            <Link href="/asa-citation-generator" className={linkClass}>ASA citation generator</Link> for sociology,{" "}
            <Link href="/chicago-citation-generator" className={linkClass}>Chicago style</Link> for history and the humanities, or the{" "}
            <Link href="/acs-citation-generator" className={linkClass}>ACS citation generator</Link> for chemistry. Still choosing what to write about? Try the{" "}
            <Link href="/research-topic-generator" className={linkClass}>research topic generator</Link>.
          </p>
        </>
      }
    >
      <CitationTabs current="apa" />
      <CitationGenerator family="apa" />
    </GeneratorPageShell>
  );
}
