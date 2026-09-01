import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import { SEO_ARTICLES } from "@/data/seoContent";
import { STUDENT_ETHICS_CONFIG, WORKPLACE_ETHICS_CONFIG } from "@/data/premiumEthics";
import { STUDENT_QOTD_CONFIG, WORK_QOTD_CONFIG } from "@/data/premiumQotd";
import { ADULT_ETHICS_CONFIG } from "@/data/premiumAdultEthics";
import { DEEP_CONVERSATION_CONFIG } from "@/data/premiumDeepConversation";
import type { Metadata } from "next";

const GUIDED_COLLECTIONS = [
  STUDENT_ETHICS_CONFIG,
  WORKPLACE_ETHICS_CONFIG,
  STUDENT_QOTD_CONFIG,
  WORK_QOTD_CONFIG,
  ADULT_ETHICS_CONFIG,
  DEEP_CONVERSATION_CONFIG,
];

export const metadata: Metadata = {
  title: "Topic Lists & Guides - Curated Collections for Every Occasion",
  description:
    "Browse our curated collections of conversation topics, debate ideas, writing prompts, icebreaker questions, and more. Find the perfect topics for any situation.",
  keywords: [
    "topic lists",
    "conversation topics",
    "discussion topics",
    "topic ideas",
    "random topics",
    "question lists",
  ],
  alternates: {
    canonical: "/topics",
  },
};

export default function TopicsIndexPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Topics" },
          ]}
        />

        <div className="text-center pt-12 sm:pt-20 pb-8 sm:pb-12 max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="section-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-[1.1] tracking-tight">
            Topic <span className="gradient-text">Collections</span>
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed opacity-80">
            Curated lists of conversation topics, debate ideas, writing prompts, and more for every occasion.
          </p>
        </div>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-5">
            <div>
              <h2 className="text-2xl font-bold text-[var(--text-primary)]">Guided collections</h2>
              <p className="text-sm text-[var(--text-muted)] mt-1">Filterable, printable collections with original prompts and built-in workflows.</p>
            </div>
            <Link href="/how-we-curate" className="text-sm text-[var(--neon-cyan)] hover:underline">How we curate →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {GUIDED_COLLECTIONS.map((collection) => (
              <Link
                key={collection.slug}
                href={collection.path}
                className="glass-card p-6 border-[var(--neon-cyan)]/20 transition-all duration-300 hover:translate-y-[-3px] hover:border-[var(--neon-cyan)]/40 hover:shadow-[0_0_20px_rgba(0,229,255,0.12)]"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--neon-cyan)]">{collection.items.length} original prompts · {collection.filters.length} filters</p>
                <h3 className="text-lg font-bold mt-2 text-[var(--text-primary)]">{collection.title}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed mt-2 line-clamp-2">{collection.metaDescription}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-5">All topic lists and guides</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SEO_ARTICLES.map((article) => (
              <Link
                key={article.slug}
                href={`/topics/${article.slug}`}
                className="glass-card p-6 transition-all duration-300 hover:translate-y-[-3px] group
                  hover:border-[var(--neon-cyan)]/40
                  hover:shadow-[0_0_20px_rgba(0,229,255,0.12)]
                  hover:bg-gradient-to-br hover:from-[rgba(0,229,255,0.05)] hover:to-transparent"
              >
                <h2
                  className="text-base font-bold mb-2 group-hover:text-[var(--neon-cyan)] transition-colors leading-snug"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {article.title}
                </h2>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">
                  {article.metaDescription}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
