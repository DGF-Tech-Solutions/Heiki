import { SectionTabs } from "@/components/section-tabs";
import { cx, Notice } from "@/components/ui";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { LEGAL_DOCUMENTS } from "@/lib/legal/documents";
import { MISSING_FIELD_LABELS } from "@/lib/legal/operator";
import { legalReadiness } from "@/lib/legal/readiness";

const TESTI = testi({
  it: {
    documentiLegali: "Documenti legali",
    bozza: "Bozza, da non pubblicare così.",
    mancanoDati: (cosa: string) => `Mancano i dati del gestore: ${cosa}.`,
    mancanoFunzioni: (cosa: string) => `Il sito non fa ancora: ${cosa}.`,
    dove: "I dati si scrivono in src/lib/legal/operator.ts, le funzioni mancanti sono in src/lib/legal/readiness.ts. Prima di andare online i testi vanno fatti rivedere da un legale.",
  },
  en: {
    documentiLegali: "Legal documents",
    bozza: "Draft, not to be published as is.",
    mancanoDati: (cosa: string) => `The operator's details are missing: ${cosa}.`,
    mancanoFunzioni: (cosa: string) => `The site does not do this yet: ${cosa}.`,
    dove: "The details go in src/lib/legal/operator.ts; the missing features are listed in src/lib/legal/readiness.ts. Before going online the texts must be reviewed by a lawyer.",
  },
});

/**
 * Guscio delle pagine legali.
 *
 * Sono documenti da leggere, non schermate da usare: colonna singola, misura di
 * riga corta, gerarchia semplice. La navigazione fra i documenti resta visibile
 * perche' chi arriva su uno di solito deve controllarne anche un altro; nomi e
 * ordine vengono da LEGAL_DOCUMENTS, gli stessi del pie' di pagina.
 *
 * In cima, finche' manca qualcosa, l'elenco di cosa (src/lib/legal/readiness.ts):
 * fino al 25/10 c'era solo una riga in fondo, «documento in bozza», che non
 * diceva cosa mancasse. Sparisce da sola quando i dati ci sono tutti.
 *
 * La classe `legal-prose` porta la tipografia del testo lungo: definirla una
 * volta qui evita di ripetere gli stessi stili in ogni documento.
 */
export default async function LegalLayout({ children }: { children: React.ReactNode }) {
  const locale = await getLocale();
  const t = TESTI[locale];
  const readiness = legalReadiness();

  return (
    <main className="mx-auto w-full max-w-[760px] px-6 pt-10 pb-24">
      <SectionTabs
        label={t.documentiLegali}
        tabs={LEGAL_DOCUMENTS.map((doc) => ({ href: doc.href, label: doc.label[locale] }))}
        className="mb-8 flex flex-wrap gap-1.5"
      />

      {readiness.ready ? null : (
        <Notice tone="warn" className="mb-8">
          <div className="grid gap-1.5">
            <p className="m-0 font-semibold">{t.bozza}</p>
            {readiness.missingFields.length > 0 ? (
              <p className="m-0">
                {t.mancanoDati(readiness.missingFields.map((field) => MISSING_FIELD_LABELS[field][locale]).join(", "))}
              </p>
            ) : null}
            {readiness.pendingFeatures.length > 0 ? (
              <p className="m-0">{t.mancanoFunzioni(readiness.pendingFeatures.map((item) => item.label[locale]).join("; "))}</p>
            ) : null}
            <p className="m-0">{t.dove}</p>
          </div>
        </Notice>
      )}

      <div
        className={cx(
          "legal-prose",
          "[&_h2]:mt-9 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:uppercase [&_h2]:tracking-[-0.02em]",
          "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold",
          "[&_p]:mb-3.5 [&_p]:leading-[1.7] [&_p]:text-ink-2",
          "[&_ul]:mb-3.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-ink-2 [&_li]:mb-1.5 [&_li]:leading-[1.6]",
          "[&_ol]:mb-3.5 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:text-ink-2",
          "[&_strong]:text-ink [&_a]:font-semibold [&_a]:text-ink [&_a]:underline [&_a]:decoration-brand [&_a]:decoration-2 [&_a]:underline-offset-2 [&_a:hover]:text-brand-deep",
          "[&_table]:mb-4 [&_table]:w-full [&_table]:border [&_table]:border-rule [&_table]:text-sm",
          "[&_th]:border-b [&_th]:border-rule [&_th]:bg-paper-2 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:align-top",
          "[&_td]:border-b [&_td]:border-rule-2 [&_td]:px-3 [&_td]:py-2 [&_td]:text-ink-2 [&_td]:align-top",
          "[&_code]:font-mono [&_code]:text-[0.92em] [&_code]:text-ink",
        )}
      >
        {children}
      </div>
    </main>
  );
}
