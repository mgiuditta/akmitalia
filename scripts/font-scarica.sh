#!/bin/sh
# Scarica Fira Sans, la famiglia scelta in #6, in public/font/. Rieseguibile.
#
# Quattro pesi e non sei: 400 Body, 500 Title e Label, 700 Headline, 900 Display.
# Circa 133 KB in woff2 subset latin.
#
# I .ttf integrali da google/fonts, non i woff2 dell'API di Google Fonts: quella
# serve subset per unicode-range che buttano via i glifi small cap senza codepoint
# proprio, e il livello Label vive sul maiuscoletto vero (docs/research/font-candidate.md).
set -eu
DEST=$(cd "$(dirname "$0")/.." && pwd)/public/font
BASE=https://github.com/google/fonts/raw/main/ofl/firasans
mkdir -p "$DEST"

for p in Regular:400 Medium:500 Bold:700 Black:900; do
  out="$DEST/FiraSans-${p##*:}.ttf"
  [ -s "$out" ] && continue
  curl -sSL -f -o "$out" "$BASE/FiraSans-${p%%:*}.ttf" || { rm -f "$out"; echo "FAIL ${p%%:*}"; }
done

ls -l "$DEST"
