import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import YoMamaRandomizer from "@/components/YoMamaRandomizer";
import { YO_MAMA_JOKES, YO_MAMA_THEMES, YO_MAMA_SETUPS, YO_MAMA_ENDINGS } from "@/data/yoMama";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const path = "/yo-mama-randomizer";
const title = "Yo Mama Randomizer — Clean Jokes & Text Remixes";
const description = `Generate a clean yo mama joke or remix original setups and absurd endings. ${YO_MAMA_JOKES.length} written jokes, six themes, easy copying, and no repeats within your round.`;
const combinations = YO_MAMA_SETUPS.length * YO_MAMA_ENDINGS.length;
export const metadata: Metadata = {
  title: { absolute: title }, description,
  alternates: { canonical: path, languages: hreflangAlternates(path) },
  robots: { index: true, follow: true },
  openGraph: { title, description, url: SITE_URL + path, type: "website", siteName: "Random Topics" },
};
const faq = [
  ["What does this yo mama randomizer make?", "It makes original text jokes. Clean jokes draws a complete one-liner. Absurd remix combines a written setup with a separately written ending, so you can keep one part and change the other. The All themes option allows deliberately ridiculous cross-theme combinations."],
  ["Is this the viral Yo Mama video randomizer?", "This is an independent text tool, not a video player or clip mixer. It does not play or splice existing animations, imitate a narrator's voice, or use characters from a Yo Mama channel. Random Topics is not officially affiliated with those channels or video randomizers."],
  ["Are the jokes clean?", "The collection uses imaginary situations, everyday mix-ups and exaggerated harmless habits. It avoids body-shaming, slurs and sexual jokes. Humor still depends on the audience: use the format with people who enjoy it, and switch to an ordinary funny question if someone would rather pass."],
  ["Will I get the same joke twice?", "Each style remembers the results shown during this visit. Changing themes keeps that history. Clean jokes will not repeat a line, and Absurd remix will not repeat a setup-and-ending pair, until the matching pool is exhausted. A part can recur in a different remix. Choose Start a new round to reset that style; reloading the page also resets progress."],
  ["Why is New setup or New ending sometimes disabled?", "You have seen all combinations that keep the other part fixed within the current theme. Remix both can still find unseen pairs, or you can choose another theme. The tool does not silently repeat a pair to fill the gap."],
  ["Is it free, and does it use AI?", "It is free and needs no sign-up. The tool selects and combines this page's written collection in your browser. It does not call a paid model or ask you to enter personal information. Copy joke copies the visible sentence; if automatic copying is blocked, a selectable text box is provided."],
  ["Is a yo momma joke generator a different tool?", "Yo momma and yo mama are spelling variants of the same joke format. Both refer to this single page. Choose Clean jokes for a finished sentence or Absurd remix for a deliberately nonsensical combination."],
] as const;

export default function Page() {
  return <><Navbar /><main className="flex-1">
    <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Funny topics", href: "/funny" }, { label: "Yo Mama Randomizer" }]} />
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pb-12">
      <header className="py-5 sm:py-7 text-center">
        <p className="text-xs font-bold uppercase tracking-wider text-[var(--neon-pink)]">Original text jokes · Free · No sign-up</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>Yo Mama Randomizer</h1>
        <p className="mt-3 text-base text-[var(--text-secondary)]">Pick a clean one-liner, or mix a silly setup with an even sillier ending.</p>
        <a href="#joke-collection" className="mt-2 inline-flex min-h-11 items-center text-xs text-[var(--neon-cyan)] underline underline-offset-4">Browse all {YO_MAMA_JOKES.length} clean jokes and the remix parts ↓</a>
      </header>
      <YoMamaRandomizer />

      <section className="glass-card mt-8 p-5 sm:p-7" aria-labelledby="how-it-works">
        <h2 id="how-it-works" className="text-xl font-bold">A quick joke, or a little nonsense engineering</h2>
        <div className="mt-4 grid gap-5 sm:grid-cols-2">
          <div><h3 className="font-semibold text-[var(--neon-cyan)]">Clean jokes</h3><p className="mt-2 text-sm text-[var(--text-secondary)]">Choose from {YO_MAMA_JOKES.length} complete lines across six themes. Tap Another joke, pause before the punchline, and read it as playfully as you like.</p></div>
          <div><h3 className="font-semibold text-[var(--neon-pink)]">Absurd remix</h3><p className="mt-2 text-sm text-[var(--text-secondary)]">Our {YO_MAMA_SETUPS.length} setups and {YO_MAMA_ENDINGS.length} endings make {combinations} possible text pairings with All themes. New setup keeps the ending; New ending keeps the setup. A single theme has 16 pairings.</p></div>
        </div>
        <p className="mt-4 text-sm text-[var(--text-secondary)]">For a friendly game, take turns keeping one half and changing the other. Vote on the strangest imaginary scene, not on a real person. Copy the final line when you find one you like.</p>
      </section>

      <section id="joke-collection" className="mt-10 scroll-mt-24" aria-labelledby="collection-heading">
        <h2 id="collection-heading" className="text-2xl font-bold">All {YO_MAMA_JOKES.length} clean yo mama jokes</h2>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">Written for this collection in the familiar yo mama format. The punchlines play with gadgets, snack rituals and impossible situations. Every complete joke is below, so you can browse without running the generator.</p>
        <div className="mt-5 space-y-4">{YO_MAMA_THEMES.map(theme => {
          const jokes = YO_MAMA_JOKES.filter(joke => joke.theme === theme.id);
          return <section key={theme.id} className="glass-card p-5 sm:p-6"><h3 className="text-lg font-bold"><span aria-hidden="true">{theme.emoji} </span>{theme.label} <span className="text-sm font-normal text-[var(--text-secondary)]">· {jokes.length} jokes</span></h3>
            <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-relaxed text-[var(--text-secondary)]">{jokes.map(joke => <li key={joke.id} data-yo-mama-joke={joke.id}>{joke.text}</li>)}</ol>
          </section>;
        })}</div>
      </section>

      <section className="mt-10" aria-labelledby="remix-library">
        <h2 id="remix-library" className="text-2xl font-bold">Inside the absurd remix pool</h2>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">The recipe is “Yo mama [setup] — now [ending].” These are authored text fragments, not clips from a show. Cross-theme pairings are intentionally odd; choose a single theme for a more connected scene.</p>
        <div className="mt-5 space-y-3">{YO_MAMA_THEMES.map(theme => <details key={theme.id} className="glass-card p-5">
          <summary className="min-h-11 cursor-pointer font-semibold">{theme.label} · 4 setups + 4 endings</summary>
          <div className="grid gap-4 sm:grid-cols-2"><div><h3 className="text-sm font-bold text-[var(--neon-cyan)]">Yo mama…</h3><ul className="mt-2 space-y-2 text-sm text-[var(--text-secondary)]">{YO_MAMA_SETUPS.filter(part => part.theme === theme.id).map(part => <li key={part.id} data-remix-setup={part.id}>{part.text}</li>)}</ul></div>
            <div><h3 className="text-sm font-bold text-[var(--neon-pink)]">…now…</h3><ul className="mt-2 space-y-2 text-sm text-[var(--text-secondary)]">{YO_MAMA_ENDINGS.filter(part => part.theme === theme.id).map(part => <li key={part.id} data-remix-ending={part.id}>{part.text}</li>)}</ul></div></div>
        </details>)}</div>
      </section>

      <section className="glass-card mt-8 p-5 sm:p-7"><h2 className="text-xl font-bold">Keep it playful</h2><p className="mt-3 text-sm text-[var(--text-secondary)]">A good round needs people who want to join in. Keep the joke about the imaginary scene, skip personal insecurities, and let anyone pass. For a classroom, workplace or unfamiliar group, a <Link href="/funny-question-of-the-day" className="text-[var(--neon-cyan)] underline">funny question of the day</Link> may be a better opener.</p>
        <p className="mt-3 text-xs text-[var(--text-secondary)]">Collection written and reviewed by Random Topics. Updated <time dateTime="2026-10-04">October 4, 2026</time>. <Link href="/how-we-curate" className="underline">How we curate</Link></p>
      </section>
      <section className="mt-8"><h2 className="text-xl font-bold">Questions about the randomizer</h2><div className="mt-4 space-y-4">{faq.map(([question, answer]) => <div key={question} className="glass-card p-5"><h3 className="font-semibold">{question}</h3><p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{answer}</p></div>)}</div></section>
      <section className="mt-8"><h2 className="font-bold">Keep the conversation going</h2><div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[var(--neon-cyan)]">
        <Link href="/funny" className="inline-flex min-h-11 items-center underline">Funny conversation topics</Link>
        <Link href="/funny-question-of-the-day" className="inline-flex min-h-11 items-center underline">Funny question of the day</Link>
        <Link href="/would-you-rather" className="inline-flex min-h-11 items-center underline">Would you rather?</Link>
      </div></section>
    </div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication", name: "Yo Mama Randomizer", url: SITE_URL + path, description, applicationCategory: "EntertainmentApplication", operatingSystem: "Any", inLanguage: "en", isAccessibleForFree: true, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }) }} />
  </main><Footer /></>;
}
