#!/usr/bin/env node
/* Model pilot for the classifier and the follow-up selector.

   Runs every calibration case through the real Anthropic provider N
   times (default 3) and writes one report. Reports agreement with the
   reviewed labels, every disagreement that would change a band,
   refusals, timeouts, invalid outputs, token usage, and an estimated
   cost. It does not overwrite the expected labels to match the model.

   This spends real API credits: 13 cases x 3 runs x 2 calls, a few
   hundred tokens each. Run it yourself with the key in your own shell:

       export ANTHROPIC_API_KEY=...        (in your terminal, never in chat)
       node tools/eval-classifier.mjs
       node tools/eval-classifier.mjs --runs 5 --model claude-haiku-4-5

   The report lands at _private/eval-classifier-<timestamp>.md, which is
   gitignored. Share the file, not the key.

   Not statistical validation. A pilot, as the spec says. */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createAnthropicProviders, DEFAULT_MODEL, PROMPT_VERSION } from "../netlify/functions/score/lib/providers.mjs";
import { score, bandFor } from "../netlify/functions/score/lib/scoring.mjs";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const CASES = path.resolve(ROOT, "netlify/functions/score/fixtures/calibration-cases.json");
const OUT_DIR = path.join(ROOT, "_private");

// Anthropic first-party list price for Haiku 4.5, USD per million tokens.
// Only used for the estimate line; the invoice is the truth.
const PRICE = { input: 1.0, output: 5.0 };

function arg(name, fallback) {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

if (!process.env.ANTHROPIC_API_KEY) {
  console.error("ANTHROPIC_API_KEY is not set in this shell. Export it in your own terminal and run again.");
  process.exit(2);
}

const runs = Number(arg("--runs", "3"));
const model = arg("--model", process.env.AUDIT_MODEL || DEFAULT_MODEL);
const providers = createAnthropicProviders({ AUDIT_MODEL: model });
const fixture = JSON.parse(fs.readFileSync(CASES, "utf8"));

function fmtOutcome(o) {
  if (o.error) return "error:" + o.error;
  return "L" + o.level;
}

const rows = [];
const bandChanges = [];
const followups = [];
let failures = 0;

for (const c of fixture.cases) {
  const outcomes = [];
  for (let r = 0; r < runs; r += 1) {
    const started = Date.now();
    try {
      const out = await providers.classify(c.q5, null, c.q5b || null);
      const evidenceOk = out.level === 0 ? out.excerpt === "" : out.excerpt.length > 0 && (c.q5.includes(out.excerpt) || (c.q5b || "").includes(out.excerpt));
      outcomes.push({ level: out.level, excerpt: out.excerpt, evidenceOk, ms: Date.now() - started });
    } catch (err) {
      failures += 1;
      outcomes.push({ error: err.code || "error", ms: Date.now() - started });
    }
  }
  const p = c.scoring_profile;
  const expectedBand = c.expected_band;
  for (const o of outcomes) {
    if (o.error) continue;
    const s = score(o.level, p);
    if (s.band !== expectedBand) bandChanges.push({ id: c.id, expected: c.proposed_level, got: o.level, band: s.band, expectedBand });
  }
  const agree = outcomes.filter((o) => !o.error && o.level === c.proposed_level).length;
  rows.push({ id: c.id, title: c.title, expected: c.proposed_level, outcomes, agree });

  // One follow-up selection per case, to see what the selector asks for.
  try {
    const fu = await providers.followup(c.q5);
    followups.push({ id: c.id, type: fu.type });
  } catch (err) {
    followups.push({ id: c.id, type: "error:" + (err.code || "error") });
  }
}

const u = providers.usage;
const cost = (u.input_tokens * PRICE.input + u.output_tokens * PRICE.output) / 1e6;
const stamp = new Date().toISOString().replace(/[:.]/g, "-");
fs.mkdirSync(OUT_DIR, { recursive: true });
const outPath = path.join(OUT_DIR, "eval-classifier-" + stamp + ".md");

const totalRuns = rows.length * runs;
const totalAgree = rows.reduce((n, r) => n + r.agree, 0);

let md = "# Classifier pilot\n\n";
md += "Model: " + model + "  \nPrompt version: " + PROMPT_VERSION + "  \nRuns per case: " + runs + "  \nDate: " + new Date().toISOString() + "\n\n";
md += "Agreement with reviewed labels: " + totalAgree + " of " + totalRuns + " runs.  \n";
md += "Provider failures (timeout, refusal, invalid output): " + failures + ".  \n";
md += "Band-changing disagreements: " + bandChanges.length + ".  \n";
md += "Tokens: " + u.input_tokens + " in, " + u.output_tokens + " out across " + u.calls + " calls. Estimated cost at list price: $" + cost.toFixed(4) + ".\n\n";
md += "Only C09 and C03 labels are Jack-approved so far; the rest are proposed. A disagreement is a prompt for review, not automatically a model error.\n\n";
md += "| Case | Expected | Runs | Agree | Evidence ok | Avg ms |\n| --- | --- | --- | --- | --- | --- |\n";
for (const r of rows) {
  const ev = r.outcomes.filter((o) => !o.error).every((o) => o.evidenceOk) ? "yes" : "NO";
  const ms = Math.round(r.outcomes.reduce((n, o) => n + o.ms, 0) / r.outcomes.length);
  md += "| " + r.id + " " + r.title + " | L" + r.expected + " | " + r.outcomes.map(fmtOutcome).join(", ") + " | " + r.agree + "/" + runs + " | " + ev + " | " + ms + " |\n";
}
md += "\n## Band-changing disagreements\n\n";
if (!bandChanges.length) md += "None.\n";
for (const b of bandChanges) md += "- " + b.id + ": expected L" + b.expected + " (" + b.expectedBand + "), got L" + b.got + " (" + b.band + ")\n";
md += "\n## Excerpts returned\n\n";
for (const r of rows) {
  for (const o of r.outcomes) {
    if (o.error) continue;
    md += "- " + r.id + " L" + o.level + ": “" + o.excerpt + "”" + (o.evidenceOk ? "" : " (NOT FOUND IN TEXT)") + "\n";
  }
}
md += "\n## Follow-up type chosen\n\n";
for (const f of followups) md += "- " + f.id + ": " + f.type + "\n";
md += "\nInputs sent: the calibration Q5 text and any q5b. No names, emails, or other fields.\n";

fs.writeFileSync(outPath, md);
console.log(md);
console.log("Report written to " + path.relative(ROOT, outPath));
