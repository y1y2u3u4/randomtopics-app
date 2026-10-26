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
import { CATEGORY_GROUPS, CATEGORY_ITEMS } from "@/data/decks/categories";
import { SITE_URL } from "@/i18n/config";

const path = "/random-category-generator";
const UPDATED = "2026-10-18";
const title = `Random Category Generator: ${CATEGORY_ITEMS.length} Categories + Letter`;
const description = `Free random category generator with ${CATEGORY_ITEMS.length} Scattergories-style categories in ${CATEGORY_GROUPS.length} groups and a random letter roll. No repeats, kid-friendly options, print the full list.`;
export const metadata: Metadata = {
  title: { absolute: title }, description,
  alternates: { canonical: path },
  openGraph: { title, description, url: `${SITE_URL}${path}`, type: "website", siteName: "Random Topics" },
  twitter: { card: "summary_large_image", title, description },
};

const kids = CATEGORY_ITEMS.filter(c => c.group === "kids").length;
const faqs = [
  { question: "What is a random category generator?", answer: `It picks a category such as "Things in a kitchen" or "Animals with four legs" so players can race to name something that fits. This one draws from ${CATEGORY_ITEMS.length} categories written for word games and adds an optional random starting letter.` },
  { question: "How do you play Scattergories with this?", answer: "Draw 5 categories and roll a letter. Everyone has 2 minutes to write one answer per category that starts with that letter. Read answers aloud: unique answers score 1 point, answers someone else also wrote score 0. Play 3 rounds and add up the points." },
  { question: "Which letters are left out?", answer: "By default the letter roll skips Q, U, V, X, Y and Z, because few everyday words start with them. Untick the box to use all 26 letters for a harder game." },
  { question: "Are there categories for kids?", answer: `Yes. The Kids group has ${kids} categories with simple, familiar answers (things that are yellow, animals at a farm). Every category on this page is family-friendly.` },
  { question: "Will the same category repeat?", answer: "Not until you have seen every category in your selection. The round is kept for this browser tab, so you can switch groups and come back." },
  { question: "Can I print the category list?", answer: "Yes. Print all opens every category in the current group as a clean page, which works as a handout for classrooms or a game-night sheet." },
];

export default function RandomCategoryGeneratorPage() {
  return <><Navbar /><main className="flex-1"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Random Category Generator" }]} />
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-4">
      <header className="text-center py-4 sm:py-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>Random Category Generator</h1>
        <p className="mt-3 text-base text-[var(--text-secondary)]">Get a random category and a letter for Scattergories, Stop or any naming game.</p>
        <p className="mt-2 text-xs text-[var(--text-secondary)]">{CATEGORY_ITEMS.length} categories · {CATEGORY_GROUPS.length} groups · Random letter · Free, no signup</p>
      </header>
      <DeckGenerator storageKey="rt-random-category-v1" items={CATEGORY_ITEMS} groups={CATEGORY_GROUPS} noun="Category" toolType="random_category" saveCategory="weird-fun" printHeading="Random categories" letterRoll counts={[1, 5, 10]} />
      <TryNext path={path} />
      <PublicAdPlacement path={path} placement="result" />
      <section className="glass-card p-5 sm:p-8 mt-8">
        <h2 className="text-2xl font-bold">What a random category generator does</h2>
        <p className="mt-3 text-[var(--text-muted)]">A random category generator gives you a prompt like &ldquo;Things at the beach&rdquo; and, if you want, a starting letter. Players then name something that fits before time runs out. This one has {CATEGORY_ITEMS.length} family-friendly categories in {CATEGORY_GROUPS.length} groups, never repeats until the list is used up, and skips hard letters by default.</p>
      </section>
    </div>
    <FactSheet heading="Random category generator facts" updated={UPDATED} rows={[
      ["Categories", `${CATEGORY_ITEMS.length}, written for word games`],
      ["Groups", CATEGORY_GROUPS.map(g => `${g.label} (${CATEGORY_ITEMS.filter(c => c.group === g.id).length})`).join(", ")],
      ["Letter roll", "20 letters by default (skips Q, U, V, X, Y, Z); all 26 optional"],
      ["Draw size", "1, 5 or 10 categories at a time"],
      ["Repeats", "None until every category in the selection has been shown"],
      ["Cost and data", "Free, no account; the round is kept in this browser tab only"],
    ]} stepsName="How to play Scattergories with this generator" steps={[
      "Draw 10 categories and roll a letter.",
      "Set a 2-minute timer; each player writes one answer per category starting with that letter.",
      "Read answers aloud. A unique answer scores 1 point; an answer someone else also wrote scores 0.",
      "Roll a new letter and repeat. After 3 rounds, the highest total wins.",
    ]} />
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
      <section className="glass-card p-5 sm:p-8 mt-8">
        <h2 className="text-2xl font-bold">Four games you can play with random categories</h2>
        <ul className="mt-4 space-y-3 text-[var(--text-muted)]">
          <li><strong>Scattergories-style lists.</strong> 10 categories, one letter, 2 minutes. Only unique answers score.</li>
          <li><strong>Stop (Basta / Tutti Frutti).</strong> Everyone writes as fast as they can; the first to finish shouts &ldquo;Stop!&rdquo; and pens go down.</li>
          <li><strong>Hot potato.</strong> Pass a ball around a circle. Holding it, you name something in the category; repeat or freeze and you are out.</li>
          <li><strong>Category charades.</strong> Draw one category and act out something in it. See also the <Link prefetch={false} href="/charades" className="text-[var(--neon-cyan)] underline">charades generator</Link>.</li>
        </ul>
      </section>
      <section className="mt-8">
        <h2 className="text-2xl font-bold">All {CATEGORY_ITEMS.length} random categories</h2>
        <p className="mt-3 text-[var(--text-muted)]">The full list the generator draws from. Open a group to read it.</p>
        <div className="mt-4 space-y-3">{CATEGORY_GROUPS.map(g => {
          const list = CATEGORY_ITEMS.filter(c => c.group === g.id);
          return <details key={g.id} id={g.id} className="glass-card p-5 scroll-mt-24">
            <summary className="cursor-pointer font-bold min-h-11">{g.emoji} {g.label} ({list.length})</summary>
            <ul className="list-disc pl-5 mt-3 space-y-1">{list.map(c => <li key={c.id}>{c.text}</li>)}</ul>
          </details>;
        })}</div>
      </section>
      <div className="mt-8"><PublicAdPlacement path={path} placement="mid" /></div>
      <section className="glass-card p-5 sm:p-8 mt-8">
        <h2 className="text-2xl font-bold">Random category questions</h2>
        {faqs.map(f => <div key={f.question} className="mt-5"><h3 className="font-bold">{f.question}</h3><p className="mt-2 text-[var(--text-muted)]">{f.answer}</p></div>)}
      </section>
      <section className="mt-8">
        <h2 className="font-bold">More party and word games</h2>
        <p className="mt-3 text-[var(--text-muted)]">Browse conversation <Link prefetch={false} href="/categories" className="text-[var(--neon-cyan)] underline">topic categories</Link>, act it out with the <Link prefetch={false} href="/charades" className="text-[var(--neon-cyan)] underline">charades generator</Link>, or try <Link prefetch={false} href="/would-you-rather" className="text-[var(--neon-cyan)] underline">Would You Rather</Link> and <Link prefetch={false} href="/random-idea-generator" className="text-[var(--neon-cyan)] underline">random ideas</Link> for a bored afternoon.</p>
      </section>
    </div>
    <FaqSchema items={faqs} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "Random Category Generator", url: `${SITE_URL}${path}`, description, applicationCategory: "GameApplication", operatingSystem: "Any", isAccessibleForFree: true, dateModified: UPDATED, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
    <KeepPlaying path={path} />
  </main><Footer /></>;
}
