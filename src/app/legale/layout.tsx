import Link from "next/link";
import { cx, eyebrow } from "@/components/ui";

const PAGES = [
  { href: "/legale/privacy", label: "Privacy" },
  { href: "/legale/termini", label: "Termini" },
  { href: "/legale/cookie", label: "Cookie" },
];

/**
 * Guscio delle pagine legali.
 *
 * Sono documenti da leggere, non schermate da usare: colonna singola, misura di
 * riga corta, gerarchia semplice. La navigazione fra i tre resta visibile perche'
 * chi arriva su una di solito deve controllarne anche un'altra.
 *
 * La classe `legal-prose` porta la tipografia del testo lungo: definirla una
 * volta qui evita di ripetere gli stessi stili in tre file.
 */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-[760px] px-6 pt-10 pb-24">
      <nav aria-label="Documenti legali" className="mb-8 flex flex-wrap gap-2">
        {PAGES.map((page) => (
          <Link
            key={page.href}
            href={page.href}
            className="inline-flex h-8 items-center rounded-card border border-rule px-3 text-[13px] text-ink-2 hover:border-ink-3 hover:text-ink"
          >
            {page.label}
          </Link>
        ))}
      </nav>

      <div
        className={cx(
          "legal-prose",
          "[&_h2]:mt-9 [&_h2]:mb-3 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:uppercase [&_h2]:tracking-[-0.02em]",
          "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-base [&_h3]:font-semibold",
          "[&_p]:mb-3.5 [&_p]:leading-[1.7] [&_p]:text-ink-2",
          "[&_ul]:mb-3.5 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-ink-2 [&_li]:mb-1.5 [&_li]:leading-[1.6]",
          "[&_strong]:text-ink [&_a]:font-semibold [&_a]:text-brand [&_a:hover]:underline",
          "[&_table]:mb-4 [&_table]:w-full [&_table]:border [&_table]:border-rule [&_table]:text-sm",
          "[&_th]:border-b [&_th]:border-rule [&_th]:bg-paper-2 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left",
          "[&_td]:border-b [&_td]:border-rule-2 [&_td]:px-3 [&_td]:py-2 [&_td]:text-ink-2",
        )}
      >
        {children}
      </div>

      <p className={cx(eyebrow, "mt-12 border-t border-rule pt-5")}>
        Documento in bozza — va rivisto da un legale prima della pubblicazione
      </p>
    </main>
  );
}
