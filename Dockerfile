FROM node:22-alpine

WORKDIR /app
RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# ponytail: node_modules complete (non standalone) perche' `payload migrate` serve la CLI
# e tsx per leggere payload.config.ts. Immagine piu' grande, zero copia di file tracciati.
CMD ["sh", "-c", "pnpm payload migrate && pnpm start"]
