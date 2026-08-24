/* ============================================================
   CASE STUDIES

   The client work on /ai-portfolio, rendered from one array through
   pure functions. Adding a case study is adding an object here,
   never editing markup in ai-portfolio.html.

   WHY THIS FILE EXISTS AT ALL
   `/ai-portfolio` was written as hardcoded prose, which was right
   when the page was one settled argument that nobody expected to
   grow. Case studies do grow: they arrive one at a time from the
   `/exhibit` skill, on no schedule, for the rest of the practice.
   Hardcoding the fourth one means hand-editing this page a fourth
   time, so the data file went in with the first one rather than
   after the third. Same reason `production.js` exists.

   WHY THESE ARE NOT TOOLS
   Everything else on `/ai-portfolio` is a tool Jack built for his
   own work, and that is what makes the page's argument land. These
   are client jobs, so they are a different kind of evidence and get
   their own section rather than being mixed into the tool lists. The
   page's set of tools is settled and does not change without Jack.
   See CLAUDE.md.

   NAMING A CLIENT IS OPTIONAL, AND USUALLY BESIDE THE POINT
   `client` is nullable. When it is absent the card shows only what
   the work was, because the subject of a case study here is the
   workflow rather than who it was for. An earlier draft rendered a
   "client withheld by agreement" line on every unnamed card; per Jack
   that framed the piece around a client the piece is not about, and
   on a site whose /production page names its clients it also invited
   a reader to go work out which one. Set `client` only where naming
   somebody adds something, and say nothing otherwise.

   The `/exhibit` skill still scans every package against a term list
   before anything is drafted from it, and the shape check is still
   Jack's. That discipline is unchanged; only the visible framing is.

   TAGS come from a small fixed vocabulary so they stay scannable
   down the page, the same discipline `production.js` uses for roles:
   Scripting, Rule derivation, Verification, Transcript analysis,
   Video post-production, Safety design.
   ============================================================ */
const CASE_STUDIES = [
  {
    slug: "two-track-class-edit-automation",
    title: "Automating a two-track class edit from a transcript",
    meta: "Video post-production, 2026",
    tags: ["Scripting", "Rule derivation", "Verification", "Video post-production"],
    /* The lead is the arc, not the outcome. Both halves of it are
       what the piece rests on, and neither is the result: where the timing rules
       came from, and what happened when the first detector missed. */
    lead: "The timing rules came out of the editor's own hand cuts rather than anyone's taste, and the one miss got caught by ear and then turned into a second detector.",
    summary: "A recurring recorded class had to be cut down every time, with two synchronized picture tracks and two kinds of material that never belonged to the audience. The obvious route would have destroyed finished audio work, so the edit got scripted against the live timeline instead, and every scripted change was checked by reading the saved project file rather than trusting the screen.",
    result: "92 minutes down to 34, zero gaps and zero track-length mismatches on all four tracks, read from the saved file after the last pass."
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

function caseTags(tags) {
  return tags.map(t => `<span class="role-tag">${escapeHtml(t)}</span>`).join("");
}

/* The middot belongs to the client, not to the meta, so a card with
   no named client opens on the work rather than on a floating
   separator. Same rule as `clientLine` in production.js. */
function caseClientLine(item) {
  const meta = escapeHtml(item.meta);
  return item.client ? `${escapeHtml(item.client)} &middot; ${meta}` : meta;
}

function caseCard(item) {
  const href = `/case-studies/${encodeURIComponent(item.slug)}`;
  return `
    <li class="offer-card">
      <div class="work-roles">${caseTags(item.tags)}</div>
      <p class="offer-for">${caseClientLine(item)}</p>
      <h3 class="offer-title">${escapeHtml(item.title)}</h3>
      <div class="offer-body">
        <p><strong>${escapeHtml(item.lead)}</strong></p>
        <p>${escapeHtml(item.summary)}</p>
        <p class="work-note">${escapeHtml(item.result)}</p>
      </div>
      <a class="offer-link" href="${href}">Read the case study &rarr;</a>
    </li>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("caseStudyGrid");
  if (!grid) return;
  grid.innerHTML = CASE_STUDIES.map(caseCard).join("");
});
