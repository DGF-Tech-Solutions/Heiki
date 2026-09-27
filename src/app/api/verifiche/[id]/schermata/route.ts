import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { can } from "@/lib/auth/permissions";
import { databaseReachable, db } from "@/lib/db";
import { powerVerifications, verificationScreenshots } from "@/lib/db/schema";

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

  if (!/^[0-9a-f-]{36}$/i.test(id) || !(await databaseReachable())) return missing();
  const session = await auth();
  const viewerId = session?.user?.id;
  if (!viewerId) return missing();

  const verification = await db.query.powerVerifications.findFirst({
    where: eq(powerVerifications.id, id),
    columns: { userId: true },
  });
  if (!verification) return missing();
  if (verification.userId !== viewerId && !can(session.user.role, "moderate")) return missing();

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
    },
  });
}
