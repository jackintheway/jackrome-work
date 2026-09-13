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

Jack approved hiding the artwork on narrow screens so the welcome leads directly
into the rooms. Below 800px, the complete figure is hidden, including the caption,
puzzle marks, and pause control. "Choose a room" and its unused styles are removed.
At 800px and wider, the existing artwork stays beside the room list. The JavaScript
and image assets are unchanged. This is a layout change, not an image-download
optimization. CLAUDE.md, MOTION.md, and README.md record the new layout decision.

Verified locally at measured 390px and 799px: figure display none, no space reserved,
room links immediately after the welcome, no shortcut. At 800px the figure is visible
beside the rooms and animation is enabled. All six room links remain available;
no horizontal overflow at the checked widths. Inspected phone and wider screenshots,
reset the temporary viewport override, and passed diff whitespace checks.

Intake HEAD was 01b316a on main. This checkpoint accompanies the local simplified
mobile arrival save point. No push or deployment. Preview: http://127.0.0.1:56064.
Port 8642 remains available for Jack's first case-study review.

46b6c55 contains the autonomous artwork, handoff demo revisions, and second case
study. Its handoff records their broader checks and evidence limits. The two case
studies remain under Jack's review; neither was changed in this update.

The pre-existing separate-exhibit handoff section remains unstaged. The 18 unrelated
untracked files are untouched: eight Substack images, assets/puzzle-trio.svg, and
nine files under tools/substack/. Private exhibits remain ignored.

Next: continue Jack's local review. Publish only after his explicit go, then verify
the deployed revision and host-specific routing, discovery files, and asset headers.
