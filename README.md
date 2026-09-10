# GachaZone

Piattaforma per i giochi gacha: schede personaggio, simulazioni di danno
verificabili e community. Giochi previsti: Grand Cross, Genshin Impact, Honkai
Star Rail, Zenless Zone Zero, Wuthering Waves.

Stato: **fondazione, account, community e struttura del sito**. Il motore di
calcolo funziona; i dati di gioco sono segnaposto e il costruttore di rotazioni
non c'è ancora.

---

## Per iniziare

Serve **Node 20+** e **Docker Desktop** avviato. Poi un comando:

```bash
git clone <url> && cd GachaZone
npm run setup
npm run dev
```

`npm run setup` fa tutto quello che altrimenti bisognerebbe ricordarsi: installa
le dipendenze, crea il `.env` con un `AUTH_SECRET` generato, avvia Postgres,
attende che risponda, applica le migrazioni e popola i dati minimi. È
idempotente: si può rilanciare quando serve.

Il sito parte su <http://localhost:3000>.

### Se qualcosa si incastra

```bash
npm run db:reset     # butta il database e ricostruisce da zero
npm run db:smoke     # 21 controlli sul percorso reale col database
docker compose logs  # cosa dice Postgres
```

### Comandi

| Comando | Cosa fa |
|---|---|
| `npm run dev` | Sito in sviluppo su :3000 |
| `npm test` | Suite di test (107) |
| `npm run typecheck` | TypeScript senza emissione |
| `npm run build` | Build di produzione |
| `npm run db:generate` | Genera una migrazione dopo aver cambiato lo schema |
| `npm run db:migrate` | Applica le migrazioni |
| `npm run db:seed` | Popola giochi, sezioni, badge, cosmetici |
| `npm run db:smoke` | Verifica il percorso reale sul database |
| `npm run db:reset` | Azzera e ricostruisce |
| `npm run db:studio` | Interfaccia web sul database |
| `npm run docker:app` | Tutto in container, senza Node locale |

### Docker

Il flusso normale è **Postgres in container, sito in locale**:

```bash
docker compose up -d      # solo il database
npm run dev               # il sito, con hot reload veloce
```

Chi non ha Node può far girare tutto in container:

```bash
npm run docker:app        # costruisce e avvia database + applicazione
```

Un server di sviluppo dentro un container su Windows ha l'hot reload lento,
perciò il profilo `app` esiste ma non è il modo consigliato di lavorare al
codice.

**Il sito non si rompe senza database.** Se Postgres non risponde, l'app passa a
un archivio in memoria con contenuti di esempio e lo dichiara in cima al feed:
si può pubblicare, commentare e votare, ma i contenuti spariscono al riavvio.
Serve per valutare la community senza installare niente.

---

## Stack

Next.js 15 (App Router) · React 19 · TypeScript strict · Tailwind 4 · Drizzle /
PostgreSQL · Auth.js v5 · Vitest. Alias `@/*` su `src/`.

## Struttura

```
src/app/
  page.tsx                    scelta gioco + ultimi post + classifica
  [game]/                     tutto il contenuto di un gioco
    page.tsx                  feed della community
    personaggi/[characterId]  scheda personaggio
    classifica/               ordinamento per danno simulato
    strumenti/                simulatore di squadra
    post/[postId]/            discussione
  u/[username]/               profilo pubblico
  entra, registrati, impostazioni/profilo

src/lib/engine/               motore: funzioni pure, nessuno stato, nessuna rete
src/lib/games/                contratto dei moduli + catalogo + registro
src/lib/community/            feed, ordinamento, archivio (DB e memoria)
src/lib/profile/              livelli, cosmetici, salvataggio
src/lib/auth/                 Auth.js, ruoli, permessi
src/lib/db/                   schema Drizzle e client
src/components/ui.tsx         primitive dell'interfaccia
scripts/                      setup, migrazioni, seed, verifica di fumo
```

### Il gioco è il primo segmento dell'URL

`/grand-cross/personaggi/<id>`. Cambiare gioco cambia il contesto di tutto:
feed, personaggi, classifica, strumenti. I cinque giochi previsti sono tutti
elencati nella barra; quelli senza modulo sono marcati "in arrivo" e i loro
indirizzi rispondono 404.

Nasconderli farebbe sembrare il sito monogioco, mostrarli come funzionanti
sarebbe una bugia. Dichiarare il piano è l'unica opzione onesta delle tre.

---

## Le decisioni che reggono il progetto

### Il motore

**Il risultato è sempre una distribuzione.** Un gioco deterministico produce una
distribuzione degenere di un campione, uno stocastico una vera. Il tipo di
ritorno è identico, quindi interfaccia e query non devono sapere quale
paradigma stanno guardando. È ciò che impedisce a Grand Cross — l'unico gioco a
carte casuali — di deformare l'architettura degli altri quattro.

**Funzioni pure, gira nel browser.** Nessuna chiamata di rete, nessuno stato
condiviso: il costo server dei calcoli è zero anche con molti utenti
simultanei, e lo stesso codice gira sul server per le pagine indicizzabili.

**Ogni risultato è riproducibile.** Seed e versione del dataset sono congelati
insieme al risultato: un link condiviso mostra sempre gli stessi numeri, e una
patch non riscrive di nascosto le build già salvate.

### Aggiungere un gioco

Deve bastare una cartella sotto `src/lib/games/` e una riga in `registry.ts`.
Zero modifiche al resto.

- **Deterministico** (Genshin, HSR, ZZZ, WuWa): implementa `resolveActor` e
  `computeDamage`. Il risolutore di rotazioni condiviso fa il resto.
- **Stocastico** (Grand Cross): implementa anche `simulateOnce`, che il runner
  ripete in Monte Carlo.

### La community

Un post può portare il **risultato di una simulazione** con seed e patch:
chiunque può rifare il conto e ottenere gli stessi numeri. È ciò che distingue
questo posto da un forum — non si discute per opinioni.

L'ordinamento "di tendenza" decade con l'età, perché una prima pagina che non
cambia mai smette di essere frequentata. Il `+1` sul punteggio fa emergere i
post nuovi: senza, un post appena scritto vale zero, quindi nessuno lo vede,
quindi nessuno lo vota, quindi resta invisibile.

Lo **sponsor** è una tabella e un componente separati dai post: non esiste un
modo per pagare ed essere più in alto nel feed organico. La separazione è
strutturale, non una convenzione che qualcuno un giorno dimenticherà.

### Gli account

**Mai le credenziali dell'account di gioco.** I profili si collegano tramite UID
pubblico (Enka.Network) o import di un JSON prodotto da uno scanner che gira
sulla macchina dell'utente. Gli endpoint interni di HoYoLAB richiederebbero i
cookie di sessione: fuori discussione, sia per nostra responsabilità sia perché
esporrebbe gli utenti al ban.

I **ruoli** sono una scala (`USER < CONTRIBUTOR < EDITOR < MODERATOR < ADMIN`).
Il **premium non è un ruolo**: è un'entitlement commerciale, così cambiare piano
non tocca i permessi redazionali.

Il calcolatore resta **pubblico**: chiedere l'account prima di dare valore uccide
la conversione. L'account serve per salvare e condividere.

### I cosmetici

Si vende **presentazione, mai status**. Cornici, sfondi, accenti e impaginazioni
sono disegni originali nostri: nessun asset dei publisher, mai. Un badge
guadagnato non si compra e non si sblocca pagando, si può solo incorniciare
meglio.

Nessun default è a pagamento — c'è un test che lo garantisce: chi non paga deve
avere un profilo completo, non mutilato.

---

## Vincoli codificati nello schema

Decisioni costose o impossibili da aggiungere dopo.

- **`guides.verifiedPatch`** — le guide invecchiano a ogni patch. Il badge
  "verificata per X" è impossibile da applicare a posteriori su migliaia di
  contenuti.
- **`sponsorPlacements` separata da `posts`** — vedi sopra.
- **`xpEvents`** — XP solo su segnali di apprezzamento altrui, mai sul volume
  prodotto: premiare il volume produce spam.
- **`badgeTrust`** — `VERIFIED` (fonte pubblica) / `IMPORTED` (scanner locale) /
  `DECLARED` (auto-dichiarato). Solo il primo porta prestigio e colore.
- **`userBadges.snapshot`** — il badge verificato è permanente: chi ruota la
  vetrina di gioco non deve perderlo.
- **`purchases.withdrawalWaived`** — obbligo UE sui beni digitali: senza rinuncia
  esplicita al recesso, il cliente ha 14 giorni per il rimborso.
- **`posts.attachment`** — il risultato di simulazione allegato, con seed e patch.

---

## Cosa NON è reale

I valori in `src/lib/games/grand-cross/data.ts` sono **segnaposto**. Netmarble
non pubblica dati strutturati e non esiste una community di datamining come per
i giochi HoYo: ogni unità e ogni moltiplicatore va inserito a mano e calibrato
sul gioco. Le tre unità presenti servono a validare il motore, non a produrre
numeri corretti.

Vanno calibrati anche i parametri in cima a quel file: carte pescate per turno,
carte giocabili, moltiplicatori di rango, soglia dell'ultimate e valori del
triangolo degli attributi.

La classifica lo dichiara in pagina.

---

## Prossimi passi

1. Costruttore di rotazioni: scegliere l'ordine delle azioni invece di lasciarlo
   alla priorità automatica
2. Primo modulo deterministico su un gioco HoYo, per validare il contratto sul
   secondo paradigma
3. Guide con sistema di patch verificata
4. Card profilo condivisibile come OG image
5. Moderazione e segnalazioni
