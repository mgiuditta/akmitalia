# AKM Italia

Sito pubblico di AKM Italia: centri tecnici, percorsi, istruttori e il modulo di richiesta.
Next.js 16 e Payload 3 nello stesso processo, PostgreSQL, media su disco.

I documenti che spiegano il perché delle cose:

- `PRODUCT.md` — a chi parla il sito e qual è l'unico esito che conta.
- `CONTEXT.md` — il glossario del dominio: centro, orario, docente, corso, percorso.
- `DESIGN.md` — il sistema visivo, con le sue regole nominate.
- `docs/adr/` — le decisioni, una per file, con il motivo per cui si è scelto così.

## Sviluppo

Serve Node 22 e pnpm 11, più Docker per il database.

```sh
cp .env.example .env      # e cambia PAYLOAD_SECRET
pnpm install
docker compose up -d db
pnpm dev
```

Il sito sta su `http://localhost:3000`, il pannello su `/admin`. Il primo accesso chiede di
creare un utente.

In sviluppo lo schema del database si applica da solo (`push` di Payload). In produzione no:
vedi «Migration» qui sotto.

## Script

| Comando | Cosa fa |
|---|---|
| `pnpm dev` | Server di sviluppo. |
| `pnpm build` / `pnpm start` | Build e avvio in produzione. |
| `pnpm test` | Test di integrazione (Vitest) più end-to-end (Playwright). |
| `pnpm generate:types` | Riscrive `src/payload-types.ts` dopo un cambio di collection o global. Va rilanciato ogni volta. |
| `pnpm font:scarica` | Riscarica i caratteri in `public/font`. Ci sono già nel repo — Anton è OFL 1.1 e Roboto Apache 2.0, e il build ne ha bisogno: serve solo per aggiornarli. |
| `pnpm media:scarica` | Scarica in `data/wp-media` le immagini del vecchio sito. |
| `pnpm importa:centri` | Importa corsi, istruttori e sedi da `data/centri-tecnici.json`. Rieseguibile: fa upsert per slug. |
| `pnpm sedi:geocodifica` | Riempie le coordinate delle sedi che non ce l'hanno. |
| `pnpm pagine:legali` | Crea `/privacy` e `/cookie` con il testo di partenza. |
| `pnpm contenuti:corsi` | Riempie i tre percorsi con descrizione, focus, risultati e adatto a. |
| `pnpm immagini:editoriali` | Genera le fotografie editoriali in bianco e nero (serve `GEMINI_API_KEY`), le carica in Media e le assegna agli slot. Rieseguibile: non rigenera quello che sta gia' in `data/immagini`. |
| `pnpm semina` | I cinque comandi qui sopra in fila, per popolare un database appena migrato. Non applica le migration: quelle sono a parte. |

Gli ultimi tre sono punti di partenza, non fonti di verità: da lì in poi il contenuto si
modifica dall'admin, e rilanciarli sovrascrive quello che il cliente ha cambiato.

## Migration

In produzione `push` è spento, quindi lo schema si applica con le migration e mai in
automatico.

```sh
# dopo un cambio a una collection o a un global
NODE_ENV=production pnpm payload migrate:create <nome>

# applicare
pnpm payload migrate
```

`migrate:create` confronta lo schema con l'ultimo snapshot in `src/migrations/`, non con il
database: si lancia anche senza toccare il database di sviluppo.

## Rilascio con Docker

`docker-compose.yml` alza tre servizi: `db` (PostgreSQL), `app` (il sito) e `migrate`, che
sta in un profilo a parte perché applicare lo schema è una decisione, non un effetto
collaterale dell'avvio.

```sh
cp .env.example .env      # PAYLOAD_SECRET, NEXT_PUBLIC_SITE_URL, SMTP_*
docker compose --profile strumenti build
docker compose run --rm migrate
docker compose up -d
```

Da sapere:

- **`NEXT_PUBLIC_SITE_URL` si legge al momento del build**, non all'avvio: finisce nel
  bundle del browser. Cambiare dominio vuol dire ricostruire l'immagine.
- **I media stanno nel volume `media`**, montato su `/app/media`. Senza quel volume le
  immagini caricate sparirebbero al primo rilascio.
- **L'immagine dell'app è `output: 'standalone'`**: non contiene `node_modules` né i
  sorgenti, e infatti non può lanciare `payload migrate`. Per quello c'è il servizio
  `migrate`, che parte dallo stadio `migrator` del `Dockerfile`.

Al primo rilascio il volume `media` è vuoto: se stai portando su un database che ha già dei
file caricati, copiaci dentro la cartella `media/` prima di alzare l'app, altrimenti il sito
parte con le immagini rotte.

```sh
docker run --rm -v akmitalia_media:/media -v "$PWD/media":/dentro alpine \
  sh -c 'cp -a /dentro/. /media/'
```

Il primo rilascio va completato dal pannello: `/admin` per creare l'utente, poi
**Sistema > Contatti** per l'email che riceve le richieste (è obbligatoria) e per collegare
`/privacy` al consenso del modulo.

### Backup

Due cose, e vanno prese insieme:

```sh
docker compose exec -T db pg_dump -U payload akm > akm-$(date +%F).sql
docker run --rm -v akmitalia_media:/media -v "$PWD":/fuori alpine \
  tar czf /fuori/media-$(date +%F).tar.gz -C /media .
```

Il database senza i media dà un sito con le immagini rotte, i media senza il database non
sono niente.

## Rilascio su Coolify

`docker-compose.coolify.yml` è il gemello di `docker-compose.yml` per un server pubblico.
Cambia in tre punti: il database non pubblica nessuna porta, l'unica porta instradata è
quella che Coolify dà al servizio `app`, e `migrate` non sta più in un profilo — l'app
parte solo dopo che è uscito con zero, quindi **le migration si applicano da sole a ogni
rilascio**. I contenuti no: quelli sono `semina`, e si lancia a mano.

Il build passa `BUILD_SENZA_DB=1`, perché il container che costruisce l'immagine non sta
sulla rete dei servizi e il database non lo raggiunge. Il perché sta in `docs/adr/0013`.

### Preparare la risorsa

1. Nuova risorsa **Docker Compose**, repo del progetto, branch `main`, file
   `docker-compose.coolify.yml`.
2. Le variabili: `POSTGRES_PASSWORD`, `PAYLOAD_SECRET` (**un segreto nuovo, non quello di
   `.env.example`**), `NEXT_PUBLIC_SITE_URL`, e gli `SMTP_*` se la posta deve partire
   davvero. `POSTGRES_USER` e `POSTGRES_DB` hanno un default.
3. Il dominio sul servizio `app`, porta 3000. Al certificato pensa Coolify.

### Il primo rilascio

1. Deploy da Coolify: build → `migrate` → `app`.
2. I contenuti di partenza, dal server, una volta sola:

   ```sh
   cd /data/coolify/applications/<uuid>
   docker compose -f docker-compose.coolify.yml --profile strumenti run --rm semina
   ```

3. `/admin`: la pagina di primo accesso chiede di creare l'utente.
4. **Sistema > Contatti**: l'email che riceve le richieste. Ha un default
   (`formazione@akm-italia.eu`), quindi il modulo funziona da subito, ma su un sito di
   prova va messa una casella di prova.

`semina` è un punto di partenza, non una sorgente: rilanciarlo sovrascrive quello che il
cliente ha cambiato dall'admin. Per questo non parte da solo.

### Cosa aspettarsi subito dopo un deploy

Le pagine indice restano un minuto senza elenchi, e `sitemap.xml` un'ora, prima di
riempirsi da sole: è il prezzo del build senza database (`docs/adr/0013`). `/centri` e
`/contatti` sono dinamiche e sono giuste dal primo secondo.

## Da confermare prima di andare online

- `Sistema > Contatti`: email, telefono, sede legale, e la pagina dell'informativa.
- `/privacy`: titolare, tempi di conservazione e PEC sono segnaposto scritti in chiaro.
- Il testo dei tre percorsi, che è una prima stesura e va riletto dal cliente.
- SMTP configurato: senza, la richiesta si salva lo stesso ma l'avviso finisce nel log e
  `emailInviata` resta spento sulla scheda.

## Note

`pnpm lint` è rotto per un'incompatibilità fra `@eslint/eslintrc` e la configurazione di
`eslint-config-next` presente. Non dipende dal codice del sito. `pnpm test` e
`npx tsc --noEmit` sono verdi e sono quelli che vanno guardati.
