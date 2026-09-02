#!/bin/sh
# Scarica le due famiglie di DESIGN.md in public/font/. Rieseguibile.
#
# Anton (OFL 1.1) e' il display: un peso solo, che rende come il 700 di Kenyan
# Coffee, la faccia commerciale dell'originale Fenriz che non e' licenziabile qui.
# Roboto (Apache 2.0) e' il workhorse: il file variabile copre i pesi 300, 400 e
# 700 in un solo download invece di tre statici.
#
# I .ttf integrali da google/fonts, non i woff2 dell'API di Google Fonts: quella
# serve subset per unicode-range, e il subset va deciso qui, non a valle.
set -eu
DEST=$(cd "$(dirname "$0")/.." && pwd)/public/font
BASE=https://raw.githubusercontent.com/google/fonts/main/ofl
mkdir -p "$DEST"

scarica() {
  out="$DEST/$2"
  [ -s "$out" ] && return 0
  curl -sSL -f -o "$out" "$BASE/$1" || { rm -f "$out"; echo "FAIL $2"; }
}

scarica anton/Anton-Regular.ttf Anton-Regular.ttf
scarica "roboto/Roboto%5Bwdth,wght%5D.ttf" Roboto-Variable.ttf

# Roboto in due istanze statiche, per la sola immagine di condivisione: il
# compositore di next/og (satori) non sa leggere la tabella `fvar` di un file
# variabile e si ferma con «Cannot read properties of undefined». Il sito
# continua a usare il variabile, che nel browser va benissimo.
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
