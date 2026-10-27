import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FaqSchema from "@/components/FaqSchema";
import LocaleTopicPicker, { type LocaleTopicGroup, type PickerUi } from "@/components/LocaleTopicPicker";
import TryNext from "@/components/TryNext";
import { SITE_URL } from "@/i18n/config";

// Shared shell for standalone language pages that are not a full site locale
// (Portuguese since 2026-10-21; same layout as the Turkish /tr pages). The
// en/es switcher is hidden; sibling pages and the English original are linked.

type Faq = { question: string; answer: string };
type SiblingPage = { href: string; label: string; detail: string };

export type LocalePageCopy = {
  lang: string;
  currency: string;
  homeHref: string;
  homeLabel: string;
  meta: string;
  siblingsHeading: string;
  howToHeading: string;
  listHeading: string;
  faqHeading: string;
  englishNote: string;
  englishLabel: string;
  ui: PickerUi;
};

type Props = {
  path: string;
  title: string;
  lead: string;
  groups: LocaleTopicGroup[];
  mode?: "card" | "wheel" | "timer";
  buttonLabel?: string;
  howTo: string[];
  faq: Faq[];
  copy: LocalePageCopy;
  siblings: SiblingPage[];
  /** English (or Spanish) original this page translates, linked at the end. */
  englishHref?: string;
  extra?: React.ReactNode;
  /** Spanish is a full site locale, so its pages keep the en/es switcher. */
  showLocaleSwitcher?: boolean;
  /** Quick next-step chips shown under the tool (batch-1 pt/fr/tr pages). */
  tryNext?: { href: string; label: string; emoji: string }[];
};

export default function LocaleToolPage({ path, title, lead, groups, mode, buttonLabel, howTo, faq, copy, siblings, englishHref = "/", extra, showLocaleSwitcher = false, tryNext }: Props) {
  const total = groups.reduce((n, g) => n + g.topics.length, 0);
  return (
    <>
      <FaqSchema items={faq} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: title,
            url: `${SITE_URL}${path}`,
            inLanguage: copy.lang,
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: copy.currency },
          }),
        }}
      />
      <Navbar showLocaleSwitcher={showLocaleSwitcher} />
      <main className="flex-1">
        {path === copy.homeHref ? null : <Breadcrumb items={[{ label: copy.homeLabel, href: copy.homeHref }, { label: title }]} />}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-6 text-center">
          <h1 className="section-heading text-3xl sm:text-4xl text-[var(--text-primary)]">{title}</h1>
          <p className="mt-4 text-[var(--text-secondary)] leading-relaxed">{lead}</p>
          <p className="mt-2 text-xs text-[var(--text-muted)]">{copy.meta.replace("{n}", String(total))}</p>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-8">
          <LocaleTopicPicker groups={groups} mode={mode} buttonLabel={buttonLabel} ui={copy.ui} />
        </section>

        {tryNext && tryNext.length > 0 && (
          <TryNext path={path} tools={tryNext} locale={copy.lang.slice(0, 2) as "pt" | "fr" | "tr" | "es"} />
        )}

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-8">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">{copy.siblingsHeading}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {siblings.filter((p) => p.href !== path).map((p) => (
              <Link prefetch={false} key={p.href} href={p.href} className="glass-card p-4 hover:border-[var(--neon-cyan)]/30 transition-colors">
                <p className="text-sm font-bold text-[var(--text-primary)]">{p.label}</p>
                <p className="text-xs text-[var(--text-muted)] mt-1">{p.detail}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-16">
          <div className="glass-card p-6 sm:p-10 space-y-4 text-sm leading-relaxed text-[var(--text-secondary)]">
            <h2 className="section-heading text-2xl text-[var(--text-primary)]">{copy.howToHeading}</h2>
            <ol className="list-decimal pl-5 space-y-2">
              {howTo.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            {extra}
            <h2 className="section-heading text-2xl text-[var(--text-primary)] pt-4">{copy.listHeading}</h2>
            {groups.map((g) => (
              <div key={g.id}>
                <h3 className="text-base font-semibold text-[var(--text-primary)] pt-2">{g.label}</h3>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  {g.topics.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
            <h2 className="section-heading text-2xl text-[var(--text-primary)] pt-4">{copy.faqHeading}</h2>
            {faq.map((item) => (
              <div key={item.question}>
                <h3 className="text-base font-semibold text-[var(--text-primary)] pt-2">{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
            <p className="pt-4 text-xs text-[var(--text-muted)]">
              {copy.englishNote} <Link prefetch={false} href={englishHref} className="text-[var(--neon-cyan)] hover:underline">{copy.englishLabel}</Link>.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
