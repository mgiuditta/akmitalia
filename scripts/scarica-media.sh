#!/bin/sh
# Scarica gli originali della libreria WordPress elencati in data/wp-media.json.
# Rieseguibile: salta i file gia presenti. `pnpm media:scarica`
#
# ponytail: il server (IIS) risponde 429 sopra ~3 richieste in parallelo,
# quindi seriale con pausa. 596 file = ~5 minuti, gira una tantum.
# Lo user agent va per esteso: con "Mozilla/5.0" secco il WAF risponde 999.
set -eu
RADICE=$(cd "$(dirname "$0")/.." && pwd)
DEST="$RADICE/data/wp-media"
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
mkdir -p "$DEST"

node -e '
const m = require("'"$RADICE"'/data/wp-media.json");
process.stdout.write(m.map((x) => `${x.url}\t${x.file}\n`).join(""));
' | while IFS="$(printf '\t')" read -r url file; do
  [ -s "$DEST/$file" ] && continue
  if curl -sS -f -L --retry 3 --retry-all-errors --retry-delay 5 \
       -A "$UA" -o "$DEST/$file" "$url"; then
    printf '.'
  else
    rm -f "$DEST/$file"
    echo "\nFAIL $url"
  fi
  sleep 0.4
done
echo "\nfile presenti: $(ls "$DEST" | wc -l | tr -d ' ') / $(node -e 'console.log(require("'"$RADICE"'/data/wp-media.json").length)')"
