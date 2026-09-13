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

Jack approved the editorial recommendations based on his original video,
Artificial Intelligence Meets Spirituality (YouTube AYzzTeSOF4Q). Added a short
portfolio paragraph after his existing opening sentence: thinking aloud, asking
what might be missing, and continuing to edit. Teaching on AI Enablement now
explains practicing with the team's work and existing context, asking follow-up
questions, checking results, and discussing risks. The portfolio's curation
section has an optional link to the 48-minute video as personal background.

The new copy is a source-grounded draft, not a quotation. Spoken examples at
4:17, 9:08, and 26:30 inform the collaborative process. The example at 34:43
supports the importance of existing material. The video identifies the formal
manifesto as AI-assisted around 44:02; Gemini's summary was not used. The full
auto-caption transcript stays in the temporary export outside this repository.

Refreshed js/guide-index.json after the copy changes. All 24 existing search
tests and the current-index check pass. Copy, unique IDs, accessible label
references, external-link attributes, share-image references, and whitespace
checks passed. Browser inspection confirmed the new introduction and video
invitation in context. Both changed pages were measured at 390px without
horizontal overflow; the teaching card fits. No CSS, hero, share-card, service
boundary, or case-study changes were needed. Voice review found no new flags.
The temporary phone harness was removed.

Intake HEAD was baf6fc3 on main. This checkpoint accompanies the local
collaboration-copy save point. Nothing pushed or deployed. Main preview:
http://127.0.0.1:56064. The earlier site-guide implementation remains in baf6fc3;
README.md documents its public index and checks. The two case studies and their
opening/navigation changes remain approved by Jack.

The pre-existing separate-exhibit handoff and Jack's updated
assets/img/wayspace-straight.svg remain untouched and unstaged. The 18 unrelated
untracked Substack and puzzle files remain untouched. Private exhibits stay
ignored. Next: Jack can review the new copy locally. Publish only on his explicit
go, then verify the deployed revision and host-specific behavior.
