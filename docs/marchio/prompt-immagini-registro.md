# Le immagini del registro nuovo: cosa generare, e cosa non si genera

Aperto da #46, dopo che «Il Sigillo» ha vinto #35. Il kit di #17
(`prompt-media-home.md`) resta valido per le trame e i pittogrammi: questo
documento aggiunge il livello che manca, cioe' l'immagine **editoriale**, quella
che sta in pagina a corpo pieno e non al 5% dietro il titolo.

## La regola che decide tutto: niente persone generate

`PRODUCT.md` vieta le foto stock, e una persona inventata dall'AI e' peggio di
una comprata: e' finta **e** potrebbe essere qualunque palestra. Il Principio 1
dice «Presenza prima del marchio», il Principio 4 dice che le credenziali sono
prove, e l'anti-reference 4 e' esattamente «stock photo di gente che sorride».
Un adulto generato che si allena in una palestra generata contraddice le tre
cose insieme, su un sito la cui unica leva e' che i nomi, gli indirizzi e i
volti sono veri e verificabili.

Quindi: **volti, corpi e mani generati non entrano**, nemmeno di spalle,
nemmeno sfocati. Le persone arrivano dalle foto vere del cliente (#37) o non
arrivano, e se non arrivano il sito resta in piedi, che e' un vincolo della
mappa #34.

Resta generabile, e onesto, tutto il resto: **il luogo senza nessuno dentro** e
**il materiale grafico**.

## Cosa c'e' davvero nei media del cliente

596 immagini in `data/wp-media/`, e dicono una cosa sola con molta coerenza.
Vale la pena guardarle prima di scrivere un prompt, perche' il registro
fotografico di AKM esiste gia' e non e' quello che un modello produce da solo
alla parola «krav maga».

Riferimenti utili da allegare al prompt:

- `3582-Krav_Maga_AKM_ITALIA_Abano.jpg` — palestra scolastica: parquet con le
  righe del campo di pallacanestro, spalliere svedesi, striscioni degli sponsor
  in alto, materassini rossi bassi a parete, neon.
- `5930-...-corso-tecnico-calci-e-pugni-bollate.jpg` — pallone pressostatico,
  erba sintetica verde, allenamento a coppie.
- `5105-IMG_6232.jpg` — tatami a puzzle nero, luce al neon piatta.
- `3104-stage-Bovisio_2014.jpg` — sala con pavimento in linoleum azzurro.

Il vocabolario ricorrente: **parquet con le righe del campo, spalliere, neon,
tatami a puzzle nero, materassini a parete, striscioni**. Nessun controluce,
nessun fumo, nessun ring, nessun sacco appeso in penombra. Sono palestre
comunali e parrocchiali, ed e' il motivo per cui il sito puo' dire «vicino a
casa» senza mentire.

## Il blocco di vincoli fotografici, da incollare in fondo a ogni prompt di luogo

```
Empty room, absolutely no people, no faces, no hands, no silhouettes, no
figures in the background. No text, no signage, no lettering, no logos, no
banners with writing, no numbers. Flat even overhead fluorescent light, no
dramatic backlight, no rim light, no lens flare, no bloom, no haze, no smoke.
No black-and-red palette, no teal-and-orange grade, no vignette, no tilt-shift.
Ordinary Italian municipal gymnasium, worn but clean and cared for, not a
premium fitness club, not a boxing gym, not a dojo. Documentary photography,
eye-level, 35mm, deep focus, neutral white balance, muted natural colors.
```

Le prime due righe sono quelle che vanno controllate a occhio sul risultato: i
modelli mettono figure in fondo alla sala anche quando gli si e' detto di non
farlo, e scrivono lettere storte su ogni striscione.

## 1. Apertura della home — la sala vuota, la sera

L'immagine grossa, quella che in A viene ritagliata dall'arco. Non racconta chi
si allena: racconta **dove**, che e' l'unica promessa che il sito puo'
mantenere prima che arrivino le foto vere.

| Genera a | Consegna | Formato | Peso max |
|---|---|---|---|
| 2048×1536 (4:3) | 1600×1200 | WebP | 180 KB |

```
photograph of an empty Italian municipal school gymnasium in the evening,
light wood parquet floor with painted basketball and volleyball court lines in
red and blue, wooden wall bars along the far wall, low red padded crash mats
fixed to the wall, pale cream painted walls, rows of fluorescent ceiling
tubes on, high small windows dark with night outside, the room is waiting and
completely empty, wide shot from the corner at eye level
```

**Il soggetto sta nel 70% centrale.** L'arco che la ritaglia mangia gli angoli:
se la cosa che rende l'immagine leggibile (le spalliere, le righe del campo) sta
sul bordo, sparisce. Genera quattro provini e scarta quelli con la composizione
schiacciata a destra.

## 2. Il pavimento — la texture che vale piu' di una veduta

Serve come fascia bassa e come fondo di sezione, dove una veduta intera sarebbe
troppo. E' anche l'immagine piu' sicura da generare, perche' non ha ne'
prospettiva ne' oggetti da sbagliare.

| Genera a | Consegna | Formato | Peso max |
|---|---|---|---|
| 2048×1152 (16:9) | 1600×900 | WebP | 120 KB |

```
close overhead photograph of a worn light wood parquet gymnasium floor, painted
court lines in faded red and blue crossing the frame diagonally, visible wood
grain and scuff marks from years of use, flat even fluorescent light, no
objects, no shadows of people
```

## 3. La placca grafica a scala di pagina

Questa non e' fotografia ed e' il materiale che #41 chiede: la lingua del
sigillo, ma **forte**, non al 5%. In A c'e' gia' l'anello disegnato in SVG, che
resta la struttura: questa placca e' il pieno che ci sta dietro o accanto.

| Genera a | Consegna | Formato | Peso max |
|---|---|---|---|
| 2048×2048 | 1600×1600 | PNG | 120 KB |

Riferimento da allegare: `docs/marchio/stemma-fondo-nero.jpeg`.

```
large scale graphic plate derived from a circular seal: concentric rings and
interrupted arcs of very different stroke weights, from hairline to very thick,
overlapping off-center and running off the edges of the frame, ink #161d17 and
exactly one arc in muted forest green #2f5e3e on a #f7fbf8 paper background,
high contrast, confident and structural, swiss modernist poster, engraved
certificate aesthetic
```

```
Flat vector aesthetic. No gradient, no glow, no drop shadow, no bevel, no 3D.
No text, no letters, no numbers, no logo, no watermark. No people. No
red-and-black palette. Hairline and heavy strokes only, nothing in between.
```

La differenza con la trama di #17 e' voluta ed e' tutta qui: quella e' **senza
punto focale** perche' ci va sopra un titolo, questa **ha** un punto focale
perche' e' lei l'elemento.

## Cosa deve passare prima che un asset entri in pagina

1. Nessuna persona, nemmeno in fondo alla sala, nemmeno di spalle. Guarda a
   schermo intero, non nella miniatura.
2. Nessuna lettera. I modelli le inventano storte su striscioni e cartelli, e
   questo e' un registro.
3. La palestra somiglia a quelle di `data/wp-media/`, non a una palestra da
   catalogo. Test in una frase: se potrebbe essere la copertina di un
   abbonamento in un centro fitness, e' da scartare.
4. Ritagliata da un arco resta leggibile. Provala con una maschera circolare
   prima di caricarla.
5. Peso entro la colonna della tabella.
