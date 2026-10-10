/**
 * La scheda «Abilita'» della pagina di un eroe: carte A e B coi loro ranghi,
 * ultimate, passiva, e Comandamenti, Grazie, Unita' e Talenti.
 *
 * In un file suo dal 26/09, quando la pagina e' passata alle schede. La passiva
 * e le sue condizioni servono anche alla Reliquia sacra, che ne ha una: per
 * questo `PassiveConditions` e `PassiveText` sono esportate.
 */

import { GameNotes, GameText } from "@/components/heroes/game-text";
import { HeroBox, hasIcon, localized, textIn } from "@/components/heroes/hero-parts";
import type { TermIds } from "@/components/heroes/hero-terms";
import { HeroDrawLine, HeroTeamEffect } from "@/components/heroes/hero-mechanics";
import { HeroStickyColumns } from "@/components/heroes/hero-sticky-columns";
import { cx, numeric } from "@/components/ui";
import {
  gameIconSrc,
  heroCardArtSrc,
  heroSkillIconSrc,
  heroSpecialIconSrc,
  heroUltimateArtSrc,
} from "@/lib/games/heroes";
import type {
  HeroAbilities as HeroAbilitiesData,
  HeroAssets,
  HeroCard,
  HeroCardContext,
  HeroContext,
  HeroEffect,
  HeroLabel,
  HeroSpecialAbility,
  HeroSpecialKind,
} from "@/lib/games/types";
import type { MechanicsTeamEffect } from "@/lib/games/mechanics-types";
import { inLingua, testi, type Locale } from "@/lib/i18n/locale";

/**
 * L'articolo davanti al tipo, nella riga "... segue il rango scelto": l'Unita', la Grazia.
 * Solo italiano: in inglese l'articolo e' sempre "the".
 */
const ARTICOLO_SPECIALE: Readonly<Record<string, string>> = {
  comandamento: "il ",
  grazia: "la ",
  unita: "l'",
  talento: "il ",
};

const TESTI = testi({
  it: {
    carteAttacco: "Carte d’attacco",
    fonteCarte:
      "Quali carte ha l’eroe e cosa fanno a ogni rango vengono dalle tabelle del client del gioco.",
    // Solo in italiano: in inglese i testi dei ranghi sono semplicemente nella
    // lingua della pagina, e non c'e' niente da avvertire.
    testiInInglese: " I testi restano in inglese — il client ne ha solo i modelli, senza i valori." as
      | string
      | null,
    ultimate: "Ultimate",
    // Il nome della schermata dell'eroe nel gioco (UI_hero_info_49): «Unica».
    passiva: "Unica",
    passivaSenzaTesto: "Di questa Unica abbiamo l’icona dal client, non ancora il testo.",
    accostamentoDedotto: "(accostamento dedotto dal vocabolario del client)",
    soggettoSpeciale: (tipo: string, etichetta: HeroLabel | undefined) =>
      etichetta?.it ? `${ARTICOLO_SPECIALE[tipo] ?? "l'abilità: "}${etichetta.it}` : "l'abilità",
    soggettoPassiva: "l’Unica",
    ultimateAlRango: (rango: number) => `Ultimate al rango ${rango}`,
    segueRango: (soggetto: string) => `· ${soggetto} segue il rango scelto sulla carta dell’ultimate`,
    valoriArancione: ": i valori in arancione sono quelli legati al rango",
    rango: (rango: number) => `Rango ${rango}`,
    carta: (slot: string) => `carta ${slot}`,
  },
  en: {
    carteAttacco: "Skill cards",
    fonteCarte: "Which cards the hero has and what they do at each rank come from the game client's tables.",
    testiInInglese: null,
    ultimate: "Ultimate Move",
    passiva: "Unique",
    passivaSenzaTesto: "For this Unique we have the icon from the client, not the text yet.",
    accostamentoDedotto: "(match inferred from the client's vocabulary)",
    // In inglese l'articolo e' uno solo, e il nome del tipo e' quello del gioco.
    soggettoSpeciale: (_tipo: string, etichetta: HeroLabel | undefined) =>
      etichetta?.en ? `the ${etichetta.en}` : "the ability",
    soggettoPassiva: "the Unique",
    ultimateAlRango: (rango: number) => `Ultimate Move at rank ${rango}`,
    segueRango: (soggetto: string) => `· ${soggetto} follows the rank chosen on the Ultimate Move card`,
    valoriArancione: ": values in orange are the ones tied to the rank",
    rango: (rango: number) => `Rank ${rango}`,
    carta: (slot: string) => `card ${slot}`,
  },
});

/** I passi che seguono l'ultimate, col testo gia' nella lingua della pagina. */
function stepsIn(
  steps: readonly { fromUltimateRank: number; text: string; textIt?: string }[] | undefined,
  locale: Locale,
): { fromUltimateRank: number; text: string }[] | undefined {
  return steps?.map((step) => ({ fromUltimateRank: step.fromUltimateRank, text: textIn(step, locale) }));
}

/**
 * Le tendine delle parole blu di un testo che cambia col rango dell'ultimate
 * (l'Unica, un Talento): una fila per versione, nell'ordine `[testo, ...passi]`
 * di PassiveText.
 */
function versionTerms(
  termIds: TermIds | undefined,
  item: { text: string; textIt?: string; ultimateSteps?: readonly { text: string; textIt?: string }[] },
  withSteps: boolean,
  locale: Locale,
): (readonly (string | null)[] | undefined)[] | undefined {
  if (!termIds) return undefined;
  const steps = withSteps ? (item.ultimateSteps ?? []) : [];
  return [item, ...steps].map((version) => termIds(version.text, textIn(version, locale)));
}

/**
 * Dove si ferma la colonna corta: sotto l'intestazione del sito (60px), la
 * barra delle schede (55) e lo stesso spazio che la barra lascia sopra la
 * scheda (20). Lo stesso numero sta scritto in `top-[135px]` qui sotto:
 * Tailwind legge il sorgente, e una classe composta non finirebbe nel CSS.
 */
const STICKY_TOP = 135;

/**
 * La scheda «Abilita'»: a sinistra l'Unica e sotto le abilita' speciali, a
 * destra le tre carte che l'eroe gioca, A, B e ultimate.
 *
 * Scelta dell'utente (26/09), dopo una prima versione a coppie (A accanto a B,
 * ultimate accanto all'Unica): l'Unica e' il testo lungo e le carte sono
 * illustrazioni alte con due o tre righe accanto, quindi due colonne ognuna
 * col suo genere si riempiono meglio di righe che si allungano sulla piu' alta.
 * Comandamenti, Grazie, Unita' e Talenti vanno sotto l'Unica: si aggiungono a
 * lei, e il Talento ne segue il rango dell'ultimate come lei.
 *
 * Stretta torna una colonna: prima la colonna di sinistra, poi le carte, lo
 * stesso ordine in cui si leggono le due colonne. Se una delle due colonne e'
 * vuota (un modulo con le sole carte) l'altra prende tutta la larghezza.
 *
 * Le colonne le decide la larghezza della scheda (`@4xl`, 896px, sul
 * contenitore che `HeroTabs` mette intorno a ogni scheda), non quella della
 * finestra: la barra laterale del sito c'e' da 1024px in su e si mangia 210px,
 * quindi a parita' di finestra lo spazio cambia. Sotto i 896px una carta
 * avrebbe meno di 440px, e il testo accanto all'illustrazione scenderebbe sotto
 * i 280.
 *
 * Affiancate, la colonna piu' corta resta ferma mentre si scorre la lunga
 * (HeroStickyColumns, 10/10): in cima sotto la barra se sta nello schermo,
 * altrimenti col fondo in fondo allo schermo, quando ci arriva. Quasi sempre e'
 * quella dell'Unica, e sotto di lei restava un vuoto di 600-900px accanto alle
 * carte. Le alternative misurate erano peggiori: le
 * colonne del CSS (`columns`) bilanciano l'altezza ma spostano i riquadri da
 * una colonna all'altra a ogni rango scelto, e l'ultimate sotto l'Unica
 * mescola i due generi che la scelta del 26/09 separa.
 */
export function HeroAbilities({
  game,
  locale,
  heroId,
  abilities,
  assets,
  context,
  glossary,
  passiveConditions,
  specials,
  specialKinds,
  icons,
  termIds,
  draw,
  teamEffect,
}: {
  game: string;
  locale: Locale;
  heroId: string;
  abilities: HeroAbilitiesData | undefined;
  assets: HeroAssets | undefined;
  context: HeroContext | undefined;
  glossary: Readonly<Record<string, HeroEffect>> | undefined;
  passiveConditions: Readonly<Record<string, { icon: string; description: HeroLabel }>> | undefined;
  specials: readonly { id: string; ability: HeroSpecialAbility }[];
  specialKinds: Readonly<Record<string, HeroSpecialKind>> | undefined;
  icons: Readonly<Record<string, readonly string[]>> | undefined;
  /** le tendine delle parole blu (hero-terms.tsx); senza, le parole restano testo */
  termIds?: TermIds;
  /** i pesi di pesca delle carte A e B (meccaniche): una riga sotto le carte */
  draw?: readonly [number, number];
  /** l'effetto di squadra Luce/Oscurita' (meccaniche): un riquadro sotto l'ultimate */
  teamEffect?: { readonly light?: MechanicsTeamEffect; readonly dark?: MechanicsTeamEffect };
}) {
  const t = TESTI[locale];

  // Quante carte mostrare quando NON c'e' il database delle abilita': e' il
  // ripiego per un modulo che abbia gli sprite e non ancora i testi. Con il
  // database si usa `abilities.cards`, che sono quelle di QUESTA versione,
  // mentre gli sprite dedotti dallo slug sono tutti quelli del personaggio.
  const cardCount = assets?.cards ?? 0;
  const cards = abilities?.cards ?? [];

  // `data-ferma` lo mette HeroStickyColumns: `alto` ferma in cima sotto la
  // barra, `basso` ferma col fondo in fondo allo schermo. `@4xl` perche' una
  // colonna ferma sopra l'altra, nella scheda stretta, coprirebbe quella che
  // scorre sotto
  const column = cx(
    "grid min-w-0 content-start gap-y-4",
    "@4xl:data-[ferma=alto]:sticky @4xl:data-[ferma=alto]:top-[135px]",
    "@4xl:data-[ferma=basso]:sticky @4xl:data-[ferma=basso]:bottom-4 @4xl:data-[ferma=basso]:self-end",
  );

  const unique = !!(abilities?.passive?.text || assets?.skill);
  const left = unique || specials.length > 0;
  const right = cards.length > 0 || cardCount > 0 || !!abilities?.ultimate;

  // L'effetto di squadra Luce/Oscurita' sta a destra, sotto l'ultimate e accanto
  // alla riga della pesca: sono le due righe su come gioca l'eroe in squadra. Fino
  // al 10/10 stava sotto l'Unica, e la colonna di sinistra (Unica, Talento,
  // effetto) finiva lunga il doppio di quella delle carte, con un vuoto a destra.
  const team = teamEffect ? (
    <HeroTeamEffect game={game} locale={locale} light={teamEffect.light} dark={teamEffect.dark} />
  ) : null;

  return (
    <>
      <div
        id={left && right ? "abilita-colonne" : undefined}
        className={cx("grid items-start gap-x-5 gap-y-4", left && right && "@4xl:grid-cols-2")}
      >
        {left ? (
          <div className={column}>
            {unique ? (
              <HeroBox title={t.passiva} tone="gold">
                {/*
                  Icona e testo vengono tutti e due dal client: l'icona e' il campo
                  `icon` della passiva (abilita_speciali.py, `icone_uniche`), il testo
                  il suo modello riempito coi valori. Se manca uno dei due si mostra
                  l'altro: un'icona senza testo resta un'informazione, e un testo
                  senza icona pure.
                */}
                <div
                  className="grid items-start gap-4"
                  style={assets?.skill ? { gridTemplateColumns: "56px minmax(0, 1fr)" } : undefined}
                >
                  {assets?.skill ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={heroSkillIconSrc(game, heroId)}
                      alt=""
                      width={64}
                      height={64}
                      loading="lazy"
                      className="block w-full rounded-card border border-rule bg-paper"
                    />
                  ) : null}

                  <div className="min-w-0">
                    {abilities?.passive?.name ? (
                      <p className="m-0 mb-1 font-semibold">
                        {localized(abilities.passive.nameI18n, abilities.passive.name, locale)}
                      </p>
                    ) : null}
                    <PassiveConditions
                      game={game}
                      locale={locale}
                      codes={context?.passiveConditions}
                      conditions={passiveConditions}
                      icons={icons}
                    />
                    {abilities?.passive?.text ? (
                      <PassiveText
                        game={game}
                        locale={locale}
                        text={textIn(
                          { text: abilities.passive.text, textIt: abilities.passive.textIt },
                          locale,
                        )}
                        // Senza i pulsanti dell'ultimate non c'e' un rango da seguire:
                        // resta il testo del rango 1, e nessun pannello resta spento.
                        steps={
                          (abilities.ultimate?.ranks.length ?? 0) > 1
                            ? stepsIn(abilities.passive.ultimateSteps, locale)
                            : undefined
                        }
                        context={context?.cards["passiva"]}
                        glossary={glossary}
                        icons={icons}
                        terms={versionTerms(
                          termIds,
                          { ...abilities.passive, text: abilities.passive.text },
                          (abilities.ultimate?.ranks.length ?? 0) > 1,
                          locale,
                        )}
                      />
                    ) : (
                      <p className="m-0 text-sm text-ink-3">{t.passivaSenzaTesto}</p>
                    )}
                  </div>
                </div>
              </HeroBox>
            ) : null}

            {/*
              Comandamenti, Grazie, Unita' e Talenti: un riquadro per abilita', col
              nome del suo tipo come titolo, subito sotto l'Unica a cui si
              aggiungono. Nessun eroe ne ha piu' di una, ma la lista regge anche quel
              caso.
            */}
            {specials.map(({ id, ability }) => {
              const kind = specialKinds?.[ability.kind];
              return (
                <HeroBox key={id} title={inLingua(kind?.label, locale) ?? ability.kind}>
                  <SpecialAbility
                    game={game}
                    locale={locale}
                    id={id}
                    ability={ability}
                    kind={kind}
                    conditions={passiveConditions}
                    icons={icons}
                    reactive={(abilities?.ultimate?.ranks.length ?? 0) > 1}
                    termIds={termIds}
                  />
                </HeroBox>
              );
            })}

            {right ? null : team}
          </div>
        ) : null}

        {right ? (
          <div className={column}>
            {/*
              Una riga per carta, con la sua illustrazione: quale sia lo dichiara
              il client (DB_skill_card_resource.icon, letto da accosta_carte.py).
            */}
            {cards.map((card, index) => (
              <HeroBox
                key={index}
                title={card.slot === "A" || card.slot === "B" ? t.carta(card.slot) : t.carteAttacco}
              >
                <CardRow
                  game={game}
                  locale={locale}
                  heroId={heroId}
                  card={card}
                  context={card.slot ? context?.cards[card.slot] : undefined}
                  glossary={glossary}
                  icons={icons}
                  termIds={termIds}
                />
              </HeroBox>
            ))}

            {draw && cards.some((card) => card.slot === "A" || card.slot === "B") ? (
              <HeroDrawLine game={game} locale={locale} weights={draw} />
            ) : null}

            {/*
              Fino al 26/09 qui c'era una galleria di illustrazioni «non
              attribuite», per gli eroi di cui non si sapeva quale sprite fosse
              quale carta. Il client lo dichiara per tutte: la galleria non
              aveva piu' niente da mostrare, e la sua frase («non si ricava dal
              client») era diventata falsa.
            */}
            {cards.length === 0 && cardCount > 0 ? (
              /* Ripiego: ci sono gli sprite ma nessun testo. Vale per un modulo che
                 abbia le immagini e non ancora il database delle abilita'. */
              <HeroBox title={t.carteAttacco} aside={<span className={numeric}>{cardCount}</span>}>
                <Sprites game={game} heroId={heroId} count={cardCount} />
              </HeroBox>
            ) : null}

            {abilities?.ultimate ? (
              <HeroBox title={t.ultimate}>
                {/*
                  La carta dell'ultimate accanto al testo, come per le carte
                  d'attacco. Un'ultimate per eroe, quindi niente accostamento per
                  nome: basta sapere che l'illustrazione e' sua, e `assets.ultimate`
                  c'e' solo quando lo si sa.
                */}
                <CardRow
                  game={game}
                  locale={locale}
                  heroId={heroId}
                  card={abilities.ultimate}
                  context={context?.cards["ultimate"]}
                  glossary={glossary}
                  icons={icons}
                  artSrc={assets?.ultimate ? heroUltimateArtSrc(game, heroId) : undefined}
                  termIds={termIds}
                />
              </HeroBox>
            ) : null}

            {team}
          </div>
        ) : null}
      </div>
      {left && right ? <HeroStickyColumns gridId="abilita-colonne" top={STICKY_TOP} /> : null}

      {cards.length > 0 ? (
        <p className="mt-5 text-[13px] text-ink-3">
          {t.fonteCarte}
          {/*
            L'avviso vale solo se qualche testo resta davvero in inglese:
            con `textsInItalian` la pagina in italiano li mostra tutti in
            italiano, e in inglese l'avviso non esiste.
          */}
          {abilities?.textsInEnglish && !abilities.textsInItalian ? t.testiInInglese : null}
        </p>
      ) : null}
    </>
  );
}

/** Gli sprite delle carte senza un testo accanto: in fila, piccoli. */
function Sprites({ game, heroId, count }: { game: string; heroId: string; count: number }) {
  return (
    <ul className="m-0 flex list-none flex-wrap gap-3 p-0">
      {Array.from({ length: count }, (_, index) => (
        <li key={index}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={heroCardArtSrc(game, heroId, index + 1)}
            alt=""
            width={128}
            height={256}
            loading="lazy"
            className="block w-[84px] bg-paper-2"
          />
        </li>
      ))}
    </ul>
  );
}

/**
 * Cosa fa una carta, detto con i termini del gioco.
 *
 * Il testo del rango, in una lingua o nell'altra, e' pieno di meccaniche
 * evidenziate che non si spiegano da sole. Qui ci sono le stesse meccaniche come termini, con la
 * definizione che il GIOCO ne da': quelle che si scrive nelle note dentro
 * l'abilita', il suo dizionario dei buff, la tassonomia con cui filtra gli
 * effetti.
 *
 * Un termine DEDOTTO si vede che lo e'. Il gioco quelle operazioni - "Removes
 * Buffs", "depletes" - non le definisce in nessun posto in chiaro, e
 * l'accostamento viene dal vocabolario interno del client: e' una garanzia
 * diversa da una definizione scritta, e chi legge ha diritto di distinguerle.
 */
function Effects({
  context,
  glossary,
  locale,
}: {
  context: HeroCardContext | undefined;
  glossary: Readonly<Record<string, HeroEffect>> | undefined;
  locale: Locale;
}) {
  if (!context || !glossary) return null;

  // Prima quelli di tutta la carta, poi quelli che compaiono salendo di rango.
  // Tenerli separati evita di dire che al rango 1 la carta fa gia' quello che
  // impara al 3.
  const common = context.effects
    .map((key) => glossary[key])
    .filter((effect): effect is HeroEffect => effect !== undefined);

  const later = Object.entries(context.onlyAtRanks ?? {}).flatMap(([rank, keys]) =>
    keys
      .map((key) => ({ rank, effect: glossary[key] }))
      .filter((item): item is { rank: string; effect: HeroEffect } => item.effect !== undefined),
  );

  if (common.length === 0 && later.length === 0) return null;

  return (
    <ul className="m-0 mt-2.5 flex list-none flex-wrap gap-1.5 p-0">
      {common.map((effect, index) => (
        <EffectTag key={`c${index}`} effect={effect} locale={locale} />
      ))}
      {later.map((item, index) => (
        <EffectTag key={`l${index}`} effect={item.effect} rank={item.rank} locale={locale} />
      ))}
    </ul>
  );
}

function EffectTag({
  effect,
  rank,
  locale,
}: {
  effect: HeroEffect;
  rank?: string;
  locale: Locale;
}) {
  const label = inLingua(effect.label, locale);
  if (!label) return null;

  const definition = inLingua(effect.definition, locale);
  const dedotto = effect.certainty === "dedotto";

  return (
    <li
      className={cx(
        "inline-flex items-baseline gap-1 border px-1.5 py-0.5 text-[12px]",
        dedotto ? "border-dashed border-rule-2 text-ink-3" : "border-rule text-ink-2",
      )}
      title={
        // Il titolo porta la definizione del gioco e, quando serve, il fatto
        // che l'accostamento sia dedotto. Non e' il posto ideale per una
        // spiegazione, ma e' quello che non allunga la scheda di 30 righe.
        [definition, dedotto ? TESTI[locale].accostamentoDedotto : null]
          .filter(Boolean)
          .join(" ") || undefined
      }
    >
      {rank ? <span className={cx(numeric, "text-[12px] text-ink-3")}>R{rank}</span> : null}
      <span>{label}</span>
      {dedotto ? <span className="text-ink-3">?</span> : null}
    </li>
  );
}

/**
 * Le classi dei sei ranghi, scritte per esteso una per una.
 *
 * Sembra ripetizione ed e' invece l'unico modo che funziona: Tailwind legge il
 * SORGENTE per sapere quali regole generare, quindi una classe costruita con
 * un template - `peer/r${n}` - non finirebbe mai nel CSS e il selettore non
 * cambierebbe niente, senza dare errore da nessuna parte. Sei perche' tanti
 * sono i ranghi dell'ultimate; le carte A e B ne hanno tre.
 */
const RANK_CLASSES = [
  {
    hook: "rk1",
    chip: "group-has-[.rk1:checked]:border-brand group-has-[.rk1:checked]:bg-brand-soft group-has-[.rk1:checked]:text-ink group-has-[.rk1:checked]:opacity-100 group-has-[.rk1:focus-visible]:outline-2 group-has-[.rk1:focus-visible]:outline-ink group-has-[.rk1:focus-visible]:opacity-100",
    show: "group-has-[.rk1:checked]:block",
  },
  {
    hook: "rk2",
    chip: "group-has-[.rk2:checked]:border-brand group-has-[.rk2:checked]:bg-brand-soft group-has-[.rk2:checked]:text-ink group-has-[.rk2:checked]:opacity-100 group-has-[.rk2:focus-visible]:outline-2 group-has-[.rk2:focus-visible]:outline-ink group-has-[.rk2:focus-visible]:opacity-100",
    show: "group-has-[.rk2:checked]:block",
  },
  {
    hook: "rk3",
    chip: "group-has-[.rk3:checked]:border-brand group-has-[.rk3:checked]:bg-brand-soft group-has-[.rk3:checked]:text-ink group-has-[.rk3:checked]:opacity-100 group-has-[.rk3:focus-visible]:outline-2 group-has-[.rk3:focus-visible]:outline-ink group-has-[.rk3:focus-visible]:opacity-100",
    show: "group-has-[.rk3:checked]:block",
  },
  {
    hook: "rk4",
    chip: "group-has-[.rk4:checked]:border-brand group-has-[.rk4:checked]:bg-brand-soft group-has-[.rk4:checked]:text-ink group-has-[.rk4:checked]:opacity-100 group-has-[.rk4:focus-visible]:outline-2 group-has-[.rk4:focus-visible]:outline-ink group-has-[.rk4:focus-visible]:opacity-100",
    show: "group-has-[.rk4:checked]:block",
  },
  {
    hook: "rk5",
    chip: "group-has-[.rk5:checked]:border-brand group-has-[.rk5:checked]:bg-brand-soft group-has-[.rk5:checked]:text-ink group-has-[.rk5:checked]:opacity-100 group-has-[.rk5:focus-visible]:outline-2 group-has-[.rk5:focus-visible]:outline-ink group-has-[.rk5:focus-visible]:opacity-100",
    show: "group-has-[.rk5:checked]:block",
  },
  {
    hook: "rk6",
    chip: "group-has-[.rk6:checked]:border-brand group-has-[.rk6:checked]:bg-brand-soft group-has-[.rk6:checked]:text-ink group-has-[.rk6:checked]:opacity-100 group-has-[.rk6:focus-visible]:outline-2 group-has-[.rk6:focus-visible]:outline-ink group-has-[.rk6:focus-visible]:opacity-100",
    show: "group-has-[.rk6:checked]:block",
  },
] as const;

/** Cosa porta il pulsante del rango: stelle (carte A e B), pietre (ultimate), o la sigla. */
type RankMark = "stelle" | "pietre" | "sigle";

/**
 * Il rango dell'ultimate letto da FUORI della sua carta: lo usa la passiva.
 *
 * Il radio dell'ultimate porta due agganci. `rkN` lo legge la carta, per il
 * testo del rango; `ultN` la passiva, che sta in un'altra sezione e quindi
 * chiede all'`<article>` (`group/scheda`). L'articolo contiene anche le carte A
 * e B coi loro `rk1`-`rk3`: chiedendogli `.rk3:checked` risponderebbe pure la
 * carta A, e la passiva seguirebbe il rango sbagliato.
 *
 * Scritte per esteso per la stessa ragione di RANK_CLASSES: Tailwind legge il
 * sorgente.
 */
const ULTIMATE_LINK = [
  {
    hook: "ult1",
    show: "group-has-[.ult1:checked]/scheda:block",
    inline: "group-has-[.ult1:checked]/scheda:inline-flex",
  },
  {
    hook: "ult2",
    show: "group-has-[.ult2:checked]/scheda:block",
    inline: "group-has-[.ult2:checked]/scheda:inline-flex",
  },
  {
    hook: "ult3",
    show: "group-has-[.ult3:checked]/scheda:block",
    inline: "group-has-[.ult3:checked]/scheda:inline-flex",
  },
  {
    hook: "ult4",
    show: "group-has-[.ult4:checked]/scheda:block",
    inline: "group-has-[.ult4:checked]/scheda:inline-flex",
  },
  {
    hook: "ult5",
    show: "group-has-[.ult5:checked]/scheda:block",
    inline: "group-has-[.ult5:checked]/scheda:inline-flex",
  },
  {
    hook: "ult6",
    show: "group-has-[.ult6:checked]/scheda:block",
    inline: "group-has-[.ult6:checked]/scheda:inline-flex",
  },
] as const;

/**
 * Un Comandamento, una Grazia, un'Unita' o un Talento.
 *
 * L'icona arriva gia' nella cornice del suo tipo, com'e' nel gioco: tutte e due
 * dal client (DB_skill_passive.icon, e la cornice del tipo). Sotto il testo, le
 * regole con cui il gioco fa convivere i tipi in squadra: sono la cosa che
 * decide se l'abilita' si attiva davvero.
 */
function SpecialAbility({
  game,
  locale,
  id,
  ability,
  kind,
  conditions,
  icons,
  reactive,
  termIds,
}: {
  game: string;
  locale: Locale;
  id: string;
  ability: HeroSpecialAbility;
  kind: HeroSpecialKind | undefined;
  conditions: Readonly<Record<string, { icon: string; description: HeroLabel }>> | undefined;
  icons: Readonly<Record<string, readonly string[]>> | undefined;
  /** c'e' un rango dell'ultimate da seguire */
  reactive: boolean;
  termIds?: TermIds;
}) {
  const t = TESTI[locale];
  const name = inLingua(ability.name, locale);
  const rules = (kind?.rules ?? [])
    .map((rule) => inLingua(rule, locale))
    .filter((rule): rule is string => rule !== null);

  return (
    // il riquadro e il titolo col tipo li mette HeroBox, nella scheda
    <div
      className="grid items-start gap-4"
      style={ability.icon ? { gridTemplateColumns: "76px minmax(0, 1fr)" } : undefined}
    >
      {ability.icon ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={heroSpecialIconSrc(game, id)}
          alt=""
          width={122}
          height={127}
          loading="lazy"
          className="block h-auto w-full"
        />
      ) : null}

      <div className="min-w-0">
        {name ? (
          <GameText text={name} className="m-0 font-semibold [&>p]:m-0" />
        ) : null}

        <PassiveConditions
          game={game}
          locale={locale}
          codes={ability.conditions}
          conditions={conditions}
          icons={icons}
        />
        <PassiveText
          game={game}
          locale={locale}
          text={textIn(ability, locale)}
          steps={reactive ? stepsIn(ability.ultimateSteps, locale) : undefined}
          icons={icons}
          subject={t.soggettoSpeciale(ability.kind, kind?.label)}
          terms={versionTerms(termIds, ability, reactive, locale)}
        />

        {rules.length > 0 ? (
          <ul className="m-0 mt-2.5 list-none border-t border-rule p-0 pt-2 text-[12px] leading-snug text-ink-3 [&>li+li]:mt-1">
            {rules.map((rule) => (
              <li key={rule}>
                <GameText text={rule} className="[&>p]:m-0" />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}

/**
 * Dove si attiva la passiva, con le icone del gioco.
 *
 * Sono quelle del riquadro dell'abilita' unica - la spada nel quadrato rosso,
 * la mano bianca nel cerchio blu - e servono a capire a colpo d'occhio se una
 * passiva vale in battaglia o anche dallo slot secondario, in tutti i contenuti
 * o solo in PvP.
 *
 * Icona E frase, non l'icona da sola: le frasi sono quelle del gioco, e le
 * icone dell'esclusione (la croce rossa sulla bestia, sul demone) non si
 * leggono al primo sguardo per chi il gioco non lo conosce ancora. Dove l'icona
 * manca - chi clona senza asset - resta la frase.
 */
export function PassiveConditions({
  game,
  locale,
  codes,
  conditions,
  icons,
}: {
  game: string;
  locale: Locale;
  codes: readonly number[] | undefined;
  conditions: Readonly<Record<string, { icon: string; description: HeroLabel }>> | undefined;
  icons: Readonly<Record<string, readonly string[]>> | undefined;
}) {
  const rows = (codes ?? [])
    .map((code) => conditions?.[String(code)])
    .filter((condition): condition is { icon: string; description: HeroLabel } => !!condition)
    .map((condition) => ({
      icon: condition.icon,
      text: inLingua(condition.description, locale),
    }))
    .filter((row): row is { icon: string; text: string } => row.text !== null);

  if (rows.length === 0) return null;

  return (
    <ul className="m-0 mb-2.5 flex list-none flex-wrap gap-x-4 gap-y-1.5 p-0">
      {rows.map((row) => (
        <li
          key={row.icon}
          className="inline-flex items-center gap-1.5 text-[12px] leading-snug text-ink-2"
        >
          {hasIcon(icons, "condizione", row.icon) ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={gameIconSrc(game, "condizione", row.icon)}
              alt=""
              width={64}
              height={64}
              className="h-5 w-5 shrink-0"
            />
          ) : null}
          {row.text}
        </li>
      ))}
    </ul>
  );
}

/**
 * Il testo della passiva, che in 42 eroi segue il rango dell'ultimate.
 *
 * Come i ranghi delle carte, senza JavaScript: un pannello per versione del
 * testo, e ogni pannello si accende sui ranghi in cui vale. La versione che
 * vale dal rango 2 al 4 porta le classi dei ranghi 2, 3 e 4. Parte dal rango
 * che l'ultimate ha scelto da sola, il sesto.
 *
 * Le note in fondo seguono il rango anche loro: in 21 di queste 42 passive il
 * valore che sale sta anche dentro la definizione di un termine (`※Cold Snap:
 * Attack-related stats 15%`), e in 8 cambia SOLTANTO li'. Una nota ferma al
 * primo rango direbbe un numero sbagliato proprio dove la passiva cambia.
 */
export function PassiveText({
  game,
  locale,
  text,
  steps,
  context,
  glossary,
  icons,
  subject,
  terms,
}: {
  game: string;
  locale: Locale;
  text: string;
  /** chi segue il rango, nella riga sopra il testo: "la passiva", "il Talento"; se manca, la passiva */
  subject?: string;
  /** assenti quando la passiva non cambia, o quando non c'e' un rango da scegliere */
  steps?: readonly { fromUltimateRank: number; text: string }[];
  context?: HeroCardContext;
  glossary?: Readonly<Record<string, HeroEffect>>;
  icons?: Readonly<Record<string, readonly string[]>>;
  /** le tendine delle parole blu, una fila per versione come `[text, ...steps]` */
  terms?: readonly (readonly (string | null)[] | undefined)[];
}) {
  const t = TESTI[locale];
  const body = "text-sm leading-relaxed text-ink-2";

  if (!steps || steps.length === 0) {
    return (
      <>
        <GameText text={text} omitNotes className={body} terms={terms?.[0]} />
        <Effects context={context} glossary={glossary} locale={locale} />
        <GameNotes texts={[text]} className="mt-2.5" />
      </>
    );
  }

  const versions = [{ fromUltimateRank: 1, text }, ...steps];
  // Ogni versione vale dal suo rango fino a quello prima della seguente.
  const shows = versions.map((version, index) => {
    const until = versions[index + 1]?.fromUltimateRank ?? ULTIMATE_LINK.length + 1;
    return ULTIMATE_LINK.slice(version.fromUltimateRank - 1, until - 1).map((link) => link.show);
  });
  const gems = ULTIMATE_LINK.every((link) => hasIcon(icons, "carta", `pietra_${link.hook.slice(3)}`));
  const orange = versions.some((version) => version.text.includes("[FF8000]"));

  return (
    <>
      <p className="m-0 mb-2 flex flex-wrap items-center gap-x-1.5 text-[12px] leading-snug text-ink-3">
        {ULTIMATE_LINK.map((link, index) => (
          <span
            key={link.hook}
            className={cx("hidden items-center gap-1 font-semibold text-ink-2", link.inline)}
          >
            {gems ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={gameIconSrc(game, "carta", `pietra_${index + 1}`)}
                alt=""
                width={14}
                height={14}
                className="h-3.5 w-3.5 object-contain"
              />
            ) : null}
            {t.ultimateAlRango(index + 1)}
          </span>
        ))}
        <span>
          {t.segueRango(subject ?? t.soggettoPassiva)}
          {orange ? t.valoriArancione : ""}
        </span>
      </p>

      {versions.map((version, index) => (
        <div key={`testo-${version.fromUltimateRank}`} className={cx("hidden", ...shows[index]!)}>
          <GameText text={version.text} omitNotes className={body} terms={terms?.[index]} />
        </div>
      ))}

      <Effects context={context} glossary={glossary} locale={locale} />

      {versions.map((version, index) => (
        <div key={`note-${version.fromUltimateRank}`} className={cx("hidden", ...shows[index]!)}>
          <GameNotes texts={[version.text]} className="mt-2.5" />
        </div>
      ))}
    </>
  );
}

/**
 * I pulsanti per scegliere il rango.
 *
 * I tre ranghi stavano uno sotto l'altro e differivano quasi solo nella
 * percentuale: tre righe da leggere per trovare un numero diverso. Qui se ne
 * legge una alla volta.
 *
 * SENZA JAVASCRIPT, ed e' una scelta. Radio nascosti e regole CSS fanno
 * esattamente la stessa cosa di uno stato React, ma questa scheda pesa 186 byte
 * di script proprio perche' e' tutta renderizzata sul server: un `useState` qui
 * la trasformerebbe in un componente client e si porterebbe dietro nel bundle i
 * testi di tutti i ranghi di tutte le carte. Funziona anche a JavaScript
 * disattivato, e la tastiera lo tratta come il gruppo di radio che e'.
 *
 * I pulsanti stanno SOTTO l'illustrazione e il testo nell'altra colonna: il
 * legame passa da `group-has-[]` sulla carta intera, non da `peer-checked`,
 * che guarda solo i fratelli precedenti.
 *
 * Il pulsante segna il rango come lo segna il gioco. Sulle carte A e B porta
 * le stelle - una, due, tre. L'ultimate ha sei ranghi e il gioco li segna con
 * una pietra incastonata in cima alla carta, un colore per rango: verdina,
 * azzurra, gialla, arancione, rossa, e al sesto la goccia verde chiaro. Alle
 * sigle R1-R6 si torna senza i PNG, per chi clona senza gli asset.
 *
 * Parte dal rango PIU' ALTO: e' la carta com'e' quando conta, e chi vuole
 * vedere da dove parte scende di uno.
 */
function RankButtons({
  game,
  locale,
  group,
  card,
  mark,
  fill,
}: {
  game: string;
  locale: Locale;
  group: string;
  card: HeroCard;
  mark: RankMark;
  /** sotto l'illustrazione: la riga e' larga quanto la carta, e i pulsanti crescono fino ai bordi */
  fill: boolean;
}) {
  const t = TESTI[locale];
  // Sotto la carta i pulsanti stanno in una riga sola. I tre a stelle crescono
  // fino ai bordi. Le sei pietre le mette in fila la griglia, a 18px l'una -
  // 120 meno cinque spazi da 2px, diviso sei - e la pietra ne occupa 14. Le sei
  // sigle invece in 120px non ci stanno - 25px l'una piu' gli spazi fanno 170 -
  // quindi vanno tre per riga.
  const layout = !fill
    ? "mt-2 flex flex-wrap gap-1.5"
    : mark === "stelle"
      ? "mt-1.5 flex gap-1"
      : mark === "pietre"
        ? "mt-1.5 grid grid-cols-6 gap-0.5"
        : "mt-1.5 grid grid-cols-3 gap-1";

  return (
    <div className={layout}>
      {card.ranks.map((rank, index) => (
        <input
          key={`radio-${rank.rank}`}
          type="radio"
          name={group}
          id={`${group}-${rank.rank}`}
          defaultChecked={index === card.ranks.length - 1}
          className={cx(
            "sr-only",
            RANK_CLASSES[index]?.hook,
            card.slot === "ultimate" && ULTIMATE_LINK[rank.rank - 1]?.hook,
          )}
        />
      ))}

      {card.ranks.map((rank, index) => (
        <label
          key={`label-${rank.rank}`}
          htmlFor={`${group}-${rank.rank}`}
          title={t.rango(rank.rank)}
          className={cx(
            numeric,
            // il fuoco della tastiera (radio nascosti) sta in RANK_CLASSES: il
            // radio e' un fratello lontano, `peer` accenderebbe tutte le etichette
            "flex cursor-pointer items-center justify-center border border-rule bg-paper-2",
            "text-[12px] text-ink-3 transition hover:text-ink",
            // Le insegne spente a meta' dicono quale rango NON e' scelto meglio
            // del solo bordo: le stelle sono tutte dello stesso giallo, e sei
            // pietre accese di sei colori non ne farebbero risaltare nessuna.
            // 28px e non 20: sul telefono si centrano col pollice (10/10)
            mark === "sigle" ? "min-h-7 px-1.5" : "h-7 opacity-50 hover:opacity-100",
            // nella griglia delle sei pietre restano 16px dentro il bordo: niente margini
            mark !== "sigle" && (mark === "pietre" && fill ? "px-0" : "px-1"),
            fill && "flex-auto",
            RANK_CLASSES[index]?.chip,
          )}
        >
          {mark === "stelle" ? (
            <>
              {Array.from({ length: rank.rank }, (_, star) => (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  key={star}
                  src={gameIconSrc(game, "carta", "stella")}
                  alt=""
                  width={39}
                  height={41}
                  loading="lazy"
                  className="h-auto w-[13px]"
                />
              ))}
              {/* le stelle sono immagini decorative: il nome del radio sta qui */}
              <span className="sr-only">{t.rango(rank.rank)}</span>
            </>
          ) : mark === "pietre" ? (
            <>
              {/*
                Una casella quadrata e `object-contain`: le pietre hanno misure
                diverse (dalla 62x71 della prima alla 96x128 della sesta), e
                cosi' stanno tutte alla stessa altezza senza scrivere qui le
                misure dell'atlas.
              */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={gameIconSrc(game, "carta", `pietra_${rank.rank}`)}
                alt=""
                width={14}
                height={14}
                loading="lazy"
                className="h-3.5 w-3.5 object-contain"
              />
              <span className="sr-only">{t.rango(rank.rank)}</span>
            </>
          ) : (
            `R${rank.rank}`
          )}
        </label>
      ))}
    </div>
  );
}

/** Il testo del rango scelto: uno solo alla volta, e lo decide il radio. */
function RankPanels({ card, locale, termIds }: { card: HeroCard; locale: Locale; termIds?: TermIds }) {
  const ranks = card.ranks;
  if (ranks.length === 0) return null;

  // Un rango solo: non c'e' niente da scegliere, e il testo si vede e basta.
  if (ranks.length === 1) {
    return (
      <div className="mt-2 text-[13px] leading-snug">
        <GameText
          text={textIn(ranks[0]!, locale)}
          omitNotes
          className="[&>p]:m-0"
          terms={termIds?.(ranks[0]!.text, textIn(ranks[0]!, locale))}
        />
      </div>
    );
  }

  return (
    <div className="mt-2 text-[13px] leading-snug">
      {ranks.map((rank, index) => (
        <div key={`panel-${rank.rank}`} className={cx("hidden", RANK_CLASSES[index]?.show)}>
          <GameText
            text={textIn(rank, locale)}
            omitNotes
            className="[&>p]:m-0"
            terms={termIds?.(rank.text, textIn(rank, locale))}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Una carta con i suoi ranghi.
 *
 * Lo sprite compare solo se `card.sprite` dice quale: senza, la colonna
 * dell'immagine sparisce e il testo si prende tutta la riga. Accostare uno
 * sprite qualsiasi riempirebbe meglio lo spazio e direbbe una cosa falsa.
 */
function CardRow({
  game,
  locale,
  heroId,
  card,
  context,
  glossary,
  icons,
  artSrc,
  termIds,
}: {
  game: string;
  locale: Locale;
  heroId: string;
  card: HeroCard;
  context?: HeroCardContext;
  glossary?: Readonly<Record<string, HeroEffect>>;
  icons?: Readonly<Record<string, readonly string[]>>;
  /** l'illustrazione quando non e' uno sprite numerato: l'ultimate ha la sua cartella */
  artSrc?: string;
  termIds?: TermIds;
}) {
  const art =
    artSrc ?? (card.sprite !== undefined ? heroCardArtSrc(game, heroId, card.sprite) : null);

  // Il rango si segna come lo segna il gioco: stelle sulle carte d'attacco, che
  // hanno tre ranghi, e una pietra per rango sull'ultimate, che ne ha sei. Se
  // manca anche una sola pietra si torna alle sigle per tutta la carta: meta'
  // pulsanti a pietre e meta' a sigle non si leggerebbero come la stessa scala.
  const mark: RankMark =
    (card.slot === "A" || card.slot === "B") && hasIcon(icons, "carta", "stella")
      ? "stelle"
      : card.slot === "ultimate" &&
          card.ranks.every((rank) => hasIcon(icons, "carta", `pietra_${rank.rank}`))
        ? "pietre"
        : "sigle";
  // Con un rango solo non c'e' niente da scegliere, quindi nessun pulsante.
  const picker = card.ranks.length > 1;
  const group = `${heroId}-${card.slot ?? "carta"}`;

  // La colonna dell'immagine e' larga 120px, e non 84, per la riga dei tre
  // pulsanti a stelle che le sta sotto: al minimo ne occupa 116 (23 + 36 + 49
  // piu' gli spazi). A 84 le stelle scenderebbero a 9px, e non si leggerebbero.
  const columns = art ? { gridTemplateColumns: "120px minmax(0, 1fr)" } : undefined;

  return (
    // `group` serve a :has(): i pulsanti stanno nella colonna dell'immagine e
    // il testo del rango nell'altra, quindi il legame passa dall'antenato
    // comune. Il riquadro intorno, col titolo «Carta A», e' HeroBox.
    <div className="group grid items-start gap-4" style={columns}>
      {art ? (
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={art}
            alt=""
            width={128}
            height={256}
            loading="lazy"
            className="block w-full bg-paper-2"
          />

          {picker ? (
            <RankButtons game={game} locale={locale} group={group} card={card} mark={mark} fill />
          ) : null}
        </div>
      ) : null}

      <div className="min-w-0">
        {/*
          Il nome in grassetto come quello della passiva e delle abilita'
          speciali. "carta A" non si ripete qui: dal 26/09 e' il titolo del
          riquadro.
        */}
        <p className="m-0 font-semibold">{localized(card.nameI18n, card.name, locale)}</p>

        {/* Senza illustrazione non c'e' una carta sotto cui metterli: stanno sopra il testo. */}
        {art === null && picker ? (
          <RankButtons
            game={game}
            locale={locale}
            group={group}
            card={card}
            mark={mark}
            fill={false}
          />
        ) : null}

        <RankPanels card={card} locale={locale} termIds={termIds} />

        {/*
          Le definizioni dei termini stanno in fondo, una volta per carta. Il
          gioco le ripete in ogni rango identiche: lasciarle li' significava
          stampare tre volte la stessa spiegazione sotto tre righe che
          differiscono per una percentuale.
        */}
        <Effects context={context} glossary={glossary} locale={locale} />

        <GameNotes texts={card.ranks.map((rank) => textIn(rank, locale))} className="mt-2.5" />
      </div>
    </div>
  );
}
