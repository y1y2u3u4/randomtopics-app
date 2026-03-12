import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { CATEGORIES } from "@/data/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Browse Topics by Category | Random Topic Generator",
  description:
    "Browse random topics across 16 categories including science, technology, philosophy, psychology, history, and more. Find the perfect topic for any occasion.",
};

export default function CategoriesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
          <h1
            className="text-3xl sm:text-4xl font-bold text-center mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Browse Topics by <span className="gradient-text">Category</span>
          </h1>
          <p className="text-center text-[var(--text-muted)] mb-12 max-w-2xl mx-auto">
            Explore our collection of random topics organized into 16 categories.
            Click any category to generate topics from that area.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.id}`}
                className="glass-card p-6 hover:border-[var(--accent-blue)]/30 transition-all hover:translate-y-[-2px] group"
              >
                <span className="text-3xl mb-3 block">{cat.emoji}</span>
                <h2
                  className="text-lg font-semibold mb-2 group-hover:text-[var(--accent-blue)] transition-colors"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {cat.label}
                </h2>
                <p className="text-sm text-[var(--text-muted)]">
                  {cat.description}
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
