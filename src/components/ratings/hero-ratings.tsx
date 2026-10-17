import Link from "next/link";
import { StarScore } from "@/components/ratings/star-display";
import { HeroRatingForm } from "@/components/ratings/hero-rating-form";
import { cx, eyebrow } from "@/components/ui";
import { relativeTime } from "@/lib/community/ranking";
import { BEST_CONTENTS, type HeroRatingSummary } from "@/lib/ratings/types";
import { testi, type Locale } from "@/lib/i18n/locale";

const TESTI = testi({
  it: {
    titolo: "Valutazioni della community",
    descrizione:
      "I punteggi medi PvE e PvP assegnati dai giocatori, con l'indicazione dei contenuti in cui questo eroe si distingue di più.",
    pveTitolo: "Valutazione PvE",
    pvpTitolo: "Valutazione PvP",
    pveDesc: "Storia, Boss, Bestie e farming",
    pvpDesc: "Scontro tra Cavalieri e Arena",
    voti: (n: number) => `${n} ${n === 1 ? "valutazione" : "valutazioni"}`,
    nessunVoto: "Nessuna valutazione",
    doveSpicca: "Dove spicca di più",
    nessunContenuto: "Nessun contenuto indicato finora",
    recensioniCommunity: (n: number) => `Opinioni dei giocatori · ${n}`,
    senzaRecensioni: "Nessun commento lasciato finora. Sii il primo a condividere la tua esperienza con questo eroe!",
    consigliatoPer: "Consigliato per:",
    pveAbbr: "PvE",
    pvpAbbr: "PvP",
  },
  en: {
    titolo: "Community ratings",
    descrizione:
      "Average PvE and PvP scores rated by players, with consensus on which game modes this hero excels in.",
    pveTitolo: "PvE Rating",
    pvpTitolo: "PvP Rating",
    pveDesc: "Story, Bosses, Beasts and farming",
    pvpDesc: "Knighthood Battles and Arena",
    voti: (n: number) => `${n} ${n === 1 ? "rating" : "ratings"}`,
    nessunVoto: "No ratings yet",
    doveSpicca: "Where it shines most",
    nessunContenuto: "No preferred modes specified yet",
    recensioniCommunity: (n: number) => `Player reviews · ${n}`,
    senzaRecensioni: "No reviews left yet. Be the first to share your insights on this hero!",
    consigliatoPer: "Best for:",
    pveAbbr: "PvE",
    pvpAbbr: "PvP",
  },
});

interface HeroRatingsProps {
  game: string;
  heroId: string;
  locale: Locale;
  summary: HeroRatingSummary;
  isLoggedIn: boolean;
}

export function HeroRatings({
  game,
  heroId,
  locale,
  summary,
  isLoggedIn,
}: HeroRatingsProps) {
  const t = TESTI[locale];
  const now = new Date();

  return (
    <div className="grid gap-8">
      {/* Testata della scheda */}
      <div>
        <h3 className={cx(eyebrow, "mb-1 text-ink")}>{t.titolo}</h3>
        <p className="max-w-[65ch] text-sm text-ink-2">{t.descrizione}</p>
      </div>

      {/* Riquadri di sintesi: PvE, PvP, Dove spicca */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Box PvE */}
        <div className="p5-corner flex flex-col justify-between border border-rule bg-paper-2 p-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-display text-xs font-black uppercase tracking-wider text-ink-3">
                {t.pveTitolo}
              </span>
              <span className="text-[11px] text-ink-3 font-normal">{t.pveDesc}</span>
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-display text-3xl font-black text-ink">
                {summary.pveAvg > 0 ? summary.pveAvg.toFixed(1) : "—"}
              </span>
              <span className="text-xs text-ink-3">/ 5.0</span>
            </div>
            <div className="mt-1">
              <StarScore
                game={game}
                score={summary.pveAvg}
                size={20}
                showScoreText={false}
              />
            </div>
          </div>
          <div className="mt-4 border-t border-rule-2 pt-2 text-xs text-ink-3">
            {summary.totalRatings > 0 ? t.voti(summary.totalRatings) : t.nessunVoto}
          </div>
        </div>

        {/* Box PvP */}
        <div className="p5-corner flex flex-col justify-between border border-rule bg-paper-2 p-4">
          <div>
            <div className="flex items-center justify-between">
              <span className="font-display text-xs font-black uppercase tracking-wider text-ink-3">
                {t.pvpTitolo}
              </span>
              <span className="text-[11px] text-ink-3 font-normal">{t.pvpDesc}</span>
            </div>
            <div className="mt-2 flex items-baseline gap-3">
              <span className="font-display text-3xl font-black text-ink">
                {summary.pvpAvg > 0 ? summary.pvpAvg.toFixed(1) : "—"}
              </span>
              <span className="text-xs text-ink-3">/ 5.0</span>
            </div>
            <div className="mt-1">
              <StarScore
                game={game}
                score={summary.pvpAvg}
                size={20}
                showScoreText={false}
              />
            </div>
          </div>
          <div className="mt-4 border-t border-rule-2 pt-2 text-xs text-ink-3">
            {summary.totalRatings > 0 ? t.voti(summary.totalRatings) : t.nessunVoto}
          </div>
        </div>

        {/* Box Dove spicca */}
        <div className="p5-corner border border-rule bg-paper-2 p-4 sm:col-span-2 lg:col-span-1">
          <span className="font-display text-xs font-black uppercase tracking-wider text-ink-3">
            {t.doveSpicca}
          </span>

          {summary.distribution.length > 0 ? (
            <div className="mt-3 space-y-2">
              {summary.distribution.slice(0, 4).map((item) => (
                <div key={item.key} className="text-xs">
                  <div className="flex justify-between text-ink font-medium">
                    <span>{item.label[locale]}</span>
                    <span className="font-mono text-ink-2">{item.percentage}%</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full overflow-hidden rounded bg-paper">
                    <div
                      className="h-full bg-brand transition-all duration-300"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-3 text-xs text-ink-3">{t.nessunContenuto}</p>
          )}
        </div>
      </div>

      {/* Modulo di valutazione utente */}
      <HeroRatingForm
        game={game}
        heroId={heroId}
        locale={locale}
        initialRating={summary.userRating}
        isLoggedIn={isLoggedIn}
      />

      {/* Elenco recensioni della community */}
      <section className="mt-2">
        <h4 className={cx(eyebrow, "mb-4 text-ink")}>
          {t.recensioniCommunity(summary.recentRatings.length)}
        </h4>

        {summary.recentRatings.length > 0 ? (
          <div className="grid gap-3">
            {summary.recentRatings.map((rating) => {
              const bestContentDef = rating.bestContent ? BEST_CONTENTS[rating.bestContent] : null;
              const isCurrentUser = summary.userRating?.id === rating.id;

              return (
                <div
                  key={rating.id}
                  className="rounded border border-rule bg-paper-2 p-4 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/profilo/${rating.user.username}`}
                        className="font-bold text-sm text-ink hover:text-brand"
                      >
                        {rating.user.displayName}
                      </Link>
                      {isCurrentUser ? (
                        <span className="rounded bg-brand/10 border border-brand/30 px-1.5 py-0.5 text-[10px] font-bold text-brand uppercase">
                          Tu
                        </span>
                      ) : null}
                      {rating.user.role !== "USER" ? (
                        <span className="rounded bg-brand/20 px-1.5 py-0.5 text-[10px] font-bold text-brand uppercase">
                          {rating.user.role}
                        </span>
                      ) : null}
                    </div>

                    <span className="font-mono text-xs text-ink-3">
                      {relativeTime(rating.updatedAt, now, locale)}
                    </span>
                  </div>

                  {/* Voti a stelle e tag contenuto */}
                  <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-ink-2">{t.pveAbbr}:</span>
                      <StarScore
                        game={game}
                        score={rating.pveScore}
                        size={15}
                        showScoreText={false}
                        label={`${t.pveAbbr}: ${rating.pveScore} / 5`}
                      />
                      <span className="font-mono font-bold text-ink">{rating.pveScore}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-ink-2">{t.pvpAbbr}:</span>
                      <StarScore
                        game={game}
                        score={rating.pvpScore}
                        size={15}
                        showScoreText={false}
                        label={`${t.pvpAbbr}: ${rating.pvpScore} / 5`}
                      />
                      <span className="font-mono font-bold text-ink">{rating.pvpScore}</span>
                    </div>

                    {bestContentDef ? (
                      <span className="rounded bg-paper px-2 py-0.5 font-bold text-brand-deep">
                        {t.consigliatoPer} {bestContentDef.label[locale]}
                      </span>
                    ) : null}
                  </div>

                  {/* Commento opzionale con break-words */}
                  {rating.comment ? (
                    <p className="mt-2.5 max-w-[65ch] text-sm text-ink-2 leading-relaxed break-words">
                      {rating.comment}
                    </p>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p5-corner border border-dashed border-rule bg-paper/30 p-8 text-center text-sm text-ink-3">
            <p className="max-w-[50ch] mx-auto">{t.senzaRecensioni}</p>
          </div>
        )}
      </section>
    </div>
  );
}

