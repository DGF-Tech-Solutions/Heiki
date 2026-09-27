"use client";

import { useEffect } from "react";
import { hasStoredSetup, readSetup, storeSetup } from "@/components/account-buff/use-account-setup";
import { saveGameAccountAction } from "@/lib/game-account/actions";
import type { ServerAccountCopy } from "@/lib/game-account/server";
import { isEmptyProfile, syncDirection } from "@/lib/games/game-account";
import {
  CHANGE_EVENT,
  readLocal,
  readProfile,
  readStamp,
  storeProfile,
  writeLocal,
  writeStamp,
} from "./local-account";

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
 * entra un'altra persona, i dati della prima non finiscono nel suo account.
 */

const PAUSE_MS = 1500;

function ownerKey(gameSlug: string): string {
  return `gachazone:${gameSlug}:account-owner`;
}

async function push(gameSlug: string): Promise<void> {
  const sentStamp = readStamp(gameSlug);
  try {
    const result = await saveGameAccountAction(gameSlug, {
      profile: readProfile(gameSlug),
      setup: readSetup(gameSlug),
    });
    // se nel frattempo e' cambiato altro, il timbro nuovo resta: partira' anche quello
    if (result.ok && result.updatedAt && readStamp(gameSlug) === sentStamp) {
      writeStamp(gameSlug, result.updatedAt);
    }
  } catch {
    // rete assente o server spento: resta tutto nel browser
  }
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
    const mine = owner === null || owner === userId;
    const direction = syncDirection(
      {
        stamp: mine ? readStamp(gameSlug) : 0,
        hasData: mine && (hasStoredSetup(gameSlug) || !isEmptyProfile(readProfile(gameSlug))),
      },
      server,
    );
    if (direction === "to-browser" && server) {
      storeSetup(gameSlug, server.setup);
      storeProfile(gameSlug, server.profile);
      writeStamp(gameSlug, server.updatedAt);
    } else if (direction === "to-server") {
      void push(gameSlug);
    }
    if (direction !== "none" || mine) writeLocal(ownerKey(gameSlug), userId);

    let timer: ReturnType<typeof setTimeout> | null = null;
    const onChange = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== gameSlug) return;
      writeLocal(ownerKey(gameSlug), userId);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        void push(gameSlug);
      }, PAUSE_MS);
    };
    window.addEventListener(CHANGE_EVENT, onChange);
    return () => {
      window.removeEventListener(CHANGE_EVENT, onChange);
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
