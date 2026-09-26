/**
 * Il contratto delle modalita' di fine gioco: Scontri finali, Bestie
 * demoniache, Re Demone, Divinita' Suprema.
 *
 * Sta in un file suo e non in types.ts perche' e' un mondo a parte: quattro
 * modalita' con la loro forma, e un vocabolario comune - mostri, abilita',
 * passive, oggetti, drop - che la scheda eroe non usa. types.ts ne importa solo
 * i quattro indici, per i campi del modulo.
 *
 * La fonte e' il client (le tabelle e i testi, via la pipeline: scontri_finali.py,
 * creature_nest.py, re_demone_divinita.py). Come per gli eroi, ogni testo arriva
 * nelle due lingue con null dove il client non l'ha, e col markup del gioco;
 * quello che la pipeline ha DEDOTTO invece di leggere porta un segno fino in
 * pagina: le statistiche stimate, i nomi presi da un mostro gemello, il
 * vantaggio d'attributo calcolato col triangolo.
 *
 * Mostri, passive e oggetti sono scritti una volta per modalita' e citati per
 * id: lo stesso mostro compare in piu' fasi, la stessa passiva in piu' mostri.
 */

import type { HeroLabel } from "./types";

/* ------------------------------------------------------- vocabolario -- */

/** Un oggetto citato: nome, e se c'e' l'icona in public/eroi/<gioco>/endgame/oggetti/<id>.png. */
export interface EndgameItem {
  readonly name: HeroLabel;
  readonly icon: boolean;
}

/** Un oggetto e quanti. */
export interface EndgameAmount {
  readonly id: string;
  readonly count: number;
}

/**
 * Una voce delle estrazioni di fine battaglia.
 *
 * `weight` e' su 10.000 per estrazione: in tutti gli stage delle quattro
 * modalita' i pesi sommano esattamente a 10.000, e il gioco scrive i testi delle
 * probabilita' nella stessa unita'. L'estrazione vera la fa il server.
 *
 * Negli Scontri finali alcune voci non hanno un oggetto fisso: il materiale dei
 * costumi cambia con la regione (`byRegion`: regione -> id dell'oggetto).
 */
export interface EndgameDrop {
  readonly id: string | null;
  readonly count: number;
  readonly weight: number;
  readonly byRegion?: Readonly<Record<string, string>>;
}

/** Le estrazioni: `draws` volte, ognuna fra queste voci. */
export interface EndgameDrops {
  readonly draws: number;
  readonly entries: readonly EndgameDrop[];
}

/** Dove sta una carta nel mazzo del boss. */
export type EndgameSkillSlot = "a" | "b" | "exclusive_a" | "exclusive_b" | "special" | "counter";

/**
 * Una carta di un boss, coi suoi ranghi.
 *
 * I boss salgono di rango come gli eroi: il client ha un testo per rango
 * (skill_a_1, skill_a_2...), e qui stanno tutti.
 */
export interface EndgameSkill {
  readonly slot: EndgameSkillSlot;
  readonly name: HeroLabel;
  /** un testo per rango, dal primo, col markup del gioco */
  readonly ranks: readonly HeroLabel[];
  /** SkillCardObject.ATTACK_TYPE: atk, buff, debuff, debuff_atk, heal, defence_pose... */
  readonly kind: string | null;
  /** il nome dell'icona in public/eroi/<gioco>/endgame/abilita/<icon>.png, se c'e' */
  readonly icon: string | null;
}

/** Una passiva di un boss, di una modalita' o di una squadra nemica. */
export interface EndgamePassive {
  readonly name: HeroLabel;
  readonly text: HeroLabel;
}

/**
 * I consigli che il gioco scrive su un mostro.
 *
 * Negli Scontri finali e' la finestra «Info mostro» (DB_stage_destroy_desc),
 * nel Re Demone la sua scheda (DB_stage_demonlord_desc). Le etichette le sceglie
 * la pagina: nei due client le colonne si chiamano allo stesso modo ma i testi
 * del gioco le presentano diversamente.
 */
export interface EndgameTips {
  readonly favoredRaces: HeroLabel | null;
  readonly unfavoredRaces: HeroLabel | null;
  readonly skills: HeroLabel | null;
  readonly behavior: HeroLabel | null;
  readonly unique: HeroLabel | null;
}

/** Un mostro, scritto una volta e citato per id dalle fasi. */
export interface EndgameMonster {
  readonly name: HeroLabel;
  /** il client non ha il nome di questo mostro: e' quello del gemello con lo stesso character_base */
  readonly nameDeduced?: true;
  readonly description: HeroLabel | null;
  /** HeroKindType 1-6, come le razze degli eroi */
  readonly race: number | null;
  /** 1-5, come gli attributi degli eroi */
  readonly attribute: number | null;
  /** c'e' l'icona in public/eroi/<gioco>/endgame/mostri/<id>.png */
  readonly icon: boolean;
  readonly skills: readonly EndgameSkill[];
  /** probabilita' di pescare la carta A e la B, in percento */
  readonly draw?: { readonly a: number; readonly b: number };
  /** id in `passives`: solo quelle con un nome, nell'ordine del client */
  readonly passives: readonly string[];
  /** quante passive senza nome ne' testo il client gli da' (nascoste apposta dal gioco) */
  readonly hiddenPassives: number;
  readonly tips?: EndgameTips;
}

/**
 * Un nemico in una fase: quale mostro, a che livello, quanto e' moltiplicato.
 *
 * `estimate` NON e' letta: e' (base + crescita x (livello - 1)) x moltiplicatore,
 * la formula degli eroi applicata ai mostri, mai verificata nel codice del
 * client. Scelta dell'utente (26/09): mostrarla dichiarata come stima.
 */
export interface EndgameFoe {
  readonly monster: string;
  readonly level: number;
  /** moltiplicatori in percento: 250 = x2,5 */
  readonly multipliers: { readonly atk: number; readonly def: number; readonly hp: number };
  readonly estimate: { readonly atk: number; readonly def: number; readonly hp: number } | null;
  /** passive che la fase aggiunge al mostro (id in `passives`) */
  readonly extraPassives?: readonly string[];
}

/** Le tabelle di una modalita': mostri, passive e oggetti, citati per id. */
export interface EndgameDictionary {
  readonly monsters: Readonly<Record<string, EndgameMonster>>;
  readonly passives: Readonly<Record<string, EndgamePassive>>;
  readonly items: Readonly<Record<string, EndgameItem>>;
}

/** Da dove viene la passiva di un eroe che una modalita' tocca. */
export type EndgamePassiveSource = "unique" | "relic" | "commandment" | "grace" | "talent" | "bond";

/** Un eroe con una passiva legata alla modalita'. */
export interface EndgameHeroPassive {
  readonly heroId: string;
  readonly source: EndgamePassiveSource;
  readonly passive: HeroLabel;
}

/** Una Difficolta' come la scrive il gioco: il nome e il suo colore. */
export interface EndgameDifficultyName {
  readonly name: HeroLabel;
  /** il colore del gioco, col cancelletto; null se il client non lo da' */
  readonly color: string | null;
}

/* ------------------------------------------------------ Scontri finali -- */

export interface DeathMatchPhase {
  readonly foe: EndgameFoe;
}

export interface DeathMatchDifficulty extends EndgameDifficultyName {
  /** 1 Normale ... 5 Caos */
  readonly level: number;
  readonly bossLevel: number;
  readonly energy: number;
  readonly gold: number;
  /** team_power: la potenza consigliata */
  readonly power: number;
  /** la quest che la apre, se c'e' */
  readonly unlock: HeroLabel | null;
  /**
   * Gli attributi AMMESSI, se la difficolta' li limita (hero_attribute_check):
   * dedotto dal testo «Solo eroi con attributo {0}» e dal fatto che in 7 casi su
   * 8 manchi proprio l'attributo che batte il boss.
   */
  readonly allowedAttributes: readonly number[] | null;
  /** eroi esclusi (hero_group_check): solo il Demone originale, che vieta Chandler e Cusack */
  readonly bannedHeroes: readonly string[];
  readonly phases: readonly DeathMatchPhase[];
  /** la vittoria garantita (solo i boss 1☆) */
  readonly guaranteed: readonly EndgameAmount[];
  readonly drops: EndgameDrops;
  /** al leader del party che ha trovato lo scontro */
  readonly leader: EndgameDrops;
}

/**
 * Un boss degli Scontri finali. Solo i sei fissi: Lamek, d'evento, resta fuori
 * (scelta dell'utente, 26/09).
 */
export interface DeathMatchBoss {
  /** l'indirizzo della sua pagina: /<gioco>/scontri-finali/<key> */
  readonly key: string;
  readonly name: HeroLabel;
  /** 1-3: da quale Battaglia boss nasce */
  readonly stars: number;
  /** le regioni (capitoli) in cui compare, chiavi di `regions` */
  readonly regions: readonly string[];
  readonly race: number | null;
  readonly attribute: number | null;
  /** l'attributo che lo batte, col triangolo del gioco: dedotto, il client non lo scrive */
  readonly advantage: number | null;
  readonly guide: readonly HeroLabel[];
  /** avvisi della pipeline su dati che si contraddicono */
  readonly warnings: readonly HeroLabel[];
  /** l'illustrazione della scheda (DestroyInfo), in endgame/scontri/<key>.png */
  readonly image: boolean;
  /** l'icona dello scontro, in endgame/scontri/<key>-icona.png */
  readonly icon: boolean;
  /**
   * il cut-in del boss (cut_in_special_<boss>_01, a colori e su fondo
   * trasparente), in endgame/scontri/<key>-cutin.png: e' l'immagine dei pulsanti
   * dell'indice (scelta dell'utente, 26/09), al posto della scheda color seppia
   */
  readonly cutIn: boolean;
  readonly material: string | null;
  /** scacciare il boss con Mamma Hawk: cosa si riceve */
  readonly repulse: readonly EndgameAmount[];
  readonly aiTeam: {
    readonly name: HeroLabel;
    readonly power: number;
    readonly heroes: readonly string[];
  } | null;
  readonly artifactSet: {
    readonly name: HeroLabel;
    readonly cards: readonly HeroLabel[];
    /** la passiva a ogni livello del set (id in `passives`) */
    readonly levels: readonly string[];
  } | null;
  readonly costumeSets: readonly {
    readonly name: HeroLabel;
    readonly heroes: readonly string[];
    readonly effect: HeroLabel;
  }[];
  readonly difficulties: readonly DeathMatchDifficulty[];
}

export interface DeathMatchIndex extends EndgameDictionary {
  readonly name: HeroLabel;
  /** le regole del gioco (DB_destroy_rule_01..06) */
  readonly rules: readonly HeroLabel[];
  readonly limits: { readonly minutes: number; readonly chaosPerDay: number };
  readonly regions: Readonly<Record<string, { readonly name: HeroLabel; readonly chapter: number }>>;
  readonly bosses: readonly DeathMatchBoss[];
  /** passive che valgono SOLO nello Scontro finale (codice 5 e contenuti) */
  readonly heroesOnly: readonly EndgameHeroPassive[];
  /** passive che nello Scontro finale non si attivano (codice 6) */
  readonly heroesExcluded: readonly EndgameHeroPassive[];
}

/* -------------------------------------------------- Bestie demoniache -- */

export interface NestPhase {
  /** la descrizione della fase scritta dal gioco */
  readonly description: HeroLabel | null;
  readonly foes: readonly EndgameFoe[];
  /** le passive fra cui il gioco ne sceglie una a caso per la fase (id in `passives`) */
  readonly randomPassives: readonly string[];
  /** la barra di Nidhoggr */
  readonly gauge: { readonly name: HeroLabel; readonly text: HeroLabel } | null;
  /** Surtr: la meccanica di questa fase */
  readonly surtr: NestSurtrPhase | null;
  /** limite di turni della fase (solo Surtr) */
  readonly turnLimit: number | null;
}

/** Surtr: Laevateinn risponde al tipo di abilita', Kenaz ne chiede uno. */
export interface NestSurtrPhase {
  /** tipo di abilita' usata -> effetto che Laevateinn aggiunge */
  readonly laevateinn: readonly { readonly type: HeroLabel; readonly effect: HeroLabel | null }[];
  /** i tipi che l'Incantesimo di Kenaz puo' chiedere */
  readonly kenaz: readonly HeroLabel[];
  /** cosa succede se si sbaglia tipo */
  readonly kenazPenalty: HeroLabel | null;
  /** gli incantesimi runici che si possono usare nella fase, con la ricarica */
  readonly runes: readonly { readonly name: HeroLabel; readonly text: HeroLabel; readonly cooldown: number }[];
}

export interface NestFloor extends EndgameDifficultyName {
  /** il nome del piano: «Nido di Hraesvelgr Piano 1» */
  readonly title: HeroLabel;
  readonly floor: number;
  readonly transcendent: boolean;
  readonly energy: number;
  readonly firstClear: readonly EndgameAmount[];
  readonly clear: readonly EndgameAmount[];
  readonly drops: EndgameDrops;
  readonly phases: readonly NestPhase[];
}

export interface NestBeast {
  /** l'indirizzo della sua pagina: /<gioco>/bestie-demoniache/<key> */
  readonly key: string;
  /** il gruppo della bestia nel client (101...109): la chiave di HeroRelicsIndex.beasts */
  readonly group: string;
  readonly name: HeroLabel;
  /** la classe di combattimento consigliata dell'account; null se il client non la imposta (Surtr) */
  readonly power: number | null;
  /** il ritratto della lobby, in endgame/bestie/<key>.png */
  readonly image: boolean;
  /** l'illustrazione del piano, in endgame/bestie/<key>-info.png */
  readonly info: boolean;
  readonly material: string | null;
  readonly guaranteed: HeroLabel | null;
  readonly floors: readonly NestFloor[];
  /** le Reliquie sacre che si fabbricano coi suoi materiali, con chi le usa */
  readonly relics: readonly { readonly name: HeroLabel; readonly heroes: readonly string[] }[];
  /** eroi con una passiva che vale solo contro questa bestia */
  readonly heroesOnly: readonly EndgameHeroPassive[];
  /** «Sangue cattivo»: eroi che la bestia prende di mira */
  readonly badBlood: readonly string[];
}

export interface CreatureNestIndex extends EndgameDictionary {
  readonly name: HeroLabel;
  /** le guide del gioco: introduzione, trascendente, scelta settimanale */
  readonly guide: readonly { readonly title: HeroLabel; readonly text: HeroLabel }[];
  readonly beasts: readonly NestBeast[];
  /** scambio dei materiali: quanti punti vale ogni materiale, e cosa si compra */
  readonly exchange: {
    readonly text: HeroLabel | null;
    readonly points: readonly { readonly id: string; readonly points: number }[];
    readonly rewards: readonly { readonly id: string; readonly points: number; readonly weekly: number }[];
  };
  /** passive che valgono in tutta la nest (codice 8, senza una bestia sola) */
  readonly heroesOnly: readonly EndgameHeroPassive[];
  /** passive che nella nest non si attivano (codice 9) */
  readonly heroesExcluded: readonly EndgameHeroPassive[];
}

/* ----------------------------------------------------------- Re Demone -- */

/** Una richiesta del Re Demone: un attributo, un rango o un tipo di abilita' (anche piu' d'uno insieme). */
export type DemonKingRuleStep = readonly number[];

export interface DemonKingPhase {
  readonly foe: EndgameFoe;
  readonly rules: {
    readonly type: "attribute_type" | "card_rank" | "attack_type";
    /** ogni sequenza: tre richieste da rispettare in ordine */
    readonly sequences: readonly (readonly [DemonKingRuleStep, DemonKingRuleStep, DemonKingRuleStep])[];
  } | null;
}

export interface DemonKingDifficulty extends EndgameDifficultyName {
  readonly level: number;
  readonly bossLevel: number;
  readonly energy: number;
  readonly gold: number;
  readonly power: number;
  readonly clear: readonly EndgameAmount[];
  readonly drops: EndgameDrops;
  /** i tre passi del Verdetto: quante regole infrante per salire, e la passiva che scatta */
  readonly verdict: readonly { readonly threshold: number; readonly passive: string }[];
  /** punti Purgatorio per aprire lo stage a x1 e x3 */
  readonly points: { readonly x1: number | null; readonly x3: number | null };
  readonly phases: readonly DemonKingPhase[];
}

export interface DemonKingIndex extends EndgameDictionary {
  readonly name: HeroLabel;
  readonly unlock: HeroLabel | null;
  readonly guide: readonly HeroLabel[];
  readonly attempts: HeroLabel | null;
  /** Monete eroe -> Punti Purgatorio */
  readonly coinPoints: readonly { readonly rarity: string; readonly points: number }[];
  readonly allyPassives: readonly string[];
  readonly difficulties: readonly DemonKingDifficulty[];
  /** 4 Cristalli di una razza -> 1 di un'altra */
  readonly exchange: readonly { readonly give: EndgameAmount; readonly choices: readonly string[]; readonly weekly: number }[];
  /** le casse delle ricompense, col contenuto */
  readonly boxes: Readonly<Record<string, readonly EndgameDrop[]>>;
  readonly banned: readonly string[];
}

/* --------------------------------------------------- Divinita' Suprema -- */

/** Un gruppo di nemici di un Giudizio. */
export interface DeityGroup {
  readonly name: HeroLabel;
  readonly description: HeroLabel | null;
  /** l'illustrazione (solo i quattro Arcangeli), in endgame/divinita/<id>.png */
  readonly image: string | null;
  /** attributo forte e debole CONTRO il gruppo (solo gli Arcangeli) */
  readonly strong: number | null;
  readonly weak: number | null;
  readonly skills: HeroLabel | null;
  readonly teamPassives: readonly string[];
  readonly foes: readonly EndgameFoe[];
}

export interface SupremeDeityDifficulty extends EndgameDifficultyName {
  readonly level: number;
  readonly energy: number;
  readonly gold: number;
  readonly power: number;
  readonly turns: number;
  readonly modePassive: string | null;
  readonly heroPassives: readonly string[];
  readonly clear: readonly EndgameAmount[];
  readonly drops: EndgameDrops;
  readonly points: { readonly x1: number | null; readonly x3: number | null };
  readonly magic: { readonly perSurvivor: number; readonly inherited: number };
  readonly judgments: readonly { readonly name: HeroLabel; readonly turns: number; readonly group: DeityGroup }[];
  /** il Giudizio finale: fino a quella magia, uno di questi gruppi */
  readonly final: readonly { readonly upTo: number; readonly groups: readonly DeityGroup[] }[];
  readonly hidden: { readonly opensBelow: number; readonly groups: readonly DeityGroup[] } | null;
  /** gli Editti divini, per livello di magia (le stesse soglie del finale) */
  readonly edicts: readonly { readonly upTo: number; readonly edicts: readonly HeroLabel[] }[];
}

export interface SupremeDeityIndex extends EndgameDictionary {
  readonly name: HeroLabel;
  readonly unlock: HeroLabel | null;
  readonly guide: readonly { readonly title: HeroLabel; readonly texts: readonly HeroLabel[] }[];
  readonly attempts: HeroLabel | null;
  readonly curses: readonly { readonly name: HeroLabel; readonly passive: string }[];
  readonly stigmata: readonly EndgameSkill[];
  readonly difficulties: readonly SupremeDeityDifficulty[];
  readonly boxes: Readonly<Record<string, readonly EndgameDrop[]>>;
  readonly banned: readonly string[];
}

/* ------------------------------------------------------ per la scheda -- */

export type EndgameMode = "death-match" | "creature-nest" | "demon-king" | "supreme-deity";

/**
 * Un legame fra un eroe e una modalita', per la scheda dell'eroe.
 *
 * `kind`:
 *   only      una sua passiva vale solo nella modalita' (o contro un boss: `target`)
 *   excluded  una sua passiva nella modalita' non si attiva
 *   banned    l'eroe non puo' entrare in squadra
 *   ai-team   e' nella squadra di supporto IA di un boss
 *   bad-blood la bestia lo prende di mira («Sangue cattivo»)
 */
export interface EndgameHeroLink {
  readonly mode: EndgameMode;
  readonly kind: "only" | "excluded" | "banned" | "ai-team" | "bad-blood";
  /** il boss o la bestia, se il legame e' con uno solo: nome e ancora */
  readonly target?: { readonly key: string; readonly name: HeroLabel };
  readonly passive?: HeroLabel;
}
