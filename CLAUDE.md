# jackrome-work-migration

Project-level context for Claude Code. The user-level `~/.claude/CLAUDE.md` covers working style, tone, and git discipline. This file covers only what is specific to rebuilding `jackrome.work`.

---

## Status: three of four pages built and deployed to staging

**The build started 2026-08-15 on Jack's go.** All four blocking decisions are settled and recorded below.

| | |
|---|---|
| Repo | `github.com/jackintheway/jackrome-work` |
| Staging | `https://jackrome-work.netlify.app` |
| Production | Still Squarespace. DNS untouched. |

Built, deployed, and verified: `/`, `/about`, `/ai-enablement`. Tokens, Archivo, nav, footer, share cards, redirects, and headers are all in place and confirmed against the live deploy.

`INVENTORY.md` is the crawl of the old Squarespace site. `COPY.md` is the copy pulled from it on 2026-08-15, and is the source for the three built pages. Once a page is built its HTML is the source of truth, not `COPY.md`.

**Nothing is public.** `jackrome.work` stays on Squarespace until Jack calls the cutover.

---

## Where the next session picks up

**The creative portfolio, and it starts with Jack, not with code.** It is the last page and the only one that is a revamp rather than a port. See the creative portfolio decisions below before scoping anything.

**Read the open scope question first.** As of 2026-08-17 the shape of this page is genuinely unsettled, in a productive way, and scoping it as one page would be scoping the wrong thing. See "The open scope question" immediately below.

Jack plans to bring:

- The real release list. The live page predates Feivel Speaks and RACE DAY.
- Actual files and embeddable links, assembled by him.
- Material from **Wayspace**, his Obsidian vault at `~/Obsidian/Wayspace`, which holds a lot of lyrics. Expect a session that reads from the vault and works on copy.

Two things to hold when the vault comes up:

- The vault has its own `CLAUDE.md` at its root that governs behaviour inside it. Read that on arrival rather than assuming this file applies.
- **`~/Obsidian/Wayspace/Compost/` is the only permitted write destination in the vault.** Everything else there is read-only.

The page needs writing before it needs building. The live version is a grid of untitled artwork with no copy on it at all, and that gap is the actual work.

---

## The open scope question (raised 2026-08-17, not decided)

**Nothing here is settled. Jack is sleeping on it and will come back to it.** Do not treat any of it as an approved decision, and do not start building against it. It is written down so a night's sleep and a context window do not cost him the thinking.

### What happened

Jack brought a set of ideas for turning the creative portfolio into **Wayspace**, a house for his own creative work rather than a conventional portfolio page. Partway through he noticed the problem himself: the creative production work he does for clients does not belong in that house. It is a service, and Wayspace is a body of work. He asked whether that means two things rather than one.

### The frame that came out of it

The site already makes this split everywhere except here.

| | Service doorway | Proof doorway |
|---|---|---|
| Where it lives | The three home page cards | The two About page buttons |
| Who it is for | Someone deciding whether to hire him | Someone deciding who he is |
| AI | `/ai-enablement` | `ai.jackrome.work` |
| Creative | **missing** | Wayspace, unbuilt |

The third home card ("Creative & production", the one about a decade of video, audio, virtual events, website creation, and creative direction) is unambiguously a service offer, and it currently points at `/creative-portfolio`. So the single page has been trying to be a service page and a body of work at the same time. That is why Wayspace fit beautifully right up until the client production work walked in.

**The likely shape, if the frame holds:** a creative production service page that the third home card points at, sibling to `/ai-enablement`, plus Wayspace as a separate house reached from the About page button the way the AI portfolio is. That would make this one missing page plus the thing Jack is actually excited about, rather than two competing ideas. The puzzle pieces stay clean because the client production work was never one of them.

### Jack's Wayspace ideas, as he described them

- More than a typical portfolio. "An entire house of creative work for me, not just a portfolio."
- Landing: "Welcome to" with the Wayspace logo underneath, then "the home of Jack's creative work."
- Below that, **puzzle pieces**: not assembled, clearly fitting together, and gently **floating**. Each piece is a section of the house and opens or navigates to it. A plain clickable list of the same destinations sits at the bottom.
- A piece for **websites** that includes "this one" and talks about the design system he has cultivated since 2020.
- A piece for **designs**, drawing on `wayspace.store`, framed as hand-made in the sense that no AI was used for them.
- URL, undecided: `jackrome.work/wayspace`, or `/creative`, or `/portfolio`, or `wayspace.work` pointing at one of them.

### What was raised back, and still stands

- **"Each piece goes to a different page" is in tension with the music player decision below.** The approved design has audio in a persistent bottom bar that survives navigation. A real page navigation unmounts it. Three ways out: music becomes one self-contained room with the player living in it (recommended), the rooms become in-page views so nothing navigates, or audio stops on room change. Decide this before building either one.
- **The number of pieces is a design constraint, so the room list comes before the visual.** Four to six reads as a puzzle. Nine reads as a menu in costume. A rough list already overflows: music, designs, websites, video and YouTube, podcast production, speaking, writing and lyrics.
- **Pieces that visibly interlock have to be drawn as one puzzle and then pulled apart**, or the tabs will not match. That is more work than N independent shapes and it is the right way.
- **Build the bottom list first, then float the pieces over it.** The list is the real navigation: crawlable, keyboard reachable, and still there if the SVG never loads. Motion respects `prefers-reduced-motion`, which is already a standing rule on this site.
- **On `wayspace.work`:** the question that decides it is redirect versus separate site. Recommendation is redirect to `jackrome.work/wayspace`, so Jack gets a domain he can say out loud without forking the design system, the link previews, and the maintenance. Whether he owns the domain is still unknown.
- **On "hand-made, no AI":** strongest line on the page and the one most likely to be misread, since it sits a few clicks from a portfolio whose thesis is AI enablement. It is not a contradiction, but it only reads that way if framed as discernment ("I know what this tool is for, and it isn't this") rather than purity. Be precise about what the claim covers, because someone will ask.

### Still needed from Jack before anything gets built

1. The room list. Four to six pieces.
2. Whether he owns `wayspace.work`, or it is still to buy.
3. The real release list, outstanding since day one.

---

## Open items, none blocking

- `/creative-portfolio` 404s. The nav and two buttons already point at it. **Note:** if the scope question above resolves toward two pages, this path and those links change, so do not fix the 404 by building a page until that lands.
- One `TODO(copy)` in `ai-enablement.html`: the closing line "Want to talk it through?" is mine, not Jack's, and wants his voice.
- `assets/img/jack-ventnor-2026.jpg` ships but is unused.
- The orphaned Squarespace pages still need a call before DNS moves. See the cutover note below.

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

3. **Orphaned pages: left in place, not migrated.** `/toolbox`, `/store`, and `/blog` stay on Squarespace and are out of scope for this build. Jack may want `/toolbox` brought over once the core site is done. See the cutover note below, because "leave them there" has an expiry date.

4. **Blog: not carrying over.** No blog in this build. If Jack starts writing at volume he would reach for Substack rather than hand-authored pages.

**Scope that follows from these:** four pages. `/`, `/about`, `/ai-enablement`, `/creative-portfolio`.

### The cutover note (deferred, not decided)

A domain is served by one host at a time. While DNS points at Squarespace, the orphaned pages keep working untouched, which is why decision 3 is free right now. The moment DNS points at Netlify, Squarespace stops answering for `jackrome.work` and `/toolbox`, `/store`, and `/blog` go with it. So each one needs a call at cutover: rebuild it, redirect it in `netlify.toml`, or let it 404 deliberately. Raise this before the DNS change, not after.

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
