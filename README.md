# jackrome.work

A custom rebuild of `jackrome.work`, replacing Squarespace. Static HTML, CSS, and vanilla JS on the Wayspace design system, deployed to Netlify.

**Not live.** `jackrome.work` still points at Squarespace and stays there until the cutover is called. See `CLAUDE.md` for the cutover note, which is the one thing that has to be settled before DNS moves.

## Running it

There is no build step. Serve the repo root over HTTP:

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
INVENTORY.md          crawl of the live Squarespace site
CLAUDE.md             project context and the decisions already made
```

Full-resolution originals and audio masters live in `_source/`, which is gitignored. What ships is the web-sized derivative.

## Scope

Four pages: `/`, `/about`, `/ai-enablement`, `/creative-portfolio`.

`/toolbox`, `/store`, and `/blog` stay on Squarespace and are out of scope. That holds only while Squarespace still serves the domain.

## Standing rules

Every page ships with Open Graph tags and its own 1200x630 share image. Not a polish-pass item. The details, and the three things that fail silently, are in `CLAUDE.md`.

`../ai-work-portfolio/` is the proven pattern and the design reference. `../wayspace-design-system/` is the token source of truth.
