# Deploy

## Perché un VPS e non il free tier

L'alternativa a costo zero era Vercel Hobby + Neon free + R2. È stata scartata:

- il piano Hobby di Vercel **vieta l'uso commerciale**, e un'associazione che incassa quote è
  quantomeno zona grigia — non è un rischio da correre sul sito di un cliente;
- Neon free **sospende il database** dopo inattività: il primo visitatore della giornata paga
  il cold start;
- sono tre fornitori, tre dashboard, tre punti di rottura, per risparmiare 5 €.

Un VPS è una macchina sola, con una bolletta sola, in un datacenter europeo.
Il prezzo è che aggiornamenti e backup sono a nostro carico.

## Macchina

**Hetzner CX22** — 2 vCPU, 4 GB RAM, 40 GB SSD, datacenter Falkenstein o Norimberga (GDPR).
Circa 4,50 €/mese IVA inclusa, più ~0,90 € di backup automatici (20% del costo del server).

4 GB bastano con margine: Next in produzione sta sotto i 500 MB, Postgres su questi volumi
sotto i 300 MB.

## Composizione

```
docker-compose.yml
  app     Next.js + Payload   build multi-stage, output standalone
  db      Postgres 16         volume persistente
  caddy   reverse proxy       HTTPS automatico via Let's Encrypt
```

- **Caddy** e non Nginx: ottiene e rinnova i certificati da solo, il Caddyfile è di sei righe
  e non c'è certbot da tenere in cron.
- **Media** su volume Docker montato in `/app/media`. Vanno nel backup: non sono nel database.
- **`output: 'standalone'`** in `next.config.ts`, altrimenti l'immagine Docker pesa un ordine
  di grandezza in più.

## Variabili d'ambiente

```
DATABASE_URI=postgres://payload:***@db:5432/akm
PAYLOAD_SECRET=<64 caratteri casuali>
NEXT_PUBLIC_SERVER_URL=https://www.akm-italia.it
SMTP_HOST= SMTP_PORT= SMTP_USER= SMTP_PASS=
EMAIL_TO=<segreteria AKM>
```

`.env` **non** va nel repository. Sul server sta in `/opt/akm/.env` con permessi `600`.

## Deploy

```bash
ssh akm
cd /opt/akm
git pull
docker compose up -d --build
```

Volutamente manuale. Una pipeline CI/CD per un sito che si aggiorna dal CMS e si ri-deploya
poche volte l'anno è manutenzione che non ripaga. Se i deploy diventeranno frequenti,
una GitHub Action con `docker compose up` via SSH sono venti righe.

## Backup

Due livelli, perché uno solo non è un backup:

1. **Snapshot Hetzner**, automatici, per rimettere in piedi la macchina intera.
2. **`pg_dump` giornaliero** in cron, ruotato a 14 giorni, copiato fuori dal server
   (Hetzner Storage Box o altro). Un backup che vive solo sulla macchina che deve salvare non serve.

**Il restore va testato prima dello switch DNS**, non dopo il primo incidente.
Un backup mai ripristinato non è un backup.

## Sicurezza minima

- SSH solo a chiave, password disabilitata, root login disabilitato
- `ufw`: aperti solo 22, 80, 443. Postgres **non** esposto: parla solo sulla rete Docker
- `unattended-upgrades` per le patch di sicurezza di sistema
- `PAYLOAD_SECRET` generato con `openssl rand -hex 32`, mai committato
- Backup del `.env` in un password manager: se si perde `PAYLOAD_SECRET` le sessioni admin muoiono

## Messa online

Ordine obbligato. Il WordPress resta raggiungibile fino al punto 6.

1. Deploy sul VPS con un dominio di staging (`new.akm-italia.it`), `robots.txt` in `Disallow: /`
2. Popolamento dei contenuti e validazione dei testi col cliente
3. Verifica dei 301: script che fa `curl -I` su tutte le URL della sitemap WordPress
   e controlla che rispondano `301` verso la destinazione attesa
4. Lighthouse su home, scheda centro e news → target ≥95 su Performance e SEO
5. Rich Results Test di Google su una scheda centro e su un evento
6. **Switch DNS.** TTL abbassato a 300s almeno 24h prima
7. `robots.txt` riaperto, sitemap inviata in Search Console
8. Monitoraggio dei 404 in Search Console per 30 giorni
9. Il WordPress si spegne **dopo** i 30 giorni, non prima. Nel frattempo resta come rete di sicurezza.

## Verifica post-deploy

- `docker compose down && docker compose up -d` → i dati sopravvivono
- Restore da `pg_dump` su un database vuoto → il sito riparte identico
- Invio del form → riga in `richieste` **e** email ricevuta
- Form con honeypot compilato → risposta 200, nessuna riga creata
- Riavvio della macchina → tutto risale da solo (`restart: unless-stopped`)
