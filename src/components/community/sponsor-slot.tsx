import type { SponsorItem } from "@/lib/community/types";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { safeHref } from "@/lib/markdown";

const TESTI = testi({
  it: { contenuto: "Contenuto sponsorizzato", etichetta: "Sponsorizzato" },
  en: { contenuto: "Sponsored content", etichetta: "Sponsored" },
});

/**
 * Spazio sponsorizzato.
 *
 * Sta FUORI dalla lista dei post e non entra mai nell'ordinamento. Non esiste un
 * modo per pagare ed essere piu' in alto nel feed organico: la separazione e'
 * strutturale - tabella separata, componente separato, posizione separata - non
 * una convenzione che qualcuno un giorno dimentichera'.
 *
 * L'etichetta e' obbligatoria e sempre visibile (DSA).
 *
 * L'indirizzo passa da safeHref come quelli delle guide: arriva dal database,
 * e fino all'11/10 finiva nell'href cosi' com'era. Un `javascript:` scritto
 * nel pannello degli sponsor (o in una riga alterata) sarebbe stato codice
 * eseguito al clic da chiunque leggesse le discussioni. Una voce con indirizzo
 * rifiutato non compare: uno spazio a pagamento senza destinazione non serve
 * a nessuno.
 */
export async function SponsorSlot({ items }: { items: readonly SponsorItem[] }) {
  const safe = items.flatMap((item) => {
    const href = safeHref(item.targetUrl);
    return href ? [{ ...item, href }] : [];
  });
  if (safe.length === 0) return null;
  const t = TESTI[await getLocale()];

  return (
    <aside className="p5-corner border border-rule bg-paper-2 p-4" aria-label={t.contenuto}>
      <span className="mb-2.5 block font-display font-bold [font-variation-settings:'wdth'_82] text-[12px] uppercase tracking-[0.06em] text-ink-3">
        {t.etichetta}
      </span>

      {safe.map((item, index) => (
        <div
          key={item.id}
          className={index > 0 ? "mt-3.5 border-t border-rule-2 pt-3.5" : undefined}
        >
          <a
            href={item.href}
            rel="nofollow sponsored noopener"
            className="text-sm font-medium hover:underline"
          >
            {item.title}
          </a>
          {item.body ? <p className="mt-1.5 text-xs leading-relaxed text-ink-3">{item.body}</p> : null}
          <span className="mt-2 block font-mono text-[11px] text-ink-3">{item.advertiser}</span>
        </div>
      ))}
    </aside>
  );
}
