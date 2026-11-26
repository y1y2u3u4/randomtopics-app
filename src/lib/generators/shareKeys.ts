// Share links store result keys in ?r= joined by "~". Several generators use
// "~" inside their own keys (business, megacorp, pirate, vampire, dragonborn,
// real names), so each key escapes "%" and "~" before joining.
// scripts/share-keys-regression.mjs round-trips every generator through this.
const MAX_SHARED = 50;

export function encodeShareKeys(keys: readonly string[]): string {
  return keys.map((k) => k.replace(/%/g, "%25").replace(/~/g, "%7E")).join("~");
}

export function decodeShareKeys(raw: string): string[] {
  return raw
    .split("~")
    .filter(Boolean)
    .slice(0, MAX_SHARED)
    .map((k) => {
      try {
        return decodeURIComponent(k);
      } catch {
        return k;
      }
    });
}
