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

   CLIENT DISCRETION
   Keep case studies about the work. Jack chooses to omit client
   identities here as a courtesy; no agreement is implied. Naming a
   client needs his specific approval. Public Production credits and
   attributed testimonials remain as previously approved.

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
    lead: "I worked with Claude to turn my hand cuts into timing rules, then checked the scripted edit against the saved Premiere project.",
    summary: "The work combined a transcript cue sheet, in-place editing scripts, and checks across two video and two audio tracks. A slide request I caught on playback led to a second way to detect mistranscribed cues.",
    result: "A 92-minute recording became a verified 34:13 teaching cut after an end trim and scripted removals. Two later corrections were verified as gaps; their final closure remained unverified in the session record."
  },
  {
    slug: "event-remaster-and-language-conform",
    title: "Remastering an event with Codex",
    meta: "Video post-production, 2026",
    tags: ["Scripting", "Verification", "Video post-production", "Safety design"],
    lead: "I worked with Codex on two installments of a remaster while continuing to make editing decisions by hand.",
    summary: "Part 1 mapped an existing Spanish recording to a revised timeline. Part 2 rebuilt the editable graphics system and exposed a mistake in the final check: it reset two card positions I had changed on purpose.",
    result: "The two positions were restored. Part 2 produced an editable graphics project and 35 card renders, and I reported its English broadcast. Its Spanish conform remains open; Part 1's saved listening approval was also unfinished."
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
