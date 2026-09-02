---
name: AKM Italia
description: Il registro pubblico dei centri, degli istruttori e dei percorsi AKM Italia.
source: Fenriz (fenriz-gym.com), importato integralmente il 2026-09-01. Vedi docs/adr/0004.
---

<!-- SEED: rilancia /impeccable document quando c'è codice, per estrarre i token reali e generare il sidecar. -->

# Design System: AKM Italia

## 1. Overview

**Creative North Star: "Il Manifesto"**

Il sito legge come legge la sala: spogliato, ad altissimo contrasto, senza ornamento. Due neri e un bianco reggono tutto. Nessun accento cromatico esiste nel sistema: la gerarchia si costruisce solo con la **scala** (un titolo da 120px contro una didascalia da 14px) e con il **valore di superficie** (nero puro contro carbone contro grigio chiaro), mai con la tinta.

La densità è bassa e sicura di sé. Le sezioni respirano su 80-100px verticali, il testo corrente sta in una colonna stretta da 500-600px, e la geometria è squadrata ovunque: zero raggio di curvatura, su ogni bottone, ogni scheda, ogni immagine. L'aggressività del marchio viene dal carattere display sovradimensionato sbattuto direttamente sul nero piatto, non da effetti.

Il sistema rifiuta le scorciatoie di profondità. Ombre, sfocature e vetro non sono strumenti di gerarchia: esistono per due soli componenti, il bottone primario e la scheda. Tutto il resto è piatto, come un manifesto stampato.

**Key Characteristics:**

- Due caratteri e basta: uno display condensato per le affermazioni, Roboto per tutto ciò che è funzionale.
- Superfici senza tinta: nero, carbone, bianco, un grigio neutro. Il colore esiste in due soli ruoli semantici (rosso azione, verde presenza) e non tocca mai una superficie di sezione.
- Piatto per default: solo `button-primary` e `card` portano ombra.
- Geometria a spigolo vivo: nessun token di raggio esiste nel sistema.
- Ritmo di sezione che alterna blocchi neri e blocchi chiari, gerarchia senza colore.
- Tre pesi e non di più: 300, 400, 700. Il 500 è deliberatamente assente.
- Navbar fissa a 77px, nera, opaca, senza bordo e senza blur a ogni posizione di scroll: sopra i 1024px le voci stanno in riga fra marchio e CTA, sotto entrano in un pannello, e l'altezza non cambia.
- Nomi propri, indirizzi e orari restano a corpo pieno: la densità del dato non è negoziata dall'estetica.

## 2. Colors

Nessun gradiente esiste come token riutilizzabile. Le superfici sono ridotte per scelta a quasi-nero, nero puro, bianco e un neutro chiaro. Accanto ad esse vivono due colori semantici, e solo quelli: vedi la Regola del Colore Semantico più sotto.

### Primary

- **Carbone** `#1C1C1C`: il valore d'inchiostro di default del sistema. Fa anche da superficie per `button-secondary`.

### Secondary

- **Inchiostro** `#1C1C1C`: stesso valore di Primary, usato semanticamente come colore del testo su superficie chiara.
- **Inchiostro Secondario** `#333333`: carbone appena sollevato, per testo de-enfatizzato. Usato con parsimonia.

### Tertiary

- **Nero** `#000000`: fondo di navbar e hero. La superficie più autorevole del sistema.
- **Carbone Superficie** `#1C1C1C`: fondo del footer e delle schede. Un gradino più chiaro del nero puro, separa i blocchi di contenuto dall'hero.
- **Bianco** `#FFFFFF`: il fondo delle sezioni chiare alternate.
- **Grigio Carta** `#E8E8E8`: riempimento delle sezioni chiare e superficie di `button-primary`.

### Semantic

Non sono superfici e non entrano nella scala di valore: dicono cosa fa un elemento. Vedi `docs/adr/0005`.

- **Azione** `#E30917`: il rosso dello stemma. Solo fondo di `button-primary`, con etichetta bianca. **Azione premuta** `#B00711` per hover e active.
- **Presenza** `#00B44B`: verde su fondo scuro, per il dato vivo. **Presenza scura** `#006B2C` quando lo stesso segno cade su bianco o su grigio carta.
- **Tricolore** `#00973F` / `#FFFFFF` / `#E30917`: i valori esatti dello stemma, usati nella banda da 3px e, unica eccezione, nelle tre lettere «AKM» del wordmark (vincolo di marca, `PRODUCT.md`). Mai altrove come colore di testo.

### Neutral

- **Bianco testo** `#FFFFFF`: colore dominante di testo e icone sulle superfici scure. Regge circa due terzi del peso testuale.
- **Riga** `#E8E8E8`: condivide l'esadecimale con Grigio Carta. Solo divisore strutturale a 1px, mai riempimento.

Non esiste un blocco di token per la modalità scura: il sistema è progettato **dark-first** come tema unico e fisso, con le sezioni chiare usate come stacco di ritmo, non come modalità alternativa.

### Named Rules

**La Regola del Valore.** La gerarchia si costruisce scambiando il valore di superficie (`#000000` → `#1C1C1C` → `#E8E8E8`/`#FFFFFF`), mai la tinta. Se stai per introdurre un colore per distinguere due cose, stai risolvendo il problema sbagliato: cambia superficie, scala o peso.

**La Regola dell'Etichetta.** Nessuna categoria è identificabile dal solo valore di superficie. Ogni occorrenza porta sempre il nome scritto. Il sistema è monocromo, quindi questa regola non è un ripiego per il daltonismo: è l'unico modo in cui un percorso si distingue da un altro.

**La Regola del Colore Semantico.** Esistono due colori e due soli ruoli, dichiarati in `docs/adr/0005`. **Rosso `#E30917` = azione**: superficie del solo `button-primary`, etichetta bianca (4.86:1), `#B00711` per hover e active (7.28:1). **Verde `#00B44B` = presenza**: solo segnale di dato vivo (centro attivo, marker di mappa, conteggio dei centri), e su fondo chiaro passa a `#006B2C` perché il verde chiaro su bianco si ferma a 2.75:1. Nessun terzo ruolo, nessuna terza tinta.

Il colore **non identifica mai una categoria**: la Regola del Valore continua a governare la gerarchia e la Regola dell'Etichetta continua a imporre il nome scritto, quindi il pallino verde non è mai solo, porta sempre la parola «Attivo». Errori di form, avvisi e stati distruttivi si dichiarano a parole e con l'icona: il rosso è già impegnato a dire «premi qui» e non può dire anche «attento».

**Il filetto tricolore** (verde `#00973F` / bianco / rosso `#E30917`, banda da 3px) è una firma strutturale: chiude la barra in fondo e apre una sezione **interna**, mai la prima sezione della pagina. Applicato anche alla testata produceva due bande da 3px separate da un vuoto, che legge come un errore di stampa e non come una firma: vedi `docs/adr/0009`. Sta in uno pseudo-elemento o porta `aria-hidden`, e non veicola mai informazione.

## 3. Typography

**Display Font:** **Anton** (OFL 1.1, self-hostata, `pnpm font:scarica`). Sostituto libero di Kenyan Coffee, che è commerciale (Yellow Design Studio) e non licenziabile qui. Grottesca condensata pesantissima, un peso solo, che rende come il 700 dell'originale.
**Body Font:** **Roboto** (Apache 2.0, self-hostata, file variabile). Pesi 300, 400, 700.
**Label/Mono Font:** Roboto in peso 700 a corpo piccolo. Nessuna mono nel sistema.

**Tre pesi, non di più:** 300 Light per testo corrente e link di navigazione, 400 Regular per una sola variante di didascalia, 700 Bold per ogni titolo Roboto, bottone e link di footer. Il peso 500 non esiste: non c'è registro «medium».

### Hierarchy

| Token | Famiglia | Corpo | Peso | Interlinea | Uso |
|---|---|---|---|---|---|
| `hero-display` | Anton | 120px | 700 | 1 | Titolo di pagina |
| `display-lg` | Anton | 90px | 700 | 1 | Titolo di sezione grande |
| `display-md` | Anton | 55px | 700 | 1 | Titolo di sezione |
| `display-sm` | Anton | 33px | 300 | 1.2 | Sotto-affermazione display |
| `heading-lg` | Roboto | 22px | 700 | 1.2 | Titolo di scheda o sottosezione |
| `nav-link` | Roboto | 16px | 300 | 1.4 | Link di navigazione |
| `link-strong` | Roboto | 16px | 700 | 1.4 | Link inline enfatizzato, etichetta bottone |
| `label-strong` | Roboto | 14px | 700 | 1 | Etichette strette |
| `footer-link` | Roboto | 14px | 700 | 1.4 | Link di footer |
| `caption-strong` | Roboto | 14px | 700 | 1.5 | Didascalie forti |
| `caption` | Roboto | 14px | 300 | 1.4 | Testo corrente |
| `caption-regular` | Roboto | 14px | 400 | 1.5 | Didascalie regolari |

### Named Rules

**La Regola dei Due Caratteri.** Anton per i token display, Roboto per tutto il resto. Mai una terza famiglia.

**La Regola della Spaziatura Normale.** La crenatura è `normal` su ogni token. Il sistema non ha una strategia di tracking: la compattezza viene dalle lettere condensate di Anton, non da un `letter-spacing` negativo aggiunto a mano per simulare l'estetica atletica.

*Unica eccezione:* il **wordmark** in barra, che è un lockup di marca e non un token tipografico. Lì il tracking è positivo e dichiarato (`+.08em` sulla riga «AKM», `+.22em` su «ITALIA»), perché due parole in maiuscolo a corpo piccolo accanto a uno stemma hanno bisogno di aria che il testo corrente non vuole. L'eccezione vale per quel lockup e per nient'altro.

**La Regola dello Stacco Netto.** Le scale display e le scale funzionali non si sovrappongono mai: Anton parte da 33px in su, Roboto si ferma a 22px. Il salto è il confine fra testo «affermazione» e testo «funzione».

**La Regola dell'Interlinea Collassata.** Ogni token display ha interlinea 1, per tenere il corpo grande visivamente denso e a blocco. Il testo funzionale Roboto si rilassa a 1.2-1.5 per leggibilità.

**La Regola della Cifra Tabulare.** Roboto ha le cifre proporzionali di default: ogni elemento che porta un dato (orari, civici, CAP, telefoni) dichiara `font-variant-numeric: tabular-nums`. Dimenticarlo non produce un errore, produce una colonna di orari storta che nessuno nota.

**La Regola del Dato Nudo.** Indirizzi, orari e qualifiche non scendono sotto `caption` (14px) e non vengono mai compressi in un'icona con tooltip. Il carattere display è per le affermazioni, il dato resta leggibile.

**La Regola del Maiuscolo.** Anton si compone in maiuscolo. Con accenti maiuscoli e interlinea 1 va verificato il taglio degli accenti in cima alla riga: è l'unico punto in cui l'interlinea collassata può rompere.

## 4. Layout

### Spacing System

La scala è tarata a mano, non strettamente geometrica: base ~8px con passi irregolari per il ritmo.

`xs` 8px, `sm` 10px, `sm-alt` 14px, `md` 16px, `gutter` 20px, `lg` 24px, `lg-alt` 30px, `xl` 32px, `header-height` 77px, `xxl` 40px, `section-sm` 48px, `section` 80px, `section-lg` 100px.

Il padding di componente resta piccolo e costante: bottone e scheda atterrano entrambi su 24px. Il ritmo fra sezioni salta alla fascia 48-100px. Il vuoto fra le due fasce è deliberato: l'interno resta stretto e disciplinato, lo spazio fra sezioni resta generoso e cinematografico.

### Grid & Container

Desktop usa una griglia a 3 colonne per le tessere di categoria, con gutter da 20px. Il testo corrente sta in una colonna centrata da 500-600px sotto i titoli sovradimensionati. Mobile collassa la griglia a colonna singola, immagini a tutta larghezza e didascalie sovrapposte in fondo alla foto. La navbar fissa tiene 77px costanti su ogni breakpoint: sopra i 1024px le voci in riga hanno il corpo di un link e non di un titolo, sotto stanno nel `menu`.

### Whitespace Philosophy

Il vuoto è uno status symbol, non un incidente. Blocchi larghi (80/100px) separano le zone nere da quelle chiare, lasciando respirare il display sovradimensionato e la fotografia monocroma senza cromo di interfaccia in competizione. Niente è largo dentro un componente: tutta la generosità si spende sul ritmo macro, non sul padding micro.

## 5. Elevation

| Livello | Trattamento | Uso |
|---|---|---|
| 0 — Piatto | Nessuna ombra, nessun bordo | Navbar, footer, tutti i fondi di sezione |
| 1 — Sollevamento morbido | `rgba(69,69,69,0.2) 0 8px 8px 0, rgba(69,69,69,0.23) 0 2px 5px 0` | Solo `button-primary` |
| 2 — Sollevamento profondo | `rgba(0,0,0,0.1) 0 8px 18px 0, rgba(0,0,0,0.09) 0 33px 33px 0` | Solo `card` |

### Named Rules

**La Regola del Manifesto.** Il cromo strutturale (navbar, footer, fondi di sezione) non proietta mai ombra. La profondità si fa scambiando il valore di superficie. Se stai aggiungendo un'ombra a qualcosa che non è il bottone primario o una scheda, cancellala.

**La Regola dello Spigolo.** Il raggio è 0px ovunque. Bottoni, schede, immagini e tessere sono rettangoli netti. Non esiste pillola né cerchio in questo sistema. È un confine duro, non una svista.

**La Regola dell'Indice.** La coreografia allo scroll scandisce un elenco, non intrattiene. Curve ease-out esponenziali, nessun rimbalzo, nessun elastico, mai animare proprietà di layout. Con `prefers-reduced-motion` la sequenza sparisce del tutto e il contenuto è immediatamente completo.

Il repertorio è chiuso e sono quattro voci: l'entrata scandita di `.rivela` (scroll-driven in CSS, nessun observer), la sequenza a tempo dell'eroe, l'apertura dei `details` del bivio (`interpolate-size` più `::details-content`, miglioramento progressivo senza JavaScript), e l'ingresso in cascata dei marker di mappa. Niente pin, niente scroll-hijack, niente GSAP fuori dal pannello del menu. Se un'animazione non si spiega in una frase — gerarchia, sequenza di lettura, riscontro a un gesto, cambio di stato — non entra.

**La Regola del Cromo Fermo.** Il cromo strutturale non si anima. Oltre al motivo estetico ce n'è uno meccanico: un `transform` su `.barra` o sulla sua griglia le rende blocco contenitore di ogni figlio `position: fixed`, e il pannello del menu collasserebbe dentro i 77px della barra. Si anima il pannello e i suoi figli, mai ciò che li contiene.

## 6. Components

- **`navbar`** — barra fissa, **77px su ogni breakpoint**, fondo `#000000`, testo `#FFFFFF`. Nessun bordo e nessun blur, opaca a ogni posizione di scroll, chiusa in fondo dal filetto tricolore da 3px, che sta **dentro** l'altezza. Sopra i 1024px in riga stanno marchio, voci in `nav-link` e bottone CTA; sotto stanno marchio, CTA e bottone del menu, e le voci vivono nel componente `menu`. Due presentazioni, un solo landmark esposto per volta. Voci e CTA vengono dal global `Navigazione`. La CTA non si nasconde mai, perché la richiesta di contatto è l'unico esito misurabile del sito. Vedi `docs/adr/0007` e `docs/adr/0008`.
- **`menu`** — il pannello della navigazione, l'unico posto dove stanno le voci. Entra da destra dal bordo inferiore della barra in giù, fondo carbone pieno: nessun blur, nessun vetro, nessuna trasparenza. Carbone e non nero perché si posa su una pagina nera velata di nero, e la profondità in questo sistema si fa scambiando il valore della superficie — mai con un bordo o un'ombra. Largo `min(55vw, 620px)` sopra i 700px, a tutto schermo sotto; sopra i 1024px non esiste, perché le voci sono in riga nella barra (`docs/adr/0008`). Le voci sono in `display-md` (Anton 55px) maiuscolo, ognuna preceduta dal proprio ordinale in `label-strong` e seguita da un dato reale in `caption-strong` — quanti corsi, quanti centri attivi, quanti istruttori. La colonna sta in basso, non in alto: sopra le voci il nero resta vuoto per scelta. Il fondo entra in tre tempi, grigio carta, nero, carbone, che è uno stacco di valore e non di colore. Dove c'è un puntatore la voce puntata prende una lastra nera che entra da sinistra e sfora fino al bordo del foglio: ancora valore, mai una tinta. Mentre è aperto il resto della pagina è `inert` e sotto un velo nero al 66%, che è decorativo e `aria-hidden`.
- **`menu-bottone`** — etichetta «Menu» in `label-strong` più due barrette da 2px che diventano una croce, area di tocco 44×44. Sotto i 420px l'etichetta esce dalla vista ma resta nell'albero di accessibilità, quindi il nome accessibile non cambia mai: lo stato lo dice `aria-expanded`, non la parola.
- **`wordmark`** — stemma da 36px (solo emblema: la scritta dentro il tondo è illeggibile a quella misura) più un lockup a due piani in Roboto 700 maiuscolo, «AKM» a 19px con le tre lettere in verde, bianco e rosso (a 19px bold è testo grande: il rosso su nero fa 4.3:1, sopra i 3:1 richiesti) e «ITALIA» a 11px in bianco. Anton resta fuori dalla barra: sotto i 33px violerebbe la Regola dello Stacco Netto, ed è esattamente l'errore che il lockup precedente commetteva.
- **`nav-link`** — Roboto 16px peso 300, bianco su nero, senza sottolineatura a riposo e sottolineato con stacco di 6px su hover e focus. È il corpo delle voci in riga nella barra sopra i 1024px (`docs/adr/0008`); sotto, le stesse voci passano in `display-md` dentro il `menu`.
- **`button-primary`** — fondo `#E30917` (il rosso azione), testo `#FFFFFF`, padding 16px 24px, etichetta in `link-strong`, `#B00711` su hover e active. È l'unico bottone con ombra (livello 1) e l'unica superficie colorata del sistema.
- **`button-secondary`** — fondo `#1C1C1C`, testo `#FFFFFF`, stesso padding e stessa tipografia del primario, ma piatto. Per azioni a minore enfasi, dove uno scuro-su-scuro deve arretrare.
- **`card`** — fondo `#1C1C1C`, padding 24px, ombra di livello 2. È l'unico contenitore a cui è permessa un'ombra pesante.
- **`hero-heading`** — `hero-display` (Anton 120px) in bianco, allineato a sinistra sull'hero nero.
- **`section-heading`** — `display-md` (Anton 55px) in bianco, titola ogni sezione alternata.
- **`body-text`** — `caption` (Roboto 300, 14px) in bianco, il paragrafo di default nelle sezioni scure.
- **`footer`** — statico, blocco alto, fondo `#1C1C1C`, testo bianco. Due colonne, directory densa di link, nessun bottone CTA.
- **`footer-link`** — testo bianco in `footer-link` (Roboto 700, 14px). I link di footer sono in grassetto dove quelli di nav sono leggeri: il footer è una directory, la nav è aria. Le voci legali stanno in coda accanto al copyright, non nella directory: sono un obbligo da assolvere, non una destinazione che qualcuno cerca.
- **`mappa__segno`** — il marker della mappa. Nodo da 24×24 (bersaglio da dito e area di focus), segno visivo da 12px in verde presenza con anello chiaro da 2px, raggio 0 come tutto il resto: nessun pin tondo. Raggiungibile da tastiera, apre il proprio popup con invio. Ha un secondo stato, `mappa__segno--vicino`: segno da 18px e nome del comune scritto accanto, perché il valore non identifica mai da solo (Regola dell'Etichetta). I marker entrano in sequenza con un ritardo a cascata, e l'animazione tocca **solo l'opacità**: su un marker `transform` è la posizione sulla mappa.
- **`percorso__riga`** — la riga dell'indice dei percorsi: fascia a tutta larghezza sul ruolo di superficie del corso, ordinale, domanda in `display-md`, nome scritto, sommario, e in coda i destinatari e quanti centri lo tengono. È un link intero. L'hover scambia il valore di superficie, mai la tinta. Il marchio del percorso è inchiostro su trasparente e sulle superfici scure si inverte, non si nasconde.
- **`corso__prova`** — la riga che dimostra un percorso, da sola su nero. L'enfasi la fanno l'isolamento e il valore della superficie, non la scala: resta in `heading-lg` (Roboto 700, 22px), perché la Regola dello Stacco Netto non ammette Roboto sopra i 22px e trecento caratteri in Anton maiuscolo non si leggono.
- **`numerati`** — l'elenco dei risultati di un percorso: due colonne sopra gli 800px, ordinale in Anton, un filetto grigio per riga. È la forma che un elenco lungo prende quando ogni voce merita di essere letta.
- **`etichette`** — le voci brevi di «su cosa si lavora»: righe corte in fila, un contorno da 1px e nessun riempimento. Non sono bottoni e non sono stati: non prendono né superficie né colore.

`[i primitivi reali si estraggono dopo la prima implementazione: rilancia /impeccable document per generare .impeccable/design.json.]`

## 7. Do's and Don'ts

### Do:

- **Do** costruire la gerarchia con scala e valore di superficie, mai con la tinta.
- **Do** tenere lo stacco netto fra Anton (33px e su) e Roboto (22px e giù).
- **Do** restringere i pesi a 300, 400 e 700. Non esiste il 500.
- **Do** riservare le ombre a `button-primary` e `card`, e lasciare piatto tutto il resto.
- **Do** tenere ogni angolo a 0px di raggio.
- **Do** tenere la navbar fissa a 77px, nera, senza bordo e senza blur, su ogni breakpoint.
- **Do** dichiarare `tabular-nums` su ogni colonna di orari, civici e CAP.
- **Do** mostrare indirizzo, orari e referente della sede come testo leggibile, senza richiedere un click.
- **Do** nominare per esteso sedi e istruttori: «Rozzano, Centro Aisha», mai «il nostro centro di zona».
- **Do** verificare il contrasto AA: il sistema è monocromo ad altissimo contrasto, quindi passa facilmente, ma `#333333` su `#1C1C1C` no. Il testo de-enfatizzato vive su superficie chiara.
- **Do** far sparire l'intera coreografia sotto `prefers-reduced-motion`, lasciando il contenuto completo.

### Don't:

- **Don't** usare il colore per distinguere due cose. Il rosso dice azione, il verde dice presenza, e non esiste un terzo ruolo: per separare due sezioni si cambia superficie, scala o peso.
- **Don't** colorare una superficie di sezione, un titolo o un bordo. Il rosso vive nel bottone primario, il verde in un segno da 8px accanto a una parola, il tricolore in una banda da 3px.
- **Don't** applicare le ombre di bottone o scheda al cromo strutturale (navbar, footer, wrapper di sezione).
- **Don't** arrotondare nessun angolo.
- **Don't** aggiungere `letter-spacing` ai titoli per fingere un look atletico.
- **Don't** introdurre una terza famiglia di caratteri.
- **Don't** usare un peso 500.
- **Don't** usare foto stock. Meglio nessuna immagine che una comprata.
- **Don't** usare gradienti come token. Il duotono dell'hero, se c'è, sta cotto nell'asset immagine, non ricostruito in CSS.
- **Don't** usare `background-clip: text` con un gradiente.
- **Don't** usare glassmorphism, blur decorativi o card di vetro.
- **Don't** ricadere nel **sito federale anni 2000**: home a news, PDF come navigazione, tabelle di orari illeggibili, fila di loghi di enti in footer.
- **Don't** consegnare un **SaaS template**: hero con gradiente, tre card identiche icona più titolo più testo, «Scopri di più».
- **Don't** virare al **fitness/wellness patinato**: palette da centro benessere, linguaggio da percorso di benessere.
- **Don't** aprire una modale come prima soluzione. Inline o progressivo prima.
- **Don't** animare proprietà di layout, né usare curve con rimbalzo o elastiche.
