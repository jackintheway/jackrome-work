/* Durable storage and the summary notifier, behind small interfaces.

   store.createIfAbsent(id, record)  atomic create; returns { created, record }
   store.get(id)                     the committed record or null
   store.setSummaryStatus(id, s)     side record; never touches the answers
   store.list()                      ids, operator tooling only

   notifier.send(fields)             "acknowledged" | "failed" | "unknown"

   memory   local preview and tests. Lives for one process.
   blobs    Netlify Blobs, site-wide store, strong consistency, one
            store per deploy context so a preview never writes into
            production. The record is written once with onlyIfNew and
            read back before anyone is told it was saved.
   forms    URL-encoded POST to the site's own Forms handler with an
            HMAC over the summary fields, so an export can tell a real
            summary from a forged one. */

import { createHmac } from "node:crypto";
import { getStore } from "@netlify/blobs";

/* ---------------- memory ---------------- */

export function createMemoryStore() {
  const records = new Map();
  const statuses = new Map();
  return {
    name: "memory",
    async createIfAbsent(id, record) {
      if (records.has(id)) return { created: false, record: records.get(id) };
      const frozen = JSON.parse(JSON.stringify(record));
      records.set(id, frozen);
      return { created: true, record: frozen };
    },
    async get(id) {
      const r = records.get(id);
      if (!r) return null;
      const copy = JSON.parse(JSON.stringify(r));
      if (statuses.has(id)) copy.summary_status = statuses.get(id);
      return copy;
    },
    async setSummaryStatus(id, status) {
      statuses.set(id, status);
    },
    async list() {
      return [...records.keys()];
    },
  };
}

export function createMemoryNotifier() {
  const inbox = [];
  return {
    name: "memory",
    inbox,
    async send(fields) {
      if (fields && fields.summary_force_status) return fields.summary_force_status;
      inbox.push(JSON.parse(JSON.stringify(fields)));
      return "acknowledged";
    },
  };
}

/* ---------------- blobs ---------------- */

export function storeNameFor(env) {
  // Netlify sets CONTEXT to production, deploy-preview, branch-deploy, or dev.
  const context = (env.CONTEXT || env.AUDIT_CONTEXT || "dev").toLowerCase();
  return "audit-submissions-" + (context === "production" ? "production" : "preview");
}

/* `client` is injectable for tests; it must expose setJSON, get, list.
   Real use: getStore from @netlify/blobs, which reads site and token
   from the function runtime, or from siteID/token for operator tools. */
export function createBlobsStore(env, client) {
  const name = storeNameFor(env);
  const store = client || getStore({
    name,
    consistency: "strong",
    ...(env.NETLIFY_SITE_ID ? { siteID: env.NETLIFY_SITE_ID } : {}),
    ...(env.NETLIFY_AUTH_TOKEN ? { token: env.NETLIFY_AUTH_TOKEN } : {}),
  });
  const recordKey = (id) => "records/" + id;
  const statusKey = (id) => "status/" + id;

  async function readRecord(id) {
    const record = await store.get(recordKey(id), { type: "json", consistency: "strong" });
    if (!record) return null;
    const status = await store.get(statusKey(id), { type: "json", consistency: "strong" });
    if (status && status.summary_status) record.summary_status = status.summary_status;
    return record;
  }

  return {
    name: "blobs",
    storeName: name,
    async createIfAbsent(id, record) {
      const result = await store.setJSON(recordKey(id), record, { onlyIfNew: true });
      // Netlify issue 741 reported false success from some SDK versions.
      // The handler reads back regardless; here we also refuse to trust
      // a missing `modified` field.
      if (!result || typeof result.modified !== "boolean") throw new Error("Blobs did not report a write outcome");
      if (!result.modified) {
        const existing = await readRecord(id);
        if (!existing) throw new Error("Blobs reported an existing record that could not be read");
        return { created: false, record: existing };
      }
      const written = await readRecord(id);
      if (!written) throw new Error("Blobs write could not be read back");
      return { created: true, record: written };
    },
    async get(id) {
      return readRecord(id);
    },
    async setSummaryStatus(id, summary_status) {
      await store.setJSON(statusKey(id), { summary_status, updated_at: new Date().toISOString() });
    },
    async list() {
      const ids = [];
      for await (const page of store.list({ prefix: "records/", paginate: true })) {
        for (const blob of page.blobs) ids.push(blob.key.slice("records/".length));
      }
      return ids;
    },
  };
}

/* ---------------- forms ---------------- */

export const FORM_NAME = "workflow-audit-summary";

// The scannable layer, the part the signature covers. The verbatim
// answers below it are a reading copy and are not signed; the Blobs
// record is the authority for them.
export const SIGNED_FIELDS = ["submission_id", "receipt", "received_at", "organization", "name", "role", "email", "score", "band", "dimensions", "classifier", "flags"];

export function canonicalSummary(fields) {
  // Percent-encoding survives Forms normalization of whitespace and
  // quotes; sorted keys make the string independent of object order.
  return SIGNED_FIELDS.map((k) => k + "=" + encodeURIComponent(String(fields[k] === undefined || fields[k] === null ? "" : fields[k]))).join("\n");
}

export function signSummary(fields, key) {
  return createHmac("sha256", key).update(canonicalSummary(fields), "utf8").digest("hex");
}

export function verifySummary(fields, keysByVersion) {
  const version = String(fields.signature_key_version || "");
  const key = keysByVersion[version];
  if (!key) return { ok: false, reason: "unknown_key_version" };
  const expected = signSummary(fields, key);
  const given = String(fields.signature || "");
  if (given.length !== expected.length) return { ok: false, reason: "bad_signature" };
  let diff = 0;
  for (let i = 0; i < expected.length; i += 1) diff |= expected.charCodeAt(i) ^ given.charCodeAt(i);
  return diff === 0 ? { ok: true } : { ok: false, reason: "bad_signature" };
}

export function createFormsNotifier(env, fetchImpl) {
  const origin = env.AUDIT_FORMS_ORIGIN;
  const key = env.AUDIT_SUMMARY_KEY;
  const keyVersion = env.AUDIT_SUMMARY_KEY_VERSION || "1";
  if (!origin || !key) throw new Error("AUDIT_FORMS_ORIGIN and AUDIT_SUMMARY_KEY must be set for the forms notifier.");
  const doFetch = fetchImpl || fetch;
  return {
    name: "forms",
    async send(fields) {
      const body = new URLSearchParams();
      body.set("form-name", FORM_NAME);
      for (const [k, v] of Object.entries(fields)) body.set(k, v === undefined || v === null ? "" : String(v));
      body.set("signature_key_version", keyVersion);
      body.set("signature", signSummary(fields, key));
      let res;
      try {
        res = await doFetch(origin + "/audit/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: body.toString(),
          redirect: "manual",
        });
      } catch (_) {
        return "unknown";
      }
      // Netlify answers a successful form POST with a 200 or a redirect.
      if (res.status >= 200 && res.status < 400) return "acknowledged";
      return "failed";
    },
  };
}

/* ---------------- factories ---------------- */

export function createStore(env) {
  const which = (env.AUDIT_STORE || "").toLowerCase();
  if (which === "memory") return createMemoryStore();
  if (which === "blobs") return createBlobsStore(env);
  throw new Error("Set AUDIT_STORE to memory or blobs.");
}

export function createNotifier(env) {
  const which = (env.AUDIT_NOTIFIER || "").toLowerCase();
  if (which === "memory") return createMemoryNotifier();
  if (which === "forms") return createFormsNotifier(env);
  throw new Error("Set AUDIT_NOTIFIER to memory or forms.");
}
