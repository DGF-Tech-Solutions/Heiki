import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { databaseReachable } from "@/lib/db";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { listNotifications, markAllReadAction } from "@/lib/social/actions";
import { relativeTime } from "@/lib/community/ranking";
import { Button, cx, display, Empty, eyebrow, Notice } from "@/components/ui";

const TESTI = testi({
  it: {
    titoloPagina: "Notifiche · GachaZone",
    richiedeDatabase: "Le notifiche richiedono il database. Avvialo con",
    attivita: "Attività",
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
  },
  en: {
    titoloPagina: "Notifications · GachaZone",
    richiedeDatabase: "Notifications need the database. Start it with",
    attivita: "Activity",
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
      <header className="mb-5 flex flex-wrap items-end justify-between gap-4 border-b-2 border-ink pb-4">
        <div>
          <p className={eyebrow}>{t.attivita}</p>
          <h1 className={cx(display, "mt-2 text-[32px]")}>{t.notifiche}</h1>
        </div>

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
      </header>

      {items.length === 0 ? (
        <Empty>{t.nessuna}</Empty>
      ) : (
        <ul className="m-0 grid list-none gap-2 p-0">
          {items.map((item) => (
            <li
              key={item.id}
              className={cx(
                "flex flex-wrap items-baseline gap-2 rounded-card border px-4 py-3 text-sm",
                item.read ? "border-rule bg-paper" : "border-brand bg-brand-soft",
              )}
            >
              <Link href={`/u/${item.actor.username}`} className="font-semibold hover:text-brand">
                {item.actor.displayName}
              </Link>
              <span className="text-ink-2">{t.azioni[item.type] ?? t.interagito}</span>

              {item.postId && item.gameSlug ? (
                <Link
                  href={`/${item.gameSlug}/post/${item.postId}`}
                  className="text-ink-2 underline decoration-rule hover:text-brand"
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
