import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FaqSchema from "@/components/FaqSchema";
import FactSheet from "@/components/FactSheet";
import KeepPlaying from "@/components/KeepPlaying";
import TryNext from "@/components/TryNext";
import DeckGenerator from "@/components/DeckGenerator";
import PublicAdPlacement from "@/components/PublicAdPlacement";
import { PHILOSOPHY_GROUPS, PHILOSOPHY_ITEMS } from "@/data/decks/philosophical";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const path = "/philosophical-questions";
const UPDATED = "2026-10-18";
const title = `${PHILOSOPHY_ITEMS.length} Philosophical Questions to Make You Think`;
const description = `${PHILOSOPHY_ITEMS.length} philosophical questions by theme (life, mind, ethics, free will, reality, love), easy ones for kids, a random picker and famous questions explained.`;
export const metadata: Metadata = {
  title: { absolute: title }, description,
  alternates: { canonical: path, languages: hreflangAlternates(path) },
  openGraph: { title, description, url: `${SITE_URL}${path}`, type: "website", siteName: "Random Topics" },
  twitter: { card: "summary_large_image", title, description },
};

// Famous questions with who asked them. Keep dates and works accurate.
const CLASSICS: [string, string, string][] = [
  ["Is the unexamined life worth living?", "Socrates, in Plato's Apology (399 BC)", "Socrates said no: a good life needs questioning your own beliefs."],
  ["What is the good life?", "Aristotle, Nicomachean Ethics (4th century BC)", "Aristotle's answer was eudaimonia: flourishing by living with virtue."],
  ["If every part of a ship is replaced, is it the same ship?", "The Ship of Theseus, recorded by Plutarch (1st century AD)", "A puzzle about identity that also applies to people, whose cells change."],
  ["Can I know anything for certain?", "René Descartes, Meditations on First Philosophy (1641)", "Descartes doubted everything and found one certainty: that he was thinking."],
  ["Why is there something rather than nothing?", "Gottfried Wilhelm Leibniz (1714)", "Often called the deepest question in metaphysics."],
  ["Is free will compatible with a world of cause and effect?", "David Hume, An Enquiry Concerning Human Understanding (1748)", "Hume argued yes: you are free when you act on your own wishes, even if they have causes."],
  ["What would a fair society look like if you didn't know your place in it?", "John Rawls, A Theory of Justice (1971)", "The veil of ignorance: choose the rules before you know if you are rich or poor."],
  ["What is it like to be a bat?", "Thomas Nagel (1974)", "Asks whether science can ever explain what experience feels like from the inside."],
  ["Would you plug into a machine that gave you a perfect life?", "Robert Nozick, Anarchy, State, and Utopia (1974)", "The experience machine: most people refuse, which suggests we want more than pleasure."],
];

const n = (g: string) => PHILOSOPHY_ITEMS.filter(i => i.group === g).length;
const faqs = [
  { question: "What is a philosophical question?", answer: "A question that cannot be settled by looking up facts or running an experiment, because it is about meaning, value, knowledge or what is real. \"What makes a life meaningful?\" and \"Do we have free will?\" are philosophical; \"How far is the Moon?\" is not." },
  { question: "What are good philosophical questions to ask friends?", answer: `Start with Life & meaning (${n("meaning")}) or Love & friendship (${n("love")}): everyone has an opinion and no reading is needed. Ask one question, let each person answer, then ask "why?" once more.` },
  { question: "Are there philosophical questions for kids?", answer: `Yes. The Easy group has ${n("kids")} questions in plain words, such as "Is it wrong to keep a secret?", which work for classrooms and Philosophy for Children (P4C) sessions.` },
  { question: "What is the most famous philosophical question?", answer: "Candidates include Socrates' \"Is the unexamined life worth living?\", Leibniz's \"Why is there something rather than nothing?\" and the trolley problem. The table on this page lists nine with who asked them and when." },
  { question: "How do you discuss a philosophical question well?", answer: "Define the key word first (what do we mean by \"fair\"?), give one example and one counterexample, and change your mind out loud if someone gives a better reason. The goal is a clearer question, not a winner." },
];

export default function PhilosophicalQuestionsPage() {
  return <><Navbar /><main className="flex-1"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Philosophical Questions" }]} />
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-4">
      <header className="text-center py-4 sm:py-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>Philosophical Questions</h1>
        <p className="mt-3 text-base text-[var(--text-secondary)]">Deep questions about life, the mind, right and wrong, and what is real. Pick one at random or browse by theme.</p>
        <p className="mt-2 text-xs text-[var(--text-secondary)]">{PHILOSOPHY_ITEMS.length} questions · {PHILOSOPHY_GROUPS.length} themes · Easy ones for kids · Free</p>
      </header>
      <DeckGenerator storageKey="rt-philosophical-v1" items={PHILOSOPHY_ITEMS} groups={PHILOSOPHY_GROUPS} noun="Philosophical question" toolType="philosophical_question" saveCategory="philosophy" printHeading="Philosophical questions" dailyLabel="Question of the day" dailySalt={59} />
      <TryNext path={path} />
      <PublicAdPlacement path={path} placement="result" />
      <section className="glass-card p-5 sm:p-8 mt-8">
        <h2 className="text-2xl font-bold">What makes a question philosophical</h2>
        <p className="mt-3 text-[var(--text-muted)]">A philosophical question is one that facts alone cannot answer, because it asks about meaning, value, knowledge or reality. &ldquo;Do we have free will?&rdquo; is philosophical; &ldquo;How old is the universe?&rdquo; is scientific. This page has {PHILOSOPHY_ITEMS.length} such questions in {PHILOSOPHY_GROUPS.length} themes, plus nine famous ones explained with who first asked them.</p>
      </section>
    </div>
    <FactSheet heading="Philosophical questions at a glance" updated={UPDATED} rows={[
      ["Questions", `${PHILOSOPHY_ITEMS.length}, written by the RandomTopics editors`],
      ["Themes", PHILOSOPHY_GROUPS.map(g => `${g.label} (${n(g.id)})`).join(", ")],
      ["Famous questions explained", `${CLASSICS.length}, from Socrates (399 BC) to Nozick (1974)`],
      ["Branches covered", "Ethics, metaphysics, epistemology, philosophy of mind, political philosophy"],
      ["Repeats", "None until every question in the selection has been shown"],
    ]} stepsName="How to run a philosophy discussion" steps={[
      "Draw one question and read it aloud twice.",
      "Agree what the key word means (for example \"fair\", \"real\" or \"free\").",
      "Each person answers in one or two sentences and gives a reason.",
      "Look for a counterexample to the most popular answer.",
      "End by restating the question more precisely than you started.",
    ]} />
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
      <section className="glass-card p-5 sm:p-8 mt-8">
        <h2 className="text-2xl font-bold">{CLASSICS.length} famous philosophical questions and who asked them</h2>
        <div className="overflow-x-auto mt-4"><table className="w-full text-sm text-left">
          <thead><tr className="text-[var(--text-secondary)]"><th scope="col" className="py-2 pr-3">Question</th><th scope="col" className="py-2 pr-3">Source</th><th scope="col" className="py-2">In short</th></tr></thead>
          <tbody>{CLASSICS.map(([q, who, gist]) => <tr key={q} className="border-t border-white/10 align-top"><th scope="row" className="py-2 pr-3 font-semibold">{q}</th><td className="py-2 pr-3 text-[var(--text-muted)]">{who}</td><td className="py-2 text-[var(--text-muted)]">{gist}</td></tr>)}</tbody>
        </table></div>
      </section>
      <section className="mt-8">
        <h2 className="text-2xl font-bold">All {PHILOSOPHY_ITEMS.length} philosophical questions by theme</h2>
        <div className="mt-4 space-y-3">{PHILOSOPHY_GROUPS.map(g => {
          const list = PHILOSOPHY_ITEMS.filter(i => i.group === g.id);
          return <details key={g.id} id={g.id} className="glass-card p-5 scroll-mt-24">
            <summary className="cursor-pointer font-bold min-h-11">{g.emoji} {g.label} ({list.length})</summary>
            <ol className="list-decimal pl-5 mt-3 space-y-1">{list.map(i => <li key={i.id}>{i.text}</li>)}</ol>
          </details>;
        })}</div>
      </section>
      <div className="mt-8"><PublicAdPlacement path={path} placement="mid" /></div>
      <section className="glass-card p-5 sm:p-8 mt-8">
        <h2 className="text-2xl font-bold">Philosophical question FAQ</h2>
        {faqs.map(f => <div key={f.question} className="mt-5"><h3 className="font-bold">{f.question}</h3><p className="mt-2 text-[var(--text-muted)]">{f.answer}</p></div>)}
      </section>
      <section className="mt-8">
        <h2 className="font-bold">Keep thinking</h2>
        <p className="mt-3 text-[var(--text-muted)]">Read <Link prefetch={false} href="/topics/deep-philosophical-questions" className="text-[var(--neon-cyan)] underline">50 deep philosophical questions with talking points</Link>, work through <Link prefetch={false} href="/moral-dilemma-examples" className="text-[var(--neon-cyan)] underline">moral dilemma examples</Link> and <Link prefetch={false} href="/topics/ethical-dilemma-questions" className="text-[var(--neon-cyan)] underline">ethical dilemma questions</Link>, or get a fresh prompt each day from the <Link prefetch={false} href="/question-of-the-day" className="text-[var(--neon-cyan)] underline">question of the day</Link>.</p>
      </section>
    </div>
    <FaqSchema items={faqs} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "Philosophical Question Generator", url: `${SITE_URL}${path}`, description, applicationCategory: "EducationalApplication", operatingSystem: "Any", isAccessibleForFree: true, dateModified: UPDATED, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
    <KeepPlaying path={path} />
  </main><Footer /></>;
}
