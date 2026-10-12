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

Dated build history lives in `docs/history.md` and `docs/decisions/`. Read it
when the task touches it; it is evidence, not instructions.

## Current editorial decisions: 2026-09-12

These decisions from Jack supersede broader or dated wording below.

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
- Facts for the two-track edit and remaster case studies (what the session
  records support, and what not to claim) are kept outside this public repo in
  `~/.claude/plans/jackrome-work-private-notes.md`. Read it before editing either page.
- The Wayspace arrival's motion is settled and live. See `MOTION.md`.
- The handoff demo keeps the dictated request verbatim with the italic caption
  "Spoken aloud using Wispr Flow." Its surrounding explanation speaks as Jack:
  "My request" and "our decisions." The recorded agent-to-agent note still uses
  Jack's name to orient its recipient.
- On 2026-09-22 Jack published a third case study, Lay of the Land, a
  personal tool. Its employer and tradition stay out of the text by his choice.
  Every case study carries a Listen button (js/listen.js). Lay of the Land also
  has a Take a peek dialog whose noindex page reads the case study's own text,
  so edits to the page carry into the peek's text automatically. Its recording
  does not; see "Case study recordings" below. After any edit to a js file,
  run node --check on it before committing.
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
- On 2026-09-13, Jack approved using his original video as the source for small
  collaboration-focused additions. The portfolio opening describes thinking
  aloud, asking for another perspective, and continuing to edit. Teaching now
  describes practicing on the team's work with its context and examples, asking
  follow-up questions, checking results, and discussing risks.
- The portfolio's curation section links to Artificial Intelligence Meets
  Spirituality (YouTube AYzzTeSOF4Q, approximately 48 minutes) as optional personal
  background. Keep spiritual speculation in that context. These paragraphs are
  newly drafted from the spoken examples, not quotations from the AI-assisted
  manifesto or Gemini's summary.
- The Wayspace arrival uses wayspace-straight-v2.svg, an unchanged copy of Jack's
  corrected SVG with the two missing yellow W-shadow polygons. Keep the original
  published filename intact for existing caches.

---

## The workflow audit readiness assessment (built and published 2026-09-13)

Live at `https://audit.jackrome.work/`, also served at `/audit`. Linked from
AI Enablement ("What it's for") and the AI Portfolio ("How this works with
clients"). Preparation package and product decisions live in
`../ai-opportunity-assessment-review/` (DECISIONS.md, BUILD-SPEC.md); this
section records only what the website side settled.

- **The site publishes `_site/`, assembled by `tools/build-site.py` from an
  allowlist.** Netlify requires the functions directory outside the publish
  directory. Add new public pages or folders to the allowlist or they do not
  deploy. `_site/` is gitignored output.
- **The deploy context is stamped at build time** into
  `lib/context.generated.mjs` because Netlify's CONTEXT variable is absent
  from the function runtime. Without the stamp, records go to the preview
  store. Do not remove that step from `build-site.py`.
- Everything else (the function, the subdomain rewrite, the summary email,
  rate limit, secrets, deferred items) is in `docs/decisions/audit.md`.

---

## The Shop room (built and deployed 2026-09-30)

A seventh Wayspace room at `/wayspace/shop`, drawn live from Jack's
Fourthwall shop through the Storefront API. Fourthwall stays the backend:
products, samples, payment, tax, fulfillment. Planning notes from the
session that led here live outside this repo in `../wayspace-store/`.

- **The token never enters this public repo.** `build-site.py` writes
  `js/fourthwall.config.js` into `_site/` from the Netlify variable
  `FW_STOREFRONT_TOKEN` (not marked secret: Netlify's secret scanning would
  fail a deploy that publishes it, and publishing it is the point; the
  token can only read the shop and keep carts). Locally the same file is
  gitignored. Without a token the room says it is closed.
- Phase plans, Fourthwall API quirks checked live, the design cross-link field,
  photo background and Jack's copy are in `docs/decisions/shop.md`. Read it before
  touching the Shop or `js/fourthwall.js`.

---

## Status: the migration is complete

`jackrome.work` has been live on Netlify since 2026-08-24 and every page in scope
is built. Jack's Squarespace website subscription ended 2026-09-15 as planned; the
domains stay registered at Squarespace and all of them are working. What remains is
content, not construction.

| | |
|---|---|
| Repo | `github.com/jackintheway/jackrome-work` |
| Staging | `https://jackrome-work.netlify.app` |
| Production | **`https://jackrome.work`, live on Netlify since 2026-08-24.** |

`INVENTORY.md` is the crawl of the old Squarespace site. `COPY.md` is the copy pulled from it on 2026-08-15, and is the source for the three built pages. Once a page is built its HTML is the source of truth, not `COPY.md`.

**The repo is public.** `github.com/jackintheway/jackrome-work` is readable by anyone, verified 2026-08-21. So a push publishes the source as well as deploying the site, and anything written into a file here (including this one) is public the moment it lands. Keep private reasoning in `~/.claude/plans/` or another place outside the repo.

---

## Wayspace

### The seven rooms

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
| Shop | black | Garments with Jack's designs, drawn live from Fourthwall (see "The Shop room") |

**The color is structural, not decoration.** A room announces its color as a swatch
on the landing list, wears it as its hero, and carries it on its share card. So the
map is learned by color before any puzzle art exists, and when the pieces get drawn
they are already coded. It is set once per page as `--room` on the `<body>`; every
component in `css/wayspace.css` reads that property rather than naming a color.

### How the rooms are built

- `wayspace.html` at the repo root, plus
  `wayspace/{music,video,design,podcasts,speaking,writing,shop}.html`, and
  the 61 lyric pages in `wayspace/writing/` (counted 2026-10-05). All 68 room and
  lyric pages carry the room switcher.
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
- `css/wayspace.css` imports last from `css/styles.css`.
- Content lives in arrays in `js/wayspace.js` (one per room or list: `MUSIC`, `VIDEO`, `WRITING` and so on), through pure render functions, the
  same pattern the old portfolio's `js/app.js` proved. **Adding work is adding an
  object, not editing markup.** An entry flagged `placeholder: true` renders a striped
  tag and disables its controls; an emptied array renders that room's written empty
  state.
- Any item in any room may carry `crossRef: { text, href }`. That is Jack's puzzle
  image made structural: the pieces keep real borders, and the picture crosses them.

**Motion is decided. See `MOTION.md`.** Read that file before proposing anything
animated, and do not reopen it from scratch.

---

## The Writing room and the lyric pages

Lyric pages live at `/wayspace/writing/{slug}`. The non-album lyrics came from
the vault export in `_source/writing/lyrics/`.

**Any future import from the vault must strip three kinds of vault furniture**
(annotations, repeated front matter, wikilinks). The steps are in
`docs/decisions/lyrics.md`; the generator was not kept as a script.

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
protection rather than the fact of it, and cost JavaScript on every lyric
page to do so. A plain line is honest.

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

## The Design room

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

---

## Audio on the lyric pages

Lyric audio is hosted on SoundCloud, never in the repo. Each playable lyric page
carries a facade: one `<button>` bar reading "Click play to listen" that is
replaced by the SoundCloud widget, already playing, on click. How that shape was
chosen is in `docs/history.md`.

**The thumbnail is self hosted** at `/assets/img/wayspace/writing/`, 50 files at
128px for 416 KB total. It has to be: pulling it from SoundCloud's CDN would
contact a third party on page load, which is exactly what the facade exists to
prevent.

SoundCloud widget parameters, how album tracks are pinned to the right upload,
and the ads check (monetization is off; how to verify) are in
`docs/decisions/lyric-audio.md`.

---

## The Music room player

Touching `wayspace/music.html`? Read `docs/decisions/music-player.md` first.

---

## The AI portfolio page

**The set of tools shown is settled, and was chosen deliberately.** Do not add a
tool to this page, and do not name one that is not already on it, without Jack.
The reasoning behind the selection is recorded outside this repo, in
`~/.claude/plans/`. It is not written down here on purpose.

**The old portfolio is gone.** Its site and repository were retired and deleted on
2026-09-14. A record of its decisions is kept outside this repo, at
`../x-archive/ai-work-portfolio/`. Nothing from it comes onto this site.

---

## Case studies

Case studies are built from packages the `/exhibit` skill writes: Jack runs
`/exhibit` on a finished piece of work, the package lands in `_exhibits/`, and a
page plus an array entry get built from it.

**`_exhibits/` is gitignored, deliberately.** The packages are scrubbed and
scan-gated, but this repo is public, so a package waits there unread by anyone
until Jack has read it himself. What ships is the page built from it. Same shape
as `_source/`: originals stay off the wire, the derivative is committed.
Canonical copies of cleared packages go to `claude-creations/exhibitions/` in
iCloud, matching the archive convention for skills.

**`js/case-studies.js` went in with the first entry rather than the third.**
`ai-portfolio.html` is hardcoded prose, which was right when the page was one
settled argument nobody expected to grow. Case studies arrive one at a time on
no schedule, so hardcoding the first meant hand-editing that page every time
after. The data file is the expensive thing to retrofit; the hub page is cheap
to add later, so the expensive thing got built first. Adding a case study is
adding an object plus a page.

**Newest first.** The case study list runs in reverse order of creation, so
a new case study goes at the top of the array, unless Jack asks for a
different order (his call, 2026-10-10).

**There is no `/case-studies` index yet, on purpose.** Jack approved keeping the
case studies on AI Portfolio and adding direct section links from its hero
and both service pages. The bare path still 301s to `/ai-portfolio`. Revisit the
hub when Jack wants a standalone destination for prospective clients or the
collection covers more kinds of work. Three entries is not a prerequisite.
When it exists, the "Back to AI Portfolio" button at the foot of each case study
becomes "Back to case studies."

**Planned (Jack, 2026-10-10): the hub arrives with the sixth case study.**
Once there are 6, build a real `jackrome.work/case-studies` lobby that lists
every case study, and replace the bare path's 301 to `/ai-portfolio`. AI
Portfolio then shows only three: Jack's picks, or by default the three most
recent, followed by a "See more case studies" link to the lobby. Raise this
with Jack when a sixth case study is being built.

**Layout (2026-10-10):** on AI Portfolio each case study is one row
(`.case-rows`), with the heading on the left and the three paragraphs across
the right. Jack chose this over four thin columns and over a two-up grid.
Below 760px a row becomes a stacked card.

### Case study recordings (added 2026-10-06)

**After editing any case study's prose, re-record it before deploying.**
Every case study's Listen button, and the Lay of the Land peek, plays a
Kokoro recording (voice af_heart, Apache 2.0) from `assets/audio/`. Jack
chose this on 2026-10-06 so the site sounds like the real Lay of the Land.

```
.venv-kokoro/bin/python tools/record-case-study.py --check
.venv-kokoro/bin/python tools/record-case-study.py <slug>
```

`--check` names any recording whose page has changed. Recording takes about a
minute, and only changed paragraphs are rendered (cache in `.audio-cache/`).

**Tell Jack, too.** Run `--check` at the start of any session that touches a
case study and before any push, since Jack sometimes edits pages by hand. If a
recording is stale, say which one and offer to re-record it. When a session
edits case study prose, end by telling Jack the recordings were re-recorded (or
that they need it), with the two commands above, so he knows the step exists.
An edit never breaks a page: each line carries a fingerprint, and if any line
no longer matches, the players use the device voice until it is re-recorded.
A new case study needs `data-recording="/assets/audio/<slug>.json"` on its
Listen button, `js/recording.js` loaded before `js/listen.js`, and a recording.

- The voice credit appears only after a visitor presses play, per Jack.
- The peek's closing section lives in a JSON block in the peek page so the
  page and the recording script read the same words.
- Audio is not cache-forever: a re-recording keeps its filename.
- `.venv-kokoro/` is local setup (Kokoro 0.9.4, espeak-ng from Homebrew),
  gitignored. Rebuild with `python3 -m venv .venv-kokoro` and
  `.venv-kokoro/bin/pip install kokoro soundfile beautifulsoup4`.
- The dev server answers byte ranges so audio can scrub in local preview.

**Client naming.** Clients are named when the work has already been published
publicly or they have shared a testimonial. Otherwise, the default is to keep
their identity private in case studies. There is no agreement requiring
anonymity, so no case study carries a "withheld by agreement" line, and
existing attributed testimonials stay as written. `client` is nullable in the
array for this reason. Everything in `_source/client-work/` is public (settled
2026-08-22), so `/production` names its clients: Foundation for Inner Peace,
Potter's Guild of Frederick, Tribly, Awakening Mind Films, Center for Awakening,
and Hands On Health Acupuncture.

---

## The production page

**The work is data-driven, in `js/production.js`.** Ten entries, each carrying
`roles: []`, rendered through pure functions into the `work-card` component that
`css/wayspace.css` already provides. Adding a piece is adding an object.

**The roles are the argument.** Per Jack, every hosted piece was also tech-checked,
recorded, and edited by him, and the 50th anniversary livestream included montages
cut from submitted footage. Thirty role tags across ten cards make the case for
scope without the page ever claiming it. That is why the field is structural and
not decoration, and why a new entry must carry its roles.

---

## The nav (restructured 2026-08-22)

Six links, one row on desktop, a collapsed menu through 1080px. The September 12
site-guide control increased the earlier 860px breakpoint.

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

`js/nav.js` is loaded on every public page and the 404 page. It handles the menu,
Escape, outside clicks, and clearing the open class when the window widens past
the breakpoint. It also inserts the shared site-guide control. Navigation links
remain in each page's HTML; the guide itself has one implementation.

The reasoning (why Home was dropped, why `/production` and not `/studio`, why the
menu collapses) is in `docs/decisions/nav.md`.

---

## How the site is built

A full custom rebuild of `jackrome.work` in the Wayspace design system, replacing Squarespace. Everything in Jack's own style, made together, no platform in between.

The earlier `ai-work-portfolio` project is the proven pattern. It shipped, and it has since been deleted from Jack's machines (record at `../x-archive/ai-work-portfolio/`), so this repo is now the only living copy of the approach. Extend what worked there rather than inventing a second approach:

- Static HTML, CSS, vanilla JS. No React, no Tailwind, no compile step. `tools/build-site.py` only copies an allowlist into `_site/`.
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

---

## Every page ships with link previews

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

Share images: sources are in `tools/og/`, one file per page. Run `./tools/og/render.sh` from the repo root to rebuild them all; it verifies each is exactly 1200x630 and fails loudly if not. See `tools/og/README.md` before adding one.

## External links open in a new window (standing rule)

**Any link leaving `jackrome.work` opens in a new tab. Links staying on `jackrome.work` do not.**

Calendly, YouTube, a client's site, and anything else off-domain all count as leaving. `ai.jackrome.work` no longer appears anywhere on this site: as of 2026-08-21 every link that pointed there points at the internal `/ai-portfolio` instead. This applies to hyperlinked text and buttons alike.

Always pair `target="_blank"` with `rel="noopener"`. Modern browsers imply this, but stating it costs nothing and does not depend on the visitor's browser being current.

## Location and dates (standing rules)

- **Location is "Maryland", never "Frederick".** Applies to visible copy, meta descriptions, and share card text.
- **No year anywhere on `jackrome.work`.** No copyright line, no "2026" in the footer. A dated footer starts aging the site the moment the year turns, and it earns nothing. The old `ai.jackrome.work` carried a year, because there the date was doing real work. That site is gone, so the rule now has no exception.

## Other standing page requirements

- Every image has real `alt` text, or `alt=""` if it is purely decorative.
- Every page works at 390px wide with no horizontal scroll.
- Visible keyboard focus states. Respect `prefers-reduced-motion`.
- No em dashes in any user-facing copy. Applies to visible text, `<title>`, and meta descriptions.
- Embeds use a facade: ship a static thumbnail, swap in the real iframe on click. No third party is contacted until the visitor asks.

---

## Decisions (approved 2026-08-15)

Two of the four decisions that unblocked the build still govern daily work. The
full set is in `docs/history.md`.

1. **Typeface: Archivo.** Same face as the AI portfolio, self-hosted, SIL Open Font License, licence text shipped beside the file. It stands in for Ballinger, which is licensed for Squarespace hosting only and cannot travel. The AI portfolio is the proof of concept for the whole site on questions like this: where it settled something, that answer carries here rather than getting relitigated.

2. **Editing workflow: same as the AI portfolio.** Edit a file, commit, push. Jack chose this knowingly and wants it as a learning surface, not just a shipping mechanism.

## Calendly is the conversion path (approved 2026-08-15)

Booking a call is the named primary conversion for the whole site, decided deliberately rather than inherited from Squarespace. Every page carries a route to it. Treat it as a real dependency: one URL, `https://calendly.com/jackintheway/chat-with-jack-rome`. It is hand-typed into every page that links to it, so changing it means a find-and-replace across the repo.

---

## Hosting, billing, and how often we deploy (settled 2026-08-18)

**A production deploy costs real money. Preview locally by default and push in batches.**

The site is on Netlify's Personal plan ($9/month, 1,000 credits), team `Wayspace`.
A production deploy costs 15 credits. Pricing and the August 2026 credit scare that
forced the plan choice are in `docs/history.md`.

### Preview locally, deploy deliberately

`netlify.toml` sets `publish = "_site"` and runs
`python3 tools/build-site.py --check`, a copy step with an allowlist (see the
audit section above). There is no compile step, and a deploy is never required
to look at a change.

```
cd /Users/jack/workspace/claude-code-projects/jackrome-work-migration
python3 -m http.server 8000 --bind 127.0.0.1
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

**The domain bill and the website bill were separate, and only the domain bill remains.**

`jackrome.work` is registered through Squarespace on Tucows, their registrar backend,
and Squarespace serves its DNS (`ns01-04.squarespacedns.com`).

- **Domains stay at Squarespace indefinitely.** Jack's call, made deliberately, not a
  loose end. He likes the platform, wants it available for building the old-fashioned
  way if he ever wants to, and wants somewhere to show clients who ask about Squarespace.
  Do not propose a registrar transfer as cleanup.
- **The website subscription ended 2026-09-15**, as planned, after the site had
  been live on Netlify for three weeks.

The full domain map and cutover record are in `docs/decisions/domains.md`. One
fact stays loaded:

- A Netlify site answering 401 with a "Login Redirect" body means the project is
  marked **Private**. The switch is "Make public" on the project page.

---

## Working rules

- Nothing goes live without Jack's explicit go.
- The old portfolio's record at `../x-archive/ai-work-portfolio/CLAUDE.md` is
  background only.
