/* ============================================================
   LISTEN

   Reads a case study aloud with the browser's own speech, the same
   way Lay of the Land plays an episode. A page opts in with a button
   carrying data-listen. The script reads the hero, then each section's
   heading and prose, one sentence at a time, marking the paragraph it
   is on. A bar along the bottom shows the section, with Pause and Stop.

   Nothing is fetched and nothing is stored. Where the browser has no
   speech, the button hides itself.
   ============================================================ */
(function () {
  var buttons = document.querySelectorAll("[data-listen]");
  if (!buttons.length) return;
  var synth = window.speechSynthesis;
  if (!synth || typeof SpeechSynthesisUtterance === "undefined") {
    buttons.forEach(function (b) { b.hidden = true; });
    return;
  }

  var chunks = [], pos = 0, playing = false, token = 0, voice = null;
  var bar = null, whereEl = null, toggleBtn = null, current = null;

  function score(v) {
    var s = 0;
    if (/premium|enhanced|natural|neural/i.test(v.name)) s += 4;
    if (/siri/i.test(v.name)) s += 3;
    if (/google/i.test(v.name)) s += 1;
    if (/^en[-_]US/i.test(v.lang)) s += 1;
    if (/novelty|whisper|bells|bubbles|cellos|organ|zarvox|trinoids|bad news|good news|jester|superstar|boing|albert|wobble/i.test(v.name)) s -= 10;
    return s;
  }
  function pickVoice() {
    var all = synth.getVoices().filter(function (v) { return /^en/i.test(v.lang); });
    all.sort(function (a, b) { return score(b) - score(a); });
    voice = all[0] || null;
  }
  pickVoice();
  if ("onvoiceschanged" in synth) synth.addEventListener("voiceschanged", pickVoice);

  function sentences(text) {
    var m = String(text).match(/[^.!?]+[.!?]+["'”’)\]]*\s*|[^.!?]+$/g);
    return (m || [text]).map(function (s) { return s.trim(); }).filter(Boolean);
  }

  function build() {
    chunks = [];
    function add(el, where, pause) {
      var text = el.textContent.replace(/\s+/g, " ").trim();
      if (!text) return;
      sentences(text).forEach(function (s) { chunks.push({ text: s, el: el, where: where }); });
      if (pause) chunks[chunks.length - 1].pause = true;
    }
    var title = document.querySelector(".hero-title");
    var sub = document.querySelector(".hero-sub");
    if (title) add(title, "Introduction", true);
    if (sub) add(sub, "Introduction");
    document.querySelectorAll("main .section").forEach(function (sec) {
      var h = sec.querySelector(".section-title");
      var where = h ? h.textContent.trim() : "";
      if (h) add(h, where, true);
      sec.querySelectorAll(".prose p, .prose li").forEach(function (p) { add(p, where); });
    });
  }

  function mark(el) {
    if (current && current !== el) current.classList.remove("is-listening");
    current = el || null;
    if (!el) return;
    el.classList.add("is-listening");
    var r = el.getBoundingClientRect();
    if (r.top < 0 || r.bottom > window.innerHeight - 90) {
      var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    }
  }

  function ensureBar() {
    if (bar) return;
    bar = document.createElement("div");
    bar.className = "readaloud-bar";
    bar.setAttribute("role", "region");
    bar.setAttribute("aria-label", "Reading aloud");
    whereEl = document.createElement("span");
    whereEl.className = "readaloud-where";
    whereEl.setAttribute("aria-live", "polite");
    toggleBtn = document.createElement("button");
    toggleBtn.type = "button";
    toggleBtn.textContent = "Pause";
    toggleBtn.addEventListener("click", toggle);
    var stopBtn = document.createElement("button");
    stopBtn.type = "button";
    stopBtn.className = "readaloud-stop";
    stopBtn.textContent = "Stop";
    stopBtn.addEventListener("click", stop);
    bar.appendChild(whereEl);
    bar.appendChild(toggleBtn);
    bar.appendChild(stopBtn);
    document.body.appendChild(bar);
  }

  function speak() {
    if (pos >= chunks.length) { stop(); return; }
    var chunk = chunks[pos];
    var my = ++token;
    var u = new SpeechSynthesisUtterance(chunk.text);
    if (voice) { u.voice = voice; u.lang = voice.lang; } else { u.lang = "en-US"; }
    u.onend = function () {
      if (my !== token || !playing) return;
      pos++;
      setTimeout(speak, chunk.pause ? 350 : 60);
    };
    u.onerror = function (e) {
      if (my !== token || !playing) return;
      if (e && (e.error === "interrupted" || e.error === "canceled")) return;
      pos++;
      speak();
    };
    mark(chunk.el);
    whereEl.textContent = chunk.where;
    synth.speak(u);
  }

  function start() {
    build();
    if (!chunks.length) return;
    ensureBar();
    bar.hidden = false;
    pos = 0;
    playing = true;
    token++;
    synth.cancel();
    toggleBtn.textContent = "Pause";
    speak();
  }
  function toggle() {
    token++;
    synth.cancel();
    if (playing) {
      playing = false;
      toggleBtn.textContent = "Resume";
    } else {
      playing = true;
      toggleBtn.textContent = "Pause";
      speak();
    }
  }
  function stop() {
    playing = false;
    token++;
    synth.cancel();
    mark(null);
    if (bar) bar.hidden = true;
  }

  buttons.forEach(function (b) { b.addEventListener("click", start); });
  document.addEventListener("listen:stop", stop);
  window.addEventListener("pagehide", function () { synth.cancel(); });
})();
