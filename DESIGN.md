---
name: Heiki
description: Sito di dati per giochi gacha, nero e fermo; il colore lo portano il gioco e le sue figure.
colors:
  brand: "#ffffff"
  on-brand: "#000000"
  brand-deep: "#ffffff"
  brand-soft: "#000000"
  paper: "#000000"
  paper-2: "#000000"
  paper-3: "#161616"
  ink: "#ffffff"
  ink-2: "#cfcfcf"
  ink-3: "#8f8f8f"
  rule: "#2a2a2a"
  rule-2: "#1e1e1e"
  rule-strong: "#6c6c6c"
  mark: "#2a2a2a"
  plate: "#ffffff"
  on-plate: "#000000"
  select: "#ffffff"
  on-select: "#000000"
  piastra-fondo: "#141414"
  piastra: "#1f1f1f"
  piastra-forte: "#2b2b2b"
  hot: "#ff4f9a"
  hot-soft: "#3a1224"
  gold: "#ffd21f"
  gold-soft: "#332a06"
  up: "#5fd38a"
  down: "#ff7a9c"
typography:
  display:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(34px, 5vw, 58px)"
    fontWeight: 900
    lineHeight: 1.02
    letterSpacing: "-0.02em"
    fontVariation: "'wdth' 80"
  hero-name:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(38px, 6vw, 76px)"
    fontWeight: 900
    lineHeight: 0.92
    letterSpacing: "-0.01em"
    fontVariation: "'wdth' 70"
  headline:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: 1.02
    letterSpacing: "-0.022em"
  title:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "15px"
    fontWeight: 600
  command:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    letterSpacing: "0"
  body:
    fontFamily: "Atkinson Hyperlegible Next, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Archivo, ui-sans-serif, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    letterSpacing: "0"
rounded:
  card: "0px"
  art: "5.5%"
spacing:
  opzioni: "6px"
  griglia-x: "10px"
  griglia-y: "16px"
  testata: "20px"
  sezione: "24px"
  guscio: "24px"
  colonne: "36px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
    typography: "{typography.command}"
    rounded: "{rounded.card}"
    height: "38px"
    padding: "0 22px"
  button-primary-hover:
    backgroundColor: "#bdbdbd"
    textColor: "{colors.on-brand}"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.command}"
    rounded: "{rounded.card}"
    height: "38px"
    padding: "0 22px"
  button-secondary-hover:
    backgroundColor: "{colors.piastra}"
    textColor: "{colors.ink}"
  chip:
    backgroundColor: "{colors.piastra-fondo}"
    textColor: "{colors.ink}"
    typography: "{typography.command}"
    rounded: "{rounded.card}"
    height: "32px"
    padding: "0 10px"
  chip-hover:
    backgroundColor: "{colors.piastra-forte}"
    textColor: "{colors.ink}"
  chip-selected:
    backgroundColor: "{colors.select}"
    textColor: "{colors.on-select}"
  menu-item-hover:
    backgroundColor: "{colors.piastra}"
    textColor: "{colors.ink}"
  menu-item-current:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.on-brand}"
  input:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.card}"
    height: "40px"
    padding: "0 12px"
---

# Design System: Heiki

Questo file descrive il sito com'è dal 06/11/2026. I gettoni qui sopra sono quelli del tema Classico. La fonte resta il codice: `src/app/globals.css` per i colori, `src/app/pulito.css` per lo stile, `src/components/ui.tsx` per le primitive. Le regole di questo file sono decisioni dell'utente e non vanno ridiscusse.

## Overview

**Creative North Star: "La pagina nera e ferma"**

Chi arriva cerca un dato: vede filtri ed eroi senza cornici, sceglie con un clic, apre la scheda. La pagina è nera, ferma e professionale, ma non è documentazione: l'eroe resta grande. Densità alta, griglia a tutta larghezza, nessun elemento che si muove da solo.

Il sito rifiuta due cose: la pagina dove ogni etichetta urla allo stesso volume, e la pagina spenta. Per questo tutto parla piano, in tondo e a peso medio, e una sola voce per pagina parla forte. Il colore non appartiene all'interfaccia: arriva da figure, card, icone e dai colori che il gioco mette nei suoi testi.

**Key Characteristics:**

- Nero pieno, stacchi con filetti da 1 px, nessun riquadro.
- Interfaccia senza tinta.
- Tre stati: fermo niente, passaggio la piastra, scelto o «dove sei» il blocco bianco.
- Una sola voce forte per pagina: Archivo 900 stretto e maiuscolo.
- Temi colorati che cambiano solo palette e accento, mai le forme.

## Colors

Neutri senza tinta sul nero. I gettoni dicono il ruolo e non il colore: un componente non scrive mai un esadecimale, scrive `var(--color-…)` o la utility Tailwind (`bg-piastra`, `text-ink-2`, `border-rule`).

### Primary

- **Accento** (`brand`, `on-brand`): il pulsante principale e la voce di menu dove sei. Nel Classico è bianco, negli altri temi è il colore del tema. `brand-deep` è la sua versione per il testo piccolo, `brand-soft` il fondo tinto di una riga scelta.
- **Blocco bianco** (`select`, `on-select`; `plate`, `on-plate`): la scelta e il «dove sei». Resta chiaro in tutti i temi.

### Neutral

- **Fondo** (`paper`, `paper-2`, `paper-3`): la pagina e i campi. Nel Classico `paper` e `paper-2` sono lo stesso nero.
- **Testo** (`ink`, `ink-2`, `ink-3`): dal più forte. `ink-3` è il terzo livello: conteggi, epiteti, segnaposto.
- **Filetti** (`rule`, `rule-2`, `mark`): gli stacchi. Dal 06/11 `mark` è un filetto come `rule`, non più un colore decorativo.
- **Bordo dei campi** (`rule-strong`): 3:1 sul fondo, perché un campo si riconosce dal bordo.
- **Piastra** (`piastra-fondo`, `piastra`, `piastra-forte`): tre gradini ricavati dal tema con `color-mix` fra `ink` e `paper` (8%, 12%, 17%). Fondo dei comandi a riposo, passaggio, scelta su un posto che ha un'immagine sopra.

### Tertiary

Significati, non accenti, e per questo fuori dai temi: `hot` e `hot-soft` (errore, avviso), `gold` e `gold-soft` (premium), `up` e `down` (quanto sale o scende un numero nel calcolatore).

### Temi

Sei temi: `classico` (il predefinito, in `@theme`), `persona`, `notte`, `giada`, `viola`, `ambra`, ognuno in un blocco `:root[data-theme="…"]`. Tutti scuri, perché i colori del gioco sono nati per il nero. Ogni blocco ridefinisce tutti i gettoni del ruolo; `src/lib/theme/__tests__/themes.test.ts` controlla soglie di contrasto e completezza. Un tema nuovo aggiunge solo un blocco di colori.

L'accento del profilo (`--accent`, `--accent-fg`, `Tag tone="accent"`) esiste solo nelle pagine del profilo.

### Named Rules

**The Senza Tinta Rule.** L'interfaccia non ha tinta. Il colore lo portano figure, card, icone e i colori del gioco nei testi (`src/components/heroes/game-color.ts`). Se un elemento è colorato e non è un dato del gioco o un significato, è sbagliato.

**The Temi Rule.** Un tema cambia palette e accento, mai le forme. Nessuna regola di forma può dipendere da `data-theme`.

## Typography

**Display Font:** Archivo, con asse di larghezza (`--font-display`)
**Body Font:** Atkinson Hyperlegible Next (`--font-body`)
**Label/Mono Font:** nessun terzo carattere: `--font-mono` è Archivo con cifre tabulari (`numeric`)

**Character:** Archivo in tondo a peso medio per comandi, menu e sottotitoli; Atkinson per il testo lungo. Il peso torna a voler dire qualcosa perché quasi niente è pesante.

### Hierarchy

- **Display:** il titolo della pagina, un solo `h1` con la classe `display` (`PageHeader` lo fa da solo). Nelle teste Endgame arriva a `clamp(38px, 6.4vw, 76px)`.
- **Nome dell'eroe** (`.stage-name`): fa da titolo nella scheda eroe. Stessa voce, ancora più stretto; la misura si adatta alla parola più lunga.
- **Headline:** i titoli di sezione, `SectionHead`. Un `h2` con `display` esce in tondo a 600: è voluto.
- **Title:** i titoli della barra laterale.
- **Command:** comandi e filtri a 14 px peso 500; voci di menu a 13,5 px; nome sotto la card a 13 px.
- **Body:** paragrafi su fondo nero, descrizioni a `max-w-[56ch]`, 15 px in `ink-2` sotto il titolo.
- **Label** (`eyebrow`, il nome è storico): etichetta strutturale di un campo, di una colonna, di un gruppo di filtri. Colore `ink-3`, tranne `.filtri-etichetta` che è `ink` a 14 px.

### Named Rules

**The Una Voce Rule.** Una sola voce forte per pagina: il titolo in Archivo 900, stretto e maiuscolo, senza ombra. Tutto il resto parla piano, e per questo lui si sente. L'unica altra scritta maiuscola è il marchio nell'intestazione, che è un nome.

**The Classi Annullate Rule.** `pulito.css` sta fuori dai livelli e batte le utility. `uppercase` non mette più il maiuscolo; `font-black`, `font-extrabold` e `font-bold` danno 600; `font-semibold` dà 500; `font-display` riporta la larghezza a 100. Scriverle non alza la voce: il 900 stretto vive solo in `h1.p5-title` e in `.stage-name`.

## Layout

Il guscio del gioco è `max-w-shell` (1560 px) con `px-6`: barra laterale da 210 px più contenuto, distanti `gap-9`. Sotto `lg` (1024 px) la barra sparisce e subentrano la barra in basso e il menu `#menu-sezioni`. Le pagine di sola lettura (legale, ricerca, impostazioni) non usano il guscio largo di proposito.

**Le misure crescono con lo schermo.** La base è 16 px fino a 1440 di larghezza e sale a 20 px a 2560. Nel CSS si scrive in px e postcss-pxtorem li converte, tranne i valori sotto i 3 px, che restano fili sottili. Nel JavaScript (stili in linea, icone) le misure passano da `rem()` di `src/lib/rem.ts`. Si prova sempre anche a 1920 e 2560.

**Soglie:** 640 px (telefono), 1024 px (computer). I passaggi vanno sotto `@media (hover: hover)`: sul telefono resterebbero accesi dopo il tocco.

### Pagina nuova

1. Voce in `src/lib/games/catalog.ts`; in `pulito.css` una regola `.p5-menu-item[href$="/percorso"]` con `--icona-voce`, un'icona del gioco in `public/eroi/grand-cross/icone/menu/voci/`.
2. `PageHeader` con il titolo e una o due righe di descrizione. Niente sopra il titolo.
3. Se c'è un elenco: barra con ricerca, conteggio e ordine, poi filtri, poi griglia a tutta larghezza.
4. Le sezioni si staccano con `SectionHead` o con il filetto di `Card`. Il metodo va in `HowItWorks`, chiuso.
5. Un solo `Button variant="primary"` per vista, se serve.

### Named Rules

**The Filtri Aperti Rule.** Sul computer i filtri sono sempre aperti, in una tabella compatta con le etichette in colonna e le opzioni su fondo proprio. Sul telefono stanno dietro «Filtri» (`.barra-filtri`), perché aperti lascerebbero zero card nel primo schermo.

## Elevation & Depth

Nessuna profondità: tutto è piatto sul nero. Lo stacco è un filetto, il rilievo è un gradino di piastra. L'unica luce è morbida, alle spalle delle figure, e non disegna un contorno: `.stage-figure::before` nella scheda, `LUCE` in `endgame-stage.tsx`. In fondo la figura sfuma nel nero (`.stage::after`), perché sul nero un taglio netto si leggerebbe come un errore.

`box-shadow` si usa solo come strumento piatto, mai come ombra: filetto interno (`inset 0 0 0 1px var(--color-rule)`), riga della scheda attiva, piastra della card che sborda senza spostare niente.

### Named Rules

**The Niente Ombre Rule.** Nessuna ombra sfalsata, nessuna ombra sfocata sui comandi o sui testi. Se una `box-shadow` ha uno scostamento laterale o una sfocatura, non appartiene a questo sito.

## Shapes

Spigoli vivi ovunque (`--radius-card: 0`), senza tagli obliqui, lame o retini. Le classi `p5-cut`, `p5-cut-sm` e `p5-corner` restano nel markup, ma `pulito.css` ne annulla il ritaglio: `p5-corner` e `section.rounded-card` diventano un filetto in cima, senza scatola attorno. Il primo della colonna perde anche quello.

L'unica curva è quella delle card del gioco (`.hero-card-art img`): segue la cornice del file, altrimenti sulla piastra gli angoli sarebbero neri. La piastra attorno resta ad angoli vivi.

### Named Rules

**The Niente Fili Bianchi Rule.** Niente fili bianchi attorno alle cose (06/11: «il bordo bianco non mi piace per niente»). Quello che era acceso col bordo ha il filetto grigio: `.border-brand` diventa `ink-3`. Il filo sotto la scheda attiva sta sulla linea, non attorno, ed è ammesso.

## Components

### I tre stati

La regola che tiene insieme tutto, valida per ogni cosa che si può toccare:

| Stato | Comandi e menu | Card | Posti con immagine |
|---|---|---|---|
| Fermo | niente, o `piastra-fondo` per le scelte | niente | `piastra-fondo` |
| Passaggio | `piastra` | piastra nel colore dell'attributo | `piastra` |
| Scelto o «dove sei» | blocco bianco (`select`, voce di menu `brand`) | nessuno | `piastra-forte` |

Il blocco bianco non si usa dove sopra c'è un'immagine: stelle e pietre non si leggerebbero. Per questo `.rank-chip` e `party-slot.tsx` hanno il grigio.

Tempi: colori `120ms ease-out`, movimenti `160ms cubic-bezier(0.16, 1, 0.3, 1)`. Ogni movimento ha il suo ramo `prefers-reduced-motion`. Niente loop animati: l'unico movimento della scheda è il momento della scelta (`stage-figure-in`, `stage-plate-in`).

Fuoco, solo da tastiera: filetto grigio `ink-3` su card e barra laterale; sugli altri comandi il contorno di base di `globals.css`.

### Buttons

- **Shape:** rettangolo vivo, `Button` o `buttonClass(variant, size)`. Altezza 38 px (`md`) o 32 px (`sm`).
- **Primary:** l'unico blocco bianco a riposo, uno per vista, mai nell'intestazione. Al passaggio si scurisce di un passo.
- **Outline:** trasparente con filetto `rule`; al passaggio `piastra`.
- **Ghost:** trasparente, testo `ink-2`.
- **Variabili:** i colori passano da `--btn-bg`, `--btn-fg`, `--btn-hi`, `--btn-hi-fg`. Un comando con una forma sua usa `buttonColors(variant)`.

### Chips

- **Style:** `Chip` (`filter-chips.tsx`) o `chipClass(active)` per i collegamenti. Fondo `piastra-fondo` anche a riposo, perché si leggano come comandi e non come una riga di parole. 32 px, 34 dentro `.filtri`, 44 sul telefono.
- **State:** al passaggio `piastra-forte`, scelto il blocco bianco. Dentro `.filtri` il peso resta 500 in ogni stato: col grassetto la parola si allargava e spostava le vicine.
- **Icone:** a riposo grigie, a colori al passaggio o da scelte; gli attributi restano sempre a colori (`.filtri-colore`), perché lì il colore è un dato.
- **Conteggi:** col mouse il numero esce al passaggio e spinge i successivi con un `transform` (`spingiSuccessivi` in `roster-browser.tsx`): la disposizione non cambia mai.
- **Scelta fra poche voci:** `RadioChips`.

### Cards / Containers

**The Card Rule.** Una card di eroe non supera mai `--card-eroe`, 120 px veri, su nessuno schermo. I ritratti del gioco sono 128x128: il file da 256 è quel ritratto ingrandito dentro una cornice nitida, quindi oltre quella misura il volto si sfoca, qualunque file si usi. Il tetto è in pixel veri e non in rem, perché l'interfaccia cresce con lo schermo. Se c'è spazio in più si aggiungono colonne o si rimpicciolisce il contenitore, non si ingrandisce la card. Una misura in px veri si scrive `calc(N * var(--px))`: `Npx` lo converte postcss-pxtorem, e `calc(N * 1px)` la build lo semplifica.

- **Card del gioco:** `.hero-card` con `--tinta` nel colore dell'attributo, immagine dentro `.hero-card-art`, nome con `heroNameClass`, epiteto con `heroEpithetClass`. Griglia `.griglia-eroi`, `gap-x-2.5 gap-y-4`. Sempre il file da 256 (`heroCardSrc(game, id, 2)`).
- **`Card`, `Empty`, `Notice`:** per via di `p5-corner` non sono scatole ma un filetto in cima, senza fondo. `Notice` si distingue solo per il colore del testo.
- **`StatGrid`, `Stat`:** letture in fila, etichetta `eyebrow`, valore `numeric`.
- **Tag:** `tone="neutral"` è testo e basta; gli altri toni sono un blocco pieno.

### Inputs / Fields

- **Style:** `Input`, `Select`, `Textarea` dentro `Field`. Fondo `paper`, bordo `rule-strong`, spigoli vivi, 40 px.
- **Focus:** bordo e anello da `CONTROL` in `ui.tsx`.
- **Error:** testo `hot` sotto il campo.
- **Ricerca:** `input[type="search"].p5-cut`, filetto interno e testo a peso 400.

### Navigation

- **Intestazione:** ferma, filetto in basso, nessun pulsante principale.
- **Barra laterale** (`game-sidebar.tsx`): sezioni che si aprono e si chiudono con un clic, di partenza tutte aperte, stato ricordato in un cookie. Ogni sezione ha un'icona del gioco a maschera (`--icona-sezione`, `--icona-voce`, `background: currentColor`), così sul blocco bianco diventa nera. Le sezioni hanno icona da 26 px e testo forte; le voci icona da 15 px attenuata, testo più leggero e blocco rientrato sotto il nome della sezione.
- **Dove sei:** la voce in blocco bianco. Se la sezione è chiusa, il blocco bianco passa al suo titolo (`aria-current="location"`), altrimenti chi la chiude perde il posto.
- **Telefono:** barra in basso e `#menu-sezioni`, con righe da 44 px.
- **Schede dell'eroe** (`#schede`): testo `ink-3`, quella attiva `ink` col filo sulla linea, e il passaggio non la riempie.

### Palco

La testa della scheda (`HeroStage`) e delle pagine Endgame (`EndgameStage`): figura a destra sul nero con la luce alle spalle, nome grande a sinistra, sotto attributo e rarità. L'epiteto sopra il nome (`.stage-epithet`) è un dato del gioco, in Atkinson `ink-3`. Niente fascia. `EndgameStage` ha tre modi per i tre tipi di immagine: `cutout`, `card`, `backdrop`.

Nella testa della scheda eroe la figura è il cut-in del gioco (`cutInSrc`, 07/11): un quadrato alto quanto il palco, in fondo a destra, sfumato a destra e in basso dove il file è tagliato; sul telefono sale in cima e il nome gli sta sopra. I file sono a 1024 (`script\cutin_hd.py` nella pipeline, ingrandimento pulito dei 512 del gioco). L'illustrazione intera sta nella scheda Info. Home, menu del gioco, compleanni e profilo tengono l'illustrazione scontornata.

Sul telefono i dati sotto il nome stanno in fila, senza etichette, perché le schede entrino nel primo schermo: Personaggio, Valutazione e la rarità a parole sono nella scheda Info (`HeroPhoneFacts`).

### Tendina delle parole blu

Prima di tutto dice cosa fa la parola: il nome a 18 px e, sotto, la nota che il gioco scrive per QUESTO eroe, intera e coi suoi numeri (`ownNotes` in `hero-terms.tsx`); solo se manca, la definizione generica. Sotto, il conteggio con la ricerca e l'elenco. Se ce l'ha solo lui, niente elenco. Fondo `piastra-fondo`, filetto `rule`, nessuna ombra. Le card dell'elenco prendono la misura dalle classi: uno stile in linea la stira.

### Barra della griglia

`.barra-eroi`: ricerca, conteggio, Azzera, Ordina, alti uguali, ferma sotto l'intestazione solo sul computer. Sul telefono i filtri scelti tornano come tasselli (`.tassello`).

## Do's and Don'ts

### Do:

- **Do** usa i gettoni del ruolo, anche dentro un `color-mix`: è quello che fa funzionare i temi.
- **Do** tieni il testo ad almeno 4,5:1 su ogni fondo. Su `piastra-forte` il grigio `ink-3` nel Classico si ferma a 4,4:1: lì usa `ink-2`.
- **Do** dai ad almeno 44 px le aree da toccare sul telefono. I `Button` non ci arrivano da soli: aggiungi `tapArea` o `pointer-coarse:min-h-11`.
- **Do** dai alle card la piastra piatta ad angoli vivi nel colore dell'attributo e l'ingrandimento del 5%, e nient'altro.
- **Do** lascia i filtri aperti sul computer e con un fondo a riposo.
- **Do** dai a ogni voce nuova della barra un'icona del gioco a maschera.
- **Do** usa `numeric` per le cifre che si incolonnano.
- **Do** copri le figure scure con la luce alle spalle, mai con un contorno.

### Don't:

- **Don't** mettere fili bianchi attorno alle cose, nemmeno per lo stato scelto: lo stato scelto è il blocco.
- **Don't** usare il bianco per il passaggio: si confonderebbe con la scelta.
- **Don't** aggiungere lame, retini, tagli obliqui, ombre dure o numeri a contorno.
- **Don't** colorare l'interfaccia, né un titolo, né un filetto.
- **Don't** creare una seconda voce forte: un solo titolo in Archivo 900 per pagina.
- **Don't** mettere etichette sopra il titolo: `PageHeader` non le prevede, le briciole dicono già dove sei.
- **Don't** mettere scatole dentro scatole: lo stacco è il filetto.
- **Don't** mettere ombra, angoli tondi o abbassamento della griglia sulle card: insieme sapevano di effetto preconfezionato.
- **Don't** scrivere trattini lunghi nel testo visibile, nemmeno come segnaposto di una cella vuota.
- **Don't** far dipendere una forma da un tema.
- **Don't** aggiungere loop animati.
- **Don't** copiare i residui del vecchio stile che il codice porta ancora, anche se li trovi: `.hero-card-owned` e `.box-card-level` col taglio, l'ombra di `[data-active]`, `shadow-[5px_5px_0_#000]` in `guess-game.tsx`, le cornici `notched` e `glow` e le trame del profilo.
