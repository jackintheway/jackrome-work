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

**Lyric pages are an exception, and the only one.** As of 2026-08-23
three em dashes stand inside song lyrics: `choose-again`, `poof`, and
`strawberry-sauce-all-the-same`. The rule governs copy written for this
site. A lyric is quoted work, and repunctuating one to satisfy a house
style would be editing Jack's art. They stay.

Checking this needs more than a line filter. `.lyric-body` is
`white-space: pre-line`, so a lyric runs across many lines inside one
paragraph and the line carrying the dash does not carry the class.
Grepping for the class and inverting it misses every one of them.

```bash
python3 - <<'EOF'
import pathlib, re
bad = []
for f in pathlib.Path(".").rglob("*.html"):
    if any(x in f.parts for x in (".git", "_source")): continue
    t = f.read_text(errors="ignore")
    outside = re.sub(r'<p class="lyric-body">.*?</p>', "", t, flags=re.S)
    if "\u2014" in outside: bad.append(str(f))
print("\n".join(bad) or "clean")
EOF
```

A hit on a lyric page **outside** a `lyric-body` paragraph is a real
failure: it means annotation or generated copy has leaked in, not that
Jack wrote a dash.

**The `tokens` exclusion is the whole design of this check.** Without
it, it reports 10 hits that are all correct and will never be fixed,
all in `css/tokens/`, vendored verbatim from the Wayspace design
system export. A check that cries wolf 10 times is a check nobody runs.

Verified 2026-08-19: with the exclusion in place this returns nothing.
Those four token files are vendored verbatim from the design system,
which is worth keeping true. If a value needs changing, change
it in the design system and re-copy. Never edit them in place.

## 2. Location is Maryland, never Frederick

```bash
grep -rn 'Frederick' *.html tools/og/ js/*.js | grep -v 'Potters Guild of Frederick'
```

The rule is about **how Jack's own location is described**, so a client
whose registered name contains the word is not a violation of it.

**Potters Guild of Frederick is excluded and must never be flagged.**
It is a client's actual organisation name, carried on three entries in
`js/production.js`, and it cannot be rewritten without misnaming them.
Nothing about it describes where Jack is.

Verified 2026-08-22: with that exclusion the check returns nothing
across pages, share cards, and the render scripts. Note the search now
covers `js/` too: `/production` builds its cards from an array, so copy
that reaches a visitor no longer lives only in HTML.

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

**"Potters Guild of Frederick" in `js/production.js` is a client name
and stays.** See check 2 above for the reasoning.

**"Fuel Cycle" in `about.html` and `COPY.md` is correct and stays.** It
is Jack's own bio, linked to `fuelcycle.com`, and it is there by his
choice. It is not a sanitization target and there is no sanitization
pass pending on this repo. The sibling portfolio project had one; this
one does not.

---

## When this runs

On any change to page copy, meta tags, or `tools/og/` sources. Local,
cheap, no server and no deploy.
