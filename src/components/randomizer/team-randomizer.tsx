"use client";

/**
 * Il Randomizer: un pulsante e quattro posti, ognuno con l'eroe in campo e sotto
 * quello del suo Slot associazione.
 *
 * Componente client perche' il sorteggio e' un clic: passare dal server per
 * pescare otto numeri non avrebbe senso. Le regole stanno in randomizer.ts,
 * provate dai test; qui ci sono solo lo stato e la pagina.
 *
 * Le due modalita' tengono ognuna l'ultima squadra pescata: passare da una
 * all'altra non butta via niente, e una squadra non cambia modalita' sotto gli
 * occhi di chi la guarda. Lo stesso per «Senza collaborazioni»: vale dalla pesca
 * dopo. Si parte coi posti vuoti: una squadra gia' pescata dal server sarebbe
 * diversa da quella del browser, e React se ne lamenterebbe.
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import { GameText } from "@/components/heroes/game-text";
import { buttonClass, cx, eyebrow, Tag } from "@/components/ui";
import type { HeroFatesIndex } from "@/lib/games/hero-fates-types";
import type { TermMember } from "@/lib/games/hero-terms";
import type { HeroTermGroup } from "@/lib/games/hero-terms-types";
import { heroCardSrc } from "@/lib/games/heroes";
import {
  drawRandom,
  drawSynergy,
  fateBetween,
  isCollab,
  TEAM_SIZE,
  uniqueCovers,
  type TeamDraw,
} from "@/lib/games/randomizer";
import { useLocale } from "@/lib/i18n/client";
import { inLingua, testi } from "@/lib/i18n/locale";

/** Un eroe del roster, gia' nella lingua della pagina, con quello che serve a sapere di che gruppo e'. */
export interface RandomizerHero extends TermMember {
  readonly name: string;
  readonly epithet: string;
  /** il colore dell'attributo, per l'epiteto come nella griglia Eroi */
  readonly color: string | null;
  /** il nome della sua Unica, per il riquadro della sinergia */
  readonly unique: string | null;
}

type Mode = "caso" | "sinergia";

const TESTI = testi({
  it: {
    modalita: "Modalità",
    modi: { caso: "Casuale", sinergia: "Sinergia" },
    spiegaModo: {
      caso: "Otto eroi a caso: quattro in campo e i loro quattro associati.",
      sinergia:
        "Le Uniche dei quattro in campo che nominano alleati valgono per tutti gli altri; il quarto può averne una non specifica. Gli associati sono a caso.",
    },
    senzaCollab: (n: number) => `Senza collaborazioni (${n} eroi)`,
    pesca: "Pesca",
    ripesca: "Pesca ancora",
    posto: (n: number) => `Eroe ${n}`,
    associato: "Associato",
    effetto: "Effetto associazione",
    combinato: "Attacco combinato",
    combinatoTitolo: "Con questo associato la Mossa finale diventa un Attacco combinato",
    sinergia: "Sinergia",
    unicaDi: "Unica",
    valePer: "vale per",
    nonSpecifica: "non nomina alleati applicabili",
    sinergiaTutte: "Ogni Unica che nomina alleati vale per tutti gli altri eroi in campo.",
    gradoUR: "Sotto una coppia compare l'Effetto associazione quando l'associato ha un legame col suo eroe; è scritto al grado UR.",
    vuoto: "Premi «Pesca» per riempire i posti.",
    impossibile: "Nessuna squadra possibile con queste scelte.",
    squadra: "La squadra pescata",
  },
  en: {
    modalita: "Mode",
    modi: { caso: "Random", sinergia: "Synergy" },
    spiegaModo: {
      caso: "Eight random heroes: four on the field and their four associates.",
      sinergia:
        "The Uniques of the four on the field that name allies apply to all the others; the fourth may have a non-specific one. Associates are random.",
    },
    senzaCollab: (n: number) => `No collaborations (${n} heroes)`,
    pesca: "Draw",
    ripesca: "Draw again",
    posto: (n: number) => `Hero ${n}`,
    associato: "Associate",
    effetto: "Association Effect",
    combinato: "Combined Attack",
    combinatoTitolo: "With this associate the Ultimate Move becomes a Combined Attack",
    sinergia: "Synergy",
    unicaDi: "Unique",
    valePer: "applies to",
    nonSpecifica: "names no Applicable Allies",
    sinergiaTutte: "Every Unique that names allies applies to all the other heroes on the field.",
    gradoUR: "The Association Effect shows under a pair when the associate has a bond with its hero; it is given at UR grade.",
    vuoto: "Press «Draw» to fill the slots.",
    impossibile: "No team is possible with these choices.",
    squadra: "The drawn team",
  },
});

const MODES: readonly Mode[] = ["caso", "sinergia"];

export function TeamRandomizer({
  game,
  heroes,
  leaders,
  groups,
  fates,
}: {
  game: string;
  heroes: readonly RandomizerHero[];
  /** gli eroi la cui Unica nomina alleati applicabili, col gruppo (unicaLeaders) */
  leaders: readonly { hero: string; group: number }[];
  /** i gruppi delle parole blu per posizione; null quelli che nessuna Unica nomina */
  groups: readonly (HeroTermGroup | null)[];
  fates: HeroFatesIndex;
}) {
  const locale = useLocale();
  const t = TESTI[locale];

  const [mode, setMode] = useState<Mode>("caso");
  const [noCollab, setNoCollab] = useState(false);
  const [draws, setDraws] = useState<Partial<Record<Mode, TeamDraw | "impossibile">>>({});

  const byId = useMemo(() => new Map(heroes.map((hero) => [hero.id, hero])), [heroes]);
  const collabCount = useMemo(() => heroes.filter(isCollab).length, [heroes]);
  const pool = useMemo(() => (noCollab ? heroes.filter((hero) => !isCollab(hero)) : heroes), [heroes, noCollab]);
  // Chi copre ogni Unica si calcola sul roster intero: la pesca guarda solo chi e' in `pool`.
  const covers = useMemo(() => uniqueCovers(heroes, leaders, groups), [heroes, leaders, groups]);

  const current = draws[mode];
  const draw = current === "impossibile" ? undefined : current;
  const hasFate = !!draw?.slots.some((slot) => fateBetween(fates, slot.main, slot.associate));

  function pick() {
    let next: TeamDraw | "impossibile";
    try {
      next = mode === "caso" ? drawRandom(pool, Math.random) : drawSynergy(pool, covers, Math.random);
    } catch {
      next = "impossibile";
    }
    setDraws((before) => ({ ...before, [mode]: next }));
  }

  return (
    <div>
      <div className="flex max-w-[560px] flex-wrap items-center gap-x-5 gap-y-3 rounded-card border border-rule bg-paper-2 p-4 text-[13px]">
        <fieldset className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-0 p-0">
          <legend className="float-left mr-3 p-0 text-ink-2">{t.modalita}</legend>
          <div className="flex items-center gap-1">
            {MODES.map((value) => (
              <label key={value} className="cursor-pointer">
                <input
                  type="radio"
                  name="randomizer-modalita"
                  value={value}
                  checked={mode === value}
                  onChange={() => setMode(value)}
                  className="peer sr-only"
                />
                <span
                  className={cx(
                    "grid h-8 place-items-center rounded-[3px] border px-3 peer-focus-visible:outline-2 peer-focus-visible:outline-brand",
                    mode === value ? "border-brand bg-brand-soft text-ink" : "border-rule text-ink-3 hover:text-ink",
                  )}
                >
                  {t.modi[value]}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <button type="button" onClick={pick} className={buttonClass("primary", "md", "ml-auto")}>
          <DiceIcon />
          {draw ? t.ripesca : t.pesca}
        </button>

        <label className="flex basis-full cursor-pointer items-center gap-2 text-ink-2">
          <input
            type="checkbox"
            checked={noCollab}
            onChange={(event) => setNoCollab(event.target.checked)}
            className="accent-[var(--color-brand)]"
          />
          {t.senzaCollab(collabCount)}
        </label>

        <p className="m-0 basis-full text-[12px] text-ink-3">{t.spiegaModo[mode]}</p>
      </div>

      <h2 className="sr-only">{t.squadra}</h2>
      {/*
        Ogni posto e' una colonna di cinque righe, e le righe sono quelle della
        griglia (subgrid): cosi' «Associato» sta alla stessa altezza in tutte le
        colonne anche quando il nome di un eroe va a capo.
      */}
      <ol
        aria-live="polite"
        className="mt-6 grid list-none grid-cols-2 gap-x-4 p-0 sm:max-w-[760px] sm:grid-cols-4"
      >
        {Array.from({ length: TEAM_SIZE }, (_, i) => {
          const slot = draw?.slots[i];
          const main = slot ? byId.get(slot.main) : undefined;
          const associate = slot ? byId.get(slot.associate) : undefined;
          const fate = slot ? fateBetween(fates, slot.main, slot.associate) : undefined;
          const effect = fate ? fates.effects[fate[1]] : undefined;
          const effectText = effect ? inLingua(effect.text, locale) : null;
          return (
            <li key={i} className="row-span-5 grid min-w-0 grid-rows-subgrid content-start">
              <p className={cx(eyebrow, "m-0 mb-1.5")}>{t.posto(i + 1)}</p>
              <HeroTile game={game} hero={main} size="main" />

              <p className={cx(eyebrow, "m-0 mt-3 mb-1.5 flex items-center gap-1.5")}>
                <LinkIcon />
                {t.associato}
              </p>
              <HeroTile game={game} hero={associate} size="associate" />

              <div className="mt-2 mb-8 text-[12px] leading-snug sm:mb-0">
                {effect && effectText ? (
                  <>
                    <p className="m-0 text-ink-3">{t.effetto}</p>
                    <GameText text={effectText} className="text-ink-2" />
                    {fate?.[2] ? (
                      <span title={t.combinatoTitolo} className="mt-1 inline-block">
                        <Tag tone="gold">{t.combinato}</Tag>
                      </span>
                    ) : null}
                  </>
                ) : null}
              </div>
            </li>
          );
        })}
      </ol>

      {current === "impossibile" ? (
        <p className="mt-4 text-[13px] text-ink-3">{t.impossibile}</p>
      ) : !draw ? (
        <p className="mt-4 text-[13px] text-ink-3">{t.vuoto}</p>
      ) : null}

      {draw?.synergy ? (
        <section className="mt-8 max-w-[68ch] rounded-card border border-rule border-t-[3px] border-t-brand bg-paper p-4 text-sm text-ink-2">
          <h3 className={cx(eyebrow, "m-0")}>{t.sinergia}</h3>
          <ul className="mt-2 mb-0 grid list-none gap-1.5 p-0">
            {draw.slots.map(({ main }) => {
              const rules = (covers.get(main)?.groups ?? [])
                .map((group) => inLingua(groups[group]?.definition, locale))
                .filter(Boolean);
              const hero = byId.get(main);
              return (
                <li key={main}>
                  <strong className="font-semibold text-ink">{hero?.name ?? main}</strong>
                  {" · "}
                  {t.unicaDi}
                  {hero?.unique ? ` «${hero.unique}»` : ""}{" "}
                  {rules.length > 0 ? `${t.valePer}: ${rules.join(" / ")}` : t.nonSpecifica}
                </li>
              );
            })}
          </ul>
          <p className="mt-2 mb-0">{t.sinergiaTutte}</p>
        </section>
      ) : null}

      {hasFate ? <p className="mt-4 text-[12px] text-ink-3">{t.gradoUR}</p> : null}
    </div>
  );
}

/** La card di un eroe, o il posto vuoto tratteggiato prima della prima pesca. */
function HeroTile({ game, hero, size }: { game: string; hero: RandomizerHero | undefined; size: "main" | "associate" }) {
  const width = size === "main" ? "max-w-[128px]" : "max-w-[96px]";
  if (!hero) {
    return (
      <div
        aria-hidden
        className={cx(
          "grid aspect-square w-full place-items-center self-start rounded-[3px] border border-dashed border-rule bg-paper-2 font-display text-2xl text-ink-3/50",
          width,
        )}
      >
        ?
      </div>
    );
  }
  return (
    <Link
      href={`/${game}/eroi/${hero.id}`}
      className={cx(
        "group block w-full self-start rounded-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        width,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- card gia' pronte in due densita', come nella griglia Eroi */}
      <img
        src={heroCardSrc(game, hero.id)}
        srcSet={`${heroCardSrc(game, hero.id)} 1x, ${heroCardSrc(game, hero.id, 2)} 2x`}
        alt=""
        width={128}
        height={128}
        decoding="async"
        className="block w-full rounded-[3px] bg-paper-2 transition-transform group-hover:-translate-y-0.5"
      />
      <span
        className="mt-1.5 block truncate text-[11px] leading-tight text-ink-3"
        title={hero.epithet}
        style={hero.color ? { color: hero.color } : undefined}
      >
        {hero.epithet}
      </span>
      <span className="block text-[12px] font-semibold leading-tight group-hover:text-brand">{hero.name}</span>
    </Link>
  );
}

function LinkIcon() {
  return (
    <svg aria-hidden width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5" />
      <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5" />
    </svg>
  );
}

function DiceIcon() {
  return (
    <svg aria-hidden width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.2" fill="currentColor" />
      <circle cx="15.5" cy="15.5" r="1.2" fill="currentColor" />
      <circle cx="15.5" cy="8.5" r="1.2" fill="currentColor" />
      <circle cx="8.5" cy="15.5" r="1.2" fill="currentColor" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" />
    </svg>
  );
}
