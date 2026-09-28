# Registro A, «Fenriz ripulito»: note del prototipo

Mappa [#62](https://github.com/mgiuditta/akmitalia/issues/62), ticket [#66](https://github.com/mgiuditta/akmitalia/issues/66). Specifica: «Prompt A: Fenriz ripulito» in `docs/research/riferimenti-ui.md` (ramo `research/riferimenti-ui`). Branch `prototipo/registro-a-fenriz-ripulito`, da `origin/main`.

Pagine: la home (`/`) e la scheda di un centro (`/centri/[slug]`), provate su `bresso`. Screenshot a pagina intera in questa cartella: `home-1440.png`, `home-390.png`, `centro-1440.png`, `centro-390.png`.

## Cosa cambia rispetto a Fenriz di oggi, e perché

La prova di tutto: nella prima schermata della home, a 1440 e a 390, c'è una lezione vera letta dal DB. Negli screenshot: «Domani, martedì 29 settembre, 20:15-21:45, San Giuliano Milanese, Accademia Arte Danza, docente Vittorio Porreca, Krav Maga adulti», più le due lezioni successive (Paderno Dugnano con Omar Borghini, Sesto San Giovanni con Paolo).

### Tre difetti della specifica, tre correzioni

1. **Sembrava un template da palestra: sezioni tutte uguali.** Ora ogni sezione ha una forma sua e nomina un luogo o una persona:
   - **apertura** (nero): titolo a sinistra, a destra la lastra bianca della *prossima lezione*;
   - **bivio** (bianco): tre righe a tre colonne (domanda, sommario, *dove*). La colonna «dove» nomina i centri: «In tutti i 15 centri», «In 4 centri: Binasco, Bresso, Milano Bisceglie / Lorenteggio e Paderno Dugnano», ognuno con il suo link;
   - **centri** (grigio carta): una directory con ogni centro, giorno, ora, nota e docente («Bresso, Palestra Beauty Island, Giovedì 18:30 Bambini, Giovedì 20:30 Adulti e Ragazzi, Con Omar Borghini»);
   - **chi insegna** (nero, l'unico altro blocco nero): Vittorio Porreca e Omar Borghini con ruolo, credenziali dell'albo e «Insegna a...», poi i trainer per nome;
   - **cosa succede quando entri** (bianco): slot foto dichiarato, i quattro punti numerati; il quarto («Con chi parli») porta tre esempi veri, centro e docente;
   - **prossimo passo** (grigio): un form GET con la select dei centri che apre `/contatti?sede=<slug>`, quindi la richiesta parte già con il centro.
2. **Era cupo.** Oggi in home sono nere o carbone l'eroe, l'intestazione del bivio, due righe su tre del bivio, la banda foto, «Cosa succede quando entri» e «Le qualifiche si contano»: le chiare sono due. Qui il nero sta alla barra, all'apertura e a «Chi insegna». Il resto è bianco e grigio carta: le sezioni chiare sono quattro su sei. L'apertura non occupa più l'88% dello schermo: la sua altezza la decide il contenuto.
3. **Aveva la soglia alta.** Il display (Anton) compare **una volta per pagina**: l'H1. È in `.a-display`, `clamp(3.5rem, 6.5vw, 6rem)`, cioè 56px a 390 e al massimo 96px a desktop. L'H1 della home è il titolo di Impostazioni («Difendersi si impara», tre parole); quello della scheda è il luogo («Bresso»). I titoli di sezione passano a Roboto 700 22px (`.a-title`), il tetto della scala funzionale: la gerarchia la fanno la composizione, la superficie e il dato. La Regola dello Stacco Netto regge.

### Scheda del centro

- **Prima schermata senza click**: nero con «Torna ai centri», «Centro tecnico AKM Italia», il luogo in display, la palestra, «Attivo in questa stagione» (verde accanto alla parola). A fianco (sotto, su telefono) la stessa lastra bianca della home con **Dove** (indirizzo a 22px, «Apri in Maps» da 44px) e **Quando**: gli orari raggruppati per giorno («Giovedì» una volta, poi 18:30-19:30 Krav Maga kids · Bambini, Con Omar Borghini; 20:30-22:00 Krav Maga adulti · Adulti e Ragazzi, Con Omar Borghini). A 390 si vedono indirizzo, orari e docente dentro gli 844px del primo schermo.
- **Chi ti accoglie a Bresso** (bianco): la persona con ruolo e credenziali, e come si entra corso per corso. Il testo viene dal campo `ingresso` dei corsi («La prima lezione si concorda con il docente del centro, e un genitore può restare a guardarla.»), non è scritto nella pagina.
- **Come arrivare a Bresso** (grigio): palestra, indirizzo, la `descrizione` del centro («punto di riferimento per Sesto San Giovanni, Bruzzano e Bicocca»), «Apri in Maps», lo slot foto dichiarato «Foto del centro in arrivo» e la mappa.
- **Scrivi al centro di Bresso** (bianco): il modulo intero, con il centro già selezionato e la nota con l'indirizzo.

### Il modulo: `RequestForm` dentro la scheda, non il link `/contatti?sede=slug`

Ho scelto di **riusare `RequestForm` nella scheda**. Perché:

- PRODUCT.md misura il successo sulla richiesta inviata con la sede selezionata. Nella scheda la sede è già decisa: mandare la persona su un'altra pagina aggiunge un passo e un caricamento proprio nel punto della conversione.
- La preselezione è la stessa di `/contatti?sede=`: `initialCenter` e la nota con indirizzo e «Apri in Maps». La Server Action, la validazione, il Turnstile e l'anti-bot sono quelli di `/contatti`, perché il componente è lo stesso.
- Per non avere due moduli che divergono, la lettura di centri, corsi, testi e interruttori del global Contatti è passata in `src/components/requestFormData.ts` (`loadRequestForm`). `/contatti` ora usa quella funzione, con lo stesso comportamento (verificato: `?sede=bresso` preseleziona Bresso).
- Il link a `/contatti?sede=slug` resta dove un modulo intero non ci sta: la chiusura della home (form GET) e la CTA in barra.
- Per un centro non attivo il modulo parte senza sede, come faceva il link: quel centro non è fra le scelte (verificato su `/centri/muggio`).

Nella lastra c'è anche «Scrivi al centro», un'ancora a `#richiesta`. È **secondario, non rosso**: nella prima schermata il rosso resta uno solo, quello della barra (audit 001, voce 24). Il rosso della scheda è l'invio del modulo.

### «Prossima lezione»: come si calcola

`src/components/lessons.ts`, `upcomingLessons()`. Scorre gli orari dei centri attivi e pubblicati e calcola quanti minuti mancano a ogni lezione della settimana, nel fuso **Europe/Rome** qualunque sia il fuso del server. Ordina e prende la prima. Scrive «Oggi» o «Domani», oppure il giorno, più la data per esteso. Una lezione già cominciata passa alla settimana dopo. La home ha `revalidate = 60`, quindi la lastra si aggiorna durante la sera. Senza orari a DB la lastra non si stampa, perché non c'è niente da promettere.

## Scelte prese senza chiedere

- **Niente foto dell'eroe né del video.** Le foto di partenza sono generate (ADR-0012) e il brief le esclude. L'apertura resta tipografica, e la «immagine» della prima schermata è il dato. `immagineHero` e `videoHero` non si leggono più in home: quando il cliente carica foto e video veri, si decide se e dove tornano.
- **Lo slot «Cosa succede quando entri» è un segnaposto dichiarato** (`Figure` con `slot={null}`, «Foto della sala in arrivo»), anche se `home.immagineIngresso` ha un file: quel file è generato. Nella scheda invece `center.foto` passa com'è, perché la foto di un centro, se c'è, la carica il cliente.
- **Il nome del centro si divide sul « - »**: «Bresso - Palestra Beauty Island» diventa il luogo «Bresso» (H1, massimo sei parole) e la palestra «Palestra Beauty Island». Se il nome non ha il trattino, il luogo diventa la città e la palestra il campo `palestra` (`splitCenterName`).
- **I docenti si nominano per intero** («Omar Borghini», non «Omar») sulla home e sulla scheda: `fullName` preferisce `nome` a `nomeBreve`.
- **Nella scheda «Chi ti accoglie»** mostra i docenti delle righe d'orario, e solo se le righe non ne hanno ripiega sui docenti del centro (`istruttori`).
- **Nella home ho tolto `select` dalla query delle sedi.** Con `select`, la Local API popolava il corso della riga d'orario ma lasciava i docenti come id, e il nome spariva dalla prima schermata. Il commento è nel codice.
- **Le etichette di interfaccia sono nel codice**: «Prossima lezione», «Docente», «Corso», «Dove», «Quando», «Apri in Maps», «Chi insegna», «Chi ti accoglie a…», «Come arrivare a…», «Scrivi al centro di…», «Il centro che ti resta comodo», «Non lo so ancora», «E nei centri:». Lo stesso vale per la riga «AKM non pubblica telefono né email per centro: il contatto passa da qui.», che riprende CONTEXT.md («Docente»). Il copy editoriale continua a venire da Impostazioni (eroe, bivio, `home.primaVolta`, `testoQualifiche`, `passo*`) con i ripieghi di prima. Nessun campo nuovo e nessuna modifica allo schema.
- **La chiusura della home** usa `passoBottone` come etichetta del bottone rosso e un form GET al posto del link nudo a `/contatti`: senza JavaScript funziona uguale.
- **I due inviti dell'apertura** restano secondari (audit 001, voce 24). Sul nero prendono un filetto interno da 1px `#333`, perché carbone su nero quasi non si vede. Non è né una tinta né un'ombra.

## Cosa non ho fatto, e perché

- **Il nome «AKM ITALIA» nel piede resta in Anton.** A rigore è un secondo uso del display nella pagina. Il piede è condiviso con tutte le rotte e il brief chiede di non cambiare le classi condivise: se la direzione passa, il piede va portato a Roboto (o al lockup della barra) insieme alle altre pagine.
- **Il pannello del menu resta com'è** (voci in Anton 55px): è cromo condiviso, e sta fuori dalla pagina.
- **Niente movimento nuovo**: nessuna `.reveal` sulle sezioni nuove. MOTION 2 resta rispettato dal menu e dalla mappa.
- **Le altre rotte non cambiano.** Stili nuovi solo in `src/app/(frontend)/proto.css`, con classi `a-*` importate in fondo a `styles.css`. Unica eccezione, il refactor di `/contatti` descritto sopra, che non cambia il comportamento. Ho controllato che rispondano 200 `/centri`, `/centri/muggio`, `/contatti?sede=bresso`, `/corsi`, `/corsi/krav-maga-antibullismo`, `/istruttori` e `/eventi`.
- **DESIGN.md e gli ADR non li ho toccati.** Se la direzione passa, vanno emendati almeno: la scala display di §3 (il tetto passa da 120 a 96px e il display compare una volta per pagina), l'`hero-heading` e il `section-heading` di §6 (i titoli di sezione passano a Roboto 22px) e il RHYTHM di §1 (l'alternanza pesa più sul chiaro).

## Domande per il cliente, trovate sui dati

- La `descrizione` di Bresso a DB dice «Il Centro Tecnico Bresso e inoltre…», senza l'accento su «è». È un dato dell'import: si corregge dall'admin.
- A Bresso manca il CAP (`indirizzo.cap` vuoto; il prompt dice 20091). La scheda stampa l'indirizzo senza CAP, come arriva.
- Il campo `cadenza` del Krav Maga adulti dice «Nella maggior parte dei centri due sere a settimana», e i dati lo smentiscono (lo nota già la ricerca). Questo prototipo non lo mostra.

## Ambiente

- Postgres installato via apt nel container. Ruolo e DB creati dai valori di `.env.example` (`payload` / `akm` su 127.0.0.1:5432). `.env` copiato dall'esempio con le variabili SMTP vuote (nel log di Payload: «No email adapter provided»).
- `pnpm install`, `pnpm fonts:download` (Anton e Roboto in `public/font/`).
- Semina: `import:centers`, `centers:geocode`, `pages:legal`, `courses:content`, `import:events`, `images:editorial`, tutti riusciti. Il geocode è riuscito ovunque tranne Mulazzano, che resta senza coordinate. Il DB è condiviso con gli altri tre prototipi: non ho scritto dati e non ho cambiato lo schema.
- Dev server sulla porta 3001 (`pnpm dev -p 3001`), fermato dopo gli screenshot. Gli screenshot sono fatti con `/tmp/claude-0/shoot.mjs` (Playwright, reduced-motion) alle 23:20 circa del 28 settembre, ora di Roma: per questo la prossima lezione è «Domani, martedì 29 settembre».
- **Tile della mappa assenti**: il container non ha rete verso OpenStreetMap, quindi il riquadro Leaflet mostra solo il fondo carbone e il marker. È un limite dell'ambiente, non del prototipo.
- **Font**: nessun font nuovo. Solo Anton (OFL 1.1) e Roboto (Apache 2.0), già nel repo.
- **Skill non disponibili**: `design-taste-frontend` e `antislop:antislop-ui` non sono installate in questa sessione. Al loro posto ho usato le regole R-xx e gli esiti dell'audit antislop 001 (`docs/antislop/audit-001-2026-09-16.md`) e DESIGN.md. In particolare: voce 3 (anello che segue la superficie: `--ring` sulla lastra e sull'apertura), voce 4 (44px per i controlli isolati: «Apri in Maps», nomi dei centri, link della lastra e degli esempi), voce 7 e ADR-0013 (niente «0», che per il percorso donne diventa «In questa stagione non è in calendario» più un link al modulo con il percorso già scelto), voce 22 (in home il verde non si ripete sui centri, resta solo sulla scheda), voce 24 (un rosso per schermata), voce 28 (la conversione con la sede già scelta).

## Verifiche

- `npx tsc --noEmit`: pulito.
- `pnpm lint`: **si rompe anche su `main`** con `TypeError: Converting circular structure to JSON` in `@eslint/eslintrc` (`FlatCompat` sopra `eslint-config-next` 16). Verificato con `git stash`: è un difetto preesistente della configurazione, non di questo prototipo. Per controllare i file toccati ho usato un config flat temporaneo che importa direttamente `eslint-config-next/core-web-vitals` e `eslint-config-next/typescript`: zero errori e zero avvisi. Il config temporaneo l'ho cancellato e non è nel commit.
