import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import UnicodeTextTool from "@/components/generators/UnicodeTextTool";
import { TEXT_TOOL_PAGES } from "@/data/textToolPages";
import { HAS_STRENGTH, STYLE_SETS, TEXT_TOOLS, type Variant } from "@/lib/unicodeText";

// Shared layout for the Unicode text-style pages: same tool, same comparison, page-specific copy.

const yes = <span className="text-[var(--neon-cyan)]">Yes</span>;
const no = <span className="text-[var(--text-muted)]">No</span>;

export default function TextToolPage({ variant }: { variant: Variant }) {
  const p = TEXT_TOOL_PAGES[variant];
  const count = STYLE_SETS[variant].length;
  const strength = HAS_STRENGTH[variant];
  const rows: [string, React.ReactNode, React.ReactNode][] = [
    [`All ${count} styles preview live as you type`, yes, "Partly — often one box per style or a long ad-broken list"],
    ["One tap copies a style (with a “Copied” check)", yes, "Small copy buttons or select-and-copy"],
    ...(strength ? ([["Strength slider (1–10)", yes, "Fixed amount, or a separate page per level"]] as [string, React.ReactNode, React.ReactNode][]) : []),
    ["Same text gives the same result (stable output)", yes, no],
    ["Share link opens the page with your text", yes, no],
    ["Jump to 7 other text styles without retyping", "Yes — tabs above the box", "Separate sites or pages"],
    ["Platform guide (what works where)", yes, no],
    ["Runs in the browser, nothing uploaded", yes, "Usually, rarely stated"],
  ];

  return (
    <GeneratorPageShell
      locale="en"
      path={p.path}
      name={p.name}
      heading={p.heading}
      intro={p.intro}
      description={p.description}
      updated="2026-10-22"
      faq={p.faq}
      hero={p.hero}
      inShort={p.inShort}
      related={TEXT_TOOLS.filter((t) => t.variant !== variant).map((t) => ({ href: t.href, label: `${t.label} text generator`.replace("Sub / superscript text", "Subscript") }))}
      content={
        <>
          <SectionTitle>How to use it</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            {p.howTo.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
          <SectionTitle>How it works</SectionTitle>
          {p.body}
          <SectionTitle>Where it works</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b border-white/15">
                  <th className="py-2 pr-3">Where you paste it</th>
                  <th className="py-2 pr-3">What happens</th>
                </tr>
              </thead>
              <tbody>
                {p.works.map((w) => (
                  <tr key={w.where} className="border-b border-white/10 align-top">
                    <td className="py-2 pr-3 font-medium">{w.where}</td>
                    <td className="py-2 pr-3">{w.result}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <SectionTitle>How this {p.name.toLowerCase()} compares</SectionTitle>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b border-white/15">
                  <th className="py-2 pr-3">Feature</th>
                  <th className="py-2 pr-3">This page</th>
                  <th className="py-2 pr-3">Typical text generator sites</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([f, us, them]) => (
                  <tr key={f} className="border-b border-white/10 align-top">
                    <td className="py-2 pr-3">{f}</td>
                    <td className="py-2 pr-3">{us}</td>
                    <td className="py-2 pr-3">{them}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-[var(--text-muted)]">
            Compared with the top results for “{p.name.toLowerCase()}” in October 2026. Need a name to style? Try the{" "}
            <Link prefetch={false} href="/username-generator" className={linkClass}>username generator</Link>.
          </p>
        </>
      }
    >
      <UnicodeTextTool variant={variant} toolType={p.toolType} />
    </GeneratorPageShell>
  );
}
