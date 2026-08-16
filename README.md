# akm-italia.it

Rifacimento del sito di AKM Italia: Next.js 16 + Payload 3 nello stesso processo, Postgres,
deploy su VPS con Docker e Caddy.

Documentazione di progetto in [`docs/`](docs):

| Documento | Contenuto |
|---|---|
| [architettura.md](docs/architettura.md) | Modello dati, routing, SEO, form di preiscrizione |
| [contenuti.md](docs/contenuti.md) | Struttura del sito, migrazione dal WordPress, redirect 301 |
| [design.md](docs/design.md) | Design system: tipografia, colori, vincoli |
| [deploy.md](docs/deploy.md) | VPS, Docker, backup, messa online |
| [roadmap.md](docs/roadmap.md) | Le sette fasi e i rischi |

## Sviluppo

Serve Node ≥ 20, pnpm e Docker.

```bash
cp .env.example .env      # PAYLOAD_SECRET, DATABASE_URL, NEXT_PUBLIC_SERVER_URL
docker compose up -d      # solo Postgres; l'app gira sull'host
pnpm install
pnpm dev                  # http://localhost:3000 — admin su /admin, in italiano
```

Il primo avvio chiede di creare l'utente admin.

## Script

| Comando | Cosa fa |
|---|---|
| `pnpm dev` | Next + Payload in sviluppo |
| `pnpm generate:types` | rigenera `src/payload-types.ts` dopo ogni modifica allo schema |
| `pnpm migrate:create` | genera la migrazione Postgres da committare in `src/migrations/` |
| `pnpm migrate` | applica le migrazioni (in produzione lo fa il container all'avvio) |
| `pnpm tsx scripts/estrai-centri.ts` | WordPress → `data/centri.json` (una tantum, correggibile a mano) |
| `pnpm seed [--dry-run]` | `data/centri.json` → database, upsert per slug, rieseguibile |
| `pnpm lint` · `npx vitest run` | lint e test |

In sviluppo lo schema si applica con il `push` automatico di Payload; in produzione **solo**
con `pnpm migrate`.
