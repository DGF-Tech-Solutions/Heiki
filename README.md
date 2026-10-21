# GachaZone

<p align="center">
  <strong>Piattaforma analitica e community data-driven per videogiochi gacha.</strong><br>
  Dati estratti, decifrati e verificati direttamente dai client di gioco, combinati con strumenti avanzati di teoria, calcolo e community.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-15.5+-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5.x_Strict-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS v4">
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL 16">
  <img src="https://img.shields.io/badge/Drizzle_ORM-0.44+-C5F74F?style=for-the-badge&logo=drizzle" alt="Drizzle ORM">
  <img src="https://img.shields.io/badge/Vitest-780_Passed-729B1B?style=for-the-badge&logo=vitest" alt="Vitest Tests">
  <img src="https://img.shields.io/badge/DB_Smoke-71_Checks-success?style=for-the-badge" alt="DB Smoke Tests">
</p>

---

## Panoramica del Progetto

**GachaZone** è una piattaforma web full-stack ad alte prestazioni progettata per colmare il divario tra i dati grezzi dei videogiochi gacha e le esigenze analitiche della community competitiva. 

A differenza dei tradizionali siti wiki basati su inserimento manuale (spesso soggetti a errori o ritardi), GachaZone integra una pipeline proprietaria di estrazione e decifrazione dei dati direttamente dai pacchetti client e dai database interni di gioco (SQLite cifrati con chiavi dinamiche, asset bundle Unity), esponendo informazioni matematicamente esatte su formule di combattimento, scalature delle abilità e attributi.

La piattaforma è architettata per scalare su molteplici titoli: il primo modulo di riferimento pienamente operativo è **The Seven Deadly Sins: Grand Cross (7DSGC)**, con supporto modulare predisposto per i titoli HoYoverse (*Genshin Impact*, *Honkai: Star Rail*, *Zenless Zone Zero*) e *Wuthering Waves*.

---

## Funzionalità Chiave

### 1. Database Eroi & Calcolatore Statistiche in Tempo Reale
- **Roster Completo e Certificato**: Oltre 373 eroi con dati estratti dai database SQLite del client di gioco (194.000+ chiavi tradotte in italiano e inglese).
- **Calcolatore Dinamico**: Valutazione in tempo reale delle statistiche al variare di Livello, Risveglio (1-6 stelle), Super Risveglio, Rango Mossa Finale, Vero Risveglio (Re Demone/Divinità Suprema) ed equipaggiamento associato.
- **Riconoscimento Lessicale (Parole Blu)**: Motore di parsing contestuale che trasforma ogni termine tecnico presente nelle descrizioni delle abilità in rimandi ipertestuali con popup interattivi e regole di cumulo.
- **Diff Storico di Patch**: Sistema di versionamento automatico che traccia le variazioni testuali, numeriche e di bilanciamento introdotte dai publisher a ogni aggiornamento.

### 2. Tier List Maker Integrato
- **Interfaccia Drag & Drop Reattiva**: Gestione fluida HTML5 drag & drop su desktop e modalità touch rapida per dispositivi mobili.
- **Configurazione Dinamica**: 6 livelli predefiniti (S+, S, A, B, C, D) con palette cromatica Persona a 13 tinte, riordinamento, etichette personalizzate e filtri simultanei per rarità e attributo.
- **Persistenza Cloud & Backup Locale**: Salvataggio di tier list multiple legate all'account utente su PostgreSQL (`user_tier_lists`), esportazione di backup JSON non volatili e link di condivisione permanente con clonazione one-click.
- **Render Grafico Retina 2x**: Esportazione su Canvas ad altissima risoluzione con watermark e compositing grafico ottimizzato per social e condivisione.

### 3. Community Hero Ratings & Feedback
- **Valutazione Duale PvE e PvP**: Punteggio granulare da 1 a 5 stelle ponderato con asset fedeli al gioco.
- **Analisi Contenuto di Spicco**: Rilevazione analitica e rappresentazione percentuale della modalità in cui ciascun personaggio eccelle (Bestie Demoniache, Re Demone, PvP, Scontri Finali).
- **Upsert Idempotente & Anti-Abuso**: Indici univoci compositi `(game_id, hero_id, user_id)` e protezione anti-spam con rate limiting dedicato.

### 4. Gestione Box Eroi (Architettura Local-First)
- **Sincronizzazione Ibrida**: Lettura istantanea senza latenza tramite `useSyncExternalStore` con fallback locale (`localStorage`) e replica automatica su PostgreSQL per gli utenti autenticati.
- **Operazioni Massive ad Alta Efficienza**: Funzioni istantanee di popolamento rapido (*"Aggiungi tutti i mostrati"*) e azzeramento di sicurezza (*"Rimuovi tutti"* con conferma modale).

### 5. Guide dell'Endgame con Invecchiamento Automatico
- **Patch Verification**: Ogni guida strategica è vincolata alla patch di verifica (`verifiedPatch`). Quando il gioco avanza di versione, il sistema etichetta autonomamente la guida come *"Da verificare"*, garantendo integrità informativa.
- **Formulari di Squadra Rigorosi**: Validazione delle formazioni in base ai vincoli reali delle modalità (eroi associati unici, restrizioni di attributo e set di artefatti consentiti).

### 6. Sistema di Moderazione e Tracciabilità Immutabile
- **Soft-Hiding & Audit Log**: Nessuna eliminazione distruttiva; i contenuti segnalati vengono nascosti con traccia dell'operatore, causale e timestamp in una tabella di audit transazionale.
- **RBAC a 5 Livelli**: Gerarchia di permessi granulare (`USER`, `COLLABORATOR`, `EDITOR`, `MODERATOR`, `ADMIN`).

---

## Architettura Tecnica

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Next.js 15 App Router                         │
│   (React 19 Server Components · Streaming SSR · Client Components)     │
└──────────────────┬──────────────────────────────────┬──────────────────┘
                   │                                  │
         Server Actions & API                   Local-First State
       (Zod Validation, Auth.js)            (useSyncExternalStore)
                   │                                  │
         ┌─────────┴─────────┐                        │
         ▼                   ▼                        ▼
┌──────────────────┐ ┌──────────────┐       ┌──────────────────┐
│   PostgreSQL 16  │ │ In-Memory    │       │ Browser Storage  │
│   (Drizzle ORM)  │ │ Rate Limiter │       │  (localStorage)  │
└──────────────────┘ └──────────────┘       └──────────────────┘
```

### Scelte Architetturali Fondamentali
1. **Next.js 15.5+ App Router con React 19**: Utilizzo esteso di React Server Components (RSC) per azzerare il JavaScript bundle delle schede informative, garantendo First Load JS shared compatto a circa 103 kB.
2. **PostgreSQL 16 & Drizzle ORM**: Type-safety end-to-end dal database al frontend. Schemi dichiarativi, migrazioni SQL riproducibili e chiavi esterne con vincoli d'integrità referenziale rigorosi.
3. **Resilienza Zero-Downtime**: In caso di mancata raggiungibilità temporanea del database, la piattaforma attiva istantaneamente una modalità fallback in memoria con contenuti dimostrativi, consentendo la navigazione del catalogo eroi senza interruzioni.
4. **Sicurezza Rigorosa**:
   - **Content Security Policy (CSP)** con nonce crittografico generato per singola richiesta a livello di middleware.
   - **Rate Limiting** a finestra mobile in memoria su endpoint di autenticazione e mutazione.
   - Protezione da attacchi XSS mediante parser Markdown con whitelist rigorosa (niente `dangerouslySetInnerHTML`).
   - Cookie di sessione conformi a `SameSite=Lax`, `HttpOnly` e prefisso `__Secure-` in ambiente HTTPS.
5. **Design System Persona 5 / Dark Mode**:
   - Direzione visiva dark (`#0b0a0a` / `#151313`) con tagli angolari `.p5-cut`, bottoni dinamici `.p5-btn` e accento brand rosso (`#e61421`).
   - 5 palette cromatiche selezionabili dall'utente (Rosso, Notte, Giada, Viola, Ambra), tutte certificate con rapporto di contrasto WCAG AAA (≥ 7:1 per testo normale, ≥ 4.5:1 per elementi secondari).

---

## Stack Tecnologico

| Livello | Tecnologie |
|---|---|
| **Framework Web** | [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/) |
| **Linguaggio** | [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode) |
| **Styling & UI** | [Tailwind CSS v4](https://tailwindcss.com/), Icone [Phosphor](https://phosphoricons.com/) |
| **Database & ORM** | [PostgreSQL 16](https://www.postgresql.org/), [Drizzle ORM](https://orm.drizzle.team/) |
| **Autenticazione** | [Auth.js v5 (NextAuth)](https://authjs.dev/) (Credenziali, Discord OAuth, Google OAuth) |
| **Testing Suite** | [Vitest](https://vitest.dev/), script proprietario `smoke-db.mts` |
| **Containerizzazione**| [Docker](https://www.docker.com/), Docker Compose |

---

## Qualità del Codice & Testing

La stabilità e l'accuratezza dei calcoli matematici sono validate continuamente da una suite di test esaustiva:

- **780 Test Unitari e di Integrazione (Vitest)**:
  - Validazione formule di danno, scaling passivo, calcolo statistiche e simulazione Monte Carlo.
  - Test crittografici su sessioni, token di recupero password ed escape sanitizzato del Markdown.
  - Verifica della palette colori e accessibilità di contrasto di tutti i temi.
- **71 Verifiche Live sul Database (`npm run db:smoke`)**:
  - Script automatizzato (`scripts/smoke-db.mts`) che esegue un ciclo end-to-end reale su PostgreSQL: inserimento, migrazioni, foreign key cascade, rate limiting e cancellazioni controllate.
- **Tipizzazione Rigorosa**:
  - `npm run typecheck` (`tsc --noEmit`) costantemente a 0 errori.
  - `npm run lint` (`eslint`) su tutti i file sorgente e script di supporto.

---

## Struttura del Repository

```text
GachaZone/
├── src/
│   ├── app/                      # Next.js App Router (Layout, Pagine, API Routes)
│   │   ├── [game]/               # Pagine contestuali di gioco (eroi, tierlist, guide, ecc.)
│   │   ├── u/[username]/         # Vetrina profilo pubblico, tier list salvate, badge
│   │   └── api/                  # Route handlers (auth callback, healthcheck)
│   ├── components/               # Componenti UI (stile Persona, filtri, griglie, modali)
│   │   ├── tier-list/            # Componenti del Tier List Maker (canvas, drag & drop)
│   │   ├── ratings/              # Modali e badge di votazione community
│   │   └── game-account/         # Gestione e visualizzazione del box eroi
│   ├── lib/
│   │   ├── db/                   # Schema Drizzle, client PostgreSQL e migrazioni
│   │   ├── games/                # Moduli dei giochi, dati estratti, calcolatori
│   │   ├── tier-list/            # Server actions e logica di salvataggio tier list
│   │   ├── ratings/              # Logica server e aggregazioni voti eroi
│   │   ├── auth/                 # Configurazione Auth.js, gestione ruoli e permessi
│   │   └── security/             # Content Security Policy, rate limiter, sanitizzazione
├── scripts/                      # Script di automazione, setup, seed e smoke testing
├── drizzle/                      # File di migrazione SQL generati da Drizzle Kit
└── docker-compose.yml            # Configurazione PostgreSQL per ambiente di sviluppo
```

---

## Installazione e Avvio Rapido

### Prerequisiti
- **Node.js** v20.x o superiore
- **Docker Desktop** (per il database PostgreSQL)

### Setup in un Click
Il comando `npm run setup` predispone automaticamente l'intero ambiente di lavoro:

```bash
# 1. Clona il repository
git clone https://github.com/DGF-Tech-Solutions/GachaZone.git
cd GachaZone

# 2. Configura dipendenze, database locale e schema
npm run setup

# 3. Avvia il server di sviluppo
npm run dev
```

Il sito sarà immediatamente accessibile su [http://localhost:3000](http://localhost:3000).

---

## Comandi Principali

| Script | Descrizione |
|---|---|
| `npm run dev` | Avvia il server di sviluppo con hot-reloading Turbopack (`:3000`) |
| `npm run build` | Compila l'applicazione per la produzione con output standalone |
| `npm run test` | Esegue la suite completa di 780 test unitari con Vitest |
| `npm run typecheck` | Esegue la verifica dei tipi TypeScript (`tsc --noEmit`) |
| `npm run lint` | Esegue l'analisi statica del codice con ESLint |
| `npm run db:smoke` | Esegue 71 controlli di integrità end-to-end sul database PostgreSQL |
| `npm run db:migrate` | Applica le migrazioni SQL pendenti tramite Drizzle Kit |
| `npm run db:reset` | Ripristina il database ricreando lo schema e ripopolando i dati di seed |
| `npm run db:studio` | Avvia Drizzle Studio per l'ispezione grafica dei dati del DB |
| `npm run promote -- <email> ADMIN` | Assegna privilegi amministrativi al primo account utente |

---

## Roadmap di Sviluppo

- [x] Pipeline di decifrazione e importazione automatica dei dati dai client di gioco.
- [x] Roster interattivo con calcolatore statistiche completo per The Seven Deadly Sins: Grand Cross.
- [x] Tier List Maker dinamico con esportazione Retina 2x Canvas e persistenza cloud.
- [x] Sistema di recensioni e votazione community (PvE & PvP) con aggregazione real-time.
- [x] Sincronizzazione local-first del box eroi con persistenza ibrida.
- [ ] Integrazione del primo modulo deterministico HoYoverse (*Genshin Impact* / *Honkai: Star Rail*).
- [ ] Generazione dinamica di Open Graph card personalizzate per la condivisione social dei profili.
- [ ] API pubblica REST / GraphQL per consentire a sviluppatori terzi l'accesso ai dati analitici del roster.

---

## Licenza

Questo progetto è distribuito sotto licenza [MIT](LICENSE). Tutti i marchi, loghi e asset visivi relativi ai singoli giochi appartengono ai rispettivi titolari dei diritti e publisher di gioco.
