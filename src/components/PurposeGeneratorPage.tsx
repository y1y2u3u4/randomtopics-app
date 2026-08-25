import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FaqSchema from "@/components/FaqSchema";
import PurposeTopicGenerator from "@/components/PurposeTopicGenerator";
import type { PurposeGeneratorConfig } from "@/data/purposeGenerators";
import { SITE_URL } from "@/i18n/config";

export default function PurposeGeneratorPage({ config }: { config: PurposeGeneratorConfig }) {
  const categories = [...new Set(config.prompts.map((prompt) => prompt.category))];

  return (
    <>
      <FaqSchema items={config.faq} />
      <Navbar />
      <main className="flex-1">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: config.name }]} />

        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-10 text-center">
          <p className="text-4xl mb-4" aria-hidden="true">{config.emoji}</p>
          <h1 className="section-heading text-4xl sm:text-6xl font-extrabold mb-4">{config.title}</h1>
          <p className="text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">{config.subtitle}</p>
        </section>

        <PurposeTopicGenerator config={config} />

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="section-heading text-2xl sm:text-3xl text-[var(--text-primary)]">
              A Focused {config.name}
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-[var(--text-secondary)]">{config.intro}</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-7">
              {config.uses.map((use) => (
                <div key={use.heading} className="rounded-xl border border-white/10 p-4">
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">{use.heading}</h3>
                  <p className="text-xs leading-relaxed text-[var(--text-muted)] mt-2">{use.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">How to use the generator</h2>
            <ol className="mt-5 space-y-3">
              {config.steps.map((step, index) => (
                <li key={step} className="flex gap-3 text-sm text-[var(--text-secondary)]">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--neon-pink)]/10 text-[var(--neon-pink)] text-xs font-bold flex items-center justify-center">{index + 1}</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Example topics by category</h2>
            <p className="mt-2 text-sm text-[var(--text-muted)]">A crawlable sample from the same editor-written pool used by the generator.</p>
            <div className="mt-6 space-y-7">
              {categories.map((category) => (
                <div key={category}>
                  <h3 className="text-base font-semibold text-[var(--neon-cyan)]">{category}</h3>
                  <ul className="mt-3 space-y-3">
                    {config.prompts.filter((prompt) => prompt.category === category).slice(0, 3).map((prompt) => (
                      <li key={prompt.text} className="flex items-start gap-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                        <span className="text-[var(--neon-pink)]" aria-hidden="true">•</span>
                        <span><strong className="text-[var(--text-primary)]">{prompt.text}</strong> — {prompt.angle}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
          <div className="glass-card p-8 sm:p-10">
            <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">Frequently asked questions</h2>
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

        <section className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-16">
          <h2 className="section-heading text-2xl text-center mb-6">Related tools and collections</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {config.relatedLinks.map((link) => (
              <Link key={link.href} href={link.href} className="glass-card p-5 text-sm font-semibold text-[var(--text-secondary)] hover:text-[var(--neon-cyan)] hover:border-[var(--neon-cyan)]/30 transition-colors">
                <span aria-hidden="true">{link.emoji}</span> {link.label} →
              </Link>
            ))}
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: config.name,
              url: `${SITE_URL}/${config.slug}`,
              applicationCategory: config.applicationCategory,
              operatingSystem: "Any",
              isAccessibleForFree: true,
              description: config.metaDescription,
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
            }),
          }}
        />
      </main>
      <Footer />
    </>
  );
}
