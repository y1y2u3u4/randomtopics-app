import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { CATEGORIES } from "@/data/types";
import { CATEGORY_LABELS } from "@/i18n/dictionaries";
import { hreflangAlternates } from "@/i18n/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Explora Temas por Categoría | Generador de Temas al Azar" },
  description:
    "Explora temas al azar en 16 categorías, entre ellas ciencia, tecnología, filosofía, psicología, historia y más. Encuentra el tema perfecto para cualquier ocasión.",
  alternates: { canonical: "/es/categories", languages: hreflangAlternates("/categories") },
};

export default function CategoriesPageEs() {
  return (
    <>
      <Navbar />
      <main className="flex-1" lang="es">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4" style={{ fontFamily: "var(--font-display)" }}>
            Explora Temas por <span className="gradient-text">Categoría</span>
          </h1>
          <p className="text-center text-[var(--text-muted)] mb-12 max-w-2xl mx-auto">
            Explora nuestra colección de temas al azar organizada en 16 categorías. Pulsa cualquier categoría para generar temas de esa área.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/es/categories/${cat.id}`}
                className="glass-card p-6 hover:border-[var(--accent-blue)]/30 transition-all hover:translate-y-[-2px] group"
              >
                <span className="text-3xl mb-3 block">{cat.emoji}</span>
                <h2 className="text-lg font-semibold mb-2 group-hover:text-[var(--accent-blue)] transition-colors" style={{ fontFamily: "var(--font-display)" }}>
                  {CATEGORY_LABELS.es[cat.id].label}
                </h2>
                <p className="text-sm text-[var(--text-muted)]">{CATEGORY_LABELS.es[cat.id].description}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer locale="es" />
    </>
  );
}
