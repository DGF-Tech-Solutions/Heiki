import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { can } from "@/lib/auth/permissions";
import { databaseReachable, db } from "@/lib/db";
import { powerVerifications, verificationScreenshots } from "@/lib/db/schema";
import { suspensionFor } from "@/lib/moderation/suspension";

/**
 * La schermata di una verifica della classe dell'account.
 *
 * La vedono solo i moderatori (per decidere) e chi l'ha caricata (per ricontrollare
 * cosa ha mandato). A tutti gli altri 404, non 403: che la verifica esista non e'
 * affar loro. Niente cache: dopo la decisione la schermata non c'e' piu', e una
 * copia in una cache condivisa la farebbe sopravvivere.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const missing = () => new Response("Not found", { status: 404, headers: { "Cache-Control": "no-store" } });

  // un UUID vero: la regex di prima accettava anche 36 trattini, che arrivavano
  // al database come errore invece che come 404
  if (!z.string().uuid().safeParse(id).success || !(await databaseReachable())) return missing();
  const session = await auth();
  const viewerId = session?.user?.id;
  if (!viewerId) return missing();

  const verification = await db.query.powerVerifications.findFirst({
    where: eq(powerVerifications.id, id),
    columns: { userId: true },
  });
  if (!verification) return missing();
  // Chi l'ha caricata la rivede sempre. Un moderatore solo se modera davvero:
  // sospeso non modera, e la schermata porta il codice amico di qualcun altro (11/10).
  if (verification.userId !== viewerId) {
    if (!can(session.user.role, "moderate")) return missing();
    if ((await suspensionFor(viewerId)).active) return missing();
  }

  const shot = await db.query.verificationScreenshots.findFirst({
    where: eq(verificationScreenshots.verificationId, id),
  });
  if (!shot) return missing();

  return new Response(new Uint8Array(shot.bytes), {
    headers: {
      "Content-Type": shot.mime,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
      "Content-Disposition": "inline",
      // aperta da sola in una scheda, l'immagine non puo' eseguire niente ne'
      // essere incorporata da un altro sito
      "Content-Security-Policy": "default-src 'none'; img-src 'self'; style-src 'unsafe-inline'; sandbox",
      "Cross-Origin-Resource-Policy": "same-origin",
    },
  });
}
