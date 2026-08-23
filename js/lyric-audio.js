/* ============================================================
   THE LYRIC PAGE'S LISTEN BAR

   One quiet bar under the hero on any lyric page whose track is
   published. Click it and the bar is replaced by a real SoundCloud
   player, already playing.

   This is the facade, the same rule the Video room follows for
   YouTube and a standing requirement in CLAUDE.md: **no third party
   is contacted until the visitor asks.** So the artwork on the bar is
   self hosted at /assets/img/wayspace/writing/, not pulled from
   SoundCloud's CDN, and nothing at all is requested from soundcloud
   .com until the button is pressed.

   Decided with Jack on 2026-08-23, after comparing four options in a
   real browser. He picked this one over a bare embed, over a taller
   artwork player, and over putting cover art in the banner:

   - **The words are the subject.** The bar is 88px and the artwork on
     it is 64px, enough to say a recording exists without competing
     with the lyric underneath.
   - **No cover art in the banner.** The artwork would then appear
     twice, once in the hero and again inside the player, before a
     reader reached the first line of the song.
   - The whole bar is the button, so the text starts the song too.

   Why not a tab. Jack's first idea was to open the track in a new tab
   while keeping the reader on the site. Browsers do not allow that:
   window.open takes focus, deliberately, because that is how popunder
   ads worked, and audio in a background tab gets throttled anyway.
   The facade delivers what that idea was reaching for, which is that
   nobody leaves the page and nothing loads until they ask.

   The page carries its own data on the button. There is no array of
   62 entries to keep in sync with 62 files: each page describes its
   own track, so the page and its data cannot drift apart.

   A PAGE MAY CARRY MORE THAN ONE BAR. Ribbons exists as a 2:52 cut and
   a 4:11 extended cut, and its lyric sheet holds the words to the
   extended one, so both belong on the page. Per Jack, 2026-08-23.

   Only one of them plays at a time. Pressing the second bar puts the
   first back the way it was and starts the second, so two recordings
   of the same song can never talk over each other. That is the whole
   reason this keeps a clone of each bar rather than throwing the
   markup away when it swaps.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  const bars = [...document.querySelectorAll(".listen-bar")];
  if (!bars.length) return;

  /* Each slot remembers the bar it started as, so pressing a sibling
     can put it back. `el` is whatever is standing there right now:
     the bar, or the player that replaced it. */
  const slots = bars.map(bar => ({ bar, el: bar }));

  function reset(slot) {
    if (slot.el === slot.bar) return;
    slot.el.replaceWith(slot.bar);
    slot.el = slot.bar;
  }

  function play(slot) {
    const bar = slot.bar;
    const frame = document.createElement("iframe");

    /* auto_play is true because the visitor has just pressed play.
       The click is the gesture the browser's autoplay policy wants,
       so the track starts rather than making them press a second
       button inside the widget.

       color is #000000 per Jack. hide_related and show_teaser are
       what answer "no auto-play after": SoundCloud otherwise runs a
       related-tracks grid and an end-card upsell when a track
       finishes. show_comments off keeps other people's words off a
       page that is about these words. */
    const p = new URLSearchParams({
      url: "https://api.soundcloud.com/tracks/" + bar.dataset.track,
      color: "#000000",
      auto_play: "true",
      hide_related: "true",
      show_comments: "false",
      show_user: "true",
      show_reposts: "false",
      show_teaser: "false",
      visual: "false"
    });

    frame.src = "https://w.soundcloud.com/player/?" + p;
    frame.width = "100%";
    frame.height = "166";
    frame.scrolling = "no";
    frame.frameBorder = "no";
    frame.allow = "autoplay";
    frame.title = bar.dataset.title + " on SoundCloud";
    frame.className = "listen-player";

    slot.el.replaceWith(frame);
    slot.el = frame;
  }

  /* Delegated from the document rather than bound to each bar, because
     a bar that gets put back is the same node but its listener would
     have to be rebound on every restore otherwise. */
  document.addEventListener("click", (e) => {
    const bar = e.target.closest(".listen-bar");
    if (!bar) return;
    const slot = slots.find(s => s.bar === bar);
    if (!slot) return;
    slots.forEach(o => { if (o !== slot) reset(o); });
    play(slot);
  });
});
