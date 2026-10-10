"use client";

import { useCallback, useSyncExternalStore } from "react";
import { markLocalChange } from "@/components/game-account/local-account";
import { boxStorageKey, EMPTY_BOX, parseBox, serializeBox, type HeroBox } from "@/lib/games/hero-box";

/**
 * Il tuo box nel browser: lo leggono la pagina «Il mio account», la griglia Eroi
 * (il filtro «I miei»), la scheda eroe (il calcolatore parte dai tuoi numeri), la
 * Squadra e il Randomizer.
 *
 * Come l'account (use-account-setup.ts): useSyncExternalStore, il box vuoto sul
 * server e al primo disegno, poi il browser; ogni salvataggio mette il timbro
 * dell'account di gioco (`markLocalChange`) e per chi e' entrato la
 * sincronizzazione lo manda al database insieme al resto. `storeBox` scrive
 * senza timbro, per la copia che arriva dal database.
 */

const EVENT = "gachazone:box";
const memory = new Map<string, string>();
const parsed = new Map<string, { raw: string | null; value: HeroBox }>();

function readRaw(key: string): string | null {
  if (memory.has(key)) return memory.get(key)!;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function snapshot(key: string): HeroBox {
  const raw = readRaw(key);
  const cached = parsed.get(key);
  if (cached && cached.raw === raw) return cached.value;
  const value = raw === null ? EMPTY_BOX : parseBox(raw);
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

/** Scrive il box senza timbro: la usa la sincronizzazione col database. */
export function storeBox(gameSlug: string, box: HeroBox): void {
  const key = boxStorageKey(gameSlug);
  const raw = serializeBox(box);
  try {
    window.localStorage.setItem(key, raw);
    memory.delete(key);
  } catch {
    memory.set(key, raw);
  }
  window.dispatchEvent(new Event(EVENT));
}

export function readBox(gameSlug: string): HeroBox {
  return snapshot(boxStorageKey(gameSlug));
}

export function hasStoredBox(gameSlug: string): boolean {
  return readRaw(boxStorageKey(gameSlug)) !== null;
}

export function useHeroBox(gameSlug: string): readonly [HeroBox, (next: HeroBox) => void] {
  const key = boxStorageKey(gameSlug);
  const box = useSyncExternalStore(
    subscribe,
    () => snapshot(key),
    () => EMPTY_BOX,
  );
  const save = useCallback(
    (next: HeroBox) => {
      storeBox(gameSlug, next);
      markLocalChange(gameSlug);
    },
    [gameSlug],
  );
  return [box, save] as const;
}
