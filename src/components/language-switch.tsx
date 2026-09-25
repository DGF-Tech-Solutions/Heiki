"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocale } from "@/lib/i18n/actions";
import { useLocale } from "@/lib/i18n/client";
import { LOCALES, testi } from "@/lib/i18n/locale";
import { cx } from "./ui";

const TESTI = testi({
  it: { gruppo: "Lingua del sito", nomi: { it: "Italiano", en: "Inglese" } },
  en: { gruppo: "Site language", nomi: { it: "Italian", en: "English" } },
});

/**
 * IT | EN nell'intestazione.
 *
 * Due pulsanti e non una tendina: le lingue sono due, e una tendina nasconde
 * quale e' attiva dietro un clic. Ogni pulsante dichiara la sua lingua (`lang`)
 * e il suo stato (`aria-pressed`), cosi' un lettore di schermo pronuncia «EN»
 * in inglese e dice quale lingua e' scelta.
 */
export function LanguageSwitch() {
  const locale = useLocale();
  const router = useRouter();
  const [inCorso, avvia] = useTransition();
  const t = TESTI[locale];

  return (
    <div
      role="group"
      aria-label={t.gruppo}
      className="flex shrink-0 items-center rounded-card border border-rule p-0.5 font-mono text-[10px] uppercase tracking-[0.08em]"
    >
      {LOCALES.map((lingua) => (
        <button
          key={lingua}
          type="button"
          lang={lingua}
          title={t.nomi[lingua]}
          aria-pressed={lingua === locale}
          disabled={inCorso}
          onClick={() => {
            if (lingua === locale) return;
            avvia(async () => {
              await setLocale(lingua);
              router.refresh();
            });
          }}
          className={cx(
            "rounded-sm px-1.5 py-0.5 transition-colors disabled:opacity-60",
            lingua === locale ? "bg-ink text-paper" : "text-ink-3 hover:text-ink",
          )}
        >
          {lingua}
        </button>
      ))}
    </div>
  );
}
