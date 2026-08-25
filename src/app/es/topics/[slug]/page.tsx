import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import { SEO_ARTICLES_ES } from "@/data/seoContent.es";
import { articleToPages } from "@/data/internalLinks";
import { MODES, CATEGORIES } from "@/data/types";
import { MODE_LABELS, CATEGORY_LABELS } from "@/i18n/dictionaries";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PrintButton from "@/components/PrintButton";

function sectionId(heading: string) {
  return heading
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface ArticlePageProps {
  params: Promise<{ slug: string }>;
}

const ARTICLE_CTA_ES: Record<string, { href: string; text: string; label: string; emoji: string }> = {
  "most-likely-to-questions": {
    href: "/es/most-likely-to",
    text: "¿Quieres seguir jugando sin leer la lista en orden? Saca una pregunta nueva con cada clic.",
    label: "Abrir el Generador de Quién Es Más Probable",
    emoji: "👉",
  },
  "controversial-topics-to-discuss": {
    href: "/es/debate",
    text: "¿Quieres practicar una postura al azar? Genera un tema y usa los puntos de apoyo para defender ambos lados.",
    label: "Abrir el Generador de Debate",
    emoji: "⚔️",
  },
  "public-speaking-topics-for-beginners": {
    href: "/es/speech",
    text: "Elige un tema, genera una propuesta y ensaya tu discurso con el temporizador integrado.",
    label: "Practicar Oratoria con Temporizador",
    emoji: "⏱️",
  },
  "conversation-topics-for-teens": {
    href: "/es/conversation",
    text: "Saca una pregunta nueva para la clase, la familia o el grupo juvenil y usa sus puntos para continuar la conversación.",
    label: "Abrir el Generador de Conversación",
    emoji: "💬",
  },
};

export function generateStaticParams() {
  return SEO_ARTICLES_ES.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = SEO_ARTICLES_ES.find((a) => a.slug === slug);
  if (!article) return {};

  return {
    title: { absolute: article.metaTitle },
    description: article.metaDescription,
    alternates: {
      canonical: `/es/topics/${article.slug}`,
      languages: hreflangAlternates(`/topics/${article.slug}`),
    },
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      url: `${SITE_URL}/es/topics/${article.slug}`,
      siteName: "Random Topics",
      locale: "es_ES",
      type: "article",
      publishedTime: article.publishDate,
      modifiedTime: article.lastModified,
    },
  };
}

export default async function ArticlePageEs({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = SEO_ARTICLES_ES.find((a) => a.slug === slug);
  if (!article) notFound();
  const articleCta = ARTICLE_CTA_ES[article.slug] ?? {
    href: "/es",
    text: "¿Quieres más temas como estos? Genera temas al azar ilimitados al instante.",
    label: "Prueba el Generador — Es Gratis",
    emoji: "🎲",
  };

  return (
    <>
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/es" },
            { label: "Temas", href: "/es/topics" },
            { label: article.title },
          ]}
        />

        <div className="text-center pt-12 sm:pt-20 pb-8 sm:pb-12 max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="section-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-[1.15] tracking-tight">
            {article.heroTitle}
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed opacity-80">
            {article.heroSubtitle}
          </p>
          <p className="text-xs text-[var(--text-muted)] mt-3">
            Publicado: {new Date(article.publishDate).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
            {article.lastModified !== article.publishDate && (
              <> · Actualizado: {new Date(article.lastModified).toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}</>
            )}
          </p>
          <div className="mt-5 flex justify-center">
            <PrintButton
              heading={article.heroTitle}
              items={article.sections.flatMap((section) => section.items)}
              intro={article.heroSubtitle}
              label="Imprimir o guardar como PDF"
              locale="es"
            />
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Article",
              inLanguage: "es",
              headline: article.title,
              description: article.metaDescription,
              datePublished: article.publishDate,
              dateModified: article.lastModified,
              author: { "@type": "Organization", name: "Random Topics", url: SITE_URL },
              publisher: { "@type": "Organization", name: "Random Topics", url: SITE_URL },
              mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/es/topics/${article.slug}` },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/es` },
                { "@type": "ListItem", position: 2, name: "Temas", item: `${SITE_URL}/es/topics` },
                { "@type": "ListItem", position: 3, name: article.title },
              ],
            }),
          }}
        />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
          <div className="glass-card p-8 sm:p-10">
            <p className="text-[var(--text-secondary)] text-sm leading-relaxed">{article.intro}</p>
            {article.sections.length >= 3 && (
              <nav aria-label="Contenido de la página" className="mt-6 border-t border-white/10 pt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">En esta página</p>
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

        {article.sections.reduce<{ elements: React.ReactNode[]; runningCount: number }>(
          (acc, section, sIdx) => {
            const startNum = acc.runningCount;
            acc.elements.push(
              <section id={sectionId(section.heading)} key={sIdx} className="max-w-3xl mx-auto px-4 sm:px-6 pb-10 scroll-mt-24">
                <div className="glass-card p-8 sm:p-10">
                  <h2 className="text-xl sm:text-2xl font-bold mb-2 text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                    {section.heading}
                  </h2>
                  {section.description && <p className="text-[var(--text-muted)] text-sm mb-5">{section.description}</p>}
                  <ol className="space-y-3">
                    {section.items.map((item, iIdx) => (
                      <li key={iIdx} className="flex items-start gap-3">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--neon-pink)]/10 text-[var(--neon-pink)] text-xs font-bold flex items-center justify-center mt-0.5">
                          {startNum + iIdx + 1}
                        </span>
                        <span className="text-sm text-[var(--text-secondary)] leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>
            );
            acc.runningCount = startNum + section.items.length;

            if (sIdx === Math.floor(article.sections.length / 2) - 1) {
              acc.elements.push(
                <section key="mid-cta" className="max-w-3xl mx-auto px-4 sm:px-6 pb-10 text-center">
                  <div className="glass-card p-6 sm:p-8 border-[var(--neon-cyan)]/20 bg-gradient-to-r from-[rgba(0,229,255,0.04)] to-[rgba(255,45,120,0.04)]">
                    <p className="text-sm text-[var(--text-secondary)] mb-4">
                      {articleCta.text}
                    </p>
                    <Link href={articleCta.href} className="btn-generate inline-flex items-center gap-2 text-sm px-6 py-3">
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

        {article.faq.length > 0 && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
            <div className="glass-card p-8 sm:p-10">
              <h2 className="text-xl sm:text-2xl font-bold mb-6 text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                Preguntas Frecuentes
              </h2>
              <div className="space-y-5">
                {article.faq.map((f, i) => (
                  <div key={i}>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-1.5">{f.question}</h3>
                    <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{f.answer}</p>
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
                  inLanguage: "es",
                  mainEntity: article.faq.map((f) => ({
                    "@type": "Question",
                    name: f.question,
                    acceptedAnswer: { "@type": "Answer", text: f.answer },
                  })),
                }),
              }}
            />
          </section>
        )}

        {articleToPages[article.slug] && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
            <div className="glass-card p-8 sm:p-10">
              <h2 className="text-lg font-bold mb-4 text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                Explora los Generadores
              </h2>
              <div className="flex flex-wrap gap-3">
                {articleToPages[article.slug].modes.map((modeSlug) => {
                  const mode = MODES.find((m) => m.slug === modeSlug);
                  return mode ? (
                    <Link
                      key={mode.slug}
                      href={`/es/${mode.slug}`}
                      className="text-sm px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.06)] text-[var(--text-secondary)] hover:text-[var(--neon-pink)] hover:border-[var(--neon-pink)]/30 hover:bg-[rgba(255,45,120,0.05)] transition-all"
                    >
                      {mode.emoji} {MODE_LABELS.es[mode.id].label}
                    </Link>
                  ) : null;
                })}
                {articleToPages[article.slug].categories.map((catId) => {
                  const cat = CATEGORIES.find((c) => c.id === catId);
                  return cat ? (
                    <Link
                      key={cat.id}
                      href={`/es/categories/${cat.id}`}
                      className="text-sm px-4 py-2 rounded-lg border border-[rgba(255,255,255,0.06)] text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/30 hover:bg-[rgba(0,229,255,0.05)] transition-all"
                    >
                      {cat.emoji} Temas de {CATEGORY_LABELS.es[cat.id].label}
                    </Link>
                  ) : null;
                })}
              </div>
            </div>
          </section>
        )}

        {article.relatedLinks.length > 0 && (
          <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
            <div className="glass-card p-8 sm:p-10">
              <h2 className="text-lg font-bold mb-4 text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
                Temas Relacionados
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

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="text-lg font-bold mb-4 text-[var(--text-primary)]" style={{ fontFamily: "var(--font-display)" }}>
              Más Colecciones de Temas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SEO_ARTICLES_ES.filter((a) => a.slug !== article.slug)
                .slice(0, 6)
                .map((a) => (
                  <Link
                    key={a.slug}
                    href={`/es/topics/${a.slug}`}
                    className="text-sm p-3 rounded-lg border border-[rgba(255,255,255,0.06)] text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/30 hover:bg-[rgba(0,229,255,0.05)] transition-all"
                  >
                    {a.title} →
                  </Link>
                ))}
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16 text-center">
          <Link href={articleCta.href} className="btn-generate animate-pulse-glow inline-flex items-center gap-2 text-lg px-10 py-4">
            <span>{articleCta.emoji}</span> {articleCta.label}
          </Link>
        </section>
      </main>
      <Footer locale="es" />
    </>
  );
}
