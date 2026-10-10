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
 */

import Link from "next/link";
import type { ReactNode } from "react";
import type { ProfileViewData } from "./profile-view";
import {
  ACCENTS,
  BADGE_SHOWCASE_LIMIT,
  CUSTOMIZATION_GROUPS,
  DEFAULT_CUSTOMIZATION,
  type CustomizationKey,
  type ProfileCustomization,
} from "@/lib/profile/customization";
import { IconChevronRight, IconClose } from "./icons";
import { Button, chipClass, cx, display, Empty, Field, Input, Textarea } from "./ui";
import { useLocale } from "@/lib/i18n/client";
import { testi } from "@/lib/i18n/locale";

/** I giochi con la pagina «Il mio account» (sta nel modulo del gioco, che qui nel browser non si carica). */
const ACCOUNT_PAGES: readonly { game: string; href: string }[] = [
  { game: "Grand Cross", href: "/grand-cross/account" },
];

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
    aspetto: "Aspetto",
    aspettoNota: "Tutti i cosmetici sono disegni nostri: nessun asset dei giochi",
    accento: "Accento",
    accentoNota: "colora livello, badge e dettagli",
    premium: " (premium)",
    richiedePremium: (nome: string) => `${nome} — richiede il premium`,
    preferiti: "Personaggi preferiti",
    preferitiNota: "Compaiono in cima al profilo, nell'ordine che scegli",
    aggiungiPreferito: "Aggiungi preferito",
    nomePersonaggio: "Nome del personaggio",
    vetrina: "Vetrina dei badge",
    vetrinaNota: (esposti: number, posti: number) =>
      `${esposti} esposti su ${posti} posti. I badge si guadagnano: scegli quali mostrare e in che ordine, non come si chiamano.`,
    nessunBadge: "Nessun badge ancora.",
    vetrinaPiena: "Vetrina piena",
    esponi: "esponi",
    profiliGioco: "Profili di gioco",
    profiliGiocoNota:
      "Solo quello che scrivi tu: nickname, Codice amico, server e classe dell'account. Non chiediamo mai le credenziali del tuo account di gioco.",
    profiliGiocoDove: "Si scrivono nella pagina «Il mio account» di ogni gioco, dove chiedi anche la verifica della classe:",
    ilMioAccount: "Il mio account",
    mostra: "mostra",
    build: "Build",
    buildNota: "Decidi quali rendere pubbliche sul profilo",
    nuovaBuild: "Nuova build",
    aggiungiBuild: "Aggiungi build",
    nomeBuild: "Nome della build",
    personaggio: "Personaggio",
    danno: "Danno",
    pubblica: "pubblica",
    spostaSu: "Sposta su",
    spostaGiu: "Sposta giù",
    rimuovi: "Rimuovi",
    nienteQui: "Niente qui, per ora.",
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
    aspetto: "Appearance",
    aspettoNota: "All cosmetics are our own designs: no game assets",
    accento: "Accent",
    accentoNota: "colors your level, badges and details",
    premium: " (premium)",
    richiedePremium: (nome: string) => `${nome} — requires Premium`,
    preferiti: "Favorite characters",
    preferitiNota: "They appear at the top of your profile, in the order you choose",
    aggiungiPreferito: "Add favorite",
    nomePersonaggio: "Character name",
    vetrina: "Badge showcase",
    vetrinaNota: (esposti: number, posti: number) =>
      `${esposti} shown out of ${posti} slots. Badges are earned: choose which to show and in what order, not what they're called.`,
    nessunBadge: "No badges yet.",
    vetrinaPiena: "Showcase full",
    esponi: "show",
    profiliGioco: "Game profiles",
    profiliGiocoNota:
      "Only what you enter: nickname, Friend Code, server and Account Combat Class. We never ask for your game account credentials.",
    profiliGiocoDove: "They are entered on each game's «My account» page, where you also request the class verification:",
    ilMioAccount: "My account",
    mostra: "show",
    build: "Builds",
    buildNota: "Choose which ones are public on your profile",
    nuovaBuild: "New build",
    aggiungiBuild: "Add build",
    nomeBuild: "Build name",
    personaggio: "Character",
    danno: "Damage",
    pubblica: "public",
    spostaSu: "Move up",
    spostaGiu: "Move down",
    rimuovi: "Remove",
    nienteQui: "Nothing here yet.",
  },
});

const ACCENT_SWATCH: Readonly<Record<string, string>> = {
  brand: "#6425ff",
  magenta: "#e0169a",
  ocean: "#0870d8",
  forest: "#12805a",
  sunset: "#e2510f",
  gold: "#b07d05",
};

export const BIO_LIMIT = 280;
export const NAME_LIMIT = 40;

export type ProfileDraft = Omit<
  ProfileViewData,
  "favorites" | "badges" | "gameAccounts" | "builds" | "customization"
> & {
  favorites: string[];
  badges: ProfileViewData["badges"][number][];
  gameAccounts: ProfileViewData["gameAccounts"][number][];
  builds: ProfileViewData["builds"][number][];
  customization: ProfileCustomization;
};

export function toDraft(data: ProfileViewData): ProfileDraft {
  return {
    ...data,
    bio: data.bio ?? "",
    country: data.country ?? "",
    favorites: [...data.favorites],
    badges: data.badges.map((badge) => ({ ...badge })),
    gameAccounts: data.gameAccounts.map((account) => ({ ...account })),
    builds: data.builds.map((build) => ({ ...build })),
    customization: { ...(data.customization ?? DEFAULT_CUSTOMIZATION) },
  };
}

interface Props {
  value: ProfileDraft;
  onChange: (next: ProfileDraft) => void;
  /** false = le opzioni premium restano visibili ma non selezionabili */
  canUsePremium: boolean;
}

export function ProfileEditorPanel({ value, onChange, canUsePremium }: Props) {
  const locale = useLocale();
  const t = TESTI[locale];

  const patch = (changes: Partial<ProfileDraft>) => onChange({ ...value, ...changes });

  const setCustom = (key: CustomizationKey, option: string) =>
    onChange({ ...value, customization: { ...value.customization, [key]: option } });

  const shownBadges = value.badges.filter((badge) => badge.shown !== false).length;

  return (
    <div className="grid gap-5">
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
            value={value.country ?? ""}
            maxLength={40}
            placeholder={t.esempioPaese}
            onChange={(event) => patch({ country: event.target.value })}
          />
        </Field>

        <Field
          label={t.bio}
          hint={<Counter value={(value.bio ?? "").length} limit={BIO_LIMIT} />}
          className="mb-0"
        >
          <Textarea
            value={value.bio ?? ""}
            maxLength={BIO_LIMIT}
            onChange={(event) => patch({ bio: event.target.value })}
          />
        </Field>
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
                  title={locked ? t.richiedePremium(label) : option.descriptions[locale]}
                  onClick={() => setCustom("accent", option.id)}
                  style={{ background: ACCENT_SWATCH[option.id] ?? "#6425ff" }}
                  className={cx(
                    // quadrati e non cerchi (10/10): nel mondo scelto non ci sono angoli tondi
                    "relative size-9 cursor-pointer border border-rule transition-transform",
                    "hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-40",
                    active && "ring-2 ring-ink ring-offset-2 ring-offset-paper",
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

      <ListGroup
        title={t.preferiti}
        hint={t.preferitiNota}
        items={value.favorites}
        onChange={(favorites) => patch({ favorites })}
        create={() => ""}
        addLabel={t.aggiungiPreferito}
        renderFields={(item, update) => (
          <MiniInput
            value={item}
            placeholder={t.nomePersonaggio}
            maxLength={40}
            onChange={(next) => update(next)}
          />
        )}
      />

      <Group title={t.vetrina} hint={t.vetrinaNota(shownBadges, BADGE_SHOWCASE_LIMIT)}>
        {value.badges.length === 0 ? (
          <Empty>{t.nessunBadge}</Empty>
        ) : (
          <div className="grid gap-2">
            {value.badges.map((badge, index) => {
              const shown = badge.shown !== false;
              const atLimit = !shown && shownBadges >= BADGE_SHOWCASE_LIMIT;
              return (
                <Row key={badge.id}>
                  <Reorder
                    index={index}
                    length={value.badges.length}
                    onMove={(from, to) => patch({ badges: move(value.badges, from, to) })}
                  />
                  <span className="min-w-0 flex-1 basis-40">
                    <span className="block text-[13px]">
                      {badge.icon ?? "◇"} {badge.name}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-[0.09em] text-ink-3">
                      {badge.trust.toLowerCase()}
                    </span>
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
          </div>
        )}
      </Group>

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

      <ListGroup
        title={t.build}
        hint={t.buildNota}
        items={value.builds}
        onChange={(builds) => patch({ builds })}
        create={() => ({
          id: `build-${Date.now()}`,
          name: t.nuovaBuild,
          game: "",
          character: "",
          median: 0,
          patch: "—",
          isPublic: true,
        })}
        addLabel={t.aggiungiBuild}
        renderFields={(build, update) => (
          <>
            <MiniInput
              value={build.name}
              placeholder={t.nomeBuild}
              maxLength={50}
              onChange={(name) => update({ ...build, name })}
            />
            <span className="flex gap-1.5">
              <MiniInput
                value={build.character}
                placeholder={t.personaggio}
                maxLength={40}
                onChange={(character) => update({ ...build, character })}
              />
              <MiniInput
                mono
                value={build.median || ""}
                placeholder={t.danno}
                inputMode="numeric"
                onChange={(raw) =>
                  update({ ...build, median: Number(String(raw).replace(/\D/g, "")) || 0 })
                }
              />
            </span>
          </>
        )}
        renderAside={(build, update) => (
          <Toggle
            checked={build.isPublic !== false}
            label={t.pubblica}
            onChange={(isPublic) => update({ ...build, isPublic })}
          />
        )}
      />
    </div>
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
    <section className="rounded-card border border-rule bg-paper p-5">
      <div className="mb-3.5">
        <h2 className={cx(display, "text-[15px] [font-variation-settings:'wdth'_92]")}>{title}</h2>
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
      <span className="mb-2.5 flex items-baseline justify-between gap-2.5 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-ink-3">
        {label}
        <span className="text-[12px] normal-case tracking-normal">{hint}</span>
      </span>
      {children}
    </div>
  );
}

function Row({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-card border border-rule-2 bg-paper-2 px-3 py-2.5">
      {children}
    </div>
  );
}

function MiniInput({
  value,
  onChange,
  mono = false,
  ...props
}: {
  value: string | number;
  onChange: (value: string) => void;
  mono?: boolean;
  placeholder?: string;
  maxLength?: number;
  inputMode?: "numeric";
}) {
  return (
    <input
      {...props}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={cx(
        "h-9 w-full border border-rule bg-paper px-2.5 text-[13px] text-ink",
        "focus:border-brand focus:outline-none",
        mono && "font-mono text-xs",
      )}
    />
  );
}

function Toggle({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-1.5 text-xs whitespace-nowrap text-ink-2">
      <input
        type="checkbox"
        className="size-3.5 accent-brand"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
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
  "grid place-items-center border border-rule bg-transparent text-ink-3 cursor-pointer " +
  "hover:border-ink-3 hover:text-ink disabled:opacity-30 disabled:cursor-not-allowed";

function Reorder({
  index,
  length,
  onMove,
}: {
  index: number;
  length: number;
  onMove: (from: number, to: number) => void;
}) {
  const t = TESTI[useLocale()];

  return (
    <span className="flex flex-col gap-0.5">
      <button
        type="button"
        className={cx(ICON_BTN, "h-[26px] w-9")}
        aria-label={t.spostaSu}
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
      >
        <IconChevronRight size={12} strokeWidth={3} className="-rotate-90" />
      </button>
      <button
        type="button"
        className={cx(ICON_BTN, "h-[26px] w-9")}
        aria-label={t.spostaGiu}
        disabled={index === length - 1}
        onClick={() => onMove(index, index + 1)}
      >
        <IconChevronRight size={12} strokeWidth={3} className="rotate-90" />
      </button>
    </span>
  );
}

/**
 * Gruppo di elementi riordinabili, aggiungibili e rimovibili.
 * Generico perche' preferiti, account e build hanno la stessa meccanica e
 * cambiano solo i campi da mostrare.
 */
function ListGroup<T>({
  title,
  hint,
  items,
  onChange,
  create,
  addLabel,
  renderFields,
  renderAside,
}: {
  title: string;
  hint: string;
  items: T[];
  onChange: (items: T[]) => void;
  create: () => T;
  addLabel: string;
  renderFields: (item: T, update: (next: T) => void) => ReactNode;
  renderAside?: (item: T, update: (next: T) => void) => ReactNode;
}) {
  const t = TESTI[useLocale()];

  return (
    <Group title={title} hint={hint}>
      {items.length === 0 ? (
        <Empty>{t.nienteQui}</Empty>
      ) : (
        <div className="grid gap-2">
          {items.map((item, index) => {
            const update = (next: T) => onChange(replace(items, index, next));
            return (
              <Row key={index}>
                <Reorder
                  index={index}
                  length={items.length}
                  onMove={(from, to) => onChange(move(items, from, to))}
                />
                <span className="grid min-w-0 flex-1 basis-36 gap-1.5">
                  {renderFields(item, update)}
                </span>
                {renderAside?.(item, update)}
                <button
                  type="button"
                  className={cx(ICON_BTN, "size-9 hover:border-hot hover:text-hot")}
                  aria-label={t.rimuovi}
                  onClick={() => onChange(items.filter((_, i) => i !== index))}
                >
                  <IconClose size={14} />
                </button>
              </Row>
            );
          })}
        </div>
      )}

      <Button size="sm" className="mt-3" onClick={() => onChange([...items, create()])}>
        + {addLabel}
      </Button>
    </Group>
  );
}

function replace<T>(items: readonly T[], index: number, next: T): T[] {
  const copy = items.slice();
  copy[index] = next;
  return copy;
}

function move<T>(items: readonly T[], from: number, to: number): T[] {
  if (to < 0 || to >= items.length) return items.slice();
  const copy = items.slice();
  const [moved] = copy.splice(from, 1);
  if (moved === undefined) return copy;
  copy.splice(to, 0, moved);
  return copy;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+/, "")
    .slice(0, 20);
}
