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

Jack approved a portable orientation for `claude-code-projects` and a shared
handoff for this website. Projects can be worked on by either Claude Code or Codex
without moving them between workspaces. This session establishes that continuity;
no website design or content changes were requested.

### Changes in this checkpoint

- Added the parent folder's `AGENTS.md` on The Key. It travels with the drive but
  is outside this repository and is not included in the website's Git history.
- Added this repository's `AGENTS.md` for Codex and other visiting agents.
- Added the shared handoff and a start-of-session pointer near the top of
  `CLAUDE.md`. Existing project history and decisions remain intact.

### Baseline and publication state

- Branch at intake: `main`. HEAD and the local `origin/main` ref both pointed to
  `43da541f4eaaa98c26f032b9ecf8525ba506fbf5`. No fetch or live-site check was run.
- Recent commits already include September 12 AI Enablement copy and AI Portfolio
  and case-study refinements. Some August status notes in `CLAUDE.md` and `README.md`
  predate that work; verify them before treating them as current tasks.
- This checkpoint accompanies the local documentation save point titled
  `Add shared guidance and handoff for Claude Code and Codex`.
  Find its hash with `git log -1 --format='%h %s' -- HANDOFF.md`.
- No push or deployment was performed for this setup. Publication remains pending
  Jack's go; the live site was not verified in this session.

### Existing work to preserve

At intake there were no tracked modifications, but 18 untracked files were already
present: `assets/img/substack-banner-{a,b,c,d,e}.png`,
`assets/img/substack-cover-{f,g,h}.png`, `assets/puzzle-trio.svg`, and nine files
under `tools/substack/` (its README and eight HTML sources). These were left
untouched and excluded from the documentation commit. Their completion and
publication status have not been assessed.

### Verification and next step

Documentation checks cover file references, whitespace, preservation of the
existing `CLAUDE.md` body, and the exact files included in the save point. No
website code changed, so no browser or application tests were needed.

The setup is complete. Continue with the website evaluation or change Jack selects
next. No particular redesign, content revision, old deadline, or deployment has
been authorized by this handoff.
