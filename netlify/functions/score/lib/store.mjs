/* Durable storage and the summary notifier, behind small interfaces.

   store.createIfAbsent(id, record)  atomic create; returns { created, record }
   store.get(id)                     the committed record or null
   store.list()                      ids, operator tooling only

   notifier.send(fields)             "acknowledged" | "failed" | "unknown"

   memory   local preview and tests. Lives for the dev server process.
   blobs    Netlify Blobs plus a Forms POST. Not built yet; throws so a
            missing configuration is loud rather than a false "saved". */

export function createMemoryStore() {
  const records = new Map();
  return {
    name: "memory",
    async createIfAbsent(id, record) {
      if (records.has(id)) return { created: false, record: records.get(id) };
      // Deep copy so later mutation cannot change what was "written".
      const frozen = JSON.parse(JSON.stringify(record));
      records.set(id, frozen);
      return { created: true, record: frozen };
    },
    async get(id) {
      const r = records.get(id);
      return r ? JSON.parse(JSON.stringify(r)) : null;
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

function notBuilt(what) {
  return () => {
    throw new Error(what + " is not built yet. Use AUDIT_STORE=memory for local preview.");
  };
}

export function createStore(env) {
  const which = (env.AUDIT_STORE || "").toLowerCase();
  if (which === "memory") return createMemoryStore();
  if (which === "blobs") return { name: "blobs", createIfAbsent: notBuilt("Blobs store"), get: notBuilt("Blobs store"), list: notBuilt("Blobs store") };
  throw new Error("Set AUDIT_STORE to memory or blobs.");
}

export function createNotifier(env) {
  const which = (env.AUDIT_NOTIFIER || "").toLowerCase();
  if (which === "memory") return createMemoryNotifier();
  if (which === "forms") return { name: "forms", send: notBuilt("Forms notifier") };
  throw new Error("Set AUDIT_NOTIFIER to memory or forms.");
}
