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

Add the Wispr Flow attribution to the handoff request and use first-person framing
around it. Replace scroll-driven artwork with autonomous movement, pause on hover,
and try the existing puzzle mark on the arrival. Use the supplied second exhibit
for another local case-study draft. The first case study remains unchanged while
Jack reviews it. Nothing is authorized for publication yet.

### Current work

- The demo keeps Jack's dictated request verbatim, with the italic caption
  "Spoken aloud using Wispr Flow." Its framing says "My request" and "our decisions."
  The dated agent handoff still names Jack, since it addresses the next agent.
- The arrival artwork and room list now scroll together in normal document flow.
  Eight groups, including two small existing puzzle marks at opposite corners,
  move on independent CSS timelines. Hover freezes them in place. Keyboard focus
  reveals a pause/resume button; activating it preserves the pause after focus leaves.
  Motion stays off below 800px, on coarse pointers, and under reduced motion. Hidden
  tabs and offscreen artwork suspend their animation clocks. No new asset library.
- The second page is case-studies/event-remaster-and-language-conform.html, with an
  entry in js/case-studies.js, its own share-card source and 1200x630 PNG, and a sitemap
  entry. README now counts 75 content pages plus the separate 404 page.
- The case study uses a three-timeline schematic, preserves intentional pauses and
  extensions, and separates saved production reports from later artifact checks.
  Listening approval and 20 translated-card reviews were still open in the record.
  The missing editable graphics builder is stated. Most narrative is newly drafted
  from the exhibit; two passages adapt Jack's own explanation of shifts and pauses.
- CLAUDE.md and MOTION.md record the new decisions. The first case page, Production,
  About, and creative catalogue remain byte-identical to intake. Token files still
  match the canonical design system. Existing arrival images were not re-exported.

### Checks and limits

- Browser checks at measured 390px, 799px, 800px, and desktop widths: no horizontal
  overflow. The new schematic remains readable at 390px. Arrival images load, and
  all six room links remain available. The case-list links resolve to both pages.
- Scrolling moved the artwork frame and room list by the same measured 352px.
  Autonomous transforms changed while enabled. Hover paused all eight groups;
  moving off resumed them. Keyboard focus revealed the control and paused motion;
  Enter preserved that pause after Tab, and Resume restarted it.
- The demo's caption renders in italics; its second panel uses "our decisions."
  The historical note and quote remain intact. Existing step/copy implementation
  was not changed; prior clipboard verification remains in the previous checkpoint.
- Forced reduced motion in headless Chrome at 390px and 1440px: no animation or
  layer transform, normal document flow, hidden motion controls, six room links.
  With JavaScript disabled, all three handoff panels remained readable.
- New case metadata, image dimensions, local assets/links, unique IDs, alt attributes,
  external rel attributes, JavaScript syntax, diff whitespace, and token parity pass.
  The new page and card pass the exhibit's excluded-term scan. No new case console
  errors. The temporary verification harness was removed.
- These are local checks, not a new media audit or a Netlify deployment. No claim
  of completed Spanish listening approval, translated renders, or production headers.

### Publication and preview state

Intake HEAD was d28e9b4 on main. This checkpoint accompanies the local save point
for arrival revisions and the second case study. No push or deployment performed.
Earlier audit and link work remains in 25f1e48 and 633121a; the demonstration and
first arrival preview are in d28e9b4. The website-walk skill is installed separately.

Loopback preview: http://127.0.0.1:56064, with caching disabled. Port 8642 remains
available for Jack's first case-study review. Neither emulates Netlify configuration.

The pre-existing separate-exhibit handoff section remains an unstaged change from
another agent. Preserve it. The 18 pre-existing untracked files are also untouched:
eight Substack images, assets/puzzle-trio.svg, and nine files under tools/substack/.
The private exhibits and source conversation remain ignored and uncommitted.

### Next action

Review the two case-study drafts and revised arrival with Jack. Apply his feedback
locally. After an explicit publication go, push deliberately and verify the deployed
revision, document redirects, sitemap, robots, 404, and artwork headers on the host.
