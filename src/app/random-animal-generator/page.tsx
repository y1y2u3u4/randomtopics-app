import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import AnimalGenerator from "@/components/generators/AnimalGenerator";
import { ANIMALS } from "@/lib/generators/animals";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import GeneratorExamples from "@/components/generators/GeneratorExamples";
import { animalGenerator } from "@/lib/generators/animals";
import RankBoost, { faqForSchema } from "@/components/RankBoost";
import type { BoostSection } from "@/components/RankBoost";
import { ANIMAL_BOOST } from "@/data/rankBoost";
import AnswerFirst from "@/components/AnswerFirst";
import { spreadPick } from "@/data/popularGenerators";

const PATH = "/random-animal-generator";
const TITLE = "Random Animal Generator – Free Pictures & Facts";
const DESCRIPTION = "Get random animals with pictures and fun facts instantly. Filter by habitat or animal type, pick up to 12 at once, and avoid repeats. Free, no signup.";

const SOCIAL = generatorSocial({ card: "random-animal-generator", title: TITLE, description: DESCRIPTION, alt: "Random Animal Generator — illustrated animals with fun facts" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: ["random animal generator", "random animal", "animal generator", "random animal picker", "random animal to draw", "random animal facts", "random sea animal generator"],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

// Real output from the generator with fixed seeds.
const EXAMPLES = [
  { label: "Ocean animals", results: animalGenerator("en").generate({ where: ["ocean"] }, 4, [], 81).results },
  { label: "Easy for kids", results: animalGenerator("en").generate({ level: ["kids"] }, 4, [], 82).results },
  { label: "Birds", results: animalGenerator("en").generate({ type: ["bird"] }, 4, [], 83).results },
];

const PICK_ANIMALS = spreadPick(ANIMALS, 5, 11);
const CLASS_COUNT = (c: string) => ANIMALS.filter((a) => a.class === c).length;
const firstOf = (c: string) => ANIMALS.find((a) => a.class === c)?.en ?? "";

const FAQ = [
  {
    question: "Can you give me two or three random animals at once?",
    answer: `Yes. The generator shows 3 animals by default, and you can switch to 1, 6, 9 or 12; no animal repeats until the list runs out. For example: ${PICK_ANIMALS[1].en}, ${PICK_ANIMALS[3].en} and ${PICK_ANIMALS[4].en}. It is a quick way to start a mash-up drawing or a "which animal would win" debate.`,
  },
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

const CLASS_ROWS: [string, string][] = [
  ["mammal", "Mammals"], ["bird", "Birds"], ["reptile", "Reptiles"], ["amphibian", "Amphibians"], ["fish", "Fish"], ["invertebrate", "Bugs & sea creatures"],
];
const HABITAT_ROWS: [string, string][] = [
  ["ocean", "Ocean"], ["farm", "Farm"], ["pet", "Pets"], ["jungle", "Jungle"], ["savanna", "Savanna"], ["forest", "Forest"],
  ["desert", "Desert"], ["polar", "Polar"], ["freshwater", "Rivers & lakes"], ["mountain", "Mountains"], ["grassland", "Grassland"], ["wetland", "Wetland"],
];
const examplesOf = (list: typeof ANIMALS) => list.slice(0, 6).map((a) => a.en).join(", ");

const BROWSE_SECTION: BoostSection = {
  h2: `What's in the Random Animal List: ${ANIMALS.length} Animals by Type and Habitat`,
  id: "animal-list",
  blocks: [
    { t: "p", x: "Use the filters above to draw only the kind of animal you need. This is what each filter contains, with a few examples from the list. An animal can live in more than one habitat." },
    { t: "h3", x: "Animals by type" },
    { t: "table", head: ["Type", "Animals", "Examples"], rows: CLASS_ROWS.map(([id, label]) => { const l = ANIMALS.filter((a) => a.class === id); return [label, String(l.length), examplesOf(l)]; }) },
    { t: "h3", x: "Animals by habitat" },
    { t: "table", head: ["Where it lives", "Animals", "Examples"], rows: HABITAT_ROWS.map(([id, label]) => { const l = ANIMALS.filter((a) => a.habitats.includes(id)); return [label, String(l.length), examplesOf(l)]; }) },
    { t: "p", x: `${ANIMALS.filter((a) => a.kids).length} of the animals are marked Easy, meaning most young children know them.` },
  ],
};

const ANSWER = (
    <AnswerFirst
      path={PATH}
      question="Give me a random animal"
      answer={`Here are five random animals: ${PICK_ANIMALS.map((a) => a.en).join(", ")}. Tap Generate above for one at a time, with a picture and a fun fact. The list has ${ANIMALS.length}+ real animals, and you can limit it to mammals, birds, sea animals or kid-friendly picks.`}
      table={{
        caption: "Animals in the generator by type",
        head: ["Type", "Animals", "Example"],
        rows: ([["mammal", "Mammals"], ["bird", "Birds"], ["fish", "Fish"], ["reptile", "Reptiles"], ["amphibian", "Amphibians"], ["invertebrate", "Invertebrates"]] as const).map(([c, label]) => [label, String(CLASS_COUNT(c)), firstOf(c)]),
      }}
    />
);

export default function RandomAnimalGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random Animal Generator"
      heading={["Random Animal", "Generator"]}
      intro={`Give me a random animal: tap Generate for one of ${ANIMALS.length}+ real animals, each with a picture and a fun fact. Filter by type or habitat, get one or a dozen, no repeats. Free, no sign-up.`}
      description={DESCRIPTION}
      updated="2026-10-10"
      faq={[...FAQ, ...faqForSchema(ANIMAL_BOOST.faq)]}
      afterTool={ANSWER}
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
            <li><strong>Drawing prompts</strong> — draw the animal in two minutes, then in ten; or combine two random animals into one creature. More subjects in the <Link prefetch={false} href="/random-drawing-generator" className={linkClass}>random drawing generator</Link>.</li>
            <li><strong>Guessing games</strong> — one player reads the fun fact aloud and the others guess the animal, or act it out like <Link prefetch={false} href="/charades" className={linkClass}>charades</Link>.</li>
            <li><strong>Class research</strong> — give each student a random animal for a one-page report or a presentation.</li>
            <li><strong>Story starters</strong> — make the animal the hero of a short story; see our <Link prefetch={false} href="/topics/writing-prompts-for-kids" className={linkClass}>writing prompts for kids</Link>.</li>
            <li><strong>Team names</strong> — our <Link prefetch={false} href="/random-team-generator" className={linkClass}>random team generator</Link> already names teams after animals.</li>
          </ul>
          <p>
            The full list covers more than a hundred mammals, dozens of birds, ocean life from clownfish to blue whales, and the insects and
            spiders kids love to find. Generate as many as you like — the same animal will not come back until you have seen them all.
          </p>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note={"Three filtered draws, four animals each:"} sets={EXAMPLES} />
          <RankBoost variant="inline" sections={[BROWSE_SECTION, ...ANIMAL_BOOST.sections]} />
        </>
      }
    >
      <AnimalGenerator locale="en" />
    </GeneratorPageShell>
  );
}
