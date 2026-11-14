/**
 * Le parole della pagina Squadra: come si dice chi nomina una frase, perche' una
 * passiva e' spenta, cosa chiede una condizione. Pure, nelle due lingue, usate
 * dal costruttore e dal resoconto (componenti client) e dai loro test.
 */

import type { AccountSliderData } from "@/lib/games/account-buff-types";
import type { HeroFatesIndex } from "@/lib/games/hero-fates-types";
import type { HeroTermGroup } from "@/lib/games/hero-terms-types";
import type { MechanicsTeamEffect } from "@/lib/games/mechanics-types";
import {
  MAIN_STATS,
  type BattleChange,
  type NumberChange,
  type OffReason,
  type TeamHero,
  type TotalKey,
} from "@/lib/games/team";
import type { TeamCondition, TeamContent, TeamIndex, TeamStat, TeamWho } from "@/lib/games/team-types";
import { inLingua, testi, type Locale } from "@/lib/i18n/locale";

/** Un eroe come lo mostra la pagina, gia' nella sua lingua. */
export interface BuilderHero extends TeamHero {
  readonly name: string;
  readonly epithet: string;
  /** il colore dell'attributo, per l'epiteto come nella griglia Eroi */
  readonly color: string | null;
  readonly collab: boolean;
  /** nome ed epiteto nelle due lingue, per la ricerca (`searchText`) */
  readonly search: string;
}

/** Tutto quello che la pagina passa al costruttore. */
export interface BuilderData {
  readonly game: string;
  readonly heroes: readonly BuilderHero[];
  /** l'indice della squadra, con le frasi solo nella lingua della pagina (e l'inglese dove l'italiano manca) */
  readonly team: TeamIndex;
  readonly fates: HeroFatesIndex;
  readonly labels: {
    readonly race: Readonly<Record<string, string>>;
    readonly attribute: Readonly<Record<string, string>>;
    readonly faction: Readonly<Record<string, string>>;
  };
  /** codice di dove si attiva una passiva -> icona e frase del gioco */
  readonly conditions: Readonly<Record<string, { readonly icon: string; readonly text: string }>>;
  /** i tipi di abilita' speciale, col nome e le regole del gioco */
  readonly specials: Readonly<Record<string, { readonly label: string; readonly rules: readonly string[] }>>;
  /** gli effetti di squadra Luce/Oscurita', per gli eroi che ce l'hanno */
  readonly lightDark: Readonly<Record<string, { readonly light?: MechanicsTeamEffect; readonly dark?: MechanicsTeamEffect }>>;
  /** ci sono le pietre dei ranghi dell'ultimate */
  readonly stones: boolean;
  /** ci sono le icone di dove si attiva una passiva */
  readonly conditionIcons: boolean;
  /** il titolo della classe e le costellazioni, per chi ha impostato l'account (account-setup.ts) */
  readonly account: AccountSliderData | null;
  /**
   * il gioco ha il simulatore del primo turno: il browser lo scarica dopo la pagina
   * (grand-cross/team-sim-load.ts), coi gradini degli eroi per i numeri d'inizio
   */
  readonly simulation: boolean;
}

export const TESTI = testi({
  it: {
    contenuto: "Dove giochi",
    contenuti: { pve: "PvE", pvp: "PvP", destroy: "Scontro finale", nest: "Bestia demoniaca" } as Record<TeamContent, string>,
    contenutiTitolo: {
      pve: "Storia, eventi, boss: tutto quello contro il computer che non è Scontro finale o Bestia demoniaca",
      pvp: "PvP",
      destroy: "Scontri finali",
      nest: "Battaglia Bestia demoniaca",
    } as Record<TeamContent, string>,
    quarto: "Il quarto eroe",
    inCampo: "In campo",
    inPanchina: "In panchina",
    quartoTitolo: {
      campo: "Tutti e quattro in campo, come nelle Bestie demoniache, nel Re Demone e nella Divinità Suprema",
      panchina: "Tre in campo e il quarto nello slot secondario, come nella storia e negli Scontri finali",
    },
    ultimate: "Mossa finale",
    ultimateTitolo: (n: number) => `Mossa finale al rango ${n}: alcune Uniche cambiano col rango`,
    reliquie: "Reliquie sacre",
    si: "Sì",
    no: "No",
    reliquieTitolo: { si: "Con le Reliquie sacre create", no: "Senza Reliquie sacre" },
    nemici: "Nemici in campo",
    nemiciTitolo: (n: number) =>
      n === 1
        ? "Un nemico in campo: conta per le passive che guardano i nemici, come la Fiamma eterna di Escanor"
        : `${n} nemici in campo: contano per le passive che guardano i nemici, come la Fiamma eterna di Escanor`,
    copia: "Copia il link",
    copiato: "Copiato",
    svuota: "Svuota",
    posto: (n: number) => `Eroe ${n}`,
    panchina: "Slot secondario",
    // la riga sotto l'etichetta del quarto posto in panchina (24/10)
    panchinaNota: "In panchina finché non entra in campo",
    associato: "Associato",
    scegli: "Scegli",
    cambia: "Cambia",
    togli: "Togli",
    togliTitolo: (nome: string) => `Togli ${nome} dalla squadra`,
    scegliPosto: (n: number) => `Scegli l'eroe ${n}`,
    scegliPanchina: "Scegli l'eroe dello slot secondario",
    scegliAssociato: (nome: string) => `Scegli l'associato di ${nome}`,
    scegliAssociatoVuoto: (n: number) => `Scegli l'associato del posto ${n}`,
    chiudi: "Chiudi",
    cerca: "Cerca un eroe per nome",
    cercaEtichetta: "Cerca un eroe",
    senzaCollab: "Senza collaborazioni",
    soloMiei: "Solo i miei",
    soloMieiTitolo: "Solo gli eroi che hai segnato in «I tuoi eroi»",
    suggeriti: "Si incastrano meglio qui",
    suggeritiSpiega:
      "Guardano solo le passive: prima chi accende o fa crescere quelle dei compagni, poi chi fa crescere di più i numeri della squadra (la somma semplice delle percentuali di Attacco, Difesa, PS e danni), poi chi si scambia più effetti con loro.",
    numeriConsiglio: "Numeri",
    numeriTitolo: "I numeri delle passive",
    numeriSpiega:
      "Le statistiche al primo turno, prima di giocare carte, calcolate come le calcola il gioco: Uniche, Reliquie, abilità speciali ed effetti d'inizio battaglia, nell'ordine del suo codice. Si parte dai numeri del tuo box, o da quelli al massimo del calcolatore, con l'equipaggiamento PS/Difesa: col tuo equipaggiamento vero i numeri cambiano, le percentuali quasi mai.",
    numeriSpiegaVecchio:
      "Quello che vale sempre con questa squadra, dove giochi e al rango scelto. Non contano equipaggiamento, costumi e carte, né chi è nello slot secondario. Come nel gioco, su Attacco, Difesa e PS gli effetti di tipo diverso si moltiplicano; i danni subiti sono la somma delle riduzioni, e un colpo non scende mai sotto un quinto del danno.",
    danniDalTesto: "Danni inflitti e subiti si leggono ancora dalle frasi delle passive.",
    daDoveDanni: (n: number) => (n === 1 ? "Danni: da dove vengono (1 passiva)" : `Danni: da dove vengono (${n} passive)`),
    partenza: { box: "All'inizio, dal tuo box", max: "All'inizio, al massimo del calcolatore" } as Record<"box" | "max", string>,
    tetto: "Il tetto del gioco: almeno un quinto del numero d'inizio",
    viaBuff: "con un effetto d'inizio battaglia",
    passivaNascosta: (nome: string) => `Passiva di ${nome}`,
    daDove: (n: number) => (n === 1 ? "Da dove viene (1 passiva)" : `Da dove vengono (${n} passive)`),
    inCertiMomenti: (n: number) => `In certi momenti, non sommati (${n})`,
    suiNemici: "Sui nemici",
    altreStat: "Tutte le altre statistiche",
    stat: {
      atk: "Attacco",
      def: "Difesa",
      hp: "PS",
      dmg: "Danni inflitti",
      dmg_taken: "Danni subiti",
      fixed_atk_per: "Perforazione",
      crit_per: "Possibilità critico",
      crit_atk_per: "Danno critico",
      fixed_def_per: "Resistenza",
      crit_res_per: "Resistenza critico",
      crit_def_per: "Difesa critico",
      hp_regen_per: "Velocità di rigenerazione",
      hp_recovery_per: "Velocità di recupero",
      hp_steal_per: "Furto di vita",
    } as Record<TeamStat, string>,
    gruppoStat: {
      tutte: "Tutte le statistiche",
      attacco: "Statistiche relative all'Attacco",
      difesa: "Statistiche relative alla Difesa",
      ps: "Statistiche relative ai PS",
      base: "Statistiche di base",
    },
    variante: {
      single: "con attacchi a bersaglio singolo",
      all: "con attacchi a tutti",
      ultimate: "della Mossa finale",
      final: "finali",
    },
    nessunSuggerimento: "Nessun eroe cambia le passive della squadra in questo posto.",
    cercoConsigli: "Cerco chi si incastra…",
    calcoloNumeri: "Calcolo i numeri del primo turno…",
    primaUnEroe: "Scegli prima un altro eroe: i consigli guardano i compagni che ha.",
    passivaDi: (tipo: string, nome: string) => `${tipo} di ${nome}`,
    accendeLe: "Accende",
    faCrescere: "Fa crescere",
    arrivaA: "Dà ai compagni",
    scattaCon: "Scatta coi compagni",
    riceveLe: "Riceve",
    spegneLe: "Spegne",
    perche2: "Le frasi del gioco",
    legami: "I suoi legami",
    legamiSpiega: "Gli eroi con cui ha un Effetto associazione del legame (al grado UR).",
    nessunLegame: "Nessun legame: con qualunque associato vale l'Effetto associazione comune.",
    tutti: (n: number) => `Tutti gli eroi (${n})`,
    risultati: (n: number, di: number) => `${n} di ${di}`,
    nessuno: "Nessun eroe trovato.",
    griglia: "La griglia completa degli eroi",
    vuota: "Scegli gli eroi: clicca un posto qui sopra. La squadra si salva nell'indirizzo della pagina e in questo browser.",
    // il resoconto
    resoconto: "Come si influenzano",
    riepilogo: (dati: number, accesi: number) =>
      `${dati} effetti vanno ai compagni, ${accesi} passive accese dai compagni`,
    condTutti: (ok: number, ko: number) => `condizioni «tutti»: ${ok} rispettate, ${ko} rotte`,
    specialiSpente: (n: number) => (n === 1 ? "1 abilità speciale spenta" : `${n} abilità speciali spente`),
    lePassive: "Le sue passive",
    riceve: "Riceve dai compagni",
    faScattare: "Accende le passive di",
    niente: "Niente.",
    nessunaPerCompagni: "Non nomina i compagni: vale per l'eroe stesso o contro i nemici.",
    tipo: { unique: "Unica", relic: "Reliquia sacra", special: "Abilità speciale" },
    accesa: "accesa",
    spenta: "spenta",
    perche: {
      content: "non vale dove giochi",
      bench: "in panchina: si attiva quando entra in campo",
      fromBench: "vale solo entrando dallo slot secondario",
      relics: "reliquie spente",
      leftmost: (nome: string) => `vale quella di ${nome}, più a sinistra`,
      condition: "la condizione «tutti» non è rispettata",
      nobody: "nessuno in squadra la fa scattare",
    },
    vaA: "Va a",
    nessunCompagno: "nessun compagno in campo",
    soloSe: "lo nomina la frase",
    ogni: "Cresce per ogni",
    quando: "Scatta quando agisce",
    se: "Se in campo c'è",
    tuttiSono: "Se in campo sono tutti",
    inCampoN: (n: number) => (n === 1 ? "1 in campo" : `${n} in campo`),
    dueParti: "Vale anche per la tua squadra, non solo per i nemici.",
    conPanchina: "Conta anche lo slot secondario.",
    tranneSe: "L'eroe stesso non conta.",
    razzaAggiunta: (razze: string) => `Conta anche come ${razze}.`,
    ancheCome: (razze: string) => `conta anche come ${razze}`,
    inPanchinaTag: "in panchina",
    inglese: "testo inglese: la frase italiana non si appaia",
    da: (nome: string) => `da ${nome}`,
    allaPassivaDi: (nome: string) => nome,
    regole: "Le regole delle abilità speciali",
    lucOsc: "Effetti di squadra Luce e Oscurità",
    luce: (pct: number, altri: number) =>
      `Luce: gli alleati Luce subiscono il ${pct}% di danni in meno da chi non è Luce, gli altri alleati il ${altri}% in meno dai nemici in svantaggio.`,
    oscurita: (pct: number, altri: number) =>
      `Oscurità: gli alleati Oscurità infliggono il ${pct}% di danni in più a chi non è Oscurità, gli altri alleati il ${altri}% in più quando sono in vantaggio d'attributo.`,
    nonSiSomma: "non si somma: vale quello del primo",
    associati: "Gli associati",
    legame: "Effetto associazione del legame (grado UR)",
    comune: (base: number, max: number) =>
      `Nessun legame: vale l'Effetto associazione comune, dal ${base}% al ${max}% di Attacco, Difesa e PS dell'associato secondo il rango della sua Mossa finale.`,
    combinato: "Attacco combinato",
    chi: {
      allies: "tutti gli alleati",
      differentRaces: "razze tutte diverse",
      sameRace: "della stessa razza",
      unity: "con un'Unità",
      group: "alleati applicabili",
      attribute: (nomi: string) => `di attributo ${nomi}`,
    },
    o: " o ",
  },
  en: {
    contenuto: "Where you play",
    contenuti: { pve: "PvE", pvp: "PvP", destroy: "Death Match", nest: "Demonic Beast" } as Record<TeamContent, string>,
    contenutiTitolo: {
      pve: "Story, events, bosses: everything against the computer that isn't Death Match or Demonic Beast",
      pvp: "PvP",
      destroy: "Death Match",
      nest: "Demonic Beast Battle",
    } as Record<TeamContent, string>,
    quarto: "The fourth hero",
    inCampo: "On the field",
    inPanchina: "On the bench",
    quartoTitolo: {
      campo: "All four on the field, as in bosses and Demonic Beasts",
      panchina: "Three on the field and the fourth in the Sub slot, as in the story and normal PvP",
    },
    ultimate: "Ultimate Move",
    ultimateTitolo: (n: number) => `Ultimate Move at rank ${n}: some Uniques change with the rank`,
    reliquie: "Holy Relics",
    si: "Yes",
    no: "No",
    reliquieTitolo: { si: "With the Holy Relics crafted", no: "Without Holy Relics" },
    nemici: "Enemies on the field",
    nemiciTitolo: (n: number) =>
      n === 1
        ? "One enemy on the field: it counts for passives that look at enemies, like Escanor's Eternal Flame"
        : `${n} enemies on the field: they count for passives that look at enemies, like Escanor's Eternal Flame`,
    copia: "Copy link",
    copiato: "Copied",
    svuota: "Clear",
    posto: (n: number) => `Hero ${n}`,
    panchina: "Sub slot",
    panchinaNota: "On the bench until it enters the field",
    associato: "Associate",
    scegli: "Choose",
    cambia: "Change",
    togli: "Remove",
    togliTitolo: (nome: string) => `Remove ${nome} from the team`,
    scegliPosto: (n: number) => `Choose hero ${n}`,
    scegliPanchina: "Choose the Sub slot hero",
    scegliAssociato: (nome: string) => `Choose ${nome}'s associate`,
    scegliAssociatoVuoto: (n: number) => `Choose the associate of slot ${n}`,
    chiudi: "Close",
    cerca: "Search a hero by name",
    cercaEtichetta: "Search a hero",
    senzaCollab: "No collaborations",
    soloMiei: "Only mine",
    soloMieiTitolo: "Only the heroes you marked in «Your heroes»",
    suggeriti: "Fit best here",
    suggeritiSpiega:
      "They only look at passives: first who turns on or grows those of teammates, then who raises the team's numbers the most (the plain sum of Attack, Defense, HP and damage percentages), then who trades the most effects with them.",
    numeriConsiglio: "Numbers",
    numeriTitolo: "The passives' numbers",
    numeriSpiega:
      "Stats on the first turn, before playing cards, computed the way the game computes them: Uniques, Holy Relics, special abilities and battle-start effects, in the order of its code. They start from the numbers in your box, or from the calculator's maximum, with HP/Defense gear: with your real gear the numbers change, the percentages hardly ever.",
    numeriSpiegaVecchio:
      "What always applies with this team, where you play and at the chosen rank. Gear, costumes and cards don't count, nor does the Sub slot hero. As in the game, on Attack, Defense and HP effects of different types multiply; damage taken is the sum of the reductions, and a hit never goes below a fifth of the damage.",
    danniDalTesto: "Damage dealt and taken are still read from the passives' sentences.",
    daDoveDanni: (n: number) => (n === 1 ? "Damage: where it comes from (1 passive)" : `Damage: where it comes from (${n} passives)`),
    partenza: { box: "At the start, from your box", max: "At the start, at the calculator's maximum" } as Record<"box" | "max", string>,
    tetto: "The game's floor: at least a fifth of the starting number",
    viaBuff: "through a battle-start effect",
    passivaNascosta: (nome: string) => `${nome}'s passive`,
    daDove: (n: number) => (n === 1 ? "Where it comes from (1 passive)" : `Where they come from (${n} passives)`),
    inCertiMomenti: (n: number) => `At certain moments, not added up (${n})`,
    suiNemici: "On enemies",
    altreStat: "All other stats",
    stat: {
      atk: "Attack",
      def: "Defense",
      hp: "HP",
      dmg: "Damage dealt",
      dmg_taken: "Damage taken",
      fixed_atk_per: "Pierce Rate",
      crit_per: "Crit Chance",
      crit_atk_per: "Crit Damage",
      fixed_def_per: "Resistance",
      crit_res_per: "Crit Resistance",
      crit_def_per: "Crit Defense",
      hp_regen_per: "Regeneration Rate",
      hp_recovery_per: "Recovery Rate",
      hp_steal_per: "Lifesteal",
    } as Record<TeamStat, string>,
    gruppoStat: {
      tutte: "All Stats",
      attacco: "Attack-related Stats",
      difesa: "Defense-related Stats",
      ps: "HP-related Stats",
      base: "Basic Stats",
    },
    variante: {
      single: "with single-target attacks",
      all: "with all-target attacks",
      ultimate: "of the Ultimate Move",
      final: "final",
    },
    nessunSuggerimento: "No hero changes the team's passives in this slot.",
    cercoConsigli: "Looking for who fits…",
    calcoloNumeri: "Working out the first-turn numbers…",
    primaUnEroe: "Pick another hero first: suggestions look at the teammates it has.",
    passivaDi: (tipo: string, nome: string) => `${nome}'s ${tipo}`,
    accendeLe: "Turns on",
    faCrescere: "Grows",
    arrivaA: "Gives teammates",
    scattaCon: "Triggered by teammates",
    riceveLe: "Receives",
    spegneLe: "Turns off",
    perche2: "The game's sentences",
    legami: "Its bonds",
    legamiSpiega: "The heroes it has a bond Association Effect with (at UR grade).",
    nessunLegame: "No bonds: with any associate the common Association Effect applies.",
    tutti: (n: number) => `All heroes (${n})`,
    risultati: (n: number, di: number) => `${n} of ${di}`,
    nessuno: "No hero found.",
    griglia: "The full hero grid",
    vuota: "Choose the heroes: click a slot above. The team is saved in the page address and in this browser.",
    resoconto: "How they affect each other",
    riepilogo: (dati: number, accesi: number) =>
      `${dati} effects go to teammates, ${accesi} passives lit by teammates`,
    condTutti: (ok: number, ko: number) => `«all» conditions: ${ok} met, ${ko} broken`,
    specialiSpente: (n: number) => (n === 1 ? "1 special ability off" : `${n} special abilities off`),
    lePassive: "Its passives",
    riceve: "Receives from teammates",
    faScattare: "Lights the passives of",
    niente: "Nothing.",
    nessunaPerCompagni: "Names no teammates: it applies to the hero itself or against enemies.",
    tipo: { unique: "Unique", relic: "Holy Relic", special: "Special ability" },
    accesa: "on",
    spenta: "off",
    perche: {
      content: "doesn't apply where you play",
      bench: "on the bench: activates when it enters the field",
      fromBench: "applies only when entering from the Sub slot",
      relics: "relics off",
      leftmost: (nome: string) => `${nome}'s applies, further left`,
      condition: "the «all» condition isn't met",
      nobody: "nobody in the team triggers it",
    },
    vaA: "Goes to",
    nessunCompagno: "no teammate on the field",
    soloSe: "named by the sentence",
    ogni: "Grows for each",
    quando: "Triggers when acting:",
    se: "If on the field there is",
    tuttiSono: "If everyone on the field is",
    inCampoN: (n: number) => `${n} on the field`,
    dueParti: "It also applies to your team, not only to enemies.",
    conPanchina: "The Sub slot counts too.",
    tranneSe: "The hero itself doesn't count.",
    razzaAggiunta: (razze: string) => `Also counts as ${razze}.`,
    ancheCome: (razze: string) => `also counts as ${razze}`,
    inPanchinaTag: "on the bench",
    inglese: "",
    da: (nome: string) => `from ${nome}`,
    allaPassivaDi: (nome: string) => nome,
    regole: "Special ability rules",
    lucOsc: "Light and Darkness team effects",
    luce: (pct: number, altri: number) =>
      `Light: Light allies take ${pct}% less damage from anyone who isn't Light, the other allies ${altri}% less from enemies at a disadvantage.`,
    oscurita: (pct: number, altri: number) =>
      `Darkness: Darkness allies deal ${pct}% more damage to anyone who isn't Darkness, the other allies ${altri}% more when they have the attribute advantage.`,
    nonSiSomma: "doesn't stack: the first one applies",
    associati: "The associates",
    legame: "Bond Association Effect (UR grade)",
    comune: (base: number, max: number) =>
      `No bond: the common Association Effect applies, ${base}% to ${max}% of the associate's Attack, Defense and HP depending on its Ultimate Move rank.`,
    combinato: "Combined Attack",
    chi: {
      allies: "all allies",
      differentRaces: "all different races",
      sameRace: "of the same race",
      unity: "with a Unity",
      group: "Applicable Allies",
      attribute: (nomi: string) => `${nomi} attribute`,
    },
    o: " or ",
  },
});

export type Texts = (typeof TESTI)[Locale];

/** Chi nomina una frase, in parole: «Fate o Giganti», «alleati applicabili: Fate e Giganti». */
export function describeWho(who: TeamWho, data: BuilderData, group: HeroTermGroup | null, locale: Locale): string {
  const t = TESTI[locale];
  const parts: string[] = [];
  if (who.allies) parts.push(t.chi.allies);
  if (who.group) {
    const rule = group ? inLingua(group.definition, locale) : null;
    parts.push(rule ? `${t.chi.group} (${rule})` : t.chi.group);
  }
  for (const race of who.races ?? []) parts.push(data.labels.race[race] ?? String(race));
  for (const faction of who.factions ?? []) parts.push(data.labels.faction[faction] ?? String(faction));
  if (who.attributes?.length) {
    parts.push(t.chi.attribute(who.attributes.map((a) => data.labels.attribute[a] ?? String(a)).join(t.o)));
  }
  for (const character of who.characters ?? []) {
    const hero = data.heroes.find((h) => h.group === character);
    parts.push(hero?.name ?? character);
  }
  if (who.differentRaces) parts.push(t.chi.differentRaces);
  if (who.sameRace) parts.push(t.chi.sameRace);
  const text = parts.join(t.o);
  return who.unity ? `${text} ${t.chi.unity}` : text;
}

export function conditionLabel(condition: TeamCondition, t: Texts): string {
  return { each: t.ogni, when: t.quando, if: t.se, all: t.tuttiSono }[condition.kind];
}

export function offLabel(off: OffReason, t: Texts, by: string | null): string {
  if (off === "leftmost") return t.perche.leftmost(by ?? "?");
  return t.perche[off];
}

/** Il nome di un totale: «Danni inflitti», «Danni inflitti con attacchi a tutti», «Danni subiti finali». */
export function statLabel(key: TotalKey, t: Texts): string {
  const [stat, variant] = key.split(":") as [TeamStat, keyof Texts["variante"] | undefined];
  return variant ? `${t.stat[stat]} ${t.variante[variant]}` : t.stat[stat];
}

/** Un numero come lo scrive la pagina: «+15%», «−7,5%». */
export function formatPercent(value: number, locale: Locale): string {
  const number = Math.abs(value).toLocaleString(locale === "it" ? "it-IT" : "en-US", { maximumFractionDigits: 1 });
  return `${value > 0 ? "+" : value < 0 ? "−" : ""}${number}%`;
}

// I gruppi come li scrive il gioco, dal piu' largo: «Statistiche di base» invece di
// «Attacco, Difesa, PS». Gli stessi di data/grand-cross/concetti/statistiche.json
const STAT_GROUPS: readonly (readonly [keyof Texts["gruppoStat"], readonly TeamStat[]])[] = [
  [
    "tutte",
    ["atk", "fixed_atk_per", "crit_per", "crit_atk_per", "def", "fixed_def_per", "crit_res_per", "crit_def_per", "hp", "hp_regen_per", "hp_recovery_per", "hp_steal_per"],
  ],
  ["attacco", ["atk", "fixed_atk_per", "crit_per", "crit_atk_per"]],
  ["difesa", ["def", "fixed_def_per", "crit_res_per", "crit_def_per"]],
  ["ps", ["hp", "hp_regen_per", "hp_recovery_per", "hp_steal_per"]],
  ["base", ["atk", "def", "hp"]],
];

/**
 * Un numero di battaglia come lo mostra il gioco: intero e troncato («55.851»).
 * Sui nove numeri della battaglia dell'utente dell'11/11 il troncamento torna in
 * sette, l'arrotondamento in due (simulatore, NOTE.md par. 6).
 */
export function formatWhole(value: number, locale: Locale): string {
  return Math.floor(value + 1e-6).toLocaleString(locale === "it" ? "it-IT" : "en-US");
}

const FLAT_BATTLE = new Set<TeamStat>(["atk", "def", "hp"]);

/**
 * Un cambiamento in parole. Su Attacco, Difesa e PS il gioco moltiplica («×1,12»)
 * o somma un numero («+6.478», la Reliquia di Escanor: meta' della Difesa); sulle
 * altre statistiche somma punti («+14%»). Si legge dal prima e dopo, che sono
 * quelli del gioco; il modo dice solo se e' una moltiplicazione.
 */
export function changeText(change: BattleChange, locale: Locale): string {
  const loc = locale === "it" ? "it-IT" : "en-US";
  if (FLAT_BATTLE.has(change.stat)) {
    if (change.mode.includes("per") && change.before !== 0) {
      return `×${(change.after / change.before).toLocaleString(loc, { maximumFractionDigits: 3 })}`;
    }
    const delta = change.after - change.before;
    return `${delta < 0 ? "−" : "+"}${formatWhole(Math.abs(delta), locale)}`;
  }
  // prima e dopo sono gia' in punti (team-sim.ts li porta da frazione a punti)
  return formatPercent(Math.round((change.after - change.before) * 10) / 10, locale);
}

/**
 * Cosa ha fatto una passiva a un eroe, in una riga: le statistiche con gli stessi
 * cambiamenti insieme, coi nomi dei gruppi del gioco. «Statistiche di base ×1,12 ·
 * ×1,09» e' l'Unica di Escanor sul suo Escanor: due moltiplicazioni, nell'ordine del
 * gioco.
 */
export function battlePartLine(changes: readonly BattleChange[], t: Texts, locale: Locale): string {
  const byStat = new Map<TeamStat, string[]>();
  for (const change of changes) byStat.set(change.stat, [...(byStat.get(change.stat) ?? []), changeText(change, locale)]);
  const byTexts = new Map<string, TeamStat[]>();
  for (const [stat, texts] of byStat) {
    const key = texts.join(" · ");
    byTexts.set(key, [...(byTexts.get(key) ?? []), stat]);
  }
  return [...byTexts.entries()].map(([texts, stats]) => `${statsPhrase(stats, t)} ${texts}`).join("; ");
}

/** Un insieme di statistiche in parole, coi nomi dei gruppi del gioco dove si puo'. */
function statsPhrase(keys: readonly TotalKey[], t: Texts): string {
  const left = new Set<TotalKey>(keys);
  const out: string[] = [];
  for (const [name, members] of STAT_GROUPS) {
    if (members.every((stat) => left.has(stat))) {
      for (const stat of members) left.delete(stat);
      out.push(t.gruppoStat[name]);
    }
  }
  for (const key of left) out.push(statLabel(key, t));
  return out.join(", ");
}

/** Le statistiche fuori dalle cinque di testa, coi valori uguali insieme: «Tutte le altre statistiche +28%». */
export function otherStatsLine(totals: readonly { key: TotalKey; value: number }[], t: Texts, locale: Locale): string {
  const others = STAT_GROUPS[0]![1].filter((stat) => !MAIN_STATS.includes(stat));
  const byValue = new Map<number, TotalKey[]>();
  for (const { key, value } of totals) byValue.set(value, [...(byValue.get(value) ?? []), key]);
  return [...byValue.entries()]
    .map(([value, keys]) => {
      const everyOther = others.every((stat) => keys.includes(stat));
      const rest = keys.filter((key) => !everyOther || !others.includes(key as TeamStat));
      const label = [...(everyOther ? [t.altreStat] : []), ...rest.map((key) => statLabel(key, t))].join(", ");
      return `${label} ${formatPercent(value, locale)}`;
    })
    .join(" · ");
}

/** Cosa cambia per un eroe mettendone un altro in un posto: un pezzo per valore. */
export interface NumberLine {
  readonly hero: string;
  readonly parts: readonly { readonly text: string; readonly bad: boolean }[];
}

/**
 * Cosa cambia nei numeri mettendo un eroe in un posto, una riga per eroe, solo le
 * cinque statistiche di testa: «Joker: Statistiche di base +35,7%, Danni subiti −60%».
 * Il resto si legge nel resoconto, una volta scelto. Prima i compagni, poi lui.
 */
export function numberLines(changes: readonly NumberChange[], candidate: string, t: Texts, locale: Locale): NumberLine[] {
  const perHero = new Map<string, Map<number, TotalKey[]>>();
  for (const change of changes) {
    if (!MAIN_STATS.includes(change.key as TeamStat)) continue;
    const byDelta = perHero.get(change.hero) ?? new Map<number, TotalKey[]>();
    byDelta.set(change.delta, [...(byDelta.get(change.delta) ?? []), change.key]);
    perHero.set(change.hero, byDelta);
  }
  const lines = [...perHero.entries()].map(([hero, byDelta]) => ({
    hero,
    parts: [...byDelta.entries()].map(([delta, keys]) => ({
      text: `${statsPhrase(keys, t)} ${formatPercent(delta, locale)}`,
      // per i danni subiti scendere e' un guadagno
      bad: keys.every((key) => key === "dmg_taken") ? delta > 0 : delta < 0,
    })),
  }));
  return [...lines.filter((line) => line.hero !== candidate), ...lines.filter((line) => line.hero === candidate)];
}

/** Il nome di un posto: «Eroe 2», o «Slot secondario» per il quarto in panchina. */
export function slotLabel(slot: number, bench: boolean, t: Texts): string {
  return bench && slot === 3 ? t.panchina : t.posto(slot + 1);
}
