# Share card sources

The images that appear when a `jackrome.work` link is pasted into iMessage, Slack, or LinkedIn. They are generated from the HTML here rather than drawn by hand, so they stay on the design system automatically and any text change is a one-line edit.

One card per page. The Squarespace site shared a single image across nine pages, so every link previewed identically. Do not repeat that.

| Source | Renders to | Used by |
|---|---|---|
| `card-home.html` | `assets/img/og-home.png` | `/` |
| `card-about.html` | `assets/img/og-about.png` | `/about` |
| `card-ai-enablement.html` | `assets/img/og-ai-enablement.png` | `/ai-enablement` |

## Regenerating

From the repo root:

```bash
./tools/og/render.sh
```

It serves the repo, renders every `card-*.html` to `assets/img/og-<name>.png`, checks each result is exactly 1200x630, and cleans up after itself. It exits non-zero if any card came out the wrong size.

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
