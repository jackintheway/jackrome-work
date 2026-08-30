/* ============================================================
   WATCH IN PLACE

   Anything carrying data-video opens the video over the page instead
   of sending the reader to YouTube in a new window. Per Jack,
   2026-08-23: "rather than simply having the watch button open the
   youtube links in a new window, if the video just comes up nicely on
   screen instead."

   Used by three surfaces that all had the same problem: the shorts in
   the Writing room, the episode videos in Podcasts, and the twelve
   lyric pages that carry a lyric video. One file rather than three,
   because three copies of a modal drift.

   THE FACADE HOLDS, the same standing rule the Video room and the
   listen bars follow. Nothing is requested from YouTube until someone
   presses Watch, and closing the dialog removes the iframe rather
   than hiding it, so a closed video is not still running.

   <dialog> rather than a hand rolled overlay, because showModal gives
   the focus trap, the Escape key, the inert background and the
   returned focus for free. Every one of those is a thing a hand
   rolled version gets wrong.

   Nothing here needs a per page script tag beyond loading this file:
   the listener is delegated from the document, so markup rendered
   later works without rebinding.
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  let dialog = null;
  let stage = null;

  function ensure() {
    if (dialog) return;

    dialog = document.createElement("dialog");
    dialog.className = "video-modal";
    dialog.setAttribute("aria-label", "Video");

    /* The close control comes first in the DOM so it is the first
       thing a keyboard user reaches, and the first thing a screen
       reader announces after the dialog opens. */
    const close = document.createElement("button");
    close.className = "video-close";
    close.type = "button";
    close.textContent = "Close";
    close.addEventListener("click", () => dialog.close());

    stage = document.createElement("div");
    stage.className = "video-stage";

    dialog.append(close, stage);

    /* Clicking the backdrop closes. The click lands on the dialog
       element itself rather than on anything inside it, which is what
       separates the backdrop from the video. */
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });

    /* Fires for the close button, the backdrop and Escape alike, so
       the iframe is torn down on every path out. */
    dialog.addEventListener("close", () => {
      stage.replaceChildren();
    });

    document.body.appendChild(dialog);
  }

  document.addEventListener("click", (e) => {
    const trigger = e.target.closest("[data-video]");
    if (!trigger) return;

    const id = trigger.dataset.video;
    if (!id) return;

    e.preventDefault();
    ensure();

    /* Portrait for a short, wide for everything else. The stage takes
       the ratio so the video is never letterboxed inside a box the
       wrong shape for it. */
    stage.style.setProperty("--stage-ratio", trigger.dataset.ratio || "16 / 9");

    const frame = document.createElement("iframe");

    /* data-video-start begins playback that many seconds in, for a
       video where the piece worth watching starts after a preamble.
       NaN from a missing attribute fails the > 0 check on its own. */
    const start = parseInt(trigger.dataset.videoStart, 10);
    frame.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) +
      "?autoplay=1&rel=0" + (start > 0 ? "&start=" + start : "");
    frame.title = trigger.dataset.videoTitle || "Video";
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture";
    frame.allowFullscreen = true;
    stage.appendChild(frame);

    dialog.showModal();
  });
});
