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

  /* Twenty releases, newest first. Dates come from the iTunes Search
     API against Jack's Apple artist id, which returns the full
     discography; Spotify's pages render client side and carry no date.
     That lookup lists 53 releases against these 20, which is the
     curation working rather than a gap.

     Spotify is the only stream link on purpose. It is where plays
     count, and one destination reads as a decision where two read as
     indecision. SoundCloud URLs for five of these are recorded in
     _source/music/STREAMS.md if that ever changes.

     COLLABORATIONS NAME THE OTHER PEOPLE, in `format`. Per Jack: a
     title is just the title, except where the work is shared, and
     then the people belong on the card.

     THREE CARDS CARRY AUDIO. The room's player is a sampler, not a
     catalogue: everything else is `track: null` and sends people to
     Spotify. Hosting the discography would be maintaining a worse
     Spotify, and the plays would count for nothing.

     COVERS: six come from Jack's 3000x3000 originals, the rest from
     Spotify at 640. Both are derived down to 640 here, which covers a
     340px card at 2x. A modal showing a cover large would need the
     originals again. */

  {
    title: "Race Day",
    year: "2026",
    format: "Release",
    cover: "/assets/img/wayspace/music/race-day.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/album/0gLDBYIG7S9ZykGjMKEwPY" }],
    track: { src: "/assets/audio/race-day.mp3", title: "Race Day" },
    crossRef: null
  },
  {
    title: "Feivel Speaks (Deluxe)",
    year: "2025",
    format: "Album",
    cover: "/assets/img/wayspace/music/feivel-speaks-deluxe.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/album/6P9hhxcT0jzRPf6fsyoyDj" }],
    track: { src: "/assets/audio/all-that-i-do.mp3", title: "All that I Do" },
    crossRef: null
  },
  {
    title: "Feivel Speaks",
    year: "2024",
    format: "Album",
    cover: "/assets/img/wayspace/music/feivel-speaks.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/album/43LSqY2k5sk7KDWkEW0MJk" }],
    track: { src: "/assets/audio/safe.mp3", title: "Safe" },
    crossRef: { text: "Lyrics", href: "/wayspace/writing", room: "writing" }
  },
  {
    title: "Wayspace (Deluxe)",
    year: "2023",
    format: "Album",
    cover: "/assets/img/wayspace/music/wayspace-deluxe.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/album/0TKnaG1hX3415Nxo5fndFI" }],
    track: null,
    crossRef: null
  },
  {
    title: "Mystery",
    year: "2023",
    format: "Foster Family single",
    cover: "/assets/img/wayspace/music/mystery.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/track/2L61W1CSb0kdpOaWhHjQxs" }],
    track: null,
    crossRef: null
  },
  {
    title: "Moment",
    year: "2023",
    format: "Single with Fabrizio and Tally Schwenk",
    cover: "/assets/img/wayspace/music/moment.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/track/0Ssx0NtfdOUHGXLkaDn7SC" }],
    track: null,
    crossRef: null
  },
  {
    title: "Wayspace",
    year: "2022",
    format: "Album",
    cover: "/assets/img/wayspace/music/wayspace.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/album/5U1K4wDc75208yey9abs9w" }],
    track: null,
    crossRef: { text: "Lyrics", href: "/wayspace/writing", room: "writing" }
  },
  {
    title: "You'll Be Alright",
    year: "2022",
    format: "Foster Family single",
    cover: "/assets/img/wayspace/music/youll-be-alright.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/album/23S89nP8gShFp8FsRVFCNO" }],
    track: null,
    crossRef: null
  },
  {
    title: "All I Need",
    year: "2022",
    format: "Foster Family single",
    cover: "/assets/img/wayspace/music/all-i-need.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/track/4k2gNNveiUrhPHotKqxpbe" }],
    track: null,
    crossRef: null
  },
  {
    title: "Jackpot",
    year: "2021",
    format: "Project",
    cover: "/assets/img/wayspace/music/jackpot.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/album/2CRVwExrlmn5IMi9r6YneJ" }],
    track: null,
    crossRef: null
  },
  {
    title: "The Edge",
    year: "2021",
    format: "Single with Fabrizio and Tally Schwenk",
    cover: "/assets/img/wayspace/music/the-edge.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/album/3l2dj34tBf6PNXs21Sf8Ap" }],
    track: null,
    crossRef: null
  },
  {
    title: "You Got Me",
    year: "2021",
    format: "Single with Tally Schwenk",
    cover: "/assets/img/wayspace/music/you-got-me.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/track/37hZXFQf83H1y9AY8oG1Yv" }],
    track: null,
    crossRef: null
  },
  {
    title: "Answers",
    year: "2020",
    format: "Foster Family single",
    cover: "/assets/img/wayspace/music/answers.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/album/1QZlxvOcteSvxf0qFe41hh" }],
    track: null,
    crossRef: null
  },
  {
    title: "Get Lost",
    year: "2020",
    format: "Project",
    cover: "/assets/img/wayspace/music/get-lost.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/album/7sqogG98sE4hlZ7iUVX3Fc" }],
    track: null,
    crossRef: null
  },
  {
    title: "Feel",
    year: "2020",
    format: "Single with Fabrizio and Josh Grant",
    cover: "/assets/img/wayspace/music/feel.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/track/0W9rnVegGPAXohPhdX4ka4" }],
    track: null,
    crossRef: null
  },
  {
    title: "Only Human (Stripped)",
    year: "2020",
    format: "Single",
    cover: "/assets/img/wayspace/music/only-human-stripped.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/track/6CJyf3hEzhWe4I0n89O5EL" }],
    track: null,
    crossRef: null
  },
  {
    title: "Light of Dawn",
    year: "2020",
    format: "Single with Noah Kenton",
    cover: "/assets/img/wayspace/music/light-of-dawn.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/track/6hbUnD55sC6vFmDytOX2pr" }],
    track: null,
    crossRef: null
  },
  {
    title: "Looking For More",
    year: "2019",
    format: "Single with Fabrizio",
    cover: "/assets/img/wayspace/music/looking-for-more.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/track/5t8TgdshDTDhEDyKzD6TyS" }],
    track: null,
    crossRef: null
  },
  {
    title: "Jahny",
    year: "2019",
    format: "Project",
    cover: "/assets/img/wayspace/music/jahny.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/album/6RxQiKUC2chQkqFmNUzWP5" }],
    track: null,
    crossRef: { text: "Watch", href: "/wayspace/video", room: "video" }
  },
  {
    title: "So Much For So Long",
    year: "2018",
    format: "Project",
    cover: "/assets/img/wayspace/music/so-much-for-so-long.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/album/78jxFTbCQYcEuoO41cHCl1" }],
    track: null,
    crossRef: { text: "Watch", href: "/wayspace/video", room: "video" }
  }
];

/* ============================================================
   VIDEO
   Anything whose form is video. youtubeId drives the facade: the
   thumbnail ships as a static image and the iframe is built only
   when a visitor clicks, so YouTube is contacted at no other time.
   ============================================================ */
const VIDEO = [

  /* Ordered newest first, by YouTube upload date scraped from each
     watch page (oembed does not carry it). The dates live alongside
     the titles in _source/video-titles.json for all 47 videos, so a
     later room can reuse them without another pass.

     One caveat worth holding: for a recap, the upload date is when
     the video went up, not when the show happened. They are usually
     close. The Pocket show is the exception, posted a year after the
     album it celebrates.

     Artist prefixes are stripped. Seven of these went out under Jahn
     Rome, the moniker before Jackintheway. Per Jack: leave it out,
     but do not correct it anywhere it still stands. Titles are just
     the song titles. Where a piece is a collaboration the other
     names belong on the card, which applies in Music rather than
     here, since nothing in this room is one. */

  {
    title: "Live at The Pocket, DC",
    /* 2022, the year of the show, not 2023 when the video went up.
       Jack's call. For a recap the performance date is the true one,
       and this is the room's one case where they differ by a year. */
    meta: "Live performance, 2022",
    thumb: "/assets/img/wayspace/video/wayspace-album-release-show.jpg",
    youtubeId: "7aSk3jFGKwM",
    note: "Headline performance to celebrate the Wayspace album release.",
    crossRef: { text: "Wayspace is in Music", href: "/wayspace/music" }
  },
  {
    title: "Somewhere Somehow, at Sofar Washington",
    meta: "Live session, 2022",
    thumb: "/assets/img/wayspace/video/somewhere-somehow-at-sofar-sounds.jpg",
    youtubeId: "cJBdDMDlxO0",
    note: "",
    crossRef: { text: "Lyrics are in Writing", href: "/wayspace/writing" }
  },
  {
    title: "In My Head",
    meta: "Music video, 2022",
    thumb: "/assets/img/wayspace/video/in-my-head-music-video.jpg",
    youtubeId: "gmTUaUwfmkU",
    note: "",
    crossRef: { text: "On Wayspace, in Music", href: "/wayspace/music" }
  },
  {
    title: "I Hope You'll Change",
    meta: "Audio visualiser, 2020",
    thumb: "/assets/img/wayspace/video/i-hope-youll-change-audio-visualizer.jpg",
    youtubeId: "OMFNBe0LYbg",
    note: "",
    crossRef: null
  },
  {
    title: "I Wonder",
    meta: "Music video, 2019",
    thumb: "/assets/img/wayspace/video/i-wonder-music-video.jpg",
    youtubeId: "ZgWYWtpDihQ",
    note: "",
    crossRef: null
  },
  {
    title: "Headlining Baltimore Soundstage",
    meta: "Live performance, 2019",
    thumb: "/assets/img/wayspace/video/headlining-baltimore-soundstage.jpg",
    youtubeId: "X75WjyZtvpg",
    note: "",
    crossRef: null
  },
  {
    title: "Jahny",
    meta: "Full EP stream with lyrics, 2019",
    thumb: "/assets/img/wayspace/video/jahny-full-album-visualizer-with-lyrics.jpg",
    youtubeId: "N171NTRWvTc",
    note: "The whole EP in one sitting, lyrics on screen.",
    crossRef: { text: "Jahny is in Music", href: "/wayspace/music" }
  },
  {
    title: "Raindrops",
    meta: "Lyric video, 2018",
    thumb: "/assets/img/wayspace/video/raindrops-lyric-video.jpg",
    youtubeId: "NCgeeNG8KtI",
    note: "",
    crossRef: { text: "Lyrics are in Writing", href: "/wayspace/writing" }
  },
  {
    title: "Supporting Wu-Tang at The Anthem",
    meta: "Live performance, 2018",
    thumb: "/assets/img/wayspace/video/supporting-wu-tang-in-dc.jpg",
    youtubeId: "xR7jo4R13iw",
    note: "",
    crossRef: { text: "The music is in Music", href: "/wayspace/music" }
  },
  {
    title: "Ready For More",
    meta: "Music video, 2018",
    thumb: "/assets/img/wayspace/video/ready-for-more-music-video.jpg",
    youtubeId: "CZPfM8Ab-RE",
    note: "",
    crossRef: null
  },
  {
    title: "First headlining show, sold out",
    meta: "Live performance, 2018",
    thumb: "/assets/img/wayspace/video/first-headlining-show-sold-out.jpg",
    youtubeId: "Fmub_hieutE",
    note: "",
    crossRef: null
  },
  {
    title: "So Much For So Long",
    meta: "Previews, 2018",
    thumb: "/assets/img/wayspace/video/so-much-for-so-long-visualizer.jpg",
    youtubeId: "34e8A5bchlc",
    note: "",
    crossRef: { text: "The release is in Music", href: "/wayspace/music" }
  },
  {
    title: "Supporting Dumbfoundead at Soundstage",
    meta: "Live performance, 2018",
    thumb: "/assets/img/wayspace/video/supporting-dumbfoundead-at-soundstage.jpg",
    youtubeId: "hWz2W-lfp4M",
    note: "",
    crossRef: null
  },
  {
    title: "Nocturnal: The Making of 24 Hours",
    meta: "Documentary, 2018",
    thumb: "/assets/img/wayspace/video/nocturnal-documentary.jpg",
    youtubeId: "BZl5AH71kZM",
    note: "",
    crossRef: null
  },
  {
    title: "Issues",
    meta: "Music video, 2017",
    thumb: "/assets/img/wayspace/video/issues-music-video.jpg",
    youtubeId: "tlPH-ESOkcw",
    note: "",
    crossRef: null
  },
  {
    title: "Drexel Spring Jam",
    meta: "Live performance, 2016",
    thumb: "/assets/img/wayspace/video/drexel-spring-jam.jpg",
    youtubeId: "MdSYaaxTHAc",
    note: "",
    crossRef: null
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

  /* WAYSPACE is Jack's own show, 45 episodes deep. These five are the
     ones he pulled, newest first.

     Episode links go to Apple Podcasts. The show is hosted on Anchor,
     so its Spotify episode URLs resolve to creators.spotify.com, which
     is the creator-facing page rather than somewhere to send a
     listener. Apple's are clean, public, and open in a browser or an
     app. Worth revisiting if Jack would rather be Spotify-first here
     the way the Music room is.

     Every episode also exists as video on the YouTube channel. Those
     ids are in _source/video-titles.json if this room ever wants a
     watch link beside the listen one. */
  {
    title: "These 8 Habits Made Me Creative Again",
    show: "WAYSPACE",
    role: "Host",
    date: "June 2025",
    art: "/assets/img/wayspace/podcasts/wayspace-show.jpg",
    listenHref: "https://podcasts.apple.com/us/podcast/these-8-habits-made-me-creative-again/id1571426340?i=1000712989433",
    note: "",
    crossRef: null
  },
  {
    title: "5 Principles to Transform Your Relationships",
    show: "WAYSPACE",
    role: "Host",
    date: "June 2025",
    art: "/assets/img/wayspace/podcasts/wayspace-show.jpg",
    listenHref: "https://podcasts.apple.com/us/podcast/5-principles-to-transform-your-relationships/id1571426340?i=1000712015973",
    note: "",
    crossRef: null
  },
  {
    title: "How to Be a Peace Giver",
    show: "WAYSPACE",
    role: "Host",
    date: "June 2025",
    art: "/assets/img/wayspace/podcasts/wayspace-show.jpg",
    listenHref: "https://podcasts.apple.com/us/podcast/how-to-be-a-peace-giver/id1571426340?i=1000710770592",
    note: "",
    crossRef: null
  },
  {
    title: "The Five Question Test",
    show: "WAYSPACE",
    role: "Host",
    date: "May 2025",
    art: "/assets/img/wayspace/podcasts/wayspace-show.jpg",
    listenHref: "https://podcasts.apple.com/us/podcast/the-five-question-test/id1571426340?i=1000707857432",
    note: "",
    crossRef: null
  },
  {
    title: "The Anchor List: A Tool for Grounding",
    show: "WAYSPACE",
    role: "Host",
    date: "April 2025",
    art: "/assets/img/wayspace/podcasts/wayspace-show.jpg",
    listenHref: "https://podcasts.apple.com/us/podcast/the-anchor-list-a-tool-for-grounding/id1571426340?i=1000702326515",
    note: "",
    crossRef: null
  },

  /* Someone else's show, which is exactly what the role tag is for.
     Hosted for Tribly, and also on /production, where the same work is
     framed as something a client can hire rather than something Jack
     made. */
  {
    title: "Crossing The Bridge",
    show: "Tribly",
    role: "Host",
    date: "2023",
    art: "/assets/img/wayspace/podcasts/crossing-the-bridge.jpg",
    listenHref: "https://open.spotify.com/show/05E8kMGjWNOmRdK183o3s2",
    note: "Hosted, recorded and edited for Tribly.",
    crossRef: { text: "Also on Production", href: "/production" }
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

/* The Music room's crossRef, as a button rather than a text link.
   Other rooms keep the quieter text version; this one sits in a row
   with Play and needs the same weight. `room` picks the destination
   room's colour. */
function crossBtn(item) {
  if (!item.crossRef) return "";
  const room = item.crossRef.room ? ` to-${escapeHtml(item.crossRef.room)}` : "";
  return `<a class="crossref-btn${room}" href="${escapeHtml(item.crossRef.href)}">${escapeHtml(item.crossRef.text)}</a>`;
}

function musicCard(item) {
  const cover = item.cover
    ? `<img class="work-cover" src="${escapeHtml(item.cover)}" alt="Cover art for ${escapeHtml(item.title)}" loading="lazy" width="600" height="600">`
    : placeholderTile("work-cover", "Cover art");

  /* The per-release service tag is gone. Every release links to the
     same place, so twenty cards each stamped SPOTIFY was repeating one
     fact twenty times. The `streams` data stays in the array: it is
     still the record of where each release lives, and putting the tags
     back is a render change rather than a re-gathering.

     Where the release goes instead: see the note in music.html. */

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
          ${play}
          ${crossBtn(item)}
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
