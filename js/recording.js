/* ============================================================
   RECORDING

   Shared by js/listen.js and the Lay of the Land peek. A case study
   can carry a recorded reading, made by tools/record-case-study.py:
   an mp3, plus a JSON file listing where each line starts and a short
   fingerprint of that line's text.

   A recording is only used when every fingerprint matches the page as
   it stands. If the page was edited after the recording was made, the
   players use the device voice instead, so the highlight can never
   drift onto the wrong paragraph. The console says which line changed.
   ============================================================ */
window.RECORDING = (function () {
  function norm(text) { return String(text).replace(/\s+/g, " ").trim(); }

  /* FNV-1a over UTF-16 code units. tools/record-case-study.py computes the same. */
  function key(text) {
    var t = norm(text), h = 0x811c9dc5;
    for (var i = 0; i < t.length; i++) {
      h ^= t.charCodeAt(i);
      h = Math.imul(h, 0x01000193) >>> 0;
    }
    return ("0000000" + h.toString(16)).slice(-8);
  }

  function load(url) {
    if (!url || !window.fetch) return Promise.resolve(null);
    return fetch(url, { cache: "no-cache" })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }

  /* lines: what the player reads, in order, each with .text.
     Returns the recording's marks when they all match, otherwise null. */
  function match(data, lines) {
    if (!data || !data.audio || !data.marks) return null;
    if (data.marks.length !== lines.length) {
      if (window.console) console.info("Recording skipped: the page has " + lines.length + " lines, the recording " + data.marks.length + ".");
      return null;
    }
    for (var i = 0; i < lines.length; i++) {
      if (data.marks[i].key !== key(lines[i].text)) {
        if (window.console) console.info("Recording skipped: line " + i + " changed since it was recorded: " + norm(lines[i].text).slice(0, 80));
        return null;
      }
    }
    return data.marks;
  }

  /* The index of the line playing at time t. */
  function at(marks, t) {
    var found = -1;
    for (var i = 0; i < marks.length; i++) {
      if (marks[i].t <= t + 0.05) found = i; else break;
    }
    return found;
  }

  function clock(sec) {
    sec = Math.max(0, Math.floor(sec || 0));
    return Math.floor(sec / 60) + ":" + ("0" + (sec % 60)).slice(-2);
  }

  return { norm: norm, key: key, load: load, match: match, at: at, clock: clock,
    RATES: [0.9, 1, 1.15, 1.3], CREDIT: "Voice: Kokoro (af_heart), Apache 2.0" };
})();
