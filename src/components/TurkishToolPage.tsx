import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FaqSchema from "@/components/FaqSchema";
import TurkishTopicPicker from "@/components/TurkishTopicPicker";
import type { TurkishTopicGroup } from "@/data/turkishTopics";
import { SITE_URL } from "@/i18n/config";

// Shared shell for the standalone Turkish pages. Turkish is not a site locale
// (no tr dictionaries), so these pages hide the en/es switcher and link only
// to each other plus the English home.

export const TR_PAGES = [
  { href: "/tr", label: "Rastgele Konu Seçici", detail: "Her konuda rastgele konu" },
  { href: "/tr/rastgele-konu-carki", label: "Rastgele Konu Çarkı", detail: "Çarkı çevir, konu çıksın" },
  { href: "/tr/rastgele-arastirma-konulari", label: "Rastgele Araştırma Konuları", detail: "Ödev ve proje fikirleri" },
  { href: "/tr/1-dakika-konusma-konulari", label: "1 Dakika Konuşma Konuları", detail: "60 saniyelik sayaçla" },
  { href: "/tr/munazara-konulari", label: "Münazara Konuları", detail: "Sınıf ve kulüp için tartışma" },
  { href: "/tr/sohbet-konulari", label: "Sohbet Konuları", detail: "Konuşmayı başlatan sorular" },
  { href: "/tr/gunun-sorusu", label: "Günün Sorusu", detail: "Her gün yeni bir soru" },
  { href: "/tr/komik-sorular", label: "Komik Sorular", detail: "Arkadaş ortamı için" },
  { href: "/tr/bugun-ne-yesem", label: "Bugün Ne Yesem?", detail: "Karar veremeyenlere yemek önerisi" },
];

type Faq = { question: string; answer: string };

type Props = {
  path: string;
  title: string;
  lead: string;
  groups: TurkishTopicGroup[];
  mode?: "card" | "wheel" | "timer";
  buttonLabel?: string;
  howTo: string[];
  faq: Faq[];
  /** Override the sibling cards (the /tr home lists every page). */
  siblings?: { href: string; label: string; detail: string }[];
};

export default function TurkishToolPage({ path, title, lead, groups, mode, buttonLabel, howTo, faq, siblings = TR_PAGES }: Props) {
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
            inLanguage: "tr",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "TRY" },
          }),
        }}
      />
      <Navbar showLocaleSwitcher={false} />
      <main className="flex-1">
        {path === "/tr" ? null : <Breadcrumb items={[{ label: "Rastgele Konu Seçici", href: "/tr" }, { label: title }]} />}
        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 pb-6 text-center">
          <h1 className="section-heading text-3xl sm:text-4xl text-[var(--text-primary)]">{title}</h1>
          <p className="mt-4 text-[var(--text-secondary)] leading-relaxed">{lead}</p>
          <p className="mt-2 text-xs text-[var(--text-muted)]">Ücretsiz · kayıt yok · {total} Türkçe konu · 19 Ekim 2026&apos;da yayımlandı</p>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-8">
          <TurkishTopicPicker groups={groups} mode={mode} buttonLabel={buttonLabel} />
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pb-8">
          <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">Diğer Türkçe araçlar</h2>
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
            <h2 className="section-heading text-2xl text-[var(--text-primary)]">Nasıl kullanılır?</h2>
            <ol className="list-decimal pl-5 space-y-2">
              {howTo.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <h2 className="section-heading text-2xl text-[var(--text-primary)] pt-4">Konu listesi</h2>
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
            <h2 className="section-heading text-2xl text-[var(--text-primary)] pt-4">Sıkça sorulan sorular</h2>
            {faq.map((item) => (
              <div key={item.question}>
                <h3 className="text-base font-semibold text-[var(--text-primary)] pt-2">{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
            <p className="pt-4 text-xs text-[var(--text-muted)]">
              İngilizce konu üretici için <Link prefetch={false} href="/" className="text-[var(--neon-cyan)] hover:underline">Random Topics</Link> ana sayfasına göz atın.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
