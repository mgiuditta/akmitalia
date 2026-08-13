# AKM Italia — sito 2026

Rifacimento di [akm-italia.it](https://www.akm-italia.it/) da WordPress a Next.js + Payload CMS.

## Perché

Il sito attuale è un WordPress con Astra + Elementor, *The Events Calendar*, *All in One SEO*
e Contact Form 7. Problemi rilevati analizzando il sito in produzione:

| Problema | Conseguenza |
|---|---|
| 39 pagine statiche, nav a 8 voci con sottomenu profondi (9 pagine solo per la storia del Krav Maga) | L'utente non trova corsi e centri, che sono il vero motivo per cui visita il sito |
| I 19 Centri Tecnici sono dato strutturato scritto a mano in accordion Elementor | Cambiare un orario significa editare HTML |
| Il dropdown del form elenca 21 centri, la pagina Centri Tecnici ne elenca 19 | Doppia fonte di verità, già disallineata in produzione |
| Gli orari di stagione sono un PDF caricato a mano ogni anno | Contenuto non indicizzabile, non linkabile, non responsive |
| Video self-hosted in `wp-content` | Home lenta |
| Le preiscrizioni arrivano solo via email | Nessuna tracciabilità, un lead perso in spam è perso |

## Obiettivi

1. **Meno pagine, meglio organizzate** — da 39 a 9.
2. **Un CMS che il cliente sa usare** — Payload con admin in italiano, campi fissi, niente page-builder.
3. **Una sola fonte di verità per i centri** — il form legge dalla stessa collezione della pagina centri.
4. **SSR + SEO** — server rendering, dati strutturati, sitemap generata.
5. **Meno di 10 €/mese di hosting** — obiettivo ~5,5 €.

## Stack

| | |
|---|---|
| Framework | Next.js **16.2.x** — App Router, SSR + ISR |
| CMS | Payload **3.81+**, self-hosted nella stessa app Next (`/admin`) |
| DB | Postgres 16 (`@payloadcms/db-postgres`) |
| Stile | Tailwind v4 (token in `@theme`) |
| Font | self-hosted via `next/font` — nessuna richiesta a Google Fonts |
| Email | nodemailer via SMTP del dominio (o Resend free tier) |
| Hosting | VPS Hetzner CX22 + Docker Compose + Caddy |

> **Vincolo di versione.** Payload 3.81+ richiede Next.js **16.2 o superiore**.
> Le versioni Next **15.5 – 16.1.x non sono supportate** e non lo saranno.
> Pinnare entrambe le versioni in `package.json`, non usare range larghi.
>
> Su Next 16.2+ lo script di dev va lanciato con `--no-server-fast-refresh`.

## Documentazione

| Documento | Contenuto |
|---|---|
| [docs/architettura.md](docs/architettura.md) | Modello dati Payload, routing, SEO, form |
| [docs/design.md](docs/design.md) | Design system: palette, tipografia, componenti |
| [docs/contenuti.md](docs/contenuti.md) | Struttura pagine, elenco centri, mappa redirect |
| [docs/deploy.md](docs/deploy.md) | Hetzner, Docker Compose, backup, switch DNS |
| [docs/roadmap.md](docs/roadmap.md) | Fasi di lavoro e stato |

## Costi

| Voce | €/mese |
|---|---|
| Hetzner CX22 (2 vCPU, 4 GB, 40 GB SSD, DC in EU) | ~4,50 |
| Backup automatici Hetzner (20% del server) | ~0,90 |
| Dominio | già di proprietà |
| CMS, email (free tier), CDN | 0 |
| **Totale** | **~5,40** |

Prezzi Hetzner IVA inclusa, da riverificare al momento dell'acquisto.

## Decisioni prese e loro prezzo

- **Si riparte da zero sulle news.** Le 235 news esistenti non vengono migrate: vanno tutte in
  301 su `/news`. Si conserva parte dell'autorità di dominio ma il traffico long-tail su quelle
  URL si azzera. Scelta consapevole.
- **Self-hosting.** 5 €/mese e admin in italiano si pagano con aggiornamenti e backup a carico nostro.
- **Nessuna fotografia professionale disponibile** — solo i loghi in PNG. Il design è quindi
  tipografico, non fotografico. Vedi [docs/design.md](docs/design.md).
