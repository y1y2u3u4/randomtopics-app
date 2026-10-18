import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FaqSchema from "@/components/FaqSchema";
import FactSheet from "@/components/FactSheet";
import KeepPlaying from "@/components/KeepPlaying";
import DeckGenerator from "@/components/DeckGenerator";
import PublicAdPlacement from "@/components/PublicAdPlacement";
import { DILEMMA_GROUPS, DILEMMA_ITEMS, MORAL_DILEMMAS } from "@/data/decks/dilemmas";
import { SITE_URL } from "@/i18n/config";

const path = "/moral-dilemma-examples";
const UPDATED = "2026-10-18";
const classic = MORAL_DILEMMAS.filter(d => d.origin).length;
const title = `${MORAL_DILEMMAS.length} Moral Dilemma Examples, Explained`;
const description = `${MORAL_DILEMMAS.length} moral dilemma examples, each with what it tests: ${classic} classic thought experiments (trolley, Heinz, lifeboat) plus everyday, school and work ones.`;
export const metadata: Metadata = {
  title: { absolute: title }, description,
  alternates: { canonical: path },
  openGraph: { title, description, url: `${SITE_URL}${path}`, type: "article", siteName: "Random Topics" },
  twitter: { card: "summary_large_image", title, description },
};

const FRAMEWORKS: [string, string, string][] = [
  ["Consequentialism (utilitarianism)", "Choose the action with the best overall outcome.", "Pull the lever: one death is better than five."],
  ["Deontology (duty ethics)", "Some acts are wrong whatever the outcome, such as killing or lying.", "Many say don't push the man on the footbridge: it uses him as a means."],
  ["Virtue ethics", "Do what a good, wise person would do.", "Asks what kind of person each choice makes you."],
  ["Care ethics", "Protect relationships and the people who depend on you.", "Weighs loyalty to a friend in the cheating-classmate case."],
];

const faqs = [
  { question: "What is a moral dilemma?", answer: "A situation where you must choose between two options and each one breaks a moral value you hold, so there is no choice without a cost. Lying to protect a friend, for example, sets honesty against loyalty." },
  { question: "What is the most famous moral dilemma?", answer: "The trolley problem, introduced by Philippa Foot in 1967 and named by Judith Jarvis Thomson: pull a lever to divert a runaway trolley so it kills one person instead of five. Surveys find most people say they would pull the lever." },
  { question: "What is an example of a moral dilemma in everyday life?", answer: "Finding a wallet with $300 and an ID when nobody saw you, being given $20 too much change at a small shop, or seeing a friend's partner on a date with someone else. Each sets honesty or loyalty against self-interest or kindness." },
  { question: "What is the Heinz dilemma?", answer: "Lawrence Kohlberg's 1958 story about a man who cannot afford an overpriced drug that could save his dying wife and considers stealing it. Kohlberg used it to study moral development: what matters is the reason a person gives, not whether they say steal or don't steal." },
  { question: "Moral dilemma vs ethical dilemma: what's the difference?", answer: "In everyday use they mean the same thing. Some writers use \"moral\" for personal values and \"ethical\" for professional rules, such as a doctor's or a lawyer's code." },
  { question: "How do you use moral dilemmas in class?", answer: "Give students the setup, ask for a first answer by show of hands, have them argue in pairs from one of the four frameworks on this page, then vote again. Changes between votes are the best discussion starter." },
];

export default function MoralDilemmaExamplesPage() {
  return <><Navbar /><main className="flex-1"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Moral Dilemma Examples" }]} />
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-4">
      <header className="text-center py-4 sm:py-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>Moral Dilemma Examples</h1>
        <p className="mt-3 text-base text-[var(--text-secondary)]">Famous thought experiments and everyday choices, each with the setup, the question and what it tests.</p>
        <p className="mt-2 text-xs text-[var(--text-secondary)]">{MORAL_DILEMMAS.length} dilemmas · {classic} classics with sources · {DILEMMA_GROUPS.length} themes · Free</p>
      </header>
      <DeckGenerator storageKey="rt-moral-dilemma-v1" items={DILEMMA_ITEMS} groups={DILEMMA_GROUPS} noun="Moral dilemma" toolType="moral_dilemma" saveCategory="philosophy" printHeading="Moral dilemmas" counts={[1, 3]} />
      <PublicAdPlacement path={path} placement="result" />
      <section className="glass-card p-5 sm:p-8 mt-8">
        <h2 className="text-2xl font-bold">What is a moral dilemma?</h2>
        <p className="mt-3 text-[var(--text-muted)]">A moral dilemma is a choice between two actions where each one breaks something you believe is right, so every option has a moral cost. The trolley problem sets saving five lives against killing one; lying to protect a friend sets honesty against loyalty. Below are {MORAL_DILEMMAS.length} examples, from {classic} classic thought experiments to everyday cases.</p>
      </section>
    </div>
    <FactSheet heading="Moral dilemma examples at a glance" updated={UPDATED} rows={[
      ["Dilemmas", `${MORAL_DILEMMAS.length}, each with setup, question and what it tests`],
      ["Themes", DILEMMA_GROUPS.map(g => `${g.label} (${MORAL_DILEMMAS.filter(d => d.group === g.id).length})`).join(", ")],
      ["Oldest", "The Ring of Gyges, from Plato's Republic (about 375 BC)"],
      ["Best known", "The trolley problem (Philippa Foot, 1967)"],
      ["Frameworks compared", FRAMEWORKS.map(f => f[0].split(" (")[0]).join(", ")],
    ]} stepsName="How to discuss a moral dilemma" steps={[
      "Read the setup and the question aloud.",
      "Everyone gives a first answer (yes or no) without explaining.",
      "Name the two values in conflict, using the 'What it tests' line.",
      "Argue the side you did not pick for one minute.",
      "Vote again and talk about who changed their mind and why.",
    ]} />
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
      <section className="mt-8">
        <h2 className="text-2xl font-bold">All {MORAL_DILEMMAS.length} moral dilemma examples</h2>
        <nav aria-label="Dilemma themes" className="flex flex-wrap gap-2 mt-4">{DILEMMA_GROUPS.map(g => <a key={g.id} href={`#${g.id}`} className="text-sm rounded-full border border-white/15 px-3 py-2 hover:border-[var(--neon-cyan)]/40">{g.emoji} {g.label}</a>)}</nav>
        {DILEMMA_GROUPS.map(g => <div key={g.id} id={g.id} className="scroll-mt-24 mt-6">
          <h3 className="text-xl font-bold">{g.emoji} {g.label}</h3>
          <ol className="mt-3 space-y-3">{MORAL_DILEMMAS.filter(d => d.group === g.id).map(d => <li key={d.id} id={d.id} className="glass-card p-5 scroll-mt-24">
            <h4 className="font-bold">{d.name}</h4>
            {d.origin && <p className="text-xs mt-1 text-[var(--text-secondary)]">{d.origin}</p>}
            <p className="mt-2 text-[var(--text-muted)]">{d.setup} <strong className="text-[var(--text-primary)]">{d.question}</strong></p>
            <p className="mt-2 text-sm text-[var(--text-secondary)]"><span className="font-semibold">What it tests:</span> {d.tension}</p>
          </li>)}</ol>
        </div>)}
      </section>
      <div className="mt-8"><PublicAdPlacement path={path} placement="mid" /></div>
      <section className="glass-card p-5 sm:p-8 mt-8">
        <h2 className="text-2xl font-bold">Four ways to think about any moral dilemma</h2>
        <div className="overflow-x-auto mt-4"><table className="w-full text-sm text-left">
          <thead><tr className="text-[var(--text-secondary)]"><th scope="col" className="py-2 pr-3">Framework</th><th scope="col" className="py-2 pr-3">Core idea</th><th scope="col" className="py-2">Example</th></tr></thead>
          <tbody>{FRAMEWORKS.map(([name, idea, ex]) => <tr key={name} className="border-t border-white/10 align-top"><th scope="row" className="py-2 pr-3 font-semibold">{name}</th><td className="py-2 pr-3 text-[var(--text-muted)]">{idea}</td><td className="py-2 text-[var(--text-muted)]">{ex}</td></tr>)}</tbody>
        </table></div>
      </section>
      <section className="glass-card p-5 sm:p-8 mt-8">
        <h2 className="text-2xl font-bold">Moral dilemma FAQ</h2>
        {faqs.map(f => <div key={f.question} className="mt-5"><h3 className="font-bold">{f.question}</h3><p className="mt-2 text-[var(--text-muted)]">{f.answer}</p></div>)}
      </section>
      <section className="mt-8">
        <h2 className="font-bold">More ethics discussion</h2>
        <p className="mt-3 text-[var(--text-muted)]">Try <Link href="/topics/ethical-dilemma-questions" className="text-[var(--neon-cyan)] underline">ethical dilemma questions</Link>, <Link href="/topics/ethical-dilemmas-for-students" className="text-[var(--neon-cyan)] underline">ethical dilemmas for students</Link>, <Link href="/topics/ethical-dilemmas-for-adults" className="text-[var(--neon-cyan)] underline">dilemmas for adults</Link> and <Link href="/topics/workplace-ethical-dilemmas" className="text-[var(--neon-cyan)] underline">workplace ethical dilemmas</Link>, or go deeper with <Link href="/philosophical-questions" className="text-[var(--neon-cyan)] underline">philosophical questions</Link>.</p>
      </section>
    </div>
    <FaqSchema items={faqs} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Article", headline: title, url: `${SITE_URL}${path}`, description, dateModified: UPDATED, author: { "@type": "Organization", name: "RandomTopics editors", url: `${SITE_URL}/how-we-curate` }, publisher: { "@type": "Organization", name: "Random Topics", url: SITE_URL } }) }} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "ItemList", name: title, numberOfItems: MORAL_DILEMMAS.length, itemListElement: MORAL_DILEMMAS.map((d, i) => ({ "@type": "ListItem", position: i + 1, name: d.name, url: `${SITE_URL}${path}#${d.id}` })) }) }} />
    <KeepPlaying path={path} />
  </main><Footer /></>;
}
