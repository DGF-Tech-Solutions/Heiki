/**
 * L'anteprima accanto alla griglia Eroi: l'eroe sotto il mouse, o col fuoco
 * della tastiera, in grande e coi dati che servono a scegliere.
 *
 * Dal 24/10 era sul modello di Duet Night Abyss: la figura su una lama obliqua,
 * il nome e quattro righe della descrizione del gioco. Il 25/10 l'utente ha
 * chiesto di cambiarla, prendendo le scelte vincenti di altri siti del genere.
 * Ne abbiamo studiati una quarantina (Prydwen, nikke.gg, GameWith, SchaleDB,
 * StarRailStation, i siti ufficiali di HoYoverse, Kuro e Netmarble...), e quelli
 * che funzionano dicono la stessa cosa: l'anteprima e' una scheda per decidere
 * il clic, non una vetrina. Da li':
 *   - in alto chi e': l'epiteto in testo semplice (non una targhetta sopra il
 *     titolo), il nome grande, poi attributo, rarita' e razza con icona E
 *     parola. Il colore dell'attributo sta solo nell'icona e in un filo: nel
 *     tema Classico e' l'unico colore dell'anteprima, insieme alla figura
 *   - la figura a mezzo busto (25/10 sera, richiesta dell'utente: intere erano
 *     troppo piccole), grande e della stessa misura per tutti, col volto al
 *     centro; sfuma in fondo nella lama, sopra la linea di terra nel colore
 *     dell'attributo. La lama dietro e' il gettone `stage`: rossa nel tema
 *     Persona, bianca col retino nero nel Classico
 *   - i dati in fasce fisse, uguali per ogni eroe: la classe di combattimento
 *     al massimo con la posizione fra tutti gli eroi (il numero che i giocatori
 *     di Grand Cross guardano per primo), il voto della community, due righe di
 *     fatti (fine gioco, abilita' speciale, Unica), attacco, difesa e PS con una
 *     barra, le versioni dello stesso personaggio, il tuo box, l'uscita, e un
 *     comando solo, «Apri la scheda». La descrizione del gioco e' uscita: racconta
 *     la storia invece di aiutare a scegliere, e rubava spazio alla figura
 *   - ogni fascia ha il suo spazio anche quando l'eroe non ha niente da metterci
 *     (il nome ha sempre due righe, i fatti due): lo spazio
 *     della figura e' lo stesso per tutti i 377, e la scala di Shinra con lui.
 *     Prima un nome su due righe rimpiccioliva la figura del 14%, e lama e
 *     comando saltavano passando da una card all'altra
 *   - i dati cambiano nello stesso istante del passaggio del mouse; si muove
 *     solo la figura, con un ingresso breve. Il passaggio aspetta che il mouse
 *     si fermi un attimo sulla card (roster-browser.tsx), e intanto la figura si
 *     scarica (`preloadPeek`)
 *
 * Senza stato: la griglia la ridisegna a ogni eroe, e le chiavi fanno ripartire
 * l'ingresso della figura. Tutto e' visibile anche senza animazione.
 */

import Image, { getImageProps } from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { preload } from "react-dom";
import type { StageArt, StageBadge } from "@/components/heroes/hero-stage";
import { IconCheck, IconChevronLeft, IconChevronRight } from "@/components/icons";
import { cx, numeric } from "@/components/ui";
import type { BoxEntry } from "@/lib/games/hero-box";
import type { PeekFacts, PeekIndex } from "@/lib/games/hero-peek-facts";
import { heroCardSrc, heroCutInSrc, heroEpithet, heroName, heroSplashSrc } from "@/lib/games/heroes";
import type { HeroEntry } from "@/lib/games/types";
import { intlLocale, testi, type Locale } from "@/lib/i18n/locale";
import { BEST_CONTENTS, type HeroRatingOverview } from "@/lib/ratings/types";
import { rem } from "@/lib/rem";

/** [sinistra, cima, destra, fondo] della sagoma, in centesimi del lato del file */
export type FigureBox = readonly [number, number, number, number];

/** senza misura si inquadra tutto il file: piu' piccola, ma intera */
export const WHOLE_FILE: FigureBox = [0, 0, 100, 100];

/**
 * La figura a mezzo busto: il file (quadrato) e' disegnato alto 1,9 volte lo
 * spazio della figura diviso 0,65 (vedi .peek-figure): circa 1.250 px a
 * 2560x1440, 920 a 1920x1080, 660 a 1440x900. L'originale e' 1024, e il servizio
 * delle immagini non ingrandisce: sopra si chiede il file intero.
 */
const FIGURE_SIZES = "(min-width: 1700px) 1080px, 660px";
/** il cut-in nella lama: largo poco piu' dell'anteprima. L'originale e' 512 */
const CUT_IN_SIZES = "520px";
/**
 * Le versioni in fila: fino a 7 si vedono tutte; oltre, 6 e «+N». Sette posti
 * da 44 px stanno anche nell'anteprima piu' stretta (22rem): la fila non va mai
 * a capo, e la fascia ha sempre la stessa altezza
 */
const VERSIONS_FIT = 7;

const TESTI = testi({
  it: {
    classe: "Classe di combattimento",
    classeNota: "Al livello massimo, con la Mossa finale al rango 6 e il Vero risveglio, senza equipaggiamento",
    posizione: (rank: string, total: string) => `${rank}° su ${total}`,
    senzaEquip: "al massimo, senza equipaggiamento",
    community: "Voto della community",
    suCinque: (n: string) => (n === "1" ? "su 5, 1 voto" : `su 5, ${n} voti`),
    meglioIn: (dove: string) => `meglio in ${dove}`,
    nessunVoto: "Nessun voto",
    valuta: "Dai il tuo voto",
    unica: (nome: string) => `Unica: ${nome}`,
    statistiche: "Statistiche al massimo, senza equipaggiamento",
    stat: { atk: "Attacco", def: "Difesa", hp: "PS" },
    versioni: "Le versioni di questo personaggio",
    nessunaVersione: "Nessun'altra versione",
    altre: (n: number) => `e altre ${n}`,
    nelBox: (dettagli: string) => `Nel tuo box: ${dettagli}`,
    nonNelBox: "Non è nel tuo box",
    livello: (n: number) => `livello ${n}`,
    risvegli: (n: number) => (n === 0 ? "nessun Risveglio" : n === 1 ? "1 Risveglio" : `${n} Risvegli`),
    ultimate: (n: number) => `Ultimate al rango ${n}`,
    veroRisveglio: "Vero risveglio",
    uscita: (data: string) => `Uscito sul globale il ${data}`,
    precedente: "Eroe precedente",
    successivo: "Eroe successivo",
    scorri: (i: number, n: number) => `${i} di ${n}`,
  },
  en: {
    classe: "Combat Class",
    classeNota: "At max level, with the Ultimate Move at rank 6 and True Awakening, without gear",
    posizione: (rank: string, total: string) => `#${rank} of ${total}`,
    senzaEquip: "at max, without gear",
    community: "Community rating",
    suCinque: (n: string) => (n === "1" ? "out of 5, 1 vote" : `out of 5, ${n} votes`),
    meglioIn: (where: string) => `best in ${where}`,
    nessunVoto: "No votes yet",
    valuta: "Rate this hero",
    unica: (name: string) => `Unique: ${name}`,
    statistiche: "Max stats, without gear",
    stat: { atk: "Attack", def: "Defense", hp: "HP" },
    versioni: "Versions of this character",
    nessunaVersione: "No other versions",
    altre: (n: number) => `and ${n} more`,
    nelBox: (details: string) => `In your box: ${details}`,
    nonNelBox: "Not in your box",
    livello: (n: number) => `level ${n}`,
    risvegli: (n: number) => (n === 0 ? "no Awakening" : n === 1 ? "1 Awakening" : `${n} Awakenings`),
    ultimate: (n: number) => `Ultimate Move at rank ${n}`,
    veroRisveglio: "True Awakening",
    uscita: (date: string) => `Global release: ${date}`,
    precedente: "Previous hero",
    successivo: "Next hero",
    scorri: (i: number, n: number) => `${i} of ${n}`,
  },
});

const STAT_KEYS = ["atk", "def", "hp"] as const;

/**
 * Figura e cut-in di un eroe che probabilmente verra' mostrato (i vicini di
 * quello nell'anteprima, roster-browser.tsx), con le stesse misure
 * dell'anteprima: all'ingresso sono gia' arrivati. A bassa priorita', e niente
 * con «risparmio dati» del browser.
 */
export function preloadPeek(game: string, heroId: string, art: StageArt) {
  const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (connection?.saveData) return;
  const images = [
    art.art === "cutout" ? { src: heroSplashSrc(game, heroId), sizes: FIGURE_SIZES } : null,
    art.cutIn ? { src: heroCutInSrc(game, heroId), sizes: CUT_IN_SIZES } : null,
  ];
  for (const image of images) {
    if (!image) continue;
    const { props } = getImageProps({ src: image.src, alt: "", fill: true, sizes: image.sizes });
    preload(props.src, { as: "image", imageSrcSet: props.srcSet, imageSizes: props.sizes, fetchPriority: "low" });
  }
}

export function HeroPeek({
  game,
  hero,
  locale,
  art,
  box = WHOLE_FILE,
  badges,
  tint,
  facts,
  peek,
  rating,
  boxEntry,
  versions,
  onVersion,
  nav,
  children,
  priority = false,
}: {
  game: string;
  hero: HeroEntry;
  locale: Locale;
  art: StageArt;
  box?: FigureBox;
  /** attributo, rarita', razza */
  badges?: readonly StageBadge[];
  /** il colore dell'attributo, per la linea di terra e il filo del suo tassello */
  tint?: string;
  /** classe, statistiche, uscita, fine gioco (hero-peek-facts.ts) */
  facts?: PeekFacts;
  /** i totali e i massimi del gioco, per le posizioni e le barre */
  peek?: Pick<PeekIndex, "total" | "max">;
  rating?: HeroRatingOverview;
  /**
   * L'eroe nel box di chi guarda: i suoi progressi, `null` se non ce l'ha. Chi
   * non ha un box non passa niente e non vede la riga (nessun rimprovero)
   */
  boxEntry?: BoxEntry | null;
  /** tutte le versioni dello stesso personaggio, questa compresa, nell'ordine della griglia */
  versions?: readonly HeroEntry[];
  /** passaggio o fuoco su una versione: l'anteprima la mostra */
  onVersion?: (heroId: string) => void;
  /** precedente e successivo fra gli eroi della griglia, coi filtri di adesso */
  nav?: { readonly index: number; readonly count: number; readonly onPrev: () => void; readonly onNext: () => void };
  /** il comando: Apri la scheda */
  children?: ReactNode;
  priority?: boolean;
}) {
  const t = TESTI[locale];
  const number = intlLocale(locale);
  const name = heroName(hero, locale);
  const epithet = heroEpithet(hero, locale);
  const [left, top, right, bottom] = box;
  const [faceX, faceY] = art.figure;
  // la parola piu' lunga e la lunghezza intera decidono quanto puo' essere grande il nome (.peek-name)
  const nameChars = Math.max(...name.split(/\s+/).map((word) => [...word].length));
  // le migliaia sempre separate: in italiano toLocaleString scrive «7520» accanto a «10.430»
  const fmt = (value: number) => value.toLocaleString(number, { useGrouping: "always" });
  const fmt1 = (value: number) => value.toLocaleString(number, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const total = peek?.total ?? 0;
  const released = facts?.released
    ? new Date(`${facts.released}T00:00:00Z`).toLocaleDateString(number, {
        // il mese in lettere: «06/18/2026» in inglese e «18/06/2026» in italiano si scambiano
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      })
    : null;
  // le due righe dei fatti: prima il fine gioco (dove l'eroe conta o non entra), poi l'abilita' speciale, poi l'Unica
  const factLines = [
    ...new Set([
      ...(facts?.endgame ?? []),
      ...(facts?.special ? [facts.special] : []),
      ...(facts?.unique ? [t.unica(facts.unique)] : []),
    ]),
  ].slice(0, 2);
  const others = versions && versions.length > 1 ? versions : [];
  const shownVersions = others.length > VERSIONS_FIT ? others.slice(0, VERSIONS_FIT - 1) : others;
  const hiddenVersions = others.length - shownVersions.length;
  const boxLine = boxEntry
    ? [
        t.livello(boxEntry.level),
        t.risvegli(boxEntry.awaken),
        t.ultimate(boxEntry.ultimateRank),
        ...(boxEntry.trueAwakening.some(Boolean) ? [t.veroRisveglio] : []),
      ].join(", ")
    : null;

  return (
    <div
      className="peek"
      style={
        {
          ...(tint ? { "--peek-tint": tint } : {}),
          "--box-l": left / 100,
          "--box-t": top / 100,
          "--box-r": right / 100,
          "--box-b": bottom / 100,
          // dove il file taglia la sagoma (ali, mantelli, gambe fino al bordo): li' la figura sfuma
          "--cut-l": left <= 1 ? 1 : 0,
          "--cut-t": top <= 1 ? 1 : 0,
          "--cut-r": right >= 99 ? 1 : 0,
          "--cut-b": bottom >= 99 ? 1 : 0,
          // il primo piano nella lama dalla parte opposta al volto della figura
          "--echo-side": faceX >= (left + right) / 2 ? -1 : 1,
          // il mezzo busto mette il volto sempre nello stesso punto
          "--face-x": faceX / 100,
          "--face-y": faceY / 100,
          "--name-chars": nameChars,
          "--name-len": [...name].length,
        } as CSSProperties
      }
    >
      <div className="peek-head">
        {/*
          Epiteto e nome in un titolo solo, come nel gioco: l'epiteto sopra, in
          testo semplice (non una targhetta). Le frecce stanno accanto all'epiteto
        */}
        <h2 className="peek-title">
          <span className="peek-epithet" title={epithet}>
            {epithet}
          </span>
          <span className="stage-name peek-name">{name}</span>
        </h2>

        {nav && nav.count > 1 ? (
          <div className="peek-nav">
            <button type="button" onClick={nav.onPrev} aria-label={t.precedente} title={t.precedente} className="peek-nav-button">
              <IconChevronLeft size={16} />
            </button>
            <span className={cx(numeric, "peek-nav-count")} aria-label={t.scorri(nav.index + 1, nav.count)}>
              {nav.index + 1}/{nav.count}
            </span>
            <button type="button" onClick={nav.onNext} aria-label={t.successivo} title={t.successivo} className="peek-nav-button">
              <IconChevronRight size={16} />
            </button>
          </div>
        ) : null}

        <ul className="peek-chips">
          {(badges ?? []).map((badge) => (
            <li
              key={badge.label}
              className="peek-chip"
              style={badge.color ? ({ "--chip-tint": badge.color } as CSSProperties) : undefined}
            >
              {badge.iconSrc ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={badge.iconSrc} alt="" width={20} height={20} style={{ width: rem(20) }} className="h-auto" />
              ) : null}
              {badge.label}
            </li>
          ))}
        </ul>
      </div>

      <div aria-hidden className="peek-blade">
        <div className="peek-blade-edge" />
        <div className="peek-blade-face">
          {art.cutIn ? (
            // si rimonta a ogni eroe: senza, il cut-in di prima resta finche' il nuovo non arriva
            <div key={hero.id} className="peek-cutin">
              <Image
                src={heroCutInSrc(game, hero.id)}
                alt=""
                fill
                sizes={CUT_IN_SIZES}
                priority={priority}
                className="peek-cutin-img object-cover"
              />
            </div>
          ) : null}
        </div>
        <div className="peek-ground" />
      </div>

      <div aria-hidden className="peek-stage">
        {art.art === "cutout" ? (
          <div key={hero.id} className="peek-figure">
            <Image
              src={heroSplashSrc(game, hero.id)}
              alt=""
              fill
              sizes={FIGURE_SIZES}
              priority={priority}
              className="peek-figure-img object-contain"
            />
          </div>
        ) : null}
      </div>

      <div className="peek-body">
        <div className="peek-verdict">
          {facts?.cc ? (
            <div className="peek-cell" title={t.classeNota}>
              <p className="peek-label">{t.classe}</p>
              <p className={cx(numeric, "peek-big")}>{fmt(facts.cc.value)}</p>
              <p className="peek-sub">{t.posizione(fmt(facts.cc.rank), fmt(total))}</p>
              {/* scritta e non solo nel titolo: tastiera, tocco e lettori di schermo non lo mostrano */}
              <p className="peek-sub">{t.senzaEquip}</p>
            </div>
          ) : null}
          <div className="peek-cell">
            <p className="peek-label">{t.community}</p>
            {rating && rating.count > 0 ? (
              <>
                <p className="peek-big">
                  <span className="peek-big-key">PvE</span> <span className={numeric}>{fmt1(rating.pve)}</span>{" "}
                  <span className="peek-big-key">PvP</span> <span className={numeric}>{fmt1(rating.pvp)}</span>
                </p>
                <p className="peek-sub">{t.suCinque(fmt(rating.count))}</p>
                <p className="peek-sub">{rating.best ? t.meglioIn(BEST_CONTENTS[rating.best].label[locale]) : null}</p>
              </>
            ) : (
              <>
                <p className="peek-big peek-big--quiet">{t.nessunVoto}</p>
                <p className="peek-sub">
                  <Link href={`/${game}/eroi/${hero.id}?scheda=valutazioni`} className="peek-link">
                    {t.valuta}
                  </Link>
                </p>
              </>
            )}
          </div>
        </div>

        {/* due righe sempre, anche vuote: i dati sotto restano allo stesso posto per ogni eroe */}
        <ul className="peek-facts">
          {factLines.map((line) => (
            <li key={line} title={line}>
              {line}
            </li>
          ))}
        </ul>

        {facts?.atk || facts?.def || facts?.hp ? (
          <dl className="peek-stats" aria-label={t.statistiche} title={t.statistiche}>
            {STAT_KEYS.map((key) => {
              const stat = facts?.[key];
              const max = peek?.max[key] ?? 0;
              if (!stat || max <= 0) return null;
              return (
                <div key={key} className="peek-stat">
                  <dt>{t.stat[key]}</dt>
                  <dd className="peek-bar" style={{ "--fill": Math.min(1, stat.value / max) } as CSSProperties}>
                    <span />
                  </dd>
                  <dd className={cx(numeric, "peek-value")}>{fmt(stat.value)}</dd>
                  <dd className="peek-rank">{t.posizione(fmt(stat.rank), fmt(total))}</dd>
                </div>
              );
            })}
          </dl>
        ) : null}

        {versions ? (
          <div className="peek-versions">
            <p className="peek-label">{t.versioni}</p>
            {shownVersions.length > 0 ? (
              <ul>
                {/*
                  Tutte le versioni, questa compresa e segnata: se mancasse quella
                  mostrata, al passaggio l'elenco cambierebbe sotto il mouse e
                  l'anteprima salterebbe da una all'altra
                */}
                {shownVersions.map((version) => (
                  <li key={version.id}>
                    <Link
                      href={`/${game}/eroi/${version.id}`}
                      onMouseEnter={() => onVersion?.(version.id)}
                      onFocus={() => onVersion?.(version.id)}
                      aria-current={version.id === hero.id ? "true" : undefined}
                      title={`${heroEpithet(version, locale)} ${heroName(version, locale)}`}
                      className="peek-version"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element -- card gia' pronte in due densita' */}
                      <img
                        src={heroCardSrc(game, version.id)}
                        srcSet={`${heroCardSrc(game, version.id)} 1x, ${heroCardSrc(game, version.id, 2)} 2x`}
                        alt={`${heroEpithet(version, locale)} ${heroName(version, locale)}`}
                        width={44}
                        height={44}
                        style={{ width: rem(44) }}
                        loading="lazy"
                        decoding="async"
                        className="block aspect-square h-auto"
                      />
                    </Link>
                  </li>
                ))}
                {hiddenVersions > 0 ? (
                  <li className="peek-more">
                    <span aria-hidden>+{hiddenVersions}</span>
                    <span className="sr-only">{t.altre(hiddenVersions)}</span>
                  </li>
                ) : null}
              </ul>
            ) : (
              <p className="peek-none">{t.nessunaVersione}</p>
            )}
          </div>
        ) : null}

        {boxEntry !== undefined ? (
          <p className="peek-box" title={boxLine ? t.nelBox(boxLine) : undefined}>
            {boxLine ? (
              <>
                <IconCheck size={13} />
                {t.nelBox(boxLine)}
              </>
            ) : (
              t.nonNelBox
            )}
          </p>
        ) : null}

        {/* l'uscita ha il suo spazio anche quando manca */}
        <p className="peek-release">{released ? t.uscita(released) : null}</p>
        {children ? <div className="peek-actions">{children}</div> : null}
      </div>
    </div>
  );
}
