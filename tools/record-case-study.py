#!/usr/bin/env python3
"""Record a case study as audio with Kokoro, and check recordings are current.

Why this exists. The Listen button on every case study, and the Take a peek
episode on Lay of the Land, used to read the page with the browser's own
voice. That voice stops the moment a phone locks. A recorded file keeps
playing, works with lock-screen controls, and sounds like the real Lay of
the Land, which renders each morning's episode with the same voice.

What it writes, for a case study at case-studies/<slug>.html:
    assets/audio/<slug>.mp3     the recording
    assets/audio/<slug>.json    where each paragraph starts, and its fingerprint

The players match each timestamp to a paragraph by its fingerprint, a short
hash of the paragraph's exact text. If any paragraph on the page no longer
matches the recording, the players fall back to the device voice rather
than highlighting the wrong words. So an edit never breaks the page, but it
does leave the recording stale until this runs again.

Usage (from the repo root, with the Kokoro environment):
    .venv-kokoro/bin/python tools/record-case-study.py <slug> [<slug> ...]
    .venv-kokoro/bin/python tools/record-case-study.py --all
    .venv-kokoro/bin/python tools/record-case-study.py --check

--check reads every case study and reports any recording that no longer
matches its page. Run it after editing a case study, before deploying.

Each paragraph is rendered on its own and cached in .audio-cache/ by its
fingerprint, so re-recording after a small edit only renders what changed.

Voice: Kokoro (af_heart), Apache 2.0. https://huggingface.co/hexgrad/Kokoro-82M
"""

import argparse
import glob
import json
import os
import re
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = os.path.join(ROOT, "case-studies")
OUT = os.path.join(ROOT, "assets", "audio")
CACHE = os.path.join(ROOT, ".audio-cache")
VOICE = "af_heart"
RATE = 24000

# Silence after each kind of line, in seconds. Headings get a breath so a
# listener hears the section change.
GAP = {"title": 0.8, "sub": 0.6, "heading": 0.6, "para": 0.45}

# Spoken spellings for words the voice gets wrong. Keys are matched as
# whole words. Only the audio changes; the page text and fingerprint stay.
SAY = {
    "LotL": "Lay of the Land",
}


def norm(text):
    return re.sub(r"\s+", " ", text).strip()


def key(text):
    """FNV-1a over UTF-16 code units. js/recording.js computes the same."""
    h = 0x811C9DC5
    data = norm(text).encode("utf-16-le")
    for i in range(0, len(data), 2):
        h ^= data[i] | (data[i + 1] << 8)
        h = (h * 0x01000193) & 0xFFFFFFFF
    return format(h, "08x")


def lines_for(path, peek=False):
    """The lines a player reads, in order.

    Page order matches js/listen.js: the hero title and sub, then every
    section's heading and its prose paragraphs and list items. The peek
    order matches case-studies/lay-of-the-land-peek.html: no title, the
    sub as the opening, paragraphs only, the Make your own section left
    out, and the peek's own closing section added from that file.
    """
    from bs4 import BeautifulSoup
    soup = BeautifulSoup(open(path, encoding="utf-8").read(), "html.parser")
    out = []

    def add(el_or_text, kind, where):
        text = norm(el_or_text if isinstance(el_or_text, str) else el_or_text.get_text())
        if text:
            out.append({"kind": kind, "text": text, "where": where})

    title = soup.select_one(".hero-title")
    sub = soup.select_one(".hero-sub")
    if title and not peek:
        add(title, "title", "Introduction")
    if sub:
        add(sub, "sub", "Introduction")
    for sec in soup.select("main .section"):
        h = sec.select_one(".section-title")
        if peek and (not h or h.get("id") == "ownTitle"):
            continue
        where = norm(h.get_text()) if h else ""
        paras = sec.select(".prose p") if peek else sec.select(".prose p, .prose li")
        if peek and not paras:
            continue
        if h:
            add(h, "heading", where)
        for p in paras:
            add(p, "para", where)
    if peek:
        peek_html = open(os.path.join(PAGES, "lay-of-the-land-peek.html"), encoding="utf-8").read()
        m = re.search(r'<script type="application/json" id="closing">(.*?)</script>', peek_html, re.S)
        if not m:
            sys.exit("The peek page has no closing block to read.")
        closing = json.loads(m.group(1))
        add(closing["heading"], "heading", closing["heading"])
        for p in closing["paragraphs"]:
            add(p, "para", closing["heading"])
    return out


def spoken(line):
    text = line["text"]
    for word, say in SAY.items():
        text = re.sub(r"\b%s\b" % re.escape(word), say, text)
    if line["kind"] in ("title", "heading") and not re.search(r"[.!?]$", text):
        text += "."
    return text


def render(pipeline, line):
    """One line as a float32 array, from the cache when it is there."""
    import numpy as np
    import soundfile as sf
    os.makedirs(CACHE, exist_ok=True)
    say = spoken(line)
    path = os.path.join(CACHE, "%s-%s-%s.wav" % (VOICE, line["kind"], key(say)))
    if os.path.exists(path):
        audio, _ = sf.read(path, dtype="float32")
        return audio
    parts = [a for _, _, a in pipeline(say, voice=VOICE)]
    audio = np.concatenate([p.numpy() if hasattr(p, "numpy") else p for p in parts]).astype("float32")
    sf.write(path, audio, RATE)
    return audio


def record(name, lines, pipeline):
    import numpy as np
    import soundfile as sf
    chunks, marks, t = [], [], 0.0
    for line in lines:
        audio = render(pipeline, line)
        marks.append({"t": round(t, 2), "key": key(line["text"]), "kind": line["kind"], "where": line["where"]})
        gap = np.zeros(int(GAP[line["kind"]] * RATE), dtype="float32")
        chunks += [audio, gap]
        t += (len(audio) + len(gap)) / RATE
    os.makedirs(OUT, exist_ok=True)
    wav = os.path.join(CACHE, name + ".wav")
    sf.write(wav, np.concatenate(chunks), RATE)
    mp3 = os.path.join(OUT, name + ".mp3")
    subprocess.run(["ffmpeg", "-y", "-loglevel", "error", "-i", wav, "-ac", "1",
                    "-codec:a", "libmp3lame", "-b:a", "64k", mp3], check=True)
    data = {
        "voice": "Kokoro (%s), Apache 2.0" % VOICE,
        "audio": "/assets/audio/%s.mp3" % name,
        "duration": round(t, 2),
        "marks": marks,
    }
    with open(os.path.join(OUT, name + ".json"), "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=1)
        f.write("\n")
    print("%s: %d lines, %d:%02d, %.1f MB" % (name, len(lines), t // 60, t % 60, os.path.getsize(mp3) / 1e6))


def targets(slug):
    """A case study's recordings: the page, and for Lay of the Land the peek."""
    path = os.path.join(PAGES, slug + ".html")
    yield slug, lines_for(path)
    if slug == "lay-of-the-land":
        yield slug + "-peek", lines_for(path, peek=True)


def slugs():
    return sorted(os.path.basename(p)[:-5] for p in glob.glob(os.path.join(PAGES, "*.html"))
                  if not p.endswith("-peek.html"))


def check():
    stale = 0
    for slug in slugs():
        for name, lines in targets(slug):
            path = os.path.join(OUT, name + ".json")
            if not os.path.exists(path):
                print("%s: no recording (the page uses the device voice)" % name)
                stale += 1
                continue
            recorded = [m["key"] for m in json.load(open(path, encoding="utf-8"))["marks"]]
            current = [key(l["text"]) for l in lines]
            if recorded == current:
                print("%s: current" % name)
                continue
            stale += 1
            changed = [l for l in lines if key(l["text"]) not in recorded]
            print("%s: STALE, %d line(s) differ from the recording:" % (name, len(changed) or abs(len(recorded) - len(current))))
            for l in changed[:8]:
                print("    [%s] %s" % (l["where"], l["text"][:90]))
    if stale:
        print("\nRe-record with: .venv-kokoro/bin/python tools/record-case-study.py <slug>")
    return 1 if stale else 0


def main():
    ap = argparse.ArgumentParser(description=__doc__.split("\n")[0])
    ap.add_argument("slugs", nargs="*")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()
    if args.check:
        sys.exit(check())
    todo = slugs() if args.all else args.slugs
    if not todo:
        ap.error("name a case study slug, or pass --all or --check")
    import warnings
    warnings.filterwarnings("ignore")
    from kokoro import KPipeline
    pipeline = KPipeline(lang_code="a", repo_id="hexgrad/Kokoro-82M")
    for slug in todo:
        for name, lines in targets(slug):
            record(name, lines, pipeline)


if __name__ == "__main__":
    main()
