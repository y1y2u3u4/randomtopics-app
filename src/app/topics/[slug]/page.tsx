import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import { SEO_ARTICLES } from "@/data/seoContent";
import { articleToPages } from "@/data/internalLinks";
import { MODES, CATEGORIES } from "@/data/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

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
    title: article.metaTitle,
    description: article.metaDescription,
    alternates: {
      canonical: `/topics/${article.slug}`,
    },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url: `https://randomtopics.app/topics/${article.slug}`,
      siteName: "Random Topics",
      type: "article",
      publishedTime: article.publishDate,
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
          </p>
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
          </div>
        </section>

        {/* Content sections */}
        {article.sections.reduce<{ elements: React.ReactNode[]; runningCount: number }>(
          (acc, section, sIdx) => {
            const startNum = acc.runningCount;
            acc.elements.push(
              <section key={sIdx} className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
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
                      Want more topics like these? Generate unlimited random topics instantly.
                    </p>
                    <Link
                      href="/"
                      className="btn-generate inline-flex items-center gap-2 text-sm px-6 py-3"
                    >
                      <span>🎲</span> Try the Generator — It&apos;s Free
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
              {SEO_ARTICLES.filter((a) => a.slug !== article.slug)
                .slice(0, 6)
                .map((a) => (
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
            href="/"
            className="btn-generate animate-pulse-glow inline-flex items-center gap-2 text-lg px-10 py-4"
          >
            <span>🎲</span> Generate More Random Topics
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
