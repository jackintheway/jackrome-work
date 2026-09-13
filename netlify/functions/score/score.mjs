/* The one serverless function behind the Workflow Audit Readiness
   Assessment. Two modes on POST /.netlify/functions/score:

     followup   Q5 only. Picks one approved follow-up question type.
     score      the full answer snapshot. Validates, classifies within a
                deadline, scores deterministically, stores one immutable
                record, posts a summary for Jack, returns the public
                result. Never returns raw answers or flags.

   Everything here is built from injectable pieces (createHandler) so
   the local dev server and the tests can run the same code with a mock
   model, an in-memory store, and an in-memory inbox. The default
   export wires the real pieces from the environment.

   Spec: ../../../../ai-opportunity-assessment-review/BUILD-SPEC.md,
   sections 4, 5, 7, 8, 9. This file follows section 7's sequence. */

import { createHash, randomUUID } from "node:crypto";
import { SCHEMA_VERSION, validateAnswers, LIMITS } from "../../../audit/schema.mjs";
import { score, flags, RUBRIC_VERSION } from "./lib/scoring.mjs";
import { assembleResult, FOLLOWUP_QUESTIONS, TEMPLATE_VERSION } from "./lib/copy.mjs";
import { createProviders, ProviderError, PROMPT_VERSION } from "./lib/providers.mjs";
import { createStore, createNotifier } from "./lib/store.mjs";

const BODY_LIMIT = 64 * 1024;
const PRIVACY_NOTICE_VERSION = "draft-2026-09-13";
const DEADLINES = { followup: 2500, classify: 5000, summary: 2000 };

const NO_STORE = { "Cache-Control": "no-store", "Content-Type": "application/json; charset=utf-8" };

function json(status, body, extra) {
  return new Response(JSON.stringify(body), { status, headers: { ...NO_STORE, ...(extra || {}) } });
}

function sha256(text) {
  return createHash("sha256").update(text, "utf8").digest("hex");
}

function stableStringify(value) {
  if (Array.isArray(value)) return "[" + value.map(stableStringify).join(",") + "]";
  if (value && typeof value === "object") {
    return "{" + Object.keys(value).sort().map((k) => JSON.stringify(k) + ":" + stableStringify(value[k])).join(",") + "}";
  }
  return JSON.stringify(value);
}

function withDeadline(promise, ms, code) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new ProviderError(code || "timeout", "Deadline exceeded")), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

async function readJsonBody(req) {
  const reader = req.body && req.body.getReader ? req.body.getReader() : null;
  if (!reader) return { error: "empty" };
  const chunks = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > BODY_LIMIT) {
      try { await reader.cancel(); } catch (_) { /* ignore */ }
      return { error: "too_large" };
    }
    chunks.push(value);
  }
  const text = Buffer.concat(chunks).toString("utf8");
  try {
    return { value: JSON.parse(text) };
  } catch (_) {
    return { error: "invalid_json" };
  }
}

function originAllowed(req, allowed) {
  const origin = req.headers.get("origin");
  if (!origin) return allowed.length === 0 ? true : false;
  return allowed.includes(origin);
}

function isHex(s, minChars) {
  return typeof s === "string" && s.length >= minChars && /^[0-9a-f]+$/i.test(s);
}

function isUuid(s) {
  return typeof s === "string" && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

export function createHandler(deps) {
  const { providers, store, notifier, allowedOrigins, aiEnabled, log } = deps;
  const info = log || (() => {});

  async function handleFollowup(body, requestId) {
    if (typeof body.q5 !== "string" || body.q5.trim().length < LIMITS.q5.min || body.q5.length > LIMITS.q5.max) {
      return json(400, { error: "invalid_q5", request_id: requestId });
    }
    if (!aiEnabled) return json(200, { type: "fallback", question: FOLLOWUP_QUESTIONS.fallback, request_id: requestId });
    try {
      const result = await withDeadline(providers.followup(body.q5), DEADLINES.followup);
      if (!result || !["inputs", "outputs", "steps", "handoff", "none"].includes(result.type)) throw new ProviderError("invalid_output");
      if (result.type === "none") return json(200, { type: "none", question: null, request_id: requestId });
      return json(200, { type: result.type, question: FOLLOWUP_QUESTIONS[result.type], request_id: requestId });
    } catch (err) {
      info({ request_id: requestId, mode: "followup", outcome: "fallback", code: err.code || "error" });
      return json(200, { type: "fallback", question: FOLLOWUP_QUESTIONS.fallback, request_id: requestId });
    }
  }

  async function handleScore(body, requestId) {
    const { schema_version, submission_id, retry_token, answers } = body;
    if (schema_version !== SCHEMA_VERSION) return json(400, { error: "unsupported_schema", request_id: requestId });
    if (!isUuid(submission_id)) return json(400, { error: "invalid_submission_id", request_id: requestId });
    if (!isHex(retry_token, 32)) return json(400, { error: "invalid_retry_token", request_id: requestId });

    const { errors, normalized } = validateAnswers(answers);
    if (errors.length) return json(400, { error: "validation", errors, request_id: requestId });

    const answerHash = sha256(stableStringify(answers));
    const tokenHash = sha256(retry_token);

    // Step 2: an identical retry returns the committed outcome.
    const existing = await store.get(submission_id);
    if (existing) {
      if (existing.answer_hash === answerHash && existing.retry_token_hash === tokenHash) {
        return json(200, { ...existing.public_result, receipt: existing.receipt, request_id: requestId, replayed: true });
      }
      return json(409, { error: "conflict", request_id: requestId });
    }

    // Step 3: classify within the deadline.
    let level = null;
    let excerpt = null;
    let classifierStatus = "ok";
    let failureCode = null;
    let model = null;
    const followupQuestion = answers.followup ? FOLLOWUP_QUESTIONS[answers.followup.type] : null;
    const followupAnswer = answers.followup ? answers.followup.answer : null;
    if (!aiEnabled) {
      classifierStatus = "disabled";
      failureCode = "ai_disabled";
    } else {
      try {
        const out = await withDeadline(providers.classify(answers.q5, followupQuestion, followupAnswer), DEADLINES.classify);
        const ok = out && Number.isInteger(out.level) && out.level >= 0 && out.level <= 3 && typeof out.excerpt === "string";
        const evidenceOk = ok && (out.level === 0 ? out.excerpt === "" : out.excerpt.length > 0 && (answers.q5.includes(out.excerpt) || (followupAnswer || "").includes(out.excerpt)));
        if (!ok || !evidenceOk) throw new ProviderError(ok ? "evidence_mismatch" : "invalid_output");
        level = out.level;
        excerpt = out.excerpt;
        model = out.model || providers.name;
      } catch (err) {
        classifierStatus = "failed";
        failureCode = err.code || "error";
      }
    }

    const scoring = score(classifierStatus === "ok" ? level : null, normalized);
    const publicResult = assembleResult(scoring, normalized);
    const receipt = submission_id.slice(0, 8).toUpperCase();
    const now = new Date().toISOString();

    const record = {
      schema_version: SCHEMA_VERSION,
      rubric_version: RUBRIC_VERSION,
      template_version: TEMPLATE_VERSION,
      prompt_version: PROMPT_VERSION,
      privacy_notice_version: PRIVACY_NOTICE_VERSION,
      submission_id,
      receipt,
      received_at: now,
      retry_token_hash: tokenHash,
      answer_hash: answerHash,
      answers, // original strings, untouched, including Q16 whitespace
      normalized,
      followup: answers.followup ? { ...answers.followup, question: followupQuestion } : null,
      classifier: { status: classifierStatus, level: classifierStatus === "ok" ? level : null, excerpt, model, failure_code: failureCode },
      scoring,
      public_result: publicResult,
      flags: flags(normalized, level, classifierStatus, null),
      summary_status: "pending",
      processing_status: "committed",
    };

    // Step 4 and 5: atomic create, then read back and verify.
    let created;
    try {
      created = await store.createIfAbsent(submission_id, record);
    } catch (err) {
      info({ request_id: requestId, mode: "score", outcome: "storage_error" });
      return json(503, { error: "storage_unavailable", retryable: true, request_id: requestId });
    }
    if (!created.created) {
      const winner = created.record;
      if (winner.answer_hash === answerHash && winner.retry_token_hash === tokenHash) {
        return json(200, { ...winner.public_result, receipt: winner.receipt, request_id: requestId, replayed: true });
      }
      return json(409, { error: "conflict", request_id: requestId });
    }
    const readBack = await store.get(submission_id);
    const verified = readBack && readBack.submission_id === submission_id && readBack.answer_hash === answerHash && readBack.retry_token_hash === tokenHash && readBack.processing_status === "committed";
    if (!verified) {
      info({ request_id: requestId, mode: "score", outcome: "readback_failed" });
      return json(503, { error: "storage_unverified", retryable: true, request_id: requestId });
    }

    // Step 6: summary for Jack's inbox, on its own short deadline.
    let summaryStatus = "unknown";
    try {
      summaryStatus = await withDeadline(notifier.send(buildSummary(record)), DEADLINES.summary);
    } catch (_) {
      summaryStatus = "unknown";
    }
    if (typeof store.setSummaryStatus === "function") {
      try { await store.setSummaryStatus(submission_id, summaryStatus); } catch (_) { /* recorded as unknown */ }
    }
    info({ request_id: requestId, mode: "score", outcome: "stored", band: scoring.band, classifier: classifierStatus, summary: summaryStatus });

    // Step 7: only the public result leaves.
    return json(200, { ...publicResult, receipt, request_id: requestId });
  }

  return async function handler(req) {
    const requestId = randomUUID();
    if (req.method !== "POST") return json(405, { error: "method_not_allowed" }, { Allow: "POST" });
    if (!originAllowed(req, allowedOrigins)) return json(403, { error: "origin_not_allowed", request_id: requestId });
    const ct = req.headers.get("content-type") || "";
    if (!ct.toLowerCase().startsWith("application/json")) return json(415, { error: "json_required", request_id: requestId });
    const body = await readJsonBody(req);
    if (body.error === "too_large") return json(413, { error: "body_too_large", request_id: requestId });
    if (body.error) return json(400, { error: "invalid_body", request_id: requestId });
    const data = body.value;
    if (!data || typeof data !== "object") return json(400, { error: "invalid_body", request_id: requestId });

    // Honeypot: a filled field ends here, quietly. No model, no record.
    if (typeof data.website_confirm === "string" && data.website_confirm !== "") {
      return new Response(null, { status: 204, headers: { "Cache-Control": "no-store" } });
    }
    if (data.mode === "followup") return handleFollowup(data, requestId);
    if (data.mode === "score") return handleScore(data, requestId);
    return json(400, { error: "unknown_mode", request_id: requestId });
  };
}

/* The two-layer summary for Jack: scannable fields first, then every
   answer verbatim in question order (DECISIONS.md P1a). The signature
   is added by the Forms notifier, which holds the key. */
export function buildSummary(record) {
  const a = record.answers;
  const s = record.scoring;
  return {
    flags: record.flags.map((f) => f.label).join(" | ") || "none",
    submission_id: record.submission_id,
    receipt: record.receipt,
    received_at: record.received_at,
    organization: a.org,
    name: a.name,
    role: a.role,
    email: a.email,
    score: s.total === null ? "Unscored" : String(s.total),
    band: s.band,
    dimensions: ["A", "B", "C", "D", "E"].map((k) => k + "=" + (s.dimensions[k] === null ? "n/a" : s.dimensions[k])).join(" "),
    classifier: record.classifier.status + (record.classifier.level === null ? "" : " level " + record.classifier.level),
    // Verbatim layer, in question order.
    q1_org: a.org,
    q2_website: a.website || "",
    q3_name_role: a.name + " / " + a.role,
    q4_staff: a.staff,
    q5_task: a.q5,
    q5b_followup: record.followup ? record.followup.question + "\n" + record.followup.answer : "",
    q6_frequency: a.frequency,
    q7_effort: a.effort + (a.effort_note ? " (" + a.effort_note + ")" : ""),
    q7b_scope: a.scope_context,
    q8_people: a.people + (a.helpers ? " (volunteers or contractors help)" : ""),
    q9_stall: a.stall.join(", ") + (a.stall_other ? " / " + a.stall_other : ""),
    q10_when_out: a.q10,
    q11_repeatability: a.repeatability,
    q12_tools: a.q12,
    q12b_sources: a.sources,
    q13_ai_tried: a.q13 || "",
    q14_sensitivity: a.sensitivity,
    q15_decision: a.decision + (a.decision_other ? " / " + a.decision_other : ""),
    q16_hours: a.q16,
    q17_preference: a.preference,
  };
}

export function createDefaultDeps(env) {
  return {
    providers: createProviders(env),
    store: createStore(env),
    notifier: createNotifier(env),
    allowedOrigins: (env.AUDIT_ALLOWED_ORIGINS || "").split(",").map((s) => s.trim()).filter(Boolean),
    aiEnabled: (env.AI_ENABLED || "").toLowerCase() === "true",
    log: (fields) => console.log(JSON.stringify({ fn: "score", ...fields })),
  };
}

let defaultHandler = null;
export default async function (req) {
  if (!defaultHandler) defaultHandler = createHandler(createDefaultDeps(process.env));
  return defaultHandler(req);
}

export const config = { path: "/.netlify/functions/score" };
