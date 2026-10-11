/**
 * «Squadre consigliate»: le strategie pubblicate per un boss, una bestia o una
 * modalita', nella difficolta' che la pagina mostra.
 *
 * Componente server: legge dal database da solo, cosi' le quattro pagine
 * dell'Endgame lo mettono con una riga. Ha l'ancora `#squadre`, a cui portano i
 * collegamenti dei post, il modulo di scrittura e l'indice della pagina.
 *
 * Le squadre dipendono dalla difficolta' (a Inferno certi attributi non entrano,
 * il trascendente e' un'altra battaglia): la sezione mostra quelle della
 * difficolta' scelta e, sotto, quante ce ne sono nelle altre, coi collegamenti.
 * Senza database la sezione c'e' lo stesso (l'indice della pagina ci porta) e
 * dice perche' e' vuota.
 */

import Link from "next/link";
import { cx, display, Empty, MoreLink } from "@/components/ui";
import { databaseReachable } from "@/lib/db";
import { currentViewer } from "@/lib/community/actions";
import { getGameModule } from "@/lib/games/registry";
import { inLingua, testi } from "@/lib/i18n/locale";
import { getLocale } from "@/lib/i18n/server";
import { findTarget, newStrategyHref, selectionLabel, selectionPageHref } from "@/lib/strategies/rules";
import { listStrategies, myVotes, strategyCounts } from "@/lib/strategies/server";
import type { EndgameMode, StrategySelection } from "@/lib/strategies/types";
import { StrategyCard } from "./strategy-card";

const TESTI = testi({
  it: {
    titolo: "Squadre consigliate",
    sottotitolo: (dove: string, n: number) =>
      n === 0
        ? `Per ${dove}: squadre e guide scritte dalla community.`
        : `Per ${dove}: ${n === 1 ? "1 squadra o guida" : `${n} squadre e guide`} della community, dalla più votata.`,
    proponi: "Proponi la tua squadra",
    vuoto: (dove: string) => `Nessuna squadra per ${dove}, per ora.`,
    primo: "Proponi la prima",
    regola:
      "Una squadra senza testo si pubblica subito; una guida, con le note sulle fasi, la rivede prima un moderatore.",
    altre: "Nelle altre difficoltà:",
    senzaDatabase: "Le squadre della community si vedono col database acceso.",
  },
  en: {
    titolo: "Recommended teams",
    sottotitolo: (dove: string, n: number) =>
      n === 0
        ? `For ${dove}: teams and guides written by the community.`
        : `For ${dove}: ${n === 1 ? "1 team or guide" : `${n} teams and guides`} from the community, most voted first.`,
    proponi: "Suggest your team",
    vuoto: (dove: string) => `No teams for ${dove} yet.`,
    primo: "Suggest the first one",
    regola: "A team without text goes live right away; a guide, with notes on the phases, is reviewed by a moderator first.",
    altre: "Other difficulties:",
    senzaDatabase: "Community teams show up when the database is running.",
  },
});

/** la misura dei titoli delle sezioni delle pagine dell'Endgame (`SectionTitle`), senza il margine */
const TITLE = "m-0 text-[clamp(24px,3vw,32px)]";

export interface StrategySectionProps {
  game: string;
  mode: EndgameMode;
  /** il boss o la bestia (chiave); null per Re Demone e Divinita' Suprema */
  target?: string | null;
  /** il `level` della difficolta' mostrata; null per le bestie */
  level?: number | null;
  /** bestie: se la pagina mostra il piano trascendente */
  transcendent?: boolean;
  className?: string;
}

export async function StrategySection({
  game,
  mode,
  target = null,
  level = null,
  transcendent = false,
  className,
}: StrategySectionProps) {
  const gameModule = getGameModule(game);
  if (!gameModule) return null;
  const locale = await getLocale();
  const t = TESTI[locale];

  // le bestie non hanno un livello: per loro conta solo il trascendente
  const selection: StrategySelection = {
    mode,
    target,
    level: mode === "creature-nest" ? null : level,
    transcendent: mode === "creature-nest" ? transcendent : false,
  };
  const spec = findTarget(gameModule, mode, target);
  if (!spec) return null;

  if (!(await databaseReachable())) {
    return (
      <section id="squadre" className={cx("scroll-mt-[140px]", className)} aria-labelledby="squadre-titolo">
        <h2 id="squadre-titolo" className={cx(display, TITLE, "mb-3")}>
          {t.titolo}
        </h2>
        <Empty>{t.senzaDatabase}</Empty>
      </section>
    );
  }

  const [items, counts, viewer] = await Promise.all([
    listStrategies(game, selection),
    strategyCounts(game, mode, target),
    currentViewer(),
  ]);
  const votes = await myVotes(viewer?.id ?? null, items.map((item) => item.postId));
  const where = selectionLabel(gameModule, selection, locale);
  const now = new Date();

  // le altre difficolta' che hanno almeno una strategia, nell'ordine del gioco
  const others = spec.levels
    .filter((item) => !(item.level === selection.level && item.transcendent === selection.transcendent))
    .map((item) => ({
      item,
      count:
        counts.find((row) => row.level === item.level && row.transcendent === item.transcendent)?.count ?? 0,
    }))
    .filter((entry) => entry.count > 0);

  const create = newStrategyHref(game, selection);

  return (
    <section id="squadre" className={cx("scroll-mt-[140px]", className)} aria-labelledby="squadre-titolo">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-x-5 gap-y-2 border-b-2 border-brand pb-2.5">
        <div className="min-w-0">
          <h2 id="squadre-titolo" className={cx(display, TITLE)}>
            {t.titolo}
          </h2>
          <p className="m-0 mt-1 max-w-[60ch] text-sm text-ink-2">{t.sottotitolo(where, items.length)}</p>
        </div>
        <MoreLink href={create}>{t.proponi}</MoreLink>
      </div>

      {items.length === 0 ? (
        <Empty>
          <span>
            {t.vuoto(where)}{" "}
            <Link href={create} className="font-semibold text-ink underline decoration-brand underline-offset-2 hover:text-brand-deep">
              {t.primo}
            </Link>
            .
          </span>
        </Empty>
      ) : (
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(min(100%,290px),1fr))] gap-3 p-0">
          {items.map((item) => (
            <li key={item.postId} className="flex min-w-0">
              <StrategyCard data={item} module={gameModule} locale={locale} myVote={votes.get(item.postId) ?? 0} now={now} />
            </li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[13px] text-ink-3">
        {others.length > 0 ? (
          <p className="m-0 flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <span>{t.altre}</span>
            {others.map(({ item, count }) => (
              <Link
                key={`${item.level}-${item.transcendent}`}
                href={selectionPageHref(game, { ...selection, level: item.level, transcendent: item.transcendent }, gameModule)}
                className="text-ink-2 underline decoration-rule underline-offset-2 hover:text-brand-deep"
              >
                {inLingua(item.name, locale)} <span className="font-mono text-[11px]">({count})</span>
              </Link>
            ))}
          </p>
        ) : null}
        <p className="m-0 max-w-[60ch]">{t.regola}</p>
      </div>
    </section>
  );
}
