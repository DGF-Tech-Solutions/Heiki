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
 * Il 25/10 l'utente ha detto che il gestore e' una societa'; i primi dati sono
 * arrivati il 09/11. I campi a null le pagine li scrivono «da completare», e il
 * guscio delle pagine legali elenca quelli che mancano: la bozza non puo' andare
 * online senza che si veda.
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

/**
 * Dati forniti dall'utente il 09/11. La partita IVA ha la cifra di controllo giusta e
 * l'ufficio 083 (Messina). Della sede l'utente ha scritto solo «Via Leonardo Sciascia,
 * 24»: mancano CAP, comune e provincia, e un indirizzo a meta' sembrerebbe completo,
 * quindi resta null finche' non arrivano. Mancano anche registro, REA e capitale.
 */
export const OPERATOR: OperatorData = {
  name: "DGF Tech Solutions SRL",
  registeredOffice: null,
  vatNumber: "03882320835",
  companyRegister: null,
  shareCapital: null,
  singleMember: false,
  email: "info@dgftechsolutions.com",
  pec: null,
};

/**
 * Chi ospita il sito e il database: e' il responsabile del trattamento a cui
 * arrivano tutti i dati, e l'informativa deve dire chi e' e in che paese li
 * tiene.
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

/**
 * Scelto dall'utente il 09/11: Amazon, server in Italia. Per chi sta nello Spazio
 * economico europeo il contratto con AWS si fa con Amazon Web Services EMEA SARL
 * (Lussemburgo). Il paese e' quello detto dall'utente; l'unica regione AWS in Italia e'
 * Milano (eu-south-1), e va scelta quella.
 *
 * I 14 giorni dei registri li ha scelti Claude, perche' l'utente non li ha indicati:
 * bastano per capire un abuso e restano pochi. AWS di suo non li cancella (i gruppi di
 * CloudWatch e i registri in S3 restano per sempre): quando il sito va online, la
 * scadenza va impostata li', uguale a questa.
 */
export const HOSTING: HostingData | null = {
  name: "Amazon Web Services EMEA SARL",
  location: { it: "Italia", en: "Italy" },
  outsideEea: false,
  logRetentionDays: 14,
};

/**
 * Chi ospita la casella email del gestore: conserva per conto suo le email che gli si
 * scrivono, e l'informativa deve dire chi e' e in che paese stanno.
 */
export interface MailProviderData {
  name: string;
  /** dove stanno i server della posta; null finche' non si sa */
  location: Bilingual | null;
  /** true se fuori dallo Spazio economico europeo: allora serve una garanzia per il trasferimento */
  outsideEea: boolean;
}

/**
 * Hostinger: lo dicono i record pubblici del dominio (MX mx1/mx2.hostinger.com, SPF
 * _spf.mail.hostinger.com), controllati il 09/11. La societa' e' Hostinger
 * International Ltd, a Cipro. In che paese stiano i server della posta lo dice il
 * pannello di Hostinger, non i record: finche' manca la pagina lo segna.
 */
export const MAIL_PROVIDER: MailProviderData | null = {
  name: "Hostinger International Ltd",
  location: null,
  outsideEea: false,
};

/** I campi che le pagine legali non possono ancora scrivere. */
export type MissingField =
  | "name"
  | "registeredOffice"
  | "vatNumber"
  | "companyRegister"
  | "shareCapital"
  | "email"
  | "hosting"
  | "mailProvider"
  | "mailLocation";

export const MISSING_FIELD_LABELS: Readonly<Record<MissingField, Bilingual>> = {
  name: { it: "ragione sociale", en: "company name" },
  registeredOffice: { it: "sede legale", en: "registered office" },
  vatNumber: { it: "partita IVA", en: "VAT number" },
  companyRegister: { it: "registro delle imprese e numero REA", en: "company register and REA number" },
  shareCapital: { it: "capitale sociale", en: "share capital" },
  email: { it: "email di contatto", en: "contact email" },
  hosting: { it: "fornitore di hosting", en: "hosting provider" },
  mailProvider: { it: "chi ospita la casella email del gestore", en: "who hosts the operator's mailbox" },
  mailLocation: { it: "in che paese stanno i server della posta", en: "which country the mail servers are in" },
};

export function missingOperatorFields(
  operator: OperatorData = OPERATOR,
  hosting: HostingData | null = HOSTING,
  mail: MailProviderData | null = MAIL_PROVIDER,
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
  if (!mail) missing.push("mailProvider");
  else if (!mail.location) missing.push("mailLocation");
  return missing;
}
