import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FaqSchema from "@/components/FaqSchema";
import PartyGenerator from "@/components/PartyGenerator";
import SpeechTimer from "@/components/SpeechTimer";
import QotdVoteCard from "@/components/QotdVoteCard";
import KeepPlaying from "@/components/KeepPlaying";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";
import { IMPROMPTU_COLLECTIONS, impromptuTopics, type ImpromptuCollection } from "@/data/impromptuCollections";

export function impromptuMetadata(c: ImpromptuCollection): Metadata {
  return {
    title: { absolute: c.title },
    description: c.description,
    keywords: c.keywords,
    alternates: { canonical: c.path, languages: hreflangAlternates(c.path) },
    openGraph: { title: c.title, description: c.description, url: `${SITE_URL}${c.path}`, siteName: "Random Topics", type: "website" },
  };
}

// Shared layout for /impromptu-speech-topics/{students,funny,1-minute}.
export default function ImpromptuCollectionPage({ c }: { c: ImpromptuCollection }) {
  const topics = impromptuTopics(c);
  const siblings = IMPROMPTU_COLLECTIONS.filter((s) => s.slug !== c.slug);
  const source = `impromptu_${c.slug.replace("-", "_")}`;
  return (
    <>
      <FaqSchema items={c.faq} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Speech Topics", href: "/speech" }, { label: "Impromptu Speech Topics", href: "/impromptu-speech-topics" }, { label: c.h1 }]} />
        <PartyGenerator questions={topics} title={c.h1} subtitle={`${topics.length} topics. Draw one, think for 30 seconds, then start the timer below.`} emoji="🎤" />

        <section id="practice-timer" className="max-w-3xl mx-auto scroll-mt-20 px-4 sm:px-6 pb-4">
          <SpeechTimer defaultSeconds={c.timerSeconds} contentSource={source} />
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-6">
          <div className="glass-card p-6 sm:p-8">
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{c.lead}</p>
            <p className="text-sm text-[var(--text-secondary)] mt-3">
              More versions:{" "}
              <Link prefetch={false} href="/impromptu-speech-topics" className="text-[var(--neon-cyan)] hover:underline">all 120 impromptu speech topics</Link>
              {siblings.map((s) => (
                <span key={s.slug}>, <Link prefetch={false} href={s.path} className="text-[var(--neon-cyan)] hover:underline">{s.h1.toLowerCase()}</Link></span>
              ))}
              , <Link prefetch={false} href="/5-minute-speech-topics" className="text-[var(--neon-cyan)] hover:underline">5 minute speech topics</Link>.
            </p>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-10">
          <h2 className="section-heading text-2xl sm:text-3xl mb-5 text-[var(--text-primary)]">{topics.length} {c.h1} by Type</h2>
          <div className="space-y-4">
            {c.groups.map((g) => (
              <div key={g.title} className="glass-card p-5 sm:p-6">
                <h3 className="text-lg font-semibold text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>{g.title}</h3>
                <p className="text-xs text-[var(--text-muted)] mt-1 mb-3">{g.note}</p>
                <ol className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2 list-decimal pl-5 text-sm text-[var(--text-secondary)]">
                  {g.topics.map((t) => <li key={t}>{t}</li>)}
                </ol>
              </div>
            ))}
          </div>
        </section>

        <QotdVoteCard category={c.qotdCategory} source={source} />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]">{c.structure.title}</h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <ol className="space-y-2 list-decimal pl-5">
                {c.structure.steps.map((s) => <li key={s}>{s}</li>)}
              </ol>
              <p>
                Practicing for Toastmasters? Try the <Link prefetch={false} href="/table-topics-generator" className="text-[var(--neon-cyan)] hover:underline">Table Topics generator</Link>. Need a prepared talk instead? Use the <Link prefetch={false} href="/speech" className="text-[var(--neon-cyan)] hover:underline">speech topic generator</Link>.
              </p>
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

        <KeepPlaying path="/impromptu-speech-topics" />
      </main>
      <Footer />
    </>
  );
}
