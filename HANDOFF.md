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

## Current checkpoint: 2026-09-13, Codex

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
