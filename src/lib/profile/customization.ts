/**
 * Cosa si puo' personalizzare di un profilo.
 *
 * REGOLA NON NEGOZIABILE: ogni opzione qui dentro e' design originale nostro.
 * Nessun asset dei publisher, mai. E' quello che rende vendibile la
 * personalizzazione senza vendere proprieta' intellettuale altrui.
 *
 * Seconda regola: si vende PRESENTAZIONE, mai STATUS. Le opzioni premium
 * cambiano come appare il profilo, non cosa hai ottenuto. Un badge guadagnato
 * non si compra e non si sblocca pagando: si puo' solo incorniciare meglio.
 */

export interface CosmeticOption {
  id: string;
  label: string;
  description: string;
  premium: boolean;
}

/** Colore d'accento: la scelta piu' visibile, quindi la prima nell'editor. */
export const ACCENTS: readonly CosmeticOption[] = [
  { id: "gold", label: "Oro", description: "Il colore di sistema", premium: false },
  { id: "violet", label: "Viola", description: "Freddo, contrasto alto", premium: false },
  { id: "cyan", label: "Ciano", description: "Tecnico, da terminale", premium: false },
  { id: "lime", label: "Lime", description: "Acido, molto vivo", premium: false },
  { id: "rose", label: "Rosa", description: "Caldo, saturo", premium: true },
  { id: "ember", label: "Brace", description: "Sfumatura calda animata", premium: true },
];

export const FRAMES: readonly CosmeticOption[] = [
  { id: "none", label: "Nessuna", description: "Solo il bordo di base", premium: false },
  { id: "hairline", label: "Filo", description: "Un tratto sottile a distanza", premium: false },
  { id: "double", label: "Doppia", description: "Due tratti concentrici", premium: false },
  { id: "notched", label: "Tagliata", description: "Angoli smussati", premium: false },
  { id: "glow", label: "Alone", description: "Bagliore nel colore d'accento", premium: true },
];

export const BACKGROUNDS: readonly CosmeticOption[] = [
  { id: "plain", label: "Liscio", description: "Nessuna trama", premium: false },
  { id: "grid", label: "Griglia", description: "Reticolo tecnico", premium: false },
  { id: "dots", label: "Punti", description: "Trama a pois radi", premium: false },
  { id: "aurora", label: "Aurora", description: "Sfumature morbide in movimento", premium: true },
  { id: "scan", label: "Scanline", description: "Righe orizzontali da CRT", premium: true },
];

export const LAYOUTS: readonly CosmeticOption[] = [
  { id: "standard", label: "Standard", description: "Intestazione ampia", premium: false },
  { id: "compact", label: "Compatto", description: "Tutto piu' stretto e denso", premium: false },
  { id: "editorial", label: "Editoriale", description: "Nome grande, testo largo", premium: false },
];

export const BADGE_SHOWCASE_LIMIT = 6;

export interface ProfileCustomization {
  accent: string;
  frame: string;
  background: string;
  layout: string;
}

export const DEFAULT_CUSTOMIZATION: ProfileCustomization = {
  accent: "gold",
  frame: "hairline",
  background: "grid",
  layout: "standard",
};

const GROUPS = {
  accent: ACCENTS,
  frame: FRAMES,
  background: BACKGROUNDS,
  layout: LAYOUTS,
} as const;

export type CustomizationKey = keyof typeof GROUPS;

export const CUSTOMIZATION_GROUPS: readonly {
  key: CustomizationKey;
  label: string;
  hint: string;
  options: readonly CosmeticOption[];
}[] = [
  { key: "accent", label: "Accento", hint: "Colora livello, badge e dettagli", options: ACCENTS },
  { key: "frame", label: "Cornice", hint: "Attorno all'avatar", options: FRAMES },
  { key: "background", label: "Sfondo", hint: "Trama dietro al profilo", options: BACKGROUNDS },
  { key: "layout", label: "Impaginazione", hint: "Densita' e proporzioni", options: LAYOUTS },
];

export function optionsFor(key: CustomizationKey): readonly CosmeticOption[] {
  return GROUPS[key];
}

export function isPremiumOption(key: CustomizationKey, id: string): boolean {
  return GROUPS[key].some((option) => option.id === id && option.premium);
}

/**
 * Normalizza un valore arrivato dal database o da un modulo.
 *
 * Un id sconosciuto - cosmetico ritirato, dato manomesso - torna al default
 * invece di produrre un profilo senza stile.
 */
export function normalizeCustomization(value: unknown): ProfileCustomization {
  const source = typeof value === "object" && value !== null ? (value as Record<string, unknown>) : {};

  const pick = (key: CustomizationKey): string => {
    const candidate = source[key];
    const fallback = DEFAULT_CUSTOMIZATION[key];
    if (typeof candidate !== "string") return fallback;
    return GROUPS[key].some((option) => option.id === candidate) ? candidate : fallback;
  };

  return {
    accent: pick("accent"),
    frame: pick("frame"),
    background: pick("background"),
    layout: pick("layout"),
  };
}

/** Rimuove le opzioni premium da chi non ha l'abbonamento attivo. */
export function stripPremium(
  customization: ProfileCustomization,
  allowed: boolean,
): ProfileCustomization {
  if (allowed) return customization;

  const result = { ...customization };
  for (const group of CUSTOMIZATION_GROUPS) {
    if (isPremiumOption(group.key, result[group.key])) {
      result[group.key] = DEFAULT_CUSTOMIZATION[group.key];
    }
  }
  return result;
}

/**
 * Forma da salvare in colonna jsonb. Esplicita invece di un cast: se un giorno
 * si aggiunge un cosmetico, il compilatore obbliga a decidere se persisterlo.
 */
export function toCosmeticRecord(value: ProfileCustomization): Record<string, string> {
  return {
    accent: value.accent,
    frame: value.frame,
    background: value.background,
    layout: value.layout,
  };
}
