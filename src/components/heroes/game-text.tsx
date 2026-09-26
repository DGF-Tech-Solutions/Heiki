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

import { collectHeroNotes, groupTerms, parseHeroText, splitHeroNotes } from "@/lib/games/hero-markup";
import type { TextLine, TextSegment } from "@/lib/games/hero-markup";
import { readableColor } from "@/components/heroes/game-color";
import { cx } from "@/components/ui";

function Segment({ segment }: { segment: TextSegment }) {
  const color = segment.color ? readableColor(segment.color) : undefined;
  return (
    <span
      className={cx(segment.bold && "font-semibold", segment.italic && "italic")}
      style={color ? { color } : undefined}
    >
      {segment.text}
    </span>
  );
}

/**
 * `terms`: per ogni parola blu, in ordine, l'id della tendina che apre, o null.
 * La numerazione e' quella di `termWords` (hero-markup.ts), la stessa con cui
 * l'import ha legato le parole ai loro bersagli.
 */
function Lines({
  lines,
  className,
  terms,
}: {
  lines: readonly TextLine[];
  className?: string;
  terms?: readonly (string | null)[];
}) {
  if (lines.length === 0) return null;
  let term = 0;

  return (
    <div className={cx("[&>p]:m-0 [&>p+p]:mt-2", className)}>
      {lines.map((line, index) => (
        <p key={index}>
          {groupTerms(line).map((piece, position) => {
            if (piece.kind === "text") return <Segment key={position} segment={piece.segment} />;
            const id = terms?.[term++] ?? null;
            const segments = piece.segments.map((segment, k) => <Segment key={k} segment={segment} />);
            if (!id) return <span key={position}>{segments}</span>;
            // Una parola blu che porta a qualcosa: un pulsante che apre la sua
            // tendina (`popover` del browser, funziona anche senza JavaScript).
            // Il colore e' quello della parola, cosi' anche la sottolineatura a
            // puntini e' azzurra.
            const color = piece.segments[0]?.color ? readableColor(piece.segments[0].color) : undefined;
            return (
              <button
                key={position}
                type="button"
                popoverTarget={id}
                className="cursor-pointer text-left underline decoration-dotted decoration-1 underline-offset-[3px] hover:decoration-solid focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-brand"
                style={color ? { color } : undefined}
              >
                {segments}
              </button>
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
 *
 * `terms` rende cliccabili le parole blu del corpo (26/09): vale solo con
 * `omitNotes`, perche' le parole si contano sul corpo senza le note.
 */
export function GameText({
  text,
  className,
  omitNotes,
  terms,
}: {
  text: string;
  className?: string;
  omitNotes?: boolean;
  terms?: readonly (string | null)[];
}) {
  const lines = omitNotes ? splitHeroNotes(text).body : parseHeroText(text);
  return <Lines lines={lines} className={className} terms={omitNotes ? terms : undefined} />;
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
