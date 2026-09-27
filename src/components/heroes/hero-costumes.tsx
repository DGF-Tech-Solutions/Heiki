/**
 * La scheda «Costumi» della pagina di un eroe: tutti i suoi costumi, per tipo,
 * con l'icona come la disegna il gioco, la rarita', le percentuali, quanto danno
 * dal primo livello al massimo, il set e la descrizione.
 *
 * Nuova il 27/09, col calcolatore: la' si scelgono i cinque registrati per tipo,
 * qui si vedono tutti. Disegnata dal server, senza JavaScript.
 */

import Link from "next/link";
import { GameText } from "@/components/heroes/game-text";
import { ItemIcon, costumeSrc } from "@/components/heroes/calculator/item-icon";
import { formatStat, statName } from "@/components/heroes/calculator/stat-rows";
import { cx, eyebrow, numeric } from "@/components/ui";
import { COSTUME_KINDS, costumeFlat, costumeMaxStep } from "@/lib/games/gear";
import type { CostumeIndex, CostumeKind, ItemIconLayers } from "@/lib/games/gear-types";
import { inLingua, testi, type Locale } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    titolo: (n: number) => `Costumi · ${n}`,
    intro:
      "Nel gioco contano solo i costumi registrati: cinque per tipo (per alcuni eroi niente armi). Il gioco registra da solo i nuovi finché c'è posto, e si possono cambiare. Al massimo danno tutti lo stesso valore, 210 Attacco o Difesa e 1.650 PS (i LR 240 e 1.890): quello che cambia fra un costume e l'altro sono le percentuali.",
    calcolatore: "Scegli i registrati nel calcolatore",
    tipo: { body: "Corpo", weapon: "Arma", head: "Testa" } satisfies Record<CostumeKind, string>,
    posti: (n: number) => (n === 0 ? "nessun posto" : `${n} posti`),
    partenza: "fra i cinque migliori",
    set: (nome: string) => `Set: ${nome}`,
    condiviso: "condiviso fra le versioni del personaggio",
    senzaNome: (id: string) => `Costume ${id}`,
    senzaNomeNota: "senza nome nel client",
    nessunaPercentuale: "nessuna percentuale",
    fonte:
      "Dalle tabelle del client: DB_costume_base per i costumi e le percentuali, DB_costume_stat per il valore a ogni livello (dalla rarità del costume fino a UR livello 30, o LR per i LR), DB_skin_base per i posti.",
  },
  en: {
    titolo: (n: number) => `Costumes · ${n}`,
    intro:
      "In the game only registered costumes count: five per type (no weapons for some heroes). The game registers new ones by itself while there's room, and they can be changed. Maxed out they all give the same value, 210 Attack or Defense and 1,650 HP (LR ones 240 and 1,890): what changes between costumes are the percentages.",
    calcolatore: "Choose the registered ones in the calculator",
    tipo: { body: "Outfit", weapon: "Weapon", head: "Headgear" } satisfies Record<CostumeKind, string>,
    posti: (n: number) => (n === 0 ? "no slots" : `${n} slots`),
    partenza: "among the five best",
    set: (nome: string) => `Set: ${nome}`,
    condiviso: "shared between the character's versions",
    senzaNome: (id: string) => `Costume ${id}`,
    senzaNomeNota: "no name in the client",
    nessunaPercentuale: "no percentages",
    fonte:
      "From the client's tables: DB_costume_base for the costumes and their percentages, DB_costume_stat for the value at every level (from the costume's rarity up to UR level 30, or LR for LR ones), DB_skin_base for the slots.",
  },
});

export function HeroCostumes({
  game,
  locale,
  heroId,
  costumes,
  icons,
}: {
  game: string;
  locale: Locale;
  heroId: string;
  costumes: CostumeIndex;
  icons: ItemIconLayers;
}) {
  const t = TESTI[locale];
  const hero = costumes.heroes[heroId];
  if (!hero) return null;
  const total = COSTUME_KINDS.reduce((sum, kind) => sum + hero.all[kind].length, 0);

  return (
    <section>
      <h2 className={cx(eyebrow, "mb-2.5")}>{t.titolo(total)}</h2>
      <p className="m-0 max-w-[75ch] text-[13px] text-ink-2">{t.intro}</p>
      <Link href="?scheda=statistiche" className="mt-1 inline-block text-[13px] text-brand hover:underline">
        {t.calcolatore}
      </Link>

      {COSTUME_KINDS.map((kind) => {
        const ids = hero.all[kind];
        if (ids.length === 0) return null;
        const start = new Set(hero.start[kind]);
        const flat = costumes.flatStat[kind];
        return (
          <div key={kind} className="mt-6">
            <h3 className="m-0 mb-2 text-[14px] font-semibold text-ink">
              {t.tipo[kind]} <span className="font-normal text-ink-3">· {ids.length} · {t.posti(hero.slots[kind])}</span>
            </h3>
            <ul className="m-0 grid list-none grid-cols-1 gap-2 p-0 sm:grid-cols-2 @4xl:grid-cols-3">
              {ids.map((id) => {
                const costume = costumes.costumes[id];
                if (!costume) return null;
                const name = inLingua(costume.name, locale);
                const description = inLingua(costume.description, locale);
                const setName = costume.set ? inLingua(costumes.sets[String(costume.set)]?.name, locale) : null;
                const percents = Object.entries(costume.percents);
                return (
                  <li key={id} className="grid grid-cols-[72px_minmax(0,1fr)] gap-3 rounded-card border border-rule bg-paper-2 p-2.5">
                    <ItemIcon
                      game={game}
                      icons={icons}
                      kind="costume"
                      object={costume.icon ? costumeSrc(game, id) : null}
                      rating={costume.rarity}
                      mark={costume.shared ? "condiviso" : costume.set ? "set" : "costume"}
                      size={72}
                      label={name ?? t.senzaNome(id)}
                    />
                    <div className="min-w-0 text-[12px]">
                      <p className="m-0 text-[13px] font-semibold leading-tight text-ink">
                        {name ?? t.senzaNome(id)}
                        {!name ? <span className="ml-1 font-normal text-ink-3">({t.senzaNomeNota})</span> : null}
                      </p>
                      <p className={cx(numeric, "m-0 mt-1 text-ink-2")}>
                        {icons.rarity[String(costume.rarity)]} · {statName(flat, locale)}{" "}
                        {formatStat(costumeFlat(costumes, costume, 0), locale)} →{" "}
                        {formatStat(costumeFlat(costumes, costume, costumeMaxStep(costumes, costume)), locale)}
                      </p>
                      <p className="m-0 mt-0.5 text-ink-2">
                        {percents.length
                          ? percents.map(([stat, value]) => `${statName(stat, locale)} +${formatStat(value, locale)}%`).join(" · ")
                          : t.nessunaPercentuale}
                      </p>
                      {start.has(id) || setName || costume.shared ? (
                        <p className="m-0 mt-0.5 text-ink-3">
                          {[start.has(id) ? t.partenza : null, setName ? t.set(setName) : null, costume.shared ? t.condiviso : null]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      ) : null}
                      {description ? <GameText text={description} className="mt-1 text-[12px] text-ink-3" /> : null}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
      <p className="mt-5 max-w-[75ch] text-[12px] text-ink-3">{t.fonte}</p>
    </section>
  );
}
