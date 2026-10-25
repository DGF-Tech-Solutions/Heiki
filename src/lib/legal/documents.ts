/**
 * I documenti legali del sito: nome, indirizzo, titolo e data dell'ultima
 * modifica.
 *
 * Un elenco solo per il pie' di pagina, le schede del guscio /legale e la
 * sitemap: lo stesso documento si chiama allo stesso modo ovunque (regola del
 * 24/10, un solo nome per pagina), e aggiungerne uno e' una riga qui.
 *
 * `updated` si cambia quando cambia la sostanza del documento, non per un
 * ritocco di forma: e' la data che chi legge confronta con l'ultima volta che
 * l'ha letto.
 */

import type { Bilingual } from "@/lib/i18n/locale";

export type LegalDocumentKey = "termini" | "privacy" | "cookie" | "note-legali" | "copyright";

export interface LegalDocument {
  key: LegalDocumentKey;
  href: `/legale/${LegalDocumentKey}`;
  /** il nome corto: pie' di pagina e schede */
  label: Bilingual;
  /** il titolo della pagina e dei metadati */
  title: Bilingual;
  /** una riga per i metadati e per chi arriva da un motore di ricerca */
  description: Bilingual;
  /** AAAA-MM-GG */
  updated: string;
}

export const LEGAL_DOCUMENTS: readonly LegalDocument[] = [
  {
    key: "termini",
    href: "/legale/termini",
    label: { it: "Termini", en: "Terms" },
    title: { it: "Termini di servizio", en: "Terms of service" },
    description: {
      it: "Le regole per usare Heiki: account, contenuti che pubblichi, moderazione e responsabilità.",
      en: "The rules for using Heiki: accounts, the content you publish, moderation and liability.",
    },
    updated: "2026-10-25",
  },
  {
    key: "privacy",
    href: "/legale/privacy",
    label: { it: "Privacy", en: "Privacy" },
    title: { it: "Informativa privacy", en: "Privacy policy" },
    description: {
      it: "Quali dati personali tratta Heiki, perché, per quanto tempo e come esercitare i tuoi diritti.",
      en: "Which personal data Heiki processes, why, for how long, and how to exercise your rights.",
    },
    updated: "2026-10-25",
  },
  {
    key: "cookie",
    href: "/legale/cookie",
    label: { it: "Cookie", en: "Cookies" },
    title: { it: "Cookie e dati nel browser", en: "Cookies and browser storage" },
    description: {
      it: "I cookie tecnici e i dati che Heiki salva nel tuo browser, uno per uno.",
      en: "The technical cookies and the data Heiki saves in your browser, one by one.",
    },
    updated: "2026-10-25",
  },
  {
    key: "note-legali",
    href: "/legale/note-legali",
    label: { it: "Note legali", en: "Legal notice" },
    title: { it: "Note legali", en: "Legal notice" },
    description: {
      it: "Chi gestisce Heiki, i marchi e i contenuti dei giochi, l'esattezza dei dati e le fonti.",
      en: "Who runs Heiki, game trademarks and content, data accuracy and sources.",
    },
    updated: "2026-10-25",
  },
  {
    key: "copyright",
    href: "/legale/copyright",
    label: { it: "Copyright e rimozioni", en: "Copyright and takedown" },
    title: { it: "Copyright e rimozioni", en: "Copyright and takedown" },
    description: {
      it: "Come chiedere la rimozione di un contenuto se sei titolare dei diritti, e come segnalare un contenuto illecito.",
      en: "How to request the removal of content if you hold the rights, and how to report illegal content.",
    },
    updated: "2026-10-25",
  },
];

export function legalDocument(key: LegalDocumentKey): LegalDocument {
  const found = LEGAL_DOCUMENTS.find((doc) => doc.key === key);
  // l'elenco e' scritto qui sopra: una chiave senza documento e' un errore di
  // chi scrive, non un caso da gestire in pagina
  if (!found) throw new Error(`Documento legale sconosciuto: ${key}`);
  return found;
}
