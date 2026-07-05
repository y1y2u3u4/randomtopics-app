import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import { SEO_ARTICLES_ES } from "@/data/seoContent.es";
import { hreflangAlternates } from "@/i18n/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Listas y Guías de Temas — Colecciones para Cada Ocasión | Random Topics" },
  description:
    "Explora nuestras colecciones de temas de conversación, ideas de debate, ideas para escribir, preguntas rompehielos y mucho más. Encuentra los temas perfectos para cualquier situación.",
  alternates: { canonical: "/es/topics", languages: hreflangAlternates("/topics") },
};

export default function TopicsIndexPageEs() {
  return (
    <>
      <Navbar />
      <main className="flex-1" lang="es">
        <Breadcrumb items={[{ label: "Inicio", href: "/es" }, { label: "Temas" }]} />

        <div className="text-center pt-12 sm:pt-20 pb-8 sm:pb-12 max-w-4xl mx-auto px-4 sm:px-6">
          <h1 className="section-heading text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 leading-[1.1] tracking-tight">
            Colecciones de <span className="gradient-text">Temas</span>
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-muted)] max-w-xl mx-auto leading-relaxed opacity-80">
            Listas seleccionadas de temas de conversación, ideas de debate, ideas para escribir y más, para cada ocasión.
          </p>
        </div>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SEO_ARTICLES_ES.map((article) => (
              <Link
                key={article.slug}
                href={`/es/topics/${article.slug}`}
                className="glass-card p-6 transition-all duration-300 hover:translate-y-[-3px] group hover:border-[var(--neon-cyan)]/40 hover:shadow-[0_0_20px_rgba(0,229,255,0.12)] hover:bg-gradient-to-br hover:from-[rgba(0,229,255,0.05)] hover:to-transparent"
              >
                <h2 className="text-base font-bold mb-2 group-hover:text-[var(--neon-cyan)] transition-colors leading-snug" style={{ fontFamily: "var(--font-display)" }}>
                  {article.title}
                </h2>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed line-clamp-2">{article.metaDescription}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer locale="es" />
    </>
  );
}
