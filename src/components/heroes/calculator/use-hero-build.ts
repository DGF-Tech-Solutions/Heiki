"use client";

import { useCallback, useSyncExternalStore } from "react";
import { defaultBuild, parseBuild, type CalculatorData, type HeroBuild } from "@/lib/games/hero-build";

/**
 * La configurazione del calcolatore di un eroe, salvata nel browser: chi mette il
 * suo equipaggiamento vero su un eroe la ritrova tornando sulla scheda.
 *
 * Come l'account (use-account-setup.ts): useSyncExternalStore, cosi' sul server e
 * al primo disegno vale la configurazione di partenza (tutto al massimo, niente
 * differenze all'idratazione) e poi React legge il browser. Il localStorage puo'
 * mancare o rifiutare: allora la configurazione resta in memoria finche' la
 * pagina e' aperta. Quello che si rilegge passa da parseBuild, che toglie cio'
 * che una patch ha reso impossibile.
 */

const EVENT = "gachazone:calcolatore";
const VERSION = 1;
const memory = new Map<string, string | null>();
const fallbacks = new WeakMap<CalculatorData, HeroBuild>();
const parsed = new Map<string, { raw: string | null; data: CalculatorData; value: HeroBuild }>();

export function buildStorageKey(gameSlug: string, heroId: string): string {
  return `gachazone:${gameSlug}:calcolatore:${heroId}`;
}

function fallbackOf(data: CalculatorData): HeroBuild {
  let value = fallbacks.get(data);
  if (!value) {
    value = defaultBuild(data);
    fallbacks.set(data, value);
  }
  return value;
}

function readRaw(key: string): string | null {
  if (memory.has(key)) return memory.get(key)!;
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function snapshot(key: string, data: CalculatorData): HeroBuild {
  const raw = readRaw(key);
  const cached = parsed.get(key);
  // lo stesso oggetto finche' il testo salvato non cambia: useSyncExternalStore lo pretende
  if (cached && cached.raw === raw && cached.data === data) return cached.value;
  let value = fallbackOf(data);
  if (raw) {
    try {
      const saved = JSON.parse(raw) as { v?: number; build?: unknown };
      if (saved.v === VERSION) value = parseBuild(saved.build, data);
    } catch {
      value = fallbackOf(data);
    }
  }
  parsed.set(key, { raw, data, value });
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

/** [configurazione, salva, torna a quella di partenza, true se ce n'e' una salvata] */
export function useHeroBuild(
  gameSlug: string,
  data: CalculatorData,
): readonly [HeroBuild, (next: HeroBuild) => void, () => void, boolean] {
  const key = buildStorageKey(gameSlug, data.heroId);
  const build = useSyncExternalStore(
    subscribe,
    () => snapshot(key, data),
    () => fallbackOf(data),
  );
  const write = useCallback(
    (raw: string | null) => {
      try {
        if (raw === null) window.localStorage.removeItem(key);
        else window.localStorage.setItem(key, raw);
        memory.delete(key);
      } catch {
        memory.set(key, raw);
      }
      window.dispatchEvent(new Event(EVENT));
    },
    [key],
  );
  const save = useCallback((next: HeroBuild) => write(JSON.stringify({ v: VERSION, build: next })), [write]);
  const reset = useCallback(() => write(null), [write]);
  return [build, save, reset, build !== fallbackOf(data)] as const;
}
