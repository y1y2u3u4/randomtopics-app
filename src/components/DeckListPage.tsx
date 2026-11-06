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
import type { DeckGroup, DeckItem } from "@/components/DeckGenerator";
import type { Category } from "@/data/types";
import { SITE_URL } from "@/i18n/config";

export interface DeckListConfig {
  path: string;
  name: string; // H1 and breadcrumb
  tagline: string;
  noun: string; // "Hypothetical question"
  toolType: string;
  storageKey: string;
  saveCategory: Category;
  printHeading: string;
  dailyLabel: string;
  dailySalt: number;
  description: string;
  updated: string;
  items: DeckItem[];
  groups: DeckGroup[];
  /** "How to use" steps (also shown in the fact sheet). */
  steps: string[];
  stepsName: string;
  /** Use-case bullets: [bold lead, text]. */
  uses: [string, string][];
  aboutHeading: string;
  about: string;
  faqs: { question: string; answer: string }[];
  /** Internal links shown at the bottom. */
  more: { href: string; label: string }[];
  /** FactSheet rows between the generic ones. */
  extraFacts?: [string, string][];
}

/** A long list page with a random picker on top: the format that wins list queries. */
export default function DeckListPage(c: DeckListConfig) {
  const n = c.items.length;
  const count = (g: string) => c.items.filter((i) => i.group === g).length;
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: c.name }]} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-4">
          <header className="text-center py-4 sm:py-6">
            <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>{c.name}</h1>
            <p className="mt-3 text-base text-[var(--text-secondary)]">{c.tagline}</p>
            <p className="mt-2 text-xs text-[var(--text-secondary)]">{n} questions · {c.groups.length} categories · Random picker · Free, no sign-up</p>
          </header>
          <DeckGenerator storageKey={c.storageKey} items={c.items} groups={c.groups} noun={c.noun} toolType={c.toolType} saveCategory={c.saveCategory} printHeading={c.printHeading} dailyLabel={c.dailyLabel} dailySalt={c.dailySalt} />
          <TryNext path={c.path} />
          <PublicAdPlacement path={c.path} placement="result" />
          <section className="glass-card p-5 sm:p-8 mt-8">
            <h2 className="text-2xl font-bold">{c.aboutHeading}</h2>
            <p className="mt-3 text-[var(--text-muted)]">{c.about}</p>
          </section>
        </div>
        <FactSheet heading={`${c.name} at a glance`} updated={c.updated} rows={[
          ["Questions", `${n}, written by the RandomTopics editors`],
          ["Categories", c.groups.map((g) => `${g.label} (${count(g.id)})`).join(", ")],
          ...(c.extraFacts ?? []),
          ["Repeats", "None until every question in the selection has been shown"],
        ]} stepsName={c.stepsName} steps={c.steps} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
          <section className="glass-card p-5 sm:p-8 mt-8">
            <h2 className="text-2xl font-bold">How people use these questions</h2>
            <ul className="mt-3 list-disc pl-5 space-y-2 text-[var(--text-muted)]">
              {c.uses.map(([lead, text]) => <li key={lead}><strong className="text-[var(--text-primary)]">{lead}</strong> {text}</li>)}
            </ul>
          </section>
          <section className="mt-8">
            <h2 className="text-2xl font-bold">All {n} {c.noun.toLowerCase()}s by category</h2>
            <div className="mt-4 space-y-3">{c.groups.map((g, gi) => {
              const list = c.items.filter((i) => i.group === g.id);
              return <details key={g.id} id={g.id} open={gi === 0} className="glass-card p-5 scroll-mt-24">
                <summary className="cursor-pointer font-bold min-h-11">{g.emoji} {g.label} ({list.length})</summary>
                <ol className="list-decimal pl-5 mt-3 space-y-1">{list.map((i) => <li key={i.id}>{i.text}</li>)}</ol>
              </details>;
            })}</div>
          </section>
          <div className="mt-8"><PublicAdPlacement path={c.path} placement="mid" /></div>
          <section className="glass-card p-5 sm:p-8 mt-8">
            <h2 className="text-2xl font-bold">{c.name} FAQ</h2>
            {c.faqs.map((f) => <div key={f.question} className="mt-5"><h3 className="font-bold">{f.question}</h3><p className="mt-2 text-[var(--text-muted)]">{f.answer}</p></div>)}
          </section>
          <section className="mt-8">
            <h2 className="font-bold">More questions to ask</h2>
            <p className="mt-3 text-[var(--text-muted)]">
              {c.more.map((m, i) => <span key={m.href}>{i > 0 && " · "}<Link prefetch={false} href={m.href} className="text-[var(--neon-cyan)] underline">{m.label}</Link></span>)}
            </p>
          </section>
        </div>
        <FaqSchema items={c.faqs} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: c.name, url: `${SITE_URL}${c.path}`, description: c.description, applicationCategory: "EntertainmentApplication", operatingSystem: "Any", isAccessibleForFree: true, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, dateModified: c.updated }) }} />
        <KeepPlaying path={c.path} />
      </main>
      <Footer />
    </>
  );
}
