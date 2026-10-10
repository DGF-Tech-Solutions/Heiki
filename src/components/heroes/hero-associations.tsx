/**
 * La scheda «Associazioni» della pagina di un eroe: gli Eroi associati che gli
 * danno un effetto (i suoi legami), gli eroi a cui fa da associato lui, e
 * l'effetto comune che vale con chiunque.
 *
 * Nuova il 27/09. Tutto va all'eroe dello slot (il principale), e solo in
 * battaglia: la scheda del gioco non lo conta, per questo nel calcolatore sta
 * nella colonna «In battaglia». L'effetto del legame dipende dal grado
 * dell'associato, e qui si scrive per tutti i gradi. Disegnata dal server.
 */

import Link from "next/link";
import { GameText } from "@/components/heroes/game-text";
import { formatStat, statName } from "@/components/heroes/calculator/stat-rows";
import { boxTitle } from "@/components/heroes/hero-parts";
import { cx, MoreLink, numeric } from "@/components/ui";
import { associatedTo } from "@/lib/games/gear";
import type { HeroFate, HeroFateEffect, HeroFatesIndex } from "@/lib/games/hero-fates-types";
import { heroCardSrc, heroEpithet, heroName } from "@/lib/games/heroes";
import type { HeroEntry } from "@/lib/games/types";
import { inLingua, testi, type Locale } from "@/lib/i18n/locale";

const GRADES = ["R", "SR", "SSR", "UR"] as const;

const TESTI = testi({
  it: {
    suoi: (n: number) => `I suoi Eroi associati · ${n}`,
    suoiNota: (eroe: string) =>
      `Messi nello Slot associazione di ${eroe}, gli danno in più l'effetto del legame: il valore dipende dal grado dell'associato.`,
    nessunoSuo: "Nessun legame: con qualunque associato vale solo l'effetto comune.",
    diAltri: (n: number) => `È Eroe associato di · ${n}`,
    diAltriNota: (eroe: string) =>
      `Messo nello Slot associazione di questi eroi, ${eroe} dà a loro l'effetto del legame, col suo grado.`,
    nessunoAltri: "Non è Eroe associato di nessuno.",
    comune: "Con qualunque eroe",
    comuneTesto: (base: number, per: number) =>
      `Ogni eroe nello Slot associazione dà al principale il ${base}% del suo Attacco, della sua Difesa e dei suoi PS, e un ${per}% in più per ogni livello della sua Mossa finale dopo il primo: dal ${base}% al ${base + 5 * per}%. Vale in battaglia, e si somma prima delle percentuali del principale.`,
    combinato: "Attacco combinato",
    combinatoNota: "con questo associato la Mossa finale diventa un attacco a due, e la classe della squadra sale di 1.000",
    lr: (nome: string) => `a LR: ${nome}`,
    calcolatore: "Prova un associato nel calcolatore",
    gradi: (from: string, to: string) => (from === to ? from : `${from} → ${to}`),
  },
  en: {
    suoi: (n: number) => `Its Associated Heroes · ${n}`,
    suoiNota: (eroe: string) =>
      `Placed in ${eroe}'s Association Slot, they also give the bond effect: the value depends on the associate's grade.`,
    nessunoSuo: "No bonds: with any associate only the common effect applies.",
    diAltri: (n: number) => `Associated Hero of · ${n}`,
    diAltriNota: (eroe: string) =>
      `Placed in these heroes' Association Slot, ${eroe} gives them the bond effect, with its grade.`,
    nessunoAltri: "It isn't an Associated Hero of anyone.",
    comune: "With any hero",
    comuneTesto: (base: number, per: number) =>
      `Any hero in the Association Slot gives the main hero ${base}% of its Attack, Defense and HP, and ${per}% more for each level of its Ultimate Move after the first: from ${base}% to ${base + 5 * per}%. It works in battle, and it's added before the main hero's percentages.`,
    combinato: "Combined Attack",
    combinatoNota: "with this associate the Ultimate Move becomes a two-hero attack, and the team's Combat Class rises by 1,000",
    lr: (nome: string) => `at LR: ${nome}`,
    calcolatore: "Try an associate in the calculator",
    gradi: (from: string, to: string) => (from === to ? from : `${from} → ${to}`),
  },
});

function EffectHead({ effect, locale }: { effect: HeroFateEffect; locale: Locale }) {
  const unit = effect.mode === "points" ? "%" : "";
  return (
    <p className="m-0 text-[13px]">
      <span className="font-semibold text-ink">{statName(effect.stat, locale)}</span>{" "}
      <span className={cx(numeric, "text-ink-2")}>
        {effect.grades
          .map((value, i) => `${GRADES[i]} +${formatStat(value, locale)}${unit}`)
          .join(" · ")}
      </span>
    </p>
  );
}

function HeroList({
  game,
  locale,
  entries,
  fates,
  heroes,
}: {
  game: string;
  locale: Locale;
  entries: readonly { id: string; fate: HeroFate }[];
  fates: HeroFatesIndex;
  heroes: ReadonlyMap<string, HeroEntry>;
}) {
  const t = TESTI[locale];
  // raggruppati per effetto: dodici in tutto il gioco
  const groups = new Map<number, { id: string; fate: HeroFate }[]>();
  for (const item of entries) groups.set(item.fate[1], [...(groups.get(item.fate[1]) ?? []), item]);
  return (
    <div className="grid gap-4">
      {[...groups].map(([effectIndex, items]) => {
        const effect = fates.effects[effectIndex];
        if (!effect) return null;
        return (
          <div key={effectIndex} className="grid gap-2">
            <EffectHead effect={effect} locale={locale} />
            <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-2 p-0">
              {items.map(({ id, fate }) => {
                const hero = heroes.get(id);
                if (!hero) return null;
                const lr = fate[3] !== undefined ? fates.effects[fate[3]] : undefined;
                return (
                  <li key={id} className="min-w-0">
                    <Link
                      href={`/${game}/eroi/${id}?scheda=associazioni`}
                      className="group grid grid-cols-[48px_minmax(0,1fr)] items-center gap-2 p-1 hover:bg-paper-2"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={heroCardSrc(game, id)}
                        alt=""
                        width={48}
                        height={48}
                        loading="lazy"
                        className="h-12 w-12 bg-paper-2"
                      />
                      <span className="min-w-0 text-[12px] leading-tight">
                        <span className="block font-semibold text-ink group-hover:text-brand-deep">{heroName(hero, locale)}</span>
                        <span className="block truncate text-[12px] text-ink-3" title={heroEpithet(hero, locale) ?? undefined}>
                          {heroEpithet(hero, locale)}
                        </span>
                        <span className={cx(numeric, "block text-ink-3")}>{t.gradi(hero.obtainedAs, hero.rarity)}</span>
                        {fate[2] ? (
                          <span className="block text-gold" title={t.combinatoNota}>
                            {t.combinato}
                          </span>
                        ) : null}
                        {lr ? <span className="block text-ink-3">{t.lr(statName(lr.stat, locale))}</span> : null}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}

export function HeroAssociations({
  game,
  locale,
  hero,
  name,
  fates,
  roster,
}: {
  game: string;
  locale: Locale;
  hero: HeroEntry;
  name: string;
  fates: HeroFatesIndex;
  roster: readonly HeroEntry[];
}) {
  const t = TESTI[locale];
  const heroes = new Map(roster.map((entry) => [entry.id, entry]));
  const own = (fates.heroes[hero.id] ?? []).map((fate) => ({ id: fate[0], fate }));
  const of = associatedTo(fates, hero.id).map(({ main, fate }) => ({ id: main, fate }));

  // I tre titoli come quelli dei riquadri delle altre schede (10/10: erano
  // etichette grigie sopra i blocchi)
  return (
    <div className="grid gap-8">
      <section>
        <h3 className={cx(boxTitle, "mb-2")}>{t.suoi(own.length)}</h3>
        <p className="m-0 mb-3 max-w-[48ch] text-[13px] text-ink-2">{own.length ? t.suoiNota(name) : t.nessunoSuo}</p>
        {own.length ? <HeroList game={game} locale={locale} entries={own} fates={fates} heroes={heroes} /> : null}
      </section>

      <section>
        <h3 className={cx(boxTitle, "mb-2")}>{t.diAltri(of.length)}</h3>
        <p className="m-0 mb-3 max-w-[48ch] text-[13px] text-ink-2">{of.length ? t.diAltriNota(name) : t.nessunoAltri}</p>
        {of.length ? <HeroList game={game} locale={locale} entries={of} fates={fates} heroes={heroes} /> : null}
      </section>

      <section>
        <h3 className={cx(boxTitle, "mb-2")}>{t.comune}</h3>
        <p className="m-0 font-semibold text-ink">{inLingua(fates.common.name, locale)}</p>
        <p className="m-0 mt-1 max-w-[48ch] text-[13px] text-ink-2">{t.comuneTesto(fates.common.base, fates.common.perLevel)}</p>
        <GameText text={inLingua(fates.common.basicStats, locale) ?? ""} className="mt-1 text-[12px] text-ink-3" />
        <MoreLink href="?scheda=statistiche" className="mt-2.5">
          {t.calcolatore}
        </MoreLink>
      </section>
    </div>
  );
}
