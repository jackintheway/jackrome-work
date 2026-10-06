/* ============================================================
   LISTEN

   Plays a case study aloud. A page opts in with a button carrying
   data-listen. The reading covers the hero, then each section's
   heading and prose, marking the paragraph it is on. A bar along the
   bottom shows the section, with Pause and Stop.

   When the button also carries data-recording (the JSON file written by
   tools/record-case-study.py), the bar plays that recorded reading
   instead: it keeps going when a phone locks, works with lock-screen
   controls, and adds a scrubber and speed. Tapping a paragraph while it
   plays jumps there. If the page text no longer matches the recording,
   or the file will not load, it reads with the browser's own voice, as
   it always has. js/recording.js does the matching.

   The JSON is fetched on load (it is small); the audio only when the
   visitor presses the button. Only the chosen speed is stored.
   ============================================================ */
(function () {
  var buttons = document.querySelectorAll("[data-listen]");
  if (!buttons.length) return;
  var synth = window.speechSynthesis;
  var canSpeak = !!synth && typeof SpeechSynthesisUtterance !== "undefined";
  var R = window.RECORDING;

  var lines = [], chunks = [], pos = 0, playing = false, token = 0, voice = null;
  var bar = null, whereEl = null, toggleBtn = null, current = null;
  var track = null, seek = null, nowEl = null, totalEl = null, rateBtn = null;
  var recording = null, marks = null, audio = null, mode = "speech", lineAt = -1;
  var rate = 1;

  try { var saved = parseFloat(localStorage.getItem("listen-rate")); if (R && R.RATES.indexOf(saved) > -1) rate = saved; } catch (e) {}

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
  if (canSpeak) {
    pickVoice();
    if ("onvoiceschanged" in synth) synth.addEventListener("voiceschanged", pickVoice);
  }

  function sentences(text) {
    var m = String(text).match(/[^.!?]+[.!?]+["'”’)\]]*\s*|[^.!?]+$/g);
    return (m || [text]).map(function (s) { return s.trim(); }).filter(Boolean);
  }

  /* The lines, in reading order. tools/record-case-study.py reads the same. */
  function build() {
    lines = [];
    chunks = [];
    function add(el, where, pause) {
      var text = el.textContent.replace(/\s+/g, " ").trim();
      if (!text) return;
      lines.push({ el: el, text: text, where: where });
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
    if (r.top < 0 || r.bottom > window.innerHeight - 130) {
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

    // The recorded reading's extra row: time, scrubber, speed, and the voice credit.
    track = document.createElement("div");
    track.className = "readaloud-track";
    track.hidden = true;
    nowEl = document.createElement("span");
    nowEl.className = "readaloud-time";
    nowEl.textContent = "0:00";
    seek = document.createElement("input");
    seek.type = "range"; seek.min = "0"; seek.max = "1000"; seek.step = "1"; seek.value = "0";
    seek.setAttribute("aria-label", "Position in the reading");
    seek.addEventListener("input", function () {
      var total = (audio && audio.duration) || (recording && recording.duration) || 0;
      if (!total) return;
      try { audio.currentTime = total * (+seek.value) / 1000; } catch (e) {}
      fill(+seek.value / 10);
    });
    totalEl = document.createElement("span");
    totalEl.className = "readaloud-time";
    rateBtn = document.createElement("button");
    rateBtn.type = "button";
    rateBtn.className = "readaloud-rate";
    rateBtn.addEventListener("click", cycleRate);
    var credit = document.createElement("span");
    credit.className = "readaloud-credit";
    credit.textContent = R ? R.CREDIT : "";
    track.appendChild(nowEl);
    track.appendChild(seek);
    track.appendChild(totalEl);
    track.appendChild(rateBtn);
    track.appendChild(credit);
    bar.appendChild(track);
    document.body.appendChild(bar);
  }

  function fill(pct) { seek.style.setProperty("--fill", pct + "%"); }
  function showRate() {
    rateBtn.textContent = rate + "×";
    rateBtn.setAttribute("aria-label", "Speed, " + rate + " times. Change speed");
  }
  function cycleRate() {
    var i = R.RATES.indexOf(rate);
    rate = R.RATES[(i + 1) % R.RATES.length];
    try { localStorage.setItem("listen-rate", String(rate)); } catch (e) {}
    if (audio) audio.playbackRate = rate;
    showRate();
  }

  /* ---------- The device voice ---------- */

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

  function startSpeech(fromEl) {
    mode = "speech";
    track.hidden = true;
    document.body.classList.remove("is-recorded");
    if (!canSpeak) { stop(); return; }
    pos = 0;
    if (fromEl) {
      for (var i = 0; i < chunks.length; i++) { if (chunks[i].el === fromEl) { pos = i; break; } }
    }
    playing = true;
    token++;
    synth.cancel();
    toggleBtn.textContent = "Pause";
    speak();
  }

  /* ---------- The recording ---------- */

  function ensureAudio() {
    if (audio) return;
    audio = new Audio();
    audio.preload = "none";
    audio.addEventListener("timeupdate", sync);
    audio.addEventListener("seeked", sync);
    audio.addEventListener("loadedmetadata", function () { totalEl.textContent = R.clock(audio.duration); });
    audio.addEventListener("play", function () { playing = true; toggleBtn.textContent = "Pause"; });
    audio.addEventListener("pause", function () { if (!audio.ended && mode === "audio") { playing = false; toggleBtn.textContent = "Resume"; } });
    audio.addEventListener("ended", function () { if (mode === "audio") stop(); });
    audio.addEventListener("error", function () {
      if (mode !== "audio" || !audio.getAttribute("src")) return;
      // The file did not load. Carry on from the same line with the device voice.
      var from = lineAt > -1 ? lines[lineAt].el : null;
      marks = null;
      startSpeech(from);
      if (!canSpeak) whereEl.textContent = "The recording didn't load.";
    });
  }

  function sync() {
    if (mode !== "audio" || !marks) return;
    var t = audio.currentTime, total = audio.duration || recording.duration || 0;
    nowEl.textContent = R.clock(t);
    if (total) {
      var pct = Math.min(100, t / total * 100);
      seek.value = Math.round(pct * 10);
      fill(pct);
    }
    var i = R.at(marks, t);
    if (i !== lineAt) {
      lineAt = i;
      if (i > -1) { mark(lines[i].el); whereEl.textContent = lines[i].where; }
    }
  }

  function startAudio() {
    mode = "audio";
    ensureAudio();
    track.hidden = false;
    document.body.classList.add("is-recorded");
    showRate();
    if (audio.getAttribute("src") !== recording.audio) audio.src = recording.audio;
    totalEl.textContent = R.clock(recording.duration);
    try { audio.currentTime = 0; } catch (e) {}
    audio.playbackRate = rate;
    lineAt = -1;
    play();
    if ("mediaSession" in navigator) {
      try {
        var title = document.querySelector(".hero-title");
        navigator.mediaSession.metadata = new MediaMetadata({
          title: title ? title.textContent.trim() : document.title, artist: "Jack Rome", album: "Case study"
        });
        navigator.mediaSession.setActionHandler("play", play);
        navigator.mediaSession.setActionHandler("pause", function () { audio.pause(); });
        navigator.mediaSession.setActionHandler("seekbackward", function () { audio.currentTime = Math.max(0, audio.currentTime - 15); });
        navigator.mediaSession.setActionHandler("seekforward", function () { audio.currentTime = Math.min(audio.duration || 1e9, audio.currentTime + 15); });
      } catch (e) {}
    }
  }
  function play() {
    var p = audio.play();
    if (p && p.catch) p.catch(function () {});
  }

  /* While the recording plays, tapping a paragraph jumps there. Links and
     text selection keep working as usual. */
  document.addEventListener("click", function (e) {
    if (mode !== "audio" || !marks || !bar || bar.hidden) return;
    if (e.target.closest("a, button, input, .readaloud-bar")) return;
    var sel = window.getSelection && window.getSelection();
    if (sel && String(sel).length) return;
    for (var i = 0; i < lines.length; i++) {
      if (lines[i].el.contains(e.target)) {
        try { audio.currentTime = marks[i].t; } catch (err) {}
        play();
        return;
      }
    }
  });

  /* ---------- Shared controls ---------- */

  function start() {
    build();
    if (!lines.length) return;
    ensureBar();
    bar.hidden = false;
    token++;
    if (canSpeak) synth.cancel();
    marks = R ? R.match(recording, lines) : null;
    if (marks) startAudio(); else startSpeech(null);
  }
  function toggle() {
    if (mode === "audio") {
      if (audio.paused) play(); else audio.pause();
      return;
    }
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
    if (canSpeak) synth.cancel();
    if (audio) { audio.pause(); try { audio.currentTime = 0; } catch (e) {} }
    document.body.classList.remove("is-recorded");
    mark(null);
    lineAt = -1;
    if (bar) bar.hidden = true;
  }

  // The recording's timestamps, fetched up front so pressing play starts at
  // once (iPhone only allows audio to start inside the tap itself).
  var source = buttons[0].getAttribute("data-recording");
  if (!canSpeak && !source) { buttons.forEach(function (b) { b.hidden = true; }); return; }
  if (source && R) {
    R.load(source).then(function (data) {
      recording = data;
      if (!data && !canSpeak) buttons.forEach(function (b) { b.hidden = true; });
    });
  }

  buttons.forEach(function (b) { b.addEventListener("click", start); });
  document.addEventListener("listen:stop", stop);
  window.addEventListener("pagehide", function () { if (canSpeak) synth.cancel(); });
})();
