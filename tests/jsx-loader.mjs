import { readFile } from "node:fs/promises";
import { transformWithOxc } from "vite";

export async function load(url, context, nextLoad) {
  if (!url.endsWith(".jsx")) return nextLoad(url, context);

  const source = await readFile(new URL(url), "utf8");
  const transformed = await transformWithOxc(source, url, { lang: "jsx" });
  return { format: "module", shortCircuit: true, source: transformed.code };
}
