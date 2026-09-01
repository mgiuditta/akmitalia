# Kit media della home: cosa generare, con che misure, con che prompt

Deciso in #17. Lingua visiva unica: **tesserino / stampa di sicurezza**, cioe' archi
concentrici e rosette a filo sottile derivati dallo stemma circolare del cliente. Nessuna
fotografia, nessuna figura umana, nessun testo dentro le immagini.

Le immagini si generano fuori (Gemini), si caricano in `Media` e sono editabili dall'admin.
Il codice tiene un asset di default in repo e usa quello di Payload solo se c'e': senza
fallback un file sbagliato caricato dall'admin spegne l'hero e nessuno se ne accorge.

## Le misure, che sono la parte che non si puo' sbagliare

| Asset | Genera a | Consegna | Formato | Peso max | Dove va |
|---|---|---|---|---|---|
| Trama hero (piastrella ripetibile) | 2048×2048 | 1024×1024 | PNG | 60 KB | fascia dell'hero, `background-repeat`, opacita' 5% |
| Fondo pagina (grana di carta, ripetibile) | 1024×1024 | 1024×1024 | PNG | 30 KB | fondo di pagina, opacita' 3%, spento sotto le sezioni dense |
| Sfondo OG (card di condivisione) | 2400×1260 | **1200×630 esatti** | JPEG | 300 KB | sfondo della card; il testo lo compone `next/og` |
| Pittogramma percorso ×3 | 1024×1024 | 512×512 | PNG trasparente | 10 KB l'uno | accanto alle voci del bivio, reso a 24–32px |

Note che valgono piu' dei prompt:

- **1200×630 e' uno standard, non un gusto**: sotto 600×315 le anteprime non si aprono, e
  WhatsApp e Telegram vogliono JPEG o PNG, non WebP.
- **Le due piastrelle devono essere seamless davvero.** Provale affiancate prima di caricarle:
  se si vede la giunta, la si vede ripetuta venti volte in pagina.
- **I pittogrammi vivono a 24–32px.** Un disegno che a 512 e' bellissimo e a 24 e' una macchia
  ha fallito: guardali rimpiccioliti prima di consegnarli.
- `Media` genera da sola le taglie webp 400/800/1600 e **chiede l'alt obbligatorio**. Per gli
  asset decorativi scrivi comunque una descrizione: il codice li rende con `alt` vuoto perche'
  non portano informazione, ma il campo resta compilato per chi guarda l'admin.

## Il blocco di vincoli, da incollare in fondo a ogni prompt

```
Palette, use these exact values only:
paper #f7fbf8, high paper #fdfffe, ink #161d17, graphite #606761,
rule #b5bbb6, forest green #2f5e3e, brick red #883f2c.
Flat vector aesthetic. No gradient, no glow, no drop shadow, no bevel, no 3D,
no lens flare, no vignette. No text, no letters, no numbers, no logo, no
watermark. No people, no faces, no hands, no weapons. No red-and-black
palette. Printed document aesthetic, hairline strokes, generous empty space.
```

## 1. Trama hero — 2048×2048, consegna 1024×1024 PNG

Riferimento da allegare: `docs/marchio/stemma-fondo-nero.jpeg` (l'anello e gli archi).

```
/pattern 'seamless tileable guilloche pattern in the style of security printing on an
official membership card: fine concentric arcs, interrupted rings and rosette lines,
derived from a circular seal, hairline strokes at 0.5px in #b5bbb6 over a #f7fbf8 paper
background, extremely low contrast, mathematical and geometric, evenly distributed with
no focal point, must tile seamlessly on all four edges' --count=4
```

Perche' «no focal point»: la fascia dell'hero e' larga e il titolo ci sta sopra. Una trama
con un centro forte diventa una macchia dietro una parola sola.

## 2. Fondo pagina — 1024×1024 PNG ripetibile

```
/pattern 'seamless tileable uncoated paper texture, subtle laid-paper fibers and fine
grain, warm neutral tinted toward green, base color #f7fbf8, ultra low contrast, designed
to be used as a 3% opacity overlay, flat even lighting, no visible seams, no objects,
no pattern motif' --count=3
```

## 3. Sfondo della card di condivisione — 1200×630 JPEG

Riferimenti da allegare: `docs/marchio/stemma-fondo-nero.jpeg` e lo screenshot della pagina
centri, come riferimento di stile e non di contenuto.

```
/generate 'wide 1200x630 banner background derived from a circular seal: large concentric
rings and interrupted arcs entering from the right edge, off-center composition, hairline
strokes in #161d17 and #b5bbb6 on a #f7fbf8 paper background, exactly one arc in muted
forest green #2f5e3e, swiss modernist graphic design, printed certificate aesthetic, the
left two thirds of the frame deliberately empty and uniform for typography to be added
later' --aspect=16:9 --count=4
```

Il vuoto a sinistra non e' pigrizia: il titolo e il nome del centro ci vanno sopra, composti
in Fira Sans vera da `next/og`. Se il modello riempie quella zona, l'immagine e' da scartare.

## 4. I tre pittogrammi — 1024×1024, consegna 512×512 PNG trasparente

Tre generazioni separate, perche' devono essere tre file. Stessa lingua, tre forme distinte:

```
/icon 'abstract geometric mark derived from a circular seal: three concentric complete
arcs, 2px uniform stroke weight, ink #161d17 on transparent background, centered, no
frame, no fill, must remain legible at 24px' --sizes='512' --type='ui'
```

```
/icon 'abstract geometric mark derived from a circular seal: two concentric arcs, the
inner one interrupted at the top, 2px uniform stroke weight, ink #161d17 on transparent
background, centered, no frame, no fill, must remain legible at 24px' --sizes='512'
--type='ui'
```

```
/icon 'abstract geometric mark derived from a circular seal: one thick arc and one thin
arc forming an open ring with a wide gap on the right, 2px uniform stroke weight, ink
#161d17 on transparent background, centered, no frame, no fill, must remain legible at
24px' --sizes='512' --type='ui'
```

I tre segni si distinguono per **numero e interruzione degli archi**, mai per colore: la
Regola dell'Etichetta vieta che un percorso sia riconoscibile dal solo colore, e i
pittogrammi stanno accanto al target gia' scritto, non al suo posto.

## Cosa deve passare prima che un asset entri in pagina

1. La piastrella e' seamless (affiancata quattro volte, nessuna giunta visibile).
2. Il titolo dell'hero sopra la trama al 5% passa ancora 4,5:1. Si misura, non si guarda.
3. Il pittogramma a 24px e' ancora distinguibile dagli altri due.
4. Nessuna lettera dentro l'immagine: i modelli le inventano storte, e questo e' un registro.
5. Peso entro la colonna della tabella. Un hero di sera in 4G non aspetta 300 KB di trama.
