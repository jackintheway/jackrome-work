#!/usr/bin/env python3
"""Refresh the public sitemap from page canonicals. Run from any directory."""
from pathlib import Path
import re
from xml.sax.saxutils import escape

root = Path(__file__).resolve().parent.parent
pages = sorted([*root.glob("*.html"), *root.glob("wayspace/**/*.html"),
                *root.glob("case-studies/*.html")])
urls = set()
for page in pages:
    source = page.read_text(encoding="utf-8")
    if re.search(r'<meta name="robots" content="[^"]*noindex', source):
        continue
    canonical = re.search(r'<link rel="canonical" href="([^"]+)"', source)
    if not canonical:
        raise SystemExit(f"Missing canonical: {page.relative_to(root)}")
    url = canonical.group(1)
    if not url.startswith("https://jackrome.work/") or "?" in url or "#" in url:
        raise SystemExit(f"Unexpected canonical: {url}")
    if url in urls:
        raise SystemExit(f"Duplicate canonical: {url}")
    urls.add(url)
xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
xml += "".join(f"  <url><loc>{escape(url)}</loc></url>\n" for url in sorted(urls))
xml += '</urlset>\n'
(root / "sitemap.xml").write_text(xml, encoding="utf-8")
print(f"Sitemap: {len(urls)} canonical pages")
