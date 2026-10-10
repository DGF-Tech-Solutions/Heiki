"use client";

import { useState, useTransition } from "react";
import { Button, cx, eyebrow, Input, numeric } from "@/components/ui";
import { reviewVerificationAction } from "@/lib/game-account/actions";
import { intlLocale, testi, type Locale } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    richiesta: (chi: string) => `Richiesta di ${chi}`,
    account: "Account",
    dichiarata: "Dichiarata",
    precedente: (n: string, quando: string) => `verificata prima: ${n} (${quando})`,
    eroe: "Eroe del giorno",
    scartati: (nomi: string) => `scartati con «non ce l'ho»: ${nomi}`,
    giorno: (giorno: string) => `giorno ${giorno} (UTC)`,
    controlla:
      "Controlla: l'eroe è nei preferiti e si vede nell'elenco, la classe dell'account si legge bene, la schermata non sembra ritoccata.",
    letta: "Classe letta nella schermata",
    approva: "Conferma",
    motivo: "Motivo del rifiuto (lo legge chi l'ha chiesta)",
    rifiuta: "Rifiuta",
    schermata: "Schermata caricata",
    apri: "apri a piena grandezza",
  },
  en: {
    richiesta: (chi: string) => `Request from ${chi}`,
    account: "Account",
    dichiarata: "Declared",
    precedente: (n: string, quando: string) => `previously verified: ${n} (${quando})`,
    eroe: "Hero of the day",
    scartati: (nomi: string) => `skipped with “I don't have it”: ${nomi}`,
    giorno: (giorno: string) => `day ${giorno} (UTC)`,
    controlla:
      "Check: the hero is in the favorites and visible in the list, the Account Combat Class is readable, the screenshot doesn't look edited.",
    letta: "Class read in the screenshot",
    approva: "Confirm",
    motivo: "Reason for rejection (the requester will read it)",
    rifiuta: "Reject",
    schermata: "Uploaded screenshot",
    apri: "open full size",
  },
});

export interface ReviewItem {
  readonly id: string;
  readonly requester: string;
  readonly profileHref: string;
  readonly account: string;
  readonly declaredPower: number | null;
  readonly previous: { readonly power: number; readonly at: string } | null;
  readonly hero: { readonly name: string; readonly card: string };
  readonly skipped: readonly string[];
  readonly challengeDay: string;
}

export function VerificationReview({ item, locale }: { item: ReviewItem; locale: Locale }) {
  const t = TESTI[locale];
  const [power, setPower] = useState(item.declaredPower ? String(item.declaredPower) : "");
  const [note, setNote] = useState("");
  const [result, setResult] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const numero = (n: number) => n.toLocaleString(intlLocale(locale), { useGrouping: "always" });
  const shot = `/api/verifiche/${item.id}/schermata`;

  const decide = (decision: "approve" | "reject") =>
    startTransition(async () => {
      const form = new FormData();
      form.set("id", item.id);
      form.set("decision", decision);
      form.set("power", power.replace(/\D/g, ""));
      form.set("note", note);
      const outcome = await reviewVerificationAction(form);
      setResult({ ok: outcome.ok, text: (outcome.ok ? outcome.message : outcome.error) ?? "" });
    });

  if (result?.ok) {
    return (
      <li className="rounded-card border border-rule bg-paper px-4 py-3 text-sm text-ink-2">
        {t.richiesta(item.requester)}: {result.text}
      </li>
    );
  }

  return (
    <li className="p5-corner grid gap-3 border border-rule bg-paper-2 p-4">
      <p className="m-0 text-sm">
        <a href={item.profileHref} className="font-semibold hover:text-brand-deep">
          {t.richiesta(item.requester)}
        </a>
        <span className="text-ink-3"> · {item.account}</span>
      </p>

      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_220px]">
        <figure className="m-0 grid gap-1.5">
          <figcaption className={eyebrow}>
            {t.schermata} ·{" "}
            <a href={shot} target="_blank" rel="noreferrer" className="normal-case tracking-normal text-brand-deep underline underline-offset-2">
              {t.apri}
            </a>
          </figcaption>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={shot} alt={t.schermata} className="max-h-[420px] w-full border border-rule object-contain" />
        </figure>

        <div className="grid content-start gap-3 text-sm">
          <div className="grid grid-cols-[64px_minmax(0,1fr)] items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.hero.card} alt="" width={64} height={86} className="h-auto w-full shadow-[3px_3px_0_var(--color-brand)]" />
            <div>
              <p className={cx(eyebrow, "m-0")}>{t.eroe}</p>
              <p className="m-0 font-semibold leading-tight">{item.hero.name}</p>
              <p className="m-0 text-xs text-ink-3">{t.giorno(item.challengeDay)}</p>
            </div>
          </div>
          {item.skipped.length > 0 ? <p className="m-0 text-xs text-ink-3">{t.scartati(item.skipped.join(", "))}</p> : null}
          <p className="m-0">
            <span className="text-ink-3">{t.dichiarata}: </span>
            <span className={numeric}>{item.declaredPower ? numero(item.declaredPower) : "—"}</span>
          </p>
          {item.previous ? (
            <p className="m-0 text-xs text-ink-3">
              {t.precedente(numero(item.previous.power), new Date(item.previous.at).toLocaleDateString(intlLocale(locale)))}
            </p>
          ) : null}
        </div>
      </div>

      <p className="m-0 text-xs text-ink-2">{t.controlla}</p>

      <div className="grid gap-3 md:grid-cols-2">
        <div className="grid content-start gap-1.5">
          <label className={eyebrow} htmlFor={`${item.id}-power`}>
            {t.letta}
          </label>
          <div className="flex gap-2">
            <Input
              id={`${item.id}-power`}
              value={power}
              inputMode="numeric"
              className={cx(numeric, "min-w-0")}
              onChange={(event) => setPower(event.target.value.replace(/[^\d.,\s]/g, ""))}
            />
            <Button variant="primary" disabled={pending || power.replace(/\D/g, "") === ""} onClick={() => decide("approve")}>
              {t.approva}
            </Button>
          </div>
        </div>
        <div className="grid content-start gap-1.5">
          <label className={eyebrow} htmlFor={`${item.id}-note`}>
            {t.motivo}
          </label>
          <div className="flex gap-2">
            <Input
              id={`${item.id}-note`}
              value={note}
              maxLength={500}
              className="min-w-0"
              onChange={(event) => setNote(event.target.value)}
            />
            <Button disabled={pending || note.trim().length < 3} onClick={() => decide("reject")}>
              {t.rifiuta}
            </Button>
          </div>
        </div>
      </div>

      {result && !result.ok ? (
        <p role="alert" className="m-0 text-sm text-hot">
          {result.text}
        </p>
      ) : null}
    </li>
  );
}
