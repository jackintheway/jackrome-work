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

Implement the approved website audit fixes and Red Pen marks, rebuild the editing
case study from the full working-session transcript, improve cross-room links,
and create the website-walk skill. Durable decisions are in the current editorial
section near the top of `CLAUDE.md`. Publication still needs Jack's go.

### Current work

The first local save point covers service and portfolio claim corrections, the
case-study rewrite and diagrams, lyric line-break repairs, contrast, book-title
italics, call expectations, sitemap/robots, and the branded 404. No client identities
or source media were added to the case study. Public Production records and the
portfolio sentence Jack wrote remain intact.

Cross-room links and Writing album filters are implemented and verified locally,
but are being saved separately with the documentation updates. They are the only
remaining implementation save point from this batch.

### Verification and publication state

- 75 pages checked at a measured 390px width without horizontal overflow; the
  14 main/recovery pages also checked at 1440px. New diagrams inspected visually.
- All 16 cross-room links reached their intended rendered destinations. Writing
  showed 6 explicitly catalogued Feivel Speaks lyrics and 12 Wayspace lyrics;
  kind/theme combinations, empty results, and clearing the album filter passed.
- Lyric changes preserve all non-whitespace content except the two requested
  lowercase masks in Still Distracted. The four design-token files match source.
  All 10 Production data records match the baseline, apart from an added anchor.
- JavaScript syntax, static content checks, 74 sitemap URLs, the 1200x630 404 share
  image, and the case-study excluded-term scan passed. No console warnings/errors
  appeared in the local checks. No formal accessibility certification is implied.
- Local checks do not establish Netlify behavior. The new document redirects,
  sitemap, robots and 404 need live HTTP checks after an authorized deployment.
- No push or deployment. Prior HEAD at intake was `2a75b61` on `main`.

### Existing work and separate deliverable

The 18 pre-existing untracked files remain untouched: the Substack image variants,
`assets/puzzle-trio.svg`, and nine files under `tools/substack/`. Do not stage them.

The new `website-walk` skill was installed and validated in Codex's local skills
folder. It is outside this public repository and was not added to the public tool
selection. It audits read-only and uses Jack's Voice and Red Pen for editing review.

### What remains open

A public demonstration of an existing skill and artwork for the Wayspace arrival
remain proposals. The recommendation is a handoff walkthrough using this website's
own work, and a composition from the already separated Wayspace album artwork.
Neither has been built or authorized for publication.

The private source transcript was read in chat and is not copied into this repo.
Its final recorded check confirms two late gaps, not their final closure. The case
study states that evidence limit; do not convert the prediction into a verified result.

### Next action

Finish the cross-room navigation save point, then put the local preview in front of
Jack for review before asking for a publication go.
