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
// Answer only requests addressed to this machine by a loopback name. A
// page on another site can repoint its own hostname at 127.0.0.1 (DNS
// rebinding) and read our responses as if same origin, but its requests
// still carry its hostname in the Host header, so they stop here.
const ALLOWED_HOSTS = new Set(["localhost:" + PORT, "127.0.0.1:" + PORT, "[::1]:" + PORT]);
// Folders that are gitignored because they are private, never published:
// source archives, unreviewed exhibits, real-account output, secrets, scan
// reports, and Git's own store. Everything else under the repo is served,
// including the _verify-harness.html style pages sessions write.
const PRIVATE = /^(\.git|\.env(\..*)?|_source|_exhibits|_private|claude-security-.*)$/i;

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
  if (full !== ROOT && !full.startsWith(ROOT + path.sep)) return null;
  if (path.relative(ROOT, full).split(path.sep).some((s) => PRIVATE.test(s))) return null;
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
  if (!ALLOWED_HOSTS.has(String(req.headers.host || "").toLowerCase())) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
    return res.end("Host not allowed. Open " + ORIGIN + "/audit/\n");
  }
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
    const type = TYPES[path.extname(file).toLowerCase()] || "application/octet-stream";
    // Browsers seek in audio by asking for a byte range. Netlify answers
    // those; without this, the case study recordings could not scrub here.
    const size = fs.statSync(file).size;
    const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || "");
    if (range && (range[1] || range[2])) {
      const start = range[1] ? +range[1] : Math.max(0, size - +range[2]);
      const end = range[1] && range[2] ? Math.min(+range[2], size - 1) : size - 1;
      // Refuse a range the file cannot satisfy before any headers go out:
      // createReadStream throws on it, and the catch below cannot answer
      // once a 206 has been sent, which used to take the server down.
      if (!(Number.isSafeInteger(start) && Number.isSafeInteger(end) && start <= end && end < size)) {
        res.writeHead(416, { "Cache-Control": "no-store", "Accept-Ranges": "bytes", "Content-Range": `bytes */${size}` });
        return res.end();
      }
      res.writeHead(206, { "Content-Type": type, "Cache-Control": "no-store", "Accept-Ranges": "bytes",
        "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": end - start + 1 });
      return fs.createReadStream(file, { start, end }).pipe(res);
    }
    res.writeHead(200, { "Content-Type": type, "Cache-Control": "no-store", "Accept-Ranges": "bytes", "Content-Length": size });
    fs.createReadStream(file).pipe(res);
  } catch (err) {
    console.error(err);
    sendJson(res, 500, { error: "dev_server_error", message: String(err && err.message) });
  }
});

// Loopback only, so other devices on the same network cannot reach it.
server.listen(PORT, "127.0.0.1", () => {
  console.log("audit preview at " + ORIGIN + "/audit/  (mock model, memory store)");
});
