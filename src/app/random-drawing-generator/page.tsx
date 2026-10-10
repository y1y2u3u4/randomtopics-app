import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import DrawingGenerator from "@/components/DrawingGenerator";
import { DRAWING_CATEGORIES, DRAWING_PROMPTS } from "@/data/drawingPrompts";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
const title = "Random Drawing Generator — What to Draw & Drawing Prompts | Random Topics";
const description = "Not sure what to draw? Get free random drawing ideas and drawing prompts with sketch tips. Pick a subject and difficulty; draw without repeats. No signup.";
export const metadata: Metadata = {
  title: { absolute: title }, description,
  alternates: { canonical: "/random-drawing-generator", languages: hreflangAlternates("/random-drawing-generator") },
  openGraph: { title, description, url: `${SITE_URL}/random-drawing-generator`, type: "website", siteName: "Random Topics" },
};
const faqs = [
  ["What is a random drawing generator?", "This tool picks a text idea for you to draw by hand. It does not make AI images. Choose a subject and difficulty, then get one, three, or five ideas from our original 48-prompt collection."],
  ["What should I draw when I have no ideas?", "Start with Simple shapes and one idea. Spend five minutes finding the big shapes before adding detail. If you want a different subject, change the filter; used ideas stay out of the current round."],
  ["How can I use a drawing prompt?", "Use the subject as your starting point and the sketch tip as a small constraint. Try the same prompt again with another medium, a different viewpoint, or a shorter time limit. Turn the starting tip off if you only want a quick idea. The sketch reference is one possible starting shape, not the only correct drawing."],
  ["Are the ideas free, and will they repeat?", "The tool is free and needs no account. It draws without repeats within a round in the same browser tab, including after filter changes and page returns. At exhaustion, broaden the filters or explicitly start a fresh round. A new tab starts separately; blocked browser storage prevents return restoration."],
];
export default function RandomDrawingGeneratorPage() {
  return <><Navbar /><main className="flex-1"><Breadcrumb items={[{label:"Home",href:"/"},{label:"Random Drawing Generator"}]} />
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
      <header className="text-center py-4 sm:py-6"><h1 className="text-3xl sm:text-4xl font-extrabold" style={{fontFamily:"var(--font-display)"}}>Random Drawing Generator</h1><p className="mt-3 text-base text-[var(--text-secondary)]">Not sure what to draw? Start with this idea, or draw another.</p><p className="mt-2 text-xs text-[var(--text-secondary)]">48 ideas · Free · Draw them yourself</p></header>
      <DrawingGenerator />
      <section className="glass-card p-5 sm:p-8 mt-8"><h2 className="text-2xl font-bold">What to draw: start small, then add one challenge</h2><p className="mt-3 text-[var(--text-muted)]">A drawing prompt is a starting point, not a test. For a quick warm-up, choose Everyday or Nature and Simple shapes. For perspective, movement, or an imaginary scene, try More detail. Fantasy ideas use the More detail level. Nine simple subjects include original line guides you can show or hide.</p><ol className="list-decimal pl-5 mt-4 space-y-2"><li>Choose one idea and give yourself five minutes.</li><li>Block in the largest shapes; leave fine details until last.</li><li>Use the sketch tip to practise one thing, such as overlap, light, or viewpoint.</li><li>Keep your first sketch. Try the subject again from a different angle.</li></ol></section>
      <section className="mt-8"><h2 className="text-2xl font-bold">Explore the drawing prompt collection</h2><p className="mt-3 text-[var(--text-muted)]">These are the same original ideas used by the picker. Open a subject to browse without generating.</p><div className="mt-4 space-y-3">{DRAWING_CATEGORIES.map(c => <details key={c} className="glass-card p-5"><summary className="cursor-pointer font-bold min-h-11">{c[0].toUpperCase()+c.slice(1)} drawing ideas</summary><ul className="space-y-4 mt-3">{DRAWING_PROMPTS.filter(p => p.category===c).map(p => <li key={p.id}><h3 className="font-semibold">{p.text}</h3><p className="text-sm text-[var(--text-muted)]">{p.difficulty === "easy" ? "Simple shapes" : "More detail"} · {p.hint}</p></li>)}</ul></details>)}</div></section>
      <section className="glass-card p-5 sm:p-8 mt-8"><h2 className="text-2xl font-bold">Drawing prompt questions</h2>{faqs.map(([q,a]) => <div key={q} className="mt-5"><h3 className="font-bold">{q}</h3><p className="mt-2 text-[var(--text-muted)]">{a}</p></div>)}</section>
      <section className="mt-8"><h2 className="font-bold">Try another creative direction</h2><p className="mt-3"><Link href="/random-object-generator" className="text-[var(--neon-cyan)] underline">Random Object Generator</Link> for a simple physical subject, the <Link href="/random-word-generator?use=draw" className="text-[var(--neon-cyan)] underline">Random Word Generator</Link> (turn on drawable words) for Pictionary rounds, or <Link href="/writing-topic-generator" className="text-[var(--neon-cyan)] underline">Writing Topic Generator</Link> for stories and journals, or <Link href="/categories/art-culture" className="text-[var(--neon-cyan)] underline">Art &amp; Culture topics</Link> for discussion.</p></section>
    </div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({"@context":"https://schema.org","@type":"WebApplication",name:"Random Drawing Generator",url:`${SITE_URL}/random-drawing-generator`,description,applicationCategory:"EntertainmentApplication",operatingSystem:"Any",offers:{"@type":"Offer",price:"0",priceCurrency:"USD"}})}} />
    </main><Footer /></>;
}
