# Uno slot immagine vuoto si dichiara, non sparisce

Il sito ha nove punti in cui il cliente puo' caricare una fotografia dall'admin: l'eroe
della home, la banda sopra «Cosa succede quando entri», le tre pagine indice (centri,
percorsi, istruttori), la foto di ogni centro, il ritratto di ogni istruttore, la colonna
di `/contatti`, la testata di una pagina editoriale. Al primo rilascio quasi tutti sono
vuoti, e lo resteranno finche' qualcuno non li riempie.

Il resto del sito segue la regola opposta: una riga senza dato sparisce, e un'etichetta
senza valore non si stampa. Applicata qui produceva due danni. La composizione cambiava da
una scheda all'altra - dodici istruttori senza ritratto e uno con, e la griglia dell'albo
saltava - e soprattutto il cliente non aveva modo di sapere che quel posto esisteva:
apriva il sito, vedeva una pagina intera, e non c'era niente che dicesse «qui va una foto».

Decisione: **uno slot editoriale vuoto mostra un segnaposto.**

Il segnaposto e' composto, non e' un rettangolo rotto: superficie carbone, la marca in
filigrana, il nome di quello che ci va scritto sotto, e il filetto tricolore in fondo. A
un visitatore dice che li' andra' una fotografia e non buca il ritmo della pagina; al
cliente dice quale campo aprire nell'admin. Non supera mai i 340px di altezza, perche' un
rettangolo vuoto grande quanto la fotografia che aspetta legge come un guasto.

La regola del dato che sparisce resta valida dov'era: un telefono che manca non esiste, e
non si stampa «Telefono: -». Uno slot editoriale invece esiste sempre, e' la composizione
che lo prevede, e toglierlo cambierebbe la pagina invece di completarla.

## Il ritratto e' l'eccezione parziale

A 88px il segnaposto dell'albo perde l'etichetta scritta e il filetto: a quella misura
tre trattini colorati leggono come un errore, non come una firma. Resta la marca, e il
nome del campo lo porta l'`aria-label`.

## Le fotografie di partenza sono generate

AKM non ha un archivio utilizzabile: le immagini del vecchio sito sono compresse, a colori,
e mostrano volti riconoscibili di persone che non hanno firmato una liberatoria. Le cinque
fotografie che il sito porta oggi sono generate, in bianco e nero, con i prompt scritti in
`scripts/editorial-images.ts`. Sono un punto di partenza, non un archivio: quando il
cliente fa un servizio in sala, si sostituiscono dall'admin senza toccare il codice.

L'unica fotografia vera del gruppo e' quella di `/contatti`, che era gia' in libreria.

## La copertina di un evento non è uno slot di composizione

Le cinquantasette schede evento fanno eccezione, e per la stessa ragione per cui la
regola esiste. Senza una copertina propria la scheda prendeva la fotografia della pagina
Eventi, per non mostrare cinquanta segnaposti grigi uguali: il risultato erano cinquanta
schede con la stessa fotografia, che non dicono niente uguale, e 558px di banda che
spingevano la data, il luogo e il bottone sotto la piega.

La copertina di un evento è **un dato di quel documento**, non un posto che la
composizione prevede: come il telefono di un centro, se manca non esiste, e non si
stampa niente. Senza copertina la scheda passa dalla testata alla scheda, e nessuno si
accorge che manca qualcosa. Restano slot dichiarati i nove della lista qui sopra, che
sono pagine, non record: lì il segnaposto continua a dire al cliente quale campo aprire.

## Cosa non cambia

Il monocromo. Ogni fotografia entra nel sistema come valore e non come colore, filtrata in
`.figure__photo`, esattamente come l'eroe faceva gia' da solo. Il segnaposto non e' un'altra
estetica: e' la stessa superficie carbone delle schede.
