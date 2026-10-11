# The nav (restructured 2026-08-22)

Moved out of `CLAUDE.md` on 2026-10-11 during an instruction-file audit, so it loads only when a task touches it. Dated decisions; verify against the current files before acting on them.

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

`js/nav.js` is loaded on every public page and the 404 page. It handles the menu,
Escape, outside clicks, and clearing the open class when the window widens past
the breakpoint. It also inserts the shared site-guide control. Navigation links
remain in each page's HTML; the guide itself has one implementation.
