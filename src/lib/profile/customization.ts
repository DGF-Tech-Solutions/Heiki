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

import type { Bilingual } from "@/lib/i18n/locale";

export interface CosmeticOption {
  id: string;
  /** Nome in italiano, per chi non passa ancora la lingua: nelle pagine usa `labels`. */
  label: string;
  /** Descrizione in italiano, per compatibilita': nelle pagine usa `descriptions`. */
  description: string;
  labels: Bilingual;
  descriptions: Bilingual;
  premium: boolean;
}

/** Un'opzione nasce nelle due lingue; `label` e `description` restano l'italiano. */
function option(
  id: string,
  labels: Bilingual,
  descriptions: Bilingual,
  premium: boolean,
): CosmeticOption {
  return { id, label: labels.it, description: descriptions.it, labels, descriptions, premium };
}

/** Colore d'accento: la scelta piu' visibile, quindi la prima nell'editor. */
export const ACCENTS: readonly CosmeticOption[] = [
  option("brand", { it: "Viola", en: "Violet" }, { it: "Il colore di sistema", en: "The system color" }, false),
  option("magenta", { it: "Magenta", en: "Magenta" }, { it: "Caldo e molto acceso", en: "Warm and very bright" }, false),
  option("ocean", { it: "Oceano", en: "Ocean" }, { it: "Blu profondo, sobrio", en: "Deep blue, understated" }, false),
  option("forest", { it: "Bosco", en: "Forest" }, { it: "Verde scuro, riposante", en: "Dark green, restful" }, false),
  option("sunset", { it: "Tramonto", en: "Sunset" }, { it: "Arancio bruciato", en: "Burnt orange" }, true),
  option("gold", { it: "Oro", en: "Gold" }, { it: "Il colore del cinque stelle", en: "The color of five stars" }, true),
];

export const FRAMES: readonly CosmeticOption[] = [
  option("none", { it: "Nessuna", en: "None" }, { it: "Solo il blocco pieno", en: "Just the solid block" }, false),
  option("hairline", { it: "Filo", en: "Hairline" }, { it: "Un tratto sottile a distanza", en: "A thin line set slightly apart" }, false),
  option("double", { it: "Doppia", en: "Double" }, { it: "Due tratti concentrici", en: "Two concentric lines" }, false),
  option("notched", { it: "Tagliata", en: "Notched" }, { it: "Angoli smussati", en: "Beveled corners" }, false),
  option("glow", { it: "Alone", en: "Glow" }, { it: "Ombra colorata sotto l'avatar", en: "Colored shadow under the avatar" }, true),
];

export const BACKGROUNDS: readonly CosmeticOption[] = [
  option("plain", { it: "Liscio", en: "Plain" }, { it: "Nessuna trama", en: "No pattern" }, false),
  option("grid", { it: "Griglia", en: "Grid" }, { it: "Reticolo tecnico", en: "Technical grid" }, false),
  option("dots", { it: "Punti", en: "Dots" }, { it: "Trama a pois radi", en: "Sparse polka dots" }, false),
  option("wash", { it: "Velatura", en: "Wash" }, { it: "Sfumatura diagonale nel tuo colore", en: "Diagonal gradient in your color" }, true),
  option("stripes", { it: "Diagonali", en: "Stripes" }, { it: "Righe inclinate", en: "Slanted lines" }, true),
];

export const LAYOUTS: readonly CosmeticOption[] = [
  option("standard", { it: "Standard", en: "Standard" }, { it: "Intestazione ampia", en: "Wide header" }, false),
  option("compact", { it: "Compatto", en: "Compact" }, { it: "Tutto più stretto e denso", en: "Everything tighter and denser" }, false),
  option("editorial", { it: "Editoriale", en: "Editorial" }, { it: "Nome grande, testo largo", en: "Large name, wide text" }, false),
];

export const BADGE_SHOWCASE_LIMIT = 6;

export interface ProfileCustomization {
  accent: string;
  frame: string;
  background: string;
  layout: string;
}

export const DEFAULT_CUSTOMIZATION: ProfileCustomization = {
  accent: "brand",
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

export interface CustomizationGroup {
  key: CustomizationKey;
  /** In italiano, per compatibilita': nelle pagine usa `labels`. */
  label: string;
  /** In italiano, per compatibilita': nelle pagine usa `hints`. */
  hint: string;
  labels: Bilingual;
  hints: Bilingual;
  options: readonly CosmeticOption[];
}

function group(
  key: CustomizationKey,
  labels: Bilingual,
  hints: Bilingual,
  options: readonly CosmeticOption[],
): CustomizationGroup {
  return { key, label: labels.it, hint: hints.it, labels, hints, options };
}

export const CUSTOMIZATION_GROUPS: readonly CustomizationGroup[] = [
  group("accent", { it: "Accento", en: "Accent" }, { it: "Colora livello, badge e dettagli", en: "Colors your level, badges and details" }, ACCENTS),
  group("frame", { it: "Cornice", en: "Frame" }, { it: "Attorno all'avatar", en: "Around the avatar" }, FRAMES),
  group("background", { it: "Sfondo", en: "Background" }, { it: "Trama dietro al profilo", en: "Pattern behind the profile" }, BACKGROUNDS),
  group("layout", { it: "Impaginazione", en: "Layout" }, { it: "Densità e proporzioni", en: "Density and proportions" }, LAYOUTS),
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
