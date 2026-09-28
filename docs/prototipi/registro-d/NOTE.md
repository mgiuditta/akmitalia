# Prototipo D: «Ospiti di sera»

Mappa #62, ticket #66. Branch `prototipo/registro-d-libera`. Home e scheda centro (`/centri/bresso`).

## L'idea, prima del codice

1. AKM non ha una palestra sua: è ospite, quasi sempre una sera a settimana, di quindici sale che di giorno sono altro (una scuola di danza, un istituto comprensivo, un club sportivo).
2. Il sito lo dice invece di nasconderlo: ogni centro è una serata, cioè la sala che ospita, il giorno, l'ora e il docente con nome, e la home si apre sulle serate di stasera (o della prossima sera con lezione), calcolate dagli orari veri.
3. Chi arriva lo fa di sera e dal telefono: la prima cosa che legge è «stasera si pratica a Cinisello, Corsico, Saronno», non uno slogan; la seconda è «dove abiti?», con le zone di riferimento dei centri trasformate in uno stradario (quartiere o comune → la sua sera).
4. Poi le persone che portano la serata da una sala all'altra (Omar Borghini e Vittorio Porreca, con le loro sere della settimana), le presentazioni di inizio stagione come prime serate, e il bivio per chi domanda.
5. La scheda del centro è la locandina di quella serata: chi ospita, il giorno in grande, orari e docente, la prossima data vera, da dove ci si arriva, «Apri in Maps» e il modulo già sul centro nella stessa pagina.

Perché solo AKM: una palestra qualunque ha una sede sua ed è aperta tutti i giorni; «stasera» e «chi ti ospita» hanno senso solo per un'associazione che prende in prestito quindici sale una sera a settimana.

## Cosa cambia rispetto a Fenriz (lo stato di oggi)

Palette, token, wordmark, barra, menu e piè restano quelli di oggi. Cambiano composizione e ordine delle sezioni di home e scheda centro. Gli stili nuovi stanno in `src/app/(frontend)/proto.css` (importato in fondo a `styles.css`), con classi `ev-*` e `zf*`: nessuna classe condivisa cambia significato, le altre rotte restano come sono.

**Home**

1. **La prossima sera, al posto dell'eroe fotografico.** Titolo dell'eroe (da Impostazioni) sotto i 96px, e accanto la tavola della prossima sera con lezione: ora in Anton, luogo, «da» la struttura ospitante, corso e docente. È calcolata dagli orari veri in Europe/Rome (`src/components/evenings.ts`): se l'ultima lezione di oggi è finita passa a domani. Negli screenshot, presi lunedì 28 settembre alle 23:20, dice «Domani, martedì 29 settembre: San Giuliano Milanese, Paderno Dugnano, Sesto San Giovanni». Nella prima schermata ci sono luogo, giorno, ora e nome del docente veri. La foto generata dell'eroe non si mostra (brief).
2. **«Dove abiti?»**, lo stradario. Le zone di riferimento, che oggi stanno solo nella prosa della descrizione di ogni centro, diventano un indice di 97 voci (comuni dei centri più zone scritte). Un campo di ricerca (`ZoneFinder`, client) filtra e risponde con la sera degli adulti, la sala e il link alla scheda: «Bicocca: giovedì 20:30 Bresso, giovedì 20:30 Milano Affori». Senza JavaScript resta l'indice completo in un `<details>`. Tre esempi cliccabili sono le zone servite da più sale.
3. **«Chi porta la serata».** I docenti che tengono più di un centro, calcolati dagli orari: Vittorio Porreca (6 sale, 6 sere) e Omar Borghini (3 sale, 4 sere), sera per sera. Sotto, per nome, chi insegna nelle altre sale e il link all'albo. Qui va il testo delle qualifiche (`home.testoQualifiche`), accanto alle persone invece che in una sezione di numeri.
4. **«Le prime sere della stagione».** Le prossime sei presentazioni (tipo `presentazione`, da oggi in poi) con data in Anton e luogo. La presentazione per bambini si dichiara («per bambini e ragazzi»). Il titolo «Lotta Metodo Krav Maga» non si stampa: è una domanda aperta per il cliente (ricerca, §3).
5. **Il bivio per chi domanda.** Le tre domande restano (da Corsi) ma non sono più una fisarmonica: a destra c'è dove si pratica, non un conteggio astratto. «In tutti i 15 centri», «In 4 centri: Binasco, Bresso, Milano Bisceglie / Lorenteggio e Paderno Dugnano». Per il corso donne, senza centri: niente «0», la frase «In questa stagione non è in calendario in nessun centro. Lascia comunque la richiesta» con il link a `/contatti?corso=…`.
6. **Cosa succede quando entri** (`home.primaVolta`) in quattro colonne numerate su nero, **Prossimo passo** (`home.passo*`) con l'unico bottone rosso della pagina.

Tolte dalla home: la banda foto generata («Cosa succede quando entri»), la sezione «N centri in N province» con i nomi dei comuni (lo stradario fa di più), i numeri di «Le qualifiche si contano» (i docenti con le loro sere sono la prova).

**Scheda centro (`/centri/bresso`)**

1. **La locandina** su nero, tutta nella prima schermata a 1440: «Centro tecnico AKM, ospite di Palestra Beauty Island», il posto in Anton («Bresso»), la sala sotto; «Attivo in questa stagione» col verde; il giorno in grande («Giovedì») con le righe orario, corso, nota e «con Omar»; «La prossima sera è giovedì 1 ottobre», calcolata. A destra, su carbone: indirizzo, «Apri in Maps», «Scrivi a questo centro» (ancora al modulo), e «Ci arrivano anche da: Sesto San Giovanni, Bruzzano, Bicocca».
2. **Chi insegna qui**, con le altre sale dove lo stesso docente porta la serata («Porta la serata anche a Paderno Dugnano e Brugherio»), gli eventi futuri del centro se ce ne sono, e lo slot foto dichiarato («Foto della sala in arrivo», `Figure` su `Sedi.foto`, ADR-0012).
3. **Il modulo nella scheda**, con il centro già scelto.

Tolte dalla scheda: la mappa Leaflet (una sola puntina su tile che qui non si caricano; «Apri in Maps» e le zone dicono di più), l'elenco «Cosa si pratica qui» (ripeteva gli orari), il bottone «Tutti i percorsi».

## Scelte prese senza chiedere

- **Il modulo è `RequestForm` dentro la scheda, non il link `/contatti?sede=slug`.** Il successo del sito (PRODUCT.md) è la richiesta con la sede scelta; sul telefono, di sera, un passaggio di pagina in meno conta, e il componente supporta già `initialCenter`, la nota con l'indirizzo e la stessa Server Action. Il costo: la scheda legge anche il global Contatti e i corsi (restano ISR a 60 secondi, niente `searchParams`), e la logica dei testi del modulo è copiata da `contatti/page.tsx` (da estrarre in un helper se la direzione passa). Per un centro non attivo niente modulo preselezionato: un bottone a `/contatti` senza sede, come oggi.
- **Le zone si ricavano dalla descrizione.** Non esiste un campo: la frase «è inoltre il punto di riferimento per le zone di …» è scritta sempre uguale dall'import, e `referenceZones()` la legge. Se la frase non c'è (Corsico, Saronno, Sesto, Binasco), il centro non ha zone e la descrizione resta intera. **Campo da aggiungere** se la direzione passa: `Sedi.zone` (array di testo, facoltativo), così il cliente le cura senza dipendere dalla forma di una frase. Non l'ho aggiunto per non toccare lo schema del DB condiviso.
- **Il nome del posto** («Milano Affori», «Pontesesto Rozzano») è la parte del nome del centro prima di « - », non la città: a Milano i centri sono tre.
- **Testi nuovi nel codice, da portare in Impostazioni se la direzione passa** (campi facoltativi con `defaultValue`): l'introduzione di «Dove abiti?» (`home.testoZone`), la riga «La presentazione è la lezione aperta di inizio stagione» (`home.testoPresentazioni`), e l'apertura del modulo in scheda, che usa alla lettera due frasi del prompt («La prima lezione si concorda con il docente del centro. Non chiede di essere allenati per cominciare.»). Titoli di sezione ed etichette («Chi porta la serata», «Apri in Maps», «Ci arrivano anche da») restano nel codice come interfaccia.
- **«Ospite di»** è un fatto scritto in CONTEXT.md: la palestra è la struttura che ospita il centro e non appartiene ad AKM. «Quasi sempre una sera a settimana» viene dai dati (13 centri su 15). Niente «due sere».
- **Anton**: il display pieno compare una volta (titolo dell'eroe, posto in scheda); gli altri usi sono numeri, giorni e titoli di sezione a 33-55px.
- **Il rosso** resta uno per schermata oltre alla barra: «Prossimo passo» in home, «Invia la richiesta» in scheda. Gli inviti della prima schermata sono secondari. In scheda il secondario su carbone passa al nero, altrimenti sparirebbe.
- **Il verde** sta dove distingue: «Oggi/Domani» sulla tavola (dato vivo), «Attivo» in scheda, i conteggi dei centri per percorso; sempre con la parola.

## Cosa non ho fatto

- `/contatti` non l'ho toccato (resta con la sua copia della logica del modulo).
- Nessun campo nuovo nello schema (vedi sopra), nessun font nuovo: Anton e Roboto come oggi.
- La foto del centro resta lo slot dichiarato; le foto generate di Impostazioni non si mostrano.
- Nessun movimento nuovo: niente `.reveal` sulle sezioni nuove, solo transizioni di colore di fondo al puntatore, che sotto `prefers-reduced-motion` vanno a zero con i token.
- Lo stato del finder «nessuna zona trovata» e il `<details>` aperto non sono negli screenshot; li ho provati a mano (Playwright, «bicoc» → Bicocca, due sale).

## Verifiche

- `npx tsc --noEmit`: pulito.
- `pnpm lint`: si ferma con un errore di configurazione di ESLint («Converting circular structure to JSON … property 'react' closes the circle», da `@eslint/eslintrc` con `eslint.config.mjs`). **C'era già su main**: con `git stash -u` il comando fallisce allo stesso modo. Quindi il lint non ha potuto giudicare i file nuovi.
- Screenshot a 1440 e 390, pagina intera, reduced-motion: `home-1440.png`, `home-390.png`, `centro-1440.png`, `centro-390.png`. La striscia chiara a destra negli scatti a 390 è la barra di scorrimento del Chromium headless, non un'uscita di pagina (`scrollWidth` 375 su 390).

## Ambiente

- Postgres installato via apt nel container, ruolo e DB `akm` da `.env.example`; `.env` copiato con i campi SMTP vuoti; `pnpm install`; `pnpm fonts:download` (Anton, Roboto).
- Semina: `import:centers`, `centers:geocode`, `pages:legal`, `courses:content`, `import:events`, `images:editorial`, tutte riuscite; il geocode ha trovato le coordinate di tutti i centri tranne Mulazzano. Il DB è condiviso con gli altri prototipi: non l'ho modificato.
- Dev server solo su `-p 3004`, fermato dopo gli screenshot.
- I riquadri della mappa (tile OpenStreetMap) non si caricano: il container non ha rete. In questa direzione la mappa non c'è comunque più nella scheda.
- Le skill `design-taste-frontend` e `antislop:antislop-ui` non sono installate in questa sessione: al loro posto ho usato le regole dell'audit antislop 001 (R-xx ed esiti) e `DESIGN.md`.
