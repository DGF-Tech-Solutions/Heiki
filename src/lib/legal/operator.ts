/**
 * Chi gestisce Heiki: i dati che le pagine legali devono dire.
 *
 * Servono a piu' norme insieme, e per questo stanno in un posto solo: il
 * titolare del trattamento (art. 13 GDPR), le informazioni del prestatore di un
 * servizio online (art. 7 del D.Lgs. 70/2003), quelle che una societa' deve
 * rendere accessibili dal suo sito (art. 2250 c.c.) e i punti di contatto del
 * Digital Services Act (artt. 11 e 12 del Reg. UE 2022/2065). Le pagine legali
 * e il pie' di pagina li leggono da qui: cambiato un dato, nessuna pagina resta
 * con quello vecchio.
 *
 * Il 25/10 l'utente ha detto che il gestore e' una societa', senza ancora i
 * dati. I campi a null le pagine li scrivono «da completare», e il guscio delle
 * pagine legali elenca quelli che mancano: la bozza non puo' andare online
 * senza che si veda.
 */

import type { Bilingual } from "@/lib/i18n/locale";

export interface OperatorData {
  /** ragione sociale completa, con la forma giuridica: «Esempio S.r.l.» */
  name: string | null;
  /** sede legale: via, numero, CAP, comune e provincia */
  registeredOffice: string | null;
  vatNumber: string | null;
  /** ufficio del registro delle imprese e numero REA: «Registro delle imprese di Roma, REA RM-1234567» */
  companyRegister: string | null;
  /**
   * Il capitale sociale, solo per le societa' di capitali (S.r.l., S.p.A.), che
   * devono indicarlo anche sul sito «secondo la somma effettivamente versata»
   * (art. 2250 c.c.): per esempio «10.000,00 € interamente versato». `false` per
   * le forme che non ne hanno uno da dichiarare (ditta individuale, s.n.c.,
   * s.a.s.).
   */
  shareCapital: string | false | null;
  /** S.r.l. o S.p.A. con un socio solo: va detto (art. 2250 c.c.) */
  singleMember: boolean;
  /**
   * La casella per tutto: privacy, segnalazioni, titolari dei diritti,
   * autorita'. Una sola per scelta (25/10): chi scrive non deve indovinare
   * quale, e chi legge ne tiene d'occhio una.
   */
  email: string | null;
  /** facoltativa: se c'e' si mostra, se manca non e' un buco */
  pec: string | null;
}

export const OPERATOR: OperatorData = {
  name: null,
  registeredOffice: null,
  vatNumber: null,
  companyRegister: null,
  shareCapital: null,
  singleMember: false,
  email: null,
  pec: null,
};

/**
 * Chi ospita il sito e il database: e' il responsabile del trattamento a cui
 * arrivano tutti i dati, e l'informativa deve dire chi e' e in che paese li
 * tiene. Il servizio non e' ancora scelto (03/10, «solo preparare»): quando lo
 * sara', il suo nome e il paese dei server vanno qui.
 */
export interface HostingData {
  /** «Hetzner Online GmbH», «Vercel Inc.»... */
  name: string;
  /** dove stanno i server: decide se c'e' un trasferimento fuori dall'UE */
  location: Bilingual;
  /** true se i server stanno fuori dallo Spazio economico europeo */
  outsideEea: boolean;
  /**
   * Per quanti giorni l'hosting (o il proxy davanti al sito) tiene i registri
   * tecnici delle richieste: indirizzo IP, pagina, ora. Lo decide la sua
   * configurazione, non il codice: va impostato li' e scritto qui uguale.
   */
  logRetentionDays: number;
}

export const HOSTING: HostingData | null = null;

/** I campi che le pagine legali non possono ancora scrivere. */
export type MissingField =
  | "name"
  | "registeredOffice"
  | "vatNumber"
  | "companyRegister"
  | "shareCapital"
  | "email"
  | "hosting";

export const MISSING_FIELD_LABELS: Readonly<Record<MissingField, Bilingual>> = {
  name: { it: "ragione sociale", en: "company name" },
  registeredOffice: { it: "sede legale", en: "registered office" },
  vatNumber: { it: "partita IVA", en: "VAT number" },
  companyRegister: { it: "registro delle imprese e numero REA", en: "company register and REA number" },
  shareCapital: { it: "capitale sociale", en: "share capital" },
  email: { it: "email di contatto", en: "contact email" },
  hosting: { it: "fornitore di hosting", en: "hosting provider" },
};

export function missingOperatorFields(
  operator: OperatorData = OPERATOR,
  hosting: HostingData | null = HOSTING,
): MissingField[] {
  const missing: MissingField[] = [];
  if (!operator.name) missing.push("name");
  if (!operator.registeredOffice) missing.push("registeredOffice");
  if (!operator.vatNumber) missing.push("vatNumber");
  if (!operator.companyRegister) missing.push("companyRegister");
  // false vuol dire «non previsto per questa forma»: solo null e' un buco
  if (operator.shareCapital === null) missing.push("shareCapital");
  if (!operator.email) missing.push("email");
  if (!hosting) missing.push("hosting");
  return missing;
}
