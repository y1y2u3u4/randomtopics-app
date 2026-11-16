import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import ScenarioGenerator, { ScenarioCard } from "@/components/generators/ScenarioGenerator";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { CASTS, GENRES, MODES, SCENARIOS, TONES, TWISTS, countBy, exampleRoll, rollToParams, type Filters } from "@/lib/generators/scenarios";

const PATH = "/scenario-generator";
const N = SCENARIOS.length;
const TITLE = "Random Scenario Generator — OC, Roleplay & Writing Scenarios";
const DESCRIPTION = `Free random scenario generator: ${N} original scenarios for OCs, roleplay and story writing. Filter by genre, tone and number of characters, add your characters' names, a twist and an opening line. Copy or share.`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "scenario generator", "random scenario generator", "oc scenario generator", "oc prompt generator", "roleplay scenario generator",
    "rp scenario generator", "writing scenario generator", "story scenario generator", "character scenario generator",
  ],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const PER_MODE = N / MODES.length;

// Real output of the generator with fixed seeds, rendered on the server.
const EXAMPLES: { title: string; how: string; seed: number; f: Partial<Filters> }[] = [
  { title: "OC scenarios", how: "OC tab, any genre", seed: 7, f: { mode: "oc" } },
  { title: "OC scenarios", how: "OC tab, Fantasy, Solo", seed: 12, f: { mode: "oc", genres: ["fantasy"], cast: 1 } },
  { title: "Roleplay scenarios", how: "Roleplay tab, Duo", seed: 21, f: { mode: "roleplay", cast: 2 } },
  { title: "Roleplay scenarios", how: "Roleplay tab, Horror, Dark", seed: 23, f: { mode: "roleplay", genres: ["horror"], tones: ["dark"] } },
  { title: "Writing scenarios", how: "Writing tab, Mystery", seed: 31, f: { mode: "writing", genres: ["mystery"] } },
  { title: "Writing scenarios", how: "Writing tab, Funny, Group", seed: 34, f: { mode: "writing", tones: ["funny"], cast: 3 } },
];
const GROUPS = MODES.map((m) => ({ mode: m, items: EXAMPLES.filter((e) => e.f.mode === m.id).map((e) => ({ ...e, r: exampleRoll(e.seed, e.f) })) }));

const FAQ = [
  {
    question: "What is a random scenario generator?",
    answer: `It gives you a ready situation to write, roleplay or test a character in: who is there, where they are and what has gone wrong. This one draws from ${N} original scenarios written for this site, ${PER_MODE} each for OCs, roleplay and story writing, and adds an optional twist and an opening line.`,
  },
  {
    question: "How do I use it for my OC?",
    answer: "Open the OC tab and type your character's name in the first box. Every scenario is rewritten with that name, and the question under it (such as \"What does Mira refuse to leave behind?\") helps you learn how they think. Answer it in a few lines, or turn it into a short scene.",
  },
  {
    question: "Can I use the scenarios with Character.AI, Janitor AI or SillyTavern?",
    answer: "Yes. In the Roleplay tab, tick \"Use {{user}} / {{char}}\" and Character A becomes {{user}} and Character B becomes {{char}}, the tags most AI chat bot tools fill in for you. Copy the scenario into the bot's scenario or greeting box. The opening line works as a first message.",
  },
  {
    question: "What do the filters do?",
    answer: `Genre picks the world (${GENRES.map((g) => g.label.replace(/^\S+\s/, "").toLowerCase()).join(", ")}). Tone sets the mood: wholesome, funny, dramatic or dark. People sets how many characters the scenario needs: solo, duo or a group of three or more. You can choose several genres or tones at once.`,
  },
  {
    question: "Is the dark tone safe for teens?",
    answer: "Dark scenarios are tense, eerie or bleak, but never graphic: no gore, torture or self-harm. Romance scenarios are slow-burn and kept clean, and every character in them is an adult. The whole set is fine for classrooms and public roleplay servers.",
  },
  {
    question: "Will I see the same scenario twice?",
    answer: "Not until you have seen every scenario that matches your filters. Then the round starts again. Use the dice next to the twist to change only the twist and keep the scenario.",
  },
  {
    question: "How do I share a scenario with my roleplay partner?",
    answer: "Press Copy share link. The link stores the exact scenario, twist and the names you typed, so your partner opens the same setup. Copy gives plain text you can paste into Discord, a doc or a chat bot.",
  },
  {
    question: "What is today's scenario?",
    answer: "Once a day the page picks one scenario with a twist for everyone, rotating OC, roleplay and writing. It changes at midnight UTC. Mark it done to build a daily streak (saved in this browser), and share it with friends to compare what you wrote.",
  },
];

const ex = (e: (typeof GROUPS)[number]["items"][number]) => `${PATH}?${rollToParams(e.r).toString()}`;

export default function ScenarioGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random Scenario Generator"
      heading={["Random Scenario", "Generator"]}
      intro={`${N} original scenarios for OCs, roleplay and writing. Pick a type, filter by genre, tone and people, add names and a twist.`}
      description={DESCRIPTION}
      compactHeroOnMobile
      updated="2026-11-16"
      faq={FAQ}
      inShort={`This random scenario generator draws from ${N} hand-written scenarios: ${PER_MODE} OC scenarios, ${PER_MODE} roleplay scenarios and ${PER_MODE} writing scenarios across ${GENRES.length} genres and ${TONES.length} tones, for one, two or three or more characters. Each comes with an opening line or question, plus one of ${TWISTS.length} optional twists. Names you type are written into the scenario.`}
      related={[
        { href: "/story-prompt-generator", label: "Story prompt generator" },
        { href: "/headcanon-generator", label: "Headcanon generator" },
        { href: "/random-character-generator", label: "Random character generator" },
        { href: "/oc-name-generator", label: "OC name generator" },
        { href: "/character-name-generator", label: "Character name generator" },
      ]}
      content={
        <>
          <SectionTitle>Example scenarios</SectionTitle>
          <p>Six real results from this page with fixed settings, two for each tab. Open any of them in the generator to add your own names or roll a new twist.</p>
          <div className="grid gap-5" data-scenario-examples>
            {GROUPS.map((g) => (
              <div key={g.mode.id}>
                <h3 className="text-base font-semibold text-[var(--text-primary)]">{g.mode.label} examples</h3>
                <div className="mt-2 grid gap-3">
                  {g.items.map((e) => (
                    <div key={e.seed}>
                      <p className="mb-1 text-xs text-[var(--text-muted)]">Settings: {e.how}. <a className={linkClass} href={ex(e)}>Open this scenario</a></p>
                      <ScenarioCard r={e.r} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <SectionTitle>OC scenario generator: put your character under pressure</SectionTitle>
          <p>
            An original character becomes real when you see them choose. The <strong>OC tab</strong> gives a situation that forces a choice, with a question to answer about your character.
            Type the OC&rsquo;s name, roll until a scenario feels uncomfortable for them, then answer the question in their voice. Five rolls make a quick character study; keep the answers in your character sheet.
            For background details to go with it, roll some <Link prefetch={false} href="/headcanon-generator" className={linkClass}>headcanons</Link>, or name a new OC with the <Link prefetch={false} href="/oc-name-generator" className={linkClass}>OC name generator</Link>.
          </p>

          <SectionTitle>Roleplay scenario generator: starters with a reason to talk</SectionTitle>
          <p>
            Most roleplays stall in the first message because nobody knows why the characters are in the same room. Every <strong>roleplay scenario</strong> here puts the characters together for a reason and gives an opening line, so one player can post first right away.
            Choose Duo for one-on-one RP and Group for a Discord server scene. For AI chat bots, switch on the {"{{user}}"} / {"{{char}}"} tags and paste the result into the bot&rsquo;s scenario field.
          </p>

          <SectionTitle>Writing scenario generator: a story in one situation</SectionTitle>
          <p>
            The <strong>Writing tab</strong> is for short stories and class exercises: a situation with a conflict and a decision, plus a first sentence you can keep or throw away. Set a 20-minute timer, write to the end, then add the twist and write a second version.
            If you want story ideas sorted by age group and length instead, use the <Link prefetch={false} href="/story-prompt-generator" className={linkClass}>story prompt generator</Link>; for broader writing topics, try the <Link prefetch={false} href="/writing" className={linkClass}>writing prompt generator</Link>.
          </p>

          <SectionTitle>What is in the generator</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" data-scenario-counts>
              <thead>
                <tr className="text-[var(--text-primary)]">
                  <th className="py-2 pr-4 font-semibold">Genre</th>
                  {MODES.map((m) => <th key={m.id} className="py-2 pr-4 font-semibold">{m.label}s</th>)}
                </tr>
              </thead>
              <tbody>
                {GENRES.map((g) => (
                  <tr key={g.id} className="border-t border-white/10">
                    <td className="py-2 pr-4 whitespace-nowrap">{g.label}</td>
                    {MODES.map((m) => <td key={m.id} className="py-2 pr-4">{SCENARIOS.filter((s) => s.mode === m.id && s.genre === g.id).length}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Tone</strong>: {TONES.map((t) => `${t.label.replace(/^\S+\s/, "")} (${countBy("tone", t.id)})`).join(", ")}.</li>
            <li><strong>People</strong>: {CASTS.map((c) => `${c.label} (${countBy("cast", c.id)})`).join(", ")}.</li>
            <li><strong>Twists</strong>: {TWISTS.length}, matched to the scenario&rsquo;s tone, such as &ldquo;{TWISTS[0].text.replace("{a}", "your character")}&rdquo;</li>
          </ul>

          <SectionTitle>How this compares with other scenario generators</SectionTitle>
          <p>
            Template generators such as the Perchance scenario generator stitch random phrases together, so many results do not make sense, and they cannot be filtered or shared. AI scenario sites such as headcanon.io write longer text but need a fandom prompt and often a wait or an account.
            This page uses hand-written scenarios instead: you can filter by type, genre, tone and number of characters, write your characters&rsquo; names into the text, change only the twist, copy a link that opens the exact scenario, and come back for a daily scenario. It does not write the story for you; it gives you the situation.
          </p>
        </>
      }
    >
      <ScenarioGenerator />
    </GeneratorPageShell>
  );
}
