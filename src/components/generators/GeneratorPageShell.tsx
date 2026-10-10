import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FaqSchema from "@/components/FaqSchema";
import { SITE_URL } from "@/i18n/config";
import { generatorsFor } from "@/data/generators/registry";

export interface FaqItem { question: string; answer: string }

interface Props {
  locale: "en" | "es";
  path: string;
  name: string;
  /** H1 in two parts so the second can carry the gradient. */
  heading: [string, string];
  intro: string;
  description: string;
  updated: string;
  faq: FaqItem[];
  children: React.ReactNode;
  /** The long-form explainer under the tool. */
  content: React.ReactNode;
  related?: { href: string; label: string }[];
}

const UI = {
  en: { home: "Home", generators: "Random generators", more: "More random generators", faq: "Frequently asked questions", updated: "Updated", related: "Related tools" },
  es: { home: "Inicio", generators: "Generadores aleatorios", more: "Más generadores aleatorios", faq: "Preguntas frecuentes", updated: "Actualizado", related: "Herramientas relacionadas" },
};

export default function GeneratorPageShell(props: Props) {
  const { locale, path, name, heading, intro, description, updated, faq, children, content, related = [] } = props;
  const ui = UI[locale];
  const others = generatorsFor(locale).filter((g) => g.href !== path);
  const appSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    url: `${SITE_URL}${path}`,
    description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any",
    inLanguage: locale,
    isAccessibleForFree: true,
    dateModified: updated,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  };
  const date = new Date(`${updated}T00:00:00Z`).toLocaleDateString(locale === "es" ? "es-ES" : "en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

  return (
    <>
      <FaqSchema items={faq} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }} />
      <Navbar />
      <main className="flex-1" {...(locale === "es" ? { lang: "es" } : {})}>
        <Breadcrumb items={[{ label: ui.home, href: locale === "es" ? "/es" : "/" }, { label: name }]} />
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-6 text-center">
          <h1 className="section-heading text-4xl sm:text-6xl font-extrabold mb-4" style={{ fontFamily: "var(--font-display)" }}>
            {heading[0]} <span className="gradient-text">{heading[1]}</span>
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto">{intro}</p>
        </section>

        {children}

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
          <div className="glass-card p-7 sm:p-10">
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed generator-copy">
              {content}
              <h2 className="text-xl font-semibold text-[var(--text-primary)] pt-4" style={{ fontFamily: "var(--font-display)" }}>{ui.faq}</h2>
              {faq.map((item) => (
                <div key={item.question}>
                  <h3 className="text-base font-semibold text-[var(--text-primary)] pt-2">{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
              ))}
              {related.length > 0 && (
                <p className="pt-4">
                  <strong className="text-[var(--text-primary)]">{ui.related}:</strong>{" "}
                  {related.map((r, i) => (
                    <span key={r.href}>
                      {i > 0 && " · "}
                      <Link href={r.href} className="text-[var(--neon-cyan)] hover:underline">{r.label}</Link>
                    </span>
                  ))}
                </p>
              )}
              <p className="text-xs text-[var(--text-muted)] pt-2">
                {ui.updated}: <time dateTime={updated}>{date}</time>
              </p>
            </div>
          </div>
        </section>

        {others.length > 0 && (
          <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-16">
            <h2 className="text-sm font-bold text-[var(--text-primary)] mb-3">{ui.more}</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {others.map((g) => (
                <Link key={g.href} href={g.href} className="glass-card p-4 hover:border-[var(--neon-cyan)]/30 transition-all group">
                  <span className="text-2xl" aria-hidden="true">{g.emoji}</span>
                  <p className="text-sm font-bold text-[var(--text-primary)] mt-2 group-hover:text-[var(--neon-cyan)]">{g.label}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-1">{g.detail}</p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer locale={locale} />
    </>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-semibold text-[var(--text-primary)] pt-3" style={{ fontFamily: "var(--font-display)" }}>
      {children}
    </h2>
  );
}

export const linkClass = "text-[var(--neon-cyan)] hover:underline";
