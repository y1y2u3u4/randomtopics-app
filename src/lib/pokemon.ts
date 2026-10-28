import { POKEMON, POKEMON_TYPES, GEN_COUNTS, GEN_REGION, GEN_START, type Pokemon, type PokemonType } from "@/data/pokemon";
import { createRng, drawUnique, shuffle, parseSeed, type Rng } from "@/lib/randomGenerators";

export { POKEMON, POKEMON_TYPES, GEN_COUNTS, GEN_REGION, GEN_START };
export type { Pokemon, PokemonType };

export const MAX_COUNT = 24;
export const TEAM_SIZE = 6;
export const GENERATIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9] as const;

/** Type colours used for the cards (fan palette, not official artwork). `text` is the readable ink on `bg`. */
export const TYPE_COLORS: Record<PokemonType, { bg: string; text: string }> = {
  Normal: { bg: "#A8A878", text: "#14140A" },
  Fire: { bg: "#F08030", text: "#1F0D00" },
  Water: { bg: "#6890F0", text: "#08122E" },
  Electric: { bg: "#F8D030", text: "#2A2200" },
  Grass: { bg: "#78C850", text: "#0F2A06" },
  Ice: { bg: "#98D8D8", text: "#0A2A2A" },
  Fighting: { bg: "#C03028", text: "#FFFFFF" },
  Poison: { bg: "#A040A0", text: "#FFFFFF" },
  Ground: { bg: "#E0C068", text: "#2A2000" },
  Flying: { bg: "#A890F0", text: "#150C33" },
  Psychic: { bg: "#F85888", text: "#2E0612" },
  Bug: { bg: "#A8B820", text: "#1C2200" },
  Rock: { bg: "#B8A038", text: "#231D00" },
  Ghost: { bg: "#705898", text: "#FFFFFF" },
  Dragon: { bg: "#7038F8", text: "#FFFFFF" },
  Dark: { bg: "#705848", text: "#FFFFFF" },
  Steel: { bg: "#B8B8D0", text: "#14142A" },
  Fairy: { bg: "#EE99AC", text: "#33101A" },
};

export type Kind = "any" | "single" | "dual";
export type Special = "any" | "no" | "only";
export interface PokemonFilters {
  /** Selected generations; empty means all nine. */
  gens: number[];
  /** Selected types; a Pokémon matches if it has at least one of them. Empty means any. */
  types: PokemonType[];
  kind: Kind;
  special: Special;
}
export const DEFAULT_FILTERS: PokemonFilters = { gens: [], types: [], kind: "any", special: "any" };

export const dexLabel = (p: Pokemon): string => `#${String(p.dex).padStart(4, "0")}`;
export const typeLabel = (p: Pokemon): string => p.types.join(" / ");

export function filterPokemon(f: PokemonFilters, list: readonly Pokemon[] = POKEMON): Pokemon[] {
  return list.filter((p) => {
    if (f.gens.length && !f.gens.includes(p.gen)) return false;
    if (f.types.length && !p.types.some((t) => f.types.includes(t))) return false;
    if (f.kind === "single" && p.types.length !== 1) return false;
    if (f.kind === "dual" && p.types.length !== 2) return false;
    if (f.special === "no" && p.special) return false;
    if (f.special === "only" && !p.special) return false;
    return true;
  });
}

export interface DrawOutcome { slots: Pokemon[]; used: string[]; short: boolean }

/** Fill `count` slots; locked cards stay, every other slot is redrawn without repeats. */
export function drawSlots(
  prev: readonly Pokemon[],
  locked: ReadonlySet<number>,
  count: number,
  filters: PokemonFilters,
  used: readonly string[],
  rng: Rng,
): DrawOutcome {
  const want = Math.max(1, Math.min(MAX_COUNT, Math.floor(count)));
  const slots: (Pokemon | null)[] = [];
  for (let i = 0; i < want; i++) {
    const s = prev[i];
    slots.push(s && locked.has(s.dex) ? s : null);
  }
  for (let i = want; i < prev.length; i++) if (locked.has(prev[i].dex)) slots.push(prev[i]);
  const kept = new Set(slots.filter((s): s is Pokemon => !!s).map((s) => s.dex));
  const need = slots.filter((s) => !s).length;
  const pool = filterPokemon(filters).filter((p) => !kept.has(p.dex));
  const out = drawUnique(pool, need, (p) => String(p.dex), used, rng);
  let k = 0;
  const filled = slots.map((s) => s ?? out.picks[k++] ?? null);
  return { slots: filled.filter((s): s is Pokemon => !!s), used: [...out.used, ...[...kept].map(String)], short: out.picks.length < need };
}

/** Redraw one card, avoiding every Pokémon currently shown. */
export function rerollOne(slots: readonly Pokemon[], index: number, filters: PokemonFilters, rng: Rng): Pokemon[] {
  const shown = new Set(slots.map((p) => p.dex));
  const pool = filterPokemon(filters).filter((p) => !shown.has(p.dex));
  if (!pool.length) return slots.slice();
  const next = slots.slice();
  next[index] = pool[Math.floor(rng() * pool.length)];
  return next;
}

/**
 * A balanced team of up to six: greedily takes Pokémon from a shuffled pool so that no two
 * share a type. If the filtered pool cannot fill six that way, it tops up with the rest
 * (balanced === false) so the team is still full.
 */
export function drawTeam(filters: PokemonFilters, rng: Rng, size = TEAM_SIZE): { team: Pokemon[]; balanced: boolean } {
  const pool = shuffle(filterPokemon(filters), rng);
  const team: Pokemon[] = [];
  const seen = new Set<PokemonType>();
  for (const p of pool) {
    if (team.length >= size) break;
    if (p.types.some((t) => seen.has(t))) continue;
    team.push(p);
    p.types.forEach((t) => seen.add(t));
  }
  const balanced = team.length >= Math.min(size, pool.length);
  if (team.length < size) {
    for (const p of pool) {
      if (team.length >= size) break;
      if (!team.includes(p)) team.push(p);
    }
  }
  return { team, balanced: balanced && team.length === size };
}

/** Type coverage of a team: the set of distinct types it holds. */
export const teamTypes = (team: readonly Pokemon[]): PokemonType[] => [...new Set(team.flatMap((p) => p.types))];

export function resultsText(list: readonly Pokemon[], title = "Random Pokémon"): string {
  return [title, ...list.map((p, i) => `${i + 1}. ${dexLabel(p)} ${p.name} (${typeLabel(p)})`)].join("\n");
}

/* ---- shareable link: filters + mode + seed reproduce the exact result ---- */

export type Mode = "random" | "team";
export interface ShareState { filters: PokemonFilters; count: number; mode: Mode; seed: number }

export function shareQuery(s: ShareState): string {
  const q = new URLSearchParams();
  q.set("seed", String(s.seed));
  q.set("mode", s.mode);
  if (s.mode === "random") q.set("n", String(s.count));
  if (s.filters.gens.length) q.set("gen", [...s.filters.gens].sort((a, b) => a - b).join("."));
  if (s.filters.types.length) q.set("type", s.filters.types.map((t) => t.toLowerCase()).join("."));
  if (s.filters.kind !== "any") q.set("kind", s.filters.kind);
  if (s.filters.special !== "any") q.set("legend", s.filters.special);
  return q.toString();
}

export function parseShare(search: string): ShareState | null {
  const q = new URLSearchParams(search);
  const seed = parseSeed(q.get("seed"));
  if (seed === null) return null;
  const gens = (q.get("gen") ?? "").split(".").map(Number).filter((n) => Number.isInteger(n) && n >= 1 && n <= 9);
  const types = (q.get("type") ?? "").split(".").map((t) => POKEMON_TYPES.find((x) => x.toLowerCase() === t)).filter((t): t is PokemonType => !!t);
  const kindRaw = q.get("kind"), legendRaw = q.get("legend");
  const n = Number(q.get("n"));
  return {
    seed,
    mode: q.get("mode") === "team" ? "team" : "random",
    count: Number.isInteger(n) && n >= 1 && n <= MAX_COUNT ? n : 6,
    filters: {
      gens: [...new Set(gens)], types: [...new Set(types)],
      kind: kindRaw === "single" || kindRaw === "dual" ? kindRaw : "any",
      special: legendRaw === "no" || legendRaw === "only" ? legendRaw : "any",
    },
  };
}

/** The result a share link stands for. */
export function resultFromShare(s: ShareState): Pokemon[] {
  const rng = createRng(s.seed);
  return s.mode === "team" ? drawTeam(s.filters, rng).team : drawSlots([], new Set(), s.count, s.filters, [], rng).slots;
}

export function filterSummary(f: PokemonFilters): string {
  const parts: string[] = [];
  parts.push(f.gens.length ? `Gen ${[...f.gens].sort((a, b) => a - b).join(", ")}` : "All generations");
  if (f.types.length) parts.push(f.types.join(" or "));
  if (f.kind !== "any") parts.push(f.kind === "single" ? "single type" : "dual type");
  if (f.special === "no") parts.push("no legendaries");
  if (f.special === "only") parts.push("legendary and mythical only");
  return parts.join(" · ");
}
