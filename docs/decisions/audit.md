# The workflow audit readiness assessment (built and published 2026-09-13)

Moved out of `CLAUDE.md` on 2026-10-11 during an instruction-file audit, so it loads only when a task touches it. Dated decisions; verify against the current files before acting on them.

Live at `https://audit.jackrome.work/`, also served at `/audit`. Linked from
AI Enablement ("What it's for") and the AI Portfolio ("How this works with
clients"). Preparation package and product decisions live in
`../ai-opportunity-assessment-review/` (DECISIONS.md, BUILD-SPEC.md); this
section records only what the website side settled.

- **The site publishes `_site/`, assembled by `tools/build-site.py` from an
  allowlist.** Netlify requires the functions directory outside the publish
  directory. Add new public pages or folders to the allowlist or they do not
  deploy. `_site/` is gitignored output.
- **One serverless function**, `netlify/functions/score/`, with the shared
  answer schema in `audit/schema.mjs` imported by both browser and function.
  Mock model, memory store, and memory inbox for local preview
  (`node tools/audit-dev.mjs`, port 8642); real Anthropic provider, Netlify
  Blobs, and Netlify Forms in production. `OPERATOR.md` beside the function
  is the running guide (keys, env var names, retention, export).
- **The deploy context is stamped at build time** into
  `lib/context.generated.mjs` because Netlify's CONTEXT variable is absent
  from the function runtime. Without the stamp, records go to the preview
  store. Do not remove that step from `build-site.py`.
- **The subdomain uses one forced root rewrite**, not a catch-all. Netlify
  rejects rules whose source begins with `/.netlify`, and a catch-all could
  shadow the function. `force` is required because `index.html` exists at
  the root. Every other path on the subdomain resolves as on the main site.
- **The summary email is a two-layer Forms submission**: signed scannable
  fields, then every answer verbatim. The function sends a `subject` field,
  so the Netlify notification's custom subject must stay blank.
- **Rate limit** is code-defined on the function: 60 per 60 seconds per IP.
  Observed live: 69 of 90 burst requests allowed, then 429s.
- **Secrets** live in Netlify as production-only secret variables; the plan
  cannot scope them to Functions and that was accepted. The Anthropic key
  expires 2027-09-19. Pilot keys were deleted after use.
- **Copy rules carried over**: the page's absolute links to `jackrome.work`
  open in the same tab; the subdomain is the same site.
- **Deferred by choice**: a visitor result email, a nav link, the Wayspace
  design pass on the form, a portfolio entry once real use gives it a story,
  and a model-backed upgrade of the site's "Find something" guide.
