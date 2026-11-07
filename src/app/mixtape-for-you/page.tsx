import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import MixtapeMaker from "@/components/generators/MixtapeMaker";
import { EXAMPLES, STYLES, MAX_TRACKS, sides, styleById } from "@/lib/generators/mixtape";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";

const PATH = "/mixtape-for-you";
const TITLE = "Mixtape for You — Free Mixtape Maker for a Friend";
const DESCRIPTION =
  "Make a mixtape for someone: pick a cassette, add 6–12 songs and a note, then send a share link or save a PNG. The playlist lives in the link — no signup, nothing stored. Free, unofficial mixtape maker.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "mixtape for you", "make a mixtape for someone", "mixtape maker", "mixtape for you website", "mixtape for you app",
    "make a mixtape for your friends", "online mixtape maker", "digital mixtape", "cassette playlist maker", "send a playlist to a friend",
  ],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website" },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const FAQ = [
  {
    question: "How do I make a mixtape for someone online?",
    answer: "Pick a cassette color, write who it is for and from, add 6–12 songs (title and artist — a Spotify or YouTube link is optional), and add a short note. Then press Copy share link and send it, or download the cassette as a PNG. It takes about two minutes and needs no account.",
  },
  {
    question: "What does my friend see when they open the link?",
    answer: "They see your cassette with its title, who it is from, your note, and the tracklist split into Side A and Side B. Each song has a play link — yours if you added one, otherwise a YouTube and a Spotify search for that song — plus a button to make one back.",
  },
  {
    question: "Is the mixtape saved on a server?",
    answer: "No. The whole mixtape is packed into the part of the link after the # sign, which browsers never send to a server. There is no database and no account: whoever has the link can open it, and you can make as many as you like.",
  },
  {
    question: "Is this mixtape maker free?",
    answer: `Yes — free and unlimited, with no signup and no watermark. Each mixtape holds up to ${MAX_TRACKS} songs — about the length of a 60-minute cassette.`,
  },
  {
    question: "Is this the “Mixtape for You” app I saw on TikTok?",
    answer: "No. This is an independent, unofficial mixtape maker on randomtopics.app. It is not affiliated with, endorsed by or connected to any other mixtape app or website, and it uses its own cassette designs.",
  },
  {
    question: "Can I add Spotify or YouTube links?",
    answer: "Yes, tap the link icon next to a song. Links from Spotify, YouTube, Apple Music, SoundCloud, Deezer, Tidal and Bandcamp are kept; anything else is removed so a shared mixtape can never point somewhere unsafe.",
  },
  {
    question: "Can I post the mixtape on Instagram or TikTok?",
    answer: "Yes. Download PNG makes a 1080×1350 portrait image of the cassette with the full tracklist and your note — the right size for an Instagram post or a TikTok photo. Put the share link in your bio or message so friends can open the playlist.",
  },
];

export default function MixtapeForYouPage() {
  return (
    <GeneratorPageShell
      locale="en"
      compactHeroOnMobile
      path={PATH}
      name="Mixtape for You"
      heading={["Mixtape", "for You"]}
      intro="Make a mixtape for someone: cassette, songs, a note — send the link or save a PNG. Free, no signup."
      description={DESCRIPTION}
      updated="2026-11-07"
      faq={FAQ}
      related={[
        { href: "/my-9-songs", label: "My 9 songs grid" },
        { href: "/my-9-albums", label: "My 9 albums grid" },
        { href: "/my-9-artists", label: "My 9 artists grid" },
        { href: "/my-9-grid", label: "My 9 grid maker" },
      ]}
      inShort={
        <>
          <strong>Mixtape for You</strong> is a free mixtape maker for a friend, partner or crush. Choose one of {STYLES.length} cassette designs, add 6–{MAX_TRACKS} songs
          with an optional Spotify or YouTube link, write a note, and send a share link — the playlist is encoded in the link itself, so nothing is stored and no one
          needs an account. You can also download the cassette and tracklist as a PNG. An independent, unofficial tool: not affiliated with any other mixtape app.
        </>
      }
      content={
        <>
          <SectionTitle>How to make a mixtape for someone</SectionTitle>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Pick a cassette color and give the tape a title.</li>
            <li>Write who it is for and who it is from.</li>
            <li>Add 6–{MAX_TRACKS} songs. The first half becomes Side A, the rest Side B — order them like a story.</li>
            <li>Add a short note, then press <strong>Copy share link</strong> and send it, or <strong>Download PNG</strong> to post it.</li>
          </ol>

          <SectionTitle>Example mixtapes</SectionTitle>
          <p>Tap an example above the editor to start from one of these, then swap in your own songs.</p>
          {EXAMPLES.map((ex) => {
            const [a, b] = sides(ex.mix.tracks);
            return (
              <div key={ex.id}>
                <h3 className="text-base font-semibold text-[var(--text-primary)] pt-2">{ex.label}: “{ex.mix.title}” ({styleById(ex.mix.style).label} cassette)</h3>
                {ex.mix.note && <p className="text-sm italic">“{ex.mix.note}”</p>}
                <p className="text-sm"><strong>Side A:</strong> {a.map((x) => `${x.title} — ${x.artist}`).join(" · ")}</p>
                {b.length > 0 && <p className="text-sm"><strong>Side B:</strong> {b.map((x) => `${x.title} — ${x.artist}`).join(" · ")}</p>}
              </div>
            );
          })}

          <SectionTitle>Mixtape ideas for friends</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Inside jokes:</strong> one song for each memory you share, with the note explaining the order.</li>
            <li><strong>Birthday:</strong> songs from the year they were born on Side A, songs they love now on Side B.</li>
            <li><strong>Long distance:</strong> songs you both listen to on the same day, or one for each city you have lived in.</li>
            <li><strong>Moving away or graduating:</strong> a goodbye tape that starts nostalgic and ends hopeful.</li>
            <li><strong>Just because:</strong> “songs that made me think of you this month”.</li>
          </ul>

          <SectionTitle>Why this mixtape maker</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Private by design.</strong> The playlist is in the link after #, which is never sent to any server — not even ours.</li>
            <li><strong>No account on either side.</strong> You do not sign in to make it; your friend does not sign in to open it.</li>
            <li><strong>Works with any music app.</strong> Songs without a link get YouTube and Spotify search buttons, so it works whatever your friend uses.</li>
            <li><strong>Ready to post.</strong> A 1080×1350 PNG with the cassette, both sides and your note.</li>
            <li><strong>What it does not do:</strong> it does not play or host music — each song opens in the music service.</li>
          </ul>

          <SectionTitle>More music grids</SectionTitle>
          <p>
            Want to show your taste instead of sending a playlist? Make a{" "}
            <Link prefetch={false} href="/my-9-songs" className={linkClass}>my 9 songs</Link> grid, a{" "}
            <Link prefetch={false} href="/my-9-albums" className={linkClass}>my 9 albums</Link> grid or a{" "}
            <Link prefetch={false} href="/my-9-artists" className={linkClass}>my 9 artists</Link> grid with real cover art.
          </p>
        </>
      }
    >
      <MixtapeMaker />
    </GeneratorPageShell>
  );
}
