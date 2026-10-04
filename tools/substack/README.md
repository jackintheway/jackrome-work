# Substack image sources

The header image for `jackintheway.substack.com`. It sits at the top of the
publication and at the top of every email that goes out. Generated from the
HTML here rather than drawn by hand, for the same reason as the OG cards in
`tools/og/`: it pulls real tokens and the real Archivo file, so it stays on
the design system and any text change is a one-line edit.

Two surfaces, two sizes.

**Email header, 1100x220.** Sits at the top of the publication and at the top
of every email. Five variants; **`banner-e.html` is the one currently shipped.**

| File | Treatment |
|---|---|
| `banner-a.html` | Brown field, name only, puzzle mark right. |
| `banner-b.html` | Same brown field with an eyebrow above the name. |
| `banner-c.html` | Orange field, name and URL split by a rule. The rule collapses at this ratio; not recommended. |
| `banner-d.html` | `banner-b` layout on the orange field, black type, yellow offset. |
| `banner-e.html` | `banner-d` with a three-noun eyebrow: spirituality, technology, creativity. **Live.** |

**Publication cover, 1344x256.** Substack accepts 3:2 through 21:4 and asks for
at least 1344x256, which is itself exactly 21:4. Both covers render at
`--force-device-scale-factor=2`, so the file is 2688x512 and stays crisp on
retina while holding the ratio. **`cover-h.html` is the one currently shipped.**

| File | Treatment |
|---|---|
| `cover-f.html` | `banner-e` scaled to the cover. Leaves a wide empty field between the name and the mark. |
| `cover-g.html` | Three-line lockup: eyebrow, name, tagline. Fills the strip with text. |
| `cover-h.html` | Eyebrow and name left, `puzzle-trio` spanning the right. **Live.** |

`puzzle-trio.svg` was copied in from the design system repo at
`wayspace-design-system/project/assets/logos/`. It is 2060x745, so height
drives its width: 170px tall lands at about 470px, which is close to the width
of the empty field that `cover-f` left open.

A hybrid of `cover-g` and `cover-h` does not fit. The tagline runs about 830px
and the trio needs about 470px, which overruns the 1204px of usable width.

## Regenerating

Same flow as the OG cards. These must be served rather than opened from disk,
because they link stylesheets by relative path. From the repo root:

The cover adds `--force-device-scale-factor=2`; the email banner does not.

```bash
python3 -m http.server 8642 --bind 127.0.0.1 &

"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --window-size=1100,220 --virtual-time-budget=3000 \
  --screenshot=assets/img/substack-banner-e.png \
  "http://127.0.0.1:8642/tools/substack/banner-e.html"
```

## Rules that matter

- **1100x220.** Substack's header spec. The 5:1 ratio is the constraint that
  drives every layout choice here: after the border and padding there are only
  about 150px of vertical room, so nothing stacks more than two deep.
- **`* { box-sizing: border-box }` is required** in each file's own `<style>`.
  These link `colors.css` and `fonts.css` but not `base.css`, which is where
  the global border-box rule lives. Without it the black border pushes the
  banner past 1100x220 and the render clips with no error.
- **Verify the size after rendering**, since a clipped banner fails silently:
  ```bash
  sips -g pixelWidth -g pixelHeight assets/img/substack-banner-e.png
  ```
- **The eyebrow should not outrun the name.** Three short parallel nouns sit
  at roughly the width of "Jack Rome" below them, which keeps the lockup
  square. The longer phrase in `banner-d` ran well past the name and made the
  block read top-heavy.
- **The cover does identity, not explanation.** Substack renders the
  publication description as text near the header, so a cover that also carries
  the tagline says the same line twice on one screen. That is why `cover-h`
  ships instead of `cover-g`.
- **The WAYSPACE wordmarks are deliberately unused here.** `wayspace-arc` and
  `wayspace-straight` are strong, but the publication is Jack Rome, not
  Wayspace. Putting the wordmark on the cover would contradict the naming
  decision that the newsletter comes from a person. The puzzle marks carry the
  design system without claiming the wrong name.
- **Check for a doubled name.** Substack may render the publication name below
  the header image. If it does, a banner carrying the name reads as saying it
  twice. Variant `a` or `b` would need the name swapped for the tagline in
  that case.
- **The puzzle mark loses contrast on the orange field.** Its top face is the
  same orange as the ground, so only the black outline and the yellow side
  define it. This matches how `tools/og/card-b.html` treats the mark on the
  AI portfolio card, so it is on-system rather than a mistake. On the brown
  field in `banner-a` and `banner-b` the mark stands out instead.

## Note on placement

These renders live in `assets/img/` beside the OG cards, so nothing links to
them from the site. That is deliberate: the generation flow, the tokens, and
the font all live in this repo, and keeping the source here is what makes the
banner regenerable. The output happens to be for a different platform.
