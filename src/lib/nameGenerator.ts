import { NAME_CORPUS_VERSION, NAME_STYLES, nameRecipes, type NameKind, type NameRecipe } from "@/data/nameGenerators";

export type NameOptions = { style: string; length: string; seed: string; avoid: string; withTitle: boolean; count: number };
export type NameSelection = { id: string; seed: string; withTitle: boolean };
export type NameResult = NameRecipe & { display: string; identity: string; selection: NameSelection };
export type NameRound = { version: number; updated: number; options: NameOptions; seen: string[]; results: NameSelection[]; generated: boolean };
export const MAX_NAME_HISTORY = 5000;
export const MAX_NAME_SHORTLIST = 30;
const ROUND_AGE = 24 * 60 * 60 * 1000;
export const nameRoundKey = (kind: NameKind) => `rt_name_round_${kind}_v1`;
export const nameShortlistKey = (kind: NameKind) => `rt_name_shortlist_${kind}_v1`;
export const normalizeName = (name: string) => name.normalize("NFKC").toLocaleLowerCase("en").replace(/[^\p{L}\p{N}]+/gu, " ").trim();
export const nameLengths = (kind: NameKind) => kind === "band"
  ? [{ id: "1", label: "One word" }, { id: "2", label: "Two words" }, { id: "3", label: "Three words" }]
  : [{ id: "short", label: "Short · 4–6 letters" }, { id: "long", label: "Long · 7–10 letters" }];
export function defaultNameOptions(): NameOptions { return { style: "all", length: "any", seed: "", avoid: "", withTitle: true, count: 3 }; }
const isRecord = (value: unknown): value is Record<string, unknown> => Boolean(value && typeof value === "object" && !Array.isArray(value));

export function validateNameOptions(kind: NameKind, value: unknown): { value: NameOptions; error?: never } | { error: string; value?: never } {
  if (!isRecord(value)) return { error: "Choose valid filters and try again." };
  if (typeof value.style !== "string" || (value.style !== "all" && !NAME_STYLES[kind].some(style => style.id === value.style))) return { error: "Choose a listed style." };
  if (typeof value.length !== "string" || (value.length !== "any" && !nameLengths(kind).some(length => length.id === value.length))) return { error: "Choose a listed name length." };
  if (typeof value.seed !== "string" || typeof value.avoid !== "string" || typeof value.withTitle !== "boolean" || ![1, 3, 5].includes(Number(value.count))) return { error: "Choose valid filters and try again." };
  const seed = value.seed.trim().normalize("NFKC"), avoid = value.avoid.trim().normalize("NFKC");
  if (seed.length > 20 || (seed && !/^[\p{L}]+$/u.test(seed))) return { error: "Use one seed word, up to 20 letters, without spaces or punctuation." };
  const terms = avoid.split(",").map(term => term.trim()).filter(Boolean);
  if (avoid.length > 100 || terms.length > 5 || terms.some(term => term.length > 30 || !normalizeName(term))) return { error: "Use up to five comma-separated avoid words or phrases, 100 characters total." };
  return { value: { style: value.style, length: value.length, seed: kind === "band" ? seed : "", avoid: kind === "band" ? avoid : "", withTitle: kind === "dragon" && value.withTitle, count: Number(value.count) } };
}

export function resolveName(kind: NameKind, selection: unknown): NameResult | null {
  if (!isRecord(selection) || typeof selection.id !== "string" || typeof selection.seed !== "string" || typeof selection.withTitle !== "boolean") return null;
  const recipe = nameRecipes(kind).find(recipe => recipe.id === selection.id);
  const parsed = validateNameOptions(kind, { ...defaultNameOptions(), seed: selection.seed, withTitle: selection.withTitle });
  if (!recipe || !parsed.value) return null;
  const { seed, withTitle } = parsed.value;
  const word = seed ? seed[0].toLocaleUpperCase("en") + seed.slice(1).toLocaleLowerCase("en") : "";
  const name = word && recipe.seedPattern ? recipe.seedPattern.replace("{seed}", word) : recipe.name;
  return { ...recipe, name, display: withTitle && recipe.title ? `${name}, ${recipe.title}` : name,
    identity: `${kind}:${normalizeName(name).replaceAll(" ", "")}`, selection: { id: recipe.id, seed, withTitle } };
}

export function namePool(kind: NameKind, options: NameOptions): NameResult[] {
  const terms = options.avoid.split(",").map(normalizeName).filter(Boolean);
  const unique = new Map<string, NameResult>();
  for (const recipe of nameRecipes(kind)) {
    if ((options.style !== "all" && recipe.style !== options.style) || (options.length !== "any" && recipe.length !== options.length)) continue;
    const result = resolveName(kind, { id: recipe.id, seed: options.seed, withTitle: options.withTitle })!;
    if (terms.some(term => normalizeName(result.name).includes(term))) continue;
    if (!unique.has(result.identity)) unique.set(result.identity, result);
  }
  return [...unique.values()];
}

export function drawNames(pool: NameResult[], seen: readonly string[], count: number, random = Math.random): NameResult[] {
  const used = new Set(seen), available = pool.filter(result => !used.has(result.identity));
  const wanted = Math.min(Math.max(0, Math.floor(count)), available.length, MAX_NAME_HISTORY - used.size);
  const results: NameResult[] = [];
  for (let i = 0; i < wanted; i++) {
    const index = Math.min(available.length - 1, Math.max(0, Math.floor(random() * available.length)));
    results.push(...available.splice(index, 1));
  }
  return results;
}

export function freshNameRound(kind: NameKind, options = defaultNameOptions(), now = Date.now(), example = true): NameRound {
  const safe = validateNameOptions(kind, options).value!;
  const starter = example ? namePool(kind, safe)[0] : undefined;
  return { version: NAME_CORPUS_VERSION, updated: now, options: safe, seen: starter ? [starter.identity] : [], results: starter ? [starter.selection] : [], generated: false };
}

export function restoreNameRound(kind: NameKind, raw: string | null, now = Date.now()): NameRound | null {
  try {
    const value: unknown = JSON.parse(raw || "null");
    if (!isRecord(value) || value.version !== NAME_CORPUS_VERSION || typeof value.updated !== "number" || !Number.isFinite(value.updated) || value.updated > now || now - value.updated > ROUND_AGE || typeof value.generated !== "boolean") return null;
    const options = validateNameOptions(kind, value.options).value;
    if (!options || !Array.isArray(value.seen) || value.seen.length > MAX_NAME_HISTORY || !Array.isArray(value.results) || value.results.length > 5) return null;
    if (value.seen.some(key => typeof key !== "string" || key.length > 110 || !key.startsWith(kind + ":") || !/^(band|dragon):[\p{L}\p{N} ]+$/u.test(key))) return null;
    const eligible = namePool(kind, options);
    const results = value.results.map(selection => resolveName(kind, selection));
    if (results.some(result => !result || result.selection.seed !== options.seed || result.selection.withTitle !== options.withTitle || !eligible.some(item => item.identity === result.identity))) return null;
    const valid = results as NameResult[];
    if (new Set(valid.map(result => result.identity)).size !== valid.length) return null;
    const seen = [...new Set([...value.seen as string[], ...valid.map(result => result.identity)])];
    if (seen.length > MAX_NAME_HISTORY) return null;
    return { version: NAME_CORPUS_VERSION, updated: value.updated, options, seen, results: valid.map(result => result.selection), generated: value.generated };
  } catch { return null; }
}

export function restoreNameShortlist(kind: NameKind, raw: string | null): NameSelection[] {
  try {
    const value: unknown = JSON.parse(raw || "null");
    if (!isRecord(value) || value.version !== NAME_CORPUS_VERSION || !Array.isArray(value.items)) return [];
    const unique = new Map<string, NameSelection>();
    for (const selection of value.items.slice(0, MAX_NAME_SHORTLIST)) {
      const result = resolveName(kind, selection);
      if (result && !unique.has(result.identity)) unique.set(result.identity, result.selection);
    }
    return [...unique.values()];
  } catch { return []; }
}

/** Only enums and counts cross the analytics boundary; input and names stay local. */
export function nameEventParams(kind: NameKind, options: NameOptions, surface = "name_generator") {
  return { tool_type: `${kind}_name`, content_source: `${kind}_name_generator`, result_type: "name", action_surface: surface,
    locale: "en", category: options.style, output_style: options.length, count: options.count,
    has_seed: Boolean(options.seed), has_avoid_words: Boolean(options.avoid), with_title: options.withTitle };
}
