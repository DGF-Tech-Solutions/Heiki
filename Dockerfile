# Immagine dell'applicazione.
#
# Serve a chi vuole far girare tutto in container senza avere Node installato,
# e a fare da base per il deploy. Il flusso di sviluppo normale resta
# `docker compose up -d` per il solo Postgres piu' `npm run dev` in locale: su
# Windows un server di sviluppo dentro un container con bind mount ha un hot
# reload lento, e peggiorerebbe la giornata di chi lavora al codice.
#
# Tre stadi per non spedire in produzione ne' le dipendenze di sviluppo ne' i
# sorgenti: l'immagine finale contiene solo l'output standalone di Next.

# --------------------------------------------------------------- dipendenze
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
# --legacy-peer-deps: next-auth v5 e' in beta e dichiara peer dependency che
# npm 10 non risolve da solo. Va tenuto allineato a quello che usiamo in locale.
RUN npm ci --legacy-peer-deps --no-audit --no-fund

# ------------------------------------------------------------------ build
FROM node:22-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# La build non tocca il database: le pagine sono tutte rese su richiesta e il
# client Postgres apre la connessione solo alla prima query.
#
# NEXT_PUBLIC_SITE_URL qui NON va passata: Next scrive nel codice le variabili
# NEXT_PUBLIC_ presenti durante la build, e l'indirizzo resterebbe quello della
# build. Senza, siteUrl() la legge all'avvio, o ripiega su AUTH_URL.
ENV NEXT_TELEMETRY_DISABLED=1
# public/ nel repo non c'e' (contiene solo le immagini del gioco, ignorate da git):
# senza, la COPY dello stadio finale si fermerebbe su un clone pulito
RUN mkdir -p public && npm run build

# ------------------------------------------------------------- migrazioni
# Un'immagine a parte, da lanciare una volta prima di ogni versione nuova:
#
#     docker build --target migrate -t gachazone-migrate .
#     docker run --rm -e DATABASE_URL=... gachazone-migrate
#
# Sta fuori dall'immagine del sito perche' quella contiene solo l'output
# standalone di Next, senza drizzle-orm/migrator ne' tsx. E tenerla separata
# evita che due copie del sito, avviandosi insieme, migrino in parallelo.
FROM deps AS migrate
WORKDIR /app
COPY drizzle ./drizzle
COPY scripts/migrate.mts scripts/env.mts ./scripts/
CMD ["npx", "tsx", "scripts/migrate.mts"]

# ----------------------------------------------------------------- runtime
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Utente non privilegiato: un processo che serve richieste non ha motivo di
# girare come root.
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# L'output standalone non porta con se' public/: senza questa riga online
# mancavano icona, manifest e tutte le immagini del gioco. public/eroi/ non e' nel
# repo (si rigenera con `npm run eroi:import`): un'immagine costruita da un clone
# pulito, come quella dei controlli su GitHub, funziona ma senza immagini.
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 3000

# Il servizio che ospitera' il sito puo' chiederlo da solo; qui lo usa Docker.
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD wget -qO- http://127.0.0.1:3000/api/salute > /dev/null || exit 1

CMD ["node", "server.js"]
