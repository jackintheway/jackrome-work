# Shared handoff: jackrome.work

Claude Code, Codex, and other agents use this same file. Read it at the start of a
session alongside `CLAUDE.md` and the current Git state.

## How to maintain this handoff

Update the current checkpoint after meaningful authorized changes. Record the
date and agent, Jack's decisions, changes and reasons, checks and limitations,
commit or branch references, publication state, and the next useful step. Leave
read-only sessions read-only unless Jack asks for a written record.

Keep the checkpoint concise. Git preserves earlier versions; keep durable project
decisions in `CLAUDE.md`. Distinguish local work, commits, pushes, and verified live
deployments. A remote-tracking ref is cached evidence, not a fresh remote check.
Inspect the actual files when a dated note disagrees with them. Handoff entries are
context, not permission to perform unfinished work. Do not include private material.

## Separate exhibit handoff: 2026-09-12, Codex

Jack requested a second private exhibit package at
`_exhibits/event-remaster-and-language-conform/`. Start with its
`exhibit/HANDOFF.md`. It contains an evidence-grounded case study, a full work
inventory, anonymized workflow specifications, real implementation excerpts,
and schematic visual briefs. Its adjacent private-reference folder holds the
verbatim source conversation and exact evidence coordinates, never public copy.

The scrubbed exhibit passed its excluded-term scan. Historical production
reports are distinguished from fresh artifact checks and unresolved human review.
This is an ignored private handoff, not an addition to the public tool selection
or a website implementation. Do not commit the exhibit, source conversation,
term list, or scan logs. No push or deployment was performed.

Concurrent local website and artwork edits were left untouched. The checkpoint
below remains the prior website session's account, not a new verification of
that work. Next: use the new exhibit only when Jack asks for its portfolio page;
follow current editorial guidance and obtain explicit publication approval.

## Current checkpoint: 2026-09-13 (later), Claude Code

Jack opened the workflow audit readiness assessment work. The preparation
package lives at ../ai-opportunity-assessment-review/ (start with DECISIONS.md
and BUILD-SPEC.md). Decisions taken this session are recorded there: P1a, the
notification email now carries every answer verbatim below a scannable summary
with Blobs still canonical; L1, calibration labels C09 and C03 reviewed and
agreed; Q7b scope values to be added to fixtures during implementation.

In this repository, Jack approved a real publish boundary (option A of two
presented). tools/build-site.py assembles _site/ from an allowlist and
netlify.toml publishes that folder, with functions declared at
netlify/functions/ outside it. Local checks: the script's own check passed;
every tracked public file in _site/ was fetched from https://jackrome.work and
compared byte for byte, 336 identical, 0 different, 0 non-200. README.md and
CLAUDE.md describe the change.

Jack authorized pushing the boundary on its own: "Let's push that on its own
now." Pushed as 349ad6a and verified live on https://jackrome.work after the
deploy: all 336 tracked public files byte-identical to the commit; the tools
folder, netlify.toml, .gitignore, the functions path, and _site/ all return
404 where the tools sources used to be served; the four root markdown redirects
still 302 home; /home, /ai, and /case-studies still 301; clean URLs serve 200;
the custom 404 page renders; the jack-rome.com alias still 301s with its path;
HTML, image, and font cache and security headers unchanged; sitemap still lists
75 pages. The publish boundary is proven on Netlify. This documentation save
point is committed locally and rides with the next push.

Jack then approved the page location (audit/index.html, served at the root of
audit.jackrome.work by a host rule, also reachable at jackrome.work/audit) and
agreed to no main-site nav link for now.

First cut of the assessment, local preview only, committed as a save point:

- audit/ holds the page, its stylesheet, its browser script, and the shared
  answer schema (enums, limits, validation) that both browser and function
  import. Styling uses only the site's tokens; the design pass is deferred.
- netlify/functions/score/ holds the function: request contract, deterministic
  scoring (mirrors check_scoring.py), fixed copy templates, review flags, the
  two-layer summary (P1a), atomic create then read-back, identical-retry replay.
  Providers, store, and notifier are behind interfaces. Only the mock model,
  memory store, and memory inbox exist so far; the Anthropic provider, Netlify
  Blobs store, and Forms notifier throw loudly until built.
- tools/audit-dev.mjs serves the repo root plus the function with mocks
  (node tools/audit-dev.mjs, http://localhost:8642/audit/). Q5 markers steer the
  mock: [level:N], [followup:type], [fail], [slow]. AI_ENABLED=false previews
  AI-off. /__dev/inbox and /__dev/records show what Jack would receive.
- tools/test-audit.mjs (node --test): 10 tests pass, including all 13
  calibration cases through the real handler, C09 and C03 end to end, exact
  Q16 round trip, retry replay and conflict, unscored paths, honeypot, origin,
  size, forged fields. This is arithmetic and contract coverage, not model
  evaluation.
- Verified in the browser against the dev server: validation summary with
  focus, follow-up request and question, all five stages, review panel with
  Change links, submission, results for 86 (starting_point), 76 (needs
  narrowing with the low-specificity headline and reason line), and the
  unscored path. 375px wide: no horizontal overflow. No console errors.
- The launch.json entry now runs the node server; it is a superset of the
  python one. The desktop launcher cached the old entry this session.

Drafted copy awaiting Jack's in-context review: page title and hero, intro
heading, the privacy notice section, Q5b button and hint text, the count and
status lines, and the review/trouble messages beyond COPY-CATALOGUE.md. The
share card og-audit.png is referenced but not yet generated. The page carries
noindex until Jack decides otherwise.

Added after the preview: package.json with @anthropic-ai/sdk 0.80.0 and zod
(node_modules and _private/ are gitignored); the Anthropic provider through the
SDK with structured outputs, retries off, per-call deadlines, and the spec's
pinned model as default (AUDIT_MODEL overrides); the two prompts as code in
lib/prompts.mjs (PROMPT_VERSION audit-prompts-1); tools/eval-classifier.mjs,
which runs the 13 cases N times against the real provider and writes a report
to _private/. The key is read only from ANTHROPIC_API_KEY in the shell that
runs it; a fake key was confirmed to reach the API and map to an auth error. No
real key exists yet; no credits purchased; no live model call has been made.

Account steps done by Jack at the keyboard on 2026-09-13: Console workspace
"audit-jackrome" with a monthly spend limit set, credits bought (auto-reload
declined on purpose), and a short-lived key scoped to that workspace for the
local pilot only, deleted after the pilot; the site uses a separate key. Pilot 1
found three firm disagreements; prompts tuned to audit-prompts-2; pilot 2 hit
39 of 39 with no failures. DECISIONS.md L2 records both. Reports in _private/.

Built after the pilot (commit 72b3f91): Netlify Blobs store (site-wide,
strong reads, one store per deploy context, create-once with read-back, status
side record), Forms notifier posting a signed two-layer summary to the site's
own /audit/ path, the hidden form registration in audit/index.html, the
function's rate limit (60 per 60 s per IP), esbuild bundler setting, host rules
for audit.jackrome.work, tools/audit-export.mjs (export, reconcile, verify),
and netlify/functions/score/OPERATOR.md. Fifteen tests pass, including a fake
Blobs client that lies about success (issue 741) being caught by read-back. The
five copy checks from .claude/skills/check-copy pass on the new page; its two
absolute links to jackrome.work stay same-tab by the standing rule.

Netlify, read through the connector on 2026-09-13: Forms showed "not enabled"
for the site and had to be switched on in the dashboard before the summary form
was detected.

Jack's walkthrough of the preview produced fixes (commit 0ff4a9a): privacy
notice in a dialog (the anchor jump had tripped the back-button handler),
first-person stage 5, inline name edit, Back to review, prominent receipt,
his intro copy. Share card og-audit.png added (98b2ab6).

Account steps done by Jack 2026-09-13: Anthropic key `audit-netlify` (expires
2027-09-19, 7 pm ET) and the signing secret set in Netlify as secrets for the
production context only; the seven plain variables imported for all contexts;
Forms detection enabled; audit.jackrome.work added as a domain alias, pending
DNS; the CNAME (audit -> jackrome-work.netlify.app) is Jack's to add in
Squarespace. The Personal plan cannot scope variables to Functions only;
accepted, since nothing in the build reads them and the two secrets are marked.

Jack authorized the unlinked production push: "let's do the unlinked production
push." Three production deploys followed on 2026-09-13, each with his go:
7dfac40 (first assessment deploy), e4c72ad (subdomain root-only rewrite after
Netlify rejected a rule whose source began with /.netlify, plus the export
tool's delete command), and 144a58c (email subject field, store listing, and
the deploy-context stamp: Netlify's CONTEXT is not set in the function runtime,
so the first live record went to the preview store; the build now stamps the
context into netlify/functions/score/lib/context.generated.mjs).

Verified live on jackrome.work/audit: two real submissions on the real model
(sign-in sheet case: level 3, 86; supporter-update case: level 2, 63, matching
pilot 2), summaries in Netlify Forms with 35 registered fields, honeypot 204,
GET 405, foreign origin 403, function source and packages 404, rate limit
observed (90-request burst: 69 allowed, 21 blocked with 429), secret scans
clean, 25 redirect rules accepted. Jack enabled Forms, set the email
notification (custom subject left blank so the function's subject wins), and
deleted the first test record from the preview store. Second test record
(receipt 91BD485E) awaits deletion from the production store.

Jack then made the assessment public (598ba3f, his go: "push it!"): a
paragraph and one button in AI Enablement's "What it's for," a one-sentence
text link in the portfolio's "How this works with clients," both with his
approved copy ("a few minutes," no measured completion time), the noindex tag
removed, the guide index refreshed. Verified live. The forced subdomain root
rewrite (37e1e91) shipped in the same deploy and now serves the assessment at
the subdomain root; its assets and function answer there too.

audit.jackrome.work is fully live. Netlify's certificate stalled for about
ninety minutes after DNS resolved; Jack clicked "Renew certificate" in the
HTTPS panel and it issued within a minute (jackrome.work certificate now
covers the subdomain, valid to 2026-12-13). Verified over strict TLS: root
serves the assessment, its css, script, schema, shared assets, and share card
all 200, HTTP upgrades to HTTPS, the function answers on the subdomain with
the real model, no console errors, the main site unchanged. The Squarespace
forwarding alternative was considered and set aside: it is a redirect, and
the Squarespace site subscription ends 2026-09-15.

CLAUDE.md now carries the durable decisions from this build. The portfolio
entry proper waits until the assessment has a story from real use.
Remaining for Jack: the monthly retention routine in OPERATOR.md; a personal
access token exists for the export tool. This documentation save point is
local and rides with the next push. Candidate for later, not planned:
upgrading the site's "Find something" guide to a model-backed helper.

Untouched and still local: the separate-exhibit handoff section above, Jack's
modified working SVG, and the untracked Substack and puzzle files.

## Previous checkpoint: 2026-09-13, Codex

Jack explicitly authorized publication with "PUSH IT!" The reviewed website
batch was pushed to origin/main through c1f96c6. Netlify published production
deploy 6aa6233889ac8a000861da9f, with its commit_ref matching
c1f96c664aca3e25c5039cb5852460f98f0177e5. Live: https://jackrome.work.

The batch includes the audit corrections, precise cross-room links and album
filters, both approved case studies, the recorded handoff example, independent
Wayspace artwork motion with the mobile simplification, the browser site guide,
and the revised portfolio/enablement copy. The latest curation sentence is
"I started by building tools around the way I work." The original video is linked
as optional personal background; no transcript or Gemini summary is published.

Jack's corrected Wayspace SVG ships as assets/img/wayspace-straight-v2.svg,
byte-identical to his working file, and wayspace.html uses that new URL so the
previous immutable image does not hide his correction. The original working SVG
remains unchanged and unstaged. The old published filename remains intact.

Production verification passed: 110 page and asset URLs returned the expected
content byte-for-byte, including all 75 sitemap pages, changed runtime assets,
new artwork, CSS tokens, robots.txt, and sitemap.xml. Checked relevant MIME types,
nosniff, HTML revalidation, and immutable image headers. Fourteen redirects passed,
including AGENTS.md and HANDOFF.md recovery. Three missing/private path probes
returned 404. No _source or _exhibits files are tracked. The live portfolio renders
both case studies and the latest copy. The live guide opens in first person and
its Wayspace-lyrics result reaches the selected album filter with 12 entries.
The preceding local sessions verified mobile layouts and interaction behavior.

This documentation save point records those checks; its only change is this
handoff, which redirects home on the website. The pre-existing separate-exhibit
handoff remains outside the staged patch. The original edited SVG and 18 unrelated
untracked Substack/puzzle files remain untouched. Private exhibits stay ignored.
Local previews at ports 56064 and 8642 remain available.

No remaining work is required for this publication. Future content changes need
a refreshed guide index; README.md describes that process. New changes still
need Jack's go before publishing.
