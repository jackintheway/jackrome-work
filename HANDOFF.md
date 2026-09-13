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

Jack authorized a local "Find something" guide and refined it while trying it:
first-person language, including "Email me," and live results without a Find
button. He also asked to broaden the AI Portfolio opening beyond stopping and
asking. He approved "How I work with AI." and the introduction of personal tools
alongside client projects. The following "How these tools are built" heading is
removed at his request; the introduction begins with "As AI tools advance."
Its patternTitle anchor remains. Both approved case studies remain untouched.

The shared nav opens a native dialog that searches 160 public destinations and
returns at most three links. The index comes from the sitemap's public HTML and
published Wayspace/Production catalogues, with curated section links. It excludes
private materials and full lyric bodies. Questions stay in the browser; no model
or query logging is involved. Unknown topics, rates, and availability offer email.
This is word/topic matching and can miss unfamiliar phrasing. README.md documents
index refresh and tests. The menu collapses through 1080px to fit the new control.

Added entry IDs to the Speaking talk, 14 spoken-prose entries, and 9 Production
pieces so results arrive at the work. All 141 catalogue entries and their rendered
content were verified unchanged except IDs. Updated portfolio metadata and the
1200x630 v2 share card; the existing published image remains intact. Its renderer
now writes the versioned filename. CLAUDE.md records the current decisions.

Verification: 24 search tests passed; current-index, JavaScript syntax, copy,
metadata, unique IDs, external links, whitespace, and canonical-token parity
checks passed. All 75 public pages plus 404 load the shared nav. Browser checks
covered desktop, the 1081px desktop boundary, and measured 390px/320px phone
layouts; live search, example buttons, exact album/talk destinations, first-person
fallback, and Escape/focus return were checked. The new portfolio opening was
inspected at 390px and a wider window, and its share card was inspected after
rendering. No full assistive-technology audit was performed.

Intake HEAD was 455c5c6 on main. This checkpoint accompanies the local site-guide
and portfolio-opening save point. No push or deployment. Main preview:
http://127.0.0.1:56064. Port 8642 remains available. The phone harness and temporary
failure-test server were removed; the user-facing preview uses the main server.

Jack's updated assets/img/wayspace-straight.svg stays untouched and unstaged, as
does the pre-existing separate-exhibit handoff above. The 18 unrelated untracked
Substack and puzzle assets remain untouched. Private exhibits remain ignored.

Jack also supplied the original manifesto video, AYzzTeSOF4Q. Its timestamped
English auto-captions were retrieved to a temporary file, outside the repository.
No manifesto text or Gemini summary has been added to the website.

Next: Jack can try the guide with his own questions. The opening is approved.
Publish only after his explicit go, then verify the deployed revision and
host-specific routing/cache behavior.
