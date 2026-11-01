// server.js — Node host entry point (Hostinger). Hostinger loads this file
// through LiteSpeed's lsnode.js rather than `node server.js`, so it must start
// listening unconditionally and must not use top-level await.
import { existsSync } from "node:fs";
import path from "node:path";
import { createApp, distDir } from "./app.js";

if (!existsSync(path.join(distDir, "index.html"))) {
  console.warn("dist/index.html not found; run `npm run build` first.");
}

const port = Number(process.env.PORT) || 3000;
createApp().listen(port, () => console.log(`GIHub listening on port ${port}`));
