#!/bin/sh
# PROTOTIPO USA E GETTA — issue #35. Scarica le famiglie in prova in public/font/.
#
# Quattro file variabili, uno per famiglia: il prototipo mette in prova famiglie
# intere, non pesi, e un variabile evita di scegliere i pesi prima di aver
# scelto la famiglia. Se una direzione vince, il ticket #38 rifa' il subset.
#
#   Archivo             direzione A, asse wdth oltre a wght
#   Space Grotesk       direzione B
#   Bricolage Grotesque direzione C, display
#   Newsreader          direzione C, testo
set -eu
DEST=$(cd "$(dirname "$0")/.." && pwd)/public/font
BASE=https://github.com/google/fonts/raw/main/ofl
mkdir -p "$DEST"

scarica() { # <nome-locale> <percorso-remoto>
  out="$DEST/$1.ttf"
  [ -s "$out" ] && return 0
  curl -sSL -f -o "$out" "$BASE/$2" || { rm -f "$out"; echo "FAIL $1"; }
}

scarica Archivo             'archivo/Archivo%5Bwdth,wght%5D.ttf'
scarica SpaceGrotesk        'spacegrotesk/SpaceGrotesk%5Bwght%5D.ttf'
scarica BricolageGrotesque  'bricolagegrotesque/BricolageGrotesque%5Bopsz,wdth,wght%5D.ttf'
scarica Newsreader          'newsreader/Newsreader%5Bopsz,wght%5D.ttf'

ls -l "$DEST"
