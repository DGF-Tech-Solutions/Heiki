/**
 * Le tendine delle parole blu della scheda eroe.
 *
 * Richiesta dell'utente (26/09): una parola blu si clicca e apre l'elenco degli
 * eroi legati. Le scelte, su tre anteprime:
 * - per un effetto (Perforazione, Evasione...) una riga per eroe, con la card,
 *   il nome e DOVE ce l'ha: «Carta B «Oceano misterioso» · dal rango 2». L'eroe
 *   della scheda sta in cima ed e' evidenziato; se e' l'unico, c'e' solo lui
 *   (356 concetti su 481 li ha un eroe solo: i termini propri dei personaggi)
 * - per una razza, una caratteristica o gli «alleati applicabili», chi ne fa
 *   parte. Per gli alleati applicabili la regola e' quella della nota del testo
 *   cliccato, e sta in testa all'elenco com'e' scritta nel gioco. In fondo, per
 *   una razza o una caratteristica, il collegamento alla griglia Eroi gia'
 *   filtrata
 * - solo nella scheda eroe, per ora
 * Poi, su richiesta: una barra di ricerca negli elenchi lunghi (da 8 eroi), per
 * vedere subito se un eroe c'e'.
 *
 * Le tendine le disegna il server, una per bersaglio presente nella pagina, e
 * le apre il browser (`popover`): nessun JavaScript per aprirle e chiuderle, e
 * nessuna richiesta in piu'. Quello che JavaScript aggiunge (`TermPopoverClient`)
 * e' il posto, sotto la parola invece che al centro dello schermo, e la ricerca.
 */

import Link from "next/link";
import { localized } from "@/components/heroes/hero-parts";
import { TermPopoverClient } from "@/components/heroes/term-popover-client";
import { cx, eyebrow, MoreArrow, moreLinkClass } from "@/components/ui";
import { termWords } from "@/lib/games/hero-markup";
import { heroCardSrc, heroEpithet, heroName } from "@/lib/games/heroes";
import { inGroup, parseTarget, searchText, targetId, textKey, type TermMember } from "@/lib/games/hero-terms";
import type { HeroTermGroup, HeroTermsIndex } from "@/lib/games/hero-terms-types";
import type { MechanicsIndex, MechanicsStacking } from "@/lib/games/mechanics-types";
import type {
  HeroAbilities,
  HeroContextIndex,
  HeroEntry,
  HeroLabel,
  HeroRelicsIndex,
  HeroSpecialsIndex,
} from "@/lib/games/types";
import { inLingua, testi, type Locale } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    eroi: (n: number) => (n === 1 ? "1 eroe" : `${n} eroi`),
    questoEroe: "questo eroe",
    soloQuesto: "Nessun altro eroe ce l’ha.",
    carta: (slot: string) => `Carta ${slot}`,
    ultimate: "Ultimate",
    unica: "Unica",
    reliquia: "Reliquia",
    dalRango: (n: number) => `dal rango ${n}`,
    dallUltimate: (n: number) => `con l’ultimate al rango ${n}`,
    dedotto: "Accostamento dedotto dal vocabolario del client: il gioco questo termine non lo definisce.",
    alleati: "Alleati applicabili",
    nemici: "Nemici applicabili",
    chiudi: "Chiudi",
    nessuno: "Nessun eroe corrisponde.",
    cerca: "Cerca un eroe o un’abilità…",
    cercaEtichetta: "Cerca in questo elenco",
    nessunRisultato: "Nessuno in questo elenco.",
    griglia: "Vedili nella griglia Eroi",
    di: "di",
    cumulo: "Cumulo",
    regola: (s: MechanicsStacking) =>
      s.rule === "accumula"
        ? s.limit
          ? `si accumula fino a ${s.limit} volte, e i valori si sommano`
          : "si accumula senza tetto, e i valori si sommano"
        : s.rule === "piu_basso"
          ? "resta quello col valore più basso"
          : s.rule === "cariche"
            ? `le cariche si sommano fino a ${s.limit}`
            : "resta il più forte; a parità si rinnova la durata",
    carte: (n: number) => (n === 1 ? "1 carta" : `${n} carte`),
    comeSiCumula: "Come si cumulano i buff",
  },
  en: {
    eroi: (n: number) => (n === 1 ? "1 hero" : `${n} heroes`),
    questoEroe: "this hero",
    soloQuesto: "No other hero has it.",
    carta: (slot: string) => `Card ${slot}`,
    ultimate: "Ultimate Move",
    unica: "Unique",
    reliquia: "Holy Relic",
    dalRango: (n: number) => `from rank ${n}`,
    dallUltimate: (n: number) => `with the Ultimate Move at rank ${n}`,
    dedotto: "Match inferred from the client's vocabulary: the game doesn't define this term.",
    alleati: "Applicable Allies",
    nemici: "Applicable Enemies",
    chiudi: "Close",
    nessuno: "No hero matches.",
    cerca: "Search a hero or a skill…",
    cercaEtichetta: "Search this list",
    nessunRisultato: "Nobody in this list.",
    griglia: "See them in the Heroes grid",
    di: "of",
    cumulo: "Stacking",
    regola: (s: MechanicsStacking) =>
      s.rule === "accumula"
        ? s.limit
          ? `stacks up to ${s.limit} times, and the values add up`
          : "stacks with no cap, and the values add up"
        : s.rule === "piu_basso"
          ? "the lowest value stays"
          : s.rule === "cariche"
            ? `charges add up to ${s.limit}`
            : "the strongest stays; at equal value the duration is refreshed",
    carte: (n: number) => (n === 1 ? "1 card" : `${n} cards`),
    comeSiCumula: "How buffs stack",
  },
});

/** Da quante righe un elenco ha la barra di ricerca: sotto, si legge a colpo d'occhio. */
const SEARCH_FROM = 8;

/** Dalle parole blu di un testo all'id delle loro tendine. */
export type TermIds = (en: string, shown: string) => readonly (string | null)[] | undefined;

/**
 * Le funzioni che la scheda passa alle abilita': quale tendina apre ogni parola
 * blu di un testo, e quali bersagli ha la pagina.
 *
 * Il legame e' sul testo INGLESE (e' quello che la pipeline ha letto); il testo
 * mostrato, se e' la traduzione, prende il legame che l'import ha fatto parola
 * per parola (`italian`). Fino al 10/10 era per posizione, e dove il gioco in
 * italiano colora parole diverse la tendina finiva sulla parola sbagliata. Una
 * parola senza legame resta testo: meglio una parola che non si clicca che una
 * che apre l'elenco di un'altra.
 */
export function termResolver(index: HeroTermsIndex | undefined): {
  ids: TermIds;
  targetsOf: (en: string) => readonly string[];
} {
  const targetsOf = (en: string) =>
    (index?.texts[textKey(en)] ?? []).filter((target): target is string => target !== null);
  const ids: TermIds = (en, shown) => {
    const enKey = textKey(en);
    const targets = index?.texts[enKey];
    if (!targets) return undefined;
    const asIds = targets.map((target) => (target ? targetId(target) : null));
    if (shown === en) return asIds;
    const link = index?.italian[`${enKey}:${textKey(shown)}`];
    // il conteggio deve tornare: un testo mostrato diverso da quello importato
    // (una patch a meta') non si lega a caso
    if (!link || link.length !== termWords(shown).length) return undefined;
    return link.map((j) => (j >= 0 ? (asIds[j] ?? null) : null));
  };
  return { ids, targetsOf };
}

/** Una riga dell'elenco: l'eroe e, per un effetto, dove ce l'ha. */
interface Row {
  hero: HeroEntry;
  places: string[];
}

/** Una parte della tendina: un concetto, una razza, una caratteristica o un gruppo. */
interface Section {
  title: string;
  subtitle: string | null;
  inferred: boolean;
  rows: Row[];
  effect: boolean;
  /** la griglia Eroi gia' filtrata, per una razza o una caratteristica */
  grid: string | null;
  /** come si cumulano i buff col nome di questo concetto (meccaniche), la regola piu' usata prima */
  stacking: readonly MechanicsStacking[] | null;
}

/**
 * Il filtro della griglia che corrisponde a un gruppo «applicabili», se c'e'.
 *
 * La griglia filtra per UNA razza o UNA caratteristica, e una regola come
 * «Demoni e [Seven Deadly Sins]» (l'una O l'altra) non si scrive coi suoi
 * filtri: per quella niente collegamento, e l'elenco nella tendina e' completo.
 */
function gridQuery(group: HeroTermGroup): string | null {
  const simple = group.characters.length === 0 && group.attributes.length === 0 && !group.self;
  if (!simple) return null;
  if (group.races.length === 1 && group.factions.length === 0) return `razza=${group.races[0]}`;
  if (group.factions.length === 1 && group.races.length === 0) return `caratteristica=${group.factions[0]}`;
  return null;
}

export function HeroTermPopovers({
  game,
  locale,
  heroId,
  targets,
  index,
  heroes,
  context,
  abilities,
  specials,
  relics,
  stacking,
}: {
  game: string;
  locale: Locale;
  heroId: string;
  /** i bersagli delle parole blu della pagina: una tendina ciascuno */
  targets: ReadonlySet<string>;
  index: HeroTermsIndex;
  heroes: readonly HeroEntry[];
  context: HeroContextIndex | undefined;
  abilities: Readonly<Record<string, HeroAbilities>> | undefined;
  specials: HeroSpecialsIndex | undefined;
  relics: HeroRelicsIndex | undefined;
  /** il cumulo dei buff per concetto (meccaniche): una riga sotto la definizione */
  stacking?: MechanicsIndex["stacking"];
}) {
  if (targets.size === 0) return null;
  const t = TESTI[locale];
  const byId = new Map(heroes.map((hero) => [hero.id, hero]));
  const member = (hero: HeroEntry): TermMember => {
    const c = context?.heroes[hero.id];
    return {
      id: hero.id,
      group: hero.group,
      race: c?.race ?? null,
      factions: c?.factions ?? [],
      attribute: c?.attribute ?? null,
    };
  };
  const label = (value: HeroLabel | undefined) => inLingua(value, locale);

  /** «Carta B «Oceano misterioso» · dal rango 2» */
  const placeText = (hid: string, where: string, rank: number): string => {
    const own = abilities?.[hid];
    const named = (kind: string, name: string | undefined | null) => (name ? `${kind} «${name}»` : kind);
    if (where === "A" || where === "B") {
      const card = own?.cards.find((c) => c.slot === where);
      const text = named(t.carta(where), card ? localized(card.nameI18n, card.name, locale) : null);
      return rank > 1 ? `${text} · ${t.dalRango(rank)}` : text;
    }
    if (where === "ultimate") {
      const text = named(t.ultimate, own?.ultimate ? localized(own.ultimate.nameI18n, own.ultimate.name, locale) : null);
      return rank > 1 ? `${text} · ${t.dalRango(rank)}` : text;
    }
    if (where === "passiva") {
      const text = named(t.unica, own?.passive ? localized(own.passive.nameI18n, own.passive.name, locale) : null);
      return rank > 1 ? `${text} · ${t.dallUltimate(rank)}` : text;
    }
    if (where.startsWith("s:")) {
      const ability = specials?.abilities[where.slice(2)];
      const kind = label(specials?.kinds[ability?.kind ?? ""]?.label) ?? ability?.kind ?? "";
      const text = named(kind, ability ? label(ability.name)?.replace(/\[\/?b\]/g, "") : null);
      return rank > 1 ? `${text} · ${t.dallUltimate(rank)}` : text;
    }
    if (where.startsWith("r:")) {
      const relic = relics?.relics[where.slice(2)];
      return named(t.reliquia, relic ? label(relic.name) : null);
    }
    return where;
  };

  /** L'eroe della scheda in cima, gli altri nell'ordine del roster (l'uscita). */
  const currentFirst = (rows: Row[]) => [
    ...rows.filter((row) => row.hero.id === heroId),
    ...rows.filter((row) => row.hero.id !== heroId),
  ];
  const members = (keep: (hero: HeroEntry) => boolean) =>
    currentFirst(heroes.filter(keep).map((hero) => ({ hero, places: [] })));
  const grid = (query: string | null) => (query ? `/${game}/eroi?${query}` : null);

  const sections = (target: string): Section[] => {
    const parts = parseTarget(target);
    const out: Section[] = [];

    for (const key of parts.concepts) {
      const concept = index.concepts[key];
      const grouped = new Map<string, Row>();
      for (const [hid, where, rank] of index.places[key] ?? []) {
        const hero = byId.get(hid);
        if (!hero) continue;
        const row = grouped.get(hid) ?? { hero, places: [] };
        row.places.push(placeText(hid, where, rank));
        grouped.set(hid, row);
      }
      out.push({
        title: label(concept?.label) ?? key,
        subtitle: label(concept?.definition),
        inferred: concept?.certainty === "dedotto",
        rows: currentFirst([...grouped.values()]),
        effect: true,
        grid: null,
        stacking: stacking?.[key] ?? null,
      });
    }
    for (const race of parts.races) {
      out.push({
        title: label(context?.codes.race[String(race)]) ?? String(race),
        subtitle: null,
        inferred: false,
        rows: members((hero) => member(hero).race === race),
        effect: false,
        stacking: null,
        grid: grid(`razza=${race}`),
      });
    }
    for (const faction of parts.factions) {
      out.push({
        title: label(context?.codes.faction[String(faction)]) ?? String(faction),
        subtitle: null,
        inferred: false,
        rows: members((hero) => member(hero).factions.includes(faction)),
        effect: false,
        stacking: null,
        grid: grid(`caratteristica=${faction}`),
      });
    }
    for (const n of parts.groups) {
      const group = index.groups[n];
      if (!group) continue;
      out.push({
        title: group.enemies ? t.nemici : t.alleati,
        subtitle: label(group.definition),
        inferred: false,
        rows: members((hero) => inGroup(group, member(hero), heroId)),
        effect: false,
        stacking: null,
        grid: grid(gridQuery(group)),
      });
    }
    return out;
  };

  /** Titolo, numero di eroi e definizione di una parte. */
  const Heading = ({ section, index }: { section: Section; index: number }) => (
    <>
      <p className="m-0 text-[14px] font-semibold leading-snug">
        {section.title}
        {section.inferred ? (
          <span className="ml-1 text-ink-3" title={t.dedotto}>
            ?
          </span>
        ) : null}
        {/* cercando diventa «19 di 108»: lo riscrive TermPopoverClient */}
        <span
          className={cx(eyebrow, "ml-2")}
          data-conta={index}
          data-totale={section.rows.length}
          data-di={t.di}
          data-testo={t.eroi(section.rows.length)}
        >
          {t.eroi(section.rows.length)}
        </span>
      </p>
      {section.subtitle ? <p className="m-0 mt-0.5 text-[12px] leading-snug text-ink-2">{section.subtitle}</p> : null}
      {section.stacking && section.stacking.length > 0 ? (
        <p className="m-0 mt-1 text-[12px] leading-snug text-ink-2">
          <span className="font-semibold text-ink">{t.cumulo}:</span>{" "}
          {section.stacking.length === 1
            ? t.regola(section.stacking[0]!)
            : section.stacking.map((s) => `${t.regola(s)} (${t.carte(s.cards)})`).join(" · ")}{" "}
          {/* nella frase e non sotto: la freccia disegnata di MoreLink, il corpo del testo */}
          <Link href={`/${game}/meccaniche#cumulo`} className="group/more inline-flex items-center gap-1 text-brand-deep hover:underline">
            {t.comeSiCumula}
            <MoreArrow className="size-3" />
          </Link>
        </p>
      ) : null}
    </>
  );

  return (
    <>
      {[...targets].sort().map((target) => {
        const id = targetId(target);
        const list = sections(target);
        if (list.length === 0) return null;
        const searchable = list.reduce((sum, section) => sum + section.rows.length, 0) >= SEARCH_FROM;
        return (
          // Una colonna: in cima la testa, ferma, con la ricerca; sotto l'elenco,
          // che scorre. `flex` solo da aperta: una classe di display sulla
          // tendina chiusa vincerebbe sul display:none del browser, e le tendine
          // resterebbero tutte aperte.
          <div
            key={id}
            id={id}
            popover="auto"
            aria-label={list.map((section) => section.title).join(", ")}
            className="tendina w-[min(26rem,calc(100vw-2rem))] max-h-[min(30rem,70vh)] flex-col overflow-hidden rounded-card border border-rule bg-paper-2 p-0 text-ink shadow-2xl [&:popover-open]:flex"
          >
            <header className="shrink-0 border-b border-rule px-3.5 py-2.5">
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1">
                  <Heading section={list[0]!} index={0} />
                </div>
                <button
                  type="button"
                  popoverTarget={id}
                  popoverTargetAction="hide"
                  aria-label={t.chiudi}
                  className="-mr-1 shrink-0 cursor-pointer px-1 text-[18px] leading-none text-ink-3 hover:text-ink"
                >
                  ×
                </button>
              </div>
              {/*
                Nascosta finche' il JavaScript non la accende: senza, una casella
                in cui si scrive e non succede niente sarebbe peggio di nessuna.
              */}
              {searchable ? (
                <input
                  type="search"
                  hidden
                  placeholder={t.cerca}
                  aria-label={t.cercaEtichetta}
                  className="tendina-cerca mt-2 h-8 w-full border border-rule bg-paper px-2.5 text-[13px] text-ink placeholder:text-ink-3 focus-visible:outline-2 focus-visible:outline-brand"
                />
              ) : null}
            </header>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {list.map((section, s) => (
                <section key={s} data-sezione={s}>
                  {s > 0 ? (
                    <header className="sticky top-0 z-10 border-y border-rule bg-paper-2 px-3.5 py-2">
                      <Heading section={section} index={s} />
                    </header>
                  ) : null}

                  {section.rows.length === 0 ? (
                    <p className="m-0 px-3.5 py-3 text-[13px] text-ink-3">{t.nessuno}</p>
                  ) : (
                    // Le classi stanno sull'elenco e non su ogni riga: gli elenchi
                    // arrivano a 163 eroi (gli Umani), e ogni byte si ripete
                    <ul className="m-0 list-none p-1.5 [&_a]:flex [&_a]:items-center [&_a]:gap-2.5 [&_a]:[&_a]:px-2 [&_a]:py-1.5 [&_a:hover]:bg-paper [&_img]:h-10 [&_img]:w-10 [&_img]:shrink-0 [&_img]:[&_img]:bg-paper">
                      {section.rows.map(({ hero, places }) => {
                        const current = hero.id === heroId;
                        return (
                          <li
                            key={hero.id}
                            // su cosa cerca la barra: nome ed epiteto nelle due
                            // lingue, il personaggio, e le abilita' della riga
                            data-cerca={
                              searchable
                                ? searchText(
                                    [hero.name, hero.epithet, hero.nameIt, hero.epithetIt, hero.group, ...places]
                                      .filter(Boolean)
                                      .join(" "),
                                  )
                                : undefined
                            }
                          >
                            <Link href={`/${game}/eroi/${hero.id}`} className={current ? "bg-brand-soft" : undefined}>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={heroCardSrc(game, hero.id)} alt="" width={128} height={128} loading="lazy" />
                              <span className="min-w-0 text-[13px] leading-tight">
                                <span className="font-semibold">{heroName(hero, locale)}</span>
                                <span className="text-ink-3">
                                  {" · "}
                                  {heroEpithet(hero, locale)}
                                  {current ? ` · ${t.questoEroe}` : ""}
                                </span>
                                {places.map((place) => (
                                  <span key={place} className="block text-[12px] text-ink-2">
                                    {place}
                                  </span>
                                ))}
                              </span>
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                  {searchable && section.rows.length > 0 ? (
                    <p data-vuoto="" hidden className="m-0 px-3.5 pb-3 text-[13px] text-ink-3">
                      {t.nessunRisultato}
                    </p>
                  ) : null}
                  {section.effect && section.rows.length === 1 && section.rows[0]!.hero.id === heroId ? (
                    <p className="m-0 px-3.5 pb-3 text-[12px] text-ink-3">{t.soloQuesto}</p>
                  ) : null}
                  {section.grid ? (
                    <p className="m-0 px-3.5 pb-3">
                      <Link href={section.grid} className={moreLinkClass}>
                        {t.griglia}
                        <MoreArrow />
                      </Link>
                    </p>
                  ) : null}
                </section>
              ))}
            </div>
          </div>
        );
      })}
      <TermPopoverClient />
    </>
  );
}
