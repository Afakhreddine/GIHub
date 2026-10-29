// server.js — Node host entry point (Hostinger). Serves the Vite build from
// dist/ and mounts every api/*.js default-export handler at /api/<name>,
// mirroring what Vercel does from vercel.json.
import express from "express";
import { readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const apiDir = path.join(root, "api");
const distDir = path.join(root, "dist");

export async function loadApiHandlers(dir = apiDir) {
  const handlers = {};
  for (const file of (await readdir(dir)).sort()) {
    if (!file.endsWith(".js") || file.startsWith("_")) continue;
    const mod = await import(pathToFileURL(path.join(dir, file)).href);
    // Helper modules (cron-shared, guidelines-identity) have no default handler.
    // cron-shared.js stays because Hermes uses its weekly fetch prompt.
    if (typeof mod.default === "function") handlers[file.slice(0, -3)] = mod.default;
  }
  return handlers;
}

export async function createApp() {
  const app = express();
  app.disable("x-powered-by");
  // Vercel accepts request bodies up to 4.5 MB; keep the same ceiling.
  app.use(express.json({ limit: "4.5mb" }));

  for (const [name, handler] of Object.entries(await loadApiHandlers())) {
    app.all(`/api/${name}`, async (req, res, next) => {
      try { await handler(req, res); } catch (error) { next(error); }
    });
  }
  app.use("/api", (req, res) => res.status(404).json({ error: "Not found" }));

  app.use(express.static(distDir, { index: false }));
  // SPA fallback, same as the "/(.*)" -> "/index.html" rewrite in vercel.json.
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    res.sendFile(path.join(distDir, "index.html"));
  });

  app.use((error, req, res, next) => {
    console.error(`${req.method} ${req.path} failed:`, error);
    if (res.headersSent) return next(error);
    res.status(500).json({ error: "Internal server error" });
  });
  return app;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (!existsSync(path.join(distDir, "index.html"))) {
    console.warn("dist/index.html not found; run `npm run build` first.");
  }
  const port = Number(process.env.PORT) || 3000;
  const app = await createApp();
  app.listen(port, () => console.log(`GIHub listening on port ${port}`));
}
