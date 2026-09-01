import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import { SEO_ARTICLES } from "@/data/seoContent";
import { articleToPages } from "@/data/internalLinks";
import { MODES, CATEGORIES } from "@/data/types";
import { hreflangAlternates } from "@/i18n/config";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PrintButton from "@/components/PrintButton";
import InlineQuestionGenerator from "@/components/InlineQuestionGenerator";
import SpeechTimer from "@/components/SpeechTimer";

function sectionId(heading: string) {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

const ARTICLE_CTA: Record<string, { href: string; text: string; label: string; emoji: string }> = {
  "ethical-dilemma-questions": {
    href: "/argument-generator",
    text: "Ready to turn a dilemma into a structured discussion? Generate a claim and practice both sides.",
    label: "Try the Argument Generator",
    emoji: "⚖️",
  },
  "presentation-ideas-for-school": {
    href: "/presentation-topic-generator",
    text: "Need another presentation idea? Generate a topic by subject and difficulty, then use it to plan your next deck.",
    label: "Open the Presentation Topic Generator",
    emoji: "📊",
  },
  "public-speaking-topics-for-beginners": {
    href: "/speech",
    text: "Ready to practice instead of just reading? Generate a speech prompt and rehearse it against the built-in timer.",
    label: "Practice with the Speech Timer",
    emoji: "⏱️",
  },
  "conversation-topics-for-teens": {
    href: "/conversation",
    text: "Need a fresh prompt for the group? Generate a conversation topic and use its talking points to keep everyone involved.",
    label: "Open the Conversation Generator",
    emoji: "💬",
  },
};

export function generateStaticParams() {
  return SEO_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = SEO_ARTICLES.find((a) => a.slug === slug);
  if (!article) return {};

  return {
    // metaTitle already carries the "| RandomTopics" brand suffix, so opt out
    // of the layout's "%s | Random Topic Generator" template — otherwise every
    // article title double-brands ("… | RandomTopics | Random Topic Generator")
    // and Google truncates or rewrites the redundant tail.
    title: { absolute: article.metaTitle },
    description: article.metaDescription,
    alternates: {
      canonical: `/topics/${article.slug}`,
      languages: hreflangAlternates(`/topics/${article.slug}`),
    },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url: `https://randomtopics.app/topics/${article.slug}`,
      siteName: "Random Topics",
      type: "article",
      publishedTime: article.publishDate,
      modifiedTime: article.lastModified,
    },
    twitter: {
      card: "summary_large_image",
      title: article.metaTitle,
      description: article.metaDescription,
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = SEO_ARTICLES.find((a) => a.slug === slug);
  if (!article) notFound();
  const articleCta = ARTICLE_CTA[article.slug] ?? {
    href: "/",
    text: "Want more topics like these? Generate unlimited random topics instantly.",
    label: "Try the Generator — It's Free",
    emoji: "🎲",
  };
  const articleItems = article.sections.flatMap((section) => section.items);
  const currentRouting = articleToPages[article.slug];
  const explicitRelated = new Set(article.relatedLinks.map((link) => link.href));
  const contextualCollections = SEO_ARTICLES
    .filter((candidate) => candidate.slug !== article.slug)
    .filter((candidate) => !explicitRelated.has(`/topics/${candidate.slug}`))
    .map((candidate) => {
      const routing = articleToPages[candidate.slug];
      const sharedModes = currentRouting && routing
        ? routing.modes.filter((mode) => currentRouting.modes.includes(mode)).length
        : 0;
      const sharedCategories = currentRouting && routing
        ? routing.categories.filter((category) => currentRouting.categories.includes(category)).length
        : 0;
      return { candidate, score: sharedModes * 3 + sharedCategories * 2 };
    })
    .sort((left, right) => right.score - left.score || left.candidate.title.localeCompare(right.candidate.title))
    .slice(0, 6)
    .map(({ candidate }) => candidate);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Topics", href: "/topics" },
            { label: article.title },
          ]}
        />

        {/* Hero */}
        <div className="text-center pt-12 sm:pt-20 pb-8 sm:pb-12 max-w-4xl mx-auto px-4 sm:px-6">
          <h1
            className="section-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-[1.15] tracking-tight"
          >
            {article.heroTitle}
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed opacity-80">
            {article.heroSubtitle}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-3">
            Published: {new Date(article.publishDate).toLocaleDateString("en-US", {
              year: "numeric", month: "long", day: "numeric",
            })}
            {article.lastModified !== article.publishDate && (
              <> · Updated: {new Date(article.lastModified).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric",
              })}</>
            )}
          </p>
          <div className="mt-5 flex justify-center">
            <PrintButton
              heading={article.heroTitle}
              items={articleItems}
              intro={article.heroSubtitle}
              label="Print or save as PDF"
            />
          </div>
        </div>

        {/* Article Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              headline: article.title,
              description: article.metaDescription,
              datePublished: article.publishDate,
              dateModified: article.lastModified,
              author: {
                "@type": "Organization",
                name: "Random Topics",
                url: "https://randomtopics.app",
              },
              publisher: {
                "@type": "Organization",
                name: "Random Topics",
                url: "https://randomtopics.app",
              },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `https://randomtopics.app/topics/${article.slug}`,
              },
            }),
          }}
        />
        {/* BreadcrumbList Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://randomtopics.app" },
                { "@type": "ListItem", position: 2, name: "Topics", item: "https://randomtopics.app/topics" },
                { "@type": "ListItem", position: 3, name: article.title },
              ],
            }),
          }}
        />

        {/* Intro */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
          <div className="glass-card p-8 sm:p-10">
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">
              {article.intro}
            </p>
            {article.sections.length >= 3 && (
              <nav aria-label="On this page" className="mt-6 border-t border-white/10 pt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">On this page</p>
                <div className="flex flex-wrap gap-2">
                  {article.sections.map((section) => (
                    <a
                      key={section.heading}
                      href={`#${sectionId(section.heading)}`}
                      className="text-xs px-3 py-2 rounded-lg border border-white/10 text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/30 transition-colors"
                    >
                      {section.heading}
                    </a>
                  ))}
                </div>
              </nav>
            )}
          </div>
        </section>

        {article.slug === "ethical-dilemma-questions" && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
            <InlineQuestionGenerator
              items={articleItems}
              title="Try a Random Ethical Dilemma"
              description="Draw one scenario for a class, interview, dinner discussion, or personal reflection — then copy or share it without leaving the page."
              source="ethical_dilemma_article"
              actionLabel="Give Me a Dilemma"
            />
          </section>
        )}

        {article.slug === "toastmasters-table-topics" && (
          <>
            <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-6">
              <InlineQuestionGenerator
                items={articleItems}
                title="Practice a Random Table Topic"
                description="Draw a question, take a short breath, and answer for one to two minutes. The timer below keeps the drill meeting-ready."
                source="toastmasters_article"
                actionLabel="Draw a Table Topic"
              />
            </section>
            <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-6">
              <div className="glass-card p-6 sm:p-8">
                <p className="text-xs font-bold uppercase tracking-widest text-[var(--neon-pink)]">Meeting-ready practice</p>
                <h2 className="mt-2 text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Run a Complete Table Topics Drill</h2>
                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  Use one repeatable round so every prompt becomes useful speaking practice, not just another question list.
                </p>
                <ol className="mt-5 grid gap-3 sm:grid-cols-2">
                  {[
                    ["1", "Draw", "Pick one prompt above without previewing the list."],
                    ["2", "Think", "Take 15 seconds to choose one clear message and example."],
                    ["3", "Speak", "Start the timer and answer for one to two minutes."],
                    ["4", "Review", "Check your opening, structure, example, and final sentence."],
                  ].map(([number, heading, text]) => (
                    <li key={number} className="rounded-xl border border-white/10 bg-black/10 p-4">
                      <div className="flex items-start gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--neon-cyan)]/10 text-xs font-bold text-[var(--neon-cyan)]">{number}</span>
                        <div>
                          <h3 className="font-semibold text-[var(--text-primary)]">{heading}</h3>
                          <p className="mt-1 text-xs leading-5 text-[var(--text-muted)]">{text}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
            <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
              <SpeechTimer />
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs">
                <Link href="/table-topics-generator" className="mode-chip">Open the focused generator</Link>
                <Link href="/impromptu-speech-topics" className="mode-chip">More impromptu practice</Link>
                <Link href="/speech" className="mode-chip">Speech practice hub</Link>
              </div>
            </section>
          </>
        )}

        {article.slug === "presentation-ideas-for-school" && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
            <div className="glass-card p-6 sm:p-8 border-[var(--neon-cyan)]/20 text-center">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">Need a topic matched to your subject and difficulty?</h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">Use the focused generator for a presentation idea plus a slide-ready starting angle.</p>
              <Link href="/presentation-topic-generator" className="btn-generate inline-flex mt-5 items-center gap-2 text-sm px-6 py-3">
                <span aria-hidden="true">📊</span> Generate a Presentation Topic
              </Link>
            </div>
          </section>
        )}

        {/* Content sections */}
        {article.sections.reduce<{ elements: React.ReactNode[]; runningCount: number }>(
          (acc, section, sIdx) => {
            const startNum = acc.runningCount;
            acc.elements.push(
              <section id={sectionId(section.heading)} key={sIdx} className="max-w-3xl mx-auto px-4 sm:px-6 pb-10 scroll-mt-24">
                <div className="glass-card p-8 sm:p-10">
                  <h2
                    className="text-xl sm:text-2xl font-bold mb-2 text-[var(--text-primary)]"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {section.heading}
                  </h2>
                  {section.description && (
                    <p className="text-[var(--text-muted)] text-sm mb-5">{section.description}</p>
                  )}
                  <ol className="space-y-3">
                    {section.items.map((item, iIdx) => (
                      <li key={iIdx} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--neon-pink)]/10 text-[var(--neon-pink)] text-xs font-bold flex items-center justify-center mt-0.5">
                          {startNum + iIdx + 1}
                        </span>
                        <span className="text-sm text-[var(--text-secondary)] leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>
            );
            acc.runningCount = startNum + section.items.length;

            {/* Mid-content CTA after the middle section */}
            if (sIdx === Math.floor(article.sections.length / 2) - 1) {
              acc.elements.push(
                <section key="mid-cta" className="max-w-3xl mx-auto px-4 sm:px-6 pb-10 text-center">
                  <div className="glass-card p-6 sm:p-8 border-[var(--neon-cyan)]/20 bg-gradient-to-r from-[rgba(0,229,255,0.04)] to-[rgba(255,45,120,0.04)]">
                    <p className="text-sm text-[var(--text-secondary)] mb-4">
                      {articleCta.text}
                    </p>
                    <Link
                      href={articleCta.href}
                      className="btn-generate inline-flex items-center gap-2 text-sm px-6 py-3"
                    >
                      <span>{articleCta.emoji}</span> {articleCta.label}
                    </Link>
                  </div>
                </section>
              );
            }

            return acc;
          },
          { elements: [], runningCount: 0 }
        ).elements}

        {/* FAQ Section with Schema */}
        {article.faq.length > 0 && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
            <div className="glass-card p-8 sm:p-10">
              <h2
                className="text-xl sm:text-2xl font-bold mb-6 text-[var(--text-primary)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Frequently Asked Questions
              </h2>
              <div className="space-y-5">
                {article.faq.map((f, i) => (
                  <div key={i}>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1.5">
                      {f.question}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                      {f.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  mainEntity: article.faq.map((f) => ({
                    "@type": "Question",
                    name: f.question,
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: f.answer,
                    },
                  })),
                }),
              }}
            />
          </section>
        )}

        {/* Explore Generators */}
        {articleToPages[article.slug] && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
            <div className="glass-card p-8 sm:p-10">
              <h2
                className="text-lg font-bold mb-4 text-[var(--text-primary)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Explore Generators
              </h2>
              <div className="flex flex-wrap gap-3">
                {articleToPages[article.slug].modes.map((modeSlug) => {
                  const mode = MODES.find((m) => m.slug === modeSlug);
                  return mode ? (
                    <Link
                      key={mode.slug}
                      href={`/${mode.slug}`}
                      className="text-sm px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.06)] text-[var(--text-secondary)] hover:text-[var(--neon-pink)] hover:border-[var(--neon-pink)]/30 hover:bg-[rgba(255,45,120,0.05)] transition-all"
                    >
                      {mode.emoji} {mode.label}
                    </Link>
                  ) : null;
                })}
                {articleToPages[article.slug].categories.map((catId) => {
                  const cat = CATEGORIES.find((c) => c.id === catId);
                  return cat ? (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.id}`}
                      className="text-sm px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.06)] text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/30 hover:bg-[rgba(0,229,255,0.05)] transition-all"
                    >
                      {cat.emoji} {cat.label} Topics
                    </Link>
                  ) : null;
                })}
                {articleToPages[article.slug].tools?.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="text-sm px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.06)] text-[var(--text-secondary)] hover:text-[var(--neon-pink)] hover:border-[var(--neon-pink)]/30 hover:bg-[rgba(255,45,120,0.05)] transition-all"
                  >
                    {tool.emoji} {tool.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Related Links */}
        {article.relatedLinks.length > 0 && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
            <div className="glass-card p-8 sm:p-10">
              <h2
                className="text-lg font-bold mb-4 text-[var(--text-primary)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Related Topics
              </h2>
              <div className="flex flex-wrap gap-3">
                {article.relatedLinks.map((link, i) => (
                  <Link
                    key={i}
                    href={link.href}
                    className="text-sm px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.06)] text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/30 hover:bg-[rgba(0,229,255,0.05)] transition-all"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* More Topic Collections */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="text-lg font-bold mb-4 text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              More Topic Collections
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {contextualCollections.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/topics/${a.slug}`}
                    className="text-sm p-3 rounded-lg border border-[rgba(255,255,255,0.06)] text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/30 hover:bg-[rgba(0,229,255,0.05)] transition-all"
                  >
                    {a.title} →
                  </Link>
                ))}
            </div>
          </div>
        </section>

        {/* CTA to generator */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 text-center">
          <Link
            href={articleCta.href}
            className="btn-generate animate-pulse-glow inline-flex items-center gap-2 text-lg px-10 py-4"
          >
            <span>{articleCta.emoji}</span> {articleCta.label}
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
