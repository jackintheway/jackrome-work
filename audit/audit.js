/* Workflow Audit Readiness Assessment: the browser side.

   Answers live in memory only. Nothing goes into URLs, cookies, or
   browser storage, so a shared or borrowed device keeps nothing after
   the tab closes. Reload loses an unfinished draft; the intro says so.

   The server owns scoring. This file collects answers, validates them
   with the shared schema so mistakes are caught before a round trip,
   asks for the optional follow-up, submits once with a stable ID and
   retry token, and renders the public result as text. It never builds
   HTML from anything a visitor or the server returned.

   Spec: BUILD-SPEC.md sections 3, 4, 6, 7; copy from COPY-CATALOGUE.md. */

import { SCHEMA_VERSION, LIMITS, STAGES, STALL_EXCLUSIVE, validateAnswers, errorsForStage } from "./schema.mjs";

const ENDPOINT = "/.netlify/functions/score";
const FOLLOWUP_TIMEOUT = 3000;
const SUBMIT_TIMEOUT = 15000;
const MAX_FOLLOWUP_REQUESTS = 3;
const FALLBACK_QUESTION = "What information goes into this task, and what comes out when it's finished?";

const $ = (id) => document.getElementById(id);
const form = $("auditForm");
const statusEl = $("status");

const state = {
  stage: 0,
  q5Revision: 0,
  q5Snapshot: "",
  followup: null, // { type, question, answer, revision, status }
  followupCache: new Map(), // revision -> { type, question }
  followupRequests: 0,
  followupInFlight: null,
  submission: null, // { id, token, snapshotKey }
  uncertain: false,
  inFlight: false,
  done: false,
};

/* ---------- announcements ---------- */

function announce(text) {
  statusEl.textContent = "";
  // A tick apart so repeated identical messages are still announced.
  setTimeout(() => { statusEl.textContent = text || ""; }, 30);
}

/* ---------- reading the form ---------- */

function radio(name) {
  const el = form.querySelector('input[name="' + name + '"]:checked');
  return el ? el.value : undefined;
}

function text(id) {
  return $(id).value;
}

function collect() {
  const stall = [...form.querySelectorAll('input[name="stall"]:checked')].map((el) => el.value);
  const answers = {
    org: text("org"),
    website: text("website"),
    name: text("name"),
    role: text("role"),
    staff: radio("staff"),
    q5: text("q5"),
    followup: retainedFollowup(),
    frequency: radio("frequency"),
    effort: radio("effort"),
    effort_note: text("effort_note"),
    scope_context: radio("scope_context"),
    people: radio("people"),
    helpers: form.querySelector('input[name="helpers"]').checked,
    stall,
    stall_other: stall.includes("elsewhere") ? text("stall_other") : "",
    q10: text("q10"),
    repeatability: radio("repeatability"),
    q12: text("q12"),
    sources: radio("sources"),
    q13: text("q13"),
    sensitivity: radio("sensitivity"),
    decision: radio("decision"),
    decision_other: radio("decision") === "other" ? text("decision_other") : "",
    q16: text("q16"),
    preference: radio("preference"),
    email: text("email"),
  };
  // Optional empties are omitted so the schema sees "not provided".
  for (const key of ["website", "effort_note", "q13", "stall_other", "decision_other"]) {
    if (answers[key] === "") delete answers[key];
  }
  if (answers.followup === null) delete answers.followup;
  return answers;
}

function retainedFollowup() {
  const f = state.followup;
  if (!f || f.status !== "retained") return null;
  const answer = $("followupAnswer").value;
  if (answer.trim() === "") return null;
  return { type: f.type, answer, revision: f.revision };
}

/* ---------- stages ---------- */

function stageEl(n) {
  return form.querySelector('.stage[data-stage="' + n + '"]');
}

function showStage(n, opts) {
  const push = !opts || opts.push !== false;
  clearErrors();
  if (n === 0) {
    form.hidden = true;
    $("intro").hidden = false;
    $("results").hidden = true;
    if (push) history.pushState({ stage: 0 }, "");
    $("introTitle").setAttribute("tabindex", "-1");
    $("introTitle").focus({ preventScroll: false });
    state.stage = 0;
    return;
  }
  $("intro").hidden = true;
  form.hidden = false;
  form.querySelectorAll(".stage").forEach((el) => { el.hidden = Number(el.dataset.stage) !== n; });
  if (n === 5) {
    const name = $("name").value.trim();
    $("nameEcho").textContent = name ? "Submitting as " + name + "." : "";
    if (name) {
      const change = document.createElement("a");
      change.href = "#";
      change.textContent = "Change";
      change.addEventListener("click", (e) => { e.preventDefault(); showStage(1); $("name").focus(); });
      $("nameEcho").append(" ", change);
    }
  }
  state.stage = n;
  if (push) history.pushState({ stage: n }, "");
  const title = stageEl(n).querySelector(".stage-title");
  title.focus();
  window.scrollTo({ top: 0, behavior: "auto" });
}

window.addEventListener("popstate", (e) => {
  if (state.done || state.inFlight) {
    history.pushState({ stage: state.stage }, "");
    return;
  }
  const n = e.state && typeof e.state.stage === "number" ? e.state.stage : 0;
  showStage(n, { push: false });
});

/* ---------- validation display ---------- */

function clearErrors() {
  const summary = $("errorSummary");
  summary.hidden = true;
  $("errorList").textContent = "";
  form.querySelectorAll("[aria-invalid]").forEach((el) => el.removeAttribute("aria-invalid"));
  form.querySelectorAll(".field.choice.is-invalid").forEach((el) => el.classList.remove("is-invalid"));
  form.querySelectorAll(".field-error").forEach((el) => el.remove());
}

function fieldAnchor(field) {
  if (field === "followup") return $("followupAnswer");
  if (field === "helpers") return form.querySelector('input[name="helpers"]');
  const byId = $(field);
  if (byId) return byId;
  const group = form.querySelector('.field.choice[data-field="' + field + '"]');
  if (group) return group.querySelector("input");
  return null;
}

function showErrors(errors) {
  clearErrors();
  if (!errors.length) return;
  const list = $("errorList");
  for (const err of errors) {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = err.message;
    a.addEventListener("click", (e) => {
      e.preventDefault();
      const target = fieldAnchor(err.field);
      if (target) target.focus();
    });
    li.append(a);
    list.append(li);

    const target = fieldAnchor(err.field);
    if (!target) continue;
    const group = target.closest(".field.choice");
    const msg = document.createElement("p");
    msg.className = "field-error";
    msg.id = "err-" + err.field;
    msg.textContent = err.message;
    if (group && group.dataset.field === err.field) {
      group.classList.add("is-invalid");
      group.append(msg);
    } else {
      target.setAttribute("aria-invalid", "true");
      const described = (target.getAttribute("aria-describedby") || "").split(" ").filter(Boolean);
      if (!described.includes(msg.id)) target.setAttribute("aria-describedby", [...described, msg.id].join(" "));
      target.insertAdjacentElement("afterend", msg);
    }
  }
  const summary = $("errorSummary");
  summary.hidden = false;
  summary.focus();
}

function validateStage(n) {
  const { errors } = validateAnswers(collect());
  return errorsForStage(errors, n);
}

/* ---------- reveals and exclusivity ---------- */

function wireReveals() {
  form.querySelectorAll('input[name="stall"]').forEach((box) => {
    box.addEventListener("change", () => {
      const checked = [...form.querySelectorAll('input[name="stall"]:checked')];
      if (box.checked && STALL_EXCLUSIVE.includes(box.value)) {
        checked.forEach((other) => { if (other !== box) other.checked = false; });
      } else if (box.checked) {
        checked.forEach((other) => { if (STALL_EXCLUSIVE.includes(other.value)) other.checked = false; });
      }
      $("stallOtherBox").hidden = !form.querySelector('input[name="stall"][value="elsewhere"]').checked;
    });
  });
  form.querySelectorAll('input[name="decision"]').forEach((r) => {
    r.addEventListener("change", () => { $("decisionOtherBox").hidden = radio("decision") !== "other"; });
  });
  form.querySelectorAll('input[name="sensitivity"]').forEach((r) => {
    r.addEventListener("change", () => { $("sensitivityNote").hidden = radio("sensitivity") !== "yes"; });
  });
}

/* ---------- Q5 and the optional follow-up ---------- */

function q5Valid() {
  const v = $("q5").value;
  return v.trim().length >= LIMITS.q5.min && v.length <= LIMITS.q5.max;
}

function updateQ5Count() {
  const len = $("q5").value.trim().length;
  const count = $("q5Count");
  if (len < LIMITS.q5.min) count.textContent = "At least " + LIMITS.q5.min + " characters. " + len + " so far.";
  else count.textContent = len + " of " + LIMITS.q5.max + " characters.";
  $("followupBtn").disabled = !q5Valid() || state.followupRequests >= MAX_FOLLOWUP_REQUESTS;
}

function onQ5Changed() {
  updateQ5Count();
  const now = $("q5").value;
  if (now === state.q5Snapshot) return;
  state.q5Snapshot = now;
  state.q5Revision += 1;
  const f = state.followup;
  if (f && f.status === "retained" && $("followupAnswer").value.trim() !== "" && f.revision !== state.q5Revision) {
    $("followupStale").hidden = false;
  }
}

function showFollowupQuestion(type, question, revision) {
  state.followup = { type, question, answer: "", revision, status: "retained" };
  $("followupLabel").textContent = question;
  $("followupBox").hidden = false;
  $("followupStale").hidden = true;
  $("followupStatus").textContent = "";
  $("followupAnswer").focus();
}

async function requestFollowup() {
  if (!q5Valid()) return;
  if (state.followupRequests >= MAX_FOLLOWUP_REQUESTS) {
    $("followupStatus").textContent = "That's the limit for follow-ups on this form. You can still continue.";
    return;
  }
  const revision = state.q5Revision;
  const cached = state.followupCache.get(revision);
  if (cached) {
    if (cached.type === "none") $("followupStatus").textContent = "No extra question needed. You can continue.";
    else showFollowupQuestion(cached.type, cached.question, revision);
    return;
  }
  state.followupRequests += 1;
  $("followupBtn").disabled = true;
  $("followupStatus").textContent = "Finding a follow-up question...";

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FOLLOWUP_TIMEOUT);
  let result = { type: "fallback", question: FALLBACK_QUESTION };
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode: "followup", q5: $("q5").value, request_id: crypto.randomUUID(), website_confirm: $("website_confirm").value }),
      signal: controller.signal,
    });
    if (res.ok) {
      const data = await res.json();
      if (data && ["inputs", "outputs", "steps", "handoff", "fallback", "none"].includes(data.type)) {
        result = data.type === "none" ? { type: "none", question: null } : { type: data.type, question: data.question || FALLBACK_QUESTION };
      }
    }
  } catch (_) {
    // Timeout, offline, or a server problem all land on the fixed question.
  } finally {
    clearTimeout(timer);
  }
  // The visitor may have moved on. A late answer is ignored, never inserted elsewhere.
  if (state.stage !== 2 || revision !== state.q5Revision) {
    state.followupCache.set(revision, result);
    $("followupBtn").disabled = !q5Valid();
    return;
  }
  state.followupCache.set(revision, result);
  $("followupBtn").disabled = !q5Valid() || state.followupRequests >= MAX_FOLLOWUP_REQUESTS;
  if (result.type === "none") {
    $("followupStatus").textContent = "No extra question needed. You can continue.";
    return;
  }
  showFollowupQuestion(result.type, result.question, revision);
}

function wireFollowup() {
  $("q5").addEventListener("input", onQ5Changed);
  $("followupBtn").addEventListener("click", requestFollowup);
  $("followupKeep").addEventListener("click", () => {
    if (state.followup) state.followup.revision = state.q5Revision;
    $("followupStale").hidden = true;
  });
  $("followupRemove").addEventListener("click", () => {
    state.followup = null;
    $("followupAnswer").value = "";
    $("followupBox").hidden = true;
    $("followupStale").hidden = true;
    $("followupStatus").textContent = "Detail removed.";
  });
}

/* ---------- review panel ---------- */

const LABELS = {
  staff: { under_5: "Under 5", "5_19": "5 to 19", "20_50": "20 to 50", over_50: "More than 50", unknown: "Not sure" },
  frequency: { daily: "Daily", weekly: "Weekly", monthly: "Monthly", quarterly: "Quarterly", few_per_year: "A few times a year", unknown: "Not sure" },
  effort: { under_15m: "Under 15 minutes", "15m_under_1h": "15 minutes to under 1 hour", "1h_under_4h": "1 to under 4 hours", "4h_plus": "4 hours or more", unknown: "Not sure" },
  scope_context: { main: "The main task", several: "One of several", unknown: "Not sure" },
  people: { one: "1 person", "2_5": "2 to 5 people", "6_plus": "6 or more people", unknown: "Not sure" },
  stall: { waiting: "Waiting on someone else", chasing: "Chasing down information", blank_page: "Starting from a blank page", cleanup: "Cleanup and formatting", redoing: "Redoing work that was already done", elsewhere: "Somewhere else", no_stall: "It doesn't usually stall", unknown: "Not sure" },
  repeatability: { same: "Same shape", similar: "Similar with variation", different: "Different every time", unknown: "Not sure" },
  sources: { yes: "Yes", some: "Some of it", unknown: "Not sure" },
  sensitivity: { yes: "Yes", no: "No", unknown: "Not sure" },
  decision: { you: "You", director: "Your director", leadership: "Leadership team", board: "Board or committee", other: "Someone else", unknown: "Not sure" },
  preference: { ourselves: "Ourselves", someone_else: "Someone else", not_considered: "Haven't thought about it" },
};

const REVIEW_ROWS = {
  1: [["Organization", "org"], ["Website", "website"], ["Name", "name"], ["Role", "role"], ["Staff", "staff"]],
  2: [["The task", "q5"], ["Added detail", "followup"], ["How often", "frequency"], ["Staff time per round", "effort"], ["Time note", "effort_note"], ["Main task or one of several", "scope_context"], ["People involved", "people"], ["Volunteers or contractors help", "helpers"]],
  3: [["Where it stalls", "stall"], ["Where else", "stall_other"], ["When the usual person is out", "q10"], ["Output shape", "repeatability"]],
  4: [["Tools", "q12"], ["Know where the information comes from", "sources"], ["AI tried", "q13"], ["Personal or confidential information", "sensitivity"]],
  5: [["Who decides", "decision"], ["Their role", "decision_other"], ["What you'd do with the hours", "q16"], ["Six months from now", "preference"], ["Email", "email"]],
};

function displayValue(field, answers) {
  const v = answers[field];
  if (field === "helpers") return v ? "Yes" : "No";
  if (field === "followup") return v ? v.answer : "";
  if (field === "stall") return Array.isArray(v) ? v.map((x) => LABELS.stall[x] || x).join(", ") : "";
  if (LABELS[field]) return LABELS[field][v] || "";
  return typeof v === "string" ? v : "";
}

function renderReview() {
  const answers = collect();
  const body = $("reviewBody");
  body.textContent = "";
  for (const stage of STAGES) {
    const h = document.createElement("h4");
    h.textContent = "Stage " + stage.id + ": " + stage.title;
    const dl = document.createElement("dl");
    for (const [label, field] of REVIEW_ROWS[stage.id]) {
      if (field === "stall_other" && !(answers.stall || []).includes("elsewhere")) continue;
      if (field === "decision_other" && answers.decision !== "other") continue;
      const dt = document.createElement("dt");
      dt.textContent = label;
      const dd = document.createElement("dd");
      const value = displayValue(field, answers);
      if (value === "") {
        const span = document.createElement("span");
        span.className = "not-provided";
        span.textContent = "Not provided";
        dd.append(span);
      } else {
        dd.append(document.createTextNode(value));
      }
      const change = document.createElement("a");
      change.href = "#";
      change.textContent = "Change";
      change.setAttribute("aria-label", "Change " + label.toLowerCase());
      change.addEventListener("click", (e) => {
        e.preventDefault();
        showStage(stage.id);
        const target = fieldAnchor(field === "followup" ? "followup" : field);
        if (target) target.focus();
      });
      dd.append(change);
      dl.append(dt, dd);
    }
    body.append(h, dl);
  }
}

/* ---------- submission ---------- */

function randomHex(bytes) {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return [...arr].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function stableKey(value) {
  if (Array.isArray(value)) return "[" + value.map(stableKey).join(",") + "]";
  if (value && typeof value === "object") return "{" + Object.keys(value).sort().map((k) => JSON.stringify(k) + ":" + stableKey(value[k])).join(",") + "}";
  return JSON.stringify(value);
}

function setInFlight(on) {
  state.inFlight = on;
  $("submitBtn").disabled = on;
  $("reviewBtn").disabled = on;
  form.querySelectorAll("[data-back]").forEach((b) => { b.disabled = on; });
}

function showTrouble(message, opts) {
  const box = $("submitTrouble");
  $("submitTroubleText").textContent = message;
  $("retryBtn").hidden = !(opts && opts.retry);
  $("editBtn").hidden = !(opts && opts.edit);
  box.hidden = false;
  box.focus && box.setAttribute("tabindex", "-1");
  box.focus();
}

function hideTrouble() {
  $("submitTrouble").hidden = true;
}

async function submit() {
  if (state.inFlight || state.done) return;
  const answers = collect();
  const { errors } = validateAnswers(answers);
  if (errors.length) {
    // Send the visitor to the earliest stage with a problem.
    const first = STAGES.find((s) => errorsForStage(errors, s.id).length);
    if (first && first.id !== state.stage) showStage(first.id);
    showErrors(errorsForStage(errors, first ? first.id : 5));
    return;
  }

  const key = stableKey(answers);
  if (!state.submission || state.submission.snapshotKey !== key) {
    state.submission = { id: crypto.randomUUID(), token: randomHex(16), snapshotKey: key };
    state.uncertain = false;
  }
  hideTrouble();
  setInFlight(true);
  announce("Sending your answers...");

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), SUBMIT_TIMEOUT);
  let res = null;
  let data = null;
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        mode: "score",
        schema_version: SCHEMA_VERSION,
        submission_id: state.submission.id,
        retry_token: state.submission.token,
        answers,
        website_confirm: $("website_confirm").value,
      }),
      signal: controller.signal,
    });
    try { data = await res.json(); } catch (_) { data = null; }
  } catch (_) {
    res = null;
  } finally {
    clearTimeout(timer);
    setInFlight(false);
  }

  if (!res) {
    state.uncertain = true;
    if (navigator.onLine === false) {
      showTrouble("You're offline. Keep this tab open and try again when you're connected.", { retry: true });
    } else {
      showTrouble("We couldn't confirm that your answers were saved. Keep this tab open and try again.", { retry: true, edit: true });
    }
    announce("");
    return;
  }

  if (res.status === 200 && data && (data.status === "scored" || data.status === "unscored")) {
    renderResult(data);
    return;
  }
  if (res.status === 400 && data && data.error === "validation" && Array.isArray(data.errors)) {
    const first = STAGES.find((s) => errorsForStage(data.errors, s.id).length);
    if (first) { showStage(first.id); showErrors(errorsForStage(data.errors, first.id)); }
    announce("");
    return;
  }
  if (res.status === 409) {
    showTrouble("This attempt couldn't be matched to your saved submission. Return to your answers and submit again.", { edit: true });
    state.submission = null;
    announce("");
    return;
  }
  if (res.status === 429) {
    const after = Number(res.headers.get("Retry-After")) || 60;
    showTrouble("Please wait a moment before trying again. Your answers are still here.", {});
    setTimeout(() => { $("retryBtn").hidden = false; }, after * 1000);
    announce("");
    return;
  }
  state.uncertain = true;
  showTrouble("We couldn't confirm that your answers were saved. Keep this tab open and try again.", { retry: true, edit: true });
  announce("");
}

/* ---------- results ---------- */

function renderResult(data) {
  state.done = true;
  form.hidden = true;
  const r = $("results");
  r.hidden = false;
  $("resultsTitle").textContent = data.headline || "";
  $("resultScore").textContent = data.status === "scored" ? "Workflow audit readiness: " + data.score + "/100" : "";
  $("resultScore").hidden = data.status !== "scored";
  $("resultParagraph").textContent = data.paragraph || "";
  const reason = $("resultReason");
  reason.hidden = !data.reason;
  reason.textContent = data.reason || "";
  const obs = $("resultObservations");
  obs.textContent = "";
  for (const line of data.observations || []) {
    const li = document.createElement("li");
    li.textContent = line;
    obs.append(li);
  }
  const dl = $("resultBreakdown");
  dl.textContent = "";
  for (const row of data.breakdown || []) {
    const dt = document.createElement("dt");
    dt.textContent = row.label;
    const dd = document.createElement("dd");
    dd.textContent = row.points === null ? (row.note || "Not assessed") : row.points + " of " + row.max;
    dl.append(dt, dd);
  }
  if (data.status !== "scored") {
    const p = document.createElement("p");
    p.textContent = "No total was calculated this time.";
    dl.insertAdjacentElement("afterend", p);
  }
  $("resultMethodology").textContent = data.methodology || "";
  $("resultBookingContext").textContent = data.booking_context || "";
  if (data.booking_url && /^https:\/\/calendly\.com\//.test(data.booking_url)) $("bookLink").href = data.booking_url;
  $("resultReceipt").textContent = data.receipt || "";
  history.pushState({ stage: "done" }, "");
  announce("Your results are ready.");
  $("resultsTitle").focus();
  window.scrollTo({ top: 0, behavior: "auto" });
}

/* ---------- wiring ---------- */

function wireNavigation() {
  $("startBtn").addEventListener("click", () => showStage(1));
  form.querySelectorAll("[data-next]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const errors = validateStage(state.stage);
      if (errors.length) { showErrors(errors); return; }
      showStage(state.stage + 1);
    });
  });
  form.querySelectorAll("[data-back]").forEach((btn) => {
    btn.addEventListener("click", () => showStage(state.stage - 1));
  });
  $("reviewBtn").addEventListener("click", () => {
    const panel = $("review");
    const open = panel.hidden;
    if (open) renderReview();
    panel.hidden = !open;
    $("reviewBtn").setAttribute("aria-expanded", String(open));
    if (open) $("reviewTitle").setAttribute("tabindex", "-1"), $("reviewTitle").focus();
  });
  form.addEventListener("submit", (e) => { e.preventDefault(); submit(); });
  $("retryBtn").addEventListener("click", submit);
  $("editBtn").addEventListener("click", () => {
    hideTrouble();
    if (state.uncertain) {
      announce("Your earlier attempt may already have arrived. Editing will create a new submission when you send it.");
    }
    showStage(1);
  });
  // Refuse to leave silently with answers in progress.
  window.addEventListener("beforeunload", (e) => {
    if (state.stage > 0 && !state.done) { e.preventDefault(); e.returnValue = ""; }
  });
}

function init() {
  history.replaceState({ stage: 0 }, "");
  wireNavigation();
  wireReveals();
  wireFollowup();
  updateQ5Count();
  state.q5Snapshot = $("q5").value;
}

init();
