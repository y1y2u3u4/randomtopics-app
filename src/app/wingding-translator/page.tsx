import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import WingdingTranslator from "@/components/generators/WingdingTranslator";
import GeneratorExamples from "@/components/generators/GeneratorExamples";
import { toWingdings } from "@/lib/generators/wingdings";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/wingding-translator";
const TITLE = "Wingding Translator — English to Wingdings & Back, Copy-Paste Symbols + Chart";
const DESCRIPTION =
  "Free Wingdings translator: type English and get Wingdings symbols you can copy and paste anywhere, or paste symbols to decode them back to text. Swap direction, see each letter under its symbol, and use the full A–Z, a–z and 0–9 chart.";

const SOCIAL = generatorSocial({ card: "fantasy-name-generator", title: TITLE, description: DESCRIPTION, alt: "Wingding translator — English to Wingdings symbols and back" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["wingding translator", "wingdings translator", "wingdings to english", "english to wingdings", "wingdings converter", "wingdings chart", "wingdings decoder", "wingdings copy and paste"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const ex = (s: string) => ({ title: toWingdings(s), subtitle: s });
const EXAMPLES = [
  { label: "Greetings", results: [ex("Hello"), ex("Good luck"), ex("Thank you")] },
  { label: "Short messages", results: [ex("I love you"), ex("Meet at noon"), ex("Keep it secret")] },
  { label: "Single words", results: [ex("Wingdings"), ex("Zodiac"), ex("Cipher")] },
];

const FAQ = [
  {
    question: "How do I translate English to Wingdings?",
    answer:
      "Type or paste your text into the top box while English → Wingdings is selected. The symbols appear below as you type. Press Copy result to paste them into a chat, document or social post. Because they are normal Unicode characters, you do not need to install the Wingdings font.",
  },
  {
    question: "How do I translate Wingdings back to English?",
    answer:
      "Switch to Wingdings → English and paste the symbols. Each symbol is looked up in the Wingdings table and replaced by the key that produces it on a keyboard, so ✡ becomes Y and ♏ becomes e. Characters that are not Wingdings symbols, such as spaces and emoji, are left as they are.",
  },
  {
    question: "Why do I see boxes or blank squares instead of some symbols?",
    answer:
      "Many Wingdings glyphs map to Unicode characters added in 2014 (Unicode 7.0), for example the folder and mailbox icons. Older phones and computers may not have a font that draws them, so they show as an empty box. The text is still correct and will display properly on a newer device.",
  },
  {
    question: "Does it work if I just change the font to Wingdings in Word?",
    answer:
      "Switching the font in Word or Google Docs changes only how the letters look; the underlying text stays Latin letters, so pasting it elsewhere brings back plain text. This tool outputs the symbol characters themselves, which keep their look in any app that has a font for them.",
  },
  {
    question: "What does NYC say in Wingdings?",
    answer:
      "Typing NYC in Wingdings gives a skull and crossbones, a Star of David and a thumbs up. In 1992, just days after Windows 3.1 shipped, this was spotted and widely read as a hidden message. Microsoft denied it was deliberate and said the order of the glyphs was largely arbitrary, and it is generally treated as coincidence.",
  },
  {
    question: "Is Wingdings a secret code or a cipher?",
    answer:
      "No. It is a font whose characters are pictures instead of letters, and the mapping is public. That makes it a simple substitution that anyone can reverse with a chart, fine for puzzles and games, but not for hiding anything private.",
  },
];

export default function WingdingTranslatorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Wingding Translator"
      heading={["Wingding", "Translator"]}
      intro="This wingding translator turns English into Wingdings symbols you can copy anywhere, and decodes pasted Wingdings back into plain text. Free, instant and no sign-up."
      description={DESCRIPTION}
      updated="2026-11-02"
      faq={FAQ}
      inShort={
        <>
          A Wingdings translator converts letters into the pictures the Wingdings font shows for them (A becomes ✌, e becomes ♏) and back
          again. This one outputs real Unicode symbols, so the result survives copy and paste without the font. It covers all 26 uppercase
          and lowercase letters, the digits and punctuation, and it is free with no sign-up.
        </>
      }
      related={[
        { href: "/fancy-text-generator", label: "Fancy text generator" },
        { href: "/weird-text-generator", label: "Weird text generator" },
        { href: "/glitch-text-generator", label: "Glitch text generator" },
        { href: "/acronym-generator", label: "Acronym generator" },
      ]}
      content={
        <>
          <SectionTitle>What the Wingdings translator does</SectionTitle>
          <p>
            Wingdings, made by Microsoft in 1990 and shipped with Windows 3.1, is a font of pictures: hands, zodiac signs, folders,
            squares and crosses instead of letters. Typing &quot;Hi&quot; in the font shows two symbols in place of H and i. Normally the
            symbols exist only while the font is applied. This <strong>Wingdings translator</strong> uses the Unicode characters that
            correspond to each glyph, so the symbols stay symbols when you paste them into a message, a profile bio or a spreadsheet.
          </p>
          <SectionTitle>Reading and writing both directions</SectionTitle>
          <p>
            The tool works as an <strong>English to Wingdings</strong> converter and a <strong>Wingdings to English</strong> decoder. Use
            Swap direction to feed the result back in as input and check the round trip. Turn on the letter view to see each source
            character under its symbol, which helps when you are decoding a puzzle by hand or learning the table.
          </p>
          <SectionTitle>A note on the 1992 &quot;NYC&quot; story</SectionTitle>
          <p>
            Soon after Windows 3.1 came out, people noticed that N, Y and C typed in Wingdings produce a skull and crossbones, a Star of
            David and a thumbs up, and a rumor grew that it was a message about New York. Microsoft said the arrangement of the glyphs
            was largely random. Try it above by pressing the NYC example: the mapping is the same one the chart shows, nothing more.
          </p>
          <SectionTitle>Why some symbols look different</SectionTitle>
          <p>
            Each device draws a character with its own font, so a hand or a bomb may appear as a color emoji on a phone and as a flat
            outline on a desktop. Characters added to Unicode in 2014 may be missing on very old systems and show as a box. Colors and
            outlines change the look only, not the meaning, and the decoder reads them all the same.
          </p>
          <SectionTitle>More text styles to try</SectionTitle>
          <p>
            For bold, script and bubble letters use the{" "}
            <Link prefetch={false} href="/fancy-text-generator" className={linkClass}>fancy text generator</Link>; for upside-down and
            odd letterforms the <Link prefetch={false} href="/weird-text-generator" className={linkClass}>weird text generator</Link>;
            and for creepy stacked accents the{" "}
            <Link prefetch={false} href="/glitch-text-generator" className={linkClass}>glitch text generator</Link>. If you like word
            puzzles, the <Link prefetch={false} href="/acronym-generator" className={linkClass}>acronym generator</Link> turns any phrase
            into a short code.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Real output from the translator, with the English underneath:"} sets={EXAMPLES} />
        </>
      }
    >
      <WingdingTranslator />
    </GeneratorPageShell>
  );
}
