import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import PrintButton from "@/components/PrintButton";
import FaqSchema from "@/components/FaqSchema";
import type { SpanishMostLikelyConfig } from "@/data/mostLikelySpanishClusters";
import { SITE_URL } from "@/i18n/config";

function sectionId(heading: string) {
  return heading
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function SpanishMostLikelyCollectionPage({ config }: { config: SpanishMostLikelyConfig }) {
  const pageUrl = `${SITE_URL}/es/topics/${config.slug}`;

  return (
    <>
      <FaqSchema items={config.faq} />
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb
          items={[
            { label: "Inicio", href: "/es" },
            { label: "Temas", href: "/es/topics" },
            { label: config.title },
          ]}
        />

        <section className="text-center pt-12 sm:pt-20 pb-8 sm:pb-12 max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="section-heading text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 leading-tight">{config.title}</h1>
          <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">{config.heroSubtitle}</p>
          <p className="text-xs text-[var(--text-muted)] mt-3">Publicado y actualizado: 25 de agosto de 2026</p>
          <div className="mt-5 flex justify-center">
            <PrintButton
              heading={config.title}
              items={config.sections.flatMap((section) => section.items)}
              intro={config.heroSubtitle}
              label="Imprimir o guardar como PDF"
              locale="es"
            />
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
          <div className="glass-card p-8 sm:p-10">
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{config.intro}</p>
            <nav aria-label="Contenido de la página" className="mt-6 border-t border-white/10 pt-5">
              <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3">En esta página</p>
              <div className="flex flex-wrap gap-2">
                {config.sections.map((section) => (
                  <a key={section.heading} href={`#${sectionId(section.heading)}`} className="text-xs px-3 py-2 rounded-lg border border-white/10 text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/30 transition-colors">
                    {section.heading}
                  </a>
                ))}
              </div>
            </nav>
          </div>
        </section>

        {config.sections.map((section, sectionIndex) => (
          <section id={sectionId(section.heading)} key={section.heading} className="max-w-3xl mx-auto px-4 sm:px-6 pb-10 scroll-mt-24">
            <div className="glass-card p-8 sm:p-10">
              <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">{section.heading}</h2>
              <p className="text-sm text-[var(--text-muted)] mt-2 mb-5">{section.description}</p>
              <ol className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--neon-pink)]/10 text-[var(--neon-pink)] text-xs font-bold flex items-center justify-center mt-0.5">
                      {sectionIndex * 15 + itemIndex + 1}
                    </span>
                    <span className="text-sm leading-relaxed text-[var(--text-secondary)]">{item}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>
        ))}

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10 text-center">
          <div className="glass-card p-6 sm:p-8 border-[var(--neon-cyan)]/20 bg-gradient-to-r from-[rgba(0,229,255,0.04)] to-[rgba(255,45,120,0.04)]">
            <p className="text-sm text-[var(--text-secondary)] mb-4">¿Prefieres sacar una pregunta nueva con cada clic?</p>
            <Link href="/es/most-likely-to" className="btn-generate inline-flex items-center gap-2 text-sm px-6 py-3">
              <span aria-hidden="true">👉</span> Abrir el generador de Quién es más probable
            </Link>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-10">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Preguntas frecuentes</h2>
            <div className="mt-5 space-y-5">
              {config.faq.map((item) => (
                <div key={item.question}>
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">{item.question}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Más preguntas para jugar</h2>
            <div className="flex flex-wrap gap-3">
              {config.relatedLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-sm px-4 py-2 rounded-lg border border-white/10 text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/30 transition-colors">
                  {link.label}
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
              "@type": "Article",
              inLanguage: "es",
              headline: config.title,
              description: config.metaDescription,
              datePublished: "2026-08-25",
              dateModified: "2026-08-25",
              author: { "@type": "Organization", name: "Random Topics", url: SITE_URL },
              publisher: { "@type": "Organization", name: "Random Topics", url: SITE_URL },
              mainEntityOfPage: { "@type": "WebPage", "@id": pageUrl },
            }),
          }}
        />
      </main>
      <Footer locale="es" />
    </>
  );
}
