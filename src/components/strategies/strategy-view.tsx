/**
 * La strategia nella pagina del post (e nella coda dei moderatori): dove vale,
 * la squadra, il set, le note e una nota per fase.
 *
 * L'ordine e' quello in cui si prepara una battaglia: dove si va, con chi, con
 * che set, poi cosa fare fase per fase. Le fasi senza nota si dicono in una riga
 * sola invece di occupare un riquadro vuoto ciascuna.
 */

import Link from "next/link";
import { cx, eyebrow, MoreLink } from "@/components/ui";
import { testi, type Locale } from "@/lib/i18n/locale";
import type { GameModule } from "@/lib/games/types";
import { inLingua } from "@/lib/i18n/locale";
import { modeName, selectionPageHref, strategyKind } from "@/lib/strategies/rules";
import { phasesView, selectionLabel, setView, teamView } from "@/lib/strategies/view";
import type { StrategyRecord } from "@/lib/strategies/types";
import { KindTag, SetLine, TeamBoard } from "./strategy-parts";

const TESTI = testi({
  it: {
    dove: "Dove",
    vai: "Vai alla pagina",
    squadra: "Squadra",
    set: "Set di artefatti",
    nessunSet: "Nessun set indicato.",
    note: "Note",
    fasi: "Fase per fase",
    senzaNota: (fasi: string) => `Nessuna nota per: ${fasi}.`,
  },
  en: {
    dove: "Where",
    vai: "Go to the page",
    squadra: "Team",
    set: "Artifact set",
    nessunSet: "No set given.",
    note: "Notes",
    fasi: "Phase by phase",
    senzaNota: (fasi: string) => `No notes for: ${fasi}.`,
  },
});

/** Un testo dell'autore: paragrafi separati da una riga vuota, a capo dentro il paragrafo. */
function Prose({ text, className }: { text: string; className?: string }) {
  return (
    <div className={cx("max-w-[68ch] text-[15px] leading-[1.68] whitespace-pre-line", className)}>
      {text.split(/\n{2,}/).map((paragraph, index) => (
        <p key={index} className="m-0 mb-3 last:mb-0">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function Block({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={cx("mt-6", className)}>
      <h2 className={cx(eyebrow, "m-0 mb-2.5 text-[13px] text-ink-2")}>{title}</h2>
      {children}
    </section>
  );
}

export function StrategyView({
  strategy,
  module,
  locale,
}: {
  strategy: StrategyRecord;
  module: GameModule;
  locale: Locale;
}) {
  const t = TESTI[locale];
  const kind = strategyKind(strategy);
  const phases = phasesView(module, strategy, strategy.phases, locale);
  const written = phases.filter((phase) => phase.note.trim());
  const empty = phases.filter((phase) => !phase.note.trim());
  const set = setView(module, strategy.artifactSet, locale);
  const mode = inLingua(modeName(module, strategy.mode), locale) ?? "";

  return (
    <div>
      <div className="p5-corner flex flex-wrap items-center gap-x-4 gap-y-2 border border-rule border-l-4 border-l-brand bg-paper-2 px-3.5 py-2.5">
        <KindTag kind={kind} phases={written.length} locale={locale} />
        <span className="min-w-0">
          {/* Re Demone e Divinita' hanno un bersaglio solo: il nome della modalita' e' gia' nell'etichetta */}
          {strategy.target ? <span className={cx(eyebrow, "block text-[11px]")}>{mode}</span> : null}
          <span className="block font-display text-[16px] leading-tight font-extrabold uppercase [font-variation-settings:'wdth'_85]">
            {selectionLabel(module, strategy, locale)}
          </span>
        </span>
        <MoreLink href={selectionPageHref(strategy.game, strategy, module)} className="ml-auto">
          {t.vai}
        </MoreLink>
      </div>

      <Block title={t.squadra}>
        <TeamBoard team={teamView(module, strategy.team, locale)} locale={locale} />
      </Block>

      <Block title={t.set}>
        {set ? <SetLine set={set} locale={locale} full /> : <p className="m-0 text-sm text-ink-3">{t.nessunSet}</p>}
      </Block>

      {strategy.notes.trim() ? (
        <Block title={t.note}>
          <Prose text={strategy.notes} />
        </Block>
      ) : null}

      {written.length > 0 ? (
        <Block title={t.fasi}>
          <ol className="m-0 grid list-none gap-3 p-0">
            {phases.map((phase, i) =>
              phase.note.trim() ? (
                <li key={i} className="p5-corner border border-rule bg-paper-2 p-3.5">
                  <div className="mb-2 flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
                    <span className="font-display text-[15px] font-black uppercase text-brand-deep [font-variation-settings:'wdth'_82]">
                      {phase.label}
                    </span>
                    {phase.detail ? <span className="text-[13px] text-ink-3">{phase.detail}</span> : null}
                  </div>
                  <Prose text={phase.note} className="text-[14.5px]" />
                </li>
              ) : null,
            )}
          </ol>
          {empty.length > 0 ? (
            <p className="m-0 mt-2.5 text-[13px] text-ink-3">{t.senzaNota(empty.map((phase) => phase.label).join(", "))}</p>
          ) : null}
        </Block>
      ) : null}

      {/* per chi arriva dalla pagina dell'Endgame: il ritorno e' anche in fondo */}
      <p className="m-0 mt-6 text-[13px] text-ink-3">
        {t.dove}:{" "}
        <Link
          href={selectionPageHref(strategy.game, strategy, module)}
          className="text-ink-2 underline decoration-rule underline-offset-2 hover:text-brand-deep"
        >
          {strategy.target ? `${mode} · ` : ""}
          {selectionLabel(module, strategy, locale)}
        </Link>
      </p>
    </div>
  );
}
