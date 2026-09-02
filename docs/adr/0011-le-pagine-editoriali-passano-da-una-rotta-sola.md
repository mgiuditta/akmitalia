# Le pagine editoriali passano da una rotta sola

La collection `pagine` esiste dall'import, con le trentanove pagine del vecchio sito e la
gerarchia in `parent`. Non aveva nessuna rotta pubblica: erano scritte a database e
irraggiungibili dal browser, e i 314 redirect gestiti da `plugin-redirects` puntavano a
documenti che non avevano un indirizzo.

Il rilascio ha bisogno almeno della privacy, perche' il modulo di contatto raccoglie dati
personali e il consenso deve poter puntare a un'informativa.

Decisione: **una sola rotta `app/(frontend)/[...path]/page.tsx` rende qualsiasi pagina,
cercandola per il campo `path`.** Nessuna rotta dedicata alla privacy, nessun registro di
blocchi, nessun editor visuale: la pagina e' occhiello, titolo, sommario, un'immagine
facoltativa e un elenco di sezioni con titolo e testo ricco. E' la forma che le pagine
importate hanno gia'.

## Perche' `path` e non i segmenti

`path` e' un campo salvato e indicizzato, calcolato da un hook come genitore piu' slug
(`src/collections/Pagine.ts`). Un campo virtuale si legge ma non si filtra, e questa rotta
deve poter fare `where: { path: { equals: '/krav-maga/faq' } }` con una query sola,
qualunque sia la profondita'.

## Le rotte scritte a mano vincono

`/centri`, `/corsi`, `/contatti` e `/istruttori` restano dove sono: in Next un segmento
statico batte sempre una catch-all. Una pagina a database con lo stesso `path` di una rotta
scritta non verrebbe mai raggiunta, e non e' un caso che valga la pena difendere nel codice:
lo copre un test e2e.

## Cosa ne consegue

- Privacy e cookie sono contenuto, non codice. Le crea `pnpm pagine:legali` con il testo di
  partenza, e da li' in poi le riscrive il cliente dall'admin.
- Le voci legali del footer vengono dal global `Navigazione`, gruppo «Voci legali».
- I redirect dal vecchio sito hanno finalmente una destinazione.
- News ed eventi restano fuori: sono collection con una loro forma e un loro elenco, e
  finche' nessuno le chiede non hanno una rotta. Questa decisione non le include.
