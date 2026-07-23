import Link from "next/link";
import { MODES, CATEGORIES } from "@/data/types";
import { Locale, localeBase, localizePath, defaultLocale } from "@/i18n/config";
import { getDict, MODE_LABELS, CATEGORY_LABELS } from "@/i18n/dictionaries";

export default function Footer({ locale = defaultLocale }: { locale?: Locale }) {
  const base = localeBase(locale);
  const t = getDict(locale);
  const linkClass =
    "text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors";

  const tools: { href: string; label: string }[] = [
    { href: localizePath("/", locale), label: "🎲 Random Topic Generator" },
    { href: `${base}/funny`, label: `😂 ${t.footer.funnyTopics}` },
    { href: `${base}/argument-generator`, label: `⚖️ ${t.footer.argumentGenerator}` },
    { href: `${base}/table-topics-generator`, label: `🎙️ ${t.footer.tableTopics}` },
    { href: `${base}/impromptu-speech-topics`, label: `⏱️ ${t.footer.impromptuSpeech}` },
    { href: `${base}/question-generator`, label: `❓ ${t.footer.questionGenerator}` },
    { href: `${base}/would-you-rather`, label: `🤔 ${t.footer.wouldYouRather}` },
    { href: `${base}/never-have-i-ever`, label: `🙈 ${t.footer.neverHaveIEver}` },
    { href: `${base}/spin-the-wheel`, label: `🎡 ${t.footer.spinTheWheel}` },
    { href: `${base}/truth-or-dare`, label: `🎭 ${t.footer.truthOrDare}` },
    { href: `${base}/this-or-that`, label: `⚖️ ${t.footer.thisOrThat}` },
    { href: `${base}/most-likely-to`, label: `👉 ${t.footer.mostLikelyTo}` },
    { href: `${base}/two-truths-and-a-lie`, label: `🕵️ ${t.footer.twoTruthsAndALie}` },
    { href: localizePath("/press", locale) + "#embed", label: `🔗 ${t.footer.embedWidget}` },
    // English-only tool pages (no /es counterpart) — rendered only on the
    // English locale so the footer never links to a nonexistent /es route.
    ...(locale === "en"
      ? [
          { href: "/question-of-the-day", label: "✨ Question of the Day" },
          { href: "/charades", label: "🎭 Charades Generator" },
          { href: "/journal-prompts", label: "📓 Journal Prompts" },
          { href: "/hot-seat-questions", label: "🔥 Hot Seat Questions" },
          { href: "/paranoia-questions", label: "🤫 Paranoia Questions" },
          { href: "/essay-topic-generator", label: "📝 Essay Topic Generator" },
          { href: "/random-subject-generator", label: "🧪 Random Subject Generator" },
          { href: "/group-discussion-topics", label: "🗣️ GD Topics" },
          { href: "/speech/persuasive", label: "📣 Persuasive Speech Topics" },
          { href: "/speech/informative", label: "📖 Informative Speech Topics" },
          { href: "/debate/questions", label: "💬 Debate Question Generator" },
          { href: "/debate/motions", label: "🏛️ Debate Motions" },
        ]
      : []),
  ];

  const headingStyle = { fontFamily: "var(--font-display)", color: "var(--text-secondary)" };

  return (
    <footer className="mt-auto pt-16 pb-8 px-4 sm:px-6 relative">
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, var(--neon-pink), var(--neon-cyan), transparent)",
          opacity: 0.3,
        }}
      />

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-sm font-semibold mb-4" style={headingStyle}>
              {t.footer.generators}
            </h3>
            <ul className="space-y-2">
              {MODES.map((mode) => (
                <li key={mode.slug}>
                  <Link href={`${base}/${mode.slug}`} className={linkClass}>
                    {mode.emoji} {MODE_LABELS[locale][mode.id].label}
                  </Link>
                </li>
              ))}
              {tools.map((tool) => (
                <li key={tool.href}>
                  <Link href={tool.href} className={linkClass}>
                    {tool.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4" style={headingStyle}>
              {t.footer.categories}
            </h3>
            <ul className="space-y-2">
              {CATEGORIES.slice(0, 8).map((cat) => (
                <li key={cat.id}>
                  <Link href={localizePath(`/categories/${cat.id}`, locale)} className={linkClass}>
                    {cat.emoji} {CATEGORY_LABELS[locale][cat.id].label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4" style={headingStyle}>
              {t.footer.moreCategories}
            </h3>
            <ul className="space-y-2">
              {CATEGORIES.slice(8).map((cat) => (
                <li key={cat.id}>
                  <Link href={localizePath(`/categories/${cat.id}`, locale)} className={linkClass}>
                    {cat.emoji} {CATEGORY_LABELS[locale][cat.id].label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-4" style={headingStyle}>
              {t.footer.about}
            </h3>
            <ul className="space-y-2">
              <li><Link href={localizePath("/about", locale)} className={linkClass}>{t.footer.aboutUs}</Link></li>
              <li><Link href="/how-we-curate" className={linkClass}>How We Curate</Link></li>
              <li><Link href={localizePath("/privacy", locale)} className={linkClass}>{t.footer.privacy}</Link></li>
              <li><Link href={localizePath("/terms", locale)} className={linkClass}>{t.footer.terms}</Link></li>
              <li><Link href={localizePath("/press", locale)} className={linkClass}>{t.footer.press}</Link></li>
              <li><Link href={localizePath("/contact", locale)} className={linkClass}>{t.footer.contact}</Link></li>
              <li><Link href={localizePath("/categories", locale)} className={linkClass}>{t.footer.allCategories}</Link></li>
              <li><Link href={localizePath("/topics", locale)} className={linkClass}>{t.footer.topicCollections}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎲</span>
            <span className="font-semibold" style={{ fontFamily: "var(--font-display)" }}>
              <span className="gradient-text">Random</span>
              <span className="text-[var(--text-primary)]">Topics</span>
            </span>
          </div>
          <p className="text-sm text-[var(--text-muted)]">
            &copy; {new Date().getFullYear()} randomtopics.app. {t.footer.tagline}
          </p>
        </div>
      </div>
    </footer>
  );
}
