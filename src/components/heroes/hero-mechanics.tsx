import Link from "next/link";
import { cx, eyebrow } from "@/components/ui";
import { drawChances } from "@/lib/games/mechanics";
import type { MechanicsTeamEffect } from "@/lib/games/mechanics-types";
import { intlLocale, testi, type Locale } from "@/lib/i18n/locale";

/**
 * Le meccaniche di combattimento nella scheda eroe: quanto spesso si pescano le sue
 * carte A e B, e l'effetto di squadra degli eroi Luce e Oscurita'.
 *
 * Richiesta dell'utente del 27/09: oltre alla pagina «Meccaniche», le righe dove
 * servono. Le regole stanno nella pagina (e nello studio della pipeline,
 * MECCANICHE_COMBATTIMENTO.md); qui i numeri dell'eroe, con un rimando.
 */

const TESTI = testi({
  it: {
    pesca: "Pesca",
    pescaTesto: (a: string, b: string, a3: string, b3: string) =>
      `Quando esce una carta di questo eroe è la A nel ${a} dei casi e la B nel ${b}. Con 3 eroi in campo, a ogni pescata: A ${a3}, B ${b3}.`,
    comeFunziona: "Come funziona la pesca",
    luce: "Effetto di squadra: Luce",
    oscurita: "Effetto di squadra: Oscurità",
    luceTesto: (a: number, b: number) =>
      `Con questo eroe in squadra, gli alleati Luce subiscono il ${a}% di danni in meno da chi non è Luce, e gli altri alleati il ${b}% in meno dai nemici in svantaggio contro di loro. Non si somma con un secondo eroe Luce.`,
    oscuritaTesto: (a: number, b: number) =>
      `Con questo eroe in squadra, gli alleati Oscurità infliggono il ${a}% di danni in più a chi non è Oscurità, e gli altri alleati il ${b}% in più quando sono in vantaggio d'attributo. Non si somma con un secondo eroe Oscurità.`,
    oscuritaNota: "Il testo del gioco dice il contrario per il secondo 10%: qui vale il codice.",
    attributi: "Chi batte chi fra gli attributi",
  },
  en: {
    pesca: "Draws",
    pescaTesto: (a: string, b: string, a3: string, b3: string) =>
      `When a card of this hero comes up, it's the A ${a} of the time and the B ${b}. With 3 heroes on the field, on each draw: A ${a3}, B ${b3}.`,
    comeFunziona: "How draws work",
    luce: "Team effect: Light",
    oscurita: "Team effect: Darkness",
    luceTesto: (a: number, b: number) =>
      `With this hero in the team, Light allies take ${a}% less damage from anyone who isn't Light, and the other allies ${b}% less from enemies at a disadvantage against them. It doesn't stack with a second Light hero.`,
    oscuritaTesto: (a: number, b: number) =>
      `With this hero in the team, Darkness allies deal ${a}% more damage to anyone who isn't Darkness, and the other allies ${b}% more when they have the attribute advantage. It doesn't stack with a second Darkness hero.`,
    oscuritaNota: "The game's text says the opposite for the second 10%: here the code wins.",
    attributi: "Who beats whom among attributes",
  },
});

const percento = (x: number, locale: Locale, decimali = 0) =>
  `${(x * 100).toLocaleString(intlLocale(locale), { minimumFractionDigits: decimali, maximumFractionDigits: decimali })}%`;

/** Sotto le carte A e B: quanto spesso esce ognuna. */
export function HeroDrawLine({
  game,
  locale,
  weights,
}: {
  game: string;
  locale: Locale;
  weights: readonly [number, number];
}) {
  const t = TESTI[locale];
  const [a, b] = weights;
  const three = drawChances(weights, 3);
  return (
    <p className="m-0 text-[13px] text-ink-2">
      <span className={cx(eyebrow, "mr-2")}>{t.pesca}</span>
      {t.pescaTesto(
        percento(a / (a + b), locale),
        percento(b / (a + b), locale),
        percento(three.a, locale),
        percento(three.b, locale, 1),
      )}{" "}
      <Link href={`/${game}/meccaniche#pesca`} className="text-brand underline-offset-2 hover:underline">
        {t.comeFunziona} →
      </Link>
    </p>
  );
}

/** Sotto l'Unica: l'effetto di squadra di un eroe Luce o Oscurita' (Tristan li ha tutti e due). */
export function HeroTeamEffect({
  game,
  locale,
  light,
  dark,
}: {
  game: string;
  locale: Locale;
  light?: MechanicsTeamEffect;
  dark?: MechanicsTeamEffect;
}) {
  const t = TESTI[locale];
  const heading = cx(eyebrow, "mb-2.5");
  const box = "grid gap-1.5 rounded-card border border-rule bg-paper-2 p-4 text-[14px] text-ink-2";
  return (
    <>
      {light ? (
        <section>
          <h2 className={heading}>{t.luce}</h2>
          <div className={box}>
            <p className="m-0">{t.luceTesto(light.sameAttribute, light.otherAllies)}</p>
          </div>
        </section>
      ) : null}
      {dark ? (
        <section>
          <h2 className={heading}>{t.oscurita}</h2>
          <div className={box}>
            <p className="m-0">{t.oscuritaTesto(dark.sameAttribute, dark.otherAllies)}</p>
            <p className="m-0 text-[12px] text-ink-3">{t.oscuritaNota}</p>
          </div>
        </section>
      ) : null}
      <p className="m-0 -mt-3 text-[13px]">
        <Link href={`/${game}/meccaniche#attributi`} className="text-brand underline-offset-2 hover:underline">
          {t.attributi} →
        </Link>
      </p>
    </>
  );
}
