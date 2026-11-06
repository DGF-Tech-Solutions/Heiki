import Link from "next/link";
import { HeaderGame } from "@/components/header-game";
import { QuickSearch } from "@/components/quick-search";
import { auth, signOut } from "@/lib/auth";
import { can, roleLabel } from "@/lib/auth/permissions";
import { listGames } from "@/lib/games/catalog";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { unreadCount } from "@/lib/social/server";
import { getTheme } from "@/lib/theme/server";
import { IconBell, IconChevronDown, IconUser } from "./icons";
import { LanguageSwitch } from "./language-switch";
import { PopoverPanel } from "./popover-panel";
import { ThemeSwitch } from "./theme-switch";
import { buttonClass, buttonColors, cx, Tag } from "./ui";

// Sul telefono i bottoni dell'intestazione si stringono: in maiuscolo e col
// taglio obliquo «Iscriviti» finiva fuori dallo schermo, nella barra che scorre
const PHONE = "max-sm:px-2 max-sm:text-[12px]";

// una voce del pannello dell'utente: come le voci della barra laterale.
// `hover:text-on-plate` qui e non solo in globals.css: l'utility del colore di
// riposo scavalca .p5-menu-item, e al passaggio il testo chiaro restava sulla
// lama bianca (visto l'11/10). La lama e' la «targa» del tema (`plate`)
const MENU_VOCE =
  "p5-menu-item flex items-center px-3 py-2 font-display text-[14px] font-extrabold uppercase tracking-[0.02em] text-ink-2 hover:text-on-plate [font-variation-settings:'wdth'_82]";

const TESTI = testi({
  it: {
    cerca: "Cerca",
    sezioni: "Sezioni del gioco",
    coda: "Coda",
    admin: "Admin",
    notifiche: "Notifiche",
    daLeggere: (n: number) => `Notifiche: ${n} da leggere`,
    personalizza: "Personalizza il profilo",
    profilo: "Il tuo profilo",
    profiloOspite: "Il tuo profilo: account di gioco e box, salvati in questo browser",
    paginaPubblica: "La tua pagina pubblica",
    impostazioni: "Impostazioni dell'account",
    menuDi: (nome: string) => `Menu di ${nome}`,
    esci: "Esci",
    entra: "Entra",
    iscriviti: "Iscriviti",
  },
  en: {
    cerca: "Search",
    sezioni: "Game sections",
    coda: "Queue",
    admin: "Admin",
    notifiche: "Notifications",
    daLeggere: (n: number) => `Notifications: ${n} unread`,
    personalizza: "Customize your profile",
    profilo: "Your profile",
    profiloOspite: "Your profile: game account and box, saved in this browser",
    paginaPubblica: "Your public page",
    impostazioni: "Account settings",
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
  const theme = await getTheme();
  const t = TESTI[locale];
  const playable = listGames().filter((game) => game.available);

  return (
    <header className="sticky top-0 z-20 border-b-[3px] border-mark bg-paper">
      <div className="mx-auto flex h-[58px] w-full max-w-shell items-center gap-2 px-4 sm:gap-6 sm:px-6">
        {/*
          Il menu del gioco sul telefono stava qui, in alto a sinistra: dal 10/10
          e' nella barra in basso (mobile-bar.tsx), dove arriva il pollice.
        */}

        {/* il marchio: HEI in bianco/ink, KI su una lama rossa tagliata */}
        <Link
          href="/"
          className="group flex shrink-0 items-center whitespace-nowrap font-display text-[17px] font-black sm:text-[22px] uppercase tracking-[-0.02em] [font-variation-settings:'wdth'_70]"
        >
          <span className="text-ink">Hei</span>
          <span className="p5-cut ml-0.5 bg-brand px-1.5 text-on-brand sm:px-2 transition-colors group-hover:bg-plate group-hover:text-on-plate">
            ki
          </span>
        </Link>

        {/* il gioco in cui sei, nelle sue pagine: prima era una striscia sotto l'intestazione (24/10) */}
        <HeaderGame games={playable.map((game) => ({ slug: game.slug, name: game.shortName }))} />

        {/*
          La ricerca rapida (10/10): un pannello che trova mentre si scrive eroi,
          pagine, boss e artefatti, anche coi tasti «/» e Ctrl+K. Prima era un
          modulo verso /cerca, e sul telefono non c'era.
        */}
        <QuickSearch games={playable.map((game) => game.slug)} />

        {/*
          Sul telefono questa riga sforava: a 390px chiedeva 12px in piu', e con
          lei tutta la pagina scorreva di lato, perche' una riga troppo larga
          allarga l'area visibile di ogni sezione. Gli spazi sotto sm si
          stringono. «Giochi» non c'e' piu' dal 24/10: portava alla stessa pagina
          del marchio, e i giochi sono uno solo.

          `min-w-0` e `overflow-x-auto` sono la rete: con un nome utente lungo, o
          i pulsanti in piu' di chi modera, a scorrere e' la barra e non la pagina.

          Dal 03/10, col pulsante del menu del gioco a sinistra, sotto sm non ci
          stanno piu' due pulsanti: chi non e' entrato vede «Entra» (la pagina di
          accesso porta all'iscrizione), chi e' entrato un pulsante che apre le
          sue voci in un pannello. Prima, da entrato, le cinque voci scorrevano
          dentro la barra e le ultime non si vedevano.
        */}
        <nav className="ml-auto flex min-w-0 items-center gap-2 overflow-x-auto py-1 text-sm font-medium whitespace-nowrap [scrollbar-width:none] sm:gap-5 md:ml-0">
          {/* tema e lingua, vicini: sono le due scelte di chi legge, non dell'account */}
          <span className="flex shrink-0 items-center gap-1.5">
            <ThemeSwitch current={theme} />
            <LanguageSwitch />
          </span>

          <span className="flex items-center gap-1 sm:gap-2.5 sm:border-l sm:border-rule sm:pl-5">
            {user ? (
              <>
                {/* le notifiche a un colpo: la campana col numero, da 640px; sul telefono stanno nel menu */}
                <Link
                  href="/notifiche"
                  aria-label={unread > 0 ? t.daLeggere(unread) : t.notifiche}
                  title={unread > 0 ? t.daLeggere(unread) : t.notifiche}
                  className="relative grid h-8 w-9 shrink-0 place-items-center text-ink-3 transition-colors after:absolute after:inset-x-0 after:-inset-y-1.5 after:content-[''] hover:text-ink max-sm:hidden"
                >
                  <IconBell size={18} />
                  {unread > 0 ? (
                    <span className="pointer-events-none absolute -top-1 -right-1 grid h-4 min-w-4 place-items-center bg-brand px-1 font-mono text-[11px] leading-none text-on-brand">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  ) : null}
                </Link>
                {/*
                  Il menu dell'utente (25/10): il profilo del sito, la pagina
                  pubblica, le impostazioni. Prima, sul computer, erano cinque
                  pulsanti in fila (Coda, Notifiche, Personalizza, il nome, Esci);
                  i siti studiati (HoYoLAB, Enka, op.gg) tengono tutto dietro un
                  pulsante solo, ed e' li' che si cerca il profilo.
                */}
                <span className="relative">
                  <button
                    type="button"
                    popoverTarget="menu-utente"
                    aria-label={unread > 0 ? `${t.menuDi(user.username)} · ${t.daLeggere(unread)}` : t.menuDi(user.username)}
                    className={cx("p5-cut flex h-8 cursor-pointer items-center gap-2 px-2.5", buttonColors("outline"))}
                  >
                    <IconUser size={16} />
                    <span className="max-w-[14ch] truncate font-display text-[13px] font-extrabold uppercase [font-variation-settings:'wdth'_85] max-sm:hidden">
                      {user.username}
                    </span>
                    <IconChevronDown size={12} className="max-sm:hidden" />
                  </button>
                  {unread > 0 ? (
                    <span className="pointer-events-none absolute -top-1.5 -right-1.5 grid h-4 min-w-4 place-items-center bg-brand px-1 font-mono text-[11px] leading-none text-on-brand sm:hidden">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  ) : null}
                </span>
              </>
            ) : (
              <>
                {/*
                  Il profilo anche a chi non e' entrato (25/10): account di gioco
                  e box funzionano gia' nel browser, e /profilo li raccoglie per
                  tutti i giochi. Prima ci si arrivava solo dal menu di Grand Cross
                */}
                <Link
                  href="/profilo"
                  aria-label={t.profilo}
                  title={t.profiloOspite}
                  className="relative grid h-8 w-9 shrink-0 place-items-center text-ink-3 transition-colors after:absolute after:inset-x-0 after:-inset-y-1.5 after:content-[''] hover:text-ink"
                >
                  <IconUser size={17} />
                </Link>
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
        // sotto il pulsante: a destra quanto il bordo del guscio, mai fuori dallo schermo
        <PopoverPanel
          id="menu-utente"
          className="inset-auto top-[64px] right-[max(0.75rem,calc((100vw-var(--container-shell))/2+1.5rem))] m-0 w-[min(84vw,300px)] border border-rule bg-paper-3 p-0 text-ink backdrop:bg-black/50"
        >
          <div className="flex items-center gap-2 border-b border-rule px-4 py-3">
            <span className="min-w-0 truncate font-display text-[16px] font-extrabold">{user.username}</span>
            <Tag>{roleLabel(user.role, locale)}</Tag>
          </div>
          <ul className="m-0 grid list-none gap-0.5 p-2">
            <li>
              <Link href="/profilo" className={MENU_VOCE}>
                {t.profilo}
              </Link>
            </li>
            <li>
              <Link href={`/u/${user.username}`} className={MENU_VOCE}>
                {t.paginaPubblica}
              </Link>
            </li>
            <li>
              <Link href="/notifiche" className={MENU_VOCE}>
                {t.notifiche}
                {unread > 0 ? (
                  <span className="ml-2 inline-grid h-4 min-w-4 place-items-center bg-brand px-1 font-mono text-[11px] leading-none text-on-brand">
                    {unread > 9 ? "9+" : unread}
                  </span>
                ) : null}
              </Link>
            </li>
            <li>
              <Link href="/impostazioni/profilo" className={MENU_VOCE}>
                {t.personalizza}
              </Link>
            </li>
            <li>
              <Link href="/impostazioni/account" className={MENU_VOCE}>
                {t.impostazioni}
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
