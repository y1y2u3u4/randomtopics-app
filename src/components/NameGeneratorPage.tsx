import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Breadcrumb from "@/components/Breadcrumb";
import NameGenerator from "@/components/NameGenerator";
import { NAME_STYLES, nameRecipes, type NameKind } from "@/data/nameGenerators";
import { hreflangAlternates, SITE_URL } from "@/i18n/config";
import styles from "./NameGeneratorPage.module.css";

const pages = {
  band: {
    name: "Band Name Generator", category: "Music naming", title: "Band Name Generator — Genre, Seed Word & Shortlist",
    description: "Find band name ideas by music style and word count. Add a seed word, avoid unwanted terms, and keep a local shortlist. Free, no account or AI credits.",
    intro: "Find a name that fits your sound. Try a music style, add a seed word, and keep your favorites.",
    steps: ["Choose a music style that describes the sound you want to make, not just a label you like.", "Try a meaningful seed word and one, two or three words. Avoid terms you already ruled out.", "Save a few candidates, say them aloud and compare their rhythm. Copy the shortlist to discuss with your bandmates."],
    faqs: [
      ["How does the seed word change a name?", "One-word recipes join your word to a sound ending. Two- and three-word recipes put it into a written phrase. The seed is always used. Exact duplicate outputs are removed, so a seeded pool may contain fewer names than the starting collection."],
      ["Can I avoid words I do not want?", "Yes. Enter up to five comma-separated words or phrases. A name is skipped if it contains any of them, ignoring case. If your seed and avoid list conflict, the tool explains the empty selection instead of ignoring a filter."],
      ["Are these names unused by other bands?", "No availability check is performed. These are brainstorming ideas, not a claim of worldwide uniqueness. Check your favorite against existing artists and other uses before choosing it."],
      ["Does this use AI or send my seed word away?", "No. The tool applies a finite set of naming recipes in your browser. Your seed, avoid list and saved names stay in browser storage; they are not sent as analytics fields. No login or paid credits are needed."],
    ],
  },
  dragon: {
    name: "Dragon Name Generator", category: "Fantasy character naming", title: "Dragon Name Generator — Elements, Titles & Pronunciation",
    description: "Find dragon name ideas with Ember, Tide, Gale and Stone styles, suggested pronunciation and optional titles. Save a shortlist for your story or game, free.",
    intro: "Name a dragon for your story or game. Choose an element, try a shorter name, or add a story-ready title.",
    steps: ["Choose Ember, Tide, Gale or Stone to set a sound and landscape for your character.", "Try a short name for easy table talk or a longer name for a formal introduction. Titles are optional.", "Say the suggested pronunciation aloud and change it to suit your story. Use the title as a prompt for what the dragon protects, remembers or has lost."],
    faqs: [
      ["What do the dragon names mean?", "The names, titles and landscapes are creative story settings. They are not translations, historical word origins or rules from an established fictional language. You decide what a name means in your own world."],
      ["Do the elements change the results?", "Yes. Each element has its own twelve names and titles. Ember uses warm, firm sounds; Tide flows; Gale favors quick sounds; Stone feels grounded. These are editorial choices for this collection, not claims about mythology."],
      ["Does switching a title give me a new name?", "No. A title is another display of the same dragon. Switching titles or length filters keeps the used-name history. Only Start a fresh round explicitly clears it."],
      ["Can I use these for a game character?", "Use them as starting ideas for an original character. Suggested pronunciations are optional, and you can adapt the story setting. The tool does not claim the names are unused elsewhere or officially part of any game or book."],
    ],
  },
} as const;

export function nameGeneratorMetadata(kind: NameKind): Metadata {
  const page = pages[kind], path = `/${kind}-name-generator`;
  return { title: { absolute: page.title }, description: page.description, robots: { index: true, follow: true },
    alternates: { canonical: path, languages: hreflangAlternates(path) },
    openGraph: { title: page.title, description: page.description, url: SITE_URL + path, type: "website", siteName: "Random Topics" } };
}

export default function NameGeneratorPage({ kind }: { kind: NameKind }) {
  const page = pages[kind], recipes = nameRecipes(kind), path = `/${kind}-name-generator`;
  return <div className={styles.page}><Navbar /><main className="flex-1">
    <Breadcrumb items={[{ label: "Home", href: "/" }, { label: page.name }]} />
    <div className="mx-auto max-w-3xl px-4 sm:px-6 pb-12 [overflow-wrap:anywhere]">
      <header className="py-4 sm:py-7">
        <p className="text-xs text-[var(--text-secondary)]">{page.category}</p>
        <h1 className="mt-2 text-3xl sm:text-4xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>{page.name}</h1>
        <p className="mt-3 text-base text-[var(--text-secondary)]">{page.intro}</p>
        <p className="mt-2 text-xs text-[var(--text-secondary)]">Free · No account · {recipes.length} starting names</p>
      </header>
      <NameGenerator key={kind} kind={kind} />
      <section className="glass-card mt-8 p-5 sm:p-7">
        <h2 className="text-xl font-bold">{kind === "band" ? "Choose a name you can say on stage" : "Give the name a place in your story"}</h2>
        <ol className="mt-3 list-decimal pl-5 space-y-3 text-sm sm:text-base">{page.steps.map(step => <li key={step}>{step}</li>)}</ol>
        <p className="mt-4 text-sm text-[var(--text-secondary)]">The starting example counts in the round. A smaller final batch is labelled; repeats begin only when you explicitly start a fresh round. Returning in this tab restores your results for up to 24 hours when storage is available.</p>
      </section>
      <section className="mt-8" aria-label="Name collection">
        <h2 className="text-2xl font-bold">Browse all {recipes.length} {kind === "band" ? "starting band names" : "dragon name ideas"}</h2>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">{kind === "band"
          ? "These complete names are the starting collection. Each has one local seed-word recipe; seed variants are not counted as extra starting names. Style labels suggest a sound, and you can choose whichever fits your music."
          : "Each name has a suggested pronunciation and one optional title. Titles and elements describe invented settings, not real etymology. Changing a title does not create another unique dragon."}</p>
        <div className="mt-4 space-y-4">{NAME_STYLES[kind].map(style => <details key={style.id} className="glass-card p-4">
          <summary className="min-h-11 cursor-pointer font-semibold">{style.label} · {recipes.filter(recipe => recipe.style === style.id).length} names</summary>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">{style.note}</p>
          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">{recipes.filter(recipe => recipe.style === style.id).map(recipe => <li key={recipe.id} data-name-example={recipe.id} className="border-t border-white/10 pt-3 text-sm">
            <strong>{recipe.name}</strong>{recipe.pronunciation ? <><span className="block mt-1">{recipe.pronunciation}</span><span className="block mt-1 text-[var(--text-secondary)]">{recipe.title}</span></> : <span className="block mt-1 text-[var(--text-secondary)]">{recipe.length} {recipe.length === "1" ? "word" : "words"}</span>}
          </li>)}</ul>
        </details>)}</div>
      </section>
      <section className="glass-card mt-8 p-5 sm:p-7">
        <h2 className="text-xl font-bold">How this collection was made</h2>
        <p className="mt-3 text-sm text-[var(--text-secondary)]">{kind === "band"
          ? "We wrote 36 starting names for each of three music styles, with twelve examples at each word count. The seed rules preserve the requested word count. The tool removes matching duplicates and filters unwanted text before drawing from the remaining pool."
          : "We wrote twelve names for each of four invented elemental styles: six short and six long names, with a pronunciation guide and a different title for each. A title is a story prompt, not a translated meaning."} The generator uses this finite collection, not a model or a competitor name database. Similarity to existing names is still possible.</p>
        <p className="mt-3 text-xs text-[var(--text-secondary)]">Collection created <time dateTime="2026-10-07">October 7, 2026</time>.</p>
      </section>
      <section className="mt-8"><h2 className="text-2xl font-bold">Questions about {kind === "band" ? "band" : "dragon"} names</h2>
        {page.faqs.map(([question, answer]) => <div key={question} className="mt-5"><h3 className="font-bold">{question}</h3><p className="mt-2 text-sm text-[var(--text-secondary)]">{answer}</p></div>)}
      </section>
      <nav aria-label="Related creative tools" className="mt-8 border-t border-white/10 pt-5">
        <h2 className="font-bold">Keep creating</h2>
        <div className="mt-3 flex flex-col gap-3 text-sm text-[var(--neon-cyan)]">
          <Link className="min-h-11 py-2 underline" href="/writing-topic-generator">Find a writing theme or story starting point</Link>
          {kind === "dragon" ? <><Link className="min-h-11 py-2 underline" href="/country-name-generator">Name a fictional country for your world</Link><Link className="min-h-11 py-2 underline" href="/random-drawing-generator">Choose a subject to sketch</Link><Link className="min-h-11 py-2 underline" href="/band-name-generator">Naming a music project instead? Try Band Names</Link></>
            : <Link className="min-h-11 py-2 underline" href="/dragon-name-generator">Naming a fantasy character instead? Try Dragon Names</Link>}
        </div>
      </nav>
    </div>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "WebApplication",
      name: page.name, url: SITE_URL + path, description: page.description, applicationCategory: "EntertainmentApplication", operatingSystem: "Any",
      isAccessibleForFree: true, offers: { "@type": "Offer", price: "0", priceCurrency: "USD" }, featureList: ["Style and length filters", "No-repeat rounds", "Copy", "Local shortlist", "Share"] }) }} />
  </main><Footer /></div>;
}
