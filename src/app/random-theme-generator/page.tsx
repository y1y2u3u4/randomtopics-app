import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import ThemeGenerator from "@/components/generators/ThemeGenerator";
import GeneratorExamples from "@/components/generators/GeneratorExamples";
import { THEMES, THEME_USES, themeGenerator } from "@/lib/generators/themes";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const PATH = "/random-theme-generator";
const TITLE = `Random Theme Generator: ${THEMES.length} Themes for Parties & Writing`;
const DESCRIPTION = `Free random theme generator with ${THEMES.length}+ themes for parties, writing, drawing, photography, events, classrooms and game jams. Filter by use and mood, draw without repeats, copy or share.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random theme generator", "random theme", "theme generator", "random party theme generator", "random writing theme generator", "random art theme generator", "game jam theme generator", "random photography theme"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const EXAMPLES = THEME_USES.slice(0, 4).map((u, i) => ({
  label: u.label,
  results: themeGenerator.generate({ use: [u.id] }, 3, [], 90 + i).results,
}));

const FAQ = [
  {
    question: "What is a random theme generator?",
    answer: `It is a tool that picks a theme for you at random so you can skip the blank-page stage. This one holds ${THEMES.length}+ themes written by hand, each tagged with what it is for and the mood it creates, and each with a one-line idea for how to use it.`,
  },
  {
    question: "What kinds of themes can I get?",
    answer: "Seven uses: party themes, writing themes, art and drawing themes, photography themes, event and wedding themes, classroom themes and game jam themes. Pick one or several, then narrow by mood: playful, elegant, cozy, dark or bold.",
  },
  {
    question: "Will I get the same theme twice?",
    answer: "Not until you have seen every theme that matches your filters. Themes are drawn without repeats, so pressing Generate again always shows something new, and the counter shows how many are in your pool.",
  },
  {
    question: "How do I choose between the themes I get?",
    answer: "Generate three to five, then ask which one you could start on today with what you already have. For groups, put the shortlist to a vote. If nothing clicks, change the mood filter rather than re-rolling endlessly.",
  },
  {
    question: "Can I use these themes for a game jam?",
    answer: "Yes. The game jam set is made of short, open prompts such as Only One Button or Shrinking World. They are meant to be read more than one way, which is what makes jam themes work. Check the jam's own rules before you start.",
  },
  {
    question: "Can I use the themes commercially?",
    answer: "Yes. A theme is an idea, not a finished work, so you can use any of them for a product, book, event or video without credit. What you make with it is yours.",
  },
];

export default function RandomThemeGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random Theme Generator"
      heading={["Random Theme", "Generator"]}
      intro={`${THEMES.length}+ themes for parties, writing, art, photography, events, classrooms and game jams. Filter by use and mood, no repeats.`}
      description={DESCRIPTION}
      updated="2026-10-27"
      faq={FAQ}
      related={[
        { href: "/random-drawing-generator", label: "Random drawing generator" },
        { href: "/topics/writing-prompts-for-kids", label: "Writing prompts for kids" },
        { href: "/charades", label: "Charades generator" },
        { href: "/random-team-generator", label: "Random team generator" },
      ]}
      inShort={
        <>
          A random theme generator picks a theme for you so you can start making. Choose what it is for (a party, a story, a drawing, a photo
          series, an event, a lesson or a game jam), optionally set a mood, and press Generate. Every theme comes with a one-line idea for using
          it, and themes do not repeat until you have seen them all.
        </>
      }
      content={
        <>
          <SectionTitle>Why a theme beats a blank page</SectionTitle>
          <p>
            A theme is a limit you choose on purpose. &quot;Make something&quot; is hard; &quot;make something about a lighthouse at night&quot; is easy.
            Most random theme tools give a bare label and leave you to work out what to do with it. Here every theme carries a short idea, such as
            how to dress the room, which angle to shoot from or what the story question is, so you can start in a minute.
          </p>
          <SectionTitle>Pick the use, then the mood</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Party and event themes</strong> — guest activities, decor and one anchor food or game, not only a colour scheme.</li>
            <li><strong>Writing themes</strong> — story questions you can answer in a scene or a novel. Pair with <Link prefetch={false} href="/topics/writing-prompts-for-kids" className={linkClass}>writing prompts</Link>.</li>
            <li><strong>Art and drawing themes</strong> — subjects with a built-in contrast. More in the <Link prefetch={false} href="/random-drawing-generator" className={linkClass}>random drawing generator</Link>.</li>
            <li><strong>Photography themes</strong> — a constraint you can finish on one walk.</li>
            <li><strong>Classroom themes</strong> — week or unit themes that tie several subjects together.</li>
            <li><strong>Game jam themes</strong> — short, open prompts that can be read in several ways.</li>
          </ul>
          <SectionTitle>Tips for using a random theme</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li>Give yourself a rule: you must use the first theme you roll, or you may re-roll once.</li>
            <li>Treat the theme as a starting point. Reading it sideways usually gives the best idea.</li>
            <li>For groups, roll five and vote. For solo work, set a timer and start before you doubt it.</li>
            <li>Combine two themes from different uses for something unexpected, for example a cozy game jam theme with a dark art theme.</li>
          </ul>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real draws, three themes each:"} sets={EXAMPLES} />
        </>
      }
    >
      <ThemeGenerator />
    </GeneratorPageShell>
  );
}
