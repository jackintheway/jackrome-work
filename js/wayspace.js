/* ============================================================
   WAYSPACE : data + render

   Six rooms, six arrays. Same pattern the AI portfolio proved in
   js/app.js: content lives in arrays of plain objects and goes
   through pure render functions, so adding a release, an episode or
   a talk is adding one object here, not editing markup.

   This file is loaded by all six room pages. Each render call below
   checks whether its mount point exists on the current page and does
   nothing if it does not, so one script serves every room without
   any page needing to know about the others.

   HOW TO FILL A ROOM
   Replace the placeholder objects in an array with real ones and
   drop the `placeholder: true` flag. An entry carrying that flag
   renders a striped "placeholder" tag and disables its controls, so
   nothing standing in for real work can ever be mistaken for it.
   An empty array renders that room's empty state instead.

   THE SHARED FIELD
   Any item in any room may carry `crossRef: { text, href }`. That is
   the puzzle made structural: the pieces have real borders, but a
   live performance is video by form and music by nature, so the
   rooms point at each other rather than duplicating the work.
   ============================================================ */

/* ============================================================
   MUSIC
   Releases. cover: path under assets/img/, or null for a placeholder
   tile. track: the file the room's player loads, or null while there
   is no cleared audio to serve. streams: where to go listen properly,
   which is most of what a music page is for.
   ============================================================ */
const MUSIC = [
  {
    title: "A release goes here",
    year: "Year",
    format: "Album, EP or single",
    cover: null,
    streams: [],
    track: null,
    crossRef: { text: "Lyrics live in Writing", href: "/wayspace/writing" },
    placeholder: true
  },
  {
    title: "And another here",
    year: "Year",
    format: "Album, EP or single",
    cover: null,
    streams: [],
    track: null,
    placeholder: true
  }
];

/* ============================================================
   VIDEO
   Anything whose form is video. youtubeId drives the facade: the
   thumbnail ships as a static image and the iframe is built only
   when a visitor clicks, so YouTube is contacted at no other time.
   ============================================================ */
const VIDEO = [
  {
    title: "A video goes here",
    meta: "What it is, and when",
    thumb: null,
    youtubeId: null,
    note: "",
    crossRef: null,
    placeholder: true
  },
  {
    title: "The 2022 Wayspace show",
    meta: "Live performance",
    thumb: null,
    youtubeId: null,
    note: "A live set is video by form and music by nature. It is filed here, and the Music room points across at it.",
    crossRef: { text: "Also reached from Music", href: "/wayspace/music" },
    placeholder: true
  }
];

/* ============================================================
   DESIGN
   Cover art, logos, flyers, merch, and the design system. Mostly
   still images, so no facade and no player: the work is the file.

   The design system lives here rather than in a room of its own,
   because it is design work and this is where its company is. A
   website built out of it is a piece of design in this room, not a
   separate discipline.
   ============================================================ */
const DESIGN = [
  {
    title: "A flyer, a shirt, or a cover",
    meta: "What it was for, and when",
    image: null,
    note: "",
    placeholder: true
  },
  {
    title: "Another piece here",
    meta: "What it was for, and when",
    image: null,
    note: "",
    placeholder: true
  },
  {
    title: "The Wayspace design system",
    meta: "Cultivated since 2020, and still running",
    image: null,
    note: "The colour, type, spacing and outlines every page of this site is built from, including the one you are reading. It is a piece of design work, so it lives in this room rather than in a section about websites.",
    placeholder: true
  }
];

/* ============================================================
   PODCASTS
   Audio first. `role` is the field that lets a show that is not
   Jack's own sit beside one that is: host, guest, or producer, said
   plainly rather than explained in prose on every entry.
   ============================================================ */
const PODCASTS = [
  {
    title: "An episode goes here",
    show: "The show it belongs to",
    role: "Host",
    date: "Date",
    art: null,
    listenHref: null,
    note: "",
    crossRef: null,
    placeholder: true
  },
  {
    title: "A show that is not mine",
    show: "Someone else's show",
    role: "Producer",
    date: "Date",
    art: null,
    listenHref: null,
    note: "Work made for other people's shows belongs here too. The role tag is what keeps it clear whose show it is.",
    crossRef: null,
    placeholder: true
  }
];

/* ============================================================
   SPEAKING
   Talks and hosted events. Same role field, doing the same job:
   speaking at something and running it are different, and the tag
   says which without a sentence about it.
   ============================================================ */
const SPEAKING = [
  {
    title: "A talk goes here",
    host: "Where, and for whom",
    role: "Speaker",
    date: "Date",
    note: "",
    videoHref: null,
    crossRef: null,
    placeholder: true
  },
  {
    title: "A hosted event goes here",
    host: "Foundation for Inner Peace, and others",
    role: "Host",
    date: "Date",
    note: "",
    videoHref: null,
    crossRef: { text: "Recordings live in Video", href: "/wayspace/video" },
    placeholder: true
  }
];

/* ============================================================
   WRITING
   Two shapes in one room. A lyric links to its own page, which
   carries the words and a player for that one track. Prose links to
   its own page too, without the player.
   ============================================================ */
const WRITING = [
  {
    title: "A lyric goes here",
    kind: "Lyric",
    meta: "The release it belongs to",
    href: "/wayspace/writing/example-lyric",
    note: "Every lyric page carries the track it belongs to, so the words and the sound stay together.",
    crossRef: { text: "The release lives in Music", href: "/wayspace/music" },
    placeholder: true
  },
  {
    title: "A piece of writing goes here",
    kind: "Writing",
    meta: "What it is, and when",
    href: null,
    note: "",
    crossRef: null,
    placeholder: true
  }
];

/* ============================================================
   Helpers
   ============================================================ */

/* Everything rendered below goes in through innerHTML, so every
   value out of the arrays passes through here first. Today those
   arrays are hand-written and safe. The habit is what matters: the
   day one of them is filled from a file or a feed, the escaping is
   already in place rather than being remembered. */
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

function placeholderFlag(item) {
  return item.placeholder
    ? '<span class="flag-placeholder">Placeholder</span>'
    : "";
}

function crossRef(item) {
  if (!item.crossRef) return "";
  return `<p class="crossref"><a href="${escapeHtml(item.crossRef.href)}">${escapeHtml(item.crossRef.text)}</a></p>`;
}

/* A tinted, labelled box standing where an image will go. Deliberately
   not a grey rectangle: it says what belongs there, so an empty room
   still explains itself. Marked aria-hidden with the label repeated in
   the card's own text, so a screen reader is not read a description of
   a picture that does not exist yet. */
function placeholderTile(kind, label) {
  return `<div class="${kind} is-placeholder" aria-hidden="true"><span>${escapeHtml(label)}</span></div>`;
}

/* The room's written empty state, used when an array is emptied out
   rather than filled with placeholders. */
function emptyState(mount, title, lines) {
  mount.innerHTML = `
    <div class="empty-state">
      <p class="empty-title">${escapeHtml(title)}</p>
      ${lines.map(l => `<p>${escapeHtml(l)}</p>`).join("")}
    </div>
  `;
}

/* ============================================================
   Card shapes
   ============================================================ */

function musicCard(item) {
  const cover = item.cover
    ? `<img class="work-cover" src="${escapeHtml(item.cover)}" alt="Cover art for ${escapeHtml(item.title)}" loading="lazy" width="600" height="600">`
    : placeholderTile("work-cover", "Cover art");

  const streams = item.streams.length
    ? `<ul class="stream-links">${item.streams.map(s =>
        `<li><a class="stream-link" href="${escapeHtml(s.href)}" target="_blank" rel="noopener">${escapeHtml(s.name)}</a></li>`
      ).join("")}</ul>`
    : "";

  /* No cleared audio means no working button. Disabled rather than
     hidden, so the control is visibly part of the card and the room
     reads as built rather than half-drawn. */
  const play = item.track
    ? `<button class="play-btn" data-src="${escapeHtml(item.track.src)}" data-title="${escapeHtml(item.track.title)}">Play</button>`
    : `<button class="play-btn" disabled>No audio yet</button>`;

  return `
    <li class="work-card">
      ${cover}
      <div class="work-body">
        ${placeholderFlag(item)}
        <h3 class="work-title">${escapeHtml(item.title)}</h3>
        <p class="work-meta">${escapeHtml(item.format)} &middot; ${escapeHtml(item.year)}</p>
        <div class="work-foot">
          ${streams}
          ${play}
          ${crossRef(item)}
        </div>
      </div>
    </li>
  `;
}

function videoCard(item) {
  /* The facade. A button rather than a div, because clicking it
     changes this page instead of going anywhere, and a keyboard user
     needs it to be reachable and pressable without any extra work. */
  const facade = item.youtubeId
    ? `<button class="facade" data-yt="${escapeHtml(item.youtubeId)}" aria-label="Play ${escapeHtml(item.title)}">
         <img src="${escapeHtml(item.thumb)}" alt="" loading="lazy" width="640" height="360">
         <span class="facade-play" aria-hidden="true">&#9654;</span>
       </button>`
    : placeholderTile("facade", "Video");

  return `
    <li class="work-card">
      ${facade}
      <div class="work-body">
        ${placeholderFlag(item)}
        <h3 class="work-title">${escapeHtml(item.title)}</h3>
        <p class="work-meta">${escapeHtml(item.meta)}</p>
        ${item.note ? `<p class="work-note">${escapeHtml(item.note)}</p>` : ""}
        <div class="work-foot">${crossRef(item)}</div>
      </div>
    </li>
  `;
}

function designCard(item) {
  const art = item.image
    ? `<img class="work-cover" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" width="600" height="600">`
    : placeholderTile("work-cover", "Artwork");

  return `
    <li class="work-card">
      ${art}
      <div class="work-body">
        ${placeholderFlag(item)}
        <h3 class="work-title">${escapeHtml(item.title)}</h3>
        <p class="work-meta">${escapeHtml(item.meta)}</p>
        ${item.note ? `<p class="work-note">${escapeHtml(item.note)}</p>` : ""}
        <div class="work-foot">${crossRef(item)}</div>
      </div>
    </li>
  `;
}

function podcastEntry(item) {
  const art = item.art
    ? `<img class="entry-art" src="${escapeHtml(item.art)}" alt="Artwork for ${escapeHtml(item.show)}" loading="lazy" width="96" height="96">`
    : placeholderTile("entry-art", "Art");

  const listen = item.listenHref
    ? `<a class="stream-link" href="${escapeHtml(item.listenHref)}" target="_blank" rel="noopener">Listen</a>`
    : "";

  return `
    <li class="entry">
      ${art}
      <div class="entry-body">
        ${placeholderFlag(item)}
        <span class="role-tag">${escapeHtml(item.role)}</span>
        <h3 class="entry-title">${escapeHtml(item.title)}</h3>
        <p class="entry-meta">${escapeHtml(item.show)} &middot; ${escapeHtml(item.date)}</p>
        ${item.note ? `<p class="entry-note">${escapeHtml(item.note)}</p>` : ""}
        <div class="entry-actions">${listen}${crossRef(item)}</div>
      </div>
    </li>
  `;
}

function speakingEntry(item) {
  const watch = item.videoHref
    ? `<a class="stream-link" href="${escapeHtml(item.videoHref)}" target="_blank" rel="noopener">Watch</a>`
    : "";

  return `
    <li class="entry">
      <div class="entry-body">
        ${placeholderFlag(item)}
        <span class="role-tag">${escapeHtml(item.role)}</span>
        <h3 class="entry-title">${escapeHtml(item.title)}</h3>
        <p class="entry-meta">${escapeHtml(item.host)} &middot; ${escapeHtml(item.date)}</p>
        ${item.note ? `<p class="entry-note">${escapeHtml(item.note)}</p>` : ""}
        <div class="entry-actions">${watch}${crossRef(item)}</div>
      </div>
    </li>
  `;
}

function writingEntry(item) {
  /* A title is a link only when there is a page behind it. A link
     that goes nowhere is worse than plain text, because it promises
     something and then does not deliver it. */
  const title = item.href
    ? `<a href="${escapeHtml(item.href)}">${escapeHtml(item.title)}</a>`
    : escapeHtml(item.title);

  return `
    <li class="entry">
      <div class="entry-body">
        ${placeholderFlag(item)}
        <span class="role-tag">${escapeHtml(item.kind)}</span>
        <h3 class="entry-title">${title}</h3>
        <p class="entry-meta">${escapeHtml(item.meta)}</p>
        ${item.note ? `<p class="entry-note">${escapeHtml(item.note)}</p>` : ""}
        <div class="entry-actions">${crossRef(item)}</div>
      </div>
    </li>
  `;
}

/* ============================================================
   Render

   Each room mounts into one element. The lookup returning null is
   the normal case on five pages out of six, so it is a quiet exit
   and not an error.
   ============================================================ */

function renderRoom(mountId, items, cardFn, emptyTitle, emptyLines) {
  const mount = document.getElementById(mountId);
  if (!mount) return;

  if (!items.length) {
    emptyState(mount, emptyTitle, emptyLines);
    return;
  }
  mount.innerHTML = items.map(cardFn).join("");
}

/* ============================================================
   The music room's player

   One <audio> element for the whole room. Every cover is a remote
   control for it: clicking Play swaps the source rather than opening
   a second player, so two tracks can never play over each other.

   This is where the conflict recorded in CLAUDE.md gets settled. A
   player bar cannot survive a real page navigation, and the six
   rooms are six real pages. So audio never crosses one. This bar
   belongs to Music, and a lyric page carries its own single track.
   ============================================================ */
function initPlayer() {
  const audio = document.getElementById("roomAudio");
  const now = document.getElementById("playerNow");
  const grid = document.getElementById("musicGrid");
  if (!audio || !now || !grid) return;

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".play-btn");
    if (!btn || btn.disabled) return;

    audio.src = btn.dataset.src;
    now.textContent = btn.dataset.title;
    /* play() rejects if the browser blocks it or the file is missing.
       Unhandled, that surfaces as a console error a visitor cannot act
       on. Caught, the bar simply stays loaded and they can press the
       native control themselves. */
    audio.play().catch(() => {
      now.textContent = btn.dataset.title + " (press play)";
    });
  });
}

/* ============================================================
   The video facades

   Nothing is requested from YouTube until someone asks. On click the
   thumbnail is replaced by the real iframe, which is built here
   rather than shipped hidden in the markup: a hidden iframe still
   loads, so hiding one would defeat the entire point.
   ============================================================ */
function initFacades() {
  const grid = document.getElementById("videoGrid");
  if (!grid) return;

  grid.addEventListener("click", (e) => {
    const facade = e.target.closest(".facade");
    if (!facade || !facade.dataset.yt) return;

    const frame = document.createElement("iframe");
    frame.src = "https://www.youtube-nocookie.com/embed/" + facade.dataset.yt + "?autoplay=1";
    frame.title = facade.getAttribute("aria-label") || "Video";
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture";
    frame.allowFullscreen = true;

    facade.replaceWith(frame);
  });
}

/* ============================================================
   Boot
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  renderRoom("musicGrid", MUSIC, musicCard,
    "No releases here yet",
    ["The music is being gathered. Cover art, streaming links and the player all live in this room."]);

  renderRoom("videoGrid", VIDEO, videoCard,
    "No video here yet",
    ["Anything whose form is video lands here, including live performance."]);

  renderRoom("designGrid", DESIGN, designCard,
    "No design here yet",
    ["Cover art, logos, flyers, merch, and the design system all land here."]);

  renderRoom("podcastList", PODCASTS, podcastEntry,
    "No episodes here yet",
    ["Shows Jack hosts, appears on, and produces for other people all land here."]);

  renderRoom("speakingList", SPEAKING, speakingEntry,
    "No talks here yet",
    ["Talks and hosted events land here."]);

  renderRoom("writingList", WRITING, writingEntry,
    "Nothing written here yet",
    ["Lyrics and prose land here. Each lyric gets its own page, with the track it belongs to."]);

  initPlayer();
  initFacades();
});
