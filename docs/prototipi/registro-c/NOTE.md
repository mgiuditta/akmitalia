# Prototipo C: «La segnaletica»

Mappa #62, ticket #66. Branch `prototipo/registro-c-segnaletica`, da `origin/main` (`aaf6675`).
Specifica: il «Prompt C: La segnaletica» in `docs/research/riferimenti-ui.md` (branch `research/riferimenti-ui`).
Pagine: la home e la scheda di un centro, qui `/centri/pontesesto-rozzano`.

## Screenshot

| File | Cosa mostra |
|---|---|
| `home-1440.png`, `home-390.png` | la home al primo caricamento, senza posizione (ordine alfabetico) |
| `home-1440-posizione.png`, `home-390-posizione.png` | la prima schermata dopo il click su «Usa la mia posizione» (Playwright con una posizione finta vicino a Rozzano, 45.395 / 9.16) |
| `centro-1440.png`, `centro-390.png` | la scheda di Pontesesto Rozzano |

Tutti a pagina intera, con reduced-motion, dal DB seminato condiviso.

## La direzione in cinque righe

Il sito come la segnaletica di una rete di trasporti. La home fa due domande numerate come binari:
**1 Dove sei?** (lo schema della rete e i cartelli dei centri) e **2 Qual è il tuo momento?** (i tre
percorsi come cartelli di direzione). Ogni centro è un cartello di stazione: il nome del posto in Anton
grande, la targa della provincia, la struttura sotto, le zone servite come fermate di una linea bianca, e
appeso sotto un pannello chiaro con indirizzo e orari. La scheda del centro è lo stesso cartello in grande,
con l'orario come protagonista, l'indirizzo con «Apri in Maps» e il modulo con il centro già scelto.

## Cosa è cambiato rispetto a Fenriz (lo stato di `main`)

### Home

- **L'eroe non è più una fotografia: è la rete.** A sinistra occhiello, titolo e riga del global
  (`Impostazioni > eroe`), poi il passo «1 Dove sei?» con «Usa la mia posizione». A destra lo schema dei
  centri: un quadrato per centro, il nome scritto accanto, il Duomo come riferimento, la scala a 5 km.
  La foto e il video dell'eroe non si mostrano (sono generati, vedi il brief).
- **I cartelli dei centri** sostituiscono le otto righe di comuni e il rimando a `/centri`. Sono i 15
  centri attivi con indirizzo e orari in chiaro, perché la domanda della home ora è «dove».
- **Con la posizione** l'elenco si riordina per distanza, ogni cartello porta «a N km da te, in linea
  d'aria», il primo porta «Il più vicino a te» (verde più parola), in cima compare il cartello grande del
  più vicino e sullo schema compaiono «Sei qui» e una linea tratteggiata bianca fino al centro.
- **Il bivio** diventa tre cartelli di direzione affiancati: la domanda in Anton su nero, il nome del
  corso, la freccia, e sotto su bianco il sommario e i comuni che lo tengono come fermate. Il corso
  adulti dice «In tutti i 15 centri» invece di ripetere la rete intera. Il corso donne, che oggi non ha
  un centro attivo, non stampa «0»: «In questa stagione non ha un centro attivo. Puoi lasciare comunque
  la richiesta» con il link a `/contatti?corso=…`.
- **Nuovo: «Prossimi appuntamenti»**, il tabellone delle partenze: i prossimi cinque eventi dal DB, con
  data e ora in Anton, il posto per esteso e il tipo scritto.
- Restano com'erano «Cosa succede quando entri», «Le qualifiche si contano» e «Prossimo passo»: non sono
  il cuore della direzione e le loro forme reggono. Esce la banda foto sopra «Cosa succede quando entri»
  (`home.immagineIngresso`, generata).

### Scheda del centro

- **La testata è il cartello della stazione**: targa «MI», «Centro tecnico», il nome del posto in
  `hero-display` («PONTESESTO ROZZANO»), la palestra sotto, «Attivo in questa stagione» (verde più
  parola), e la linea «Punto di riferimento anche per» con le zone servite. A destra (sopra i 1000px) lo
  stesso schema della home con questo centro pieno e nominato su lastra bianca e gli altri in bianco
  leggero, come contesto.
- **L'orario è il protagonista**: su bianco, giorno e ora in Anton `display-md`, colonne comuni a tutte
  le righe (subgrid), cifre tabulari, corso, nota e «Docente: Luca» leggibili senza click.
- **Il pannello chiaro dell'indirizzo** (grigio carta): palestra, indirizzo a 22px, le note d'accesso
  quando la descrizione ne ha (Corsico, San Donato), «Apri in Maps» come bottone da 44px, la mappa Leaflet
  di dettaglio e lo slot foto dichiarato «Foto del centro in arrivo».
- **Il modulo sta nella scheda**, con il centro già selezionato (vedi le decisioni).
- «Cosa si pratica qui» esce: il corso è già scritto in ogni riga d'orario. «Tutti i percorsi» come
  secondario esce: sta in barra e nel menu.

## Decisioni prese senza chiedere

1. **Schema disegnato come eroe della home, Leaflet sulla scheda.** Lo schema è HTML posizionato dalle
   coordinate del DB con una proiezione equirettangolare (coseno della latitudine media), più un SVG per
   l'unica linea (da te al più vicino). Perché regge meglio di Leaflet come eroe: si legge senza tile e
   senza rete (qui le tile OSM non arrivano, e l'eroe non può essere un rettangolo grigio), il nome di
   ogni centro è sempre scritto (Leaflet li mette nei popup, cioè dietro un click), i marker sono link
   veri da 44px raggiungibili col tab, non chiede niente a un server di mappe e pesa zero. È uno schema,
   non una carta: per navigare c'è «Apri in Maps», come vuole ADR-0002. Sulla scheda invece resta
   `CenterMap` (Leaflet, riusato così com'è): lì la domanda è «dov'è la porta», e a zoom 15 solo le
   strade vere rispondono. In produzione le tile ci sono; qui il riquadro Leaflet resta vuoto (vedi Limiti).
2. **Il modulo nella scheda invece del link `/contatti?sede=slug`.** PRODUCT.md misura il successo sulla
   richiesta con la sede selezionata, e la scheda è la conversione: sul telefono, di sera, un salto di
   pagina in più è un posto dove perdere chi aveva deciso. `RequestForm` sa già partire da un centro
   (`initialCenter`), e il modulo si ripete uguale a `/contatti`: stessi campi, testi del global Contatti,
   Server Action. Le letture del global sono raccolte in `src/components/requestFormProps.ts`; `/contatti`
   non è toccata, ma se la direzione passa legge da lì e la copia sparisce. Per un centro non attivo il
   modulo parte senza sede, come prima.
3. **La posizione si chiede in home, sul click, e non con un link a `/centri?vicino=1`.** ⚠ Scarto dal
   testo di ADR-0010 («In home il bottone e' un link a `/centri?vicino=1`»), non dal suo principio: mai al
   caricamento, solo dopo un gesto, resta nel browser, `sessionStorage` con la stessa chiave di `/centri`,
   stati detti a parole in `aria-live`. In questa direzione la home è il cercatore: mandare altrove per
   rispondere a «dove sei?» spezzerebbe la domanda dalla risposta. Se la direzione passa, ADR-0010 si
   emenda su questo punto (non l'ho toccato: il brief lo vieta). In più una riga sotto il bottone dice
   «La posizione resta nel tuo browser», che è quanto ADR-0010 già scrive.
4. **Le zone servite si leggono dalla descrizione**, con un'espressione regolare sulla frase «punto di
   riferimento per le zone (di) …», invece di aggiungere un campo al DB condiviso. La scheda stampa della
   descrizione solo quello che resta (le note d'accesso). **Campo da aggiungere** se la direzione passa:
   `sedi.zoneServite`, un array di testi, facoltativo; allora la regex sparisce.
5. **Ordine alfabetico per nome del cartello, non per comune.** Il cartello è la parte del nome prima
   della palestra («Milano Bisceglie / Lorenteggio», «Pontesesto Rozzano»), e i cartelli si ordinano per
   quello che c'è scritto sopra: con l'ordine per `indirizzo.citta` Pontesesto Rozzano starebbe a «R» sotto
   un titolo che comincia per «P». È uno scarto minore da ADR-0001, da confermare.
6. **Il verde.** Pesa di più, come chiede la direzione: i quadrati dello schema e il più vicino. Resta
   sempre accanto a un nome scritto. A 390px lo schema è un'anteprima e i nomi non ci stanno: escono dalla
   vista (restano nell'albero di accessibilità) e i quadrati tornano bianchi, così il verde resta solo al
   centro che porta il nome. Nei cartelli il verde c'è solo su «Il più vicino a te» (DESIGN.md: «il verde
   sta dove distingue»).
7. **Le linee sono bianche su scuro e carbone su chiaro**; la linea «da te al centro» è tratteggiata,
   perché è in linea d'aria e non un percorso. Niente griglie, mirini o coordinate: il solo riferimento
   è il Duomo, un luogo che chiunque a Milano sa mettere sulla carta.
8. **Il numero del passo** («1», «2») è una targa quadrata come il numero di un binario. «Dove sei?» è
   un'etichetta d'interfaccia nel codice; il titolo della seconda domanda viene da `bivio.titolo`.
   `bivio.occhiello` («Prima scelta») non si mostra: nel prototipo il bivio è la seconda scelta.
9. **La scheda a 390** non mostra lo schema della rete: l'orario viene subito dopo il cartello, poi
   l'indirizzo con «Apri in Maps» e la mappa, poi chi insegna e gli eventi (grid-areas: sopra i 1000px
   questi ultimi tornano sotto l'orario).
10. **Frecce e targhe in CSS**, come le barrette del bivio: nessuna libreria d'icone, nessun pittogramma
    disegnato apposta. I pittogrammi della specifica si sono ridotti alla freccia e al quadrato, che
    bastano.

## Campi del CMS usati e non usati

- Usati: `eroe.occhiello`, `eroe.titolo`, `eroe.testo`; `bivio.titolo`, `bivio.testo`; `home.primaVolta`,
  `home.testoQualifiche`, `home.passo*`; di Corsi `domanda`, `nome`, `sommario`; di Sedi `nome`,
  `palestra`, `indirizzo`, `descrizione`, `orari`, `istruttori`, `mapsUrl`, `coordinate`, `foto`,
  `attivo`; gli Eventi; il global Contatti per il modulo. Tutti con il ripiego del codice attuale.
- Non usati in questa direzione: `immagineHero`, `videoHero` (generati, e l'eroe è la rete),
  `eroe.ctaPrimaria*` e `eroe.ctaSecondaria*` (l'eroe è già «trova un centro» e il bivio è subito sotto),
  `bivio.occhiello`, `home.immagineIngresso`.
- Testi nuovi nel codice, tutti etichette d'interfaccia: «Dove sei?», «Usa la mia posizione», «Oppure
  cerca il tuo comune», «Serve anche», «Punto di riferimento anche per», «Il più vicino a te», «Prossimi
  appuntamenti», «Orario», «Indirizzo», «Apri in Maps», «Scrivi a {centro}», la riga sulla posizione e
  quella sotto il titolo del modulo (che ripete CONTEXT.md: il contatto passa dal form, nessun recapito
  per centro).
- Nessun campo aggiunto al DB, nessuna modifica ai dati.

## Cosa non ho fatto, e perché

- **Non ho corretto le coordinate di Milano Affori.** Nel DB condiviso stanno a 45.400 / 9.249, cioè fra
  San Donato e San Giuliano, mentre Via Iseo 6 è ad Affori, a nord (circa 45.52 / 9.17). Lo schema lo
  rende evidente: il cartello «Milano Affori» cade accanto a San Giuliano. È un errore di geocodifica di
  `centers:geocode`, da correggere dal pannello; non l'ho toccato perché il DB è condiviso. **Prima di
  mostrare la direzione al cliente va corretto**, perché in questa direzione la posizione è il messaggio.
- **Mulazzano non è sullo schema** (nessuna coordinata): lo dice una riga sotto lo schema, e il centro è
  nei cartelli con indirizzo e orari (ADR-0002).
- **I testi del DB senza accenti** («e inoltre», «Citta Studi», «Muggio») restano come sono: vengono dalla
  trascrizione di `data/centri-tecnici.json`. Nei cartelli si vedono (per esempio la fermata «Citta
  Studi»); vanno sistemati nei dati, non nel codice.
- **`/centri`, `/contatti` e le altre rotte non sono toccate.** Le classi nuove stanno in
  `signage.css`, importato in fondo a `styles.css`; nessuna classe condivisa cambia significato. Ho
  verificato 200 su `/centri`, `/contatti?sede=binasco`, `/corsi`, `/corsi/[slug]`, `/eventi`,
  `/istruttori`, `/centri/muggio` (centro non attivo).
- **Font nuovi: nessuno.** Anton e Roboto bastano alla direzione.
- **Non ho unificato `/centri` con la home**: se la direzione passa, `/centri` dovrebbe prendere gli
  stessi cartelli e lo stesso schema (oggi ha la mappa Leaflet e le schede di Fenriz).
- Un difetto trovato e non corretto, fuori dal perimetro: in `CenterList.tsx` i punti della mappa portano
  la distanza nella chiave `distanza`, mentre `MapPoint` la chiama `distance`, quindi il popup di `/centri`
  non mostra mai «a N km da te». TypeScript non lo segnala perché il ritorno della callback non passa
  dal controllo delle proprietà in eccesso.

## Limiti dell'ambiente

- **Le tile della mappa Leaflet non si caricano: non c'è rete.** Nella scheda il riquadro della mappa di
  dettaglio è carbone con il solo marker. È un limite dell'ambiente, non del prototipo; lo schema della
  home non ne dipende.
- **`pnpm lint` fallisce anche su `main`**, prima di leggere un file: `FlatCompat` di `@eslint/eslintrc`
  va in «Converting circular structure to JSON» caricando `next/core-web-vitals` (eslint 9.39, con
  `eslint-config-next` che esporta già una configurazione flat). Verificato con `git stash`: stesso errore
  senza le mie modifiche. Ho passato i miei file con una configurazione flat temporanea
  (`eslint-config-next/core-web-vitals` più `/typescript`, poi cancellata): **zero errori e zero warning**
  su `page.tsx`, `centri/[slug]/page.tsx`, `CenterNetwork.tsx`, `NetworkMap.tsx`, `signage.ts`,
  `requestFormProps.ts`. La stessa configurazione trova quattro errori in `CenterList.tsx` di `main`
  (setState dentro un effetto), che non ho toccato; nel mio componente la posizione salvata si legge con
  `useSyncExternalStore` proprio per non ripetere quel pattern.
- **`npx tsc --noEmit`**: pulito.

## Come è stato preparato l'ambiente

Già pronto quando ho cominciato, come da brief comune: Postgres installato via apt nel container, ruolo
e DB `akm` creati dai valori di `.env.example`, `.env` copiato con gli SMTP vuoti, `pnpm install`,
`pnpm fonts:download`, semina con `import:centers`, `centers:geocode`, `pages:legal`, `courses:content`,
`import:events`, `images:editorial`, tutti riusciti; la geocodifica ha risolto tutti i centri tranne
Mulazzano. Il DB è condiviso con gli altri tre prototipi e non l'ho modificato. Dev server sulla porta
3003 (`pnpm dev -p 3003`, log in `/tmp/claude-0/dev-c.log`), fermato dopo gli screenshot.

## Skill non disponibili

`design-taste-frontend` e `antislop:antislop-ui` non sono installate in questa sessione. Al loro posto ho
usato le regole e gli esiti dell'audit antislop 001 (`docs/antislop/audit-001-2026-09-16.md`) e
`DESIGN.md`: bersagli da 44px su ogni controllo isolato (marker dello schema, «Apri in Maps», bottone
della posizione, briciole), anello di fuoco che segue la superficie (`--ring` sui pannelli scuri e
chiari), nessun «0» stampato, verde sempre accanto a una parola, rosso solo sui bottoni primari (in
barra e sull'invio del modulo; nessun primario nell'eroe, voce 24), Anton sempre maiuscolo e da 33px in
su tranne le targhe numeriche da 28px del passo, cifre tabulari su orari e civici, dati mai sotto i 14px,
nessuna animazione nuova oltre allo spostamento di 4px della freccia al passaggio del puntatore (riscontro
a un gesto, a zero sotto reduced-motion).
