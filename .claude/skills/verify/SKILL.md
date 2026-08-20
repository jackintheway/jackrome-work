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

Three built pages, `/`, `/about`, `/ai-enablement`, and **zero
JavaScript**. No script tag appears in any page. So there are no
filters, no modal, and no click behaviour to drive. The interaction
surface is nav links and focus states.

That makes this site lopsided compared to `../ai-work-portfolio/`: the
local motion is mostly rendering, and **most of the real verification
is post-deploy**, because redirects, headers, and clean URLs come from
`netlify.toml` and exist only on Netlify.

Staging is `https://jackrome-work.netlify.app`. Production is still
Squarespace until the DNS cutover.

---

## Local

Serve on 8642 per `verify-site`, then screenshot each page:

```
/index.html   /about.html   /ai-enablement.html
```

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

## External links open in a new window

Standing rule: anything leaving `jackrome.work` gets
`target="_blank"` paired with `rel="noopener"`. `ai.jackrome.work`
counts as leaving. This finds any anchor missing either:

```bash
grep -ohE '<a [^>]*href="https?://[^"]*"[^>]*>' *.html | while read -r a; do
  case "$a" in *'target="_blank"'*) t=ok;; *) t=NO-TARGET;; esac
  case "$a" in *noopener*) r=ok;; *) r=NO-REL;; esac
  [ "$t$r" = "okok" ] || echo "$t $r :: $a"
done
```

Silence is a pass. All external anchors complied as of 2026-08-19.

Note: this is a shipped-content rule rather than a rendering check, so
if the content-rule checker gets built as its own skill, this moves
there. It lives here for now because nothing else checks it.

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

**`/production`, `/wayspace`, and `/creative-portfolio` return 404 on
purpose.** The first two are linked from the nav and footer of all
three pages and have not been built. The third is the old Squarespace
path and still needs a 301 in `netlify.toml` before cutover.

Report them as known, not as failures. Once either page ships, move it
into the reachability sweep above and delete it from this list.
