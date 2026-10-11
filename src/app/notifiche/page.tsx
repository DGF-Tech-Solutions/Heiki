import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { databaseReachable } from "@/lib/db";
import { intlLocale, testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { markAllReadAction } from "@/lib/social/actions";
import { listNotifications } from "@/lib/social/server";
import { relativeTime } from "@/lib/community/ranking";
import { Button, cx, Empty, Notice, PageHeader } from "@/components/ui";

const TESTI = testi({
  it: {
    titoloPagina: "Notifiche",
    richiedeDatabase: "Le notifiche richiedono il database. Avvialo con",
    notifiche: "Notifiche",
    segnaLette: "Segna tutte come lette",
    nessuna:
      "Nessuna notifica. Arrivano quando qualcuno risponde a un tuo post o inizia a seguirti.",
    // La frase che segue il nome di chi ha agito, per tipo di notifica.
    azioni: {
      POST_REPLY: "ha risposto al tuo post",
      COMMENT_REPLY: "ha risposto al tuo commento",
      NEW_FOLLOWER: "ha iniziato a seguirti",
      POST_VOTED: "ha votato il tuo post",
    } as Readonly<Record<string, string>>,
    interagito: "ha interagito",
    verificata: (n: string) => `La classe di combattimento del tuo account è stata verificata: ${n}.`,
    rifiutata: "La verifica della classe del tuo account non è stata accettata.",
    ilMioAccount: "Il mio account",
    guidaPubblicata: "La tua guida dell'Endgame è stata pubblicata:",
    guidaRespinta: "La tua guida dell'Endgame non è stata accettata (il motivo è nella pagina):",
  },
  en: {
    titoloPagina: "Notifications",
    richiedeDatabase: "Notifications need the database. Start it with",
    notifiche: "Notifications",
    segnaLette: "Mark all as read",
    nessuna: "No notifications. They arrive when someone replies to one of your posts or starts following you.",
    azioni: {
      POST_REPLY: "replied to your post",
      COMMENT_REPLY: "replied to your comment",
      NEW_FOLLOWER: "started following you",
      POST_VOTED: "voted on your post",
    },
    interagito: "interacted with you",
    verificata: (n: string) => `Your Account Combat Class has been verified: ${n}.`,
    rifiutata: "The verification of your account's class was not accepted.",
    ilMioAccount: "My account",
    guidaPubblicata: "Your Endgame guide has been published:",
    guidaRespinta: "Your Endgame guide was not accepted (the reason is on its page):",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const t = TESTI[await getLocale()];
  return {
    title: t.titoloPagina,
    robots: { index: false, follow: false },
  };
}

export default async function NotificationsPage() {
  const locale = await getLocale();
  const t = TESTI[locale];

  if (!(await databaseReachable())) {
    return (
      <main className="mx-auto w-full max-w-[760px] px-6 pt-8 pb-20">
        <Notice>
          <span>
            {t.richiedeDatabase} <code>docker compose up -d</code>.
          </span>
        </Notice>
      </main>
    );
  }

  const session = await auth();
  if (!session?.user?.id) redirect("/entra");

  const items = await listNotifications();
  const unread = items.filter((item) => !item.read).length;
  const now = new Date();

  return (
    <main className="mx-auto w-full max-w-[760px] px-6 pt-8 pb-20">
      <PageHeader title={t.notifiche}>
        {unread > 0 ? (
          <form
            action={async () => {
              "use server";
              await markAllReadAction();
            }}
          >
            <Button type="submit">{t.segnaLette}</Button>
          </form>
        ) : null}
      </PageHeader>

      {items.length === 0 ? (
        <Empty>{t.nessuna}</Empty>
      ) : (
        <ul className="m-0 grid list-none gap-2 p-0">
          {items.map((item) => (
            <li
              key={item.id}
              className={cx(
                // non letta: una lama rossa in testa e il fondo piu' chiaro, non il riquadro
                // rosso scuro bordato di rosso (10/10)
                "flex flex-wrap items-baseline gap-2 border px-4 py-3 text-sm",
                item.read ? "border-rule-2 bg-paper" : "p5-corner border-rule bg-paper-2",
              )}
            >
              {item.read ? null : <span aria-hidden className="p5-cut-sm h-2.5 w-4 shrink-0 self-center bg-brand" />}
              {item.type === "POWER_VERIFIED" || item.type === "POWER_REJECTED" ? (
                // l'esito lo firma la moderazione, non una persona: niente nome del moderatore
                <>
                  <span className="text-ink">
                    {item.type === "POWER_VERIFIED"
                      ? t.verificata((item.verifiedPower ?? 0).toLocaleString(intlLocale(locale)))
                      : t.rifiutata}
                  </span>
                  {item.gameSlug ? (
                    <Link
                      href={`/${item.gameSlug}/account`}
                      className="text-ink-2 underline decoration-rule underline-offset-2 hover:text-brand-deep"
                    >
                      {t.ilMioAccount}
                    </Link>
                  ) : null}
                </>
              ) : item.type === "STRATEGY_PUBLISHED" || item.type === "STRATEGY_REJECTED" ? (
                // come la verifica: la decisione e' della moderazione, non di una persona
                <span className="text-ink">
                  {item.type === "STRATEGY_PUBLISHED" ? t.guidaPubblicata : t.guidaRespinta}
                </span>
              ) : (
                <>
                  <Link href={`/u/${item.actor.username}`} className="font-semibold hover:text-brand-deep">
                    {item.actor.displayName}
                  </Link>
                  <span className="text-ink-2">{t.azioni[item.type] ?? t.interagito}</span>
                </>
              )}

              {item.postId && item.gameSlug ? (
                <Link
                  href={`/${item.gameSlug}/post/${item.postId}`}
                  className="text-ink-2 underline decoration-rule underline-offset-2 hover:text-brand-deep"
                >
                  {item.postTitle}
                </Link>
              ) : null}

              <span className="ml-auto font-mono text-[11px] text-ink-3">
                {relativeTime(item.createdAt, now, locale)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
