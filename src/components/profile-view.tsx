/**
 * La schermata del profilo, come presentazione pura.
 *
 * Non sa da dove arrivano i dati: la pagina pubblica glieli passa dal database,
 * l'editor glieli passa dal proprio stato React a ogni battuta di tasto. Un solo
 * componente per entrambi, cosi' l'anteprima dal vivo non e' un'approssimazione
 * della pagina vera: e' la pagina vera.
 *
 * Per lo stesso motivo la lingua arriva come prop e non da un hook: il
 * componente gira sia sul server (pagina pubblica) sia nel browser (editor).
 *
 * Dall'11/10 la testata e' il palco dell'eroe in copertina (il primo dei
 * preferiti), lo stesso della scheda eroe, con l'accento del profilo nel filo
 * sotto la fascia. Tolti livello ed esperienza (non li assegnava niente: tutti
 * erano «Livello 1, 0 XP») e le build pubbliche con la «mediana» del danno,
 * avanzo del motore tolto il 27/09. I badge compaiono solo a chi ne ha: prima la
 * vetrina vuota diceva a tutti di collegare un account per sbloccarli, e non
 * era vero.
 */

import Link from "next/link";
import type { ReactNode } from "react";
import { HeroStage, type StageBadge } from "@/components/heroes/hero-stage";
import { roleLabel, type Role } from "@/lib/auth/permissions";
import { heroCardSrc } from "@/lib/games/heroes";
import { intlLocale, testi, type Locale } from "@/lib/i18n/locale";
import {
  BADGE_SHOWCASE_LIMIT,
  DEFAULT_CUSTOMIZATION,
  type ProfileCustomization,
} from "@/lib/profile/customization";
import { FAVORITES_LIMIT } from "@/lib/profile/favorites";
import type { ProfileCover, ProfileFavoriteHero } from "@/lib/profile/favorite-heroes";
import {
  cx,
  display,
  Empty,
  eyebrow,
  heroEpithetClass,
  heroNameClass,
  numeric,
  SectionHead,
  Stat,
  StatGrid,
  Tag,
} from "./ui";

export type BadgeTrust = "VERIFIED" | "IMPORTED" | "DECLARED";

export interface ProfileBadge {
  id: string;
  name: string;
  description?: string | null;
  trust: BadgeTrust;
  icon?: string | null;
  /** false = posseduto ma non esposto in vetrina */
  shown?: boolean;
}

export interface ProfileGameAccount {
  id: string;
  game: string;
  uid: string;
  nickname?: string | null;
  trust: BadgeTrust;
  shown?: boolean;
  /** il server, gia' nella lingua di chi legge */
  server?: string | null;
  /** la classe di combattimento dell'account dichiarata, e l'ultima verificata con la data */
  power?: number | null;
  verifiedPower?: number | null;
  verifiedAt?: string | null;
}

/** Li conta il caricamento: l'editor non li tocca, l'anteprima li ripete. */
export interface ProfileStats {
  followers: number;
  following: number;
  /** post pubblicati e non nascosti */
  posts: number;
}

export interface ProfileViewData {
  username: string;
  displayName: string;
  role: Role;
  bio?: string | null;
  country?: string | null;
  /** l'iscrizione, in ISO */
  memberSince?: string | null;
  stats?: ProfileStats | null;
  /** i preferiti come si salvano, `<gioco>:<id>` nell'ordine scelto: e' cio' che l'editor modifica */
  favorites: readonly string[];
  /** gli stessi risolti nel roster, nella lingua di chi legge (resolveFavorites) */
  favoriteHeroes: readonly ProfileFavoriteHero[];
  /** il primo preferito, sul palco della testata */
  cover?: ProfileCover | null;
  badges: readonly ProfileBadge[];
  gameAccounts: readonly ProfileGameAccount[];
  customization?: ProfileCustomization;
}

const TESTI = testi({
  it: {
    fiducia: {
      VERIFIED: "verificato",
      IMPORTED: "importato",
      DECLARED: "dichiarato",
    } satisfies Record<BadgeTrust, string>,
    membroDa: (quando: string) => `Membro da ${quando}`,
    seguaci: "Seguaci",
    segue: "Segue",
    post: "Post pubblicati",
    classe: "Classe dell'account",
    eroiPreferiti: "Eroi preferiti",
    preferitiVuoti: `Nessun eroe preferito. In «Modifica profilo» ne scegli fino a ${FAVORITES_LIMIT}: il primo va in copertina.`,
    badge: "Badge",
    verificatiSu: (verificati: number, totale: number) => `${verificati} verificati su ${totale}`,
    accountDiGioco: "Account di gioco",
    soloCodiciPubblici: "solo dati pubblici",
    nessunAccount: "Nessun account di gioco. Si collega dalla pagina «Il mio account» del gioco.",
    codiceAmico: "Codice amico",
    verificataIl: (quando: string) => `verificata il ${quando}`,
    dichiarata: "dichiarata",
    verificataPrima: (n: string, quando: string) => `verificata ${n} il ${quando}`,
  },
  en: {
    fiducia: {
      VERIFIED: "verified",
      IMPORTED: "imported",
      DECLARED: "declared",
    },
    membroDa: (quando: string) => `Member since ${quando}`,
    seguaci: "Followers",
    segue: "Following",
    post: "Published posts",
    classe: "Account Combat Class",
    eroiPreferiti: "Favorite heroes",
    preferitiVuoti: `No favorite heroes. In «Edit profile» you can pick up to ${FAVORITES_LIMIT}: the first one becomes your cover.`,
    badge: "Badges",
    verificatiSu: (verificati: number, totale: number) => `${verificati} verified out of ${totale}`,
    accountDiGioco: "Game accounts",
    soloCodiciPubblici: "public data only",
    nessunAccount: "No game accounts. Link one from the game's «My account» page.",
    codiceAmico: "Friend Code",
    verificataIl: (quando: string) => `verified on ${quando}`,
    dichiarata: "declared",
    verificataPrima: (n: string, quando: string) => `verified ${n} on ${quando}`,
  },
});

/**
 * Le date in UTC: la vista si disegna sul server e poi, nell'editor, anche nel
 * browser. Col fuso di ciascuno, un'iscrizione dell'ultima sera del mese
 * cambierebbe mese fra i due e React segnalerebbe la differenza.
 */
function formatDay(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleDateString(intlLocale(locale), { timeZone: "UTC" });
}

function formatMonth(iso: string, locale: Locale): string {
  return new Date(iso).toLocaleDateString(intlLocale(locale), { month: "long", year: "numeric", timeZone: "UTC" });
}

/**
 * La classe dell'account sotto il nome del gioco: il numero verificato con la sua
 * data, o quello dichiarato (e l'ultimo verificato, se diverso).
 */
function AccountPower({ account, locale }: { account: ProfileGameAccount; locale: Locale }) {
  const t = TESTI[locale];
  const numberLocale = intlLocale(locale);
  const power = account.power ?? account.verifiedPower ?? null;
  if (!power) return null;
  const when = account.verifiedAt ? formatDay(account.verifiedAt, locale) : null;
  const verifiedNow = account.verifiedPower === power && when;
  return (
    <p className="m-0 mt-2.5 border-t border-rule-2 pt-2.5 text-xs text-ink-2">
      {t.classe}: <span className={cx(numeric, "text-[13px] text-ink")}>{power.toLocaleString(numberLocale)}</span>
      {verifiedNow ? (
        <span className="text-ink-3"> · {t.verificataIl(when)}</span>
      ) : (
        <span className="text-ink-3">
          {" "}
          · {t.dichiarata}
          {account.verifiedPower && when ? ` · ${t.verificataPrima(account.verifiedPower.toLocaleString(numberLocale), when)}` : ""}
        </span>
      )}
    </p>
  );
}

/**
 * La classe da mettere fra i numeri della testata: la verificata piu' alta se
 * ce n'e' una, se no la dichiarata piu' alta. Il dettaglio (quale account, da
 * quando) sta nelle card degli account.
 */
function accountClass(accounts: readonly ProfileGameAccount[]): number | null {
  const best = (pick: (account: ProfileGameAccount) => number | null | undefined) =>
    Math.max(0, ...accounts.map((account) => pick(account) ?? 0));
  return best((account) => account.verifiedPower) || best((account) => account.power) || null;
}

export function ProfileView({
  data,
  locale = "it",
  owner = false,
  actions,
  headingLevel = "h1",
  priority = false,
}: {
  data: ProfileViewData;
  locale?: Locale;
  /** chi guarda e' il proprietario: le sezioni vuote dicono come riempirle invece di sparire */
  owner?: boolean;
  /** i comandi accanto al nome (Segui) */
  actions?: ReactNode;
  /** nelle impostazioni il titolo della pagina e' gia' «Il tuo account» */
  headingLevel?: "h1" | "h2";
  /** la copertina e' la prima cosa della pagina: si carica subito */
  priority?: boolean;
}) {
  const t = TESTI[locale];
  const numberLocale = intlLocale(locale);
  const custom = data.customization ?? DEFAULT_CUSTOMIZATION;

  const shownBadges = data.badges.filter((b) => b.shown !== false).slice(0, BADGE_SHOWCASE_LIMIT);
  const shownAccounts = data.gameAccounts.filter((a) => a.shown !== false);
  const verified = shownBadges.filter((b) => b.trust === "VERIFIED").length;
  const power = accountClass(shownAccounts);

  const compact = custom.layout === "compact";
  const editorial = custom.layout === "editorial";
  const sectionPad = compact ? "pt-8" : "pt-11";

  const name = data.displayName || data.username;
  const role = roleLabel(data.role, locale);
  const since = data.memberSince ? t.membroDa(formatMonth(data.memberSince, locale)) : null;
  const Heading = headingLevel;
  const cover = data.cover;

  const stageBadges: StageBadge[] = [{ label: role }];
  if (data.country) stageBadges.push({ label: data.country });

  return (
    <div
      className="profile-canvas relative isolate"
      data-accent={custom.accent}
      data-frame={custom.frame}
      data-background={custom.background}
      data-layout={custom.layout}
      data-cover={cover ? "" : undefined}
    >
      {cover ? (
        <header className="profile-frame relative">
          <HeroStage
            game={cover.game}
            hero={cover.hero}
            locale={locale}
            size="hero"
            priority={priority}
            headingLevel={Heading}
            plate={{ kicker: `@${data.username}`, title: name }}
            art={cover.art}
            // il filo sotto la fascia nell'accento del profilo: e' dentro `data-accent`, qui sopra
            tint="var(--accent)"
            badges={stageBadges}
          >
            {since || actions ? (
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
                {since ? <p className="m-0 text-[13px] font-semibold text-ink-2">{since}</p> : null}
                {actions}
              </div>
            ) : null}
          </HeroStage>
        </header>
      ) : (
        // senza copertina: l'iniziale su un blocco nell'accento, e la cornice attorno a lei
        <header className="flex flex-wrap items-end gap-5 border-b-2 border-[var(--accent)] pb-5">
          <div
            className={cx(
              "profile-frame relative grid flex-none place-items-center font-display font-black uppercase",
              compact ? "size-14 text-2xl" : editorial ? "size-24 text-5xl" : "size-[76px] text-4xl",
            )}
            style={{ background: "var(--accent)", color: "var(--accent-fg, #fff)" }}
            aria-hidden
          >
            {name.slice(0, 1)}
          </div>

          <div className="min-w-0 flex-1 basis-60">
            <Heading
              className={cx(
                display,
                "wrap-break-word",
                compact ? "text-[26px]" : editorial ? "text-[clamp(34px,6vw,60px)]" : "text-[clamp(30px,4.5vw,40px)]",
              )}
            >
              {name}
            </Heading>

            <p className="m-0 mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[13px] text-ink-3">
              <span className="font-mono">@{data.username}</span>
              <Tag tone="accent">{role}</Tag>
              {data.country ? <span>{data.country}</span> : null}
              {since ? <span>{since}</span> : null}
            </p>
          </div>

          {actions ? <div className="flex-none">{actions}</div> : null}
        </header>
      )}

      {data.bio ? (
        <p
          className={cx(
            "mt-6 whitespace-pre-line text-ink-2",
            editorial ? "max-w-[72ch] text-lg" : "max-w-[60ch] text-base",
          )}
        >
          {data.bio}
        </p>
      ) : null}

      {data.stats ? (
        <StatGrid className="mt-6">
          <Stat label={t.seguaci} value={data.stats.followers.toLocaleString(numberLocale)} />
          <Stat label={t.segue} value={data.stats.following.toLocaleString(numberLocale)} />
          <Stat label={t.post} value={data.stats.posts.toLocaleString(numberLocale)} />
          <Stat label={t.classe} value={power ? power.toLocaleString(numberLocale) : "—"} />
        </StatGrid>
      ) : null}

      {data.favoriteHeroes.length > 0 || owner ? (
        <section className={sectionPad}>
          <SectionHead title={t.eroiPreferiti} />
          {data.favoriteHeroes.length === 0 ? (
            <Empty>{t.preferitiVuoti}</Empty>
          ) : (
            // le card della griglia Eroi, con lo stesso passaggio del mouse (.hero-card in globals.css)
            <ul
              className="m-0 grid list-none gap-x-3 gap-y-4 p-0"
              style={{ gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))" }}
            >
              {data.favoriteHeroes.map((hero) => (
                <li key={hero.key} className="min-w-0">
                  <Link
                    href={hero.href}
                    className="hero-card group block focus-visible:outline-2 focus-visible:outline-offset-2"
                  >
                    <span className="hero-card-art relative block">
                      {/* come nella griglia: grafica a 128px esatti, gia' in due densita' */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={heroCardSrc(hero.game, hero.id)}
                        srcSet={`${heroCardSrc(hero.game, hero.id)} 1x, ${heroCardSrc(hero.game, hero.id, 2)} 2x`}
                        alt=""
                        width={128}
                        height={128}
                        loading="lazy"
                        decoding="async"
                        className="block aspect-square w-full bg-paper-2"
                      />
                    </span>
                    <span className="mt-1.5 block">
                      <span className={heroEpithetClass} title={hero.epithet}>
                        {hero.epithet}
                      </span>
                      <span className={cx(heroNameClass, "mt-0.5")} title={hero.name}>
                        {hero.name}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {shownAccounts.length > 0 || owner ? (
        <section className={sectionPad}>
          <SectionHead
            title={t.accountDiGioco}
            aside={<span className={eyebrow}>{t.soloCodiciPubblici}</span>}
          />

          {shownAccounts.length === 0 ? (
            <Empty>{t.nessunAccount}</Empty>
          ) : (
            <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2">
              {shownAccounts.map((account) => (
                <li key={account.id} className="p5-corner min-w-0 border border-rule bg-paper-2 py-3.5 pr-6 pl-4">
                  <p className="m-0 flex flex-wrap items-center gap-2">
                    <span className={eyebrow}>{account.game}</span>
                    <Tag tone={account.trust === "VERIFIED" ? "accent" : "neutral"}>{t.fiducia[account.trust]}</Tag>
                  </p>
                  <p className={cx(display, "m-0 mt-2 text-[22px] wrap-break-word")}>
                    {account.nickname || "—"}
                  </p>
                  <p className="m-0 mt-1.5 flex flex-wrap gap-x-2.5 text-[13px] text-ink-3">
                    {account.server ? <span>{account.server}</span> : null}
                    {account.uid ? (
                      <span title={t.codiceAmico}>
                        <span className="sr-only">{t.codiceAmico} </span>
                        <span className={numeric}>#{account.uid}</span>
                      </span>
                    ) : null}
                  </p>
                  <AccountPower account={account} locale={locale} />
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}

      {shownBadges.length > 0 ? (
        <section className={sectionPad}>
          <SectionHead
            title={t.badge}
            aside={<span className={eyebrow}>{t.verificatiSu(verified, shownBadges.length)}</span>}
          />
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {shownBadges.map((badge) => {
              const isVerified = badge.trust === "VERIFIED";
              return (
                <li
                  key={badge.id}
                  title={badge.description ?? undefined}
                  className={cx(
                    "p5-corner flex items-center gap-2.5 border py-2 pr-5 pl-2.5",
                    isVerified ? "border-[var(--accent)] bg-paper-2" : "border-rule bg-paper-2",
                  )}
                >
                  <span
                    className={cx(
                      "grid size-6.5 flex-none place-items-center text-[13px]",
                      isVerified ? "" : "bg-paper-3 text-ink-3",
                    )}
                    style={isVerified ? { background: "var(--accent)", color: "var(--accent-fg, #fff)" } : undefined}
                    aria-hidden
                  >
                    {badge.icon ?? (isVerified ? "✦" : "◇")}
                  </span>
                  <span>
                    <span className="block text-[13px] leading-tight font-semibold">{badge.name}</span>
                    <span className={cx(eyebrow, isVerified && "text-ink-2")}>{t.fiducia[badge.trust]}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
