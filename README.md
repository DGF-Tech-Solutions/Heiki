# GachaZone

Piattaforma per i giochi gacha: schede degli eroi, dati e meccaniche letti dal
client del gioco, e community. Giochi previsti: Grand Cross, Genshin Impact,
Honkai Star Rail, Zenless Zone Zero, Wuthering Waves.

Stato: **Grand Cross ha roster, Endgame, artefatti, buff dell'account e
meccaniche di combattimento dal client; account, community e guide funzionano**.
Il vecchio motore di simulazione coi dati segnaposto non ha più pagine dal
27/09/2026 (vedi «Il motore»).

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
npm run db:smoke     # 30 controlli sul percorso reale col database
docker compose logs  # cosa dice Postgres
```

### Comandi

| Comando | Cosa fa |
|---|---|
| `npm run dev` | Sito in sviluppo su :3000 |
| `npm test` | Suite di test (179) |
| `npm run typecheck` | TypeScript senza emissione |
| `npm run build` | Build di produzione |
| `npm run db:generate` | Genera una migrazione dopo aver cambiato lo schema |
| `npm run db:migrate` | Applica le migrazioni |
| `npm run db:seed` | Popola giochi, sezioni, badge, cosmetici |
| `npm run db:smoke` | Verifica il percorso reale sul database (53 controlli) |
| `npm run promote -- <email> ADMIN` | Assegna un ruolo: serve per il primo amministratore |
| `npm run db:reset` | Azzera e ricostruisce |
| `npm run db:studio` | Interfaccia web sul database |
| `npm run lint` | ESLint su `src` e `scripts` |
| `npm run eroi:import` | Rigenera roster, testi, card e illustrazioni, poi i legami, l'equipaggiamento e i costumi, le parole blu, le meccaniche, l'Endgame, gli artefatti, i buff dell'account e i cambiamenti di patch |
| `npm run legami:import` | Rigenera solo i legami degli eroi associati, per il Randomizer e la scheda eroe (dopo gli eroi) |
| `npm run equipaggiamento:import` | Rigenera solo l'equipaggiamento e i costumi del calcolatore della scheda eroe, con le loro immagini (dopo gli eroi) |
| `npm run parole:import` | Rigenera solo le parole blu della scheda eroe (dopo gli eroi) |
| `npm run squadra:import` | Rigenera solo la lettura delle passive per la pagina Squadra: chi riceve e chi fa scattare (dopo le parole blu) |
| `npm run meccaniche:import` | Rigenera solo le meccaniche di combattimento: costanti, pesca, effetti Luce/Oscurità, cumulo (dopo le parole blu) |
| `npm run endgame:import` | Rigenera solo le quattro modalità dell'Endgame |
| `npm run artefatti:import` | Rigenera solo le Carte e i Set artefatto |
| `npm run buff:import` | Rigenera solo i buff dell'account: classe dell'account e costellazioni |
| `npm run cambiamenti:import` | Rigenera solo i cambiamenti di patch, dall'archivio delle patch della pipeline |
| `npm run docker:app` | Tutto in container, senza Node locale |
| `npm run db:backup` | Copia del database in `backups/` (tiene le ultime 14; serve Docker) |

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

### La messa online

Il sito non è ancora online. Il 03/10/2026 si è scelto di preparare tutto quello
che non dipende dal servizio che lo ospiterà, e di scegliere il servizio dopo.

**L'immagine.** `docker build -t gachazone .` dà il sito (output standalone di
Next, con `public/`); `docker build --target migrate -t gachazone-migrate .` dà le
migrazioni, da lanciare una volta prima di ogni versione nuova. Le immagini del
gioco (`public/eroi/`, circa 290 MB) non sono nel repo: entrano nell'immagine solo
se la si costruisce dal computer dove gira `npm run eroi:import`. Costruita da un
clone pulito l'immagine funziona, ma senza immagini.

**Le variabili, lette all'avvio:**

| Variabile | |
|---|---|
| `DATABASE_URL` | il Postgres di produzione |
| `AUTH_SECRET` | `npx auth secret`, diverso da quello di sviluppo |
| `AUTH_URL` | l'indirizzo pubblico, con `https://`. Fa anche da indirizzo del sito (sitemap, robots, link del recupero password) e dice ad Auth.js di fidarsi dell'host |
| `AUTH_DISCORD_ID`/`_SECRET`, `AUTH_GOOGLE_ID`/`_SECRET` | facoltative; nell'app di Discord o Google va registrato `<AUTH_URL>/api/auth/callback/discord` (o `/google`) |
| `DISCORD_WEBHOOK_MODERAZIONE` | facoltativa; il webhook del canale Discord dei moderatori: a ogni schermata da verificare arriva un messaggio con utente, eroe del giorno, classe dichiarata e il collegamento a `/moderazione` (la schermata non parte: resta sul sito) |

`NEXT_PUBLIC_SITE_URL` non va messa nell'ambiente della **build**: Next scrive nel
codice le variabili `NEXT_PUBLIC_` che trova in quel momento. Se manca,
`siteUrl()` usa `AUTH_URL`.

**Una versione nuova, in ordine:** `npm run db:backup` sul database di produzione
(`DATABASE_URL=... npm run db:backup`), poi le migrazioni, poi il sito nuovo.

**Salute.** `/api/salute` risponde 200 se il sito e il database rispondono, 503
se il database no. Lo usa il `HEALTHCHECK` dell'immagine; serve anche al servizio
che ospiterà il sito e a un controllo esterno.

**Controlli su GitHub.** `.github/workflows/controlli.yml`: tipi, lint, test e
build a ogni push su `main` e a ogni pull request, su un clone pulito.

**Da sapere per scegliere il servizio:**
- il limite di tentativi è in memoria del processo (vedi «Limite di tentativi»):
  con un solo processo vale com'è, con più istanze, o con funzioni serverless
  come quelle di Vercel, va spostato su un archivio condiviso
- le schermate della verifica della classe stanno nel database (bytea), quindi
  il sito non ha bisogno di un disco suo
- le immagini del gioco o viaggiano nell'immagine Docker o vanno su uno spazio a
  parte (un disco del servizio, Cloudflare R2...): il codice le chiede a
  `/eroi/...`, quindi nel secondo caso serve un rimando o un prefisso
- provarla in locale, accanto a `npm run dev`:
  `APP_PORT=3200 AUTH_URL_APP=http://localhost:3200 docker compose --profile app up --build`

---

## Stack

Next.js 15 (App Router) · React 19 · TypeScript strict · Tailwind 4 · Drizzle /
PostgreSQL · Auth.js v5 · Vitest. Alias `@/*` su `src/`.

## Struttura

```
src/app/
  page.tsx                    scelta gioco + ultimi post
  [game]/                     tutto il contenuto di un gioco
    layout.tsx                selettore gioco + barra laterale a gruppi
    page.tsx                  feed della community
    eroi/                     roster completo, filtri per rarita', attributo, razza e
                              caratteristica (?razza=3, ?caratteristica=6 li scelgono)
    eroi/[heroId]/            scheda dell'eroe, a schede (Abilita', Statistiche, Reliquia,
                              Info; ?scheda=<nome> apre quella giusta): testi dal client
    meccaniche/               danno, attributi, pesca delle carte, cumulo dei buff:
                              le regole lette nel codice del client, i numeri dai dati
    guide/                    elenco, scrittura, revisione, patch verificata
    post/[postId]/            discussione
  u/[username]/               profilo pubblico
  cerca/                      ricerca su eroi e discussioni
  notifiche/                  risposte e nuovi seguaci
  moderazione/                coda segnalazioni, sospensioni, registro (MODERATOR+)
  admin/                      ruoli, slot sponsorizzati, stato dataset (ADMIN)
  premium/                    cosa si compra e cosa no
  legale/                     privacy, termini, cookie
  entra, registrati, password/, impostazioni/{profilo,account}

src/lib/engine/               motore: funzioni pure, nessuno stato, nessuna rete
src/lib/games/                contratto dei moduli + catalogo + registro
src/lib/community/            feed, ordinamento, archivio (DB e memoria), riverifica
src/lib/guides/               guide: tipi, archivio (DB e memoria), azioni redazionali
src/lib/moderation/           segnalazioni, provvedimenti, stato di sospensione
src/lib/admin/                ruoli e slot sponsorizzati
src/lib/billing/              entitlement premium (separato dai ruoli)
src/lib/markdown.ts           markdown -> albero, senza HTML iniettato
src/lib/rate-limit.ts         limite di tentativi a finestra scorrevole
src/lib/social/               seguire, notifiche, suggerimenti
src/lib/profile/              livelli, cosmetici, salvataggio
src/lib/auth/                 Auth.js, ruoli, permessi
src/lib/db/                   schema Drizzle e client
src/components/ui.tsx         primitive dell'interfaccia
src/components/heroes/        sfoglia il roster: filtri e griglia; le schede della pagina
                              dell'eroe (hero-tabs, e un file per scheda: hero-abilities,
                              hero-relics, hero-costumes, hero-associations; calculator/ e'
                              il calcolatore delle statistiche). Una funzione nuova = una scheda.
                              hero-terms: le tendine delle parole blu
scripts/                      setup, migrazioni, seed, verifica di fumo,
                              ruoli, importazione roster
```

### Navigazione a gruppi

Selettore del gioco in cima, barra laterale a gruppi a sinistra: **Database**
(Eroi, Uscite, Cambiamenti, Set artefatto, Carte artefatto, Buff dell'account, Meccaniche) · **Endgame**
(Scontri finali, Bestie demoniache, Re Demone, Divinità Suprema) · **Strumenti**
(Randomizer, Squadra, Indovina l'eroe) · **Il tuo account** (Il mio account) · **Guide** (Guide e
rotazioni) · **Community** (Discussioni).

Le voci non sono le stesse per tutti i giochi: *Eroi* compare solo dove il modulo
ha un roster, dichiarato con `needs` in `GAME_GROUPS` e filtrato da
`gameGroups(slug)`. Una voce di menu che porta a una pagina vuota è peggio di una
voce che non c'è.

*Endgame* è entrato il 26/09/2026, quando ha avuto contenuto: le quattro
modalità boss di Grand Cross, dalle tabelle del client. Fino ad allora non c'era
apposta: un gruppo vuoto in navigazione promette qualcosa che non c'è, e chi ci
clicca una volta non ci clicca più. *Guide* è entrato allo stesso modo, quando ha
avuto pagine da mostrare, *Strumenti* il 27/09/2026 col Randomizer, e *Il tuo
account* lo stesso giorno con la pagina del tuo account di gioco.

**Sul telefono** (sotto i 1024px) la barra laterale non c'è: le stesse voci, con
la ricerca, stanno in un pannello che entra da sinistra (`game-menu.tsx`), aperto
dal pulsante a sinistra del marchio. Lo apre e lo chiude il browser (`popover`):
il pulsante sta nell'intestazione, che non sa in che gioco si è, e compare solo
quando la pagina contiene il pannello (`body:has(#menu-sezioni)`). Sotto i 640px
anche le voci di chi è entrato (Notifiche, profilo, Personalizza, Coda, Esci)
passano in un pannello, e chi non è entrato vede solo «Entra». Tutti e due i
pannelli si chiudono quando si tocca una voce (`popover-panel.tsx`): il guscio
resta montato mentre si naviga.

### Il gioco è il primo segmento dell'URL

`/grand-cross/eroi/<id>`. Cambiare gioco cambia il contesto di tutto:
feed, eroi, Endgame, guide. I cinque giochi previsti sono tutti
elencati nella barra; quelli senza modulo sono marcati "in arrivo" e i loro
indirizzi rispondono 404.

Nasconderli farebbe sembrare il sito monogioco, mostrarli come funzionanti
sarebbe una bugia. Dichiarare il piano è l'unica opzione onesta delle tre.

---

## Le decisioni che reggono il progetto

### Il motore

**Dal 27/09/2026 nessuna pagina ne mostra i risultati.** Personaggi, Nemici,
Classifica danno e Simulatore squadra giravano su tre unità segnaposto
(`grand-cross/data.ts`), e le loro regole contraddicevano quelle che la pipeline
ha poi letto nel codice del gioco: triangolo al contrario, vantaggio moltiplicato
invece che sommato, pesca 50/50 e sette carte nuove a ogni turno. Le pagine sono
state tolte, su scelta dell'utente; le regole vere le spiega `/meccaniche`. Il
motore resta nel codice finché lo usano la riverifica degli allegati della
community (`community/verify.ts`, `demo-seed.ts`), la patch con cui le guide si
dichiarano vecchie (`dataset.patch`), la pagina admin e lo script del database:
toglierlo del tutto è un passo a parte.

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

### I cambiamenti di patch

La pagina **Cambiamenti** (`/grand-cross/cambiamenti`) e la sezione in fondo alla scheda
Info di ogni eroe dicono cosa è cambiato negli eroi a ogni patch: il testo di ogni rango
delle carte, l'Unica coi suoi livelli, le abilità speciali, le statistiche al massimo, le
reliquie, i legami e i costumi. Il resto del client (eventi, missioni, negozio...) è solo
contato, per gruppo di tabelle. Scelte dell'utente, 03/10/2026.

Da dove viene. La pipeline tiene una copia delle tabelle e dei testi del client per ogni
patch (`script/archivio_patch.py`, in `storico_patch/`), dal 23/09/2026: le patch prima
non sono state conservate, e la pagina lo dice. `script/cambiamenti.py` costruisce le
schede degli eroi di due patch con **lo stesso codice** e le confronta voce per voce: le
differenze vengono dai dati, non da una correzione della pipeline. Un testo che cambia solo
nei codici di colore del gioco è un «ritocco di formattazione», non un cambiamento
dell'eroe. I pezzi del confronto parola per parola ricompongono il testo di prima e quello
di dopo: c'è un test che lo controlla (`changes.test.ts`).

Dopo una patch, nella pipeline: `archivio_patch.py salva` subito dopo `testi_client.py`, poi
a fine catena `cambiamenti.py`, poi `npm run eroi:import` (o `cambiamenti:import`).

### Il roster e gli asset del gioco

La sezione **Eroi** elenca 373 unità di Grand Cross con la card che il gioco
mostra davvero: cornice della rarità, sfondo, ritratto e bollino dell'attributo.
I dati non stanno nel client - il gioco li scarica - e le immagini sono dentro
bundle Unity con un'intestazione civetta. Ricavarli è stato un lavoro a sé, che
vive fuori da questo repository.

I **testi** sono un caso a parte, e valeva la pena scavare: `LocalizeString_*.bytes`
non sono file di testo ma **database SQLite** da 194.546 stringhe per lingua,
cifrate. Lo schema, e il modo in cui l'ho ricavato, sono documentati in
`_7dsgc/estrai_testi.py`: XOR con la chiave `NetmarbleFun&Cherry` dove il
carattere usato in posizione *i* è `chiave[(k·(i+1)) mod 19]`, con `k` variabile
per riga — e il XOR va applicato ai code point Unicode, non ai byte UTF-8, cosa
che fa fallire tutti e soli i testi con accenti. Resa: 99,9%, in italiano e in
inglese.

Da lì arrivano descrizione, epiteto, titolo completo e frasi di caricamento per
**tutti e 373 gli eroi**. I 59 che all'inizio sembravano assenti sono i
personaggi in collaborazione — Re:Zero, Fire Force, KonoSuba, Solo Leveling —
e le loro chiavi portano un prefisso (`nes_`, `ffx_`, `kzm_`, `lol_`): cercando
`DB_hero_desc_<id>` esatto sparivano tutti insieme, e sembravano semplicemente
troppo recenti per essere nel client.

### Collegare un eroe ai suoi asset

Non tutti i collegamenti danno la stessa garanzia, e la differenza va detta
perché un'icona sbagliata su una scheda non si nota finché non la guarda
qualcuno che conosce il personaggio.

| Asset | Come si collega | Copertura |
|---|---|---|
| Illustrazione `hero_illust_…` | **heroId nel nome del file** | 370/373 |
| Icona abilità esclusiva | **heroId nel nome del file** | 369/373 |
| Colpi per abilità | **heroId nel nome del file** | 373/373 |
| Carte d'attacco `icon_<slug>_<grado>_type01_skill_<n>` | slug + grado di uscita | 288/373 |
| Ritratti `icon_hero_*` / `icon_skin_*` | slug ricavato dall'illustrazione | 349/373 |

Le carte d'attacco sono 128×256 — nel gioco sono carte, non icone — e il
rapporto 1:2 è il filtro più affidabile per riconoscerle. I **colpi per carta**
invece sono certi per tutti e 373: `skill_attack_count_<id>.bytes` porta l'id
nel nome, ed è l'**unico dato numerico di combattimento presente nel client**.

Nel sito finiscono i collegamenti certi più le carte. I ritratti no, perché lo slug
restringe al personaggio ma non alla variante — e proprio quel controllo ha
mostrato che alla card di Tree Guardian King (slug `king_blade`) la pipeline
aveva assegnato l'icona di Sabnak. Li mappa `_7dsgc/mappa_asset.py`, che
registra il gruppo di candidati senza scegliere al posto di chi guarda.

`_7dsgc/correggi_card.py` usa lo stesso vincolo per rifare le card che avevano
il ritratto di un altro personaggio: cerca solo fra le icone di quel
personaggio e sceglie la posa confrontandola con la card di 7dshub. Riscrive
solo se il punteggio migliora davvero, quindi non tocca le card già giuste —
Hawk & Elizabeth resta com'era perché il suo 7,5 batte il 29,5 dello slug nudo.
Le quattro note sono rientrate nella norma: Baldr 39,7→8,1, Tree Guardian King
38,8→7,5, Emilia 29,9→7,1, Rimuru 28,6→5,1. Sul roster intero lo scarto mediano
resta 7,7, ma le card sotto 15 passano da 351 a 355 e quelle sopra 22 da 13 a 9.

Il confine passa qui, e non è formale:

- **i dati** (nomi, rarità, attributi) sono fatti, e stanno nel repository in
  `src/lib/games/grand-cross/heroes.generated.ts`
- **le immagini** sono asset di Netmarble rielaborati, e non sono versionate.
  Stanno in `public/eroi/`, che è in `.gitignore`. Le card degli eroi e i
  cut-in sono WebP (l'importazione li converte: un quinto del PNG); il sito le
  serve con un giorno di cache nel browser, e il servizio delle immagini tiene
  per una settimana le copie ridimensionate (`next.config.ts`): dopo
  un'importazione che cambia delle immagini si svuota `.next/cache/images`
- **i testi lunghi** stanno in `hero-texts.generated.ts`, separati dal roster:
  il roster viaggia fino al browser per i filtri, le descrizioni no
- **il calendario delle uscite** sta in `releases.generated.ts`: il foglio della
  community (thefilght / dreamer_plays), letto da `_7dsgc/script/date_uscita.py`,
  un aggiornamento per data con ogni eroe legato al roster. I calendari sono due:
  quello **globale** (la scheda GLOBAL SCHEDULE fino all'allineamento del
  novembre 2024, poi le date giapponesi, salvo i rari aggiornamenti usciti nel
  globale il mercoledì prima) e quello di **Giappone e Corea**. Alimenta la sezione **Uscite** e l'ordine di partenza della griglia
  degli eroi, per uscita globale dal più recente. Il client PC non ha date
  d'uscita: la fonte è dichiarata in pagina
- **l'Endgame** (Scontri finali, Bestie demoniache, Re Demone, Divinità Suprema)
  sta in `death-match`, `creature-nest`, `demon-king` e `supreme-deity.generated.ts`,
  più `endgame-heroes.generated.ts` coi legami per la scheda eroe. Li scrive
  `scripts/import-endgame.mts` dai JSON di `_7dsgc/script/scontri_finali.py`,
  `creature_nest.py` e `re_demone_divinita.py`; il contratto è in
  `src/lib/games/endgame-types.ts`, gli studi dei dati (letto e dedotto) in
  `_7dsgc/SCONTRI_FINALI.md`, `CREATURE_NEST.md` e `RE_DEMONE_DIVINITA.md`. Le
  statistiche dei boss sono una **stima** e la pagina lo dice: il client non le
  scrive. Scontri finali e Bestie demoniache sono un indice con una pagina per boss
  (`/scontri-finali/<boss>`, `/bestie-demoniache/<bestia>`), come gli eroi; Re
  Demone e Divinità hanno un boss solo e una pagina. La difficoltà scelta sta
  nell'indirizzo (`?difficolta=3`, `?piano=2`) e il server rende solo quel
  pannello: con tutte le difficoltà nell'HTML gli Scontri finali pesavano 10,8 MB
  in sviluppo. Lamek, lo Scontro finale d'evento, non c'è. Le immagini vanno in
  `public/eroi/<gioco>/endgame/`
- **gli artefatti** (Carte artefatto e Set artefatto) stanno in
  `artifacts.generated.ts`, scritto da `scripts/import-artifacts.mts` dal JSON di
  `_7dsgc/script/artefatti.py`; il contratto è in `src/lib/games/artifact-types.ts`.
  Due voci, ognuna con una griglia coi filtri e una pagina per elemento
  (`/set-artefatto/<numero>`, `/carte-artefatto/<id>`), come gli eroi. I filtri dei
  set sono quelli del menu del gioco (contenuto, razza, caratteristica, varie). Due
  cose sono **dedotte** e le pagine lo dicono: i punti di potenziamento come totali
  per livello (le 306 squadre del computer che usano un set li confermano) e la
  probabilità dei pacchetti come peso sulla somma dei pesi. Da quali modalità
  dell'Endgame cade una carta non sta nel JSON: `cardSources()` lo cerca nei drop
  che le pagine Endgame mostrano già. Le carte arrivano dalla pipeline già
  composte come nel gioco: l'illustrazione dentro la cornice del suo grado, presa
  dall'atlante `atlas_artifact` (la piccola delle liste e la grande a nove fette),
  verticali, in WebP; vanno in `public/eroi/<gioco>/artefatti/`
- **i buff dell'account** (la classe di combattimento dell'account coi suoi 53
  titoli, le 11 costellazioni pietra per pietra, le regole della classe di un eroe)
  stanno in `account-buff.generated.ts`, scritto da `scripts/import-account-buff.mts`
  dal JSON di `_7dsgc/script/buff_account.py`; il contratto è in
  `src/lib/games/account-buff-types.ts`, i conti in `account-buff.ts`. Come si
  sommano l'ha letto la pipeline nel **codice** del client, e lo studio con le prove
  è `_7dsgc/BUFF_ACCOUNT.md`: dei titoli vale solo il più alto, in percentuale sulla
  statistica prima delle passive; le costellazioni si aggiungono dopo, come valori
  fissi; né gli uni né le altre entrano nella classe di combattimento né nella
  schermata delle statistiche del gioco, contano in battaglia. Le posizioni delle
  pietre vengono dai prefab delle mappe del gioco. Il tuo account (classe e
  costellazioni) si sceglie nella pagina `/buff-account`, in `/account` o nel
  calcolatore della scheda eroe e si salva nel browser (`localStorage`,
  `account-setup.ts`), e per chi è entrato anche nel database (vedi «L'account di
  gioco e la verifica della classe»): la scheda
  legge i totali già sommati, con l'impronta dei dati (`version`) per accorgersi di
  una patch. La classe di combattimento dell'eroe nella scheda è calcolata con la
  formula del client, con l'equipaggiamento scelto nel calcolatore. Le immagini
  (simboli, pietre) vanno in `public/eroi/<gioco>/buff-account/`
- **l'equipaggiamento e i costumi** stanno in `gear.generated.ts` e
  `costumes.generated.ts`, scritti da `scripts/import-gear.mts` dai JSON di
  `_7dsgc/script/equipaggiamento.py` e `costumi.py`; il contratto è in
  `src/lib/games/gear-types.ts`, i conti in `gear.ts` (pezzi, set, effetti bonus,
  costumi, associazione) e `hero-build.ts` (la configurazione del calcolatore e il
  conto completo). Le regole le ha lette la pipeline nel **codice** del client, e gli
  studi sono `_7dsgc/EQUIPAGGIAMENTO.md` e `_7dsgc/COSTUMI_ASSOCIAZIONI.md`: la
  statistica di un pezzo è tiro + miglioramenti (30, cioè cinque risvegli con «+5»)
  per il passo della sua rarità; l'«UR» è un SSR inciso per un eroe; set ed effetti
  bonus sono passive che si sommano per statistica e moltiplicano Attacco, Difesa e
  PS; un set vale ogni `pezzi / pezzi del set` volte. Dei costumi contano solo i
  registrati (cinque per tipo e la reliquia), e il loro valore piatto viene dalla
  tabella del potenziamento, uguale per tutti al massimo: cambiano le percentuali.
  La scheda Statistiche è il **calcolatore** (`src/components/heroes/calculator/`):
  livello e risvegli, i sei pezzi come nel gioco coi set pronti PS/Difesa,
  Attacco/Difesa, Attacco/Critico, ogni pezzo modificabile, i costumi registrati
  scelti fra tutti quelli dell'eroe, la reliquia, e in battaglia l'account e l'Eroe
  associato; la tabella dice senza, con e differenza. La configurazione si salva
  nel browser per ogni eroe. Si parte da tutto al massimo: senza equipaggiamento
  sono i numeri di sempre, con PS/Difesa il «massimo con equipaggiamento» che
  usava 7dshub (i test lo controllano eroe per eroe). Le icone di pezzi e costumi
  sono quelle del gioco: la pipeline prepara gli strati del componente IconItem
  (sfondo e cornice della rarità, lettera, stelle, «+N», glifo del set, marchio del
  costume) già al loro posto, e il sito li impila (`item-icon.tsx`). Le immagini
  vanno in `public/eroi/<gioco>/equipaggiamento/` e `costumi/`; la scheda
  **Costumi** li mostra tutti
- **le meccaniche di combattimento** (le costanti del danno, il triangolo degli
  attributi, i pesi di pesca e gli effetti Luce/Oscurità di ogni eroe, il cumulo dei
  buff per concetto delle parole blu) stanno in `mechanics.generated.ts`, scritto da
  `scripts/import-mechanics.mts` dal JSON di `_7dsgc/script/meccaniche.py`; il
  contratto è in `src/lib/games/mechanics-types.ts`, le regole come funzioni in
  `mechanics.ts` (gli esempi della pagina `/meccaniche` si calcolano con quelle). Le
  regole le ha lette la pipeline nel **codice** del client, e lo studio con le prove è
  `_7dsgc/MECCANICHE_COMBATTIMENTO.md`: il danno di un colpo passo per passo, chi
  batte chi, la pesca (A 60, B 40, con reinserimento), il cumulo (per parola chiave:
  resta il più forte, o si accumula fino a un tetto). La scheda eroe mostra i pesi
  sotto le carte e l'effetto Luce/Oscurità sotto l'Unica, le tendine delle parole blu
  come si cumula quel buff. Il legame buff -> concetto è per nome, quindi dedotto
- **le parole blu** della scheda eroe (Perforazione, Evasione, alleati
  applicabili, Demoni, [Ragnarok]...) si cliccano e aprono una tendina con gli eroi
  legati: per un effetto chi ce l'ha e in quale abilità, per una razza, una
  caratteristica o gli alleati applicabili chi ne fa parte. I dati stanno in
  `hero-terms.generated.ts`, scritto da `scripts/import-hero-terms.mts` dal JSON di
  `_7dsgc/script/parole_blu.py` (la stessa logica di `contesto_eroi.py`, parola per
  parola, sul testo inglese) e dai dati degli eroi già generati: per questo in
  `eroi:import` viene subito dopo gli eroi. Il contratto è in
  `src/lib/games/hero-terms-types.ts`. Le parole si contano con `termWords`
  (`hero-markup.ts`), la stessa funzione per l'import e per la pagina, e quelle
  italiane si legano per posizione a quelle inglesi (99,7% dei testi); nomi e
  definizioni italiani dei concetti vengono dalle note italiane del gioco. Le
  tendine le disegna il server e le apre il browser (`popover`), senza JavaScript;
  un componente client le mette sotto la parola e accende la ricerca negli elenchi
  da 8 eroi in su (nome ed epiteto nelle due lingue, personaggio, abilità). Per
  una razza o una caratteristica, in fondo c'è la griglia Eroi già filtrata
- **i legami** (gli Eroi associati: con chi un eroe attiva l'Effetto associazione, e
  quali legami danno l'Attacco combinato) stanno in `hero-fates.generated.ts`, scritto
  da `scripts/import-hero-fates.mts` dalle schede del client (`fates` di
  `_7dsgc/eroi/client/abilita.json` e `abilita_it.json`, da `DB_fate`); il contratto è
  in `src/lib/games/hero-fates-types.ts`; i valori a ogni grado dell'associato e
  l'effetto comune (5-10% delle statistiche dell'associato, con qualunque eroe)
  vengono da `_7dsgc/script/associazioni.py`. Li mostra la scheda **Associazioni**
  della pagina dell'eroe (i suoi associati, e di chi è associato lui), li conta il
  calcolatore nella colonna «In battaglia», e li usa il **Randomizer** (`/randomizer`):
  quattro eroi in campo e quattro nei loro Slot associazione, pescati dal browser, a
  caso o con una sinergia per forza fra i quattro in campo (almeno tre hanno un'Unica
  che nomina alleati applicabili e ognuna vale per tutti gli altri; il quarto può
  averne una non specifica; gli associati restano a caso, e l'Effetto associazione si
  mostra quando capita un legame), anche senza le collaborazioni. Le regole del sorteggio stanno in `src/lib/games/randomizer.ts`,
  coi test
- **Squadra** (`/squadra`, dal 03/10/2026): si scelgono quattro eroi e i loro associati,
  e per ognuno la pagina dice cosa dà ai compagni e cosa riceve da loro con le passive
  (Unica, Reliquia sacra classica, Comandamenti, Grazie, Unità, Talenti), quali
  passive dei compagni accende, e quali restano spente e perché: dove si gioca (PvE,
  PvP, Scontro finale, Bestia demoniaca, coi codici del client e le frasi «In PVP»),
  la panchina (il quarto eroe può partire nello slot secondario), il rango della Mossa
  finale, le reliquie, e le regole del gioco su Comandamenti, Grazie e Unità (vale
  quella dell'eroe più a sinistra). Per un posto libero suggerisce gli eroi che si
  incastrano meglio, contati solo sulle passive (scelta dell'utente); per un associato,
  i legami. La squadra sta nell'indirizzo (`?s=…&a=…&c=pvp&p=0&u=6&r=1`) e il browser
  ricorda l'ultima. La lettura delle passive la fa la pipeline
  (`_7dsgc/script/squadra.py` → `eroi/squadra.json`): frase per frase, dal testo
  inglese del gioco, a chi va l'effetto (alleati applicabili, alleati di una razza o
  caratteristica, tutti gli alleati) e quali compagni lo fanno scattare («per ogni»,
  «quando», «se», «se tutti sono»), confrontata con le colonne delle passive del
  client; l'import (`scripts/import-team.mts`) la lega ai testi del sito, controlla di
  dividere le frasi allo stesso modo e appaia l'italiano per posizione, e scrive
  `team.generated.ts`. Contratto in `src/lib/games/team-types.ts`, valutazione e
  suggerimenti in `src/lib/games/team.ts`, coi test
- **Indovina l'eroe** (`/indovina`) è il gioco degli indizi sul modello di Loldle:
  si scrive un eroe e otto caselle dicono cosa ha in comune con quello da
  indovinare (personaggio, attributo, razza, caratteristiche, grado d'uscita e
  massimo, abilità speciale, data d'uscita globale), verde, giallo o rosso, con la
  freccia dove i valori hanno un ordine. L'eroe del giorno è lo stesso per tutti
  (un'impronta della data sul roster in ordine d'id, senza server) e i tentativi
  restano nel browser; la partita libera pesca a caso.
  Dopo 4 e 8 tentativi sbagliati si scoprono l'icona e il nome dell'Unica. Come le
  altre modalità di Loldle ci sono tre sottosezioni, con le schede in cima:
  **Carta** (`/indovina/carta`, l'illustrazione di una carta A o B, ingrandita e a
  mosaico, che si allarga e si schiarisce a ogni errore; le carte dell'ultimate no,
  perché molte versioni dello stesso personaggio le condividono), **Unica**
  (`/indovina/unica`, l'icona, anche lei a mosaico; il mosaico si può spegnere) e
  **Testo** (`/indovina/testo`, il testo dell'Unica col nome dell'eroe nascosto).
  Ogni modalità ha il suo eroe del giorno. Nessun dato nuovo: le regole stanno in
  `src/lib/games/hero-guess.ts`, coi test; la partita comune alle modalità in
  `src/components/hero-guess/guess-game.tsx`
- **illustrazioni e icone abilità** stanno in `public/eroi/<gioco>/splash/` e
  `/abilita/`, anch'esse fuori dal versionamento

Metterle in un repository su GitHub sarebbe ridistribuirle. `npm run eroi:import`
le rimette a posto da una copia locale della pipeline di estrazione, indicata
dalla variabile `GC_ASSETS`. Chi clona senza quella copia vede il roster con i
riquadri vuoti: nomi, filtri e conteggi funzionano lo stesso.

Fino al 27/09/2026 accanto a Eroi c'era **Personaggi**, le unità che il vecchio
motore sapeva simulare: tre segnaposto. È stata tolta insieme alle altre pagine del
motore (vedi «Il motore»); la ricerca del sito cerca negli eroi.

### La riverifica degli allegati

Un post dichiara mediana e seed; **il motore rigira il calcolo e confronta**.
Altrove una build consigliata è l'affermazione di qualcuno, qui è un conto
rifacibile — e il sito lo rifà da solo.

Tre esiti, non due. *Non verificabile* (patch diversa, iterazioni non
dichiarate, personaggi ignoti) è diverso da *non riprodotto* (il conto è stato
fatto e dà un altro numero): confonderli marchierebbe come sospetti dei post
che sono solo vecchi. E l'esito neutro non mostra nulla, perché un segno di
dubbio su un post innocente fa più danno di nessun segno.

Gira solo sulla pagina della discussione, non nel feed: sono 1.500 simulazioni,
e la verifica serve dove qualcuno valuta l'affermazione, non mentre scorre una
lista.

### La community

Un post può portare il **risultato di una simulazione** con seed e patch:
chiunque può rifare il conto e ottenere gli stessi numeri. È ciò che distingue
questo posto da un forum — non si discute per opinioni.

Seguire, notifiche e cronologia dei post chiudono il ciclo che riporta la gente
indietro: segui qualcuno, quel qualcuno scrive, lo vieni a sapere, torni. Senza,
ogni visita riparte da zero e una discussione muore dopo il primo messaggio.
Richiedono un'identità vera, quindi funzionano solo con il database attivo.

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

Quello che c'è, e perché è fatto così:

- **Recupero password** — il gettone è memorizzato **con l'impronta SHA-256**,
  non in chiaro: chi legge il database non può usarlo. Vale una volta sola, dura
  un'ora e chiude tutte le sessioni aperte. La richiesta risponde **la stessa
  cosa** che l'indirizzo esista o no, altrimenti la pagina diventerebbe un modo
  per sapere chi è iscritto.
- **Errori di accesso indistinguibili** — email sbagliata e password sbagliata
  danno lo stesso messaggio, per lo stesso motivo.
- **Cambio email e password** — chiedono la password attuale: chi si siede al
  computer di qualcun altro con la sessione aperta non deve poter prendersi
  l'account. Cambiare la password chiude le altre sessioni, perché spesso si
  cambia proprio quando si sospetta un accesso altrui.
- **Eliminazione** — chiede la password e la parola `ELIMINA` digitata a mano. È
  l'unico modo per distinguere una decisione da un clic sbagliato su un'azione
  irreversibile.

### L'account di gioco e la verifica della classe

La pagina **`/<gioco>/account`** («Il mio account», 27/09/2026) tiene chi sei nel
gioco (nickname, Codice amico, server) accanto alla classe di combattimento
dell'account e alle costellazioni che le schede degli eroi usano già.

- **Browser e database.** Tutto resta nel `localStorage` anche per chi non è
  entrato. Per chi è entrato, `AccountSync` (nel guscio `src/app/[game]/layout.tsx`)
  confronta la copia del browser con quella di `game_accounts` e vince la più
  recente (`syncDirection` in `src/lib/games/game-account.ts`); ogni modifica fatta
  nel browser parte verso il database dopo 1,5 secondi di pausa. Il browser ricorda
  di chi è la sua copia, così i dati di una persona non finiscono nell'account di
  un'altra che entra dallo stesso computer.
- **Perché una schermata.** Il gioco non ha API e non mostra la classe
  dell'account di un altro giocatore (solo dentro l'Ordine dei Cavalieri); i titoli
  della classe, che la direbbero, non si possono mettere in mostra. Il metodo è
  dell'utente: il sito assegna un **eroe del giorno** (uno per utente e per giorno
  UTC, fra i 30 eroi che escono SR senza collaborazioni, al massimo due cambi), lo
  si mette nei preferiti, e una schermata dell'Elenco eroi ordinato per «Preferiti»
  mostra insieme l'eroe e la classe. Una schermata vecchia o di un altro non può
  avere quell'eroe.
- **Decide un moderatore** (`/moderazione`), che scrive la classe che legge. La
  classe confermata diventa quella dell'account (e del browser, alla prossima
  sincronizzazione), compare sul profilo con la data, e arriva una notifica.
- **La schermata** passa ridotta a WebP dal browser (lato lungo 2560 px, senza i
  metadati del file), il server la riconosce dai primi byte (PNG, JPEG, WebP, al
  massimo 3 MB), la tiene in `verification_screenshots` e la **cancella alla
  decisione** o al ritiro. Resta l'impronta SHA-256: la stessa immagine vale solo
  per chi l'ha caricata e solo nel giorno del suo eroe. La vedono solo i moderatori
  e chi l'ha caricata (`/api/verifiche/<id>/schermata`, 404 per gli altri, senza
  cache).
- Codice: regole pure in `src/lib/games/game-account.ts`, letture in
  `src/lib/game-account/server.ts`, scritture in `src/lib/game-account/actions.ts`,
  interfaccia in `src/components/game-account/`.

### Le guide

Una guida qui non è un articolo: è un contenuto che **dichiara in quale patch è
stato verificato**. È la differenza fra un sito che invecchia in silenzio e uno
in cui chi legge sa quanto fidarsi.

Il percorso ha tre passaggi e ruoli diversi per ognuno, di proposito:

1. un **collaboratore** scrive; la guida nasce come bozza e non è pubblica;
2. quando la ritiene finita la manda **in revisione** — è l'autore a dichiarare
   di aver finito, nessun altro può farlo per lui;
3. un **redattore** pubblica e dichiara la patch di verifica.

Il terzo passaggio non è delegabile all'autore. Se chiunque potesse apporre da
solo il contrassegno "verificata per la patch X", quel contrassegno non
significherebbe più niente — ed è l'unica cosa che questa sezione vende.

Quando il dataset supera la patch dichiarata, la guida si segna **da rivedere**
da sola: in elenco, nella scheda del personaggio collegato e in cima alla pagina.
Nessuno deve ricordarsi di farlo a mano, ed è per questo che `verifiedPatch` sta
nello schema dal primo giorno.

Il markdown è un **sottoinsieme** e non usa `dangerouslySetInnerHTML`: il testo
viene trasformato in un albero e gli elementi li scelgono `src/lib/markdown.ts` e
`src/components/markdown.tsx`, da un elenco chiuso. Con la strada opposta ogni
`<script>` scritto da un autore diventerebbe codice eseguito da chi legge. Il
prezzo è che tabelle e immagini non ci sono: sta scritto nella pagina di
scrittura, così nessuno lo scopre dopo aver pubblicato.

### Moderazione

Gli strumenti vanno costruiti **prima** che servano, perché il giorno in cui
servono non c'è tempo di scriverli.

- **Nascondere, non cancellare.** Un contenuto nascosto resta nel database con
  chi ha deciso e quando; esce dal feed e la sua pagina risponde 404 a tutti
  tranne a chi modera, che deve poterlo rileggere per rivedere la decisione.
- **Sospendere è un'altra decisione.** Non cancella quello che la persona ha
  scritto e non le impedisce di leggere: le toglie la possibilità di scrivere.
  La scadenza si valuta in lettura, quindi non serve nessun lavoro periodico per
  spegnere una sospensione a termine.
- **Ogni azione finisce nel registro**, in fondo a `/moderazione`. Un moderatore
  che agisce senza traccia è un problema più grande di quello che sta risolvendo.
- **Le verifiche della classe dell'account** stanno in cima a `/moderazione`:
  schermata, eroe del giorno (e quelli scartati), classe dichiarata e l'ultima
  confermata. Chi modera non può decidere la propria.
- **`/moderazione` e `/admin` rispondono 404**, non 403, a chi non ha il ruolo:
  un "non hai i permessi" è un indizio su dove attaccare.

Eliminare un account **non cancella i post**: passano a un utente segnaposto.
Cancellarli spezzerebbe le discussioni di altre persone, che non hanno chiesto di
perderle.

### Limite di tentativi

`src/lib/rate-limit.ts`, finestra scorrevole, in memoria del processo. Copre
accesso, registrazione, recupero password, pubblicazione, commenti e
segnalazioni.

Il limite è dichiarato: con più istanze del server ognuna conta per conto
proprio, quindi il tetto reale è il tetto per il numero di istanze. Ferma un
attacco banale, non uno distribuito — per quello serve un archivio condiviso, e
il punto da cambiare è solo quel file. Si è preferito questo a nessun limite: un
limite imperfetto ferma la quasi totalità dei tentativi automatici, l'assenza di
limite non ne ferma nessuno.

La finestra è scorrevole e non a intervalli fissi perché con gli intervalli fissi
si consuma tutto il limite in fondo a uno e si ricomincia subito nel successivo,
ottenendo il doppio dei tentativi. C'è un test che lo verifica.

### Il primo amministratore

Il pannello di amministrazione richiede di essere amministratori per entrarci,
quindi il primo non può nascere dal sito:

```bash
npm run promote -- tua@email.it ADMIN
```

L'alternativa — promuovere automaticamente il primo iscritto — regalerebbe il
controllo del sito a chiunque arrivi primo alla pagina di registrazione, se il
database venisse esposto prima del lancio.

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
- **`posts.attachment`** — il risultato di simulazione allegato, con seed, patch
  e **iterazioni**: senza queste il confronto fallirebbe per un parametro
  diverso invece che per disonestà.
- **`follows`** con chiave primaria composta — il doppione lo impedisce il
  database, non una query che qualcuno un giorno dimenticherà.
- **`attachmentChecks.engineVersion`** — quando il motore cambia, le verifiche
  memorizzate scadono da sole.
- **`suspensions.until` che ammette `null`** — `null` è "a tempo indeterminato",
  ed è più leggibile di una data lontanissima. La differenza si legge nella
  colonna, non va dedotta.
- **`passwordResetTokens.tokenHash` e `usedAt`** — impronta invece del gettone,
  e uso singolo imposto dalla colonna. Sono le due cose che non si possono
  aggiungere dopo aver già distribuito gettoni in chiaro.
- **`posts.hidden` / `comments.hidden` invece della cancellazione** — la
  moderazione è reversibile e lascia traccia; `modActions` dice chi ha deciso.

---

## Cosa NON è reale

I valori in `src/lib/games/grand-cross/data.ts` sono **segnaposto**, e dal 27/09/2026
nessuna pagina li mostra: servono solo al vecchio motore, che resta per la
riverifica degli allegati della community e per le guide. Le sue regole (triangolo,
moltiplicatori, pesca) sono diverse da quelle del gioco, che la pipeline ha letto nel
codice del client e che la pagina `/meccaniche` spiega.

---

## Prossimi passi

1. Togliere del tutto il vecchio motore (allegati della community, patch delle
   guide, admin, script del database), o rifarlo sulle regole del gioco
2. Primo modulo deterministico su un gioco HoYo, per validare il contratto sul
   secondo paradigma
3. Descrizione della singola carta e delle passive: il client le contiene ma non
   le lega all'eroe, quindi serve una fonte esterna — vanno marcate come tale
5. Card profilo condivisibile come OG image
6. Incasso vero: `/premium` descrive il piano ma non lo vende, e non c'è nessun
   pulsante che finga di farlo
7. Gruppo *Endgame*, quando ci saranno i dati dei nemici per modalità
