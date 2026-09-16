# jackrome.work

A custom rebuild of `jackrome.work`, replacing Squarespace. Static HTML, CSS, and vanilla JS on the Wayspace design system, deployed to Netlify.

**Live at `https://jackrome.work`** since 2026-08-24. See `CLAUDE.md` for how the cutover was done.

## Running it

There is no compile step. Serve the repo root over HTTP:

```
python3 -m http.server 8000
```

Then open `http://localhost:8000`. Opening `index.html` as a `file://` path will not work, because the CSS uses `@import` and the browser blocks those across the file protocol.

Note that clean URLs like `/about` are a Netlify behavior, not a Python one. Locally those paths need the `.html` on the end.

## Layout

```
index.html            home
css/
  styles.css          the only stylesheet a page links; imports the rest
  tokens/             copied verbatim from the Wayspace design system.
                      Do not edit. Change the system and re-copy.
  fonts.css           ships Archivo, overrides the two family tokens
  site.css            this site's own components
assets/
  fonts/              Archivo, self-hosted, with its OFL licence text
  img/                web-sized images and the per-page share cards
tools/og/             sources for the 1200x630 share images
netlify.toml          deploy config, headers, redirects
tools/build-site.py   assembles _site/ (the publish folder) from an allowlist
netlify/functions/    serverless function source, never published as static files
INVENTORY.md          crawl of the live Squarespace site
CLAUDE.md             project context and the decisions already made
```

Full-resolution originals and audio masters live in `_source/`, which is gitignored. What ships is the web-sized derivative.

## The workflow audit readiness assessment

Live at [audit.jackrome.work](https://audit.jackrome.work/). Part of the jackrome.work site; the code lives in `audit/` (page) and `netlify/functions/score/` (function).

A five-stage assessment for people at mission-driven organizations. A visitor describes one recurring task, answers a short set of structured questions, and gets a readiness score with a plain-language explanation. The score measures how ready that description is for an audit conversation. It does not claim AI feasibility, savings, or ROI.

### Architecture

One serverless function on Netlify does all of the work. The browser posts the answers to `/.netlify/functions/score` and never contacts Anthropic. The API key is a secret, production-scoped Netlify environment variable. The scoring rubric, the classifier prompt, and storage all sit behind that same boundary, and the function returns only the public result, never the raw answers or internal flags.

```
browser (audit/)                netlify/functions/score/
  five stages, in-memory   ->   validate against the shared schema
  answers, one POST             classify Q5 with the model (structured output)
                                score deterministically in code
                                store one immutable record (Netlify Blobs)
                                post a signed summary (Netlify Forms)
                           <-   public result only
```

**The publish boundary.** The site publishes an assembled `_site/` folder built from an explicit allowlist (`tools/build-site.py`), because Netlify requires function source to live outside the publish directory. Function source, prompts, fixtures, and tooling are never served as static files. Verified live: those paths return 404.

**The model does one narrow job.** It classifies how specifically a task is described, on a four-level rubric, and picks one optional follow-up question type. Both calls use structured outputs (`@anthropic-ai/sdk` with a zod schema), `temperature: 0`, no retries, and hard deadlines. The function checks that any evidence excerpt the model returns actually appears in the visitor's text. Every point on the 100-point score is computed in code from the classifier level and the structured answers; the model never produces a number.

**Failure is a designed path.** If the model times out, refuses, or returns something invalid, the record is still saved and the visitor sees an unscored result with the booking link. An `AI_ENABLED` switch turns the model off entirely. A monthly spend limit on the Anthropic workspace is the hard ceiling; a Netlify rate limit (60 per 60 seconds per IP) bounds request volume.

**Data handling.** The page discloses what goes where before the visitor submits: only the task description and follow-up answer go to Anthropic; the full record is stored on Netlify; a copy is emailed to Jack through Netlify Forms. Unconverted records are deleted within about 90 days at a monthly review, with tooling (`tools/audit-export.mjs`) to list, export, verify, and delete. Nothing deletes automatically. Operator notes: `netlify/functions/score/OPERATOR.md`.

### How it was built

In Claude Code, the same way as the rest of the site. A local dev server (`node tools/audit-dev.mjs`) mounts the real function with a stand-in model, an in-memory store, and an in-memory inbox, so every band and failure state can be reviewed without a key. Tests (`node --test tools/test-audit.mjs`) run the real handler: the rubric across all 5,760 arithmetic combinations, thirteen calibration cases, exact round-tripping of free text, retry replay and conflict, the unscored paths, honeypot, origin and size limits, and a fake storage client that lies about success. A live pilot ran the calibration cases three times each against the real model before any deploy, and a second pilot after a prompt revision reached full agreement with the reviewed labels.

### Running it locally

```
npm install
node tools/audit-dev.mjs        # http://localhost:8642/audit/
node --test tools/test-audit.mjs
```

Type `[level:3]`, `[level:1]`, or `[fail]` into the task description to steer the stand-in model.

## What Netlify publishes (changed 2026-09-13)

Netlify no longer publishes the repo root. On each deploy it runs
`python3 tools/build-site.py --check`, which copies an explicit allowlist of
public files and folders into `_site/` and publishes that. Netlify requires the
functions directory to sit outside the publish directory, or function source
ships as static files; publishing the root made that impossible once the site
needed a serverless function.

The allowlist lives at the top of the script. When a new public page or asset
folder lands beside the HTML, add it there or it will not deploy. Everything
else (function source, prompts, fixtures, `tools/`, project notes, private
exports) stays out of the deploy by construction.

Run the same command locally to see exactly what would ship and to confirm
every copied file matches its source. Warnings name local files that differ from
the commit Netlify would build from. `_site/` is gitignored output.

## Scope and discovery

75 public content pages: six root pages, six Wayspace rooms, two case studies, and
61 lyric pages. `404.html` is the separate recovery page for missing URLs.
The creative catalogues render from `js/wayspace.js`; each room stays independently
curated. Cross-room entry links use authored anchors that should survive title edits.
Writing accepts `?collection=wayspace` or `?collection=feivel-speaks` to open the
explicitly catalogued lyrics for that album.

After adding or removing a public page, refresh the sitemap:

```
python3 tools/update-sitemap.py
```

The script uses each page's canonical URL, excludes `noindex` pages, and fails on
missing or duplicate canonicals. `robots.txt` links to the result. There is still no
compile step. Netlify picks up `404.html` for missing paths and applies the document
redirects from `netlify.toml`; a basic Python server does not emulate those rules.


## Find something

The shared header opens a browser search panel. It returns up to three links as
someone types, with "Email me" when it cannot find a close match. Queries stay in
memory on the current page. No AI service, query logging, or account is involved.
The guide loads only after someone opens it; normal navigation works independently.

After public copy or catalogue changes, refresh the checked-in index:

```
python3 tools/build-guide-index.py
python3 tools/build-guide-index.py --check
node --test tools/test-guide-search.mjs
```

The generator needs Python 3 and Node. It reads only canonical pages listed in the
sitemap and the public arrays in js/wayspace.js and js/production.js. It checks
paths and section anchors. Lyrics are discoverable through titles and catalogue
metadata, not their full text. tools/guide-destinations.json supplies selected
section links and topic vocabulary. Add durable anchors to new catalogue entries.
Private archives, exhibits, and project instructions are never index sources.

The UI lives in js/site-guide.js and css/site-guide.css; js/guide-search.js holds
the matching rules. MiniSearch 7.2.0 is vendored with its license under js/vendor/.
The guide matches words and topics, so it can miss questions phrased differently.
Its example-query tests cover key routes, typos, unsupported requests, and result
limits. Questions about pricing or current availability are directed to email.

The AI Portfolio opening and metadata now use "How I work with AI." Its share-card
source remains tools/og/card-ai-portfolio.html; render.sh writes the versioned
og-ai-portfolio-v2.png so the previously published immutable image stays intact.

## The recorded handoff and Wayspace arrival

`ai-portfolio.html#handoff-demo` presents the saved September 12 link-update checkpoint.
Keep it dated as an example; its publication status is historical. `js/handoff-demo.js`
reveals the steps and copies the note. Without scripts, all three steps remain readable.

The landing's artwork is built from the existing registered PNGs in `_source/`.
Its web exports already ship in `assets/img/arrival/`; running the site needs no Python
packages. Re-exporting requires Pillow:

```
python3 tools/export-arrival-art.py
```

Images are cached as immutable on the host. Before revising a published export, bump
`VERSION` in the exporter and update the image paths in `wayspace.html`. Do not overwrite
published `v1` files with different art. The source canvases must stay aligned and square.
Motion is confined to `js/wayspace-arrival.js` and the landing styles in `css/wayspace.css`.
CSS timelines move the artwork independently of scrolling. Hover pauses the artwork
and its two puzzle marks; the keyboard pause button appears on focus. Motion stays
off with coarse pointers and under reduced motion. Below 800px the artwork figure,
caption, and puzzle marks are hidden; the welcome leads directly into the rooms.
The "Choose a room" shortcut is removed. The wider layout stays in normal document
flow. The marks reuse `assets/puzzle-single.svg`.

## Standing rules

Every page ships with Open Graph tags and its own 1200x630 share image. Not a polish-pass item. The details, and the three things that fail silently, are in `CLAUDE.md`.

This site carries the pattern that `ai-work-portfolio` proved before it (static HTML, one data array, pure render functions, Netlify). That project was deleted from Jack's machines on 2026-09-14; only its record survives at `../x-archive/ai-work-portfolio/`. `../wayspace-design-system/` is the token source of truth.
