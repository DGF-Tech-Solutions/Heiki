/**
 * Gli hub (le sezioni) della community sul database, uno per gioco e sezione.
 *
 * In un file a parte perche' lo usano sia la community sia le strategie
 * dell'Endgame (lib/strategies/server.ts), che la community a sua volta legge
 * per il feed: tenerlo nello store avrebbe fatto un giro di import.
 */

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { games, hubs } from "@/lib/db/schema";
import { hubName } from "./types";

export async function ensureHub(slug: string, gameSlug: string): Promise<string> {
  // Gli hub sono per gioco: lo stesso nome di sezione esiste in ognuno.
  const key = `${gameSlug}:${slug}`;
  const existing = await db.query.hubs.findFirst({
    where: eq(hubs.slug, key),
    columns: { id: true },
  });
  if (existing) return existing.id;

  const game = await db.query.games.findFirst({
    where: eq(games.slug, gameSlug),
    columns: { id: true },
  });

  const [created] = await db
    .insert(hubs)
    .values({ slug: key, name: hubName(slug), gameId: game?.id ?? null })
    .returning({ id: hubs.id });

  if (!created) throw new Error(`Impossibile creare l'hub "${slug}"`);
  return created.id;
}
