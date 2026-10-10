/**
 * Contratto dei moduli di gioco.
 *
 * Questo file e' il confine dell'architettura. Il Core (account, profili, badge,
 * community, pagamenti) non importa NULLA da un modulo di gioco specifico: parla
 * solo con questa interfaccia. Aggiungere un gioco deve significare aggiungere
 * un modulo, non modificare il Core.
 *
 * Il contratto e' pensato per reggere due paradigmi molto diversi:
 *
 *   deterministico  il modulo fornisce solo `computeDamage`, il risolutore di
 *                   rotazioni condiviso fa il resto (Genshin, ZZZ, WuWa, HSR)
 *   stocastico      il modulo fornisce il proprio `simulateOnce`, perche' il
 *                   danno dipende da pescate casuali (Grand Cross)
 *
 * In entrambi i casi il risultato che esce e' lo stesso tipo. E' questo che
 * evita che il gioco piu' anomalo deformi l'architettura di tutti gli altri.
 */

import type {
  CombatParadigm,
  DamageFn,
  ResolvedActor,
  SimulateOnce,
  StatDefinition,
  Target,
} from "@/lib/engine";
import type {
  CreatureNestIndex,
  DeathMatchIndex,
  DemonKingIndex,
  EndgameHeroLink,
  SupremeDeityIndex,
} from "./endgame-types";
import type { AccountBuffIndex } from "./account-buff-types";
import type { ArtifactIndex } from "./artifact-types";
import type { CostumeIndex, GearIndex } from "./gear-types";
import type { HeroFatesIndex } from "./hero-fates-types";
import type { HeroTermsIndex } from "./hero-terms-types";
import type { ChangesIndex } from "./changes-types";
import type { MechanicsIndex } from "./mechanics-types";
import type { TeamIndex } from "./team-types";

/** Descrittore di una versione di dataset caricata dal modulo. */
export interface DatasetInfo {
  /** patch di gioco, es. "6.2" */
  patch: string;
  /** data di rilascio della patch */
  releasedAt: string;
  /** hash del contenuto: identifica il dataset in modo univoco */
  checksum: string;
}

/** Voce minima di un personaggio, quanto basta al Core per liste e ricerca. */
export interface CharacterSummary {
  id: string;
  name: string;
  rarity: number;
  /** elemento, attributo o fazione: etichetta primaria mostrata in UI */
  affinity: string;
  /** ruolo dichiarato: "dps", "support", "healer", ... */
  role: string;
  iconKey: string;
}

/**
 * Voce del roster completo, quello che si sfoglia.
 *
 * Distinta da CharacterSummary di proposito. Quella descrive le unita' che il
 * motore sa simulare: poche, con moltiplicatori calibrati a mano. Questa e'
 * l'elenco integrale come appare nel gioco - centinaia di voci - e serve a
 * cercare, filtrare e riconoscere, non a calcolare. Tenerle separate evita che
 * il roster debba aspettare la calibrazione per esistere, e che il simulatore
 * si ritrovi in lista unita' di cui non sa niente.
 */
export interface HeroEntry {
  /** identificatore nel gioco; e' anche il nome del file immagine */
  id: string;
  /** personaggio di base: piu' voci lo condividono ("Meliodas" ne ha 14) */
  group: string;
  name: string;
  /** epiteto della versione, fra parentesi quadre nel gioco */
  epithet: string;
  /** rarita' attuale */
  rarity: string;
  /** rarita' con cui esce dal gacha: dice quanto costa ottenerlo */
  obtainedAs: string;
  /** attributo o elemento; corrisponde a un HeroAffinity.id */
  affinity: string;
  /**
   * Il nome in italiano, com'e' scritto nel gioco in italiano.
   *
   * `name` resta l'inglese, e non per preferenza: e' il nome che la pipeline
   * scrive in eroi.json, e cambiarlo sposterebbe ordinamenti, collegamenti e
   * ricerche di chi c'era gia'. L'italiano si aggiunge accanto, e sceglie chi
   * rende. Opzionale perche' un modulo senza la fonte italiana resta valido.
   */
  nameIt?: string;
  /** l'epiteto in italiano, gia' ripulito come `epithet` */
  epithetIt?: string;
  /**
   * Razza e caratteristiche, coi codici del contesto (`HeroContextIndex.codes`).
   *
   * Il roster generato non le porta: le aggiunge la pagina della griglia,
   * leggendole dal contesto degli eroi, per i filtri per razza e caratteristica
   * (26/09). Assenti, quei filtri non restringono niente.
   */
  race?: number | null;
  factions?: readonly number[];
}

/** Attributo di un eroe, col colore con cui il gioco lo identifica. */
export interface HeroAffinity {
  id: string;
  label: string;
  color: string;
  /** secondo colore, per i rari attributi doppi */
  colorAlt?: string;
  /**
   * Codice dell'icona del gioco, dove esiste.
   *
   * L'attributo doppio di Tristan non ce l'ha: il gioco non ha un
   * `icon_filter_attribute_06`, e infatti non ha nemmeno una riga di testo che
   * lo nomini. Per lui resta il quadrato a due colori, che il progetto disegna
   * da se'.
   */
  iconKey?: string;
}

/**
 * Testi che il gioco tiene per un eroe.
 *
 * Tutti opzionali: non e' un difetto del dataset ma una proprieta' della
 * fonte. I personaggi usciti dopo l'ultima versione del client prendono i
 * propri testi dal server, e nel client non esistono. Una scheda deve saperlo
 * mostrare senza sembrare rotta.
 *
 * Il testo conserva il markup del gioco - 
 per andare a capo, [b]...[/b] per
 * il grassetto, [FFAE00]...[-] per il colore - perche' toglierlo qui vorrebbe
 * dire decidere una volta per tutte come si presenta. Lo interpreta chi rende.
 */
export interface HeroText {
  /** nome corto, com'e' scritto sulle animazioni */
  name?: string;
  /** nome completo, epiteto incluso: e' l'intestazione della scheda */
  title?: string;
  epithet?: string;
  description?: string;
  /**
   * Gli stessi quattro testi nelle due lingue.
   *
   * I campi qui sopra sono l'italiano col ripiego sull'inglese, scelto una
   * volta per tutte dall'importazione: bastavano finche' il sito era solo in
   * italiano. Questi tengono le due lingue separate, e la pagina sceglie con
   * `inLingua`. Tutto dal client: i testi dell'eroe (testi_eroi.json) e, dove
   * mancano, la scheda del client nella stessa lingua; un epiteto inglese che
   * la decifratura dei testi ha rovinato si riprende dal roster, anch'esso del
   * client. Fino al 24/09 i ripieghi venivano da 7dshub.
   */
  i18n?: {
    name: HeroLabel;
    title: HeroLabel;
    epithet: HeroLabel;
    description: HeroLabel;
  };
}

/**
 * Quali immagini esistono per un eroe, oltre alla card.
 *
 * Bandierine e non percorsi: il percorso lo costruisce chi rende, e tenerlo in
 * un posto solo evita che una cartella rinominata vada corretta ovunque.
 * Servono perche' le immagini non sono versionate - senza, una scheda
 * mostrerebbe riquadri rotti a chi non ha lanciato l'importazione.
 */
export interface HeroAssets {
  /** illustrazione a figura intera, 1024x1024 */
  splash?: boolean;
  /**
   * Dove sta il volto nell'illustrazione, in centesimi del lato: [x, y]. Il
   * palco ci centra il primo piano rosso della fascia. Lo calcola l'importazione
   * (faceOf in import-heroes.mts)
   */
  face?: readonly [number, number];
  /** icona dell'abilita' esclusiva */
  skill?: boolean;
  /** quante carte d'attacco, numerate da 1 */
  cards?: number;
  /**
   * C'e' la carta dell'ultimate: `icon_<slug>_special_NN`, di solito 128x256
   * come quelle d'attacco. Quale sia lo dichiara il client
   * (DB_skill_card_resource.icon), come per le carte A e B.
   */
  ultimate?: boolean;
}

/**
 * Una carta d'attacco, col testo esatto che il gioco le stampa sopra.
 *
 * Il testo cambia col rango della carta, e cambia nei valori: e' proprio quella
 * differenza che interessa a chi la legge, quindi si conservano tutti i ranghi
 * invece di tenere solo il massimo.
 */
export interface HeroCard {
  name: string;
  /** quale carta e': "A", "B", "ultimate", "coop" */
  slot?: string;
  /**
   * Quale sprite le corrisponde, numerato da 1: `carte/<id>/<n>.png`.
   *
   * Il legame fra carta e immagine lo dichiara il client
   * (DB_skill_card_resource.icon, letto da accosta_carte.py). L'ultimate non
   * ha il numero, il suo file e' `ultimate/<id>.png` e c'e' quando c'e'
   * `HeroAssets.ultimate`.
   */
  sprite?: number;
  /**
   * Il nome nelle due lingue. `name` resta l'italiano col ripiego
   * sull'inglese; qui l'inglese e' sempre inglese. Dal client, e se il nome del
   * database manca, dalla scheda italiana del client.
   */
  nameI18n?: HeroLabel;
  /**
   * Il testo di ogni rango. `text` in inglese, `textIt` lo stesso rango in
   * italiano: il modello del client nelle due lingue riempito coi valori delle
   * tabelle, come fa il gioco (modelli_client.py). Stessi valori, stesso markup.
   */
  ranks: readonly { rank: number; text: string; textIt?: string }[];
}

/**
 * Carte e passiva di un eroe.
 *
 * Dalle tabelle del client: quali carte ha l'eroe (DB_skin_skill), cosa fanno a
 * ogni rango (DB_skill_card_*, coi modelli di testo del client), la passiva
 * (DB_skill_passive). Fino al 24/09 le tabelle erano cifrate e venivano da fonti
 * esterne; `source` dice da dove vengono.
 *
 * Sono esclusi i giudizi - valutazioni, pro e contro, consigli d'uso: quelli
 * sono opinioni di altri, e mescolarle ai fatti le renderebbe indistinguibili.
 */
export interface HeroAbilities {
  cards: readonly HeroCard[];
  /** l'attacco speciale: ha piu' ranghi delle carte, fino a sei */
  ultimate?: HeroCard;
  passive?: {
    name?: string;
    /** il nome nelle due lingue, come `HeroCard.nameI18n` */
    nameI18n?: HeroLabel;
    /** il testo al rango 1 dell'ultimate; per 331 eroi su 373 e' l'unico */
    text?: string;
    /** lo stesso testo in italiano, dal modello italiano del client */
    textIt?: string;
    /**
     * Come cambia la passiva salendo di rango l'ultimate. Ogni voce vale dal suo
     * rango fino a quello prima della voce seguente, e sotto la prima vale
     * `text`: `[{2}, {5}]` sono tre testi, per i ranghi 1, 2-4 e 5-6.
     *
     * Il gioco colora d'arancione (`[FF8000]`) i valori legati al rango, ma dal
     * colore i testi non si ricostruiscono: ogni versione e' un testo risolto
     * della fonte. Assente quando la passiva non cambia; c'e' per 42 eroi.
     */
    ultimateSteps?: readonly { fromUltimateRank: number; text: string; textIt?: string }[];
  };
  /** da dove arriva il testo: oggi "client del gioco" */
  source: string;
  /**
   * `text` - dei ranghi, della passiva, dei suoi passi - e' in inglese.
   *
   * I testi sono MODELLI del client - "damage equal to {melee_val} of Attack" -
   * riempiti coi valori delle tabelle come fa il gioco (modelli_client.py). Il
   * nome della carta e' in italiano dove il gioco l'ha tradotto, e le due cose
   * vanno dichiarate separate.
   */
  textsInEnglish?: boolean;
  /**
   * C'e' anche l'italiano: `textIt` accanto a ogni `text`, dal modello italiano
   * del client con gli stessi valori. Non e' una traduzione nostra. Con questo
   * flag la pagina in italiano non ha piu' niente da avvertire.
   */
  textsInItalian?: boolean;
}

/**
 * Statistiche di un eroe al massimo livello.
 *
 * Calcolate dalle tabelle del client (scheda_client.py): fino al 24/09
 * venivano da 7dshub, perche' le tabelle stavano nei bundle cifrati.
 *
 * Due colonne perche' sono due domande diverse - quanto vale l'eroe nudo, e
 * quanto vale equipaggiato - e mostrarne una sola nasconde quanto pesa
 * l'equipaggiamento, che e' met&agrave; del gioco.
 *
 * I nomi delle statistiche restano quelli della fonte (`atk`, `critAtkPer`):
 * tradurli qui vorrebbe dire decidere una volta per tutte come si chiamano, e
 * quella e' una decisione dell'interfaccia.
 */
export interface HeroStats {
  /** eroe al massimo, senza equipaggiamento */
  readonly max: Readonly<Record<string, number>>;
  /** eroe al massimo, con l'equipaggiamento migliore */
  readonly maxGeared: Readonly<Record<string, number>>;
  /** i pezzi di cui `max` e' la somma, per le statistiche a un livello qualunque */
  readonly steps?: HeroStatSteps;
}

/**
 * I pezzi delle statistiche, come li somma il gioco.
 *
 * SkinData.GetTotalStatWithoutPassive: base + crescita x (livello - 1) + i
 * Risvegli fatti + i Super risvegli fatti + la Reliquia sacra + i costumi. Con
 * tutto al massimo la somma ridà `max` esatta (l'import si ferma se no): lo
 * slider della scheda somma questi numeri, non una stima fatta a parte.
 *
 * Mancano il Vero risveglio (il gioco lo chiama cosi'; nelle tabelle e'
 * `exceed`) e l'equipaggiamento: il primo aggiunge resistenza ai danni e classe
 * di combattimento, non le statistiche che la scheda mostra; il secondo e' lo
 * stesso pacchetto per ogni eroe.
 */
export interface HeroStatSteps {
  /** al livello 1, senza nient'altro */
  readonly base: Readonly<Record<string, number>>;
  /** quanto aggiunge ogni livello dopo il primo: attacco, difesa, PS */
  readonly perLevel: Readonly<Record<string, number>>;
  readonly maxLevel: number;
  /** i sei Risvegli, in ordine: ognuno aggiunge il suo */
  readonly awaken: readonly Readonly<Record<string, number>>[];
  /** i sei Super risvegli (nelle tabelle, `transcend`) */
  readonly superAwaken: readonly Readonly<Record<string, number>>[];
  /** la Reliquia sacra con i tre potenziamenti; assente se l'eroe non ne ha */
  readonly relic?: Readonly<Record<string, number>>;
  /** i cinque costumi migliori per tipo, al massimo potenziamento */
  readonly costumes: Readonly<Record<string, number>>;
}

/** Un oggetto con la sua quantita': un materiale, o il costo in oro. */
export interface HeroRelicAmount {
  readonly id: string;
  readonly count: number;
}

/**
 * Una Reliquia sacra.
 *
 * Nel client e' un costume d'arma (DB_costume_base, `craft_costume_check` 1 o
 * 2): si fabbrica coi materiali di una Bestia demoniaca (DB_costume_craft) e si
 * potenzia tre volte (DB_craft_costume_upgrade). Scritta una volta, e gli eroi
 * la citano: le versioni di un personaggio spesso la condividono.
 */
export interface HeroRelic {
  readonly name: HeroLabel;
  /** col markup del gioco, come le descrizioni degli eroi */
  readonly description: HeroLabel;
  /** c'e' l'immagine in public/eroi/<gioco>/reliquie/<id>.png */
  readonly image: boolean;
  /** false per le reliquie di Surtr: un eroe con due ne attiva una alla volta */
  readonly classic: boolean;
  readonly stats: Readonly<Record<string, number>>;
  /** i tre potenziamenti, ognuno con quanto aggiunge e cosa costa */
  readonly upgrades: readonly {
    readonly stats: Readonly<Record<string, number>>;
    readonly materials: readonly HeroRelicAmount[];
    readonly cost?: HeroRelicAmount;
  }[];
  /** l'effetto della reliquia: una passiva, con le condizioni come la passiva dell'eroe */
  readonly passive?: { readonly name: HeroLabel; readonly text: HeroLabel; readonly conditions: readonly number[] };
  /** le Bestie demoniache da cui si fabbrica (chiavi di HeroRelicsIndex.beasts); vuoto per 65 reliquie */
  readonly beasts: readonly string[];
  readonly materials: readonly HeroRelicAmount[];
  readonly cost?: HeroRelicAmount;
}

/** Le reliquie, gli oggetti che servono a farle e le bestie da cui vengono. */
export interface HeroRelicsIndex {
  readonly beasts: Readonly<Record<string, HeroLabel>>;
  /** gli oggetti citati: nome e se c'e' l'icona in public/eroi/<gioco>/oggetti/<id>.png */
  readonly items: Readonly<Record<string, { readonly name: HeroLabel; readonly icon: boolean }>>;
  readonly relics: Readonly<Record<string, HeroRelic>>;
  /** heroId -> id delle sue reliquie, quella delle statistiche massime per prima */
  readonly heroes: Readonly<Record<string, readonly string[]>>;
}

/**
 * Un'etichetta nelle due lingue del sito.
 *
 * Tutte e due sempre presenti come campo, anche quando una manca: la fonte e'
 * il client, e la sua decifratura fallisce su righe diverse in lingue diverse -
 * il nome italiano di una razza puo' esserci e mancare l'inglese, o viceversa.
 * Scegliere qui quale mostrare butterebbe via l'altra, e il sito deve poter
 * passare interamente in inglese senza rigenerare il dataset.
 */
export interface HeroLabel {
  it: string | null;
  en: string | null;
}

/**
 * Un effetto del gioco, con la sua provenienza e quanto e' sicuro.
 *
 * `certainty` non e' un dettaglio interno ed e' per questo che arriva fino
 * qui: "dichiarato" vuol dire che il gioco quella cosa la definisce da se' -
 * nella nota dentro l'abilita', nel dizionario dei buff o nella tassonomia con
 * cui filtra i propri effetti. "dedotto" vuol dire che il gioco NON la
 * definisce da nessuna parte in chiaro e la corrispondenza e' stata stabilita
 * dalla pipeline contro il vocabolario interno del client. Sono due garanzie
 * diverse e chi legge ha diritto di distinguerle, come per gli sprite dedotti.
 */
export interface HeroEffect {
  label: HeroLabel;
  definition: HeroLabel;
  /** da quale fonte del gioco viene, in chiaro */
  source: string;
  /** nota | buff | categoria | operazione | nota_per_eroe */
  kind: string;
  certainty: "dichiarato" | "dedotto";
}

/**
 * Da dove parte un eroe e dove puo' arrivare.
 *
 * Sono due numeri diversi e vanno tenuti distinti: `obtainedAs` e' la rarita'
 * con cui esce dal gacha, cioe' quanto costa ottenerlo; `max` e' il TETTO che
 * puo' raggiungere. Un eroe che esce SSR e arriva a LR non e' un LR: lo
 * diventa. Dirlo "LR" e basta - come faceva questa scheda - e' comodo e falso.
 *
 * Che `rating` sia il tetto e non la rarita' attuale lo dicono tre cose: l'enum
 * RatingType del client (UR=6, LR=7), il campo DBHeroBaseRow.hero_lr_special
 * che esiste come colonna, e le statistiche massime dei 32 eroi con rating=7,
 * che sono quelle di un UR e non di un LR.
 */
export interface HeroRarityPath {
  obtainedAs: string | null;
  max: string | null;
  canReachLr: boolean;
}

/** Cosa fa una carta, in effetti del gioco invece che in prosa inglese. */
export interface HeroCardContext {
  /** "A", "B", "ultimate", "passiva": la stessa sigla di HeroCard.slot */
  slot: string;
  /** chiavi del glossario valide per TUTTI i ranghi della carta */
  effects: readonly string[];
  /**
   * Quello che compare solo a certi ranghi, col rango che lo introduce.
   *
   * Separato da `effects` perche' altrimenti la scheda direbbe che al rango 1
   * la carta fa gia' quello che impara al rango 3.
   */
  onlyAtRanks?: Readonly<Record<string, readonly string[]>>;
  /** razze e fazioni a cui l'effetto si applica, per codice */
  appliesTo?: { races: readonly number[]; factions: readonly number[] };
}

/** Quello che si sa di un eroe oltre ai suoi testi. */
export interface HeroContext {
  rarity: HeroRarityPath;
  attribute: number | null;
  race: number | null;
  factions: readonly number[];
  cards: Readonly<Record<string, HeroCardContext>>;
  /**
   * Dove si attiva la passiva, come codici del gioco (1-9) nell'ordine della
   * fonte: chiavi di `HeroContextIndex.passiveConditions`.
   */
  passiveConditions?: readonly number[];
}

/**
 * Dove si attiva una passiva: l'icona e la frase che il gioco le mette accanto.
 *
 * Nel riquadro dell'abilita' unica il gioco ne mostra due o tre: la spada nel
 * quadrato rosso "si attiva all'ingresso nella battaglia", la mano nel cerchio
 * blu "si attiva anche in uno slot secondario", "solo in PvP"... `icon` e' il
 * suffisso del file (`icon_passive_condition_<icon>`), lo stesso con cui il
 * client nomina la frase.
 *
 * Il legame fra codice e icona e' DEDOTTO: la tabella del client che lo
 * contiene sta nei bundle cifrati. Le prove sono scritte in contesto_eroi.py
 * (CONDIZIONI_PASSIVA): nomi dei filtri, testi delle passive, e le icone
 * riconosciute in gioco.
 */
export interface HeroPassiveCondition {
  icon: string;
  description: HeroLabel;
}

/**
 * Il contesto di tutti gli eroi, piu' i dizionari che serve per leggerlo.
 *
 * Una regola sola, applicata tre volte: cio' che vale per tutti si scrive una
 * volta e gli eroi lo citano. Il glossario, i nomi dei codici e le fonti stanno
 * qui; l'eroe porta chiavi e numeri. Ripetere {"it":"Demone","en":"Demon"}
 * dentro 373 eroi costava 106 KB per dire sei cose.
 */
export interface HeroContextIndex {
  readonly glossary: Readonly<Record<string, HeroEffect>>;
  readonly codes: {
    readonly race: Readonly<Record<string, HeroLabel>>;
    readonly attribute: Readonly<Record<string, HeroLabel>>;
    readonly faction: Readonly<Record<string, HeroLabel>>;
  };
  /** codice della condizione -> icona e frase, come per i nomi dei codici */
  readonly passiveConditions: Readonly<Record<string, HeroPassiveCondition>>;
  readonly sources: Readonly<Record<string, string>>;
  readonly heroes: Readonly<Record<string, HeroContext>>;
}

/**
 * Un'abilita' speciale: Comandamento, Grazia, Unita' o Talento.
 *
 * Si aggiunge all'abilita' unica di 49 eroi, e il gioco la disegna con una
 * cornice del suo tipo (PassiveManager.ExclusiveIconFrame del client). Il
 * Talento nel codice del gioco si chiama "ability".
 *
 * L'icona e' gia' incorniciata dalla pipeline, tutte e due dal client:
 * DB_skill_passive.icon e la cornice del tipo della passiva (i Talenti quella
 * del tipo della loro carta).
 */
export interface HeroSpecialAbility {
  /** "comandamento" | "grazia" | "unita" | "talento": chiave di `kinds` */
  kind: string;
  /**
   * Il nome nelle due lingue, dal client: il nome della passiva e, dove quella
   * riga non si legge, la scheda italiana del client.
   */
  name: HeroLabel;
  /** l'effetto al rango 1 dell'ultimate, in inglese come `text` delle altre abilita' */
  text: string;
  /** lo stesso effetto in italiano, dal modello italiano del client */
  textIt?: string;
  /** come per la passiva: un Talento puo' cambiare col rango dell'ultimate */
  ultimateSteps?: readonly { fromUltimateRank: number; text: string; textIt?: string }[];
  /** dove si attiva: codici di HeroContextIndex.passiveConditions */
  conditions: readonly number[];
  /** c'e' l'immagine incorniciata in public/eroi/<gioco>/speciali/<id>.png */
  icon: boolean;
}

/** Il tipo di un'abilita' speciale, con le regole del gioco su come convive con gli altri. */
export interface HeroSpecialKind {
  label: HeroLabel;
  rules: readonly HeroLabel[];
}

/** Le abilita' speciali: ogni abilita' scritta una volta, gli eroi la citano. */
export interface HeroSpecialsIndex {
  readonly kinds: Readonly<Record<string, HeroSpecialKind>>;
  readonly abilities: Readonly<Record<string, HeroSpecialAbility>>;
  /** heroId -> id delle sue abilita' speciali */
  readonly heroes: Readonly<Record<string, readonly string[]>>;
}

/**
 * Un eroe in una riga del calendario delle uscite, com'e' scritto nella fonte.
 *
 * Il nome, i colori e la rarita' restano quelli della fonte anche quando c'e'
 * il legame col roster: sono la riga che si sta leggendo, e dove la fonte e il
 * client non concordano (i colori dei due eroi "Another", scambiati) la
 * differenza deve potersi vedere, non sparire in un'unificazione.
 */
export interface ReleaseHero {
  /** il nome come lo scrive la fonte: "Merlin (Kid)" */
  name: string;
  /** lettere di colore della fonte (R G B L D): due per l'attributo doppio, nessuna se la cella e' vuota */
  colors: readonly string[];
  /** rarita' d'uscita */
  rarity: string;
  /**
   * Come si ottiene. L'inglese e' il testo della fonte ("Festival Banner Draw",
   * "Freebie"), l'italiano la sua traduzione coi nomi del gioco (Festival,
   * Raccolta, Passo avanti), null dove un pezzo non ha ancora una traduzione.
   */
  method: HeroLabel;
  /** la fonte lo segna come Festival: il banner piu' raro */
  festival?: boolean;
  /** l'eroe del roster. Assente se il legame non e' certo: meglio nessun collegamento che quello sbagliato */
  heroId?: string;
}

/** Un'evoluzione a LR annunciata in un aggiornamento. */
export interface ReleaseLrEvolution {
  name: string;
  colors: readonly string[];
  heroId?: string;
}

/**
 * Un aggiornamento del gioco: una data della fonte e quello che ha portato.
 *
 * I testi liberi (eventi, dettagli, armi, reliquie) restano nella lingua della
 * fonte, l'inglese: tradurli sarebbe un'interpretazione nostra, e il campo lo
 * dice gia' il suo nome.
 */
export interface ReleaseUpdate {
  /** numero progressivo della fonte; le settimane piu' recenti possono non averlo */
  number?: string;
  /** data della fonte, AAAA-MM-GG */
  date: string;
  heroes: readonly ReleaseHero[];
  /** settimana senza eroi nuovi: "heroes" se un banner c'era, "banner" se nemmeno quello */
  noHeroes?: "heroes" | "banner";
  /** il giorno del lancio */
  launch?: boolean;
  /** gli eroi del lancio: la fonte non li elenca, vengono dalle date del roster */
  launchHeroes?: readonly string[];
  /** precisazione accanto a una settimana senza eroi o al lancio */
  detail?: string;
  /** una riga che non e' un eroe ne' una settimana vuota: un banner speciale, "Collab?" */
  note?: string;
  /** gli eroi che tornano con una collaborazione */
  reruns?: string;
  urGear?: string;
  holyRelics?: string;
  lrEvolutions?: readonly ReleaseLrEvolution[];
  /** le novita' dell'aggiornamento, una per voce */
  events?: readonly string[];
  /** Guerra d'élite dei Cavalieri: "51 / 48" e' Giappone / globale */
  knighthoodWar?: string;
  /** boss dei Cavalieri */
  knighthoodBoss?: string;
  /** stagione di Arena degli eroi, Labirinto o Difesa di Liones */
  arena?: string;
  /** settimana con la stamina dimezzata (la segna solo il calendario globale) */
  halfStamina?: boolean;
  /**
   * Nel calendario globale, una riga presa da quello giapponese (dopo
   * l'allineamento): `number` e' la numerazione giapponese.
   */
  fromJp?: boolean;
  /**
   * Nel calendario globale, la data giapponese di una riga uscita nel globale in
   * un altro giorno: i rari aggiornamenti arrivati il mercoledi' prima (Odino).
   * `date` e' gia' quella globale.
   */
  jpDate?: string;
}

/** I calendari: il server globale, e Giappone e Corea. */
export type ReleaseRegion = "global" | "jp";

/** Le date d'uscita di un eroe, AAAA-MM-GG. */
export interface HeroRelease {
  /** Giappone e Corea: la data del calendario, se l'eroe ci ha una riga */
  jp?: string;
  /** globale: la data del calendario globale, se l'eroe ci ha una riga */
  global?: string;
  festival?: boolean;
  /** evoluzione a LR */
  lrJp?: string;
  lrGlobal?: string;
  /** la riga dell'eroe nei due calendari (la sua data): serve al collegamento */
  updateGlobal?: string;
  updateJp?: string;
  /**
   * Lo stendardo di debutto del client da cui viene la data, per chi nel
   * calendario non ha ancora una riga (Heimdallr, 08/10/2026: il foglio arriva
   * qualche giorno dopo la patch). Lo scrive date_uscita.py; quando il foglio
   * aggiunge la riga, sparisce.
   */
  banner?: string;
}

/**
 * Il calendario delle uscite, com'e' scritto nella fonte.
 *
 * Per Grand Cross la fonte e' un foglio della community, non il client: il
 * client PC non porta date d'uscita. Per questo `source` viaggia col dato fino
 * in pagina.
 */
export interface ReleaseCalendar {
  readonly source: {
    readonly title: string;
    readonly authors: string;
    readonly url: string;
    /** quando e' stata scaricata la copia letta, AAAA-MM-GG */
    readonly downloaded: string;
    /** il titolo del calendario globale, dove e' una scheda a parte */
    readonly globalTitle?: string;
  };
  /** il giorno in cui il globale si e' allineato al Giappone */
  readonly sync?: string;
  /** i calendari, ognuno dal piu' vecchio, nell'ordine della fonte */
  readonly schedules: Readonly<Partial<Record<ReleaseRegion, readonly ReleaseUpdate[]>>>;
  /** le date di ogni eroe, anche di chi nel calendario non ha una riga */
  readonly heroes: Readonly<Record<string, HeroRelease>>;
}

/**
 * Roster sfogliabile di un gioco.
 *
 * Le sfaccettature sono dichiarate invece che dedotte dalle voci: l'ordine
 * ("LR prima di UR") e i colori non si ricavano contando, e un filtro che
 * cambia ordine quando cambia il dataset e' un filtro che confonde.
 */
export interface HeroRoster {
  /** elenco completo, gia' nell'ordine di presentazione */
  readonly heroes: readonly HeroEntry[];
  /** rarita' esistenti, dalla piu' alta */
  readonly rarities: readonly string[];
  /** rarita' di uscita dal gacha, dalla piu' alta */
  readonly obtainable: readonly string[];
  /** attributi esistenti, nell'ordine del gioco */
  readonly affinities: readonly HeroAffinity[];
}

/**
 * Una build utente, nella forma specifica del gioco.
 * Il Core la tratta come opaca e la salva in `Build.payload`.
 */
export interface GameBuildPayload {
  characterId: string;
  level: number;
  /** costellazione, eidolon, rank: la scala varia per gioco */
  rank: number;
  [key: string]: unknown;
}

export interface GameModule<TBuild extends GameBuildPayload = GameBuildPayload> {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly publisher: string;
  readonly paradigm: CombatParadigm;

  /** unita' di misura del tempo, per le etichette in UI */
  readonly timeUnit: "seconds" | "turns";

  readonly dataset: DatasetInfo;

  /** statistiche esistenti in questo gioco, con i loro default */
  readonly statModel: readonly StatDefinition[];

  /** bersagli preconfigurati (nemici comuni, manichino da test) */
  readonly targets: readonly Target[];

  readonly characters: readonly CharacterSummary[];

  /**
   * Roster completo, se il modulo ce l'ha.
   *
   * Opzionale perche' dipende da quanto e' accessibile il gioco: per Grand
   * Cross e' costato l'estrazione degli asset dal client. Un modulo senza
   * roster resta valido, semplicemente non ha la sezione Eroi.
   */
  readonly roster?: HeroRoster;

  /**
   * Testi lunghi degli eroi, per la scheda del singolo.
   *
   * Separati dal roster e non dentro di esso perche' hanno un destinatario
   * diverso: il roster arriva fino al browser per far funzionare i filtri,
   * questi no. Li legge solo una pagina renderizzata sul server, e mescolarli
   * significherebbe spedire centinaia di descrizioni a chi sta solo
   * sfogliando la griglia.
   */
  readonly heroTexts?: Readonly<Record<string, HeroText>>;

  /**
   * Immagini disponibili per eroe, oltre alla card.
   *
   * Come heroTexts: la legge solo la scheda, renderizzata sul server.
   */
  readonly heroAssets?: Readonly<Record<string, HeroAssets>>;

  /**
   * Carte e passiva, dalle tabelle del client (fino al 24/09 da 7dshub).
   * Separati da heroAssets perche' hanno una provenienza diversa, e la
   * provenienza va tenuta visibile fino in pagina.
   */
  readonly heroAbilities?: Readonly<Record<string, HeroAbilities>>;

  /**
   * Statistiche al massimo livello, calcolate dalle tabelle del client.
   *
   * Separate dalle altre per lo stesso motivo di sempre - le legge solo la
   * scheda, renderizzata sul server - ma anche perche' sono la cosa che il
   * motore potra' usare per calibrarsi, mentre i testi no.
   */
  readonly heroStats?: Readonly<Record<string, HeroStats>>;

  /**
   * Cosa vuol dire quello che l'eroe fa: effetti spiegati con le parole del
   * gioco, codici risolti, e fin dove puo' salire di rarita'.
   *
   * Separato dalle abilita' e non dentro di esse perche' ha una provenienza
   * tutta sua - gli enum e i testi del CLIENT, non 7dshub - e perche' e' un
   * indice: il glossario si legge una volta e vale per tutti gli eroi.
   */
  readonly heroContext?: HeroContextIndex;

  /** Comandamenti, Grazie, Unita' e Talenti: le abilita' che si aggiungono all'unica. */
  readonly heroSpecials?: HeroSpecialsIndex;

  /** Le Reliquie sacre: immagine, effetto, potenziamenti, bestia e materiali. */
  readonly heroRelics?: HeroRelicsIndex;

  /**
   * Il calendario delle uscite: aggiornamenti, eroi, eventi, e le date di ogni
   * eroe. Come heroTexts lo legge solo il server: la sezione Uscite e la scheda.
   */
  readonly releases?: ReleaseCalendar;

  /**
   * Le modalita' di fine gioco, una per sezione del gruppo Endgame. Come
   * heroTexts le legge solo il server: le loro pagine e la scheda dell'eroe.
   * Il contratto sta in endgame-types.ts.
   */
  readonly deathMatch?: DeathMatchIndex;
  readonly creatureNest?: CreatureNestIndex;
  readonly demonKing?: DemonKingIndex;
  readonly supremeDeity?: SupremeDeityIndex;
  /** heroId -> i suoi legami con le quattro modalita', per la scheda */
  readonly endgameHeroes?: Readonly<Record<string, readonly EndgameHeroLink[]>>;

  /**
   * Le Carte artefatto e i Set artefatto, con i pacchetti di carte. Come
   * l'Endgame lo legge il server; alle griglie arriva solo quello che filtrano.
   * Il contratto sta in artifact-types.ts.
   */
  readonly artifacts?: ArtifactIndex;

  /**
   * I buff dell'account: la classe di combattimento dell'account coi suoi titoli,
   * le costellazioni pietra per pietra, e le regole della classe di un eroe. Li
   * legge il server; allo slider della scheda arrivano ridotti ai totali
   * (`sliderData`). Il contratto sta in account-buff-types.ts.
   */
  readonly accountBuff?: AccountBuffIndex;

  /**
   * Le parole blu della scheda eroe: cosa c'e' dietro ognuna e quali eroi hanno
   * la stessa cosa, per le tendine che si aprono cliccandole. Lo legge solo il
   * server. Il contratto sta in hero-terms-types.ts.
   */
  readonly heroTerms?: HeroTermsIndex;

  /**
   * I legami: per ogni eroe, gli eroi associati con cui si attiva l'Effetto
   * associazione, e quali danno l'Attacco combinato. Li legge il Randomizer. Il
   * contratto sta in hero-fates-types.ts.
   */
  readonly heroFates?: HeroFatesIndex;

  /**
   * La squadra: per ogni passiva che conta per i compagni (Unica, abilita'
   * speciali, Reliquia sacra) chi riceve l'effetto e chi lo fa scattare, frase
   * per frase. Lo legge la pagina «Squadra». Il contratto sta in team-types.ts,
   * la valutazione in team.ts.
   */
  readonly team?: TeamIndex;

  /**
   * L'equipaggiamento (set, parti, valori, effetti bonus, gli strati delle icone)
   * e i costumi di ogni eroe: il calcolatore della scheda eroe e la scheda
   * Costumi. Li legge il server; al calcolatore arrivano solo quelli dell'eroe. Il
   * contratto sta in gear-types.ts, i conti in gear.ts.
   */
  readonly gear?: GearIndex;
  readonly costumes?: CostumeIndex;

  /**
   * Le meccaniche di combattimento: le costanti del danno, il triangolo degli
   * attributi, i pesi di pesca e gli effetti Luce/Oscurita' di ogni eroe, il
   * cumulo dei buff per concetto delle parole blu. Le legge il server: la pagina
   * «Meccaniche», la scheda eroe e le tendine. Il contratto sta in
   * mechanics-types.ts.
   */
  readonly mechanics?: MechanicsIndex;

  /**
   * I cambiamenti da una patch all'altra, eroe per eroe, dall'archivio delle
   * patch della pipeline (che comincia il 23/09/2026). Li leggono la pagina
   * «Cambiamenti» e la scheda Info dell'eroe. Il contratto sta in
   * changes-types.ts.
   */
  readonly changes?: ChangesIndex;

  /**
   * Quali icone del gioco sono state estratte, per famiglia.
   *
   * Bandierine come heroAssets, e per lo stesso motivo: le immagini non sono
   * versionate, quindi senza questo elenco chi clona il repo senza lanciare
   * l'importazione vedrebbe un riquadro rotto su ogni scheda e su ogni filtro,
   * invece di un'interfaccia che semplicemente mostra il testo.
   */
  readonly icons?: Readonly<Record<string, readonly string[]>>;

  /**
   * Converte una build salvata in un attore eseguibile dal motore.
   * Qui vivono artefatti, echi, coni luce, set bonus e passive: tutto cio' che
   * il motore non deve conoscere.
   */
  resolveActor(build: TBuild, slotId: string): ResolvedActor;

  /** Formula di danno del gioco. Usata dal risolutore condiviso. */
  readonly computeDamage: DamageFn;

  /**
   * Simulatore proprio. Presente SOLO nei moduli stocastici, che non possono
   * usare il risolutore di rotazioni deterministico.
   */
  readonly simulateOnce?: SimulateOnce;

  /** iterazioni Monte Carlo di default; ignorato dai moduli deterministici */
  readonly defaultIterations?: number;
}

export function isStochastic(gameModule: GameModule): boolean {
  return gameModule.paradigm === "stochastic";
}
