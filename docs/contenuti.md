# Contenuti e migrazione

## Struttura del sito: da 39 pagine a 9

```
/                        Home
/corsi                   Le discipline, in sezioni
/corsi/[slug]              krav-maga-adulti · antibullismo-bambini · donna-sicura
                           kick-boxing · full-contact · corsi-istruttori · corsi-speciali
/centri                  Elenco raggruppato per provincia
/centri/[slug]             Scheda: palestra, indirizzo, orari, docenti, form precompilato
/krav-maga               Cos'è + Imi Lichtenfeld + IDF + principi + caratteristiche + FAQ
                           (una pagina lunga con indice laterale, al posto di 9 pagine)
/chi-siamo               Storia, valori, riconoscimenti, codice etico, docenti, partner
/news  /news/[slug]
/eventi  /eventi/[slug]
/contatti                Contatti + form di preiscrizione
/[slug]                  privacy-policy · cookie-policy · 5x1000 · legal-disclaimer
```

Navigazione a **6 voci**: Corsi · Centri Tecnici · Krav Maga · Chi Siamo · News · Contatti.
Oggi sono 8 con sottomenu a due livelli.

Le 9 pagine sulla storia del Krav Maga diventano una pagina sola. Erano nove pagine da poche
righe l'una, che si contendevano le stesse chiavi di ricerca: unite valgono di più, per il
lettore e per Google.

## Centri Tecnici

### Il disallineamento in produzione

Il sito attuale ha due elenchi di centri che non coincidono.

| | Pagina Centri Tecnici | Dropdown del form |
|---|---|---|
| Totale | 19 | 21 |

Presenti **solo nel form**: Caronno Pertusella (VA) · Milano Zona 8 (MI) · Monza
Presente **solo nella pagina**: Saronno (VA)

**Da confermare col cliente prima del lancio quali dei 22 sono realmente attivi.**
Nel nuovo sito il problema non si ripresenta: entrambi gli elenchi leggono dalla
collezione `centri` filtrata su `attivo: true`.

### Elenco attuale (pagina Centri Tecnici)

Abbiategrasso (MI) · Binasco (MI) · Bresso (MI) · Brugherio (MB) · Chiasso (Svizzera) ·
Cinisello Balsamo (MI) · Corsico (MI) · Milano Affori (MI) · Milano 1 – Stazione Centrale (MI) ·
Milano Bisceglie/Lorenteggio (MI) · Muggiò (MB) · Mulazzano (LO) ·
Paderno Dugnano – Cusano Milanino (MI) · Pogliano M.se – Nerviano – Lainate – Rho (MI) ·
Ponte Sesto – Rozzano (MI) · San Donato M.se (MI) · San Giuliano M.se (MI) · Saronno (VA) ·
Sesto San Giovanni (MI)

### Forma del dato da estrarre

Ogni accordion contiene già esattamente i campi della collezione `centri`. Esempio reale:

```
ABBIATEGRASSO (MI)
  palestra   Dynamic Dance School
  indirizzo  Via Alighieri n°110 – Abbiategrasso (MI)
  mapsUrl    <link "google maps">
  orari      Krav Maga – Self Defense System (Adulti e Ragazzi)
             Giovedì 20.00 – 21.30
  docenti    Istruttore Vittorio, Trainer Luca
```

L'estrazione si fa dalla REST API di WordPress (`/wp-json/wp/v2/pages/7426`) più un parser
sull'HTML degli accordion — che sono di **Live Composer** (`dslc-accordion`), non di Elementor.

Due script, non uno:

| Script | Cosa fa |
|---|---|
| `pnpm tsx scripts/estrai-centri.ts` | WordPress → `data/centri.json`, committato e correggibile a mano. Risolve anche le coordinate seguendo i link corti di Google Maps (`!3d`/`!4d` nell'URL finale) e **non sovrascrive** lat/lng e mappature già sistemate. |
| `pnpm seed [--dry-run]` | `data/centri.json` → database, upsert per slug. Rieseguibile: due esecuzioni non creano duplicati. |

Il seed si ferma — invece di indovinare — se manca la mappatura di una disciplina, se un ruolo
docente non è fra quelli previsti, o se un centro non ha coordinate.

Prima esecuzione dell'estrattore: **19 centri**, 8 etichette di disciplina distinte, 0 righe
non riconosciute.

## News ed eventi

- Le **235 news** non vengono migrate. Tutte in 301 su `/news`.
- Gli **eventi** di *The Events Calendar* non vengono migrati: quelli passati non servono,
  quelli futuri (presentazioni di stagione) si reinseriscono a mano — sono una decina.
- I **video self-hosted** in `wp-content` vanno spostati su YouTube ed embeddati con una
  façade cliccabile (immagine + play, iframe caricato solo al click). Oggi rallentano l'home
  e il canale YouTube non ne guadagna nulla.
- Il **PDF orari di stagione** resta scaricabile dalla pagina contatti, ma non è più la
  fonte primaria: gli orari veri stanno nelle schede centro, indicizzabili e sempre aggiornati.

## Mappa dei redirect 301

Da mettere in `next.config.ts`. Il WordPress resta online finché tutti i 301 non sono verificati.

| Vecchia URL | Nuova |
|---|---|
| `/centri-tecnici-akm-italia/` | `/centri` |
| `/luogo/*` | `/centri` |
| `/corsi-regolari-e-speciali/` | `/corsi` |
| `/corsi-istruttori-krav-maga/` | `/corsi/corsi-istruttori` |
| `/donna-sicura/` | `/corsi/donna-sicura` |
| `/kick-boxing-adulti/` | `/corsi/kick-boxing` |
| `/full-contact/` | `/corsi/full-contact` |
| `/storia-del-krav-maga/` | `/krav-maga` |
| `/storia-del-krav-maga/cosa-e-il-krav-maga/` | `/krav-maga` |
| `/storia-del-krav-maga/imi-lichtenfeld/` | `/krav-maga#imi-lichtenfeld` |
| `/storia-del-krav-maga/israel-defense-force/` | `/krav-maga#idf` |
| `/storia-del-krav-maga/i-principi-del-krav-maga-di-imi-lichtenfeld/` | `/krav-maga#principi` |
| `/storia-del-krav-maga/le-caratteristiche-del-krav-maga/` | `/krav-maga#caratteristiche` |
| `/storia-del-krav-maga/krav-maga-f-a-q/` | `/krav-maga#faq` |
| `/storia-del-krav-maga/abbigliamento-protezioni-armi/` | `/krav-maga#attrezzatura` |
| `/storia-del-krav-maga/krav-maga-hollywood/` | `/krav-maga` |
| `/storia-del-krav-maga/altre-informazioni-krav-maga/` | `/krav-maga` |
| `/chi-siamo/` | `/chi-siamo` |
| `/chi-siamo/staff-docenti/` | `/chi-siamo#docenti` |
| `/chi-siamo/istruttori-krav-maga-albo-tecnici-akm-italia/` | `/chi-siamo#docenti` |
| `/chi-siamo/team-management-vittorio-porreca/` | `/chi-siamo#team` |
| `/chi-siamo/riconoscimenti/` | `/chi-siamo#riconoscimenti` |
| `/chi-siamo/codice-etico-deontologico/` | `/chi-siamo#codice-etico` |
| `/chi-siamo/partners/` | `/chi-siamo#partner` |
| `/chi-siamo/collaborazioni-e-consulenze/` | `/chi-siamo#partner` |
| `/chi-siamo/la-differenza-che-fa-la-differenza/` | `/chi-siamo` |
| `/chi-siamo/dicono-di-noi/` | `/chi-siamo` |
| `/chi-siamo/credits/` | `/chi-siamo` |
| `/rassegna-stampa/` | `/chi-siamo#rassegna-stampa` |
| `/chi-siamo/contatti/` | `/contatti` |
| `/richiesta-informazioni/` | `/contatti` |
| `/chi-siamo/dona-il-tuo-5-x-1000/` | `/5x1000` |
| `/chi-siamo/legal-disclaimer/` | `/legal-disclaimer` |
| `/calendario/` | `/eventi` |
| `/news/` | `/news` |
| tutte le 235 news | `/news` |
| `/privacy-policy/`, `/cookie-policy/` | invariate |

**Da decidere col cliente** (contenuto non ancora esaminato):
`/gruppi-akm-italia/` · `/centri-studi/` · `/festival-arti-marziali/`

## Testi

I testi delle 9 pagine si riscrivono a partire da quelli esistenti, accorciandoli:
il sito attuale spiega molto e converte poco. Il cliente valida prima della messa online.
