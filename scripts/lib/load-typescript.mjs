import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
const root = resolve(import.meta.dirname, "../..");
export function load(file, overrides = {}, cache = new Map()) {
  file = resolve(root, file);
  if (cache.has(file)) return cache.get(file).exports;
  const loaded = { exports: {} };
  cache.set(file, loaded);
  const code = ts.transpileModule(readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;
  new Function("require", "module", "exports", code)(
    (id) => {
      if (Object.hasOwn(overrides, id)) return overrides[id];
      if (id === "server-only") return {};
      if (id.startsWith("@/") || id.startsWith(".")) {
        let path = id.startsWith("@/")
          ? resolve(root, "src", id.slice(2))
          : resolve(dirname(file), id);
        if (!existsSync(path)) path += ".ts";
        return load(path, overrides, cache);
      }
      return require(id);
    },
    loaded,
    loaded.exports,
  );
  return loaded.exports;
}
