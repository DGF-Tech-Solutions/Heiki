/**
 * I pezzi con cui si mostra una strategia: la squadra (compatta nelle schede,
 * grande nella pagina del post), il set di artefatti, il tipo.
 *
 * Solo aspetto e niente stato: stanno sia nei componenti server (schede, post,
 * coda) sia, volendo, in un componente client. I dati arrivano gia' risolti
 * nella lingua di chi legge (`lib/strategies/view.ts`).
 */

import Link from "next/link";
import { cx, eyebrow, heroEpithetClass, heroNameClass, Tag } from "@/components/ui";
import type { Locale } from "@/lib/i18n/locale";
import { testi } from "@/lib/i18n/locale";
import type { SetView, SlotView } from "@/lib/strategies/view";
import type { StrategyKind } from "@/lib/strategies/types";

const TESTI = testi({
  it: {
    squadra: "Squadra",
    guida: "Guida",
    associato: "Associato",
    senzaAssociato: "senza associato",
    posto: (n: number) => `Posto ${n}`,
    set: "Set artefatto",
    carte: (n: number) => (n === 1 ? "1 carta" : `${n} carte`),
    fasi: (n: number) => (n === 1 ? "1 fase" : `${n} fasi`),
  },
  en: {
    squadra: "Team",
    guida: "Guide",
    associato: "Associate",
    senzaAssociato: "no associate",
    posto: (n: number) => `Slot ${n}`,
    set: "Artifact set",
    carte: (n: number) => (n === 1 ? "1 card" : `${n} cards`),
    fasi: (n: number) => (n === 1 ? "1 phase" : `${n} phases`),
  },
});

/** Il tipo: «Squadra» in nero, «Guida» in rosso, con quante fasi hanno una nota. */
export function KindTag({ kind, phases = 0, locale }: { kind: StrategyKind; phases?: number; locale: Locale }) {
  const t = TESTI[locale];
  return (
    <Tag tone={kind === "guide" ? "brand" : "neutral"}>
      {kind === "guide" ? t.guida : t.squadra}
      {kind === "guide" && phases > 0 ? <span className="font-semibold normal-case opacity-80">· {t.fasi(phases)}</span> : null}
    </Tag>
  );
}

function Card({ src, src2x, size, className }: { src: string; src2x: string; size: number; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- card gia' pronte in due densita', come nella griglia Eroi
    <img
      src={src}
      srcSet={`${src} 1x, ${src2x} 2x`}
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      className={cx("block aspect-square bg-paper-3", className)}
    />
  );
}

/**
 * La squadra in una scheda: quattro card in fila col nome, l'associato in
 * piccolo sotto. Le card portano alla scheda dell'eroe.
 */
export function TeamStrip({ team, locale }: { team: readonly SlotView[]; locale: Locale }) {
  const t = TESTI[locale];
  return (
    <ol className="m-0 grid list-none grid-cols-4 gap-2 p-0">
      {team.map((slot, i) => (
        <li key={`${slot.hero.id}-${i}`} className="min-w-0">
          <Link
            href={slot.hero.href}
            className="group p5-press block min-w-0 no-underline"
            aria-label={`${t.posto(i + 1)}: ${slot.hero.epithet ? `[${slot.hero.epithet}] ` : ""}${slot.hero.name}`}
          >
            <Card
              src={slot.hero.card}
              src2x={slot.hero.card2x}
              size={96}
              className="w-full border-b-2 transition-transform group-hover:-translate-y-0.5"
            />
            {/* il filo dell'attributo: lo stesso del palco */}
            <span aria-hidden className="block h-[2px]" style={{ background: slot.hero.color ?? "transparent" }} />
            <span className={cx(heroNameClass, "mt-1 text-ink group-hover:text-brand-deep")}>{slot.hero.name}</span>
          </Link>
          {slot.associate ? (
            <Link
              href={slot.associate.href}
              title={`${t.associato}: ${slot.associate.name}`}
              className="mt-1.5 flex min-w-0 items-center gap-1 text-[12px] leading-tight text-ink-3 no-underline hover:text-ink"
            >
              <Card src={slot.associate.card} src2x={slot.associate.card2x} size={22} className="h-[22px] w-[22px] shrink-0" />
              <span className="sr-only">{t.associato}: </span>
              <span className="truncate">{slot.associate.name}</span>
            </Link>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

/** La squadra nella pagina del post: card grandi, epiteto e nome, l'associato con la sua etichetta. */
export function TeamBoard({ team, locale }: { team: readonly SlotView[]; locale: Locale }) {
  const t = TESTI[locale];
  return (
    <ol className="m-0 grid list-none grid-cols-2 gap-3 p-0 sm:grid-cols-4">
      {team.map((slot, i) => (
        <li key={`${slot.hero.id}-${i}`} className="p5-corner min-w-0 border border-rule bg-paper-2 p-2.5">
          <span className={cx(eyebrow, "mb-1.5 block")}>{t.posto(i + 1)}</span>
          <Link href={slot.hero.href} className="group p5-press block min-w-0 no-underline">
            <Card src={slot.hero.card} src2x={slot.hero.card2x} size={128} className="w-full" />
            <span aria-hidden className="block h-[3px]" style={{ background: slot.hero.color ?? "transparent" }} />
            <span className={cx(heroEpithetClass, "mt-1.5")}>{slot.hero.epithet}</span>
            <span className={cx(heroNameClass, "text-[13.5px] text-ink group-hover:text-brand-deep")}>{slot.hero.name}</span>
          </Link>
          <div className="mt-2 border-t border-rule-2 pt-2">
            <span className={cx(eyebrow, "block text-[11px]")}>{t.associato}</span>
            {slot.associate ? (
              <Link
                href={slot.associate.href}
                className="mt-1 flex min-w-0 items-center gap-2 text-[13px] leading-tight text-ink-2 no-underline hover:text-ink"
              >
                <Card src={slot.associate.card} src2x={slot.associate.card2x} size={36} className="h-9 w-9 shrink-0" />
                <span className="min-w-0">
                  <span className="block truncate text-[12px] text-ink-3">{slot.associate.epithet}</span>
                  <span className="block truncate font-semibold">{slot.associate.name}</span>
                </span>
              </Link>
            ) : (
              <span className="mt-1 block text-[13px] text-ink-3">{t.senzaAssociato}</span>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Il set di artefatti: la prima carta, «No. N», il nome; grande, anche il bonus al livello massimo. */
export function SetLine({ set, locale, full = false }: { set: SetView; locale: Locale; full?: boolean }) {
  const t = TESTI[locale];
  return (
    <Link
      href={set.href}
      className={cx(
        "group flex min-w-0 items-center gap-2.5 no-underline",
        full && "p5-corner items-start border border-rule bg-paper-2 p-3",
      )}
    >
      {set.image ? (
        // eslint-disable-next-line @next/next/no-img-element -- carte gia' composte con la cornice del gioco
        <img
          src={set.image}
          alt=""
          width={full ? 56 : 30}
          height={full ? 67 : 36}
          loading="lazy"
          decoding="async"
          className={cx("shrink-0", full ? "w-14" : "w-[30px]")}
        />
      ) : null}
      <span className="min-w-0">
        <span className={cx(eyebrow, "block text-[11px]")}>
          {t.set} · {set.code} · {t.carte(set.cards)}
        </span>
        <span className="block truncate text-[13.5px] font-semibold text-ink group-hover:text-brand-deep">{set.name}</span>
        {full && set.bonus ? <span className="mt-1 block text-[13px] leading-snug text-ink-2">{set.bonus}</span> : null}
      </span>
    </Link>
  );
}
