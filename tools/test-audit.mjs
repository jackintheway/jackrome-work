/* Tests for the scoring function, run with:  node --test tools/test-audit.mjs

   Runs the real handler with the mock model, memory store, and memory
   inbox. The calibration cases come from the preparation package and
   drive the classifier level directly through the [level:N] marker, so
   this checks arithmetic, bands, templates, storage, and the request
   contract. It says nothing about how a live model would classify. */

import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createHandler, buildSummary } from "../netlify/functions/score/score.mjs";
import { createMockProviders } from "../netlify/functions/score/lib/providers.mjs";
import { createMemoryStore, createMemoryNotifier } from "../netlify/functions/score/lib/store.mjs";
import { score, bandFor, FREQUENCY, EFFORT, REPEATABILITY, SPECIFICITY, SOURCES } from "../netlify/functions/score/lib/scoring.mjs";
import { validateAnswers, SCHEMA_VERSION } from "../audit/schema.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CASES_PATH = path.resolve(HERE, "../../ai-opportunity-assessment-review/calibration-cases.json");
const ORIGIN = "http://localhost:8643";

function makeHandler(opts) {
  const store = createMemoryStore();
  const notifier = createMemoryNotifier();
  const handler = createHandler({
    providers: createMockProviders(),
    store,
    notifier,
    allowedOrigins: [ORIGIN],
    aiEnabled: !(opts && opts.aiOff),
    log: () => {},
  });
  return { handler, store, notifier };
}

function post(handler, body, headers) {
  return handler(new Request(ORIGIN + "/.netlify/functions/score", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: ORIGIN, ...(headers || {}) },
    body: typeof body === "string" ? body : JSON.stringify(body),
  }));
}

function baseAnswers(overrides) {
  return {
    org: "Example Org",
    name: "Sam Example",
    role: "Program manager",
    staff: "5_19",
    q5: "Each morning I count the names on yesterday's paper sign-in sheet and enter the attendance total in our program spreadsheet.",
    frequency: "daily",
    effort: "under_15m",
    scope_context: "main",
    people: "one",
    helpers: false,
    stall: ["chasing"],
    q10: "It waits until they are back.",
    repeatability: "same",
    q12: "Paper and Google Sheets",
    sources: "yes",
    sensitivity: "yes",
    decision: "you",
    q16: "  More time with participants.\n\nAnd less evening work.  ",
    preference: "ourselves",
    email: "sam@example.org",
    ...overrides,
  };
}

function envelope(answers, ids) {
  return {
    mode: "score",
    schema_version: SCHEMA_VERSION,
    submission_id: (ids && ids.id) || crypto.randomUUID(),
    retry_token: (ids && ids.token) || "a".repeat(32),
    answers,
    website_confirm: "",
  };
}

test("rubric arithmetic matches check_scoring.py across 5,760 combinations", () => {
  let count = 0;
  for (const level of [0, 1, 2, 3])
    for (const frequency of Object.keys(FREQUENCY))
      for (const effort of Object.keys(EFFORT))
        for (const repeatability of Object.keys(REPEATABILITY))
          for (const decision of ["you", "unknown"])
            for (const sources of Object.keys(SOURCES))
              for (const sensitivity of ["yes", "unknown"]) {
                const s = score(level, { frequency, effort, repeatability, decision, sources, sensitivity });
                assert.equal(s.total, SPECIFICITY[level] + FREQUENCY[frequency] + EFFORT[effort] + REPEATABILITY[repeatability] + (decision === "you" ? 10 : 0) + SOURCES[sources] + (sensitivity === "yes" ? 5 : 0));
                assert.ok(s.total >= 0 && s.total <= 100);
                if (level < 2 || repeatability === "different" || repeatability === "unknown") assert.notEqual(s.band, "starting_point");
                count += 1;
              }
  assert.equal(count, 5760);
  assert.equal(bandFor(39, 2, "same"), "early_conversation");
  assert.equal(bandFor(40, 2, "same"), "needs_narrowing");
  assert.equal(bandFor(69, 2, "same"), "needs_narrowing");
  assert.equal(bandFor(70, 2, "same"), "starting_point");
  assert.equal(bandFor(76, 1, "same"), "needs_narrowing");
  assert.equal(bandFor(84, 3, "different"), "needs_narrowing");
  assert.equal(bandFor(null, null, "same"), "unscored");
});

test("the 13 calibration cases score and band as expected through the real handler", async () => {
  const fixture = JSON.parse(fs.readFileSync(CASES_PATH, "utf8"));
  assert.ok(fixture.cases.length >= 12);
  const { handler } = makeHandler();
  for (const c of fixture.cases) {
    const p = c.scoring_profile;
    const answers = baseAnswers({
      q5: c.q5 + " [level:" + c.proposed_level + "]",
      frequency: p.frequency,
      effort: p.effort,
      repeatability: p.repeatability,
      decision: p.decision,
      sources: p.sources,
      sensitivity: p.sensitivity,
      scope_context: c.scope_context || "main",
    });
    const res = await post(handler, envelope(answers));
    assert.equal(res.status, 200, c.id);
    const data = await res.json();
    assert.equal(data.score, c.expected_score, c.id + " score");
    assert.equal(data.band, c.expected_band, c.id + " band");
    assert.equal(data.observations.length, 2, c.id + " observations");
    assert.ok(!("answers" in data) && !("flags" in data), c.id + " leaks nothing private");
  }
});

test("C09 and C03: what the visitor sees, what Jack receives", async () => {
  const { handler, notifier, store } = makeHandler();
  const c09 = await (await post(handler, envelope(baseAnswers({ q5: baseAnswers().q5 + " [level:3]" })))).json();
  assert.equal(c09.score, 86);
  assert.equal(c09.headline, "There's a clear starting point here.");
  assert.deepEqual(c09.observations, [
    "You said this work touches personal or confidential information.",
    "You said this task happens daily and takes under 15 minutes of your team's working time each round.",
  ]);
  assert.equal(c09.reason, null);
  const summary = notifier.inbox[0];
  assert.match(summary.flags, /Personal or confidential data mentioned/);
  assert.match(summary.flags, /Brief task per round/);
  assert.match(summary.flags, /Check whether the scope supports the paid audit/);
  assert.equal(summary.q5_task, baseAnswers().q5 + " [level:3]");
  assert.equal(summary.q16_hours, baseAnswers().q16);

  const c03 = await (await post(handler, envelope(baseAnswers({
    q5: "Our team spends too much time on fundraising and administration, and we want to make both easier. [level:1]",
    effort: "4h_plus", sensitivity: "no",
  })))).json();
  assert.equal(c03.score, 76);
  assert.equal(c03.band, "needs_narrowing");
  assert.equal(c03.headline, "A little more detail would help.");
  assert.equal(c03.reason, "The task description still needs narrowing.");
  assert.deepEqual(c03.observations, [
    "You said this task happens daily and takes 4 hours or more of your team's working time each round.",
    "You said the output has the same shape each round.",
  ]);
  const ids = await store.list();
  assert.equal(ids.length, 2);
});

test("Q16 round-trips exactly, whitespace and line breaks included", async () => {
  const { handler, store } = makeHandler();
  const q16 = "  leading\n\nblank line, apostrophe's, & ampersand, <b>markup</b>, café, \u{1F331}  ";
  const env = envelope(baseAnswers({ q16 }));
  const res = await post(handler, env);
  assert.equal(res.status, 200);
  const rec = await store.get(env.submission_id);
  assert.equal(rec.answers.q16, q16);
  assert.equal(JSON.parse(JSON.stringify(rec)).answers.q16, q16);
});

test("identical retry replays the committed result; changed payload conflicts", async () => {
  const { handler, store } = makeHandler();
  const env = envelope(baseAnswers());
  const first = await (await post(handler, env)).json();
  const again = await (await post(handler, env)).json();
  assert.equal(again.score, first.score);
  assert.equal(again.receipt, first.receipt);
  assert.equal(again.replayed, true);
  assert.equal((await store.list()).length, 1);
  const changed = { ...env, answers: baseAnswers({ org: "Different Org" }) };
  assert.equal((await post(handler, changed)).status, 409);
  const wrongToken = { ...env, retry_token: "b".repeat(32) };
  assert.equal((await post(handler, wrongToken)).status, 409);
});

test("classifier failure and AI-off both store an unscored record with the booking link", async () => {
  const { handler, store } = makeHandler();
  const env = envelope(baseAnswers({ q5: baseAnswers().q5 + " [fail]" }));
  const data = await (await post(handler, env)).json();
  assert.equal(data.status, "unscored");
  assert.equal(data.score, null);
  assert.equal(data.headline, "Your answers are saved.");
  assert.equal(data.breakdown[0].points, null);
  assert.match(data.booking_url, /^https:\/\/calendly\.com\//);
  const rec = await store.get(env.submission_id);
  assert.equal(rec.classifier.status, "failed");
  assert.equal(rec.scoring.dimensions.B, 11);
  assert.ok(rec.flags.some((f) => f.code === "classifier_failed"));

  const off = makeHandler({ aiOff: true });
  const offData = await (await post(off.handler, envelope(baseAnswers()))).json();
  assert.equal(offData.status, "unscored");
  const fu = await (await post(off.handler, { mode: "followup", q5: baseAnswers().q5, website_confirm: "" })).json();
  assert.equal(fu.type, "fallback");
});

test("follow-up returns an approved question type and fixed text", async () => {
  const { handler } = makeHandler();
  const data = await (await post(handler, { mode: "followup", q5: baseAnswers().q5 + " [followup:steps]", website_confirm: "" })).json();
  assert.equal(data.type, "steps");
  assert.equal(data.question, "What are the main steps between starting this task and finishing it?");
  const none = await (await post(handler, { mode: "followup", q5: baseAnswers().q5 + " [followup:none]", website_confirm: "" })).json();
  assert.equal(none.type, "none");
  const short = await post(handler, { mode: "followup", q5: "too short", website_confirm: "" });
  assert.equal(short.status, 400);
});

test("request contract: honeypot, method, origin, size, mode, forged fields", async () => {
  const { handler, store } = makeHandler();
  const hp = await post(handler, { ...envelope(baseAnswers()), website_confirm: "spam" });
  assert.equal(hp.status, 204);
  assert.equal((await store.list()).length, 0);

  const get = await handler(new Request(ORIGIN + "/.netlify/functions/score", { method: "GET", headers: { Origin: ORIGIN } }));
  assert.equal(get.status, 405);

  const badOrigin = await post(handler, envelope(baseAnswers()), { Origin: "https://evil.example" });
  assert.equal(badOrigin.status, 403);

  const big = await post(handler, JSON.stringify({ mode: "score", pad: "x".repeat(70 * 1024) }));
  assert.equal(big.status, 413);

  const mode = await post(handler, { mode: "nope" });
  assert.equal(mode.status, 400);

  const forged = await post(handler, envelope(baseAnswers({ score: 100 })));
  assert.equal(forged.status, 400);
  const forgedBody = await forged.json();
  assert.equal(forgedBody.error, "validation");

  const badEnum = await post(handler, envelope(baseAnswers({ frequency: "hourly" })));
  assert.equal(badEnum.status, 400);

  const exclusive = validateAnswers(baseAnswers({ stall: ["waiting", "unknown"] }));
  assert.ok(exclusive.errors.some((e) => e.field === "stall"));

  const otherMissing = validateAnswers(baseAnswers({ decision: "other" }));
  assert.ok(otherMissing.errors.some((e) => e.field === "decision_other"));

  const site = validateAnswers(baseAnswers({ website: "example.org" }));
  assert.equal(site.errors.length, 0);
  assert.equal(site.normalized.website, "https://example.org/");
  const badSite = validateAnswers(baseAnswers({ website: "ftp://example.org" }));
  assert.ok(badSite.errors.some((e) => e.field === "website"));
});

test("changing unscored fields never changes points", async () => {
  const { handler } = makeHandler();
  const a = await (await post(handler, envelope(baseAnswers()))).json();
  const b = await (await post(handler, envelope(baseAnswers({
    org: "Other", name: "Other Person", staff: "over_50", scope_context: "several", people: "6_plus", helpers: true,
    stall: ["waiting", "cleanup"], q10: "Different", q12: "A much longer list of tools ".repeat(10), q13: "We tried it",
    q16: "Different", preference: "someone_else", email: "other@example.org",
  })))).json();
  assert.equal(a.score, b.score);
  assert.equal(a.band, b.band);
  assert.deepEqual(a.breakdown, b.breakdown);
});

test("summary carries verbatim answers below the scannable fields", () => {
  const record = {
    submission_id: "id", receipt: "R", received_at: "t", answers: baseAnswers(), scoring: score(3, validateAnswers(baseAnswers()).normalized),
    classifier: { status: "ok", level: 3 }, flags: [], followup: null,
  };
  const s = buildSummary(record);
  const keys = Object.keys(s);
  assert.ok(keys.indexOf("score") < keys.indexOf("q5_task"));
  assert.equal(s.q16_hours, baseAnswers().q16);
});

/* ---------- storage and notification pieces ---------- */

import { createBlobsStore, createFormsNotifier, signSummary, verifySummary, storeNameFor, SIGNED_FIELDS } from "../netlify/functions/score/lib/store.mjs";

// A fake @netlify/blobs client with the same surface the store uses.
function fakeBlobsClient(opts) {
  const data = new Map();
  const o = opts || {};
  return {
    data,
    async setJSON(key, value, options) {
      if (o.lie) return { modified: true, etag: "x" }; // issue 741 behaviour
      if (options && options.onlyIfNew && data.has(key)) return { modified: false };
      data.set(key, JSON.stringify(value));
      return { modified: true, etag: "e" + data.size };
    },
    async get(key, options) {
      const v = data.get(key);
      if (v === undefined) return null;
      return options && options.type === "json" ? JSON.parse(v) : v;
    },
    async *list(options) {
      const prefix = (options && options.prefix) || "";
      yield { blobs: [...data.keys()].filter((k) => k.startsWith(prefix)).map((key) => ({ key, etag: "e" })) };
    },
  };
}

test("blobs store: create once, second create returns the winner, status is a side record", async () => {
  const client = fakeBlobsClient();
  const store = createBlobsStore({ CONTEXT: "production" }, client);
  assert.equal(store.storeName, "audit-submissions-production");
  assert.equal(storeNameFor({ CONTEXT: "deploy-preview" }), "audit-submissions-preview");
  assert.equal(storeNameFor({}, "production"), "audit-submissions-production", "build stamp decides");
  assert.equal(storeNameFor({}, "deploy-preview"), "audit-submissions-preview");
  assert.equal(storeNameFor({}, "dev"), "audit-submissions-preview", "local default never touches production");
  assert.equal(storeNameFor({ AUDIT_CONTEXT: "production" }, "dev"), "audit-submissions-production", "operator override");
  const rec = { submission_id: "id-1", answers: { q16: "  keep\n\nthis  " }, summary_status: "pending", processing_status: "committed" };
  const first = await store.createIfAbsent("id-1", rec);
  assert.equal(first.created, true);
  const second = await store.createIfAbsent("id-1", { ...rec, answers: { q16: "other" } });
  assert.equal(second.created, false);
  assert.equal(second.record.answers.q16, "  keep\n\nthis  ");
  await store.setSummaryStatus("id-1", "acknowledged");
  const read = await store.get("id-1");
  assert.equal(read.summary_status, "acknowledged");
  assert.equal(JSON.parse(client.data.get("records/id-1")).summary_status, "pending", "the immutable record is untouched");
  assert.deepEqual(await store.list(), ["id-1"]);
});

test("blobs store: a write that claims success but cannot be read back is an error, never a saved confirmation", async () => {
  const store = createBlobsStore({ CONTEXT: "production" }, fakeBlobsClient({ lie: true }));
  await assert.rejects(() => store.createIfAbsent("id-2", { submission_id: "id-2" }), /read back/);
  const { handler, store: memory } = makeHandler();
  void memory;
  const lying = createHandler({ providers: createMockProviders(), store, notifier: createMemoryNotifier(), allowedOrigins: [ORIGIN], aiEnabled: true, log: () => {} });
  const res = await post(lying, envelope(baseAnswers()));
  assert.equal(res.status, 503);
  const body = await res.json();
  assert.equal(body.retryable, true);
  void handler;
});

test("summary signature: round trip, tamper detection, key versions", () => {
  const fields = { submission_id: "id", receipt: "R", received_at: "t", organization: "Org & Co \"quoted\"", name: "Sam", role: "Mgr", email: "s@e.org", score: "86", band: "starting_point", dimensions: "A=35 B=11 C=20 D=10 E=10", classifier: "ok level 3", flags: "a | b" };
  const sig = signSummary(fields, "secret-1");
  assert.equal(verifySummary({ ...fields, signature: sig, signature_key_version: "1" }, { 1: "secret-1" }).ok, true);
  assert.equal(verifySummary({ ...fields, score: "100", signature: sig, signature_key_version: "1" }, { 1: "secret-1" }).ok, false);
  assert.equal(verifySummary({ ...fields, signature: sig, signature_key_version: "2" }, { 1: "secret-1" }).reason, "unknown_key_version");
  assert.equal(verifySummary({ ...fields, signature: sig, signature_key_version: "1", q5_task: "changed verbatim layer" }, { 1: "secret-1" }).ok, true, "verbatim layer is not signed");
  assert.ok(SIGNED_FIELDS.includes("flags") && !SIGNED_FIELDS.includes("q5_task"));
});

test("forms notifier: posts url-encoded to the fixed origin with form-name and signature; failures map to statuses", async () => {
  const calls = [];
  const fakeFetch = async (url, init) => { calls.push({ url, init }); return { status: 200 }; };
  const notifier = createFormsNotifier({ AUDIT_FORMS_ORIGIN: "https://jackrome.work", AUDIT_SUMMARY_KEY: "k", AUDIT_SUMMARY_KEY_VERSION: "1" }, fakeFetch);
  const status = await notifier.send({ submission_id: "id", receipt: "R", received_at: "t", organization: "O", name: "N", role: "r", email: "e", score: "1", band: "b", dimensions: "d", classifier: "c", flags: "f", q16_hours: "  x\n\ny  " });
  assert.equal(status, "acknowledged");
  assert.equal(calls[0].url, "https://jackrome.work/audit/");
  assert.equal(calls[0].init.headers["Content-Type"], "application/x-www-form-urlencoded");
  const params = new URLSearchParams(calls[0].init.body);
  assert.equal(params.get("form-name"), "workflow-audit-summary");
  assert.equal(params.get("q16_hours"), "  x\n\ny  ");
  assert.equal(params.get("signature_key_version"), "1");
  assert.match(params.get("signature"), /^[0-9a-f]{64}$/);
  const failing = createFormsNotifier({ AUDIT_FORMS_ORIGIN: "https://jackrome.work", AUDIT_SUMMARY_KEY: "k" }, async () => ({ status: 500 }));
  assert.equal(await failing.send({}), "failed");
  const down = createFormsNotifier({ AUDIT_FORMS_ORIGIN: "https://jackrome.work", AUDIT_SUMMARY_KEY: "k" }, async () => { throw new Error("net"); });
  assert.equal(await down.send({}), "unknown");
  assert.throws(() => createFormsNotifier({}, fakeFetch), /AUDIT_FORMS_ORIGIN/);
});

test("the registered form in audit/index.html has every summary field", () => {
  const html = fs.readFileSync(path.resolve(HERE, "../audit/index.html"), "utf8");
  const formHtml = html.slice(html.indexOf('name="workflow-audit-summary"'));
  const summary = buildSummary({ submission_id: "id", receipt: "R", received_at: "t", answers: baseAnswers(), scoring: score(3, validateAnswers(baseAnswers()).normalized), classifier: { status: "ok", level: 3 }, flags: [], followup: null });
  for (const key of [...Object.keys(summary), "signature", "signature_key_version"]) {
    assert.ok(formHtml.includes('name="' + key + '"'), "form is missing " + key);
  }
});
