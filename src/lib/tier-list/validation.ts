/**
 * Il controllo di una tier list: uno solo, per tutte le strade da cui arriva.
 *
 * Una tier list entra da tre porte: il salvataggio sull'account (un'azione, che
 * il browser puo' chiamare con qualunque cosa, anche senza il Maker), il link
 * `#data=` e la bozza nel localStorage (tutti e due scrivibili da chiunque).
 * Fino al 24/10 ognuna si fidava a modo suo: il server accettava righe ed eroi
 * senza tetto, id che il gioco non ha, lo stesso eroe in tre righe e qualunque
 * colore; il Maker apriva `#data=[{}]` e la pagina cadeva. Lo schema sta qui, in
 * un modulo normale, perche' lo usano sia l'azione sia il componente nel browser.
 *
 * Gli eroi ammessi arrivano come insieme di id e non dal registro dei giochi:
 * nel browser il Maker ha gia' il roster, e importare il modulo del gioco
 * porterebbe nel pacchetto tutti i dati del gioco.
 *
 * I messaggi dello schema sono codici (`TierListProblem`), non testi: lo stesso
 * schema gira nel browser, dove un dato non valido si ignora e basta, e sul
 * server, dove l'azione traduce il codice nella lingua di chi salva.
 */

import { z } from "zod";
import { LEGACY_TIER_COLORS, TIER_COLORS, type TierRow } from "./types";

export const TIER_LIST_LIMITS = {
  /**
   * Righe di un tabellone. Prima non c'era nessun tetto, ne' nel Maker ne' sul
   * server; le predefinite sono sei, e venti lasciano spazio a ogni schema di
   * tier sensato. Il Maker smette di farne aggiungere allo stesso numero, cosi'
   * non si costruisce mai qualcosa che il server poi rifiuta.
   */
  rows: 20,
  /** Caratteri dell'etichetta di una riga: quelli che il campo di rinomina ha sempre permesso. */
  label: 12,
  title: 80,
  description: 300,
  /** Liste salvate per account e per gioco, controllate quando se ne crea una. */
  listsPerGame: 50,
} as const;

/** Cosa non va in una tier list: l'azione lo traduce, il Maker la ignora. */
export type TierListProblem =
  | "invalid"
  | "title-missing"
  | "title-long"
  | "description-long"
  | "rows-empty"
  | "rows-many"
  | "row"
  | "label"
  | "color"
  | "hero-unknown"
  | "hero-duplicate";

const PROBLEMS: ReadonlySet<string> = new Set<TierListProblem>([
  "invalid",
  "title-missing",
  "title-long",
  "description-long",
  "rows-empty",
  "rows-many",
  "row",
  "label",
  "color",
  "hero-unknown",
  "hero-duplicate",
]);

/**
 * Solo i colori che il Maker offre, o ha offerto: un colore qualsiasi finirebbe
 * tale e quale nel PNG e nel profilo. Quelli di prima del 24/10 restano validi,
 * perche' le liste salvate e i backup li hanno ancora.
 */
const COLORS: ReadonlySet<string> = new Set([
  ...TIER_COLORS.map((color) => color.hex),
  ...LEGACY_TIER_COLORS,
]);

function tierRowSchema(roster: ReadonlySet<string>) {
  return z.object({
    id: z.string().min(1, "row").max(64, "row"),
    label: z.string().trim().min(1, "label").max(TIER_LIST_LIMITS.label, "label"),
    color: z.string().refine((value) => COLORS.has(value), "color"),
    // piu' eroi di quanti ne ha il roster vorrebbe dire per forza un doppione
    heroIds: z
      .array(z.string().refine((id) => roster.has(id), "hero-unknown"))
      .max(roster.size, "hero-duplicate"),
  });
}

/**
 * Le righe di una tier list. Ogni eroe al massimo una volta in tutta la lista,
 * non solo nella sua riga: il Maker toglie un eroe dalla riga di prima quando lo
 * sposta, e un doppione puo' arrivare solo da dati scritti a mano. Anche gli id
 * delle righe sono unici: il Maker ci aggancia il trascinamento.
 */
export function tierRowsSchema(roster: ReadonlySet<string>) {
  return z
    .array(tierRowSchema(roster))
    .min(1, "rows-empty")
    .max(TIER_LIST_LIMITS.rows, "rows-many")
    .superRefine((rows, ctx) => {
      const rowIds = new Set<string>();
      const heroIds = new Set<string>();
      rows.forEach((row, index) => {
        if (rowIds.has(row.id)) {
          ctx.addIssue({ code: "custom", message: "row", path: [index, "id"] });
        }
        rowIds.add(row.id);
        for (const heroId of row.heroIds) {
          if (heroIds.has(heroId)) {
            ctx.addIssue({ code: "custom", message: "hero-duplicate", path: [index, "heroIds"] });
            return;
          }
          heroIds.add(heroId);
        }
      });
    });
}

/** Quello che il salvataggio sull'account riceve. */
export function saveTierListSchema(roster: ReadonlySet<string>) {
  return z.object({
    id: z.uuid().optional(),
    game: z.string().min(1).max(64),
    title: z
      .string()
      .trim()
      .min(1, "title-missing")
      .max(TIER_LIST_LIMITS.title, "title-long"),
    description: z
      .string()
      .trim()
      .max(TIER_LIST_LIMITS.description, "description-long")
      .optional(),
    tiers: tierRowsSchema(roster),
    // visibile nel profilo e apribile col link: com'era prima che si potesse scegliere
    isPublic: z.boolean().default(true),
  });
}

/** Le righe se sono valide, altrimenti null: chi apre un link rotto trova il suo tabellone. */
export function parseTierRows(raw: unknown, roster: ReadonlySet<string>): TierRow[] | null {
  const parsed = tierRowsSchema(roster).safeParse(raw);
  return parsed.success ? parsed.data : null;
}

/** Il primo problema di uno schema fallito; "invalid" se e' un errore di forma di zod. */
export function tierListProblem(error: z.ZodError): TierListProblem {
  const message = error.issues[0]?.message;
  return message !== undefined && PROBLEMS.has(message) ? (message as TierListProblem) : "invalid";
}

const TIER_LIST_ID = z.uuid();

/**
 * L'id di una tier list, se e' un UUID; altrimenti null.
 *
 * Da `?id=` arriva qualunque cosa, anche un elenco (`?id=a&id=b`), e Postgres
 * rifiuta un testo che non e' un UUID con un errore (22P02) che diventava una
 * pagina 500. Un id non valido vale come una lista che non esiste.
 */
export function parseTierListId(value: unknown): string | null {
  const parsed = TIER_LIST_ID.safeParse(value);
  return parsed.success ? parsed.data : null;
}

/**
 * Il titolo di una copia («… (Copia)») dentro il limite del titolo.
 *
 * Il suffisso aggiunto a un titolo gia' lungo 80 caratteri lo portava a 88, e
 * il server rifiutava la copia. Si accorcia l'originale, per punti di codice:
 * tagliare per unita' UTF-16 puo' spezzare un'emoji a meta'.
 */
export function copyTitle(title: string, suffix: string): string {
  const room = TIER_LIST_LIMITS.title - suffix.length;
  let kept = "";
  for (const char of title.trim()) {
    if (kept.length + char.length > room) break;
    kept += char;
  }
  return `${kept.trimEnd()}${suffix}`;
}
