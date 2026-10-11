import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import ColorGenerator from "@/components/generators/ColorGenerator";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/random-color-generator";
const TITLE = "Random Color Generator — HEX, RGB & HSL Palettes, Lock & Copy";
const DESCRIPTION =
  "Free random color generator: get up to 10 random colors at once in HEX, RGB and HSL, lock the ones you like, and build analogous, complementary, triadic, monochrome or pastel palettes. One-click copy, CSS export and share links.";

const SOCIAL = generatorSocial({ card: "random-color-generator", title: TITLE, description: DESCRIPTION, alt: "Random Color Generator — paint swatches and palette" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random color generator", "random colour generator", "random color", "color palette generator", "random hex color", "random rgb color", "color picker random"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const FAQ = [
  {
    question: "How does the random color generator work?",
    answer:
      "Choose how many colors you want (1 to 10) and a palette rule, then press Generate colors or the space bar. Each color is shown with its HEX code and can be switched to RGB or HSL. Click a swatch to copy its value.",
  },
  {
    question: "How do I keep a color I like?",
    answer:
      "Click the lock icon under it. Locked colors stay in place while every other swatch changes on the next generate, so you can build a palette one color at a time.",
  },
  {
    question: "What do the palette rules mean?",
    answer:
      "Random picks any colors. Analogous uses neighbouring hues for calm, cohesive palettes; Complementary pairs a hue with its opposite for contrast; Triadic spaces three hues evenly around the wheel; Monochrome keeps one hue at different lightness; Pastel gives soft, light colors.",
  },
  {
    question: "Can I export the colors?",
    answer:
      "Copy all gives every color in the current format, one per line; Copy as CSS gives ready-to-paste custom properties (--color-1: #A3C4F3;). The share link reopens exactly the same palette, including locks.",
  },
  {
    question: "Is a random color good for a drawing challenge?",
    answer:
      "Yes — generate three colors and draw something using only those. Pair it with the random drawing generator for a subject, or the random word generator with the drawable filter on.",
  },
];

export default function RandomColorGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random Color Generator"
      heading={["Random Color", "Generator"]}
      intro="Random colors and palettes in HEX, RGB and HSL. Lock the ones you like, regenerate the rest with the space bar, copy in one click."
      description={DESCRIPTION}
      updated="2026-10-11"
      faq={FAQ}
      related={[
        { href: "/random-drawing-generator", label: "Random drawing generator" },
        { href: "/random-word-generator?use=draw", label: "Drawable random words" },
        { href: "/random-animal-generator", label: "Random animal generator" },
      ]}
      content={
        <>
          <SectionTitle>Random colors that are actually usable</SectionTitle>
          <p>
            A truly random RGB value is often muddy. This <strong>random color generator</strong> works in HSL, so you can ask for pure
            randomness or for palettes that follow color theory — analogous, complementary, triadic, monochrome or pastel — and every swatch
            shows readable text and all three formats designers and developers use.
          </p>
          <SectionTitle>Build a palette in four steps</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Pick a palette rule and how many colors you need.</li>
            <li>Press the space bar until one color jumps out, then lock it.</li>
            <li>Keep generating — locked colors stay, the rest change around them.</li>
            <li>Copy the HEX codes or the CSS variables, or share the link.</li>
          </ol>
          <SectionTitle>Ideas</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Art challenges</strong> — three random colors + a subject from the <Link href="/random-drawing-generator" className={linkClass}>random drawing generator</Link>.</li>
            <li><strong>Pictionary twist</strong> — draw a <Link href="/random-word-generator?use=draw" className={linkClass}>random drawable word</Link> using only the colors you got.</li>
            <li><strong>Design work</strong> — brand moodboards, UI theme tests, chart colors, slide backgrounds.</li>
            <li><strong>Classroom</strong> — color-mixing lessons, naming colors in another language, warm vs cool sorting.</li>
          </ul>
        </>
      }
    >
      <ColorGenerator />
    </GeneratorPageShell>
  );
}
