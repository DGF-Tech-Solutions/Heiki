"use client";

import Link from "next/link";
import { useEffect, useId, useState, useTransition } from "react";
import { AccountControls } from "@/components/account-buff/account-controls";
import { useAccountSetup } from "@/components/account-buff/use-account-setup";
import { Button, cx, eyebrow, Input, numeric, Select } from "@/components/ui";
import {
  cancelVerificationAction,
  requestChallengeAction,
  rerollChallengeAction,
  submitScreenshotAction,
} from "@/lib/game-account/actions";
import type { VerificationSummary } from "@/lib/game-account/server";
import type { AccountSliderData } from "@/lib/games/account-buff-types";
import {
  cleanFriendCode,
  FRIEND_CODE_MAX,
  NICKNAME_MAX,
  SERVER_NAMES,
  SERVERS,
  isServer,
} from "@/lib/games/game-account";
import { intlLocale, testi, type Locale } from "@/lib/i18n/locale";
import { useGameProfile, writeStamp } from "./local-account";
import { shrinkScreenshot } from "./shrink-screenshot";

const TESTI = testi({
  it: {
    chiSei: "Chi sei nel gioco",
    chiSeiNota:
      "Si salva in questo browser e nel tuo account del sito: lo ritrovi su ogni dispositivo. Nickname, Codice amico, server e classe compaiono sul tuo profilo pubblico.",
    chiSeiOspite: "Si salva in questo browser. Entra nel sito per ritrovarlo su ogni dispositivo e chiedere la verifica.",
    nickname: "Nickname",
    codiceAmico: "Codice amico",
    codiceAmicoAiuto: "Info giocatore → Codice amico",
    server: "Server",
    classe: "Classe e costellazioni",
    classeNota:
      "La classe di combattimento dell'account è il numero dell'Elenco eroi del gioco. Qui la scrivi una volta, e le schede degli eroi la usano per le statistiche in battaglia.",
    verifica: "Verifica della classe",
    verificaIntro:
      "Il gioco non mostra a nessuno la classe dell'account di un altro giocatore, e non ha un modo per leggerla dall'esterno. Per questo si prova con una schermata: il sito ti dà un eroe del giorno da mettere nei preferiti, e nella schermata dell'Elenco eroi si vedono insieme l'eroe e la classe. Una schermata vecchia o presa da altri non può avere il tuo eroe di oggi.",
    entra: "Entra per chiedere la verifica",
    serveDatabase: "La verifica richiede il database: in modalità dimostrativa non si può chiedere.",
    verificata: (n: string, quando: string) => `Verificata: ${n}, il ${quando}.`,
    diversa: (n: string) => `Ora hai scritto ${n}: per confermarla chiedi una nuova verifica.`,
    maiVerificata: "Non ancora verificata.",
    rifiutata: (quando: string) => `L'ultima richiesta, del ${quando}, non è stata accettata.`,
    motivo: "Motivo:",
    chiedi: "Chiedi l'eroe del giorno",
    serveClasse: "Scrivi prima la classe del tuo account, qui sopra.",
    eroeDelGiorno: "Il tuo eroe di oggi",
    valeFino: (giorno: string, ora: string) =>
      `Vale fino al ${giorno} alle ${ora}, la mezzanotte UTC: la schermata va caricata entro allora.`,
    passi: [
      "Nel gioco apri l'Elenco eroi.",
      "Metti l'eroe qui accanto nei preferiti.",
      "Ordina l'elenco per «Preferiti», così l'eroe compare in cima.",
      "Fai una schermata in cui si vedano l'eroe, col segno dei preferiti, e la classe di combattimento dell'account.",
      "Caricala qui sotto, e scrivi la classe che si legge nella schermata.",
    ],
    nonCeLho: (n: number) => (n === 1 ? "Non ce l'ho: cambia eroe (ancora 1)" : `Non ce l'ho: cambia eroe (ancora ${n})`),
    nessunCambio: "Hai già cambiato eroe due volte oggi.",
    classeSchermata: "Classe nella schermata",
    schermata: "Schermata",
    anteprima: "La tua schermata",
    invia: "Invia al moderatore",
    invio: "Invio…",
    preparo: "Preparo l'immagine…",
    ritira: "Ritira",
    ritiraConferma: "Ritirare la richiesta? La schermata si cancella.",
    inAttesa: (quando: string) => `Schermata inviata il ${quando}: aspetta un moderatore. Riceverai una notifica.`,
    dichiarata: (n: string) => `Classe dichiarata: ${n}`,
    privacy:
      "La schermata la vedono solo i moderatori, e si cancella appena decidono. Resta solo un'impronta del file, per riconoscere chi ricarica la stessa immagine.",
    erroreImmagine: "Non riesco a leggere questa immagine: prova con un PNG o un JPEG.",
    buff: "Le costellazioni pietra per pietra",
  },
  en: {
    chiSei: "Who you are in the game",
    chiSeiNota:
      "It is saved in this browser and in your site account: you find it on every device. Nickname, Friend Code, server and class appear on your public profile.",
    chiSeiOspite: "It is saved in this browser. Log in to find it on every device and request verification.",
    nickname: "Nickname",
    codiceAmico: "Friend Code",
    codiceAmicoAiuto: "Player Info → Friend Code",
    server: "Server",
    classe: "Class and constellations",
    classeNota:
      "The Account Combat Class is the number in the game's Hero List. Enter it once here, and the hero pages use it for their in-battle stats.",
    verifica: "Combat Class verification",
    verificaIntro:
      "The game shows nobody another player's Account Combat Class, and has no way to read it from outside. So it is proven with a screenshot: the site gives you a hero of the day to add to your favorites, and the Hero List screenshot shows the hero and the class together. An old screenshot, or someone else's, cannot have your hero of today.",
    entra: "Log in to request verification",
    serveDatabase: "Verification needs the database: it can't be requested in demo mode.",
    verificata: (n: string, quando: string) => `Verified: ${n}, on ${quando}.`,
    diversa: (n: string) => `You have now entered ${n}: request a new verification to confirm it.`,
    maiVerificata: "Not verified yet.",
    rifiutata: (quando: string) => `Your last request, from ${quando}, was not accepted.`,
    motivo: "Reason:",
    chiedi: "Get the hero of the day",
    serveClasse: "Enter your account's class first, above.",
    eroeDelGiorno: "Your hero of today",
    valeFino: (giorno: string, ora: string) =>
      `Valid until ${ora} on ${giorno}, midnight UTC: upload the screenshot before then.`,
    passi: [
      "In the game, open the Hero List.",
      "Add the hero shown here to your favorites.",
      "Sort the list by “Favorites”, so the hero appears at the top.",
      "Take a screenshot showing the hero, with the favorite mark, and the Account Combat Class.",
      "Upload it below, and enter the class shown in the screenshot.",
    ],
    nonCeLho: (n: number) => (n === 1 ? "I don't have it: change hero (1 left)" : `I don't have it: change hero (${n} left)`),
    nessunCambio: "You already changed hero twice today.",
    classeSchermata: "Class in the screenshot",
    schermata: "Screenshot",
    anteprima: "Your screenshot",
    invia: "Send to a moderator",
    invio: "Sending…",
    preparo: "Preparing the image…",
    ritira: "Withdraw",
    ritiraConferma: "Withdraw the request? The screenshot will be deleted.",
    inAttesa: (quando: string) => `Screenshot sent on ${quando}: waiting for a moderator. You will get a notification.`,
    dichiarata: (n: string) => `Declared class: ${n}`,
    privacy:
      "Only moderators see the screenshot, and it is deleted as soon as they decide. Only a fingerprint of the file remains, to recognize someone uploading the same image again.",
    erroreImmagine: "I can't read this image: try a PNG or a JPEG.",
    buff: "Constellations stone by stone",
  },
});

export interface ChallengeHero {
  readonly name: string;
  readonly epithet: string;
  readonly card: string;
}

export interface GameAccountEditorProps {
  readonly gameSlug: string;
  readonly locale: Locale;
  readonly signedIn: boolean;
  readonly databaseReady: boolean;
  readonly summary: VerificationSummary;
  readonly heroes: Readonly<Record<string, ChallengeHero>>;
  readonly slider: AccountSliderData;
  readonly buffHref: string;
  readonly loginHref: string;
}

const numero = (n: number, locale: Locale) => n.toLocaleString(intlLocale(locale), { useGrouping: "always" });
const data = (iso: string, locale: Locale) =>
  new Date(iso).toLocaleDateString(intlLocale(locale), { day: "numeric", month: "long", year: "numeric" });

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-3 rounded-card border border-rule bg-paper p-4 sm:p-5">
      <h2 className="m-0 font-display text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}

export function GameAccountEditor(props: GameAccountEditorProps) {
  const { gameSlug, locale } = props;
  const t = TESTI[locale];
  const id = useId();
  const [profile, saveProfile] = useGameProfile(gameSlug);
  const [setup, saveSetup] = useAccountSetup(gameSlug);

  return (
    <div className="grid gap-5">
      <Section title={t.chiSei}>
        <p className="m-0 text-sm text-ink-2">{props.signedIn ? t.chiSeiNota : t.chiSeiOspite}</p>
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,160px)]">
          <label className="grid gap-1.5">
            <span className={eyebrow}>{t.nickname}</span>
            <Input
              value={profile.nickname}
              maxLength={NICKNAME_MAX}
              autoComplete="off"
              onChange={(event) => saveProfile({ ...profile, nickname: event.target.value.slice(0, NICKNAME_MAX) })}
            />
          </label>
          <label className="grid gap-1.5">
            <span className={eyebrow}>
              {t.codiceAmico} <span className="normal-case tracking-normal text-ink-3">· {t.codiceAmicoAiuto}</span>
            </span>
            <Input
              value={profile.friendCode}
              maxLength={FRIEND_CODE_MAX}
              inputMode="text"
              autoComplete="off"
              className={numeric}
              onChange={(event) => saveProfile({ ...profile, friendCode: cleanFriendCode(event.target.value) })}
            />
          </label>
          <label className="grid gap-1.5">
            <span className={eyebrow}>{t.server}</span>
            <Select
              value={profile.server}
              onChange={(event) => {
                if (isServer(event.target.value)) saveProfile({ ...profile, server: event.target.value });
              }}
            >
              {SERVERS.map((server) => (
                <option key={server} value={server}>
                  {SERVER_NAMES[server][locale]}
                </option>
              ))}
            </Select>
          </label>
        </div>
      </Section>

      <Section title={t.classe}>
        <p className="m-0 text-sm text-ink-2">{t.classeNota}</p>
        <div className="text-sm">
          <AccountControls data={props.slider} setup={setup} save={saveSetup} href={props.buffHref} locale={locale} />
        </div>
      </Section>

      <Section title={t.verifica}>
        <p className="m-0 max-w-[70ch] text-sm text-ink-2">{t.verificaIntro}</p>
        {!props.databaseReady ? (
          <p className="m-0 text-sm text-ink-3">{t.serveDatabase}</p>
        ) : !props.signedIn ? (
          <p className="m-0">
            <Link href={props.loginHref} className="font-semibold text-brand underline-offset-2 hover:underline">
              {t.entra} →
            </Link>
          </p>
        ) : (
          <Verification {...props} idPrefix={id} power={setup.power} profile={profile} setup={setup} />
        )}
      </Section>
    </div>
  );
}

function Verification({
  gameSlug,
  locale,
  summary: initial,
  heroes,
  idPrefix,
  power,
  profile,
  setup,
}: GameAccountEditorProps & {
  idPrefix: string;
  power: number;
  profile: unknown;
  setup: unknown;
}) {
  const t = TESTI[locale];
  const [summary, setSummary] = useState(initial);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const current = summary.current;

  const run = (action: () => Promise<{ ok: boolean; error?: string; summary?: VerificationSummary; updatedAt?: number }>) =>
    startTransition(async () => {
      setError(null);
      const result = await action();
      if (result.summary) setSummary(result.summary);
      if (result.updatedAt) writeStamp(gameSlug, result.updatedAt);
      if (!result.ok) setError(result.error ?? null);
    });

  return (
    <div className="grid gap-4">
      <Status summary={summary} power={power} locale={locale} />

      {current === null ? (
        <div className="grid gap-2">
          <div>
            <Button
              variant="primary"
              disabled={pending || power <= 0}
              onClick={() => run(() => requestChallengeAction(gameSlug, { profile, setup }))}
            >
              {t.chiedi}
            </Button>
          </div>
          {power <= 0 ? <p className="m-0 text-xs text-ink-3">{t.serveClasse}</p> : null}
        </div>
      ) : current.status === "OPEN" ? (
        <Challenge
          key={current.id}
          gameSlug={gameSlug}
          locale={locale}
          idPrefix={idPrefix}
          hero={heroes[current.challengeHeroId]}
          heroId={current.challengeHeroId}
          day={current.challengeDay}
          rerollsLeft={current.rerollsLeft}
          power={power}
          pending={pending}
          onReroll={() => run(() => rerollChallengeAction(gameSlug))}
          onSubmit={(form) => run(() => submitScreenshotAction(form))}
          onCancel={() => run(() => cancelVerificationAction(gameSlug))}
          onError={setError}
        />
      ) : (
        <div className="grid gap-3">
          <p className="m-0 text-sm">{t.inAttesa(data(current.submittedAt ?? new Date().toISOString(), locale))}</p>
          {current.declaredPower ? (
            <p className={cx(numeric, "m-0 text-sm text-ink-2")}>{t.dichiarata(numero(current.declaredPower, locale))}</p>
          ) : null}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/api/verifiche/${current.id}/schermata`}
            alt={t.anteprima}
            className="max-h-[260px] w-auto max-w-full rounded-[3px] border border-rule object-contain"
          />
          <div>
            <Button
              disabled={pending}
              onClick={() => {
                if (window.confirm(t.ritiraConferma)) run(() => cancelVerificationAction(gameSlug));
              }}
            >
              {t.ritira}
            </Button>
          </div>
        </div>
      )}

      {error ? (
        <p role="alert" className="m-0 text-sm text-hot">
          {error}
        </p>
      ) : null}
      <p className="m-0 text-xs text-ink-3">{t.privacy}</p>
    </div>
  );
}

function Status({ summary, power, locale }: { summary: VerificationSummary; power: number; locale: Locale }) {
  const t = TESTI[locale];
  return (
    <div className="grid gap-1 text-sm">
      {summary.verifiedPower && summary.verifiedAt ? (
        <p className="m-0">
          <span className="font-semibold text-ink">{t.verificata(numero(summary.verifiedPower, locale), data(summary.verifiedAt, locale))}</span>
          {power > 0 && power !== summary.verifiedPower ? (
            <span className="text-ink-2"> {t.diversa(numero(power, locale))}</span>
          ) : null}
        </p>
      ) : (
        <p className="m-0 text-ink-2">{t.maiVerificata}</p>
      )}
      {summary.rejected ? (
        <p className="m-0 text-ink-2">
          {t.rifiutata(data(summary.rejected.reviewedAt, locale))}
          {summary.rejected.note ? (
            <>
              {" "}
              <span className="text-ink-3">{t.motivo}</span> {summary.rejected.note}
            </>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}

function Challenge({
  gameSlug,
  locale,
  idPrefix,
  hero,
  heroId,
  day,
  rerollsLeft,
  power,
  pending,
  onReroll,
  onSubmit,
  onCancel,
  onError,
}: {
  gameSlug: string;
  locale: Locale;
  idPrefix: string;
  hero: ChallengeHero | undefined;
  heroId: string;
  day: string;
  rerollsLeft: number;
  power: number;
  pending: boolean;
  onReroll: () => void;
  onSubmit: (form: FormData) => void;
  onCancel: () => void;
  onError: (message: string | null) => void;
}) {
  const t = TESTI[locale];
  const [file, setFile] = useState<Blob | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [preparing, setPreparing] = useState(false);
  // finche' non lo tocchi vale la classe salvata, che il browser legge solo dopo il primo disegno
  const [typed, setDeclared] = useState<string | null>(null);
  const declared = typed ?? (power > 0 ? String(power) : "");
  // l'ora locale della mezzanotte UTC: il giorno dell'eroe finisce li'
  // la mezzanotte UTC alla fine del giorno dell'eroe, nell'ora di chi legge: in Italia le 2 del giorno dopo
  const [year, month, date] = day.split("-").map(Number);
  const end = new Date(Date.UTC(year!, month! - 1, date! + 1));
  const deadlineDay = end.toLocaleDateString(intlLocale(locale), { day: "numeric", month: "long" });
  const deadlineTime = end.toLocaleTimeString(intlLocale(locale), { hour: "2-digit", minute: "2-digit" });

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-[88px_minmax(0,1fr)] items-start gap-4 sm:grid-cols-[112px_minmax(0,1fr)]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={hero?.card ?? ""}
          alt=""
          width={112}
          height={150}
          className="h-auto w-full rounded-[3px] border border-rule bg-paper-2"
        />
        <div className="grid gap-1.5">
          <p className={cx(eyebrow, "m-0")}>{t.eroeDelGiorno}</p>
          <p className="m-0 font-display text-lg font-bold leading-tight">
            {hero ? (
              <>
                <span className="text-ink-2">[{hero.epithet}]</span> {hero.name}
              </>
            ) : (
              heroId
            )}
          </p>
          <p className="m-0 text-xs text-ink-3">{t.valeFino(deadlineDay, deadlineTime)}</p>
          <div>
            <Button size="sm" className="h-auto min-h-8 py-1 text-left" disabled={pending || rerollsLeft <= 0} onClick={onReroll}>
              {rerollsLeft > 0 ? t.nonCeLho(rerollsLeft) : t.nessunCambio}
            </Button>
          </div>
        </div>
      </div>

      <ol className="m-0 grid list-decimal gap-1 pl-5 text-sm text-ink-2">
        {t.passi.map((step) => (
          <li key={step}>{step}</li>
        ))}
      </ol>

      <form
        className="grid gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (!file) return;
          const form = new FormData();
          form.set("game", gameSlug);
          form.set("power", declared.replace(/\D/g, ""));
          form.set("screenshot", file, "schermata.webp");
          onSubmit(form);
        }}
      >
        <div className="grid gap-3 sm:grid-cols-[minmax(0,200px)_minmax(0,1fr)]">
          <label className="grid gap-1.5">
            <span className={eyebrow}>{t.classeSchermata}</span>
            <Input
              value={declared}
              inputMode="numeric"
              className={numeric}
              onChange={(event) => setDeclared(event.target.value.replace(/[^\d.,\s]/g, ""))}
            />
          </label>
          <label className="grid gap-1.5" htmlFor={`${idPrefix}-file`}>
            <span className={eyebrow}>{t.schermata}</span>
            <input
              id={`${idPrefix}-file`}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="w-full min-w-0 text-sm file:mr-3 file:rounded-[3px] file:border file:border-rule file:bg-paper-2 file:px-3 file:py-1.5 file:text-ink"
              onChange={async (event) => {
                const chosen = event.target.files?.[0];
                onError(null);
                if (!chosen) return setFile(null);
                setPreparing(true);
                try {
                  setFile(await shrinkScreenshot(chosen));
                } catch {
                  setFile(null);
                  onError(t.erroreImmagine);
                } finally {
                  setPreparing(false);
                }
              }}
            />
          </label>
        </div>
        {preview ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={preview}
            alt={t.anteprima}
            className="max-h-[260px] w-auto max-w-full rounded-[3px] border border-rule object-contain"
          />
        ) : null}
        <div className="flex flex-wrap gap-2">
          <Button type="submit" variant="primary" disabled={pending || preparing || !file || declared.replace(/\D/g, "") === ""}>
            {preparing ? t.preparo : pending ? t.invio : t.invia}
          </Button>
          <Button type="button" disabled={pending} onClick={onCancel}>
            {t.ritira}
          </Button>
        </div>
      </form>
    </div>
  );
}
