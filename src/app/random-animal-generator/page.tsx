import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import AnimalGenerator from "@/components/generators/AnimalGenerator";
import { ANIMALS } from "@/lib/generators/animals";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const PATH = "/random-animal-generator";
const TITLE = "Random Animal Generator — Pictures & Fun Facts, Free";
const DESCRIPTION = `Free random animal generator with ${ANIMALS.length}+ animals, each with an illustration and a fun fact. Filter by mammals, birds, ocean, farm or easy animals for kids — great for drawing prompts and guessing games.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random animal generator", "random animal", "animal generator", "random animal picker", "random animal to draw", "random animal facts", "random sea animal generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
};

const FAQ = [
  {
    question: "How does the random animal generator work?",
    answer: `Press Generate and the tool picks animals at random from a hand-checked list of ${ANIMALS.length}+ real animals. Each result shows the animal's name, what kind of animal it is, where it lives and one fun fact. Animals never repeat until you have seen every animal that matches your filters.`,
  },
  {
    question: "Can I get only sea animals, farm animals or mammals?",
    answer:
      "Yes. Use the Type filter for mammals, birds, reptiles, amphibians, fish or bugs and sea creatures, and the Where it lives filter for ocean, farm, pets, jungle, savanna, polar and more. Choose several chips at once to combine them.",
  },
  {
    question: "Is it good for kids?",
    answer:
      "Choose Easy (kids know it) to limit results to animals most young children recognise, such as the elephant, penguin or ladybug. Every fact is short and classroom-friendly. Choose Tricky for older students who want animals like the okapi, axolotl or pangolin.",
  },
  {
    question: "How can I use it as a drawing prompt?",
    answer:
      "Generate one animal, set a timer for five or ten minutes and draw it — or generate two animals and draw a mash-up of both. Artists also use it for character design and daily sketch challenges.",
  },
  {
    question: "Can I share the animals I got?",
    answer:
      "Yes. The page address updates with your filters and results, so Copy share link sends someone exactly the same animals. Copy results gives you a plain-text list for a worksheet or chat.",
  },
];

export default function RandomAnimalGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random Animal Generator"
      heading={["Random Animal", "Generator"]}
      intro={`${ANIMALS.length}+ real animals with a picture and a fun fact. Filter by type or habitat, generate one or a dozen, no repeats.`}
      description={DESCRIPTION}
      updated="2026-10-10"
      faq={FAQ}
      related={[
        { href: "/charades", label: "Charades generator" },
        { href: "/question-of-the-day-for-students", label: "Question of the day for students" },
        { href: "/topics/writing-prompts-for-kids", label: "Writing prompts for kids" },
        { href: "/would-you-rather", label: "Would you rather" },
      ]}
      content={
        <>
          <SectionTitle>A random animal, with something to learn</SectionTitle>
          <p>
            Most random animal pickers give you a bare name. This <strong>random animal generator</strong> gives you the animal, a friendly
            illustration and a fact worth repeating — that a group of flamingos is called a flamboyance, or that an octopus has three hearts.
            Every animal is a real species or well-known kind, and every fact has been checked for accuracy, so it works in a classroom as well
            as at a party.
          </p>
          <SectionTitle>Filters that match how people actually use it</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Type</strong> — mammals, birds, reptiles, amphibians, fish, or bugs and sea creatures.</li>
            <li><strong>Where it lives</strong> — ocean, farm, pets, jungle, savanna, forest, desert, polar, rivers, mountains and more.</li>
            <li><strong>Difficulty</strong> — easy animals young kids know, or tricky ones for quizzes and older students.</li>
          </ul>
          <SectionTitle>Ideas for using random animals</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Drawing prompts</strong> — draw the animal in two minutes, then in ten; or combine two random animals into one creature.</li>
            <li><strong>Guessing games</strong> — one player reads the fun fact aloud and the others guess the animal, or act it out like <Link href="/charades" className={linkClass}>charades</Link>.</li>
            <li><strong>Class research</strong> — give each student a random animal for a one-page report or a presentation.</li>
            <li><strong>Story starters</strong> — make the animal the hero of a short story; see our <Link href="/topics/writing-prompts-for-kids" className={linkClass}>writing prompts for kids</Link>.</li>
            <li><strong>Team names</strong> — our <Link href="/random-team-generator" className={linkClass}>random team generator</Link> already names teams after animals.</li>
          </ul>
          <p>
            The full list covers more than a hundred mammals, dozens of birds, ocean life from clownfish to blue whales, and the insects and
            spiders kids love to find. Generate as many as you like — the same animal will not come back until you have seen them all.
          </p>
        </>
      }
    >
      <AnimalGenerator locale="en" />
    </GeneratorPageShell>
  );
}
