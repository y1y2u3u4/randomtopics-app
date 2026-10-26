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
import { IDEA_GROUPS, IDEA_ITEMS } from "@/data/decks/ideas";
import { SITE_URL } from "@/i18n/config";

const path = "/random-idea-generator";
const UPDATED = "2026-10-18";
const title = `Random Idea Generator: ${IDEA_ITEMS.length} Things to Do When Bored`;
const description = `Free random idea generator: ${IDEA_ITEMS.length} things to do, make, draw, write, cook and build, each with a first step. Filter by type, no repeats, print the list.`;
export const metadata: Metadata = {
  title: { absolute: title }, description,
  alternates: { canonical: path },
  openGraph: { title, description, url: `${SITE_URL}${path}`, type: "website", siteName: "Random Topics" },
  twitter: { card: "summary_large_image", title, description },
};

const n = (g: string) => IDEA_ITEMS.filter(i => i.group === g).length;
const faqs = [
  { question: "What is a random idea generator?", answer: `It gives you one concrete thing to do, make or try, so you do not have to decide. This one draws from ${IDEA_ITEMS.length} ideas written by our editors, in ${IDEA_GROUPS.length} types, and each idea comes with a first step you can start in five minutes.` },
  { question: "What can I do when I'm bored at home?", answer: `Pick Things to do (${n("do")} ideas) or Cooking ideas (${n("food")}) for something you can start with what is already in the house. Most ideas need no shopping and no screen.` },
  { question: "Are there drawing and writing ideas?", answer: `Yes: ${n("draw")} drawing ideas and ${n("write")} writing ideas. For longer lists, use the drawing prompt generator or the story prompt generator.` },
  { question: "Can I use it for projects or side projects?", answer: `The Projects group has ${n("build")} small builds, from a birdhouse to a simple personal website, sized for a weekend.` },
  { question: "Will I see the same idea twice?", answer: "Not until you have seen every idea in your selection. The round is kept for this browser tab only." },
];

export default function RandomIdeaGeneratorPage() {
  return <><Navbar /><main className="flex-1"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Random Idea Generator" }]} />
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-4">
      <header className="text-center py-4 sm:py-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>Random Idea Generator</h1>
        <p className="mt-3 text-base text-[var(--text-secondary)]">Bored or stuck? Get one thing to do, make or try, with a first step.</p>
        <p className="mt-2 text-xs text-[var(--text-secondary)]">{IDEA_ITEMS.length} ideas · {IDEA_GROUPS.length} types · No repeats · Free, no signup</p>
      </header>
      <DeckGenerator storageKey="rt-random-idea-v1" items={IDEA_ITEMS} groups={IDEA_GROUPS} noun="Idea" toolType="random_idea" saveCategory="weird-fun" printHeading="Random ideas" dailyLabel="Idea of the day" dailySalt={53} />
      <TryNext path={path} />
      <PublicAdPlacement path={path} placement="result" />
      <section className="glass-card p-5 sm:p-8 mt-8">
        <h2 className="text-2xl font-bold">What a random idea generator is for</h2>
        <p className="mt-3 text-[var(--text-muted)]">A random idea generator removes the hardest part of free time: choosing. Press the button and you get one specific idea, such as building a blanket fort or a birdhouse, plus a first step you can take right away. There are {IDEA_ITEMS.length} ideas across things to do, creative projects, drawing, writing, building, cooking and plans with friends.</p>
      </section>
    </div>
    <FactSheet heading="Random idea generator facts" updated={UPDATED} rows={[
      ["Ideas", `${IDEA_ITEMS.length}, each with a first step`],
      ["Types", IDEA_GROUPS.map(g => `${g.label} (${n(g.id)})`).join(", ")],
      ["Idea of the day", "One shared idea per calendar date"],
      ["Repeats", "None until every idea in the selection has been shown"],
      ["Cost and data", "Free, no account; nothing leaves your browser"],
    ]} stepsName="How to beat boredom in 3 steps" steps={[
      "Pick a type that fits your energy: Things to do for low effort, Projects for a full afternoon.",
      "Draw one idea and do its first step within five minutes, before you can talk yourself out of it.",
      "If it does not fit, draw again; there are no repeats until the list is used up.",
    ]} />
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
      <section className="mt-8">
        <h2 className="text-2xl font-bold">All {IDEA_ITEMS.length} random ideas</h2>
        <p className="mt-3 text-[var(--text-muted)]">Every idea the generator uses, by type.</p>
        <div className="mt-4 space-y-3">{IDEA_GROUPS.map(g => {
          const list = IDEA_ITEMS.filter(i => i.group === g.id);
          return <details key={g.id} id={g.id} className="glass-card p-5 scroll-mt-24">
            <summary className="cursor-pointer font-bold min-h-11">{g.emoji} {g.label} ({list.length})</summary>
            <ul className="list-disc pl-5 mt-3 space-y-2">{list.map(i => <li key={i.id}><strong>{i.text}</strong>{i.detail && <span className="text-[var(--text-muted)]"> — {i.detail}</span>}</li>)}</ul>
          </details>;
        })}</div>
      </section>
      <div className="mt-8"><PublicAdPlacement path={path} placement="mid" /></div>
      <section className="glass-card p-5 sm:p-8 mt-8">
        <h2 className="text-2xl font-bold">Random idea questions</h2>
        {faqs.map(f => <div key={f.question} className="mt-5"><h3 className="font-bold">{f.question}</h3><p className="mt-2 text-[var(--text-muted)]">{f.answer}</p></div>)}
      </section>
      <section className="mt-8">
        <h2 className="font-bold">More idea generators</h2>
        <p className="mt-3 text-[var(--text-muted)]">Find something to draw with the <Link prefetch={false} href="/random-drawing-generator" className="text-[var(--neon-cyan)] underline">drawing prompt generator</Link>, write with the <Link prefetch={false} href="/story-prompt-generator" className="text-[var(--neon-cyan)] underline">story prompt generator</Link>, play a word game with the <Link prefetch={false} href="/random-category-generator" className="text-[var(--neon-cyan)] underline">random category generator</Link>, or start a conversation with the <Link prefetch={false} href="/" className="text-[var(--neon-cyan)] underline">random topic generator</Link>.</p>
      </section>
    </div>
    <FaqSchema items={faqs} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "Random Idea Generator", url: `${SITE_URL}${path}`, description, applicationCategory: "LifestyleApplication", operatingSystem: "Any", isAccessibleForFree: true, dateModified: UPDATED, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
    <KeepPlaying path={path} />
  </main><Footer /></>;
}
