"use server";

/**
 * Seguire, smettere di seguire, segnare le notifiche come lette.
 *
 * E' il ciclo che riporta la gente sul sito: segui qualcuno, quel qualcuno
 * scrive, tu lo vieni a sapere, torni. Senza questi due pezzi ogni visita
 * riparte da zero e una discussione muore dopo il primo messaggio, perche'
 * nessuno si accorge che e' andata avanti.
 *
 * Richiedono un'identita' vera, quindi funzionano solo con il database attivo:
 * in modalita' dimostrativa si e' "Ospite" e seguire non vorrebbe dire niente.
 *
 * Qui SOLO le azioni che il browser chiama, ognuna col suo controllo: ogni
 * funzione esportata da un modulo "use server" e' raggiungibile da fuori. Le
 * letture e `notify` stanno in `server.ts` (11/10).
 */

import { revalidatePath } from "next/cache";
import { and, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { follows, notifications, users } from "@/lib/db/schema";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { suspensionFor, suspensionMessage } from "@/lib/moderation/suspension";
import { rateLimit, retryMessage } from "@/lib/rate-limit";
import { currentUserId, notify } from "./server";

export interface SocialResult {
  ok: boolean;
  error?: string;
}

// Le frasi delle notifiche non stanno qui: si compongono nella pagina
// /notifiche, nella lingua di chi le legge. Qui solo gli esiti delle azioni.
const TESTI = testi({
  it: {
    entraPerSeguire: "Entra per seguire qualcuno.",
    profiloInesistente: "Profilo inesistente.",
    nonTeStesso: "Non puoi seguire te stesso.",
    sessioneScaduta: "Sessione scaduta.",
  },
  en: {
    entraPerSeguire: "Log in to follow someone.",
    profiloInesistente: "This profile doesn't exist.",
    nonTeStesso: "You can't follow yourself.",
    sessioneScaduta: "Your session has expired.",
  },
});

/* ------------------------------------------------------------- seguire -- */

export async function toggleFollowAction(targetUsername: string): Promise<SocialResult> {
  const locale = await getLocale();
  const t = TESTI[locale];

  const followerId = await currentUserId();
  if (!followerId) return { ok: false, error: t.entraPerSeguire };
  if (typeof targetUsername !== "string" || targetUsername.length > 64) {
    return { ok: false, error: t.profiloInesistente };
  }

  // seguire e smettere in giro mandava una notifica a ogni giro (11/10)
  const limit = rateLimit("follow", followerId);
  if (!limit.allowed) return { ok: false, error: retryMessage(limit, locale) };

  // chi e' sospeso non scrive, e seguire manda una notifica (11/10)
  const suspension = await suspensionFor(followerId);
  if (suspension.active) return { ok: false, error: suspensionMessage(suspension, locale) };

  const target = await db.query.users.findFirst({
    where: eq(users.username, targetUsername.toLowerCase()),
    columns: { id: true },
  });
  if (!target) return { ok: false, error: t.profiloInesistente };

  // Seguire se stessi non e' un errore da spiegare: e' un pulsante che non
  // dovrebbe esistere, e qui si limita a non fare niente.
  if (target.id === followerId) return { ok: false, error: t.nonTeStesso };

  const existing = await db.query.follows.findFirst({
    where: and(eq(follows.followerId, followerId), eq(follows.followingId, target.id)),
  });

  if (existing) {
    await db
      .delete(follows)
      .where(and(eq(follows.followerId, followerId), eq(follows.followingId, target.id)));
  } else {
    await db.insert(follows).values({ followerId, followingId: target.id });
    // una notifica sola per chi ti segue: chi smette e ricomincia non ne manda altre
    const already = await db.query.notifications.findFirst({
      where: and(
        eq(notifications.userId, target.id),
        eq(notifications.actorId, followerId),
        eq(notifications.type, "NEW_FOLLOWER"),
      ),
      columns: { id: true },
    });
    if (!already) await notify(target.id, followerId, "NEW_FOLLOWER", {});
  }

  revalidatePath(`/u/${targetUsername}`);
  return { ok: true };
}

/* ----------------------------------------------------------- notifiche -- */

export async function markAllReadAction(): Promise<SocialResult> {
  const userId = await currentUserId();
  if (!userId) return { ok: false, error: TESTI[await getLocale()].sessioneScaduta };

  await db
    .update(notifications)
    .set({ readAt: new Date() })
    .where(and(eq(notifications.userId, userId), isNull(notifications.readAt)));

  revalidatePath("/notifiche");
  return { ok: true };
}
