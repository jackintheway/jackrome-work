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
   tile. sc: what the room's player loads from SoundCloud, or null
   where there is nothing to load. streams: where to go listen
   properly, which is most of what a music page is for.

   sc.kind is "track" or "playlist" and decides which SoundCloud API
   path the widget URL is built against. sc.title is only the label
   the bar shows while the widget is still loading: once a sound is
   playing the player asks the widget for the real title, which is
   what keeps an album's display correct as it advances.
   ============================================================ */
const MUSIC = [

  /* Twenty releases, newest first. Dates come from the iTunes Search
     API against Jack's Apple artist id, which returns the full
     discography; Spotify's pages render client side and carry no date.
     That lookup lists 53 releases against these 20, which is the
     curation working rather than a gap.

     Spotify is the only stream *link* on purpose. It is where plays
     count, and one destination reads as a decision where two read as
     indecision. That is a separate question from what the room's
     player plays, which is SoundCloud and is never presented as a
     second place to go.

     COLLABORATIONS NAME THE OTHER PEOPLE, in `format`. Per Jack: a
     title is just the title, except where the work is shared, and
     then the people belong on the card.

     NINE CARDS CARRY AUDIO, up from three when the room played self
     hosted MP3s. The eleven without it are mostly collaborations and
     features, which live on the other artists' SoundCloud accounts
     rather than Jack's. That is normal and not a gap.

     WAYSPACE (2022) PLAYS THE DELUXE SET. The twelve track album has
     no set of its own on SoundCloud; the only Wayspace set there is
     the twenty four track deluxe, and the standard card points its
     Play button at that same set. Per Jack 2026-09-15: the arrival
     page sends people to this card, and they should be able to press
     play when they get here. The bar names what is actually loaded,
     so it says "Wayspace (Deluxe)" either way.

     FEIVEL SPEAKS (2024) DELIBERATELY DOES NOT PLAY. Same shape: Jack
     extended /sets/feivel-speaks to all fifteen tracks on 2026-08-23,
     which made it the deluxe and left the standard album without a
     set of its own. Per Jack: two buttons pointing at the same tracks
     are two buttons doing one thing. Wayspace above is the exception
     he chose, not a change to the rule.

     COVERS: six come from Jack's 3000x3000 originals, the rest from
     Spotify at 640. Both are derived down to 640 here, which covers a
     340px card at 2x. A modal showing a cover large would need the
     originals again. */

  {
    title: "Race Day",
    anchor: "race-day",
    year: "2026",
    format: "Release",
    cover: "/assets/img/wayspace/music/race-day.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/album/0gLDBYIG7S9ZykGjMKEwPY" }],
    sc: { id: "2386806162", kind: "track", title: "RACE DAY" },
    crossRef: null
  },
  {
    title: "Feivel Speaks (Deluxe)",
    anchor: "feivel-speaks-deluxe",
    year: "2025",
    format: "Album",
    cover: "/assets/img/wayspace/music/feivel-speaks-deluxe.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/album/6P9hhxcT0jzRPf6fsyoyDj" }],
    sc: { id: "1919548507", kind: "playlist", title: "Feivel Speaks (Deluxe)" },
    crossRef: null
  },
  {
    title: "Feivel Speaks",
    anchor: "feivel-speaks",
    year: "2024",
    format: "Album",
    cover: "/assets/img/wayspace/music/feivel-speaks.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/album/43LSqY2k5sk7KDWkEW0MJk" }],
    sc: null,
    crossRef: { text: "Lyrics", href: "/wayspace/writing?collection=feivel-speaks#writingFilters", room: "writing" }
  },
  {
    title: "Wayspace (Deluxe)",
    anchor: "wayspace-deluxe",
    year: "2023",
    format: "Album",
    cover: "/assets/img/wayspace/music/wayspace-deluxe.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/album/0TKnaG1hX3415Nxo5fndFI" }],
    sc: { id: "2288049135", kind: "playlist", title: "Wayspace (Deluxe)" },
    crossRef: null
  },
  {
    title: "Mystery",
    anchor: "mystery",
    year: "2023",
    format: "Foster Family single",
    cover: "/assets/img/wayspace/music/mystery.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/track/2L61W1CSb0kdpOaWhHjQxs" }],
    sc: null,
    crossRef: null
  },
  {
    title: "Moment",
    anchor: "moment",
    year: "2023",
    format: "Single with Fabrizio and Tally Schwenk",
    cover: "/assets/img/wayspace/music/moment.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/track/0Ssx0NtfdOUHGXLkaDn7SC" }],
    sc: null,
    crossRef: null
  },
  {
    title: "Wayspace",
    anchor: "wayspace",
    year: "2022",
    format: "Album",
    cover: "/assets/img/wayspace/music/wayspace.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/album/5U1K4wDc75208yey9abs9w" }],
    sc: { id: "2288049135", kind: "playlist", title: "Wayspace (Deluxe)" },
    crossRef: { text: "Lyrics", href: "/wayspace/writing?collection=wayspace#writingFilters", room: "writing" }
  },
  {
    title: "You'll Be Alright",
    anchor: "you-ll-be-alright",
    year: "2022",
    format: "Foster Family single",
    cover: "/assets/img/wayspace/music/youll-be-alright.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/album/23S89nP8gShFp8FsRVFCNO" }],
    sc: null,
    crossRef: null
  },
  {
    title: "All I Need",
    anchor: "all-i-need",
    year: "2022",
    format: "Foster Family single",
    cover: "/assets/img/wayspace/music/all-i-need.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/track/4k2gNNveiUrhPHotKqxpbe" }],
    sc: null,
    crossRef: null
  },
  {
    title: "Jackpot",
    anchor: "jackpot",
    year: "2021",
    format: "Project",
    cover: "/assets/img/wayspace/music/jackpot.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/album/2CRVwExrlmn5IMi9r6YneJ" }],
    sc: { id: "1293914818", kind: "playlist", title: "Jackpot" },
    crossRef: null
  },
  {
    title: "The Edge",
    anchor: "the-edge",
    year: "2021",
    format: "Single with Fabrizio and Tally Schwenk",
    cover: "/assets/img/wayspace/music/the-edge.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/album/3l2dj34tBf6PNXs21Sf8Ap" }],
    sc: null,
    crossRef: null
  },
  {
    title: "You Got Me",
    anchor: "you-got-me",
    year: "2021",
    format: "Single with Tally Schwenk",
    cover: "/assets/img/wayspace/music/you-got-me.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/track/37hZXFQf83H1y9AY8oG1Yv" }],
    sc: null,
    crossRef: null
  },
  {
    title: "Answers",
    anchor: "answers",
    year: "2020",
    format: "Foster Family single",
    cover: "/assets/img/wayspace/music/answers.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/album/1QZlxvOcteSvxf0qFe41hh" }],
    sc: null,
    crossRef: null
  },
  {
    title: "Get Lost",
    anchor: "get-lost",
    year: "2020",
    format: "Project",
    cover: "/assets/img/wayspace/music/get-lost.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/album/7sqogG98sE4hlZ7iUVX3Fc" }],
    sc: { id: "1079576932", kind: "playlist", title: "Get Lost" },
    crossRef: null
  },
  {
    title: "Feel",
    anchor: "feel",
    year: "2020",
    format: "Single with Fabrizio and Josh Grant",
    cover: "/assets/img/wayspace/music/feel.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/track/0W9rnVegGPAXohPhdX4ka4" }],
    sc: null,
    crossRef: null
  },
  {
    title: "Only Human (Stripped)",
    anchor: "only-human-stripped",
    year: "2020",
    format: "Single",
    cover: "/assets/img/wayspace/music/only-human-stripped.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/track/6CJyf3hEzhWe4I0n89O5EL" }],
    sc: { id: "783771448", kind: "track", title: "Only Human (Stripped)" },
    crossRef: null
  },
  {
    title: "Light of Dawn",
    anchor: "light-of-dawn",
    year: "2020",
    format: "Single with Noah Kenton",
    cover: "/assets/img/wayspace/music/light-of-dawn.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/track/6hbUnD55sC6vFmDytOX2pr" }],
    sc: null,
    crossRef: null
  },
  {
    title: "Looking For More",
    anchor: "looking-for-more",
    year: "2019",
    format: "Single with Fabrizio",
    cover: "/assets/img/wayspace/music/looking-for-more.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/track/5t8TgdshDTDhEDyKzD6TyS" }],
    sc: null,
    crossRef: null
  },
  {
    title: "Jahny",
    anchor: "jahny",
    year: "2019",
    format: "Project",
    cover: "/assets/img/wayspace/music/jahny.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/album/6RxQiKUC2chQkqFmNUzWP5" }],
    sc: { id: "685445952", kind: "playlist", title: "Jahny" },
    crossRef: { text: "Watch", href: "/wayspace/video#jahny", room: "video" }
  },
  {
    title: "So Much For So Long",
    anchor: "so-much-for-so-long",
    year: "2018",
    format: "Project",
    cover: "/assets/img/wayspace/music/so-much-for-so-long.jpg",
    streams: [{ name: "Spotify", href: "https://open.spotify.com/album/78jxFTbCQYcEuoO41cHCl1" }],
    sc: { id: "550795005", kind: "playlist", title: "So Much For So Long" },
    crossRef: { text: "Watch", href: "/wayspace/video#so-much-for-so-long", room: "video" }
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
    anchor: "live-at-the-pocket-dc",
    /* 2022, the year of the show, not 2023 when the video went up.
       Jack's call. For a recap the performance date is the true one,
       and this is the room's one case where they differ by a year. */
    meta: "Live performance, 2022",
    thumb: "/assets/img/wayspace/video/wayspace-album-release-show.jpg",
    youtubeId: "7aSk3jFGKwM",
    note: "Headline performance to celebrate the Wayspace album release.",
    crossRef: { text: "Hear Wayspace", href: "/wayspace/music#wayspace" }
  },
  {
    title: "Somewhere Somehow, at Sofar Washington",
    anchor: "somewhere-somehow-at-sofar-washington",
    meta: "Live session, 2022",
    thumb: "/assets/img/wayspace/video/somewhere-somehow-at-sofar-sounds.jpg",
    youtubeId: "cJBdDMDlxO0",
    note: "",
    crossRef: { text: "Read the lyrics", href: "/wayspace/writing/somewhere-somehow" }
  },
  {
    title: "In My Head",
    anchor: "in-my-head",
    meta: "Music video, 2022",
    thumb: "/assets/img/wayspace/video/in-my-head-music-video.jpg",
    youtubeId: "gmTUaUwfmkU",
    /* The only square one in the room. Per Jack, 2026-08-23. */
    ratio: "1 / 1",
    note: "",
    crossRef: { text: "Read the lyrics", href: "/wayspace/writing/all-in-my-head" }
  },
  {
    title: "I Hope You'll Change",
    anchor: "i-hope-you-ll-change",
    meta: "Audio visualiser, 2020",
    thumb: "/assets/img/wayspace/video/i-hope-youll-change-audio-visualizer.jpg",
    youtubeId: "OMFNBe0LYbg",
    note: "",
    crossRef: { text: "Read the lyrics", href: "/wayspace/writing/i-hope-youll-change" }
  },
  {
    title: "I Wonder",
    anchor: "i-wonder",
    meta: "Music video, 2019",
    thumb: "/assets/img/wayspace/video/i-wonder-music-video.jpg",
    youtubeId: "ZgWYWtpDihQ",
    note: "",
    crossRef: { text: "Read the lyrics", href: "/wayspace/writing/i-wonder" }
  },
  {
    title: "Headlining Baltimore Soundstage",
    anchor: "headlining-baltimore-soundstage",
    meta: "Live performance, 2019",
    thumb: "/assets/img/wayspace/video/headlining-baltimore-soundstage.jpg",
    youtubeId: "X75WjyZtvpg",
    note: "",
    crossRef: null
  },
  {
    title: "Jahny",
    anchor: "jahny",
    meta: "Full EP stream with lyrics, 2019",
    thumb: "/assets/img/wayspace/video/jahny-full-album-visualizer-with-lyrics.jpg",
    youtubeId: "N171NTRWvTc",
    note: "The EP in one sitting, lyrics on screen.",
    crossRef: { text: "Hear Jahny", href: "/wayspace/music#jahny" }
  },
  {
    title: "Raindrops",
    anchor: "raindrops",
    meta: "Lyric video, 2018",
    thumb: "/assets/img/wayspace/video/raindrops-lyric-video.jpg",
    youtubeId: "NCgeeNG8KtI",
    note: "",
    crossRef: null
  },
  {
    title: "Supporting Wu-Tang at The Anthem",
    anchor: "supporting-wu-tang-at-the-anthem",
    meta: "Live performance, 2018",
    thumb: "/assets/img/wayspace/video/supporting-wu-tang-in-dc.jpg",
    youtubeId: "xR7jo4R13iw",
    note: "",
    crossRef: null
  },
  {
    title: "Ready For More",
    anchor: "ready-for-more",
    meta: "Music video, 2018",
    thumb: "/assets/img/wayspace/video/ready-for-more-music-video.jpg",
    youtubeId: "CZPfM8Ab-RE",
    note: "",
    crossRef: null
  },
  {
    title: "First headlining show, sold out",
    anchor: "first-headlining-show-sold-out",
    meta: "Live performance, 2018",
    thumb: "/assets/img/wayspace/video/first-headlining-show-sold-out.jpg",
    youtubeId: "Fmub_hieutE",
    note: "",
    crossRef: null
  },
  {
    title: "So Much For So Long",
    anchor: "so-much-for-so-long",
    meta: "Previews, 2018",
    thumb: "/assets/img/wayspace/video/so-much-for-so-long-visualizer.jpg",
    youtubeId: "34e8A5bchlc",
    note: "",
    crossRef: { text: "Hear the release", href: "/wayspace/music#so-much-for-so-long" }
  },
  {
    title: "Supporting Dumbfoundead at Soundstage",
    anchor: "supporting-dumbfoundead-at-soundstage",
    meta: "Live performance, 2018",
    thumb: "/assets/img/wayspace/video/supporting-dumbfoundead-at-soundstage.jpg",
    youtubeId: "hWz2W-lfp4M",
    note: "",
    crossRef: null
  },
  {
    title: "Nocturnal: The Making of 24 Hours",
    anchor: "nocturnal-the-making-of-24-hours",
    meta: "Documentary, 2018",
    thumb: "/assets/img/wayspace/video/nocturnal-documentary.jpg",
    youtubeId: "BZl5AH71kZM",
    note: "",
    crossRef: null
  },
  {
    title: "Issues",
    anchor: "issues",
    meta: "Music video, 2017",
    thumb: "/assets/img/wayspace/video/issues-music-video.jpg",
    youtubeId: "tlPH-ESOkcw",
    note: "",
    crossRef: null
  },
  {
    title: "Drexel Spring Jam",
    anchor: "drexel-spring-jam",
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

   This room is shaped differently from the other five. Jack's
   instruction on 2026-08-23 was that Design tells the story of how
   the system got here, in order, so the page runs a narrative spine
   first and the grid holds whatever is not part of that lineage.
   Three arrays feed it: TOOLS and SINGLES for the spine, DESIGN for
   the grid.
   ============================================================ */

/* ---- The lineage, step one: the tool pack (2021) ----
   Six objects, each standing for a quality. The names and the
   qualities are Jack's, taken from the filenames in the mp3s/ and
   wavs/ folders of the pack, not invented here.

   Each tile ships a still and a five second clip. The clip carries no
   src in the markup: initToolClips sets it on first activation, so a
   visitor who never touches one never downloads 2.7 MB. */
const TOOLS = [
  { slug: "boombox",        title: "Boombox",        quality: "Expression" },
  { slug: "goggles",        title: "Goggles",        quality: "Clear seeing" },
  { slug: "helmet",         title: "Helmet",         quality: "Durability" },
  { slug: "hoverboard",     title: "Hoverboard",     quality: "Balance" },
  { slug: "petal-detector", title: "Petal Detector", quality: "Discernment" },
  { slug: "spaceboat",      title: "Spaceboat",      quality: "Movement" }
];

/* ---- The lineage, step two: the Wayspace singles (2022) ----
   All twelve, in track order. Welcome Back and What Have I Done were
   missing from _source/cover-artwork/ when this room was built on
   2026-08-23 and Jack added them the same day, so the row is complete
   and the copy above it can say twelve and mean it.

   Track order, not newest first. These are an album's sequence and
   the sequence is a fact about the work.

   Each links to its lyric page in the Writing room, which is the
   crossRef principle applied without a crossRef field: the picture
   crosses the border, the border stays real. */
const SINGLES = [
  { slug: "welcome-back",      title: "Welcome Back" },
  { slug: "how-it-ends",       title: "How It Ends" },
  { slug: "extra",             title: "Extra" },
  { slug: "what-have-i-done",  title: "What Have I Done" },
  { slug: "did-you-forget",    title: "Did You Forget" },
  { slug: "salt",              title: "Salt" },
  { slug: "little-things",     title: "Little Things" },
  { slug: "grow",              title: "Grow" },
  { slug: "body-and-the-beast", title: "Body and the Beast" },
  { slug: "try",               title: "Try" },
  { slug: "all-in-my-head",    title: "All In My Head" },
  { slug: "somewhere-somehow", title: "Somewhere Somehow" }
];

/* ---- The grid: everything that is not the lineage ----
   `fit: "contain"` is here because posters are portrait and logos are
   wide. The default 1:1 cover crop would cut the top off a flyer and
   slice a wordmark in half, so these render whole on the card's
   ground instead.

   The flyer years come from the source files' modification dates,
   confirmed by Jack on 2026-08-23. He renamed the files with years
   from memory first, then corrected himself and said to use the file
   dates instead. Three differ between the two: Howard Theatre and the
   holiday show are 2018 rather than 2019, and Pie Shop is 2021 rather
   than 2022. The venue detail in his filenames is his and stays.

   Flyers run newest first, the same order the Music room uses. */
const DESIGN = [
  {
    title: "The puzzle logo family",
    anchor: "the-puzzle-logo-family",
    meta: "The pieces float together",
    image: "/assets/img/wayspace/design/logos/puzzle-pieces-trio.png",
    fit: "contain",
    note: "One shape cut into pieces whose tabs still match. It exists as an Illustrator master and exports in black and white, flat color and gradient.",
    crossRef: null
  },
  {
    title: "Jackintheway",
    anchor: "jackintheway",
    meta: "The flower logo",
    image: "/assets/img/wayspace/design/logos/jackintheway-flower.png",
    fit: "contain",
    note: "The first design using the beginnings of the Wayspace color scheme. It wasn't until I made this design that I realized that 'Jackintheway' would become my new moniker.",
    crossRef: null
  },
  {
    title: "Feivel Speaks",
    anchor: "feivel-speaks",
    meta: "Album logo",
    image: "/assets/img/wayspace/design/logos/feivel-speaks.png",
    fit: "contain",
    note: "",
    crossRef: { text: "Hear the album", href: "/wayspace/music#feivel-speaks" }
  },
  {
    title: "The Pocket",
    anchor: "the-pocket",
    meta: "Show flyer, Wayspace, 2022",
    image: "/assets/img/wayspace/design/flyers/wayspace-show-the-pocket.jpg",
    fit: "contain",
    note: "",
    crossRef: { text: "Watch the set", href: "/wayspace/video#live-at-the-pocket-dc" }
  },
  {
    title: "Livestream release party",
    anchor: "livestream-release-party",
    meta: "Release flyer, 2022",
    image: "/assets/img/wayspace/design/flyers/livestream-release-party.jpg",
    fit: "contain",
    note: "",
    crossRef: null
  },
  {
    title: "Pie Shop",
    anchor: "pie-shop",
    meta: "Show flyer, DC, 2021",
    image: "/assets/img/wayspace/design/flyers/pie-shop.jpg",
    fit: "contain",
    note: "",
    crossRef: null
  },
  {
    title: "Bluebyrd",
    anchor: "bluebyrd",
    meta: "Show flyer, Songbyrd, DC, 2020",
    image: "/assets/img/wayspace/design/flyers/bluebyrd-at-songbyrd.jpg",
    fit: "contain",
    note: "",
    crossRef: null
  },
  {
    title: "Speak Your Truth",
    anchor: "speak-your-truth",
    meta: "Event flyer, 2019",
    image: "/assets/img/wayspace/design/flyers/speak-your-truth.jpg",
    fit: "contain",
    note: "",
    crossRef: null
  },
  {
    title: "Baltimore Soundstage",
    anchor: "baltimore-soundstage",
    meta: "Show flyer, 2019",
    image: "/assets/img/wayspace/design/flyers/baltimore-soundstage.jpg",
    fit: "contain",
    note: "",
    crossRef: { text: "Watch the set", href: "/wayspace/video#headlining-baltimore-soundstage" }
  },
  {
    title: "Wu-Tang show",
    anchor: "wu-tang-show",
    meta: "Show flyer, 2018, one of three versions",
    image: "/assets/img/wayspace/design/flyers/wutang-show-a.jpg",
    fit: "contain",
    note: "",
    crossRef: { text: "Watch the set", href: "/wayspace/video#supporting-wu-tang-at-the-anthem" }
  },
  {
    title: "Holiday performance",
    anchor: "holiday-performance",
    meta: "Show flyer, Songbyrd, DC, 2018",
    image: "/assets/img/wayspace/design/flyers/holiday-performance.jpg",
    fit: "contain",
    note: "",
    crossRef: null
  },
  {
    title: "Howard Theatre",
    anchor: "howard-theatre",
    meta: "Show flyer, DC, 2018",
    image: "/assets/img/wayspace/design/flyers/howard-theatre.jpg",
    fit: "contain",
    note: "",
    crossRef: null
  },
  {
    title: "So Much For So Long",
    anchor: "so-much-for-so-long",
    meta: "Listening party flyer, 2018",
    image: "/assets/img/wayspace/design/flyers/so-much-for-so-long-listening-party.jpg",
    fit: "contain",
    note: "",
    crossRef: null
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

     EVERY EPISODE ALSO EXISTS AS VIDEO, and now carries it. Per Jack
     on 2026-08-23 the room offers both, so `watchId` sits beside
     `listenHref` and Watch opens over the page rather than sending
     anyone to YouTube. Crossing The Bridge is audio only, so its
     watchId is null and no button is drawn.

     Ids came from _source/podcast/podcast-video/. */
  {
    title: "These 8 Habits Made Me Creative Again",
    anchor: "these-8-habits-made-me-creative-again",
    show: "WAYSPACE",
    role: "Host",
    date: "June 2025",
    art: "/assets/img/wayspace/podcasts/wayspace-show.jpg",
    listenHref: "https://podcasts.apple.com/us/podcast/these-8-habits-made-me-creative-again/id1571426340?i=1000712989433",
    watchId: "d4Qcts8V-cM",
    note: "",
    crossRef: null
  },
  {
    title: "5 Principles to Transform Your Relationships",
    anchor: "5-principles-to-transform-your-relationships",
    show: "WAYSPACE",
    role: "Host",
    date: "June 2025",
    art: "/assets/img/wayspace/podcasts/wayspace-show.jpg",
    listenHref: "https://podcasts.apple.com/us/podcast/5-principles-to-transform-your-relationships/id1571426340?i=1000712015973",
    watchId: "2JZAF5l8mrA",
    note: "",
    crossRef: null
  },
  {
    title: "How to Be a Peace Giver",
    anchor: "how-to-be-a-peace-giver",
    show: "WAYSPACE",
    role: "Host",
    date: "June 2025",
    art: "/assets/img/wayspace/podcasts/wayspace-show.jpg",
    listenHref: "https://podcasts.apple.com/us/podcast/how-to-be-a-peace-giver/id1571426340?i=1000710770592",
    watchId: "PiG2l283h68",
    note: "",
    crossRef: null
  },
  {
    title: "The Five Question Test",
    anchor: "the-five-question-test",
    show: "WAYSPACE",
    role: "Host",
    date: "May 2025",
    art: "/assets/img/wayspace/podcasts/wayspace-show.jpg",
    listenHref: "https://podcasts.apple.com/us/podcast/the-five-question-test/id1571426340?i=1000707857432",
    watchId: "JqER4CwcBVw",
    note: "",
    crossRef: null
  },
  {
    title: "The Anchor List: A Tool for Grounding",
    anchor: "the-anchor-list-a-tool-for-grounding",
    show: "WAYSPACE",
    role: "Host",
    date: "April 2025",
    art: "/assets/img/wayspace/podcasts/wayspace-show.jpg",
    listenHref: "https://podcasts.apple.com/us/podcast/the-anchor-list-a-tool-for-grounding/id1571426340?i=1000702326515",
    watchId: "KEpVkkXSlJ4",
    note: "",
    crossRef: null
  },

  /* Client work, and the one entry here that was not made for Jack's
     own show. Per Jack on 2026-08-23: it was his build, his scripting
     and his hosting almost completely, as lead producer, with Tribly's
     CEO closely involved. So the note says produced rather than only
     hosted. It is also on /production, where the same work is framed
     as something a client can hire rather than something he made. */
  {
    title: "Crossing The Bridge",
    anchor: "crossing-the-bridge",
    show: "Tribly",
    role: "Host",
    date: "2023",
    art: "/assets/img/wayspace/podcasts/crossing-the-bridge.jpg",
    listenHref: "https://open.spotify.com/show/05E8kMGjWNOmRdK183o3s2",
    watchId: null,
    note: "Built, scripted, hosted and produced for Tribly, as lead producer.",
    crossRef: { text: "Production credits", href: "/production#crossing-the-bridge" }
  }
];

/* ============================================================
   SPEAKING
   Talks and hosted events. Same role field, doing the same job:
   speaking at something and running it are different, and the tag
   says which without a sentence about it.
   ============================================================ */
const SPEAKING = [
  /* watchId opens the recording in the modal, like Podcasts. watchStart
     is where playback begins, in seconds: a talk given at a service
     sits inside the recording of the whole service, and the offset is
     what spares a visitor the preamble. */
  {
    title: "The Gift of Uselessness",
    anchor: "gift-of-uselessness",
    host: "SpeakEasy Spiritual Community",
    role: "Speaker",
    date: "August 30, 2026",
    note: "",
    watchId: "IB1mBX-s9A8",
    watchStart: 510,
    videoHref: null,
    crossRef: null
  }
];

/* ============================================================
   WRITING
   Two shapes in one room. A lyric links to its own page, which
   carries the words and a player for that one track. Prose links to
   its own page too, without the player.
   ============================================================ */
/* ---- The themes ----
   Slug to the label a reader sees, in the order the filter draws them.
   The labels live here and nowhere else, so a button cannot disagree
   with a card's tag.

   ASSIGNED BY HAND on 2026-08-24, reading all 75 pieces. Three sources,
   because the material is not uniform: the frontmatter tags and
   wikilinks in Jack's annotated notes for 52 of them, the NFT
   `description` in _source/music/wayspace-album-metadata/ for the nine
   Wayspace album tracks that came in without notes, and the title for
   the fourteen shorts.

   THE WIKILINKS COULD NOT DO THIS ALONE, which was the original idea.
   154 distinct targets across the notes and 129 of them appear exactly
   once, because they are note titles rather than tags: "a truly honest
   life is silent", "fingers for the moon". The two most common are
   Jack's own names. They seeded the vocabulary here and nothing more.

   WHY EIGHT AND NOT SIX. Jack asked for around six, on the reasonable
   worry that so many of these songs are about the same thing. Measured,
   they are not: the largest theme covers 40% of the room, so every
   filter still removes at least three fifths of it. Merging any pair
   pushes toward half the catalogue, which is a label rather than a
   filter. The one genuinely redundant pair is healing and love at 62%
   overlap, and they stay apart because one is about a person's own
   repair and the other is about someone else. */
const THEMES = [
  { slug: "healing",     label: "Healing" },
  { slug: "surrender",   label: "Surrender" },
  { slug: "awakening",   label: "Awakening" },
  { slug: "ego",         label: "Ego" },
  { slug: "love",        label: "Love" },
  { slug: "forgiveness", label: "Forgiveness" },
  { slug: "separation",  label: "Separation" },
  { slug: "the-work",    label: "The work" }
];

const WRITING = [

  /* Sixty-two lyrics, then fourteen shorts.

     EVERY LYRIC HAS ITS OWN PAGE. Twelve come from the Wayspace album
     metadata, which carries BPM, key, credits and Jack's note per
     track, and those twelve also link out to their lyric video. The
     other fifty come from the Obsidian files in
     _source/writing/lyrics/.

     Those fifty needed real parsing rather than a pass-through. Thirty
     of them carry a front matter block inside the body as well as
     above it (title, written, released, album), which rendered as the
     opening verse on the first attempt. All fifty use [[wikilinks]],
     which point at vault notes that do not exist on this site, so they
     are flattened to their text. Bare #tag lines go entirely.

     UNRELEASED SONGS BELONG HERE. Per the room rules, a lyric does not
     need a release to earn a page. Those carry the year they were
     written instead of a release, and have nothing to link across to.

     Sorted newest first by release date, falling back to the year
     written, like every other room.

     THE SHORTS ARE WRITING DELIVERED AS VIDEO, with no page of their
     own, because the piece is the video rather than a text with a
     video attached. */

  {
    title: "Inflamed",
    kind: "Lyric",
    meta: "Written 2026",
    href: "/wayspace/writing/inflamed",
    note: "",
    crossRef: null,
    themes: ["forgiveness", "separation", "surrender"],
    watchHref: null
  },
  {
    title: "Race Day",
    kind: "Lyric",
    meta: "Released 2026",
    href: "/wayspace/writing/race-day",
    note: "",
    crossRef: null,
    themes: ["forgiveness", "awakening", "surrender"],
    watchHref: null
  },
  {
    title: "Your Sun",
    kind: "Lyric",
    meta: "Written 2026",
    href: "/wayspace/writing/your-sun",
    note: "",
    crossRef: null,
    themes: ["ego", "forgiveness", "awakening"],
    watchHref: null
  },
  {
    title: "The Help",
    kind: "Lyric",
    meta: "Written 2026",
    href: "/wayspace/writing/the-help",
    note: "",
    crossRef: null,
    themes: ["ego", "healing", "surrender"],
    watchHref: null
  },
  {
    title: "Trix",
    kind: "Lyric",
    meta: "Written 2025",
    href: "/wayspace/writing/trix",
    note: "",
    crossRef: null,
    themes: ["healing", "ego"],
    watchHref: null
  },
  {
    title: "The Best",
    kind: "Lyric",
    meta: "Released 2025",
    href: "/wayspace/writing/the-best",
    note: "",
    crossRef: null,
    themes: ["separation", "awakening"],
    watchHref: null
  },
  {
    title: "Still Distracted",
    kind: "Lyric",
    meta: "Released 2025",
    href: "/wayspace/writing/still-distracted",
    note: "",
    crossRef: null,
    themes: ["ego", "forgiveness", "surrender"],
    watchHref: null
  },
  {
    title: "Drop The Gun",
    kind: "Lyric",
    meta: "Released 2025",
    href: "/wayspace/writing/drop-the-gun",
    note: "",
    crossRef: null,
    themes: ["surrender", "healing", "awakening"],
    watchHref: null
  },
  {
    title: "Thank God I Found You",
    kind: "Lyric",
    meta: "Released 2024",
    href: "/wayspace/writing/thank-god-i-found-you",
    note: "",
    crossRef: null,
    themes: ["surrender", "forgiveness", "the-work"],
    watchHref: null
  },
  {
    title: "Son Screen",
    kind: "Lyric",
    meta: "Released 2024",
    href: "/wayspace/writing/son-screen",
    note: "",
    crossRef: null,
    themes: ["surrender", "separation"],
    watchHref: null
  },
  {
    title: "Innocent",
    kind: "Lyric",
    meta: "Released 2024",
    href: "/wayspace/writing/innocent",
    note: "",
    crossRef: null,
    themes: ["forgiveness", "ego"],
    watchHref: null
  },
  {
    title: "Ribbons",
    kind: "Lyric",
    meta: "Released 2024",
    href: "/wayspace/writing/ribbons",
    note: "",
    crossRef: null,
    themes: ["the-work", "forgiveness", "ego"],
    watchHref: null
  },
  {
    title: "The Wasp",
    kind: "Lyric",
    meta: "Feivel Speaks · Written 2024",
    href: "/wayspace/writing/the-wasp",
    note: "",
    crossRef: null,
    themes: ["separation", "healing", "ego"],
    watchHref: null
  },
  {
    title: "All That I Do",
    kind: "Lyric",
    meta: "Feivel Speaks · Written 2024",
    href: "/wayspace/writing/all-that-i-do",
    note: "",
    crossRef: null,
    themes: ["forgiveness", "the-work", "awakening"],
    watchHref: null
  },
  {
    title: "One More Time",
    kind: "Lyric",
    meta: "Feivel Speaks · Written 2024",
    href: "/wayspace/writing/one-more-time",
    note: "",
    crossRef: null,
    themes: ["healing", "love"],
    watchHref: null
  },
  {
    title: "Feivel Speaks",
    kind: "Lyric",
    meta: "Feivel Speaks · Written 2024",
    href: "/wayspace/writing/feivel-speaks",
    note: "",
    crossRef: null,
    themes: ["love", "healing", "awakening"],
    watchHref: null
  },
  {
    title: "Safe",
    kind: "Lyric",
    meta: "Feivel Speaks · Written 2024",
    href: "/wayspace/writing/safe",
    note: "",
    crossRef: null,
    themes: ["ego", "awakening", "healing"],
    watchHref: null
  },
  {
    title: "Poof!",
    kind: "Lyric",
    meta: "Feivel Speaks · Written 2024",
    href: "/wayspace/writing/poof",
    note: "",
    crossRef: null,
    themes: ["ego", "separation", "healing"],
    watchHref: null
  },
  {
    title: "Strawberry Sauce All The Same",
    kind: "Lyric",
    meta: "Written 2024",
    href: "/wayspace/writing/strawberry-sauce-all-the-same",
    note: "",
    crossRef: null,
    themes: ["separation", "awakening", "forgiveness"],
    watchHref: null
  },
  {
    title: "Choose Again",
    kind: "Lyric",
    meta: "Written 2024",
    href: "/wayspace/writing/choose-again",
    note: "",
    crossRef: null,
    themes: ["forgiveness", "separation", "awakening", "surrender"],
    watchHref: null
  },
  {
    title: "The End",
    kind: "Lyric",
    meta: "Released 2023",
    href: "/wayspace/writing/the-end",
    note: "",
    crossRef: null,
    themes: ["healing", "separation"],
    watchHref: null
  },
  {
    title: "What Have I Done?",
    kind: "Lyric",
    meta: "Wayspace · 2022 · Track 4",
    href: "/wayspace/writing/what-have-i-done",
    note: "",
    crossRef: null,
    themes: ["forgiveness", "healing"],
    watchHref: null
  },
  {
    title: "Welcome Back",
    kind: "Lyric",
    meta: "Wayspace · 2022 · Track 1",
    href: "/wayspace/writing/welcome-back",
    note: "",
    crossRef: null,
    themes: ["separation", "awakening"],
    watchHref: null
  },
  {
    title: "Try",
    kind: "Lyric",
    meta: "Wayspace · 2022 · Track 10",
    href: "/wayspace/writing/try",
    note: "",
    crossRef: null,
    themes: ["surrender", "the-work"],
    watchHref: null
  },
  {
    title: "Somewhere Somehow",
    kind: "Lyric",
    meta: "Wayspace · 2022 · Track 12",
    href: "/wayspace/writing/somewhere-somehow",
    note: "",
    crossRef: null,
    themes: ["surrender", "separation"],
    watchHref: null
  },
  {
    title: "Salt",
    kind: "Lyric",
    meta: "Wayspace · 2022 · Track 6",
    href: "/wayspace/writing/salt",
    note: "",
    crossRef: null,
    themes: ["healing", "forgiveness"],
    watchHref: null
  },
  {
    title: "Little Things",
    kind: "Lyric",
    meta: "Wayspace · 2022 · Track 7",
    href: "/wayspace/writing/little-things",
    note: "",
    crossRef: null,
    themes: ["ego", "awakening"],
    watchHref: null
  },
  {
    title: "How It Ends",
    kind: "Lyric",
    meta: "Wayspace · 2022 · Track 2",
    href: "/wayspace/writing/how-it-ends",
    note: "",
    crossRef: null,
    themes: ["awakening", "separation"],
    watchHref: null
  },
  {
    title: "Grow",
    kind: "Lyric",
    meta: "Wayspace · 2022 · Track 8",
    href: "/wayspace/writing/grow",
    note: "",
    crossRef: null,
    themes: ["awakening", "love", "surrender"],
    watchHref: null
  },
  {
    title: "Extra",
    kind: "Lyric",
    meta: "Wayspace · 2022 · Track 3",
    href: "/wayspace/writing/extra",
    note: "",
    crossRef: null,
    themes: ["healing", "ego"],
    watchHref: null
  },
  {
    title: "Did You Forget?",
    kind: "Lyric",
    meta: "Wayspace · 2022 · Track 5",
    href: "/wayspace/writing/did-you-forget",
    note: "",
    crossRef: null,
    themes: ["awakening", "separation"],
    watchHref: null
  },
  {
    title: "Body & The Beast",
    kind: "Lyric",
    meta: "Wayspace · 2022 · Track 9",
    href: "/wayspace/writing/body-and-the-beast",
    note: "",
    crossRef: null,
    themes: ["healing", "love"],
    watchHref: null
  },
  {
    title: "All In My Head",
    kind: "Lyric",
    meta: "Wayspace · 2022 · Track 11",
    href: "/wayspace/writing/all-in-my-head",
    note: "",
    crossRef: null,
    themes: ["forgiveness", "ego", "awakening"],
    watchHref: null
  },
  {
    title: "Nova",
    kind: "Lyric",
    meta: "Written 2021",
    href: "/wayspace/writing/nova",
    note: "",
    crossRef: null,
    themes: ["forgiveness", "separation", "the-work"],
    watchHref: null
  },
  {
    title: "\"Safe n Sound\"",
    kind: "Lyric",
    meta: "Released 2021",
    href: "/wayspace/writing/safe-n-sound",
    note: "",
    crossRef: null,
    themes: ["surrender", "healing"],
    watchHref: null
  },
  {
    title: "\"Round n Round\"",
    kind: "Lyric",
    meta: "Released 2021",
    href: "/wayspace/writing/round-n-round",
    note: "",
    crossRef: null,
    themes: ["healing", "ego"],
    watchHref: null
  },
  {
    title: "\"Do You Hear That?\"",
    kind: "Lyric",
    meta: "Released 2021",
    href: "/wayspace/writing/do-you-hear-that",
    note: "",
    crossRef: null,
    themes: ["awakening", "separation"],
    watchHref: null
  },
  {
    title: "\"Clarity\"",
    kind: "Lyric",
    meta: "Released 2021",
    href: "/wayspace/writing/clarity",
    note: "",
    crossRef: null,
    themes: ["love", "ego"],
    watchHref: null
  },
  {
    title: "\"I was built for this place\"",
    kind: "Lyric",
    meta: "Released 2021",
    href: "/wayspace/writing/i-was-built-for-this-place",
    note: "",
    crossRef: null,
    themes: ["awakening", "surrender"],
    watchHref: null
  },
  {
    title: "Doorway",
    kind: "Lyric",
    meta: "Written 2021",
    href: "/wayspace/writing/doorway",
    note: "",
    crossRef: null,
    themes: ["ego", "surrender"],
    watchHref: null
  },
  {
    title: "Quit",
    kind: "Lyric",
    meta: "Released 2020",
    href: "/wayspace/writing/quit",
    note: "",
    crossRef: null,
    themes: ["surrender", "ego"],
    watchHref: null
  },
  {
    title: "Offering",
    kind: "Lyric",
    meta: "Released 2020",
    href: "/wayspace/writing/offering",
    note: "",
    crossRef: null,
    themes: ["surrender", "awakening"],
    watchHref: null
  },
  {
    title: "Feathers",
    kind: "Lyric",
    meta: "Written 2020",
    href: "/wayspace/writing/feathers",
    note: "",
    crossRef: null,
    themes: ["surrender", "awakening"],
    watchHref: null
  },
  {
    title: "Puddles",
    kind: "Lyric",
    meta: "Released 2020",
    href: "/wayspace/writing/puddles",
    note: "",
    crossRef: null,
    themes: ["love", "healing"],
    watchHref: null
  },
  {
    title: "Our Boy",
    kind: "Lyric",
    meta: "Released 2020",
    href: "/wayspace/writing/our-boy",
    note: "",
    crossRef: null,
    themes: ["ego", "forgiveness"],
    watchHref: null
  },
  {
    title: "Only Human",
    kind: "Lyric",
    meta: "Released 2020",
    href: "/wayspace/writing/only-human",
    note: "",
    crossRef: null,
    themes: ["healing", "love"],
    watchHref: null
  },
  {
    title: "I Hope You'll Change",
    kind: "Lyric",
    meta: "Released 2020",
    href: "/wayspace/writing/i-hope-youll-change",
    note: "",
    crossRef: null,
    themes: ["love", "ego"],
    watchHref: null
  },
  {
    title: "Don't Mind",
    kind: "Lyric",
    meta: "Released 2020",
    href: "/wayspace/writing/dont-mind",
    note: "",
    crossRef: null,
    themes: ["love", "healing"],
    watchHref: null
  },
  {
    title: "Bleed",
    kind: "Lyric",
    meta: "Released 2020",
    href: "/wayspace/writing/bleed",
    note: "",
    crossRef: null,
    themes: ["ego", "love"],
    watchHref: null
  },
  {
    title: "Surf",
    kind: "Lyric",
    meta: "Written 2020",
    href: "/wayspace/writing/surf",
    note: "",
    crossRef: null,
    themes: ["surrender", "awakening"],
    watchHref: null
  },
  {
    title: "Spent The Night",
    kind: "Lyric",
    meta: "Written 2020",
    href: "/wayspace/writing/spent-the-night",
    note: "",
    crossRef: null,
    themes: ["surrender", "awakening"],
    watchHref: null
  },
  {
    title: "Jump",
    kind: "Lyric",
    meta: "Written 2020",
    href: "/wayspace/writing/jump",
    note: "",
    crossRef: null,
    themes: ["awakening", "healing"],
    watchHref: null
  },
  {
    title: "\"Places\"",
    kind: "Lyric",
    meta: "Released 2019",
    href: "/wayspace/writing/places",
    note: "",
    crossRef: null,
    themes: ["love", "separation"],
    watchHref: null
  },
  {
    title: "Headed Home",
    kind: "Lyric",
    meta: "Released 2019",
    href: "/wayspace/writing/headed-home",
    note: "",
    crossRef: null,
    themes: ["separation", "healing", "love"],
    watchHref: null
  },
  {
    title: "Way Out",
    kind: "Lyric",
    meta: "Released 2019",
    href: "/wayspace/writing/way-out",
    note: "",
    crossRef: null,
    themes: ["ego", "surrender"],
    watchHref: null
  },
  {
    title: "Sometimes",
    kind: "Lyric",
    meta: "Released 2019",
    href: "/wayspace/writing/sometimes",
    note: "",
    crossRef: null,
    themes: ["healing", "love"],
    watchHref: null
  },
  {
    title: "Probably",
    kind: "Lyric",
    meta: "Released 2019",
    href: "/wayspace/writing/probably",
    note: "",
    crossRef: null,
    themes: ["love", "healing"],
    watchHref: null
  },
  {
    title: "Its Not Enough",
    kind: "Lyric",
    meta: "Released 2019",
    href: "/wayspace/writing/its-not-enough",
    note: "",
    crossRef: null,
    themes: ["healing", "love"],
    watchHref: null
  },
  {
    title: "I Wonder",
    kind: "Lyric",
    meta: "Released 2019",
    href: "/wayspace/writing/i-wonder",
    note: "",
    crossRef: null,
    themes: ["love", "ego"],
    watchHref: null
  },
  {
    title: "Easy",
    kind: "Lyric",
    meta: "Released 2019",
    href: "/wayspace/writing/easy",
    note: "",
    crossRef: null,
    themes: ["surrender", "healing"],
    watchHref: null
  },
  {
    title: "Drive",
    kind: "Lyric",
    meta: "Released 2019",
    href: "/wayspace/writing/drive",
    note: "",
    crossRef: null,
    themes: ["ego", "healing"],
    watchHref: null
  },
  {
    title: "You are safe with me",
    anchor: "you-are-safe-with-me",
    kind: "Short",
    meta: "Short video · 2023",
    href: null,
    note: "",
    crossRef: null,
    themes: ["love", "healing"],
    watchHref: "https://www.youtube.com/shorts/R5sqonZ1TJo"
  },
  {
    title: "Your healing will heal others effortlessly",
    anchor: "your-healing-will-heal-others-effortlessly",
    kind: "Short",
    meta: "Short video · 2023",
    href: null,
    note: "",
    crossRef: null,
    themes: ["healing", "love"],
    watchHref: "https://www.youtube.com/shorts/tI53UfuMBRw"
  },
  {
    title: "How to remind yourself that you are safe",
    anchor: "how-to-remind-yourself-that-you-are-safe",
    kind: "Short",
    meta: "Short video · 2023",
    href: null,
    note: "",
    crossRef: null,
    themes: ["healing", "surrender"],
    watchHref: "https://www.youtube.com/shorts/g2j0KVgxiSI"
  },
  {
    title: "How to forgive someone",
    anchor: "how-to-forgive-someone",
    kind: "Short",
    meta: "Short video · 2023",
    href: null,
    note: "",
    crossRef: null,
    themes: ["forgiveness"],
    watchHref: "https://www.youtube.com/shorts/3bcM5qqiSk0"
  },
  {
    title: "Why community is so important",
    anchor: "why-community-is-so-important",
    kind: "Short",
    meta: "Short video · 2023",
    href: null,
    note: "",
    crossRef: null,
    themes: ["love", "healing"],
    watchHref: "https://www.youtube.com/shorts/H4anCmcUn4c"
  },
  {
    title: "Stop tinkering during meditation",
    anchor: "stop-tinkering-during-meditation",
    kind: "Short",
    meta: "Short video · 2023",
    href: null,
    note: "",
    crossRef: null,
    themes: ["surrender", "awakening"],
    watchHref: "https://www.youtube.com/shorts/31cCbUfNFUA"
  },
  {
    title: "One day you won’t need discipline",
    anchor: "one-day-you-won-t-need-discipline",
    kind: "Short",
    meta: "Short video · 2023",
    href: null,
    note: "",
    crossRef: null,
    themes: ["surrender", "the-work"],
    watchHref: "https://www.youtube.com/shorts/nmjMIbqmzAM"
  },
  {
    title: "Make time your friend",
    anchor: "make-time-your-friend",
    kind: "Short",
    meta: "Short video · 2023",
    href: null,
    note: "",
    crossRef: null,
    themes: ["surrender", "awakening"],
    watchHref: "https://www.youtube.com/shorts/_C-b1dG-2EM"
  },
  {
    title: "When should you take advice?",
    anchor: "when-should-you-take-advice",
    kind: "Short",
    meta: "Short video · 2023",
    href: null,
    note: "",
    crossRef: null,
    themes: ["ego", "surrender"],
    watchHref: "https://www.youtube.com/shorts/81ZxYg-XmVA"
  },
  {
    title: "This is devotional non-duality",
    anchor: "this-is-devotional-non-duality",
    kind: "Short",
    meta: "Short video · 2023",
    href: null,
    note: "",
    crossRef: null,
    themes: ["awakening", "surrender"],
    watchHref: "https://www.youtube.com/shorts/SCm2mkMisck"
  },
  {
    title: "How your keys are inside you",
    anchor: "how-your-keys-are-inside-you",
    kind: "Short",
    meta: "Short video · 2023",
    href: null,
    note: "",
    crossRef: null,
    themes: ["awakening", "ego"],
    watchHref: "https://www.youtube.com/shorts/k4ifKXOWTXc"
  },
  {
    title: "How to handle the gross parts of yourself",
    anchor: "how-to-handle-the-gross-parts-of-yourself",
    kind: "Short",
    meta: "Short video · 2023",
    href: null,
    note: "",
    crossRef: null,
    themes: ["forgiveness", "healing"],
    watchHref: "https://www.youtube.com/shorts/_EsHj3HlCeg"
  },
  {
    title: "This is what you deserve",
    anchor: "this-is-what-you-deserve",
    kind: "Short",
    meta: "Short video · 2023",
    href: null,
    note: "",
    crossRef: null,
    themes: ["love", "forgiveness"],
    watchHref: "https://www.youtube.com/shorts/ikOiO346Gw8"
  },
  {
    title: "A poem just for you",
    anchor: "a-poem-just-for-you",
    kind: "Short",
    meta: "Short video · 2023",
    href: null,
    note: "",
    crossRef: null,
    themes: ["love", "the-work"],
    watchHref: "https://www.youtube.com/shorts/a71z3AvlQN0"
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
  /* Escaped unless the entry opts out. One cross reference needs an
     italic word inside it, "Also in Production", and escaping is the
     right default for everything else: this text is authored in the
     arrays above, but a rule that only holds while nobody pastes a
     title with an ampersand in it is not a rule. */
  const text = item.crossRef.html
    ? item.crossRef.text
    : escapeHtml(item.crossRef.text);
  return `<p class="crossref"><a href="${escapeHtml(item.crossRef.href)}">${text}</a></p>`;
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
   room's color. */
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

  /* Play is the room's own player: it loads the release into the bar
     at the bottom and never leaves the page. Twelve cards do not get
     one, because there is nothing on SoundCloud to load. A disabled
     button stood here before and made those cards look broken.

     Stream on Spotify is the way out, and every card carries one. That
     is the difference between the two controls, and it is why they are
     both here rather than one standing in for the other: hearing a
     track in the room and going to where the plays count are different
     things a visitor might want.

     An album says so on the button. "Play album" sets the expectation
     that pressing it starts a sequence rather than one song, which is
     the one thing a visitor cannot tell from a cover. */
  const play = item.sc
    ? `<button class="play-btn" data-sc-id="${escapeHtml(item.sc.id)}" data-sc-kind="${escapeHtml(item.sc.kind)}" data-title="${escapeHtml(item.sc.title)}">${item.sc.kind === "playlist" ? "Play album" : "Play"}</button>`
    : "";

  /* One label on every card, "Stream on Spotify", per Jack 2026-09-15.
     It used to be "Listen" alone and "Spotify" beside a Play button.
     "Listen" was the wrong verb: Play is also listening, and the
     difference between the two controls is that this one leaves the
     room for the service where plays count. The verb says what
     happens and the name says where, so the label reads the same
     whether or not Play is standing next to it. */
  const listen = item.streams.length
    ? `<a class="listen-btn" href="${escapeHtml(item.streams[0].href)}" target="_blank" rel="noopener">Stream on Spotify</a>`
    : "";

  return `
    <li class="work-card" id="${escapeHtml(item.anchor)}">
      ${cover}
      <div class="work-body">
        ${placeholderFlag(item)}
        <h3 class="work-title">${escapeHtml(item.title)}</h3>
        <p class="work-meta">${escapeHtml(item.format)} &middot; ${escapeHtml(item.year)}</p>
        <div class="work-foot">
          ${play}
          ${listen}
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
  /* The card takes the video's own shape. Sixteen by nine unless the
     entry says otherwise, and the one that says otherwise is In My
     Head, which is square. Per Jack on 2026-08-23: a square video sat
     pillarboxed in a wide box, so the thumbnail and the player
     disagreed about what they were showing. The text below simply
     moves down to accommodate, because the card is a column. */
  const ratio = item.ratio || "16 / 9";
  /* The intrinsic size hint has to agree with the box, or the browser
     reserves the wrong height and the grid shifts as thumbnails load. */
  const [rw, rh] = ratio.split("/").map(n => parseFloat(n));
  const imgW = 640;
  const imgH = Math.round(imgW * rh / rw);
  const facade = item.youtubeId
    ? `<button class="facade" style="--facade-ratio: ${escapeHtml(ratio)}" data-yt="${escapeHtml(item.youtubeId)}" aria-label="Play ${escapeHtml(item.title)}">
         <img src="${escapeHtml(item.thumb)}" alt="" loading="lazy" width="${imgW}" height="${imgH}">
         <span class="facade-play" aria-hidden="true">&#9654;</span>
       </button>`
    : placeholderTile("facade", "Video");

  return `
    <li class="work-card" id="${escapeHtml(item.anchor)}">
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

/* A poster is portrait and a wordmark is wide. Both would be cut by
   the 1:1 crop every other room's cover uses, so an item can ask to be
   contained instead. The box stays square either way, which is what
   keeps the grid a grid. */
function designCard(item) {
  const fit = item.fit === "contain" ? " is-contain" : "";
  const art = item.image
    ? `<img class="work-cover${fit}" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}" loading="lazy" width="600" height="600">`
    : placeholderTile("work-cover", "Artwork");

  return `
    <li class="work-card" id="${escapeHtml(item.anchor)}">
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

/* ---- The tool pack tiles ----
   A real <button>, because activating one changes this page rather
   than going anywhere. The <video> ships with no src at all: putting
   the file in a data attribute and assigning it on first activation
   is what makes preload="none" honest. A src set in markup still
   costs a request on some browsers even when preload says otherwise.

   muted is on the element rather than left to script, per Jack on
   2026-08-23: the clips have their own audio and six of them talking
   at once would bury the thing you came to look at.

   The still underneath is what a visitor sees until they ask for
   more, and it is what they see again the moment they leave. alt is
   empty because the name and the quality are printed directly below
   in text a screen reader already reaches. */
function toolTile(item) {
  return `
    <li class="tool">
      <button class="tool-tile" type="button"
              data-clip="/assets/video/tools/${escapeHtml(item.slug)}.mp4"
              aria-label="Play the ${escapeHtml(item.title)} animation">
        <img class="tool-still" src="/assets/img/wayspace/design/tools/${escapeHtml(item.slug)}.jpg"
             alt="" loading="lazy" width="640" height="640">
        <video class="tool-clip" muted loop playsinline preload="none"
               aria-hidden="true" tabindex="-1"></video>
      </button>
      <p class="tool-name">${escapeHtml(item.title)}</p>
      <p class="tool-quality">${escapeHtml(item.quality)}</p>
    </li>
  `;
}

/* Each single cover is a doorway to its lyric page, which is why this
   is an <a> and the tool tile is a <button>. Same room, two different
   jobs, and the element says which. */
function singleCover(item) {
  return `
    <li class="single">
      <a class="single-link" href="/wayspace/writing/${escapeHtml(item.slug)}">
        <img class="single-cover" src="/assets/img/wayspace/design/singles/${escapeHtml(item.slug)}.jpg"
             alt="Cover art for ${escapeHtml(item.title)}" loading="lazy" width="640" height="640">
        <span class="single-title">${escapeHtml(item.title)}</span>
      </a>
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

  /* Watch and Listen are the same episode two ways, so Watch comes
     first: it is the one that happens here. Listen leaves for Apple,
     which is why it stays a link and stays black. */
  const watch = item.watchId
    ? `<button class="watch-btn" type="button" data-video="${escapeHtml(item.watchId)}" data-ratio="16 / 9" data-video-title="${escapeHtml(item.title)}">Watch</button>`
    : "";

  return `
    <li class="entry" id="${escapeHtml(item.anchor)}">
      ${art}
      <div class="entry-body">
        ${placeholderFlag(item)}
        <span class="role-tag">${escapeHtml(item.role)}</span>
        <h3 class="entry-title">${escapeHtml(item.title)}</h3>
        <p class="entry-meta">${escapeHtml(item.show)} &middot; ${escapeHtml(item.date)}</p>
        ${item.note ? `<p class="entry-note">${escapeHtml(item.note)}</p>` : ""}
        <div class="entry-actions">${watch}${listen}${crossRef(item)}</div>
      </div>
    </li>
  `;
}

function speakingEntry(item) {
  /* Watch prefers the modal, same as Podcasts. videoHref stays as the
     fallback for a recording that lives somewhere other than YouTube. */
  const start = Number.isFinite(item.watchStart) && item.watchStart > 0
    ? ` data-video-start="${item.watchStart}"`
    : "";
  const watch = item.watchId
    ? `<button class="watch-btn" type="button" data-video="${escapeHtml(item.watchId)}" data-ratio="16 / 9" data-video-title="${escapeHtml(item.title)}"${start}>Watch</button>`
    : item.videoHref
      ? `<a class="stream-link" href="${escapeHtml(item.videoHref)}" target="_blank" rel="noopener">Watch</a>`
      : "";

  return `
    <li class="entry"${item.anchor ? ` id="${escapeHtml(item.anchor)}"` : ""}>
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

/* ============================================================
   THE WRITING ROOM

   Seventy six entries, sixty two lyrics and fourteen shorts, spanning
   2019 to 2026. As one flat list that is a column you scroll rather
   than a room you navigate, which is what Jack asked to fix on
   2026-08-23.

   The shape now: filter by kind, jump by year, and a grid of cards
   grouped under a heading per year. The controls are built from the
   array rather than written into the page, so the counts and the year
   links cannot drift away from what is actually rendered.

   Filtering hides cards with a class rather than re-rendering, so a
   year heading whose cards are all hidden has to be hidden too, or
   the page fills with empty years. That is the one non obvious part.
   ============================================================ */

/* Album membership comes from the existing explicit catalogue metadata. */
const WRITING_COLLECTIONS = [
  { slug: "wayspace", label: "Wayspace", prefix: "Wayspace ·" },
  { slug: "feivel-speaks", label: "Feivel Speaks", prefix: "Feivel Speaks ·" }
];

/* Undated entries sort last under their own heading. */
const NO_YEAR = "Undated";

function writingYear(item) {
  const m = String(item.meta || "").match(/(?:19|20)\d\d/);
  return m ? m[0] : NO_YEAR;
}

function writingCard(item) {
  /* A title is a link only when there is a page behind it. A link
     that goes nowhere is worse than plain text, because it promises
     something and then does not deliver it. */
  const title = item.href
    ? `<a href="${escapeHtml(item.href)}">${escapeHtml(item.title)}</a>`
    : escapeHtml(item.title);

  /* A short has no page of its own, because the piece is the video
     rather than a text with a video attached.

     It opens over the page rather than in a new window, per Jack on
     2026-08-23, which is why this is a button and not a link: it
     changes this page instead of going anywhere. js/video-modal.js
     picks it up from data-video. Shorts are portrait, hence the
     ratio; without it a 9:16 video sits letterboxed in a 16:9 box.

     The id comes off watchHref rather than being stored twice, so the
     array keeps one field and it stays the canonical link. */
  const shortId = item.watchHref
    ? (item.watchHref.match(/(?:shorts\/|v=|youtu\.be\/)([A-Za-z0-9_-]{6,})/) || [])[1]
    : null;
  const watch = shortId
    ? `<button class="listen-btn" type="button" data-video="${escapeHtml(shortId)}" data-ratio="9 / 16" data-video-title="${escapeHtml(item.title)}">Watch</button>`
    : "";

  /* Themes on the card as well as in the filter, per Jack. A filtered
     result otherwise gives no clue why each song is in it, and the
     vocabulary is learned by seeing it rather than by being explained.
     Labels come from THEMES so a tag cannot disagree with a button. */
  const themes = (item.themes || []).length
    ? `<ul class="theme-tags">${item.themes.map(t => {
        const def = THEMES.find(x => x.slug === t);
        return `<li class="theme-tag" data-theme="${escapeHtml(t)}">${escapeHtml(def ? def.label : t)}</li>`;
      }).join("")}</ul>`
    : "";

  return `
    <li class="writing-card"${item.anchor ? ` id="${escapeHtml(item.anchor)}"` : ""} data-collection="${escapeHtml((WRITING_COLLECTIONS.find(c => item.meta.startsWith(c.prefix)) || {}).slug || "")}" data-kind="${escapeHtml(item.kind)}" data-themes="${escapeHtml((item.themes || []).join(" "))}">
      ${placeholderFlag(item)}
      <span class="role-tag">${escapeHtml(item.kind)}</span>
      <h4 class="writing-card-title">${title}</h4>
      <p class="writing-card-meta">${escapeHtml(item.meta)}</p>
      ${themes}
      ${item.note ? `<p class="entry-note">${escapeHtml(item.note)}</p>` : ""}
      ${watch || crossRef(item) ? `<div class="entry-actions">${watch}${crossRef(item)}</div>` : ""}
    </li>
  `;
}

function initWriting() {
  const mount = document.getElementById("writingList");
  if (!mount) return;

  const filters = document.getElementById("writingFilters");
  const themeBar = document.getElementById("writingThemes");
  const collections = document.getElementById("writingCollections");
  const yearNav = document.getElementById("writingYears");
  const status = document.getElementById("writingStatus");
  const empty = document.getElementById("writingEmpty");

  if (!WRITING.length) {
    emptyState(mount, "Nothing here yet.",
      ["Lyrics and prose will live in this room."]);
    return;
  }

  /* Group by year, newest first, undated last. */
  const groups = new Map();
  WRITING.forEach(item => {
    const y = writingYear(item);
    if (!groups.has(y)) groups.set(y, []);
    groups.get(y).push(item);
  });
  const years = [...groups.keys()].sort((a, b) => {
    if (a === NO_YEAR) return 1;
    if (b === NO_YEAR) return -1;
    return Number(b) - Number(a);
  });

  mount.innerHTML = years.map(y => `
    <section class="writing-year" id="year-${escapeHtml(y)}" aria-labelledby="year-h-${escapeHtml(y)}">
      <h3 class="writing-year-title" id="year-h-${escapeHtml(y)}">${escapeHtml(y)}</h3>
      <ul class="writing-grid">${groups.get(y).map(writingCard).join("")}</ul>
    </section>
  `).join("");

  /* Kinds in the order they first appear, so the buttons follow the
     array rather than an alphabet nobody asked for. */
  const kinds = [];
  WRITING.forEach(i => { if (!kinds.includes(i.kind)) kinds.push(i.kind); });

  const label = k => k === "Lyric" ? "Lyrics" : k === "Short" ? "Shorts" : k;
  const count = k => k === "all" ? WRITING.length : WRITING.filter(i => i.kind === k).length;

  filters.innerHTML = ["all", ...kinds].map((k, n) => `
    <button class="filter-btn${n === 0 ? " is-on" : ""}" type="button"
            data-filter="${escapeHtml(k)}" aria-pressed="${n === 0}">
      ${k === "all" ? "All" : escapeHtml(label(k))}
      <span class="filter-count">${count(k)}</span>
    </button>
  `).join("");

  /* THE THEME ROW.
     Multi-select, and selections widen rather than narrow: picking
     Forgiveness and Healing shows everything touching either. Per Jack
     on 2026-08-24. Forgiving of a reader who does not know the
     vocabulary, and it can never return nothing on its own.

     Kind and theme compose, though, so Shorts plus a theme no short
     carries genuinely can return nothing. That is what the empty state
     below exists for. */
  const themeCount = t => WRITING.filter(i => (i.themes || []).includes(t)).length;

  themeBar.innerHTML = THEMES.map(t => `
    <button class="theme-btn" type="button" data-theme="${escapeHtml(t.slug)}" aria-pressed="false">
      ${escapeHtml(t.label)}
      <span class="filter-count">${themeCount(t.slug)}</span>
    </button>
  `).join("") + `
    <button class="theme-clear" type="button" hidden>Clear themes</button>`;

  const clearBtn = themeBar.querySelector(".theme-clear");

  let kind = "all";
  let picked = new Set();
  const requestedCollection = new URLSearchParams(location.search).get("collection");
  let collection = WRITING_COLLECTIONS.some(c => c.slug === requestedCollection)
    ? requestedCollection : "all";
  collections.innerHTML = `<span class="filter-label ws-overline">Album lyrics:</span>` +
    [{ slug: "all", label: "All writing" }, ...WRITING_COLLECTIONS].map(c =>
      `<button type="button" class="filter-btn" data-collection="${c.slug}" aria-pressed="false">${escapeHtml(c.label)}</button>`).join("");

  function drawCollections() {
    collections.querySelectorAll("button").forEach(btn => {
      const on = btn.dataset.collection === collection;
      btn.classList.toggle("is-on", on);
      btn.setAttribute("aria-pressed", String(on));
    });
  }
  collections.addEventListener("click", e => {
    const btn = e.target.closest("button[data-collection]");
    if (!btn) return;
    collection = btn.dataset.collection;
    const url = new URL(location.href);
    if (collection === "all") url.searchParams.delete("collection");
    else url.searchParams.set("collection", collection);
    history.replaceState(null, "", url);
    apply();
  });

  function matches(card) {
    if (collection !== "all" && card.dataset.collection !== collection) return false;
    if (kind !== "all" && card.dataset.kind !== kind) return false;
    if (!picked.size) return true;
    const has = (card.dataset.themes || "").split(" ");
    return [...picked].some(t => has.includes(t));
  }

  function drawYears() {
    const live = years.filter(y =>
      [...mount.querySelectorAll(`#year-${CSS.escape(y)} .writing-card`)]
        .some(c => !c.hidden));
    yearNav.innerHTML = live.map(y =>
      `<a class="year-link" href="#year-${escapeHtml(y)}">${escapeHtml(y)}</a>`).join("");
  }

  function apply() {
    drawCollections();
    let shown = 0;
    [...mount.querySelectorAll(".writing-card")].forEach(card => {
      const on = matches(card);
      card.hidden = !on;
      if (on) shown++;
    });

    /* A year whose cards are all hidden has to go too, or the page
       fills with headings over nothing. */
    [...mount.querySelectorAll(".writing-year")].forEach(sec => {
      sec.hidden = ![...sec.querySelectorAll(".writing-card")].some(c => !c.hidden);
    });

    empty.hidden = shown > 0;
    clearBtn.hidden = picked.size === 0;
    drawYears();

    const names = [...picked].map(t => (THEMES.find(x => x.slug === t) || {}).label).filter(Boolean);
    const what = kind === "all" ? "entries" : label(kind).toLowerCase();
    const album = WRITING_COLLECTIONS.find(c => c.slug === collection);
    const scope = album ? ` from ${album.label}` : "";
    status.textContent = !shown
      ? `No ${what}${scope} match these filters.`
      : names.length
        ? `Showing ${shown} ${what}${scope} in ${names.join(" or ")}.`
        : `Showing ${shown} ${what}${scope}.`;
  }
  apply();

  filters.addEventListener("click", (e) => {
    const btn = e.target.closest(".filter-btn");
    if (!btn) return;
    kind = btn.dataset.filter;
    [...filters.querySelectorAll(".filter-btn")].forEach(b => {
      const on = b === btn;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", String(on));
    });
    apply();
  });

  themeBar.addEventListener("click", (e) => {
    if (e.target.closest(".theme-clear")) {
      picked.clear();
      [...themeBar.querySelectorAll(".theme-btn")].forEach(b => {
        b.classList.remove("is-on");
        b.setAttribute("aria-pressed", "false");
      });
      apply();
      return;
    }
    const btn = e.target.closest(".theme-btn");
    if (!btn) return;
    const t = btn.dataset.theme;
    const on = !picked.has(t);
    if (on) picked.add(t); else picked.delete(t);
    btn.classList.toggle("is-on", on);
    btn.setAttribute("aria-pressed", String(on));
    apply();
  });
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
   THE MUSIC ROOM'S PLAYER

   One player for the whole room. Every cover is a remote control for
   it, so two releases can never play over each other.

   It lives in this room and nowhere else. A bar that survives
   navigation is impossible across six real pages, so the answer is
   that audio never crosses one: Music owns this player, and each
   lyric page under Writing owns its own single track.

   WHAT CHANGED, 2026-08-23. This used to be a native <audio> element
   loading MP3s out of assets/audio/. Three files cost 20 MB, which is
   why only three of twenty cards had a Play button at all. It now
   drives a SoundCloud widget that is never shown, through the Widget
   API, so a release plays with no file in the repo and eight cards
   carry a button.

   The old note here said a custom transport should not be built
   against audio that does not exist yet. That reason expired: the
   catalogue is on SoundCloud now.

   THE FACADE HOLDS. Nothing is requested from soundcloud.com until
   someone presses Play, and that includes api.js itself, which is
   injected on the first press rather than shipped in the page head.

   WHY THE WIDGET IS HIDDEN RATHER THAN SHOWN. This room is a grid.
   Revealing a 166px player inside a grid cell either shoves the
   layout sideways or crushes the player into a space too small to
   use. The lyric pages are the opposite shape, one song in one
   column, and they show the real player on purpose. Considered for
   this treatment on 2026-08-23 and deliberately left alone.

   ATTRIBUTION IS PART OF THE DEAL, not decoration. SoundCloud's API
   terms require a clearly visible backlink from the sound to its page
   on soundcloud.com, and credit to SoundCloud as the source. The bar
   carries both, and the link follows whatever is playing.
   ============================================================ */

const SC_API = "https://w.soundcloud.com/player/api.js";

/* Read once so the widget URL is built the same way in both places.
   hide_related and show_teaser are what answer Jack's "no auto-play
   after": SoundCloud otherwise runs a related-tracks grid and an end
   card when a sound finishes. Same parameters js/lyric-audio.js uses. */
function scWidgetUrl(id, kind) {
  const p = new URLSearchParams({
    url: "https://api.soundcloud.com/" + (kind === "playlist" ? "playlists/" : "tracks/") + id,
    color: "#000000",
    auto_play: "true",
    hide_related: "true",
    show_comments: "false",
    show_user: "true",
    show_reposts: "false",
    show_teaser: "false",
    visual: "false"
  });
  return "https://w.soundcloud.com/player/?" + p;
}

function scTime(ms) {
  if (!isFinite(ms) || ms < 0) ms = 0;
  const t = Math.floor(ms / 1000);
  return Math.floor(t / 60) + ":" + String(t % 60).padStart(2, "0");
}

function initPlayer() {
  const grid = document.getElementById("musicGrid");
  const host = document.getElementById("scHost");
  const bar = document.getElementById("playerBar");
  if (!grid || !host || !bar) return;

  const now = document.getElementById("playerNow");
  const toggle = document.getElementById("playerToggle");
  const seek = document.getElementById("playerSeek");
  const time = document.getElementById("playerTime");
  const link = document.getElementById("playerLink");
  const skip = document.getElementById("playerSkip");

  let widget = null;      /* the SC.Widget handle, once api.js has loaded */
  let duration = 0;
  let scrubbing = false;  /* while true, PLAY_PROGRESS must not fight the thumb */
  let booting = false;    /* api.js is in flight; presses queue behind it */
  let live = false;       /* this frame has reached READY */
  let pending = null;     /* the press that arrived while it was */

  /* Injected on first press, not on page load. Resolves for every
     caller that arrives while it is still in flight, so pressing two
     cards quickly cannot load the script twice. */
  let apiLoading = null;
  function loadApi() {
    if (window.SC && window.SC.Widget) return Promise.resolve();
    if (apiLoading) return apiLoading;
    apiLoading = new Promise((resolve, reject) => {
      const el = document.createElement("script");
      el.src = SC_API;
      el.onload = resolve;
      el.onerror = reject;
      document.head.appendChild(el);
    });
    return apiLoading;
  }

  function setState(playing) {
    toggle.setAttribute("aria-pressed", playing ? "true" : "false");
    toggle.textContent = playing ? "Pause" : "Play";
  }

  function fail(message) {
    bar.classList.remove("is-loading");
    bar.classList.add("is-live");
    now.textContent = message;
    setState(false);
  }

  /* Called on PLAY and whenever a playlist advances. Asking the widget
     for the sound rather than trusting the button's label is what
     keeps an album's title and its backlink correct track by track. */
  function adopt() {
    widget.getCurrentSound((sound) => {
      if (!sound) return;
      now.textContent = sound.title;
      link.href = sound.permalink_url;
      link.hidden = false;
    });
    widget.getDuration((ms) => {
      duration = ms || 0;
      seek.max = String(duration);
      time.textContent = scTime(0) + " / " + scTime(duration);
    });
  }

  function bind() {
    const E = window.SC.Widget.Events;

    widget.bind(E.READY, () => {
      bar.classList.remove("is-loading");
      bar.classList.add("is-live");
      live = true;
      /* Adopt here as well as on PLAY. If a browser refuses the
         autoplay, PLAY never fires, and the backlink SoundCloud's
         terms require would never appear. */
      adopt();
      /* A press that landed while api.js was still downloading. */
      if (pending) { const p = pending; pending = null; start(p); }
    });

    widget.bind(E.PLAY, () => { setState(true); adopt(); });
    widget.bind(E.PAUSE, () => setState(false));
    widget.bind(E.FINISH, () => { setState(false); });

    widget.bind(E.PLAY_PROGRESS, (e) => {
      if (scrubbing) return;
      const ms = e.currentPosition || 0;
      seek.value = String(ms);
      time.textContent = scTime(ms) + " / " + scTime(duration);
    });

    /* Only report an error that actually stopped something. The
       widget emits ERROR during an ordinary load as well, and reacting
       to that put a failure message over a track that went on to play
       perfectly well. */
    widget.bind(E.ERROR, () => {
      if (!live) fail("That track would not load. Try Spotify instead.");
    });
  }

  /* EVERY PRESS BUILDS A FRESH IFRAME, and the old one is thrown away.

     The obvious design is one iframe reused across presses, swapping
     sounds with widget.load(). It was built that way first and it does
     not work: the first press plays, and every switch after it leaves
     the widget dead. Measured on 2026-08-23 across all three cases,
     track to album, album to track and track to track, and all three
     failed identically while a first press of any of them succeeded.

     Rebuilding costs a second iframe load per press. It buys back
     something worth having anyway: destroying the old frame is what
     stops the old audio, so two releases cannot overlap no matter what
     the widget does.

     api.js is fetched once and cached, so only the first press pays
     for it. */
  function build(url) {
    /* Drop the previous player before starting the next. This is the
       line that guarantees only one thing is ever playing. */
    host.replaceChildren();
    widget = null;
    live = false;
    bar.classList.add("is-loading");
    /* Cleared as well as set, so a widget that never comes alive
       cannot keep wearing the previous one's state. Leaving it on was
       what hid a dead player behind a bar that looked fine. */
    bar.classList.remove("is-live");

    const frame = document.createElement("iframe");
    frame.width = "320";
    frame.height = "166";
    frame.allow = "autoplay";
    frame.title = "SoundCloud player";
    frame.id = "scFrame";

    /* ORDER: src, then into the document, then attach, then bind. All
       four synchronous, and every step of it is load bearing.

       src first because SC.Widget reads it when it attaches and throws
       on an empty one.

       IN THE DOCUMENT BEFORE ATTACHING, which is the counterintuitive
       one. api.js looks up an existing widget by the iframe's
       contentWindow: `var c = g(v(e)); return c && c.instance ? ...`.
       A frame that is not in the document yet has a null
       contentWindow, and so does a frame that was just removed. Attach
       before appending and that lookup matches the destroyed frame's
       stale record and hands back the dead widget, so every bind after
       it goes nowhere. api.js never drops those records, so this gets
       worse with each press rather than failing once.

       There is no race in appending first. The iframe cannot load and
       post a message until this task finishes, and bind() runs inside
       it. The earlier READY miss came from an await between creating
       the frame and binding, not from the order of these two lines. */
    frame.src = url;
    host.appendChild(frame);
    widget = window.SC.Widget(frame);
    bind();
  }

  function start(btn) {
    const url = scWidgetUrl(btn.dataset.scId, btn.dataset.scKind);

    now.textContent = btn.dataset.title;
    skip.hidden = btn.dataset.scKind !== "playlist";
    link.hidden = true;
    seek.value = "0";
    duration = 0;
    time.textContent = "0:00 / 0:00";
    setState(false);

    /* API FIRST, THEN THE IFRAME. auto_play rides in the URL rather
       than being a play() call, so the widget starts itself rather
       than depending on a click gesture surviving a script load. */
    if (window.SC && window.SC.Widget) { build(url); return; }

    bar.classList.add("is-loading");
    booting = true;
    loadApi().then(() => {
      booting = false;
      build(url);
      if (pending) { const p = pending; pending = null; start(p); }
    }).catch(() => {
      booting = false;
      fail("The player could not load. Try Spotify instead.");
    });
  }

  grid.addEventListener("click", (e) => {
    const btn = e.target.closest(".play-btn");
    if (!btn) return;
    /* Pressed while api.js is still in flight: remember it and run it
       once the script lands. Only the most recent press is kept,
       because someone pressing three covers wants the third. */
    if (booting) { pending = btn; return; }
    start(btn);
  });

  toggle.addEventListener("click", () => { if (widget) widget.toggle(); });

  skip.addEventListener("click", (e) => {
    if (!widget) return;
    if (e.target.closest("[data-skip=\"next\"]")) widget.next();
    else if (e.target.closest("[data-skip=\"prev\"]")) widget.prev();
  });

  /* A range input rather than a styled div, so the scrubber is
     keyboard operable and screen reader labelled without any work.
     That is the one property the old native <audio> had that a
     hand-rolled transport usually loses. */
  seek.addEventListener("pointerdown", () => { scrubbing = true; });
  seek.addEventListener("keydown", () => { scrubbing = true; });
  seek.addEventListener("input", () => {
    time.textContent = scTime(Number(seek.value)) + " / " + scTime(duration);
  });
  seek.addEventListener("change", () => {
    scrubbing = false;
    if (widget) widget.seekTo(Number(seek.value));
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

    /* THE IFRAME GOES INSIDE A REPLACEMENT SHELL, not in place of the
       facade. Swapping the button for the iframe directly drops every
       rule the button carried: .facade sets the aspect ratio and
       .facade iframe fills it, and neither can match an iframe that is
       no longer inside a .facade. The card went from 334x188 to
       334x154 on play, which is an iframe at its default 150px height.
       Measured on 2026-08-24, on this page and in the Video room.

       A div rather than the button, because a button holding an iframe
       is invalid and would swallow the player's own controls. The
       inline ratio is carried across so a card that is not 16:9 keeps
       its shape through the swap. */
    const shell = document.createElement("div");
    shell.className = "facade is-playing";
    const ratio = facade.style.getPropertyValue("--facade-ratio");
    if (ratio) shell.style.setProperty("--facade-ratio", ratio);
    shell.appendChild(frame);

    facade.replaceWith(shell);
  });
}

/* ============================================================
   The tool pack clips

   Decided with Jack on 2026-08-23: hover on a desktop, tap on a
   phone, muted either way, and it plays where it sits rather than in
   a modal or behind a button covering the art.

   Where this sits against MOTION.md: that file bans scroll-linked
   motion before the cutover, and this is not that. A clip that starts
   because someone pointed at it is the reader asking, the same
   category as the Video room's facade. The version that would have
   crossed the line is the one that starts on its own when it scrolls
   into view, and that is deliberately not built. Jack was offered it
   and chose this.

   Three states worth naming, because each is a real device:
   - hover and a fine pointer: enter plays, leave pauses and rewinds
   - keyboard: focus is intent, so it behaves like hover
   - touch, or no hover: tap toggles, and it keeps playing until
     tapped again, because there is no "leave" event to catch

   Under prefers-reduced-motion nothing plays on hover or focus at
   all. The clip is still reachable by clicking, because the rule is
   that motion is never imposed, not that it is withheld.

   EXTENDED 2026-08-24 to the Wayspace album cover in the lineage
   above the tool row, same mechanic rather than a second copy of it.
   Delegated from .lineage, the shared ancestor of both, rather than
   from #toolRow specifically, so one set of listeners covers every
   .tool-tile in the section regardless of which step it is in. is-cover
   on the album's tile is a hook for CSS only; nothing here treats it
   differently from a tool tile. */
function initToolClips() {
  const row = document.querySelector(".lineage");
  if (!row) return;

  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* First activation is where the file is fetched. Until then the
     <video> has no source and costs nothing. */
  function start(tile) {
    const video = tile.querySelector(".tool-clip");
    if (!video) return;
    if (!video.getAttribute("src")) video.setAttribute("src", tile.dataset.clip);
    tile.classList.add("is-playing");
    video.play().catch(() => {
      /* Blocked or missing. The still is already showing, so the tile
         reads correctly with no clip. Drop back to it. */
      tile.classList.remove("is-playing");
    });
  }

  function stop(tile) {
    const video = tile.querySelector(".tool-clip");
    tile.classList.remove("is-playing");
    if (!video) return;
    video.pause();
    /* Rewind so the next hover opens on the same frame as the still,
       rather than resuming mid-gesture. */
    if (video.currentTime) video.currentTime = 0;
  }

  row.addEventListener("click", (e) => {
    const tile = e.target.closest(".tool-tile");
    if (!tile) return;
    tile.classList.contains("is-playing") ? stop(tile) : start(tile);
  });

  if (canHover && !calm) {
    row.addEventListener("mouseover", (e) => {
      const tile = e.target.closest(".tool-tile");
      if (tile && !tile.classList.contains("is-playing")) start(tile);
    });
    row.addEventListener("mouseout", (e) => {
      const tile = e.target.closest(".tool-tile");
      /* relatedTarget inside the same tile is a move between the
         still and the clip, not a departure. */
      if (tile && !tile.contains(e.relatedTarget)) stop(tile);
    });
    row.addEventListener("focusin", (e) => {
      const tile = e.target.closest(".tool-tile");
      if (tile) start(tile);
    });
    row.addEventListener("focusout", (e) => {
      const tile = e.target.closest(".tool-tile");
      if (tile && !tile.contains(e.relatedTarget)) stop(tile);
    });
  }
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

  /* Design's two lineage rows, rendered before its grid. They mount
     into the narrative section rather than the work section, so an
     empty state here would be wrong: the story is the page, and a
     story missing its middle is a bug, not a sparse room. */
  renderRoom("toolRow", TOOLS, toolTile, "", []);
  renderRoom("singlesRow", SINGLES, singleCover, "", []);

  renderRoom("designGrid", DESIGN, designCard,
    "No design here yet",
    ["Logos, flyers, covers, and the design system itself all land here."]);

  renderRoom("podcastList", PODCASTS, podcastEntry,
    "No episodes here yet",
    ["Shows Jack hosts and produces land here."]);

  renderRoom("speakingList", SPEAKING, speakingEntry,
    "No talks here yet",
    ["Talks and hosted events land here."]);

  /* Writing does not use renderRoom: it groups by year and draws its
     own filters, so it owns its whole mount. */
  initWriting();

  initPlayer();
  initFacades();
  initToolClips();
});
