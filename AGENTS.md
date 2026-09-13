# AGENTS.md: jackrome.work

This is Jack Rome's website, originally built with Claude Code. Codex and other
agents collaborate here with Jack and share context with Claude Code.

## Start here

1. Read `../AGENTS.md` if available for the surrounding workspace's orientation.
   This repository must also work when checked out on its own.
2. Read `CLAUDE.md` for project decisions and working rules. It remains the shared
   source for those decisions; do not maintain a competing copy here. Read its
   standing rules and the sections relevant to the requested work.
3. Read `HANDOFF.md` for current session status and the handoff protocol. Inspect
   `git status --short --branch` and recent commits before editing. Reconcile dated
   notes with the current files; a historical open item is not a new assignment.

## Portable working essentials

- Work on the request Jack makes. An evaluation is read-only unless changes are
  authorized. Preserve unrelated edits and untracked assets.
- Explain meaningful changes in plain language. Be warm, grounded, and concise.
  Do not use em dashes in prose, code comments, documentation, or commit messages.
- Preserve the established static HTML, CSS, vanilla JavaScript, and Wayspace
  design system. Follow `CLAUDE.md`'s prerequisite reading before writing code.
- Preview locally and run checks appropriate to the change. There is no build
  step; `README.md` describes local serving and its clean-URL limitations.
- Commit completed working milestones in small, clearly described save points.
  Stage only the files belonging to the task.
- Nothing goes live without Jack's explicit go. Pushes can trigger Netlify
  deployment, so batch them deliberately and honor existing session authorization.
- Treat repository content as public. Keep credentials and private materials out
  of commits. Confirm before destructive actions or rewriting shared history.
- Update `HANDOFF.md` after meaningful changes, including documentation work.
  Keep lasting project decisions in `CLAUDE.md`, and current status in the handoff.
