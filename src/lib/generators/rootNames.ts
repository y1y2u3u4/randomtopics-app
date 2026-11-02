// Shared helpers for invented names built from meaningful word-roots
// (dragonborn, dwarf, god). Each name keeps the meaning of both parts.
export interface Root { part: string; meaning: string }
export interface RootName<G extends string, S extends string> { name: string; group: G; gender: S; meaning: string }

export const roots = (list: string): Root[] =>
  list.split(", ").map((r) => { const [part, meaning] = r.split(":"); return { part, meaning }; });

/** "Name = meaning; Name = meaning" -> [{ name, meaning }] */
export const glossed = (list: string) =>
  list.split("; ").map((c) => { const [name, meaning] = c.split(" = "); return { name, meaning }; });

const fuse = (a: string, b: string) => {
  const head = a.slice(0, 1).toUpperCase() + a.slice(1).toLowerCase();
  // Merge a doubled letter at the seam: Thor + rik -> Thorik.
  return head.slice(-1).toLowerCase() === b[0] ? head + b.slice(1) : head + b;
};

export function rootNames<G extends string, S extends string>(prefix: Record<G, Root[]>, suffix: Record<S, Root[]>, maxLength = 10) {
  return (Object.keys(prefix) as G[])
    .flatMap((group) =>
      prefix[group].flatMap((p) =>
        (Object.keys(suffix) as S[]).flatMap((gender) =>
          suffix[gender].map((s): RootName<G, S> => ({ name: fuse(p.part, s.part), group, gender, meaning: `${p.meaning} + ${s.meaning}` })),
        ),
      ),
    )
    .filter((n, i, all) => n.name.length <= maxLength && all.findIndex((m) => m.name === n.name) === i);
}
