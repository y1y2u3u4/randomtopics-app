// Guards for the page-metadata fetch behind the citation generators: public
// http(s) hosts on standard ports only, never private, loopback, link-local or
// reserved addresses (checked for every redirect hop).
import { isIP } from "node:net";

export function ipv4Blocked(ip: string, allowBenchmark = false): boolean {
  const p = ip.split(".").map(Number);
  if (p.length !== 4 || p.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return true;
  const [a, b] = p;
  return a === 0 || a === 10 || a === 127 || a >= 224
    || (a === 100 && b >= 64 && b <= 127)
    || (a === 169 && b === 254)
    || (a === 172 && b >= 16 && b <= 31)
    || (a === 192 && b === 168)
    || (a === 192 && b === 0)
    || (!allowBenchmark && a === 198 && (b === 18 || b === 19));
}

export function ipBlocked(ip: string, allowBenchmark = false): boolean {
  const v = isIP(ip);
  if (v === 4) return ipv4Blocked(ip, allowBenchmark);
  if (v !== 6) return true;
  const s = ip.toLowerCase();
  const mapped = /^::ffff:(\d+\.\d+\.\d+\.\d+)$/.exec(s);
  if (mapped) return ipv4Blocked(mapped[1], allowBenchmark);
  return s === "::" || s === "::1" || /^f[cd]/.test(s) || /^fe[89ab]/.test(s) || /^ff/.test(s) || s.startsWith("64:ff9b:") || s.startsWith("2001:db8");
}

export function urlAllowed(raw: string): URL | null {
  let u: URL;
  try { u = new URL(raw); } catch { return null; }
  if (!["http:", "https:"].includes(u.protocol)) return null;
  if (u.username || u.password) return null;
  if (u.port && !["80", "443"].includes(u.port)) return null;
  const host = u.hostname.replace(/^\[|\]$/g, "");
  if (!host || host === "localhost" || host.endsWith(".localhost") || host.endsWith(".internal") || host.endsWith(".local")) return null;
  if (isIP(host) && ipBlocked(host)) return null;
  if (!isIP(host) && !host.includes(".")) return null;
  return u;
}
