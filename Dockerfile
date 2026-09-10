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
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

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

USER nextjs
EXPOSE 3000

CMD ["node", "server.js"]
