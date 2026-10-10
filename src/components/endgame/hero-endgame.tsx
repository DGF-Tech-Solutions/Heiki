/**
 * La riga «Endgame» della scheda eroe: i legami dell'eroe con le quattro
 * modalita' di fine gioco, ognuno un collegamento alla sua sezione.
 *
 * Scelta dell'utente (26/09): sulla scheda di ogni eroe una riga che rimanda
 * alla modalita' («Passiva solo negli Scontri finali», «Escluso dalla Divinita'
 * Suprema»). Le reliquie non passano da qui: la scheda le mostra gia', e il
 * nome della bestia nella sezione Reliquia sacra porta alla bestia.
 *
 * Sta in un file suo e non nella pagina della scheda, che ha gia' duemila righe
 * e un dizionario di testi di centinaia di voci.
 */

import Link from "next/link";
import { cx, eyebrow } from "@/components/ui";
import type { EndgameHeroLink, EndgameMode } from "@/lib/games/endgame-types";
import { plainHeroText } from "@/lib/games/hero-markup";
import { gameIconSrc } from "@/lib/games/heroes";
import { inLingua, testi, type Locale } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    endgame: "Endgame",
    solo: (passiva: string, dove: string) => `«${passiva}» vale solo ${dove}`,
    esclusa: (passiva: string, dove: string) => `«${passiva}» non si attiva ${dove}`,
    escluso: (dove: string) => `Escluso ${dove}`,
    squadraIa: (boss: string) => `Nella squadra IA dello Scontro finale contro ${boss}`,
    sangue: (bestia: string) => `Sangue cattivo di ${bestia}`,
    dove: {
      "death-match": "negli Scontri finali",
      "creature-nest": "nella Battaglia Bestia demoniaca",
      "demon-king": "nella Battaglia del Re Demone",
      "supreme-deity": "nella Battaglia della Divinità Suprema",
    } as Record<EndgameMode, string>,
    contro: (nome: string) => `contro ${nome}`,
    esclusoDa: {
      "death-match": "dagli Scontri finali",
      "creature-nest": "dalla Battaglia Bestia demoniaca",
      "demon-king": "dalla Battaglia del Re Demone",
      "supreme-deity": "dalla Battaglia della Divinità Suprema",
    } as Record<EndgameMode, string>,
    esclusoDaBoss: (nome: string) => `dallo Scontro finale contro ${nome}`,
  },
  en: {
    endgame: "Endgame",
    solo: (passiva: string, dove: string) => `"${passiva}" only works ${dove}`,
    esclusa: (passiva: string, dove: string) => `"${passiva}" does not activate ${dove}`,
    escluso: (dove: string) => `Banned ${dove}`,
    squadraIa: (boss: string) => `In the AI team of the Death Match against ${boss}`,
    sangue: (bestia: string) => `${bestia}'s Bad Blood`,
    dove: {
      "death-match": "in Death Match",
      "creature-nest": "in the Demonic Beast Battle",
      "demon-king": "in the Demon King Battle",
      "supreme-deity": "in the Supreme Deity Battle",
    } as Record<EndgameMode, string>,
    contro: (nome: string) => `against ${nome}`,
    esclusoDa: {
      "death-match": "from Death Match",
      "creature-nest": "from the Demonic Beast Battle",
      "demon-king": "from the Demon King Battle",
      "supreme-deity": "from the Supreme Deity Battle",
    } as Record<EndgameMode, string>,
    esclusoDaBoss: (nome: string) => `from the Death Match against ${nome}`,
  },
});

/** La pagina di ogni modalita'. */
const PATH: Record<EndgameMode, string> = {
  "death-match": "scontri-finali",
  "creature-nest": "bestie-demoniache",
  "demon-king": "re-demone",
  "supreme-deity": "divinita-suprema",
};

/** L'icona di dove si attiva la passiva, dove il gioco ne ha una. */
const CONDITION: Partial<Record<`${EndgameMode}:${"only" | "excluded"}`, string>> = {
  "death-match:only": "destroy_only",
  "death-match:excluded": "destroy_except",
  "creature-nest:only": "creaturenest",
  "creature-nest:excluded": "creaturenest_except",
};

export function HeroEndgameLine({
  game,
  locale,
  links,
  icons,
}: {
  game: string;
  locale: Locale;
  links: readonly EndgameHeroLink[] | undefined;
  icons: Readonly<Record<string, readonly string[]>> | undefined;
}) {
  if (!links || links.length === 0) return null;
  const t = TESTI[locale];
  const plain = (value: { it: string | null; en: string | null } | undefined) =>
    plainHeroText(inLingua(value ?? null, locale) ?? "");

  const rows = links.map((link) => {
    const target = link.target ? plain(link.target.name) : null;
    const where = target ? t.contro(target) : t.dove[link.mode];
    let text: string;
    if (link.kind === "only") text = t.solo(plain(link.passive), where);
    else if (link.kind === "excluded") text = t.esclusa(plain(link.passive), where);
    else if (link.kind === "banned") text = t.escluso(target ? t.esclusoDaBoss(target) : t.esclusoDa[link.mode]);
    else if (link.kind === "ai-team") text = t.squadraIa(target ?? "");
    else text = t.sangue(target ?? "");

    // Dove porta: la pagina del boss o della bestia se il legame e' con uno solo
    // (Scontri finali e Bestie hanno una pagina per boss); se no la pagina della
    // modalita', agli eroi o alla spiegazione dove stanno gli esclusi.
    const href = link.target
      ? `/${game}/${PATH[link.mode]}/${link.target.key}`
      : `/${game}/${PATH[link.mode]}#${link.kind === "banned" ? "come-funziona" : "eroi"}`;
    const condition =
      link.kind === "only" || link.kind === "excluded" ? CONDITION[`${link.mode}:${link.kind}`] : undefined;
    return { href, text, condition };
  });

  return (
    <div className="m-0 mt-2 flex flex-wrap items-start gap-x-2 gap-y-1 text-[13px] text-ink-2">
      <span className={cx(eyebrow, "pt-px")}>{t.endgame}</span>
      <ul className="m-0 grid list-none gap-0.5 p-0">
        {rows.map((row, index) => (
          <li key={index} className="flex items-center gap-1.5">
            {row.condition && icons?.condizione?.includes(row.condition) ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={gameIconSrc(game, "condizione", row.condition)}
                alt=""
                width={16}
                height={16}
                className="inline-block shrink-0"
                style={{ width: 16, height: "auto" }}
              />
            ) : null}
            <Link href={row.href} className="text-ink hover:text-brand-deep">
              {row.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
