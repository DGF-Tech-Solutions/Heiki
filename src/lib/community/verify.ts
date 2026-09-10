/**
 * Riverifica degli allegati.
 *
 * Un post dichiara "mediana 186.400, seed 20260909". Qui il motore rigira lo
 * stesso calcolo e confronta. E' il pezzo che nessun altro sito di questa
 * nicchia puo' avere: altrove una build consigliata e' un'affermazione di
 * qualcuno, qui e' un conto che chiunque puo' rifare - e che il sito rifa' da
 * solo.
 *
 * Tre esiti, non due. "Non verificabile" e' diverso da "non torna": il primo
 * significa che mancano i dati per rifare il conto (personaggi non risolvibili,
 * patch diversa da quella caricata), il secondo che il conto e' stato fatto e
 * da' un altro numero. Confonderli marchierebbe come sospetti dei post che sono
 * solo vecchi.
 *
 * Per lo stesso motivo l'esito neutro non mostra nulla: un'etichetta di dubbio
 * su un post innocente fa piu' danno di nessuna etichetta.
 */

import { eq } from "drizzle-orm";
import { databaseReachable, db } from "@/lib/db";
import { attachmentChecks } from "@/lib/db/schema";
import { getGameModule } from "@/lib/games/registry";
import { simulateTeam } from "@/lib/games/preview";
import type { SimulationAttachment } from "./types";

/** Versione del motore: quando cambia, le verifiche memorizzate scadono. */
export const ENGINE_VERSION = "0.1";

/**
 * Tolleranza sulla mediana. Il motore e' deterministico dato seed e iterazioni,
 * quindi in teoria servirebbe zero; si concede lo 0,5% per assorbire gli
 * arrotondamenti di chi ha trascritto il numero a mano.
 */
const TOLERANCE = 0.005;

export type CheckStatus = "match" | "mismatch" | "unverifiable";

export interface AttachmentCheck {
  status: CheckStatus;
  /** scostamento relativo sulla mediana, presente sui primi due esiti */
  deviation?: number;
  declared?: number;
  recomputed?: number;
  reason?: string;
}

const NOT_VERIFIABLE = (reason: string): AttachmentCheck => ({ status: "unverifiable", reason });

/**
 * Rifa' il conto e confronta. Funzione pura rispetto al database: la si puo'
 * chiamare anche in modalita' dimostrativa.
 */
export function checkAttachment(
  gameSlug: string,
  attachment: SimulationAttachment,
): AttachmentCheck {
  const gameModule = getGameModule(gameSlug);
  if (!gameModule) return NOT_VERIFIABLE("modulo di gioco non caricato");

  if (attachment.patch !== gameModule.dataset.patch) {
    // Numeri prodotti con un'altra versione dei dati: non sono sbagliati, sono
    // di un altro momento. Rifare il conto adesso non dimostrerebbe niente.
    return NOT_VERIFIABLE(`prodotto sulla patch ${attachment.patch}`);
  }

  if (!Number.isFinite(attachment.iterations) || attachment.iterations <= 0) {
    // Pubblicato prima che il campo esistesse: senza sapere con quante
    // iterazioni e' stato prodotto, rifare il conto non dimostra niente.
    return NOT_VERIFIABLE("iterazioni non dichiarate");
  }

  const ids = resolveCharacterIds(gameModule, attachment);
  if (ids === null) return NOT_VERIFIABLE("personaggi non risolvibili");

  const result = simulateTeam(gameModule, ids, undefined, {
    seed: attachment.seed,
    iterations: attachment.iterations,
  });
  if (!result) return NOT_VERIFIABLE("simulazione non eseguibile");

  const declared = attachment.median;
  const recomputed = result.damage.median;
  if (declared <= 0) return NOT_VERIFIABLE("mediana dichiarata non valida");

  const deviation = Math.abs(recomputed - declared) / declared;

  return {
    status: deviation <= TOLERANCE ? "match" : "mismatch",
    deviation,
    declared,
    recomputed,
  };
}

/**
 * Gli id sono la via sicura; i nomi sono la riserva per gli allegati vecchi,
 * scritti prima che il campo esistesse.
 */
function resolveCharacterIds(
  gameModule: NonNullable<ReturnType<typeof getGameModule>>,
  attachment: SimulationAttachment,
): string[] | null {
  if (attachment.characterIds && attachment.characterIds.length > 0) {
    const known = new Set(gameModule.characters.map((character) => character.id));
    const ids = attachment.characterIds.filter((id) => known.has(id));
    return ids.length === attachment.characterIds.length ? [...ids] : null;
  }

  const byName = new Map(gameModule.characters.map((character) => [character.name, character.id]));
  const names = attachment.team.length > 0 ? attachment.team : [attachment.character];
  const ids = names.map((name) => byName.get(name)).filter((id): id is string => id != null);

  return ids.length === names.length ? ids : null;
}

/**
 * Come sopra, ma memorizza l'esito: rifare 1.500 simulazioni a ogni apertura di
 * pagina sarebbe uno spreco, e il risultato non cambia finche' non cambiano il
 * motore o il dataset.
 */
export async function cachedCheck(
  postId: string,
  gameSlug: string,
  attachment: SimulationAttachment,
): Promise<AttachmentCheck> {
  if (!(await databaseReachable())) return checkAttachment(gameSlug, attachment);

  try {
    const stored = await db.query.attachmentChecks.findFirst({
      where: eq(attachmentChecks.postId, postId),
    });

    if (stored && stored.engineVersion === ENGINE_VERSION) {
      return {
        status: stored.matches ? "match" : "mismatch",
        deviation: stored.deviation ? Number(stored.deviation) : undefined,
      };
    }

    const fresh = checkAttachment(gameSlug, attachment);
    if (fresh.status === "unverifiable") return fresh;

    await db
      .insert(attachmentChecks)
      .values({
        postId,
        engineVersion: ENGINE_VERSION,
        matches: fresh.status === "match",
        deviation: fresh.deviation?.toFixed(6) ?? null,
        checkedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: attachmentChecks.postId,
        set: {
          engineVersion: ENGINE_VERSION,
          matches: fresh.status === "match",
          deviation: fresh.deviation?.toFixed(6) ?? null,
          checkedAt: new Date(),
        },
      });

    return fresh;
  } catch {
    // Un problema di memorizzazione non deve impedire di mostrare l'esito.
    return checkAttachment(gameSlug, attachment);
  }
}
