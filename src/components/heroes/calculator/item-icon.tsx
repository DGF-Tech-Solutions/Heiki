import { cx } from "@/components/ui";
import type { ItemIconLayers } from "@/lib/games/gear-types";

/**
 * L'icona quadrata di un oggetto come la disegna il gioco (IconItem): sfondo e
 * cornice della rarita', l'immagine dell'oggetto, la lettera della rarita', e per
 * l'equipaggiamento le stelle dei risvegli, il «+N» e il glifo del set; per i
 * costumi il marchio del costume.
 *
 * Gli strati li prepara la pipeline (script/equipaggiamento.py), ognuno della
 * misura dell'icona e gia' al suo posto, nell'ordine del prefab: qui si impilano
 * e basta. Solo l'immagine dell'oggetto e' quella del client com'e', e va nel suo
 * riquadro (`objectBox`). Senza JavaScript: la usano anche le schede del server.
 */

/**
 * Per i pulsanti con un'icona grande (pezzi, costumi, reliquia) accanto a
 * `rank-chip`: l'icona cresce di un decimo e non di un quinto. Le stelle dei
 * ranghi crescono dentro il loro riquadro; un'icona di 72px cresciuta di un
 * quinto ne usciva di 7px, copriva il nome sotto e il bordo del passaggio le
 * restava dietro (misurato l'11/10). Solo col movimento permesso: con «riduci
 * movimento» vale la regola di globals.css, che non la fa crescere.
 */
export const ICON_CHIP_GROW = "motion-safe:hover:[&_img]:scale-110";

export const layerSrc = (game: string, name: string) => `/eroi/${game}/equipaggiamento/strati/${name}.webp`;
export const pieceSrc = (game: string, set: number, part: number) => `/eroi/${game}/equipaggiamento/pezzi/${set}_${part}.webp`;
export const slotSrc = (game: string, part: number) => `/eroi/${game}/equipaggiamento/slot/${part}.webp`;
export const costumeSrc = (game: string, id: string) => `/eroi/${game}/costumi/${id}.webp`;

export function ItemIcon({
  game,
  icons,
  kind,
  object,
  rating,
  stars = 0,
  plus = 0,
  set,
  mark,
  size,
  label,
  className,
}: {
  game: string;
  icons: ItemIconLayers;
  kind: "gear" | "costume";
  /** l'indirizzo dell'immagine dell'oggetto; senza, restano sfondo e cornice */
  object?: string | null;
  /** 1-7, C-LR */
  rating: number;
  stars?: number;
  plus?: number;
  set?: number;
  mark?: "costume" | "set" | "condiviso";
  /** il lato in pixel CSS */
  size: number;
  label: string;
  className?: string;
}) {
  const have = new Set(icons.layers);
  const [x, y, w, h] = icons.objectBox;
  const layer = (name: string | null) => (name && have.has(name) ? name : null);
  const layers = icons.order[kind === "gear" ? "gear" : "costume"].map((name) => {
    switch (name) {
      case "oggetto":
        return { name, src: object ?? null };
      case "sfondo":
      case "cornice":
      case "lettera":
        return { name, src: layer(`${name}_${rating}`) };
      case "stelle":
        return { name, src: stars > 0 ? layer(`stelle_${stars}`) : null };
      case "piu":
        return { name, src: plus > 0 ? layer(`piu_${plus}`) : null };
      case "esagono":
        return { name, src: set ? layer("esagono") : null };
      case "set":
        return { name, src: set ? layer(`set_${set}`) : null };
      case "marchio":
        return { name, src: mark ? layer(`marchio_${mark}`) : null };
      default:
        return { name, src: null };
    }
  });

  return (
    <span
      role="img"
      aria-label={label}
      title={label}
      className={cx("relative inline-block shrink-0 select-none", className)}
      style={{ width: size, height: size }}
    >
      {layers.map(({ name, src }) =>
        src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={name}
            src={name === "oggetto" ? src : layerSrc(game, src)}
            alt=""
            aria-hidden
            draggable={false}
            loading="lazy"
            className="absolute max-w-none"
            style={
              name === "oggetto"
                ? {
                    left: `${(x / icons.size) * 100}%`,
                    top: `${(y / icons.size) * 100}%`,
                    width: `${(w / icons.size) * 100}%`,
                    height: `${(h / icons.size) * 100}%`,
                  }
                : { inset: 0, width: "100%", height: "100%" }
            }
          />
        ) : null,
      )}
    </span>
  );
}

/**
 * Il glifo di un set sul suo esagono, ritagliato dagli strati dell'icona: lo
 * stesso disegno dell'angolo dell'icona, per i pulsanti dei set.
 */
export function SetBadge({
  game,
  icons,
  set,
  size,
  className,
}: {
  game: string;
  icons: ItemIconLayers;
  set: number;
  size: number;
  className?: string;
}) {
  const have = new Set(icons.layers);
  if (!have.has(`set_${set}`)) return null;
  // l'esagono esce un poco dalla tela in alto: si ritaglia la parte che c'e'
  const [bx, by, bw, bh] = icons.setBox;
  const top = Math.max(0, by);
  const right = Math.min(icons.size, bx + bw);
  const side = Math.max(right - bx, bh - (top - by));
  const scale = size / side;
  const style = {
    width: icons.size * scale,
    height: icons.size * scale,
    left: -bx * scale,
    top: -top * scale,
    // Nei pulsanti dei set il glifo cresce al passaggio (`.rank-chip img`). Lo
    // strato e' grande quanto l'icona intera e il glifo sta nel suo angolo:
    // cresciuto attorno al centro dello strato, scivolava via in alto a destra.
    // Cresce attorno al centro del glifo.
    transformOrigin: `${(bx + side / 2) * scale}px ${(top + side / 2) * scale}px`,
  };
  // Senza `overflow-hidden`: fuori dal glifo gli strati sono trasparenti (misurato:
  // l'esagono occupa 92-128 x 0-41 su 128), e ritagliati il glifo cresciuto
  // perdeva i bordi. Trasparenti ma non al tocco: `pointer-events-none`, se no la
  // parte dello strato che sporge a sinistra prenderebbe i clic del set accanto.
  return (
    <span aria-hidden className={cx("relative inline-block shrink-0", className)} style={{ width: size, height: size }}>
      {["esagono", `set_${set}`].map((name) =>
        have.has(name) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={name}
            src={layerSrc(game, name)}
            alt=""
            draggable={false}
            className="pointer-events-none absolute max-w-none"
            style={style}
          />
        ) : null,
      )}
    </span>
  );
}
