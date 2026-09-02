# Il menu non e' un ripiego per schermi stretti

`docs/adr/0006` ha tolto le voci dalla barra sotto i 700px e le ha messe dietro un bottone.
Era una decisione presa contro un vincolo di larghezza: tre voci piu' la CTA non stanno in
riga dentro 375px. Il pannello che ne e' uscito, pero', non e' venuto su come un ripiego.
Ogni voce e' in Anton a corpo pieno, porta il proprio ordinale e il proprio conteggio, e il
fondo entra in tre tempi di valore. Sul telefono il menu dice piu' di quanto dicesse la riga
che ha sostituito.

Sopra i 700px, intanto, restava la riga: tre link in Roboto 16px peso 300, allineati a
destra fra il marchio e la CTA. Corretti, silenziosi, e muti.

Decisione: **le voci stanno dietro il bottone a ogni breakpoint.** Sopra i 700px il pannello
non e' a tutto schermo ma un foglio che entra da destra, largo `min(55vw, 620px)`, con il
resto della pagina sotto un velo. La barra resta 77px ovunque, la CTA resta in barra ovunque.

Tre ragioni.

**Il desktop aveva la versione peggiore della stessa navigazione.** Lo stesso elenco esisteva
in due qualita': col numero di centri attivi sotto il telefono, senza sopra. Non era una
scelta, era il residuo di un vincolo di larghezza applicato dove il vincolo non c'era.

**La riga in barra e' cromo, il pannello e' contenuto.** DESIGN.md vuole la navigazione
«visivamente silenziosa» e la barra una firma. Un elenco di tre link allineati a destra
soddisfa la lettera e spreca l'unico momento in cui l'utente ha dichiarato di voler navigare.

**Una geometria sola costa meno di due.** `docs/adr/0006` aveva dovuto aggiungere un listener
di `matchMedia` per chiudere il menu al superamento del breakpoint e revertire il contesto
GSAP, e lo chiamava «non un dettaglio»: senza, chi allargava la finestra col menu aperto
restava con la pagina bloccata. Quel listener sparisce, perche' non c'e' piu' un breakpoint
che cambia il comportamento. Il CSS cambia una larghezza; il JavaScript non cambia niente.

## Cosa cambia

- **La barra ha una sola griglia.** `marchio | CTA | bottone` a ogni breakpoint. `.barra__nav`
  non esiste piu': la nav e' `fixed` e sta fuori dalla griglia sempre, non solo sotto i 700px.
- **Il pannello e' un foglio, non uno schermo, sopra i 700px.** L'animazione e' gia' quella
  giusta e non e' stata toccata: i tre fondi entrano da destra sfalsati di 0.12s. A tutto
  schermo lo stacco passava quasi inosservato; su 620px si vede.
- **L'ultimo dei tre tempi e' carbone, non nero.** `docs/adr/0006` lo chiudeva sul nero, e
  finche' il pannello copriva lo schermo la scelta non aveva conseguenze. Un foglio nero
  posato su una pagina nera velata di nero, invece, non ha nessun bordo: e' la prima cosa
  che si vede aprendo il menu su desktop. La Regola del Manifesto vieta bordo e ombra al
  cromo e vuole che la profondita' si faccia scambiando il valore della superficie, quindi
  la risposta del sistema e' spostare il foglio di un valore, non disegnargli un contorno.
  La sequenza diventa carta → nero → carbone e cambia anche su telefono: tenerne due sarebbe
  tornare alle due geometrie che questo ADR toglie di mezzo.
- **La lastra dell'hover scende al nero.** Era carbone quando il foglio era nero. Con il
  foglio carbone e' lo stesso salto di valore, preso dall'altra parte.
- **Il velo.** Un `div` `aria-hidden` sotto il pannello, nero al 66%. Non e' un secondo modo
  di chiudere — Escape e il bottone lo erano gia' — ed e' `aria-hidden` perche' un bersaglio
  grande quanto lo schermo nell'albero di accessibilita' costa piu' di quanto renda. Il clic
  che chiude e' una comodita' del puntatore, non l'unica via.
- **L'hover esiste solo dove esiste un puntatore.** Sotto `@media (hover: hover)`, la voce
  puntata prende una lastra che entra da sinistra e sfora fino al bordo del foglio: una
  lastra che si ferma sull'incolonnamento leggerebbe come un bottone, e questa deve leggere
  come una riga accesa. E' uno stacco di valore, come i tre fondi: nel menu non entra nessuna
  tinta che non sia gia' nel sistema.
- **L'hover non tocca i figli della voce.** Niente trasformazioni su `.menu__testo`,
  `.menu__ordinale`, `.menu__dato`: quei tre portano gli stili inline lasciati da GSAP, che
  vincono su qualsiasi regola del foglio. Una regola CSS che li animasse non fallirebbe in
  modo visibile, si limiterebbe a non avere effetto — che e' il modo peggiore di fallire.
  Si accende la sola lastra, che GSAP non tocca.
- **Il foglio ha un gutter suo, `--margine-menu`.** `--margine-pagina` vale fino a 60px, e
  dentro 620px lascia 500px a un «ISTRUTTORI» in Anton che ne chiede 503. Il gutter di un
  contenitore si misura sul contenitore, non sul viewport: `clamp(20px, 4vw, 32px)`, usato
  anche dal filetto e dalla lastra dell'hover perche' i tre devono incolonnarsi.
- **Il foglio non scorre in orizzontale.** I tre fondi partono a `translateX(101%)` e
  allargano l'area scorribile di un pannello intero: senza `overflow-x: hidden` il foglio
  nasce con una barra di scorrimento orizzontale. Il clip e' anche giusto in entrata, perche'
  il fondo deve arrivare dal bordo del foglio e non da fuori schermo.
- **`.barra__link` e' cancellato.** Serviva a dare corpo 16px peso 300 ai link in riga.
  Il link del pannello ha gia' il proprio corpo — `.menu__testo`, Anton — quindi la classe
  non contribuiva piu' niente. Il token `nav-link` resta in `DESIGN.md` ma non lo usa piu'
  nessuna navigazione.
- **Il filetto tricolore si sposta invece di sdoppiarsi.** Resta il tab da 96px, ma sul bordo
  interno del pannello: col foglio da destra non e' piu' allineato al tab della barra, che
  come in `docs/adr/0006` si spegne all'apertura.

## Il costo

**GSAP smette di essere una spesa solo-telefono.** `docs/adr/0006` lo teneva a zero sopra i
700px: il warm-up controllava il breakpoint prima di importare. Ora sono ~28 kB gz per tutti.
Le due mosse che restano vanno mantenute: l'import dinamico dentro l'effetto, scaldato a
vuoto quando il browser e' fermo, e `gsap/dist/gsap.min.js` invece del barile ESM, che ne
porterebbe 70. Chi ha `prefers-reduced-motion: reduce` continua a non scaricarlo affatto.

**La navigazione non e' piu' visibile senza un clic su nessuno schermo.** E' il costo di
`docs/adr/0006` esteso al desktop, ed e' la parte che scommette. Si accetta per la stessa
ragione: un elenco che si nasconde ma informa vale piu' di un elenco sempre visibile che si
limita a stare in riga. I link restano nel DOM a menu chiuso, quindi la scansione non cambia.
La CTA resta in barra, quindi l'unico esito misurabile del sito non passa dal menu.

**Se il conto si ribalta, il segnale e' uno solo:** la CTA in barra smette di ricevere clic e
li riceve il bottone del menu. Vorrebbe dire che il menu e' diventato la strada per contattare
e non per navigare, e allora la riga in barra torna sopra i 1200px, dove c'e' larghezza per
tenerla senza deroghe tipografiche.

Resta valida la regola di `docs/adr/0006`, ora anche per il velo: **non si anima mai `.barra`
ne' `.barra__griglia`.** Un transform su di loro le rende blocco contenitore di ogni figlio
`fixed`, e sia il pannello sia il velo collasserebbero dentro i 77px della barra.

## Conseguenze

- `docs/adr/0006` resta in piedi per tutto il resto: una sola `<nav>`, un solo elenco, `inert`
  sul fondale, Escape che riporta il fuoco al bottone, il dato sotto ogni voce, il verde solo
  sui centri attivi. Cambia solo la clausola «sotto i 700px».
- `DESIGN.md` e' aggiornato: la voce `navbar` perde i link in riga, la voce `menu` smette di
  essere una regola di telefono.
- Sparisce il listener di `matchMedia` in `src/componenti/Menu.tsx` e sparisce la costante del
  breakpoint. Al suo posto una costante sola, `prefers-reduced-motion`, che era gia' l'altra
  meta' di ogni controllo.
- `tests/e2e/barra.e2e.spec.ts` gira gli stessi due casi su 375px e su 1440px. Il primo
  `toBeHidden` di ogni caso e' quello che dice se il desktop e' tornato ad avere i link in
  riga. GSAP resta fuori dai test: un test sui tempi di una timeline e' un test che sfarfalla.
- L'alternativa scartata e' tenere la riga su desktop e aggiungere il pannello come secondo
  ingresso. Scartata perche' un elenco che esiste in due posti e' un secondo landmark o una
  voce letta due volte, ed e' esattamente cio' che `docs/adr/0006` aveva evitato.
