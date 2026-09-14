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
  /** testo mostrato quando esce dall'evocazione */
  summon?: string;
  /** frase nella schermata di caricamento */
  loading?: string;
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
  /** icona dell'abilita' esclusiva */
  skill?: boolean;
  /** quante carte d'attacco, numerate da 1 */
  cards?: number;
  /**
   * Le carte vengono da un accostamento piu' debole: stesso personaggio, ma
   * sigla di rarita' diversa da quella dell'eroe. Vanno mostrate dicendolo.
   */
  cardsApprox?: boolean;
  /**
   * C'e' la carta dell'ultimate: `icon_<slug>_special_01`, 128x256 come quelle
   * d'attacco. Viene dal wiki, che la cita nella pagina dell'eroe, oppure dallo
   * slug quando la cartella del personaggio ne contiene una sola e nessun altro
   * eroe la condivide: li' non c'e' niente da scegliere.
   */
  ultimate?: boolean;
  /**
   * Colpi per carta, dal client: `skill_a_1_atk` e' l'abilita' A al rango 1.
   * Questo e' certo - l'heroId e' nel nome del file da cui viene.
   */
  hits?: Readonly<Record<string, number>>;
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
   * Quale sprite le corrisponde, numerato da 1.
   *
   * Opzionale perche' l'accostamento fra l'immagine di una carta e il suo testo
   * non si ricava: il numero nel nome dello sprite non ha relazione con l'id
   * dell'abilita' (1 caso su 232 misurati), e la regola "la carta A ha il
   * numero piu' basso" regge 92 volte su 110. C'e' solo dove una fonte lo
   * dichiara, e dove manca la carta si mostra senza immagine invece di
   * accostarne una a caso.
   */
  sprite?: number;
  ranks: readonly { rank: number; text: string }[];
}

/**
 * Carte e passiva di un eroe.
 *
 * NON vengono dal client: il client ha le descrizioni ma non la tabella che le
 * lega a un eroe. Vengono dal wiki di community, e `source` lo dice perche' la
 * differenza conta: un dato estratto dal gioco e uno trascritto da qualcuno non
 * offrono la stessa garanzia, e chi legge ha diritto di distinguerli.
 *
 * Sono esclusi i giudizi - valutazioni, pro e contro, consigli d'uso: quelli
 * sono opinioni di altri, e mescolarle ai fatti le renderebbe indistinguibili.
 */
export interface HeroAbilities {
  cards: readonly HeroCard[];
  /** l'attacco speciale: ha piu' ranghi delle carte, fino a sei */
  ultimate?: HeroCard;
  passive?: { name?: string; text?: string };
  /** da dove arriva il testo, es. "7dshub.com" */
  source: string;
  /**
   * I testi dei ranghi sono in inglese.
   *
   * Non e' una scelta: il client spedisce 285 descrizioni di abilita' in tutto,
   * e sono MODELLI - "damage equal to {melee_val} of Attack" - che il server
   * riempie. I valori per rango esistono solo risolti, e risolti li ha solo la
   * fonte inglese. Il nome della carta invece e' in italiano dove il gioco
   * l'ha tradotto, quindi le due cose vanno dichiarate separate.
   */
  textsInEnglish?: boolean;
  /**
   * Lo sprite accanto alle carte e' DEDOTTO, non dichiarato da una fonte.
   *
   * Vale per gli eroi la cui cartella contiene esattamente due illustrazioni:
   * sono per forza le sue due carte, e l'unica cosa da indovinare e' quale sia
   * la A. La regola "indice piu' basso = carta A", misurata sui casi che il
   * wiki conferma, e' esatta 27 volte su 32 - l'84% - quindi circa un eroe su
   * sei avra' le due immagini invertite.
   *
   * E' un campo a parte e non un dettaglio dello sprite perche' chi legge ha
   * diritto di sapere che li' sta guardando una deduzione: un accostamento
   * probabile dichiarato vale, uno spacciato per certo no.
   */
  spritesDeduced?: boolean;
}

/**
 * Statistiche di un eroe al massimo livello.
 *
 * Vengono da fonte esterna: il client non le ha, stanno sul server del gioco.
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
  readonly sources: Readonly<Record<string, string>>;
  readonly heroes: Readonly<Record<string, HeroContext>>;
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
   * Carte e passiva, da fonte esterna. Separati da heroAssets perche' hanno
   * una provenienza diversa, e la provenienza va tenuta visibile fino in
   * pagina.
   */
  readonly heroAbilities?: Readonly<Record<string, HeroAbilities>>;

  /**
   * Statistiche al massimo livello, da fonte esterna.
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
