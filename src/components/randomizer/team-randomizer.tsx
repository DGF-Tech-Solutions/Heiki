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
 *
 * I posti sono quelli della Squadra (party-slot.tsx), come una schermata di
 * scelta del personaggio (10/10); a ogni pesca gli eroi nuovi entrano col taglio
 * del palco, che dice cosa e' cambiato (con «riduci movimento» compaiono).
 */

import Link from "next/link";
import { useMemo, useState } from "react";
import { Chip } from "@/components/filter-chips";
import { useHeroBox } from "@/components/game-account/use-hero-box";
import { GameText } from "@/components/heroes/game-text";
import { IconDice } from "@/components/icons";
import { AssociateStrip, PartyPanel } from "@/components/party-slot";
import { buttonClass, cx, eyebrow, RadioChips, Tag } from "@/components/ui";
import { boxSize, ownsHero } from "@/lib/games/hero-box";
import type { HeroFatesIndex } from "@/lib/games/hero-fates-types";
import type { TermMember } from "@/lib/games/hero-terms";
import type { HeroTermGroup } from "@/lib/games/hero-terms-types";
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
    soloMiei: (n: number) => `Solo i miei (${n} eroi)`,
    soloMieiTitolo: "Pesca solo fra gli eroi che hai segnato in «I tuoi eroi»",
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
    soloMiei: (n: number) => `Only mine (${n} heroes)`,
    soloMieiTitolo: "Draw only from the heroes you marked in «Your heroes»",
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
  // «Solo i miei» pesca dal tuo box (use-hero-box.ts); il comando c'e' solo se ne hai uno
  const [box] = useHeroBox(game);
  const [onlyMine, setOnlyMine] = useState(false);
  const owned = boxSize(box);
  const mine = onlyMine && owned > 0;
  const pool = useMemo(
    () => heroes.filter((hero) => !(noCollab && isCollab(hero)) && !(mine && !ownsHero(box, hero.id))),
    [heroes, noCollab, mine, box],
  );
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
      {/* i comandi in una fila, e «Pesca» e' il comando: grande, a destra, rosso */}
      <div className="flex max-w-[1100px] flex-wrap items-center gap-x-5 gap-y-3 text-[13px]">
        <RadioChips
          legend={t.modalita}
          name="randomizer-modalita"
          value={mode}
          onChange={setMode}
          options={MODES.map((value) => ({ value, label: t.modi[value] }))}
        />
        <Chip active={noCollab} onClick={() => setNoCollab(!noCollab)} label={t.senzaCollab(collabCount)} />
        {owned > 0 ? (
          <span title={t.soloMieiTitolo}>
            <Chip active={onlyMine} onClick={() => setOnlyMine(!onlyMine)} label={t.soloMiei(owned)} />
          </span>
        ) : null}
        <button type="button" onClick={pick} className={buttonClass("primary", "md", "h-11 px-7 text-base sm:ml-auto")}>
          <IconDice size={20} />
          {draw ? t.ripesca : t.pesca}
        </button>
        <p className="m-0 basis-full text-[13px] text-ink-2">{t.spiegaModo[mode]}</p>
      </div>

      <h2 className="sr-only">{t.squadra}</h2>
      {/*
        Ogni posto e' una colonna di tre righe, e le righe sono quelle della
        griglia (subgrid): l'associato sta alla stessa altezza in tutte le
        colonne anche quando il nome di un eroe va a capo.
      */}
      <ol aria-live="polite" className="m-0 mt-5 grid max-w-[1100px] list-none grid-cols-2 gap-x-3 gap-y-6 p-0 sm:grid-cols-4 sm:gap-x-4">
        {Array.from({ length: TEAM_SIZE }, (_, i) => {
          const slot = draw?.slots[i];
          const main = slot ? byId.get(slot.main) : undefined;
          const associate = slot ? byId.get(slot.associate) : undefined;
          const fate = slot ? fateBetween(fates, slot.main, slot.associate) : undefined;
          const effect = fate ? fates.effects[fate[1]] : undefined;
          const effectText = effect ? inLingua(effect.text, locale) : null;
          return (
            <li key={i} className="row-span-3 grid min-w-0 grid-rows-subgrid content-start gap-y-2">
              <HeroLink game={game} hero={main}>
                <PartyPanel game={game} number={i + 1} label={t.posto(i + 1)} hero={main} enter />
              </HeroLink>
              <HeroLink game={game} hero={associate}>
                <AssociateStrip game={game} label={t.associato} hero={associate} choosable={false} enter />
              </HeroLink>

              <div className="text-[12px] leading-snug">
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
        <p className="mt-4 text-[13px] text-ink-2">{t.impossibile}</p>
      ) : !draw ? (
        <p className="mt-4 text-[13px] text-ink-2">{t.vuoto}</p>
      ) : null}

      {draw?.synergy ? (
        <section className="p5-corner mt-8 max-w-[48ch] border border-rule border-t-[3px] border-t-brand bg-paper-2 p-4 text-sm text-ink-2">
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

/** Il posto pieno porta alla scheda dell'eroe; quello vuoto, prima della pesca, e' solo la cornice. */
function HeroLink({ game, hero, children }: { game: string; hero: RandomizerHero | undefined; children: React.ReactNode }) {
  if (!hero) return <div aria-hidden>{children}</div>;
  return (
    <Link
      href={`/${game}/eroi/${hero.id}`}
      aria-label={`${hero.epithet} ${hero.name}`}
      className="group block min-w-0 text-ink no-underline focus-visible:outline-2 focus-visible:outline-offset-2"
    >
      {children}
    </Link>
  );
}

