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

Jack read and approved both case studies and their prose. He approved making them
easier to find while keeping the list on AI Portfolio for now. A standalone hub
can wait until he wants a separate destination for prospective clients or the
collection covers more kinds of work; three entries is not a prerequisite.

AI Portfolio now has "See case studies" beside "Book a call," pointing to its
existing clientTitle heading. Production has the same link in its hero. In
AI Enablement's "How I work," "See case studies" points to that section, and
"Explore AI Portfolio" preserves access to the full page. All use existing button
styles. No new page, nav item, CSS, JavaScript, or case-study copy was added.
CLAUDE.md records Jack's approval and the hub decision.

Native clicks from all three pages reached the intended section. Keyboard Enter
activated the portfolio shortcut. Verified 1280px desktop and measured 390px phone
layouts; buttons wrap without overflow and the destination heading clears the
fixed navigation. Inspected the three mobile arrivals side by side. Markup, unique
IDs, metadata, external-link rules, copy checks, and diff whitespace passed. Both
case studies, Production credits, and styles remain byte-identical to intake HEAD.
The temporary browser tab and phone harness were removed.

Intake HEAD was 7f87212 on main. This checkpoint accompanies the local case-study
navigation save point. No push or deployment. Preview: http://127.0.0.1:56064.
Port 8642 remains available for the first case study.

Jack's updated assets/img/wayspace-straight.svg stays untouched and unstaged, as
does the pre-existing separate-exhibit handoff above. The 18 unrelated untracked
Substack and puzzle assets remain untouched. Private exhibits remain ignored.

Next: publish only after Jack's explicit go, then verify the deployed revision
and host-specific routes. The approved case-study copy needs no further rewrite.
