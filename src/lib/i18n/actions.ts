"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { isLocale, LOCALE_COOKIE } from "./locale";

/**
 * Cambia la lingua del sito. Il cookie dura un anno e vale per tutto il sito;
 * `revalidatePath` sul layout radice fa ridisegnare la pagina aperta nella
 * lingua nuova, senza perdere il posto.
 *
 * Una lingua che non esiste non si scrive: il valore arriva dal browser.
 */
export async function setLocale(locale: string): Promise<void> {
  if (!isLocale(locale)) return;
  (await cookies()).set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  revalidatePath("/", "layout");
}
