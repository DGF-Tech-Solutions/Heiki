/**
 * Rende un testo scritto col markup del gioco.
 *
 * Il testo arriva dal client di Grand Cross e porta il suo markup: capoversi,
 * grassetto, corsivo, colori. Viene prima trasformato in una struttura e poi in
 * elementi, mai in HTML da iniettare: cosi' una stringa del gioco non puo'
 * diventare markup della pagina, oggi che sono testi innocui e domani che
 * qualcuno ci incolli dentro qualcos'altro.
 *
 * I colori li adatta game-color.ts: si scuriscono invece di sparire, perche' la
 * tinta dice che cosa e' quel pezzo di frase - un valore, un termine, un
 * bersaglio - e vale anche dove non c'e' una definizione da mostrare.
 */

import { collectHeroNotes, parseHeroText, splitHeroNotes } from "@/lib/games/hero-markup";
import type { TextLine } from "@/lib/games/hero-markup";
import { readableColor } from "@/components/heroes/game-color";
import { cx } from "@/components/ui";

function Lines({ lines, className }: { lines: readonly TextLine[]; className?: string }) {
  if (lines.length === 0) return null;

  return (
    <div className={cx("[&>p]:m-0 [&>p+p]:mt-2", className)}>
      {lines.map((line, index) => (
        <p key={index}>
          {line.map((segment, position) => {
            const color = segment.color ? readableColor(segment.color) : undefined;

            return (
              <span
                key={position}
                className={cx(segment.bold && "font-semibold", segment.italic && "italic")}
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

/**
 * `omitNotes` toglie le righe che spiegano i termini.
 *
 * Non e' il comportamento predefinito perche' lo stesso componente rende anche
 * titoli e descrizioni, dove non ci sono note e una potatura silenziosa
 * sarebbe solo un rischio in piu'.
 */
export function GameText({
  text,
  className,
  omitNotes,
}: {
  text: string;
  className?: string;
  omitNotes?: boolean;
}) {
  const lines = omitNotes ? splitHeroNotes(text).body : parseHeroText(text);
  return <Lines lines={lines} className={className} />;
}

/**
 * Le definizioni dei termini, raccolte da piu' testi e mostrate una volta.
 *
 * Prende i ranghi di una carta tutti insieme proprio perche' ripetono la stessa
 * nota: e' qui che la ripetizione viene tolta, non in pagina.
 */
export function GameNotes({ texts, className }: { texts: readonly string[]; className?: string }) {
  const notes = collectHeroNotes(texts);
  if (notes.length === 0) return null;

  return (
    <Lines
      lines={notes}
      className={cx(
        "border-t border-rule pt-2 text-[12px] leading-snug text-ink-3 [&>p+p]:mt-1",
        className,
      )}
    />
  );
}
