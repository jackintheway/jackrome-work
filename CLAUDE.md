# jackrome-work-migration

Project-level context for Claude Code and other agents working with Jack. The user-level `~/.claude/CLAUDE.md` covers Claude Code's working style, tone, and git discipline on the current machine. This file records the website's shared project decisions and history.

## Shared session handoff

At the start of every session, read `HANDOFF.md` and check the current Git status
and recent commits. After meaningful authorized changes, update the checkpoint
there using its handoff protocol. Keep durable project decisions in this file.
Both Claude Code and Codex use the same handoff; Codex's entry point is `AGENTS.md`.

Older status sections below are dated history and may have been superseded by
later work. Verify the relevant files and Git state before acting on them. The
handoff records current context; it does not authorize unfinished work or override
Jack's decisions. Read-only evaluations stay read-only unless Jack asks for a
saved report or handoff.


## Current editorial decisions: 2026-09-12

These decisions from Jack supersede broader or dated wording below.

- Preserve the public Production credits and existing About information. Those
  credits are already public and provide evidence of the work. In AI Portfolio
  and case-study writing, omit client identities as a courtesy unless Jack has
  specifically approved naming them. There is no agreement requiring anonymity;
  do not claim one. Existing attributed testimonials stay as written.
- Jack wrote the portfolio's opening line about technical ability and willingness.
  Keep it. He rejected its proposed Red Pen replacement.
- Lyric em dashes are Jack's own punctuation and stay. Correct imported word joins
  and missing line breaks without rewriting lyrics. Match the masked word without
  case sensitivity, including all-caps variants. Still Distracted's two occurrences
  are lowercase and masked, and the page carries the same explicit-language notice.
  Published lyrics change; the source archive stays untouched.
- Italicize the book title *A Course in Miracles* wherever visible text supports
  formatting. Keep metadata and accessible labels as plain text, not HTML markup.
- Browser tools have task-specific dependencies. A static reference or calculator
  can be a standalone file with no login; AI calls require a service. Agree on
  accounts, access, and running costs for each build. Do not promise no vendor costs.
- Write boundaries depend on the task. Compost is for new vault material; a Git
  save point and a project handoff have different destinations. Handoffs may be
  delivered in chat or in the existing project file and support work across agents.
- First-call expectations accompany the booking buttons on Home, AI Enablement,
  and Production: 45 minutes to discuss the work and whether Jack can help, with
  email as another way to make contact. Do not invent pricing or a free-call claim.
- Keep the two-track editing case study. Its revised account follows the full
  session record: end trim, 19 scripted removals (middle discussion plus 18 asides),
  verified first gap-close, then two late corrections verified as matching gaps.
  The final closure was predicted but not verified in that record. The outro
  extends the speaker track beyond the teaching cut. Do not describe equal track
  lengths, a verified final closure, or a tested safe rerun.
- Case-study diagrams are schematic and use no client media. Newly written copy
  remains reviewable locally until Jack authorizes publication.
- Cross-room links use stable entry anchors or specific lyric URLs. Music's two
  album lyric links use Writing's `collection` filter. Membership comes only from
  explicit catalogue metadata. Do not infer a release from a performance date or
  create missing counterpart entries just to complete a cross-reference.
- `404.html` provides recovery for missing paths; it stays out of the sitemap.
  `robots.txt` points to `sitemap.xml`. Run `python3 tools/update-sitemap.py` after
  adding or removing public pages. It reads canonical URLs and adds no guessed dates.
- Jack authorized a local /handoff demonstration and the Wayspace artwork arrival
  on 2026-09-12. The demo uses this website's September 12 link-update checkpoint
  (633121a), quotes Jack's request, and clearly dates the shortened handoff. It
  reveals recorded material and copies a note; it does not run an AI model.
- After viewing the arrival, Jack preferred normal page scrolling with independent
  artwork movement. At 800px and wider, the artwork sits beside the rooms; its
  layers move on CSS timelines and hover pauses them. A keyboard pause button
  appears on focus. Coarse pointers and reduced-motion users get a still composition.
  Two copies of the existing puzzle mark float at the artwork's corners.
- Below 800px, hide the complete artwork figure, including its caption and puzzle
  marks. The welcome leads directly into the room list. "Choose a room" is removed
  at every width. This supersedes the earlier stacked-artwork and shortcut previews.
  Read MOTION.md for the implementation. This remains a local preview.
- The handoff demo keeps the dictated request verbatim with the italic caption
  "Spoken aloud using Wispr Flow." Its surrounding explanation speaks as Jack:
  "My request" and "our decisions." The recorded agent-to-agent note still uses
  Jack's name to orient its recipient.
- The second case study keeps the event-remaster-and-language-conform URL and now
  covers both installments as "Remastering an event with Codex." Part 1's timing
  map and Spanish review file remain distinct from Part 2's editable graphics
  rebuild, approved photo treatment, guarded nested-media repair, and restored
  framing exceptions. The original missing builder belongs to Part 1; the rebuilt
  editable system belongs to Part 2. Do not collapse those into one delivery.
- Its two diagrams use generic geometry: three timing coordinates, then 33 default
  card positions plus 2 approved exceptions. The latter shows corrected framing;
  a prospective exception registry remains an improvement, not a delivered feature.
  The follow-up's illustrative pseudocode is not a shipped implementation excerpt.
- Part 2's English broadcast is Jack-reported. Its Spanish conform is open; Part 1's
  saved record still stops before listening approval and translated-card approval.
  Metadata, stream analysis, and saved-state checks are not independent full playback.
  No client media, identifiers, private ledgers, or source dialogue belong in this
  public case. Omit the follow-up package's stale "withheld by agreement" line.
- Jack has read and approved both case studies, including the Part 2 prose.
  Publication still requires his explicit go. Keep private portfolio materials
  out of the example and preserve the existing tool selection.
- Make the case studies easier to find through links to /ai-portfolio#clientTitle.
  AI Portfolio's hero uses "See case studies" with a downward arrow. Production
  links from its hero, and AI Enablement links from "How I work" beside a separate
  "Explore AI Portfolio" button. Keep the existing section title and main navigation.


- Jack authorized a local "Find something" guide. It searches public pages and
  published catalogue entries, returns at most three local destinations, and offers
  email when it cannot find a close match. It makes no AI calls and does not store
  or transmit queries. No private exhibits, source archives, or agent notes belong
  in its index. Pricing and current availability questions go to email.
- The guide speaks in first person: "Email me" and "Prefer to ask me?" Results
  update as the visitor types. Jack preferred removing the redundant Find button.
  It opens on request from the shared header, never automatically.
- The new control moves the collapsed navigation breakpoint to 1080px. nav.js
  adds it centrally to every public page and the 404 page. The guide uses local
  MiniSearch, an accessible native dialog, and the existing design tokens.
  Refresh its checked-in public index with tools/build-guide-index.py after copy
  or catalogue changes. README.md records the checks and source boundaries.
- Jack noted that the portfolio has grown beyond tools built to stop and ask.
  Jack approved "How I work with AI." with personal tools and
  client projects introduced together. The specific approval boundaries remain
  in their existing sections. Metadata and the versioned v2 share card follow
  the new opening; the previous published image remains untouched.
- The portfolio introduction goes straight to "As AI tools advance" after the
  hero. Jack removed "How these tools are built" because it repeated the hero
  framing. Keep patternTitle as a destination on the introductory block.


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

### The six rooms

Each is a **form Jack's creative work shows up in**. That is the organising principle
and it is what resolves the overlap: a podcast that also exists as video is filed by
the form it primarily lives in, and the other room points across at it.

| Room | Color | Holds |
|---|---|---|
| Music | orange | Releases, streaming links, the room's player |
| Video | blue | Anything whose form is video, including live performance |
| Design | yellow | Cover art, logos, flyers, merch, and the design system |
| Podcasts | green | Shows hosted, joined, and produced for other people |
| Speaking | salmon | Talks given, events hosted |
| Writing | brown | Lyrics, each with its own page and track, plus prose |

**The color is structural, not decoration.** A room announces its color as a swatch
on the landing list, wears it as its hero, and carries it on its share card. So the
map is learned by color before any puzzle art exists, and when the pieces get drawn
they are already coded. It is set once per page as `--room` on the `<body>`; every
component in `css/wayspace.css` reads that property rather than naming a color.

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

### How the rooms are built

- `wayspace.html` at the repo root, plus
  `wayspace/{music,video,design,podcasts,speaking,writing}.html`, and
  the 62 lyric pages in `wayspace/writing/`.
- **No directory carries an index.html, and that is deliberate.** Measured against the
  live deploy on 2026-08-20: Netlify answers a directory index with a **301 to a
  trailing slash**, so `wayspace/index.html` made `/wayspace` redirect to
  `/wayspace/` on every visit. The Wayspace link is in the nav of every page on the
  site, so that was a redirect on every click, and the canonical tag pointed at a URL
  that redirected.

  A flat `.html` file one level up serves the same path at 200 with no redirect. The
  ambiguity that argued for an index in the first place (which file answers
  `/wayspace/writing` when both `writing.html` and `writing/index.html` exist) does
  not arise, because the directory has no index to compete. **Any room that grows
  child pages follows this shape:** `room.html` beside a `room/` directory that
  contains only the children.
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

Three things in those files are vault furniture rather than song, and
all three reached a public page before being caught:

1. **Vault annotation.** 44 of the 53 end with a `---` rule and then
   `**Claude's Commentary**` or `**Notes worth creating from this
   entry:**`, left by earlier delivery runs. These rendered as closing
   verses. Anything from that marker down is cut.
2. **Front matter inside the body.** 30 files repeat title, written,
   released and album as the opening lines of the body as well as in
   the YAML above it. That rendered as the first verse.
3. **`[[wikilinks]]`**, in all fifty. They point at vault notes that do
   not exist on this site, so they are flattened to their text.
   `[[a|b]]` keeps `b`. Bare `#tag` lines go entirely.

**Any future import from the vault must do all three.** The generator
is not kept as a script, so this is the record of what it had to do.

**Em dashes in lyrics stay.** Three do: `choose-again`, `poof`, and
`strawberry-sauce-all-the-same`. The house rule governs copy written
for this site; a lyric is quoted work and repunctuating one would be
editing Jack's art. `check-copy` carries the exception and a check that
handles it, which needs to read inside `.lyric-body` rather than grep
by line: those paragraphs are `white-space: pre-line`, so a lyric runs
across many lines inside one element and the line with the dash does
not carry the class.

**Unreleased songs have pages.** Per the room rules a lyric does not
need a release to earn one. Those carry the year written instead, and
have nothing to link across to.

### Still to do here

Only the twelve Wayspace lyrics carry a lyric video and Jack's per
track note. The other fifty have neither, because their sources do not
hold one. Feivel Speaks has audio in `assets/audio/` for two tracks and
could carry a player on those two pages.

---

## A note on the lyrics themselves

**One word is masked, everywhere, and seven pages carry a notice.**
Settled with Jack 2026-08-23.

All 40 instances of that word across 7 songs render as `f*ck` / `F*ck`.
Salt is 30 of the 40; the other six songs have one to four each. The
seven pages also open with:

> This song contains explicit language.

**Both, not one or the other.** The notice is what stops a reader being
surprised. The masking is what Jack wanted for the page itself.

**The notice is not a gate, deliberately.** A blur-and-reveal was
considered and rejected: the words stay in the document either way, so
a screen reader still reads them, a search engine still indexes them,
and view-source still shows them. It would produce the appearance of
protection rather than the fact of it, and cost JavaScript on 62 pages
to do so. A plain line is honest.

**Sources are left uncensored on purpose.** `_source/` is the record.
Only published pages are masked, so **any regeneration must reapply
both the masking and the notice**. The rule: mask `\b[Ff]uck` inside
`.lyric-body` only, and add the notice to any page where it appears.

Watch the pattern when checking. `[Ff]\*?uck` does **not** match
`f*ck`, because the `u` is the character that was replaced. It missed
Salt on the first pass and left that page without its notice. Use
`[Ff]\*?u?ck` to catch both forms.

Nothing else gets sanitised. A lyric otherwise publishes as written.

Worth holding: `jackrome.work` also carries `/production` and
`/ai-enablement`, which sell to nonprofits and to the Foundation for
Inner Peace, and the nav puts both one click from these pages.

**Two transcription typos in Salt**, inherited from the metadata export
rather than introduced here: "Iknow" and "Iwas", both missing a space.
They are in the source JSON too. Jack's to fix, since they are his
words.

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

### The tools are hidden in the album covers, on purpose

Confirmed by Jack on 2026-08-23, and it is the detail that makes the lineage
checkable rather than asserted. The boombox is on the cover for **Salt**, two
helmets are on **Little Things**, the hoverboard is on **Try**, and the petal
detector is on a tripod on **Did You Forget**. His words: "I incorporated those
so there would be easter eggs in the future."

**The page names none of them.** A first pass named two, on the reasoning that
one reads as coincidence and two teaches a reader to look. Jack overruled it on
2026-08-23 and he was right: a named egg is not an egg. The page now says only
that pieces of the pack are hiding across the covers and that he is not saying
where. **Do not name any of them on the page.** The list above is here so a
future session recognises them, not so it can publish them.

**Two Little Things covers exist and only one is right for this room.**
`little-things.jpg` is the album-set cover, the one with the helmets, and it is
what ships. `little-things-cover-artwork.jpg` is the single release version,
butterflies and the flower spiral, and belongs to Music if anywhere. `try.jpg`
and `try-cover-final.jpg` are the same split: the album-set Try has the
hoverboard, the single release is a photographic swirl.

### The "hand-made, no AI" line was retired, not deferred

`wayspace/design.html` carried a `TODO(copy)` asking for that framing and
warning it was the most easily misread sentence on the site. Asked directly on
2026-08-23, Jack chose to leave the claim out:

> we leave it out and say it without saying it because I crafted this design
> system over the course of the last 10 years, with it really starting to show
> sprouts in 2020 when the Wayspace name and color scheme started to come into
> being. That shows that it was handmade because of how long I have been
> working on it.

So the room makes the point with dates and does not make it in a sentence. **Do
not put the sentence back without asking him.** The TODO is gone from the page
and this is what replaced it.

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

Widget parameters, all confirmed live: `color=#000000` per Jack,
`auto_play=true` because the click is the gesture, `hide_related=true` and
`show_teaser=false` which together are what answer "no auto-play after", and
`show_comments=false`.

**The thumbnail is self hosted** at `/assets/img/wayspace/writing/`, 49 files at
128px for 416 KB total. It has to be: pulling it from SoundCloud's CDN would
contact a third party on page load, which is exactly what the facade exists to
prevent.

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

**Album tracks are pinned to the album's own upload, not matched by title.**
Several songs exist on SoundCloud twice, once as an older standalone upload and
again inside a 2026-08-23 album set. A title match alone sent `little-things`
and `try` at the older uploads. The playlist at
`https://soundcloud.com/jackintheway/sets/{set}` carries an ordered list of
track ids in its `__sc_hydration` payload, and pinning from that is what makes
the lyric page play the version the page is actually about.

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

**How this works, so it is not relitigated.** Ads ride on per-track monetization,
not on embedding. A search summary Jack found claimed ads cannot be disabled on
embedded tracks; that is wrong as stated, and SoundCloud's own help centre says
an embedded track carries an ad when its owner "is part of the revenue sharing
level of our creator partner program **and has enabled ads on their content**,"
disableable per track from the track's edit page. The API agreed before Jack
touched anything: 9 of 104 uploads carried the flag, and if embeds served ads
unconditionally it would not vary.

**If a new upload ever gets monetized, it can serve an ad.** The check is
`monetization_model` on `api-v2.soundcloud.com/users/110417764/tracks`, held
against the `sc` ids in `js/wayspace.js` and the `data-track` ids under
`wayspace/writing/`.

### The typo

`do-your-hear-that` shipped as a slug and as a visible title. Fixed to
`do-you-hear-that` and "Do You Hear That?" across the page, the Writing array,
the share card source and the rendered card, with a 301 in `netlify.toml` so the
old path keeps working.

**"The Help" and "Help?" are different songs.** Per Jack: Help? is a 2017 single
that is not on the music page at all, and he may bring the 2017 tracks in later.
The fuzzy matcher paired them and it was wrong. `the-help` is Unreleased.

---

## The Music room player (rebuilt 2026-08-23)

The room already had the interaction. `wayspace/music.html` has a sticky player
bar and every cover is a remote control for it, with no SoundCloud box anywhere.
What limited it was storage: it played self hosted MP3s, three files for 20 MB,
so only 3 of 20 cards had a Play button.

It now drives a SoundCloud widget that is never shown, through the Widget API.
**Eight cards play instead of three, and `assets/` went from 36 MB to 17 MB.**
Deleting the MP3s does not shrink `.git`, which keeps the blobs; it shrinks every
deploy and every push from here on.

### Why this room hides the widget and the lyric pages show it

Asked directly by Jack on 2026-08-23: if hiding works here, should the lyric
pages do it too? **No, and the lyric pages were left exactly as they shipped.**

- **The two pages are opposite shapes.** Music is a grid, where revealing a 166px
  player either shoves the layout sideways or crushes the player. A lyric page is
  one song in one column, read by someone who may want to scrub to the second
  verse, and the visible player gives scrubbing away free.
- **Attribution.** SoundCloud's API terms require "clearly visible backlinks from
  the relevant sounds within your app to the URL for the relevant sound on
  soundcloud.com (permalink_url)" and credit to SoundCloud as source. The visible
  player satisfies that by itself. Hidden, we owe it by hand, which is why the
  bar carries a `#playerLink` that follows whatever is playing.
- **The ad clause.** "You must not remove or attempt to remove or interfere with
  any advertising delivered via the SoundCloud API." Hiding the player on the
  lyric pages would remove an ad surface that already exists there. This room had
  no SoundCloud player at all, so it adds plays where there were none. That is
  the distinction, and it is a judgment call rather than a certainty. If it ever
  needs undoing, show the widget in the bar instead of the transport.

### What plays what

Race Day `2386806162` and Only Human (Stripped) `783771448` are tracks. Feivel
Speaks (Deluxe) `1919548507`, Wayspace (Deluxe) `2288049135`, Jackpot
`1293914818`, Get Lost `1079576932`, Jahny `685445952` and So Much For So Long
`550795005` are playlists. Twelve cards have no `sc` because the work lives on
another artist's account, which is normal and not a gap.

**Two cards could play and deliberately do not.** Wayspace (2022) is the twelve
track album and the only Wayspace set is the twenty four track deluxe already
wired above it. Feivel Speaks (2024) is the same: Jack extended
`/sets/feivel-speaks` to all fifteen tracks on 2026-08-23, which made it the
deluxe and left the standard album without a set. Per Jack: two buttons pointing
at the same tracks are two buttons doing one thing.

### Three things that had to be right, and were wrong first

**The API loads before the iframe, not after.** Built the other way round, the
iframe can finish loading and announce itself before `api.js` has arrived to
listen. READY is missed and nothing after it fires: no title, no backlink, no
progress, and a transport that looks alive and does nothing. Caught by the
harness, not by reading.

**The frame goes into the document before `SC.Widget()` attaches to it**, which
is the opposite of what looks right. api.js finds an existing widget by the
iframe's `contentWindow`:

```js
var c = g(v(e)); return c && c.instance ? c.instance : (…new widget…)
```

A frame that is not in the document yet has a null `contentWindow`. **So does a
frame that was just removed.** Attach before appending and that lookup matches
the destroyed frame's stale record and hands back the dead widget, so every bind
after it goes nowhere. api.js never drops those records, so it degrades with
each press rather than failing once. Order that works: `src`, append, attach,
bind, all synchronous. `src` has to be first because `SC.Widget()` reads it and
throws on an empty one.

There is no race in appending first. The iframe cannot post a message until the
current task finishes, and `bind()` runs inside it. The READY miss above came
from an await between creating the frame and binding, not from these two lines.

**Every press builds a fresh iframe.** Reusing one and swapping sounds with
`widget.load()` is the obvious design and it did not survive testing: the first
press plays and every switch after it leaves the widget dead, in all three cases,
track to album, album to track and track to track. Rebuilding costs a second
iframe load and buys back a guarantee worth having: destroying the old frame is
what stops the old audio.

**`is-live` is cleared on every rebuild, not just set.** Leaving it on let a dead
player wear the previous one's state, which is what hid the bug above behind a
bar that looked fine and a harness that said READY.

**The widget is parked off screen, not `display:none` and not a zero box.** A
player with no box gets its media suspended in some browsers.

### Verifying this one is different

`--virtual-time-budget` starves the cross-origin frame: the widget iframe never
loads, so every playback assertion fails for a reason that has nothing to do with
the code. The working method is a real-time headless run whose harness POSTs its
results back to the local server, which is why `_verify-play.html` sends rather
than being read out of the DOM.

Two assertions were also too loose at first and let real failures read as passes.
Checking a title is "not the placeholder" passes on an error message. Assert the
absence of the error text and the change in the backlink.

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

## Pinned for later: the merch store

`https://wayspace-shop.fourthwall.com/` is Jack's store. Raised 2026-08-23 and
deliberately parked. His words: "we can put a pin in this for CLAUDE.md to come
back to, not even required for this build."

Three domains already forward to Fourthwall (`jackintheway.me`,
`jackintheway.store`, `wayspace.store`) and those forwards survive independently
of this site, so nothing about the store is on the cutover path. Revisit after.

**A shape for the revisit, from Jack on 2026-08-24:** a section in the Wayspace
lobby that links out to `wayspace.store` rather than a full room of its own. Still
parked, but now with a direction rather than a blank pin.

**Domain forwarding confirmed 2026-08-24:** it is `wayspace.store` that forwards to
Fourthwall, not `jackintheway.me` as this section previously said. `jackintheway.me`
actually forwards to bio.site; see the bio.site section above, which is where that
domain's future is actually being decided. `jackintheway.store`'s target is still
unconfirmed.

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

**The set of tools shown is settled, and was chosen deliberately.** Do not add a
tool to this page, and do not name one that is not already on it, without Jack.
The reasoning behind the selection is recorded outside this repo, in
`~/.claude/plans/`. It is not written down here on purpose.

**The old portfolio repo is `../ai-work-portfolio/`, it is private, and nothing
publishes from it.** It stays useful as a design reference and as an archive. Read
it; do not copy content out of it onto this site.

---

## Case studies (first one built 2026-08-24)

`/case-studies/two-track-class-edit-automation` is the first, built from a
package the `/exhibit` skill wrote. That is the intended pipeline and it now
works end to end: Jack runs `/exhibit` on a finished piece of work, the package
lands in `_exhibits/`, and a page plus an array entry get built from it.

**`_exhibits/` is gitignored, deliberately.** The packages are scrubbed and
scan-gated, but this repo is public, so a package waits there unread by anyone
until Jack has read it himself. What ships is the page built from it. Same shape
as `_source/`: originals stay off the wire, the derivative is committed.
Canonical copies of cleared packages go to `Claude Creations/exhibitions/` in
iCloud, matching the archive convention for skills.

**`js/case-studies.js` went in with the first entry rather than the third.**
`ai-portfolio.html` is hardcoded prose, which was right when the page was one
settled argument nobody expected to grow. Case studies arrive one at a time on
no schedule, so hardcoding the first meant hand-editing that page every time
after. The data file is the expensive thing to retrofit; the hub page is cheap
to add later, so the expensive thing got built first. Adding a case study is
adding an object plus a page.

**There is no `/case-studies` index yet, on purpose.** Jack approved keeping the
two case studies on AI Portfolio and adding direct section links from its hero
and both service pages. The bare path still 301s to `/ai-portfolio`. Revisit the
hub when Jack wants a standalone destination for prospective clients or the
collection covers more kinds of work. Three entries is not a prerequisite.
When it exists, the "Back to AI Portfolio" button at the foot of each case study
becomes "Back to case studies."

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

**The work is data-driven, in `js/production.js`.** Ten entries, each carrying
`roles: []`, rendered through pure functions into the `work-card` component that
`css/wayspace.css` already provides. Adding a piece is adding an object.

**The roles are the argument.** Per Jack, every hosted piece was also tech-checked,
recorded, and edited by him, and the 50th anniversary livestream included montages
cut from submitted footage. Thirty role tags across ten cards make the case for
scope without the page ever claiming it. That is why the field is structural and
not decoration, and why a new entry must carry its roles.

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

## The nav (restructured 2026-08-22)

Six links, one row on desktop, a collapsed menu through 1080px. The September 12
site-guide control increased the earlier 860px breakpoint.

**Home was dropped.** The wordmark already links to `/`, so "Home" was a
duplicate of the thing sitting beside it. On `/` the wordmark carries
`aria-current="page"` instead.

**Contact was added**, pointing at Calendly. It is the site's named conversion
path and it was previously reachable only from the hero, the footer, and one
home card. It leaves the domain, so it carries `is-external`, `target`, and
`rel="noopener"` like any other outbound link.

**The order is About, AI Enablement, Production, AI Portfolio, Wayspace,
Contact.** AI Enablement and Production are wrapped in a `.nav-group` that is
`display: contents` on desktop, so the two links flow into the row as though
the wrapper were not there. Below the breakpoint the wrapper becomes a column
with a "Services" label above it. One piece of markup, two layouts, and no
second set of links that could drift out of sync with the first.

**The page stayed `/production` rather than becoming `/studio`.** Studio was
tried and reverted the same day. A studio is a place and Jack does not have
one, and its sibling `/ai-enablement` is named for an activity, so naming this
one for a place broke the parallel inside a group headed "Services". The green
home card also already says "Creative & production", so card, label, and URL
now all use one word.

**The hamburger reversed an earlier decision, and the premise is why.** The nav
comment in `css/site.css` argued against collapsing, on the grounds that five
items fit at narrow widths and a menu would hide the structure to save nothing.
That was true at five. Measured at 390px on 2026-08-22 with six: the labels need
533px against 358px of room, so they wrapped to two rows and the nav took 135px,
about 15% of a phone screen, before any content. It is 74px now. The original
objection is answered by the panel showing every link rather than nesting any of
them behind a second tap.

`js/nav.js` is loaded on all 75 public pages and the 404 page. It handles the menu,
Escape, outside clicks, and clearing the open class when the window widens past
the breakpoint. It also inserts the shared site-guide control. Navigation links
remain in each page's HTML; the guide itself has one implementation.

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

## What the visitor must believe (settled 2026-08-22, with Jack)

`MOTION.md` flagged that this file recorded many decisions about the site and never
the one sentence underneath them: what does someone believe when they leave. Asked
of `/production` first, because it is the unbuilt page. Jack's answer was not about
`/production`. It is site-wide, and it governs `/`, `/about`, `/ai-enablement`, and
`/production` alike.

**In Jack's words, so it does not degrade into a paraphrase:**

> Wow, I would be safe working with him. Working with tech people can feel cold and
> I feel like this guy is gonna be warm. Working with technology can feel risky and
> scary and I feel like this guy is gonna be really caring and encouraging and not
> rush me. And also, wow, he actually does everything I would probably need, and if
> he can't do something I would need he would know how to figure it out or how to
> get me the help that I would need.

### The order is the decision

Safety first, capability second. That is the part to get right, because the
instinctive way to write a service page reverses it: lead with what you can do, hope
warmth comes across. Here, competence is the second beat. It reassures someone who
has already decided they are not going to be made to feel stupid.

### What follows from it

- **Name the fear rather than out-promising it.** The visitor arriving here has been
  made to feel cold, rushed, or stupid by technology before. Copy that acknowledges
  that lands better than copy claiming to be the best.
- **Do not rush the reader.** "Not rush me" is about pacing, and pacing is a
  property of the writing and the whitespace, not a claim to make. A page that
  hurries contradicts its own sentence.
- **Honesty about limits is part of the pitch.** "If he can't do something he would
  know how to figure it out or get me the help I need" is a promise about character,
  not coverage. Do not write around it or replace it with false completeness. It is
  more persuasive than claiming to do everything.
- **Breadth gets shown, never boasted.** Every client item in `_source/client-work/`
  carries three or four roles at once: hosting, recording, tech checks, editing,
  and on the 5.5 hour livestream, montages cut from submitted footage. The `roles: []`
  field on each `/production` entry makes that argument ten times without the page
  ever asserting it.

### It agrees with the register decision, which is a good sign

`MOTION.md` settled the site's register independently as calm, spacious, and
trust-building, reasoning from the medium. This sentence arrives at the same place
reasoning from the visitor. Two different questions, one answer. Where a proposed
change would satisfy one and not the other, the change is wrong.

---

## The rooms are not one to one (settled 2026-08-22, with Jack)

The instinct when building Wayspace is to assume a release appears in Music, its
cover appears in Design, and its lyrics appear in Writing, all matching up. They do
not, and building as though they do would either pad the rooms or hide good work.

Per Jack, the three sets overlap but are independent:

- **Some cover art is portfolio worthy for music the room should not feature.** The
  design stands on its own even where the release does not belong on the site.
- **Some releases belong in Music but their cover art is not design portfolio work.**
  Those use the 640px Spotify pulls and never appear in Design.
- **Some lyrics are from unreleased songs.** They still belong in Writing. There is
  no release to link to and that is fine.

So each room is curated on its own terms. `crossRef` connects entries where a real
connection exists, rather than every room mirroring every other.

Practical consequence for the build: do not generate a Design entry from a Music
entry, or vice versa. Three separate arrays, populated by hand from what is actually
good, and cross-referenced afterwards.

### Client work can be named

Settled 2026-08-22. Everything in `_source/client-work/` is public, published on
YouTube or a live client site, with Jack either credited or under no agreement
restricting him from claiming it. That explicitly includes the Foundation for Inner
Peace material. So `/production` names clients: Foundation for Inner Peace, Potter's
Guild of Frederick, Tribly, Awakening Mind Films, Center for Awakening, and Hands On
Health Acupuncture. Named clients are the strongest proof a service page carries, and
the links make the attribution self evident anyway.

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

Calendly, YouTube, a client's site, and anything else off-domain all count as leaving. `ai.jackrome.work` no longer appears anywhere on this site: as of 2026-08-21 every link that pointed there points at the internal `/ai-portfolio` instead. This applies to hyperlinked text and buttons alike.

Always pair `target="_blank"` with `rel="noopener"`. Without it the opened page gets a handle on the page that opened it through `window.opener`, which it can use to redirect the original tab somewhere else. Modern browsers imply this, but stating it costs nothing and does not depend on the visitor's browser being current.

## Location and dates (standing rules)

- **Location is "Maryland", never "Frederick".** Applies to visible copy, meta descriptions, and share card text.
- **No year anywhere on `jackrome.work`.** No copyright line, no "2026" in the footer. A dated footer starts aging the site the moment the year turns, and it earns nothing. The old `ai.jackrome.work` carried a year, because there the date was doing real work. That site is gone, so the rule now has no exception.

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

**Updated 2026-08-24: four of the five moved to Netlify the same day as the cutover.**

| Domain | Resolves to | Served by | Renews |
|---|---|---|---|
| `jackrome.work` | the site (primary) | **Netlify** | 2027-06-29 |
| `jack-rome.com` | 301 to `jackrome.work` | **Netlify** | 2027-07-27 |
| `jackintheway.work` | 301 to `jackrome.work` | **Netlify** | **2026-09-07** |
| `jackrome.me` | 301 to `jackrome.work` | **Netlify** | 2027-05-16 |
| `jackintheway.net` | 301 to `jackrome.work` | Squarespace | 2027-05-02 |

`jackintheway.net` is deliberately last, because it carries the live Google Workspace
MX for `jack@jackintheway.net`. Moving it is the same preset swap as the others, with
one rule: delete **only** the Squarespace Defaults preset. Its `netlify.toml` redirects
are already written and waiting.

### Two things Netlify does that Squarespace did not

**Netlify serves a domain alias at 200 rather than redirecting it.** Squarespace 301d
all four aliases to `jackrome.work`. Netlify does not, so after moving `jack-rome.com`
the entire site answered on two addresses. Netlify *does* redirect `www.jackrome.work`
to the apex on its own, which is what made this easy to miss: it handles www-versus-apex
within one domain and not a separate domain. Fixed with explicit host rules in
`netlify.toml`, where a `from` carrying a scheme and host matches on host and `:splat`
carries the path across. Verified: `jack-rome.com/wayspace` lands on
`jackrome.work/wayspace`, not the home page.

**Both the bare and the www form of every domain must be added in Netlify's domain
panel.** The certificate only covers hostnames Netlify knows about, and the Squarespace
Netlify preset creates a `www` CNAME regardless. So an unregistered form resolves and
then fails the TLS handshake, which is a browser security warning rather than a clean
failure. `jackintheway.work` briefly broke this way when its bare form was swapped for
its www form rather than added alongside it, and the bare form is the one people type.

All ten hostnames verified live 2026-08-24: the apex serves 200, the other nine 301 to
it, paths survive, and the certificate covers every name.
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

### Three vanity subdomains, found 2026-08-24 during the cutover

Not in this file before, and not visible from outside: they only surfaced in
Squarespace's DNS panel, under a **Squarespace Domain Forwarding** preset sitting
beside the Squarespace Defaults one. All three are CNAMEs to `ext-sq.squarespace.com`
that Squarespace's forwarding service answers with a 302.

| Subdomain | Forwards to |
|---|---|
| `artifacts.jackrome.work` | a Claude artifact URL |
| `profile.jackrome.work` | `linkedin.com/in/jackrome` |
| `ai.jackrome.work` | `jackrome.work/ai-enablement` |

**They are unaffected by the DNS cutover.** Deleting the Squarespace Defaults preset
does not touch the forwarding preset, so all three kept working when the apex moved to
Netlify.

**They are on the 2026-09-15 clock.** The likely outcome is that they survive, since
this is the same domain-level forwarding feature that outlived a cancelled site for the
three Fourthwall forwards on `jackintheway.net`. So the job is to verify after
cancellation, not to rebuild in advance. If they do die, Netlify can serve the same
redirects: add each as a domain alias and write a host-scoped rule in `netlify.toml`.

`ai.jackrome.work` is the least urgent of the three. `/ai` already 301s internally to
`/ai-enablement`, so nothing on this site depends on the subdomain.

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

**Jack's own answer arrived 2026-08-24, not urgent, not for today:** replace bio.site
with a page that lives on this site, and point `jackintheway.me` at it instead of at
bio.site. That resolves the question above in Wayspace's favor without asking the
whole house to carry the job: one page built for the fast, single-tap context
bio.site exists for, rather than the landing or a room doing double duty.

**Domain forwarding confirmed 2026-08-24, resolving the discrepancy this section used
to flag:** `jackintheway.me` forwards to bio.site, and `jackintheway.net` already
forwards to `jackrome.work` itself, not to bio.site. So only `.me` would need to move
when this gets built; `.net` already points at the right house and would just need
its target page to exist once the new page does. `jackintheway.store`'s target is
still unconfirmed. Not scheduled. Revisit when there is room for it.

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

## The album clip is a 480px cut of a 1500px master (open, 2026-08-24)

**Do this on the Mac mini.** It needs `ffmpeg`, and Homebrew is not installed on the
Air. Checked `/opt/homebrew`, `/usr/local`, and `~/homebrew` on 2026-08-24: nothing.

Jack noticed the Wayspace album cover on `/wayspace/design` going soft the moment the
hover animation starts. Measured rather than guessed:

| | |
|---|---|
| Tile renders at | 560 x 560 CSS px, so 1120 device px on a retina display |
| Still behind it | 900 x 900, near enough to sharp |
| Clip | **480 x 480**, upscaled **2.33x** |
| Tool row clips | same 480px source, in 170px tiles, and they look fine |

The six tool-pack clips are the control: identical resolution, no complaint, because
they are displayed small. This is a scaling problem, not an encoding problem.

**The 480 was never a decision.** Re-encoding the master with
`avconvert --preset PresetMediumQuality` reproduces the shipped file's specs exactly:
480x480, 1.09MB, 10 seconds. That preset caps at 480. The resolution came from a preset
choice rather than from anyone deciding how big the clip should be.

**The good pixels still exist.** `_source/design/wayspace-animated-artwork.mp4` is
**1500 x 1500**, 42 seconds, 101MB. The shipped clip is a 10 second cut of it. Which 10
seconds has not been determined and needs checking against the master before a re-cut.

**Why `avconvert` cannot finish the job.** Its presets fit within their box preserving
aspect, so a square source does come out square, but there is no bitrate control and the
files are far too heavy for something that fires on hover:

| Preset | Output | Size for 10s |
|---|---|---|
| `PresetMediumQuality` | 480x480 | 1.09MB (what shipped) |
| `Preset640x480` | 640x640 | 5.36MB |
| `Preset960x540` | 960x960 | 9.86MB |
| `Preset1280x720` | 1280x1280 | 13.37MB |
| `PresetHighestQuality` | 1500x1500 | 15.12MB |

`ffmpeg` gets 1080x1080 at roughly 1.5 to 2.5MB, which is the version worth shipping.

**Interim fix, shipped 2026-08-24.** `.tool-tile.is-cover` caps the tile at **400px**,
down from 560, which brings the upscale to 1.67x. A compromise, not a fix: 240px would
map the clip 1:1 and be genuinely crisp, but the album is the arrival in this lineage
and 240 does not carry it.

**The podcast cover came down with it.** At 400px the album was reading smaller than the
flat podcast cover below it at 560, which works against the copy calling the album the
culmination and the arrival. Jack's call on 2026-08-24: match them rather than leave the
album as the smallest cover in its own lineage. `.step-figure` is now 400px too. It is
used exactly twice, both on this page, so nothing else is affected.

**When the clip is re-cut, two numbers go back to 560 together:** `.tool-tile.is-cover`
and `.step-figure`, both in `css/wayspace.css`. Delete the explanatory comments above
each rule, and trim the stopgap paragraph from the figure comment in
`wayspace/design.html`.

**Found alongside it:** `is-cover` had no CSS rule anywhere, despite the comment in
`design.html` saying it controlled the size. The 560px came from `.step-figure`. The rule
now exists, so the comment is true and there is one knob rather than a shared container.

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
