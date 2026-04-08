import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import Link from "next/link";
import { CATEGORIES, MODES } from "@/data/types";
import type { Category, Mode } from "@/data/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface ComboPageProps {
  params: Promise<{ mode: string; category: string }>;
}

const VALID_MODES = MODES.map((m) => m.slug);
const VALID_CATEGORIES = CATEGORIES.map((c) => c.id);

export function generateStaticParams() {
  const params: { mode: string; category: string }[] = [];
  for (const mode of MODES) {
    for (const cat of CATEGORIES) {
      params.push({ mode: mode.slug, category: cat.id });
    }
  }
  return params;
}

export async function generateMetadata({ params }: ComboPageProps): Promise<Metadata> {
  const { mode, category } = await params;
  if (!VALID_MODES.includes(mode) || !VALID_CATEGORIES.includes(category as Category)) return {};

  const modeInfo = MODES.find((m) => m.slug === mode)!;
  const catInfo = CATEGORIES.find((c) => c.id === category)!;

  const title = `${catInfo.label} ${modeInfo.label} - Random ${catInfo.label} ${modeInfo.label} Generator`;
  const description = `Generate random ${catInfo.label.toLowerCase()} ${modeInfo.label.toLowerCase()} instantly. ${catInfo.description}. Free, no signup required.`;

  return {
    title,
    description,
    alternates: { canonical: `/${mode}/${category}` },
    openGraph: {
      title,
      description,
      url: `https://randomtopics.app/${mode}/${category}`,
      siteName: "Random Topics",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function ModeCategoryPage({ params }: ComboPageProps) {
  const { mode, category } = await params;

  if (!VALID_MODES.includes(mode) || !VALID_CATEGORIES.includes(category as Category)) {
    notFound();
  }

  const modeInfo = MODES.find((m) => m.slug === mode)!;
  const catInfo = CATEGORIES.find((c) => c.id === category)!;

  const relatedModes = MODES.filter((m) => m.slug !== mode);
  const relatedCategories = CATEGORIES.filter((c) => c.id !== category).slice(0, 8);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: modeInfo.label, href: `/${mode}` },
            { label: catInfo.label },
          ]}
        />
        <TopicGenerator
          initialMode={mode as Mode}
          initialCategory={category as Category}
          title={`${catInfo.label} ${modeInfo.label}`}
          subtitle={`Generate ${catInfo.label.toLowerCase()} ${modeInfo.label.toLowerCase()} for any occasion. ${catInfo.description}.`}
        />

        {/* SEO content */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="glass-card p-8 sm:p-10">
            <h2
              className="text-xl sm:text-2xl font-bold mb-4 text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {catInfo.emoji} {catInfo.label} {modeInfo.label}
            </h2>
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed">
              <p>
                Looking for <strong>{catInfo.label.toLowerCase()} {modeInfo.label.toLowerCase()}</strong>?
                Our generator combines a curated database of 500+ topics with AI-powered generation to deliver
                fresh {catInfo.label.toLowerCase()} topics tailored for {modeInfo.label.toLowerCase().replace(/s$/, "").replace(/topic/, "discussion")}.
                Whether you need topics for a classroom, a meeting, a writing session, or just for fun —
                generate as many as you want, completely free.
              </p>
              <p>
                Each generated topic includes talking points to help you explore the subject in depth.
                Filter by depth level (Light, Medium, or Deep) to match your audience and context.
              </p>
            </div>
          </div>
        </section>

        {/* Related: other modes for this category */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
          <div className="glass-card p-8 sm:p-10">
            <h2
              className="text-lg font-bold mb-4 text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              More {catInfo.label} Generators
            </h2>
            <div className="flex flex-wrap gap-3">
              {relatedModes.map((m) => (
                <Link
                  key={m.slug}
                  href={`/${m.slug}/${category}`}
                  className="text-sm px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.06)] text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/30 hover:bg-[rgba(0,229,255,0.05)] transition-all"
                >
                  {m.emoji} {catInfo.label} {m.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Related: other categories for this mode */}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <div className="glass-card p-8 sm:p-10">
            <h2
              className="text-lg font-bold mb-4 text-[var(--text-primary)]"
              style={{ fontFamily: "var(--font-display)" }}
            >
              More {modeInfo.label}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {relatedCategories.map((c) => (
                <Link
                  key={c.id}
                  href={`/${mode}/${c.id}`}
                  className="text-sm p-3 rounded-lg border border-[rgba(255,255,255,0.06)] text-[var(--text-secondary)] hover:text-[var(--neon-pink)] hover:border-[var(--neon-pink)]/30 hover:bg-[rgba(255,45,120,0.05)] transition-all text-center"
                >
                  {c.emoji} {c.label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: `${catInfo.label} ${modeInfo.label}`,
              description: `Generate random ${catInfo.label.toLowerCase()} ${modeInfo.label.toLowerCase()}. ${catInfo.description}.`,
              url: `https://randomtopics.app/${mode}/${category}`,
              isPartOf: {
                "@type": "WebSite",
                name: "Random Topics",
                url: "https://randomtopics.app",
              },
              breadcrumb: {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: "Home", item: "https://randomtopics.app" },
                  { "@type": "ListItem", position: 2, name: modeInfo.label, item: `https://randomtopics.app/${mode}` },
                  { "@type": "ListItem", position: 3, name: catInfo.label },
                ],
              },
            }),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
