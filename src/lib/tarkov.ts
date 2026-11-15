import { AMMO_ROWS, TARKOV_DATA_DATE, TARKOV_WIKI_REVISIONS, WEAPON_ROWS, type WeaponClass } from "@/data/tarkovWeapons";
import { createRng, type Rng } from "@/lib/randomGenerators";

export { TARKOV_DATA_DATE, TARKOV_WIKI_REVISIONS };
export type { WeaponClass };

export interface Weapon { id: string; name: string; cls: WeaponClass; caliber: string; modes: string; rof: number }
export interface Ammo { id: string; caliber: string; name: string; dmg: number; pen: number; pellets: number; tracer: boolean; subsonic: boolean }

const ammoId = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export const WEAPONS: readonly Weapon[] = WEAPON_ROWS.map(([id, name, cls, caliber, modes, rof]) => ({ id, name, cls, caliber, modes, rof }));
export const AMMO: readonly Ammo[] = AMMO_ROWS.map(([caliber, name, dmg, pen, pellets, flags]) => ({
  id: ammoId(name), caliber, name, dmg, pen, pellets, tracer: flags.includes("t"), subsonic: flags.includes("s"),
}));

export const weaponImg = (w: Weapon): string => `/tarkov/weapons/${w.id}.webp`;
export const weaponById = (id: string | null | undefined) => WEAPONS.find((w) => w.id === id);
export const ammoById = (id: string | null | undefined) => AMMO.find((a) => a.id === id);
export const ammoFor = (w: Weapon) => AMMO.filter((a) => a.caliber === w.caliber);

export const CLASSES: { value: WeaponClass; label: string; short: string; primary: boolean }[] = [
  { value: "ar", label: "Assault rifles", short: "AR", primary: true },
  { value: "carbine", label: "Assault carbines", short: "Carbine", primary: true },
  { value: "smg", label: "Submachine guns", short: "SMG", primary: true },
  { value: "shotgun", label: "Shotguns", short: "Shotgun", primary: true },
  { value: "dmr", label: "Marksman rifles (DMR)", short: "DMR", primary: true },
  { value: "bolt", label: "Bolt-action rifles", short: "Bolt", primary: true },
  { value: "lmg", label: "Machine guns", short: "LMG", primary: true },
  { value: "gl", label: "Grenade launchers", short: "GL", primary: true },
  { value: "pistol", label: "Pistols", short: "Pistol", primary: false },
  { value: "revolver", label: "Revolvers", short: "Revolver", primary: false },
  { value: "melee", label: "Melee only", short: "Melee", primary: false },
];
export const classLabel = (c: WeaponClass) => CLASSES.find((x) => x.value === c)?.label ?? c;
/** Default draw: every primary class except grenade launchers (a joke pick most people filter out). */
export const DEFAULT_CLASSES: WeaponClass[] = ["ar", "carbine", "smg", "shotgun", "dmr", "bolt", "lmg"];

export const MAPS: { id: string; name: string; note: string }[] = [
  { id: "ground-zero", name: "Ground Zero", note: "starter map for new PMCs" },
  { id: "factory", name: "Factory", note: "tiny, close range, 20-minute raid" },
  { id: "customs", name: "Customs", note: "mid-range, lots of quest spots" },
  { id: "woods", name: "Woods", note: "open forest, long sight lines" },
  { id: "shoreline", name: "Shoreline", note: "big map with the resort" },
  { id: "interchange", name: "Interchange", note: "the ULTRA mall, dark inside" },
  { id: "reserve", name: "Reserve", note: "military base, underground bunkers" },
  { id: "the-lab", name: "The Lab", note: "needs a keycard, Raiders everywhere" },
  { id: "lighthouse", name: "Lighthouse", note: "long coast, Rogue camp at the water treatment plant" },
  { id: "streets", name: "Streets of Tarkov", note: "dense city blocks, heavy on PC performance" },
  { id: "labyrinth", name: "The Labyrinth", note: "needs a special access key, traps and puzzles" },
  { id: "icebreaker", name: "Icebreaker", note: "a ship frozen in the ice" },
  { id: "terminal", name: "Terminal", note: "the port, final story location" },
];
export const mapById = (id: string | null | undefined) => MAPS.find((m) => m.id === id);

/** Attachment rules: generic slot choices that work for any gun, so the roll never names a part your gun cannot mount. */
export interface AttSlot { id: string; label: string; options: string[]; for?: WeaponClass[] }
const GUNS: WeaponClass[] = ["ar", "carbine", "smg", "shotgun", "dmr", "bolt", "lmg", "pistol", "revolver"];
const LONG: WeaponClass[] = ["ar", "carbine", "smg", "shotgun", "dmr", "bolt", "lmg"];
export const ATT_SLOTS: AttSlot[] = [
  { id: "o", label: "Optic", options: ["Iron sights only", "Red dot / reflex sight", "Holographic sight", "Low-power variable (1–4x or 1–6x)", "Magnified scope (4x or more)", "Thermal or night-vision scope"], for: GUNS },
  { id: "m", label: "Muzzle", options: ["Factory muzzle — no change", "Suppressor required", "Muzzle brake or compensator", "Flash hider"], for: GUNS },
  { id: "t", label: "Tactical device", options: ["None", "Flashlight", "Laser", "Flashlight + laser combo"], for: GUNS },
  { id: "g", label: "Mag", options: ["Smallest mag that fits", "Standard factory mag", "Biggest mag or drum you can find"], for: GUNS },
  { id: "s", label: "Stock & grip", options: ["Factory stock and grip", "Lightest / shortest stock possible", "Best ergonomics you can afford", "No foregrip"], for: LONG },
];
export const attSlotsFor = (w: Weapon) => ATT_SLOTS.filter((s) => !s.for || s.for.includes(w.cls));
/** Pistols and revolvers get only close-range optics. */
const optionAllowed = (slot: AttSlot, idx: number, w: Weapon) => !(slot.id === "o" && (w.cls === "pistol" || w.cls === "revolver") && idx > 2);

export const CHALLENGES: { id: string; text: string }[] = [
  { id: "hipfire", text: "Hip-fire only — never aim down sights" },
  { id: "single", text: "Single-fire only, even if the gun has full-auto" },
  { id: "noarmor", text: "No body armor — a rig without plates only" },
  { id: "class3", text: "Armor class 3 maximum" },
  { id: "nohelmet", text: "No helmet" },
  { id: "nobag", text: "No backpack — pockets and rig only" },
  { id: "rolledammo", text: "Only the rolled ammo — no topping up from raid loot" },
  { id: "traders", text: "Traders only — no flea market for this build" },
  { id: "budget", text: "Whole kit under 100,000 roubles" },
  { id: "twenty", text: "Stay in raid for at least 20 minutes before you extract" },
  { id: "meleekill", text: "Get one kill with your melee weapon" },
  { id: "noheal", text: "No healing items except what you find in raid" },
  { id: "nogrenade", text: "No grenades" },
  { id: "walk", text: "No sprinting after the first 5 minutes" },
  { id: "fir3", text: "Extract with at least 3 found-in-raid items you did not plan to loot" },
  { id: "loudout", text: "Shout ‘friendly!’ before every fight (voice line or mic)" },
  { id: "noscav", text: "Do not kill Scavs unless they shoot first" },
  { id: "deadman", text: "If you die, your next raid is melee only" },
  { id: "pmckill", text: "Do not extract until you kill one PMC" },
  { id: "secure", text: "Only loot what fits in your secure container" },
];
export const challengeById = (id: string) => CHALLENGES.find((c) => c.id === id);

export type AmmoTier = "any" | "budget" | "meta";
export interface KitOptions { classes: WeaponClass[]; ammo: boolean; ammoTier: AmmoTier; att: boolean; map: boolean; challenges: number; sidearm: boolean; melee: boolean }
export const DEFAULT_OPTIONS: KitOptions = { classes: DEFAULT_CLASSES, ammo: true, ammoTier: "any", att: true, map: true, challenges: 1, sidearm: false, melee: false };

export interface Kit {
  weapon: Weapon;
  ammo: Ammo | null;
  att: Record<string, number> | null;
  map: string | null;
  challenges: string[];
  sidearm: Weapon | null;
  melee: Weapon | null;
}
export type SlotKey = "weapon" | "ammo" | "att" | "map" | "challenges" | "sidearm" | "melee";

const pick = <T,>(list: readonly T[], rng: Rng): T => list[Math.floor(rng() * list.length)];

export function weaponPool(classes: readonly WeaponClass[]): Weapon[] {
  return WEAPONS.filter((w) => classes.includes(w.cls));
}

export function rollAmmo(w: Weapon, tier: AmmoTier, rng: Rng): Ammo | null {
  const list = [...ammoFor(w)].sort((a, b) => a.pen - b.pen);
  if (list.length === 0) return null;
  const third = Math.max(1, Math.ceil(list.length / 3));
  const pool = tier === "budget" ? list.slice(0, third) : tier === "meta" ? list.slice(-third) : list;
  return pick(pool, rng);
}

export function rollAtt(w: Weapon, rng: Rng): Record<string, number> | null {
  const slots = attSlotsFor(w);
  if (slots.length === 0) return null;
  const out: Record<string, number> = {};
  for (const s of slots) {
    const ok = s.options.map((_, i) => i).filter((i) => optionAllowed(s, i, w));
    out[s.id] = pick(ok, rng);
  }
  return out;
}

export function rollChallenges(n: number, rng: Rng, keep: readonly string[] = []): string[] {
  const out = keep.slice(0, n);
  const pool = CHALLENGES.map((c) => c.id).filter((id) => !out.includes(id));
  while (out.length < n && pool.length) out.push(pool.splice(Math.floor(rng() * pool.length), 1)[0]);
  return out;
}

/**
 * Roll a full kit. Slots in `locked` keep their value from `prev`. If the weapon
 * changes under a locked ammo of another caliber, the ammo is rerolled so the
 * kit always stays legal.
 */
export function rollKit(opts: KitOptions, rng: Rng, prev?: Kit | null, locked: ReadonlySet<SlotKey> = new Set(), avoid: readonly string[] = []): Kit | null {
  const keep = (k: SlotKey) => !!prev && locked.has(k);
  let weapon: Weapon;
  if (keep("weapon") && prev) weapon = prev.weapon;
  else {
    const pool = weaponPool(opts.classes);
    if (pool.length === 0) return null;
    const fresh = pool.filter((w) => !avoid.includes(w.id));
    weapon = pick(fresh.length ? fresh : pool, rng);
  }
  const isGun = weapon.cls !== "melee";
  let ammo: Ammo | null = null;
  if (opts.ammo && isGun) {
    ammo = keep("ammo") && prev?.ammo && prev.ammo.caliber === weapon.caliber ? prev.ammo : rollAmmo(weapon, opts.ammoTier, rng);
  }
  let att: Record<string, number> | null = null;
  if (opts.att && isGun) {
    att = keep("att") && prev?.att && prev.weapon.cls === weapon.cls ? prev.att : rollAtt(weapon, rng);
  }
  const map = opts.map ? (keep("map") && prev?.map ? prev.map : pick(MAPS, rng).id) : null;
  const challenges = keep("challenges") && prev ? rollChallenges(opts.challenges, rng, prev.challenges) : rollChallenges(opts.challenges, rng);
  const sideOk = opts.sidearm && weapon.cls !== "pistol" && weapon.cls !== "revolver";
  const sidearm = sideOk ? (keep("sidearm") && prev?.sidearm ? prev.sidearm : pick(WEAPONS.filter((w) => w.cls === "pistol" || w.cls === "revolver"), rng)) : null;
  const meleeOk = opts.melee && weapon.cls !== "melee";
  const melee = meleeOk ? (keep("melee") && prev?.melee ? prev.melee : pick(WEAPONS.filter((w) => w.cls === "melee"), rng)) : null;
  return { weapon, ammo, att, map, challenges, sidearm, melee };
}

/** Reroll one slot, keeping everything else. */
export function rerollSlot(kit: Kit, slot: SlotKey, opts: KitOptions, rng: Rng): Kit {
  const all: SlotKey[] = ["weapon", "ammo", "att", "map", "challenges", "sidearm", "melee"];
  const locked = new Set(all.filter((k) => k !== slot));
  if (slot === "weapon") { locked.delete("ammo"); locked.delete("att"); }
  return rollKit({ ...opts, challenges: slot === "challenges" ? opts.challenges : kit.challenges.length }, rng, kit, locked, [kit.weapon.id]) ?? kit;
}

// ---------- Share links: the exact kit lives in the URL ----------
export function kitToParams(kit: Kit): URLSearchParams {
  const p = new URLSearchParams();
  p.set("w", kit.weapon.id);
  if (kit.ammo) p.set("am", kit.ammo.id);
  if (kit.att) p.set("att", Object.entries(kit.att).map(([k, v]) => `${k}${v}`).join(""));
  if (kit.map) p.set("map", kit.map);
  if (kit.challenges.length) p.set("ch", kit.challenges.join(","));
  if (kit.sidearm) p.set("sa", kit.sidearm.id);
  if (kit.melee) p.set("ml", kit.melee.id);
  return p;
}

export function kitFromParams(p: URLSearchParams): Kit | null {
  const weapon = weaponById(p.get("w"));
  if (!weapon) return null;
  const am = ammoById(p.get("am"));
  const ammo = am && am.caliber === weapon.caliber ? am : null;
  let att: Record<string, number> | null = null;
  const raw = p.get("att");
  if (raw && weapon.cls !== "melee") {
    att = {};
    for (const m of raw.matchAll(/([a-z])(\d)/g)) {
      const slot = attSlotsFor(weapon).find((s) => s.id === m[1]);
      const i = Number(m[2]);
      if (slot && i < slot.options.length && optionAllowed(slot, i, weapon)) att[slot.id] = i;
    }
    if (Object.keys(att).length === 0) att = null;
  }
  const map = mapById(p.get("map"))?.id ?? null;
  const challenges = (p.get("ch") ?? "").split(",").filter((id) => challengeById(id)).slice(0, 3);
  const sa = weaponById(p.get("sa"));
  const ml = weaponById(p.get("ml"));
  return {
    weapon, ammo, att, map, challenges,
    sidearm: sa && (sa.cls === "pistol" || sa.cls === "revolver") ? sa : null,
    melee: ml && ml.cls === "melee" ? ml : null,
  };
}

export function ammoLine(a: Ammo): string {
  const dmg = a.pellets ? `${a.pellets}×${a.dmg} dmg` : `${a.dmg} dmg`;
  return `${a.name} (${dmg}, ${a.pen} pen${a.tracer ? ", tracer" : ""}${a.subsonic ? ", subsonic" : ""})`;
}

export function kitText(kit: Kit, url?: string): string {
  const lines = [`Weapon: ${kit.weapon.name} (${classLabel(kit.weapon.cls)}${kit.weapon.caliber ? `, ${kit.weapon.caliber}` : ""})`];
  if (kit.ammo) lines.push(`Ammo: ${ammoLine(kit.ammo)}`);
  if (kit.att) for (const s of attSlotsFor(kit.weapon)) if (kit.att[s.id] !== undefined) lines.push(`${s.label}: ${s.options[kit.att[s.id]]}`);
  if (kit.sidearm) lines.push(`Sidearm: ${kit.sidearm.name}`);
  if (kit.melee) lines.push(`Melee: ${kit.melee.name}`);
  if (kit.map) lines.push(`Map: ${mapById(kit.map)?.name}`);
  kit.challenges.forEach((id, i) => lines.push(`Rule ${i + 1}: ${challengeById(id)?.text}`));
  if (url) lines.push(url);
  return lines.join("\n");
}

/** UTC day number so everyone gets the same daily kit on a given day. */
export function dayNumber(date = new Date()): number {
  return Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000);
}
export function dateLabel(day: number): string {
  return new Date(day * 86_400_000).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

/** Today's raid challenge: a full kit with sidearm, map and two rules, fixed for the whole UTC day. */
export function dailyKit(day: number): Kit {
  const rng = createRng((day * 2654435761 + 77_001) >>> 0);
  rng(); rng();
  return rollKit({ ...DEFAULT_OPTIONS, challenges: 2, melee: true }, rng)!;
}

/** Fixed example kits for the page (server-rendered, real data). */
export function exampleKit(seed: number, opts: Partial<KitOptions> = {}): Kit {
  return rollKit({ ...DEFAULT_OPTIONS, ...opts }, createRng(seed))!;
}

export function classCounts() {
  return CLASSES.map((c) => ({ ...c, count: WEAPONS.filter((w) => w.cls === c.value).length }));
}
