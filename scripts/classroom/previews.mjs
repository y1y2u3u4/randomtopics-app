// Renders the one-slide/one-page preview exports with macOS Quick Look and
// copies them to public/classroom/previews (shown before purchase).
// Usage: node scripts/classroom/previews.mjs <dir with *-slide-a.pptx, *-pdf-page.pdf…>
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, readdirSync } from "node:fs";
import { join, resolve } from "node:path";

const dir = resolve(process.argv[2] || ".classroom-preview");
const out = resolve(import.meta.dirname, "../../public/classroom/previews");
mkdirSync(out, { recursive: true });
for (const file of readdirSync(dir).filter((f) => /-(slide-[ab]\.pptx|pdf-page\.pdf)$/.test(f))) {
  execFileSync("qlmanage", ["-t", "-s", "1400", "-o", dir, join(dir, file)], { stdio: "ignore", timeout: 60000 });
  const name = file.replace(/\.(pptx|pdf)$/, ".png");
  copyFileSync(join(dir, `${file}.png`), join(out, name));
  execFileSync("sips", ["--resampleWidth", file.endsWith(".pdf") ? "900" : "1200", join(out, name)], { stdio: "ignore" });
  console.log(join(out, name));
}
