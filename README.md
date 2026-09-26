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
| `npm run eroi:import` | Rigenera roster, testi, card e illustrazioni, poi l'Endgame e gli artefatti |
| `npm run endgame:import` | Rigenera solo le quattro modalità dell'Endgame |
| `npm run artefatti:import` | Rigenera solo le Carte e i Set artefatto |
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
    layout.tsx                selettore gioco + barra laterale a gruppi
    page.tsx                  feed della community
    eroi/                     roster completo, filtri per rarita' e attributo
    eroi/[heroId]/            scheda dell'eroe: testi dal client del gioco
    personaggi/[characterId]  scheda personaggio
    nemici/                   bersagli usati nei calcoli
    classifica/               ordinamento per danno simulato
    strumenti/                simulatore di squadra
    guide/                    elenco, scrittura, revisione, patch verificata
    post/[postId]/            discussione
  u/[username]/               profilo pubblico
  cerca/                      ricerca su personaggi e discussioni
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
src/components/heroes/        sfoglia il roster: filtri e griglia
scripts/                      setup, migrazioni, seed, verifica di fumo,
                              ruoli, importazione roster
```

### Navigazione a gruppi

Selettore del gioco in cima, barra laterale a gruppi a sinistra: **Database**
(Eroi, Uscite, Set artefatto, Carte artefatto, Personaggi, Nemici) · **Endgame** (Scontri finali, Bestie
demoniache, Re Demone, Divinità Suprema) · **Strumenti** (Simulatore,
Classifica) · **Guide** (Guide e rotazioni) · **Community** (Discussioni).

Le voci non sono le stesse per tutti i giochi: *Eroi* compare solo dove il modulo
ha un roster, dichiarato con `needs` in `GAME_GROUPS` e filtrato da
`gameGroups(slug)`. Una voce di menu che porta a una pagina vuota è peggio di una
voce che non c'è.

*Endgame* è entrato il 26/09/2026, quando ha avuto contenuto: le quattro
modalità boss di Grand Cross, dalle tabelle del client. Fino ad allora non c'era
apposta: un gruppo vuoto in navigazione promette qualcosa che non c'è, e chi ci
clicca una volta non ci clicca più. *Guide* è entrato allo stesso modo, quando ha
avuto pagine da mostrare.

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
  Stanno in `public/eroi/`, che è in `.gitignore`
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
- **illustrazioni e icone abilità** stanno in `public/eroi/<gioco>/splash/` e
  `/abilita/`, anch'esse fuori dal versionamento

Metterle in un repository su GitHub sarebbe ridistribuirle. `npm run eroi:import`
le rimette a posto da una copia locale della pipeline di estrazione, indicata
dalla variabile `GC_ASSETS`. Chi clona senza quella copia vede il roster con i
riquadri vuoti: nomi, filtri e conteggi funzionano lo stesso.

Il roster è separato da **Personaggi** perché rispondono a due domande diverse.
Personaggi elenca le unità che il motore sa simulare, e sono poche perché ognuna
va calibrata a mano. Eroi le elenca tutte, perché per riconoscere un'unità e
sapere che attributo ha non serve aver calibrato niente. Le due sezioni
convergeranno man mano che il dataset cresce.

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
   alla priorità automatica. È anche ciò che rende sensato il gruppo *Strumenti*
2. Primo modulo deterministico su un gioco HoYo, per validare il contratto sul
   secondo paradigma
3. Descrizione della singola carta e delle passive: il client le contiene ma non
   le lega all'eroe, quindi serve una fonte esterna — vanno marcate come tale
4. Statistiche reali al posto dei segnaposto in `data.ts`
5. Card profilo condivisibile come OG image
6. Incasso vero: `/premium` descrive il piano ma non lo vende, e non c'è nessun
   pulsante che finga di farlo
7. Gruppo *Endgame*, quando ci saranno i dati dei nemici per modalità
