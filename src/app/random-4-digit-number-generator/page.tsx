import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import FourDigitGenerator from "@/components/generators/FourDigitGenerator";
import GeneratorExamples from "@/components/generators/GeneratorExamples";
import { DEFAULT_FOUR_DIGIT, candidatePool, generateFourDigit } from "@/lib/generators/fourDigit";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

const PATH = "/random-4-digit-number-generator";
const TITLE = "Random 4 Digit Number Generator — Up to 100 Numbers, PIN-Style 0000–9999";
const DESCRIPTION =
  "Free random 4 digit number generator: make 1 to 100 four-digit numbers from 0000–9999 (with leading zeros) or 1000–9999. Options for no repeats, no repeated digits and skipping weak PINs like 1234. Uses your browser's secure random generator.";

const SOCIAL = generatorSocial({ card: "character-name-generator", title: TITLE, description: DESCRIPTION, alt: "Random 4 digit number generator — PIN-style numbers from 0000 to 9999" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random 4 digit number generator", "random four digit number", "4 digit pin generator", "random pin generator", "4 digit code generator", "random 4 digit code", "random number 1000-9999"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

// Real output; this page is rendered on the server, so these examples use a fixed sequence.
let state = 12345;
const fixed = (max: number) => { state = (Math.imul(state, 1103515245) + 12345) >>> 0; return state % max; };
const take = (o: Partial<typeof DEFAULT_FOUR_DIGIT>) => generateFourDigit({ ...DEFAULT_FOUR_DIGIT, count: 4, ...o }, fixed).numbers.map((n) => ({ title: n }));
const EXAMPLES = [
  { label: "PIN style, weak PINs skipped", results: take({}) },
  { label: "1000–9999, no repeated digits", results: take({ range: "no-zero", noRepeatedDigits: true }) },
  { label: "Not birth-year like", results: take({ avoidYears: true }) },
];
const POOL_ALL = candidatePool({ range: "pin", noRepeatedDigits: false, avoidWeak: false, avoidYears: false }).length;
const POOL_WEAK = candidatePool({ range: "pin", noRepeatedDigits: false, avoidWeak: true, avoidYears: false }).length;

const FAQ = [
  {
    question: "How do I generate a random 4 digit number?",
    answer:
      "Choose how many you want, pick 0000–9999 or 1000–9999, and press Generate. You get up to 100 numbers per click, and you can tap a number to copy it or copy the whole list. Change an option and the list refreshes straight away.",
  },
  {
    question: "Why does the range matter: 0000–9999 or 1000–9999?",
    answer:
      "PIN codes can start with zero, so 0000–9999 gives all 10,000 possible codes and shows leading zeros such as 0472. The 1000–9999 range gives 9,000 true four-digit numbers with no leading zero, which suits IDs, raffle numbers and test data.",
  },
  {
    question: "Are the numbers truly random?",
    answer:
      "They come from the Web Crypto generator in your browser (crypto.getRandomValues), the same source websites use for security tokens, and the code removes bias when mapping it to your range. That is better than the plain Math.random() used by many simple generators.",
  },
  {
    question: "Which PINs does \"avoid weak PINs\" remove?",
    answer:
      "It removes all-same-digit codes (0000, 7777), straight sequences up or down (1234, 4321), repeated pairs (1212, 1122), and a few often-guessed codes such as 2000 and 1004. That is 211 of the 10,000 possible codes, so you still have 9,789 to draw from.",
  },
  {
    question: "Can I use this to pick a PIN for my bank card or phone?",
    answer:
      "It is fine for a new phone passcode, a locker or a door code, because everything runs locally in your browser and nothing is sent or saved. For a bank card, use the PIN your bank issues or lets you choose, and never reuse it elsewhere. Any four-digit code is only ever one of 10,000 guesses, so a lockout after a few tries matters more than the number.",
  },
  {
    question: "Does the \"no repeats\" option change anything?",
    answer:
      "With it on, no number appears twice in the same list, like drawing from a hat. With it off, a number can repeat, as with rolling dice. If you ask for more numbers than match your settings, you get every matching number once and a note says so.",
  },
];

export default function RandomFourDigitNumberGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random 4 Digit Number Generator"
      heading={["Random 4 Digit Number", "Generator"]}
      intro="This random 4 digit number generator makes 1 to 100 numbers at once, from 0000–9999 or 1000–9999, with options to skip repeats and weak PINs. Free, private and no sign-up."
      description={DESCRIPTION}
      updated="2026-11-02"
      faq={FAQ}
      inShort={
        <>
          A random 4 digit number generator picks numbers between 0000 and 9999, or 1000 and 9999. This one makes up to 100 at a time,
          keeps leading zeros for PIN-style codes, and can skip repeated digits, years and weak PINs like 1234. It uses your browser&apos;s
          secure random generator, runs on your device, and is free with no sign-up.
        </>
      }
      related={[
        { href: "/random-number-generator", label: "Random number generator" },
        { href: "/number-randomizer", label: "Number randomizer" },
        { href: "/dice-roller", label: "Dice roller" },
        { href: "/random-word-generator", label: "Random word generator" },
      ]}
      content={
        <>
          <SectionTitle>What you can do with it</SectionTitle>
          <p>
            Four digits is a handy size: easy to remember, quick to type and large enough to feel unpredictable. People use a{" "}
            <strong>random 4 digit number generator</strong> for phone and lock-box codes, raffle and giveaway tickets, order or test IDs,
            classroom seat numbers, and to seed a game. Pick the range, set how many you need and copy them all in one go.
          </p>
          <SectionTitle>The four filters</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>No repeats in the list</strong> — each number appears once, like names drawn from a hat.</li>
            <li><strong>No repeated digits</strong> — all four digits differ (5,040 of the 10,000 codes qualify), so 1123 and 7070 are out.</li>
            <li><strong>Avoid weak PINs</strong> — drops {(POOL_ALL - POOL_WEAK).toLocaleString("en-US")} easy guesses, leaving {POOL_WEAK.toLocaleString("en-US")}.</li>
            <li><strong>Avoid years 1950–2030</strong> — keeps out codes that look like a birth year or an anniversary, which people often choose.</li>
          </ul>
          <SectionTitle>About PINs and privacy</SectionTitle>
          <p>
            The page generates numbers on your own device and does not send or store them, so what you copy is only ever on your screen.
            There are only 10,000 four-digit codes, so no choice is strong against unlimited guesses; what protects a card or phone is the
            attempt limit. Use a number from here for a new passcode, and let your bank set or reset a card PIN through its own channels.
          </p>
          <SectionTitle>Need a different kind of number?</SectionTitle>
          <p>
            For any range, such as 1–1000 or negative values, use the{" "}
            <Link prefetch={false} href="/random-number-generator" className={linkClass}>random number generator</Link> or the{" "}
            <Link prefetch={false} href="/number-randomizer" className={linkClass}>number randomizer</Link>. For a number from one to six,
            roll the <Link prefetch={false} href="/dice-roller" className={linkClass}>dice roller</Link>; and to turn a code into a word,
            try the <Link prefetch={false} href="/random-word-generator" className={linkClass}>random word generator</Link>.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Sample output for three setups:"} sets={EXAMPLES} />
        </>
      }
    >
      <FourDigitGenerator />
    </GeneratorPageShell>
  );
}
