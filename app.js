// app.js — the Express app behind server.js. Serves the Vite build from dist/
// and the API routes the site and /review pages use, mirroring vercel.json.
// Kept free of top-level await: Hostinger's LiteSpeed loader require()s the
// entry file, and require() cannot load an ESM graph with top-level await.
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import claude from "./api/claude.js";
import scheduleReviewData from "./api/schedule-review-data.js";
import scheduleReviewPublish from "./api/schedule-review-publish.js";
import weeklyReviewData from "./api/weekly-review-data.js";
import weeklyReviewPublish from "./api/weekly-review-publish.js";
import gihubAuth from "./api/gihub-auth.js";

const root = path.dirname(fileURLToPath(import.meta.url));
export const distDir = path.join(root, "dist");

export const apiHandlers = {
  "claude": claude,
  "gihub-auth": gihubAuth,
  "schedule-review-data": scheduleReviewData,
  "schedule-review-publish": scheduleReviewPublish,
  "weekly-review-data": weeklyReviewData,
  "weekly-review-publish": weeklyReviewPublish,
};

export function createApp(handlers = apiHandlers, { gihubAuthHandler = gihubAuth } = {}) {
  const app = express();
  app.disable("x-powered-by");
  app.use("/api/gihub-auth", (req, res, next) => {
    res.set("Cache-Control", "no-store");
    next();
  });
  app.all(["/api/gihub-auth", "/api/gihub-auth/:action"], express.json({ limit: "8kb" }), async (req, res, next) => {
    try { await gihubAuthHandler(req, res); } catch (error) { next(error); }
  });
  // Vercel accepts request bodies up to 4.5 MB; keep the same ceiling for legacy APIs.
  app.use(express.json({ limit: "4.5mb" }));

  for (const [name, handler] of Object.entries(handlers)) {
    if (name === "gihub-auth") continue;
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
    if (req.path.startsWith("/api/gihub-auth")) {
      if (res.headersSent) return next(error);
      res.set("Cache-Control", "no-store");
      const status = error?.type === "entity.too.large" ? 413 : (error instanceof SyntaxError ? 400 : 500);
      if (status === 500) console.error(`${req.method} ${req.path} auth request failed`);
      return res.status(status).json({ error: status === 500 ? "Authentication is unavailable" : "Invalid request" });
    }
    console.error(`${req.method} ${req.path} failed:`, error);
    if (res.headersSent) return next(error);
    res.status(500).json({ error: "Internal server error" });
  });
  return app;
}
