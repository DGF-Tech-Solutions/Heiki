import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/auth/permissions";
import { buttonClass, Tag } from "./ui";

/**
 * L'intestazione conosce lo stato della sessione, quindi e' un componente
 * server. Se Auth.js non e' configurato non deve far fallire l'intera pagina:
 * si degrada allo stato disconnesso.
 */
export async function SiteHeader() {
  const session = await safeSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-20 border-b-2 border-ink bg-paper">
      <div className="mx-auto flex h-[58px] w-full max-w-[1200px] items-center gap-6 px-6">
        <Link
          href="/"
          className="whitespace-nowrap font-display text-xl font-extrabold uppercase tracking-[-0.02em] [font-variation-settings:'wdth'_78]"
        >
          Gacha<span className="text-brand">Zone</span>
        </Link>

        <nav className="ml-auto flex items-center gap-5 text-sm font-medium">
          <Link href="/" className="text-ink-2 hover:text-brand">
            Giochi
          </Link>

          <span className="flex items-center gap-2.5 border-l border-rule pl-5">
            {user ? (
              <>
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
