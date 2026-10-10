import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { privacyPolicy } from "@/data/privacyPolicy";
const providers = [
  ["Google", "https://policies.google.com/privacy"],
  ["Microsoft Clarity", "https://privacy.microsoft.com/privacystatement"],
  ["Supabase", "https://supabase.com/privacy"],
  ["Vercel", "https://vercel.com/legal/privacy-policy"],
  ["OpenRouter", "https://openrouter.ai/privacy"],
  ["Stripe", "https://stripe.com/privacy"],
  ["Google My Ad Center", "https://myadcenter.google.com/"],
  ["aboutads.info", "https://www.aboutads.info/choices/"],
] as const;
export default function PrivacyPolicy({locale = "en"}: {locale?: "en" | "es"}) {
  const copy = privacyPolicy[locale];
  return <><Navbar /><main className="flex-1 px-4 sm:px-6 py-10" lang={locale}><div className="max-w-3xl mx-auto space-y-6">
    <header className="space-y-4"><h1 className="text-3xl sm:text-5xl font-bold">{copy.title}</h1><p className="text-sm text-[var(--text-muted)]">{copy.updated}</p><p className="text-[var(--text-secondary)] leading-relaxed">{copy.intro}</p><Link href={locale === "en" ? "/es/privacy" : "/privacy"} hrefLang={locale === "en" ? "es" : "en"} className="inline-block underline min-h-11 text-[var(--neon-cyan)]">{locale === "en" ? "Leer en español" : "Read in English"}</Link></header>
    {copy.sections.map(section=><section key={section.id} id={section.id} data-privacy-section={section.id} className="glass-card p-5 sm:p-8 space-y-3"><h2 className="text-xl sm:text-2xl font-semibold">{section.title}</h2>{section.paragraphs.map(p=><p key={p} className="text-[var(--text-secondary)] leading-relaxed">{p}</p>)}</section>)}
    <section className="glass-card p-5 sm:p-8"><h2 className="text-xl font-semibold">{copy.resources}</h2><ul className="mt-3 space-y-3">{providers.map(([name,url])=><li key={name}><a href={url} className="underline text-[var(--neon-cyan)]">{name}</a></li>)}</ul></section>
    <section className="glass-card p-5 sm:p-8 space-y-3"><h2 className="text-xl font-semibold">{copy.contact}</h2><p className="text-[var(--text-secondary)]">{copy.contactText}</p><a href="mailto:zhanggongqing1314007@gmail.com" className="block break-all underline text-[var(--neon-cyan)]">zhanggongqing1314007@gmail.com</a><Link href={locale === "es" ? "/es/contact" : "/contact"} className="inline-block underline min-h-11">{copy.contactLink}</Link></section>
  </div></main><Footer locale={locale} /></>;
}
