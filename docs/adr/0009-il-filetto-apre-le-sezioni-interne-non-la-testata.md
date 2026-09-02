# Il filetto apre le sezioni interne, non la testata

`DESIGN.md` descrive il filetto tricolore come firma strutturale: «chiude la barra in fondo
e apre le sezioni di testata». Le due meta' della frase sono state applicate alla lettera,
e su ogni pagina interna il risultato erano due bande da 3px separate da un vuoto: quella
dentro i 77px della barra, e quella in cima al primo blocco di contenuto, che comincia
subito sotto.

Da fermo non si legge come una firma ripetuta, si legge come un errore di stampa.

Decisione: **il filetto apre una sezione interna, mai la prima sezione della pagina.**
La barra ne porta uno e basta; il primo blocco sotto la barra non ne porta nessuno.

## Dove resta

- `page.tsx`, l'intestazione della sezione centri in home.
- `corsi/[slug]/page.tsx`, l'intestazione di «Dove si pratica».

In tutti e due i casi c'e' del contenuto sopra: il filetto apre qualcosa, non ripete
qualcos'altro.

## Dove sparisce

Da tutte le `.testata__contenuto`: `/corsi`, `/corsi/[slug]`, `/centri`, `/centri/[slug]`,
`/contatti`, `/istruttori`. La testata continua a distinguersi per quello che era gia' il
suo mestiere: superficie nera, scala display, e l'asimmetria del testo che rientra.

## Cosa non cambia

Il filetto resta decorativo e `aria-hidden`, resta a 96px, e non veicola mai informazione.
La regola tocca dove sta, non cos'e'.
