"use client";

import { createContext, useContext } from "react";
import { DEFAULT_LOCALE, type Locale } from "./locale";

const LinguaContext = createContext<Locale>(DEFAULT_LOCALE);

/**
 * Porta la lingua ai componenti che girano nel browser. La sceglie il layout
 * radice, che legge il cookie sul server: cosi' il primo disegno e' gia' nella
 * lingua giusta, senza un lampo di italiano prima dell'inglese.
 */
export function LocaleProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LinguaContext.Provider value={locale}>{children}</LinguaContext.Provider>;
}

/** La lingua scelta, dentro un componente client. */
export function useLocale(): Locale {
  return useContext(LinguaContext);
}
