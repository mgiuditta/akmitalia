# Vittorio dentro il sigillo: riferimento e prompt

La home apre su un sigillo di anelli concentrici. Dentro ci andava una fotografia della
palestra: una sala scolastica vuota, che dice «palestra comunale» e non dice krav maga. Va
sostituita con **Vittorio ritagliato**, in tecnica, su fondo trasparente.

## Il riferimento di somiglianza

`docs/marchio/riferimenti/vittorio-riferimento.jpg` — 1200×1881, ritagliato da
`data/wp-media/3583-Vittorio_Omar_Fabrizio.jpg` (4313×2081), l'unico scatto in repo dove
Vittorio e' nitido e a risoluzione utile. E' un ritratto in posa: serve per il **volto e la
corporatura**, non per la posa.

Nel repo non c'e' nessuna foto d'azione di lui. I 596 file di `data/wp-media` sono foto di
gruppo, locandine, e una difesa da coltello passata a filtro «schizzo» con il watermark
sopra. Quindi: o si scatta, o si genera.

## Cosa serve, in una riga

Vittorio a figura intera o tre quarti, **una tecnica sola e leggibile**, fondo trasparente,
2048×2048 PNG, il soggetto che sta dentro un cerchio senza che mani o piede escano.

## Vincoli che non sono opzionali

- **Deve stare in un cerchio.** Il ritaglio va composto dentro un cerchio inscritto nel
  quadrato: se il piede del calcio tocca lo spigolo, in pagina viene tagliato. Tieni un
  margine del 6% su ogni lato.
- **Niente armi.** Coltello e bastone stanno nei corsi, non in apertura: la home parla a chi
  non si e' mai allenato.
- **Niente nero-su-nero.** La maglia AKM e' nera e il fondo della pagina e' carta chiara: il
  contorno deve staccare da solo, senza contorno disegnato e senza ombra esterna.
- **Una persona sola.** Il partner in tecnica raddoppia il ritaglio e dimezza la leggibilita'
  a 600px.
- **Nessun testo, nessuna riscrittura dello stemma.** Il marchio sul petto e' quello vero
  della foto, non se ne genera uno nuovo.

## Prompt: generazione da riferimento

Da dare a Nano Banana / Gemini con `docs/marchio/riferimenti/vittorio-riferimento.jpg` in
allegato.

```
/edit 'full-body cutout of the man in the reference photo, same face and build, mid-40s,
short grey hair, wearing a plain black athletic polo and black training trousers,
performing a single clear krav maga technique: a low front kick with a raised guard, body
turned three quarters to the camera, weight committed, eyes on the target.

Isolated on a fully transparent background, no floor, no shadow cast on any surface, no
ground plane. Even neutral studio light, slightly cool, no rim light, no lens flare, no
motion blur, no dramatic contrast. Documentary sports photograph, not a poster.

The whole figure must fit inside a circle inscribed in the square frame, with a 6% margin
on every side: nothing crosses the corners. Subject centred.

No weapons, no knife, no stick, no gloves, no second person, no text, no letters, no
numbers, no logo, no watermark, no red-and-black tactical styling, no smoke, no fire.'
--aspect=1:1 --count=4
```

Varianti della posa, se il calcio non regge: `a defensive guard with both forearms up,
stepping off the line` oppure `mid-technique palm strike, guard hand at the chin`.

## Prompt: ritaglio da una foto vera

Se invece scattate la foto (che e' la strada giusta: il kit media #17 vieta lo stock, e una
foto vera di lui vale piu' di una generata), la lavorazione e' solo di sfondo:

```
/edit 'remove the background completely, keep only the person, output a transparent PNG.
Do not retouch the face, do not change the clothing, do not add shadow, do not add glow,
do not smooth the edges into a halo. Preserve the hair silhouette and the fingers.'
```

Per lo scatto: fondo chiaro e uniforme, luce piatta, obiettivo a 50-85mm, la tecnica presa
al culmine e non a meta', un metro di aria sopra la testa e sotto il piede.

## Consegna

| Cosa | Formato | Misura | Peso max |
|---|---|---|---|
| Vittorio ritagliato | PNG con alfa | 2048×2048 | 400 KB |

Si carica in `Media` con l'alt pieno (l'immagine porta informazione: chi insegna, e che cosa
si fa davvero), e si assegna a `Impostazioni → aspetto → aperturaHome`. Il campo resta
facoltativo: senza immagine la home mostra gli anelli e l'apertura e' completa lo stesso.
