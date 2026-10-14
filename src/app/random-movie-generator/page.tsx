import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import MovieGenerator from "@/components/generators/MovieGenerator";
import GeneratorExamples from "@/components/generators/GeneratorExamples";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import {
  DECADES, DEFAULT_FILTERS, GENRES, GENRE_IDS, PLATFORMS, PLATFORM_IDS, MOVIES,
  decadeLabel, movieStats, movieToResult, pickMovies, type MovieFilters,
} from "@/lib/generators/movies";

const PATH = "/random-movie-generator";
const STATS = movieStats();
const COUNT = `${Math.floor(STATS.total / 50) * 50}+`;
const TITLE = "Random Movie Generator — Pick a Movie by Genre, Decade & Rating";
const DESCRIPTION = `Can't decide what to watch? Pick a random movie from ${COUNT} great films by genre, decade, critic reception and runtime, with 3 similar picks.`;

const SOCIAL = generatorSocial({ card: "random-movie-generator", title: TITLE, description: DESCRIPTION, alt: "Random Movie Generator — a random film pick with genre, runtime and similar movies" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "random movie generator", "random movie picker", "what movie should i watch", "movie roulette",
    "random film generator", "pick a movie for me", "movie night ideas", "random netflix movie generator",
    "random family movie generator", "random horror movie generator",
  ],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const f = (over: Partial<MovieFilters>): MovieFilters => ({ ...DEFAULT_FILTERS, ...over });

// Real output from the generator with fixed seeds, so the examples are the same on every visit.
const EXAMPLES = [
  { label: "Family movie night", results: pickMovies(f({ familyOnly: true, genres: ["family", "animation"] }), 3, 4101).map(movieToResult) },
  { label: "Acclaimed thrillers under 100 min", results: pickMovies(f({ genres: ["thriller"], minBand: "acclaimed", runtimes: ["short"] }), 3, 4102).map(movieToResult) },
  { label: "1980s sci-fi & action", results: pickMovies(f({ genres: ["sci-fi", "action"], decades: [1980] }), 3, 4103).map(movieToResult) },
];

const ORIGINAL_EXAMPLES = PLATFORM_IDS.map((p) => ({
  platform: PLATFORMS[p],
  films: MOVIES.filter((m) => m.platform === p).slice(-3).map((m) => `${m.title} (${m.year})`),
}));

const FAQ = [
  {
    question: "How does the random movie generator work?",
    answer: `It picks one film at random from a hand-checked list of ${COUNT} well-known movies from 1950 to 2025 that match your filters for genre, decade, critic reception, runtime and audience. Each pick shows the year, runtime, director, an original spoiler-free premise and three similar movies. Press Pick another and you won't see the same film again until you've been through every match.`,
  },
  {
    question: "Can I filter by Netflix, Prime Video or Disney+?",
    answer: "Partly, and honestly. What is streaming on each service changes by country and month, so we don't claim a film is on a service right now. Instead the \"Where to stream\" filter finds streaming originals: films made or released as a Netflix, Prime Video, Apple TV+, Disney+, Max or Hulu original. For live availability where you are, use the \"Where to watch\" button, which opens a JustWatch search for the title.",
  },
  {
    question: "Can it pick family-friendly movies for kids?",
    answer: `Yes. Turn on "Family-friendly only" to draw from the ${STATS.kidSafe} films we judge suitable for most kids (roughly G or PG). Pair it with Animation, Family or Musical for a safe family movie night. Our audience labels are a guide, not an official rating, so check the certificate in your country if you're unsure.`,
  },
  {
    question: "Where do the ratings come from?",
    answer: "We don't copy IMDb scores or other proprietary ratings. Each film gets one of three bands from our editors that summarise its broad critical reception: Acclaimed (widely praised, often on best-of lists or a major award winner), Well-liked (mostly positive reviews) or Mixed (divided reviews but popular). Bands are deliberately coarse so they stay accurate.",
  },
  {
    question: "What movie should I watch tonight?",
    answer: "Decide how much time you have and the mood, then let the generator choose. Under 100 minutes plus Comedy is a safe weeknight pick; Acclaimed plus Drama or Thriller suits a slower evening. If the first pick isn't right, the three similar movies under the result usually are.",
  },
  {
    question: "How are the similar movies chosen?",
    answer: "They're scored on shared genres, how close the release years are, tone (light versus dark), critic reception and audience level. The picked film itself and same-titled remakes are never suggested, a family pick only leads to family-friendly suggestions, and no director appears twice.",
  },
  {
    question: "Is the random movie picker free?",
    answer: "Yes. It's free, works on phones, needs no sign-up and runs entirely in your browser. Share a pick with the Copy link button: the link opens the same movie for your friends.",
  },
];

export default function RandomMovieGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random Movie Generator"
      heading={["Random Movie", "Generator"]}
      intro={`What movie should you watch? Spin the movie roulette: ${COUNT} hand-picked films from the 1950s to today, filtered by genre, decade, reception and runtime.`}
      description={DESCRIPTION}
      updated="2026-10-14"
      faq={FAQ}
      related={[
        { href: "/my-9-movies", label: "My 9 movies grid" },
        { href: "/random-food-generator", label: "Random food generator" },
        { href: "/this-or-that", label: "This or that questions" },
      ]}
      inShort={
        <>
          This random movie generator picks a film for you from {COUNT} well-known movies (1950–2025). Filter by genre, decade, critic
          reception, runtime and family-friendliness, then get a spoiler-free premise, director and three similar picks. Availability changes, so
          &quot;Where to watch&quot; links to a live JustWatch search instead of guessing.
        </>
      }
      content={
        <>
          <SectionTitle>A random movie picker that ends the scrolling</SectionTitle>
          <p>
            Half of movie night is spent scrolling. This <strong>random movie generator</strong> answers &quot;what movie should I watch?&quot; with
            one real film, from <em>Singin&apos; in the Rain</em> to <em>Parasite</em>, plus why it&apos;s worth your evening in one sentence, with no
            spoilers. Not feeling it? Press <strong>Pick another</strong>. The <strong>random movie picker</strong> won&apos;t repeat a film until
            you&apos;ve seen every match, so a game of <strong>movie roulette</strong> never loops back to the same three titles.
          </p>
          <SectionTitle>Filters that match how people actually choose</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Genre</strong>: {GENRE_IDS.map((g) => GENRES[g].label.toLowerCase()).join(", ")}. Pick several to widen the net.</li>
            <li><strong>Decade</strong>: {DECADES.map(decadeLabel).join(", ")}. Classic Hitchcock or this year&apos;s Oscar talk.</li>
            <li><strong>Critic reception</strong>: Acclaimed only, Well-liked or better, or anything.</li>
            <li><strong>Runtime</strong>: under 100 minutes, 100–130, or over 130 for when you have all evening.</li>
            <li><strong>Family-friendly only</strong>: {STATS.kidSafe} films that work for most kids.</li>
          </ul>
          <SectionTitle>Streaming originals, without false promises</SectionTitle>
          <p>
            Most &quot;random Netflix movie&quot; tools guess, and their lists go stale within weeks. We filter by something that doesn&apos;t
            change: whether a film was made or released as a streaming original. Each pick also has a <strong>Where to watch</strong> link to a
            live JustWatch search, so you see what&apos;s streaming, renting or free where you live today. Originals in the list include:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            {ORIGINAL_EXAMPLES.filter((o) => o.films.length).map((o) => (
              <li key={o.platform}><strong>{o.platform}</strong>: {o.films.join(", ")}</li>
            ))}
          </ul>
          <SectionTitle>Movie night ideas</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Decade roulette</strong>: each person picks a decade, the generator picks the film.</li>
            <li><strong>Blind double feature</strong>: pick one film, then watch one of its three similar movies the same night.</li>
            <li><strong>Family night</strong>: Family-friendly only plus Animation or Musical; let the kids press the button.</li>
            <li><strong>Film club</strong>: Acclaimed only, one new decade each week. Afterwards, settle debates with{" "}
              <Link href="/this-or-that" className={linkClass}>this or that</Link> or build your <Link href="/my-9-movies" className={linkClass}>9 favourite movies grid</Link>.</li>
          </ul>
          <SectionTitle>Examples</SectionTitle>
          <GeneratorExamples note="Three real draws with fixed filters:" sets={EXAMPLES} />
          <SectionTitle>How we built the list</SectionTitle>
          <p>
            Every one of the {STATS.total} films is a widely seen feature with a checked release year, director and theatrical runtime. Premises
            are written in-house and avoid twists. Genres come from a fixed list of {GENRE_IDS.length}, and each film keeps at most three, so
            filters stay meaningful. We don&apos;t show posters; the colour and emoji on each card come from the film&apos;s main genre.
          </p>
        </>
      }
    >
      <MovieGenerator />
    </GeneratorPageShell>
  );
}
