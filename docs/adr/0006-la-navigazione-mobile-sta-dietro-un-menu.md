# La navigazione mobile sta dietro un menu

`DESIGN.md` fissava la navbar a 77px e poi, alla voce `navbar`, dichiarava una deroga:
sotto i 700px la barra prendeva una seconda riga e saliva a 104px, «tre voci piu' la CTA
non stanno in riga dentro 375px, e nascondere la navigazione dietro un menu costa piu' di
27px di altezza». Era una scelta ragionata, non una svista, ed e' stata in produzione
finche' il conto ha retto.

Il conto non regge piu', per tre ragioni che si sommano.

**I 27px non erano gratis.** Sono il 6% del viewport di un iPhone SE su una barra fissa,
cioe' 27px sottratti a ogni schermata di un sito il cui traffico e' «quasi tutto da
telefono, di sera» (`PRODUCT.md`). Non si pagano una volta: si pagano su ogni pagina e su
ogni scroll.

**La riga in piu' costava anche una deroga tipografica.** Per far stare tre voci sotto il
marchio, i link scendevano a 14px e salivano a peso 700, contro i 16px peso 300 del token
`nav-link`. La navigazione, che DESIGN.md vuole «visivamente silenziosa», diventava il
secondo elemento piu' pesante della barra dopo la CTA.

**La barra a due righe legge come un pannello.** Il sistema chiama la navbar una firma:
nero pieno, filetto tricolore, nessun bordo. A 104px su due righe non e' piu' una firma,
e' un blocco.

Decisione: **sotto i 700px le voci escono dalla barra ed entrano in un pannello a tutto
schermo, aperto da un bottone.** La barra torna a 77px su ogni breakpoint.

## Cosa cambia

- **La navbar e' 77px ovunque.** Questo non introduce una nuova regola: ricompone
  `DESIGN.md`, dove il paragrafo Layout e i Do dicevano gia' «77px costanti su entrambi i
  breakpoint» mentre la voce `navbar` dichiarava la deroga. Il documento smette di
  contraddirsi.
- **Un solo elenco di link.** La stessa `<nav aria-label="Principale">` e' una riga in
  barra sopra i 700px e il pannello sotto. Non esistono due liste, quindi non esistono due
  landmark e nessuna voce viene letta due volte.
- **La CTA resta in barra anche su telefono.** La richiesta di contatto e' l'unico esito
  misurabile del sito: metterla dietro un tap sarebbe un costo di conversione che i 44px
  risparmiati non ripagano. Sotto i 420px il bottone del menu perde l'etichetta scritta e
  resta la sola icona: l'etichetta esce dalla vista ma non dall'albero di accessibilita',
  quindi il nome accessibile e' ancora «Menu».
- **Ogni voce del pannello porta un dato.** Il numero di corsi, di centri attivi e di
  istruttori, letti da Payload nel guscio del layout. E' la stessa cosa che chiede il
  primo principio di `PRODUCT.md`, presenza prima del marchio, applicata al menu. Il verde
  compare solo sui centri attivi, che sono il dato vivo, e porta sempre la parola scritta.
- **Il fondo entra in tre tempi**: grigio carta, carbone, nero. E' uno stacco di valore,
  non di colore, quindi la Regola del Valore resta intatta: nel menu non entra nessuna
  tinta che non sia gia' nel sistema.
- **Il filetto tricolore si ridisegna all'apertura.** Resta il tab da 96px del sistema, non
  diventa una banda a tutta larghezza: tre campi stesi su 375px leggono come una bandiera,
  ed e' l'errore contro cui `DESIGN.md` mette in guardia. Resta decorativo e `aria-hidden`.

## Il costo

**Un `use client` in piu' e GSAP in dipendenza.** Il sito pubblico aveva un solo componente
client, la mappa. Ora ne ha due. GSAP e' stato scelto per il motion invece del CSS puro, ed
e' una spesa reale: circa 28 kB gz. Tre mosse la contengono e vanno mantenute.

1. Non e' importato in testa al file: arriva con un import dinamico dentro l'effetto,
   scaldato a vuoto quando il browser e' fermo.
2. Chi ha `prefers-reduced-motion: reduce` non lo scarica affatto. Verificato sul build di
   produzione: 621 byte di stub contro 112 kB. Per lui il menu apre e chiude secco, che e'
   esattamente quanto chiede la Regola dell'Indice.
3. Si importa `gsap/dist/gsap.min.js`, non `gsap`. Il barile ESM riesporta ScrollTrigger,
   SplitText, MotionPath e ogni altro plugin, e un import dinamico non li puo' scuotere
   via: sono 70 kB gz invece di 28, per animare tre link.

Chi tocchera' queste animazioni deve sapere una cosa sola: **non si anima mai `.barra` ne'
`.barra__griglia`.** Un transform su di loro le rende blocco contenitore del pannello
`fixed`, che collasserebbe dentro i 77px della barra.

**La navigazione non e' piu' visibile senza un tap.** E' il costo che la deroga voleva
evitare e che ora accettiamo. Lo si accetta perche' il pannello, a differenza della riga
che sostituisce, puo' dire qualcosa: le voci sono in Anton a corpo pieno e ognuna porta il
proprio numero. Un elenco che si nasconde ma informa vale piu' di un elenco sempre visibile
che si limita a stare stretto.

**Il pannello e' una finestra, non un cassetto.** Con il menu aperto `main`, il footer e il
salta-contenuto sono `inert`, il fuoco entra nel pannello e Escape lo riporta al bottone.
Senza `inert` il salta-contenuto, che sta a `z-index: 100`, prenderebbe il fuoco sopra il
pannello e punterebbe a contenuto coperto.

## Conseguenze

- `DESIGN.md` e' aggiornato: la voce `navbar` perde la deroga, si aggiunge il componente
  `menu`.
- Un solo listener di `matchMedia` chiude il menu quando si supera il breakpoint. Non e'
  un dettaglio: senza, chi allarga la finestra col menu aperto resta con la pagina bloccata
  e `main` inerte, senza nulla di visibile da chiudere.
- `tests/e2e/barra.e2e.spec.ts` copre la macchina a stati, non l'animazione: apre, mostra,
  chiude con Escape, restituisce il fuoco, e verifica che la barra misuri 77px. GSAP resta
  fuori dai test: un test sui tempi di una timeline e' un test che sfarfalla.
- L'alternativa scartata e' tenere le due righe e spostare la quarta voce, quando
  arrivera', in un «altro». Scartata perche' rimanda il problema di una voce sola e nel
  frattempo continua a pagare i 27px.
