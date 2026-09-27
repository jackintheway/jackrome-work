# Share card sources

The images that appear when a `jackrome.work` link is pasted into iMessage, Slack, or LinkedIn. They are generated from the HTML here rather than drawn by hand, so they stay on the design system automatically and any text change is a one-line edit.

One card per page. The Squarespace site shared a single image across nine pages, so every link previewed identically. Do not repeat that.

| Source | Renders to | Used by |
|---|---|---|
| `card-home.html` | `assets/img/og-home.png` | `/` |
| `card-about.html` | `assets/img/og-about.png` | `/about` |
| `card-ai-enablement.html` | `assets/img/og-ai-enablement.png` | `/ai-enablement` |
| `card-wayspace.html` | `assets/img/og-wayspace.png` | `/wayspace` |
| `card-case-two-track-class-edit-automation.html` | `assets/img/og-case-two-track-class-edit-automation.png` | `/case-studies/two-track-class-edit-automation` |
| `card-case-event-remaster-and-language-conform.html` | `assets/img/og-case-event-remaster-and-language-conform.png` | `/case-studies/event-remaster-and-language-conform` |
| `card-wayspace-music.html` | `assets/img/og-wayspace-music.png` | `/wayspace/music` |
| `card-wayspace-video.html` | `assets/img/og-wayspace-video.png` | `/wayspace/video` |
| `card-wayspace-design.html` | `assets/img/og-wayspace-design.png` | `/wayspace/design` |
| `card-wayspace-podcasts.html` | `assets/img/og-wayspace-podcasts.png` | `/wayspace/podcasts` |
| `card-wayspace-speaking.html` | `assets/img/og-wayspace-speaking.png` | `/wayspace/speaking` |
| `card-wayspace-writing.html` | `assets/img/og-wayspace-writing.png` | `/wayspace/writing`, and the lyric pages under it |
| `card-audit.html` | `assets/img/og-audit.png` | `audit.jackrome.work`, also served at `/audit` |

## The Wayspace set

The six room cards are one family: same layout, one short word, and the
room's own color as the ground. The color is not decoration. It is the
same color that room wears on the landing list and in its hero, so a
link previewed in a message already matches the room it opens.

The title's hard offset shadow changes per room, because a yellow offset
that pops against orange disappears against yellow. Grounds too dark for
black type (blue and brown) carry paper type instead.

The landing card leads with the wordmark rather than a title, on paper.
The wordmark contains orange, so an orange ground would eat those shapes.
The design system shows the mark on blue, paper and salmon, never orange.

## Regenerating

From the repo root:

```bash
./tools/og/render.sh                  # every card
./tools/og/render.sh card-home        # only the cards you name
```

It serves the repo, renders each `card-*.html` to `assets/img/og-<name>.png`, checks each result, and cleans up after itself. It exits non-zero if any card fails.

Render only the card you changed. The other PNGs stay out of the diff, and a different machine's font rendering would otherwise rewrite every image for no visible reason.

The check is `tools/og/check-card.py`, and it confirms two things: the image is exactly 1200x630, and the card's 14px black border reaches all four edges. The size check alone is not enough. A clipped render is still 1200x630, with white where the bottom of the card should be. The border check catches that. It uses only the Python standard library, so it can check any PNG on its own: `python3 tools/og/check-card.py assets/img/og-home.png`.

It runs on macOS and Linux, including a Claude Code cloud session. It uses a headless shell when it finds one (Playwright ships one), then Chrome, then Chromium. Set `CHROME=/path/to/binary` to choose. Full Chromium on Linux leaves an 87px blank strip across the bottom in its new headless mode. That was seen on 2026-09-26, and the border check fails it.

The cards pull real tokens and the real Archivo file from the site, which is why they have to be served rather than opened from disk.

## Adding a card

Copy an existing one, change the title and URL, and name it `card-<page>.html`. The script picks it up with no further edits. Then point that page's four `og:image` and `twitter:image` tags at the matching filename.

## Rules that matter

- **1200x630.** This is the ratio every platform crops to. Changing it means recropping everywhere.
- **Keep the type huge.** The card renders around 300px wide in a message thread. If it is not readable there, it has failed. Longer titles need a smaller `font-size` *and* a wider `max-width` on `.title`, or they wrap into four lines and collide with the footer rule.
- **`* { box-sizing: border-box }` is required** in each card's own `<style>`. These files link `colors.css` and `fonts.css` but not `base.css`, which is where the site's global border-box rule lives. Without it the 14px border pushes the card past 1200x630 and the render clips.
- **The title's `max-width` must stay under about 770px**, or it runs into the puzzle mark, which sits 344px wide at `right: 56px`.

## After changing an image

Scrapers cache aggressively, so a live link may keep showing the old card for days. Either re-scrape through a platform debugger, or ship the new file under a new name and update that page's four `og:image` and `twitter:image` references.
