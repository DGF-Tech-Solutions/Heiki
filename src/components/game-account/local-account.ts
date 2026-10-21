"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  EMPTY_PROFILE,
  parseProfile,
  parseStamp,
  profileStorageKey,
  stampStorageKey,
  type GameAccountProfile,
} from "@/lib/games/game-account";

/**
 * Il profilo dell'account di gioco nel browser (nickname, Codice amico, server) e
 * il timbro dell'ultima modifica fatta qui. La classe e le costellazioni stanno
 * dove stavano (`use-account-setup.ts`), perche' le schede degli eroi le leggono
 * gia' da li'; anche quel salvataggio mette il timbro.
 *
 * Due eventi: PROFILE_EVENT ridisegna chi mostra il profilo, CHANGE_EVENT dice
 * alla sincronizzazione che l'utente ha cambiato qualcosa e va mandato al
 * database. Quando e' la sincronizzazione a scrivere (la copia del database),
 * parte solo il primo: altrimenti rimanderebbe indietro quello che ha appena
 * ricevuto.
 */

export const PROFILE_EVENT = "heiki:account-profile";
export const CHANGE_EVENT = "heiki:account-changed";

// se il browser rifiuta di salvare (navigazione privata, dati bloccati) il valore resta qui
const memory = new Map<string, string>();
const parsed = new Map<string, { raw: string | null; value: GameAccountProfile }>();

export function readLocal(key: string): string | null {
  if (memory.has(key)) return memory.get(key)!;
  try {
    const val = window.localStorage.getItem(key);
    if (val !== null) return val;
    return window.localStorage.getItem(key.replace(/^heiki:/, "gachazone:"));
  } catch {
    return null;
  }
}

export function writeLocal(key: string, raw: string): void {
  try {
    window.localStorage.setItem(key, raw);
    memory.delete(key);
  } catch {
    memory.set(key, raw);
  }
}

export function readStamp(gameSlug: string): number {
  return parseStamp(readLocal(stampStorageKey(gameSlug)));
}

export function writeStamp(gameSlug: string, stamp: number): void {
  writeLocal(stampStorageKey(gameSlug), String(stamp));
}

/**
 * L'utente ha cambiato qualcosa in questo browser. Il timbro non torna mai
 * indietro: dopo una sincronizzazione e' l'ora del server, e con l'orologio del
 * telefono indietro una modifica nuova avrebbe un timbro piu' vecchio della
 * copia del database, che alla prossima apertura l'avrebbe cancellata.
 */
export function markLocalChange(gameSlug: string): void {
  writeStamp(gameSlug, Math.max(Date.now(), readStamp(gameSlug) + 1));
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: gameSlug }));
}

function removeLocal(key: string): void {
  memory.delete(key);
  try {
    window.localStorage.removeItem(key);
  } catch {
    /* niente da togliere */
  }
}

/** Toglie profilo e timbro dal browser: la usa la sincronizzazione quando entra un'altra persona. */
export function forgetProfile(gameSlug: string): void {
  removeLocal(profileStorageKey(gameSlug));
  removeLocal(stampStorageKey(gameSlug));
  window.dispatchEvent(new Event(PROFILE_EVENT));
}

/** Scrive il profilo senza timbro: la usa la sincronizzazione. */
export function storeProfile(gameSlug: string, profile: GameAccountProfile): void {
  writeLocal(profileStorageKey(gameSlug), JSON.stringify(profile));
  window.dispatchEvent(new Event(PROFILE_EVENT));
}

export function readProfile(gameSlug: string): GameAccountProfile {
  const key = profileStorageKey(gameSlug);
  const raw = readLocal(key);
  const cached = parsed.get(key);
  // lo stesso oggetto finche' il testo non cambia: useSyncExternalStore lo pretende
  if (cached && cached.raw === raw) return cached.value;
  const value = parseProfile(raw);
  parsed.set(key, { raw, value });
  return value;
}

function subscribe(notify: () => void): () => void {
  window.addEventListener("storage", notify);
  window.addEventListener(PROFILE_EVENT, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(PROFILE_EVENT, notify);
  };
}

export function useGameProfile(
  gameSlug: string,
): readonly [GameAccountProfile, (next: GameAccountProfile) => void] {
  const profile = useSyncExternalStore(
    subscribe,
    () => readProfile(gameSlug),
    () => EMPTY_PROFILE,
  );
  const save = useCallback(
    (next: GameAccountProfile) => {
      storeProfile(gameSlug, next);
      markLocalChange(gameSlug);
    },
    [gameSlug],
  );
  return [profile, save] as const;
}
