import type { Metadata } from "next";
import Link from "next/link";
import GeneratorPageShell, { SectionTitle, linkClass } from "@/components/generators/GeneratorPageShell";
import TarkovWeaponGenerator, { KitCard } from "@/components/generators/TarkovWeaponGenerator";
import { SITE_URL, hreflangAlternates } from "@/i18n/config";
import { generatorSocial } from "@/lib/generatorSocial";
import {
  AMMO, CHALLENGES, MAPS, TARKOV_DATA_DATE, TARKOV_WIKI_REVISIONS, WEAPONS, classCounts, exampleKit, kitToParams, type KitOptions,
} from "@/lib/tarkov";

const PATH = "/tarkov-random-weapon-generator";
const TITLE = "Tarkov Random Weapon Generator — Loadout, Ammo, Map & Rules";
const DESCRIPTION =
  "Roll a random Escape from Tarkov weapon from 178 current guns and melee, with matching ammo, attachment rules, a random map and raid challenges. Filter by class, lock slots, reroll and share the exact loadout.";

const SOCIAL = generatorSocial({ card: "tarkov-random-weapon-generator", title: TITLE, description: DESCRIPTION, alt: "Tarkov random weapon generator — rifle, ammo and map on a workbench" });

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  keywords: [
    "tarkov random weapon generator", "tarkov random gun generator", "tarkov randomizer", "tarkov loadout randomizer",
    "random tarkov loadout", "eft random weapon", "tarkov gun roulette", "tarkov random challenge",
  ],
  alternates: { canonical: PATH, languages: hreflangAlternates(PATH) },
  openGraph: { title: TITLE, description: DESCRIPTION, url: `${SITE_URL}${PATH}`, siteName: "Random Topics", type: "website", images: SOCIAL.images },
  twitter: SOCIAL.twitter,
};

const N = WEAPONS.length;
const GUNS = WEAPONS.filter((w) => w.cls !== "melee").length;
const MELEE = N - GUNS;
const CALIBERS = new Set(AMMO.map((a) => a.caliber)).size;
const counts = classCounts();
const fmtDate = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

const EXAMPLES: { seed: number; opts: Partial<KitOptions>; title: string; how: string }[] = [
  { seed: 14, opts: {}, title: "Default roll: a battle rifle on Ground Zero", how: "All primary classes, ammo, attachment rules, map and one rule switched on." },
  { seed: 21, opts: { classes: ["pistol", "revolver"], challenges: 2 }, title: "Pistol run with two rules", how: "Pistol run preset and two challenge rules." },
  { seed: 33, opts: { classes: ["bolt", "dmr"], ammoTier: "meta", sidearm: true }, title: "Snipers only, meta ammo, sidearm", how: "Snipers only preset, Meta ammo and Sidearm on." },
];

const FAQ = [
  {
    question: "How does the Tarkov random weapon generator work?",
    answer: `Press Roll loadout. The page picks one weapon from the classes you selected, out of ${N} weapons in the current game, then adds a round of ammo for that exact caliber, attachment rules, a map and challenge rules if those options are on. Lock any slot you like and roll again to change only the rest, or press the dice on one slot to reroll just that part.`,
  },
  {
    question: "Is the weapon list up to date?",
    answer: `It is built from the community Escape from Tarkov Wiki: the Weapons page as of ${fmtDate(TARKOV_WIKI_REVISIONS.weapons)} and the Ballistics page as of ${fmtDate(TARKOV_WIKI_REVISIONS.ballistics)}, fetched on ${fmtDate(TARKOV_DATA_DATE)}. It covers ${GUNS} guns and ${MELEE} melee weapons. The list is stored on this page, so it still works when live Tarkov APIs are down. A gun added in a later patch will be missing until the next data refresh.`,
  },
  {
    question: "Does the ammo always fit the gun?",
    answer: `Yes. Ammo is drawn only from rounds of the weapon's own caliber (${AMMO.length} rounds across ${CALIBERS} calibers), with damage and penetration from the wiki ballistics table. Choose Budget for the lowest third by penetration, Meta for the highest third, or Any. If you lock the ammo and then roll a gun with another caliber, the ammo changes so the kit stays usable.`,
  },
  {
    question: "Why are attachments rules instead of exact part names?",
    answer: "Every gun in Tarkov takes different parts, and a list of exact part names goes out of date with every patch. So the generator gives build rules that work on any gun: optic type, muzzle (suppressor, brake or factory), tactical device, magazine size and stock. Pistols only get iron sights, red dots or holo sights. Melee rolls get no attachments or ammo.",
  },
  {
    question: "Can I share my random loadout with my squad?",
    answer: "Press Copy share link. The link stores the exact weapon, ammo, attachment rules, map and rules, so your friends open the same loadout instead of a new random one. Copy text gives a plain list you can paste into Discord.",
  },
  {
    question: "What is the daily raid challenge?",
    answer: "Once a day the page picks one full kit: a gun with ammo and build rules, a melee weapon, a map and two challenge rules. It uses the UTC date as the seed, so everyone who opens the page that day gets the same challenge. Share it, run it and compare who extracted.",
  },
  {
    question: "Which maps can it pick?",
    answer: `All ${MAPS.length} locations: ${MAPS.map((m) => m.name).join(", ")}. Some need a keycard or special access key (The Lab, The Labyrinth), so reroll the map if you do not have one. Turn the Map option off if you want to choose the map yourself.`,
  },
  {
    question: "Is this an official Escape from Tarkov tool?",
    answer: "No. It is an unofficial fan tool and is not affiliated with or endorsed by Battlestate Games. Weapon images are in-game renders © Battlestate Games, shown only to identify each weapon.",
  },
];

export default function TarkovRandomWeaponGeneratorPage() {
  return (
    <GeneratorPageShell
      locale="en"
      path={PATH}
      name="Tarkov Random Weapon Generator"
      heading={["Tarkov Random Weapon", "Generator"]}
      intro={`Roll a random Escape from Tarkov loadout: one of ${N} current weapons with ammo that fits, attachment rules, a map and raid challenges. Filter by weapon class, lock what you like, reroll the rest and share the exact kit.`}
      description={DESCRIPTION}
      hero={{ src: "/tarkov/hero.webp", alt: "Rifle, red dot, suppressor, ammo and dice on a dark workbench (original illustration)", width: 1280, height: 720, className: "mx-auto mb-3 h-20 w-full max-w-xl rounded-2xl object-cover sm:h-32" }}
      compactHeroOnMobile
      updated={TARKOV_DATA_DATE}
      faq={FAQ}
      inShort={`This Tarkov random weapon generator picks from ${N} weapons in the current game (${GUNS} guns and ${MELEE} melee), adds ammo of the right caliber with damage and penetration, attachment rules, one of ${MAPS.length} maps and up to 3 of ${CHALLENGES.length} raid rules. Data is from the EFT Wiki, fetched ${fmtDate(TARKOV_DATA_DATE)}. Share links reopen the exact loadout.`}
      related={[
        { href: "/random-pokemon-generator", label: "Random Pokémon generator" },
        { href: "/random-team-generator", label: "Random team generator" },
        { href: "/dice-roller", label: "Dice roller" },
        { href: "/wheel-of-names", label: "Wheel of names" },
        { href: "/random-number-generator", label: "Random number generator" },
      ]}
      content={
        <>
          <SectionTitle>Example random Tarkov loadouts</SectionTitle>
          <p>Three real rolls from this page with fixed seeds. Open any of them in the generator to lock a slot and reroll the rest.</p>
          <div className="not-prose grid gap-4" data-tarkov-examples>
            {EXAMPLES.map((e) => {
              const kit = exampleKit(e.seed, e.opts);
              return (
                <div key={e.seed}>
                  <p className="mb-1 text-sm font-semibold text-[var(--text-primary)]">{e.title}</p>
                  <p className="mb-2 text-xs text-[var(--text-muted)]">Settings: {e.how} <a className={linkClass} href={`${PATH}?${kitToParams(kit).toString()}`}>Open this loadout</a></p>
                  <KitCard kit={kit} label="Example roll" />
                </div>
              );
            })}
          </div>

          <SectionTitle>Weapons in the generator</SectionTitle>
          <p>
            Every weapon below is in the pool. By default the generator draws from all primary classes except grenade launchers. Pistols, revolvers, melee and grenade launchers can be switched on with the class buttons.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" data-tarkov-classes>
              <thead>
                <tr className="text-[var(--text-primary)]">
                  <th className="py-2 pr-4 font-semibold">Class</th>
                  <th className="py-2 pr-4 font-semibold">Weapons</th>
                  <th className="py-2 font-semibold">Some you can roll</th>
                </tr>
              </thead>
              <tbody>
                {counts.map((c) => (
                  <tr key={c.value} className="border-t border-white/10 align-top">
                    <td className="py-2 pr-4 whitespace-nowrap">{c.label}</td>
                    <td className="py-2 pr-4">{c.count}</td>
                    <td className="py-2">{WEAPONS.filter((w) => w.cls === c.value).filter((_, i) => i % 4 === 0).slice(0, 5).map((w) => w.name).join(", ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <SectionTitle>Options</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Weapon classes</strong> — assault rifles, carbines, SMGs, shotguns, DMRs, bolt-action rifles, machine guns, grenade launchers, pistols, revolvers and melee. Presets: All primaries, Pistol run, Snipers only and Everything.</li>
            <li><strong>Ammo</strong> — a round for the rolled caliber, shown with damage, penetration and tracer or subsonic tags. Ammo quality: Any, Budget (lowest third by penetration) or Meta (highest third).</li>
            <li><strong>Attachment rules</strong> — optic, muzzle, tactical device, magazine and stock rules that fit any gun of that class.</li>
            <li><strong>Map</strong> — one of {MAPS.length} locations, including Ground Zero, Streets of Tarkov, Icebreaker and Terminal.</li>
            <li><strong>Sidearm and melee</strong> — add a random pistol and melee weapon to the kit.</li>
            <li><strong>Challenge rules</strong> — 0 to 3 rules such as hip-fire only, no armor, traders only or kill a PMC before you extract.</li>
            <li><strong>Lock and reroll</strong> — lock any slot, or use the dice on one slot to change only that part.</li>
          </ul>

          <SectionTitle>Raid challenge ideas</SectionTitle>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Gun roulette</strong> — every squad member rolls once and has to run that gun, no rerolls. Lock the map so you all load into the same raid.</li>
            <li><strong>Hardcore pistol run</strong> — Pistol run preset, Budget ammo and two rules. Extract with anything and you win.</li>
            <li><strong>Streamer wheel</strong> — share the link in chat and let viewers vote to reroll one slot with the dice button.</li>
            <li><strong>Daily raid</strong> — run today&rsquo;s challenge below the tool and post whether you extracted.</li>
          </ul>

          <SectionTitle>How this compares with other Tarkov randomizers</SectionTitle>
          <p>
            Most Tarkov gun randomizers either show a text-only weapon name or load their list from a live API and break when that API is down. This one keeps the current weapon and ammo list on the page, shows each gun&rsquo;s render, lets you filter by class, lock slots and reroll single parts, and gives every loadout a link that opens the exact same kit.
            It does not name specific parts for each gun; it gives build rules instead, so every roll is something you can actually build.
          </p>
          <p>
            Need to split a group into squads first? Use the <Link prefetch={false} href="/random-team-generator" className={linkClass}>random team generator</Link>. Looking for another game randomizer? Try the <Link prefetch={false} href="/random-pokemon-generator" className={linkClass}>random Pokémon generator</Link>.
          </p>

          <SectionTitle>Data source and date</SectionTitle>
          <p data-tarkov-data-date>
            Weapons: Escape from Tarkov Wiki &ldquo;Weapons&rdquo; page, revision of {fmtDate(TARKOV_WIKI_REVISIONS.weapons)}. Ammo: &ldquo;Ballistics&rdquo; page, revision of {fmtDate(TARKOV_WIKI_REVISIONS.ballistics)}. Both fetched {fmtDate(TARKOV_DATA_DATE)}.
            Quest and event items that are not normal raid picks (such as the Blicky toy gun and the rocket launcher) are left out. Damage and penetration change between patches; check the wiki or tarkov.dev before you buy ammo in bulk.
          </p>
          <p className="rounded-xl border border-white/10 p-3 text-xs" data-tarkov-disclaimer>
            <strong className="text-[var(--text-primary)]">Disclaimer:</strong> Unofficial fan tool, not affiliated with or endorsed by Battlestate Games. Escape from Tarkov is a trademark of Battlestate Games. Weapon images are in-game renders © Battlestate Games, used only to identify each weapon. The hero illustration is original art.
          </p>
        </>
      }
    >
      <p className="mx-auto -mt-2 mb-4 max-w-3xl px-4 text-center text-xs text-[var(--text-muted)] sm:px-6" data-main-page>
        Main page: <Link prefetch={false} href="/" className={linkClass}>all Random Topics generators</Link> · More game randomizers: <Link prefetch={false} href="/random-pokemon-generator" className={linkClass}>random Pokémon generator</Link>
      </p>
      <TarkovWeaponGenerator />
    </GeneratorPageShell>
  );
}
