import type { Metadata } from "next";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { databaseReachable } from "@/lib/db";
import { entitlementFor } from "@/lib/billing/entitlement";
import { testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { CUSTOMIZATION_GROUPS } from "@/lib/profile/customization";
import { buttonClass, cx, display, eyebrow, Notice, SectionHead, Tag } from "@/components/ui";
import { formatDate } from "@/components/freshness";

const TESTI = testi({
  it: {
    titoloPagina: "Premium",
    descrizionePagina:
      "Cosa si compra su Heiki e cosa no: si vende presentazione del profilo, mai posizione nel feed né badge.",
    statoAbbonamento: {
      ACTIVE: "attivo",
      TRIALING: "in prova",
      PAST_DUE: "rinnovo non riuscito",
      CANCELED: "disdetto",
    },
    sostegno: "Sostegno",
    titolo: "Si compra come appari. Non quanto conti.",
    introduzione:
      "Premium apre le opzioni di personalizzazione del profilo e la scheda condivisibile. Non tocca niente di quello che gli altri usano per decidere se fidarsi di te.",
    ilTuoAbbonamento: (stato: string) => `Il tuo abbonamento è ${stato}`,
    validoFinoAl: (data: string) => `, valido fino al ${data}`,
    opzioniAperte: "Le opzioni premium sono aperte:",
    personalizzaIlProfiloLink: "personalizza il profilo",
    opzioniChiuse: "Le opzioni premium sono chiuse fino al prossimo rinnovo riuscito.",
    cosaApre: "Cosa apre",
    vantaggi: [
      {
        titolo: "Cosmetici del profilo",
        testo: "Accenti, cornici e sfondi in più. Sono disegni nostri: nessun materiale dei publisher, mai.",
      },
      {
        titolo: "Scheda condivisibile",
        testo:
          "Un'immagine del profilo da mandare in giro, con i badge che hai guadagnato e il livello raggiunto.",
      },
      {
        titolo: "L'accento ti segue",
        testo:
          "Il colore scelto compare accanto al tuo nome in ogni discussione, non solo sulla tua pagina.",
      },
      {
        titolo: "Niente pubblicità",
        testo:
          "Gli spazi pubblicitari non sono ancora attivi da nessuna parte. Quando lo saranno, l'abbonamento li spegne.",
      },
    ],
    cosaNonApre: "Cosa non apre, mai",
    esclusi: [
      {
        titolo: "Posizione nel feed",
        testo:
          "Le discussioni si ordinano per voti e data. Gli sponsor stanno in uno slot separato ed etichettato, che è una cosa diversa.",
      },
      {
        titolo: "Badge e livello",
        testo:
          "Si guadagnano con quello che fai. Un badge comprato non direbbe niente a nessuno, e renderebbe muti anche quelli guadagnati.",
      },
      {
        titolo: "Spunte di verifica",
        testo:
          "Il contrassegno «verificato» dipende dal fatto che il sito riesca a rifare i tuoi conti. Non è in vendita.",
      },
      {
        titolo: "Contenuti di gioco",
        testo:
          "Non vendiamo niente che assomigli a valuta o materiale di gioco: non è nostro e non sarebbe legale rivenderlo.",
      },
    ],
    opzioniIncluse: "Le opzioni incluse",
    inPiu: (n: number) => `${n} in più`,
    opzioniBase:
      "Le opzioni base restano gratuite e non sono di seconda scelta: un profilo senza abbonamento resta un profilo curato.",
    guardaUnProfilo: "Guarda com'è fatto un profilo",
    pagamentoNonCollegato: "Il pagamento non è ancora collegato",
    spiegazionePagamento:
      "Non c'è un pulsante per pagare perché non ci sarebbe niente dietro. Quando l'incasso sarà attivo, all'acquisto verranno chiesti il paese per l'IVA e la rinuncia esplicita al diritto di recesso — obbligatoria sui beni digitali resi subito disponibili, e già prevista dallo schema del database. Fino ad allora questa pagina descrive il piano, non lo vende.",
    personalizzaIlProfilo: "Personalizza il profilo",
    condizioni: "Condizioni",
    modalitaDimostrativa:
      "Modalità dimostrativa: senza database non c'è nessun abbonamento da leggere, e questa pagina mostra solo il piano.",
  },
  en: {
    titoloPagina: "Premium",
    descrizionePagina:
      "What you can buy on Heiki and what you can't: we sell profile presentation, never feed position or badges.",
    statoAbbonamento: {
      ACTIVE: "active",
      TRIALING: "in its trial period",
      PAST_DUE: "past due",
      CANCELED: "canceled",
    },
    sostegno: "Support us",
    titolo: "You can buy how you look. Not how much you count.",
    introduzione:
      "Premium unlocks profile customization options and the shareable card. It doesn't touch anything other people use to decide whether to trust you.",
    ilTuoAbbonamento: (stato: string) => `Your subscription is ${stato}`,
    validoFinoAl: (data: string) => `, valid until ${data}`,
    opzioniAperte: "Premium options are unlocked:",
    personalizzaIlProfiloLink: "customize your profile",
    opzioniChiuse: "Premium options are locked until the next successful renewal.",
    cosaApre: "What it unlocks",
    vantaggi: [
      {
        titolo: "Profile cosmetics",
        testo: "Extra accents, frames and backgrounds. They're our own designs: no publisher assets, ever.",
      },
      {
        titolo: "Shareable card",
        testo:
          "A profile image to pass around, with the badges you've earned and the level you've reached.",
      },
      {
        titolo: "Your accent follows you",
        testo:
          "The color you pick appears next to your name in every discussion, not just on your own page.",
      },
      {
        titolo: "No ads",
        testo:
          "Ad slots aren't live anywhere yet. When they are, your subscription switches them off.",
      },
    ],
    cosaNonApre: "What it never unlocks",
    esclusi: [
      {
        titolo: "Feed position",
        testo:
          "Discussions are sorted by votes and date. Sponsors sit in a separate, labeled slot, which is a different thing.",
      },
      {
        titolo: "Badges and level",
        testo:
          "You earn them through what you do. A bought badge would mean nothing to anyone, and would silence the earned ones too.",
      },
      {
        titolo: "Verification checkmarks",
        testo:
          "The “verified” mark depends on whether the site can redo your calculations. It's not for sale.",
      },
      {
        titolo: "Game content",
        testo:
          "We don't sell anything resembling in-game currency or items: it isn't ours, and reselling it wouldn't be legal.",
      },
    ],
    opzioniIncluse: "What's included",
    inPiu: (n: number) => `${n} extra`,
    opzioniBase:
      "The basic options stay free and they're not second-rate: a profile without a subscription is still a polished profile.",
    guardaUnProfilo: "See what a profile looks like",
    pagamentoNonCollegato: "Payments aren't connected yet",
    spiegazionePagamento:
      "There's no pay button because there would be nothing behind it. Once payments go live, checkout will ask for your country for VAT and for an explicit waiver of the right of withdrawal — mandatory for digital goods made available immediately, and already provided for in the database schema. Until then, this page describes the plan; it doesn't sell it.",
    personalizzaIlProfilo: "Customize your profile",
    condizioni: "Terms",
    modalitaDimostrativa:
      "Demo mode: without a database there's no subscription to read, and this page only shows the plan.",
  },
});

export async function generateMetadata(): Promise<Metadata> {
  const t = TESTI[await getLocale()];
  return {
    title: t.titoloPagina,
    description: t.descrizionePagina,
  };
}

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
  const locale = await getLocale();
  const t = TESTI[locale];

  const session = await safeSession();
  const entitlement = session?.user?.id
    ? await entitlementFor(session.user.id)
    : { premium: false, status: "none" as const, renewsAt: null };

  const premiumOptions = CUSTOMIZATION_GROUPS.flatMap((group) =>
    group.options
      .filter((option) => option.premium)
      .map((option) => ({
        id: option.id,
        group: group.labels[locale],
        label: option.labels[locale],
        description: option.descriptions[locale],
      })),
  );

  return (
    <main className="mx-auto w-full max-w-[1000px] px-6 pt-11 pb-24">
      <header className="mb-9 max-w-[64ch]">
        <p className={eyebrow}>{t.sostegno}</p>
        <h1 className={cx(display, "mt-3 text-[clamp(30px,4.4vw,48px)]")}>{t.titolo}</h1>
        <p className="mt-4 text-base text-ink-2">{t.introduzione}</p>
      </header>

      {entitlement.status !== "none" ? (
        <Notice
          tone={entitlement.premium ? "info" : "warn"}
          className="mb-9"
        >
          <span>
            {t.ilTuoAbbonamento(t.statoAbbonamento[entitlement.status])}
            {entitlement.renewsAt ? t.validoFinoAl(formatDate(entitlement.renewsAt, locale)) : ""}.{" "}
            {entitlement.premium ? (
              <>
                {t.opzioniAperte}{" "}
                <Link
                  href="/impostazioni/profilo"
                  className="font-semibold text-brand-deep hover:underline"
                >
                  {t.personalizzaIlProfiloLink}
                </Link>
                .
              </>
            ) : (
              t.opzioniChiuse
            )}
          </span>
        </Notice>
      ) : null}

      <div className="mb-12 grid gap-4 md:grid-cols-2">
        <section className="rounded-card border border-rule border-t-[3px] border-t-brand bg-paper p-6">
          <h2 className={cx(display, "mb-4 text-xl")}>{t.cosaApre}</h2>
          <ul className="m-0 grid list-none gap-3 p-0 text-sm">
            {t.vantaggi.map(({ titolo, testo }) => (
              <li key={titolo}>
                <strong className="block font-semibold">{titolo}</strong>
                <span className="text-ink-2">{testo}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-card border border-rule border-t-[3px] border-t-hot bg-paper p-6">
          <h2 className={cx(display, "mb-4 text-xl")}>{t.cosaNonApre}</h2>
          <ul className="m-0 grid list-none gap-3 p-0 text-sm">
            {t.esclusi.map(({ titolo, testo }) => (
              <li key={titolo}>
                <strong className="block font-semibold">{titolo}</strong>
                <span className="text-ink-2">{testo}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mb-12">
        <SectionHead
          title={t.opzioniIncluse}
          aside={
            <span className="font-display font-bold [font-variation-settings:'wdth'_82] text-[12px] uppercase tracking-[0.06em] text-ink-3">
              {t.inPiu(premiumOptions.length)}
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
          {t.opzioniBase}{" "}
          <Link href="/anteprima/profilo" className="font-semibold text-brand-deep hover:underline">
            {t.guardaUnProfilo}
          </Link>
          .
        </p>
      </section>

      <section className="rounded-card border border-rule bg-paper-2 p-6">
        <h2 className={cx(display, "mb-3 text-xl")}>{t.pagamentoNonCollegato}</h2>
        <p className="m-0 max-w-[48ch] text-sm text-ink-2">{t.spiegazionePagamento}</p>

        <div className="mt-5 flex flex-wrap gap-3">
          <Link href="/impostazioni/profilo" className={buttonClass("primary")}>
            {t.personalizzaIlProfilo}
          </Link>
          <Link href="/legale/termini" className={buttonClass("outline")}>
            {t.condizioni}
          </Link>
        </div>
      </section>

      {!(await databaseReachable()) ? (
        <p className="mt-6 text-[13px] text-ink-3">{t.modalitaDimostrativa}</p>
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
