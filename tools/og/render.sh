#!/usr/bin/env bash
#
# Render share cards to assets/img/.
#
# The cards pull the real tokens and the real Archivo file from the site,
# so they have to be served over HTTP rather than opened from disk. This
# starts a server, renders, checks each result, and cleans up.
#
# Run from the repo root:
#   ./tools/og/render.sh                      every card
#   ./tools/og/render.sh card-home [...]      only the named cards
#
# Rendering one card keeps the other PNGs out of the diff. That matters
# most off the Mac: another machine's font rasterizing differs slightly,
# so re-rendering everything there rewrites every image for no reason.
#
# Works on macOS and Linux. Set CHROME to a browser binary to override
# the search below.
#
set -euo pipefail

PORT=8642

[ -f "index.html" ] || { echo "Run this from the repo root."; exit 1; }

# Prefer a headless shell. Full Chrome and Chromium in their new headless
# mode can reserve part of the window for browser UI, which leaves a
# blank strip across the bottom of a 1200x630 screenshot. The headless
# shell has no UI and renders the full canvas. check-card.py catches the
# strip either way, so a bad browser fails loudly rather than silently.
find_chrome() {
  local c
  for c in \
    "${CHROME:-}" \
    "$(command -v chrome-headless-shell || true)" \
    /opt/pw-browsers/chromium_headless_shell-*/chrome-linux/headless_shell \
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    "$(command -v google-chrome || true)" \
    "$(command -v chromium || true)" \
    "$(command -v chromium-browser || true)"; do
    [ -n "$c" ] && [ -x "$c" ] && { echo "$c"; return; }
  done
}
CHROME="$(find_chrome)"
[ -n "$CHROME" ] || { echo "No Chrome or Chromium found. Set CHROME=/path/to/binary."; exit 1; }

# Pick the cards before starting anything, so a typo fails fast.
cards=()
if [ $# -eq 0 ]; then
  cards=(tools/og/card-*.html)
else
  for name in "$@"; do
    name="$(basename "${name%.html}")"
    card="tools/og/${name}.html"
    [ -f "$card" ] || { echo "No such card: $card"; exit 1; }
    cards+=("$card")
  done
fi

# --no-sandbox is needed when running as root, which cloud sandboxes do.
flags=(--headless --disable-gpu --hide-scrollbars
       --window-size=1200,630 --virtual-time-budget=4000)
[ "$(id -u)" = "0" ] && flags+=(--no-sandbox)

python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &
SERVER=$!
trap 'kill $SERVER 2>/dev/null || true' EXIT
sleep 2

echo "Rendering with $CHROME"
outs=()
for card in "${cards[@]}"; do
  name="$(basename "$card" .html)"           # card-home
  out="assets/img/og-${name#card-}.png"      # assets/img/og-home.png
  # Preserve the published image: immutable URLs need a new filename.
  if [ "$name" = "card-ai-portfolio" ]; then out="assets/img/og-ai-portfolio-v2.png"; fi

  "$CHROME" "${flags[@]}" --screenshot="$out" \
    "http://127.0.0.1:$PORT/$card" >/dev/null 2>&1
  outs+=("$out")
done

# A clipped card is still 1200x630, so the size alone proves nothing.
# check-card.py also confirms the border reaches all four edges.
python3 tools/og/check-card.py "${outs[@]}"
