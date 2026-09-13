# jackrome.work

A custom rebuild of `jackrome.work`, replacing Squarespace. Static HTML, CSS, and vanilla JS on the Wayspace design system, deployed to Netlify.

**Live at `https://jackrome.work`** since 2026-08-24. See `CLAUDE.md` for how the cutover was done.

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
build step. Netlify picks up `404.html` for missing paths and applies the document
redirects from `netlify.toml`; a basic Python server does not emulate those rules.

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

`../ai-work-portfolio/` is the proven pattern and the design reference. `../wayspace-design-system/` is the token source of truth.
