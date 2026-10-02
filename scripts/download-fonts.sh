#!/bin/sh
# Scarica i font del sito in public/font/. Rieseguibile.
#
# Anton (OFL 1.1) e' il display: un peso solo, che rende come il 700 di Kenyan
# Coffee, la faccia commerciale dell'originale Fenriz che non e' licenziabile qui.
# Archivo (OFL 1.1) e' il testo: public/font/Archivo-Variable.woff2 e' un subset
# latino del variabile wght+wdth, fatto una volta con fontTools e committato:
#   pyftsubset 'Archivo[wdth,wght].ttf' --flavor=woff2 --layout-features='*' \
#     --unicodes='U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215'
#
# I .ttf integrali da google/fonts, non i woff2 dell'API di Google Fonts: quella
# serve subset per unicode-range, e il subset va deciso qui, non a valle.
set -eu
DEST=$(cd "$(dirname "$0")/.." && pwd)/public/font
BASE=https://raw.githubusercontent.com/google/fonts/main/ofl
mkdir -p "$DEST"

download() {
  out="$DEST/$2"
  [ -s "$out" ] && return 0
  curl -sSL -f -o "$out" "$BASE/$1" || { rm -f "$out"; echo "FAIL $2"; }
}

download anton/Anton-Regular.ttf Anton-Regular.ttf

# Roboto in due istanze statiche, per la sola immagine di condivisione: il
# compositore di next/og (satori) non sa leggere la tabella `fvar` di un file
# variabile e si ferma con «Cannot read properties of undefined». Il sito usa
# Archivo; l'immagine di condivisione resta in Roboto finche' non serve altro.
#
# Le istanze non stanno su google/fonts, che pubblica solo il variabile. Le
# serve l'API v1 di Google Fonts interrogata con uno user agent vecchio: a un
# browser che non conosce woff2 risponde in .ttf.
statica() {
  out="$DEST/Roboto-$2.ttf"
  [ -s "$out" ] && return 0
  url=$(curl -sSL -A "Mozilla/4.0" "https://fonts.googleapis.com/css?family=Roboto:$1" |
    sed -n 's/.*url(\(https[^)]*\.ttf\)).*/\1/p' | head -1)
  [ -z "$url" ] && { echo "FAIL Roboto-$2.ttf (nessuna URL)"; return 0; }
  curl -sSL -f -o "$out" "$url" || { rm -f "$out"; echo "FAIL Roboto-$2.ttf"; }
}

statica 400 Regular
statica 700 Bold

ls -l "$DEST"
