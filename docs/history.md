# Build history: jackrome-work-migration

Moved out of `CLAUDE.md` on 2026-10-05 so it no longer loads into every session.
The text is verbatim under its original headings, except notes marked
"[Note 2026-10-05: ...]". These are dated records, not instructions. Verify against
the current files before acting on anything here. Standing rules stay in `CLAUDE.md`.

Settled since (per Jack, 2026-10-05): the Squarespace website subscription ended
2026-09-15 as planned, the domains are fine, and the migration is complete.


---

## From "Current editorial decisions: 2026-09-12"

- Jack authorized a local /handoff demonstration and the Wayspace artwork arrival
  on 2026-09-12. The demo uses this website's September 12 link-update checkpoint
  (633121a), quotes Jack's request, and clearly dates the shortened handoff. It
  reveals recorded material and copies a note; it does not run an AI model.
- On 2026-09-13, Jack explicitly authorized pushing this batch to production.
  The Wayspace arrival uses wayspace-straight-v2.svg, an unchanged copy of Jack's
  corrected SVG with the two missing yellow W-shadow polygons. Keep the original
  published filename intact for existing caches. Other private and unrelated
  working files are excluded from publication.
- On 2026-09-13, Jack approved a real publish boundary for the site, ahead of
  the workflow audit readiness assessment at audit.jackrome.work (preparation
  package at ../ai-opportunity-assessment-review/). Netlify now publishes
  `_site/`, assembled by `tools/build-site.py` from an explicit allowlist, with
  functions in `netlify/functions/` outside it. Reason: Netlify's docs require
  the functions directory to sit outside the publish directory, and the site
  published the repo root. Option considered and set aside: moving all 75 pages
  into a subfolder, which reaches the same place with far more churn. Local
  preview is unchanged. A production deploy still costs the flat 15 credits;
  build time is not metered separately. The assembled folder was compared with
  the live site file for file before this was committed: 336 tracked files,
  all identical. Not yet deployed; the first deploy with the new boundary must
  be verified live before assessment code lands on top of it.

---

## Status: every page is built and deployed. What's left is content, not construction (2026-08-24)

**The build started 2026-08-15 on Jack's go.** All four blocking decisions are settled and recorded below.

| | |
|---|---|
| Repo | `github.com/jackintheway/jackrome-work` |
| Staging | `https://jackrome-work.netlify.app` |
| Production | **`https://jackrome.work`, live on Netlify since 2026-08-24.** |

### The cutover happened 2026-08-24

`jackrome.work` left Squarespace. What was done, so the remaining four domains can
follow the same path:

**External DNS, not Netlify DNS.** Records changed at Squarespace rather than
nameservers moved. The deciding factor was `jackintheway.net`, which carries live
Google Workspace MX records: a nameserver move takes all of a domain's DNS with it, so
MX has to be recreated by hand on the other side, and missing it breaks email with no
error anywhere. Changing only A and CNAME leaves everything else untouched. Rollback is
also cheaper: re-add one Squarespace preset.

**Squarespace ships a Netlify preset**, which did the whole job. DNS panel → DNS Presets
→ delete **Squarespace Defaults** (the trash icon removes `A @ → 198.49.23.144` and
`CNAME www → ext-sq.squarespace.com` together), then Add Preset → Netlify, which asks
only for the project name (`jackrome-work`) and writes both records correctly:

| Type | Name | Data |
|---|---|---|
| A | `@` | `75.2.60.5` |
| CNAME | `www` | `jackrome-work.netlify.app` |

Delete the defaults **before** adding the Netlify preset. Two competing A records on the
apex round-robin, so visitors would land on Squarespace or Netlify at random, which looks
intermittent rather than broken and is much harder to diagnose.

**Netlify wants an ALIAS record and Squarespace cannot make one.** Squarespace supports
A, AAAA, CNAME, MX, TXT, SRV, NS and CAA only. So the fallback A record is the path, and
Netlify's warning about losing CDN benefits is largely mitigated by `75.2.60.5` being an
anycast address that still routes to the nearest edge.

**The apex stays primary; `www` is not promoted.** Netlify recommends making
`www.jackrome.work` primary. Declined: 73 files carry 292 absolute `https://jackrome.work`
URLs across every canonical tag and `og:url`, so promoting `www` would point all of them
at a hostname that 301s. That is the same class of bug already fixed once here, when
`/wayspace` had an index file and its canonical pointed at a redirecting URL.

**The thing that actually blocked go-live was not DNS.** The Netlify project was marked
**Private**, which serves a 401 Edge Access gate on every request, on the custom domain
*and* on `jackrome-work.netlify.app`. DNS was correct and the site was still invisible.
The switch is "Make public" on the project page. **Check this first if a Netlify site
answers 401 with a "Login Redirect" body.**

Verified live the same day: all 13 in-scope paths 200, all 9 redirects 301 to the right
targets, `www` 301s to the apex, HTTP 301s to HTTPS, the Let's Encrypt certificate is
issued for `jackrome.work`, `og:image` loads at an absolute URL, and the three vanity
subdomains still forward.

**Squarespace stays alive as rollback until 2026-09-15.** Do not cancel the website
subscription early. The four remaining domains still 301 through it and have not moved.

Every page in scope is built, deployed, and has been iterated on since: `/`, `/about`,
`/ai-enablement`, `/production`, `/ai-portfolio`, and `/wayspace` with all six rooms.
Music plays 8 sources through a hidden SoundCloud widget, Writing carries 75 entries
with theme and kind filters, Design tells the lineage in order with two hover
animations, Podcasts plays both audio and video. Speaking reopened on 2026-08-30 with
its first real entry, the SpeakEasy talk The Gift of Uselessness; its Watch button
starts the recording at 8:30 via data-video-start, where the talk begins inside the
full service video.

Tokens, Archivo, nav, footer, share cards, redirects, and headers are in place and
confirmed against the live deploy.

`INVENTORY.md` is the crawl of the old Squarespace site. `COPY.md` is the copy pulled from it on 2026-08-15, and is the source for the three built pages. Once a page is built its HTML is the source of truth, not `COPY.md`.

**The site is live.** `jackrome.work` moved to Netlify on 2026-08-24.

**The repo, however, is public.** `github.com/jackintheway/jackrome-work` is readable by anyone, verified 2026-08-21. So a push publishes the source even though it does not publish the site, and anything written into a file here (including this one) is public the moment it lands. Keep private reasoning in `~/.claude/plans/` or another place outside the repo.

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

## Where the next session picks up (updated 2026-08-24)

The build is done. What's left is four small, genuinely open items, roughly in
priority order given the 2026-09-01 cutover target:

~~**1. `/toolbox` and `/blog` need a decision.**~~ **Closed 2026-08-24, with Jack.**
Redirect both home rather than rebuild or deliberate 404. `netlify.toml` now 301s
`/toolbox`, `/blog`, and `/blog/*` (catching the three posts and the auto-generated
category page) all to `/`. `/store` needed no rule; it already 404s on the live site.

~~**2. `/creative-portfolio` still has no 301.**~~ **Closed 2026-08-24.** `netlify.toml`
now 301s it to `/wayspace`, per this file's own working note.

~~**3. The Design room's share card is stale.**~~ **Wrong, and closed 2026-08-24.**
Jack doubted it and was right. The card was never rendered from the room's one-line
description: `tools/og/card-wayspace-design.html` carries only an eyebrow
("Wayspace &middot; Jack Rome"), the single word "Design", and the URL. There is
nothing in it that hero copy can make stale. Verified against the rendered PNG, which
is 1200x630, live at 200, and reads at 300px. No rebuild needed.

**The general shape of the mistake is worth keeping.** The six room cards are one
word each, by design, so the type can run large. A note claiming one had drifted from
prose it never contained was asserting a dependency that does not exist. Check the
card source before believing a claim that a card is out of date.

**0. `/case-studies/two-track-class-edit-automation` is built and not deployed.**
Committed 2026-08-24, along with `js/case-studies.js`, a section on
`/ai-portfolio` that renders from it, and a `/case-studies` 301. Verified
locally: renders, no console errors, no horizontal overflow at 390px, and the
copy checks pass. Not pushed. See "Case studies" below.

**4. Four `TODO(copy)` markers remain**, all now unblocked since every room they sit
in has real content: `wayspace.html` (the room-list descriptions), and the hero
subtitles on `/wayspace/video`, `/wayspace/writing`, `/wayspace/music`. Each wants a
pass with the `jacks-voice` skill, the same treatment Design and Podcasts already got.
A fifth, in `ai-enablement.html` ("Want to talk it through?"), predates the Wayspace
work and is still open too.
[Note 2026-10-05: no `TODO(copy)` markers remain anywhere in the repo.]

**Two things to hold if the vault comes up again:**

- The vault has its own `CLAUDE.md` at its root that governs behaviour inside it.
  Read that on arrival rather than assuming this file applies.
- **`~/Obsidian/Wayspace/Compost/` is the only permitted write destination in the
  vault.** Everything else there is read-only.

**Not urgent, not on the cutover path:** the merch store pin, the bio.site question,
`flyer-video-headliner-weekof-2018.mp4` still not in the Design room, the cover-art
lightbox anticipated but not built, and `assets/img/jack-ventnor-2026.jpg` shipping
unused. All recorded in their own sections below.

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

### Decisions made on 2026-08-20, with Jack

1. **Lyrics live in Writing, not Music.** Music stays the listening room. Every lyric
   gets its own page carrying the track it belongs to.
2. **Websites is not a room, and the design system lives in Design.** Building a
   website for someone is a service, so that work belongs on `/production`. But the
   design system is not website work, and Jack was clear about this: it is design
   work, and Design is where its company is. That room will hold a great deal of
   cover art, logos, and visual work, and the system belongs among them.

   A website built out of the system, including this one, is a piece of design in
   that room rather than evidence of a separate discipline. This is what kept the
   room list at six, and it is a better answer than filing the system under a
   service page would have been.
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

   **The motion question around this is decided. See `MOTION.md`.** In short: the
   site's register is calm and stays calm, scroll-linked motion is admitted here and
   nowhere else, and none of it happens before the cutover. Read that file before
   proposing anything animated, and do not reopen it from scratch.

---

## The Writing room and the lyric pages (built 2026-08-23)

Twelve lyrics and fourteen shorts.

**The lyrics are the Wayspace album, all twelve tracks, each on its own
page** at `/wayspace/writing/{slug}`. The words came from
`_source/music/wayspace-album-metadata/`, which also carries BPM, key,
credits, ISRC and Jack's own note on each track. That is why this set
came first: it is the only one where the lyric, the release and a lyric
video all already exist.

**The twelve lyric videos live on the lyric pages, not in Video.**
Twelve near identical cards from one album would have buried the rest of
that room, and a lyric video belongs beside its words. Each page links
out to its video and across to the release in Music.

**Each lyric page carries its own share card**, per the standing rule.
`tools/og/card-lyric-*.html` generates them from one template: Writing's
brown, the album cover, the track title. 24 cards render now.

**Section labels do not exist in the source.** The template assumed a
"Verse" or "Chorus" label above every block, and that label's margin was
what separated stanzas. The album metadata has no such markers, so
`.lyric-body + .lyric-body` now supplies the gap where no label does.

**The shorts have no page of their own**, because the piece is the video
rather than a text with a video attached. Titles are the published ones
with hashtags stripped: a hashtag is a distribution tactic, not part of
the writing.

### The other fifty came from Obsidian, and needed real parsing

Built 2026-08-23. `_source/writing/lyrics/` holds 53 files, three of
which duplicate Wayspace tracks, so fifty pages. **62 lyric pages in
total now**, plus the fourteen shorts.
[Note 2026-10-05: `wayspace/writing/` holds 61 lyric pages.]

### Still to do here

Only the twelve Wayspace lyrics carry a lyric video and Jack's per
track note. The other fifty have neither, because their sources do not
hold one. Feivel Speaks has audio in `assets/audio/` for two tracks and
could carry a player on those two pages.

---

## The Design room (built 2026-08-23)

**Design is the one room that is a story before it is a grid, and that is Jack's
decision, not a stylistic flourish.** Every other room is a heading and a
`work-grid`. This one runs a narrative spine first, in order, then a grid holds
whatever is not part of the chain.

The chain, in Jack's words: the tool pack were early prototypes of the Wayspace
design system, the cover artwork of Wayspace the album and all of the singles is
what that evolved into, and that eventually became the design system for this
website. He added the podcast cover late as the newest link, and called it the
one mostly implemented on this site.

Four steps ship: the tool pack (2021), Wayspace the album (2022), the Wayspace
podcast cover (2023), and this site, labelled **Now** rather than 2026. The
"no year" rule exists because a date ages a page as soon as the year turns. A
year on a 2021 artifact does not age. A year on the current one does.


**Two Little Things covers exist and only one is right for this room.**
`little-things.jpg` is the album-set cover, the one with the helmets, and it is
what ships. `little-things-cover-artwork.jpg` is the single release version,
butterflies and the flower spiral, and belongs to Music if anywhere. `try.jpg`
and `try-cover-final.jpg` are the same split: the album-set Try has the
hoverboard, the single release is a photographic swirl.

### How the tool pack clips play

Decided with Jack the same day: **hover on a desktop, tap on a phone, muted
either way, playing in place.** Not in a modal, and with no play button sitting
on top of the art. He asked for muting himself, so the attention stays on the
drawing rather than six soundtracks.

He was offered the fuller version he originally described, where a clip starts
on its own once it scrolls into range on a phone, the way YouTube behaves, and
chose against it.

**Where this sits against `MOTION.md`:** that file bans scroll-linked motion
before the cutover, and this is not that. A clip that starts because someone
pointed at it is the reader asking, the same category as the Video room's
YouTube facade. The version that would have crossed the line is the one that
starts on its own. It is deliberately not built. `MOTION.md` open question 2 is
now partly answered: a room page may respond to a reader, and still does not
perform on its own.

Under `prefers-reduced-motion` nothing starts on hover or focus, and the file is
not even fetched. Clicking still plays. Motion is never imposed here, and it is
not withheld either.

### Three arrays, not one

`js/wayspace.js` grew `TOOLS` and `SINGLES` alongside `DESIGN`. The first two
feed the spine, `DESIGN` feeds the grid. Adding work is still adding an object.

- **The clips carry no `src` in the markup.** `initToolClips` assigns it on
  first activation, which is what makes `preload="none"` honest. A visitor who
  never touches a tile never downloads the 2.7 MB.
- **Posters come from each clip's own first frame**, pulled with `qlmanage`, not
  from the tool pack's still PNGs. Two of those stills are a different
  composition from the animation that shares their name, so a poster taken from
  them would show one thing and play another.
- **`fit: "contain"` exists because this is the only room holding art that is
  not square.** A show flyer is portrait and a wordmark is wide, and the 1:1
  crop the other rooms use cuts the top off one and slices the other in half.
- The twelve single covers link into the Writing room, one per lyric page. That
  is the `crossRef` principle without a `crossRef` field. They run in **track
  order**, not newest first like the flyers, because an album's sequence is a
  fact about the work. Welcome Back and What Have I Done were missing from
  `_source/cover-artwork/` during the build and Jack added them the same day.

### The assets, and what they cost

`assets/` went from 29 MB to about 36 MB. The clips are 2.7 MB, six five-second
480x480 loops, encoded with `avconvert -p PresetMediumQuality` because there is
no ffmpeg on this machine and that is the only preset with a bitrate low enough
to put six clips on one page. The art is flat color with heavy outlines, so it
survives the downscale. Sources are 1920x1920 at about 6 MB each in
`_source/design/the-wayspace-tool-pack/`.

### Still open in this room

- ~~**The flyers carry no year.**~~ **Closed 2026-08-23.** Jack renamed the
  source files with years from memory, then corrected himself and said to use
  the file dates instead. Three differ between the two: Howard Theatre and the
  holiday show are 2018 rather than 2019, and Pie Shop is 2021 rather than 2022.
  The venue detail he added in the same rename is his and stays, so the flyers
  now carry venue and year and run newest first.

  **`flyer-video-headliner-weekof-2018.mp4` is still not in the room.** It is a
  motion flyer, 20 MB, and the only piece of that set that is not a still. It
  would need the same encode the tool clips got.
- **Merch is named in the room's description and is not in it.** See the merch
  store pin below.
- **A lightbox on cover art was anticipated and not built.**
  `_source/cover-artwork/spotify/README.md` records the reasoning from
  2026-08-22: in Music a cover is a thumbnail capped at 340px, in Design it is
  the work itself and that is what earns a modal. The Design derivatives are
  already larger for this reason. Building it is a separate decision.
- ~~**The share card still says the old thing.**~~ **Wrong, closed 2026-08-24.**
  It never carried the description. The card is the eyebrow, the word "Design",
  the puzzle mark and the URL, same as the other five rooms. Nothing to rebuild.

---

## Audio on the lyric pages (built 2026-08-23)

**Self hosting was ruled out first, and that is what made everything else
possible.** Three MP3s already cost 20 MB of `assets/`, and `race-day.mp3` alone
is 12 MB. Sixty-two playable lyric pages would be roughly 300 MB in a repo
Netlify redeploys on every push. Jack: "the only way we would give every lyric
page a way to play music would be hosting the music elsewhere, NOT in the repo."

### The shape: a facade, then a SoundCloud player

Chosen by Jack on 2026-08-23 after comparing four options in a real browser.
An 88px bar under the hero saying **"Click play to listen"** with the service
and duration under it, a 64px thumbnail, and a play glyph. Click it and the bar
is replaced by the SoundCloud widget, already playing.

**The whole bar is a `<button>`, so the text starts the song too.** Jack asked
for that specifically.

### Two things Jack proposed that do not work, and what replaced them

**The background tab.** His idea was to open the track on SoundCloud in a new
tab while keeping the reader on the site, so the play button escaped embed
constraints. Browsers do not permit it. `window.open` takes focus by design,
because that is how popunder ads worked, and audio in a background tab is
throttled regardless. **The facade delivers what the idea was reaching for**:
nothing loads until they ask, and nobody leaves the page.

**Spotify embeds for the Wayspace album.** Jack suggested these for the tracks
SoundCloud does not have. A Spotify embed serves a **30 second preview** to a
logged out visitor, and prints a "Preview" badge next to the title saying so.
Most portfolio visitors are logged out. This is the same finding already
recorded under "Decisions: creative portfolio" from 2026-08-15, reached
independently a second time, and it fails Jack's own requirement that a person
can play the full track.

### Where the 62 lyric pages actually stand

Measured 2026-08-23 against Jack's SoundCloud (74 tracks) and all 12 Spotify
releases in `_source/music/STREAMS.md`.

| | Count | What ships |
|---|---|---|
| On SoundCloud | **48** | The listen bar, full playback |
| Nowhere | **14** | An `Unreleased` flag in the hero |

**The 16 that were Spotify-only are closed.** Jack uploaded them on 2026-08-23,
which was the clean fix and means one mechanic now serves every playable page:
`soundcloud.com/jackintheway/sets/wayspace` (24 tracks), the four missing Feivel
Speaks Deluxe tracks, and RACE DAY. The Spotify preview embed was never shipped
and should not be. He skipped the 25th Wayspace deluxe track, a demo of
Somewhere Somehow, on purpose.

Track lists for every Spotify release, including per-track IDs, can be pulled
from `https://open.spotify.com/embed/album/{id}` which carries a `__NEXT_DATA__`
JSON payload with a `trackList`. No API key needed. The Wayspace deluxe carries
25 tracks and is where `Saw` and `Blurry` come from, which explains those two
loose covers in `_source/cover-artwork/`.

### Ribbons carries two bars

Confirmed by Jack on 2026-08-23: Ribbons exists as a 2:52 cut and a 4:11
extended cut called **Ribbons (Me & You)**, and the lyric sheet on the page
holds the words to the extended one. So both belong there.

The first bar keeps the room's usual "Click play to listen". The second reads
"Or the extended version" and names itself in the meta line, because two bars
with identical leads would not tell a reader which is which.

**Only one plays at a time.** Pressing the second bar puts the first back the
way it was before starting the second, which is why `js/lyric-audio.js` keeps a
clone of every bar rather than discarding the markup when it swaps. Two
recordings of the same song talking over each other would be the obvious bug
here and it is tested against.

An automatic title match sent this page at the extended cut, because it is
longer and the tie-breaker preferred length. The page says "Released 2024" and
the extended cut was uploaded in 2026, so the pin is explicit now.

### Only Human carries two bars

Same arrangement as Ribbons, and for the same reason. Jack on 2026-08-23: the
original is the one credited to Fabrizio, and the stripped cut is the alternate,
so both belong on the page. The first bar is **Only Human** (id `774148888`,
3:49) with the room's usual lead. The second is **Only Human (Stripped)** (id
`783771448`, 2:51), reading "Or the stripped version" and naming itself in the
meta line.

The producer credit is dropped from the visible copy on the first bar. It is a
credit, not a version name, and the page only needs to tell a reader which of
two recordings they are about to hear.

### One auto-picked version still worth Jack's eye

Where a title matches more than one upload and neither is in an album set, the
longer non-demo version wins. That still chooses **Safe & Sound (Reprise)** over
Safe & Sound (Prod. kojo a. & Nicky Quinn). It is a guess and can be swapped by
changing one `data-track` attribute, or turned into a two-bar page like Ribbons
and Only Human if both cuts should be there.

### The ads are off (2026-08-23)

Jack turned monetization off after hearing a pre-roll on Only Human. **Nothing a
visitor can reach on this site can serve an ad**, verified against the API across
every path: all six Music room albums, both Music room singles, and all 48 lyric
pages.

Two uploads are still `AD_SUPPORTED` and neither is reachable from here.
CRUNCHWRAP JACK is in no wired playlist and has no lyric page. The standalone
Little Things was orphaned when its lyric page moved to the album upload. They
are findable on SoundCloud and nowhere on jackrome.work.


### The typo

`do-your-hear-that` shipped as a slug and as a visible title. Fixed to
`do-you-hear-that` and "Do You Hear That?" across the page, the Writing array,
the share card source and the rendered card, with a 301 in `netlify.toml` so the
old path keeps working.

**"The Help" and "Help?" are different songs.** Per Jack: Help? is a 2017 single
that is not on the music page at all, and he may bring the 2017 tracks in later.
The fuzzy matcher paired them and it was wrong. `the-help` is Unreleased.

---

## The 2026-08-23 batch

Twelve changes Jack asked for in one pass. The ones carrying a decision:

**American spelling, site wide.** "colour" is now "color" everywhere, 126
occurrences across 76 files. Nothing was an identifier; it was all prose.

**The room switcher hovers in each room's own color.** Orange for all six was
the site's default link behaviour rather than a decision, and it made six
destinations look like one. Each link carries `is-<room>`, and the CSS sets two
properties per room: the true color for the underline, and a `-deep` variant for
the text, because yellow and salmon fail as body type at their true value. Brown
has no `-deep` token and needs none.

**Speaking came off the live site.** Nothing to put in it yet. The page is
deleted rather than standing empty, `/wayspace/speaking` 301s to `/wayspace`,
and the switcher and the landing grid both drop to five rooms. The `SPEAKING`
array, its `renderRoom` call and the share card all stay, so restoring the room
is restoring one file.
[Note 2026-10-05: Speaking was restored. It reopened 2026-08-30 and is live at `wayspace/speaking.html`; there is no 301 for it.]

**"The release" is gone from all 62 lyric pages.** Per Jack: "Back to Writing"
is enough. Twelve of those pages also carry a lyric video, and their button row
survived with the video button in it.

**Watch happens on the page now, not in a new window.** `js/video-modal.js` is
one `<dialog>` serving three surfaces that had the same problem: the fourteen
shorts in Writing, the five episode videos in Podcasts, and the twelve lyric
pages with a lyric video. `<dialog>` rather than a hand rolled overlay, because
`showModal` gives the focus trap, Escape, the inert background and returned
focus for free.

The facade rule holds: nothing is requested from YouTube until Watch is pressed,
and **closing removes the iframe rather than hiding it**, so a closed video is
not still playing. That teardown fires on the `close` event, which is
asynchronous, so a test that checks in the same tick as the click will report a
failure that is not there.

Shorts open portrait, everything else 16:9, from `data-ratio`.

**Video cards take the shape of the video inside them.** `--facade-ratio` per
item, defaulting to 16:9. In My Head is square and was sitting pillarboxed in a
wide box, so its thumbnail was recropped square from the 640x480 source with
YouTube's letterbox bars cut off, 364x364 native. YouTube has no `maxresdefault`
for that id; `maxres1.jpg` exists at 1280x720 but is a mid-video frame of a
television, not the character everyone recognises.

**Writing is a grid grouped by year.** Seventy six entries in one column is
something you scroll rather than navigate. Now: filter by kind, jump by year,
cards under a heading per year, newest first. The controls are built from the
array, counts included, so they cannot drift from what is rendered. Orchard has
no year in its meta and sorts last under "Undated"; if it gets a date, that
bucket disappears on its own.

The non obvious part: filtering hides cards, so a year heading whose cards are
all hidden has to be hidden too, or the page fills with empty years.

**Podcasts carry both the watch and the listen.** Every episode of Jack's show
also exists as video. Watch comes first because it happens here; Listen stays a
black link because it leaves for Apple. Crossing The Bridge is audio only.

**The Podcasts copy is Jack's.** "Shows hosted and produced by me. Conversations
at the intersection of creativity, spirituality, and culture." The old line said
"produced for other people", which had it backwards: this room is mostly his own
show. Crossing The Bridge was client work for Tribly, and per Jack it was his
build, his scripting and his hosting as lead producer, with their CEO closely
involved, so the note says produced rather than only hosted.

**The Design lineage copy is Jack's own, verbatim**, down to the italic on "in"
and the one exclamation mark. Do not smooth it. The rest of that page had a
jacks-voice pass the same day, which is why it moved to first person.

One consequence worth knowing: "Point at one to play it. On a phone, tap." came
out at Jack's request, so the tool clips are now an undiscoverable hover. The
tiles carry no play glyph. If that reads as broken rather than as a reward, the
fix is a cue on the tile rather than putting the sentence back.

---

## The production page, and a facade bug on two pages (2026-08-24)

**The played video kept losing its shape, and yesterday's fix only covered half
of it.** `initFacades` swapped the `<button class="facade">` for the iframe
directly, which drops every rule the button carried: `.facade` sets the aspect
ratio and `.facade iframe` fills it, and neither can match an iframe that is no
longer inside a `.facade`. Cards went from 334x188 to 334x154 on play, which is
an iframe sitting at its default 150px height.

Yesterday's `--facade-ratio` work fixed the thumbnail's shape and not the
player's, so In My Head was square until you pressed it. **The bug was on the
production page and in the Video room, and both are fixed the same way:** the
iframe goes inside a replacement `<div class="facade is-playing">` that carries
the class and the inline ratio across. A div rather than the button, because a
button holding an iframe is invalid and swallows the player's own controls.

Verified by measuring the card before and after the click, which is the check
that would have caught it the first time.

**Copy changes, all Jack's, 2026-08-24.** "What it's for" removed entirely,
along with the subtitle under "What this looks like" and the line over "The
work". His note on the pattern: they were each describing a thing rather than
letting the thing be there.

**How I work is his own copy**, lightly polished at his invitation. Consulting
rather than freelancing, grateful rather than proud, and the ICF-accredited
coach training named because it explains the pace rather than decorating it.

**The bottom CTA is a question now.** "Tell me what you're making" asked a
visitor to summarise a whole project before saying hello. "What are you working
on?" is what Jack would actually open a call with, chosen from four auditioned
options.

**Four testimonials, not three.** Jane Radford, DeAnna Houston, Allan Ishac and
Maureen Quinn. Seth Power's is the one left out, per Jack: it is about community
management at Grouped, the least production-shaped of the five. Note the
spellings, which differ from how Jack said them: **DeAnna** Houston and
**Allan** Ishac.

Two overstatements came off entries in `js/production.js`: the three names on
the Awakening Mind interview, and "taught her to run it herself" on Maureen's
site.

---

## The Wayspace room switcher gets a mark, not text (2026-08-24, corrected same day)

`.room-switch-home` used to be the word "Wayspace" as a plain link, on all 66
pages carrying the switcher. Per Jack: a small version of the actual logo,
sized to the strip, with the same hover motion the site's buttons already use.

**First pass read "the actual logo" as the flower-and-spiral badge** at the
center of the Wayspace album cover, and built one from scratch: composited
fresh from its own transparent layers, `FLOWER.png`, `SPIRAL.png` and
`WAYSPACE.png` in `_source/design/wayspace-animated-artwork-pieces/`, stacked
in a throwaway HTML page and screenshotted in headless Chrome since this
machine has neither ImageMagick nor Pillow, then cropped to the flower's true
alpha bounding box.

**Jack corrected it the same day: he meant the wordmark**, the one already
running as the lobby hero on `wayspace.html`, not the album badge. That asset
already existed, clean, as `assets/img/wayspace-straight.svg`, so the second
pass needed no building at all, only a size rule: `height: 20px; width: auto`
rather than a fixed square, since the wordmark's real ratio is 2710x449 and
forcing it square would have squashed it. The flower composite,
`assets/img/wayspace/wayspace-mark.png`, is deleted rather than kept unused.

The switcher link keeps the word "Wayspace" as its `aria-label` rather than
visible text, `alt=""` on the image itself, and the same
`transform: translate(-1px, -1px)` hover every other button on the site
already uses rather than a new motion invented for one element.

## The Wayspace lobby hero is blue (shipped 2026-08-24)

Jack asked whether the "Welcome to WAYSPACE" hero should run on the room's own
blue instead of paper, and asked to see it before deciding. Built as a scoped
CSS override, screenshotted at desktop and 390px beside the paper version, and
shipped the same day once he saw it: `.ws-hero.is-blue` in `css/wayspace.css`.

**Why blue works, in Jack's own words, and why the Video room keeps it too
rather than trading it for a color of its own to avoid the repeat:** orange,
yellow and blue across the top of the lobby read as Music, Design and Video,
and Podcasts and Writing are already folded into those three in practice. Two
rooms sharing blue is the map being accurate, not a collision.

The Video room already ran this exact blue with paper-colored text before this
was built, which is why "would white text look weird" had an answer before the
question was even tested: no, there was already a working example of it on the
site.

---

## The Website Materials batch (2026-08-24)

Jack keeps a running note in his Obsidian vault, `Workshop/Website Materials.md`,
as the gathering point for site feedback. This batch closes out everything
under its "new edits" heading, plus six more items he sent live while it was
being reviewed, including a real bug he caught from a screenshot.

**AI Portfolio's ten anonymized skill bullets now carry real slash names**:
`/sweep`, `/portal`, `/mycelium`, `/orient`, `/harvest`, `/deliver`,
`/obsidian-layer`, `/conversation-archiver`, `/synthesis`, and the one that
isn't a Wayspace skill at all, "The verification tool," which stays plain
text. This settles a tension from the day before: the wiki auditor bullet had
just been given the invented public name "Weak Wiki Link Auditor" specifically
so its real skill name, `/mycelium`, stayed private. Jack's instruction to
"actually name the rest of the skills" reversed that a day later, so it is
`/mycelium` now, matching the pattern rather than keeping the exception.

**The Wayspace album cover plays on hover now, same mechanic as the tool
pack.** `wayspace-animated-artwork.mp4` had been estimated in an earlier
session (10s loop, ~1MB) and never wired in. Rather than build a second hover
mechanic, `initToolClips()` was generalized to delegate from `.lineage`, the
shared ancestor of the tool row and the album step, instead of the single
`#toolRow` it used to bind to. One set of hover/tap/`prefers-reduced-motion`
listeners now covers every `.tool-tile` in the section. The album's tile
turned out not to need a size override at all: `.tool-tile` is `width: 100%`
with no fixed dimension of its own, so it naturally renders at whatever its
container allows, 560px inside `.step-figure` versus ~170px inside
`.tool-row`. A real conflict was caught before shipping: giving the image
both `.step-art` and `.tool-still` doubled its border and shadow on top of
the button's own, since `.tool-tile` already carries both. Fixed by dropping
`.step-art` from that one image, since `.tool-still` already provides
equivalent sizing.

**The whole lyric card opens the lyric now, not just the title**, via a
stretched link rather than new click-handling JS: the title's own `<a>` gets
a `::after` stretched with `inset: 0` over the card. One real anchor per
card, no nested-anchor problem. Verified with an actual click-and-navigate
test, not just geometry: a click 15px above a card's bottom border, well
below its title text, navigated the iframe to that card's own href. Only
applies where a title is a real link, which is every lyric and no short,
with nothing extra written to keep shorts out of it.

**"Load bearing" is now in the jacks-voice dead-vocabulary list.** Jack
caught himself reaching for it in a dictated edit and asked that it be banned
the same way "delve" and "paradigm" already are.

**A real bug, caught from a screenshot mid-review:** Your Sun said "Released
2026" while also carrying the `Unreleased` flag, a direct contradiction.
Every other unreleased-and-written-in-2026 lyric (Inflamed, The Help) uses
"Written 2026" instead. Fixed to match in both the `WRITING` array and the
page itself.

---

## Open items, none blocking

The live ones are listed once, in "Where the next session picks up" above, so they
don't drift out of sync with themselves. This is the closed history:

- ~~`/production` 404s.~~ **Built 2026-08-22, deployed and iterated on since.**
- ~~`/ai-portfolio` not deployed.~~ **Built 2026-08-21, deployed and iterated on since.**
- ~~Wayspace clean URLs unverified.~~ **Closed 2026-08-22.** Checked against the live
  staging deploy: `/wayspace`, `/wayspace/writing`, `/wayspace/music`, and a nested
  lyric page all answer 200 with no redirect. The trailing-slash forms 301 back to the
  clean URLs, which makes the clean form canonical. The `room.html` beside a `room/`
  directory pattern holds for nested paths.
- ~~**`/ai` breaks at cutover.**~~ **Fixed 2026-08-22.** `netlify.toml` now 301s
  `/ai` straight to `/ai-enablement` instead of out to `ai.jackrome.work`, so the
  vanity path no longer depends on a Squarespace hop that dies on 2026-09-15.

---

## The AI portfolio page (built 2026-08-21)

`/ai-portfolio` replaces the separate `ai.jackrome.work` site, which was taken
offline on 2026-08-21. It lives here rather than in its own repo, so the AI work
is a page of `jackrome.work` like any other.

**The link repoint went with it.** Thirteen references to `https://ai.jackrome.work`
across eleven files now point at `/ai-portfolio` and are no longer external, so
they dropped `is-external`, `target="_blank"`, and `rel="noopener"`. Two of those
were content CTAs rather than nav: "See my work" in `ai-enablement.html` and "See
my AI work" in `about.html`. Both had been sending visitors to a host that
redirects back to `/ai-enablement`, so on the enablement page the button returned
the reader to the page they were already on.

**What the page argues.** Not a catalogue of tools. It argues a way of building:
read first and change nothing, show the person, wait to be told, and never write
where you were not invited. That is the claim `ai-enablement.html` already makes
under "What I won't do" ("everything I build has a human approval step if you want
it"), so this page exists to be the receipt for it. The "What they refuse to do"
section quotes the tools' own files.

---

## Case studies (first one built 2026-08-24)

`/case-studies/two-track-class-edit-automation` is the first, built from a
package the `/exhibit` skill wrote. That is the intended pipeline and it now
works end to end: Jack runs `/exhibit` on a finished piece of work, the package
lands in `_exhibits/`, and a page plus an array entry get built from it.

[Note 2026-10-05: the client-naming rule below was replaced. Current rule, in CLAUDE.md: clients are named when the work has already been published publicly or they have shared a testimonial; otherwise their identity stays private in case studies.]

**No case study carries a "client details are withheld by agreement" line.** An
earlier draft of the first one did. Per Jack on 2026-08-24, it framed the piece
around a client the piece is not actually about: the subject is the workflow.

It was also actively counterproductive here, which is the part worth keeping.
`/production` on this same site names Foundation for Inner Peace and Jon Mundy,
and that is who the first case study's work was for. A withholding line two nav
clicks from a page naming the same client does not conceal anything; it tells a
reader there is something to work out, and they can. **So the rule is: name a
client where naming one adds something, and otherwise say nothing about who at
all.** `client` is nullable in the array for exactly this reason. Do not
reintroduce a withholding line without Jack.

The `/exhibit` gate itself is unchanged and still runs: the term-list scan
before drafting, and the shape check, which is Jack's call and not the
scanner's.

**Open, raised by Jack 2026-08-24:** case studies may want to be their own
section of the site rather than a subsection of `/ai-portfolio`, because they
draw from both service lines, `/ai-enablement` and `/production`, rather than
from either one. That is a better argument for the section than the one it was
built on and it is probably right. It is not built, and the cost is that a
seventh nav item touches every page on the site. Most likely shape when it
lands: the hub links from both service pages and does not take a nav slot until
it has the weight to earn one. The section currently on `/ai-portfolio` ("The
same rules, on client work") becomes a teaser pointing out to it rather than
the home for them.

**The share card was rendered on its own**, not through `./tools/og/render.sh`,
so the other seventy PNGs stayed out of the diff. Its title needed retuning off
the `/ai-portfolio` template: at 78px it wrapped to three lines and the yellow
offset shadow collided with the line above. 64px on a 660px measure sets it in
two and clears the puzzle art.

---

## The production page (built 2026-08-22)

The service doorway, sibling to `/ai-enablement`, and the last page in scope.

**It is built on the belief sentence above.** Safety leads, capability follows,
and "How I work" closes on the promise about limits rather than a claim of
completeness.

**The hero changed on 2026-08-24.** It used to share a line with `/about`
("when someone has something they need to bring forth and something technical
is in the way, I'm the person who moves it"). Jack's own read: that describes
removing an obstacle, and what he actually does is find an answer and show the
client how he found it, which is what creates momentum on their end, not a
block getting cleared. Four rounds of auditioning against that correction
landed somewhere simpler than any mechanism-focused line: **"Let's bring your
next project to life."** The old line is cut from `/about` entirely rather
than replaced, on Jack's own read that the mountain passage two paragraphs
below it already makes the point, in language he had already written: "the
person on the mountain slope with a hand down, showing you where to put your
foot as you climb." 

**Two entries are not video**, so they render a solid `work-tile` naming the medium
instead of a facade, and link out. Client work is not all video. Without the tile
those cards collapse and the grid reads as something failing to load.

**Clients are named**, per the decision recorded above. The facade rule holds: eight
thumbnails ship as static images from `assets/img/production/`, pulled from YouTube
at build time, and no iframe exists until a visitor clicks.

Verified locally 2026-08-22 with a harness: 390px with no horizontal overflow, ten
cards rendered, thirty role tags, zero iframes before click, the right video id
built on click, both outbound links carrying `rel="noopener"`, and one
`aria-current`. `check-copy` passes.

~~**One open question in the file**, marked `TODO(jack)`: the Crossing the Bridge
podcast is filed under client work but no client is named in the source material.~~
**Resolved.** `js/production.js` now carries `client: "Tribly"` on that entry, and no
`TODO(jack)` marker remains anywhere in the file.

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
became a house of eight pages, and `/ai-portfolio` was added on 2026-08-21. Current
scope is twelve built pages plus `/production`.

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

---

## Decisions: creative portfolio (approved 2026-08-15)

[Note 2026-10-05: "The open scope question" section no longer exists. It closed 2026-08-20, when Wayspace was built as its own set of rooms; see "Wayspace, built" above. The self-hosted player plan below was superseded: Music plays through a hidden SoundCloud widget (see `docs/decisions/music-player.md`) and lyric pages use a SoundCloud facade.]

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

## Preview locally, deploy deliberately (original wording, before 2026-09-13)

`netlify.toml` sets `publish = "."` and `command = ""`. **There is no build step.**
Netlify copies the folder to a CDN. So a deploy is never required to look at a change.

---

## The Squarespace relationship (original wording)

- **The website subscription is what eventually gets cancelled**, and not yet. It stays
  on through the DNS cutover and for a while after, until everything built here has been
  live long enough to trust. Revisit then, not before.

---

## Known facts, so they are not rediscovered

- **Squarespace has no content API.** Its developer APIs cover commerce only: orders, products, inventory, transactions. Content cannot be synced out, only moved by hand. There is no headless option.
- **URL Mappings die with the platform.** The redirect table in Squarespace does not transfer. `INVENTORY.md` has the `netlify.toml` equivalent.
- **Paths carry over one-to-one.** No redirects are strictly needed for the ten content URLs. `/home` needs a 301 to `/`, and `/cart` and `/blog/category/Toolbox` are platform-generated with no successor.
- **Export images from the Squarespace asset manager, not the CDN URLs on the page.** The page serves resized derivatives; the originals are what to keep. Rename the four placeholder-named files at export.
