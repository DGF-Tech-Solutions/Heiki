import { gameIconSrc } from "@/lib/games/heroes";
import { cx } from "@/components/ui";

interface AwakenStarProps {
  game: string;
  size?: number;
  dimmed?: boolean;
  className?: string;
  alt?: string;
  ariaHidden?: boolean;
}

/**
 * La stella gialla dell'Awaken / Carte di Grand Cross.
 */
export function AwakenStar({
  game,
  size = 20,
  dimmed = false,
  className,
  alt = "★",
  ariaHidden,
}: AwakenStarProps) {
  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={gameIconSrc(game, "carta", "stella")}
      alt={ariaHidden ? "" : alt}
      aria-hidden={ariaHidden ?? (alt === "" ? true : undefined)}
      width={size}
      height={size}
      className={cx(
        "inline-block object-contain transition-all duration-150 select-none",
        dimmed
          ? "opacity-25 grayscale"
          : "opacity-100 drop-shadow-[0_0_5px_rgba(255,210,31,0.6)] brightness-105",
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}

interface StarScoreProps {
  game: string;
  score: number;
  max?: number;
  size?: number;
  showScoreText?: boolean;
  label?: string;
  className?: string;
}

/**
 * Mostra una valutazione fissa a 5 stelle (arrotondata all'intero piu' vicino per le stelle piene).
 */
export function StarScore({
  game,
  score,
  max = 5,
  size = 18,
  showScoreText = true,
  label,
  className,
}: StarScoreProps) {
  const rounded = Math.round(score);
  const accessibleLabel =
    label ?? (score > 0 ? `${score.toFixed(1)} / ${max}` : "Nessuna valutazione");

  return (
    <div
      role="img"
      aria-label={accessibleLabel}
      className={cx("inline-flex items-center gap-1.5", className)}
    >
      <div className="flex items-center gap-0.5" aria-hidden="true">
        {Array.from({ length: max }, (_, index) => {
          const starNumber = index + 1;
          const isFilled = starNumber <= rounded;
          return (
            <AwakenStar
              key={starNumber}
              game={game}
              size={size}
              dimmed={!isFilled}
              ariaHidden
            />
          );
        })}
      </div>
      {showScoreText ? (
        <span aria-hidden="true" className="font-mono text-sm font-bold text-ink">
          {score > 0 ? score.toFixed(1) : "—"}
        </span>
      ) : null}
    </div>
  );
}

