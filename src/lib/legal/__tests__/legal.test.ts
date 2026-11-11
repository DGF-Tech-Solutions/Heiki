/**
 * I moduli dei documenti legali: le durate della pulizia, i documenti del pie'
 * di pagina, i dati del gestore che mancano, l'indirizzo email gia' compilato.
 */

import { describe, expect, it } from "vitest";
import { SESSION_ABSOLUTE_MAX_DAYS, SESSION_DAYS, authConfig } from "@/lib/auth/config";
import { mailtoHref } from "../contact";
import { LEGAL_DOCUMENTS, legalDocument } from "../documents";
import { missingOperatorFields, OPERATOR, type OperatorData } from "../operator";
import { legalReadiness } from "../readiness";
import { daysBefore, monthsBefore, RETENTION, retentionCutoffs } from "../retention";

describe("le durate della pulizia", () => {
  const now = new Date("2026-10-25T09:30:00Z");

  it("contano i mesi sul calendario, in UTC", () => {
    expect(monthsBefore(now, 12).toISOString()).toBe("2025-10-25T09:30:00.000Z");
    expect(monthsBefore(now, 24).toISOString()).toBe("2024-10-25T09:30:00.000Z");
  });

  it("il 31 diventa l'ultimo giorno del mese, anche bisestile", () => {
    expect(monthsBefore(new Date("2026-03-31T00:00:00Z"), 1).toISOString()).toBe("2026-02-28T00:00:00.000Z");
    expect(monthsBefore(new Date("2024-03-31T00:00:00Z"), 1).toISOString()).toBe("2024-02-29T00:00:00.000Z");
    expect(monthsBefore(new Date("2026-01-31T00:00:00Z"), 2).toISOString()).toBe("2025-11-30T00:00:00.000Z");
  });

  it("contano i giorni a tempo pieno", () => {
    expect(daysBefore(now, 30).toISOString()).toBe("2026-09-25T09:30:00.000Z");
  });

  it("ogni confine viene dalla sua durata", () => {
    const cut = retentionCutoffs(now);
    expect(cut.notifications).toEqual(monthsBefore(now, RETENTION.notificationsMonths));
    expect(cut.closedReports).toEqual(monthsBefore(now, RETENTION.closedReportsMonths));
    expect(cut.moderationLog).toEqual(monthsBefore(now, RETENTION.moderationLogMonths));
    expect(cut.endedSuspensions).toEqual(monthsBefore(now, RETENTION.endedSuspensionsMonths));
    expect(cut.verificationHistory).toEqual(monthsBefore(now, RETENTION.verificationHistoryMonths));
    expect(cut.guideRevisions).toEqual(monthsBefore(now, RETENTION.guideRevisionsMonths));
    expect(cut.pendingScreenshots).toEqual(daysBefore(now, RETENTION.pendingScreenshotDays));
    expect(cut.passwordResets).toEqual(daysBefore(now, RETENTION.passwordResetDays));
    for (const value of Object.values(cut)) expect(value.getTime()).toBeLessThan(now.getTime());
  });
});

describe("i documenti legali", () => {
  it("hanno indirizzi e chiavi diversi, sotto /legale", () => {
    const hrefs = LEGAL_DOCUMENTS.map((doc) => doc.href);
    expect(new Set(hrefs).size).toBe(hrefs.length);
    for (const doc of LEGAL_DOCUMENTS) {
      expect(doc.href).toBe(`/legale/${doc.key}`);
      expect(legalDocument(doc.key)).toBe(doc);
    }
  });

  it("hanno nome, titolo e descrizione nelle due lingue, e una data vera", () => {
    for (const doc of LEGAL_DOCUMENTS) {
      for (const text of [doc.label, doc.title, doc.description]) {
        expect(text.it.trim()).not.toBe("");
        expect(text.en.trim()).not.toBe("");
      }
      expect(doc.updated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(new Date(`${doc.updated}T12:00:00Z`).toISOString().slice(0, 10)).toBe(doc.updated);
    }
  });

  it("nel testo visibile niente trattini lunghi (regola del 24/10)", () => {
    for (const doc of LEGAL_DOCUMENTS) {
      for (const text of [doc.label, doc.title, doc.description]) {
        expect(`${text.it} ${text.en}`).not.toMatch(/[\u2013\u2014]/);
      }
    }
  });
});

describe("i dati del gestore", () => {
  const complete: OperatorData = {
    name: "Esempio S.r.l.",
    registeredOffice: "Via Roma 1, 00100 Roma (RM)",
    vatNumber: "IT00000000000",
    companyRegister: "Registro delle imprese di Roma, REA RM-0000000",
    shareCapital: "10.000,00 € interamente versato",
    singleMember: false,
    email: "contatti@example.test",
    pec: null,
  };
  const hosting = { name: "Esempio Hosting", location: { it: "Germania", en: "Germany" }, outsideEea: false, logRetentionDays: 14 };
  const mail = { name: "Esempio Posta", location: { it: "Germania", en: "Germany" }, outsideEea: false };

  it("completi: non manca niente, e la PEC non e' obbligatoria", () => {
    expect(missingOperatorFields(complete, hosting, mail)).toEqual([]);
  });

  it("il capitale sociale `false` vuol dire «non previsto», null «manca»", () => {
    expect(missingOperatorFields({ ...complete, shareCapital: false }, hosting, mail)).toEqual([]);
    expect(missingOperatorFields({ ...complete, shareCapital: null }, hosting, mail)).toEqual(["shareCapital"]);
  });

  it("senza hosting e senza email lo dice", () => {
    expect(missingOperatorFields({ ...complete, email: null }, null, mail)).toEqual(["email", "hosting"]);
  });

  it("della posta servono chi la ospita e il paese dei server", () => {
    expect(missingOperatorFields(complete, hosting, null)).toEqual(["mailProvider"]);
    expect(missingOperatorFields(complete, hosting, { ...mail, location: null })).toEqual(["mailLocation"]);
  });

  it("la partita IVA del gestore ha la cifra di controllo giusta", () => {
    const vat = OPERATOR.vatNumber?.replace(/^IT/, "");
    if (!vat) return;
    expect(vat).toMatch(/^\d{11}$/);
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      let digit = Number(vat[i]);
      if (i % 2 === 1) digit = digit * 2 > 9 ? digit * 2 - 9 : digit * 2;
      sum += digit;
    }
    expect((10 - (sum % 10)) % 10).toBe(Number(vat[10]));
  });

  it("finche' i dati veri mancano, le pagine legali restano una bozza", () => {
    const readiness = legalReadiness();
    expect(readiness.missingFields).toEqual(missingOperatorFields());
    if (!OPERATOR.email) expect(readiness.ready).toBe(false);
  });
});

describe("l'email gia' compilata", () => {
  it("scrive gli spazi come %20 e non come +", () => {
    const href = mailtoHref("a@example.test", "Richiesta di rimozione", "Riga uno\nRiga due & tre");
    expect(href).toBe("mailto:a@example.test?subject=Richiesta%20di%20rimozione&body=Riga%20uno%0ARiga%20due%20%26%20tre");
    expect(href).not.toContain("+");
  });

  it("senza oggetto e testo e' l'indirizzo e basta", () => {
    expect(mailtoHref("a@example.test")).toBe("mailto:a@example.test");
  });
});

describe("le durate della sessione scritte nella pagina dei cookie", () => {
  it("sono quelle che Auth.js usa davvero", () => {
    expect(authConfig.session?.maxAge).toBe(SESSION_DAYS * 24 * 60 * 60);
    expect(SESSION_ABSOLUTE_MAX_DAYS).toBeGreaterThan(SESSION_DAYS);
  });
});
