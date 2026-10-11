/**
 * I pezzi comuni delle quattro pagine del gruppo Endgame.
 *
 * Scontri finali, Bestie demoniache, Re Demone e Divinita' Suprema hanno forme
 * diverse, ma dicono le stesse cose con le stesse parole: un nemico col suo
 * livello e le sue carte, un drop con la sua probabilita', un eroe escluso.
 * Scritti una volta qui, le quattro pagine li compongono.
 *
 * Tutto renderizzato sul server, senza stato nel browser: la difficolta'
 * scelta sta nell'indirizzo (vedi DifficultyLinks). Una pagina di questo gruppo
 * porta centinaia di testi di abilita'; uno stato React li spedirebbe tutti
 * anche al browser.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { readableColor } from "@/components/heroes/game-color";
import { GameNotes, GameText } from "@/components/heroes/game-text";
import { IconArrowUp, IconChevronRight } from "@/components/icons";
import { chipClass, cx, display, eyebrow, numeric, Tag } from "@/components/ui";
import {
  dropChance,
  endgameImageSrc,
  formatCompact,
  formatMultiplier,
  formatNumber,
  formatPercent,
} from "@/lib/games/endgame";
import type {
  EndgameAmount,
  EndgameDictionary,
  EndgameDrops,
  EndgameFoe,
  EndgameHeroPassive,
  EndgameSkill,
  EndgameTips,
} from "@/lib/games/endgame-types";
import { plainHeroText } from "@/lib/games/hero-markup";
import { gameIconSrc, heroCardSrc, heroEpithet, heroName } from "@/lib/games/heroes";
import type { GameModule, HeroAffinity, HeroEntry, HeroLabel } from "@/lib/games/types";
import { inLingua, testi, type Locale } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    livello: (n: string) => `Liv. ${n}`,
    ps: "PS",
    attacco: "Attacco",
    difesa: "Difesa",
    stima: "stima",
    stimaSpiega:
      "Calcolata, non letta: (base + crescita × (livello − 1)) × moltiplicatore della fase, la formula degli eroi applicata ai mostri. Il client non scrive le statistiche vere dei boss.",
    moltiplicatori: "Moltiplicatori della fase",
    nomeDedotto: "Il client non ha il nome di questo mostro: è quello di un mostro gemello, con lo stesso modello.",
    abilita: (n: number) => (n === 1 ? "1 abilità" : `${n} abilità`),
    passive: (n: number) => (n === 1 ? "1 passiva" : `${n} passive`),
    nascoste: (n: number) => (n === 1 ? "e 1 nascosta dal gioco" : `e ${n} nascoste dal gioco`),
    pesca: (a: number, b: number) => `Pesca la carta A il ${a}% delle volte, la B il ${b}%.`,
    rango: (n: number) => `Rango ${n}`,
    razzeAvvantaggiate: "Razze avvantaggiate",
    razzeSvantaggiate: "Razze svantaggiate",
    abilitaConsigliate: "Abilità consigliate",
    comportamento: "Comportamento",
    infoUnica: "Info unica",
    passiveDellaFase: "Passive in più in questa fase",
    vediCarta: (where?: string) => (where ? `vedi la carta in ${where}` : "vedi la carta qui sopra"),
    estrazioni: (n: number) => (n === 1 ? "1 estrazione" : `${n} estrazioni`),
    aScelta: "a scelta",
    dipendeRegione: "Materiale dei costumi, secondo la regione",
    probabilitaNota:
      "Le probabilità sono i pesi del client, su 10.000 per estrazione. L'estrazione vera la fa il server.",
    slot: {
      a: "Carta A",
      b: "Carta B",
      exclusive_a: "Esclusiva",
      exclusive_b: "Esclusiva",
      special: "Mossa finale",
      counter: "Contrattacco",
    },
    tipi: {
      atk: "Attacco",
      buff: "Buff",
      debuff: "Debuff",
      debuff_atk: "Attacco debuff",
      heal: "Recupero",
      defence_pose: "Atteggiamento Difesa",
      counter_pose: "Atteggiamento Contrattacco",
    } as Record<string, string>,
    fonti: {
      unique: "Unica",
      relic: "Reliquia sacra",
      commandment: "Comandamento",
      grace: "Grazia",
      talent: "Talento",
      bond: "Legame",
    },
    senzaNome: "—",
  },
  en: {
    livello: (n: string) => `Lv. ${n}`,
    ps: "HP",
    attacco: "Attack",
    difesa: "Defense",
    stima: "estimate",
    stimaSpiega:
      "Calculated, not read: (base + growth × (level − 1)) × the phase multiplier, the heroes' formula applied to monsters. The client does not store the bosses' real stats.",
    moltiplicatori: "Phase multipliers",
    nomeDedotto: "The client has no name for this monster: it is the name of a twin monster with the same model.",
    abilita: (n: number) => (n === 1 ? "1 skill" : `${n} skills`),
    passive: (n: number) => (n === 1 ? "1 passive" : `${n} passives`),
    nascoste: (n: number) => (n === 1 ? "and 1 hidden by the game" : `and ${n} hidden by the game`),
    pesca: (a: number, b: number) => `Draws card A ${a}% of the time, card B ${b}%.`,
    rango: (n: number) => `Rank ${n}`,
    razzeAvvantaggiate: "Advantaged races",
    razzeSvantaggiate: "Disadvantaged races",
    abilitaConsigliate: "Recommended skills",
    comportamento: "Behavior",
    infoUnica: "Unique info",
    passiveDellaFase: "Extra passives in this phase",
    vediCarta: (where?: string) => (where ? `see the card in ${where}` : "see the card above"),
    estrazioni: (n: number) => (n === 1 ? "1 draw" : `${n} draws`),
    aScelta: "your choice",
    dipendeRegione: "Costume material, by region",
    probabilitaNota: "Chances are the client's weights, out of 10,000 per draw. The actual draw is made by the server.",
    slot: {
      a: "Card A",
      b: "Card B",
      exclusive_a: "Exclusive",
      exclusive_b: "Exclusive",
      special: "Ultimate Move",
      counter: "Counterattack",
    },
    tipi: {
      atk: "Attack",
      buff: "Buff",
      debuff: "Debuff",
      debuff_atk: "Debuff Atk",
      heal: "Recovery",
      defence_pose: "Defense Stance",
      counter_pose: "Counter Stance",
    } as Record<string, string>,
    fonti: {
      unique: "Unique",
      relic: "Holy Relic",
      commandment: "Commandment",
      grace: "Grace",
      talent: "Talent",
      bond: "Bond",
    },
    senzaNome: "—",
  },
});

/* --------------------------------------------------------------- scope -- */

/**
 * Quello che ogni pezzo deve sapere: il gioco, la lingua, il dizionario della
 * modalita' e il roster. Passato come un oggetto solo invece di sei props in
 * ogni componente.
 */
export interface EndgameScope {
  readonly game: string;
  readonly locale: Locale;
  readonly dict: EndgameDictionary;
  readonly heroes: ReadonlyMap<string, HeroEntry>;
  readonly affinities: ReadonlyMap<string, HeroAffinity>;
  readonly icons: Readonly<Record<string, readonly string[]>> | undefined;
  readonly races: Readonly<Record<string, HeroLabel>>;
  readonly attributes: Readonly<Record<string, HeroLabel>>;
  /** gli id delle Carte artefatto: nei drop portano alla pagina della carta */
  readonly artifactCards: ReadonlySet<string>;
}

export function endgameScope(
  game: string,
  locale: Locale,
  gameModule: GameModule,
  dict: EndgameDictionary,
): EndgameScope {
  return {
    game,
    locale,
    dict,
    heroes: new Map((gameModule.roster?.heroes ?? []).map((hero) => [hero.id, hero])),
    affinities: new Map((gameModule.roster?.affinities ?? []).map((affinity) => [affinity.id, affinity])),
    icons: gameModule.icons,
    races: gameModule.heroContext?.codes.race ?? {},
    attributes: gameModule.heroContext?.codes.attribute ?? {},
    artifactCards: new Set((gameModule.artifacts?.cards ?? []).map((card) => card.id)),
  };
}

/* --------------------------------------------------------------- testi -- */

/** Un'etichetta dei dati nella lingua di chi legge, o in quella che c'e'. */
export function say(value: HeroLabel | null | undefined, scope: EndgameScope): string {
  return inLingua(value, scope.locale) ?? "";
}

/**
 * La lingua di un'etichetta dei dati, quando non e' quella della pagina: il
 * client non ha tutti i testi in tutte e due le lingue, e un testo inglese nel
 * sito in italiano va dichiarato, per chi legge con un lettore di schermo.
 */
export function langOf(value: HeroLabel | null | undefined, scope: EndgameScope): "en" | "it" | undefined {
  if (!value) return undefined;
  if (scope.locale === "it" && !value.it && value.en) return "en";
  if (scope.locale === "en" && !value.en && value.it) return "it";
  return undefined;
}

/** Un nome col markup del gioco ridotto a testo: «Sariel del [b]Tornado[/b]» dentro una riga. */
export function sayPlain(value: HeroLabel | null | undefined, scope: EndgameScope): string {
  return plainHeroText(say(value, scope));
}

/** Un testo lungo del gioco, col suo markup e la sua lingua. */
export function Said({
  value,
  scope,
  className,
  omitNotes,
}: {
  value: HeroLabel | null | undefined;
  scope: EndgameScope;
  className?: string;
  omitNotes?: boolean;
}) {
  const text = say(value, scope);
  if (!text) return null;
  return (
    <div lang={langOf(value, scope)}>
      <GameText text={text} className={className} omitNotes={omitNotes} />
    </div>
  );
}

/* ------------------------------------------------------------- icone -- */

function hasIcon(scope: EndgameScope, family: string, key: string): boolean {
  return scope.icons?.[family]?.includes(key) ?? false;
}

/** L'icona dell'attributo, o il suo nome se l'icona non c'e'. */
export function AttributeIcon({ code, scope, size = 18 }: { code: number | null; scope: EndgameScope; size?: number }) {
  if (code === null) return null;
  const name = say(scope.attributes[String(code)], scope) || String(code);
  if (!hasIcon(scope, "attributo", String(code))) return <span className="text-[12px] text-ink-2">{name}</span>;
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={gameIconSrc(scope.game, "attributo", code)}
      alt={name}
      title={name}
      width={size}
      height={size}
      className="inline-block shrink-0"
      style={{ width: size, height: "auto" }}
    />
  );
}

/** L'icona della razza col suo nome accanto: la razza si legge, l'icona la riconosce. */
export function RaceLabel({ code, scope }: { code: number | null; scope: EndgameScope }) {
  if (code === null) return null;
  const name = say(scope.races[String(code)], scope) || String(code);
  return (
    <span className="inline-flex items-center gap-1 text-[12px] text-ink-2">
      {hasIcon(scope, "razza", String(code)) ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={gameIconSrc(scope.game, "razza", code)}
          alt=""
          width={16}
          height={16}
          className="inline-block shrink-0"
          style={{ width: 16, height: "auto" }}
        />
      ) : null}
      {name}
    </span>
  );
}

/** L'icona dell'attributo col suo nome accanto: nelle targhette del palco, dove l'icona da sola non basta. */
export function AttributeLabel({ code, scope }: { code: number | null; scope: EndgameScope }) {
  if (code === null) return null;
  const name = say(scope.attributes[String(code)], scope) || String(code);
  return (
    <span className="inline-flex items-center gap-1">
      {hasIcon(scope, "attributo", String(code)) ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={gameIconSrc(scope.game, "attributo", code)}
          alt=""
          width={18}
          height={18}
          className="inline-block shrink-0"
          style={{ width: 18, height: "auto" }}
        />
      ) : null}
      {name}
    </span>
  );
}

/** L'icona che il gioco mette accanto alla passiva per dire dove si attiva. */
export function ConditionIcon({ condition, scope, size = 18 }: { condition: string; scope: EndgameScope; size?: number }) {
  if (!hasIcon(scope, "condizione", condition)) return null;
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={gameIconSrc(scope.game, "condizione", condition)}
      alt=""
      width={size}
      height={size}
      className="inline-block shrink-0"
      style={{ width: size, height: "auto" }}
    />
  );
}

/** Il nome di un tipo di carta (SkillCardObject.ATTACK_TYPE), come lo scrive il tutorial del gioco. */
export function skillKindLabel(kind: string, scope: EndgameScope): string {
  return TESTI[scope.locale].tipi[kind] ?? kind;
}

/**
 * Il rango di una carta con le stelle del gioco, come i pulsanti della scheda
 * eroe; senza l'icona, la sigla. `label` per le stelle che non sono un rango
 * (le Battaglie boss di uno Scontro finale): prima erano un «☆» scritto.
 */
export function RankStars({ rank, scope, label }: { rank: number; scope: EndgameScope; label?: string }) {
  const t = TESTI[scope.locale];
  const name = label ?? t.rango(rank);
  if (!hasIcon(scope, "carta", "stella")) return <span className={numeric}>{label ? `${rank}` : `R${rank}`}</span>;
  return (
    <span className="inline-flex items-center" title={label ? undefined : name}>
      {Array.from({ length: rank }, (_, star) => (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          key={star}
          src={gameIconSrc(scope.game, "carta", "stella")}
          alt=""
          width={39}
          height={41}
          className="h-auto w-[12px]"
        />
      ))}
      <span className="sr-only">{name}</span>
    </span>
  );
}

/* ------------------------------------------------------------ oggetti -- */

/** Un oggetto: icona, nome e quantita'. */
export function ItemLabel({
  id,
  count,
  scope,
  size = 24,
}: {
  id: string;
  count?: number;
  scope: EndgameScope;
  size?: number;
}) {
  const item = scope.dict.items[id];
  const name = sayPlain(item?.name, scope) || id;
  return (
    <span className="inline-flex min-w-0 items-center gap-1.5">
      {item?.icon ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={endgameImageSrc(scope.game, `oggetti/${id}.png`)}
          alt=""
          width={size}
          height={size}
          loading="lazy"
          className="shrink-0 bg-paper-2"
          style={{ width: size, height: size }}
        />
      ) : null}
      {scope.artifactCards.has(id) ? (
        <Link
          href={`/${scope.game}/carte-artefatto/${id}`}
          className="min-w-0 text-brand-deep underline-offset-2 hover:underline"
          lang={langOf(item?.name, scope)}
        >
          {name}
        </Link>
      ) : (
        <span className="min-w-0" lang={langOf(item?.name, scope)}>
          {name}
        </span>
      )}
      {count !== undefined && count !== 1 ? (
        <span className={cx(numeric, "shrink-0 text-ink-3")}>×{formatNumber(count, scope.locale)}</span>
      ) : null}
    </span>
  );
}

/** Oggetti in fila: le ricompense di completamento, un costo. */
export function Amounts({ amounts, scope }: { amounts: readonly EndgameAmount[]; scope: EndgameScope }) {
  if (amounts.length === 0) return null;
  return (
    <ul className="m-0 flex list-none flex-wrap gap-x-4 gap-y-1.5 p-0 text-[13px]">
      {amounts.map((amount, index) => (
        <li key={`${amount.id}-${index}`} className="min-w-0">
          <ItemLabel id={amount.id} count={amount.count} scope={scope} />
        </li>
      ))}
    </ul>
  );
}

/**
 * Le estrazioni di fine battaglia, una riga per voce con la sua probabilita'.
 *
 * `regions` da' il nome alle regioni quando una voce cambia oggetto col
 * villaggio (i materiali dei costumi dei boss 2 e 3 stelle).
 */
export function DropTable({
  drops,
  scope,
  regions,
  title,
  relative,
}: {
  drops: EndgameDrops;
  scope: EndgameScope;
  regions?: Readonly<Record<string, { readonly name: HeroLabel }>>;
  title?: ReactNode;
  /**
   * Il contenuto di una cassa: la probabilita' e' il peso sul totale della
   * cassa (1.000 su 6.000 = 16,67%), non su 10.000. Con totale 0 la cassa e'
   * «a scelta»: si sceglie, non si estrae, e le percentuali non si scrivono.
   */
  relative?: boolean;
}) {
  const t = TESTI[scope.locale];
  if (drops.entries.length === 0) return null;
  const total = drops.entries.reduce((sum, entry) => sum + entry.weight, 0);
  const chance = (weight: number) =>
    relative ? (total > 0 ? formatPercent((weight / total) * 100, scope.locale) : null) : formatPercent(weight / 100, scope.locale);
  return (
    <div className="min-w-0">
      <p className={cx(eyebrow, "m-0 mb-1.5")}>
        {title}
        {title && !relative ? " · " : null}
        {relative ? (total > 0 ? null : ` · ${t.aScelta}`) : t.estrazioni(drops.draws)}
      </p>
      <table className="w-full border-collapse text-[13px]">
        <tbody>
          {drops.entries.map((entry, index) => (
            <tr key={`${entry.id ?? "regione"}-${index}`} className="border-b border-rule-2 last:border-b-0">
              <td className="py-1 pr-3 align-top">
                {entry.id ? (
                  <ItemLabel id={entry.id} count={entry.count} scope={scope} />
                ) : entry.byRegion ? (
                  <div>
                    <span>
                      {t.dipendeRegione}
                      {entry.count !== 1 ? <span className={cx(numeric, "text-ink-3")}> ×{entry.count}</span> : null}
                    </span>
                    <ul className="m-0 mt-0.5 list-none p-0 text-[12px] text-ink-3">
                      {Object.entries(entry.byRegion).map(([region, id]) => (
                        <li key={region} className="flex flex-wrap items-center gap-1">
                          <span>{regions?.[region] ? say(regions[region]!.name, scope) : region}:</span>
                          <ItemLabel id={id} scope={scope} size={18} />
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </td>
              <td className={cx(numeric, "w-[1%] whitespace-nowrap py-1 text-right align-top text-ink-2")}>
                {relative ? chance(entry.weight) : formatPercent(dropChance(entry), scope.locale)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/**
 * La nota sulle probabilita': si dice una volta per pagina, non sotto ogni
 * tabella, e sta nel «Da dove vengono i dati» in fondo (10/10), da cui prende
 * la forma del testo.
 */
export function DropNote({ scope }: { scope: EndgameScope }) {
  return <p>{TESTI[scope.locale].probabilitaNota}</p>;
}

/* -------------------------------------------------------------- nemici -- */

/**
 * Un nemico di una fase: chi e', a che livello, quanto e' forte, cosa fa.
 *
 * Le carte e le passive stanno in un `<details>` chiuso: un boss ne ha fino a
 * dieci e venti, e aperte trasformerebbero ogni fase in un muro di testo. Il
 * riassunto dice quante sono, cosi' si sa cosa si apre.
 */
export function FoeCard({
  foe,
  scope,
  heading,
  open,
  fallbackName,
  id,
  described,
}: {
  foe: EndgameFoe;
  scope: EndgameScope;
  /** un titolo sopra il nome: «Fase 1», «×3» */
  heading?: ReactNode;
  open?: boolean;
  /**
   * Il nome da scrivere se il client non ne ha uno per il mostro: nella
   * Divinita' Suprema 8 mostri su 28 non l'hanno, e il nome giusto e' quello
   * del loro gruppo («Forze della Punizione celeste...»).
   */
  fallbackName?: string;
  /** l'ancora della carta, a cui rimandano le altre carte dello stesso mostro */
  id?: string;
  /**
   * Il mostro e' gia' descritto per intero piu' su nella pagina: `href` e' la
   * sua carta, `where` la parte in cui sta (senza, se e' nello stesso gruppo).
   * Al posto di consigli, abilita' e passive, quante sono e il rimando; restano
   * le cose che cambiano da una volta all'altra: livello, statistiche, passive
   * della fase. Nella Divinita' Suprema lo stesso mostro torna fino a otto
   * volte, e ripeterne ogni volta le carte faceva 445 KB di HTML (11/10).
   */
  described?: { readonly href: string; readonly where?: string };
}) {
  const t = TESTI[scope.locale];
  const monster = scope.dict.monsters[foe.monster];
  if (!monster) return null;
  const name = sayPlain(monster.name, scope) || fallbackName;
  const passivesLabel =
    monster.passives.length > 0 || monster.hiddenPassives > 0
      ? `${t.passive(monster.passives.length)}${monster.hiddenPassives > 0 ? ` ${t.nascoste(monster.hiddenPassives)}` : ""}`
      : null;

  return (
    <div
      id={id}
      className={cx("p5-corner min-w-0 border border-rule bg-paper p-3 sm:p-4", id && "scroll-mt-20 target:border-brand")}
    >
      <div className="flex min-w-0 items-start gap-3">
        {monster.icon ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={endgameImageSrc(scope.game, `mostri/${foe.monster}.png`)}
            alt=""
            width={56}
            height={56}
            loading="lazy"
            className="h-14 w-14 shrink-0 bg-paper-2"
          />
        ) : null}
        <div className="min-w-0 flex-1">
          {heading ? <Tag className="mb-1.5">{heading}</Tag> : null}
          <p className="m-0 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[15px] font-semibold leading-tight">
            <span lang={langOf(monster.name, scope)} title={monster.nameDeduced ? t.nomeDedotto : undefined}>
              {name || t.senzaNome}
              {monster.nameDeduced ? <span className="ml-0.5 font-normal text-ink-3">*</span> : null}
            </span>
            <span className={cx(numeric, "text-[12px] font-normal text-ink-3")}>
              {t.livello(formatNumber(foe.level, scope.locale))}
            </span>
            <AttributeIcon code={monster.attribute} scope={scope} />
            <RaceLabel code={monster.race} scope={scope} />
          </p>
          <FoeStats foe={foe} scope={scope} />
        </div>
      </div>

      {monster.tips && !described ? <Tips tips={monster.tips} scope={scope} /> : null}

      {/*
        Aperte se sono una o due (di solito «Aumento uso abilità»), chiuse se
        sono di piu': Surtr ne prende oltre venti per fase.
      */}
      {foe.extraPassives?.length ? (
        <details className="mt-2.5" open={foe.extraPassives.length <= 2}>
          <Summary className={eyebrow}>
            {t.passiveDellaFase} ({foe.extraPassives.length})
          </Summary>
          <div className="mt-1.5">
            <PassiveList ids={foe.extraPassives} scope={scope} />
          </div>
        </details>
      ) : null}

      {described ? (
        <DescribedAbove
          href={described.href}
          counts={[monster.skills.length > 0 ? t.abilita(monster.skills.length) : null, passivesLabel]}
          text={t.vediCarta(described.where)}
        />
      ) : null}

      {monster.skills.length > 0 && !described ? (
        <details className="mt-2.5" open={open}>
          <Summary>{t.abilita(monster.skills.length)}</Summary>
          {monster.draw ? <p className="m-0 mt-1.5 text-[12px] text-ink-3">{t.pesca(monster.draw.a, monster.draw.b)}</p> : null}
          <ul className="m-0 mt-2 grid list-none gap-2.5 p-0">
            {monster.skills.map((skill, index) => (
              <li key={`${skill.slot}-${index}`}>
                <SkillRow skill={skill} scope={scope} />
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      {passivesLabel && !described ? (
        <details className="mt-1.5">
          <Summary>{passivesLabel}</Summary>
          <div className="mt-2">
            <PassiveList ids={monster.passives} scope={scope} />
          </div>
        </details>
      ) : null}
    </div>
  );
}

/**
 * Il rimando di una carta alla carta intera dello stesso mostro: quante abilita'
 * e passive ha (le righe che sostituisce dicevano lo stesso), e dove sono.
 */
function DescribedAbove({ href, counts, text }: { href: string; counts: readonly (string | null)[]; text: string }) {
  const shown = counts.filter((count): count is string => !!count).join(", ");
  return (
    <a
      href={href}
      className="mt-2.5 flex min-h-8 items-center gap-1.5 text-[13px] text-ink-2 underline-offset-4 hover:text-ink hover:underline"
    >
      <IconArrowUp size={14} className="shrink-0" />
      <span className="min-w-0">{shown ? `${shown}: ${text}` : text.charAt(0).toUpperCase() + text.slice(1)}</span>
    </a>
  );
}

/** PS, Attacco e Difesa stimati, coi moltiplicatori della fase nel `title`. */
function FoeStats({ foe, scope }: { foe: EndgameFoe; scope: EndgameScope }) {
  const t = TESTI[scope.locale];
  const multipliers = `${t.moltiplicatori}: ${t.ps} ${formatMultiplier(foe.multipliers.hp, scope.locale)}, ${t.attacco} ${formatMultiplier(foe.multipliers.atk, scope.locale)}, ${t.difesa} ${formatMultiplier(foe.multipliers.def, scope.locale)}`;

  if (!foe.estimate) {
    return <p className={cx(numeric, "m-0 mt-1 text-[12px] text-ink-3")}>{multipliers}</p>;
  }
  const rows: [string, number][] = [
    [t.ps, foe.estimate.hp],
    [t.attacco, foe.estimate.atk],
    [t.difesa, foe.estimate.def],
  ];
  return (
    <div className="mt-1">
      <p className="m-0 flex flex-wrap items-baseline gap-x-3 gap-y-0.5 text-[13px]">
        {rows.map(([label, value]) => (
          <span key={label} className="whitespace-nowrap">
            <span className="text-ink-3">{label} </span>
            <span className={cx(numeric, "text-ink")}>≈ {formatCompact(value, scope.locale)}</span>
          </span>
        ))}
        <span title={t.stimaSpiega} className="cursor-help">
          <Tag>{t.stima}</Tag>
        </span>
      </p>
      <p className={cx(numeric, "m-0 mt-0.5 text-[12px] text-ink-3")}>{multipliers}</p>
    </div>
  );
}

/** I consigli del gioco sul mostro. */
function Tips({ tips, scope }: { tips: EndgameTips; scope: EndgameScope }) {
  const t = TESTI[scope.locale];
  const rows: [string, HeroLabel | null][] = [
    [t.razzeAvvantaggiate, tips.favoredRaces],
    [t.razzeSvantaggiate, tips.unfavoredRaces],
    [t.abilitaConsigliate, tips.skills],
    [t.comportamento, tips.behavior],
    [t.infoUnica, tips.unique],
  ];
  const shown = rows.filter((row): row is [string, HeroLabel] => row[1] !== null);
  if (shown.length === 0) return null;
  return (
    <dl className="m-0 mt-2.5 grid gap-x-3 gap-y-1 text-[13px] sm:grid-cols-[max-content_minmax(0,1fr)]">
      {shown.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className={cx(eyebrow, "pt-px")}>{label}</dt>
          <dd className="m-0 text-ink-2">
            <Said value={value} scope={scope} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Una carta del boss: icona, nome, tipo, e il testo di ogni rango.
 *
 * Se i ranghi dicono la stessa cosa se ne mostra uno. Se cambiano (di solito
 * solo una percentuale) si mostrano tutti, uno per riga col suo rango: sono due
 * o tre righe, e un selettore per ogni carta di ogni fase sarebbe piu' rumore
 * che aiuto. Le note «※» si raccolgono una volta in fondo, come nella scheda eroe.
 */
function SkillRow({ skill, scope }: { skill: EndgameSkill; scope: EndgameScope }) {
  const t = TESTI[scope.locale];
  const texts = skill.ranks.map((rank) => say(rank, scope));
  const distinct = texts.filter((text, index) => text && texts.indexOf(text) === index);
  const kind = skill.kind ? t.tipi[skill.kind] : undefined;

  return (
    <div className="flex min-w-0 gap-2.5">
      {skill.icon ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={endgameImageSrc(scope.game, `abilita/${skill.icon}.png`)}
          alt=""
          width={32}
          height={64}
          loading="lazy"
          className="h-16 w-8 shrink-0 bg-paper-2 object-cover"
        />
      ) : null}
      <div className="min-w-0 flex-1 text-[13px] leading-snug">
        <p className="m-0 flex flex-wrap items-center gap-x-2 gap-y-0.5">
          <span className="font-semibold" lang={langOf(skill.name, scope)}>
            {sayPlain(skill.name, scope) || t.slot[skill.slot]}
          </span>
          <span className={cx(eyebrow, "text-[12px]")}>{t.slot[skill.slot]}</span>
          {kind ? <Tag>{kind}</Tag> : null}
        </p>
        {distinct.length <= 1 ? (
          distinct[0] ? (
            <GameText text={distinct[0]} omitNotes className="mt-1 [&>p]:m-0" />
          ) : null
        ) : (
          <ol className="m-0 mt-1 grid list-none gap-1 p-0">
            {texts.map((text, index) =>
              text ? (
                <li key={index} className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2">
                  <span className={cx(numeric, "pt-px text-[12px] text-ink-3")} title={t.rango(index + 1)}>
                    R{index + 1}
                  </span>
                  <GameText text={text} omitNotes className="[&>p]:m-0" />
                </li>
              ) : null,
            )}
          </ol>
        )}
        <GameNotes texts={distinct} className="mt-1.5" />
      </div>
    </div>
  );
}

/** Passive per id: nome e testo. */
export function PassiveList({ ids, scope }: { ids: readonly string[]; scope: EndgameScope }) {
  if (ids.length === 0) return null;
  return (
    <ul className="m-0 grid list-none gap-2 p-0 text-[13px] leading-snug">
      {ids.map((id) => {
        const passive = scope.dict.passives[id];
        if (!passive) return null;
        return (
          <li key={id} className="min-w-0">
            <p className="m-0 font-semibold" lang={langOf(passive.name, scope)}>
              {sayPlain(passive.name, scope)}
            </p>
            <Said value={passive.text} scope={scope} className="text-ink-2 [&>p]:m-0" />
          </li>
        );
      })}
    </ul>
  );
}

/* --------------------------------------------------------------- eroi -- */

/** Un eroe del roster: card piccola, epiteto nel colore dell'attributo, nome. */
export function HeroChip({ id, scope, meta }: { id: string; scope: EndgameScope; meta?: ReactNode }) {
  const hero = scope.heroes.get(id);
  if (!hero) return null;
  const affinity = scope.affinities.get(hero.affinity);
  return (
    <Link
      href={`/${scope.game}/eroi/${hero.id}`}
      className="group flex min-w-0 items-center gap-2.5 border border-rule bg-paper p-1.5 transition-colors hover:border-ink-3 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={heroCardSrc(scope.game, hero.id)}
        srcSet={`${heroCardSrc(scope.game, hero.id)} 1x, ${heroCardSrc(scope.game, hero.id, 2)} 2x`}
        alt=""
        width={44}
        height={44}
        loading="lazy"
        decoding="async"
        className="h-11 w-11 shrink-0 bg-paper-2"
      />
      <span className="min-w-0">
        <span
          className="block truncate text-[12px] leading-tight text-ink-3"
          style={affinity ? { color: affinity.color } : undefined}
        >
          {heroEpithet(hero, scope.locale)}
        </span>
        <span className="block text-[13px] font-semibold leading-tight group-hover:text-brand-deep">
          {heroName(hero, scope.locale)}
        </span>
        {meta}
      </span>
    </Link>
  );
}

/** Eroi in griglia. */
export function HeroGrid({ ids, scope }: { ids: readonly string[]; scope: EndgameScope }) {
  const known = ids.filter((id) => scope.heroes.has(id));
  if (known.length === 0) return null;
  return (
    <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-[repeat(auto-fill,minmax(220px,1fr))]">
      {known.map((id) => (
        <li key={id} className="min-w-0">
          <HeroChip id={id} scope={scope} />
        </li>
      ))}
    </ul>
  );
}

/** Eroi con la passiva che la modalita' tocca: sotto il nome, la passiva e da dove viene. */
export function HeroPassiveGrid({ entries, scope }: { entries: readonly EndgameHeroPassive[]; scope: EndgameScope }) {
  const t = TESTI[scope.locale];
  const shown = entries.filter((entry) => scope.heroes.has(entry.heroId));
  if (shown.length === 0) return null;
  return (
    <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-[repeat(auto-fill,minmax(250px,1fr))]">
      {shown.map((entry) => (
        <li key={`${entry.heroId}-${say(entry.passive, scope)}`} className="min-w-0">
          <HeroChip
            id={entry.heroId}
            scope={scope}
            meta={
              <span className="mt-0.5 block text-[12px] leading-tight text-ink-3">
                <span lang={langOf(entry.passive, scope)}>{sayPlain(entry.passive, scope)}</span>
                {" · "}
                {t.fonti[entry.source]}
              </span>
            }
          />
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------------------------------- difficolta' -- */

/**
 * I pulsanti delle difficolta': uno per difficolta', e sotto il pannello di
 * quella scelta.
 *
 * Scelta dell'utente (26/09): pulsanti come quelli dei ranghi nella scheda eroe,
 * partendo dalla PIU' difficile. Qui pero' non sono radio e CSS ma
 * collegamenti, e la scelta sta nell'indirizzo (`?difficolta=3`), come ordine e
 * filtro nella pagina Uscite. Il motivo e' il peso: coi radio l'HTML porta TUTTE
 * le difficolta', e la prima versione degli Scontri finali (tutti i boss in una
 * pagina) era 10,8 MB in sviluppo, 1,6 MB di solo markup, il 63% carte e passive
 * dei nemici. Anche con una pagina per boss i radio moltiplicherebbero il peso
 * per il numero di difficolta'. Il server rende solo il pannello scelto. Il
 * prezzo e' un caricamento a ogni clic invece del cambio istantaneo; in cambio la
 * scelta si condivide con l'indirizzo, e funziona senza JavaScript.
 */
export function DifficultyLinks({
  legend,
  tabs,
  current,
}: {
  legend: string;
  tabs: readonly { readonly label: string; readonly color: string | null; readonly href: string }[];
  /** la posizione della difficolta' scelta in `tabs` */
  current: number;
}) {
  if (tabs.length === 0) return null;
  // La forma delle scelte del sito (chipClass, «quiet»: una difficolta' c'e'
  // sempre, quindi bianca quando e' scelta, non rossa come un filtro). Il colore
  // del gioco passa dal testo al quadratino: sul bianco della scelta e del
  // passaggio un testo azzurro o arancione non si leggeva (10/10). Il titolo
  // visibile lo mette la sezione; qui resta il nome per chi non vede.
  return (
    <nav aria-label={legend}>
      <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
        {tabs.map((tab, index) => {
          const active = index === current;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                scroll={false}
                aria-current={active ? "true" : undefined}
                className={chipClass(active, true, "text-[13px]")}
              >
                <LevelSwatch color={tab.color} />
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** Il colore che il gioco da' a una difficolta' o a un piano, in un quadratino tagliato. */
export function LevelSwatch({ color }: { color: string | null }) {
  if (!color) return null;
  return (
    <span
      aria-hidden
      className="p5-cut-sm inline-block h-3 w-3.5 shrink-0"
      style={{ backgroundColor: readableColor(color) }}
    />
  );
}

/**
 * Il nome di una difficolta' nella tabella di confronto, che porta alla
 * difficolta' come i pulsanti: la riga che si sta leggendo e' gia' la scelta.
 */
export function LevelCell({
  label,
  color,
  href,
  active,
}: {
  label: string;
  color: string | null;
  href: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      scroll={false}
      aria-current={active ? "true" : undefined}
      className={cx(
        "inline-flex min-h-9 items-center gap-2 font-semibold underline-offset-4 hover:underline",
        active ? "text-ink" : "text-ink-2 hover:text-ink",
      )}
    >
      <LevelSwatch color={color} />
      {label}
    </Link>
  );
}

/* ------------------------------------------------------------- impaginazione -- */

/**
 * Il riassunto di un `<details>`: la freccia disegnata del sito al posto del
 * triangolo del browser, come in «Come funziona» (ui.tsx). La freccia gira solo
 * col SUO details aperto: un `group-open` girerebbe anche quelle dei details
 * chiusi dentro uno aperto (le carte dei nemici dentro un gruppo).
 */
export function Summary({
  children,
  className,
}: {
  children: ReactNode;
  /** misura e colore del testo; senza, quelli delle righe «5 abilità» */
  className?: string;
}) {
  return (
    <summary
      className={cx(
        "flex min-h-8 cursor-pointer list-none items-center gap-1.5 hover:text-ink [&::-webkit-details-marker]:hidden",
        className ?? "text-[13px] text-ink-2",
      )}
    >
      <IconChevronRight size={14} className="shrink-0 transition-transform [details[open]>summary>&]:rotate-90" />
      <span className="min-w-0">{children}</span>
    </summary>
  );
}

/**
 * I salti dentro una pagina lunga, nella forma delle scelte del sito: la
 * Divinita' Suprema arriva a nove schermi, e le parti della difficolta' scelta
 * stavano tutte sotto la tabella.
 */
export function InPageNav({ label, links }: { label: string; links: readonly (readonly [string, string] | null | false)[] }) {
  const shown = links.filter((link): link is readonly [string, string] => !!link);
  if (shown.length === 0) return null;
  return (
    <nav aria-label={label} className="mb-10">
      <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0">
        {shown.map(([href, text]) => (
          <li key={href}>
            <a href={href} className={chipClass(false, true)}>
              {text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Il titolo di una sezione della pagina: la voce di Persona, piu' spazio sopra che sotto. */
export function SectionTitle({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h2 id={id} className={cx(display, "m-0 mb-5 scroll-mt-20 text-[clamp(24px,3vw,32px)]")}>
      {children}
    </h2>
  );
}

/**
 * Righe di fatti: etichetta e valore, in una griglia a due colonne. Sul
 * telefono una sotto l'altro: un'etichetta lunga («Scacciato con Mamma Hawk»)
 * lasciava al valore tre parole per riga.
 */
export function Facts({ rows }: { rows: readonly (readonly [string, ReactNode] | null | false)[] }) {
  const shown = rows.filter((row): row is readonly [string, ReactNode] => !!row);
  if (shown.length === 0) return null;
  return (
    <dl className="m-0 grid gap-x-4 gap-y-0.5 text-[13px] sm:grid-cols-[max-content_minmax(0,1fr)] sm:gap-y-1.5">
      {shown.map(([label, value]) => (
        <div key={label} className="contents">
          <dt className={cx(eyebrow, "pt-px")}>{label}</dt>
          <dd className="m-0 min-w-0 text-ink-2">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Il titolo di una parte dentro una sezione: la voce dei comandi, piu' piccola del titolo di sezione. */
export function PartTitle({ children, id }: { children: ReactNode; id?: string }) {
  return (
    <h3
      id={id}
      className="m-0 mb-3 scroll-mt-20 font-display text-[17px] font-extrabold uppercase leading-tight tracking-[0.02em] [font-variation-settings:'wdth'_85]"
    >
      {children}
    </h3>
  );
}
