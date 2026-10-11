"use client";

/**
 * Il passo della squadra: quattro posti con il loro associato, e sotto la scelta
 * dell'eroe quando si clicca un posto.
 *
 * L'aspetto e' quello di Squadra e Randomizer (party-slot.tsx): chi passa da una
 * pagina all'altra ritrova gli stessi posti. Qui pero' la scelta sa dove si
 * gioca: gli eroi esclusi dalla battaglia, quelli con un attributo non ammesso e
 * i personaggi gia' in squadra si vedono spenti, col motivo scritto, invece di
 * sparire dall'elenco. Chi cerca un eroe e non lo trova deve sapere perche'.
 *
 * Se la difficolta' cambia sotto una squadra gia' fatta, l'eroe che non puo'
 * piu' entrare resta nel suo posto, segnato: toglierlo in silenzio farebbe
 * perdere una scelta senza dire perche'.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Chip } from "@/components/filter-chips";
import { IconChevronRight, IconClose } from "@/components/icons";
import { AssociateStrip, ChooseMark, PartyPanel } from "@/components/party-slot";
import { buttonClass, cx, eyebrow, heroNameClass, Input } from "@/components/ui";
import { boxSize, ownsHero, type HeroBox } from "@/lib/games/hero-box";
import { heroCardSrc } from "@/lib/games/heroes";
import { searchText } from "@/lib/games/hero-terms";
import { TEAM_SIZE, type TemplateHero, type TemplateLevel } from "@/lib/strategies/types";
import {
  heroReason,
  usedGroups,
  type EditorAttribute,
  type EditorState,
  type HeroReason,
  type PickKind,
  type SlotIssue,
} from "./editor-state";
import type { Texts } from "./editor-texts";

export interface Picking {
  readonly kind: PickKind;
  readonly slot: number;
}

/** I filtri della scelta: restano fra un posto e l'altro, la ricerca no. */
export interface PickerFilters {
  readonly attribute: number | null;
  readonly onlyMine: boolean;
}

/** Quanti eroi alla volta: 380 card insieme sono un muro, e la ricerca arriva prima. */
const PAGE = 60;

export function slotElementId(kind: PickKind, slot: number): string {
  return kind === "hero" ? `strategia-posto-${slot}` : `strategia-associato-${slot}`;
}

export function TeamSlots({
  t,
  game,
  state,
  heroes,
  issues,
  picking,
  placed,
  marks,
  onPick,
  onRemove,
}: {
  t: Texts;
  game: string;
  state: EditorState;
  heroes: ReadonlyMap<string, TemplateHero>;
  issues: readonly SlotIssue[];
  picking: Picking | null;
  /** l'ultimo eroe messo: solo lui entra col taglio del palco */
  placed: (Picking & { readonly hero: string }) | null;
  /** il messaggio da mostrare sotto un posto (un problema dopo l'invio, o dal server) */
  marks: ReadonlyMap<number, string>;
  onPick: (picking: Picking) => void;
  onRemove: (picking: Picking) => void;
}) {
  // il primo posto ancora vuoto: e' quello che il posto invita a scegliere
  const next = picking ? -1 : state.team.findIndex((slot) => !slot.hero);
  const isPlaced = (kind: PickKind, slot: number, hero: string | undefined) =>
    !!hero && placed?.kind === kind && placed.slot === slot && placed.hero === hero;

  return (
    // ogni posto e' una colonna di tre righe della griglia (subgrid): l'associato
    // sta alla stessa altezza in tutte le colonne anche quando un nome va a capo
    <ol className="m-0 grid max-w-[1100px] list-none grid-cols-2 gap-x-3 gap-y-6 p-0 sm:grid-cols-4 sm:gap-x-4">
      {Array.from({ length: TEAM_SIZE }, (_, slot) => {
        const entry = state.team[slot];
        const main = entry?.hero ? heroes.get(entry.hero) : undefined;
        const associate = entry?.associate ? heroes.get(entry.associate) : undefined;
        const issue = issues[slot];
        const mainActive = picking?.kind === "hero" && picking.slot === slot;
        const associateActive = picking?.kind === "associate" && picking.slot === slot;
        const heroProblem = issue?.hero ? t.problemaPosto[issue.hero] : null;
        const message = heroProblem ?? (issue?.associate ? t.problemaAssociato : null) ?? marks.get(slot) ?? null;
        const messageId = `strategia-posto-${slot}-problema`;
        return (
          <li key={slot} className="row-span-3 grid min-w-0 grid-rows-subgrid content-start gap-y-2">
            <Slot
              t={t}
              id={slotElementId("hero", slot)}
              hero={main}
              active={mainActive}
              flagged={!!issue?.hero || marks.has(slot)}
              describedBy={message ? messageId : undefined}
              onPick={() => onPick({ kind: "hero", slot })}
              onRemove={() => onRemove({ kind: "hero", slot })}
              label={t.scegliPosto(slot + 1)}
            >
              <PartyPanel
                game={game}
                number={slot + 1}
                label={t.posto(slot + 1)}
                hero={main}
                state={mainActive ? "active" : slot === next ? "next" : undefined}
                enter={isPlaced("hero", slot, main?.id)}
                empty={<ChooseMark text={t.scegli} strong={mainActive || slot === next} />}
              />
            </Slot>
            <Slot
              t={t}
              id={slotElementId("associate", slot)}
              hero={associate}
              active={associateActive}
              flagged={!!issue?.associate}
              describedBy={issue?.associate ? messageId : undefined}
              onPick={() => onPick({ kind: "associate", slot })}
              onRemove={() => onRemove({ kind: "associate", slot })}
              label={main ? t.scegliAssociato(main.name) : t.scegliAssociatoVuoto(slot + 1)}
              small
            >
              <AssociateStrip
                game={game}
                label={t.associato}
                hero={associate}
                emptyText={t.facoltativo}
                choosable
                active={associateActive}
                enter={isPlaced("associate", slot, associate?.id)}
              />
            </Slot>
            {message ? (
              <p id={messageId} className="m-0 flex items-start gap-1.5 text-[12px] leading-snug text-hot">
                <span aria-hidden className="p5-cut-sm mt-px shrink-0 bg-hot px-1.5 font-bold text-paper">
                  !
                </span>
                {message}
              </p>
            ) : (
              <span aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Un posto che si sceglie: tutto il posto e' il pulsante (si centra col
 * pollice), e accanto, fuori dal pulsante, la croce per togliere l'eroe. Come in
 * Squadra; in piu' il filo rosa tratteggiato quando il posto ha un problema (pieno
 * sarebbe il fuoco).
 */
function Slot({
  t,
  id,
  hero,
  active,
  flagged,
  describedBy,
  onPick,
  onRemove,
  label,
  small = false,
  children,
}: {
  t: Texts;
  id: string;
  hero: TemplateHero | undefined;
  active: boolean;
  flagged: boolean;
  describedBy: string | undefined;
  onPick: () => void;
  onRemove: () => void;
  label: string;
  small?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cx("relative min-w-0 self-stretch", flagged && "outline-2 outline-offset-2 outline-hot outline-dashed")}>
      <button
        type="button"
        id={id}
        onClick={onPick}
        aria-label={hero ? `${label} · ${t.cambia}: ${hero.name}` : label}
        aria-pressed={active}
        aria-describedby={describedBy}
        className="group block h-full w-full scroll-mt-28 scroll-mb-48 cursor-pointer border-0 bg-transparent p-0 text-left text-ink focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        {children}
      </button>
      {hero ? (
        <button
          type="button"
          onClick={onRemove}
          aria-label={t.togliTitolo(hero.name)}
          title={t.togliTitolo(hero.name)}
          className={cx(
            "p5-btn absolute grid h-9 w-9 cursor-pointer place-items-center border-0 [--btn-bg:color-mix(in_srgb,var(--color-paper)_85%,transparent)] [--btn-fg:var(--color-ink)] [--btn-hi:var(--color-brand)] [--btn-hi-fg:#fff]",
            small ? "top-1/2 right-0.5 -translate-y-1/2" : "top-1.5 right-1.5",
          )}
        >
          <IconClose size={16} />
        </button>
      ) : null}
    </div>
  );
}

/* --------------------------------------------------------------- la scelta -- */

export function HeroPicker({
  t,
  game,
  heroList,
  heroes,
  search,
  state,
  picking,
  level,
  attributes,
  box,
  filters,
  onFilters,
  onPlace,
  onClose,
}: {
  t: Texts;
  game: string;
  heroList: readonly TemplateHero[];
  heroes: ReadonlyMap<string, TemplateHero>;
  /** nome ed epiteto gia' pronti per la ricerca (`searchText`) */
  search: ReadonlyMap<string, string>;
  state: EditorState;
  picking: Picking;
  level: TemplateLevel | null;
  attributes: readonly EditorAttribute[];
  box: HeroBox;
  filters: PickerFilters;
  onFilters: (filters: PickerFilters) => void;
  onPlace: (hero: string) => void;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [limit, setLimit] = useState(PAGE);
  const [closedLimit, setClosedLimit] = useState(PAGE);
  // gli eroi che non possono entrare: chiusi in un gruppo a parte, che si apre da
  // se' quando si cerca un nome (chi cerca un eroe spento deve vedere il perche')
  const [showClosed, setShowClosed] = useState(false);
  const panel = useRef<HTMLElement>(null);
  useEffect(() => {
    // lo scorrimento morbido solo a chi non ha chiesto meno movimento
    const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    panel.current?.scrollIntoView({ block: "nearest", behavior: smooth ? "smooth" : "auto" });
    panel.current?.querySelector("input")?.focus({ preventScroll: true });
  }, []);

  const hasBox = boxSize(box) > 0;
  const mine = filters.onlyMine && hasBox;
  const current = state.team[picking.slot]?.[picking.kind] ?? null;

  const { open, closed } = useMemo(() => {
    const groups = usedGroups(state, heroes, picking);
    const words = searchText(query);
    const open: TemplateHero[] = [];
    const closed: { hero: TemplateHero; reason: HeroReason }[] = [];
    for (const hero of heroList) {
      if (filters.attribute !== null && !hero.attributes.includes(filters.attribute)) continue;
      if (mine && !ownsHero(box, hero.id)) continue;
      if (words && !search.get(hero.id)?.includes(words)) continue;
      const reason = heroReason(hero, picking.kind, level, groups);
      if (reason) closed.push({ hero, reason });
      else open.push(hero);
    }
    return { open, closed };
  }, [state, heroes, picking, query, heroList, filters.attribute, mine, box, search, level]);

  const searching = searchText(query) !== "";
  const closedOpen = showClosed || searching || open.length === 0;
  const shownOpen = open.slice(0, limit);
  const shownClosed = closedOpen ? closed.slice(0, closedLimit) : [];

  const main = picking.kind === "associate" && state.team[picking.slot]?.hero ? heroes.get(state.team[picking.slot]!.hero!) : undefined;
  const title =
    picking.kind === "hero"
      ? t.scegliPosto(picking.slot + 1)
      : main
        ? t.scegliAssociato(main.name)
        : t.scegliAssociatoVuoto(picking.slot + 1);
  const note = picking.kind === "associate" ? t.associatiLiberi : level ? null : t.primaDifficoltaEroi;

  const filter = (change: Partial<PickerFilters>) => {
    onFilters({ ...filters, ...change });
    setLimit(PAGE);
    setClosedLimit(PAGE);
  };

  return (
    <section
      ref={panel}
      aria-label={title}
      className="p5-corner mt-5 max-w-[1100px] scroll-mt-24 scroll-mb-40 border border-rule border-t-[3px] border-t-brand bg-paper-2 p-3 sm:p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="m-0 font-display text-[20px] leading-tight font-black uppercase [font-variation-settings:'wdth'_80]">{title}</h3>
        <button type="button" onClick={onClose} className={buttonClass("ghost", "sm")}>
          <IconClose size={14} />
          {t.chiudi}
        </button>
      </div>
      {note ? <p className="mt-1 mb-0 max-w-[72ch] text-[12px] text-ink-3">{note}</p> : null}

      <div className="mt-3 grid gap-2.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2">
          <label htmlFor="strategia-cerca-eroe" className="sr-only">
            {t.cercaEroeEtichetta}
          </label>
          <Input
            id="strategia-cerca-eroe"
            type="search"
            autoComplete="off"
            value={query}
            placeholder={t.cercaEroe}
            onChange={(event) => {
              setQuery(event.target.value);
              setLimit(PAGE);
              setClosedLimit(PAGE);
            }}
            className="max-w-[340px] scroll-mb-40 placeholder:text-ink-3"
          />
          {hasBox ? (
            <span title={t.soloMieiTitolo}>
              <Chip active={filters.onlyMine} onClick={() => filter({ onlyMine: !filters.onlyMine })} label={t.soloMiei} count={boxSize(box)} />
            </span>
          ) : null}
        </div>
        <div role="group" aria-label={t.attributo} className="flex flex-wrap items-center gap-1.5">
          <span className={cx(eyebrow, "mr-1")} aria-hidden>
            {t.attributo}
          </span>
          <Chip active={filters.attribute === null} quiet onClick={() => filter({ attribute: null })} label={t.tutti} />
          {attributes.map((attribute) => (
            <Chip
              key={attribute.code}
              active={filters.attribute === attribute.code}
              onClick={() => filter({ attribute: filters.attribute === attribute.code ? null : attribute.code })}
              label={attribute.name}
              iconSrc={attribute.icon ?? undefined}
              withLabel
            />
          ))}
        </div>
      </div>

      {open.length + closed.length === 0 ? <p className="mt-4 mb-0 text-[13px] text-ink-3">{t.nessunEroe}</p> : null}

      {open.length > 0 ? (
        <>
          <p className={cx(eyebrow, "mt-4 mb-2")}>{t.possono(open.length)}</p>
          <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-x-2 gap-y-3 p-0">
            {shownOpen.map((hero) => (
              <li key={hero.id} className="min-w-0">
                <button
                  type="button"
                  onClick={() => onPlace(hero.id)}
                  title={`${hero.epithet} ${hero.name}`}
                  aria-label={`${hero.epithet} ${hero.name}`}
                  data-active={hero.id === current ? "" : undefined}
                  aria-current={hero.id === current ? "true" : undefined}
                  className="hero-card group block w-full cursor-pointer border-0 bg-transparent p-0 text-left text-ink focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  <HeroCardArt game={game} hero={hero} />
                  <span className={cx(heroNameClass, "mt-1")}>{hero.name}</span>
                </button>
              </li>
            ))}
          </ul>
          {open.length > shownOpen.length ? (
            <button type="button" onClick={() => setLimit(limit + PAGE)} className={cx(buttonClass("outline", "sm"), "mt-4")}>
              {t.mostraAltri(Math.min(PAGE, open.length - shownOpen.length))}
            </button>
          ) : null}
        </>
      ) : null}

      {closed.length > 0 ? (
        <div className="mt-5 border-t border-rule-2 pt-3">
          {searching || open.length === 0 ? (
            <p className={cx(eyebrow, "m-0 mb-2")}>{t.nonPossono(closed.length)}</p>
          ) : (
            <button
              type="button"
              aria-expanded={showClosed}
              aria-controls="strategia-eroi-spenti"
              onClick={() => setShowClosed(!showClosed)}
              className={cx(eyebrow, "mb-2 inline-flex min-h-9 cursor-pointer items-center gap-1.5 border-0 bg-transparent p-0 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2")}
            >
              <IconChevronRight size={14} className={cx("transition-transform motion-reduce:transition-none", showClosed && "rotate-90")} />
              {t.nonPossono(closed.length)}
            </button>
          )}
          {closedOpen ? (
            <ul id="strategia-eroi-spenti" className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(84px,1fr))] gap-x-2 gap-y-3 p-0">
              {shownClosed.map(({ hero, reason }) => (
                <li key={hero.id} className="min-w-0">
                  {/* spento ma leggibile: card in grigio, e il motivo sotto il nome */}
                  <button
                    type="button"
                    disabled
                    aria-label={`${hero.epithet} ${hero.name}: ${t.motivo[reason]}`}
                    className="block w-full cursor-not-allowed border-0 bg-transparent p-0 text-left text-ink-2"
                  >
                    <span className="block opacity-45 grayscale">
                      <HeroCardArt game={game} hero={hero} />
                    </span>
                    <span className={cx(heroNameClass, "mt-1 text-ink-3")}>{hero.name}</span>
                    <span className="mt-0.5 block text-[12px] leading-tight text-hot">{t.motivo[reason]}</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}
          {closedOpen && closed.length > shownClosed.length ? (
            <button type="button" onClick={() => setClosedLimit(closedLimit + PAGE)} className={cx(buttonClass("outline", "sm"), "mt-4")}>
              {t.mostraAltri(Math.min(PAGE, closed.length - shownClosed.length))}
            </button>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}

function HeroCardArt({ game, hero }: { game: string; hero: TemplateHero }) {
  return (
    <span className="hero-card-art block">
      {/* eslint-disable-next-line @next/next/no-img-element -- card gia' pronte in due densita' */}
      <img
        src={hero.card}
        srcSet={`${hero.card} 1x, ${heroCardSrc(game, hero.id, 2)} 2x`}
        alt=""
        width={84}
        height={84}
        loading="lazy"
        decoding="async"
        className="block aspect-square w-full bg-paper"
      />
    </span>
  );
}
