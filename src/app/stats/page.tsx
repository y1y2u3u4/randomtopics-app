import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import { CATEGORIES, MODES } from "@/data/types";
import { topics } from "@/data/topics";
import { SEO_ARTICLES } from "@/data/seoContent";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Topic Statistics & Insights - Random Topic Generator Data",
  description:
    "Explore our database: 500+ topics across 16 categories, 5 modes, 3 depth levels. See the full breakdown of conversation starters, debate topics, writing prompts, and more.",
  alternates: { canonical: "/stats" },
};

function getStats() {
  const totalTopics = topics.length;
  const totalArticles = SEO_ARTICLES.length;
  const totalArticleItems = SEO_ARTICLES.reduce(
    (sum, a) => sum + a.sections.reduce((s, sec) => s + sec.items.length, 0),
    0
  );

  const byCat = CATEGORIES.map((cat) => ({
    ...cat,
    count: topics.filter((t) => t.category === cat.id).length,
  })).sort((a, b) => b.count - a.count);

  const byMode = MODES.map((mode) => ({
    ...mode,
    count: topics.filter((t) => t.modes.includes(mode.id)).length,
  })).sort((a, b) => b.count - a.count);

  const byDepth = [
    { label: "Light", id: "light" as const, count: topics.filter((t) => t.depth === "light").length },
    { label: "Medium", id: "medium" as const, count: topics.filter((t) => t.depth === "medium").length },
    { label: "Deep", id: "deep" as const, count: topics.filter((t) => t.depth === "deep").length },
  ];

  const avgTalkingPoints = (
    topics.reduce((sum, t) => sum + t.talkingPoints.length, 0) / totalTopics
  ).toFixed(1);

  return { totalTopics, totalArticles, totalArticleItems, byCat, byMode, byDepth, avgTalkingPoints };
}

export default function StatsPage() {
  const stats = getStats();
  const maxCatCount = stats.byCat[0]?.count || 1;
  const maxModeCount = stats.byMode[0]?.count || 1;

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Statistics" }]} />

        <div className="text-center pt-12 sm:pt-20 pb-8 max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="section-heading text-4xl sm:text-5xl font-extrabold mb-4 leading-[1.1] tracking-tight">
            Topic Database <span className="gradient-text">Statistics</span>
          </h1>
          <p className="text-base text-[var(--text-muted)] max-w-lg mx-auto leading-relaxed">
            A look inside our curated database of {stats.totalTopics}+ topics and {stats.totalArticles} topic collections.
          </p>
        </div>

        {/* Key numbers */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: `${stats.totalTopics}+`, label: "Curated Topics" },
              { value: String(CATEGORIES.length), label: "Categories" },
              { value: String(MODES.length), label: "Modes" },
              { value: stats.avgTalkingPoints, label: "Avg Talking Points" },
              { value: String(stats.totalArticles), label: "Topic Collections" },
              { value: `${stats.totalArticleItems}+`, label: "Collection Items" },
              { value: "3", label: "Depth Levels" },
              { value: "∞", label: "AI-Generated" },
            ].map((s, i) => (
              <div key={i} className="glass-card p-5 text-center">
                <div
                  className="text-2xl sm:text-3xl font-extrabold gradient-text"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {s.value}
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1 uppercase tracking-wider font-semibold">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Topics by category */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
          <div className="glass-card p-8 sm:p-10">
            <h2
              className="text-xl sm:text-2xl font-bold mb-6 text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Topics by Category
            </h2>
            <div className="space-y-3">
              {stats.byCat.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.id}`}
                  className="flex items-center gap-3 group"
                >
                  <span className="text-lg w-8 text-center">{cat.emoji}</span>
                  <span className="text-sm font-medium text-[var(--text-secondary)] w-28 shrink-0 group-hover:text-[var(--neon-cyan)] transition-colors">
                    {cat.label}
                  </span>
                  <div className="flex-1 h-6 rounded-full bg-[rgba(255,255,255,0.04)] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(cat.count / maxCatCount) * 100}%`,
                        background: "linear-gradient(90deg, var(--neon-pink), var(--neon-purple))",
                        minWidth: "20px",
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-[var(--text-muted)] w-8 text-right tabular-nums">
                    {cat.count}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Topics by mode */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
          <div className="glass-card p-8 sm:p-10">
            <h2
              className="text-xl sm:text-2xl font-bold mb-6 text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Topics by Mode
            </h2>
            <div className="space-y-3">
              {stats.byMode.map((mode) => (
                <Link
                  key={mode.id}
                  href={`/${mode.slug}`}
                  className="flex items-center gap-3 group"
                >
                  <span className="text-lg w-8 text-center">{mode.emoji}</span>
                  <span className="text-sm font-medium text-[var(--text-secondary)] w-28 shrink-0 group-hover:text-[var(--neon-cyan)] transition-colors">
                    {mode.label}
                  </span>
                  <div className="flex-1 h-6 rounded-full bg-[rgba(255,255,255,0.04)] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(mode.count / maxModeCount) * 100}%`,
                        background: "linear-gradient(90deg, var(--neon-cyan), var(--neon-green))",
                        minWidth: "20px",
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-[var(--text-muted)] w-8 text-right tabular-nums">
                    {mode.count}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Depth distribution */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
          <div className="glass-card p-8 sm:p-10">
            <h2
              className="text-xl sm:text-2xl font-bold mb-6 text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Depth Distribution
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {stats.byDepth.map((d) => (
                <div key={d.id} className="text-center">
                  <div
                    className="text-3xl font-extrabold mb-1"
                    style={{
                      fontFamily: "var(--font-display)",
                      color:
                        d.id === "light"
                          ? "var(--neon-green)"
                          : d.id === "medium"
                          ? "var(--neon-yellow)"
                          : "var(--neon-pink)",
                    }}
                  >
                    {d.count}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] uppercase tracking-wider font-semibold">
                    {d.label}
                  </div>
                  <div className="text-xs text-[var(--text-muted)] mt-1">
                    {((d.count / stats.totalTopics) * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Dataset schema for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Dataset",
              name: "Random Topics Database",
              description: `A curated database of ${stats.totalTopics}+ discussion topics across ${CATEGORIES.length} categories and ${MODES.length} modes, with ${stats.totalArticles} in-depth topic collection articles.`,
              url: "https://randomtopics.app/stats",
              creator: {
                "@type": "Organization",
                name: "Random Topics",
                url: "https://randomtopics.app",
              },
              variableMeasured: [
                { "@type": "PropertyValue", name: "Total Topics", value: stats.totalTopics },
                { "@type": "PropertyValue", name: "Categories", value: CATEGORIES.length },
                { "@type": "PropertyValue", name: "Modes", value: MODES.length },
                { "@type": "PropertyValue", name: "Topic Collections", value: stats.totalArticles },
              ],
            }),
          }}
        />

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 text-center">
          <Link
            href="/"
            className="btn-generate animate-pulse-glow inline-flex items-center gap-2 text-lg px-10 py-4"
          >
            <span>🎲</span> Try the Generator
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
