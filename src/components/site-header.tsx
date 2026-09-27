import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { can, roleLabel } from "@/lib/auth/permissions";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { unreadCount } from "@/lib/social/actions";
import { LanguageSwitch } from "./language-switch";
import { buttonClass, cx, Tag } from "./ui";

// Sul telefono i bottoni dell'intestazione si stringono: in maiuscolo e col
// taglio obliquo «Iscriviti» finiva fuori dallo schermo, nella barra che scorre
const PHONE = "max-sm:px-2 max-sm:text-[12px]";

const TESTI = testi({
  it: {
    cerca: "Cerca",
    giochi: "Giochi",
    coda: "Coda",
    admin: "Admin",
    notifiche: "Notifiche",
    daLeggere: (n: number) => `Notifiche: ${n} da leggere`,
    personalizza: "Personalizza",
    esci: "Esci",
    entra: "Entra",
    iscriviti: "Iscriviti",
  },
  en: {
    cerca: "Search",
    giochi: "Games",
    coda: "Queue",
    admin: "Admin",
    notifiche: "Notifications",
    daLeggere: (n: number) => `Notifications: ${n} unread`,
    personalizza: "Customize",
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

        <form action="/cerca" className="ml-auto hidden md:block">
          <input
            name="q"
            placeholder={t.cerca}
            aria-label={t.cerca}
            className="p5-cut h-8 w-48 bg-ink px-3.5 text-[13px] font-semibold text-paper placeholder:text-paper/55 focus:bg-white focus:outline-none"
          />
        </form>

        {/*
          Sul telefono questa riga sforava: a 390px chiedeva 12px in piu', e con
          lei tutta la pagina scorreva di lato, perche' una riga troppo larga
          allarga l'area visibile di ogni sezione. Sotto sm sparisce "Giochi",
          che porta alla stessa pagina del logo, e gli spazi si stringono.

          `min-w-0` e `overflow-x-auto` sono la rete: con un nome utente lungo, o
          i pulsanti in piu' di chi modera, a scorrere e' la barra e non la pagina.
        */}
        <nav className="ml-auto flex min-w-0 items-center gap-2 overflow-x-auto py-1 text-sm font-medium whitespace-nowrap [scrollbar-width:none] sm:gap-5 md:ml-0">
          <Link href="/" className="hidden text-ink-2 hover:text-brand sm:inline">
            {t.giochi}
          </Link>

          <LanguageSwitch />

          <span className="flex items-center gap-1 sm:gap-2.5 sm:border-l sm:border-rule sm:pl-5">
            {user ? (
              <>
                {/* Le aree riservate compaiono solo a chi le puo' aprire: un
                    collegamento visibile a tutti sarebbe una porta annunciata. */}
                {can(user.role, "moderate") ? (
                  <Link
                    href="/moderazione"
                    className="font-mono text-[10px] uppercase tracking-[0.08em] text-hot hover:underline"
                  >
                    {t.coda}
                  </Link>
                ) : null}
                {can(user.role, "administer") ? (
                  <Link
                    href="/admin"
                    className="font-mono text-[10px] uppercase tracking-[0.08em] text-ink-3 hover:text-ink"
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
                    <span className="grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 font-mono text-[10px] leading-none text-white">
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
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <button type="submit" className={buttonClass("ghost", "sm")}>
                    {t.esci}
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/entra" className={buttonClass("ghost", "sm", PHONE)}>
                  {t.entra}
                </Link>
                <Link href="/registrati" className={buttonClass("primary", "sm", PHONE)}>
                  {t.iscriviti}
                </Link>
              </>
            )}
          </span>
        </nav>
      </div>
    </header>
  );
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
