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

Il colore primario è **il rosso del marchio**, campionato dallo stemma e non scelto a tavolino. Porta l'azione, il focus e il percorso antiaggressione, e sta su carta chiara o su un nero verdastro che è lo stesso inchiostro del testo portato a superficie. È un rosso e nero, e la cosa va detta: PRODUCT.md elenca «nero e rosso sangue da palestra MMA tattica» fra le trappole. La distanza da quella trappola non si tiene evitando i due colori, si tiene per disciplina. Il riferimento è **il timbro a inchiostro rosso su uno stampato**: un colore saturo solo, applicato come un sigillo su una pagina di carta e testo, senza camo, senza stencil, senza gradienti, senza controluce, senza pugni. Se una schermata sembra la locandina di una palestra da combattimento, è rotta esattamente come se sembrasse una bandiera.

Il tricolore resta il sistema di classificazione dei percorsi, non una decorazione patriottica, e questo è l'unico lavoro che fa. Le altre tre trappole di PRODUCT.md restano rifiutate senza sfumature: l'accatastamento illeggibile del sito federale anni 2000, l'hero con gradiente e le tre card identiche del SaaS template, il sorriso in stock photo del fitness patinato.

Il movimento è coreografato ma di servizio: scorrendo, la pagina si compone come si compila un registro, una voce dopo l'altra. Mai per stupire, sempre per scandire la lettura.

**Key Characteristics:**

- Documentale prima che promozionale: il dato è l'eroe, non l'aggettivo
- Un rosso solo, quello del marchio, usato come un timbro e non come un allarme
- Tricolore come tassonomia, mai come bandiera
- Una sola grottesca, forte contrasto di peso, tono da manuale operativo
- Superfici piatte, profondità solo come risposta a uno stato
- Coreografia allo scroll ordinata e ritmica, disattivabile con `prefers-reduced-motion`
- Nomi propri, indirizzi e orari visibili senza interazione

## 2. Colors

Palette a quattro ruoli su un fondo neutro di carta e inchiostro. I valori sono in oklch, che è la forma in cui sono stati scelti: il vincolo «neutro tinto di chroma 0.005-0.01» è una coordinata oklch, e in hex non si può nemmeno verificare. L'hex è lì solo per chi deve incollarlo altrove.

Ogni rapporto qui sotto è calcolato, non stimato: il calcolatore sta sul branch `prototipo/palette`.

### Primary

- **Rosso AKM** `oklch(0.531 0.207 21.7)` `#c81130`: il rosso dell'arco dello stemma, campionato dal file del cliente. È il colore primario: azione piena, focus, e il percorso antiaggressione. Passa AA nei due versi, **5,62:1** come testo su Carta e **5,84:1** come fondo sotto testo Carta alta, e non passa AAA. È una scelta dichiarata: scurirlo lo porterebbe a 7:1 e non sarebbe più il colore del marchio, e il valore del marchio vince perché è l'unica cosa del sistema che non è stata decisa qui.
- **Rosso fondo** `oklch(0.46 0.19 22)` `#a90021`: la variante scura per l'hover dell'azione e per i fondi pieni che portano testo lungo, dove 5,84:1 sta troppo vicino alla soglia. **7,72:1** sotto testo Carta alta, **7,42:1** come testo su Carta. Non è un secondo rosso della palette: è lo stesso rosso, più in basso.

### Secondary

- **Verde AKM** `oklch(0.44 0.075 152)` `#2f5e3e`: verde bosco desaturato, non il verde bandiera. **Non è più il primario**: porta il percorso «sicurezza quotidiana» e basta. Resta il valore misurato di prima, **7,20:1** su Carta nei due versi, perché come colore di percorso deve continuare a reggere il testo.

### Tertiary

- **Carta** `oklch(0.985 0.006 150)` `#f7fbf8`: il «bianco» del tricolore non è `#fff`, è il fondo caldo del documento, tinto verso il verde di chroma minima (0.005-0.01). Porta il percorso «crescita dei ragazzi» attraverso il contrasto di bordo e di peso, mai attraverso un riempimento invisibile: il terzo percorso si scrive in Inchiostro come tutto il resto, e si distingue per segno, posizione e peso.
- **Carta alta** `oklch(0.998 0.002 150)` `#fdfffe`: l'unico secondo fondo del sistema. Campi di form, superficie sollevata, testo sopra il rosso pieno e sopra il Campo. Non è `#fff` per un pelo, e quel pelo è la regola.

### Neutral

- **Inchiostro** `oklch(0.22 0.014 152)` `#161d17`: quasi nero tinto verso il verde. Mai `#000`. Testo corrente, titoli, bordi pieni. **16,55:1** su Carta. È anche il **Campo**, cioè la superficie scura a tutta larghezza della home: non c'è un secondo nero da mantenere in parallelo, il testo e la superficie sono lo stesso valore. Carta alta sopra il Campo sta a **17,11:1**.
- **Grafite** `oklch(0.505 0.012 152)` `#606761`: testo secondario, etichette, metadati di sede. Deve restare AA sul fondo Carta: **5,60:1**, con margine sufficiente a sopravvivere a un corpo piccolo.
- **Riga** `oklch(0.785 0.01 150)` `#b5bbb6`: divisori e bordi a 1px. L'elenco si struttura con righe, non con ombre. **1,88:1** su Carta, sotto la soglia del testo perché testo non è: il minimo utile è quello sotto cui una riga a 1px sparisce sul fondo, e GOV.UK sta a circa 2,3:1.
- **Campo riga** `oklch(0.46 0.012 152)` `#535a55` e **Campo grafite** `oklch(0.78 0.012 152)` `#b2bab4`: gli stessi due mestieri, sul Campo invece che sulla Carta. **2,42:1** e **8,65:1** sul Campo.

Il Rosso AKM sul Campo sta a **2,93:1**: sul nero il rosso fa riempimenti e fili, **mai testo**. Il testo sul Campo è Carta alta o Campo grafite, e non c'è una terza scelta.

### Named Rules

**La Regola della Bandiera Smontata.** I tre colori di percorso non compaiono mai adiacenti in tre bande, colonne o blocchi contigui. Il tricolore vive intero solo nel **marchio**: lo stemma del cliente e il wordmark che gli sta accanto, insieme, in testata (ADR 0004). Ovunque altro, un percorso alla volta, nel suo contesto. Test in una frase: se una schermata sembra una bandiera italiana, riprogettala.

**La Regola dell'Etichetta.** Nessun percorso è identificabile dal solo colore. Ogni occorrenza porta sempre il nome scritto, e cambia anche per forma, posizione o peso. Verde e rosso in coppia sono il caso peggiore per il daltonismo: se togliendo il colore la pagina diventa ambigua, è rotta.

**La Regola dell'Etichetta Corta.** Dentro un elenco, l'etichetta di percorso porta il **target** del corso, «Adulti», «Bambini», «Donne», non il suo nome per esteso: i nomi veri sono lunghi il doppio della riga («Krav Maga – Antibullismo Self Defense System») e il nome completo ha già il suo posto, nella riga d'orario sotto. Il target è un campo che esiste già su `corsi` ed è corto per costruzione, quindi l'etichetta non può allungarsi mai.

**La Regola del Tema Unico.** Il sistema ha una sola risoluzione dei sei ruoli, ed e' chiara. «Foglio chiaro» e' carta e inchiostro: il fondo quasi bianco non e' un default che aspetta il suo contrario, e' il riferimento documentale, e un albo civico non ha una versione notturna. Perche' questa sia una scelta e non un'omissione, `:root` dichiara `color-scheme: light`. La dichiarazione e' portante due volte: senza, i controlli nativi — e il sistema usa HTML nativo prima di Radix — prendono lo stile scuro dello UA dentro una pagina chiara; e Chrome su Android con Auto Dark Theme inverte da solo la palette misurata in #5. Un tema scuro vero non si ottiene invertendo: il Rosso AKM passa 5,62:1 su Carta e sul Campo crolla a 2,93:1, quindi su fondo scuro va **rifatto**, insieme a Verde, Grafite e Riga, e rivalidato coppia per coppia. Il Campo della home non è un tema scuro: è una superficie sola, con i suoi due ruoli già misurati, dentro una pagina chiara. Resta possibile — ogni componente parla solo di token di ruolo, quindi il diff sarebbe un blocco `@media (prefers-color-scheme: dark)` in `token.css` — ma non e' gratis, e finche' non e' misurato non esiste.

**La Regola del Colore Che Sparisce.** In `forced-colors: active` il browser scarta i colori scelti: i bordi sopravvivono, i riempimenti di fondo no. L'elenco si struttura gia' con righe a 1px e non con card riempite, quindi passa intatto; i due punti esposti sono l'etichetta di percorso a fondo pieno e l'azione piena in Rosso AKM, cioe' i posti dove il colore rischia di essere l'unico portatore d'informazione. Nessuna informazione vive solo nel colore: l'etichetta porta gia' il target scritto, e un errore di form porta testo, non solo bordo rosso. Non si scrive nessun blocco `@media (forced-colors: active)` finche' non c'e' un difetto vero da correggere: la modalita' si eredita, e la regola serve a rendere l'eredita' sicura.

**La Regola del Rosso Unico.** C'è **un solo rosso**. Il sistema ne ha avuti tre (marchio, percorso, errore) e li ha fusi, perché tre rossi affiancati nessuno li distingue e la regola che li teneva separati era una regola che nessuno poteva verificare a occhio. Il Rosso AKM fa l'azione piena, il focus, il percorso antiaggressione e lo stato che va notato in una scheda. Non si introduce un secondo rosso «di sistema»: se serve distinguere, si distingue con la parola, con il peso o con la forma, che sono i mezzi che il resto del sistema usa già.

Il corollario è che **il rosso non è più il colore dell'errore per contratto**. Un errore di form porta testo esplicito, non solo un bordo colorato, ed è esattamente ciò che la Regola dell'Etichetta chiede ovunque: se togliendo il colore l'informazione sparisce, è rotta.

**La Regola del Nero Documentale.** Il nero del sistema è l'Inchiostro, tinto verso il verde, e non è mai `#000`. Regge una superficie a tutta larghezza e il rosso ci sta sopra, ma solo alle condizioni dello stampato: fondo pieno unico e piatto, nessun gradiente, nessun blur, nessuna foto in controluce sotto il testo, e il rosso che fa segno e non atmosfera. Il test è quello dell'Overview: se la schermata sembra la locandina di una palestra da combattimento, il nero è stato usato come effetto invece che come carta.

## 3. Typography

**Display Font:** una grottesca unica, **Fira Sans** (OFL 1.1, self-hostata, `pnpm font:scarica`)
**Body Font:** la stessa famiglia, peso e dimensione diversi
**Label/Mono Font:** la stessa famiglia in peso etichetta; una mono si introduce solo se un test dimostra che indirizzi e orari ne guadagnano

**Quattro pesi, non di più:** 400 Body, 500 Title e Label, 700 Headline, 900 Display. Fira Sans non ha un file variabile: ogni peso in più è un file in più, circa 33 KB.

**Character:** una sola voce, sobria e adulta, che cambia registro con il peso. Nessun contrasto serif/sans, nessun font «di personalità»: il carattere del sistema viene dal contenuto, non dal font. Ha il tono di un manuale operativo scritto bene, non di una campagna.

### Hierarchy

- **Display** (peso pesante, scala grande, interlinea stretta): titolo di pagina e di percorso. Uno solo per schermata.
- **Headline** (peso pesante, scala ridotta): apertura di sezione. Il salto rispetto al Display è almeno 1.25.
- **Title** (peso medio): nome della sede, nome dell'istruttore, titolo del corso. È il livello dove vivono i nomi propri.
- **Body** (peso regolare, interlinea comoda, massimo 65-75ch): testo corrente, descrizioni percorso.
- **Label** (peso etichetta, corpo piccolo, spaziatura aperta, maiuscoletto): qualifiche, province, sigle di riconoscimento, etichette di campo.

Ai cinque livelli se ne aggiungono due che l'elenco ha reso necessari e che non sono titoli: il **Dato nudo**, che porta indirizzi, orari e telefoni, e il **Meta**, che porta provincia, docente e note di sede. Sette livelli in tutto, che è anche il tetto: se in una pagina compare un ottavo corpo, è di troppo.

**Modulo di ritmo verticale: 4px. Ogni interlinea è un multiplo intero del modulo.**

| Livello | Corpo | Interlinea | Peso | Tracking | Su mobile |
|---|---|---|---|---|---|
| Display | 56px | 60px | 900 | -0.015em | 36px |
| Headline | 36px | 40px | 700 | -0.01em | 26px |
| Title | 22px | 28px | 500 | 0 | 20px |
| Body | 18px | 32px | 400 | 0 | invariato |
| Dato nudo | 16px | 28px | 400 | 0 | invariato |
| Meta | 14px | 20px | 400 | 0 | invariato |
| Label | 12px | 16px | 500 | +0.03em | invariato |

Il Body sta a 32 e non a 30 per la Regola dell'Arrotondamento qui sotto. Il salto Display/Headline è 1.56, ben oltre l'1.25 richiesto.

**Ritmo verticale e spaziatura.** Scala allineata al modulo: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64`. Su mobile si comprimono solo i gradini grandi: `20→16`, `24→16`, `32→24`, `40→24`, `48→32`, `64→40`.

- **Voce di elenco:** 20px di padding verticale su desktop, 16px su mobile. Riga a 1px con `margin-top: -1px` per collassare i bordi; l'ultima voce perde la riga.
- **Gruppo di voci:** 40px sopra il titolo di gruppo, 20px sotto. Il rapporto **2:1** è quello che fa leggere l'elenco come una serie di gruppi, e non è negoziabile in nessuno dei due sensi.
- **Blocco dentro la voce** (l'attacco degli orari sotto l'indirizzo): 12px.
- **Misura:** bersaglio 66ch, tetto duro 70ch. Il limite viene dalla griglia, non da un `max-width` isolato.

### Named Rules

**La Regola dell'Arrotondamento in Su.** Quando un'interlinea calcolata cade fuori dal modulo da 4px, si sale al multiplo successivo, mai si scende. Il corpus consiglia 30px per il Body su una misura di 66ch, e 30 non è un multiplo di 4: si va a 32, non a 28. La direzione è fissata da TfL, che vieta di ridurre l'interlinea e non di aumentarla, e da qui discende che il modulo resta un vincolo e non diventa una linea guida.

**La Regola del Peso Prima del Corpo.** Dentro una voce di elenco la gerarchia si fa cambiando peso, non corpo: nome della sede a 500, orario a 400, docente in Grafite. È la lezione di Bell Centennial, e in un elenco lungo cambiare peso costa meno spazio verticale che cambiare corpo. I sette corpi della scala servono a distinguere i livelli della pagina, non i livelli dentro la voce.

**La Regola del Dato Nudo.** Indirizzi, orari, telefoni e qualifiche non scendono mai sotto il corpo del testo secondario e non vengono mai compressi in un'icona con tooltip. Sono la prova del principio «Presenza»: se sono difficili da leggere, il principio è tradito.

**La Regola del Nome Proprio.** Ogni sezione che parla di una sede o di una persona la nomina per esteso a livello Title. «Il nostro centro di zona» non esiste: esiste «Rozzano, Centro Aisha».

**La Regola della Cifra Tabulare.** Fira Sans ha le cifre proporzionali di default: ogni elemento che porta un dato (orari, civici, CAP, telefoni) dichiara `font-variant-numeric: tabular-nums`. Dimenticarlo non produce un errore, produce una colonna di orari storta che nessuno nota. Le colonne si dimensionano sulla cifra tabulare, che è più larga della proporzionale media.

**La Regola del Maiuscoletto Vero.** Il livello Label usa `font-variant-caps: all-small-caps`, mai `small-caps`. Le sigle sono già maiuscole, e `smcp` da solo non le tocca: serve `c2sc`, che Fira Sans ha. Con una famiglia priva di maiuscoletto il browser non fallisce, sintetizza maiuscole rimpicciolite dalle aste troppo sottili: è il motivo per cui la famiglia è stata scelta anche su questo.

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
- **Do** tenere il tricolore intero esclusivamente nel marchio: lo stemma AKM Italia con il wordmark accanto, in testata e in nessun altro punto della pagina.
- **Do** tenere lo stemma a 40px nel lockup, e lasciare al testo il compito di portare il nome: il microtesto dell'anello non si legge sotto i 128px, e non deve provarci.
- **Do** tingere ogni neutro verso il verde di marca con chroma 0.005-0.01. Mai `#000`, mai `#fff`.
- **Do** mostrare indirizzo, orari e referente della sede come testo leggibile, senza richiedere un click.
- **Do** nominare per esteso sedi e istruttori a livello Title in ogni sezione che li riguarda.
- **Do** verificare il contrasto AA sul rosso e sul verde prima di usarli come testo: da saturi su fondo chiaro raramente passano, e sul Campo il rosso non passa affatto.
- **Do** costruire gli elenchi con righe a 1px e ritmo di spaziatura variabile, non con card.
- **Do** rendere il controllo anti-bot accessibile: honeypot o time-trap, non un puzzle visivo.
- **Do** far sparire l'intera coreografia sotto `prefers-reduced-motion`, lasciando il contenuto completo.

### Don't:

- **Don't** costruire la **palestra MMA tattica**. Il sistema usa il rosso e il nero, quindi il divieto si sposta su ciò che li rende quella cosa: camo, stencil, teschi, gradienti sanguigni, foto di pugni in controluce, fondi neri usati come atmosfera. È il riflesso di categoria e taglia fuori genitori, donne e adulti sopra i 40.
- **Don't** ricadere nel **sito federale anni 2000**: home a news, PDF come navigazione, tabelle di orari illeggibili, fila di loghi di enti in footer.
- **Don't** consegnare un **SaaS template**: hero con gradiente, tre card identiche icona più titolo più testo, «Scopri di più».
- **Don't** virare al **fitness/wellness patinato**: palette da centro benessere, linguaggio da percorso di benessere.
- **Don't** usare foto stock, né una fotografia d'ambiente al posto di una di persone al lavoro: una sala vuota dice «palestra comunale» e non dice krav maga. Meglio nessuna immagine che una comprata o una muta.
- **Don't** accostare verde, bianco e rosso in tre bande o tre colonne contigue.
- **Don't** affidare al solo colore la distinzione tra i percorsi.
- **Don't** introdurre un secondo rosso, per gli errori o per qualunque altra cosa. Ce n'è uno, ed è quello del marchio.
- **Don't** usare `border-left` o `border-right` oltre 1px come striscia colorata su schede, voci di elenco o avvisi.
- **Don't** usare `background-clip: text` con un gradiente. Un colore pieno, enfasi con peso o dimensione.
- **Don't** usare glassmorphism, blur decorativi o card di vetro.
- **Don't** costruire il template numero grande più etichetta piccola più statistiche di contorno.
- **Don't** ripetere griglie di card identiche per elencare percorsi, sedi o istruttori.
- **Don't** aprire una modale come prima soluzione. Inline o progressivo prima.
- **Don't** usare trattini lunghi nel copy. Virgole, due punti, punto e virgola, parentesi.
- **Don't** animare proprietà di layout, né usare curve con rimbalzo o elastiche.
