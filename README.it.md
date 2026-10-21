# Heiki (Italiano)

<p align="center">
  <a href="README.md">English</a> · <strong>Italiano</strong>
</p>

<p align="center">
  <strong>Piattaforma analitica data-driven, hub per la community e strumenti per giocatori e sviluppatori di videogiochi gacha.</strong><br>
  Dati estratti e decifrati dai client di gioco, formule di combattimento deterministiche, condivisione di formazioni, calcolatori di statistiche in tempo reale e tier list interattive.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Licenza-MIT-green?style=for-the-badge" alt="Licenza MIT">
  <img src="https://img.shields.io/badge/Next.js-15.5+-black?style=for-the-badge&logo=next.js" alt="Next.js">
  <img src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/TypeScript-5.x_Strict-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS v4">
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL 16">
  <img src="https://img.shields.io/badge/Drizzle_ORM-0.44+-C5F74F?style=for-the-badge&logo=drizzle" alt="Drizzle ORM">
  <img src="https://img.shields.io/badge/Vitest-780_Superati-729B1B?style=for-the-badge&logo=vitest" alt="Test Vitest">
  <img src="https://img.shields.io/badge/DB_Smoke-71_Verifiche-success?style=for-the-badge" alt="Verifiche DB Live">
</p>

---

## Panoramica del Progetto

**Heiki** è una piattaforma analitica full-stack open-source e un framework di ingegneria dei dati progettato per risolvere i problemi cronici di affidabilità e freschezza tipici delle wiki amatoriali e degli strumenti di teoria videoludica.

Nei videogiochi gacha moderni, le formule di calcolo del danno, le scalature delle abilità e le note di bilanciamento sono frequentemente offuscate o non documentate. La maggior parte delle risorse per la community si affida all'inserimento manuale su wiki, provocando ritardi sistematici, errori di trascrizione e incapacità di calcolare i massimali statistici esatti.

Heiki colma questo divario integrando una **pipeline proprietaria e riproducibile di decifrazione ed estrazione dati** direttamente dai pacchetti client e dai database interni dei videogiochi (database SQLite cifrati con chiavi dinamiche, asset bundle Unity compressi). Il sistema trasforma oltre 194.000 stringhe localizzate e centinaia di tabelle di entità in formule matematiche verificate e strumenti interattivi in tempo reale.

---

## La Visione: Un Hub Centrale per i Giocatori di Gacha

Oltre ai dati estratti e alle formule matematiche, **Heiki nasce per essere il punto di ritrovo centrale e il quartier generale collaborativo per tutti gli appassionati di videogiochi gacha**.

Le community dei giochi gacha sono storicamente frammentate su decine di canali diversi: server Discord con messaggi fissati difficili da cercare, thread Reddit dispersivi, wiki statiche non aggiornate e fogli di calcolo sparsi. Heiki riunisce i giocatori sotto un unico tetto moderno e integrato, dove è possibile:

- **Comunicare & Confrontarsi**: Partecipare a discussioni costruttive sull'evoluzione del meta, sulle potenzialità dei personaggi e sulle novità di gioco con moderazione trasparente e profili verificati.
- **Condividere & Scoprire Composizioni di Squadra**: Pubblicare, analizzare e votare formazioni ottimali per boss endgame, scontri di gilda e arene PvP competitive, complete di combinazioni di equipaggiamento, eroi associati e posizionamento tattico.
- **Valutazioni Eroi della Community**: Votazioni multidimensionali (PvE vs PvP, Bestie Demoniache, Boss Raid) in cui veterani e nuovi arrivati possono votare ed evidenziare i contenuti in cui ogni eroe esprime il massimo potenziale.
- **Aiuto Reciproco & Crescita del Box**: Mostrare la propria collezione di eroi, condividere tier list personalizzate tramite link diretti al profilo pubblico (`/u/[username]`) e ricevere consigli mirati da altri utenti su chi potenziare.
- **Identità Unificata Cross-Game**: Un unico profilo che segue il giocatore attraverso tutti i titoli supportati, preservando reputazione, guide scritte, tier list salvate e formazioni preferite.

---

## Stato Attuale & Espansione Multi-Gioco

### Modulo di Riferimento: The Seven Deadly Sins: Grand Cross (7DSGC)
Attualmente stiamo ultimando e rifinendo i lavori sul modulo principale dedicato a **The Seven Deadly Sins: Grand Cross**:
- **Oltre 373 Eroi Indicizzati**: Copertura completa dei dati estratti direttamente dalle tabelle SQLite del client di gioco con più di 194.000 record testuali localizzati.
- **Motore Statistiche Dinamico**: Modello matematico completo che calcola con esattezza statistiche base, Risveglio (1-6 stelle), Super Risveglio, Vero Risveglio, costumi e reliquie sacre.
- **Strumenti per la Community**: Tier List Maker ad alta risoluzione (con esportazione canvas e sincronizzazione cloud/JSON), sistema di valutazioni duale (PvE e PvP) e gestione del Box con architettura local-first.

### Architettura Multi-Gioco & Prossime Espansioni
L'architettura di Heiki è progettata fin dalle fondamenta per essere **modulare e indipendente dal singolo titolo**. Ogni videogioco è incapsulato in un modulo di dominio dedicato all'interno di `src/lib/games/`, condividendo l'infrastruttura di database, autenticazione, design system e gestione dello stato.

Con il completamento e la stabilizzazione finale del modulo 7DSGC, la tabella di marcia prevede l'estensione della piattaforma ai principali titoli del settore:
1. **Ecosistema HoYoverse**:
   - *Genshin Impact* (scalature del danno, reazioni elementali, ottimizzatore di manufatti)
   - *Honkai: Star Rail* (simulazione dell'ordine dei turni, calcolo della velocità, set di reliquie)
   - *Zenless Zone Zero* (meccaniche di accumulo anomalia, dischi motrice)
2. **Kuro Games**:
   - *Wuthering Waves* (meccaniche di energia concerto, ottimizzazione echi, curve di attributi)
3. **Adattatori di Gioco Guidati dalla Community**:
   - Interfacce standardizzate per consentire a sviluppatori e contributori di integrare nuovi titoli gacha attraverso modelli e parser condivisi.

---

## Missione Open Source & Carico dei Maintainer

La gestione continua di dati ad alta fedeltà per giochi "live service" comporta un notevole carico operativo per i maintainer:

1. **Velocità dei Rilasci Settimanali**: I giochi live-service ricevono aggiornamenti client a cadenza settimanale o bisettimanale. Ogni release modifica decine di tabelle SQLite, altera coefficienti non documentati e introduce nuovi personaggi con meccaniche inedite.
2. **Descrizioni Lessicali Ambigue**: Le descrizioni testuali delle abilità (spesso tradotte tra coreano, giapponese, inglese e italiano) presentano spesso discrepanze rispetto alla logica reale del codice o omettono limiti critici di cumulo.
3. **Collo di Bottiglia per Piccoli Team di Sviluppo**: I maintainer devono analizzare diff grezzi, redigere migrazioni di schema SQL, retro-ingegnerizzare regole di danno ambigue e aggiornare centinaia di casi di test matematici.

### Pipeline di Ingestion & Manutenzione Automatizzata (Roadmap)

Per garantire la sostenibilità a lungo termine del progetto senza saturare le risorse dei maintainer, Heiki sviluppa una **pipeline automatizzata di ingestion e manutenzione**:

- **Parsing da Linguaggio Naturale ad AST Deterministico**: Trasformazione delle descrizioni complesse delle abilità in nodi AST TypeScript tipizzati, estraendo categorie di buff esatte, condizioni di attivazione e formule di danno verificate.
- **Triage Automatico delle Patch di Gioco**: Pipeline di analisi automatica dei diff sui database SQLite decifrati a ogni nuova versione del client per generare changelog tecnici, individuare modifiche non annunciate e predisporre le migrazioni di schema.
- **Generazione Automatica di Test Unitari**: Creazione automatizzata di fixture di test Vitest per i nuovi eroi e le nuove abilità, confrontando i risultati delle formule con i dati di benchmark empirici prima dell'approvazione delle modifiche.
- **Query Semantiche per Theorycrafting**: Interfaccia di ricerca avanzata su oltre 194.000 punti dati per consentire a giocatori e sviluppatori di interrogare complesse interazioni tra abilità e sinergie tra personaggi.

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
- **Rilevazione Contenuto d'Eccellenza**: Metriche percentuali aggregate per evidenziare dove spicca maggiormente ogni unità (Bestie Demoniache, Re Demone, PvP, Scontri Mortali).
- **Upsert Idempotente e Protezione Anti-Abuso**: Vincoli univoci compositi `(game_id, hero_id, user_id)` protetti da rate limiting in memoria.

### 4. Box Personaggi con Architettura Local-First
- **Sincronizzazione Ibrida**: Letture client a latenza zero gestite da `useSyncExternalStore` con fallback trasparente in `localStorage` e sincronizzazione asincrona su PostgreSQL per gli utenti autenticati.
- **Azioni Massive sul Box**: Aggiunta rapida in 1-click di tutti gli eroi filtrati e rimozione totale in sicurezza con modal di conferma.

### 5. Guide Strategiche & Condivisione Formazioni
- **Verifica della Validità di Patch**: Le guide e le formazioni di squadra sono vincolate alla versione di patch verificata (`verifiedPatch`). Con l'avanzamento della versione di gioco, il sistema segnala automaticamente le strategie non aggiornate come *"Da Revisionare"*, evitando informazioni obsolete.
- **Integrità delle Formazioni**: Validazione automatica delle regole di composizione squadra (eroi associati unici, attributi consentiti e set di manufatti).

### 6. Moderazione Trasparente e Audit Log Immutabile
- **Politica di Soft-Hiding**: I contenuti non vengono mai distrutti indiscriminatamente; i post segnalati vengono nascosti conservando l'autore e i metadati dell'operatore in un registro di audit transazionale.
- **Controllo degli Accessi su 5 Ruoli (RBAC)**: Gerarchia granulare dei permessi (`USER`, `COLLABORATOR`, `EDITOR`, `MODERATOR`, `ADMIN`).

---

## Architettura Tecnica

```
┌────────────────────────────────────────────────────────────────────────┐
│                          Next.js 15 App Router                         │
│   (React 19 Server Components · Streaming SSR · Client Components)     │
└──────────────────┬──────────────────────────────────┬──────────────────┘
                   │                                  │
         Server Actions & API                   Stato Local-First
       (Validazione Zod, Auth.js)           (useSyncExternalStore)
                   │                                  │
         ┌─────────┴─────────┐                        │
         ▼                   ▼                        ▼
┌──────────────────┐ ┌──────────────┐       ┌──────────────────┐
│   PostgreSQL 16  │ │ In-Memory    │       │ Memoria Browser  │
│   (Drizzle ORM)  │ │ Rate Limiter │       │  (localStorage)  │
└──────────────────┘ └──────────────┘       └──────────────────┘
```

### Scelte Architetturali di Rilievo
1. **Next.js 15.5+ App Router con React 19**: Utilizzo esteso di React Server Components (RSC) per ridurre drasticamente il codice JavaScript inviato al browser (~103 kB First Load JS condiviso).
2. **PostgreSQL 16 & Drizzle ORM**: Tipizzazione end-to-end garantita dallo schema SQL fino all'interfaccia utente. Schemi dichiarativi, migrazioni riproducibili e integrità referenziale.
3. **Resilienza ad Alta Disponibilità**: Fallback automatico in memoria attivo in caso di disconnessione temporanea del database, garantendo la navigazione del catalogo in sola lettura senza interruzioni.
4. **Sicurezza di Grado Enterprise**:
   - **Content Security Policy (CSP)** dinamica con nonce crittografici per singola richiesta applicati via middleware.
   - **Rate Limiting** in memoria su finestra scorrevole per proteggere gli endpoint di mutazione e autenticazione.
   - Prevenzione XSS tramite parser Markdown basato su Abstract Syntax Tree, senza ricorso a `dangerouslySetInnerHTML`.
   - Cookie di sessione con attributi `SameSite=Lax`, `HttpOnly` e prefisso di produzione `__Secure-`.
5. **Identità Visiva Persona 5**:
   - Palette scura editoriale (`#0b0a0a` / `#151313`) con tagli geometrici `.p5-cut`, bottoni stilizzati `.p5-btn` e accento rosso iconico `#e61421`.
   - 5 temi cromatici scuri selezionabili dall'utente certificati per contrasto elevato WCAG AAA (rapporto ≥ 7:1 per testo normale, ≥ 4.5:1 per componenti grafici).

---

## Stack Tecnologico

| Livello | Tecnologia |
|---|---|
| **Framework Web** | [Next.js 15](https://nextjs.org/) (App Router), [React 19](https://react.dev/) |
| **Linguaggio** | [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode) |
| **Stile & Design** | [Tailwind CSS v4](https://tailwindcss.com/), [Phosphor Icons](https://phosphoricons.com/) |
| **Database & ORM** | [PostgreSQL 16](https://www.postgresql.org/), [Drizzle ORM](https://orm.drizzle.team/) |
| **Autenticazione** | [Auth.js v5 (NextAuth)](https://authjs.dev/) (Credenziali, Discord OAuth, Google OAuth) |
| **Suite di Test** | [Vitest](https://vitest.dev/), script custom `smoke-db.mts` |
| **Containerizzazione** | [Docker](https://www.docker.com/), Docker Compose |

---

## Qualità del Codice & Rigore Ingegneristico

Ogni commit e build è verificato attraverso una suite di test automatizzati:

- **780 Test Unitari e di Integrazione (Vitest)**:
  - Formule di calcolo del danno, scalatura statistiche, simulazioni Monte Carlo ed entropia RNG.
  - Verifica crittografica delle sessioni, token di recupero credenziali e parsing AST del markdown.
  - Token cromatici e validazione del contrasto accessibile WCAG.
- **71 Verifiche Live su Database (`npm run db:smoke`)**:
  - Test eseguiti su istanza PostgreSQL reale: migrazioni di schema, cancellazioni a cascata, cicli di vita delle sospensioni utente e soglie del rate limiter.
- **Tipizzazione Statica Rigorosa & Linting**:
  - `npm run typecheck` (`tsc --noEmit`): **0 errori**.
  - `npm run lint` (`eslint`): **0 errori** su tutti i file sorgente e gli script di automazione.

---

## Struttura del Repository

```text
Heiki/
├── src/
│   ├── app/                      # Next.js App Router (Layout, Pagine, Route API)
│   │   ├── [game]/               # Route dinamiche per gioco (eroi, tierlist, guide, ecc.)
│   │   ├── u/[username]/         # Profili pubblici, tier list salvate, badge
│   │   └── api/                  # Route handler (callback auth, healthcheck)
│   ├── components/               # Componenti UI stile Persona (filtri, griglie, modali)
│   │   ├── tier-list/            # Tier List Maker (rendering canvas, drag & drop)
│   │   ├── ratings/              # Modali e badge per valutazioni della community
│   │   └── game-account/         # Gestione e sincronizzazione box eroi
│   ├── lib/
│   │   ├── db/                   # Schema Drizzle, client PostgreSQL, migrazioni
│   │   ├── games/                # Moduli di gioco, dati decifrati, calcolatori
│   │   ├── tier-list/            # Server actions e logica di salvataggio tier list
│   │   ├── ratings/              # Server actions e calcolo medie aggregate
│   │   ├── auth/                 # Configurazione Auth.js, permessi, ruoli
│   │   └── security/             # Content Security Policy, rate limiter, sanitizzatori
├── scripts/                      # Script di configurazione, seed database, test di fumo
├── drizzle/                      # File di migrazione SQL generati da Drizzle Kit
└── docker-compose.yml            # Configurazione del container PostgreSQL
```

---

## Guida all'Avvio

### Prerequisiti
- **Node.js** v20.x o superiore
- **Docker Desktop** (per l'istanza PostgreSQL locale)

### Installazione con Comando Singolo
Lo script di configurazione prepara automaticamente le dipendenze, avvia il container PostgreSQL, esegue tutte le migrazioni di schema e inserisce i dati iniziali:

```bash
# 1. Clona il repository
git clone https://github.com/DGF-Tech-Solutions/Heiki.git
cd Heiki

# 2. Esegui la configurazione automatica
npm run setup

# 3. Avvia il server di sviluppo
npm run dev
```

L'applicazione sarà accessibile all'indirizzo [http://localhost:3000](http://localhost:3000).

---

## Comandi CLI

| Comando | Descrizione |
|---|---|
| `npm run dev` | Avvia il server di sviluppo Next.js Turbopack su `:3000` |
| `npm run build` | Compila una build di produzione ottimizzata e standalone |
| `npm run test` | Esegue la suite completa di 780 test Vitest |
| `npm run typecheck` | Convalida i tipi TypeScript su tutto il codice sorgente |
| `npm run lint` | Esegue l'analisi statica ESLint su `src/` e `scripts/` |
| `npm run db:smoke` | Esegue 71 verifiche di integrazione live su PostgreSQL |
| `npm run db:migrate` | Applica le migrazioni di schema pendenti con Drizzle Kit |
| `npm run db:reset` | Ripristina e ricrea il database locale da zero |
| `npm run db:studio` | Avvia l'interfaccia visuale Drizzle Studio |
| `npm run promote -- <email> ADMIN` | Assegna i privilegi di amministratore a un account |

---

## Tabella di Marcia (Roadmap)

- [x] Pipeline proprietaria di estrazione e decifrazione dei dati di gioco.
- [x] Roster completo ed esatto con calcolatore per The Seven Deadly Sins: Grand Cross.
- [x] Tier List Maker Canvas ad alta risoluzione con sincronizzazione cloud e backup JSON.
- [x] Sistema di valutazioni della community per PvE e PvP in tempo reale.
- [x] Gestione del box eroi con architettura local-first e funzionamento offline trasparente.
- [ ] Rifinitura finale e traguardo v1.0 per il modulo The Seven Deadly Sins: Grand Cross.
- [ ] Team builder interattivo con card di condivisione formazioni e votazione della community.
- [ ] Pipeline di ingestion automatizzata per il triage delle patch e l'estrazione di AST meccanici.
- [ ] Espansione ai titoli HoYoverse (*Genshin Impact*, *Honkai: Star Rail*, *Zenless Zone Zero*).
- [ ] Espansione ai titoli Kuro Games (*Wuthering Waves*).
- [ ] Generazione dinamica di immagini Open Graph per card di condivisione social.
- [ ] API pubblica REST / GraphQL per integrazioni da parte di sviluppatori terzi.

---

## Contribuire al Progetto

I contributi della community sono benvenuti! Prima di inviare una pull request, assicurati che:
1. Il controllo tipi sia superato senza errori: `npm run typecheck`.
2. L'analisi statica sia pulita: `npm run lint`.
3. Siano inclusi test per nuove formule o funzionalità: `npm run test`.
4. Le verifiche live su database abbiano esito positivo: `npm run db:smoke`.

---

## Licenza

Questo progetto è rilasciato sotto licenza [MIT License](LICENSE). Tutti i marchi, gli asset grafici e i loghi di gioco appartengono ai rispettivi editori e titolari dei diritti.
