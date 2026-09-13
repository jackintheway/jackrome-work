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

## Current checkpoint: 2026-09-12, Codex

### What Jack requested and decided

Build the /handoff demonstration using this website's own work, and show a Wayspace
arrival with modest scroll movement using his existing artwork. Jack is reviewing
the case study separately. Leave it unchanged and keep everything local pending his
explicit publication go. Durable decisions are in CLAUDE.md and MOTION.md.

### Current work

- AI Portfolio now has a three-step handoff example: Jack's request, the files
  checked, and a copyable note. It uses the link-update save point 633121a, clearly
  dated September 12, and shortens that checkpoint for public reading. The buttons
  reveal recorded material; they do not run an AI model. With scripts disabled,
  all three panels remain readable. The explanatory copy is newly drafted from
  the project record; the request excerpt is Jack's own sentence.
- Wayspace's blue hero and straight wordmark remain. The separated album artwork
  sits beside the room list. Six layer groups move by at most 32px vertically and
  8px horizontally during scrolling, through one queued animation frame. A pause
  button restores the composed position. Below 800px and with reduced motion,
  the composition is still. A hero link jumps directly to the rooms.
- Ten registered 1200px WebP exports total 906,830 bytes. No source files changed.
  tools/export-arrival-art.py documents the export; version filenames before
  changing published artwork because image responses are immutable on the host.
- The case-study page and its card data, Production data, and About are byte-identical
  to intake. The four design-token files still match the canonical system.

### Checks and limits

- Inspected both references Jack supplied in the browser, then checked the new
  layouts at measured 390px and 1440px. Also checked the arrival at 799px and 800px.
  No horizontal overflow. Images loaded with square geometry and room links intact.
- Followed the new artwork link to the Wayspace album and the example link to its
  12 filtered lyrics. Both arrived at the intended content below the navigation.
- Activated handoff steps with clicks and Enter. Copy succeeded and the resulting
  dated note was pasted into a temporary local field and read back successfully.
- Scrolled through the artwork at multiple positions. Measured the changing
  transforms, then confirmed they stayed off after keyboard pause and more scrolling.
- Forced reduced motion in headless Chrome at 390px and 1440px: all transforms were
  none, motion controls hidden, and the artwork stayed in normal document flow.
  Inspected a start/middle/end screenshot strip. No-script checks preserved all
  six room links and all three demo panels. The temporary harness was removed.
- JavaScript syntax, diff whitespace, unique IDs, image alt attributes, local asset
  and link resolution, title/content rules, and token parity checks passed.
- This is local verification. The preview does not emulate Netlify headers or
  redirects. No Safari/VoiceOver certification or measured production performance
  claim is implied.

### Publication and preview state

Intake HEAD was 633121a on main. This checkpoint accompanies the local save point
for the demonstration and arrival. No push or deployment was performed.

The earlier audit work remains in 25f1e48 and 633121a: service/portfolio corrections,
case-study rewrite, lyric fixes, contrast, italic book titles, call expectations,
404/discovery files, and precise cross-room links. The locally installed website-walk
skill remains outside this public repository.

A fresh loopback-only preview is running at http://127.0.0.1:56064 with caching disabled
so imported stylesheet edits appear during review. The earlier preview at port 8642
is still available for Jack's open case-study tab. Neither applies Netlify config.

The 18 pre-existing untracked files remain untouched: the eight Substack images,
assets/puzzle-trio.svg, and nine files under tools/substack/. Do not stage them.

### Still open

Jack's review of the new arrival, handoff example, and earlier case-study/copy changes.
After his publication go, verify the deployed revision plus the new document redirects,
sitemap, robots, 404, and artwork content types/cache headers against the live host.

The case-study source record confirms two late gaps, not their final closure. That
limit remains in the copy. No private transcript or employer portfolio material was
added to the example or repository.

### Next action

Review the local previews with Jack and apply his feedback. Publish only after his
explicit go, then complete the host-specific checks.
