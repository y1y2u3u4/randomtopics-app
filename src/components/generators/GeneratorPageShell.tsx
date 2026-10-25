import SubEntryFor from "@/components/subs/SubEntryFor";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FaqSchema from "@/components/FaqSchema";
import { SITE_URL } from "@/i18n/config";
import { generatorsFor } from "@/data/generators/registry";
import heroSizes from "@/data/generators/heroImages.json";
import KeepPlaying from "@/components/KeepPlaying";
import TryNext from "@/components/TryNext";
import PublicAdPlacement from "@/components/PublicAdPlacement";

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
  /** Themed illustration above the H1 (public/generators/hero, WebP; size in heroImages.json). */
  hero?: { src: string; alt: string };
  /** Hide the hero on short viewports so the tool itself stays above the fold. */
  heroHideOnShort?: boolean;
  /** Two-to-three sentence answer shown first in the explainer ("In short"). */
  inShort?: React.ReactNode;
  /** Extra sections between the tool and the explainer. */
  afterTool?: React.ReactNode;
}

const UI = {
  en: { home: "Home", generators: "Random generators", more: "More random generators", faq: "Frequently asked questions", updated: "Updated", related: "Related tools" },
  es: { home: "Inicio", generators: "Generadores aleatorios", more: "Más generadores aleatorios", faq: "Preguntas frecuentes", updated: "Actualizado", related: "Herramientas relacionadas" },
};

export default function GeneratorPageShell(props: Props) {
  const { locale, path, name, heading, intro, description, updated, faq, children, content, related = [], hero, heroHideOnShort, inShort, afterTool } = props;
  const ui = UI[locale];
  const others = generatorsFor(locale, { crossLinks: true }).filter((g) => g.href !== path);
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
        <section className={`max-w-3xl mx-auto px-4 sm:px-6 ${heroHideOnShort ? "pt-6 sm:pt-8 pb-4" : "pt-10 pb-6"} text-center`}>
          {hero && (
            // eslint-disable-next-line @next/next/no-img-element -- small pre-sized WebP, no optimizer needed
            <img src={hero.src} alt={hero.alt} decoding="async"
              {...(heroSizes as Record<string, { width: number; height: number }>)[hero.src]}
              className={`mx-auto mb-6 h-28 sm:h-40 w-auto rounded-2xl${heroHideOnShort ? " [@media(max-height:900px)]:hidden" : ""}`} />
          )}
          <h1 className="section-heading text-4xl sm:text-6xl font-extrabold mb-4" style={{ fontFamily: "var(--font-display)" }}>
            {heading[0]} <span className="gradient-text">{heading[1]}</span>
          </h1>
          <p className="text-[var(--text-muted)] max-w-xl mx-auto">{intro}</p>
        </section>

        {children}
        <SubEntryFor path={path} />

        <TryNext path={path} />

        <PublicAdPlacement path={path} placement="result" />

        {afterTool}

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
          <div className="glass-card p-7 sm:p-10">
            <div className="space-y-4 text-[var(--text-secondary)] text-sm leading-relaxed generator-copy">
              {inShort && (
                <div className="rounded-xl border border-[var(--neon-cyan)]/30 bg-[rgba(0,229,255,0.05)] p-4">
                  <p className="text-xs uppercase tracking-widest text-[var(--neon-cyan)] mb-1">In short</p>
                  <p className="text-[var(--text-primary)]">{inShort}</p>
                </div>
              )}
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

        <KeepPlaying path={path} />

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
