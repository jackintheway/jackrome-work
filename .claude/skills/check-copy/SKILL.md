---
name: check-copy
description: Check the shipped copy of jackrome.work against the content rules in CLAUDE.md: no em dashes, Maryland not Frederick, no year in the footer, external links open in a new window, every image has alt text. Use after any change to page copy.
---

# Checking jackrome.work's shipped copy

These rules are all written in CLAUDE.md and none of them had a
checker. This is the checker. It answers "does the copy follow the
rules", which is a different question from `verify`'s "does the site
work", and it wants running on a copy edit that touches no CSS at all.

Every check below is a grep whose pass condition is **silence**,
except the alt text one, which is noted where it differs.

---

## 1. No em dashes

The rule covers visible text, `<title>`, and meta descriptions.

```bash
grep -rn '—' . --exclude-dir=.git --exclude-dir=_source \
  --exclude-dir=tokens --exclude-dir=.claude
```

`.claude` is excluded because this file contains the character it is
searching for, in the line above. Without it the check reports itself,
forever, which is the exact failure it exists to avoid.

**The `tokens` exclusion is the whole design of this check.** Without
it, it reports 10 hits that are all correct and will never be fixed,
all in `css/tokens/`, vendored verbatim from the Wayspace design
system export. A check that cries wolf 10 times is a check nobody runs.

Verified 2026-08-19: with the exclusion in place this returns nothing.
Those four token files are byte-identical to `../ai-work-portfolio/`'s
copies, which is worth keeping true. If a value needs changing, change
it in the design system and re-copy. Never edit them in place.

## 2. Location is Maryland, never Frederick

```bash
grep -rn 'Frederick' *.html
```

Applies to visible copy, meta descriptions, and share card text, so
check the OG sources too when one changes:

```bash
grep -rn 'Frederick' tools/og/
```

Verified 2026-08-19: nothing in either.

## 3. No year in the footer

The rule is about a dated footer, which starts aging the site the
moment the year turns and earns nothing.

```bash
sed -n '/<footer/,/<\/footer>/p' *.html | grep -nE '©|&copy;|\b(19|20)[0-9]{2}\b'
```

**Scoped to the footer on purpose.** A repo-wide year grep returns
four hits that are all fine: two image filenames
(`jack-outside-2023.jpg`, `jack-2025.jpg`), and "freelancing since
2016" in the About copy and the meta description, which is biography,
not a datestamp. Those do not age the site and must not be flagged.

Verified 2026-08-19: footers carry name, tagline, Maryland, and four
links, with no year and no copyright line.

## 4. External links open in a new window

Standing rule: anything leaving `jackrome.work` gets `target="_blank"`
paired with `rel="noopener"`. `ai.jackrome.work` counts as leaving.
Without `rel="noopener"` the opened page gets a handle on this one
through `window.opener` and can redirect it somewhere else.

```bash
grep -ohE '<a [^>]*href="https?://[^"]*"[^>]*>' *.html | while read -r a; do
  case "$a" in *'target="_blank"'*) t=ok;; *) t=NO-TARGET;; esac
  case "$a" in *noopener*) r=ok;; *) r=NO-REL;; esac
  [ "$t$r" = "okok" ] || echo "$t $r :: $a"
done
```

Verified 2026-08-19: all external anchors comply. Moved here from
`verify` on the same date.

## 5. Every image has alt text

```bash
grep -ohE '<img [^>]*>' *.html | grep -v 'alt='
```

Silence is a pass. Decorative images take `alt=""`, which satisfies
this grep, so a hit means the attribute is missing entirely rather
than deliberately empty.

Verified 2026-08-19: nothing missing.

---

## What is approved and must never be flagged

**"Fuel Cycle" in `about.html` and `COPY.md` is correct and stays.** It
is Jack's own bio, linked to `fuelcycle.com`, and it is there by his
choice. It is not a sanitization target and there is no sanitization
pass pending on this repo. The sibling portfolio project had one; this
one does not.

---

## When this runs

On any change to page copy, meta tags, or `tools/og/` sources. Local,
cheap, no server and no deploy.
