#!/usr/bin/env python3
"""Check a rendered share card: 1200x630, and the whole card on the canvas.

Every card draws a 14px black border around its edge. A render that clips
the page (a headless browser whose viewport is shorter than its window, a
card that overflows) still produces a 1200x630 PNG, so the size check alone
passes a broken card. Sampling the border on all four sides catches it: a
clipped card shows white where the bottom border should be.

Standard library only, so it runs the same on the Mac and in a cloud
sandbox with no Pillow, sips or ImageMagick.

Usage: python3 tools/og/check-card.py assets/img/og-home.png [...]
Exits non-zero if any card fails.
"""

import os
import struct
import sys
import zlib

WIDTH, HEIGHT = 1200, 630
BORDER = 14
DARK = 60  # every channel below this counts as the border's black


def decode_png(path):
    """Return (width, height, rows) with rows as lists of (r, g, b)."""
    with open(path, "rb") as f:
        data = f.read()
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("not a PNG")

    pos, idat, header = 8, b"", None
    while pos < len(data):
        length, kind = struct.unpack(">I4s", data[pos:pos + 8])
        body = data[pos + 8:pos + 8 + length]
        if kind == b"IHDR":
            header = struct.unpack(">IIBBBBB", body)
        elif kind == b"IDAT":
            idat += body
        elif kind == b"IEND":
            break
        pos += 12 + length

    w, h, depth, color, _, _, interlace = header
    channels = {2: 3, 6: 4}.get(color)
    if depth != 8 or channels is None or interlace:
        raise ValueError(f"unsupported PNG format (depth {depth}, color type {color})")

    raw = zlib.decompress(idat)
    stride = w * channels
    rows, prev = [], bytearray(stride)
    for y in range(h):
        start = y * (stride + 1)
        kind = raw[start]
        line = bytearray(raw[start + 1:start + 1 + stride])
        for i in range(stride):
            a = line[i - channels] if i >= channels else 0
            b = prev[i]
            c = prev[i - channels] if i >= channels else 0
            if kind == 1:
                line[i] = (line[i] + a) & 255
            elif kind == 2:
                line[i] = (line[i] + b) & 255
            elif kind == 3:
                line[i] = (line[i] + (a + b) // 2) & 255
            elif kind == 4:
                p = a + b - c
                pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
                pred = a if pa <= pb and pa <= pc else (b if pb <= pc else c)
                line[i] = (line[i] + pred) & 255
        rows.append([tuple(line[x * channels:x * channels + 3]) for x in range(w)])
        prev = line
    return w, h, rows


def check(path):
    kb = os.path.getsize(path) // 1024
    try:
        w, h, rows = decode_png(path)
    except (OSError, ValueError, zlib.error) as err:
        return False, f"unreadable ({err})"
    if (w, h) != (WIDTH, HEIGHT):
        return False, f"{w}x{h}  (expected {WIDTH}x{HEIGHT})"

    mid = BORDER // 2
    samples = {
        "top": [(x, mid) for x in range(20, w - 20, 60)],
        "bottom": [(x, h - 1 - mid) for x in range(20, w - 20, 60)],
        "left": [(mid, y) for y in range(20, h - 20, 30)],
        "right": [(w - 1 - mid, y) for y in range(20, h - 20, 30)],
    }
    missing = [side for side, points in samples.items()
               if any(max(rows[y][x]) >= DARK for x, y in points)]
    if missing:
        return False, f"{w}x{h}  border missing on {', '.join(missing)} (card clipped?)"
    return True, f"{w}x{h}  {kb}KB"


def main(paths):
    fail = False
    for path in paths:
        ok, detail = check(path)
        print(f"  {'ok   ' if ok else 'WRONG'} {path:<48} {detail}")
        fail = fail or not ok
    return 1 if fail else 0


if __name__ == "__main__":
    if len(sys.argv) < 2:
        sys.exit(__doc__.strip().splitlines()[-2])
    sys.exit(main(sys.argv[1:]))
