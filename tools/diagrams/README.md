# Diagram sources

Conceptual figures for written pieces, built the case-study way: HTML on the
real Wayspace tokens and the real Archivo file, rendered to PNG for Substack.
Same reason as `tools/og/` and `tools/substack/`: it stays on the design system,
and any text change is a one-line edit. If an essay later gets its own page on
the site, the same figure can run there live.

## The Gift of Uselessness

| File | Renders to | Window | Sits in the essay |
|---|---|---|---|
Placement chosen 2026-10-11 (option A with a split barbecue), after the Readers
read three placements. Report: Wayspace `Compost/Substack/The Gift of Uselessness/The Readers on Diagram Placement - Report.md`.

| File | Renders to | Window | Sits in the essay |
|---|---|---|---|
| `uselessness-title.html` | `assets/img/diagram-uselessness-title.png` | 1200,630 | Substack cover and social preview, not in the body (Substack already prints the title above the post). Type only, no art: the title spans the card (Jack's call). |
| `uselessness-braced-open-v2.html` | `assets/img/diagram-uselessness-braced-open-v2.png` | 600,410 | *Friction*, after "...there was nothing doing the compressing." "Same signal, different reactions": Braced / Open, wedges pressing in. |
| `uselessness-fence-up.html` | `assets/img/diagram-uselessness-fence-up.png` | 600,520 | *What is your fence made of?*, after "...but nobody actually gets in." Gate closed, barbecue on the sidewalk. The word FENCE is the gate. |
| `uselessness-fence-down.html` | `assets/img/diagram-uselessness-fence-down.png` | 600,520 | *Keep the barbecue going*, after "...and let people come join." "Fence open. Same barbecue.": the gate swung in, everyone in the yard. |
| `uselessness-squeezed-light.html` | `assets/img/diagram-uselessness-squeezed-light.png` | 600,664 | Not in the post. "Resistance compresses our experience.": the same light in four panels, hidden by the squeeze. Jack's idea; kept for the site or a later piece. |
| `uselessness-title-bridge.html` | `assets/img/diagram-uselessness-title-bridge.png` | 1200,630 | Not used. Title card variant: the album's bridge, river and swimmers in a right panel. |
| `uselessness-title-bridge-butterflies.html` | `assets/img/diagram-uselessness-title-bridge-butterflies.png` | 1200,630 | Not used. Same as the bridge variant, plus the album's butterflies. |
| `uselessness-braced-open.html` | `assets/img/diagram-uselessness-braced-open.png` | 600,380 | Superseded by v2. Labels too small for a phone. |
| `uselessness-barbecue.html` | `assets/img/diagram-uselessness-barbecue.png` | 600,420 | Superseded by the fence-up / fence-down pair. |
| `uselessness-squeezed-sketch.html` | `assets/img/diagram-uselessness-squeezed-sketch.png` | 600,330 | Superseded by squeezed-light. Its shrinking row read like a ladder. |

**Phone rule (learned 2026-10-11).** The 600px image shows at about 340px on a
phone, so every size here roughly halves again. Nothing under 22px in the source.

Alt text for each figure is the `aria-label` in its HTML. Paste it into
Substack's image alt field.

## Regenerating

Served, not opened from disk, because the files link stylesheets by relative
path. From the repo root:

```bash
python3 -m http.server 8642 --bind 127.0.0.1 &

"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --window-size=600,380 --force-device-scale-factor=2 --virtual-time-budget=3000 \
  --screenshot=assets/img/diagram-uselessness-braced-open.png \
  "http://127.0.0.1:8642/tools/diagrams/uselessness-braced-open.html"
```

Swap the name and window size from the table for the others. Then check the
size, since a clipped render fails silently:

```bash
sips -g pixelWidth -g pixelHeight assets/img/diagram-uselessness-*.png
```

Each file's PNG should be exactly twice its window size.

## Rules that matter

- **600px wide, rendered at 2x.** Substack shows images at about 600px in the
  email and narrower on a phone. If a figure needs zooming, it's a website
  figure, not a Substack one. Three parts side by side is the limit.
- **`* { box-sizing: border-box }` in every file.** These link the token files
  but not `base.css`. Without it the border pushes past the window and clips.
- **Concepts, never scenes.** Squares, circles, blocks. No people drawn as
  people, no objects drawn as objects.
- **No place to stand.** No rungs, scales, gradients, scores, progress, or
  "you are here." It applies to every figure in a spiritual piece. It's why
  the squeezed sketch is a comparison and not the plan: four sizes in a row
  can read as a ladder.
- **The caption states; the figure shows.** If the caption has to explain it,
  the figure isn't working.
- **One per section at most.** A figure is a place the reader stops, and
  stopping too often is its own fence.
- **Dashed paper means "not there."** Same grammar as the hidden track in the
  case studies.
