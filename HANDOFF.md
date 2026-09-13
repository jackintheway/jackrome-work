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

Jack liked the current arrival and asked for "Choose a room" to appear only when
the album artwork stacks above the room list. The link is now hidden by default,
and shown inside the same max-width: 799px media query that stacks the layout.
At 800px and wider it takes no space and is absent from keyboard navigation.
The durable rule is recorded in CLAUDE.md.

Verified locally at measured 390px and 799px: link visible, single-column layout.
At 800px: link hidden, two columns. No horizontal overflow. Clicking the phone
shortcut reached #roomsTitle with the heading visible below the navigation.
The temporary viewport override was reset. Diff whitespace checks passed.

Intake HEAD was 46b6c55 on main. This checkpoint accompanies the local responsive
shortcut save point. No push or deployment. The existing preview remains at
http://127.0.0.1:56064; port 8642 still serves Jack's first case-study review.

The previous save point contains the autonomous arrival with hover/keyboard pause,
puzzle marks, first-person handoff framing and Wispr Flow caption, plus the second
case-study draft and its three-timeline diagram. See that commit's handoff for its
checks and evidence limits. Both case studies remain under Jack's review.

The pre-existing separate-exhibit handoff section remains unstaged. The 18 unrelated
untracked files remain untouched: eight Substack images, assets/puzzle-trio.svg,
and nine files under tools/substack/. Private exhibits remain ignored.

Next: continue Jack's local review. Publish only after his explicit go, then verify
the deployed revision and host-specific routing, discovery files, and asset headers.
