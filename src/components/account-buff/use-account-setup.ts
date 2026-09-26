"use client";

import { useCallback, useSyncExternalStore } from "react";
import { EMPTY_SETUP, parseSetup, setupStorageKey, type AccountSetup } from "@/lib/games/account-setup";

/**
 * Il tuo account salvato nel browser, condiviso fra lo slider di ogni scheda e la
 * pagina «Buff dell'account».
 *
 * useSyncExternalStore e non useState + useEffect: sul server e al primo disegno
 * vale l'account vuoto (la scheda come la manda il server, niente differenze
 * all'idratazione), poi React legge il browser. Si aggiorna anche quando un'altra
 * scheda del browser salva (evento `storage`) e quando salva questa (evento suo).
 *
 * Il localStorage puo' mancare o rifiutare (navigazione privata, dati bloccati):
 * allora l'account resta in memoria finche' la pagina e' aperta.
 */

const EVENT = "gachazone:buff-account";
const memory = new Map<string, string>();
const parsed = new Map<string, { raw: string | null; value: AccountSetup }>();

function readRaw(key: string): string | null {
  // la memoria c'e' solo se l'ultimo salvataggio nel browser e' fallito: vale lei
  if (memory.has(key)) return memory.get(key)!;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function snapshot(key: string): AccountSetup {
  const raw = readRaw(key);
  const cached = parsed.get(key);
  // lo stesso oggetto finche' il testo non cambia: useSyncExternalStore lo pretende
  if (cached && cached.raw === raw) return cached.value;
  const value = parseSetup(raw);
  parsed.set(key, { raw, value });
  return value;
}

function subscribe(notify: () => void): () => void {
  window.addEventListener("storage", notify);
  window.addEventListener(EVENT, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(EVENT, notify);
  };
}

export function useAccountSetup(gameSlug: string): readonly [AccountSetup, (next: AccountSetup) => void] {
  const key = setupStorageKey(gameSlug);
  const setup = useSyncExternalStore(
    subscribe,
    () => snapshot(key),
    () => EMPTY_SETUP,
  );
  const save = useCallback(
    (next: AccountSetup) => {
      const raw = JSON.stringify(next);
      try {
        window.localStorage.setItem(key, raw);
        memory.delete(key);
      } catch {
        memory.set(key, raw);
      }
      window.dispatchEvent(new Event(EVENT));
    },
    [key],
  );
  return [setup, save] as const;
}
