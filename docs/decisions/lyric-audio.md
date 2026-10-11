# Audio on the lyric pages

Moved out of `CLAUDE.md` on 2026-10-11 during an instruction-file audit, so it loads only when a task touches it. Dated decisions; verify against the current files before acting on them.

Lyric audio is hosted on SoundCloud, never in the repo. Each playable lyric page
carries a facade: one `<button>` bar reading "Click play to listen" that is
replaced by the SoundCloud widget, already playing, on click. How that shape was
chosen is in `docs/history.md`.

Widget parameters, all confirmed live: `color=#000000` per Jack,
`auto_play=true` because the click is the gesture, `hide_related=true` and
`show_teaser=false` which together are what answer "no auto-play after", and
`show_comments=false`.

**The thumbnail is self hosted** at `/assets/img/wayspace/writing/`, 49 files at
128px for 416 KB total. It has to be: pulling it from SoundCloud's CDN would
contact a third party on page load, which is exactly what the facade exists to
prevent.

**Album tracks are pinned to the album's own upload, not matched by title.**
Several songs exist on SoundCloud twice, once as an older standalone upload and
again inside a 2026-08-23 album set. A title match alone sent `little-things`
and `try` at the older uploads. The playlist at
`https://soundcloud.com/jackintheway/sets/{set}` carries an ordered list of
track ids in its `__sc_hydration` payload, and pinning from that is what makes
the lyric page play the version the page is actually about.

**The ads are off.** Jack turned SoundCloud monetization off on 2026-08-23, and
nothing a visitor can reach on this site serves an ad.

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
