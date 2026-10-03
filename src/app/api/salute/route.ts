/**
 * Il sito e' vivo?
 *
 * Lo chiedono il controllo di salute dell'immagine Docker e, una volta online, il
 * servizio che ospita il sito o un controllo esterno. 200 se il sito risponde e il
 * database anche, 503 se il database non risponde: le pagine dei dati di gioco
 * funzionano lo stesso (stanno nel codice), ma accesso, account e community no, ed
 * e' quello che un controllo deve segnalare.
 *
 * Non dice niente di piu': un indirizzo pubblico che elencasse versioni o
 * configurazione sarebbe un'informazione regalata a chi cerca punti deboli.
 */

import { databaseReachable } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const database = await databaseReachable();
  return Response.json(
    { ok: database, database },
    { status: database ? 200 : 503, headers: { "Cache-Control": "no-store" } },
  );
}
