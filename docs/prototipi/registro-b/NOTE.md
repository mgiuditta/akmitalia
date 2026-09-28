# Prototipo B: «La bacheca della sala»

Mappa #62, ticket #66. Branch `prototipo/registro-b-bacheca`. Specifica: il «Prompt B» di
`docs/research/riferimenti-ui.md` (branch `research/riferimenti-ui`). Pagine: home e scheda centro
(`/centri/binasco`). Screenshot a 1440 e 390, pagina intera: `home-1440.png`, `home-390.png`,
`centro-1440.png`, `centro-390.png`.

## Cosa cambia rispetto a Fenriz (lo stato di oggi) e perché

**Home.** Oggi apre su un eroe nero a tutto schermo con la foto generata, poi il bivio a
fisarmonica, i comuni, la foto della sala, la prima volta, le prove. Qui l'ordine lo dà la settimana:

1. **Testata chiara** (bianco): occhiello, titolo e riga dell'eroe dal global Impostazioni, i due
   inviti secondari di oggi. Accanto, **l'indice dei giorni**: un riquadro di carta con filetti in
   inchiostro, LUN…SAB in Anton, quante lezioni ha ogni giorno e l'etichetta «Oggi» sul giorno
   corrente (fuso Europe/Rome). Ogni giorno è un'ancora alla sua riga.
2. **La settimana** (grigio carta): una riga per giorno, sigla del giorno grande in Anton a sinistra
   (sticky sopra i 900px, perché il giovedì ha sei lezioni), le lezioni a destra in colonne separate
   da filetti da 1px. Ogni lezione: ora d'inizio grande in Anton, «fino alle 22:00», comune (link
   alla scheda, bersaglio 44px), palestra, corso, nota dell'orario, «con Vittorio Porreca».
   **Tutto calcolato dagli orari dei centri attivi a DB** (`src/components/board/week.ts`): 22
   lezioni in 15 centri. Un orario su più giorni diventa più lezioni. La domenica compare solo se
   qualcuno la tiene.
3. **Il bivio** come righe di un programma di stagione: ordinale in Anton, domanda (link al corso),
   nome del corso, sommario, e quanti centri lo tengono con i nomi (calcolato). Il percorso donne
   non ha centri attivi: niente «0», la frase «In questa stagione non ha un centro in calendario» e
   «Lascia comunque una richiesta» verso `/contatti?corso=<slug>`.
4. **Il blocco nero, la prima lezione**: i quattro punti di `Impostazioni > home.primaVolta`, con
   ordinale in Anton e filetti #333. È l'unico nero pieno fra barra e piede.
5. **Chi tiene le lezioni** (bianco): il testo delle qualifiche dal global, poi i docenti contati
   sulla bacheca: quante lezioni a settimana, qualifica o ruolo, dove. Vittorio Porreca 9, Omar
   Borghini 6, gli altri 1. Calcolato, non scritto.
6. **Prossimo passo** (grigio carta): i tre campi `passo*`, l'unico bottone rosso della pagina
   oltre alla barra.

Via le fotografie: l'eroe con `immagineHero` e la banda `immagineIngresso` non ci sono più, come
chiede il brief (sono generate). La pagina regge senza, e la direzione non ne ha bisogno.

**Scheda centro.** Oggi: testata nera, banda foto, una scheda con gli orari in 14px, mappa e
«Come arrivarci» in colonna. Qui:

1. **Testata chiara**: «Torna ai centri», H1 in due righe (comune grande, palestra in 300),
   «Attivo in questa stagione» col verde scuro. Accanto, **i fatti senza un click**, in un riquadro
   di carta: Dove (palestra, indirizzo, «Apri in Maps»), Quando (giovedì, 2 lezioni a settimana),
   Docente (Vittorio Porreca, maestro).
2. **Orario, protagonista** (grigio carta): GIO in Anton a 11rem, le ore in Anton a 5rem, corso
   (link), nota («Bambini dai 9 anni»), docente.
3. **Blocco nero: «La prima lezione a Binasco»**: per ogni corso del centro il campo `ingresso` del
   corso («…e un genitore può restare a guardarla»).
4. Prossimi eventi del centro (solo se ce ne sono; Binasco oggi non ne ha).
5. **Richiesta in pagina** con il centro già scelto, e accanto «Come arrivarci»: indirizzo,
   «Apri in Maps», mappa, slot foto dichiarato.

### Il modulo: in pagina e non `/contatti?sede=slug`

Scelto `RequestForm` in pagina, con `initialCenter`. La scheda è il punto in cui la decisione è già
presa (sera, ora, docente): mandarla su un'altra pagina, dal telefono e di sera, è un passaggio in
cui si perde gente, e PRODUCT.md misura il successo proprio sulla richiesta con la sede selezionata.
Il modulo è lo stesso di `/contatti` (stessa Server Action, stessa validazione, stessi testi e
interruttori del global Contatti), la preselezione si vede anche nella nota con l'indirizzo, e il
centro resta cambiabile. Per un centro non attivo, che non è fra le scelte, resta il rimando a
`/contatti`. Costo: la lettura del global Contatti è duplicata in
`src/components/board/requestFormSetup.ts` per non toccare `/contatti`, condivisa con gli altri
prototipi; se la direzione passa, `/contatti` legge da lì e la copia sparisce.

## Scelte prese senza chiedere

- **Roboto sopra i 22px per i titoli** (H1 fino a 84px, H2 a 40px, peso 700, maiuscolo e minuscolo
  normale). Si scontra con la Regola dello Stacco Netto di `DESIGN.md` (Roboto si ferma a 22px,
  Anton da 33px) e con la Regola del Maiuscolo. È quello che la specifica chiede («Roboto fa quasi
  tutto, anche i titoli»): qui lo stacco lo fa il ruolo (Anton = numero o sigla, Roboto = parola),
  non la misura. Per la regola di metodo di CLAUDE.md non l'ho corretto d'ufficio: se la direzione
  viene scelta, va deciso e scritto in `DESIGN.md` §3. Anton è rimasto solo su ore, sigle dei
  giorni, ordinali e conteggi, sempre in maiuscolo.
- **Filetti**: grigio riga su bianco, inchiostro su grigio carta, #333 su nero, come da specifica.
  Su bianco il #E8E8E8 è molto tenue: per questo l'indice dei giorni e i fatti della scheda sono
  riquadri di carta con filetti in inchiostro, cioè il pezzo di griglia che deve leggersi di più.
- **Nomi dei docenti per esteso** (`nome`, non `nomeBreve`): sulla bacheca si legge chi insegna.
- **«Oggi»** è un'etichetta nera scritta, non il verde: il verde resta sulla sola presenza del
  centro nella scheda.
- Il titolo del blocco nero è diventato «La prima lezione» (prima «Cosa succede quando entri»);
  il sottotitolo è quello di oggi. Le etichette «La settimana», «Chi tiene le lezioni», «Orario»,
  «Come arrivarci», «Apri in Maps», «fino alle», «Oggi» sono etichette d'interfaccia nel codice.
- La riga sotto «La settimana» è calcolata («22 lezioni in 15 centri, in ordine di giorno e di
  ora…»); quelle sotto «Orario» («Le lezioni sono settimanali, in giorno fisso, tutto l'anno») e
  «Richiedi informazioni» («la richiesta arriva a chi tiene le lezioni a Binasco») sono testo nel
  codice ricavato da affermazioni già presenti nel sito (primaVolta, intro di /contatti). Se si
  vuole che il cliente le cambi servirebbero campi nuovi: non li ho aggiunti per non toccare lo
  schema del DB condiviso.
- **Niente `cadenza`** dei corsi in home: il corso adulti dice «due sere a settimana», che i dati
  smentiscono.
- La frase «Non chiede di essere allenati per cominciare» del prompt non l'ho usata alla lettera:
  sta solo dentro il richText `descrizione` del corso adulti; il punto «Non serve essere allenati»
  di `primaVolta` dice la stessa cosa da un campo esistente.
- Slot foto della scheda: se il centro ha `foto` si vede con `Figure`, altrimenti un riquadro di
  carta con «Foto del centro in arrivo», non il segnaposto carbone di `Figure`, perché il nero in
  questa direzione è riservato alla prima lezione.
- Nessun movimento aggiunto. Lo sticky dei giorni è posizione, non animazione.
- Bug trovato strada facendo: con `select` sulla query delle sedi, Payload restituisce `docenti`
  vuoto dentro l'array `orari`. In home la query delle sedi non usa `select` (commentato nel
  codice); `buildWeek` accetta comunque una mappa id → nome come ripiego.

## Cosa non ho fatto, e perché

- **Il piè resta carbone** (#1C1C1C), non nero: è `SiteFooter`, condiviso da tutte le rotte.
- **La CTA della barra sulla scheda centro** porta ancora a `/contatti`: sulla scheda con il modulo
  in pagina dovrebbe diventare «Vai al modulo» → `#modulo` (la stessa logica di ADR-0008 e della voce
  39 dell'audit). La CTA arriva dal layout, e cambiarla per rotta tocca il guscio condiviso.
- `/contatti` non legge da `requestFormSetup` (vedi sopra).
- Nessuna modifica a DESIGN.md, ADR, schema o dati.
- `pnpm lint` non gira: ESLint 9.39.5 si ferma con «Converting circular structure to JSON» nella
  validazione della config (`FlatCompat`). **Succede identico su `origin/main`** (verificato con
  `git stash`): non è introdotto qui. `npx tsc --noEmit` è pulito.
- Il selettore della data nel modulo mostra `mm/dd/yyyy`: è la lingua del Chromium headless, non
  del sito.

## Font

Nessun font nuovo: Anton (OFL 1.1) e Roboto (Apache 2.0), già in `public/font/`.

## Ambiente

Preparato prima di questo lavoro, non rifatto: Postgres installato via apt nel container, ruolo e
DB da `.env.example`, `.env` copiato con gli SMTP vuoti, `pnpm install`, `pnpm fonts:download`,
semina (`import:centers`, `centers:geocode`, `pages:legal`, `courses:content`, `import:events`,
`images:editorial`): tutto riuscito; il geocode ha dato coordinate a tutti i centri tranne
Mulazzano. Dev server sulla porta 3002. I riquadri della mappa Leaflet (tile OpenStreetMap) non si
caricano perché il container non ha rete: negli screenshot la mappa è un fondo scuro con il solo
marker. Il cerchio con la «N» a sinistra negli screenshot è l'indicatore di sviluppo di Next.

## Skill non disponibili

`design-taste-frontend` e `antislop:antislop-ui` non sono installate in questa sessione. Al loro
posto ho seguito le regole dell'audit antislop 001 (voci ed esiti: 3 anello per superficie, 4
bersagli 44px, 7 niente zeri, 8/10 niente fatti senza fonte, 11 niente foto generate con persone,
13 centro non attivo dichiarato, 19 rosso solo azione, 22 verde dove distingue, 24 un rosso nella
prima schermata, 28 richiesta con sede preselezionata) e `DESIGN.md`.
