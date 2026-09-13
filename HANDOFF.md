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

Untouched and still local: the separate-exhibit handoff section above, Jack's
modified working SVG, and the untracked Substack and puzzle files. No
assessment code, function, DNS, account, or credit changes have been made.
Next: the assessment page location and the host rule for audit.jackrome.work,
then the function skeleton with mocked providers, previewed locally. Publication
still needs Jack's explicit go.

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
