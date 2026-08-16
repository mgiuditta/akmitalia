# Roadmap

Sette fasi. La fase 2 è un punto di approvazione: non si prosegue senza il sì del cliente.

## Fase 1 — Scaffolding

- `create-payload-app`, template blank, Postgres
- **Pinnare** Next `16.2.x` e Payload `3.81+`. Next 15.5–16.1.x non è supportato da Payload
- Script di dev con `--no-server-fast-refresh` (richiesto da Next 16.2+)
- `docker-compose.yml` di sviluppo: solo Postgres
- Payload con `i18n: { fallbackLanguage: 'it' }` → admin in italiano
- Collezioni e globals come da [architettura.md](architettura.md), `payload generate:types`
- Bozze sui contenuti editoriali, `versions` sui globals, join per le relazioni inverse
- Hook di revalidation (`src/hooks/revalidate.ts`), GraphQL disabilitato, script di migrazione

Fatto quando: `/admin` si apre in italiano e si crea un centro con orari.

## Fase 2 — Design system + homepage  ⟵ gate

- Token Tailwind v4 in `@theme`: colori campionati dal logo, scala tipografica, spaziature
- Font self-hosted con `next/font/local`
- Ricalco SVG del logo (positivo, negativo, simbolo)
- Componenti base: Button, Card, Section, Nav, Footer, Accordion, ImageSlot
- **Homepage completa e navigabile**, con dati veri dal CMS

Fatto quando: il cliente ha visto la home e ha detto sì. Non prima.

## Fase 3 — Pagine e routing

- Tutte le route, `generateStaticParams` + ISR
- Scheda centro: orari, docenti, link a Maps, form precompilato
- `sitemap.ts`, `robots.ts`, `generateMetadata`
- JSON-LD: Organization, SportsActivityLocation, Event, FAQPage, BreadcrumbList
- Revalidation on-demand via hook `afterChange`

## Fase 4 — Form di preiscrizione

- Server Action: Zod → `richieste` → email (in quest'ordine)
- Honeypot + rate limit per IP
- Consenso privacy obbligatorio, salvato con timestamp
- Dropdown generato da `centri` con `attivo: true`

## Fase 5 — Contenuti

- Script di estrazione e di seed (già scritti, vedi [contenuti.md](contenuti.md)):
  rilanciare `estrai-centri.ts` per completare le coordinate, poi `pnpm seed`
- **Conferma col cliente** di quali centri sono attivi (vedi [contenuti.md](contenuti.md))
- Testi delle 9 pagine riscritti e validati
- Video spostati su YouTube, embed con façade

## Fase 6 — Deploy

VPS, Docker Compose, Caddy, backup, restore testato. Vedi [deploy.md](deploy.md).

## Fase 7 — Messa online

Staging → verifica 301 → Lighthouse → switch DNS → Search Console → 30 giorni di monitoraggio.

## Rischi da tenere sott'occhio

| Rischio | Mitigazione |
|---|---|
| Il cliente boccia il restyle a lavoro fatto | Gate di fase 2: solo la home, prima di tutto il resto |
| Perdita di traffico dalle 235 news | Decisione consapevole; 301 su `/news`, monitoraggio 30 giorni |
| Senza foto il design resta piatto | Design tipografico + slot che degradano; proporre uno shooting |
| Il cliente non usa il CMS | Globals a campi fissi, admin in italiano, mezz'ora di affiancamento al lancio |
| Il VPS va giù e nessuno se ne accorge | Uptime monitor gratuito (UptimeRobot) con alert via email |
