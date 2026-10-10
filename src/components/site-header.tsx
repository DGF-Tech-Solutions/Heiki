import Link from "next/link";
import { QuickSearch } from "@/components/quick-search";
import { auth, signOut } from "@/lib/auth";
import { can, roleLabel } from "@/lib/auth/permissions";
import { listGames } from "@/lib/games/catalog";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { unreadCount } from "@/lib/social/actions";
import { IconUser } from "./icons";
import { LanguageSwitch } from "./language-switch";
import { PopoverPanel } from "./popover-panel";
import { buttonClass, buttonColors, cx, Tag } from "./ui";

// Sul telefono i bottoni dell'intestazione si stringono: in maiuscolo e col
// taglio obliquo «Iscriviti» finiva fuori dallo schermo, nella barra che scorre
const PHONE = "max-sm:px-2 max-sm:text-[12px]";

// una voce del pannello dell'utente: come le voci della barra laterale
const MENU_VOCE =
  "p5-menu-item flex items-center px-3 py-2 font-display text-[14px] font-extrabold uppercase tracking-[0.02em] text-ink-2 [font-variation-settings:'wdth'_82]";

const TESTI = testi({
  it: {
    cerca: "Cerca",
    sezioni: "Sezioni del gioco",
    giochi: "Giochi",
    coda: "Coda",
    admin: "Admin",
    notifiche: "Notifiche",
    daLeggere: (n: number) => `Notifiche: ${n} da leggere`,
    personalizza: "Personalizza",
    profilo: "Il tuo profilo",
    menuDi: (nome: string) => `Menu di ${nome}`,
    esci: "Esci",
    entra: "Entra",
    iscriviti: "Iscriviti",
  },
  en: {
    cerca: "Search",
    sezioni: "Game sections",
    giochi: "Games",
    coda: "Queue",
    admin: "Admin",
    notifiche: "Notifications",
    daLeggere: (n: number) => `Notifications: ${n} unread`,
    personalizza: "Customize",
    profilo: "Your profile",
    menuDi: (nome: string) => `${nome}'s menu`,
    esci: "Log out",
    entra: "Log in",
    iscriviti: "Sign up",
  },
});

/**
 * L'intestazione conosce lo stato della sessione, quindi e' un componente
 * server. Se Auth.js non e' configurato non deve far fallire l'intera pagina:
 * si degrada allo stato disconnesso.
 */
export async function SiteHeader() {
  const session = await safeSession();
  const user = session?.user;
  const unread = user ? await safeUnread() : 0;
  const locale = await getLocale();
  const t = TESTI[locale];

  return (
    <header className="sticky top-0 z-20 border-b-[3px] border-brand bg-paper">
      <div className="mx-auto flex h-[58px] w-full max-w-shell items-center gap-2 px-4 sm:gap-6 sm:px-6">
        {/*
          Il menu del gioco sul telefono stava qui, in alto a sinistra: dal 10/10
          e' nella barra in basso (mobile-bar.tsx), dove arriva il pollice.
        */}

        {/* il marchio: GACHA in bianco, ZONE su una lama rossa tagliata */}
        <Link
          href="/"
          className="group flex shrink-0 items-center whitespace-nowrap font-display text-[17px] font-black sm:text-[22px] uppercase tracking-[-0.02em] [font-variation-settings:'wdth'_70]"
        >
          <span className="text-ink">Gacha</span>
          <span className="p5-cut ml-1 bg-brand px-1.5 text-white sm:px-2 transition-colors group-hover:bg-ink group-hover:text-paper">
            Zone
          </span>
        </Link>

        {/*
          La ricerca rapida (10/10): un pannello che trova mentre si scrive eroi,
          pagine, boss e artefatti, anche coi tasti «/» e Ctrl+K. Prima era un
          modulo verso /cerca, e sul telefono non c'era.
        */}
        <QuickSearch games={listGames().filter((game) => game.available).map((game) => game.slug)} />

        {/*
          Sul telefono questa riga sforava: a 390px chiedeva 12px in piu', e con
          lei tutta la pagina scorreva di lato, perche' una riga troppo larga
          allarga l'area visibile di ogni sezione. Sotto sm sparisce "Giochi",
          che porta alla stessa pagina del logo, e gli spazi si stringono.

          `min-w-0` e `overflow-x-auto` sono la rete: con un nome utente lungo, o
          i pulsanti in piu' di chi modera, a scorrere e' la barra e non la pagina.

          Dal 03/10, col pulsante del menu del gioco a sinistra, sotto sm non ci
          stanno piu' due pulsanti: chi non e' entrato vede «Entra» (la pagina di
          accesso porta all'iscrizione), chi e' entrato un pulsante che apre le
          sue voci in un pannello. Prima, da entrato, le cinque voci scorrevano
          dentro la barra e le ultime non si vedevano.
        */}
        <nav className="ml-auto flex min-w-0 items-center gap-2 overflow-x-auto py-1 text-sm font-medium whitespace-nowrap [scrollbar-width:none] sm:gap-5 md:ml-0">
          <Link href="/" className="hidden text-ink-2 hover:text-brand-deep sm:inline">
            {t.giochi}
          </Link>

          <LanguageSwitch />

          <span className="flex items-center gap-1 sm:gap-2.5 sm:border-l sm:border-rule sm:pl-5">
            {user ? (
              <>
                {/* sul telefono: un pulsante solo, col numero delle notifiche */}
                <span className="relative sm:hidden">
                  <button
                    type="button"
                    popoverTarget="menu-utente"
                    aria-label={unread > 0 ? `${t.menuDi(user.username)} · ${t.daLeggere(unread)}` : t.menuDi(user.username)}
                    className={cx("p5-cut grid h-8 w-10 cursor-pointer place-items-center", buttonColors("outline"))}
                  >
                    <IconUser size={17} />
                  </button>
                  {unread > 0 ? (
                    <span className="pointer-events-none absolute -top-1.5 -right-1.5 grid h-4 min-w-4 place-items-center bg-brand px-1 font-mono text-[11px] leading-none text-white">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  ) : null}
                </span>

                <span className="hidden sm:contents">
                  {/* Le aree riservate compaiono solo a chi le puo' aprire: un
                      collegamento visibile a tutti sarebbe una porta annunciata. */}
                  {can(user.role, "moderate") ? (
                    <Link
                      href="/moderazione"
                      className="font-display font-bold [font-variation-settings:'wdth'_82] text-[12px] uppercase tracking-[0.06em] text-hot hover:underline"
                    >
                      {t.coda}
                    </Link>
                  ) : null}
                  {can(user.role, "administer") ? (
                    <Link
                      href="/admin"
                      className="font-display font-bold [font-variation-settings:'wdth'_82] text-[12px] uppercase tracking-[0.06em] text-ink-3 hover:text-ink"
                    >
                      {t.admin}
                    </Link>
                  ) : null}

                  <Link
                    href="/notifiche"
                    className={cx(buttonClass("ghost", "sm"), "relative")}
                    aria-label={unread > 0 ? t.daLeggere(unread) : t.notifiche}
                  >
                    {t.notifiche}
                    {unread > 0 ? (
                      <span className="grid h-4 min-w-4 place-items-center bg-brand px-1 font-mono text-[11px] leading-none text-white">
                        {unread > 9 ? "9+" : unread}
                      </span>
                    ) : null}
                  </Link>
                  <Link href="/impostazioni/profilo" className={buttonClass("ghost", "sm")}>
                    {t.personalizza}
                  </Link>
                  <Link href={`/u/${user.username}`} className={buttonClass("ghost", "sm")}>
                    {user.username}
                    <Tag>{roleLabel(user.role, locale)}</Tag>
                  </Link>
                  <form action={esci}>
                    <button type="submit" className={buttonClass("ghost", "sm")}>
                      {t.esci}
                    </button>
                  </form>
                </span>
              </>
            ) : (
              <>
                <Link href="/entra" className={buttonClass("ghost", "sm", PHONE)}>
                  {t.entra}
                </Link>
                <Link href="/registrati" className={buttonClass("primary", "sm", cx(PHONE, "max-sm:hidden"))}>
                  {t.iscriviti}
                </Link>
              </>
            )}
          </span>
        </nav>
      </div>

      {user ? (
        // le voci di chi e' entrato, sul telefono: le stesse della riga qui sopra
        <PopoverPanel
          id="menu-utente"
          className="inset-auto top-[64px] right-3 m-0 w-[min(84vw,280px)] border-2 border-ink bg-paper p-0 text-ink shadow-[6px_6px_0_0_var(--color-brand)] backdrop:bg-black/50"
        >
          <div className="flex items-center gap-2 border-b border-rule px-4 py-3">
            <span className="min-w-0 truncate font-display text-[16px] font-extrabold">{user.username}</span>
            <Tag>{roleLabel(user.role, locale)}</Tag>
          </div>
          <ul className="m-0 grid list-none gap-0.5 p-2">
            <li>
              <Link href="/notifiche" className={MENU_VOCE}>
                {t.notifiche}
                {unread > 0 ? (
                  <span className="ml-2 inline-grid h-4 min-w-4 place-items-center bg-brand px-1 font-mono text-[11px] leading-none text-white">
                    {unread > 9 ? "9+" : unread}
                  </span>
                ) : null}
              </Link>
            </li>
            <li>
              <Link href={`/u/${user.username}`} className={MENU_VOCE}>
                {t.profilo}
              </Link>
            </li>
            <li>
              <Link href="/impostazioni/profilo" className={MENU_VOCE}>
                {t.personalizza}
              </Link>
            </li>
            {can(user.role, "moderate") ? (
              <li>
                <Link href="/moderazione" className={cx(MENU_VOCE, "text-hot")}>
                  {t.coda}
                </Link>
              </li>
            ) : null}
            {can(user.role, "administer") ? (
              <li>
                <Link href="/admin" className={MENU_VOCE}>
                  {t.admin}
                </Link>
              </li>
            ) : null}
          </ul>
          <form action={esci} className="border-t border-rule p-2">
            <button type="submit" className={cx(MENU_VOCE, "w-full cursor-pointer text-left")}>
              {t.esci}
            </button>
          </form>
        </PopoverPanel>
      ) : null}
    </header>
  );
}

async function esci() {
  "use server";
  await signOut({ redirectTo: "/" });
}

async function safeSession() {
  try {
    return await auth();
  } catch {
    return null;
  }
}

/** Il conteggio non deve poter far cadere l'intestazione di ogni pagina. */
async function safeUnread(): Promise<number> {
  try {
    return await unreadCount();
  } catch {
    return 0;
  }
}
