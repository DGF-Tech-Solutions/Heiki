"use client";

/**
 * Pannello dei controlli del profilo.
 *
 * E' un componente CONTROLLATO: non possiede lo stato, lo riceve e notifica le
 * modifiche. Lo stato vive in ProfileWorkspace, che e' anche l'unico a sapere se
 * si sta modificando o solo guardando. Cosi' uscire dalla modalita' modifica non
 * perde nulla di quello che si stava scrivendo.
 *
 * Due cose restano deliberatamente NON modificabili, ed e' una scelta di
 * prodotto, non una mancanza:
 *  - il nome di un badge, perche' i badge si guadagnano e non si scelgono;
 *  - il livello di fiducia di un badge o di un account, perche' lo assegna la
 *    verifica automatica. Se fossero modificabili a mano, la spunta
 *    "verificato" non varrebbe piu' niente per nessuno.
 * Si puo' decidere cosa esporre e in che ordine: quella e' presentazione.
 *
 * Dall'11/10 i preferiti si scelgono dal roster (prima erano nomi scritti a
 * mano, che non portavano da nessuna parte) e il gruppo delle build non c'e'
 * piu': si poteva riempire, ma il salvataggio lo ignorava.
 */

import Link from "next/link";
import { useDeferredValue, useId, useMemo, useState, type ReactNode } from "react";
import type { ProfileBadge, ProfileViewData } from "./profile-view";
import {
  ACCENTS,
  BADGE_SHOWCASE_LIMIT,
  CUSTOMIZATION_GROUPS,
  DEFAULT_CUSTOMIZATION,
  type CustomizationKey,
  type ProfileCustomization,
} from "@/lib/profile/customization";
import { FAVORITES_LIMIT, favoriteKey, moveItem } from "@/lib/profile/favorites";
import { findPickable, type PickableGame } from "@/lib/profile/favorite-heroes";
import { filterHeroes, heroCardSrc, heroEpithet, heroName } from "@/lib/games/heroes";
import type { HeroEntry } from "@/lib/games/types";
import { IconChevronRight, IconClose } from "./icons";
import { chipClass, cx, display, Empty, eyebrow, Field, Input, Tag, Textarea } from "./ui";
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";

/** I giochi con la pagina «Il mio account» (sta nel modulo del gioco, che qui nel browser non si carica). */
const ACCOUNT_PAGES: readonly { game: string; href: string }[] = [
  { game: "Grand Cross", href: "/grand-cross/account" },
];

/** quante card mostra la ricerca: quattro o cinque file nel pannello, non il roster intero */
const RESULTS = 20;

const TESTI = testi({
  it: {
    chiSei: "Chi sei",
    chiSeiNota: "Come ti trovano e come ti presenti",
    nomeVisualizzato: "Nome visualizzato",
    handle: "Handle",
    paese: "Paese o regione",
    facoltativo: "facoltativo",
    esempioPaese: "Italia",
    bio: "Bio",
    preferiti: "Eroi preferiti",
    preferitiNota: (limite: number) => `Fino a ${limite}, nell'ordine che scegli: il primo va in copertina`,
    inCopertina: "In copertina",
    nessunPreferito: "Nessun eroe scelto: cercane uno qui sotto.",
    cerca: "Cerca un eroe",
    cercaNota: "nome o epiteto, in italiano o inglese",
    cercaEsempio: "Meliodas, Derieri, Dea dell'osservazione…",
    recenti: "Usciti di recente",
    risultati: (n: number) => (n === 1 ? "1 eroe" : `${n} eroi`),
    primi: (n: number) => `i primi ${n}: scrivi di più per restringere`,
    nessunRisultato: "Nessun eroe con questo nome.",
    scelti: (n: number, limite: number) => `${n} su ${limite}`,
    pieno: (limite: number) => `Hai scelto ${limite} eroi: togline uno per aggiungerne altri.`,
    togli: (nome: string) => `Togli ${nome} dai preferiti`,
    aspetto: "Aspetto",
    aspettoNota: "Tutti i cosmetici sono disegni nostri: nessun asset dei giochi",
    accento: "Accento",
    accentoNota: "colora copertina, etichette e dettagli",
    premium: " (premium)",
    richiedePremium: (nome: string) => `${nome} — richiede il premium`,
    vetrina: "Vetrina dei badge",
    vetrinaNota: (esposti: number, posti: number) =>
      `${esposti} esposti su ${posti} posti. I badge si guadagnano: scegli quali mostrare e in che ordine, non come si chiamano.`,
    vetrinaPiena: "Vetrina piena",
    esponi: "esponi",
    profiliGioco: "Profili di gioco",
    profiliGiocoNota:
      "Solo quello che scrivi tu: nickname, Codice amico, server e classe dell'account. Non chiediamo mai le credenziali del tuo account di gioco.",
    profiliGiocoDove: "Si scrivono nella pagina «Il mio account» di ogni gioco, dove chiedi anche la verifica della classe:",
    ilMioAccount: "Il mio account",
    spostaSu: (nome: string) => `Sposta su ${nome}`,
    spostaGiu: (nome: string) => `Sposta giù ${nome}`,
  },
  en: {
    chiSei: "Who you are",
    chiSeiNota: "How people find you and how you present yourself",
    nomeVisualizzato: "Display name",
    handle: "Handle",
    paese: "Country or region",
    facoltativo: "optional",
    esempioPaese: "Italy",
    bio: "Bio",
    preferiti: "Favorite heroes",
    preferitiNota: (limite: number) => `Up to ${limite}, in the order you choose: the first one becomes your cover`,
    inCopertina: "Cover",
    nessunPreferito: "No heroes picked yet: search for one below.",
    cerca: "Search a hero",
    cercaNota: "name or epithet, in English or Italian",
    cercaEsempio: "Meliodas, Derieri, Omniscient Watcher…",
    recenti: "Latest releases",
    risultati: (n: number) => (n === 1 ? "1 hero" : `${n} heroes`),
    primi: (n: number) => `the first ${n}: type more to narrow it down`,
    nessunRisultato: "No hero with this name.",
    scelti: (n: number, limite: number) => `${n} of ${limite}`,
    pieno: (limite: number) => `You picked ${limite} heroes: remove one to add more.`,
    togli: (nome: string) => `Remove ${nome} from favorites`,
    aspetto: "Appearance",
    aspettoNota: "All cosmetics are our own designs: no game assets",
    accento: "Accent",
    accentoNota: "colors your cover, tags and details",
    premium: " (premium)",
    richiedePremium: (nome: string) => `${nome} — requires Premium`,
    vetrina: "Badge showcase",
    vetrinaNota: (esposti: number, posti: number) =>
      `${esposti} shown out of ${posti} slots. Badges are earned: choose which to show and in what order, not what they're called.`,
    vetrinaPiena: "Showcase full",
    esponi: "show",
    profiliGioco: "Game profiles",
    profiliGiocoNota:
      "Only what you enter: nickname, Friend Code, server and Account Combat Class. We never ask for your game account credentials.",
    profiliGiocoDove: "They are entered on each game's «My account» page, where you also request the class verification:",
    ilMioAccount: "My account",
    spostaSu: (nome: string) => `Move ${nome} up`,
    spostaGiu: (nome: string) => `Move ${nome} down`,
  },
});

export const BIO_LIMIT = 280;
export const NAME_LIMIT = 40;

/**
 * Cio' che l'editor modifica: solo i campi che il salvataggio accetta. Il resto
 * della vista (ruolo, numeri, account di gioco) resta quello caricato, e
 * l'anteprima lo rimette insieme (profile-workspace.tsx).
 */
export interface ProfileDraft {
  username: string;
  displayName: string;
  bio: string;
  country: string;
  favorites: string[];
  badges: ProfileBadge[];
  customization: ProfileCustomization;
}

export function toDraft(data: ProfileViewData): ProfileDraft {
  return {
    username: data.username,
    displayName: data.displayName,
    bio: data.bio ?? "",
    country: data.country ?? "",
    favorites: [...data.favorites],
    badges: data.badges.map((badge) => ({ ...badge })),
    customization: { ...(data.customization ?? DEFAULT_CUSTOMIZATION) },
  };
}

interface Props {
  value: ProfileDraft;
  onChange: (next: ProfileDraft) => void;
  /** false = le opzioni premium restano visibili ma non selezionabili */
  canUsePremium: boolean;
  /** gli eroi fra cui scegliere i preferiti: arrivano solo a chi modifica */
  heroes: readonly PickableGame[];
}

export function ProfileEditorPanel({ value, onChange, canUsePremium, heroes }: Props) {
  const locale = useLocale();
  const t = TESTI[locale];

  const patch = (changes: Partial<ProfileDraft>) => onChange({ ...value, ...changes });

  const setCustom = (key: CustomizationKey, option: string) =>
    onChange({ ...value, customization: { ...value.customization, [key]: option } });

  const shownBadges = value.badges.filter((badge) => badge.shown !== false).length;

  return (
    <div className="grid min-w-0 gap-5">
      <Group title={t.chiSei} hint={t.chiSeiNota}>
        <Field
          label={t.nomeVisualizzato}
          hint={<Counter value={value.displayName.length} limit={NAME_LIMIT} />}
        >
          <Input
            value={value.displayName}
            maxLength={NAME_LIMIT}
            onChange={(event) => patch({ displayName: event.target.value })}
          />
        </Field>

        <Field label={t.handle} hint={`/u/${value.username || "…"}`}>
          <Input
            className="font-mono"
            value={value.username}
            maxLength={20}
            onChange={(event) => patch({ username: slugify(event.target.value) })}
          />
        </Field>

        <Field label={t.paese} hint={t.facoltativo}>
          <Input
            value={value.country}
            maxLength={40}
            placeholder={t.esempioPaese}
            onChange={(event) => patch({ country: event.target.value })}
          />
        </Field>

        <Field
          label={t.bio}
          hint={<Counter value={value.bio.length} limit={BIO_LIMIT} />}
          className="mb-0"
        >
          <Textarea
            value={value.bio}
            maxLength={BIO_LIMIT}
            onChange={(event) => patch({ bio: event.target.value })}
          />
        </Field>
      </Group>

      <Group title={t.preferiti} hint={t.preferitiNota(FAVORITES_LIMIT)}>
        <FavoritesPicker value={value.favorites} onChange={(favorites) => patch({ favorites })} games={heroes} />
      </Group>

      <Group title={t.aspetto} hint={t.aspettoNota}>
        <Subgroup label={t.accento} hint={t.accentoNota}>
          <div className="flex flex-wrap gap-2.5">
            {ACCENTS.map((option) => {
              const locked = option.premium && !canUsePremium;
              const active = value.customization.accent === option.id;
              const label = option.labels[locale];
              return (
                <button
                  key={option.id}
                  type="button"
                  disabled={locked}
                  aria-pressed={active}
                  aria-label={`${label}${option.premium ? t.premium : ""}`}
                  title={locked ? t.richiedePremium(label) : `${label}: ${option.descriptions[locale]}`}
                  onClick={() => setCustom("accent", option.id)}
                  // Il campione legge il colore vero dal CSS ([data-accent] in
                  // globals.css), come il profilo: fino all'11/10 aveva una sua
                  // tabella, e il «Viola» restava viola dopo che l'accento era
                  // diventato il rosso del sito.
                  data-accent={option.id}
                  style={{ background: "var(--accent)" }}
                  className={cx(
                    // quadrati e non cerchi (10/10): nel mondo scelto non ci sono angoli tondi
                    "relative size-9 cursor-pointer border border-rule transition-transform",
                    "hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-40",
                    active && "ring-2 ring-ink ring-offset-2 ring-offset-paper-2",
                  )}
                >
                  {/* il segno dorato del premium: una lama, non la stella del font */}
                  {option.premium ? <span aria-hidden className="p5-cut-sm absolute -top-1 -right-1.5 h-2.5 w-3.5 bg-gold" /> : null}
                </button>
              );
            })}
          </div>
        </Subgroup>

        {CUSTOMIZATION_GROUPS.filter((group) => group.key !== "accent").map((group) => (
          <Subgroup key={group.key} label={group.labels[locale]} hint={group.hints[locale]}>
            <div className="flex flex-wrap gap-2">
              {group.options.map((option) => {
                const locked = option.premium && !canUsePremium;
                const active = value.customization[group.key] === option.id;
                const label = option.labels[locale];
                return (
                  <button
                    key={option.id}
                    type="button"
                    disabled={locked}
                    aria-pressed={active}
                    title={locked ? t.richiedePremium(label) : option.descriptions[locale]}
                    onClick={() => setCustom(group.key, option.id)}
                    className={chipClass(active, true, "border-0 disabled:cursor-not-allowed disabled:opacity-40")}
                  >
                    {label}
                    {option.premium ? <span aria-hidden className="p5-cut-sm inline-block h-2.5 w-3.5 bg-gold" /> : null}
                  </button>
                );
              })}
            </div>
          </Subgroup>
        ))}
      </Group>

      {/* solo a chi ha dei badge: una vetrina vuota non e' una cosa da sistemare */}
      {value.badges.length > 0 ? (
        <Group title={t.vetrina} hint={t.vetrinaNota(shownBadges, BADGE_SHOWCASE_LIMIT)}>
          <ol className="m-0 grid list-none gap-2 p-0">
            {value.badges.map((badge, index) => {
              const shown = badge.shown !== false;
              const atLimit = !shown && shownBadges >= BADGE_SHOWCASE_LIMIT;
              return (
                <Row key={badge.id}>
                  <Reorder
                    index={index}
                    length={value.badges.length}
                    name={badge.name}
                    onMove={(from, to) => patch({ badges: moveItem(value.badges, from, to) })}
                  />
                  <span className="min-w-0 flex-1 basis-40">
                    <span className="block text-[13px]">
                      {badge.icon ?? "◇"} {badge.name}
                    </span>
                    <span className={eyebrow}>{badge.trust.toLowerCase()}</span>
                  </span>
                  <label
                    className="inline-flex cursor-pointer items-center gap-1.5 text-xs whitespace-nowrap text-ink-2"
                    title={atLimit ? t.vetrinaPiena : undefined}
                  >
                    <input
                      type="checkbox"
                      className="size-3.5 accent-brand"
                      checked={shown}
                      disabled={atLimit}
                      onChange={(event) =>
                        patch({
                          badges: replace(value.badges, index, {
                            ...badge,
                            shown: event.target.checked,
                          }),
                        })
                      }
                    />
                    {t.esponi}
                  </label>
                </Row>
              );
            })}
          </ol>
        </Group>
      ) : null}

      {/*
        Gli account di gioco non si scrivono qui (prima c'era un elenco che non si
        salvava): hanno una pagina loro per gioco, che li tiene nel browser e nel
        database e li fa verificare. Qui si rimanda a quella.
      */}
      <Group title={t.profiliGioco} hint={t.profiliGiocoNota}>
        <p className="m-0 text-sm text-ink-2">{t.profiliGiocoDove}</p>
        <ul className="mt-2 mb-0 grid list-none gap-1 p-0 text-sm">
          {ACCOUNT_PAGES.map((page) => (
            <li key={page.href}>
              <Link
                href={page.href}
                className="inline-flex items-center gap-1 font-semibold text-ink underline decoration-brand decoration-2 underline-offset-2 hover:text-brand-deep"
              >
                {page.game}: {t.ilMioAccount}
                <IconChevronRight size={13} />
              </Link>
            </li>
          ))}
        </ul>
      </Group>
    </div>
  );
}

/* --------------------------------------------------------- eroi preferiti */

/**
 * La scelta dei preferiti: in alto quelli scelti, in ordine, da spostare o
 * togliere; sotto la ricerca nel roster, con le card come pulsanti. Una card
 * gia' scelta resta premuta e un secondo clic la toglie, cosi' la griglia
 * dice da sola cosa c'e' gia'.
 *
 * Tutto a pulsanti veri, quindi tastiera e lettori di schermo funzionano senza
 * altro: niente trascinamento, che a tastiera non si fa.
 */
function FavoritesPicker({
  value,
  onChange,
  games,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  games: readonly PickableGame[];
}) {
  const locale = useLocale();
  const t = TESTI[locale];
  const searchId = useId();
  const [query, setQuery] = useState("");
  // la griglia dei risultati segue la battuta senza rallentare il campo
  const search = useDeferredValue(query.trim());
  const full = value.length >= FAVORITES_LIMIT;

  const { results, total } = useMemo(() => {
    const found: { key: string; game: string; hero: HeroEntry }[] = [];
    let count = 0;
    for (const game of games) {
      // senza ricerca, gli ultimi usciti: il roster e' gia' dal piu' recente
      const heroes = search ? filterHeroes(game.heroes, { search }) : game.heroes;
      count += heroes.length;
      for (const hero of heroes) {
        if (found.length >= RESULTS) break;
        found.push({ key: favoriteKey(game.game, hero.id), game: game.game, hero });
      }
    }
    return { results: found, total: count };
  }, [games, search]);

  const toggle = (key: string) => {
    if (value.includes(key)) onChange(value.filter((item) => item !== key));
    else if (!full) onChange([...value, key]);
  };

  return (
    <>
      {value.length === 0 ? (
        <Empty>{t.nessunPreferito}</Empty>
      ) : (
        <ol className="m-0 grid list-none gap-2 p-0">
          {value.map((key, index) => {
            const found = findPickable(games, key);
            const name = found ? heroName(found.hero, locale) : key;
            return (
              <Row key={key}>
                <Reorder
                  index={index}
                  length={value.length}
                  name={name}
                  onMove={(from, to) => onChange(moveItem(value, from, to))}
                />
                {found ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={heroCardSrc(found.game.game, found.hero.id)}
                    alt=""
                    width={44}
                    height={44}
                    className="size-11 flex-none bg-paper-3"
                  />
                ) : null}
                <span className="min-w-0 flex-1 basis-28">
                  {index === 0 ? <Tag tone="accent" className="mb-1">{t.inCopertina}</Tag> : null}
                  <span className="block truncate text-[13px] font-semibold">{name}</span>
                  {found ? (
                    <span className="block truncate text-xs text-ink-3">{heroEpithet(found.hero, locale)}</span>
                  ) : null}
                </span>
                <button
                  type="button"
                  className={cx(ICON_BTN, "size-9 hover:border-hot hover:text-hot")}
                  aria-label={t.togli(name)}
                  title={t.togli(name)}
                  onClick={() => onChange(value.filter((item) => item !== key))}
                >
                  <IconClose size={14} />
                </button>
              </Row>
            );
          })}
        </ol>
      )}

      <div className="mt-4 border-t border-rule-2 pt-4">
        <Field label={<span id={`${searchId}-label`}>{t.cerca}</span>} hint={t.cercaNota} className="mb-3">
          <Input
            type="search"
            value={query}
            placeholder={t.cercaEsempio}
            autoComplete="off"
            aria-describedby={`${searchId}-status`}
            onChange={(event) => setQuery(event.target.value)}
          />
        </Field>

        <p id={`${searchId}-status`} aria-live="polite" className="m-0 mb-2.5 flex flex-wrap items-baseline justify-between gap-2 text-xs text-ink-3">
          <span>
            {search ? t.risultati(total) : t.recenti}
            {search && total > RESULTS ? ` · ${t.primi(RESULTS)}` : ""}
          </span>
          <span className={cx(eyebrow, full && "text-brand-deep")}>{t.scelti(value.length, FAVORITES_LIMIT)}</span>
        </p>
        {full ? <p className="m-0 mb-2.5 text-xs text-ink-2">{t.pieno(FAVORITES_LIMIT)}</p> : null}

        {results.length === 0 ? (
          <Empty>{t.nessunRisultato}</Empty>
        ) : (
          <ul
            aria-labelledby={`${searchId}-label`}
            className="m-0 grid list-none gap-x-2 gap-y-3 p-0"
            style={{ gridTemplateColumns: "repeat(auto-fill, minmax(68px, 1fr))" }}
          >
            {results.map(({ key, game, hero }) => {
              const chosen = value.includes(key);
              const name = heroName(hero, locale);
              const epithet = heroEpithet(hero, locale);
              return (
                <li key={key} className="min-w-0">
                  <button
                    type="button"
                    aria-pressed={chosen}
                    disabled={!chosen && full}
                    // il nome e' il testo del pulsante, aria-pressed dice se e' gia' fra i preferiti
                    title={`${name} · ${epithet}`}
                    onClick={() => toggle(key)}
                    className="hero-card group block w-full cursor-pointer border-0 bg-transparent p-0 text-left text-ink disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2"
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
                        className={cx(
                          "block aspect-square w-full bg-paper-3",
                          chosen && "outline-3 -outline-offset-3 outline-brand outline-solid",
                        )}
                      />
                      {chosen ? (
                        <span aria-hidden className="p5-cut-sm absolute top-1 left-1 bg-brand px-1.5 font-display text-[11px] font-extrabold text-white">
                          {value.indexOf(key) + 1}
                        </span>
                      ) : null}
                    </span>
                    <span className="mt-1 block line-clamp-2 text-[11.5px] leading-tight font-semibold">{name}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}

/* ------------------------------------------------------------- ausiliari */

function Group({
  title,
  hint,
  children,
}: {
  title: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <section className="p5-corner min-w-0 border border-rule bg-paper-2 p-5">
      <div className="mb-3.5 pr-3">
        <h2 className={cx(display, "text-[17px] [font-variation-settings:'wdth'_92]")}>{title}</h2>
        <span className="mt-1 block text-xs text-ink-3">{hint}</span>
      </div>
      {children}
    </section>
  );
}

function Subgroup({
  label,
  hint,
  children,
}: {
  label: string;
  hint: string;
  children: ReactNode;
}) {
  return (
    <div className="mt-4 border-t border-rule-2 pt-4 first:mt-0 first:border-0 first:pt-0">
      <span className={cx(eyebrow, "mb-2.5 flex flex-wrap items-baseline justify-between gap-x-2.5")}>
        {label}
        <span className="font-body text-[12px] font-normal normal-case tracking-normal [font-variation-settings:normal]">{hint}</span>
      </span>
      {children}
    </div>
  );
}

function Row({ children }: { children: ReactNode }) {
  return (
    <li className="flex flex-wrap items-center gap-2.5 border border-rule-2 bg-paper px-3 py-2.5">
      {children}
    </li>
  );
}

function Counter({ value, limit }: { value: number; limit: number }) {
  return (
    <span className={cx("font-mono", value > limit * 0.9 ? "text-hot" : "text-ink-3")}>
      {value}/{limit}
    </span>
  );
}

const ICON_BTN =
  "grid flex-none place-items-center border border-rule bg-transparent text-ink-3 cursor-pointer " +
  "hover:border-ink-3 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed";

function Reorder({
  index,
  length,
  name,
  onMove,
}: {
  index: number;
  length: number;
  /** di chi si parla, per il lettore di schermo: «Sposta su» da solo non dice cosa */
  name: string;
  onMove: (from: number, to: number) => void;
}) {
  const t = TESTI[useLocale()];

  return (
    <span className="flex flex-none flex-col gap-0.5">
      <button
        type="button"
        className={cx(ICON_BTN, "h-[26px] w-9")}
        aria-label={t.spostaSu(name)}
        title={t.spostaSu(name)}
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
      >
        <IconChevronRight size={12} strokeWidth={3} className="-rotate-90" />
      </button>
      <button
        type="button"
        className={cx(ICON_BTN, "h-[26px] w-9")}
        aria-label={t.spostaGiu(name)}
        title={t.spostaGiu(name)}
        disabled={index === length - 1}
        onClick={() => onMove(index, index + 1)}
      >
        <IconChevronRight size={12} strokeWidth={3} className="rotate-90" />
      </button>
    </span>
  );
}

function replace<T>(items: readonly T[], index: number, next: T): T[] {
  const copy = items.slice();
  copy[index] = next;
  return copy;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+/, "")
    .slice(0, 20);
}
