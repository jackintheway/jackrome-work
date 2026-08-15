# jackrome.work: URL and embed inventory

Captured 2026-08-14 by crawling the live site from `sitemap.xml`.

This is the "now, cheap" step. It pays off either way: if Jack stays on Squarespace it feeds URL Mappings and an SEO cleanup, and if he migrates it becomes the `netlify.toml` redirect table and the asset checklist. Nothing here commits to a migration.

Re-run the capture any time the site changes. The raw crawl is not kept in this repo, only this summary.

---

## The headline

The site is much smaller than it feels.

| | Count |
|---|---|
| Live URLs | 11 |
| Pages with any embed | 4 |
| Total embeds site-wide | 11 |
| Unique images site-wide | 19 |
| Products in the store | 0 |

The creative portfolio was assumed to be the hard part because of the embeds. It has **8 embeds and 27 image slots drawing on a shared pool of about 19 files**. That is one afternoon of work, not a project phase. The genuinely slow part of a migration would be copy and layout decisions, not media.

---

## URL inventory

All 11 URLs from `https://jackrome.work/sitemap.xml`:

| URL | In main nav | Notes |
|---|---|---|
| `/` (`/home`) | yes | Resolves from both `/` and `/home` |
| `/about` | yes | |
| `/ai-enablement` | yes | |
| `/creative-portfolio` | yes | The media-heavy page |
| `/toolbox` | no | Orphaned from nav. Metadata says "About" (see Problems) |
| `/store` | no | Orphaned from nav. Zero products |
| `/blog` | no | Orphaned from nav. Titled "Blog 2" |
| `/blog/ai-collaboration-manifesto` | no | |
| `/blog/five-question-test` | no | |
| `/blog/the-anchor-list` | no | |
| `/blog/category/Toolbox` | no | Auto-generated category page |
| `/cart` | yes | Squarespace system page, would not survive a migration |

Every page links out to `ai.jackrome.work`, so the hub-to-portfolio doorway is wired site-wide. `ai.jackrome.work` links back to `jackrome.work` from its back bar. That loop is intact.

---

## Embed inventory

Eleven embeds total. All are iframes, all portable, none depend on Squarespace.

**`/creative-portfolio`** (8 embeds)

| Type | ID |
|---|---|
| YouTube | `7BUpglBYMOM` |
| YouTube | `cJBdDMDlxO0` |
| YouTube | `dJW0L1vf-ok` |
| YouTube | `yDMLz98yCPE` |
| Spotify album | `1OB9gw1iLw29cvNIzGGzsE` |
| Spotify album | `6P9hhxcT0jzRPf6fsyoyDj` |
| Spotify episode | `5CEOcyls4sH91N5ktCqJRj` |
| Spotify episode | `5TTcflshHwsPISephp8tKm` |

**Blog posts** (1 embed each)

| Page | YouTube ID |
|---|---|
| `/blog/ai-collaboration-manifesto` | `AYzzTeSOF4Q` |
| `/blog/five-question-test` | `JqER4CwcBVw` |
| `/blog/the-anchor-list` | `KEpVkkXSlJ4` |

Also referenced, not embedded: `youtube.com/@jackintheway` and `youtu.be/T46ZcGmdbn4` as plain links.

No Vimeo, SoundCloud, Bandcamp, or Apple Music anywhere on the site.

**Migration note.** Eight live iframes on one page is slow. If `/creative-portfolio` is rebuilt, use a facade: ship the thumbnail as a static image and swap in the real iframe on click. The page gets faster than the Squarespace version and no third party is contacted until the visitor asks for it.

---

## Image inventory

19 unique content images plus a favicon, all on `images.squarespace-cdn.com`. Grouped by what they are:

**Music and release artwork** (7): `SAW-ARTWORK-3000PX.jpg`, `WAYSPACE+ARTWORK3000px.jpg`, `Wayspace-Cover-Final.jpg`, `ALL-IN-MY-HEAD.jpg`, `HOW-IT-ENDS.jpg`, `LITTLE-THINGS.jpg`, `SALT.jpg`, `Answers_Cover.jpg`

**Podcast and events** (2): `Podcast+Artwork+Final.jpg`, `Counselor+Campfire+POAP.png`

**Blog and toolbox** (3): `The+Anchor+List.png`, `Puzzle-Pieces-Trio.jpg`, `AI+Alignment--Title+Pending.png`

**Portrait and brand** (2): `Jack-Outside-2023.png`, `The-Way-Found-Me-Image.png`

**Screenshots, dated 2023-06-14** (3): `Screen+Shot+2023-06-14+at+5.18.51+PM.jpg`, `...5.20.08+PM.jpg`, `...5.21.28+PM.jpg`

**Unnamed** (1): `image-asset (6).jpeg`

**Two things to do before any migration.** The three `Screen Shot` files and `image-asset (6)` are placeholder-grade filenames that will be meaningless in a repo, so rename them at export. And export originals from the Squarespace asset manager, not the CDN URLs on the page, since the page serves resized derivatives and the originals are what you want to keep.

---

## Problems found in the current site

These are real and independent of any migration. Every one is fixable in Squarespace today.

**1. Link previews use the small card format.** Every page sets `twitter:card` to `summary` rather than `summary_large_image`. That is the difference between a small square thumbnail beside the text and a full-width banner image. This is the single highest-impact fix on the list.

**2. Nine of eleven pages share one share image.** `The-Way-Found-Me-Image.png` is the `og:image` for home, about, ai-enablement, blog, store, and toolbox. Sharing any of them produces a visually identical card. Only the three blog posts and the creative portfolio have their own.

**3. `og:image` URLs are served over `http://`, not `https://`.** Sloppy, and some platforms decline to load insecure images into a secure preview.

**4. `/toolbox` carries the wrong metadata entirely.** Its `<title>` and `og:title` both read "About", and its description is old positioning copy ("coach, creator and consultant using multi-dimensional creativity"). The page was almost certainly duplicated from `/about` and never re-titled. It shares as the wrong page.

**5. `/blog` is publicly titled "Blog 2".** An internal working name is leaking into the tab title and every share of that URL.

**6. `/blog` and `/store` have empty meta descriptions.** Search engines will invent one from page text.

**7. Blog posts carry stale geodata.** All three set `og:latitude` / `og:longitude` to `40.7207559, -74.0007613`, which is lower Manhattan. Squarespace default, not Frederick. Harmless, but wrong.

**8. Three orphaned pages.** `/toolbox`, `/store`, and `/blog` are live and indexed but reachable from no main nav link. `/store` has zero products. Decide for each: link it, redirect it, or unpublish it.

---

## Suggested URL Mappings (Squarespace, today)

Settings → Advanced → URL Mappings. Vanity paths for print, talks, and email signatures:

```
/ai -> https://ai.jackrome.work 301
```

If `/store` is retired rather than stocked:

```
/store -> / 301
```

Both are reversible. A mapping only fires for a path that does not already exist as a real page.

---

## If a migration happens: the redirect table

The same inventory becomes `netlify.toml`. Paths carry over one-to-one, so no redirects are strictly required for the ten content URLs. What needs handling:

- `/home` should 301 to `/`, since Squarespace answers both.
- `/cart` and `/blog/category/Toolbox` are platform-generated and have no successor. Redirect to `/` or let them 404 deliberately.
- Anything retired during the rebuild needs a mapping so saved links survive.

---

## Related

- `../ai-work-portfolio/` is the proven build pattern and the design reference.
- `../wayspace-design-system/` is the token source of truth.
- Squarespace has no content API. Its developer APIs cover commerce only. Content moves by hand or not at all.
