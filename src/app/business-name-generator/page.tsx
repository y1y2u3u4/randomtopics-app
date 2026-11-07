import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import BusinessNameGenerator from "@/components/generators/BusinessNameGenerator";
import { INDUSTRIES, businessNameGenerator } from "@/lib/generators/businessNames";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";

const PATH = "/business-name-generator";
const TITLE = "Business Name Generator — Free Name Ideas by Industry & Style";
const DESCRIPTION = `Free business name generator: brandable name ideas for ${INDUSTRIES.length} industries (café, tech, fitness, beauty, cleaning, Etsy shop and more) in modern, classic, playful, luxury or nature styles, each with a domain idea. No sign-up.`;

const SOCIAL = generatorSocial({ card: "random-name-generator", title: TITLE, description: DESCRIPTION, alt: "Business Name Generator — name ideas by industry" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["business name generator", "random business name generator", "company name generator", "business name ideas", "shop name generator", "brand name generator", "small business name ideas", "etsy shop name generator", "bakery name generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const EXAMPLES = [
  { label: "Café & bakery", results: businessNameGenerator.generate({ industry: ["food"] }, 4, [], 91).results },
  { label: "Tech, modern style", results: businessNameGenerator.generate({ industry: ["tech"], style: ["modern"] }, 4, [], 92).results },
  { label: "Handmade shop, nature style", results: businessNameGenerator.generate({ industry: ["crafts"], style: ["nature"] }, 4, [], 93).results },
];

const FAQ = [
  {
    question: "How does the business name generator work?",
    answer: "Each name joins a style word (the feel, like Juniper or Sterling) with an industry word (what you do, like Bakery or Labs) in one of four common naming patterns: two words, one blended word, \"X & Y\" or \"The X Y\". Pick an industry and a style to narrow the ideas.",
  },
  {
    question: "Are these names available to use?",
    answer: "We can't check that for you. Before you choose a name, search your local business register and trademark database, check that the .com or a local domain is free, and look for social handles. The domain shown under each name is only an idea.",
  },
  {
    question: "What makes a good business name?",
    answer: "Short, easy to say and spell, and not too close to a competitor. It should hint at what you do or how you want customers to feel. Say it out loud, type it into a search bar and imagine it on a sign before you decide.",
  },
  {
    question: "Can I get names for an Etsy or online shop?",
    answer: "Yes. Choose Handmade & Etsy shop for names like \"Willow & Thread\" or \"Fern Pottery\". Combine it with the Nature or Playful style for a softer, crafty feel.",
  },
  {
    question: "Do you store the names I generate?",
    answer: "No. Names are generated in your browser and are not saved or sold. You can copy a name, copy the whole list or share a link to the exact results.",
  },
];

export default function BusinessNameGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Business Name Generator"
      heading={["Business Name", "Generator"]}
      intro={`Get 10 business name ideas per click for ${INDUSTRIES.length} industries in five styles, each with a domain idea. Free, no sign-up, nothing saved.`}
      description={DESCRIPTION}
      updated="2026-11-08"
      faq={FAQ}
      inShort={
        <>
          A business name generator suggests names for a new company or shop. This one combines a style word with an industry word in four
          proven patterns, covers {INDUSTRIES.length} industries from cafés to consulting, and shows a domain idea under each name. Check
          trademarks and domains before you choose.
        </>
      }
      related={[
        { href: "/username-generator", label: "Username generator" },
        { href: "/acronym-generator", label: "Acronym generator" },
        { href: "/random-name-generator", label: "Random name generator" },
        { href: "/random-word-generator", label: "Random word generator" },
      ]}
      content={
        <>
          <SectionTitle>Four naming patterns that work</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Two words</strong> — &quot;Maple Kitchen&quot;: clear and easy to remember.</li>
            <li><strong>Blended word</strong> — &quot;Novastack&quot;: short, brandable and easier to find as a domain.</li>
            <li><strong>X &amp; Y</strong> — &quot;Sterling &amp; Partners&quot;: feels established and personal.</li>
            <li><strong>The X Y</strong> — &quot;The Velvet Studio&quot;: good for shops, studios and cafés.</li>
          </ul>
          <SectionTitle>Before you pick a name</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Search the name plus your city and industry to see who already uses it.</li>
            <li>Check your country&apos;s trademark database and business register.</li>
            <li>Check the domain and social handles. If the name is taken, try a short version from the <Link prefetch={false} href="/acronym-generator" className={linkClass}>acronym generator</Link>.</li>
            <li>Say it out loud to five people and ask them to spell it back.</li>
          </ol>
          <SectionTitle>Need a different kind of name?</SectionTitle>
          <p>
            For a gamer tag or social handle, use the <Link prefetch={false} href="/username-generator" className={linkClass}>username generator</Link>. For a
            character or a person&apos;s name, try the <Link prefetch={false} href="/random-name-generator" className={linkClass}>random name generator</Link>.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real output from three filters:"} sets={EXAMPLES} />
        </>
      }
    >
      <BusinessNameGenerator />
    </GeneratorPageShell>
  );
}
