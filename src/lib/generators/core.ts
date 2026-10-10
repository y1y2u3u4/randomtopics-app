import { createRng, drawUnique, filterBy, type Rng } from "@/lib/randomGenerators";
import type { FilterState, GeneratorResult } from "@/components/generators/GeneratorUI";

export interface ListGenerator {
  poolSize: (filters: FilterState) => number;
  generate: (filters: FilterState, count: number, used: string[], seed: number) => { results: GeneratorResult[]; used: string[] };
  resolve: (key: string, filters: FilterState) => GeneratorResult | null;
}

/**
 * Generator over a flat list: each filter group maps to a facet function and
 * items are drawn without repeats until the filtered pool is exhausted.
 */
export function listGenerator<T>(config: {
  items: readonly T[];
  key: (item: T) => string;
  facets: Record<string, (item: T) => readonly string[]>;
  toResult: (item: T) => GeneratorResult;
}): ListGenerator & { pool: (filters: FilterState) => T[] } {
  const byKey = new Map(config.items.map((item) => [config.key(item), item]));
  const pool = (filters: FilterState) =>
    Object.entries(config.facets).reduce<T[]>(
      (acc, [id, facet]) => filterBy(acc, filters[id] ?? [], facet),
      config.items.slice(),
    );
  return {
    pool,
    poolSize: (filters) => pool(filters).length,
    generate(filters, count, used, seed) {
      const out = drawUnique(pool(filters), count, config.key, used, createRng(seed));
      return { results: out.picks.map(config.toResult), used: out.used };
    },
    resolve(key) {
      const item = byKey.get(key);
      return item ? config.toResult(item) : null;
    },
  };
}

/** Pick one element uniformly. */
export function pick<T>(items: readonly T[], rng: Rng): T {
  return items[Math.floor(rng() * items.length)];
}

/**
 * Generator whose results combine a base item (drawn without repeats) with
 * extra parts chosen at random, e.g. a first name + a family name. The extra
 * parts are encoded in the result key so shared links resolve exactly.
 */
export function comboGenerator<T, E>(config: {
  items: readonly T[];
  baseKey: (item: T) => string;
  facets: Record<string, (item: T) => readonly string[]>;
  extra: (item: T, rng: Rng, filters: FilterState) => E;
  extraKey: (extra: E) => string;
  extraFromKey: (item: T, key: string) => E | null;
  toResult: (item: T, extra: E) => Omit<GeneratorResult, "key">;
  /** Optional multiplier for the "possible results" hint. */
  variety?: (filters: FilterState) => number;
}): ListGenerator {
  const byKey = new Map(config.items.map((item) => [config.baseKey(item), item]));
  const pool = (filters: FilterState) =>
    Object.entries(config.facets).reduce<T[]>(
      (acc, [id, facet]) => filterBy(acc, filters[id] ?? [], facet),
      config.items.slice(),
    );
  const build = (item: T, extra: E): GeneratorResult => ({
    key: `${config.baseKey(item)}|${config.extraKey(extra)}`,
    ...config.toResult(item, extra),
  });
  return {
    poolSize: (filters) => pool(filters).length * (config.variety?.(filters) ?? 1),
    generate(filters, count, used, seed) {
      const rng = createRng(seed);
      const baseUsed = used.map((k) => k.split("|")[0]);
      const out = drawUnique(pool(filters), count, config.baseKey, baseUsed, rng);
      return {
        results: out.picks.map((item) => build(item, config.extra(item, rng, filters))),
        used: out.used,
      };
    },
    resolve(key) {
      const cut = key.indexOf("|");
      if (cut < 0) return null;
      const item = byKey.get(key.slice(0, cut));
      if (!item) return null;
      const extra = config.extraFromKey(item, key.slice(cut + 1));
      return extra === null ? null : build(item, extra);
    },
  };
}
