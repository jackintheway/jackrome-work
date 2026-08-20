---
name: verify
description: Verify jackrome.work end to end, locally before commit and against the deploy after a push. Use after any change to the HTML pages, css/, assets/, or netlify.toml.
---

# Verifying jackrome.work

**The mechanics live in the user-level `verify-site` skill.** Serving,
the headless Chrome invocation, the macOS 500px clamp and its
workaround, the harness pattern, and how to read a curl sweep are all
there and are not repeated here. Read it, then use this for what this
site asserts.

## What this site is, for verification purposes

Eleven built pages. Four at the root (`/`, `/about`,
`/ai-enablement`, and the Wayspace landing), six Wayspace rooms, and
one lyric page under Writing.

**The four root pages carry zero JavaScript.** No script tag appears in
any of them, so there is nothing to drive there but nav links and
focus states.

**Everything under `/wayspace` runs `js/wayspace.js`** and this changed
on 2026-08-20. Each room's contents render from an array at
`DOMContentLoaded`, so a screenshot taken too early catches an empty
mount and looks broken when it is not. Use `--virtual-time-budget`, and
in a harness give the iframe a beat after `onload` before measuring.

Three behaviours only exist in that script and are worth driving in a
harness after any change to it:

- **A room renders its array.** Assert the mount has children, not just
  that the page loaded. A thrown error leaves an empty `<ul>` and a
  200.
- **The facade does not contact YouTube until clicked.** Assert the
  video page ships zero iframes on load, then click one and read the
  `src` it built. That standing rule is only enforced by this script.
- **The player is a room, not a page.** A cover's Play button swaps the
  source on `#roomAudio` and updates `#playerNow`, and a disabled
  button does nothing at all. Audio deliberately never survives a
  navigation, so there is no cross-page state to test.

Post-deploy still carries most of the weight, because redirects,
headers, and clean URLs come from `netlify.toml` and exist only on
Netlify.

Staging is `https://jackrome-work.netlify.app`. Production is still
Squarespace until the DNS cutover.

---

## Local

Serve on 8642 per `verify-site`, then screenshot each page:

```
/index.html   /about.html   /ai-enablement.html
/wayspace/index.html
/wayspace/music.html      /wayspace/video.html     /wayspace/design.html
/wayspace/podcasts.html   /wayspace/speaking.html
/wayspace/writing/index.html
/wayspace/writing/example-lyric.html
```

Writing is `wayspace/writing/index.html` rather than
`wayspace/writing.html` on purpose. The lyric pages live under
`/wayspace/writing/`, and a `writing.html` file beside a `writing/`
directory leaves Netlify to decide which answers `/wayspace/writing`.
An index file inside the directory removes the question.

Local paths carry the `.html`. The clean URLs are a Netlify behaviour
and are checked in the post-deploy sweep, not here.

Look for: nav renders and marks the current page, footer carries both
doorways, images have loaded, Archivo is rendering rather than the
fallback stack.

### Phone width

Every page works at 390px with no horizontal scroll. This is a
standing rule in CLAUDE.md, and it needs the iframe harness from
`verify-site`, since Chrome will not give a real 390px window.

Run all three pages, not just the one that changed. The nav and footer
are duplicated across pages by hand, so an overflow introduced in one
copy will not appear in the others.

---

## Head tags, per page

Every page ships link previews. The full required set is in CLAUDE.md.
Check the whole set on any page that was added or whose copy changed:

```bash
grep -E 'og:|twitter:|canonical|<title>|name="description"' index.html
```

Three that fail silently and are worth reading every time:

- `og:image` is an absolute URL.
- `twitter:card` is `summary_large_image`, not `summary`.
- Each page names its **own** share image, not a shared one.

## Shipped-content rules

The content rules (em dashes, Maryland not Frederick, no year in the
footer, external links opening in a new window, alt text) moved to the
`check-copy` skill in this repo on 2026-08-19. Run that alongside this
one after a copy change. This file stays about whether the site works.

---

## Post-deploy

Run after a push has finished deploying. Set the host once:

```bash
HOST="https://jackrome-work.netlify.app"   # production after cutover
```

### Reachability sweep

The clean URLs are the point of this list. If `/about` 404s but
`/about.html` works, `netlify.toml` is not doing what it should.

```bash
for p in / /about /ai-enablement \
         /css/styles.css /css/site.css /css/fonts.css \
         /css/tokens/colors.css /css/tokens/typography.css \
         /css/tokens/spacing.css /css/tokens/base.css \
         /assets/img/og-home.png /assets/img/og-about.png \
         /assets/img/og-ai-enablement.png; do
  printf '%-40s %s\n' "$p" \
    "$(curl -s -o /dev/null -w '%{http_code} %{content_type} %{size_download}b' \
       -L --max-time 15 "$HOST$p")"
done
```

The six CSS files after `styles.css` are the `@import` chain. Pages
link only `styles.css`, which is about 1KB; `site.css` holds the
actual 22KB of styling. A 404 on an import is silent, so checking the
linked file alone proves nothing.

### The og:image host substitution

Every page declares `og:image` as `https://jackrome.work/...`, which
is correct: the tag must point at production. But production is still
Squarespace, so **the literal URL in the tag returns 404 today**
(confirmed 2026-08-19). The sweep above checks the image path on
`$HOST` instead, which is the question that matters before cutover.

After the DNS cutover, `$HOST` and the tag agree and this stops being
a special case. Do not "fix" the tags to point at staging.

### Redirects

These need curl **without** `-L`, or you watch them succeed and learn
nothing:

```bash
for p in /home /ai /CLAUDE.md /INVENTORY.md /COPY.md /README.md; do
  printf '%-16s %s\n' "$p" \
    "$(curl -s -o /dev/null -w '%{http_code} -> %{redirect_url}' --max-time 15 "$HOST$p")"
done
```

Expected: `/home` 301 to `/`, `/ai` 301 to `https://ai.jackrome.work/`,
and each markdown file 302 to `/`. The markdown rules use `force`,
without which the real file wins and the markdown gets served as text.
Verified working 2026-08-19.

Add a line here whenever a new markdown file lands in the repo root.
Netlify's splat does not cover `*.md`, so each one needs its own rule.

### Headers

```bash
curl -sI --max-time 15 "$HOST/css/styles.css" | grep -i 'cache-control'
curl -sI --max-time 15 "$HOST/index.html"     | grep -i 'cache-control\|x-content-type\|referrer-policy'
```

Fonts, audio, and images are immutable for a year. HTML is
`max-age=0, must-revalidate`. If an HTML page comes back immutable,
a rule pattern is matching more than it should.

### 404s that are correct

**`/production` and `/creative-portfolio` return 404 on purpose.** The
first is linked from the nav and footer of every page and has not been
built. The second is the old Squarespace path and still needs a 301 in
`netlify.toml` before cutover.

Report them as known, not as failures. Once `/production` ships, move
it into the reachability sweep above and delete it from this list.

**`/wayspace` came off this list on 2026-08-20.** Add these to the
reachability sweep on the next deploy, and read the clean URLs
carefully: this is the first part of the site with a nested path, so
`/wayspace/writing` resolving is the check that proves the directory
form works the way the flat pages do.

```
/wayspace  /wayspace/music  /wayspace/video  /wayspace/design
/wayspace/podcasts  /wayspace/speaking  /wayspace/writing
/wayspace/writing/example-lyric
/css/wayspace.css  /js/wayspace.js
/assets/img/wayspace-straight.svg
/assets/img/og-wayspace.png
```
