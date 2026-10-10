/**
 * Le parole della pagina Squadra: come si dice chi nomina una frase, perche' una
 * passiva e' spenta, cosa chiede una condizione. Pure, nelle due lingue, usate
 * dal costruttore e dal resoconto (componenti client) e dai loro test.
 */

import type { HeroFatesIndex } from "@/lib/games/hero-fates-types";
import type { HeroTermGroup } from "@/lib/games/hero-terms-types";
import type { MechanicsTeamEffect } from "@/lib/games/mechanics-types";
import type { OffReason, TeamHero } from "@/lib/games/team";
import type { TeamCondition, TeamContent, TeamIndex, TeamWho } from "@/lib/games/team-types";
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
      campo: "Tutti e quattro in campo, come nei boss e nelle Bestie demoniache",
      panchina: "Tre in campo e il quarto nello slot secondario, come nella storia e nel PvP normale",
    },
    ultimate: "Mossa finale",
    ultimateTitolo: (n: number) => `Mossa finale al rango ${n}: alcune Uniche cambiano col rango`,
    reliquie: "Reliquie sacre",
    si: "Sì",
    no: "No",
    reliquieTitolo: { si: "Con le Reliquie sacre create", no: "Senza Reliquie sacre" },
    copia: "Copia il link",
    copiato: "Copiato",
    svuota: "Svuota",
    posto: (n: number) => `Eroe ${n}`,
    panchina: "Slot secondario",
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
      "Contati sulle passive: quanti effetti in più vanno ai compagni, quante passive in più si accendono, le condizioni «tutti» rispettate o rotte.",
    nessunSuggerimento: "Nessun eroe aggiunge legami fra le passive in questo posto.",
    legami: "I suoi legami",
    legamiSpiega: "Gli eroi con cui ha un Effetto associazione del legame (al grado UR).",
    nessunLegame: "Nessun legame: con qualunque associato vale l'Effetto associazione comune.",
    tutti: (n: number) => `Tutti gli eroi (${n})`,
    risultati: (n: number, di: number) => `${n} di ${di}`,
    nessuno: "Nessun eroe trovato.",
    griglia: "La griglia completa degli eroi",
    guadagno: (n: number) => `+${n}`,
    guadagnoTitolo: (n: number) => `${n} legami in più fra le passive`,
    daA: (n: number) => (n === 1 ? "dà a 1 compagno" : `dà a ${n} compagni`),
    riceveDa: (n: number) => (n === 1 ? "riceve da 1" : `riceve da ${n}`),
    accende: (n: number) => (n === 1 ? "accende 1 passiva" : `accende ${n} passive`),
    accesoDa: (n: number) => (n === 1 ? "acceso da 1" : `acceso da ${n}`),
    vuota: "Scegli gli eroi: clicca un posto qui sopra. La squadra si salva nell'indirizzo della pagina e in questo browser.",
    // il resoconto
    resoconto: "Come si influenzano",
    riepilogo: (dati: number, accesi: number) =>
      `${dati} effetti vanno ai compagni · ${accesi} passive accese dai compagni`,
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
    copia: "Copy link",
    copiato: "Copied",
    svuota: "Clear",
    posto: (n: number) => `Hero ${n}`,
    panchina: "Sub slot",
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
      "Counted on the passives: how many more effects go to teammates, how many more passives light up, the «all» conditions met or broken.",
    nessunSuggerimento: "No hero adds links between passives in this slot.",
    legami: "Its bonds",
    legamiSpiega: "The heroes it has a bond Association Effect with (at UR grade).",
    nessunLegame: "No bonds: with any associate the common Association Effect applies.",
    tutti: (n: number) => `All heroes (${n})`,
    risultati: (n: number, di: number) => `${n} of ${di}`,
    nessuno: "No hero found.",
    griglia: "The full hero grid",
    guadagno: (n: number) => `+${n}`,
    guadagnoTitolo: (n: number) => `${n} more links between passives`,
    daA: (n: number) => (n === 1 ? "gives to 1 teammate" : `gives to ${n} teammates`),
    riceveDa: (n: number) => (n === 1 ? "receives from 1" : `receives from ${n}`),
    accende: (n: number) => (n === 1 ? "lights 1 passive" : `lights ${n} passives`),
    accesoDa: (n: number) => (n === 1 ? "lit by 1" : `lit by ${n}`),
    vuota: "Choose the heroes: click a slot above. The team is saved in the page address and in this browser.",
    resoconto: "How they affect each other",
    riepilogo: (dati: number, accesi: number) =>
      `${dati} effects go to teammates · ${accesi} passives lit by teammates`,
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

/** Il nome di un posto: «Eroe 2», o «Slot secondario» per il quarto in panchina. */
export function slotLabel(slot: number, bench: boolean, t: Texts): string {
  return bench && slot === 3 ? t.panchina : t.posto(slot + 1);
}
