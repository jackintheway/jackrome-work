# Music room player decisions

Moved out of `CLAUDE.md` on 2026-10-05. Read this before touching
`wayspace/music.html` or its player code. Verbatim except notes marked
"[Note 2026-10-05: ...]".

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
results back to the local server, which is why the harness sends its results
rather than having them read out of the DOM. [Note 2026-10-05: the original
harness file is no longer in the repo.]

Two assertions were also too loose at first and let real failures read as passes.
Checking a title is "not the placeholder" passes on an error message. Assert the
absence of the error text and the change in the backlink.
