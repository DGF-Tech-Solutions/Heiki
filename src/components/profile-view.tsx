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
 */

import { roleLabel, type Role } from "@/lib/auth/permissions";
import { intlLocale, testi, type Locale } from "@/lib/i18n/locale";
import { levelProgress } from "@/lib/profile/level";
import {
  BADGE_SHOWCASE_LIMIT,
  DEFAULT_CUSTOMIZATION,
  type ProfileCustomization,
} from "@/lib/profile/customization";
import { IconHeart } from "./icons";
import { cx, display, Empty, eyebrow, numeric, SectionHead, Stat, StatGrid, Tag } from "./ui";

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

export interface ProfileBuild {
  id: string;
  name: string;
  game: string;
  character: string;
  median: number;
  patch: string;
  isPublic?: boolean;
}

export interface ProfileViewData {
  username: string;
  displayName: string;
  role: Role;
  bio?: string | null;
  country?: string | null;
  xp: number;
  favorites: readonly string[];
  badges: readonly ProfileBadge[];
  gameAccounts: readonly ProfileGameAccount[];
  builds: readonly ProfileBuild[];
  customization?: ProfileCustomization;
}

const TESTI = testi({
  it: {
    fiducia: {
      VERIFIED: "verificato",
      IMPORTED: "importato",
      DECLARED: "dichiarato",
    } satisfies Record<BadgeTrust, string>,
    livello: (n: number) => `Livello ${n}`,
    livelloMassimo: "livello massimo",
    alProssimo: (xp: string, mancano: number) => `${xp} XP · ${mancano} al prossimo`,
    badgeVerificati: "Badge verificati",
    buildPubbliche: "Build pubbliche",
    profiliCollegati: "Profili collegati",
    esperienza: "Esperienza",
    preferiti: "Preferiti",
    badge: "Badge",
    verificatiSu: (verificati: number, totale: number) => `${verificati} verificati su ${totale}`,
    vetrinaVuota: "Vetrina vuota. Collega un profilo di gioco per sbloccare i badge verificati.",
    profiliDiGioco: "Profili di gioco",
    soloUidPubblici: "solo UID pubblici",
    nessunProfilo: "Nessun profilo collegato.",
    condivise: (n: number) => `${n} condivise`,
    nessunaBuild: "Nessuna build pubblica.",
    mediana: "mediana",
    classe: "Classe dell'account",
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
    livello: (n: number) => `Level ${n}`,
    livelloMassimo: "max level",
    alProssimo: (xp: string, mancano: number) => `${xp} XP · ${mancano} to next`,
    badgeVerificati: "Verified badges",
    buildPubbliche: "Public builds",
    profiliCollegati: "Linked profiles",
    esperienza: "Experience",
    preferiti: "Favorites",
    badge: "Badges",
    verificatiSu: (verificati: number, totale: number) => `${verificati} verified out of ${totale}`,
    vetrinaVuota: "Empty showcase. Link a game profile to unlock verified badges.",
    profiliDiGioco: "Game profiles",
    soloUidPubblici: "public UIDs only",
    nessunProfilo: "No linked profiles.",
    condivise: (n: number) => `${n} shared`,
    nessunaBuild: "No public builds.",
    mediana: "median",
    classe: "Account Combat Class",
    verificataIl: (quando: string) => `verified on ${quando}`,
    dichiarata: "declared",
    verificataPrima: (n: string, quando: string) => `verified ${n} on ${quando}`,
  },
});

/**
 * La classe dell'account sotto il nome del gioco: il numero verificato con la sua
 * data, o quello dichiarato (e l'ultimo verificato, se diverso).
 */
function AccountPower({ account, locale }: { account: ProfileGameAccount; locale: Locale }) {
  const t = TESTI[locale];
  const numberLocale = intlLocale(locale);
  const power = account.power ?? account.verifiedPower ?? null;
  if (!power) return null;
  const when = account.verifiedAt ? new Date(account.verifiedAt).toLocaleDateString(numberLocale) : null;
  const verifiedNow = account.verifiedPower === power && when;
  return (
    <span className="mt-0.5 block text-xs text-ink-2">
      {t.classe}: <span className={cx(numeric, "text-ink")}>{power.toLocaleString(numberLocale)}</span>
      {verifiedNow ? (
        <span className="text-ink-3"> · {t.verificataIl(when)}</span>
      ) : (
        <span className="text-ink-3">
          {" "}
          · {t.dichiarata}
          {account.verifiedPower && when ? ` · ${t.verificataPrima(account.verifiedPower.toLocaleString(numberLocale), when)}` : ""}
        </span>
      )}
    </span>
  );
}

export function ProfileView({ data, locale = "it" }: { data: ProfileViewData; locale?: Locale }) {
  const t = TESTI[locale];
  const numberLocale = intlLocale(locale);
  const custom = data.customization ?? DEFAULT_CUSTOMIZATION;
  const progress = levelProgress(data.xp);

  const shownBadges = data.badges.filter((b) => b.shown !== false).slice(0, BADGE_SHOWCASE_LIMIT);
  const shownAccounts = data.gameAccounts.filter((a) => a.shown !== false);
  const publicBuilds = data.builds.filter((b) => b.isPublic !== false);
  const verified = shownBadges.filter((b) => b.trust === "VERIFIED").length;

  const compact = custom.layout === "compact";
  const editorial = custom.layout === "editorial";

  return (
    <div
      className="profile-canvas relative isolate"
      data-accent={custom.accent}
      data-frame={custom.frame}
      data-background={custom.background}
      data-layout={custom.layout}
    >
      <header className="flex flex-wrap items-end gap-5 border-b-2 border-ink pb-5">
        <div
          className={cx(
            "avatar relative grid flex-none place-items-center rounded-card font-display font-extrabold text-white",
            compact ? "size-14 text-2xl" : editorial ? "size-24 text-4xl" : "size-[72px] text-[32px]",
          )}
          style={{ background: "var(--accent)" }}
          aria-hidden
        >
          {(data.displayName || data.username || "?").slice(0, 1).toUpperCase()}
        </div>

        <div className="min-w-0">
          <h1
            className={cx(
              display,
              "profile__name",
              compact ? "text-2xl" : editorial ? "text-[clamp(30px,5vw,46px)]" : "text-[32px]",
            )}
          >
            {data.displayName || data.username}
          </h1>

          <p className="m-0 mt-1.5 flex flex-wrap items-center gap-2 font-mono text-[13px] text-ink-3">
            @{data.username}
            <Tag tone="accent">{roleLabel(data.role, locale)}</Tag>
            {data.country ? <span>{data.country}</span> : null}
          </p>
        </div>

        <div className="ml-auto text-right">
          <span className={eyebrow}>{t.livello(progress.level)}</span>
          <span className="mt-1.5 block h-1.5 w-[170px] overflow-hidden bg-paper-3">
            <span
              className="block h-full"
              style={{ width: `${Math.round(progress.ratio * 100)}%`, background: "var(--accent)" }}
            />
          </span>
          <span className={cx(numeric, "text-[12px] text-ink-3")}>
            {progress.maxed
              ? t.livelloMassimo
              : t.alProssimo(data.xp.toLocaleString(numberLocale), progress.needed - progress.current)}
          </span>
        </div>
      </header>

      {data.bio ? (
        <p
          className={cx(
            "mt-6 whitespace-pre-line text-ink-2",
            editorial ? "max-w-[72ch] text-lg" : "max-w-[48ch] text-base",
          )}
        >
          {data.bio}
        </p>
      ) : null}

      <StatGrid className="mt-6">
        <Stat label={t.badgeVerificati} value={verified} />
        <Stat label={t.buildPubbliche} value={publicBuilds.length} />
        <Stat label={t.profiliCollegati} value={shownAccounts.length} />
        <Stat label={t.esperienza} value={data.xp.toLocaleString(numberLocale)} />
      </StatGrid>

      {data.favorites.length > 0 ? (
        <section className={compact ? "py-8" : "py-11"}>
          <SectionHead title={t.preferiti} />
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {data.favorites.map((name) => (
              <li
                key={name}
                className="flex items-center gap-2.5 rounded-card border border-rule bg-paper py-2 pr-3 pl-2.5"
              >
                <span
                  className="grid size-6.5 flex-none place-items-center text-white"
                  style={{ background: "var(--accent)" }}
                  aria-hidden
                >
                  <IconHeart size={13} />
                </span>
                <span className="text-[13px] font-semibold">{name}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className={compact ? "py-8" : "py-11"}>
        <SectionHead
          title={t.badge}
          aside={<span className={eyebrow}>{t.verificatiSu(verified, shownBadges.length)}</span>}
        />

        {shownBadges.length === 0 ? (
          <Empty>{t.vetrinaVuota}</Empty>
        ) : (
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {shownBadges.map((badge) => {
              const isVerified = badge.trust === "VERIFIED";
              return (
                <li
                  key={badge.id}
                  title={badge.description ?? undefined}
                  className={cx(
                    "flex items-center gap-2.5 rounded-card border py-2 pr-3 pl-2.5",
                    isVerified ? "border-[var(--accent)] bg-paper" : "border-rule bg-paper-2",
                  )}
                >
                  <span
                    className={cx(
                      "grid size-6.5 flex-none place-items-center text-[13px]",
                      isVerified ? "text-white" : "bg-paper-3 text-ink-3",
                    )}
                    style={isVerified ? { background: "var(--accent)" } : undefined}
                    aria-hidden
                  >
                    {badge.icon ?? (isVerified ? "✦" : "◇")}
                  </span>
                  <span>
                    <span className="block text-[13px] leading-tight font-semibold">
                      {badge.name}
                    </span>
                    <span
                      className={cx(
                        "font-display font-bold [font-variation-settings:'wdth'_82] text-[12px] uppercase tracking-[0.06em]",
                        isVerified ? "font-medium text-[var(--accent)]" : "text-ink-3",
                      )}
                    >
                      {t.fiducia[badge.trust]}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className={compact ? "py-8" : "py-11"}>
        <SectionHead
          title={t.profiliDiGioco}
          aside={<span className={eyebrow}>{t.soloUidPubblici}</span>}
        />

        {shownAccounts.length === 0 ? (
          <Empty>{t.nessunProfilo}</Empty>
        ) : (
          <ul className="m-0 list-none overflow-hidden rounded-card border border-rule p-0">
            {shownAccounts.map((account, index) => (
              <li
                key={account.id}
                className={cx(
                  "flex flex-wrap items-center gap-3.5 bg-paper px-4 py-3.5",
                  index > 0 && "border-t border-rule-2",
                )}
              >
                <span className="flex-1 basis-56 text-sm">
                  <strong>{account.game}</strong>
                  {account.nickname ? (
                    <span className="text-ink-3"> · {account.nickname}</span>
                  ) : null}
                  {account.server ? <span className="text-ink-3"> · {account.server}</span> : null}
                  <AccountPower account={account} locale={locale} />
                </span>
                {account.uid ? <span className={cx(numeric, "text-xs text-ink-3")}>#{account.uid}</span> : null}
                <Tag tone={account.trust === "VERIFIED" ? "accent" : "neutral"}>
                  {t.fiducia[account.trust]}
                </Tag>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className={compact ? "pt-8" : "pt-11"}>
        <SectionHead
          title={t.buildPubbliche}
          aside={<span className={eyebrow}>{t.condivise(publicBuilds.length)}</span>}
        />

        {publicBuilds.length === 0 ? (
          <Empty>{t.nessunaBuild}</Empty>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {publicBuilds.map((build) => (
              <article key={build.id} className="rounded-card border border-rule bg-paper p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className={cx(display, "text-base [font-variation-settings:'wdth'_92]")}>
                    {build.name}
                  </h3>
                  <Tag>{build.patch}</Tag>
                </div>
                <p className={cx(numeric, "m-0 mt-2 text-xs text-ink-3")}>
                  {build.game} · {build.character}
                </p>
                <p className={cx(numeric, "m-0 mt-3 text-xl font-medium tracking-[-0.02em]")}>
                  {Math.round(build.median).toLocaleString(numberLocale)}
                  <span className="ml-1.5 font-display font-bold [font-variation-settings:'wdth'_82] text-[12px] tracking-normal text-ink-3 uppercase">
                    {t.mediana}
                  </span>
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
