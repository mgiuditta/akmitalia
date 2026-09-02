# Immagine di rilascio del sito AKM Italia.
#
# Tre stadi:
#   deps     - le sole dipendenze, per non rifarle a ogni cambio di sorgente
#   builder  - il build di Next in modalita' standalone
#   migrator - lo stesso builder, tenuto per lanciare `payload migrate`
#   runner   - l'immagine che va in produzione, senza node_modules
#
# Il migrator esiste perche' l'output standalone non contiene ne' la CLI di
# Payload ne' i sorgenti delle migration: le migration si applicano da un
# container a parte, prima di far ripartire l'app. Vedi il README.

FROM node:22.17.0-alpine AS base
RUN corepack enable pnpm

FROM base AS deps
# Perche' libc6-compat serva su alpine:
# https://github.com/nodejs/docker-node/tree/main#nodealpine
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# L'origine pubblica finisce nel bundle del browser al momento del build: passata
# solo a runtime non avrebbe alcun effetto, e canonical, sitemap e JSON-LD
# uscirebbero puntando a localhost.
ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL

# Il build interroga il database davvero: le pagine di centri, percorsi e pagine
# editoriali si pregenerano da `generateStaticParams`, e senza connessione il
# build si ferma su «Failed to collect page data». Quindi il servizio `db` deve
# essere in piedi PRIMA di costruire l'immagine, e questa stringa deve
# raggiungerlo: in compose e' host.docker.internal, cioe' la porta 5432 che il
# database pubblica sull'host.
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ENV PAYLOAD_SECRET=build
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm run build

# Stesso contenuto del builder: serve solo a lanciare le migration.
FROM builder AS migrator
ENV NODE_ENV=production
CMD ["pnpm", "payload", "migrate"]

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# I file caricati stanno qui: in compose e' un volume, vedi src/collections/Media.ts.
ENV MEDIA_DIR=/app/media

RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# La cache di prerender e i media si scrivono a runtime.
RUN mkdir -p .next media && chown -R nextjs:nodejs .next media

USER nextjs
EXPOSE 3000

# server.js lo genera `next build` con output: 'standalone'.
CMD ["node", "server.js"]
