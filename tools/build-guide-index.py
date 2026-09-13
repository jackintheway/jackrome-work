#!/usr/bin/env python3
"""Build the guide from public HTML and the catalogue arrays, never private sources."""
import argparse
from html.parser import HTMLParser
from pathlib import Path
import json
import re
import shutil
import subprocess
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "js/guide-index.json"


class Page(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.stack = []
        self.title = []
        self.text = []
        self.description = ""
        self.canonical = ""
        self.ids = set()
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.add(attrs["id"])
        if tag == "meta" and attrs.get("name") == "description":
            self.description = attrs.get("content", "")
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href", "")
        if tag not in {"meta", "link", "img", "input", "br", "hr", "source", "wbr"}:
            self.stack.append((tag, attrs))

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, -1, -1):
            if self.stack[i][0] == tag:
                self.stack = self.stack[:i]
                break

    def handle_data(self, data):
        if any(tag == "title" for tag, _ in self.stack):
            self.title.append(data)
        blocked = {"nav", "footer", "script", "style", "button", "blockquote"}
        if any(tag in blocked or attrs.get("aria-hidden") == "true" or
               "lyric-body" in attrs.get("class", "").split()
               for tag, attrs in self.stack):
            return
        if any(tag in {"main", "header"} for tag, _ in self.stack):
            self.text.append(data)


def clean(value):
    return re.sub(r"\s+", " ", str(value)).strip()


def catalogues():
    # Only evaluate the published data declarations, before the render functions.
    node = shutil.which("node")
    if not node:
        raise SystemExit("Node is needed to read the public catalogue arrays.")
    script = """
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('js/wayspace.js', 'utf8').split('function escapeHtml')[0];
const data = vm.runInNewContext(source + '\\nJSON.stringify({MUSIC,VIDEO,DESIGN,PODCASTS,SPEAKING,WRITING,THEMES})', {}, {timeout:1000});
const production = fs.readFileSync('js/production.js', 'utf8').split('function escapeHtml')[0];
const work = vm.runInNewContext(production + '\\nJSON.stringify(WORK)', {}, {timeout:1000});
console.log(JSON.stringify({...JSON.parse(data), WORK:JSON.parse(work)}));
"""
    return json.loads(subprocess.check_output([node, "-e", script], cwd=ROOT, text=True))


def build():
    pages, documents = {}, {}
    sitemap = ET.parse(ROOT / "sitemap.xml")
    for loc in sitemap.findall(".//{*}loc"):
        url = urlsplit(loc.text)
        assert url.scheme == "https" and url.netloc == "jackrome.work"
        path = url.path
        file = ROOT / ("index.html" if path == "/" else path.lstrip("/") + ".html")
        # This allowlist is independent of ignored-file and sitemap mistakes.
        assert file.parent == ROOT or file.is_relative_to(ROOT / "wayspace") or file.is_relative_to(ROOT / "case-studies")
        assert file.resolve().is_relative_to(ROOT)
        source = file.read_text(encoding="utf-8")
        assert not re.search(r'<meta[^>]+content="[^"]*noindex', source)
        page = Page(source)
        assert page.canonical == loc.text
        pages[path] = page
        category = "Lyrics" if path.startswith("/wayspace/writing/") else "Case study" if path.startswith("/case-studies/") else "Wayspace" if path.startswith("/wayspace") else "Services" if path in {"/production", "/ai-enablement"} else "Website"
        documents[path] = dict(url=path, title=clean("".join(page.title)).split(" | ")[0],
                               description=page.description, category=category,
                               keywords="", text=clean(" ".join(page.text)) if category != "Lyrics" else "")

    data = catalogues()
    dynamic_ids = {}
    for key, room in [("MUSIC", "music"), ("VIDEO", "video"), ("DESIGN", "design"), ("PODCASTS", "podcasts"), ("SPEAKING", "speaking"), ("WORK", None)]:
        path = "/wayspace/" + room if room else "/production"
        dynamic_ids[path] = {item["anchor"] for item in data[key] if item.get("anchor")}
        for item in data[key]:
            if item.get("placeholder"):
                continue
            fragment = item["anchor"]
            url = path + "#" + fragment
            assert url not in documents, f"Duplicate guide destination: {url}"
            details = " · ".join(clean(item[k]) for k in ["format", "show", "host", "client", "meta", "year", "date"] if item.get(k))
            documents[url] = dict(url=url, title=item["title"], description=clean(item.get("note") or details),
                                  category=room.title() if room else "Production", keywords=" ".join(item.get("roles", [])), text=details)

    themes = {item["slug"]: item["label"] for item in data["THEMES"]}
    for item in data["WRITING"]:
        href = item.get("href")
        if href in documents:
            documents[href]["keywords"] = " ".join([item["kind"], item.get("meta", ""), *[themes.get(t, t) for t in item.get("themes", [])]])
        elif item.get("kind") != "Lyric":
            # Spoken prose is video inside the Writing room, with an authored anchor.
            url = "/wayspace/writing#" + item["anchor"]
            documents[url] = dict(url=url, title=item["title"], description=item.get("meta", "Spoken prose"), category="Writing", keywords="spoken prose video " + " ".join(item.get("themes", [])), text=item.get("note", ""))
            dynamic_ids.setdefault("/wayspace/writing", set()).add(url.split("#")[1])

    overrides = json.loads((ROOT / "tools/guide-destinations.json").read_text())
    for entry in overrides:
        url = entry["url"]
        if url in documents:
            documents[url].update(entry)
        else:
            documents[url] = {"text": "", "keywords": "", **entry}

    for document in documents.values():
        url = urlsplit(document["url"])
        assert not url.scheme and not url.netloc and url.path in pages, document["url"]
        if url.fragment:
            assert url.fragment in pages[url.path].ids | dynamic_ids.get(url.path, set()), document["url"]
        if url.query:
            assert url.path == "/wayspace/writing" and url.query in {"collection=wayspace", "collection=feivel-speaks"}
    result = [dict(id=str(i), **d) for i, d in enumerate(documents.values())]
    return json.dumps(result, ensure_ascii=False, separators=(",", ":")) + "\n"


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Fail if the committed index is stale")
    args = parser.parse_args()
    output = build()
    if args.check:
        if not OUTPUT.exists() or OUTPUT.read_text(encoding="utf-8") != output:
            raise SystemExit("Guide index is stale. Run python3 tools/build-guide-index.py")
        print("Guide index is current.")
    else:
        OUTPUT.write_text(output, encoding="utf-8")
        print(f"Guide index: {len(json.loads(output))} destinations, {len(output.encode())} bytes")
