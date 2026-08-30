---
name: AKM Italia
description: Il registro pubblico dei centri, degli istruttori e dei percorsi AKM Italia.
---

<!-- SEED: rilancia /impeccable document quando c'è codice, per estrarre i token reali e generare il sidecar. -->

# Design System: AKM Italia

## 1. Overview

**Creative North Star: "L'Albo"**

AKM Italia tiene già un albo istruttori. Il sito è la stessa cosa estesa a tutto: un registro pubblico di persone, luoghi, orari e qualifiche, tenuto bene. Non un catalogo che vende corsi, un documento che dichiara chi c'è e dove. Il riferimento è la cosa civica fatta con cura: la segnaletica pubblica, il tesserino federale, la modulistica progettata da qualcuno a cui importava. Autorevole per struttura, non per estetica.

Da qui discende la densità. L'Albo non ha paura del dato: indirizzi, orari, sigle di riconoscimento, nomi propri stanno in pagina a corpo pieno, non nascosti dietro un accordion o riassunti in un'icona. Il vuoto c'è, ed è generoso, ma serve a separare voci di un elenco, non a fare atmosfera. Se una schermata potrebbe funzionare identica per una qualsiasi altra realtà, ha fallito: il contenuto specifico è il design.

Il tricolore entra come sistema di classificazione, non come decorazione patriottica. Verde, bianco e rosso sono i tre percorsi, e questo è l'unico lavoro che fanno. Il sistema rifiuta esplicitamente le quattro trappole di PRODUCT.md: nero e rosso sangue da palestra MMA tattica, l'accatastamento illeggibile del sito federale anni 2000, l'hero con gradiente e le tre card identiche del SaaS template, il sorriso in stock photo del fitness patinato.

Il movimento è coreografato ma di servizio: scorrendo, la pagina si compone come si compila un registro, una voce dopo l'altra. Mai per stupire, sempre per scandire la lettura.

**Key Characteristics:**

- Documentale prima che promozionale: il dato è l'eroe, non l'aggettivo
- Tricolore come tassonomia, mai come bandiera
- Una sola grottesca, forte contrasto di peso, tono da manuale operativo
- Superfici piatte, profondità solo come risposta a uno stato
- Coreografia allo scroll ordinata e ritmica, disattivabile con `prefers-reduced-motion`
- Nomi propri, indirizzi e orari visibili senza interazione

## 2. Colors

Palette a quattro ruoli: tre colori di percorso derivati dal tricolore, spostati fuori dai primari da bandiera, su un fondo neutro di carta e inchiostro. `[valori esatti da risolvere in implementazione]`

### Primary

- **Verde AKM** `[hex/oklch da definire]`: verde bosco desaturato, non il verde bandiera. Porta il percorso «sicurezza quotidiana», l'adulto che è il pubblico primario. È il colore che compare più spesso e regge le CTA principali. Deve passare AA come testo su fondo chiaro: se non lo fa, va scurito, non alleggerito il testo.

### Secondary

- **Rosso Mattone** `[hex/oklch da definire]`: rosso terroso, mai il rosso sangue. Porta il percorso «antiaggressione». Raro per definizione. Non è il colore dell'errore e non è il colore dell'urgenza commerciale.

### Tertiary

- **Carta** `[hex/oklch da definire]`: il «bianco» del tricolore non è `#fff`, è il fondo caldo del documento, tinto verso il verde di chroma minima (0.005-0.01). Porta il percorso «crescita dei ragazzi» attraverso il contrasto di bordo e di peso, mai attraverso un riempimento invisibile.

### Neutral

- **Inchiostro** `[hex/oklch da definire]`: quasi nero tinto verso il verde di marca. Mai `#000`. Testo corrente, titoli, bordi pieni.
- **Grafite** `[hex/oklch da definire]`: testo secondario, etichette, metadati di sede. Deve restare AA sul fondo Carta.
- **Riga** `[hex/oklch da definire]`: divisori e bordi a 1px. L'elenco si struttura con righe, non con ombre.

### Named Rules

**La Regola della Bandiera Smontata.** I tre colori di percorso non compaiono mai adiacenti in tre bande, colonne o blocchi contigui. Il tricolore vive intero solo nel wordmark. Ovunque altro, un percorso alla volta, nel suo contesto. Test in una frase: se una schermata sembra una bandiera italiana, riprogettala.

**La Regola dell'Etichetta.** Nessun percorso è identificabile dal solo colore. Ogni occorrenza porta sempre il nome scritto, e cambia anche per forma, posizione o peso. Verde e rosso in coppia sono il caso peggiore per il daltonismo: se togliendo il colore la pagina diventa ambigua, è rotta.

**La Regola del Rosso Riservato.** Il Rosso Mattone appartiene al percorso antiaggressione. Errori di form, avvisi e stati distruttivi usano un rosso di sistema distinto, oppure nessun rosso: parole e icona bastano.

## 3. Typography

**Display Font:** una grottesca unica `[famiglia da scegliere in implementazione]`
**Body Font:** la stessa famiglia, peso e dimensione diversi
**Label/Mono Font:** la stessa famiglia in peso etichetta; una mono si introduce solo se un test dimostra che indirizzi e orari ne guadagnano

**Character:** una sola voce, sobria e adulta, che cambia registro con il peso. Nessun contrasto serif/sans, nessun font «di personalità»: il carattere del sistema viene dal contenuto, non dal font. Ha il tono di un manuale operativo scritto bene, non di una campagna.

### Hierarchy

- **Display** (peso pesante, scala grande, interlinea stretta): titolo di pagina e di percorso. Uno solo per schermata.
- **Headline** (peso pesante, scala ridotta): apertura di sezione. Il salto rispetto al Display è almeno 1.25.
- **Title** (peso medio): nome della sede, nome dell'istruttore, titolo del corso. È il livello dove vivono i nomi propri.
- **Body** (peso regolare, interlinea comoda, massimo 65-75ch): testo corrente, descrizioni percorso.
- **Label** (peso etichetta, corpo piccolo, spaziatura aperta, maiuscoletto): qualifiche, province, sigle di riconoscimento, etichette di campo.

`[valori esatti di scala, peso e interlinea da definire in implementazione]`

### Named Rules

**La Regola del Dato Nudo.** Indirizzi, orari, telefoni e qualifiche non scendono mai sotto il corpo del testo secondario e non vengono mai compressi in un'icona con tooltip. Sono la prova del principio «Presenza»: se sono difficili da leggere, il principio è tradito.

**La Regola del Nome Proprio.** Ogni sezione che parla di una sede o di una persona la nomina per esteso a livello Title. «Il nostro centro di zona» non esiste: esiste «Rozzano, Centro Aisha».

## 4. Elevation

Il sistema è piatto per default. La profondità viene da righe a 1px, cambi di tono del fondo e spaziatura, non da ombre. È coerente con il riferimento documentale: un registro non ha ombre, ha righe.

Le ombre esistono solo come risposta a uno stato: un elemento sollevato perché aperto, in hover o in focus. Mai come decorazione a riposo. Poiché il movimento è coreografato, la stratificazione è ammessa nelle transizioni (una scheda sede che si apre sopra l'elenco), ma torna piatta a fine animazione.

`[vocabolario ombre da definire in implementazione]`

### Named Rules

**La Regola del Foglio.** Le superfici sono piatte a riposo. Se stai aggiungendo un'ombra a qualcosa che non sta rispondendo a un'azione dell'utente, cancellala e usa una riga o uno stacco di fondo.

**La Regola dell'Indice.** La coreografia allo scroll scandisce un elenco, non intrattiene. Le voci entrano in sequenza, con curve ease-out esponenziali, senza rimbalzo e senza elastico. Mai animare proprietà di layout. Con `prefers-reduced-motion` la sequenza sparisce del tutto e il contenuto è immediatamente completo: nessun contenuto esiste solo dentro un'animazione.

## 5. Components

`[nessun componente ancora: il frontend è vuoto. Rilancia /impeccable document dopo la prima implementazione per estrarre i primitivi reali e generare .impeccable/design.json.]`

## 6. Do's and Don'ts

### Do:

- **Do** trattare verde, bianco e rosso come tre ruoli di percorso, uno alla volta, sempre accompagnati dal nome scritto.
- **Do** tenere il tricolore intero esclusivamente nel wordmark AKM ITALIA.
- **Do** tingere ogni neutro verso il verde di marca con chroma 0.005-0.01. Mai `#000`, mai `#fff`.
- **Do** mostrare indirizzo, orari e referente della sede come testo leggibile, senza richiedere un click.
- **Do** nominare per esteso sedi e istruttori a livello Title in ogni sezione che li riguarda.
- **Do** verificare il contrasto AA sul verde e sul rosso prima di usarli come testo: da saturi su fondo chiaro raramente passano.
- **Do** costruire gli elenchi con righe a 1px e ritmo di spaziatura variabile, non con card.
- **Do** rendere il controllo anti-bot accessibile: honeypot o time-trap, non un puzzle visivo.
- **Do** far sparire l'intera coreografia sotto `prefers-reduced-motion`, lasciando il contenuto completo.

### Don't:

- **Don't** costruire la **palestra MMA tattica**: nero e rosso sangue, camo, stencil, teschi, foto di pugni in controluce. È il riflesso di categoria e taglia fuori genitori, donne e adulti sopra i 40.
- **Don't** ricadere nel **sito federale anni 2000**: home a news, PDF come navigazione, tabelle di orari illeggibili, fila di loghi di enti in footer.
- **Don't** consegnare un **SaaS template**: hero con gradiente, tre card identiche icona più titolo più testo, «Scopri di più».
- **Don't** virare al **fitness/wellness patinato**: palette da centro benessere, linguaggio da percorso di benessere.
- **Don't** usare foto stock. Meglio nessuna immagine che una comprata.
- **Don't** accostare verde, bianco e rosso in tre bande o tre colonne contigue.
- **Don't** affidare al solo colore la distinzione tra i percorsi.
- **Don't** usare il Rosso Mattone per errori di form o stati distruttivi.
- **Don't** usare `border-left` o `border-right` oltre 1px come striscia colorata su schede, voci di elenco o avvisi.
- **Don't** usare `background-clip: text` con un gradiente. Un colore pieno, enfasi con peso o dimensione.
- **Don't** usare glassmorphism, blur decorativi o card di vetro.
- **Don't** costruire il template numero grande più etichetta piccola più statistiche di contorno.
- **Don't** ripetere griglie di card identiche per elencare percorsi, sedi o istruttori.
- **Don't** aprire una modale come prima soluzione. Inline o progressivo prima.
- **Don't** usare trattini lunghi nel copy. Virgole, due punti, punto e virgola, parentesi.
- **Don't** animare proprietà di layout, né usare curve con rimbalzo o elastiche.
