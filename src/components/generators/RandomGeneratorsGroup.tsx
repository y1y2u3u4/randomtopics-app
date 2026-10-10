import Link from "next/link";
import { generatorsFor } from "@/data/generators/registry";

/** "Random generators" group for the homepage and /categories. */
export default function RandomGeneratorsGroup({ locale = "en" }: { locale?: "en" | "es" }) {
  const items = generatorsFor(locale);
  if (items.length === 0) return null;
  return (
    <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-10" aria-labelledby={`random-generators-${locale}`}>
      <h2 id={`random-generators-${locale}`} className="text-sm font-bold text-[var(--text-primary)] mb-3">
        {locale === "es" ? "Generadores aleatorios" : "Random generators"}
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {items.map((g) => (
          <Link key={g.href} href={g.href} className="glass-card p-4 hover:border-[var(--neon-cyan)]/30 transition-all group">
            <span className="text-2xl" aria-hidden="true">{g.emoji}</span>
            <p className="text-sm font-bold text-[var(--text-primary)] mt-2 group-hover:text-[var(--neon-cyan)]">{g.label}</p>
            <p className="text-xs text-[var(--text-muted)] mt-1">{g.detail}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
