import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { IconChevronRight } from "@/components/icons";
import { SectionIndex } from "@/components/section-index";
import { cx, display, eyebrow, HowItWorks, numeric, PageHeader } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { gameIconSrc, heroCardSrc, heroEpithet, heroName } from "@/lib/games/heroes";
import {
  baseDamage,
  critChance,
  critMultiplier,
  damageModifier,
  drawChances,
  handLimit,
  maxDefenseCut,
  smashWeight,
} from "@/lib/games/mechanics";
import type { StackingRule } from "@/lib/games/mechanics-types";
import { requireGameModule } from "@/lib/games/registry";
import { inLingua, intlLocale, testi, type Locale } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";

/**
 * Meccaniche di combattimento: come il gioco calcola un colpo, chi batte chi fra
 * gli attributi, come si pescano le carte, come si cumulano i buff.
 *
 * Richiesta dell'utente del 27/09: occuparsi delle meccaniche mai studiate; scelte
 * dell'utente: una pagina piu' le righe nelle schede eroe e nelle tendine, con
 * esempi fissi (il simulatore con gli slider e' rimandato). Le regole le ha lette la
 * pipeline nel codice del client (MECCANICHE_COMBATTIMENTO.md); qui arrivano i numeri
 * (`MechanicsIndex`), e ogni esempio e' calcolato con le funzioni di mechanics.ts:
 * se una patch cambia la configurazione, gli esempi cambiano con lei.
 */

const TESTI = testi({
  it: {
    titoloPagina: (gioco: string) => `Meccaniche di combattimento di ${gioco}`,
    descrizione: (gioco: string) =>
      `${gioco}: come il gioco calcola il danno di un colpo, chi batte chi fra gli attributi, come si pescano le carte e come si cumulano i buff. Letto nel codice del gioco.`,
    titolo: "Meccaniche di combattimento",
    introduzione: "Come il gioco calcola un colpo, chi batte chi fra gli attributi, come pesca le carte e come si cumulano i buff.",
    metodo:
      "Le regole sono lette nel codice del client del gioco, i numeri vengono dalla sua configurazione: gli esempi qui sotto sono calcolati con quelli.",
    fonte: "Fonte: il codice, la configurazione e le tabelle del client del gioco.",
    comeFunziona: "Da dove vengono regole e numeri",
    indice: "In questa pagina",
    sezioni: { danno: "Il danno", attributi: "Chi batte chi", pesca: "La pesca delle carte", cumulo: "Il cumulo dei buff" },

    dannoIntro: "Un colpo passa per sei passi, sempre in quest'ordine.",
    passi: "I passi del danno",
    passo: (n: number) => `Passo ${n}`,
    baseTitolo: "Il danno base",
    baseTesto:
      "Si parte dall'Attacco in battaglia dell'eroe (con i buff attivi) moltiplicato per la percentuale della carta: chiamiamolo A. La Difesa del bersaglio ne toglie una parte:",
    formula: (a: string, b: string) => `danno = A × (1 − ${b} × Difesa ÷ (A + ${a} × Difesa))`,
    formulaDanno: "danno",
    formulaDifesa: "Difesa",
    baseConseguenze: (tetto: string) =>
      `Due conseguenze. La Difesa non azzera mai un colpo: anche altissima toglie al massimo il ${tetto}. E pesa meno sui colpi grossi, perché A comprende già la percentuale della carta.`,
    baseEsempio: (atk: string, dif: string) => `Esempio: Attacco ${atk}, Difesa del bersaglio ${dif}.`,
    carta: "Carta",
    danno: "Danno base",
    tolto: "Tolto dalla Difesa",
    critTitolo: "Il critico",
    critTesto:
      "La probabilità è Possibilità critico dell'attaccante meno Resistenza critico del bersaglio. Se esce, il danno si moltiplica per 1 + Danno critico dell'attaccante − Difesa critico del bersaglio, mai meno di ×1: un critico non toglie mai danno. L'Amplificazione danni del Vero risveglio si somma anche al Danno critico.",
    critTiro: (p: string, vera: string) =>
      `Il gioco arrotonda la probabilità per eccesso al punto e tira un numero da 0 a 99: la probabilità vera ha un punto in più. Con ${p} netto si fa critico nel ${vera} dei colpi.`,
    critEsempio: (cd: string, def: string, m: string) =>
      `Esempio: Danno critico ${cd} contro Difesa critico ${def}: ×${m}. Con Difesa critico pari o superiore al Danno critico il critico vale ×1.`,
    incTitolo: "Aumenti e riduzioni del danno",
    incTesto: (minimo: string) =>
      `Tutti gli aumenti del danno si sommano in un numero solo: il vantaggio d'attributo, i buff e le passive «danni inflitti +%», l'Amplificazione danni del Vero risveglio. Lo stesso per le riduzioni: lo svantaggio d'attributo, «danni subiti −%», la Resistenza ai danni. Poi il danno si moltiplica per 1 + aumenti − riduzioni, e la differenza non scende mai sotto ${minimo}.`,
    incConseguenza:
      "Quindi non si moltiplicano fra loro: +30% di vantaggio e +50% di un buff fanno +80%, non +95%. E aumenti e riduzioni si compensano prima di toccare il danno.",
    aumenti: "Aumenti",
    riduzioni: "Riduzioni",
    fattore: "Fattore",
    esempiInc: ["Solo il vantaggio d'attributo", "Vantaggio e un buff da +50%", "Svantaggio e danni subiti −30%", "Riduzioni per il 150%"],
    varTitolo: "La varianza",
    varTesto: (valori: string) =>
      `Il danno si moltiplica per un fattore a caso fra ${valori}: dieci valori, mai 1,10. Il caso non è tirato al momento: il gioco scorre una lista di 5.000 numeri mescolati all'inizio della battaglia, e critico e varianza escono da lì.`,
    fissiTitolo: "Perforazione e Resistenza",
    fissiTesto:
      "Poi si aggiunge Perforazione × Attacco dell'attaccante e si toglie Resistenza × Difesa del bersaglio, tutti e due sulle statistiche senza i buff della battaglia: un buff d'Attacco non alza la Perforazione, un debuff di Difesa non abbassa la Resistenza. Non passano per critico, attributo, aumenti né varianza: si sommano e si tolgono piatte. Se il colpo scende sotto 1, fa 0.",
    finaleTitolo: "Gli ultimi passi",
    finaleTesto:
      "Si sommano i danni aggiuntivi di passive e carte («danni aggiuntivi pari al …»). Poi la riduzione del danno finale: se il bersaglio ne ha più d'una vale la più forte, non si sommano. Alla fine il danno si divide per il numero di colpi della carta: è il numero che compare a ogni colpo.",
    dotTesto:
      "I danni nel tempo (Veleno, Sanguinamento, Bruciatura…) non passano per niente di tutto questo: a ogni turno tolgono una percentuale dei PS del bersaglio o un valore fissato quando sono stati messi, senza Difesa, critico né attributo.",

    attrIntro: "Forza, PS e Velocità formano un triangolo. Luce e Oscurità ne stanno fuori.",
    batte: "batte",
    vantaggioTesto: (v: string, s: string) =>
      `In vantaggio, ${v} si somma agli aumenti del danno; in svantaggio, ${s} si somma alle riduzioni. Con altri effetti si sommano a loro (vedi il passo 3 del danno).`,
    vantaggioCalcolo: (piu: string, meno: string) => `Da soli: ×${piu} in vantaggio, ×${meno} in svantaggio.`,
    sempreTitolo: "Sempre in vantaggio",
    sempreTesto:
      "Due Reliquie sacre ignorano il triangolo. Con la «Spada della galassia di Ginnungagap» l'eroe colpisce sempre come in vantaggio. Con la «Spada di fuoco di Surtr» anche chi colpisce l'eroe è sempre in svantaggio.",
    luceTitolo: "Luce e Oscurità: effetti di squadra",
    luceTesto: (n: number) =>
      `Luce e Oscurità non hanno vantaggi né svantaggi. Ogni eroe Luce o Oscurità (${n} in tutto) dà invece un effetto alla squadra, che non si somma con quello di un secondo eroe dello stesso attributo:`,
    luce: (a: string, b: string) =>
      `Luce: gli alleati Luce subiscono il ${a} in meno da chi non è Luce; gli altri alleati il ${b} in meno dai nemici in svantaggio contro di loro.`,
    oscurita: (a: string, b: string) =>
      `Oscurità: gli alleati Oscurità infliggono il ${a} in più a chi non è Oscurità; gli altri alleati il ${b} in più quando sono in vantaggio.`,
    oscuritaNota:
      "Il testo del gioco dice che il secondo 10% dell'Oscurità vale contro i nemici «con attributi che sono forti contro i tuoi alleati». Il codice fa il contrario, e qui vale il codice.",

    pescaIntro: (n: number, a: number, b: number) =>
      `Non c'è un mazzo che si consuma. Ogni eroe in campo ha due voci: la sua carta A di Rango 1, con peso ${a}, e la sua carta B di Rango 1, con peso ${b}. Vale per tutti i ${n} eroi. A ogni pescata esce una voce a caso, in proporzione al peso, e resta disponibile.`,
    pescaPesiDiversi: "I pesi non sono uguali per tutti gli eroi: la tabella usa i più comuni.",
    eroiInCampo: "Eroi in campo",
    ogniA: "Ogni carta A",
    ogniB: "Ogni carta B",
    ogniEroe: "Ogni eroe",
    pescaSottoTabella: (a: string, b: string) =>
      `Presa una carta di un certo eroe, è la A nel ${a} dei casi e la B nel ${b}.`,
    manoTitolo: "La mano e il primo turno",
    manoTesto:
      "A inizio turno la mano si rabbocca: le carte non usate restano e si pesca la differenza. Al primo turno le carte A e B di Rango 1 di ogni eroe in campo sono garantite, e il resto è a caso. Le carte di Rango 2 e 3 non si pescano mai: nascono fondendo due carte uguali vicine. La Mossa finale non si pesca: entra in mano all'inizio del turno dopo che la barra si è riempita, e occupa un posto.",
    eroiRimasti: "Eroi con carte",
    conPanchina: "Squadra con panchina",
    tuttiInCampo: "Tutti in campo",
    manoNota: "Squadra con panchina: storia, PvP normale. Tutti in campo: boss, Re Demone, Divinità Suprema, Bestie demoniache, PvP «tutti gli eroi».",
    smashTitolo: "PvP Smash",
    smashTesto: (serie: string) =>
      `Nel PvP Smash una carta appena pescata pesa meno per il resto dello stesso rabbocco: la carta A scende ${serie}. Al turno dopo torna al peso pieno.`,

    cumuloIntro:
      "Due buff sono «lo stesso» se hanno lo stesso effetto nel gioco, chiunque li dia: due eroi diversi, due carte dello stesso eroe o la stessa carta rilanciata sono lo stesso caso.",
    regole: {
      piu_forte:
        "Resta il più forte. È la regola della grande maggioranza dei buff: un secondo buff più debole viene scartato, uno più forte prende il posto del primo, e a parità di valore si rinnova la durata.",
      piu_basso: "Resta quello col valore più basso: vale per i tetti ai danni subiti, dove il tetto più basso protegge di più.",
      accumula: "Si accumula: ogni applicazione conta a parte, col suo tempo, e i valori si sommano, fino all'«Accumulo massimo».",
      cariche: "Cariche: si sommano fino al tetto, senza rinnovare la durata.",
    } satisfies Record<StackingRule, string>,
    accumulanoTitolo: "I buff che si accumulano",
    effetto: "Effetto",
    fino: "Fino a",
    carte: "Carte",
    senzaTetto: "senza tetto",
    volte: (n: number) => `${n} volte`,
    cumuloNotaNomi:
      "Lo stesso nome può avere regole diverse su carte diverse: la tendina di ogni parola blu nelle schede degli eroi dice quali.",
    durataTitolo: "La durata",
    durataTesto:
      "I buff perdono un turno all'inizio del turno della squadra che li porta, i debuff alla fine. Un buff di 1 turno dato nel tuo turno copre quindi il turno nemico e sparisce quando torna il tuo; un debuff di 1 turno messo su un nemico dura tutto il suo turno. Un buff con durata −1 resta finché qualcosa non lo toglie.",
    statTitolo: "Buff diversi sulla stessa statistica",
    statTesto:
      "Su Attacco, Difesa e PS buff diversi si moltiplicano, anche con le passive: Aumento Attacco 30% e Aumento statistiche relative all'Attacco 50% fanno ×1,3 × 1,5 = ×1,95. Sulle statistiche in percentuale (critico, Perforazione, Resistenza…) si sommano. «Statistiche relative all'Attacco +50%» vuol dire Attacco ×1,5 e +50 punti di Perforazione, Possibilità critico e Danno critico; lo stesso per Difesa e PS coi loro gruppi.",
    statMinimo: (p: string) => `Attacco, Difesa e PS non scendono mai sotto il ${p} di quelli d'inizio battaglia, e nessuna statistica scende sotto zero.`,
    caricheTitolo: "Le cariche delle passive",
    caricheTesto:
      "Le passive che crescono (una carica per evento) partono da un valore e si fermano al loro «Limite N volte»; l'effetto è il valore per le cariche. Quasi tutte le Uniche invece hanno un valore fisso.",

    eroiLink: "Vai agli eroi",
    diritti: (editore: string) => `Nomi e immagini appartengono a ${editore} e sono qui a scopo di consultazione.`,
  },
  en: {
    titoloPagina: (gioco: string) => `${gioco} Combat Mechanics`,
    descrizione: (gioco: string) =>
      `${gioco}: how the game computes the damage of a hit, which attribute beats which, how cards are drawn and how buffs stack. Read in the game's code.`,
    titolo: "Combat mechanics",
    introduzione: "How the game computes a hit, which attribute beats which, how it draws cards and how buffs stack.",
    metodo:
      "The rules are read in the game client's code and the numbers come from its configuration: the examples below are computed with them.",
    fonte: "Source: the game client's code, configuration and tables.",
    comeFunziona: "Where the rules and numbers come from",
    indice: "On this page",
    sezioni: { danno: "Damage", attributi: "Who beats whom", pesca: "Card draws", cumulo: "Buff stacking" },

    dannoIntro: "A hit goes through six steps, always in this order.",
    passi: "Damage steps",
    passo: (n: number) => `Step ${n}`,
    baseTitolo: "Base damage",
    baseTesto:
      "It starts from the hero's Attack in battle (with active buffs) times the card's percentage: call it A. The target's Defense removes part of it:",
    formula: (a: string, b: string) => `damage = A × (1 − ${b} × Defense ÷ (A + ${a} × Defense))`,
    formulaDanno: "damage",
    formulaDifesa: "Defense",
    baseConseguenze: (tetto: string) =>
      `Two consequences. Defense never cancels a hit: even very high it removes at most ${tetto}. And it weighs less on big hits, because A already includes the card's percentage.`,
    baseEsempio: (atk: string, dif: string) => `Example: Attack ${atk}, target Defense ${dif}.`,
    carta: "Card",
    danno: "Base damage",
    tolto: "Removed by Defense",
    critTitolo: "Critical hits",
    critTesto:
      "The chance is the attacker's Crit Chance minus the target's Crit Resistance. On a crit the damage is multiplied by 1 + the attacker's Crit Damage − the target's Crit Defense, never below ×1: a crit never removes damage. True Awakening's Damage Amplification is also added to Crit Damage.",
    critTiro: (p: string, vera: string) =>
      `The game rounds the chance up to the point and rolls a number from 0 to 99: the real chance is one point higher. With a net ${p}, ${vera} of hits crit.`,
    critEsempio: (cd: string, def: string, m: string) =>
      `Example: Crit Damage ${cd} against Crit Defense ${def}: ×${m}. With Crit Defense equal to or above Crit Damage a crit is worth ×1.`,
    incTitolo: "Damage increases and decreases",
    incTesto: (minimo: string) =>
      `All damage increases add up into a single number: attribute advantage, «damage dealt +%» buffs and passives, True Awakening's Damage Amplification. Same for decreases: attribute disadvantage, «damage taken −%», Damage Resistance. Then the damage is multiplied by 1 + increases − decreases, and the difference never goes below ${minimo}.`,
    incConseguenza:
      "So they don't multiply each other: +30% advantage and a +50% buff make +80%, not +95%. And increases and decreases cancel out before touching the damage.",
    aumenti: "Increases",
    riduzioni: "Decreases",
    fattore: "Factor",
    esempiInc: ["Attribute advantage only", "Advantage and a +50% buff", "Disadvantage and damage taken −30%", "Decreases worth 150%"],
    varTitolo: "Variance",
    varTesto: (valori: string) =>
      `The damage is multiplied by a random factor among ${valori}: ten values, never 1.10. The randomness isn't rolled on the spot: the game walks a list of 5,000 numbers shuffled at the start of the battle, and crits and variance come from it.`,
    fissiTitolo: "Pierce Rate and Resistance",
    fissiTesto:
      "Then the attacker's Pierce Rate × Attack is added and the target's Resistance × Defense is removed, both on the stats without in-battle buffs: an Attack buff doesn't raise Pierce, a Defense debuff doesn't lower Resistance. They skip crits, attributes, increases and variance: they are added and removed flat. If the hit drops below 1, it deals 0.",
    finaleTitolo: "The last steps",
    finaleTesto:
      "Additional damage from passives and cards («additional damage equal to …») is added. Then the final damage reduction: if the target has more than one, the strongest applies, they don't add up. Finally the damage is divided by the card's number of hits: that is the number shown on each hit.",
    dotTesto:
      "Damage over time (Poison, Bleed, Burn…) goes through none of this: every turn it removes a percentage of the target's HP or a value fixed when it was applied, with no Defense, crit or attribute.",

    attrIntro: "Strength, HP and Speed form a triangle. Light and Darkness sit outside it.",
    batte: "beats",
    vantaggioTesto: (v: string, s: string) =>
      `With the advantage, ${v} is added to the damage increases; with the disadvantage, ${s} is added to the decreases. They add to the other effects (see damage step 3).`,
    vantaggioCalcolo: (piu: string, meno: string) => `On their own: ×${piu} with the advantage, ×${meno} with the disadvantage.`,
    sempreTitolo: "Always advantaged",
    sempreTesto:
      "Two Holy Relics ignore the triangle. With «Ginnungagap's Galaxy Sword» the hero always hits as if advantaged. With «Surtr's Flaming Sword» whoever hits the hero is also always disadvantaged.",
    luceTitolo: "Light and Darkness: team effects",
    luceTesto: (n: number) =>
      `Light and Darkness have no advantages or disadvantages. Every Light or Darkness hero (${n} in all) instead gives the team an effect, which doesn't stack with a second hero of the same attribute:`,
    luce: (a: string, b: string) =>
      `Light: Light allies take ${a} less damage from anyone who isn't Light; the other allies take ${b} less from enemies at a disadvantage against them.`,
    oscurita: (a: string, b: string) =>
      `Darkness: Darkness allies deal ${a} more to anyone who isn't Darkness; the other allies deal ${b} more when they have the advantage.`,
    oscuritaNota:
      "The game's text says Darkness's second 10% applies against enemies «with attributes that are strong against your allies». The code does the opposite, and here the code wins.",

    pescaIntro: (n: number, a: number, b: number) =>
      `There is no deck that runs out. Every hero on the field has two entries: their Rank 1 card A, weight ${a}, and their Rank 1 card B, weight ${b}. This holds for all ${n} heroes. Each draw picks an entry at random, by weight, and it stays available.`,
    pescaPesiDiversi: "The weights aren't the same for every hero: the table uses the most common ones.",
    eroiInCampo: "Heroes on the field",
    ogniA: "Each card A",
    ogniB: "Each card B",
    ogniEroe: "Each hero",
    pescaSottoTabella: (a: string, b: string) => `Given a card of a certain hero, it is the A ${a} of the time and the B ${b}.`,
    manoTitolo: "The hand and the first turn",
    manoTesto:
      "At the start of a turn the hand is topped up: unused cards stay and only the difference is drawn. On the first turn the Rank 1 A and B cards of every hero on the field are guaranteed, and the rest is random. Rank 2 and 3 cards are never drawn: they come from merging two equal adjacent cards. The Ultimate Move isn't drawn: it enters the hand at the start of the turn after the gauge fills, and takes a slot.",
    eroiRimasti: "Heroes with cards",
    conPanchina: "Team with a bench",
    tuttiInCampo: "All on the field",
    manoNota: "Team with a bench: story, normal PvP. All on the field: bosses, Demon King, Supreme Deity, Demonic Beasts, «all heroes» PvP.",
    smashTitolo: "PvP Smash",
    smashTesto: (serie: string) =>
      `In PvP Smash a card just drawn weighs less for the rest of the same top-up: card A drops ${serie}. The next turn it's back to full weight.`,

    cumuloIntro:
      "Two buffs are «the same» if they have the same effect in the game, whoever gives them: two different heroes, two cards of the same hero or the same card used again are the same case.",
    regole: {
      piu_forte:
        "The strongest stays. This is the rule of the vast majority of buffs: a second weaker buff is discarded, a stronger one replaces the first, and at equal value the duration is refreshed.",
      piu_basso: "The lowest value stays: it applies to caps on damage taken, where the lower cap protects more.",
      accumula: "It stacks: every application counts on its own, with its own timer, and the values add up, up to the «Max Stack».",
      cariche: "Charges: they add up to the cap, without refreshing the duration.",
    } satisfies Record<StackingRule, string>,
    accumulanoTitolo: "The buffs that stack",
    effetto: "Effect",
    fino: "Up to",
    carte: "Cards",
    senzaTetto: "no cap",
    volte: (n: number) => `${n} times`,
    cumuloNotaNomi:
      "The same name can have different rules on different cards: the popover of each blue word on the hero pages says which.",
    durataTitolo: "Duration",
    durataTesto:
      "Buffs lose a turn at the start of the turn of the team carrying them, debuffs at the end. So a 1-turn buff given on your turn covers the enemy turn and disappears when yours comes back; a 1-turn debuff put on an enemy lasts their whole turn. A buff with duration −1 stays until something removes it.",
    statTitolo: "Different buffs on the same stat",
    statTesto:
      "On Attack, Defense and HP different buffs multiply, passives included: Attack Increase 30% and Attack-related Stats Increase 50% make ×1.3 × 1.5 = ×1.95. On percentage stats (crit, Pierce, Resistance…) they add up. «Attack-related Stats +50%» means Attack ×1.5 and +50 points of Pierce Rate, Crit Chance and Crit Damage; the same for Defense and HP with their groups.",
    statMinimo: (p: string) => `Attack, Defense and HP never drop below ${p} of their start-of-battle values, and no stat drops below zero.`,
    caricheTitolo: "Passive charges",
    caricheTesto:
      "Passives that grow (one charge per event) start from a value and stop at their «Limit N times»; the effect is the value times the charges. Almost all Uniques instead have a fixed value.",

    eroiLink: "Go to the heroes",
    diritti: (editore: string) => `Names and images belong to ${editore} and are here for reference.`,
  },
});

interface Props {
  params: Promise<{ game: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game } = await params;
  const t = TESTI[await getLocale()];
  const entry = findGame(game);
  return { title: t.titoloPagina(entry?.shortName ?? game), description: t.descrizione(entry?.name ?? game) };
}

const numero = (n: number, locale: Locale, decimali = 0) =>
  n.toLocaleString(intlLocale(locale), {
    useGrouping: "always",
    minimumFractionDigits: decimali,
    maximumFractionDigits: decimali,
  });
const percento = (x: number, locale: Locale, decimali = 0) => `${numero(x * 100, locale, decimali)}%`;

const SEZIONI = ["danno", "attributi", "pesca", "cumulo"] as const;

export default async function MechanicsPage({ params }: Props) {
  const { game } = await params;
  const entry = findGame(game);
  if (!entry) notFound();
  const gameModule = requireGameModule(game);
  const data = gameModule.mechanics;
  if (!data) notFound();

  const locale = await getLocale();
  const t = TESTI[locale];
  const { config, code } = data;
  const say = (value: Parameters<typeof inLingua>[0]) => inLingua(value, locale) ?? "";
  const heroes = gameModule.roster?.heroes ?? [];
  const attributeName = (c: number) => say(gameModule.heroContext?.codes.attribute[String(c)]) || String(c);
  const hasAttributeIcon = (c: number) => gameModule.icons?.attributo?.includes(String(c)) ?? false;

  // Esempio del danno base: 10.000 di Attacco contro 5.000 di Difesa.
  const ATK = 10000;
  const DEF = 5000;
  const cards = [1, 2, 3, 5].map((m) => {
    const damage = baseDamage(ATK * m, DEF, config);
    return { percent: m, damage, cut: 1 - damage / (ATK * m) };
  });
  const incExamples: [number, number][] = [
    [config.advantage, 0],
    [config.advantage + 0.5, 0],
    [0, config.disadvantage + 0.3],
    [0, 1.5],
  ];

  // La pesca: i pesi piu' comuni e se sono di tutti.
  const pairs = new Map<string, number>();
  for (const [a, b] of Object.values(data.draw)) pairs.set(`${a}/${b}`, (pairs.get(`${a}/${b}`) ?? 0) + 1);
  const [common] = [...pairs].sort((x, y) => y[1] - x[1]);
  const [weightA, weightB] = (common?.[0] ?? "60/40").split("/").map(Number) as [number, number];
  const oneWeight = pairs.size === 1;

  const withEffect = heroes.filter((hero) => data.teamEffects[hero.id]);
  const light = Object.values(data.teamEffects).find((e) => e.light)?.light;
  const dark = Object.values(data.teamEffects).find((e) => e.dark)?.dark;
  const stacking = Object.entries(data.stacking)
    .flatMap(([key, rules]) =>
      rules
        .filter((rule) => rule.rule === "accumula")
        .map((rule) => ({ key, name: say(gameModule.heroTerms?.concepts[key]?.label) || key, ...rule })),
    )
    .sort((x, y) => y.cards - x.cards || x.name.localeCompare(y.name));

  const triangle = Object.entries(code.beats).map(([strong, weak]) => [Number(strong), weak] as const);
  const smash = [0, 1, 2, 3, 4].map((n) => smashWeight(weightA, n, config)).join(" → ");

  const Attr = ({ c }: { c: number }) => (
    <span className="inline-flex items-center gap-1.5 font-semibold">
      {hasAttributeIcon(c) ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={gameIconSrc(game, "attributo", c)} alt="" width={22} height={22} className="h-[22px] w-[22px]" />
      ) : null}
      {attributeName(c)}
    </span>
  );
  const STEPS = [t.baseTitolo, t.critTitolo, t.incTitolo, t.varTitolo, t.fissiTitolo, t.finaleTitolo];
  // Il numero del passo grande a sinistra, non un'etichetta sopra il titolo: e'
  // quello che si cerca scorrendo, e «Passo 3» resta detto ai lettori di schermo.
  // Sul telefono il testo prende tutta la larghezza, sotto numero e titolo: in
  // colonna accanto al numero la formula non ci stava.
  const Step = ({ n, children }: { n: number; children: React.ReactNode }) => (
    <li
      id={`danno-${n}`}
      className="grid scroll-mt-[120px] grid-cols-[34px_minmax(0,1fr)] items-center gap-x-3 border-t border-rule-2 pt-6 first:border-t-0 first:pt-0 sm:grid-cols-[56px_minmax(0,1fr)] sm:items-start sm:gap-x-4 xl:scroll-mt-[85px]"
    >
      <span aria-hidden className={cx(display, "text-[34px] leading-none sm:row-span-2 sm:text-[44px]")}>
        {n}
      </span>
      <h3 className={cx(display, "m-0 text-[19px]")}>
        <span className="sr-only">{t.passo(n)}: </span>
        {STEPS[n - 1]}
      </h3>
      <div className="col-span-2 mt-2.5 grid min-w-0 max-w-[48ch] gap-2.5 text-[14px] leading-relaxed text-ink-2 sm:col-span-1 sm:col-start-2">
        {children}
      </div>
    </li>
  );
  const SubTitle = ({ children }: { children: React.ReactNode }) => (
    <h3 className={cx(display, "m-0 mt-10 text-[19px]")}>{children}</h3>
  );
  const box = "overflow-x-auto border border-rule bg-paper";
  const th = cx(eyebrow, "px-3 py-2 font-medium");
  const td = cx(numeric, "px-3 py-1.5 text-right");
  const section = "mt-16 scroll-mt-[120px] border-t border-rule pt-10 xl:scroll-mt-[85px]";
  const lead = "m-0 mt-2.5 max-w-[48ch] text-[15px] leading-relaxed text-ink-2";
  const prose = "grid max-w-[48ch] gap-2.5 text-[14px] leading-relaxed text-ink-2";
  const note = "m-0 text-[13px] text-ink-3";

  return (
    <main className="pt-6 pb-20">
      <Breadcrumb items={[{ label: entry.shortName, href: `/${game}` }, { label: t.titolo }]} />

      {/* il titolo e una riga; da dove vengono regole e numeri in «Come funziona» (10/10) */}
      <PageHeader title={t.titolo}>
        <p>{t.introduzione}</p>
      </PageHeader>
      <HowItWorks summary={t.comeFunziona} className="mb-6">
        <p>{t.metodo}</p>
        <p>{t.fonte}</p>
      </HowItWorks>

      {/*
        L'indice e' fermo: sul telefono una fila sotto l'intestazione, dai 1280 px
        una colonna a destra. Nella griglia viene prima del testo, cosi' sul
        telefono sta in cima.
      */}
      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_210px] xl:gap-x-12">
        <SectionIndex
          rail
          label={t.indice}
          entries={SEZIONI.map((id) => ({ id, label: t.sezioni[id] }))}
          className="xl:col-start-2 xl:row-start-1"
        />

        <div className="min-w-0 xl:col-start-1 xl:row-start-1">
          {/* ------------------------------------------------------------ danno */}
          <section id="danno" className="scroll-mt-[120px] xl:scroll-mt-[85px]">
            <h2 className={cx(display, "text-[30px]")}>{t.sezioni.danno}</h2>
            <p className={lead}>{t.dannoIntro}</p>
            {/* i sei passi in fila, prima del dettaglio: l'ordine si vede in un colpo d'occhio */}
            <ol aria-label={t.passi} className="m-0 mt-5 grid list-none grid-cols-2 gap-1.5 p-0 sm:grid-cols-3 2xl:grid-cols-6">
              {STEPS.map((title, position) => (
                <li key={title} className="min-w-0">
                  <a
                    href={`#danno-${position + 1}`}
                    className="group flex h-full min-h-11 items-center gap-2.5 border border-rule bg-paper-2 px-3 py-2 transition-colors hover:border-ink-3"
                  >
                    <span className="font-display text-[22px] font-black leading-none text-brand-deep [font-variation-settings:'wdth'_80]">{position + 1}</span>
                    <span className="min-w-0 text-[13px] font-semibold leading-tight text-ink group-hover:text-brand-deep">{title}</span>
                  </a>
                </li>
              ))}
            </ol>

            <ol className="m-0 mt-10 grid list-none gap-8 p-0">
              <Step n={1}>
                <p className="m-0">{t.baseTesto}</p>
                {/* la formula fuori dalla prosa, con la frazione in colonna: dentro la frase non si leggeva */}
                <figure className="p5-corner m-0 overflow-x-auto border border-rule bg-paper-2 px-3.5 py-4 sm:px-6">
                  <p className="sr-only">{t.formula(numero(config.balanceA, locale, 2), numero(config.balanceB, locale, 2))}</p>
                  <p aria-hidden className="m-0 whitespace-nowrap font-mono text-[13px] leading-[2.4] text-ink sm:text-[18px]">
                    <span className="font-semibold">{t.formulaDanno}</span> = A × (1 −{" "}
                    <span className="inline-grid translate-y-[0.1em] text-center align-middle leading-[1.5]">
                      <span className="border-b border-ink-2 px-1.5 pb-0.5">
                        <span className="text-brand-deep">{numero(config.balanceB, locale, 2)}</span> × {t.formulaDifesa}
                      </span>
                      <span className="px-1.5 pt-0.5">
                        A + <span className="text-brand-deep">{numero(config.balanceA, locale, 2)}</span> × {t.formulaDifesa}
                      </span>
                    </span>
                    )
                  </p>
                </figure>
                <p className="m-0">{t.baseConseguenze(percento(maxDefenseCut(config), locale))}</p>
                <p className={note}>{t.baseEsempio(numero(ATK, locale), numero(DEF, locale))}</p>
                <div className={cx(box, "max-w-[460px]")}>
                  <table className="w-full border-collapse text-[13px]">
                    <thead className="bg-paper-2">
                      <tr className="border-b border-rule text-left">
                        <th className={th}>{t.carta}</th>
                        <th className={cx(th, "text-right")}>{t.danno}</th>
                        <th className={cx(th, "text-right")}>{t.tolto}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cards.map((row) => (
                        <tr key={row.percent} className="border-b border-rule-2 last:border-b-0">
                          <td className={cx(numeric, "px-3 py-1.5")}>{percento(row.percent, locale)}</td>
                          <td className={td}>{numero(row.damage, locale)}</td>
                          <td className={td}>−{percento(row.cut, locale)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Step>

              <Step n={2}>
                <p className="m-0">{t.critTesto}</p>
                <p className="m-0">{t.critTiro(percento(0.3, locale), percento(critChance(0.3), locale))}</p>
                <p className="m-0">
                  {t.critEsempio(percento(1.8, locale), percento(0.5, locale), numero(critMultiplier(1.8, 0.5, config), locale, 1))}
                </p>
              </Step>

              <Step n={3}>
                <p className="m-0">{t.incTesto(`−${percento(-code.minDifference, locale)}`)}</p>
                <p className="m-0">{t.incConseguenza}</p>
                <div className={cx(box, "max-w-[560px]")}>
                  <table className="w-full border-collapse text-[13px]">
                    <thead className="bg-paper-2">
                      <tr className="border-b border-rule text-left">
                        <th className={th} />
                        <th className={cx(th, "text-right")}>{t.aumenti}</th>
                        <th className={cx(th, "text-right")}>{t.riduzioni}</th>
                        <th className={cx(th, "text-right")}>{t.fattore}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incExamples.map(([inc, dec], position) => (
                        <tr key={position} className="border-b border-rule-2 last:border-b-0">
                          <td className="px-3 py-1.5 text-ink-2">{t.esempiInc[position]}</td>
                          <td className={td}>{inc ? `+${percento(inc, locale)}` : "—"}</td>
                          <td className={td}>{dec ? `−${percento(dec, locale)}` : "—"}</td>
                          <td className={cx(td, "font-semibold text-ink")}>×{numero(damageModifier(inc, dec, code), locale, 2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Step>

              <Step n={4}>
                <p className="m-0">
                  {t.varTesto(`${numero(config.variance[0] ?? 1, locale, 2)} … ${numero(config.variance.at(-1) ?? 1, locale, 2)}`)}
                </p>
              </Step>

              <Step n={5}>
                <p className="m-0">{t.fissiTesto}</p>
              </Step>

              <Step n={6}>
                <p className="m-0">{t.finaleTesto}</p>
                <p className={note}>{t.dotTesto}</p>
              </Step>
            </ol>
          </section>

          {/* -------------------------------------------------------- attributi */}
          <section id="attributi" className={section}>
            <h2 className={cx(display, "text-[30px]")}>{t.sezioni.attributi}</h2>
            <p className={lead}>{t.attrIntro}</p>
            <ul className="m-0 mt-5 grid max-w-[760px] list-none gap-1.5 p-0 md:grid-cols-3">
              {triangle.map(([strong, weak]) => (
                <li key={strong} className="flex flex-wrap items-center gap-x-2.5 gap-y-1 border border-rule bg-paper-2 px-3 py-2.5 text-[14px]">
                  <Attr c={strong} />
                  <span className="inline-flex items-center gap-1 text-[13px] text-ink-3">
                    {t.batte}
                    <IconChevronRight size={14} />
                  </span>
                  <Attr c={weak} />
                </li>
              ))}
            </ul>
            <p className={cx(prose, "mt-4")}>
              {t.vantaggioTesto(`+${percento(config.advantage, locale)}`, percento(config.disadvantage, locale))}{" "}
              {t.vantaggioCalcolo(
                numero(damageModifier(config.advantage, 0, code), locale, 2),
                numero(damageModifier(0, config.disadvantage, code), locale, 2),
              )}
            </p>
            <SubTitle>{t.sempreTitolo}</SubTitle>
            <p className={cx(prose, "mt-2.5")}>{t.sempreTesto}</p>
            <SubTitle>{t.luceTitolo}</SubTitle>
            <div className={cx(prose, "mt-2.5")}>
              <p className="m-0">{t.luceTesto(withEffect.length)}</p>
              <ul className="m-0 grid list-disc gap-1.5 pl-5 marker:text-brand-deep">
                {light ? <li>{t.luce(`${light.sameAttribute}%`, `${light.otherAllies}%`)}</li> : null}
                {dark ? <li>{t.oscurita(`${dark.sameAttribute}%`, `${dark.otherAllies}%`)}</li> : null}
              </ul>
              <p className={note}>{t.oscuritaNota}</p>
            </div>
            <ul className="m-0 mt-4 flex list-none flex-wrap gap-1.5 p-0">
              {withEffect.map((hero) => (
                <li key={hero.id}>
                  <Link
                    href={`/${game}/eroi/${hero.id}`}
                    title={`${heroName(hero, locale)} · ${heroEpithet(hero, locale)}`}
                    className="block border border-rule transition-colors hover:border-brand"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={heroCardSrc(game, hero.id)} alt={heroName(hero, locale)} width={128} height={128} loading="lazy" className="block h-14 w-14" />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* ------------------------------------------------------------ pesca */}
          <section id="pesca" className={section}>
            <h2 className={cx(display, "text-[30px]")}>{t.sezioni.pesca}</h2>
            <div className={cx(prose, "mt-4")}>
              <p className="m-0 text-[15px]">{t.pescaIntro(Object.keys(data.draw).length, weightA, weightB)}</p>
              {oneWeight ? null : <p className={note}>{t.pescaPesiDiversi}</p>}
            </div>
            <div className={cx(box, "mt-4 max-w-[520px]")}>
              <table className="w-full border-collapse text-[13px]">
                <thead className="bg-paper-2">
                  <tr className="border-b border-rule text-left">
                    <th className={th}>{t.eroiInCampo}</th>
                    <th className={cx(th, "text-right")}>{t.ogniA}</th>
                    <th className={cx(th, "text-right")}>{t.ogniB}</th>
                    <th className={cx(th, "text-right")}>{t.ogniEroe}</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4].map((n) => {
                    const { a, b } = drawChances([weightA, weightB], n);
                    return (
                      <tr key={n} className="border-b border-rule-2 last:border-b-0">
                        <td className={cx(numeric, "px-3 py-1.5")}>{n}</td>
                        <td className={td}>{percento(a, locale, 1)}</td>
                        <td className={td}>{percento(b, locale, 1)}</td>
                        <td className={td}>{percento(a + b, locale, 1)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className={cx(note, "mt-2 max-w-[72ch]")}>
              {t.pescaSottoTabella(percento(weightA / (weightA + weightB), locale), percento(weightB / (weightA + weightB), locale))}
            </p>

            <SubTitle>{t.manoTitolo}</SubTitle>
            <p className={cx(prose, "mt-2.5")}>{t.manoTesto}</p>
            <div className={cx(box, "mt-4 max-w-[460px]")}>
              <table className="w-full border-collapse text-[13px]">
                <thead className="bg-paper-2">
                  <tr className="border-b border-rule text-left">
                    <th className={th}>{t.eroiRimasti}</th>
                    <th className={cx(th, "text-right")}>{t.conPanchina}</th>
                    <th className={cx(th, "text-right")}>{t.tuttiInCampo}</th>
                  </tr>
                </thead>
                <tbody>
                  {[4, 3, 2, 1].map((n) => (
                    <tr key={n} className="border-b border-rule-2 last:border-b-0">
                      <td className={cx(numeric, "px-3 py-1.5")}>{n}</td>
                      <td className={td}>{handLimit(n, false, code)}</td>
                      <td className={td}>{handLimit(n, true, code)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className={cx(note, "mt-2 max-w-[72ch]")}>{t.manoNota}</p>

            <SubTitle>{t.smashTitolo}</SubTitle>
            <p className={cx(prose, "mt-2.5")}>{t.smashTesto(smash)}</p>
          </section>

          {/* ----------------------------------------------------------- cumulo */}
          <section id="cumulo" className={section}>
            <h2 className={cx(display, "text-[30px]")}>{t.sezioni.cumulo}</h2>
            <div className={cx(prose, "mt-4")}>
              <p className="m-0 text-[15px]">{t.cumuloIntro}</p>
              <ul className="m-0 grid list-disc gap-1.5 pl-5 marker:text-brand-deep">
                <li>{t.regole.piu_forte}</li>
                <li>{t.regole.accumula}</li>
                <li>{t.regole.piu_basso}</li>
              </ul>
            </div>

            {stacking.length ? (
              <>
                <SubTitle>{t.accumulanoTitolo}</SubTitle>
                <div className="mt-3 max-h-[420px] max-w-[560px] overflow-auto border border-rule bg-paper">
                  <table className="w-full border-collapse text-[13px]">
                    <thead className="sticky top-0 bg-paper-2">
                      <tr className="border-b border-rule text-left">
                        <th className={th}>{t.effetto}</th>
                        <th className={cx(th, "text-right")}>{t.fino}</th>
                        <th className={cx(th, "text-right")}>{t.carte}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stacking.map((row) => (
                        <tr key={`${row.key}-${row.limit}`} className="border-b border-rule-2 last:border-b-0">
                          <td className="px-3 py-1.5">{row.name}</td>
                          <td className={td}>{row.limit ? t.volte(row.limit) : t.senzaTetto}</td>
                          <td className={cx(td, "text-ink-3")}>{row.cards}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className={cx(note, "mt-2 max-w-[72ch]")}>{t.cumuloNotaNomi}</p>
              </>
            ) : null}

            <SubTitle>{t.durataTitolo}</SubTitle>
            <p className={cx(prose, "mt-2.5")}>{t.durataTesto}</p>

            <SubTitle>{t.statTitolo}</SubTitle>
            <div className={cx(prose, "mt-2.5")}>
              <p className="m-0">{t.statTesto}</p>
              <p className="m-0">{t.statMinimo(percento(code.minStats, locale))}</p>
            </div>

            <SubTitle>{t.caricheTitolo}</SubTitle>
            <p className={cx(prose, "mt-2.5")}>{t.caricheTesto}</p>
          </section>
        </div>
      </div>

      <p className="mt-16 border-t border-rule-2 pt-4 text-[13px] text-ink-3">
        <Link href={`/${game}/eroi`} className="text-brand-deep underline-offset-2 hover:underline">
          {t.eroiLink}
        </Link>
        {" · "}
        {t.diritti(entry.publisher)}
      </p>
    </main>
  );
}
