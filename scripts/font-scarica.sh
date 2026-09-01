#!/bin/sh
# Scarica le famiglie del sito in public/font/. Rieseguibile.
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

# Archivo, la famiglia della home (#35). Un file variabile e non quattro statici:
# la home usa l'asse `wdth` oltre a `wght`, e la larghezza non e' un vezzo, viene
# dal microtesto dell'anello dello stemma.
#
# Archivo **non ha** `smcp` ne' `c2sc`, verificato sulle feature GSUB del file.
# Percio' il livello Label della home e' maiuscolo vero con tracking, non
# maiuscoletto: la Regola del Maiuscoletto Vero non e' violata, e' ritirata per
# questa famiglia, e #38 la deve ratificare quando rimisura i sette livelli.
ARCHIVO="$DEST/Archivo.ttf"
[ -s "$ARCHIVO" ] || curl -sSL -f -o "$ARCHIVO" \
  'https://github.com/google/fonts/raw/main/ofl/archivo/Archivo%5Bwdth,wght%5D.ttf' \
  || { rm -f "$ARCHIVO"; echo "FAIL Archivo"; }

ls -l "$DEST"
