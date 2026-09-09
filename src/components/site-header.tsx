import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/auth/permissions";

/**
 * L'intestazione conosce lo stato della sessione, quindi e' un componente
 * server. Se Auth.js non e' configurato non deve far fallire l'intera pagina:
 * si degrada allo stato disconnesso.
 */
export async function SiteHeader() {
  const session = await safeSession();
  const user = session?.user;

  return (
    <header className="masthead">
      <div className="shell masthead__inner">
        <Link href="/" className="wordmark">
          Gacha<span>Zone</span>
        </Link>

        <nav className="masthead__nav">
          <Link href="/#moduli">Moduli</Link>
          <Link href="/#motore">Motore</Link>

          <span className="masthead__auth">
            {user ? (
              <>
                <Link href="/impostazioni/profilo" className="btn btn--ghost">
                  Personalizza
                </Link>
                <Link href={`/u/${user.username}`} className="btn btn--ghost">
                  {user.username}
                  <span className="tag">{ROLE_LABELS[user.role] ?? "Utente"}</span>
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await signOut({ redirectTo: "/" });
                  }}
                >
                  <button type="submit" className="btn btn--ghost">
                    Esci
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/entra" className="btn btn--ghost masthead__nav-keep">
                  Entra
                </Link>
                <Link href="/registrati" className="btn btn--primary masthead__nav-keep">
                  Crea il profilo
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
