import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import FaqSchema from "@/components/FaqSchema";
import KeepPlaying from "@/components/KeepPlaying";
import StoryPromptGenerator from "@/components/StoryPromptGenerator";
import PublicAdPlacement from "@/components/PublicAdPlacement";
import { STORY_AUDIENCES, STORY_CHALLENGES, STORY_GENRES, STORY_LENGTHS, STORY_PROMPTS } from "@/data/storyPrompts";
import { SITE_URL } from "@/i18n/config";

const path = "/story-prompt-generator";
const title = `Story Prompt Generator: ${STORY_PROMPTS.length} Random Story Ideas by Genre & Age`;
const description = `Free story prompt generator: ${STORY_PROMPTS.length} original story ideas. Filter by genre, age group (kids, teens, adults) and length, add a challenge, save and print.`;
export const metadata: Metadata = {
  title: { absolute: title }, description,
  alternates: { canonical: path },
  openGraph: { title, description, url: `${SITE_URL}${path}`, type: "website", siteName: "Random Topics", images: [{ url: `${SITE_URL}/art/tools/story-prompt-generator.jpg`, width: 1600, height: 900 }] },
};

const count = (filter: (p: (typeof STORY_PROMPTS)[number]) => boolean) => STORY_PROMPTS.filter(filter).length;
const faqs = [
  { question: "What is a story prompt generator?", answer: `It picks a ready-to-write story idea for you: a character, a situation and a problem. This one draws from ${STORY_PROMPTS.length} original prompts written by our editors, tagged by genre, age group and length. It does not write the story for you.` },
  { question: "Are there story prompts for kids?", answer: `Yes. Choose Kids (6–12) to get ${count(p => p.audience === "kids")} prompts with simple stakes and kind endings. Spooky prompts for kids are gentle (friendly ghosts, muddy paw prints), and romance is only written for teens and adults.` },
  { question: "How long should my story be?", answer: "Flash fiction is under 1,000 words and works in one sitting. A short story runs about 1,000–7,500 words. Novel or series ideas are premises with enough conflict for chapters. Filter by length to match the time you have." },
  { question: "What does the writing challenge do?", answer: `Tick Add a writing challenge to attach a constraint such as "start with dialogue" or "tell it backwards". There are ${STORY_CHALLENGES.length} challenges, matched to the age group, and they appear in what you copy, save and print.` },
  { question: "Can I save or print story prompts?", answer: "Save adds a prompt to Saved topics in this browser, with no account. Print opens every prompt in your current selection as a clean page you can print or save as PDF, which is handy for classes and writing groups." },
  { question: "Will the same prompt come up twice?", answer: "Not until you have seen every prompt in your selection. The round is kept for this browser tab, including when you change filters or come back to the page." },
];

export default function StoryPromptGeneratorPage() {
  return <><Navbar /><main className="flex-1"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Writing", href: "/writing" }, { label: "Story Prompt Generator" }]} />
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12">
      <header className="text-center py-4 sm:py-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>Story Prompt Generator</h1>
        <p className="mt-3 text-base text-[var(--text-secondary)]">Random story ideas you can start writing now. Pick a genre, an age group and a length.</p>
        <p className="mt-2 text-xs text-[var(--text-secondary)]">{STORY_PROMPTS.length} original prompts · {STORY_GENRES.length} genres · Kids, teens and adults · Free</p>
      </header>
      <StoryPromptGenerator />
      <PublicAdPlacement path={path} placement="result" />
      <figure className="mt-8">
        {/* eslint-disable-next-line @next/next/no-img-element -- pre-sized jpg below the tool, no optimizer needed */}
        <img src="/art/tools/story-prompt-generator.jpg" alt="Illustrated notebook on a desk with story ideas floating out of it: a dragon, a rocket, a mystery, a friendly ghost and a ship" width={1600} height={900} loading="lazy" decoding="async" className="w-full h-auto rounded-2xl border border-white/10" />
      </figure>

      <section className="glass-card p-5 sm:p-8 mt-8">
        <h2 className="text-2xl font-bold">How to turn a story prompt into a story</h2>
        <ol className="list-decimal pl-5 mt-4 space-y-2 text-[var(--text-muted)]">
          <li><strong>Find the want.</strong> Decide what your main character wants in the first paragraph, and what stands in the way.</li>
          <li><strong>Start late.</strong> Open as close to the problem as you can. Skip the alarm clock and breakfast.</li>
          <li><strong>Raise it once.</strong> Make one thing go wrong halfway, so the character has to choose.</li>
          <li><strong>End on a change.</strong> The character, or the reader&apos;s view of them, should be different at the end.</li>
          <li><strong>Set a timer.</strong> 15 minutes for flash fiction is enough to get a full draft down. Revise tomorrow.</li>
        </ol>
        <p className="mt-4 text-[var(--text-muted)]">Teachers: choose Kids or Teens, Flash fiction and 5 per draw, then print the whole selection as a handout. Writing groups: draw one prompt and one challenge, give everyone 20 minutes, and compare how differently the same idea goes.</p>
      </section>

      <section className="glass-card p-5 sm:p-8 mt-8">
        <h2 className="text-2xl font-bold">What the filters mean</h2>
        <div className="grid sm:grid-cols-2 gap-5 mt-4">
          <div><h3 className="font-bold">Age group</h3><ul className="mt-2 space-y-1 text-sm text-[var(--text-muted)]">{STORY_AUDIENCES.map(a => <li key={a.id}><strong>{a.label}</strong> ({count(p => p.audience === a.id)}): {a.note}.</li>)}</ul></div>
          <div><h3 className="font-bold">Length</h3><ul className="mt-2 space-y-1 text-sm text-[var(--text-muted)]">{STORY_LENGTHS.map(l => <li key={l.id}><strong>{l.label}</strong> ({count(p => p.length === l.id)}): {l.words}.</li>)}</ul></div>
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl font-bold">Browse all {STORY_PROMPTS.length} story prompts by genre</h2>
        <p className="mt-3 text-[var(--text-muted)]">The same prompts the generator uses. Open a genre to read them all.</p>
        <nav aria-label="Story prompt genres" className="flex flex-wrap gap-2 mt-4">{STORY_GENRES.map(g => <a key={g.id} href={`#${g.id}`} className="text-sm rounded-full border border-white/15 px-3 py-2 hover:border-[var(--neon-cyan)]/40">{g.emoji} {g.label}</a>)}</nav>
        <div className="mt-4 space-y-3">{STORY_GENRES.map(g => {
          const items = STORY_PROMPTS.filter(p => p.genre === g.id);
          return <details key={g.id} id={g.id} className="glass-card p-5 scroll-mt-24">
            <summary className="cursor-pointer font-bold min-h-11">{g.emoji} {g.label} story prompts ({items.length})</summary>
            {STORY_AUDIENCES.map(a => {
              const group = items.filter(p => p.audience === a.id);
              if (!group.length) return null;
              return <div key={a.id} className="mt-4"><h3 className="text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">{g.label} prompts for {a.label.split(" ")[0].toLowerCase()}</h3>
                <ul className="list-disc pl-5 mt-2 space-y-2">{group.map(p => <li key={p.id}>{p.text} <span className="text-xs text-[var(--text-muted)]">({STORY_LENGTHS.find(l => l.id === p.length)?.label})</span></li>)}</ul></div>;
            })}
          </details>;
        })}</div>
      </section>

      <div className="mt-8"><PublicAdPlacement path={path} placement="mid" /></div>

      <section className="glass-card p-5 sm:p-8 mt-8">
        <h2 className="text-2xl font-bold">Story prompt questions</h2>
        {faqs.map(f => <div key={f.question} className="mt-5"><h3 className="font-bold">{f.question}</h3><p className="mt-2 text-[var(--text-muted)]">{f.answer}</p></div>)}
      </section>

      <section className="mt-8">
        <h2 className="font-bold">More creative writing tools</h2>
        <p className="mt-3 text-[var(--text-muted)]">The <Link href="/writing" className="text-[var(--neon-cyan)] underline">writing prompt generator</Link> covers 500+ prompts beyond fiction, the <Link href="/writing-topic-generator" className="text-[var(--neon-cyan)] underline">writing topic generator</Link> filters essays, journals, fiction and blogs, and <Link href="/journal-prompts" className="text-[var(--neon-cyan)] underline">journal prompts</Link> are for personal writing. For younger writers, see <Link href="/topics/writing-prompts-for-kids" className="text-[var(--neon-cyan)] underline">writing prompts for kids</Link>. Build your cast with the <Link href="/random-character-generator" className="text-[var(--neon-cyan)] underline">random character generator</Link> and the <Link href="/character-name-generator" className="text-[var(--neon-cyan)] underline">character name generator</Link>, or set the scene with the <Link href="/fantasy-map-maker" className="text-[var(--neon-cyan)] underline">fantasy map maker</Link>.</p>
      </section>
    </div>
    <FaqSchema items={faqs} />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "Story Prompt Generator", url: `${SITE_URL}${path}`, description, applicationCategory: "WritingApplication", operatingSystem: "Any", isAccessibleForFree: true, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
    <KeepPlaying path={path} />
  </main><Footer /></>;
}
