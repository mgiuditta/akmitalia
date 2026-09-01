# Lo stemma e il logo, e la testata e un lockup

`PRODUCT.md` dava per acquisito un «wordmark AKM ITALIA in verde, bianco e rosso». Il cliente
ha consegnato altro: uno **stemma** circolare, un sigillo con microtesto sull'anello
(«ACADEMY OF KRAV MAGA SELF DEFENSE SYSTEM» sopra, «AKM ITALIA» sotto) e il tricolore come due
archi interni. Due file, entrambi raster, nessun vettoriale: uno su fondo bianco con anello
argento e ombra portata, uno su fondo nero, piatto.

Il cliente ha confermato che il logo e quello e deve essere quello. Non e in discussione.

Decisione: **lo stemma e il logo del sito, e la testata e un lockup di stemma e wordmark
testuale.**

Lo stemma sta a 40px accanto al nome scritto in Fira Sans 900. La divisione del lavoro e
misurata, non stimata: rimpicciolito dall'originale, l'anello si legge a fatica a 128px, a 48px
e un disco e a 24px non esiste. Il nome, dentro lo stemma, sarebbe scritto dove nessuno lo
legge. Quindi lo stemma porta il **riconoscimento** e il testo porta il **nome**, e nessuno dei
due fa il lavoro dell'altro.

L'alternativa era il solo wordmark testuale, che e quello che la testata aveva. Scartata dal
cliente, ed e una scelta legittima: un ente che tiene un albo ha un sigillo, e il sigillo dice
«questo e ufficiale» meglio di quanto lo dica un carattere tipografico.

Il file usato e la **versione su fondo nero**, non quella su bianco: e piatta, mentre l'altra
porta un gradiente e un'ombra portata, che `DESIGN.md` vieta entrambi. Il fondo e stato tolto
con un riempimento dai quattro angoli e il risultato e un PNG a 256px con trasparenza, importato
staticamente e servito da `next/image`.

## Conseguenze

- La **Regola della Bandiera Smontata** cambia enunciato, non sostanza: il tricolore intero vive
  nel **marchio** — stemma e wordmark insieme — e in nessun altro punto della pagina. I tre
  ruoli di colore restano separati ovunque altro, uno alla volta.
- Il `alt` dello stemma e **vuoto**: il nome e gia nel testo accanto, e ripeterlo lo farebbe
  leggere due volte a uno screen reader. Lo stemma non e un'informazione, e un segno.
- La **favicon** non e lo stemma: a 32px l'anello e un impasto. E il ritaglio circolare del solo
  glifo centrale con gli archi tricolore, su fondo Carta, in `icon.png`.
- In `forced-colors: active` lo stemma resta com'e: un raster non si inverte. Nessuna
  informazione ci vive dentro, quindi degrada senza perdite.
- Il **vettoriale non esiste e non arrivera**: il cliente ha consegnato tutto quello che ha, due
  JPEG. Non e un debito in attesa, e un vincolo. Il marchio del sito resta un raster ricavato da
  un JPEG, e va bene cosi: gli usi veri sono la testata a 40px, la favicon a 32 e un giorno
  l'`og:image` a poche centinaia di pixel, e i 1600px della fonte li coprono tutti con margine.
  Il vettoriale servirebbe alla stampa grande, che non e lavoro di questo sito.
- Gli **originali del cliente stanno nel repository**, in `docs/marchio/`. Sono l'unica fonte che
  esiste: nessun archivio da cui riscaricarli, e nessuno a cui richiederli una seconda volta.
- L'`og:image` per la condivisione non e fatto. Quando si fara, lo stemma e l'asset giusto, ed e
  li che la versione grande serve davvero.

## Come e stato ricavato

Dall'originale in `docs/marchio/stemma-fondo-nero.jpeg` (JPEG 1600x1600, fondo nero opaco):

```sh
magick docs/marchio/stemma-fondo-nero.jpeg -alpha set -fuzz 15% -fill none \
  -draw 'color 2,2 floodfill' -draw 'color 1597,2 floodfill' \
  -draw 'color 2,1597 floodfill' -draw 'color 1597,1597 floodfill' \
  -trim +repage -resize 256x256 -strip 'src/app/(frontend)/stemma.png'
```

La favicon e il ritaglio circolare del solo glifo: `-gravity center -crop 1000x1000+0+0`, una
maschera a cerchio in `CopyOpacity`, fondo Carta `#f7fbf8`, 180x180, in
`src/app/(frontend)/icon.png`. Entrambi si rigenerano da questi comandi: la fonte e nel repository, quindi non serve nessuno.
