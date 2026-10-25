/**
 * I pezzi comuni dei documenti legali: i dati del gestore (o il segno che
 * mancano), l'email di contatto, la data dell'ultimo aggiornamento, il riquadro
 * «In breve».
 *
 * Componenti del server, senza stato: ogni documento ha un blocco JSX per
 * lingua (vedi la pagina privacy) e passa la lingua a mano, cosi' un pezzo
 * scritto dentro il blocco italiano non puo' uscire in inglese.
 */

import type { ReactNode } from "react";
import { cx } from "@/components/ui";
import { intlLocale, type Locale } from "@/lib/i18n/locale";
import { mailtoHref } from "@/lib/legal/contact";
import { legalDocument, type LegalDocumentKey } from "@/lib/legal/documents";
import { MISSING_FIELD_LABELS, OPERATOR, type MissingField } from "@/lib/legal/operator";

/** Un dato del gestore che non c'e' ancora: si vede, e dice quale manca. */
export function Missing({ field, locale }: { field: MissingField; locale: Locale }) {
  const label = MISSING_FIELD_LABELS[field][locale];
  return (
    <span className="border border-dashed border-gold px-1.5 text-ink">
      {locale === "en" ? `to be completed: ${label}` : `da completare: ${label}`}
    </span>
  );
}

/** L'email del gestore come collegamento, o il segno che manca. */
export function ContactEmail({
  locale,
  subject,
  body,
  children,
}: {
  locale: Locale;
  subject?: string;
  body?: string;
  /** il testo del collegamento; senza, l'indirizzo stesso */
  children?: ReactNode;
}) {
  if (!OPERATOR.email) return <Missing field="email" locale={locale} />;
  return <a href={mailtoHref(OPERATOR.email, subject, body)}>{children ?? OPERATOR.email}</a>;
}

/** «Ultimo aggiornamento», con la data del documento in `LEGAL_DOCUMENTS`. */
export function LastUpdated({ document, locale }: { document: LegalDocumentKey; locale: Locale }) {
  const { updated } = legalDocument(document);
  // mezzogiorno UTC: la data resta quella anche a fusi orari lontani
  const text = new Intl.DateTimeFormat(intlLocale(locale), {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${updated}T12:00:00Z`));
  return (
    <p className="text-[13px] text-ink-3!">
      {locale === "en" ? "Last updated: " : "Ultimo aggiornamento: "}
      <time dateTime={updated}>{text}</time>
    </p>
  );
}

/**
 * «In breve»: le cose che contano prima del documento intero. E' l'approccio a
 * livelli delle linee guida europee sulla trasparenza: chi ha un minuto legge
 * questo, chi deve controllare un punto scende.
 */
export function Summary({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="p5-corner mb-8 border border-rule bg-paper-2 px-5 pt-4 pb-1">
      <h2 className="mt-0!">{title}</h2>
      {children}
    </section>
  );
}

/**
 * Il testo di un'email da mandare (una richiesta di rimozione, una
 * segnalazione): si legge e si copia dalla pagina, e il collegamento apre il
 * programma di posta con oggetto e testo gia' scritti. Senza l'email del
 * gestore mostra il segno che manca al posto del collegamento.
 */
export function EmailTemplate({
  locale,
  subject,
  body,
  action,
}: {
  locale: Locale;
  subject: string;
  body: string;
  /** il testo del collegamento, per esempio «Scrivi la richiesta» */
  action: string;
}) {
  const en = locale === "en";
  return (
    <div className="p5-corner mb-4 border border-rule bg-paper-2">
      <p className="m-0! border-b border-rule-2 px-4 py-2 text-[13px] text-ink-2!">
        <span className="font-semibold text-ink">{en ? "Subject: " : "Oggetto: "}</span>
        {subject}
      </p>
      <pre className="m-0 overflow-x-auto px-4 py-3 font-mono text-[13px] leading-relaxed whitespace-pre-wrap text-ink-2">{body}</pre>
      <p className="m-0! border-t border-rule-2 px-4 py-2.5 text-[13px]">
        {OPERATOR.email ? (
          <a href={mailtoHref(OPERATOR.email, subject, body)}>{action}</a>
        ) : (
          <Missing field="email" locale={locale} />
        )}
      </p>
    </div>
  );
}

/**
 * Una tabella che sul telefono scorre nel suo riquadro invece di allargare la
 * pagina: i nomi dei cookie (`__Secure-authjs.session-token`) non vanno a capo.
 */
export function TableScroll({ children }: { children: ReactNode }) {
  return <div className="overflow-x-auto [&_code]:[overflow-wrap:anywhere]">{children}</div>;
}

/**
 * I dati del gestore uno sotto l'altro: quelli che l'art. 7 del D.Lgs. 70/2003
 * vuole «facilmente accessibili, in modo diretto e permanente», piu' il capitale
 * sociale delle societa' di capitali (art. 2250 c.c.).
 */
export function OperatorDetails({ locale, className }: { locale: Locale; className?: string }) {
  const en = locale === "en";
  const rows: { label: string; value: ReactNode }[] = [
    { label: en ? "Company name" : "Ragione sociale", value: OPERATOR.name ?? <Missing field="name" locale={locale} /> },
    {
      label: en ? "Registered office" : "Sede legale",
      value: OPERATOR.registeredOffice ?? <Missing field="registeredOffice" locale={locale} />,
    },
    { label: en ? "VAT number" : "Partita IVA", value: OPERATOR.vatNumber ?? <Missing field="vatNumber" locale={locale} /> },
    {
      label: en ? "Company register" : "Registro delle imprese",
      value: OPERATOR.companyRegister ?? <Missing field="companyRegister" locale={locale} />,
    },
  ];
  if (OPERATOR.shareCapital !== false) {
    rows.push({
      label: en ? "Share capital" : "Capitale sociale",
      value: OPERATOR.shareCapital ?? <Missing field="shareCapital" locale={locale} />,
    });
  }
  if (OPERATOR.singleMember) {
    rows.push({ label: en ? "Shareholders" : "Soci", value: en ? "Single-member company" : "Società con socio unico" });
  }
  rows.push({ label: "Email", value: <ContactEmail locale={locale} /> });
  if (OPERATOR.pec) rows.push({ label: "PEC", value: <a href={`mailto:${OPERATOR.pec}`}>{OPERATOR.pec}</a> });

  return (
    <dl className={cx("mb-4 grid gap-x-6 gap-y-2 text-ink-2 sm:grid-cols-[max-content_1fr]", className)}>
      {rows.map((row) => (
        <div key={row.label} className="contents">
          <dt className="font-semibold text-ink">{row.label}</dt>
          <dd className="m-0 mb-2 sm:mb-0">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
