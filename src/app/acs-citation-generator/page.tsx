import type { Metadata } from "next";
import GeneratorPageShell, { SectionTitle } from "@/components/generators/GeneratorPageShell";
import CitationGenerator from "@/components/generators/CitationGenerator";
import CitationTabs from "@/components/generators/CitationTabs";
import CitationExamples from "@/components/generators/CitationExamples";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/acs-citation-generator";
const TITLE = "ACS Citation Generator — ACS Bibliography & Reference Format, Free";
const DESCRIPTION =
  "Free ACS citation and bibliography generator (ACS Guide to Scholarly Communication): paste a DOI, ISBN or URL and get a numbered ACS reference — bold year, italic volume, abbreviated journal, DOI — plus superscript in-text numbers. Copy with formatting, no signup.";

const SOCIAL = generatorSocial({ card: "acs-citation-generator", title: TITLE, description: DESCRIPTION, alt: "ACS Citation Generator \u2014 reference list and in-text citation" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["acs citation generator", "acs bibliography generator", "acs reference format", "acs style citation", "acs citation format", "american chemical society citation", "acs citation style generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  { question: "What is ACS citation style?", answer: "ACS style is the American Chemical Society's format for chemistry and related sciences. References are numbered in the order they are cited and the text uses superscript numbers. Journal entries put the year in bold and the volume in italics." },
  { question: "Is an ACS bibliography alphabetical?", answer: "No. In the numbered ACS system the reference list follows the order in which sources are first cited, so reference 1 is the first source mentioned in your paper. This generator numbers your list in the order you add sources." },
  { question: "How do I find the abbreviated journal title?", answer: "Use the CAS Source Index (CASSI). When you cite by DOI, the generator fills in the abbreviation Crossref has for ACS journals and many others; check it and edit the field if needed." },
  { question: "How many authors do I list in ACS?", answer: "List all authors up to ten. If there are more than ten, list the first ten, then a semicolon and “et al.”" },
  { question: "Does the copied citation keep bold and italics?", answer: "Yes. The Copy buttons put formatted text on the clipboard, so the bold year and italic volume and journal paste into Word, Google Docs and most editors. Plain-text fields get the unformatted version." },
];

export default function AcsCitationGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="ACS Citation Generator"
      heading={["ACS Citation", "Generator"]}
      intro="Paste a DOI, ISBN or web address and get a numbered ACS reference with bold year and italic volume. Free, no signup."
      description={DESCRIPTION}
      updated="2026-10-12"
      faq={FAQ.map((f) => ({ ...f, answer: f.answer.replace(/<[^>]+>/g, "") }))}
      related={[{ href: "/asa-citation-generator", label: "ASA citation generator" }, { href: "/chicago-citation-generator", label: "Chicago style citation generator" }, { href: "/writing", label: "Writing prompts" }, { href: "/random-word-generator", label: "Random word generator" }]}
      inShort="Paste a DOI, ISBN or URL and copy an ACS reference such as Marucho, M.; Kelley, C. T.; Pettitt, B. M. Title. J. Chem. Theory Comput. 2008, 4 (3), 385–396. DOI: 10.1021/ct700202h — with the year in bold and the volume in italics kept when you paste into Word or Google Docs. References are numbered in the order you add them and cited with superscript numbers."
      content={
        <>
          <SectionTitle>ACS Citation rules at a glance</SectionTitle>
          <ul className="list-disc pl-5 space-y-2">
            <li dangerouslySetInnerHTML={{ __html: "References are numbered in the order they are first cited. In the text, cite them with superscript numbers (or italic numbers in parentheses); a source cited again keeps its first number." }} />
            <li dangerouslySetInnerHTML={{ __html: "Write each author as last name, then initials (Kelley, C. T.), separated by semicolons. List up to ten authors; after the tenth, add a semicolon and “et al.”" }} />
            <li dangerouslySetInnerHTML={{ __html: "Journal article: Author; Author. Article Title. <em>Abbreviated Journal</em> <strong>Year</strong>, <em>Volume</em> (Issue), pages. DOI: 10.xxxx/…" }} />
            <li dangerouslySetInnerHTML={{ __html: "Journal titles are abbreviated as in the CAS Source Index (CASSI) — for example <em>J. Chem. Educ.</em>; one-word titles such as <em>Nature</em> are not abbreviated. Recent guidance allows full titles too, as long as the list is consistent." }} />
            <li dangerouslySetInnerHTML={{ __html: "Book: Author. <em>Book Title</em>, 2nd ed.; Publisher: Place, Year. The place is often omitted for large publishers." }} />
            <li dangerouslySetInnerHTML={{ __html: "Chapter: Author. Chapter Title. In <em>Book Title</em>; Editor, A., Editor, B., Eds.; Publisher, Year; pp 361–377." }} />
            <li dangerouslySetInnerHTML={{ __html: "Web page: Author or organization. <em>Title</em>. Site name, date. URL (accessed YYYY-MM-DD). When a DOI is given, no access date is needed." }} />
            <li dangerouslySetInnerHTML={{ __html: "Article and chapter titles are not italic. Use either title case or sentence case for them, and keep it the same throughout the list." }} />
          </ul>
          <p className="text-xs text-[var(--text-muted)]" dangerouslySetInnerHTML={{ __html: "Summarized from <em>The ACS Guide to Scholarly Communication</em> (American Chemical Society, 2020) and university library guides based on it. Individual ACS journals can add their own requirements." }} />
          <SectionTitle>Examples</SectionTitle>
          <p>Real sources, formatted by this generator:</p>
          <CitationExamples style="acs" ids={["marucho", "chen", "atkins", "gray", "pubchem"]} headline={false} />
          <SectionTitle>How to use it</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Paste a DOI, an ISBN or the page address and press Cite — or choose the source type and type the details.</li>
            <li>Check every field against the source. Metadata databases are not always complete, so fix names, capitalization and pages here.</li>
            <li>Copy the reference and the in-text citation, or add the source to your list and copy the whole list at the end.</li>
          </ol>
        </>
      }
    >
      <CitationTabs current="acs" />
      <CitationGenerator family="acs" />
    </GeneratorPageShell>
  );
}
