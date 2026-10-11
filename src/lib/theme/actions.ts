"use server";

import { cookies } from "next/headers";
import { isTheme, THEME_COOKIE } from "./themes";

/**
 * Ricorda il tema scelto. Il cookie dura un anno e vale per tutto il sito, come
 * quello della lingua.
 *
 * Niente `revalidatePath`, a differenza di setLocale: il colore cambia gia' nel
 * browser (il selettore riscrive `data-theme` su `<html>`), il server non ha
 * testi da ridisegnare. E scrivere un cookie in un'azione basta a Next per
 * ridisegnare la pagina aperta: il layout rilegge il tema e il `theme-color`
 * della barra del telefono lo segue.
 *
 * Un tema che non esiste non si scrive: il valore arriva dal browser.
 */
export async function setTheme(theme: string): Promise<void> {
  if (!isTheme(theme)) return;
  (await cookies()).set(THEME_COOKIE, theme, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
