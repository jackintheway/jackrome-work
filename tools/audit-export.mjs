#!/usr/bin/env node
/* Operator export and reconciliation for the assessment records.

   Reads the canonical records from Netlify Blobs and writes them to a
   private folder as JSON (exact) and Markdown (readable). Verifies the
   signature on any summary you paste in, and lists records whose
   summary email was not acknowledged so you can chase them.

   Needs, in your own shell, never in chat:
     NETLIFY_SITE_ID        Project configuration > General > Project ID
     NETLIFY_AUTH_TOKEN     User settings > Applications > Personal access token
     AUDIT_CONTEXT          production (default) or preview
     AUDIT_SUMMARY_KEY      only for --verify; the same value Netlify holds

   Usage:
     node tools/audit-export.mjs                 export everything
     node tools/audit-export.mjs --id <uuid>     one record
     node tools/audit-export.mjs --reconcile     list unacknowledged summaries
     node tools/audit-export.mjs --verify file   verify a pasted summary (JSON of fields)
     node tools/audit-export.mjs --delete <uuid> remove one record and its status entry
                                               (the retention step; asks nothing, so
                                               export first if you want a copy)

   Output lands in _private/exports/<timestamp>/, which is gitignored.
   Delete exports at the monthly review along with their records. */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createBlobsStore, verifySummary } from "../netlify/functions/score/lib/store.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const value = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : undefined; };

if (flag("--verify")) {
  const file = value("--verify");
  const fields = JSON.parse(fs.readFileSync(file, "utf8"));
  const key = process.env.AUDIT_SUMMARY_KEY;
  if (!key) { console.error("AUDIT_SUMMARY_KEY is not set."); process.exit(2); }
  const version = process.env.AUDIT_SUMMARY_KEY_VERSION || "1";
  const result = verifySummary(fields, { [version]: key });
  console.log(result.ok ? "Signature valid for key version " + version : "Signature INVALID: " + result.reason);
  process.exit(result.ok ? 0 : 1);
}

if (!process.env.NETLIFY_SITE_ID || !process.env.NETLIFY_AUTH_TOKEN) {
  console.error("NETLIFY_SITE_ID and NETLIFY_AUTH_TOKEN must be set in this shell.");
  process.exit(2);
}

const env = { ...process.env, CONTEXT: process.env.AUDIT_CONTEXT || "production" };
const store = createBlobsStore(env);
console.log("Store: " + store.storeName);

if (flag("--delete")) {
  const id = value("--delete");
  const existing = await store.get(id);
  if (!existing) { console.error("Not found: " + id); process.exit(1); }
  await store.remove(id);
  console.log("Deleted record " + id + " (" + existing.receipt + ", " + existing.answers.org + "). The Forms submission and any email copy are separate; remove those in the Netlify dashboard and Gmail.");
  process.exit(0);
}

const ids = value("--id") ? [value("--id")] : await store.list();
const records = [];
for (const id of ids) {
  const r = await store.get(id);
  if (r) records.push(r);
  else console.error("Not found: " + id);
}

if (flag("--reconcile")) {
  const pending = records.filter((r) => r.summary_status !== "acknowledged");
  console.log(pending.length + " of " + records.length + " records without an acknowledged summary:");
  for (const r of pending) console.log("  " + r.submission_id + "  " + r.received_at + "  " + r.summary_status + "  " + r.answers.org);
  process.exit(0);
}

function md(r) {
  const a = r.answers;
  const q = (s) => "> " + String(s === undefined || s === null ? "" : s).split("\n").join("\n> ");
  let out = "# Submission " + r.receipt + "\n\n";
  out += "- ID: " + r.submission_id + "\n- Received: " + r.received_at + "\n- Score: " + (r.scoring.total === null ? "Unscored" : r.scoring.total) + " (" + r.scoring.band + ")\n";
  out += "- Classifier: " + r.classifier.status + (r.classifier.level === null ? "" : ", level " + r.classifier.level) + (r.classifier.excerpt ? ", excerpt: " + JSON.stringify(r.classifier.excerpt) : "") + "\n";
  out += "- Summary email: " + r.summary_status + "\n- Versions: " + [r.schema_version, r.rubric_version, r.prompt_version, r.template_version, r.privacy_notice_version].join(", ") + "\n\n";
  out += "## Flags\n\n" + (r.flags.length ? r.flags.map((f) => "- " + f.label).join("\n") : "None") + "\n\n";
  out += "## Answers\n\n";
  const rows = [
    ["Organization", a.org], ["Website", a.website], ["Name", a.name], ["Role", a.role], ["Staff", a.staff],
    ["Q5 Task", a.q5], ["Q5b Follow-up", r.followup ? r.followup.question + "\n" + r.followup.answer : ""],
    ["Q6 Frequency", a.frequency], ["Q7 Effort", a.effort], ["Q7 note", a.effort_note], ["Q7b Scope", a.scope_context],
    ["Q8 People", a.people + (a.helpers ? " (volunteers or contractors help)" : "")],
    ["Q9 Stall", a.stall.join(", ")], ["Q9 elsewhere", a.stall_other], ["Q10 When out", a.q10], ["Q11 Repeatability", a.repeatability],
    ["Q12 Tools", a.q12], ["Q12b Sources", a.sources], ["Q13 AI tried", a.q13], ["Q14 Sensitivity", a.sensitivity],
    ["Q15 Decision", a.decision], ["Q15 role", a.decision_other], ["Q16 Hours", a.q16], ["Q17 Preference", a.preference], ["Email", a.email],
  ];
  for (const [label, v] of rows) {
    if (v === undefined || v === "") continue;
    out += "**" + label + "**\n\n" + q(v) + "\n\n";
  }
  return out;
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-");
const dir = path.join(ROOT, "_private", "exports", stamp);
fs.mkdirSync(dir, { recursive: true });
for (const r of records) {
  fs.writeFileSync(path.join(dir, r.submission_id + ".json"), JSON.stringify(r, null, 2));
  fs.writeFileSync(path.join(dir, r.submission_id + ".md"), md(r));
}
console.log(records.length + " records exported to " + path.relative(ROOT, dir));
