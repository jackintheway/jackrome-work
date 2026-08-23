/* ============================================================
   PRODUCTION

   The client work on /production, rendered from one array through
   pure functions. Adding a piece is adding an object here, never
   editing markup in production.html.

   WHY EVERY ENTRY CARRIES `roles`
   Per Jack, on every hosted piece below he was also running the tech
   check with guests beforehand, recording it, and editing it
   afterwards. On the 50th anniversary livestream that included
   cutting montages from submitted footage across five and a half
   hours. A card that said only "Interview with Jon Mundy" would
   describe about a quarter of the job.

   So breadth gets shown rather than claimed. The page never asserts
   that Jack covers a project end to end. Ten cards each carrying
   three or four roles make that argument on their own, which is the
   difference between proof and a boast.

   Roles come from a small fixed vocabulary so the tags stay
   scannable down the page: Hosting, Tech direction, Recording,
   Filming, Editing, Website, Teaching.

   TWO SHAPES, ON PURPOSE
   Most entries are video and use the facade: a static thumbnail
   ships, and YouTube is contacted only when someone clicks. Two are
   not video at all (a podcast that lives on Spotify, a client site
   that is simply live on the web). Those get a solid `tile` naming
   the medium instead, so the grid keeps its rhythm and links out
   through `externalUrl`. Client work is not all video and the page
   should not pretend otherwise.

   TITLES are the real published titles, pulled from YouTube's oembed
   endpoint rather than written from filenames, so they match what a
   visitor sees when they arrive.
   ============================================================ */
const WORK = [
  {
    title: "Light The World: Celebrating 50 Years of A Course in Miracles",
    client: "Foundation for Inner Peace",
    clientUrl: "https://acim.org",
    meta: "Livestream celebration, October 2025, 5.5 hours",
    roles: ["Hosting", "Tech direction", "Recording", "Editing"],
    thumb: "/assets/img/production/fip-celebration.jpg",
    youtubeId: "ntcikZDwRhE",
    note: "A full day of live programming, including montages cut from video submitted by viewers around the world."
  },
  {
    title: "What Does It Mean to Be Truly Helpful? with Jon Mundy, Ph.D.",
    client: "Foundation for Inner Peace",
    clientUrl: "https://acim.org",
    meta: "Interview, April 2026",
    roles: ["Hosting", "Tech direction", "Recording", "Editing"],
    thumb: "/assets/img/production/jon-mundy-fip.jpg",
    youtubeId: "T46ZcGmdbn4",
    note: ""
  },
  {
    title: "Meet The Speaker: Loch Kelly",
    client: "Center for Awakening",
    clientUrl: null,
    meta: "Interview, 2024",
    roles: ["Hosting", "Tech direction", "Recording", "Editing"],
    thumb: "/assets/img/production/loch-kelly.jpg",
    youtubeId: "L5fvkzVFvvc",
    note: ""
  },
  {
    title: "Interview with the Awakening Mind film makers",
    client: "Awakening Mind Films",
    clientUrl: null,
    meta: "Panel interview, 2024, three guests",
    roles: ["Hosting", "Tech direction", "Recording", "Editing"],
    thumb: "/assets/img/production/awakening-mind-films.jpg",
    youtubeId: "yDMLz98yCPE",
    note: "Bill Free, Leif Heimbold and Daniel Schmidt, on one call."
  },
  {
    title: "Crossing the Bridge",
    client: "Tribly",
    clientUrl: null,
    meta: "Podcast series, 2023",
    roles: ["Hosting", "Recording", "Editing"],
    /* Square cover art, not a 16:9 still. It sits contained on a dark
       ground rather than cropped to fill: a centre crop would cut the
       "powered by Tribly" line off the bottom, and a sleeve shown whole
       reads as a podcast rather than as a video that failed to load. */
    thumb: null,
    youtubeId: null,
    tile: "Podcast",
    tileArt: "/assets/img/production/crossing-the-bridge.jpg",
    externalUrl: "https://open.spotify.com/show/05E8kMGjWNOmRdK183o3s2",
    externalLabel: "Listen on Spotify",
    note: ""
  },
  {
    title: "What is Tribly? Collection walkthrough",
    client: "Tribly",
    clientUrl: null,
    meta: "Product walkthrough, 2023",
    roles: ["Hosting", "Recording", "Editing"],
    thumb: "/assets/img/production/tribly-walkthrough.jpg",
    youtubeId: "7BUpglBYMOM",
    note: ""
  },
  {
    title: "Take A Turn At the Wheel",
    client: "Potters Guild of Frederick",
    clientUrl: null,
    meta: "Class recap, 2023",
    roles: ["Filming", "Editing"],
    thumb: "/assets/img/production/potters-guild-ceramics.jpg",
    youtubeId: "lD3_WKIqr98",
    note: ""
  },
  {
    title: "Raku Firing",
    client: "Potters Guild of Frederick",
    clientUrl: null,
    meta: "Event recap, February 2023",
    roles: ["Filming", "Editing"],
    thumb: "/assets/img/production/potters-guild-raku.jpg",
    youtubeId: "rP6BTEx3lZI",
    note: ""
  },
  {
    title: "Wood Firing",
    client: "Potters Guild of Frederick",
    clientUrl: null,
    meta: "Event recap, April 2023",
    roles: ["Filming", "Editing"],
    thumb: "/assets/img/production/potters-guild-wood.jpg",
    youtubeId: "m2Q8VfWY1X8",
    note: ""
  },
  {
    title: "Hands On Health Acupuncture",
    client: "Maureen Quinn",
    clientUrl: null,
    meta: "Website, still live",
    roles: ["Website", "Teaching"],
    thumb: null,
    youtubeId: null,
    tile: "Website",
    externalUrl: "https://handsonhealthacupuncture.com",
    externalLabel: "Visit the site",
    note: "Built with her, then taught her to run it herself."
  }
];

/* ============================================================
   Render
   ============================================================ */
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

function roleTags(roles) {
  return roles.map(r => `<span class="role-tag">${escapeHtml(r)}</span>`).join("");
}

/* client is nullable: one entry has no named client in the source
   material. The middot belongs to the client, not to the meta, or a
   card without one opens on a floating separator. */
function clientLine(item) {
  if (!item.client) return "";
  const name = escapeHtml(item.client);
  const linked = item.clientUrl
    ? `<a href="${escapeHtml(item.clientUrl)}" target="_blank" rel="noopener">${name}</a>`
    : name;
  return linked + " &middot; ";
}

function workCard(item) {
  /* A button rather than a link or a div. Clicking it changes this
     page instead of going anywhere, and a keyboard user needs to
     reach and press it without any extra work. */
  const media = item.youtubeId
    ? `<button class="facade" data-yt="${escapeHtml(item.youtubeId)}" aria-label="Play ${escapeHtml(item.title)}">
         <img src="${escapeHtml(item.thumb)}" alt="" loading="lazy" width="640" height="360">
         <span class="facade-play" aria-hidden="true">&#9654;</span>
       </button>`
    : item.tileArt
      ? `<div class="work-tile has-art">
           <img src="${escapeHtml(item.tileArt)}" alt="" loading="lazy" width="640" height="640">
         </div>`
      : `<div class="work-tile" aria-hidden="true">${escapeHtml(item.tile)}</div>`;

  const out = item.externalUrl
    ? `<div class="work-foot">
         <a class="crossref" href="${escapeHtml(item.externalUrl)}" target="_blank" rel="noopener">${escapeHtml(item.externalLabel)} &rarr;</a>
       </div>`
    : "";

  return `
    <li class="work-card">
      ${media}
      <div class="work-body">
        <div class="work-roles">${roleTags(item.roles)}</div>
        <h3 class="work-title">${escapeHtml(item.title)}</h3>
        <p class="work-meta">${clientLine(item)}${escapeHtml(item.meta)}</p>
        ${item.note ? `<p class="work-note">${escapeHtml(item.note)}</p>` : ""}
        ${out}
      </div>
    </li>
  `;
}

/* ============================================================
   The video facades

   Nothing is requested from YouTube until someone asks. On click the
   thumbnail is replaced by the real iframe, which is built here
   rather than shipped hidden in the markup: a hidden iframe still
   loads, so hiding one would defeat the point.

   One listener on the grid rather than one per card, so cards added
   to WORK are covered without touching this.
   ============================================================ */
function initFacades(grid) {
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

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("workGrid");
  if (!grid) return;
  grid.innerHTML = WORK.map(workCard).join("");
  initFacades(grid);
});
