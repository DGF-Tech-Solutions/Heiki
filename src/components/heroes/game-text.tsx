/**
 * Rende un testo scritto col markup del gioco.
 *
 * Il testo arriva dal client di Grand Cross e porta il suo markup: capoversi,
 * grassetto, colori. Viene prima trasformato in una struttura e poi in
 * elementi, mai in HTML da iniettare: cosi' una stringa del gioco non puo'
 * diventare markup della pagina, oggi che sono testi innocui e domani che
 * qualcuno ci incolli dentro qualcos'altro.
 *
 * I colori arrivano dal gioco, che li sceglie per fondo scuro. Su fondo chiaro
 * il giallo dei valori sparirebbe, quindi si tinge solo cio' che resta
 * leggibile e il resto prende il colore del testo normale: meglio un valore
 * nero che uno invisibile.
 */

import { parseHeroText } from "@/lib/games/hero-markup";
import { cx } from "@/components/ui";

/** Luminanza percepita, per decidere se un colore regge sul fondo chiaro. */
function tooLight(hex: string): boolean {
  const n = Number.parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255 > 0.62;
}

export function GameText({ text, className }: { text: string; className?: string }) {
  const lines = parseHeroText(text);
  if (lines.length === 0) return null;

  return (
    <div className={cx("[&>p]:m-0 [&>p+p]:mt-2", className)}>
      {lines.map((line, index) => (
        <p key={index}>
          {line.map((segment, position) => {
            const color = segment.color && !tooLight(segment.color) ? segment.color : undefined;

            return (
              <span
                key={position}
                className={segment.bold ? "font-semibold" : undefined}
                style={color ? { color } : undefined}
              >
                {segment.text}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}
