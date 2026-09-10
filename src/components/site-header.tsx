import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/auth/permissions";
import { unreadCount } from "@/lib/social/actions";
import { buttonClass, cx, Tag } from "./ui";

/**
 * L'intestazione conosce lo stato della sessione, quindi e' un componente
 * server. Se Auth.js non e' configurato non deve far fallire l'intera pagina:
 * si degrada allo stato disconnesso.
 */
export async function SiteHeader() {
  const session = await safeSession();
  const user = session?.user;
  const unread = user ? await safeUnread() : 0;

  return (
    <header className="sticky top-0 z-20 border-b-2 border-ink bg-paper">
      <div className="mx-auto flex h-[58px] w-full max-w-[1200px] items-center gap-6 px-6">
        <Link
          href="/"
          className="whitespace-nowrap font-display text-xl font-extrabold uppercase tracking-[-0.02em] [font-variation-settings:'wdth'_78]"
        >
          Gacha<span className="text-brand">Zone</span>
        </Link>

        <form action="/cerca" className="ml-auto hidden md:block">
          <input
            name="q"
            placeholder="Cerca"
            aria-label="Cerca"
            className="h-8 w-44 rounded-card border border-rule bg-paper px-3 text-[13px] focus:border-brand focus:outline-none"
          />
        </form>

        <nav className="flex items-center gap-5 text-sm font-medium md:ml-0 ml-auto">
          <Link href="/" className="text-ink-2 hover:text-brand">
            Giochi
          </Link>

          <span className="flex items-center gap-2.5 border-l border-rule pl-5">
            {user ? (
              <>
                <Link
                  href="/notifiche"
                  className={cx(buttonClass("ghost", "sm"), "relative")}
                  aria-label={unread > 0 ? `Notifiche: ${unread} da leggere` : "Notifiche"}
                >
                  Notifiche
                  {unread > 0 ? (
                    <span className="grid h-4 min-w-4 place-items-center rounded-full bg-brand px-1 font-mono text-[10px] leading-none text-white">
                      {unread > 9 ? "9+" : unread}
                    </span>
                  ) : null}
                </Link>
                <Link href="/impostazioni/profilo" className={buttonClass("ghost", "sm")}>
                  Personalizza
                </Link>
                <Link href={`/u/${user.username}`} className={buttonClass("ghost", "sm")}>
                  {user.username}
                  <Tag>{ROLE_LABELS[user.role] ?? "Utente"}</Tag>
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <button type="submit" className={buttonClass("ghost", "sm")}>
                    Esci
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/entra" className={buttonClass("ghost", "sm")}>
                  Entra
                </Link>
                <Link href="/registrati" className={buttonClass("primary", "sm")}>
                  Iscriviti
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
