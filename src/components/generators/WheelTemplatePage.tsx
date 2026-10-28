import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import WheelOfNames from "@/components/generators/WheelOfNames";
import WheelFamilyLinks from "@/components/wheel/WheelFamilyLinks";
import { WHEEL_TEMPLATES, type WheelTemplate } from "@/data/wheelTemplates";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";

export function wheelTemplate(slug: string): WheelTemplate {
  const t = WHEEL_TEMPLATES.find((x) => x.slug === slug);
  if (!t) throw new Error(`Unknown wheel template ${slug}`);
  return t;
}

export function wheelTemplateMetadata(slug: string): Metadata {
  const t = wheelTemplate(slug);
  const path = `/${t.slug}`;
  const social = generatorSocial({ card: t.slug, title: t.title, description: t.description, alt: `${t.name}: a colorful spinning wheel` });
  return {
    title: { absolute: t.title },
    description: t.description,
    keywords: t.keywords,
    alternates: { canonical: path, languages: hreflangAlternates(path) },
    openGraph: { title: t.title, description: t.description, url: `${SITE_URL}${path}`, siteName: "Random Topics", type: "website", images: social.images },
    twitter: social.twitter,
  };
}

export default function WheelTemplatePage({ slug }: { slug: string }) {
  const t = wheelTemplate(slug);
  const path = `/${t.slug}`;
  return (
    <GeneratorPageShell
      locale="en"
      path={path}
      name={t.name}
      heading={t.heading}
      intro={t.intro}
      description={t.description}
      updated="2026-10-28"
      faq={t.faq}
      inShort={t.inShort}
      related={[...t.related, { href: "/spin-the-wheel", label: "Spin the wheel (topics)" }]}
      afterTool={<WheelFamilyLinks path={path} />}
      content={
        <>
          <SectionTitle>How to use the {t.name.toLowerCase()}</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            {t.howTo.map((s) => <li key={s}>{s}</li>)}
          </ol>
          <SectionTitle>What people use it for</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            {t.uses.map((u) => <li key={u.title}><strong>{u.title}</strong> — {u.text}</li>)}
          </ul>
          <SectionTitle>What the wheel can do</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Import</strong> a CSV or TXT file (read in your browser, never uploaded).</li>
            <li><strong>Weights</strong> to give some entries better odds.</li>
            <li><strong>Remove the winner</strong> after each spin to draw without repeats.</li>
            <li><strong>Spin history</strong> with counts for every entry, and a link that reopens the same wheel.</li>
            <li><strong>Keyboard</strong>: Tab to the Spin button, or press Ctrl+Enter (Cmd+Enter on Mac) anywhere on the page. With reduced motion on, the wheel skips the long spin.</li>
          </ul>
          <p>
            Want a topic or a question to land on instead? Try the <Link prefetch={false} href="/spin-the-wheel" className={linkClass}>spin the wheel topic generator</Link>, or the{" "}
            <Link prefetch={false} href="/decision-maker" className={linkClass}>decision maker</Link> for a yes-or-no verdict.
          </p>
        </>
      }
    >
      <WheelOfNames extended={{ pageId: t.pageId, pro: true, preset: t.preset, removeDefault: t.removeDefault }} />
    </GeneratorPageShell>
  );
}
