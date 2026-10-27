import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import NbaPlayerGenerator from "@/components/generators/NbaPlayerGenerator";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import { DECADES, NBA_PLAYERS, NBA_TEAMS, POSITIONS, eraSummary } from "@/lib/nbaPlayers";

const PATH = "/random-nba-player-generator";
const TITLE = "Random NBA Player Generator — Filter by Team, Era & Position";
const DESCRIPTION =
  "Get random NBA players from current stars to all-time legends. Filter by active or retired, team, position and decade, lock the picks you like, reroll the rest, and try the daily random starting five.";

const SOCIAL = generatorSocial({ card: "random-nba-player-generator", title: TITLE, description: DESCRIPTION, alt: "Random NBA Player Generator — scoreboard-style player cards" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "random nba player generator", "random nba player", "random basketball player generator", "nba player generator",
    "random nba team generator", "nba random player picker", "random nba player by team", "random nba starting five",
  ],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const N = NBA_PLAYERS.length;
const ACTIVE = NBA_PLAYERS.filter((p) => p.active).length;

const FAQ = [
  {
    question: "How do I get a random NBA player?",
    answer:
      "Press Generate players. You get a card with the player's position, teams, career years and key honors. Leave every filter open for a draw from all eras, or narrow it by active or retired, team, position and decade first. Choose 1 to 10 players at a time.",
  },
  {
    question: "Is there a random NBA team generator?",
    answer:
      "Yes, in a simple form. Press Random team and the page picks one of the 30 franchises, sets the Team filter to it and shows players from that team. You can then reroll players from the same team, or switch the Team filter back to any.",
  },
  {
    question: "How many players are in the random basketball player generator?",
    answer: `${N} players, written by hand: ${ACTIVE} who were active in the 2025-26 season and ${N - ACTIVE} retired stars and role players going back to the 1940s. Every one of the 30 current franchises has players in the bank, and so does every decade from the 1950s to the 2020s. It is a curated list of notable players, not every person who ever appeared in a game.`,
  },
  {
    question: "Can I get only current NBA players?",
    answer:
      "Set the status to Active. That limits the draw to players who were still active in the 2025-26 season. Rosters change every summer, so the teams shown are main stops in a career rather than a guarantee of where a player suits up today. Check NBA.com for live rosters.",
  },
  {
    question: "Can I use this NBA player picker for a draft game?",
    answer:
      "That is what the lock button is for. Generate five or ten players, lock the ones you want to keep, and press the button again to reroll only the unlocked cards. Locked players never appear twice. Take turns locking one card each to play a quick random draft with friends.",
  },
  {
    question: "What is the daily random starting five?",
    answer:
      "Each day the page picks one random player for each position, point guard to center, using the date as the seed. Everyone who opens the page on the same UTC day sees the same five, so you can share it and compare whether you would start that lineup. It changes at midnight UTC.",
  },
  {
    question: "Does it show player photos or team logos?",
    answer: "No. The cards are text only: name, position, teams, years and honors. That keeps the page fast and avoids using league or team trademarks. This is an unofficial fan tool, not affiliated with the NBA.",
  },
  {
    question: "How are positions and eras decided?",
    answer:
      "Each player has one main position (PG, SG, SF, PF or C), even if he played several. The era filter is by decade and counts a player in every decade in which he played at least one season, so a career from 1996 to 2016 shows up in the 1990s, 2000s and 2010s.",
  },
  {
    question: "Does it cover the WNBA, college or other leagues?",
    answer: "Not on this page. It covers NBA players only, including stars who started in the ABA and later joined the NBA.",
  },
  {
    question: "Are the honors and years accurate?",
    answer:
      "Only well-known facts are included, such as MVP awards, championships, Rookie of the Year and Defensive Player of the Year. If an honor was uncertain it was left out, so a card showing fewer honors does not mean the player won nothing. Teams use today's franchise names, so Seattle SuperSonics stars appear under the Thunder.",
  },
];

const eras = eraSummary();
const byPos = POSITIONS.map((p) => ({ ...p, count: NBA_PLAYERS.filter((x) => x.pos === p.value).length }));
const examples = (d: number) =>
  NBA_PLAYERS.filter((p) => p.from >= d - 2 && p.from <= d + 9 && p.honors.length > 0)
    .filter((_, i) => i % 3 === 0)
    .slice(0, 4)
    .map((p) => p.name)
    .join(", ");

export default function RandomNbaPlayerGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Random NBA Player Generator"
      heading={["Random NBA Player", "Generator"]}
      intro={`Press Generate to get random NBA players from a hand-written bank of ${N} stars, current and all-time, across all 30 franchises. Filter by active or retired, team, position and decade, draw up to 10, lock the cards you like and reroll the rest. Each card shows position, teams, career years and key honors.`}
      description={DESCRIPTION}
      updated="2026-10-28"
      faq={FAQ}
      inShort={`This random basketball player generator draws from ${N} NBA players: ${ACTIVE} active in 2025-26 and ${N - ACTIVE} retired legends back to the 1940s. Filter by team, position or decade, lock any card, then reroll only the rest. A daily random starting five gives you a lineup to share.`}
      related={[
        { href: "/random-team-generator", label: "Random team generator" },
        { href: "/random-name-picker", label: "Random name picker" },
        { href: "/wheel-of-names", label: "Wheel of names" },
        { href: "/dice-roller", label: "Dice roller" },
        { href: "/trivia-questions", label: "Trivia questions" },
        { href: "/categories/sports", label: "Sports topics" },
      ]}
      content={
        <>
          <SectionTitle>Game ideas for an NBA random player picker</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Random draft game</strong> — generate 10 players, then take turns locking one card each. Reroll the unlocked cards and repeat until every friend has a five. Compare lineups and argue the winner.</li>
            <li><strong>Build a team challenge</strong> — set the position filter to PG, then SG, SF, PF and C in turn and lock one player each time. Or use the daily starting five and defend why you would start those players.</li>
            <li><strong>One team, all eras</strong> — press Random team, then reroll to see Celtics, Lakers or Spurs players from different decades. Good for debating a franchise&rsquo;s all-time five.</li>
            <li><strong>Trivia round</strong> — read out only the name and position, keep the rest hidden, and let others guess the team, the decade or the honor. Reveal and score a point for each right answer.</li>
            <li><strong>Fantasy and bar-room debates</strong> — use the random NBA player picker to settle who goes first in a mock draft, or draw two players from the same decade and decide who you would build around.</li>
            <li><strong>Pick-up games and groups</strong> — need nicknames for a team night? Draw players and assign them. To split people into teams first, use the <Link prefetch={false} href="/random-team-generator" className={linkClass}>random team generator</Link>.</li>
          </ul>

          <SectionTitle>How the filters work</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Status</strong> — All players, Active (still playing in 2025-26) or Retired.</li>
            <li><strong>Team</strong> — any of the 30 current franchises. A player appears under every team listed on his card, so a star who played for three teams shows up in three searches.</li>
            <li><strong>Position</strong> — PG, SG, SF, PF or C, using each player&rsquo;s main position.</li>
            <li><strong>Era</strong> — a decade from the 1950s to the 2020s. A player counts in every decade in which he played a season.</li>
            <li><strong>How many</strong> — 1 to 10 players per draw. Players do not repeat until you have seen everyone who matches your filters.</li>
            <li><strong>Lock</strong> — keeps a card in place. Generate again and only the unlocked cards change, and a locked player is never drawn a second time.</li>
            <li><strong>Random team</strong> — picks a franchise for you, like a random NBA team generator, and draws players from it.</li>
            <li><strong>Copy result</strong> — copies a numbered list with each player&rsquo;s position, teams, years and honors.</li>
          </ul>

          <SectionTitle>NBA players by era</SectionTitle>
          <p>
            The bank runs from the league&rsquo;s first seasons to today. Each count below is the number of players who appeared in that decade, so players with long careers are counted in more than one row.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" data-nba-eras>
              <thead>
                <tr className="text-[var(--text-primary)]">
                  <th className="py-2 pr-4 font-semibold">Decade</th>
                  <th className="py-2 pr-4 font-semibold">Players</th>
                  <th className="py-2 font-semibold">Some who debuted then</th>
                </tr>
              </thead>
              <tbody>
                {eras.map((e) => (
                  <tr key={e.decade} className="border-t border-white/10 align-top">
                    <td className="py-2 pr-4 whitespace-nowrap">{e.decade}s</td>
                    <td className="py-2 pr-4">{e.count}</td>
                    <td className="py-2">{examples(e.decade)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p>
            By position the bank holds {byPos.map((p) => `${p.count} ${p.label.toLowerCase()}s`).join(", ")}, spread over {DECADES.length} decades and all {NBA_TEAMS.length} franchises.
          </p>

          <SectionTitle>Why this NBA player generator is different</SectionTitle>
          <p>
            Most random NBA player pages show a handful of current stars with a rank or a stat line. This one is built for games: it spans eras, lets you lock cards and reroll the rest, picks a random team on demand and gives everyone the same random starting five each day.
            Cards focus on what you need to settle a debate or run a quiz &mdash; position, team, years and honors &mdash; rather than live stats that go stale.
          </p>
          <p>
            Want something else to randomise? Try the <Link prefetch={false} href="/random-name-picker" className={linkClass}>random name picker</Link> for your group, the <Link prefetch={false} href="/wheel-of-names" className={linkClass}>wheel of names</Link> to pick who drafts first,
            or <Link prefetch={false} href="/categories/sports" className={linkClass}>sports discussion topics</Link> for debates about the game.
          </p>
          <p className="rounded-xl border border-white/10 p-3 text-xs" data-nba-disclaimer>
            <strong className="text-[var(--text-primary)]">Disclaimer:</strong> Random Topics is an unofficial fan tool and is not affiliated with, endorsed by or sponsored by the National Basketball Association or any NBA team. Player and team names are used only to identify real people and franchises. Honors and years are summarised from well-known public record and may omit details; check an official source before you publish them.
          </p>
        </>
      }
    >
      <NbaPlayerGenerator />
    </GeneratorPageShell>
  );
}
