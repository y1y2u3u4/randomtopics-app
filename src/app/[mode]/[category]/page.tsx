import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import Link from "next/link";
import { CATEGORIES, MODES } from "@/data/types";
import type { Category, Mode } from "@/data/types";
import { topics } from "@/data/topics";
import { categorySeoContent } from "@/data/categorySeoContent";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Mode-specific usage angle — combined with per-category intro and real
// sample topics below, this differentiates every mode×category combo page.
const MODE_ANGLES: Record<Mode, (cat: string) => string> = {
  conversation: (cat) =>
    `As conversation starters, ${cat.toLowerCase()} topics work best when you let curiosity lead: open with the question, share your own take briefly, then dig into why the other person sees it differently. Use the Light depth filter for casual settings and Deep when the group is ready for a longer exchange.`,
  writing: (cat) =>
    `As writing prompts, ${cat.toLowerCase()} topics give you a ready-made angle for essays, blog posts, and journal entries. Treat the talking points as an instant outline: each one can become a paragraph, and the strongest becomes your thesis.`,
  debate: (cat) =>
    `As debate topics, ${cat.toLowerCase()} propositions come with natural pro and con positions. Assign sides, give both teams two minutes of prep with the talking points, and judge on evidence and rebuttal — not volume.`,
  speech: (cat) =>
    `As speech topics, ${cat.toLowerCase()} subjects work for both prepared talks and impromptu practice. Generate one, take 30 seconds to pick your main point, and speak for two minutes — the built-in talking points double as a speech skeleton.`,
  icebreaker: (cat) =>
    `As icebreakers, ${cat.toLowerCase()} questions get groups talking without putting anyone on the spot. Keep the depth on Light for new teams, and let volunteers answer first — momentum does the rest.`,
};

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

  // Front-load the exact phrase and let the layout template supply the
  // "| Random Topic Generator" suffix. Repeating the phrase here pushed every
  // combo title past 90 chars, so Google truncated it mid-word in the SERP.
  const title = `${catInfo.label} ${modeInfo.label}`;
  const description = `Generate random ${catInfo.label.toLowerCase()} ${modeInfo.label.toLowerCase()} instantly. ${catInfo.description}. Free, no signup required.`;

  return {
    title,
    description,
    // AdSense "Low value content" remediation (2026-07): these 80 mode×category
    // combo pages share one template with ~2 differentiated fields (category
    // intro + sample topics) — below the 3-field bar for standalone indexable
    // pages. Keep them for users/navigation, but noindex like the /es combos.
    robots: { index: false, follow: true },
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

  // Real, deterministic sample topics for THIS mode×category combination —
  // unique content per combo page, drawn from the actual generator database.
  const sampleTopics = topics
    .filter((t) => t.modes.includes(modeInfo.id) && t.category === (category as Category))
    .slice(0, 6);
  const catSeo = categorySeoContent[category as Category];

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
              <p>{catSeo.intro}</p>
              <p>{MODE_ANGLES[modeInfo.id](catInfo.label)}</p>
              <p>
                Each generated topic includes talking points to help you explore the subject in depth.
                Filter by depth level (Light, Medium, or Deep) to match your audience and context.
              </p>
            </div>
          </div>
        </section>

        {/* Sample topics — unique to this mode × category */}
        {sampleTopics.length > 0 && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
            <div className="glass-card p-8 sm:p-10">
              <h2
                className="text-lg font-bold mb-4 text-[var(--text-primary)]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Example {catInfo.label} {modeInfo.label}
              </h2>
              <ul className="space-y-3 text-sm text-[var(--text-secondary)] leading-relaxed">
                {sampleTopics.map((t) => (
                  <li key={t.id} className="flex items-start gap-3">
                    <span
                      className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0"
                      style={{ background: "var(--neon-cyan)" }}
                    />
                    <span>{t.text}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-[var(--text-muted)] mt-5">
                These are pulled straight from the generator&apos;s curated database — hit Generate above
                for the full set with talking points.
              </p>
            </div>
          </section>
        )}

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
