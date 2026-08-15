#!/usr/bin/env bash
#
# Render every share card to assets/img/.
#
# The cards pull the real tokens and the real Archivo file from the site,
# so they have to be served over HTTP rather than opened from disk. This
# starts a server, renders, checks the dimensions, and cleans up.
#
# Run from the repo root:  ./tools/og/render.sh
#
set -euo pipefail

CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT=8642

[ -f "index.html" ] || { echo "Run this from the repo root."; exit 1; }
[ -x "$CHROME" ] || { echo "Chrome not found at $CHROME"; exit 1; }

python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true' EXIT
sleep 2

fail=0
for card in tools/og/card-*.html; do
  name="$(basename "$card" .html)"           # card-home
  out="assets/img/og-${name#card-}.png"      # assets/img/og-home.png

  "$CHROME" --headless --disable-gpu --hide-scrollbars \
    --window-size=1200,630 --virtual-time-budget=4000 \
    --screenshot="$out" \
    "http://127.0.0.1:$PORT/$card" 2>/dev/null

  # A clipped card fails silently, so the size is checked every time.
  w=$(sips -g pixelWidth  "$out" | tail -1 | tr -dc '0-9')
  h=$(sips -g pixelHeight "$out" | tail -1 | tr -dc '0-9')
  kb=$(( $(stat -f%z "$out") / 1024 ))

  if [ "$w" = "1200" ] && [ "$h" = "630" ]; then
    printf "  ok    %-34s %sx%s  %sKB\n" "$out" "$w" "$h" "$kb"
  else
    printf "  WRONG %-34s %sx%s  (expected 1200x630)\n" "$out" "$w" "$h"
    fail=1
  fi
done

exit $fail
