import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { databaseReachable } from "@/lib/db";
import { entitlementFor } from "@/lib/billing/entitlement";
import { CUSTOMIZATION_GROUPS } from "@/lib/profile/customization";
import { buttonClass, cx, display, eyebrow, Notice, SectionHead, Tag } from "@/components/ui";
import { formatDate } from "@/components/freshness";

export const metadata: Metadata = {
  title: "Premium",
  description:
    "Cosa si compra su GachaZone e cosa no: si vende presentazione del profilo, mai posizione nel feed né badge.",
};

const STATUS_TEXT: Record<string, string> = {
  ACTIVE: "attivo",
  TRIALING: "in prova",
  PAST_DUE: "rinnovo non riuscito",
  CANCELED: "disdetto",
};

/**
 * Pagina Premium.
 *
 * Metà della pagina spiega cosa NON si compra. Non e' modestia: e' la
 * condizione perche' il resto del sito valga qualcosa. Se si potesse pagare per
 * salire nel feed, il feed non sarebbe piu' una fonte; se si potessero comprare
 * i badge, un badge non direbbe piu' niente di chi lo porta.
 *
 * Il pagamento non e' collegato. La pagina lo dice invece di mostrare un
 * pulsante che finge: un finto acquisto e' il modo piu' rapido per perdere la
 * fiducia di chi stava per pagare davvero.
 */
export default async function PremiumPage() {
  const session = await safeSession();
  const entitlement = session?.user?.id
    ? await entitlementFor(session.user.id)
    : { premium: false, status: "none" as const, renewsAt: null };

  const premiumOptions = CUSTOMIZATION_GROUPS.flatMap((group) =>
    group.options
      .filter((option) => option.premium)
      .map((option) => ({ group: group.label, ...option })),
  );

  return (
    <main className="mx-auto w-full max-w-[1000px] px-6 pt-11 pb-24">
      <header className="mb-9 max-w-[64ch]">
        <p className={eyebrow}>Sostegno</p>
        <h1 className={cx(display, "mt-3 text-[clamp(30px,4.4vw,48px)]")}>
          Si compra come appari. Non quanto conti.
        </h1>
        <p className="mt-4 text-base text-ink-2">
          Premium apre le opzioni di personalizzazione del profilo e la scheda condivisibile. Non
          tocca niente di quello che gli altri usano per decidere se fidarsi di te.
        </p>
      </header>

      {entitlement.status !== "none" ? (
        <Notice
          tone={entitlement.premium ? "info" : "warn"}
          className="mb-9"
        >
          <span>
            Il tuo abbonamento è {STATUS_TEXT[entitlement.status] ?? entitlement.status}
            {entitlement.renewsAt ? `, valido fino al ${formatDate(entitlement.renewsAt)}` : ""}.{" "}
            {entitlement.premium ? (
              <>
                Le opzioni premium sono aperte:{" "}
                <Link
                  href="/impostazioni/profilo"
                  className="font-semibold text-brand hover:underline"
                >
                  personalizza il profilo
                </Link>
                .
              </>
            ) : (
              "Le opzioni premium sono chiuse fino al prossimo rinnovo riuscito."
            )}
          </span>
        </Notice>
      ) : null}

      <div className="mb-12 grid gap-4 md:grid-cols-2">
        <section className="rounded-card border border-rule border-t-[3px] border-t-brand bg-paper p-6">
          <h2 className={cx(display, "mb-4 text-xl")}>Cosa apre</h2>
          <ul className="m-0 grid list-none gap-3 p-0 text-sm">
            {[
              [
                "Cosmetici del profilo",
                "Accenti, cornici e sfondi in più. Sono disegni nostri: nessun materiale dei publisher, mai.",
              ],
              [
                "Scheda condivisibile",
                "Un'immagine del profilo da mandare in giro, con i badge che hai guadagnato e il livello raggiunto.",
              ],
              [
                "L'accento ti segue",
                "Il colore scelto compare accanto al tuo nome in ogni discussione, non solo sulla tua pagina.",
              ],
              [
                "Niente pubblicità",
                "Gli spazi pubblicitari non sono ancora attivi da nessuna parte. Quando lo saranno, l'abbonamento li spegne.",
              ],
            ].map(([title, body]) => (
              <li key={title}>
                <strong className="block font-semibold">{title}</strong>
                <span className="text-ink-2">{body}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-card border border-rule border-t-[3px] border-t-hot bg-paper p-6">
          <h2 className={cx(display, "mb-4 text-xl")}>Cosa non apre, mai</h2>
          <ul className="m-0 grid list-none gap-3 p-0 text-sm">
            {[
              [
                "Posizione nel feed",
                "Le discussioni si ordinano per voti e data. Gli sponsor stanno in uno slot separato ed etichettato, che è una cosa diversa.",
              ],
              [
                "Badge e livello",
                "Si guadagnano con quello che fai. Un badge comprato non direbbe niente a nessuno, e renderebbe muti anche quelli guadagnati.",
              ],
              [
                "Spunte di verifica",
                "Il contrassegno «verificato» dipende dal fatto che il sito riesca a rifare i tuoi conti. Non è in vendita.",
              ],
              [
                "Contenuti di gioco",
                "Non vendiamo niente che assomigli a valuta o materiale di gioco: non è nostro e non sarebbe legale rivenderlo.",
              ],
            ].map(([title, body]) => (
              <li key={title}>
                <strong className="block font-semibold">{title}</strong>
                <span className="text-ink-2">{body}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mb-12">
        <SectionHead
          title="Le opzioni incluse"
          aside={
            <span className="font-mono text-[11px] uppercase tracking-[0.08em] text-ink-3">
              {premiumOptions.length} in più
            </span>
          }
        />

        <ul className="m-0 grid list-none gap-2.5 p-0 sm:grid-cols-2">
          {premiumOptions.map((option) => (
            <li
              key={`${option.group}-${option.id}`}
              className="rounded-card border border-rule bg-paper px-4 py-3"
            >
              <div className="mb-1 flex items-center gap-2">
                <Tag tone="gold">{option.group}</Tag>
                <span className="text-sm font-semibold">{option.label}</span>
              </div>
              <p className="m-0 text-[13px] text-ink-2">{option.description}</p>
            </li>
          ))}
        </ul>

        <p className="mt-4 text-[13px] text-ink-3">
          Le opzioni base restano gratuite e non sono di seconda scelta: un profilo senza
          abbonamento resta un profilo curato.{" "}
          <Link href="/anteprima/profilo" className="font-semibold text-brand hover:underline">
            Guarda com&apos;è fatto un profilo
          </Link>
          .
        </p>
      </section>

      <section className="rounded-card border border-rule bg-paper-2 p-6">
        <h2 className={cx(display, "mb-3 text-xl")}>Il pagamento non è ancora collegato</h2>
        <p className="m-0 max-w-[62ch] text-sm text-ink-2">
          Non c&apos;è un pulsante per pagare perché non ci sarebbe niente dietro. Quando l&apos;incasso
          sarà attivo, all&apos;acquisto verranno chiesti il paese per l&apos;IVA e la rinuncia esplicita
          al diritto di recesso — obbligatoria sui beni digitali resi subito disponibili, e già
          prevista dallo schema del database. Fino ad allora questa pagina descrive il piano, non lo
          vende.
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/impostazioni/profilo" className={buttonClass("primary")}>
            Personalizza il profilo
          </Link>
          <Link href="/legale/termini" className={buttonClass("outline")}>
            Condizioni
          </Link>
        </div>
      </section>

      {!(await databaseReachable()) ? (
        <p className="mt-6 text-[13px] text-ink-3">
          Modalità dimostrativa: senza database non c&apos;è nessun abbonamento da leggere, e questa
          pagina mostra solo il piano.
        </p>
      ) : null}
    </main>
  );
}

async function safeSession() {
  try {
    return await auth();
  } catch {
    return null;
  }
}
