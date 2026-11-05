# Heiki — come si lavora in questo progetto

Leggi questo file per intero all'inizio di ogni sessione: vale più delle abitudini generali.

Nasce da una revisione del 24/10/2026. Il lavoro del 17-22/10 era dichiarato «verificato», con 780 test e 71 controlli
sul database, eppure dal sito non si potevano salvare né i voti agli eroi né le tier list: il controllo della
sospensione rispondeva «account sospeso» a tutti. In un file di dati, poi, c'era uno stendardo di gioco inventato. Le
regole qui sotto servono a non ripeterlo. Su questo repo lavora anche Claude Code, sugli stessi file e con le stesse
regole.

---

## 1. Autonomia e permessi

- Leggi, crea, modifica e prova i file del progetto senza chiedere il permesso, e verifica sempre il lavoro (§6).
- **Mai committare né pushare** senza una richiesta esplicita dell'utente. Mai il force-push.
- Chiedi conferma **solo** per le operazioni distruttive o irreversibili:
  - `docker compose down -v` o `npm run db:reset`, che cancellano il database;
  - cancellare dati, asset o storia di git;
  - sovrascrivere file della pipeline.
- Lingua italiana per codice, commenti, commit, documentazione e risposte.
- Con l'utente:
  - quando serve una sua scelta, mostragli un esempio concreto del prima e del dopo, senza gergo tecnico;
  - se risponde «vedi risposta precedente» o «decidi tu», scegli l'opzione consigliata, dillo in una riga e vai
    avanti.

## 2. Prima di toccare qualcosa

1. Lancia `git status` e `git log --oneline -15`: cosa c'è, cosa non è committato, chi ha lavorato per ultimo.
2. Leggi le sezioni in cima a `C:\Users\franc\Desktop\All\Ougi\Video\GC\_7dsgc\CONTESTO_PER_NUOVA_CHAT.md`. Lì ci sono
   lo stato del lavoro, le decisioni dell'utente, i lavori aperti e le trappole. Il file è lungo: le sezioni sono in
   ordine dalla più recente, quindi leggi fino alla prima che conosci già.
3. Per capire il codice usa prima `graphify query "<domanda>"` (c'è `graphify-out/`), poi apri i file.
4. Cerca un modulo che fa già qualcosa di simile e copialo: non inventare un modo nuovo. Esempi già rivisti:
   - azioni del server: `src/lib/strategies/actions.ts`, `src/lib/ratings/actions.ts`, `src/lib/tier-list/actions.ts`;
   - validazione: `src/lib/ratings/validation.ts`, `src/lib/tier-list/validation.ts`;
   - dati nel browser: `src/components/game-account/use-hero-box.ts`.

## 3. Regole ferme

- **Mai inventare un dato di gioco.** Nomi, numeri, date, id, stendardi e testi vengono da tre sole fonti:
  - le tabelle del client, lette dalla pipeline;
  - il foglio delle uscite della community;
  - l'utente.

  Se un dato manca, scrivi che manca e chiedi: non scrivere mai un valore plausibile. Il 22/10, nel file delle date,
  è finito lo stendardo `bg_banner_261022_gacha_107`, che nel client non esiste.
- I file `src/lib/games/**/*.generated.ts` **non si toccano a mano**: li scrive `npm run eroi:import`, o uno dei suoi
  import parziali, a partire dai JSON della pipeline.
- In `data/grand-cross/manuali/` ci sono scelte fatte a mano dall'utente. Tra questi, `uscite_storiche.json` è
  **congelato**: le date degli eroi nuovi le mette `date_uscita.py` (§5).
- **Pipeline** (`C:\Users\franc\Desktop\All\Ougi\Video\GC\_7dsgc\`, fuori dal repo e non versionata):
  - si scrive **solo** dentro `_7dsgc\`;
  - la cartella `GC\` intorno contiene il montaggio video dell'utente e **non si tocca mai**;
  - gli script stanno in `_7dsgc\script\` e si lanciano da `_7dsgc`, per esempio `python script\catena.py`.
- Le immagini del gioco non vanno nel repo (`public/eroi/` è ignorata: sono di Netmarble). Le voci (audio) non vanno
  sul sito.
- «Verificato» vuol dire provato come lo userebbe una persona (§6). Quello che non hai provato lo scrivi: «non
  provato nel browser».

## 4. Il codice: le trappole che sono già costate care

### Azioni del server

- In un modulo `"use server"` **ogni funzione async esportata è un endpoint pubblico**: si può chiamare dal browser
  con qualunque argomento, anche se nessuna pagina la usa.
  - Lì dentro vanno solo le azioni. Aiuti, letture interne e schemi stanno in moduli normali.
  - Un'azione che non serve si cancella, non si lascia esportata.
- Ogni azione che scrive fa questi controlli, in quest'ordine:
  1. il database è configurato e raggiungibile (`isDatabaseConfigured()`, `databaseReachable()`);
  2. l'utente viene dalla sessione (`currentViewer()`, guest escluso), **mai** da un argomento;
  3. l'utente non è sospeso;
  4. il limite di richieste (`rateLimit` in `src/lib/rate-limit.ts`);
  5. la validazione zod di **tutto** l'input, con tetti su lunghezze, quantità, righe e numero di oggetti per utente;
  6. il gioco e gli eroi esistono davvero: `getGameModule(slug)?.roster.heroes`.
- `suspensionFor(id)` restituisce **sempre** un oggetto, quindi `if (suspension)` è sempre vero. Usa
  `requireActive(id, locale)` di `src/lib/moderation/suspension.ts`, oppure controlla `.active`.
- `formData.get()` restituisce `null` per un campo assente. In zod i campi facoltativi vanno con `.nullish()`:
  `.optional()` rifiuta il null, e il voto senza commento falliva così.
- I messaggi d'errore vanno nella lingua di chi scrive (`getLocale()`), mai quelli grezzi di zod.
- Dopo una scrittura basta `revalidatePath` del percorso giusto, senza un `router.refresh()` in più.

### Indirizzi e database

- Un id che arriva dall'indirizzo (`?id=`, `[param]`) si valida come uuid **prima** della query: Postgres rifiuta un
  uuid malformato e la pagina dà errore 500. Attenzione anche a `searchParams`, che può essere un array
  (`?id=a&id=b`).
- Una tabella nuova legata a `users`:
  - decidi `ON DELETE`;
  - controlla `src/lib/auth/account-actions.ts`: l'eliminazione dell'account non deve fallire né lasciare righe
    orfane.
- Le migrazioni si fanno con drizzle-kit: numerate, col journal coerente, applicate con `npm run db:migrate`. Gli
  indici si scelgono sulle query vere.
- `npm run db:smoke` scrive direttamente nel database: **non** prova azioni, sessione, sospensione né validazione.

### Componenti

- Da un componente server a uno client passano solo i dati che il client usa: niente elenchi interi, commenti o id di
  utenti, e nessuna funzione fra le props.
- Nel render di un componente client niente `Date.now()`, date formattate o `localStorage` letto direttamente: danno
  errori di idratazione. `suppressHydrationWarning` nasconde il problema, non lo risolve.
- **Dati nel browser**:
  - le chiavi si scrivono `heiki:<gioco>:<cosa>`;
  - si leggono con lo schema `useSyncExternalStore` di `use-hero-box.ts`, chiamando `moveLegacyStorage()` in cima a
    ogni lettura.

  Per rinominare una chiave la si **sposta una volta e si cancella la vecchia** (`src/lib/legacy-storage.ts`). Mai
  «leggi la nuova, se manca la vecchia»: le cancellazioni non vedono la vecchia, e i dati di un altro utente sono
  ricomparsi proprio così.
- **Due lingue sempre**:
  - si usa `const TESTI = testi({ it: {...}, en: {...} })` da `src/lib/i18n/locale.ts`;
  - la lingua si prende con `getLocale()` nel server e `useLocale()` nel client;
  - vale per ogni testo visibile: aria-label, metadati, messaggi delle azioni, testo dentro le immagini generate;
  - le etichette dei dati nascono `{it, en}`.
- **Accessibilità**:
  - si clicca solo su `<button>`, `<a>` o `<input>` veri, mai su un `div` con `onClick`;
  - le scelte sono radio veri, anche `sr-only` dentro una `label`, raggruppati in `fieldset` con `legend`;
  - le finestre usano `<dialog>` nativo;
  - il fuoco deve vedersi: nelle forme tagliate `.p5-*` il contorno va dentro.
- **Stile Persona**: usa le primitive di `src/components/ui.tsx` (`buttonClass`, `chipClass`, `Card`, `PageHeader`,
  `Notice`, `cx`) e i colori di `globals.css`, senza ricrearle.
- **Temi e colori** (dal 25/10 il predefinito è il tema **Classico**, nero, bianco e grigio; il rosso «Persona» è un
  tema da scegliere come Notte, Giada, Viola, Ambra). Nei componenti si usano solo i gettoni del ruolo, mai colori
  scritti a mano:
  - `brand` è l'**accento** (voce attiva, azione principale, scelta del rango): nel Classico è bianco. Il testo sopra
    l'accento è **`text-on-brand`**, mai `text-white` o `#fff` (nel Classico sarebbe bianco su bianco);
  - `mark` è l'accento **decorativo** (righe sotto le intestazioni, filo dell'intestazione e del piede, ombre sfalsate
    dei pannelli, retini, ombra dei titoli): nei temi colorati coincide con l'accento, nel Classico è grigio;
  - `plate` / `on-plate` è il **blocco neutro** (pulsanti secondari, targhette dei gruppi, campi di ricerca, la lama
    del passaggio sulle voci di menu): nei temi colorati è il bianco carta, nel Classico un grigio;
  - `select` / `on-select` è la **scelta** (chip dei filtri, lingua, livelli, modalità attiva: `chipColors` di
    `ui.tsx`, col filo interno `shadow-[inset_0_0_0_2px_var(--color-ink)]`): nei temi colorati il chip chiaro di
    prima, nel Classico un grigio scuro col filo bianco, perché il bianco pieno resta all'azione principale;
  - `stage` è la **lama** dietro le figure dell'anteprima degli Eroi: nei temi colorati l'accento, nel Classico
    bianca col retino nero (25/10 sera: l'utente vuole il Classico più bianco e nero, coi grigi meno presenti);
  - `rule-strong` è il **bordo dei campi** (testo, scelta, area di testo: `Input`, `Select`, `Textarea` di `ui.tsx`),
    a 3:1 su ogni fondo come chiede la WCAG 1.4.11; `rule` e `rule-2` restano per i fili decorativi;
  - un tema nuovo è un blocco `:root[data-theme="…"]` in `globals.css` con tutti i gettoni del ruolo, più la riga in
    `src/lib/theme/themes.ts`; il test `src/lib/theme/__tests__/themes.test.ts` controlla i contrasti (diciannove
    gettoni dal 25/10).
- **Regole di design** (revisione del 24/10, approvate dall'utente):
  - l'**accento pieno** (rosso nel tema Persona, bianco nel Classico) solo per dove sei (voce attiva, scheda scelta) e
    per **una** azione principale per vista; le altre azioni `outline` o `ghost`; i filtri scelti sono il chip chiaro
    di `chipClass`, uguale ovunque;
  - **un solo menu**: le sezioni stanno in `GROUPS` di `src/lib/games/catalog.ts`, e barra laterale, menu del gioco,
    menu del telefono e piè di pagina le leggono da lì, nello stesso ordine. Una pagina nuova si aggiunge lì, col
    nome che avrà ovunque (titolo, briciole, collegamenti). Il collegamento si scrive con `item.href` (l'indirizzo
    intero), non con `/${gioco}${item.path}`: le voci del gruppo «Il tuo profilo» portano fuori dal gioco;
  - il **profilo è del sito** (dal 25/10): `/profilo` (panoramica, anche per chi non è entrato), `/profilo/<gioco>`
    (account di gioco: nickname, Codice amico, server, classe, verifica), `/profilo/<gioco>/eroi` (il box). Le vecchie
    `/<gioco>/account` reindirizzano. Una pagina personale nuova di un gioco va lì, non nel gioco;
  - l'**anteprima degli Eroi** (`hero-peek.tsx`, dal 25/10) è una scheda per decidere il clic: dati in fasce fisse
    (classe di combattimento con la posizione, voto della community, due righe di fatti, statistiche, versioni, box,
    uscita) da `src/lib/games/hero-peek-facts.ts`, calcolati sul server una volta per pagina. Ogni fascia ha
    un'altezza che non dipende dall'eroe, così lo spazio della figura (e la scala di Shinra) è lo stesso per tutti:
    una fascia nuova deve avere il suo spazio anche vuota, e le soglie in fondo al blocco `.peek` di `globals.css`
    vanno rimisurate. Nella griglia: attesa di 90 ms al passaggio del mouse, un solo passo del Tab con le frecce fra
    le card, l'eroe aperto scritto nell'indirizzo (`?eroe=`) per tornare con Indietro;
  - il percorso in cima (`Breadcrumb`) si vede solo dal terzo livello; il gioco lo dice l'intestazione;
  - nel testo visibile niente trattini lunghi (— e –: si riscrive con due punti, virgola o due frasi; il «—» resta solo
    come cella vuota di una tabella), niente frecce di testo come icone (→: `IconArrowRight`), niente etichette
    piccole sopra i titoli, al massimo un «·» per riga, niente tono da pubblicità;
  - testo almeno 4,5:1 sul suo sfondo. I colori degli attributi su fondo scuro si schiariscono:
    `color-mix(in oklab, <colore> 60%, var(--color-ink))`;
  - sul telefono le cose da toccare sono alte almeno 44 px (`tapArea` in `ui.tsx` allarga l'area senza ingrandire);
  - le illustrazioni degli eroi si inquadrano sul riquadro della sagoma (`HeroAssets.box`), intere: mai ingrandite fino
    a tagliarle.
- **Tailwind 4**:
  - le classi si scrivono per intero (mai `` `bg-${x}` ``);
  - una classe aggiunta a una primitiva, per esempio `cx(eyebrow, "text-xs")`, non vince con certezza su quella
    della primitiva.
- **Misure** (dal 24/10 l'interfaccia cresce con lo schermo: base 16 px fino a 1440, 20 px a 2560):
  - nel CSS e nelle classi scrivi in px (`text-[12px]`, `top-[135px]`): la build li converte in rem
    (`postcss.config.mjs`) e crescono da soli;
  - nel JavaScript no: una misura in `style={{ ... }}`, la `size` di un'icona o una larghezza usata nei conti va
    scritta con `rem(px)` di `src/lib/rem.ts`, e un conto che deve combaciare col CSS si moltiplica per
    `remPx() / 16` (esempi: `term-popover-client.tsx`, `hero-sticky-columns.tsx`, `theme-switch.tsx`);
  - un `<img width={48}>` senza una classe di larghezza resta 48 px: aggiungi `style={{ width: rem(48) }}`.
- **TypeScript** ha `noUncheckedIndexedAccess`: `arr[0]` è `T | undefined`.
- **Telefono**: a 390 px niente sforamento orizzontale. Nelle griglie servono `grid-cols-1` e `min-w-0`.

### File e strumenti

- Molti file sono CRLF. Modificali con lo strumento di modifica; mai `sed -i` (riscrive tutto in LF), né riscritture
  da script che non conservano gli a capo.
- Il server di sviluppo (Turbopack) può servire codice vecchio dopo un export nuovo in un modulo condiviso o dopo un
  import di dati («X is not a function», dati vecchi). Si riavvia fermandolo per PID. Mai due `npm run dev` insieme.
- Lancia vitest da solo, non insieme a script pesanti: sotto carico qualche test va in timeout.
- Dopo ogni modifica al codice: `graphify update .`

## 5. Dati di gioco e pipeline

### Dopo una patch del gioco: quando il lavoro è finito

Estrarre gli asset è il primo passo, non il lavoro. Il lavoro è finito quando **gli eroi nuovi si vedono sul sito e
l'hai controllato**. Se l'utente ti chiede solo di estrarre, fermati pure lì, ma digli cosa manca ancora.

Il 29/10 è andata così: patch estratta bene, catena lanciata, poi l'import si è spento a metà senza errori. La
pipeline era avanti e il sito indietro, i quattro eroi nuovi restavano fuori, e all'utente non è arrivato niente che
lo dicesse. Per non ripeterlo, segui questi passi in ordine:

1. L'utente apre il gioco e scarica la patch. Se il gioco non è aggiornato, la pipeline legge la patch vecchia.
2. `python script\aggiorna_gc.py`: dice cosa è arrivato.
3. Robocopy della cartella datata nell'albero, **da PowerShell** (in Git Bash `/E` diventa un percorso e il comando
   fallisce). Il comando esatto lo stampa `aggiorna_gc.py`. Robocopy esce con 1 o 3 quando ha copiato: non è un errore.
4. `_novita.txt` va in `7dsgc_estratti\_storico\novita_<data>.txt`, poi la cartella datata si cancella. Quell'elenco
   non è un promemoria: `date_uscita.py` lo legge per datare gli eroi.
5. La catena, **in background e con l'output su un file**, perché dura una ventina di minuti:
   `python -X utf8 script\catena.py > catena_log\giro_<data>.txt 2>&1`
6. Leggi `catena_log\ultimo_giro.txt`:
   - `COMPLETA`: la catena è arrivata in fondo, import compreso, e la riga dice quali eroi sono entrati e usciti;
   - `FERMATA`: un controllo non è tornato. Leggi il registro indicato, correggi la causa e riparti con `--da N`;
   - `IN CORSO` con nessun processo acceso: si è interrotta. Riparti dal passo dopo l'ultimo registro scritto.
7. Leggi i registri che dicono se il risultato è giusto, anche quando la catena è finita bene:

   | Registro | Cosa guardare |
   |---|---|
   | `*_date_uscita.txt` | la riga `senza data` deve essere vuota, o contenere solo eroi davvero non usciti |
   | `*_decifra_bundle.txt` | `NESSUNA passphrase lo apre` è un problema: non andare avanti senza capirlo |
   | `*_cambiamenti.txt` | gli eroi nuovi devono essere quelli che ti aspetti |

8. Guarda il `git diff` dei generati e spiega ogni cambiamento: le rinumerazioni sono normali, un valore cambiato va
   giustificato. **Un eroe che esce dal roster è sempre un errore.**
9. Verifica come in §6, aprendo la scheda di ogni eroe nuovo e le pagine Eroi, Uscite e Cambiamenti.
10. Scrivi la sezione nel contesto (§7) e di' all'utente quali eroi sono entrati, con che data e da quale fonte.

### Le date degli eroi nuovi

Il foglio della community arriva spesso giorni dopo la patch, e a volte non arriva: i quattro eroi del 29/10 non ci
sono, e la riga del 22/10 dice solo «Collab?». `date_uscita.py` prova queste fonti in ordine, e la prima vince:

1. la riga del foglio;
2. lo stendardo di debutto del client (`new_hero_notice_banner` diverso da 0, data nel nome dell'immagine);
3. la patch che ha portato l'illustrazione dell'eroe, dagli elenchi in `_storico` (dedotta, e il sito lo dice).

Se nessuna delle tre risponde, l'eroe resta fuori e lo dici all'utente. Non si data a mano.

`date_uscita.py` si ferma da solo se un eroe che aveva una data la perde, o se la data della patch non torna col
primo stendardo dell'eroe. È una prova che non torna: va capita, non aggirata.

**`eroi\foglio_uscite.csv` è una copia del foglio, non un file di lavoro: mai scriverci a mano.** Lo stesso vale per
`calendario_uscite.json`, `uscite_jpkr.json` e ogni altro file in `eroi\`: li riscrive la catena. Il 22/10 Freyja è
entrata nel sito con una riga «Pick Up Draw» che nel foglio di oggi non c'è, mentre il client dice Passo avanti. Alla
prima patch quella riga è sparita, Freyja ha perso la data e l'import l'avrebbe tolta dal sito.

### Cambiare uno script della pipeline

La pipeline non è versionata: quello che cambi non lascia traccia, se non la lasci tu.

1. Prima copia l'originale in `archivio\script_superati\<nome>.prima-di-<cosa>.py`.
2. Scrivi nel commento il perché, con l'esempio che l'ha fatto scoprire.
3. Rilancia dal passo che usa la modifica, non solo lo script. Il 29/10 `decifra_bundle.py` è stato corretto, e la
   correzione era giusta, ma dopo che la patch era già stata archiviata: l'archivio è rimasto con una tabella sbagliata.
4. Se `archivio_patch.py` si ferma perché l'archivio di quel giorno c'è già con un contenuto diverso, spostalo in
   `archivio\` e rilancia. Non usare `--data` con un giorno finto.
5. Scrivilo nel contesto (§7).

### Le patch cambiano anche quello che non guardi

Una catena finita bene non vuol dire dati giusti. Sulla patch del 29/10 sono uscite tre cose che nessun test vedeva:

- **Righe rinumerate.** `DB_config_game` ha spostato 57 righe senza cambiare un valore, e uno script che leggeva la
  riga 849 ha perso lo sblocco della Divinità Suprema. Negli script una riga o un testo si prendono **per nome**, mai
  per numero. Quando vedi un campo diventare vuoto o `null` nel diff, è questo il primo sospetto.
- **Etichette nuove nei testi.** Il client ha iniziato a scrivere `{buff_t}40162{/buff_t}` invece di
  `{buff_data_turn}...`. Il modo per accorgersene: cerca `{` nei testi degli eroi nuovi. Le etichette si aggiungono in
  `FORME_CORTE` di `modelli_client.py`, e solo se la stringa esiste davvero nel `global-metadata.dat` del client.
- **Frasi false ma ben scritte.** L'anteprima di Joker diceva «Unica spenta negli Scontri finali»: si spegne il
  Talento. Nessun errore, nessun test rosso. Per ogni eroe nuovo **leggi le frasi in pagina** e confrontale con la
  sua scheda: una schermata che «sembra a posto» non basta.

### Altre regole

- Se un passo della catena si ferma, è una prova che non torna: leggi il motivo e non aggirarlo.
- Se le date cambiano dopo che la catena ha girato, rilancia `python script\cambiamenti.py --rifai` e
  `npm run cambiamenti:import`. Altrimenti la pagina Cambiamenti non conta l'eroe nuovo. Nella catena il `--rifai` c'è
  già.
- Un dato si controlla sul client (`_7dsgc\tabelle\DB_*.json`, `_7dsgc\tabelle\testi_en.json` e `testi_it.json`),
  non su un sito di terzi.
- Se trovi un dato che non torna fra client e foglio, vince il client. Se non sai quale sia giusto, chiedi all'utente.

## 6. Come si verifica, prima di dire «fatto»

1. `npm run typecheck`, `npm run lint`, `npm run test` (quest'ultimo da solo). Un test nuovo prova il codice vero:
   importa la funzione vera e usa valori reali, come un FormData con null. Mai una copia della funzione scritta nel
   test.
2. **Prova nel browser**. Se la porta 3000 è occupata, usa un server tuo:
   `$env:NEXT_DIST_DIR=".next-verifica"; npx next dev --turbopack -p 3100`. Alla fine:
   - spegnilo per PID;
   - cancella `.next-verifica`;
   - togli da `tsconfig.json` la riga che Next ci aggiunge.

   Cosa provare:
   - le pagine toccate, a 1400 e a 390 px, in italiano e in inglese: 0 errori di console, 0 sforamenti, 0 immagini
     rotte; e a 2560 px, lo schermo dell'utente (2560x1440 al 100%), dove tutto è più grande del 25%;
   - ogni azione nuova o cambiata, per la strada vera:
     1. iscrivi un utente di prova da `/registrati` (es. `prova2410`, email `@example.test`);
     2. fai l'azione dall'interfaccia;
     3. controlla nel database con
        `docker exec gachazone-db psql -U gachazone -d gachazone -c "select ..."`;
     4. togli l'utente con `delete from users where username='...'`;
   - i casi sbagliati: campi vuoti, id malformato, utente non entrato.
3. **Riferisci con onestà**: cosa hai provato e come, cosa no, cosa è dedotto. Nessun numero che non hai misurato. Se
   un lavoro si è interrotto o è rimasto a metà, è la prima cosa da dire: l'utente deve saperlo senza andare a cercarlo.

## 7. Documentazione e passaggio di consegne

- Nel README entrano solo cose vere e numeri misurati. Per esempio, le tabelle del client non sono «SQLite»: sono file
  binari dentro bundle Unity cifrati con AES.
- **A fine lavoro** scrivi una sezione datata **in cima** a `CONTESTO_PER_NUOVA_CHAT.md`, nello stile delle altre.
  Deve dire:
  - la richiesta dell'utente;
  - i commit, o «non committato»;
  - i file toccati;
  - le scelte fatte e il perché;
  - cosa è verificato e come;
  - cosa resta aperto.

  Non riscrivere le sezioni vecchie e conserva gli a capo CRLF del file. Chi viene dopo, Claude Code compreso, riparte
  da lì.

## 8. Mappa veloce

- **Stack**: Next.js 15 App Router, React 19, Tailwind 4, Drizzle su PostgreSQL 17 (`docker compose up -d`, container
  `gachazone-db`), Auth.js, Vitest. Si lavora direttamente su `main`.
- **Codice**:
  - `src/lib/games/`: i moduli dei giochi (Grand Cross in `grand-cross/`, coi dati `*.generated.ts`);
  - `src/lib/<funzione>/`: server, azioni, tipi e validazione;
  - `src/components/<funzione>/`: i componenti;
  - `src/app/[game]/...`: le pagine dei giochi;
  - `src/app/u/[username]`: i profili.
- **Comandi**: `typecheck`, `lint`, `test`, `db:migrate`, `db:smoke`, `eroi:import`,
  `promote -- <email> <RUOLO>`.
