# Prompt per le immagini del sito

Come si generano (o si commissionano) le foto del sito. Un **blocco di stile** fisso, una
**lista di negativi** fissa, e un prompt per ogni posto del sito che chiede un'immagine.

## Avvertenza, prima dei prompt

`PRODUCT.md` vieta le foto stock, e il primo principio e' **Presenza**: ogni sezione dovrebbe
poter nominare un luogo o una persona vera. Una foto generata di persone che non esistono, in
una palestra che non esiste, viola quel principio piu' di una stock: e' una stock senza
nemmeno la liberatoria. Quindi:

- **Uso legittimo**: mockup e prototipi finche' non arrivano le foto vere; sfondi e trame
  senza volti; segni astratti; card di condivisione.
- **Uso da evitare**: volti riconoscibili spacciati per istruttori o allievi AKM, e qualunque
  immagine accanto al nome proprio di una sede o di una persona.
- **Uso migliore**: questi prompt come **brief per lo scatto vero** nei centri. Sono scritti
  per funzionare in tutti e due i modi, e la sezione «Regia» di ognuno vale per un fotografo
  esattamente come per un modello.

I prompt sono in inglese perche' i modelli rendono meglio; le note restano in italiano.

## Blocco di stile (da anteporre sempre)

```
Documentary reportage photograph, ordinary Italian municipal gym interior: painted block
walls, worn tatami mats, high windows. Available light only, no flash, no rim light, no haze.
Muted, matte, low-contrast grade: shadows tinted deep green-black, highlights warm paper
white, mid-tones desaturated. Fine 400-ISO film grain. 35mm lens, eye level, honest
perspective, deep enough focus that the room stays readable. Adults of mixed ages and
ordinary body types, plain unbranded training clothes. Mid-action, never peak-action;
expressions concentrated and calm, never grimacing or aggressive. The gym looks used, not
glamorous. Photojournalism, not advertising.
```

## Negativi (da anteporre sempre)

```
no black-and-red tactical grading, no backlit silhouette punches, no smoke or haze, no lens
flare, no gritty HDR clarity, no heavy vignette, no motion-blur streaks, no shallow bokeh
glamour, no stock-photo smiles, no fitness-model physiques, no camo, no skulls, no stencil
lettering, no weapons pointed at camera, no blood, no fear on faces, no Italian flag or
green-white-red bands in frame, no text, no watermark, no logos.
```

Il divieto della bandiera non e' pudore: e' la **Regola della Bandiera Smontata** di
`DESIGN.md`. Il tricolore vive solo nel marchio, mai dentro una foto.

## I posti del sito

### 1. Home, testata (`akm-trama-hero` come sfondo, foto come alternativa)

Formato 2400x1200 (2:1). Regia: **spazio negativo a sinistra** per «Difendersi si impara.
Vicino a casa.». La foto non deve raccontare uno scontro: deve raccontare una sala dove si
sta imparando.

```
Wide interior of a krav maga class in progress, seen from the back of the room. Six to eight
adults in pairs, working a slow technique drill; an instructor in the middle distance is
correcting one pair with a hand on the shoulder. The left third of the frame is empty floor
and wall. Nobody looks at the camera.
```

### 2. Bivio dei percorsi, voce «Adulti» (Krav Maga)

Formato 1200x900 (4:3). Regia: **due persone**, tecnica di sblocco da presa, il momento della
spiegazione e non quello del colpo.

```
Two adults in their forties practising a wrist-release technique face to face on a mat, both
looking down at the grip they are working on. Neutral t-shirts. One is visibly a beginner:
posture uncertain, following rather than performing.
```

### 3. Bivio dei percorsi, voce «Bambini» (Antibullismo)

Formato 1200x900. Regia: **niente combattimento**. Il genitore che guarda questa foto cerca
ambiente sicuro, non un figlio che picchia.

```
Children aged eight to eleven sitting in a loose semicircle on the mat, listening to an
instructor kneeling at their level. A few are laughing; one is raising a hand. Gym bags and
water bottles along the wall behind them.
```

### 4. Bivio dei percorsi, voce «Donne» (Antiaggressione femminile)

Formato 1200x900. Regia: il tema e' **competenza**, non minaccia. Nessun aggressore
maschile incombente, nessuna scena notturna, nessun parcheggio.

```
A woman in her thirties practising a palm-strike on a hand-held pad, in a bright gym, mid
morning. The instructor holding the pad is partially out of frame; the woman's stance and
gaze are steady and technical. Other women wait their turn at the edge of the mat, talking.
```

### 5. Pagina del corso, immagine di spalla

Formato 1000x1250 (4:5), verticale, sta nella colonna stretta. Regia: **dettaglio**, non
scena. Serve a dare consistenza alla pagina senza rubare la scena al testo.

```
Close detail of hands wrapping a training pad strap, forearms only, tatami and worn gym floor
out of focus behind. Skin, fabric and vinyl textures readable. No face in frame.
```

Varianti dello stesso taglio, una per corso: scarpe da ginnastica su tatami consumato; un
paio di guanti da colpitore appoggiati a bordo materassino; una fila di zaini contro il muro.

### 6. Scheda del centro (sede)

Formato 1600x1000. Regia: **il luogo, vuoto o quasi**. La scheda sede porta indirizzo e
orari come prova; la foto deve dire «questa e' la sala vera», non «guarda che atleti».

```
Empty training hall before class: mats laid out, lights on, one person unlocking equipment
cupboards at the far end. Wall clock, radiators, a fire-exit sign. Plain, honest, slightly
too bright. Architectural framing, camera square to the back wall.
```

Se la sede vera non e' fotografabile, **meglio nessuna immagine**: indirizzo e orari fanno
gia' il lavoro. Una sala generata per una sede reale e' l'unico caso in cui questa pagina
mente.

### 7. Albo istruttori, ritratto

Formato 1000x1250 (4:5). Regia: ritratto **da tesserino, fatto bene**: frontale, luce
morbida, sfondo la palestra vera fuori fuoco. Mai posa da locandina, mai braccia incrociate.

```
Environmental portrait of a martial arts instructor, chest-up, standing in their own gym,
facing the camera with a neutral composed expression. Soft window light from the side. The
gym is legible but out of focus behind. No crossed arms, no props, no posing.
```

**Solo da scatto reale.** Un volto generato accanto a un nome proprio e a una qualifica
CSEN-CONI e' una falsificazione, non una scelta estetica.

### 8. News ed eventi

Formato 1600x900. Regia: **cronaca**. Un seminario e' gente in fila che guarda una
dimostrazione, non un poster.

```
A seminar in a large hall: forty people standing in a wide circle watching two instructors
demonstrate in the centre. Shot from within the circle, over the shoulders of the watchers.
Some are filming with phones.
```

### 9. Card di condivisione (Open Graph)

Formato 1200x630. Il codice compone testo e stemma sopra lo sfondo, quindi l'immagine e'
**solo fondo**: nessun volto, nessun soggetto, contrasto basso.

```
Abstract background: concentric thin arcs, off-register print texture on warm paper white,
very low contrast, no gradient, no glow, flat like a letterpress proof.
```

## Prova d'uscita

Prima di caricare qualunque immagine, tre domande. Una risposta sbagliata e' uno scarto,
non una correzione in post.

1. **Sembra una palestra MMA tattica?** (nero, rosso sangue, controluce) Scarta.
2. **Sembra una stock del benessere?** (sorrisi, corpi perfetti, luce dorata) Scarta.
3. **Sta accanto a un nome proprio ed e' generata?** Scarta, o togli l'immagine.

E una quarta, quella che vale per tutto il sito: **se questa foto potrebbe stare sul sito di
qualunque altra palestra d'Italia, non e' la foto giusta.**
