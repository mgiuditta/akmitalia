#!/bin/sh
# Scarica le tre candidate di #6 in public/prototipo-font/. Rieseguibile: salta i file presenti.
#
# I .ttf integrali da google/fonts, non i woff2 dell'API di Google Fonts: l'API
# serve subset per unicode-range che buttano via i glifi small cap senza codepoint
# proprio, ed e' esattamente il difetto che #6 deve giudicare (docs/research/font-candidate.md).
#
# ponytail: nessun subset, nessuna conversione woff2. E' un prototipo locale,
# i byte non contano; il vero costo di produzione sta gia' misurato nella ricerca.
set -eu
DEST=$(cd "$(dirname "$0")/.." && pwd)/public/prototipo-font
BASE=https://github.com/google/fonts/raw/main/ofl
mkdir -p "$DEST"

scarica() {
  [ -s "$DEST/$2" ] && return 0
  curl -sSL -f -o "$DEST/$2" "$BASE/$1" || { rm -f "$DEST/$2"; echo "FAIL $1"; }
}

scarica 'sourcesans3/SourceSans3%5Bwght%5D.ttf' SourceSans3.ttf
scarica 'notosans/NotoSans%5Bwdth,wght%5D.ttf' NotoSans.ttf
for p in Light:300 Regular:400 Medium:500 SemiBold:600 Bold:700 Black:900; do
  scarica "firasans/FiraSans-${p%%:*}.ttf" "FiraSans-${p##*:}.ttf"
done

ls -l "$DEST"
