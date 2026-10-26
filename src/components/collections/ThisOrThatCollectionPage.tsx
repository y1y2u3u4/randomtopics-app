import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FaqSchema from "@/components/FaqSchema";
import PartyGenerator from "@/components/PartyGenerator";
import QuestionBank from "@/components/QuestionBank";
import QotdVoteCard from "@/components/QotdVoteCard";
import KeepPlaying from "@/components/KeepPlaying";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";
import { THIS_OR_THAT_COLLECTIONS, thisOrThatQuestions, type ThisOrThatCollection } from "@/data/thisOrThatCollections";

export function thisOrThatMetadata(c: ThisOrThatCollection): Metadata {
  return {
    title: { absolute: c.title },
    description: c.description,
    keywords: c.keywords,
    alternates: { canonical: c.path, languages: hreflangAlternates(c.path) },
    openGraph: { title: c.title, description: c.description, url: `${SITE_URL}${c.path}`, siteName: "Random Topics", type: "website" },
  };
}

// Shared layout for /this-or-that/{couples,hard,work}.
export default function ThisOrThatCollectionPage({ c }: { c: ThisOrThatCollection }) {
  const questions = thisOrThatQuestions(c);
  const siblings = THIS_OR_THAT_COLLECTIONS.filter((s) => s.slug !== c.slug);
  return (
    <>
      <FaqSchema items={c.faq} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "This or That", href: "/this-or-that" }, { label: c.h1 }]} />
        <PartyGenerator questions={questions} title={c.h1} subtitle={`${questions.length} picks, one click per question, no repeats until you've seen them all.`} emoji={c.emoji} />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-10">
          <div className="glass-card p-6 sm:p-8">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{c.lead}</p>
            <p className="text-sm text-[var(--text-secondary)] mt-3">
              More versions:{" "}
              <Link prefetch={false} href="/this-or-that" className="text-[var(--neon-cyan)] hover:underline">all this or that questions</Link>
              {siblings.map((s) => (
                <span key={s.slug}>, <Link prefetch={false} href={s.path} className="text-[var(--neon-cyan)] hover:underline">{s.h1.toLowerCase()}</Link></span>
              ))}
              , <Link prefetch={false} href="/this-or-that/kids" className="text-[var(--neon-cyan)] hover:underline">this or that for kids</Link>.
            </p>
          </div>
        </section>

        <QotdVoteCard category={c.qotdCategory} source={`this_or_that_${c.slug}`} />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-10">
          <h2 className="section-heading text-2xl sm:text-3xl mb-5 text-[var(--text-primary)]">{questions.length} {c.h1} by Theme</h2>
          <div className="space-y-4">
            {c.groups.map((g) => (
              <div key={g.title} className="glass-card p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3" style={{ fontFamily: "var(--font-display)" }}>{g.title}</h3>
                <ol className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2 list-decimal pl-5 text-sm text-[var(--text-secondary)]">
                  {g.questions.map((q) => <li key={q}>{q}</li>)}
                </ol>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">How to Play</h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              {c.howTo.map((s) => <p key={s.name}><strong className="text-[var(--text-primary)]">{s.name}.</strong> {s.text}</p>)}
              <h3 className="text-lg font-semibold text-[var(--text-primary)] pt-3" style={{ fontFamily: "var(--font-display)" }}>Frequently Asked Questions</h3>
              {c.faq.map((item) => (
                <div key={item.question}>
                  <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">{item.question}</h4>
                  <p>{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <QuestionBank heading={`Copy all ${questions.length} questions`} intro="The whole list in one place: copy it into a note, a slide or a group chat." questions={questions} />
        <KeepPlaying path="/this-or-that" />
      </main>
      <Footer />
    </>
  );
}
