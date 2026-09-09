# GachaZone

Piattaforma per i gacha: calcolo dei danni, guide, profili e community.
Giochi previsti: Grand Cross, Genshin Impact, Honkai Star Rail, Zenless Zone Zero,
Wuthering Waves.

Stato: **fondazione + account**. Motore di calcolo, contratto dei moduli di
gioco, schema dati e registrazione/accesso funzionano. Il calcolatore vero e la
community non ci sono ancora.

## Stack

Next.js 15 (App Router) · React 19 · TypeScript strict · Tailwind 4 · Drizzle /
PostgreSQL · Auth.js v5 · Vitest. Alias `@/*` su `src/`.

```bash
npm install --legacy-peer-deps

cp .env.example .env      # poi genera il segreto: npx auth secret
docker compose up -d      # Postgres su localhost:5432
npm run db:migrate        # crea le tabelle

npm run dev               # http://localhost:3000
npm test                  # 60 test
npm run typecheck
npm run build
```

Il sito parte anche **senza** database: la home e il motore non ne hanno
bisogno. Le pagine che lo richiedono mostrano le istruzioni di setup invece di
un errore.

## Architettura

Un **Core** indipendente dai giochi, piu' **N moduli di gioco** che rispettano
un solo contratto.

```
src/lib/engine/      motore: funzioni pure, nessuno stato, nessuna rete
  rng.ts             PRNG seedabile -> simulazioni riproducibili
  types.ts           tipi condivisi, tutti serializzabili in JSON
  stats.ts           composizione stat: base * (1 + %) + flat
  formula.ts         difesa, resistenza, critico, formula standard
  timeline.ts        risolutore di rotazioni deterministico
  runner.ts          esecutore: 1 iterazione o Monte Carlo, piu' istogramma

src/lib/games/
  types.ts           IL CONTRATTO. Confine dell'architettura.
  registry.ts        unico punto che conosce l'elenco dei giochi
  grand-cross/       primo modulo (stocastico)

src/lib/auth/
  config.ts          configurazione condivisa Node/Edge (no database, no bcrypt)
  index.ts           adapter, credenziali, callback: solo Node
  permissions.ts     ruoli come scala + mappa permesso -> ruolo minimo
  actions.ts         azioni server di registrazione e accesso

src/lib/db/
  schema.ts          schema del Core: tabelle, enum, relazioni
  index.ts           client Drizzle + sonda di raggiungibilita'
drizzle/             migrazioni SQL generate
```

### Le tre decisioni che reggono il motore

**1. Il risultato e' sempre una distribuzione.**
Un gioco deterministico produce una distribuzione degenere di un campione, uno
stocastico una vera. `SimulationResult` e' identico nei due casi, quindi UI e
query non devono sapere quale paradigma stanno guardando. E' cio' che impedisce
a Grand Cross - l'unico gioco a carte casuali - di deformare l'architettura
degli altri quattro.

**2. Il motore e' fatto di funzioni pure e gira nel browser.**
Nessuna chiamata di rete, nessuno stato condiviso: il costo server dei calcoli
e' zero anche con molti utenti simultanei, e lo stesso codice gira sul server
per le pagine indicizzabili e per la card condivisibile.

**3. Ogni risultato e' riproducibile.**
`seed` + `datasetVersion` sono congelati insieme al risultato. Un link condiviso
mostra sempre gli stessi numeri, e una patch che cambia i moltiplicatori non
riscrive di nascosto le build gia' salvate.

### Aggiungere un gioco

Il test dell'architettura: deve bastare una cartella nuova sotto
`src/lib/games/` e una riga in `registry.ts`. Zero modifiche al Core.

- **Gioco deterministico** (Genshin, HSR, ZZZ, WuWa): implementa `resolveActor`
  e `computeDamage`. Il risolutore di rotazioni condiviso fa il resto.
- **Gioco stocastico** (Grand Cross): implementa anche `simulateOnce`, che il
  runner ripete in Monte Carlo.

## Account

Registrazione e accesso con email e password. Discord e Google si attivano da
soli se le rispettive variabili sono valorizzate, altrimenti il pulsante non
compare.

**Non chiediamo mai le credenziali dell'account di gioco.** I profili si
collegano tramite UID pubblico (Enka.Network) o import di un JSON prodotto da
uno scanner che gira sulla macchina dell'utente. Gli endpoint interni di
HoYoLAB richiederebbero i cookie di sessione degli utenti: fuori discussione,
sia per responsabilita' nostra sia perche' esporrebbe loro al ban.

I **ruoli** sono una scala (`USER < CONTRIBUTOR < EDITOR < MODERATOR < ADMIN`) e
`can(role, permesso)` fa un solo confronto invece di una matrice di casi. Il
**premium non e' un ruolo**: e' un'entitlement commerciale in `subscriptions`,
cosi' cambiare piano non tocca mai i permessi redazionali.

Il calcolatore resta **pubblico**: chiedere l'account prima di dare valore uccide
la conversione. L'account serve per salvare e condividere.

## Sistema visivo

La palette deriva dai colori di rarita' dei gacha - oro 5 stelle, viola 4 - su
base prugna scura. E' un riferimento che il pubblico riconosce senza usare un
solo asset dei publisher: l'identita' del sito resta nostra e sopravvive anche
se un domani dovessimo rimuovere ogni icona.

Tre ruoli tipografici: Bricolage Grotesque per i titoli (asse di larghezza
variabile), Instrument Sans per il testo, IBM Plex Mono per **tutti i numeri**.

L'elemento firma e' l'istogramma in home: una simulazione reale eseguita durante
il render, barre accese nell'intervallo p10-p90 e mediana in oro. L'oro e' l'unico
colore acceso del sistema e compare in due soli posti - mediana e azione
primaria.

## Stato attuale

| Componente | Stato |
|---|---|
| Motore, rotazioni, Monte Carlo, istogramma | Completo e testato |
| Contratto moduli + registry | Completo |
| Schema Drizzle del Core | Completo, migrazione generata |
| Account: registrazione, accesso, ruoli, sessione | Completo |
| Profilo pubblico `/u/<handle>` | Base: livello, badge, XP |
| Modulo Grand Cross | Struttura completa, **dati segnaposto** |
| Calcolatore, guide, community, pagamenti | Da fare |

### Cosa NON e' reale

I valori in `src/lib/games/grand-cross/data.ts` sono **segnaposto**. Netmarble
non pubblica dati strutturati e non esiste una community di datamining come per
i giochi HoYo: ogni unita' e ogni moltiplicatore va inserito a mano e calibrato
sul gioco. Le tre unita' presenti servono a validare il motore, non a produrre
numeri corretti.

Vanno calibrati anche i parametri in cima a quel file: carte pescate per turno,
carte giocabili, moltiplicatori di rango, soglia dell'ultimate e valori del
triangolo degli attributi.

## Vincoli di prodotto codificati nello schema

Non sono dettagli implementativi: sono decisioni costose o impossibili da
aggiungere dopo.

- **`guides.verifiedPatch`** — le guide invecchiano a ogni patch. Il badge
  "verificata per X" e' impossibile da applicare a posteriori su migliaia di
  contenuti.
- **`sponsorPlacements` separata da `posts`** — il feed organico resta ordinabile
  solo per criteri organici. La separazione e' imposta dallo schema, non dalla
  disciplina di chi scrive le query. Etichettatura obbligatoria (DSA).
- **`xpEvents`** — XP solo su segnali di apprezzamento altrui, mai sul volume
  prodotto: premiare il volume produce spam.
- **`badgeTrust`** — `VERIFIED` (fonte pubblica) / `IMPORTED` (scanner locale) /
  `DECLARED` (auto-dichiarato). Solo il primo porta prestigio e colore.
- **`userBadges.snapshot`** — il badge verificato e' permanente: chi ruota la
  vetrina di gioco non deve perderlo.
- **`cosmetics`** — si vende presentazione, mai status, e mai asset dei
  publisher. Un cosmetico e' sempre design originale.
- **`purchases.withdrawalWaived`** — obbligo UE sui beni digitali: senza rinuncia
  esplicita al recesso, il cliente ha 14 giorni per il rimborso.
- **`subscriptions` separata da `userRole`** — i permessi redazionali non
  cambiano quando cambia il piano commerciale.

## Prossimi passi

1. UI del rotation builder: stat editabili, sequenza, risultati che si
   aggiornano mentre muovi i valori
2. Primo modulo deterministico su un gioco HoYo, per validare il contratto sul
   secondo paradigma
3. Card profilo condivisibile come OG image
4. Guide con sistema patch
5. Community e moderazione
