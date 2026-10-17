# GachaZone — Istruzioni Operative e Contesto Progetto

## 1. Regole Operative e Autonomia
- **Autonomia Completa su File e Progetto**: Non chiedere conferma o permesso all'utente per leggere, analizzare, creare, modificare o testare file all'interno del progetto. Procedi direttamente con le modifiche e l'implementazione del codice, verificando sempre la qualità tecnica (typecheck, lint, test).
- **Politica di Commit**: **NON committare mai in automatico**. Esegui `git commit` esclusivamente quando l'utente ne fa esplicita richiesta.
- **Operazioni Delicate**: Chiedi conferma esplicita all'utente **esclusivamente** per operazioni distruttive, rischiose o irreversibili (es. drop/reset del database con perdita dati non salvati, git force-push, rimozione permanente di asset o storico git).
- **Standard di Lavoro**:
  - Lingua italiana per codice, commit, documentazione, commenti significativi e risposte all'utente.
  - Mantenere la coerenza stilistica e architetturale del progetto (Next.js 15 App Router, React 19, Tailwind v4 stile Persona, Drizzle ORM su PostgreSQL, Vitest).
  - Verificare sempre il lavoro eseguito (`npm run typecheck`, `npm run lint`, `npm run test`, `npm run db:smoke`).

---

## 2. Architettura Tecnica
- **Framework**: Next.js 15.5+ App Router, React 19.
- **Stile**: Tailwind CSS v4, direzione grafica Persona (sfondo scuro `#0b0a0a`/`#151313`, tagli obliqui `.p5-cut`, bottoni `.p5-btn`, accento brand rosso `#e61421`, font Archivo / Atkinson Hyperlegible Next / Geist Mono).
- **Database**: PostgreSQL 16 (in Docker compose, porta 5432) gestito con Drizzle ORM.
- **Testing**: Vitest (780 test unitari), script `scripts/smoke-db.mts` (71 verifiche database live).

---

## 3. Funzionalità Chiave Recenti
- **Valutazioni Eroi della Community (`src/lib/ratings/`, `src/components/ratings/`)**:
  - Tabella `hero_ratings` con chiavi `(gameId, heroId, userId)` per upsert idempotente.
  - Votazione duale PvE e PvP (1-5 stelle) con asset stella awaken gialla originale del gioco (`stella.png`).
  - Rilevazione contenuto d'eccellenza (*"Dove spicca di più"* tra le modalità di Grand Cross) con barre percentuali.
  - Scheda dedicata *"Valutazioni"* in `HeroTabs` e badge sintetico interattivo in `HeroFacts` con scorrimento fluido anti-rimbalzo.
  - Validazione server con controllo di appartenenza dell'eroe al roster reale di gioco.
- **Ottimizzazioni Prestazionali & Cache**:
  - Cache TTL in-memory di 3 secondi su `databaseReachable()` in `src/lib/db/index.ts` per azzerare query `SELECT 1` ridondanti durante il rendering.
  - Disattivazione del fallback font override per `Atkinson_Hyperlegible_Next` in `src/app/layout.tsx`.
- **Tier List Maker (`/[game]/tierlist`, `src/components/tier-list/`, `src/lib/tier-list/`)**:
  - Strumento accessibile dal menu *"Strumenti"* della barra laterale e del catalogo di gioco.
  - 6 livelli predefiniti (S+, S, A, B, C, D) con personalizzazione colori (palette 13 tinte), ridenominazione inline, aggiunta/rimozione/riordino righe.
  - Supporto completo a Drag & Drop HTML5 nativo e modalità Touch / Click rapido su card per smartphone.
  - Banco degli eroi con ricerca istantanea e filtri combinati per rarità e attributo.
  - Esportazione ad alta risoluzione (Retina 2x) in formato PNG tramite HTML5 Canvas con watermark GachaZone.
  - **Integrazione Account, Backup & Condivisione**:
    - Tabella `user_tier_lists` con chiave esterna a `users` e `games` (migrazione `0010_salvataggio_tier_list.sql`).
    - Supporto a tier list multiple con nomi differenti per lo stesso utente.
    - Gestore *"Le mie Tier List"* con caricamento immediato, salvataggio con nuovo nome ed eliminazione.
    - Sezione dedicata *"Tier List"* nel profilo utente (`/u/[username]`) con card riassuntive e anteprima eroi.
    - Funzione *"Scarica Backup JSON"* per avere un archivio locale di sicurezza non volatile.
    - Condivisione tramite link permanente `/[game]/tierlist?id=<uuid>` con caricamento automatico e clonazione per altri utenti.
    - Rate limit dedicato `tierListSave` a protezione anti-abuso.
- **Gestione Rapida Box Eroi (`src/components/game-account/box-browser.tsx`)**:
  - Pulsante di rimozione rapida totale *"Rimuovi tutti (N)"* con conferma di sicurezza per azzerare l'intero box con un click (`saveBox(EMPTY_BOX)`).
  - Coesistenza armonica con i filtri: rimozione selettiva dei soli filtrati (*"Togli i N mostrati"*) e rimozione globale sempre accessibile.
  - Sincronizzazione immediata con localStorage e account di gioco nel database.
- **Rifiniture Tecniche & Stabilizzazione**:
  - `fallback: ["system-ui", "sans-serif"]` su `Atkinson_Hyperlegible_Next` in `src/app/layout.tsx`.
  - Lookup case-insensitive per username nelle tier list profilo in `src/lib/tier-list/server.ts`.
  - Inclusione `tiers` nei riassunti salvataggi per caricamento zero-delay nel Maker.
  - `suppressHydrationWarning` su date formattate e chiavi univoche React composite.

---

## 4. Comandi di Verifica
- Controllo tipi: `npm run typecheck`
- Linter: `npm run lint`
- Test suite: `npm run test`
- Verifica DB live: `npm run db:smoke`
- Build produzione: `npm run build`
