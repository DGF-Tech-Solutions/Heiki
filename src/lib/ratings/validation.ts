/**
 * Il controllo dei dati di una valutazione, prima che arrivino al database.
 *
 * Sta fuori da actions.ts perche' quello e' un modulo "use server": li' ogni
 * funzione async esportata diventa un'azione raggiungibile dal browser, e lo
 * schema e' una regola interna. Qui lo importano i test, che lo provano coi
 * valori che FormData consegna davvero, null compreso.
 *
 * Che il gioco e l'eroe esistano lo controlla l'azione col registro dei giochi:
 * qui si guarda solo la forma dei dati, e il modulo resta senza i dati di gioco.
 */

import { z } from "zod";
import { testi, type Locale } from "@/lib/i18n/locale";
import { COMMENT_MAX_LENGTH, isBestContentKey, type BestContentKey } from "./types";

const TESTI = testi({
  it: {
    datiNonValidi: "Dati della valutazione non validi.",
    pveObbligatorio: "Seleziona un voto PvE da 1 a 5 stelle.",
    pvpObbligatorio: "Seleziona un voto PvP da 1 a 5 stelle.",
    commentoLungo: `Il commento non può superare i ${COMMENT_MAX_LENGTH} caratteri.`,
  },
  en: {
    datiNonValidi: "Invalid rating data.",
    pveObbligatorio: "Please select a PvE rating between 1 and 5 stars.",
    pvpObbligatorio: "Please select a PvP rating between 1 and 5 stars.",
    commentoLungo: `Comment cannot exceed ${COMMENT_MAX_LENGTH} characters.`,
  },
});

/**
 * Lo schema nella lingua di chi scrive: i messaggi d'errore arrivano a lui.
 *
 * I campi facoltativi accettano null, non solo undefined: `formData.get()` da'
 * null per un campo assente, e il modulo omette «dove spicca» e il commento
 * quando sono vuoti. Fino al 24/10 erano `.optional()`, e chi votava senza
 * commento riceveva «Invalid input: expected string, received null»: il voto non
 * si salvava.
 */
export function ratingInputSchema(locale: Locale) {
  const t = TESTI[locale];
  // un voto assente diventa 0 (Number(null)) o NaN: tutti e due finiscono sul
  // messaggio che dice cosa fare, non su quello generico di zod
  const score = (message: string) =>
    z.coerce.number({ error: message }).int(message).min(1, message).max(5, message);

  return z.object({
    game: z.string({ error: t.datiNonValidi }).trim().min(1, t.datiNonValidi).max(64, t.datiNonValidi),
    heroId: z.string({ error: t.datiNonValidi }).trim().min(1, t.datiNonValidi).max(32, t.datiNonValidi),
    pveScore: score(t.pveObbligatorio),
    pvpScore: score(t.pvpObbligatorio),
    // vuoto o solo spazi = nessuna scelta; una chiave che non esiste e' un errore,
    // non una scelta da ignorare: il modulo non la manda mai
    bestContent: z
      .string({ error: t.datiNonValidi })
      .nullish()
      .transform((value, ctx): BestContentKey | null => {
        const key = value?.trim();
        if (!key) return null;
        if (isBestContentKey(key)) return key;
        ctx.addIssue({ code: "custom", message: t.datiNonValidi });
        return z.NEVER;
      }),
    comment: z
      .string({ error: t.datiNonValidi })
      .nullish()
      .transform((value) => value?.trim() || null)
      .refine((value) => value === null || value.length <= COMMENT_MAX_LENGTH, t.commentoLungo),
  });
}

export type RatingInput = z.output<ReturnType<typeof ratingInputSchema>>;

export type RatingParse = { ok: true; data: RatingInput } | { ok: false; error: string };

/** I campi del modulo, letti come li legge l'azione, col primo errore gia' tradotto. */
export function parseRatingForm(formData: FormData, locale: Locale): RatingParse {
  const parsed = ratingInputSchema(locale).safeParse({
    game: formData.get("game"),
    heroId: formData.get("heroId"),
    pveScore: formData.get("pveScore"),
    pvpScore: formData.get("pvpScore"),
    bestContent: formData.get("bestContent"),
    comment: formData.get("comment"),
  });
  if (parsed.success) return { ok: true, data: parsed.data };
  return { ok: false, error: parsed.error.issues[0]?.message ?? TESTI[locale].datiNonValidi };
}
