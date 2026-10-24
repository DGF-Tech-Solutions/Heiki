/**
 * Le chiavi del browser di prima del cambio di nome.
 *
 * Fino al 21/10/2026 il sito si chiamava GachaZone e tutto quello che salvava nel
 * browser aveva il prefisso `gachazone:`; da allora `heiki:`, stesso resto della
 * chiave. Il primo rimedio rileggeva la chiave vecchia quando la nuova mancava, ma le
 * cancellazioni toglievano solo la nuova: quando entra un'altra persona,
 * `AccountSync` dimentica box, profilo e classe di chi c'era prima, e quelli
 * ricomparivano dalla chiave vecchia e partivano verso l'account di chi era appena
 * entrato. Qui le chiavi vecchie si spostano UNA volta sulle nuove e si cancellano:
 * dopo, letture e cancellazioni vedono una chiave sola.
 *
 * Si chiama in cima a ogni lettura del localStorage, e non una volta all'avvio da un
 * componente del layout: i negozi letti con useSyncExternalStore leggono durante il
 * primo render, prima di qualunque effetto, e troverebbero la chiave nuova ancora
 * vuota. Dopo la prima chiamata costa un confronto.
 */

const OLD_PREFIX = "gachazone:";
const NEW_PREFIX = "heiki:";

let moved = false;

export function moveLegacyStorage(): void {
  if (moved || typeof window === "undefined") return;
  moved = true;
  try {
    const storage = window.localStorage;
    const legacy: string[] = [];
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key?.startsWith(OLD_PREFIX)) legacy.push(key);
    }
    for (const key of legacy) {
      const next = NEW_PREFIX + key.slice(OLD_PREFIX.length);
      const value = storage.getItem(key);
      // se la chiave nuova c'e' gia' e' stata scritta dopo il cambio di nome: vale lei
      if (value !== null && storage.getItem(next) === null) storage.setItem(next, value);
      storage.removeItem(key);
    }
  } catch {
    // navigazione privata, dati bloccati o spazio finito: le chiavi vecchie restano
    // dove sono e il sito parte da vuoto, come per chi non le ha mai avute
  }
}
