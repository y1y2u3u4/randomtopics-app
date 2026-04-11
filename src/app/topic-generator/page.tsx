import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Topic Generator - Generate Random Topics Instantly | Free Online Tool",
  description:
    "Need a topic? Our free topic generator creates random topics for conversations, essays, speeches, debates, and creative writing. 500+ topics across 16 categories. One click, instant results.",
  alternates: {
    canonical: "/topic-generator",
  },
};

export default function TopicGeneratorPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Topic Generator" },
          ]}
        />
        <TopicGenerator
          title="Topic Generator"
          subtitle="Generate random topics instantly for any purpose. Click the button, get a topic, start creating."
        />

        {/* SEO Content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2
              className="section-heading text-2xl sm:text-3xl mb-6 text-[var(--text-primary)]"
            >
              The Ultimate Free Topic Generator
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                Whether you need a <strong>topic for an essay</strong>, a <strong>conversation
                starter</strong>, a <strong>debate prompt</strong>, or a <strong>speech idea</strong>,
                our topic generator delivers instant inspiration. With over 500 curated topics across
                16 categories, you will never stare at a blank page again.
              </p>
              <p>
                Unlike simple random word generators, every topic here is hand-crafted to spark
                genuine discussion. Each comes with talking points to help you develop your ideas
                further. Filter by category, depth level, or mode to find exactly the right topic
                for your needs.
              </p>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                What Can You Use This Topic Generator For?
              </h3>

              <ul className="space-y-3 list-none pl-0">
                <li className="flex gap-3 items-start">
                  <span className="text-[var(--neon-cyan)] font-bold text-lg leading-tight">1.</span>
                  <div>
                    <strong className="text-[var(--text-primary)]">Essay & Academic Writing</strong>
                    <p className="mt-1">Stuck on what to write about? Generate topics filtered by category to match your subject area. Great for research papers, opinion pieces, and class assignments.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-[var(--neon-cyan)] font-bold text-lg leading-tight">2.</span>
                  <div>
                    <strong className="text-[var(--text-primary)]">Conversations & Icebreakers</strong>
                    <p className="mt-1">Perfect for first dates, team meetings, family dinners, or any time you need to <Link href="/conversation" className="text-[var(--neon-cyan)] hover:underline">start a conversation</Link>. Our topics are designed to get people talking.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-[var(--neon-cyan)] font-bold text-lg leading-tight">3.</span>
                  <div>
                    <strong className="text-[var(--text-primary)]">Debates & Discussions</strong>
                    <p className="mt-1">Find thought-provoking <Link href="/debate" className="text-[var(--neon-cyan)] hover:underline">debate topics</Link> with multiple perspectives. Each topic is balanced to support both sides of the argument.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-[var(--neon-cyan)] font-bold text-lg leading-tight">4.</span>
                  <div>
                    <strong className="text-[var(--text-primary)]">Speeches & Presentations</strong>
                    <p className="mt-1">Need a <Link href="/speech" className="text-[var(--neon-cyan)] hover:underline">speech topic</Link>? Generate ideas that are engaging, relevant, and have enough depth to fill your time slot.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-[var(--neon-cyan)] font-bold text-lg leading-tight">5.</span>
                  <div>
                    <strong className="text-[var(--text-primary)]">Creative Writing & Journaling</strong>
                    <p className="mt-1">Use topics as <Link href="/writing" className="text-[var(--neon-cyan)] hover:underline">writing prompts</Link> to overcome writer&apos;s block. Perfect for daily journaling, fiction writing, or blog content ideas.</p>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <span className="text-[var(--neon-cyan)] font-bold text-lg leading-tight">6.</span>
                  <div>
                    <strong className="text-[var(--text-primary)]">Fun & Entertainment</strong>
                    <p className="mt-1">Want something <Link href="/funny" className="text-[var(--neon-cyan)] hover:underline">funny and weird</Link>? Generate hilarious, bizarre topics perfect for parties, game nights, and road trips.</p>
                  </div>
                </li>
              </ul>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                How It Works
              </h3>
              <ol className="space-y-2 list-decimal pl-5">
                <li><strong>Choose your filters</strong> (optional) &mdash; pick a category, mode, or depth level</li>
                <li><strong>Click generate</strong> &mdash; get an instant random topic</li>
                <li><strong>Explore talking points</strong> &mdash; each topic includes starter ideas to develop</li>
                <li><strong>Generate again</strong> &mdash; not quite right? One more click for a new topic</li>
              </ol>

              <h3
                className="text-lg font-semibold text-[var(--text-primary)] pt-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Frequently Asked Questions
              </h3>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">Is this topic generator really free?</h4>
              <p>
                Yes, 100% free with no signup, no account, and no limits. Generate as many topics as
                you want, whenever you want.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">How many topics are available?</h4>
              <p>
                Our curated library includes over 500 hand-written topics across 16 categories. With
                AI-powered generation enabled, you also get fresh, unique topics every time you click.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">Can I use these topics for school or work?</h4>
              <p>
                Absolutely. Our topics are designed for academic essays, classroom debates, team
                meetings, presentations, and professional development. Filter by category and depth
                to find the right fit.
              </p>

              <h4 className="text-base font-semibold text-[var(--text-primary)] pt-2">What makes this better than just Googling for topics?</h4>
              <p>
                Our generator gives you a single, focused topic each time &mdash; no endless scrolling
                through listicles. Each topic includes talking points to help you get started
                immediately. And the randomness factor means you will discover topics you would never
                have searched for.
              </p>
            </div>
          </div>
        </section>

        {/* JSON-LD FAQPage */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "Is this topic generator really free?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, 100% free with no signup, no account, and no limits. Generate as many topics as you want, whenever you want.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How many topics are available?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Our curated library includes over 500 hand-written topics across 16 categories. With AI-powered generation enabled, you also get fresh, unique topics every time you click.",
                  },
                },
                {
                  "@type": "Question",
                  name: "Can I use these topics for school or work?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Absolutely. Our topics are designed for academic essays, classroom debates, team meetings, presentations, and professional development.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What makes this better than just Googling for topics?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Our generator gives you a single, focused topic each time with talking points to help you get started immediately. The randomness factor means you'll discover topics you'd never have searched for.",
                  },
                },
              ],
            }),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
