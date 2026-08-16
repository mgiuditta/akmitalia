# Architettura

## Principio guida

Payload gira **dentro** l'app Next.js, non accanto. Un solo repo, un solo deploy, un solo processo.
Le pagine leggono i dati con la Local API di Payload (chiamata diretta in-process, niente HTTP),
quindi non esiste una "API da tenere in piedi".

```
akmitalia/
├─ src/
│  ├─ app/
│  │  ├─ (frontend)/          # sito pubblico
│  │  └─ (payload)/           # admin + REST/GraphQL, generato da Payload
│  ├─ collections/
│  ├─ globals/
│  ├─ components/
│  └─ payload.config.ts
├─ docker-compose.yml
└─ Caddyfile
```

## Modello dati

### Collezioni

**`centri`** — il cuore del sito

| Campo | Tipo | Note |
|---|---|---|
| `nome` | text | es. "Abbiategrasso" |
| `slug` | text | unico, generato da `nome` |
| `palestra` | text | es. "Dynamic Dance School" |
| `indirizzo` | text | |
| `citta`, `provincia`, `cap` | text | `provincia` serve a raggruppare l'elenco |
| `mapsUrl` | text | link a Google Maps, no SDK |
| `lat`, `lng` | number | **obbligatori**: alimentano il JSON-LD `SportsActivityLocation` |
| `attivo` | checkbox | default `true`; i centri chiusi spariscono da sito **e** form |
| `orari` | array | vedi sotto |
| `docenti` | relationship → `docenti`, hasMany | |
| `foto` | upload → `media` | opzionale |
| `eventi`, `richieste` | join | relazioni inverse, sola lettura |

`orari[]`: `{ disciplina → corsi, giorni[] (lun…dom), oraInizio, oraFine, note }`

Sostituisce insieme: l'accordion Elementor, il PDF orari, e il dropdown hardcoded del form.

**`corsi`** — le discipline

`nome`, `slug`, `target` (adulti | ragazzi | bambini | donne | istruttori | aziende-ffoo),
`sommario`, `descrizione` (Lexical), `immagine`, `ordine`, `centri` (join su `orari.disciplina`).

**`docenti`** — `nome`, `ruolo` (select: istruttore | trainer | maestro | direttore-tecnico |
presidente), `grado`, `foto`, `bio`, `centri` (join).

**`news`** — `titolo`, `slug`, `data`, `copertina`, `estratto`, `contenuto` (Lexical). Con bozze.

**`eventi`** — `titolo`, `slug`, `dataInizio`, `dataFine`, `centro` (rel), `luogo`, `descrizione`, `ctaLink`.
Con bozze. Nessuna vista calendario a griglia: solo "prossimi eventi" + pagina dettaglio.

**`richieste`** — le preiscrizioni

`centro` (rel), `cognome`, `nome`, `dataNascita`, `telefono`, `email`, `messaggio`,
`consenso` (bool + timestamp), `stato` (nuova | contattata | iscritta | archiviata), `note`.

Nell'admin tutti i campi sono in sola lettura tranne `stato` e `note`: sono dati inviati
dall'utente, non devono essere modificabili a posteriori. `create` è consentito solo alla
Server Action, non dall'admin. `consensoAt` lo scrive un hook lato server: un timestamp di
consenso che arriva dal client non prova nulla. La cancellazione resta permessa allo staff,
altrimenti una richiesta GDPR non sarebbe eseguibile.

**`media`** — upload su disco locale, resize con `sharp`. Niente S3/R2: sono poche centinaia di MB.

**`users`** — solo staff AKM. Nessuna registrazione pubblica.

### Globals

Per le pagine istituzionali si usano **campi fissi**, non un page-builder a blocchi.
Un builder generico è più potente ma il cliente non lo userà: gli servono cinque caselle da riempire.

- `home` — hero (titolo, sottotitolo, CTA), 3 blocchi in evidenza, video YouTube in evidenza
- `paginaKravMaga` — sezioni a campi fissi (cos'è, Imi Lichtenfeld, IDF, principi, caratteristiche) + `faq[]`
- `paginaChiSiamo` — storia, valori, riconoscimenti, codice etico, partner
- `contatti` — indirizzo, email, telefono, social, PDF orari stagione
- `impostazioni` — SEO di default, logo, testo footer

Le sole pagine libere sono quelle legali, in una collezione `pagine` con `titolo` + `slug` + rich text
(privacy, cookie, 5x1000). Anche `pagine` ha le bozze.

I globals hanno `versions: true`: nessun flusso di pubblicazione, solo lo storico per tornare
indietro dopo una modifica sbagliata. Le collezioni anagrafiche (`centri`, `corsi`, `docenti`)
non hanno bozze: non sono contenuti editoriali.

### Bozze e lettura pubblica

Dove ci sono le bozze, `read` è `authenticatedOrPublished`: lo staff vede tutto, il pubblico
solo `_status: published`. Senza, una bozza mai pubblicata sarebbe leggibile dalla REST API.

### GraphQL

Disabilitato (`graphQL: { disable: true }`), route rimosse. Il sito legge con la Local API:
sarebbe solo superficie pubblica in più da tenere d'occhio.

## Routing

| Route | Rendering |
|---|---|
| `/` | ISR 1h |
| `/corsi`, `/corsi/[slug]` | `generateStaticParams` + ISR |
| `/centri`, `/centri/[slug]` | `generateStaticParams` + ISR |
| `/krav-maga`, `/chi-siamo` | ISR |
| `/news`, `/news/[slug]` | ISR, lista paginata |
| `/eventi`, `/eventi/[slug]` | `revalidate` breve (300s): le date scadono |
| `/contatti` | statica + form (Server Action) |
| `/[slug]` | pagine legali |

Revalidation on-demand: `src/hooks/revalidate.ts`, montato come `afterChange`/`afterDelete` su ogni
collezione e global. `context.disableRevalidate` la spegne per seed e script.
Il cliente salva e vede il sito aggiornato subito, senza aspettare l'ISR.

## SEO

- `generateMetadata` per ogni route, con fallback dai globals `impostazioni`
- `app/sitemap.ts` e `app/robots.ts` generati dal DB — niente plugin, niente file da rigenerare
- JSON-LD:
  - `Organization` (o `SportsOrganization`) nel layout
  - `SportsActivityLocation` su ogni scheda centro — è ciò che porta traffico locale ("krav maga Binasco")
  - `Event` su ogni evento
  - `FAQPage` sulla pagina Krav Maga
  - `BreadcrumbList` sulle pagine di dettaglio
- Redirect 301 dalle vecchie URL: vedi [contenuti.md](contenuti.md)

Le schede centro sono la vera leva SEO: 19 pagine locali con indirizzo, orari e dati strutturati,
dove oggi c'è una sola pagina con 19 accordion invisibili a Google.

## Form di preiscrizione

Server Action, non route API.

1. Validazione con Zod lato server. Il consenso privacy è obbligatorio e viene salvato con timestamp.
2. **Honeypot** (campo nascosto che i bot compilano) + **rate limit per IP**.
   Niente reCAPTCHA: una richiesta in meno a Google, un consenso in meno da chiedere, e il
   reCAPTCHA attuale non ha comunque impedito nulla.
3. Se l'honeypot è pieno → si risponde "ok" e si scarta in silenzio.
4. Altrimenti: `payload.create({ collection: 'richieste' })` **poi** invio email.
   In quest'ordine: se salta l'SMTP il lead è comunque salvato.
5. Il dropdown dei centri è generato da `centri` con `attivo: true`.
   Il form precompilato nella scheda centro passa lo slug come default.

## Cosa è stato deliberatamente escluso

| Escluso | Al suo posto | Quando aggiungerlo |
|---|---|---|
| Page-builder a blocchi | Globals a campi fissi | Se il cliente chiederà davvero pagine libere |
| Griglia calendario mensile | Lista "prossimi eventi" | Se gli eventi supereranno la decina al mese |
| S3 / R2 per i media | Disco locale del VPS | Oltre i ~20 GB di media |
| Google Maps SDK | Link a Google Maps | Mai, probabilmente: costa e traccia gli utenti |
| reCAPTCHA | Honeypot + rate limit | Se lo spam passa davvero |
| Multilingua | Solo italiano | AKM Swiss è una sede, non una lingua |
| Migrazione delle 235 news | 301 su `/news` | Deciso: non si migra |
