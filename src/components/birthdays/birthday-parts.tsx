import Link from "next/link";
import { IconGift } from "@/components/icons";
import { cx, numeric } from "@/components/ui";
import { heroCardSrc } from "@/lib/games/heroes";
import { intlLocale, type Locale } from "@/lib/i18n/locale";

/**
 * I pezzi della pagina Compleanni che servono sia al server (calendario, tabella
 * dei regali) sia al riquadro «Oggi» nel browser: niente hook, niente lingua letta
 * da soli. I testi arrivano gia' nella lingua della pagina.
 */

/** Le icone degli oggetti dei compleanni: `public/eroi/<gioco>/compleanni/<id>.png`, 128px. */
export function birthdayItemSrc(game: string, itemId: string): string {
  return `/eroi/${game}/compleanni/${itemId}.png`;
}

/** `useGrouping: "always"`: in italiano il raggruppamento parte da cinque cifre, e 5000 restava senza punto. */
export function formatCount(n: number, locale: Locale): string {
  return n.toLocaleString(intlLocale(locale), { useGrouping: "always" });
}

/** «25 luglio» / «July 25»: la data senza anno, in UTC perche' e' un giorno e non un istante. */
export function formatMonthDay([month, day]: readonly [number, number], locale: Locale): string {
  return new Intl.DateTimeFormat(intlLocale(locale), { day: "numeric", month: "long", timeZone: "UTC" }).format(
    Date.UTC(2024, month - 1, day),
  );
}

/** Un regalo gia' nella lingua della pagina. */
export interface GiftView {
  item: string;
  name: string;
  count: number;
  affection: number;
  /** i punti nel giorno della festa; null per il regalo comune, che non li moltiplica */
  birthday: number | null;
  returnItem: string;
  returnName: string;
  returnCount: number;
}

export interface GiftLabels {
  affetto: string;
  festa: string;
  ritorno: string;
}

/**
 * Il regalo come lo mostra la finestra della taverna: l'oggetto con quanti ne
 * servono, i punti Affetto (in un giorno qualunque e alla festa) e il regalo di
 * ritorno. I numeri in monospaziato, come in tutto il sito.
 */
export function GiftLine({
  game,
  gift,
  labels,
  locale,
  size = "md",
}: {
  game: string;
  gift: GiftView;
  labels: GiftLabels;
  locale: Locale;
  size?: "sm" | "md";
}) {
  const icon = size === "md" ? 48 : 36;
  return (
    <div className="flex min-w-0 items-center gap-3">
      <span className="relative shrink-0 border border-rule bg-paper-3" style={{ width: icon, height: icon }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- icona del gioco, gia' a 128px */}
        <img src={birthdayItemSrc(game, gift.item)} alt="" width={icon} height={icon} loading="lazy" className="block h-full w-full object-contain" />
        <span className={cx(numeric, "absolute -right-1.5 -bottom-1.5 bg-ink px-1 text-[11px] leading-[16px] font-bold text-paper")}>
          ×{gift.count}
        </span>
      </span>
      <span className="min-w-0">
        <span className="block text-[14px] leading-tight font-semibold text-ink">{gift.name}</span>
        <span className="mt-0.5 flex flex-wrap items-baseline gap-x-2 text-[13px] leading-snug text-ink-2">
          <span>
            {labels.affetto}{" "}
            <span className={cx(numeric, gift.birthday !== null && "text-ink-3 line-through decoration-1")}>
              {formatCount(gift.affection, locale)}
            </span>
            {gift.birthday !== null ? (
              <>
                {" "}
                <span className={cx(numeric, "font-bold text-gold")}>{formatCount(gift.birthday, locale)}</span>{" "}
                <span className="text-ink-3">{labels.festa}</span>
              </>
            ) : null}
          </span>
          <span className="inline-flex items-center gap-1 text-ink-3">
            {labels.ritorno}
            {/* eslint-disable-next-line @next/next/no-img-element -- icona del gioco */}
            <img src={birthdayItemSrc(game, gift.returnItem)} alt="" width={16} height={16} loading="lazy" className="h-4 w-4" />
            <span className={numeric}>{formatCount(gift.returnCount, locale)}</span> {gift.returnName}
          </span>
        </span>
      </span>
    </div>
  );
}

/** Un personaggio in una data, gia' nella lingua della pagina. */
export interface CharacterView {
  group: string;
  name: string;
  /** le versioni con quel compleanno, dalla piu' recente */
  heroes: { id: string; name: string; epithet: string }[];
  /** festeggia in taverna: il regalo preferito (null per chi in taverna ci vive) */
  guest: { gift: GiftView | null; line: string | null } | null;
}

/**
 * Le card delle versioni, sovrapposte: le prime `max` (Meliodas ne ha quindici il
 * 25 luglio), e sotto il nome quante sono. Ogni card porta alla sua scheda. Il
 * nome del personaggio accanto, col pacco se festeggia in taverna.
 */
export function CharacterChip({
  game,
  character,
  versionsLabel,
  guestLabel,
  max = 3,
  card = 40,
}: {
  game: string;
  character: CharacterView;
  versionsLabel: (n: number) => string;
  guestLabel: string;
  max?: number;
  card?: number;
}) {
  const shown = character.heroes.slice(0, max);
  return (
    <span className="flex min-w-0 items-center gap-2.5">
      <span className="flex shrink-0">
        {shown.map((hero, i) => (
          <Link
            key={hero.id}
            href={`/${game}/eroi/${hero.id}`}
            title={`${hero.name} [${hero.epithet}]`}
            className={cx("p5-press relative block shadow-[3px_3px_0_var(--color-paper)]", i > 0 && "-ml-3")}
            style={{ zIndex: max - i }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- card gia' pronte in due densita' */}
            <img
              src={heroCardSrc(game, hero.id)}
              srcSet={`${heroCardSrc(game, hero.id)} 1x, ${heroCardSrc(game, hero.id, 2)} 2x`}
              alt={`${hero.name} [${hero.epithet}]`}
              width={card}
              height={card}
              loading="lazy"
              className="block bg-paper-3"
              style={{ width: card, height: card }}
            />
          </Link>
        ))}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1.5 font-display text-[14px] leading-tight font-extrabold tracking-[0.01em] text-ink uppercase [font-variation-settings:'wdth'_84]">
          <span className="truncate">{character.name}</span>
          {character.guest ? (
            <span title={guestLabel} className="inline-flex shrink-0 text-gold">
              <IconGift size={14} />
              <span className="sr-only">{guestLabel}</span>
            </span>
          ) : null}
        </span>
        <span className="block text-[12px] leading-tight text-ink-3">{versionsLabel(character.heroes.length)}</span>
      </span>
    </span>
  );
}
