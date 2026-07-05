import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import TopicGenerator from "@/components/TopicGenerator";
import Link from "next/link";
import { CATEGORIES, MODES } from "@/data/types";
import type { Category } from "@/data/types";
import { categorySeoContentEs } from "@/data/categorySeoContent.es";
import { categoryToArticles } from "@/data/internalLinks";
import { MODE_LABELS, CATEGORY_LABELS } from "@/i18n/dictionaries";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";
import type { Metadata } from "next";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return CATEGORIES.map((cat) => ({ category: cat.id }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const catL = CATEGORY_LABELS.es[category as Category];
  const label = catL?.label ?? "Temas";

  return {
    title: { absolute: `Temas de ${label} al Azar - Ideas y Preguntas de ${label} | Random Topics` },
    description: `Genera temas de ${label.toLowerCase()} al azar para conversaciones, escritura, debates y más. ${catL?.description ?? "Explora temas interesantes."}`,
    alternates: {
      canonical: `/es/categories/${category}`,
      languages: hreflangAlternates(`/categories/${category}`),
    },
  };
}

export default async function CategoryPageEs({ params }: CategoryPageProps) {
  const { category } = await params;
  const cat = CATEGORIES.find((c) => c.id === category);
  const catL = CATEGORY_LABELS.es[category as Category];
  const label = catL?.label ?? "Temas";
  const seoContent = categorySeoContentEs[category as Category];
  const related = categoryToArticles[category];

  return (
    <>
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/es" },
            { label: "Categorías", href: "/es/categories" },
            { label },
          ]}
        />
        <TopicGenerator
          initialCategory={category as Category}
          locale="es"
          title={`Generador de Temas de ${label}`}
          subtitle={catL?.description ?? "Explora temas interesantes de esta categoría."}
        />

        {seoContent && (
          <>
            <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
              <div className="glass-card p-8 sm:p-10">
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-5" style={{ fontFamily: "var(--font-display)" }}>
                  Sobre los Temas de {label}
                </h2>
                <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{seoContent.intro}</p>
              </div>
            </section>

            <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
              <div className="glass-card p-8 sm:p-10">
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-6" style={{ fontFamily: "var(--font-display)" }}>
                  Temas de {label} Populares
                </h2>
                <ul className="space-y-4">
                  {seoContent.sampleTopics.map((topic, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--neon-cyan)]/15 text-[var(--neon-cyan)] text-xs font-bold flex items-center justify-center mt-0.5">{i + 1}</span>
                      <span className="text-[var(--text-secondary)] text-sm leading-relaxed">{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
              <div className="glass-card p-8 sm:p-10">
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-6" style={{ fontFamily: "var(--font-display)" }}>
                  Preguntas Frecuentes
                </h2>
                <div className="space-y-6">
                  {seoContent.faqs.map((faq, i) => (
                    <div key={i}>
                      <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2" style={{ fontFamily: "var(--font-display)" }}>{faq.question}</h3>
                      <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {related && (
              <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
                <div className="glass-card p-8 sm:p-10">
                  <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-4" style={{ fontFamily: "var(--font-display)" }}>
                    Artículos Relacionados de {label}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {related.map((article, i) => (
                      <Link
                        key={i}
                        href={`/es${article.href}`}
                        className="text-sm p-3 rounded-lg border border-[rgba(255,255,255,0.06)] text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/30 hover:bg-[rgba(0,229,255,0.05)] transition-all"
                      >
                        {article.title} →
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            )}

            <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
              <div className="glass-card p-8 sm:p-10">
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mb-4" style={{ fontFamily: "var(--font-display)" }}>
                  Generadores de {label}
                </h2>
                <div className="flex flex-wrap gap-3">
                  {MODES.map((mode) => (
                    <Link
                      key={mode.slug}
                      href={`/es/${mode.slug}/${category}`}
                      className="text-sm px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.06)] text-[var(--text-secondary)] hover:text-[var(--neon-pink)] hover:border-[var(--neon-pink)]/30 hover:bg-[rgba(255,45,120,0.05)] transition-all"
                    >
                      {mode.emoji} {label}: {MODE_LABELS.es[mode.id].label}
                    </Link>
                  ))}
                </div>
              </div>
            </section>

            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  inLanguage: "es",
                  mainEntity: seoContent.faqs.map((faq) => ({
                    "@type": "Question",
                    name: faq.question,
                    acceptedAnswer: { "@type": "Answer", text: faq.answer },
                  })),
                }),
              }}
            />
          </>
        )}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/es` },
                { "@type": "ListItem", position: 2, name: "Categorías", item: `${SITE_URL}/es/categories` },
                { "@type": "ListItem", position: 3, name: label },
              ],
            }),
          }}
        />
      </main>
      <Footer locale="es" />
    </>
  );
}
