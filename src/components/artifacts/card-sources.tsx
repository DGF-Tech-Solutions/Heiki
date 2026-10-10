/**
 * Da dove si ottiene una carta: i pacchetti di carte con la probabilita', i
 * pacchetti di una carta sola degli eventi, il Pacchetto di carte del tempo e i
 * drop delle modalita' di fine gioco.
 *
 * Il client non dice tutto: negozi, missioni ed eventi a tempo danno carte da
 * tabelle che qui non si leggono. Quando non si trova niente la pagina lo dice
 * con queste parole, invece di lasciare intendere che la carta non si ottenga.
 */

import Link from "next/link";
import { cx, eyebrow, numeric } from "@/components/ui";
import type { ArtifactCard, ArtifactIndex } from "@/lib/games/artifact-types";
import { artifactImageSrc, cardSources, isSingleCardPack, packChance, type CardSource } from "@/lib/games/artifacts";
import { formatNumber, formatPercent } from "@/lib/games/endgame";
import type { EndgameMode } from "@/lib/games/endgame-types";
import type { GameModule } from "@/lib/games/types";
import { inLingua, testi, type Locale } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    pacchetti: "Pacchetti di carte",
    probabilitaNota: "Probabilità: il peso della carta sulla somma dei pesi del pacchetto. L'estrazione la fa il server.",
    eventi: "Pacchetti di una carta sola (eventi)",
    senzaNome: "pacchetto senza nome nel client",
    tempo: "Pacchetto di carte del tempo",
    tempoRiga: (quota: string, peso: string, lista: string) =>
      `${quota} a pacchetto (peso ${peso}); nella lista dei desideri il peso sale a ${lista}.`,
    endgame: "Modalità di fine gioco",
    modi: {
      "death-match": "Scontri finali",
      "creature-nest": "Bestie demoniache",
      "demon-king": "Re Demone",
      "supreme-deity": "Divinità Suprema",
    } satisfies Record<EndgameMode, string>,
    come: {
      drop: (p: string) => `${p} per estrazione`,
      leader: (p: string) => `${p} al capo del gruppo`,
      clear: () => "ricompensa di completamento",
      "first-clear": () => "primo completamento",
      guaranteed: () => "vittoria garantita",
      box: (p: string) => (p ? `in una cassa, ${p}` : "in una cassa"),
    },
    niente:
      "Nessun pacchetto di carte né modalità di fine gioco la dà. Arriva da altre strade (negozi, missioni, eventi), che qui non leggiamo.",
  },
  en: {
    pacchetti: "Card packs",
    probabilitaNota: "Chance: the card's weight over the sum of the pack's weights. The server makes the draw.",
    eventi: "Single-card packs (events)",
    senzaNome: "pack with no name in the client",
    tempo: "Card Pack of Time",
    tempoRiga: (quota: string, peso: string, lista: string) =>
      `${quota} per pack (weight ${peso}); on the wishlist the weight goes up to ${lista}.`,
    endgame: "Endgame modes",
    modi: {
      "death-match": "Death Match",
      "creature-nest": "Demonic Beasts",
      "demon-king": "Demon King",
      "supreme-deity": "Supreme Deity",
    } satisfies Record<EndgameMode, string>,
    come: {
      drop: (p: string) => `${p} per draw`,
      leader: (p: string) => `${p} to the party leader`,
      clear: () => "clear reward",
      "first-clear": () => "first clear",
      guaranteed: () => "guaranteed victory",
      box: (p: string) => (p ? `in a chest, ${p}` : "in a chest"),
    },
    niente:
      "No card pack or endgame mode gives it. It comes from other routes (shops, missions, events), which we do not read here.",
  },
});

function sourceText(source: CardSource, locale: Locale): string {
  const come = TESTI[locale].come[source.how];
  return come(source.chance !== null ? formatPercent(source.chance, locale) : "");
}

/**
 * `compact`: nella pagina del set, una riga per carta; i pacchetti di una carta
 * sola si contano invece di elencarli.
 */
export function CardSources({
  game,
  card,
  data,
  gameModule,
  locale,
  compact,
}: {
  game: string;
  card: ArtifactCard;
  data: ArtifactIndex;
  gameModule: GameModule;
  locale: Locale;
  compact?: boolean;
}) {
  const t = TESTI[locale];
  const packs = card.packs.map((id) => ({ id, pack: data.packs[id]! })).filter((entry) => entry.pack);
  const multi = packs.filter((entry) => !isSingleCardPack(entry.pack));
  const single = packs.filter((entry) => isSingleCardPack(entry.pack));
  const endgame = cardSources(gameModule, game, card.id);
  const timeTotal = data.cards.reduce((sum, entry) => sum + (entry.timePack?.weight ?? 0), 0);

  if (multi.length === 0 && single.length === 0 && endgame.length === 0 && !card.timePack) {
    return <p className="m-0 text-[13px] text-ink-3">{t.niente}</p>;
  }

  const packName = (id: string) => inLingua(data.packs[id]?.name, locale) ?? t.senzaNome;

  return (
    <div className={cx("grid gap-3 text-[13px]", compact && "gap-1.5")}>
      {multi.length > 0 ? (
        <div>
          {compact ? null : <p className={cx(eyebrow, "m-0 mb-1.5")}>{t.pacchetti}</p>}
          <ul className="m-0 list-none p-0">
            {multi.map(({ id, pack }) => {
              const weight = pack.cards.find((entry) => entry.card === card.id)?.weight ?? 0;
              const chance = packChance(pack, weight);
              return (
                <li key={id} className="flex items-center gap-2 py-0.5">
                  {pack.icon && !compact ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={artifactImageSrc(game, `pacchetti/${pack.icon}`)}
                      alt=""
                      width={24}
                      height={24}
                      loading="lazy"
                      className="block shrink-0"
                    />
                  ) : null}
                  <span className="min-w-0">{packName(id)}</span>
                  {chance !== null ? (
                    <span className={cx(numeric, "ml-auto shrink-0 text-ink-2")}>{formatPercent(chance, locale)}</span>
                  ) : null}
                </li>
              );
            })}
          </ul>
          {compact ? null : <p className="m-0 mt-1 text-[12px] text-ink-3">{t.probabilitaNota}</p>}
        </div>
      ) : null}

      {single.length > 0 ? (
        <div>
          <p className={cx("m-0", compact ? "text-[12px] text-ink-3" : cx(eyebrow, "mb-1.5"))}>
            {t.eventi}
            {compact ? `: ${single.map(({ id }) => packName(id)).join(" · ")}` : null}
          </p>
          {compact ? null : (
            <ul className="m-0 list-none p-0">
              {single.map(({ id }) => (
                <li key={id} className="py-0.5">
                  {packName(id)}
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {card.timePack ? (
        <p className={cx("m-0", compact ? "text-[12px] text-ink-3" : "")}>
          <span className={cx(compact ? "" : cx(eyebrow, "mb-1.5 block"))}>
            {t.tempo}
            {compact ? ": " : null}
          </span>
          {t.tempoRiga(
            formatPercent(timeTotal > 0 ? (card.timePack.weight / timeTotal) * 100 : 0, locale),
            formatNumber(card.timePack.weight, locale),
            formatNumber(card.timePack.wishWeight, locale),
          )}
        </p>
      ) : null}

      {endgame.length > 0 ? (
        <div>
          {compact ? null : <p className={cx(eyebrow, "m-0 mb-1.5")}>{t.endgame}</p>}
          <ul className="m-0 list-none p-0">
            {endgame.map((source, position) => (
              <li key={position} className="flex flex-wrap items-baseline gap-x-2 py-0.5">
                <Link href={source.href} className="text-brand-deep underline-offset-2 hover:underline">
                  {t.modi[source.mode]}
                  {source.target ? ` · ${inLingua(source.target, locale)}` : null}
                  {source.stage ? ` · ${inLingua(source.stage, locale)}` : null}
                </Link>
                <span className="text-ink-3">{sourceText(source, locale)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
