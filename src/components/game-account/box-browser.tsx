"use client";

/**
 * «I tuoi eroi»: il box, eroe per eroe.
 *
 * Richiesta dell'utente (10/10, «finisci la sezione account»; il box era la
 * fase due scelta il 27/09). Scelte di Claude, dette all'utente:
 *   - un tocco su un eroe che non hai lo aggiunge e lo apre; su uno che hai lo
 *     apre e basta. Toglierlo e' un pulsante a parte: con un tocco solo per
 *     segnare e togliere, un tocco sbagliato cancellerebbe i suoi progressi
 *   - l'eroe appena aggiunto e' al livello massimo coi Risvegli (come lo tiene
 *     chi lo usa), il resto da fare (hero-box.ts, `newEntry`)
 *   - i comandi sono quelli del calcolatore della scheda (controls.tsx): gli
 *     stessi numeri, lo stesso aspetto
 *   - accanto alla griglia sul computer, in un foglio dal basso sul telefono
 *
 * Il box si salva nel browser e, per chi e' entrato, nel database con
 * l'account (use-hero-box.ts, AccountSync).
 */

import { useMemo, useState } from "react";
import { Chip } from "@/components/filter-chips";
import { useHeroBox } from "@/components/game-account/use-hero-box";
import { RangeField, StarRow, TrueAwakeningRow, UltimateRow } from "@/components/heroes/calculator/controls";
import { IconClose } from "@/components/icons";
import { Button, buttonClass, cx, display, Empty, eyebrow, heroNameClass, Input, MoreLink, numeric } from "@/components/ui";
import {
  boxSize,
  clampEntry,
  EMPTY_BOX,
  maxEntry,
  newEntry,
  ownsHero,
  withHero,
  type BoxEntry,
  type BoxLimits,
} from "@/lib/games/hero-box";
import { filterHeroes, gameIconSrc, heroCardSrc, heroEpithet, heroName, type IconFamily } from "@/lib/games/heroes";
import type { HeroEntry, HeroRoster } from "@/lib/games/types";
import { useLocale } from "@/lib/i18n/client";
import { testi, type Locale } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    cerca: "Cerca un eroe…",
    cercaEtichetta: "Cerca nel box",
    tutti: "Tutti",
    posseduti: "Che ho",
    mancanti: "Che mi mancano",
    mostra: "Mostra",
    rarita: "Rarità",
    attributo: "Attributo",
    hai: (n: number, totale: number) => `Hai ${n} ${n === 1 ? "eroe" : "eroi"} su ${totale}`,
    vuoto: "Il box è vuoto: tocca gli eroi che hai nel gioco per aggiungerli.",
    nessuno: "Nessun eroe con questi filtri.",
    segnaMostrati: (n: number) => `Aggiungi i ${n} mostrati`,
    togliMostrati: (n: number) => `Togli i ${n} mostrati`,
    togliTutti: (n: number) => `Rimuovi tutti (${n})`,
    confermaTogli: (n: number) => `Togliere ${n} eroi dal box? I loro progressi si perdono.`,
    confermaTogliTutti: (n: number) => `Togliere tutti i ${n} eroi dal box? I loro progressi si perdono.`,
    nelBox: "Nel tuo box",
    nonNelBox: "Non nel box",
    aggiungi: "Aggiungi al box",
    togli: "Togli dal box",
    alMassimo: "Tutto al massimo",
    apriScheda: "Apri la scheda",
    chiudi: "Chiudi",
    livello: "Livello",
    risveglio: "Risveglio",
    superRisveglio: "Super risveglio",
    risvegli: (n: number) => (n === 0 ? "nessun Risveglio" : n === 1 ? "1 Risveglio" : `${n} Risvegli`),
    superRisvegli: (n: number) =>
      n === 0 ? "nessun Super risveglio" : n === 1 ? "1 Super risveglio" : `${n} Super risvegli`,
    dopoIlSesto: "si sblocca col sesto Risveglio",
    ultimate: "Ultimate",
    rangoUltimate: (n: number) => `Ultimate al rango ${n}`,
    veroRisveglio: "Vero risveglio",
    vero: ["Re Demone", "Divinità Suprema"] as readonly [string, string],
    veroTitolo: [
      "Vero risveglio coi materiali del Re Demone",
      "Vero risveglio coi materiali della Divinità Suprema",
    ] as readonly [string, string],
    reliquia: "Reliquia sacra fabbricata",
    scegli: "Tocca un eroe per vederlo qui.",
    salvato: "Si salva in questo browser, e nel tuo account se sei entrato.",
  },
  en: {
    cerca: "Search a hero…",
    cercaEtichetta: "Search the box",
    tutti: "All",
    posseduti: "Owned",
    mancanti: "Missing",
    mostra: "Show",
    rarita: "Rarity",
    attributo: "Attribute",
    hai: (n: number, total: number) => `You have ${n} ${n === 1 ? "hero" : "heroes"} of ${total}`,
    vuoto: "Your box is empty: tap the heroes you have in the game to add them.",
    nessuno: "No heroes match these filters.",
    segnaMostrati: (n: number) => `Add the ${n} shown`,
    togliMostrati: (n: number) => `Remove the ${n} shown`,
    togliTutti: (n: number) => `Remove all (${n})`,
    confermaTogli: (n: number) => `Remove ${n} heroes from your box? Their progress will be lost.`,
    confermaTogliTutti: (n: number) => `Remove all ${n} heroes from your box? Their progress will be lost.`,
    nelBox: "In your box",
    nonNelBox: "Not in your box",
    aggiungi: "Add to box",
    togli: "Remove from box",
    alMassimo: "Everything maxed",
    apriScheda: "Open the page",
    chiudi: "Close",
    livello: "Level",
    risveglio: "Awakening",
    superRisveglio: "Super Awakening",
    risvegli: (n: number) => (n === 0 ? "no Awakening" : n === 1 ? "1 Awakening" : `${n} Awakenings`),
    superRisvegli: (n: number) =>
      n === 0 ? "no Super Awakening" : n === 1 ? "1 Super Awakening" : `${n} Super Awakenings`,
    dopoIlSesto: "unlocks with the sixth Awakening",
    ultimate: "Ultimate",
    rangoUltimate: (n: number) => `Ultimate Move at rank ${n}`,
    veroRisveglio: "True Awakening",
    vero: ["Demon King", "Supreme Deity"] as readonly [string, string],
    veroTitolo: [
      "True Awakening with the Demon King materials",
      "True Awakening with the Supreme Deity materials",
    ] as readonly [string, string],
    reliquia: "Holy Relic crafted",
    scegli: "Tap a hero to see it here.",
    salvato: "Saved in this browser, and in your account if you're logged in.",
  },
});

type Show = "all" | "owned" | "missing";

export interface BoxArt {
  readonly star?: string;
  readonly superStar?: string;
  readonly gems?: readonly string[];
  readonly exceed?: readonly [string, string];
}

export function BoxBrowser({
  game,
  roster,
  icons,
  limits,
  art,
}: {
  game: string;
  roster: HeroRoster;
  icons?: Readonly<Record<string, readonly string[]>>;
  /** fin dove arriva ogni eroe (hero-box.ts, `boxLimitsFrom`) */
  limits: Readonly<Record<string, BoxLimits>>;
  art: BoxArt;
}) {
  const locale = useLocale();
  const t = TESTI[locale];
  const [box, saveBox] = useHeroBox(game);
  const [search, setSearch] = useState("");
  const [show, setShow] = useState<Show>("all");
  const [rarity, setRarity] = useState<string | null>(null);
  const [affinity, setAffinity] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const heroes = roster.heroes.filter((hero) => limits[hero.id]);
  const owned = boxSize(box);
  const visible = useMemo(() => {
    const base = filterHeroes(heroes, { search, rarity, affinity });
    if (show === "owned") return base.filter((hero) => ownsHero(box, hero.id));
    if (show === "missing") return base.filter((hero) => !ownsHero(box, hero.id));
    return base;
  }, [heroes, search, rarity, affinity, show, box]);

  const selected = heroes.find((hero) => hero.id === selectedId) ?? null;
  const iconFor = (family: IconFamily, key: string | undefined) =>
    key && icons?.[family]?.includes(key) ? gameIconSrc(game, family, key) : undefined;

  const set = (heroId: string, entry: BoxEntry | null) => saveBox(withHero(box, heroId, entry));

  const tap = (hero: HeroEntry) => {
    if (!ownsHero(box, hero.id)) set(hero.id, newEntry(limits[hero.id]!));
    setSelectedId(hero.id);
    setSheetOpen(true);
  };

  const addShown = () => {
    let next = box;
    for (const hero of visible) if (!ownsHero(next, hero.id)) next = withHero(next, hero.id, newEntry(limits[hero.id]!));
    saveBox(next);
  };
  const removeShown = () => {
    const shown = visible.filter((hero) => ownsHero(box, hero.id));
    if (shown.length === 0 || !window.confirm(t.confermaTogli(shown.length))) return;
    let next = box;
    for (const hero of shown) next = withHero(next, hero.id, null);
    saveBox(next);
  };
  const removeAll = () => {
    if (owned === 0 || !window.confirm(t.confermaTogliTutti(owned))) return;
    saveBox(EMPTY_BOX);
  };
  const hasFilters = Boolean(search || rarity || affinity || show !== "all");
  const shownMissing = visible.filter((hero) => !ownsHero(box, hero.id)).length;
  const shownOwned = visible.length - shownMissing;

  const editor = (where: "side" | "sheet") =>
    selected ? (
      <Editor
        key={`${where}-${selected.id}`}
        name={`box-${where}`}
        game={game}
        hero={selected}
        entry={box.heroes[selected.id] ?? null}
        limits={limits[selected.id]!}
        art={art}
        locale={locale}
        onChange={(entry) => set(selected.id, entry)}
      />
    ) : (
      <p className="m-0 text-sm text-ink-3">{t.scegli}</p>
    );

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(320px,380px)]">
      <div className="min-w-0">
        <div className="mb-4 grid gap-3">
          <div className="flex flex-wrap items-center gap-2.5">
            <Input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t.cerca}
              aria-label={t.cercaEtichetta}
              className="p5-cut h-10 min-w-[200px] max-w-[320px] flex-1 border-ink! bg-ink! px-4 text-sm font-semibold text-paper! placeholder:text-paper/60"
            />
            <div role="group" aria-label={t.mostra} className="flex items-center gap-1">
              {(["all", "owned", "missing"] as const).map((value) => (
                <Chip
                  key={value}
                  quiet
                  active={show === value}
                  onClick={() => setShow(value)}
                  label={value === "all" ? t.tutti : value === "owned" ? t.posseduti : t.mancanti}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <div role="group" aria-label={t.rarita} className="flex flex-wrap items-center gap-1.5">
              <span className={cx(eyebrow, "mr-0.5")}>{t.rarita}</span>
              {roster.obtainable.map((value) => (
                <Chip
                  key={value}
                  active={rarity === value}
                  onClick={() => setRarity(rarity === value ? null : value)}
                  label={value}
                  iconSrc={iconFor("rarita", value)}
                />
              ))}
            </div>
            <div role="group" aria-label={t.attributo} className="flex flex-wrap items-center gap-1.5">
              <span className={cx(eyebrow, "mr-0.5")}>{t.attributo}</span>
              {roster.affinities.map((item) => (
                <Chip
                  key={item.id}
                  active={affinity === item.id}
                  onClick={() => setAffinity(affinity === item.id ? null : item.id)}
                  label={item.label}
                  iconSrc={iconFor("attributo", item.iconKey)}
                  swatch={item}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
          <p className="m-0 text-[14px] text-ink-2" aria-live="polite">
            <strong className={cx(numeric, "p5-cut-sm mr-1.5 inline-block bg-brand px-2 font-bold text-white")}>{owned}</strong>
            {t.hai(owned, heroes.length)}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {shownMissing > 0 ? (
              <Button size="sm" onClick={addShown}>
                {t.segnaMostrati(shownMissing)}
              </Button>
            ) : null}
            {hasFilters && shownOwned > 0 ? (
              <Button size="sm" variant="ghost" onClick={removeShown} className="text-red-400 hover:text-red-300 hover:bg-red-500/10">
                {t.togliMostrati(shownOwned)}
              </Button>
            ) : null}
            {owned > 0 ? (
              <Button
                size="sm"
                variant="ghost"
                onClick={removeAll}
                className={cx(
                  "text-red-400 hover:text-red-300 hover:bg-red-500/10",
                  hasFilters && shownOwned > 0 && "opacity-80 hover:opacity-100",
                )}
              >
                {t.togliTutti(owned)}
              </Button>
            ) : null}
          </div>
        </div>

        {owned === 0 && show === "all" && !search ? (
          <p className="m-0 mb-4 text-sm text-ink-2">{t.vuoto}</p>
        ) : null}

        {visible.length === 0 ? (
          <Empty>{t.nessuno}</Empty>
        ) : (
          <ul className="m-0 grid list-none gap-x-2.5 gap-y-3.5 p-0" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(88px, 1fr))" }}>
            {visible.map((hero) => {
              const mine = ownsHero(box, hero.id);
              const entry = box.heroes[hero.id];
              return (
                <li key={hero.id} className="min-w-0">
                  <button
                    type="button"
                    onClick={() => tap(hero)}
                    aria-pressed={mine}
                    data-active={hero.id === selectedId || undefined}
                    data-missing={!mine || undefined}
                    className="hero-card box-card block w-full cursor-pointer border-0 bg-transparent p-0 text-left text-ink"
                    title={`${heroName(hero, locale)} · ${heroEpithet(hero, locale)} — ${mine ? t.nelBox : t.nonNelBox}`}
                  >
                    <span className="hero-card-art relative block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={heroCardSrc(game, hero.id)}
                        alt=""
                        width={128}
                        height={128}
                        loading="lazy"
                        decoding="async"
                        className="block aspect-square w-full bg-paper-2"
                      />
                      {entry ? (
                        <span className={cx(numeric, "box-card-level")} aria-hidden>
                          {entry.level}
                        </span>
                      ) : null}
                    </span>
                    <span className={cx(heroNameClass, "mt-1.5")}>
                      {heroName(hero, locale)}
                    </span>
                    <span className="sr-only">{mine ? t.nelBox : t.nonNelBox}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* sul computer: accanto, fermo */}
      <aside className="sticky top-[76px] hidden max-h-[calc(100dvh-96px)] overflow-y-auto lg:block">
        <div className="p5-corner border border-rule bg-paper-2 p-4">{editor("side")}</div>
        <p className="mt-2 text-[12px] text-ink-3">{t.salvato}</p>
      </aside>

      {/* sul telefono: un foglio dal basso, quando si sceglie un eroe */}
      {selected && sheetOpen ? (
        <div className="fixed inset-x-0 bottom-0 z-40 max-h-[72vh] overflow-y-auto border-t-2 border-brand bg-paper-2 px-4 pt-3 pb-[calc(16px+env(safe-area-inset-bottom))] shadow-[0_-12px_32px_-8px_rgba(0,0,0,0.7)] lg:hidden">
          <div className="mb-2 flex justify-end">
            <button
              type="button"
              onClick={() => setSheetOpen(false)}
              aria-label={t.chiudi}
              className="grid h-10 w-10 cursor-pointer place-items-center border-0 bg-transparent text-ink-2 hover:text-ink"
            >
              <IconClose />
            </button>
          </div>
          {editor("sheet")}
        </div>
      ) : null}
    </div>
  );
}

function Editor({
  name,
  game,
  hero,
  entry,
  limits,
  art,
  locale,
  onChange,
}: {
  name: string;
  game: string;
  hero: HeroEntry;
  entry: BoxEntry | null;
  limits: BoxLimits;
  art: BoxArt;
  locale: Locale;
  onChange: (entry: BoxEntry | null) => void;
}) {
  const t = TESTI[locale];
  const change = (patch: Partial<BoxEntry>) => entry && onChange(clampEntry({ ...entry, ...patch }, limits));

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-[64px_minmax(0,1fr)] items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroCardSrc(game, hero.id)} alt="" width={64} height={64} className="h-16 w-16 bg-paper" />
        <div className="min-w-0">
          <p className="m-0 truncate text-[12px] text-ink-3">{heroEpithet(hero, locale)}</p>
          <p className={cx(display, "m-0 text-[22px] leading-none")}>{heroName(hero, locale)}</p>
          <MoreLink href={`/${game}/eroi/${hero.id}`} className="mt-1">
            {t.apriScheda}
          </MoreLink>
        </div>
      </div>

      {entry ? (
        <>
          <RangeField
            id={`${name}-livello`}
            label={t.livello}
            min={1}
            max={limits.maxLevel}
            value={entry.level}
            onChange={(level) => change({ level })}
          />
          <StarRow
            legend={t.risveglio}
            name={`${name}-risveglio`}
            count={limits.awaken}
            value={entry.awaken}
            onChange={(awaken) => change({ awaken })}
            starSrc={art.star}
            title={t.risvegli}
          />
          <StarRow
            legend={t.superRisveglio}
            name={`${name}-super`}
            count={limits.superAwaken}
            value={entry.superAwaken}
            onChange={(superAwaken) => change({ superAwaken })}
            starSrc={art.superStar ?? art.star}
            title={t.superRisvegli}
            disabled={entry.awaken < limits.awaken}
            note={entry.awaken < limits.awaken ? t.dopoIlSesto : undefined}
          />
          <UltimateRow
            legend={t.ultimate}
            name={`${name}-ultimate`}
            value={entry.ultimateRank}
            onChange={(ultimateRank) => change({ ultimateRank })}
            gemSrcs={art.gems}
            title={t.rangoUltimate}
          />
          <TrueAwakeningRow
            legend={t.veroRisveglio}
            value={entry.trueAwakening}
            onChange={(trueAwakening) => change({ trueAwakening })}
            srcs={art.exceed}
            labels={t.vero}
            titles={t.veroTitolo}
          />
          {limits.relic ? (
            <label className="flex cursor-pointer items-center gap-2 text-ink-2">
              <input
                type="checkbox"
                checked={entry.relic}
                onChange={(event) => change({ relic: event.target.checked })}
                className="h-4 w-4 accent-[var(--color-brand)]"
              />
              {t.reliquia}
            </label>
          ) : null}
          <div className="flex flex-wrap gap-2 border-t border-rule pt-3">
            <Button size="sm" onClick={() => onChange(maxEntry(limits))}>
              {t.alMassimo}
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onChange(null)}>
              {t.togli}
            </Button>
          </div>
        </>
      ) : (
        <button type="button" onClick={() => onChange(newEntry(limits))} className={buttonClass("primary", "md", "justify-self-start")}>
          {t.aggiungi}
        </button>
      )}
    </div>
  );
}
