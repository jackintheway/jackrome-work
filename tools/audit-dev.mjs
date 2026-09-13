#!/usr/bin/env node
/* Local preview server for the Workflow Audit Readiness Assessment.

   Serves the repo root as static files, like the python server, and
   mounts the real scoring function at /.netlify/functions/score with a
   mock model, an in-memory store, and an in-memory inbox. Nothing here
   touches Netlify, Anthropic, or any account.

   Run:   node tools/audit-dev.mjs          (port 8642)
   Open:  http://localhost:8642/audit/

   Preview aids, this server only:
     GET /__dev/inbox     every summary the function "sent" to Jack
     GET /__dev/records   every stored record, full, as JSON
     GET /__dev/reset     clear both

   Markers you can type into the task description to steer the mock:
     [level:0] .. [level:3]   force the classifier level
     [followup:steps]         force a follow-up type (inputs, outputs,
                              steps, handoff, none)
     [fail]                   classifier failure, the unscored path
     [slow]                   exceed the model deadline
   Set AI_ENABLED=false to preview the AI-off mode. */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHandler } from "../netlify/functions/score/score.mjs";
import { createMockProviders } from "../netlify/functions/score/lib/providers.mjs";
import { createMemoryStore, createMemoryNotifier } from "../netlify/functions/score/lib/store.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PORT = Number(process.env.PORT || 8642);
const ORIGIN = "http://localhost:" + PORT;

const store = createMemoryStore();
const notifier = createMemoryNotifier();
const handler = createHandler({
  providers: createMockProviders(),
  store,
  notifier,
  allowedOrigins: [ORIGIN, "http://127.0.0.1:" + PORT],
  aiEnabled: (process.env.AI_ENABLED || "true").toLowerCase() !== "false",
  log: (fields) => console.log(JSON.stringify(fields)),
});

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
  res.end(JSON.stringify(body, null, 2));
}

function resolveStatic(urlPath) {
  let p = decodeURIComponent(urlPath.split("?")[0]);
  if (p.endsWith("/")) p += "index.html";
  const full = path.join(ROOT, p);
  if (!full.startsWith(ROOT)) return null;
  if (fs.existsSync(full) && fs.statSync(full).isFile()) return full;
  if (!path.extname(full) && fs.existsSync(full + ".html")) return full + ".html";
  return null;
}

async function toRequest(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const body = Buffer.concat(chunks);
  return new Request(ORIGIN + req.url, {
    method: req.method,
    headers: req.headers,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : body,
  });
}

async function fromResponse(response, res) {
  const headers = {};
  response.headers.forEach((v, k) => { headers[k] = v; });
  const text = await response.text();
  res.writeHead(response.status, headers);
  res.end(text);
}

const server = http.createServer(async (req, res) => {
  const url = req.url || "/";
  try {
    if (url.startsWith("/.netlify/functions/score")) {
      return await fromResponse(await handler(await toRequest(req)), res);
    }
    if (url.startsWith("/__dev/inbox")) return sendJson(res, 200, notifier.inbox);
    if (url.startsWith("/__dev/records")) {
      const ids = await store.list();
      const all = [];
      for (const id of ids) all.push(await store.get(id));
      return sendJson(res, 200, all);
    }
    if (url.startsWith("/__dev/reset")) {
      notifier.inbox.length = 0;
      for (const id of await store.list()) store.__delete && store.__delete(id);
      return sendJson(res, 200, { ok: true, note: "inbox cleared; records persist until restart" });
    }
    const file = resolveStatic(url);
    if (!file) {
      const notFound = path.join(ROOT, "404.html");
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(fs.readFileSync(notFound));
    }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
    fs.createReadStream(file).pipe(res);
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { error: "dev_server_error", message: String(err && err.message) });
  }
});

server.listen(PORT, () => {
  console.log("audit preview at " + ORIGIN + "/audit/  (mock model, memory store)");
});
