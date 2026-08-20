# jackrome-work-migration

Project-level context for Claude Code. The user-level `~/.claude/CLAUDE.md` covers working style, tone, and git discipline. This file covers only what is specific to rebuilding `jackrome.work`.

---

## Status: the site is built. Wayspace shipped as skeletons on 2026-08-20

**The build started 2026-08-15 on Jack's go.** All four blocking decisions are settled and recorded below.

| | |
|---|---|
| Repo | `github.com/jackintheway/jackrome-work` |
| Staging | `https://jackrome-work.netlify.app` |
| Production | Still Squarespace. DNS untouched. |

Built, deployed, and verified: `/`, `/about`, `/ai-enablement`. Tokens, Archivo, nav, footer, share cards, redirects, and headers are all in place and confirmed against the live deploy.

Built locally and **not yet deployed**: `/wayspace` and its six rooms. See "Wayspace, built" below. `/production` is the one page still unbuilt.

`INVENTORY.md` is the crawl of the old Squarespace site. `COPY.md` is the copy pulled from it on 2026-08-15, and is the source for the three built pages. Once a page is built its HTML is the source of truth, not `COPY.md`.

**Nothing is public.** `jackrome.work` stays on Squarespace until Jack calls the cutover.

### There is now a deadline: 2026-09-15

**Jack's Squarespace website subscription renews 2026-09-15.** He intends to cancel
rather than let it renew, which means everything here has to be built, shipped, and
cut over before that date. As of 2026-08-18 that is about four weeks.

**Target the DNS cutover for roughly 2026-09-01, not 2026-09-15.** The standing rule is
that Squarespace stays alive for a while after cutover as rollback. Cutting over two
weeks early buys that rollback window inside a term Jack has already paid for, at no
extra cost. Cutting over on the 15th spends the safety net instead of using it.

Turning off auto-renew is safe to do immediately and does not take the site down: a
Squarespace site normally serves until the end of its paid term. Worth confirming in
their billing panel, but if it holds, doing it early removes any chance of the date
slipping past unnoticed. Then the only remaining risk is schedule, not an accidental
charge.

---

## Where the next session picks up

Two things, in this order.

**1. `/production`, the service doorway.** The last unbuilt page and the only one
still 404ing behind a link that exists. It is the sibling to `/ai-enablement`: what
the third home card ("Creative & production") has been pointing at since 2026-08-18.
It sells creative production as a service, so it is a service page and not a body of
work. Copy for it does not exist yet.

**2. Filling the Wayspace rooms.** Jack is gathering. Every room renders from an
array in `js/wayspace.js` and adding real work is adding an object there, never
editing markup. What is still needed from him is unchanged: the real release list,
actual files and embeddable links, and material from Wayspace, his Obsidian vault at
`~/Obsidian/Wayspace`, which holds a lot of the lyrics.

Two things to hold when the vault comes up:

- The vault has its own `CLAUDE.md` at its root that governs behaviour inside it.
  Read that on arrival rather than assuming this file applies.
- **`~/Obsidian/Wayspace/Compost/` is the only permitted write destination in the
  vault.** Everything else there is read-only.

The rooms still need writing before they need more building. Every room hero and the
landing carry a `TODO(copy)` marking a functional line that wants Jack's voice.
Load the `jacks-voice` skill before drafting any of them.

---

## Wayspace, built (2026-08-20)

**The open scope question that stood here from 2026-08-17 is closed.** The two-page
shape held, Jack named the six rooms, and the house is built as skeletons: real
containers, deliberately almost empty, so he can see where each piece of work goes as
he gathers it.

| | Service doorway | Proof doorway |
|---|---|---|
| URL | `/production` (still unbuilt) | `/wayspace` (built) |
| Nav label | Production | Wayspace |
| Reached from | Home card 3 ("Creative & production") | About page button ("See my creative work") |

### The six rooms

Each is a **form Jack's creative work shows up in**. That is the organising principle
and it is what resolves the overlap: a podcast that also exists as video is filed by
the form it primarily lives in, and the other room points across at it.

| Room | Colour | Holds |
|---|---|---|
| Music | orange | Releases, streaming links, the room's player |
| Video | blue | Anything whose form is video, including live performance |
| Design | yellow | Flyers, merch, cover art |
| Podcasts | green | Shows hosted, joined, and produced for other people |
| Speaking | salmon | Talks given, events hosted |
| Writing | brown | Lyrics, each with its own page and track, plus prose |

**The colour is structural, not decoration.** A room announces its colour as a swatch
on the landing list, wears it as its hero, and carries it on its share card. So the
map is learned by colour before any puzzle art exists, and when the pieces get drawn
they are already coded. It is set once per page as `--room` on the `<body>`; every
component in `css/wayspace.css` reads that property rather than naming a colour.

### Decisions made on 2026-08-20, with Jack

1. **Lyrics live in Writing, not Music.** Music stays the listening room. Every lyric
   gets its own page carrying the track it belongs to.
2. **Websites moved to `/production`.** It was one of Jack's original Wayspace pieces,
   but building a website is a service someone hires him for, so it belongs on the
   service page. This is what kept the room list at six.
3. **List first, puzzle art later.** The landing ships the plain clickable list of six
   rooms. The floating interlocking pieces layer over it in a later pass and never
   replace it.
4. **The straight wordmark on the landing**, on paper. Not orange: the wordmark
   contains orange and would lose those shapes. The design system shows the mark on
   blue, paper and salmon, never orange, and that holds for the share card too.

### The audio conflict is settled

The old note here warned that a persistent player bar cannot survive a real page
navigation, and six rooms means six pages. Putting lyrics in Writing settled it:
**audio never crosses a page boundary.** Music owns the room player; each lyric page
owns its own single track. No session storage, no single-page app, nothing to carry.

Native `<audio controls>` for now, on purpose. They are keyboard operable and screen
reader labelled already, and a custom transport should not be designed against audio
that does not exist yet.

### How the rooms are built

- `wayspace/index.html` plus `wayspace/{music,video,design,podcasts,speaking}.html`,
  and `wayspace/writing/index.html` with `example-lyric.html` beside it.
- **Writing is a directory, not a flat file.** A `writing.html` sitting beside a
  `writing/` directory leaves Netlify to decide which answers `/wayspace/writing`. An
  index inside the directory removes the question. Any room that later grows child
  pages should move the same way.
- Pages here link `/css/styles.css` **root-relative**, because they sit a level down
  and the four root pages do not.
- `css/wayspace.css` imports last from `css/styles.css`. `js/wayspace.js` is the
  first JavaScript on this site.
- Content lives in six arrays in `js/wayspace.js`, through pure render functions, the
  same pattern `../ai-work-portfolio/js/app.js` proved. **Adding work is adding an
  object, not editing markup.** An entry flagged `placeholder: true` renders a striped
  tag and disables its controls; an emptied array renders that room's written empty
  state.
- Any item in any room may carry `crossRef: { text, href }`. That is Jack's puzzle
  image made structural: the pieces keep real borders, and the picture crosses them.

### Still open on Wayspace

1. The real release list, outstanding since day one, plus which tracks, where clean
   masters come from, and a check of the distribution agreement before any audio is
   self-hosted.
2. Whether Jack owns `wayspace.work`. Recommendation unchanged: redirect it to
   `jackrome.work/wayspace` rather than fork the design system.
3. Whether Wayspace replaces `bio.site/jackintheway` or sits behind it. Worth watching
   as the Music room fills, since the streaming links row is most of what a music
   link-in-bio does.
4. **The Podcasts and Video rooms will hold work `/production` also sells.** Not a
   contradiction, but the two must not read as copies. The room frames the work as
   something Jack made; `/production` frames it as something a client can hire. Hold
   this when `/production` gets written.
5. The floating puzzle art. Drawn as one puzzle and pulled apart so the tabs match,
   layered over the list, respecting `prefers-reduced-motion`.

---

## Open items, none blocking

- `/creative-portfolio` 404s and now wants a 301 to `/wayspace` in `netlify.toml` at cutover. The scope question resolved toward two pages, so this path has a successor.
- `/production` 404s. Linked from the nav and footer of every page including the eight new ones.
- Wayspace is built but **not deployed**. Nothing under `/wayspace` has been checked against Netlify's clean URLs, and the nested path is new territory for this site. Verify `/wayspace/writing` on the first deploy that carries it.
- One `TODO(copy)` in `ai-enablement.html`: the closing line "Want to talk it through?" is mine, not Jack's, and wants his voice.
- `assets/img/jack-ventnor-2026.jpg` ships but is unused.
- The orphaned Squarespace pages still need a call before DNS moves. `/toolbox` and `/blog` only. See the cutover note below.

---

## What this will be

A full custom rebuild of `jackrome.work` in the Wayspace design system, replacing Squarespace. Everything in Jack's own style, made together, no platform in between.

The sibling project `../ai-work-portfolio/` is the proven pattern and the design reference. It shipped. Extend what worked there rather than inventing a second approach:

- Static HTML, CSS, vanilla JS. No React, no Tailwind, no build tooling.
- Data-driven: one array of content objects through pure render functions. Adding a page or a project means adding an object, not editing markup.
- Deployed to Netlify from GitHub, config in `netlify.toml` so settings travel with the repo.
- Self-hosted fonts, no CDN, no third-party requests.
- Tokens come from `../wayspace-design-system/`, which is the source of truth for color, type, spacing, and borders.

---

## Every page ships with link previews

**Any page created in this project has Open Graph tags and its own share image. This is not optional and it is not a polish-pass item.**

Most people meet a link before they meet the site, in iMessage, Slack, or LinkedIn. A page without `og:` tags shares as a bare blue URL. This was the single biggest gap found on both of Jack's existing sites, and it is cheap to get right from the start and annoying to retrofit.

Required in every page's `<head>`:

| Tag | Note |
|---|---|
| `<title>` | |
| `<meta name="description">` | Search engines. Does **not** feed link previews. |
| `<link rel="canonical">` | Absolute URL. |
| `og:type`, `og:site_name`, `og:url`, `og:title`, `og:description` | |
| `og:image` | **Absolute URL.** Relative paths silently produce no image. |
| `og:image:width` / `:height` / `:alt` | 1200 and 630. |
| `twitter:card` | Must be `summary_large_image`. Plain `summary` is a small square thumbnail. |
| `twitter:title`, `twitter:description`, `twitter:image` | |

Rules for the image itself:

- **1200x630.** Every platform crops to this ratio.
- **Readable at 300px wide.** That is its actual size in a message thread. Type must be huge. If it only reads at full size it has failed.
- **Generated from HTML, not drawn by hand**, so it inherits the design system and stays editable. Sources are in `tools/og/`, one file per page. Run `./tools/og/render.sh` from the repo root to rebuild them all; it verifies each is exactly 1200x630 and fails loudly if not. See `tools/og/README.md` before adding one.
- **Its own image per page, not one shared card.** `jackrome.work` currently uses one image across nine pages, so every link previews identically. Do not repeat that.

## External links open in a new window (standing rule)

**Any link leaving `jackrome.work` opens in a new tab. Links staying on `jackrome.work` do not.**

`ai.jackrome.work` counts as leaving, for now. So does Calendly, YouTube, a client's site, and anything else off-domain. This applies to hyperlinked text and buttons alike.

Always pair `target="_blank"` with `rel="noopener"`. Without it the opened page gets a handle on the page that opened it through `window.opener`, which it can use to redirect the original tab somewhere else. Modern browsers imply this, but stating it costs nothing and does not depend on the visitor's browser being current.

## Location and dates (standing rules)

- **Location is "Maryland", never "Frederick".** Applies to visible copy, meta descriptions, and share card text.
- **No year anywhere on `jackrome.work`.** No copyright line, no "2026" in the footer. A dated footer starts aging the site the moment the year turns, and it earns nothing. `ai.jackrome.work` keeps its year, because there the date is doing real work: it says how current the AI work is.

## Other standing page requirements

- Every image has real `alt` text, or `alt=""` if it is purely decorative.
- Every page works at 390px wide with no horizontal scroll.
- Visible keyboard focus states. Respect `prefers-reduced-motion`.
- No em dashes in any user-facing copy. Applies to visible text, `<title>`, and meta descriptions.
- Embeds use a facade: ship a static thumbnail, swap in the real iframe on click. No third party is contacted until the visitor asks. `/creative-portfolio` has 8 embeds and would be slow otherwise.

---

## Decisions (approved 2026-08-15)

The four questions that were blocking the build. All settled. Do not reopen them without Jack.

1. **Typeface: Archivo.** Same face as the AI portfolio, self-hosted, SIL Open Font License, licence text shipped beside the file. It stands in for Ballinger, which is licensed for Squarespace hosting only and cannot travel. The AI portfolio is the proof of concept for the whole site on questions like this: where it settled something, that answer carries here rather than getting relitigated.

2. **Editing workflow: same as the AI portfolio.** Edit a file, commit, push. Jack chose this knowingly and wants it as a learning surface, not just a shipping mechanism. It is additive: it does not remove his ability to use Squarespace, and he can let Squarespace go whenever he is ready. Teach as you go when a git or web pattern comes up for the first time.

3. **Orphaned pages: left in place, not migrated.** `/toolbox` and `/blog` stay on Squarespace and are out of scope for this build. Jack may want `/toolbox` brought over once the core site is done. See the cutover note below, because "leave them there" has an expiry date.

   **Corrected 2026-08-18:** `/store` was on this list and should not have been. It already returns 404 on the live site. Jack's only store is a Fourthwall that `wayspace.store` redirects to, and that arrangement continues independently of anything here. So the cutover has two orphans to decide, not three.

4. **Blog: not carrying over.** No blog in this build. If Jack starts writing at volume he would reach for Substack rather than hand-authored pages.

**Scope that follows from these:** four pages. `/`, `/about`, `/ai-enablement`, `/creative-portfolio`.

**Revised 2026-08-20.** The fourth page became two doorways, and the proof doorway
became a house of eight pages. Current scope is eleven built pages plus `/production`.

### The cutover note (deferred, not decided)

A domain is served by one host at a time. While DNS points at Squarespace, the orphaned pages keep working untouched, which is why decision 3 is free right now. The moment DNS points at Netlify, Squarespace stops answering for `jackrome.work` and `/toolbox` and `/blog` go with it. So each one needs a call at cutover: rebuild it, redirect it in `netlify.toml`, or let it 404 deliberately. Raise this before the DNS change, not after.

`/creative-portfolio` needs a call at the same time. It was a live URL on Squarespace, so it wants a 301 in `netlify.toml`, most likely to `/wayspace`.

**With the 2026-09-15 deadline in place, these are critical path, not cleanup.** Four
things have to be settled before DNS moves, and three of them are decisions rather than
code:

1. `/production` built.
2. `/wayspace` built.
3. `/toolbox` and `/blog`: rebuild, redirect, or deliberate 404. **Decide early.** If
   `/toolbox` gets rebuilt it is a whole additional page, which is real scope against a
   four week clock. Raise it with Jack before the build starts, not during.
4. `/creative-portfolio` 301 added to `netlify.toml`.

Also allow time for DNS propagation and for Netlify to provision the TLS certificate
after the nameserver change. Do not schedule the cutover for the last day available.

---

## Build order (approved 2026-08-15)

**About, then Home, then AI Enablement, then Creative Portfolio.**

About goes first because it has the strongest copy, it is a single column with no repeating content, and it proves the whole chain end to end: page shell, nav state, share image, deploy. Home and AI Enablement are the same pattern with card arrays on top. The creative portfolio is last on purpose, because it is the only one that is not a rebuild.

## Calendly is the conversion path (approved 2026-08-15)

Booking a call is the named primary conversion for the whole site, decided deliberately rather than inherited from Squarespace. Every page carries a route to it. Treat it as a real dependency: one URL, `https://calendly.com/jackintheway/chat-with-jack-rome`, kept in one place rather than hand-typed into five pages.

---

## Decisions: creative portfolio (approved 2026-08-15)

> **Read "The open scope question" above before acting on anything in this section.** These decisions were made when the creative portfolio was assumed to be a single page. On 2026-08-17 that assumption came into question, and whether this is one page or two is unresolved. Everything below still holds for whichever page ends up carrying the creative work itself. What is no longer certain is that one page carries all of it.

**This page is a revamp, not a rebuild.** Everything else in this project ports existing copy across. This one does not. The live page is a reference for *what creative material exists*, not for structure, order, or presentation. Do not treat `COPY.md`'s creative portfolio section as a spec to reproduce.

It gets the same care `ai.jackrome.work` got: its own thinking about what the page is for, what a visitor should feel, and how the work is framed. The live version is a grid of untitled artwork with no writing on it at all, which is the actual gap. There is a lot more available here than the current page does.

Two things have to come from Jack before it can be built: the real release list (the live page predates Feivel Speaks and RACE DAY), and what each piece of work actually is.


**Music plays through our own audio player, with a Spotify link alongside.**

Self-hosted audio in a player Jack designed, plus a plain "listen on Spotify" link per release for anyone who wants to go where the streams count. The reasoning: a Spotify embed serves a short preview to logged-out visitors, which is most portfolio visitors, inside Spotify's chrome rather than Jack's. How the music is shared is part of the portfolio, not just packaging around it.

**This breaks the AI portfolio's modal pattern, deliberately.** Over there, `closeModal()` sets `modalIframe.src = ""`, which is what keeps the modal cheap. It also kills any audio the moment a card closes. So the player does not live inside the modal:

- One `<audio>` element in a persistent bottom bar that never unmounts.
- The cover art grid is a set of remote controls. Clicking a cover tells the bar what to load, it does not open a player.
- Playing a different release swaps the source in the same bar. Playback survives navigation within the page.
- Cover art on the grid, hover state, click to enter. The card-to-shell grammar still applies to everything that is not audio.

Open before this page gets built: which tracks (not whole albums), where clean masters come from, and a check of the distribution agreement the releases went out under. Non-exclusive distribution normally leaves self-hosting fine, but confirm rather than assume.

Video embeds on this page still use the facade pattern. That rule is unchanged.

---

## The domains (mapped 2026-08-18)

**The cutover is five domains, not one.** All eight of Jack's domains are registered at
Squarespace and are staying there. Auto-renew on the *website* subscription was
cancelled 2026-08-18; the site serves until 2026-09-15.

Verified live, not read off the dashboard:

| Domain | Resolves to | Renews |
|---|---|---|
| `jackrome.work` | the Squarespace site (primary) | 2027-06-29 |
| `jack-rome.com` | 301 to `jackrome.work` | 2027-07-27 |
| `jackintheway.net` | 301 to `jackrome.work` | 2027-05-02 |
| `jackintheway.work` | 301 to `jackrome.work` | **2026-09-07** |
| `jackrome.me` | 301 to `jackrome.work` | 2027-05-16 |
| `jackintheway.me` | forwards to Fourthwall | 2027-06-10 |
| `jackintheway.store` | forwards to Fourthwall | 2027-08-05 |
| `wayspace.store` | forwards to Fourthwall | 2027-08-05 |

### What this means for the cutover

**The four 301s most likely die with the site on 2026-09-15.** The dashboard labels
`jackintheway.me`, `jackintheway.store`, and `wayspace.store` with an explicit
"Forwards to" line and labels the other five with nothing, which reads as forwarding
being a domain-level feature and the rest being domains *connected to a site*. Jack has
real evidence that forwarding survives cancellation: the three Fourthwall forwards are
attached to his old `jackintheway.net` site, which he cancelled a while ago, and they
still work.

That evidence covers the forwards. It does not cover the four connected domains, which
hang off the very site being cancelled. Treat them as dying until proven otherwise.
Either way the fix is the same, so this does not need resolving in advance, only
verifying after.

The fix is Netlify **domain aliases**: add all five to the site, set `jackrome.work` as
primary, and Netlify redirects the aliases to it. Same behaviour Squarespace is
providing now. Each alias needs its DNS pointed at Netlify, so budget time for five DNS
changes plus propagation, not one.

### Open questions, all with a 2026-09-15 deadline

1. ~~The mail icon on `jackintheway.net`.~~ **Closed 2026-08-18.** A `jack@jackintheway.net`
   address Jack set up around 2020 and no longer uses, still forwarding to
   `jackintheway@gmail.com`. Not on the critical path.
2. ~~Do the Fourthwall forwards survive?~~ **Closed 2026-08-18.** They already survive a
   cancelled site: they hang off the old `jackintheway.net` site, cancelled a while back,
   and still resolve. `wayspace.store` is safe.
3. **`jackintheway.work` renews 2026-09-07**, about three weeks out and before the site
   goes down. It is a duplicate pointing at the same place as four other domains. Jack
   is leaning keep, not decided.
4. ~~The `jackintheway.me` discrepancy.~~ **Closed 2026-08-18.** It does forward to
   `bio.site/jackintheway` correctly. The dashboard thumbnail showing the store is
   stale, the forward is not.

### bio.site and Wayspace, an open question (raised 2026-08-18)

`bio.site/jackintheway` is Jack's de facto music and video home, and his link-in-bio.
It became that when he cancelled the old `jackintheway.net` site. `jackintheway.me`
forwards to it, and the About page links to it.

Jack raised whether Wayspace replaces it, or whether bio.site stays as a lobby in front
of Wayspace for his creator and musician self. Not decided, and it does not block the
build. But it wants holding during the gathering session, because **the Wayspace landing
as described is structurally a link-in-bio already**: floating puzzle pieces that each
route somewhere, over a plain clickable list of the same destinations. That is what a
link-in-bio does, in Jack's own hands rather than a template.

If Wayspace absorbs the job, the music room needs the streaming links carried prominently
(Spotify, Apple Music, wherever else), because sending someone to a stream is most of what
a music link-in-bio is for. That is a room-list consideration, so it belongs in the
gathering session and not after it.

The argument for keeping bio.site: it is zero maintenance and loads instantly on a bad
phone connection off an Instagram tap, which is the actual context. Wayspace will be
heavier than that by design.

## Hosting, billing, and how often we deploy (settled 2026-08-18)

**A production deploy costs real money. Preview locally by default and push in batches.**

Netlify bills in credits, one pool per team, and the team here is `Wayspace`. Both
`jackrome-work` and `../ai-work-portfolio/` draw from the same pool, so a busy day on
one spends the other's budget too.

| | |
|---|---|
| Production deploy | 15 credits |
| Bandwidth | 20 credits per GB |
| Web requests | 2 credits per 10k |
| Free plan | 300 credits/month, so about 20 deploys |
| Personal plan | $9/month, 1,000 credits |

On 2026-08-17 the free tier ran dry after three days of building, deploys paused, and
the team dropped onto operational credits. Those are the reserve that keeps published
sites answering; they cannot be spent on builds, and **if they run out too, live sites
serve a "Site not available" page.** That put `ai.jackrome.work` at real risk, which is
what forced the plan decision.

**Decision: Netlify Personal at $9/month.** Not Pro. Rollover credits sound useful but
need a Pro plan at 5,000 credits or higher, and Pro's base tier is 3,000, so $20 does
not buy rollover. Revisit only if deploy volume is consistently near the ceiling.

### Preview locally, deploy deliberately

`netlify.toml` sets `publish = "."` and `command = ""`. **There is no build step.**
Netlify copies the folder to a CDN. So a deploy is never required to look at a change.

```
cd /Volumes/Key/workspace/claude-code-projects/jackrome-work-migration
python3 -m http.server 8000
```

Two things local preview does not reproduce, and they are the only reasons to spend a
deploy on checking something:

- **Clean URLs.** Netlify serves `/about` from `about.html`. The local server does not,
  so it is `/about.html` there.
- **Nothing in `netlify.toml` applies locally.** Redirects, headers, and anything a link
  preview scraper needs to see still require a real deploy to verify.

`git commit` is free and stays frequent, per the user-level rule. `git push` is what
triggers the build and costs the 15 credits. Committing often and pushing in batches
satisfies both.

## The Squarespace relationship (settled 2026-08-18)

**The domain bill and the website bill are separate, and only one of them is going away.**

`jackrome.work` is registered through Squarespace on Tucows, their registrar backend,
and Squarespace serves its DNS (`ns01-04.squarespacedns.com`).

- **Domains stay at Squarespace indefinitely.** Jack's call, made deliberately, not a
  loose end. He likes the platform, wants it available for building the old-fashioned
  way if he ever wants to, and wants somewhere to show clients who ask about Squarespace.
  Do not propose a registrar transfer as cleanup.
- **The website subscription is what eventually gets cancelled**, and not yet. It stays
  on through the DNS cutover and for a while after, until everything built here has been
  live long enough to trust. Revisit then, not before.

## Known facts, so they are not rediscovered

- **Squarespace has no content API.** Its developer APIs cover commerce only: orders, products, inventory, transactions. Content cannot be synced out, only moved by hand. There is no headless option.
- **URL Mappings die with the platform.** The redirect table in Squarespace does not transfer. `INVENTORY.md` has the `netlify.toml` equivalent.
- **Paths carry over one-to-one.** No redirects are strictly needed for the ten content URLs. `/home` needs a 301 to `/`, and `/cart` and `/blog/category/Toolbox` are platform-generated with no successor.
- **Export images from the Squarespace asset manager, not the CDN URLs on the page.** The page serves resized derivatives; the originals are what to keep. Rename the four placeholder-named files at export.

---

## Working rules

- Read `INVENTORY.md` and `../ai-work-portfolio/CLAUDE.md` before writing any code.
- Ask before anything hard to reverse. Interrupting with a question is cheaper than silently destroying something.
- If a plan contradicts a decision in this file, surface it. Lead with the turn, not with "no."
- Commit in small, described steps.
- Nothing goes live without Jack's explicit go. DNS cutover especially: keep the Squarespace subscription alive for a month afterward as rollback.
