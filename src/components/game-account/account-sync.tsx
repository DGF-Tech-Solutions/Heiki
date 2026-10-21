"use client";

import { useEffect } from "react";
import { forgetSetup, hasStoredSetup, readSetup, storeSetup } from "@/components/account-buff/use-account-setup";
import { saveGameAccountAction } from "@/lib/game-account/actions";
import type { ServerAccountCopy } from "@/lib/game-account/server";
import { isEmptyProfile, syncDirection } from "@/lib/games/game-account";
import {
  CHANGE_EVENT,
  forgetProfile,
  readLocal,
  readProfile,
  readStamp,
  storeProfile,
  writeLocal,
  writeStamp,
} from "./local-account";
import { boxToJson } from "@/lib/games/hero-box";
import { forgetBox, hasStoredBox, readBox, storeBox } from "./use-hero-box";

/**
 * Tiene allineati il browser e il database, per chi e' entrato (scelta
 * dell'utente, 27/09: «browser e database»). Sta nel guscio delle pagine del
 * gioco, cosi' vale ovunque si cambi l'account: la pagina «Il mio account», lo
 * slider di una scheda eroe, la pagina dei buff.
 *
 * All'apertura vince la copia piu' recente (`syncDirection`); poi ogni modifica
 * fatta qui parte verso il database dopo un attimo di pausa, perche' uno slider
 * che scorre salva a ogni passo. Senza database, o se il salvataggio fallisce,
 * il browser resta com'e': la sincronizzazione e' un di piu', non un obbligo.
 *
 * Il browser ricorda di chi e' la sua copia (`owner`): se su questo computer
 * entra un'altra persona, i dati della prima si tolgono dal browser prima di
 * tutto il resto. Fino all'11/10 restavano: la seconda persona li vedeva, e alla
 * sua prima modifica finivano nel suo account.
 *
 * Le parti sono tre (profilo, classe e costellazioni, box) e un browser puo'
 * averne solo alcune: prima di mandare la sua copia prende dal database quelle
 * che non ha. Fino all'11/10 mandava tutto, e un telefono che aveva solo mosso
 * la classe cancellava sul server il box e il Codice amico scritti sul computer.
 */

const PAUSE_MS = 1500;
/** un salvataggio fallito (rete, tetto di frequenza) si riprova dopo un minuto */
const RETRY_MS = 60_000;

function ownerKey(gameSlug: string): string {
  return `heiki:${gameSlug}:account-owner`;
}

/** true se il database ha la copia del browser */
async function push(gameSlug: string): Promise<boolean> {
  const sentStamp = readStamp(gameSlug);
  try {
    const result = await saveGameAccountAction(gameSlug, {
      profile: readProfile(gameSlug),
      setup: readSetup(gameSlug),
      // la forma compatta, quella che il server rilegge (parseBox): l'oggetto in
      // memoria ({heroes}) arrivava come un box vuoto (10/10, trovato provando).
      // Senza box nel browser non si manda: il server tiene il suo
      box: hasStoredBox(gameSlug) ? boxToJson(readBox(gameSlug)) : undefined,
    });
    // se nel frattempo e' cambiato altro, il timbro nuovo resta: partira' anche quello
    if (result.ok && result.updatedAt && readStamp(gameSlug) === sentStamp) {
      writeStamp(gameSlug, result.updatedAt);
    }
    return result.ok;
  } catch {
    // rete assente o server spento: resta tutto nel browser
    return false;
  }
}

/** Le parti che il browser non ha le prende dal database, senza timbro. */
function fillFromServer(gameSlug: string, server: ServerAccountCopy): void {
  if (isEmptyProfile(readProfile(gameSlug))) storeProfile(gameSlug, server.profile);
  if (!hasStoredSetup(gameSlug)) storeSetup(gameSlug, server.setup);
  if (!hasStoredBox(gameSlug)) storeBox(gameSlug, server.box);
}

export function AccountSync({
  gameSlug,
  userId,
  server,
}: {
  gameSlug: string;
  userId: string;
  server: ServerAccountCopy | null;
}) {
  const serverStamp = server?.updatedAt ?? null;

  useEffect(() => {
    const owner = readLocal(ownerKey(gameSlug));
    if (owner !== null && owner !== userId) {
      // la copia del browser e' di un'altra persona: via, prima di tutto
      forgetProfile(gameSlug);
      forgetSetup(gameSlug);
      forgetBox(gameSlug);
    }
    writeLocal(ownerKey(gameSlug), userId);

    const direction = syncDirection(
      {
        stamp: readStamp(gameSlug),
        hasData: hasStoredSetup(gameSlug) || hasStoredBox(gameSlug) || !isEmptyProfile(readProfile(gameSlug)),
      },
      server,
    );

    let timer: ReturnType<typeof setTimeout> | null = null;
    let retry: ReturnType<typeof setTimeout> | null = null;
    const send = async () => {
      if (retry) clearTimeout(retry);
      retry = null;
      if (!(await push(gameSlug))) retry = setTimeout(() => void send(), RETRY_MS);
    };

    if (direction === "to-browser" && server) {
      storeSetup(gameSlug, server.setup);
      storeProfile(gameSlug, server.profile);
      storeBox(gameSlug, server.box);
      writeStamp(gameSlug, server.updatedAt);
    } else if (direction === "to-server") {
      if (server) fillFromServer(gameSlug, server);
      void send();
    }

    const onChange = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== gameSlug) return;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        void send();
      }, PAUSE_MS);
    };
    const onOnline = () => {
      if (retry) void send();
    };
    window.addEventListener(CHANGE_EVENT, onChange);
    window.addEventListener("online", onOnline);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange);
      window.removeEventListener("online", onOnline);
      if (retry) clearTimeout(retry);
      // chi cambia pagina subito dopo una modifica non la perde
      if (timer) {
        clearTimeout(timer);
        void push(gameSlug);
      }
    };
    // `server` conta per il suo timbro: lo stesso account riletto non e' una novita'
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameSlug, userId, serverStamp]);

  return null;
}
