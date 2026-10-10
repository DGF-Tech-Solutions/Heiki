"use client";

/**
 * «Indovina l'eroe» dalla carta, dall'Unica o dal testo dell'Unica: le altre
 * modalita' di Loldle (splash, abilita', citazione), chieste dall'utente il 27/09.
 *
 * Si mostra una cosa dell'eroe da indovinare, e i tentativi sono solo giusti o
 * sbagliati. La partita, la ricerca, gli aiuti e la fine sono quelli comuni
 * (guess-game.tsx); le regole (zoom, mosaico, punto d'ingrandimento, parole
 * nascoste) in hero-guess.ts, coi test. Il mosaico della carta e dell'icona l'ha
 * chiesto l'utente (senza era troppo facile): acceso di base, si puo' spegnere.
 */

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { GameText } from "@/components/heroes/game-text";
import { cx, display } from "@/components/ui";
import {
  GuessControls,
  GuessEnd,
  GuessHints,
  GuessList,
  GuessSearch,
  GuessYesterday,
  useGuessGame,
  type Playable,
} from "@/components/hero-guess/guess-game";
import {
  cardFocus,
  cardZoom,
  mosaicBlocks,
  shareLine,
  VARIANT_HINTS,
  zoomCrop,
  type HintKey,
} from "@/lib/games/hero-guess";
import { gameIconSrc, heroCardArtSrc, heroSkillIconSrc } from "@/lib/games/heroes";
import { useLocale } from "@/lib/i18n/client";
import { intlLocale, testi } from "@/lib/i18n/locale";

export type PuzzleKind = "carta" | "unica" | "testo";

/** Un eroe del gioco, con quello che la modalita' mostra di lui. */
export type PuzzleEntry = Playable & {
  /** uscita globale, AAAA-MM-GG: dal 12/10 l'eroe del giorno sceglie fra chi era gia' uscito */
  readonly date: string | null;
  readonly attribute: number | null;
  /** il nome della sua Unica nella lingua della pagina */
  readonly unique: string | null;
  readonly uniqueIcon: boolean;
  /** le carte A e B con l'illustrazione (modalita' carta) */
  readonly cards?: readonly { readonly slot: "A" | "B"; readonly sprite: number; readonly name: string }[];
  /** il testo dell'Unica, col nome dell'eroe nascosto (modalita' testo) */
  readonly text?: string;
};

const TESTI = testi({
  it: {
    domanda: { carta: "Di chi è questa carta?", unica: "Di chi è questa Unica?", testo: "Di chi è questa Unica?" },
    aiuto: {
      carta: "La carta",
      attributo: "Attributo",
      nome: "Nome dell'Unica",
      icona: "Icona dell'Unica",
    } satisfies Record<HintKey, string>,
    cartaSlot: (slot: string) => `Carta ${slot}`,
    ingrandita: (volte: string, mosaico: boolean) =>
      `ingrandita ${volte} volte${mosaico ? ", a mosaico" : ""}: si allarga a ogni tentativo sbagliato`,
    intera: "la carta intera",
    nascosto: "??? = il nome dell'eroe, nascosto",
    mosaico: "Mosaico: i quadretti si rimpiccioliscono a ogni tentativo sbagliato",
  },
  en: {
    domanda: { carta: "Whose card is this?", unica: "Whose Unique is this?", testo: "Whose Unique is this?" },
    aiuto: {
      carta: "The card",
      attributo: "Attribute",
      nome: "Unique's name",
      icona: "Unique's icon",
    } satisfies Record<HintKey, string>,
    cartaSlot: (slot: string) => `Card ${slot}`,
    ingrandita: (volte: string, mosaico: boolean) =>
      `zoomed ${volte} times${mosaico ? ", as a mosaic" : ""}: it widens at every wrong guess`,
    intera: "the whole card",
    nascosto: "??? = the hero's name, hidden",
    mosaico: "Mosaic: the tiles get smaller at every wrong guess",
  },
});

export function PuzzleGuess({
  game,
  kind,
  heroes,
  attributes,
  icons,
}: {
  game: string;
  kind: PuzzleKind;
  heroes: readonly PuzzleEntry[];
  /** i nomi degli attributi nella lingua della pagina, per l'aiuto */
  attributes: Readonly<Record<string, string>>;
  icons?: Readonly<Record<string, readonly string[]>>;
}) {
  const locale = useLocale();
  const t = TESTI[locale];
  const g = useGuessGame({
    game,
    variant: kind,
    heroes,
    // due eroi hanno lo stesso testo dell'Unica: valgono tutti e due
    accepts: kind === "testo" ? (guess, answer) => guess.id === answer.id || (!!guess.text && guess.text === answer.text) : undefined,
  });
  const answer = g.answer;
  const card = answer?.cards?.length ? answer.cards[g.seed % answer.cards.length] : undefined;

  const hintContent = (key: HintKey): React.ReactNode => {
    if (!answer) return null;
    if (key === "carta") return card ? `${t.cartaSlot(card.slot)} · «${card.name}»` : "?";
    if (key === "nome") return `«${answer.unique ?? "?"}»`;
    if (key === "icona")
      return answer.uniqueIcon ? (
        // eslint-disable-next-line @next/next/no-img-element -- icona gia' pronta, come nella scheda eroe
        <img src={heroSkillIconSrc(game, answer.id)} alt="" width={48} height={48} className="mt-1" />
      ) : (
        "?"
      );
    const codes = answer.attribute === 6 ? [4, 5] : answer.attribute !== null ? [answer.attribute] : [];
    return (
      <span className="flex items-center gap-1.5">
        {codes.map((code) =>
          icons?.attributo?.includes(String(code)) ? (
            // eslint-disable-next-line @next/next/no-img-element -- icone del gioco gia' pronte
            <img key={code} src={gameIconSrc(game, "attributo", code)} alt="" width={22} height={22} />
          ) : null,
        )}
        {answer.attribute !== null ? attributes[String(answer.attribute)] : "?"}
      </span>
    );
  };

  const zoom = cardZoom(g.wrong, g.over);
  const focus = cardFocus(g.seed);
  const [mosaic, saveMosaic] = useMosaicPreference();
  const blocks = mosaic && kind !== "testo" ? mosaicBlocks(kind, g.wrong, g.over) : null;

  return (
    <div>
      <GuessControls g={g} />

      {/* quello da indovinare */}
      {answer ? (
        <section className="mt-5 max-w-[640px]">
          <h2 className={cx(display, "m-0 text-[clamp(20px,2.6vw,26px)]")}>{t.domanda[kind]}</h2>
          {kind === "carta" && card ? (
            <figure className="m-0 mt-3">
              <div className="w-fit overflow-hidden border border-rule bg-paper-2 shadow-[5px_5px_0_var(--color-brand)]">
                <MosaicImage
                  src={heroCardArtSrc(game, answer.id, card.sprite)}
                  width={180}
                  height={360}
                  zoom={zoom}
                  focus={focus}
                  blocks={blocks}
                  label={t.domanda.carta}
                />
              </div>
              <figcaption className="mt-1.5 text-[12px] text-ink-3">
                {g.over
                  ? t.intera
                  : t.ingrandita(zoom.toLocaleString(intlLocale(locale), { maximumFractionDigits: 1 }), blocks !== null)}
              </figcaption>
            </figure>
          ) : null}
          {kind === "unica" ? (
            <div className="mt-3 grid h-[148px] w-[148px] place-items-center border border-rule bg-paper-2 shadow-[5px_5px_0_var(--color-brand)]">
              {answer.uniqueIcon ? (
                <MosaicImage
                  src={heroSkillIconSrc(game, answer.id)}
                  width={128}
                  height={128}
                  zoom={1}
                  focus={{ x: 50, y: 50 }}
                  blocks={blocks}
                  label={t.domanda.unica}
                />
              ) : (
                "?"
              )}
            </div>
          ) : null}
          {kind !== "testo" && !g.over ? (
            <label className="mt-3 flex w-fit cursor-pointer items-center gap-2 text-[13px] text-ink-2">
              <input
                type="checkbox"
                checked={mosaic}
                onChange={(event) => saveMosaic(event.target.checked)}
                className="accent-[var(--color-brand)]"
              />
              {t.mosaico}
            </label>
          ) : null}
          {kind === "testo" && answer.text ? (
            <div className="p5-corner mt-3 border border-rule bg-paper-2 p-4 text-[14px] leading-relaxed text-ink-2">
              <GameText text={answer.text} />
              {answer.text.includes("???") ? <p className="m-0 mt-2 text-[12px] text-ink-3">{t.nascosto}</p> : null}
            </div>
          ) : null}
        </section>
      ) : null}

      <GuessSearch game={game} g={g} />
      <GuessEnd game={game} g={g} variant={kind} grid={shareLine(g.guesses.length, g.solved)} />
      <GuessHints
        g={g}
        items={VARIANT_HINTS[kind].map(({ key, after }) => ({ key, after, label: t.aiuto[key], content: hintContent(key) }))}
      />
      <GuessList game={game} g={g} />
      <GuessYesterday game={game} g={g} />
    </div>
  );
}

/* ---------------------------------------------------------------- mosaico -- */

/**
 * La scelta del mosaico, ricordata nel browser per tutte le partite: acceso se
 * non e' mai stato spento (o se il browser non salva niente).
 */
const MOSAIC_KEY = "gachazone:indovina:mosaico";
const MOSAIC_EVENT = "gachazone:indovina-mosaico";
let mosaicMemory: boolean | null = null;

function readMosaic(): boolean {
  if (mosaicMemory !== null) return mosaicMemory;
  try {
    return window.localStorage.getItem(MOSAIC_KEY) !== "0";
  } catch {
    return true;
  }
}

function subscribeMosaic(notify: () => void): () => void {
  window.addEventListener("storage", notify);
  window.addEventListener(MOSAIC_EVENT, notify);
  return () => {
    window.removeEventListener("storage", notify);
    window.removeEventListener(MOSAIC_EVENT, notify);
  };
}

function useMosaicPreference(): readonly [boolean, (on: boolean) => void] {
  const on = useSyncExternalStore(subscribeMosaic, readMosaic, () => true);
  const save = useCallback((next: boolean) => {
    try {
      window.localStorage.setItem(MOSAIC_KEY, next ? "1" : "0");
      mosaicMemory = null;
    } catch {
      mosaicMemory = next;
    }
    window.dispatchEvent(new Event(MOSAIC_EVENT));
  }, []);
  return [on, save] as const;
}

/**
 * Un'immagine ingrandita attorno a un punto e, se `blocks` c'e', a mosaico: la
 * parte visibile si disegna in `blocks` quadretti di larghezza e poi si allarga
 * senza sfumare. Un canvas perche' il CSS non pixela un'immagine in modo
 * affidabile (image-rendering vale solo per l'immagine intera, non per la parte
 * ingrandita). Il mosaico si calcola sulla parte visibile, cosi' i quadretti
 * hanno la stessa misura sullo schermo qualunque sia lo zoom.
 */
function MosaicImage({
  src,
  width,
  height,
  zoom,
  focus: { x, y },
  blocks,
  label,
}: {
  src: string;
  width: number;
  height: number;
  zoom: number;
  focus: { x: number; y: number };
  blocks: number | null;
  label: string;
}) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [loaded, setLoaded] = useState<{ src: string; image: HTMLImageElement } | null>(null);

  useEffect(() => {
    let alive = true;
    const image = new Image();
    image.onload = () => {
      if (alive) setLoaded({ src, image });
    };
    image.src = src;
    return () => {
      alive = false;
    };
  }, [src]);

  useEffect(() => {
    const element = canvas.current;
    const context = element?.getContext("2d");
    if (!element || !context) return;
    const ratio = window.devicePixelRatio || 1;
    element.width = Math.round(width * ratio);
    element.height = Math.round(height * ratio);
    context.clearRect(0, 0, element.width, element.height);
    // l'immagine della partita di prima non si disegna con lo zoom di quella nuova
    if (!loaded || loaded.src !== src) return;
    const { image } = loaded;
    const { sx, sy, sw, sh } = zoomCrop(image.naturalWidth, image.naturalHeight, zoom, { x, y });
    if (blocks) {
      const rows = Math.max(1, Math.round((blocks * height) / width));
      const small = document.createElement("canvas");
      small.width = blocks;
      small.height = rows;
      const smallContext = small.getContext("2d");
      if (!smallContext) return;
      smallContext.imageSmoothingEnabled = true;
      smallContext.imageSmoothingQuality = "high";
      smallContext.drawImage(image, sx, sy, sw, sh, 0, 0, blocks, rows);
      context.imageSmoothingEnabled = false;
      context.drawImage(small, 0, 0, blocks, rows, 0, 0, element.width, element.height);
    } else {
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.drawImage(image, sx, sy, sw, sh, 0, 0, element.width, element.height);
    }
  }, [loaded, src, width, height, zoom, x, y, blocks]);

  return <canvas ref={canvas} role="img" aria-label={label} className="block" style={{ width, height }} />;
}
