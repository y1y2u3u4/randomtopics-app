import { NBA_PLAYERS, NBA_TEAMS, POSITIONS, DECADES, type NbaPlayer, type Position } from "@/data/nbaPlayers";
import { TEAM_COLORS, type TeamColors } from "@/data/nbaJerseys";
import { NBA_PORTRAIT_IDS } from "@/data/nbaPortraits";
import { createRng, drawUnique, type Rng } from "@/lib/randomGenerators";

export { NBA_PLAYERS, NBA_TEAMS, POSITIONS, DECADES };
export type { NbaPlayer, Position };

export { TEAM_COLORS };
export type { TeamColors };

const PORTRAITS = new Set<string>(NBA_PORTRAIT_IDS);
export const hasPortrait = (p: NbaPlayer): boolean => PORTRAITS.has(p.id);
export const portraitSrc = (p: NbaPlayer): string => `/nba/players/${p.id}.jpg`;
/** Jersey colours of the player's main (first listed) franchise. */
export const jerseyColors = (p: NbaPlayer): TeamColors => TEAM_COLORS[p.teams[0]];

export type Status = "all" | "active" | "retired";
export interface NbaFilters { status: Status; team: string; pos: string; era: string }
export const DEFAULT_FILTERS: NbaFilters = { status: "all", team: "", pos: "", era: "" };

/** The last season the bank covers; used as the end year for active players. */
export const LAST_SEASON_END = 2026;

export function playedInDecade(p: NbaPlayer, decade: number): boolean {
  const end = p.to === 0 ? LAST_SEASON_END : p.to;
  return p.from <= decade + 9 && end >= decade;
}

export function filterPlayers(filters: NbaFilters, players: readonly NbaPlayer[] = NBA_PLAYERS): NbaPlayer[] {
  return players.filter((p) => {
    if (filters.status === "active" && !p.active) return false;
    if (filters.status === "retired" && p.active) return false;
    if (filters.team && !p.teams.includes(filters.team)) return false;
    if (filters.pos && p.pos !== filters.pos) return false;
    if (filters.era && !playedInDecade(p, Number(filters.era))) return false;
    return true;
  });
}

export function careerYears(p: NbaPlayer): string {
  return p.to === 0 ? `${p.from}–present` : p.from === p.to ? String(p.from) : `${p.from}–${p.to}`;
}

export function playerLine(p: NbaPlayer): string {
  return [p.name, p.pos, p.teams.join(" / "), careerYears(p), p.honors.slice(0, 2).join(", ")].filter(Boolean).join(" · ");
}

export interface DrawOutcome { slots: NbaPlayer[]; used: string[]; short: boolean }

/**
 * Fill `count` slots. Locked players keep their slot; every other slot is
 * redrawn from the filtered pool without repeating players already shown in
 * this cycle, and never duplicating a locked player.
 */
export function drawSlots(
  prev: readonly (NbaPlayer | null)[],
  locked: ReadonlySet<string>,
  count: number,
  filters: NbaFilters,
  used: readonly string[],
  rng: Rng,
): DrawOutcome {
  const slots: (NbaPlayer | null)[] = [];
  for (let i = 0; i < count; i++) {
    const s = prev[i];
    slots.push(s && locked.has(s.id) ? s : null);
  }
  // Locked cards that no longer fit in the requested count stay visible at the end.
  for (let i = count; i < prev.length; i++) {
    const s = prev[i];
    if (s && locked.has(s.id)) slots.push(s);
  }
  const keptIds = new Set(slots.filter((s): s is NbaPlayer => !!s).map((s) => s.id));
  const need = slots.filter((s) => !s).length;
  const pool = filterPlayers(filters).filter((p) => !keptIds.has(p.id));
  const out = drawUnique(pool, need, (p) => p.id, used, rng);
  let k = 0;
  const filled = slots.map((s) => s ?? out.picks[k++] ?? null);
  return { slots: filled.filter((s): s is NbaPlayer => !!s), used: [...out.used, ...keptIds], short: out.picks.length < need };
}

/** UTC day number so everyone gets the same daily five on a given day. */
export function dayNumber(date = new Date()): number {
  return Math.floor(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) / 86_400_000);
}

export const FIVE_ORDER: Position[] = ["PG", "SG", "SF", "PF", "C"];

/** Today's random starting five: one player per position, fixed for the whole UTC day. */
export function dailyFive(day: number, players: readonly NbaPlayer[] = NBA_PLAYERS): NbaPlayer[] {
  return FIVE_ORDER.map((pos, i) => {
    const pool = players.filter((p) => p.pos === pos);
    const rng = createRng((day * 2654435761 + (i + 1) * 40503) >>> 0);
    rng(); rng();
    return pool[Math.floor(rng() * pool.length)];
  });
}

export function dateLabel(day: number): string {
  return new Date(day * 86_400_000).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", timeZone: "UTC" });
}

export function fiveShareText(day: number, five: readonly NbaPlayer[], url: string): string {
  return [`Random NBA starting five · ${dateLabel(day)}`, ...five.map((p) => `${p.pos} ${p.name}`), url].join("\n");
}

export function resultsText(players: readonly NbaPlayer[]): string {
  return players.map((p, i) => `${i + 1}. ${playerLine(p)}`).join("\n");
}

/** Player counts per decade (played at least one season in it), for the era overview. */
export function eraSummary() {
  return DECADES.map((d) => {
    const list = NBA_PLAYERS.filter((p) => playedInDecade(p, d));
    return { decade: d, count: list.length };
  });
}
