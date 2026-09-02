import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import PremiumPromptTool from "@/components/PremiumPromptTool";
import SpeechTimer from "@/components/SpeechTimer";
import type { PremiumCollectionConfig } from "@/data/premiumTypes";
import { SITE_URL } from "@/i18n/config";

function groupByCategory(config: PremiumCollectionConfig) {
  return config.filters
    .find((filter) => filter.key === "category")
    ?.options.map((category) => ({
      category,
      items: config.items.filter((item) => item.category === category),
    })).filter((group) => group.items.length > 0) ?? [];
}

function dailyIndex(slug: string, total: number) {
  const day = Math.floor(Date.now() / 86_400_000);
  const salt = [...slug].reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return (day + salt) % total;
}

export default function PremiumCollectionPage({ config }: { config: PremiumCollectionConfig }) {
  const categoryGroups = groupByCategory(config);
  const initialItem = config.tool.daily
    ? config.items[dailyIndex(config.slug, config.items.length)]
    : undefined;
  const initialDateLabel = config.tool.daily
    ? new Date().toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      timeZone: "UTC",
    })
    : undefined;
  const absoluteUrl = `${SITE_URL}${config.path}`;
  const breadcrumbParent = config.path.startsWith("/topics/")
    ? { label: "Topics", href: "/topics" }
    : config.path.startsWith("/question-of-the-day")
      ? { label: "Question of the Day", href: "/question-of-the-day" }
      : config.parentLink;

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Breadcrumb items={[
          { label: "Home", href: "/" },
          breadcrumbParent,
          { label: config.title },
        ]} />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              name: config.title,
              description: config.metaDescription,
              url: absoluteUrl,
              datePublished: config.published,
              dateModified: config.updated,
              isPartOf: { "@type": "WebSite", name: "Random Topics", url: SITE_URL },
              mainEntity: {
                "@type": "WebApplication",
                name: config.tool.title,
                applicationCategory: config.library.category === "business" ? "BusinessApplication" : "EducationalApplication",
                operatingSystem: "Any",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
                featureList: [
                  "Audience filters",
                  "No-repeat random prompts",
                  "Copy",
                  "Save",
                  "Share",
                  "Print",
                  ...(config.tool.planner ? ["Five-day prompt planner"] : []),
                  ...(config.tool.timer ? ["Five-minute speech timer", "Timed speech outlines"] : []),
                ],
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
                { "@type": "ListItem", position: 2, name: breadcrumbParent.label, item: `${SITE_URL}${breadcrumbParent.href}` },
                { "@type": "ListItem", position: 3, name: config.title, item: absoluteUrl },
              ],
            }),
          }}
        />

        <header className="max-w-4xl mx-auto px-4 sm:px-6 pt-12 sm:pt-20 pb-9 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--neon-cyan)]">{config.eyebrow}</p>
          <h1 className="section-heading text-3xl sm:text-5xl lg:text-6xl font-extrabold mt-3 leading-[1.1] tracking-tight">
            {config.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[var(--text-muted)] max-w-2xl mx-auto leading-relaxed">
            {config.subtitle}
          </p>
          <p className="mt-4 text-xs text-[var(--text-muted)]">
            Published {new Date(config.published).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            {config.updated !== config.published ? <> · Reviewed {new Date(config.updated).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</> : null}
          </p>
        </header>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="glass-card p-5 text-center"><p className="text-2xl font-extrabold gradient-text">{config.items.length}</p><p className="text-xs text-[var(--text-muted)] mt-1">{config.itemCountLabel}</p></div>
            <div className="glass-card p-5 text-center"><p className="text-2xl font-extrabold gradient-text">{config.filters.length}</p><p className="text-xs text-[var(--text-muted)] mt-1">Useful filters</p></div>
            <div className="glass-card p-5 text-center"><p className="text-2xl font-extrabold gradient-text">100%</p><p className="text-xs text-[var(--text-muted)] mt-1">Editor-written and free</p></div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-9">
          <div className="glass-card p-7 sm:p-9">
            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">{config.intro}</p>
            <p className="mt-4 text-xs leading-relaxed text-[var(--text-muted)]">
              Every item follows the site&apos;s published <Link href="/how-we-curate" className="text-[var(--neon-cyan)] hover:underline">editorial standards</Link>: open-ended, usable without specialist knowledge, safe for the named audience, and paired with a way to keep the discussion moving.
            </p>
          </div>
        </section>

        <PremiumPromptTool config={config} initialItemId={initialItem?.id} initialDateLabel={initialDateLabel} />

        {config.tool.timer && (
          <section className="max-w-md mx-auto px-4 sm:px-6 pt-10" aria-labelledby="five-minute-practice-timer">
            <div className="mb-4 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--neon-cyan)]">Practice the topic now</p>
              <h2 id="five-minute-practice-timer" className="mt-2 text-2xl font-bold text-[var(--text-primary)]">Built-in 5-Minute Speech Timer</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">Choose a topic above, take 30 seconds to outline it, then deliver the full speech without leaving the page.</p>
            </div>
            <SpeechTimer defaultSeconds={300} contentSource={config.source} />
          </section>
        )}

        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
          <div className="glass-card p-7 sm:p-9">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">{config.guide.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{config.guide.intro}</p>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              {config.guide.steps.map((step, index) => (
                <li key={step.title} className="rounded-xl border border-white/10 p-5">
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--neon-cyan)]">Step {index + 1}</p>
                  <h3 className="mt-1 font-bold text-[var(--text-primary)]">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{step.description}</p>
                </li>
              ))}
            </ol>
            {config.disclaimer && <p className="mt-5 rounded-xl border border-[var(--neon-pink)]/20 bg-[rgba(255,45,120,0.04)] p-4 text-xs leading-relaxed text-[var(--text-muted)]">{config.disclaimer}</p>}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
          <div className="glass-card p-7 sm:p-9">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">How this collection was curated</h2>
            <ul className="mt-5 space-y-3 text-sm text-[var(--text-secondary)] list-disc pl-5">
              {config.qualityNotes.map((note) => <li key={note}>{note}</li>)}
            </ul>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)]">Browse all {config.items.length} {config.promptNoun}s</h2>
              <p className="mt-1 text-sm text-[var(--text-muted)]">The complete collection is visible and printable; filters above simply make it faster to choose.</p>
            </div>
            <a href="#premium-tool-title" className="text-sm text-[var(--neon-cyan)] hover:underline">Back to filters ↑</a>
          </div>
          <div className="space-y-7">
            {categoryGroups.map((group) => (
              <section key={group.category} id={group.category.toLowerCase().replace(/[^a-z0-9]+/g, "-")} className="glass-card p-6 sm:p-8 scroll-mt-24">
                <h3 className="text-xl font-bold text-[var(--text-primary)]">{group.category}</h3>
                <p className="mt-1 text-xs text-[var(--text-muted)]">{group.items.length} curated {config.promptNoun}s</p>
                <ol className="mt-5 space-y-4">
                  {group.items.map((item, index) => (
                    <li key={item.id} className="rounded-xl border border-white/10 p-4 sm:p-5">
                      <div className="flex gap-3 items-start">
                        <span className="shrink-0 w-7 h-7 rounded-full bg-[var(--neon-pink)]/10 text-[var(--neon-pink)] text-xs font-bold flex items-center justify-center">{index + 1}</span>
                        <div className="min-w-0">
                          <p className="text-sm sm:text-base leading-relaxed font-semibold text-[var(--text-primary)]">{item.prompt}</p>
                          <p className="mt-2 text-xs text-[var(--text-muted)]">{item.audience} · {item.useCase} · {item.duration} · {item.depth}</p>
                          {(item.choices || item.followUps.length > 0) && (
                            <details className="mt-3">
                              <summary className="cursor-pointer text-xs font-semibold text-[var(--neon-cyan)]">Show discussion support</summary>
                              <div className="mt-3 space-y-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                                {item.choices && <p><strong>Choices:</strong> {item.choices[0]} / {item.choices[1]}</p>}
                                {item.values?.length ? <p><strong>Values:</strong> {item.values.join(" · ")}</p> : null}
                                {item.followUps.length > 0 && <p><strong>Follow-ups:</strong> {item.followUps.join(" · ")}</p>}
                                {item.facilitationTip && <p><strong>Facilitator note:</strong> {item.facilitationTip}</p>}
                              </div>
                            </details>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </section>
            ))}
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
          <div className="glass-card p-7 sm:p-9">
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">Frequently asked questions</h2>
            <div className="mt-5 space-y-5">
              {config.faq.map((item) => (
                <div key={item.question}>
                  <h3 className="font-semibold text-[var(--text-primary)]">{item.question}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:pb-16">
          <div className="glass-card p-7 sm:p-9">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Continue with the right collection</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              <Link href={config.parentLink.href} className="rounded-xl border border-[var(--neon-cyan)]/20 p-4 hover:bg-[rgba(0,229,255,0.05)] transition-colors">
                <p className="font-semibold text-[var(--neon-cyan)]">{config.parentLink.label} ←</p>
                <p className="mt-1 text-xs text-[var(--text-muted)]">Return to the broader parent collection.</p>
              </Link>
              {config.relatedLinks.map((link) => (
                <Link key={link.href} href={link.href} className="rounded-xl border border-white/10 p-4 hover:border-[var(--neon-cyan)]/30 transition-colors">
                  <p className="font-semibold text-[var(--text-primary)]">{link.label} →</p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">{link.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
