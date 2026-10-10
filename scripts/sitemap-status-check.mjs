// Fetch every URL in the sitemap (without following redirects) and report
// anything that is not a 200. Usage:
//   node scripts/sitemap-status-check.mjs [baseUrl]   (default https://randomtopics.app)
// When baseUrl is not the production origin, sitemap URLs are rewritten onto it.
const base = (process.argv[2] ?? "https://randomtopics.app").replace(/\/$/, "");
const PROD = "https://randomtopics.app";

const xml = await (await fetch(`${base}/sitemap.xml`)).text();
const urls = [...new Set([...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]))];
const hreflang = [...new Set([...xml.matchAll(/hreflang="[^"]+"\s+href="([^"]+)"/g)].map((m) => m[1]))];
const all = [...new Set([...urls, ...hreflang])];

const bad = [];
let done = 0;
async function check(url) {
  const target = base === PROD ? url : url.replace(PROD, base);
  try {
    const res = await fetch(target, { redirect: "manual" });
    if (res.status !== 200) bad.push({ url, status: res.status, location: res.headers.get("location") ?? "" });
  } catch (error) {
    bad.push({ url, status: "ERR", location: String(error) });
  }
  done++;
}
const queue = [...all];
await Promise.all(Array.from({ length: 8 }, async () => { while (queue.length) await check(queue.shift()); }));

console.log(`${done} URLs checked (${urls.length} <loc>, ${all.length - urls.length} extra hreflang targets)`);
for (const b of bad) console.log(`${b.status}\t${b.url}${b.location ? `\t→ ${b.location}` : ""}`);
process.exit(bad.length ? 1 : 0);
