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

const root = path.dirname(fileURLToPath(import.meta.url));
export const distDir = path.join(root, "dist");

export const apiHandlers = {
  "claude": claude,
  "schedule-review-data": scheduleReviewData,
  "schedule-review-publish": scheduleReviewPublish,
  "weekly-review-data": weeklyReviewData,
  "weekly-review-publish": weeklyReviewPublish,
};

export function createApp(handlers = apiHandlers) {
  const app = express();
  app.disable("x-powered-by");
  // Vercel accepts request bodies up to 4.5 MB; keep the same ceiling.
  app.use(express.json({ limit: "4.5mb" }));

  for (const [name, handler] of Object.entries(handlers)) {
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
