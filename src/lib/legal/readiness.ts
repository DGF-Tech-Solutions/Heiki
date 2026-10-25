/**
 * Cosa manca perche' i documenti legali dicano il vero il giorno in cui il sito
 * va online: i dati del gestore e dell'hosting (./operator.ts) e le funzioni che
 * i documenti descrivono ma il codice non fa ancora.
 *
 * Il guscio delle pagine legali lo elenca in cima finche' c'e' qualcosa, cosi'
 * una bozza non puo' andare online senza che si veda. Quando una funzione
 * arriva, la sua voce si toglie da qui.
 */

import type { Bilingual } from "@/lib/i18n/locale";
import { missingOperatorFields, type MissingField } from "./operator";

export interface PendingFeature {
  key: string;
  label: Bilingual;
}

export const PENDING_FEATURES: readonly PendingFeature[] = [
  {
    // deciso il 25/10: lavoro a parte, tocca moderazione e notifiche
    key: "motivazioni-moderazione",
    label: {
      it: "l'avviso con il motivo a chi si vede nascondere un contenuto o sospendere l'account (art. 17 DSA)",
      en: "the notice with the reason sent to whoever has content hidden or the account suspended (Art. 17 DSA)",
    },
  },
];

export interface LegalReadiness {
  missingFields: MissingField[];
  pendingFeatures: readonly PendingFeature[];
  ready: boolean;
}

export function legalReadiness(): LegalReadiness {
  const missingFields = missingOperatorFields();
  return {
    missingFields,
    pendingFeatures: PENDING_FEATURES,
    ready: missingFields.length === 0 && PENDING_FEATURES.length === 0,
  };
}
