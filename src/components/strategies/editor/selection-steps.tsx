"use client";

/**
 * I primi tre passi del modulo: modalita', bersaglio, difficolta'. Sono la
 * scelta che la strategia porta con se' (il «tag» chiesto dall'utente): decide
 * dove compare, chi puo' entrare in squadra e quante fasi ci sono da scrivere.
 *
 * Tutte scelte a radio del browser, nascoste sotto la loro forma: si scorrono con
 * le frecce, e il lettore di schermo dice quale e' scelta. Il fuoco si disegna
 * dentro la forma (`outline-offset` negativo) perche' il taglio obliquo e' un
 * clip-path e ritaglierebbe un contorno disegnato fuori.
 */

import type { ReactNode } from "react";
import { IconCheck } from "@/components/icons";
import { readableColor } from "@/components/heroes/game-color";
import { cx, display, eyebrow, rankChipColors, Tag } from "@/components/ui";
import type { EndgameMode, StrategyTemplate, TemplateHero, TemplateLevel, TemplateMode, TemplateTarget } from "@/lib/strategies/types";
import { levelRef, type EditorAttribute, type LevelRef } from "./editor-state";
import type { Texts } from "./editor-texts";

/* -------------------------------------------------------------- il passo -- */

/**
 * La cornice di un passo: il numero grande a contorno (lo stesso dei posti della
 * squadra), il titolo, e accanto lo stato. La sezione prende il fuoco quando un
 * problema la riguarda: il lettore di schermo legge il titolo.
 */
export function Step({
  id,
  number,
  title,
  t,
  done = false,
  optional = false,
  hint,
  children,
}: {
  id: string;
  number: number;
  title: string;
  t: Texts;
  done?: boolean;
  optional?: boolean;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} tabIndex={-1} aria-labelledby={`${id}-titolo`} className="scroll-mt-24 border-t border-rule pt-6 outline-none">
      <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
        <span
          aria-hidden
          className="font-display text-[46px] leading-[0.78] font-black text-transparent [-webkit-text-stroke:1.5px_var(--color-brand)] [font-variation-settings:'wdth'_62]"
        >
          {number}
        </span>
        <h2 id={`${id}-titolo`} className={cx(display, "m-0 text-[24px] sm:text-[28px]")}>
          <span className="sr-only">{t.passo(number)}: </span>
          {title}
        </h2>
        {optional ? <Tag className="mb-1">{t.facoltativo}</Tag> : null}
        {done ? (
          <span className="mb-1 inline-flex items-center gap-1 text-[12px] font-semibold text-up">
            <IconCheck size={14} />
            {t.fatto}
          </span>
        ) : null}
      </div>
      {hint ? <div className="mt-2 max-w-[68ch] text-[13px] leading-relaxed text-ink-2 [&_p]:m-0">{hint}</div> : null}
      <div className="mt-4">{children}</div>
    </section>
  );
}

/** Il fuoco di una scelta a radio, disegnato dentro la forma tagliata. */
const RADIO_FOCUS = "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-[-5px] peer-focus-visible:outline-ink";

/* ------------------------------------------------------------ modalita' -- */

export function ModeChoice({
  t,
  template,
  value,
  onChange,
}: {
  t: Texts;
  template: StrategyTemplate;
  value: EndgameMode | null;
  onChange: (mode: EndgameMode) => void;
}) {
  return (
    <div role="radiogroup" aria-labelledby="passo-modalita-titolo" className="grid grid-cols-2 gap-2 lg:grid-cols-4">
      {template.modes.map((mode) => {
        const checked = value === mode.mode;
        const single = mode.targets.length === 1 ? mode.targets[0] : undefined;
        return (
          <label key={mode.mode} className="group block min-w-0 cursor-pointer">
            <input
              type="radio"
              name="strategia-modalita"
              value={mode.mode}
              checked={checked}
              onChange={() => onChange(mode.mode)}
              className="peer sr-only"
            />
            <span
              className={cx(
                "p5-corner relative isolate flex h-full min-h-[96px] flex-col justify-between gap-3 overflow-hidden border p-3 transition-colors",
                RADIO_FOCUS,
                checked ? "border-brand bg-brand text-white" : "border-rule bg-paper-2 text-ink group-hover:border-ink-3 group-hover:bg-paper-3",
              )}
            >
              {/* il retino del palco, solo sulla scelta */}
              {checked ? (
                <span
                  aria-hidden
                  className="absolute inset-0 -z-10 bg-[radial-gradient(rgba(0,0,0,0.28)_1.1px,transparent_1.8px)] bg-[length:8px_8px] [mask-image:linear-gradient(200deg,#000_0%,transparent_70%)]"
                />
              ) : null}
              <span className="font-display text-[16px] leading-[1.02] font-black uppercase [font-variation-settings:'wdth'_76] sm:text-[19px]">
                {mode.name}
              </span>
              <span className={cx("flex items-center justify-between gap-2 text-[12px]", checked ? "text-white" : "text-ink-3")}>
                {single ? t.difficoltaN(single.levels.length) : t.bersagli(mode.targets.length)}
                {checked ? <IconCheck size={16} /> : null}
              </span>
            </span>
          </label>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------ bersaglio -- */

export function TargetChoice({
  t,
  mode,
  value,
  onChange,
}: {
  t: Texts;
  mode: TemplateMode | null;
  value: TemplateTarget | null;
  onChange: (key: string | null) => void;
}) {
  if (!mode) return <p className="m-0 text-[13px] text-ink-3">{t.primaModalita}</p>;
  if (mode.targets.length === 1) {
    return <p className="m-0 text-[13px] text-ink-2">{t.bersaglioUnico(mode.targets[0]!.name)}</p>;
  }
  return (
    <div role="radiogroup" aria-labelledby="passo-bersaglio-titolo" className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
      {mode.targets.map((target) => {
        const checked = value?.key === target.key;
        return (
          <label key={target.key ?? "unico"} className="group block min-w-0 cursor-pointer">
            <input
              type="radio"
              name="strategia-bersaglio"
              value={target.key ?? ""}
              checked={checked}
              onChange={() => onChange(target.key)}
              className="peer sr-only"
            />
            <span
              className={cx(
                "p5-corner relative isolate flex h-full flex-col overflow-hidden border bg-paper-2 p-2 transition-colors",
                RADIO_FOCUS,
                checked ? "border-brand ring-2 ring-brand ring-inset" : "border-rule group-hover:border-ink-3",
              )}
            >
              <span
                aria-hidden
                className="absolute inset-0 -z-10 bg-[radial-gradient(color-mix(in_srgb,var(--color-brand)_34%,transparent)_1.1px,transparent_1.8px)] bg-[length:8px_8px] [mask-image:linear-gradient(200deg,#000_0%,transparent_72%)]"
              />
              <span
                aria-hidden
                className={cx(
                  "absolute inset-0 -z-10 transition-colors [clip-path:polygon(64%_0,100%_0,100%_100%,40%_100%)]",
                  checked ? "bg-brand" : "bg-paper-3 group-hover:bg-brand-soft",
                )}
              />
              {target.image ? (
                // eslint-disable-next-line @next/next/no-img-element -- immagini del gioco gia' ritagliate, quadrate
                <img
                  src={target.image}
                  alt=""
                  width={150}
                  height={150}
                  loading="lazy"
                  decoding="async"
                  className="mx-auto block aspect-square w-full max-w-[150px] object-contain"
                />
              ) : (
                <span aria-hidden className="block aspect-square w-full" />
              )}
              <span className="mt-1 flex items-start justify-between gap-1.5">
                <span className="line-clamp-2 font-display text-[13px] leading-[1.05] font-black uppercase [font-variation-settings:'wdth'_78] sm:text-[14px]">
                  {target.name}
                </span>
                {checked ? <IconCheck size={15} className="shrink-0" /> : null}
              </span>
            </span>
          </label>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------- difficolta' -- */

/** Il colore che il gioco da' alla difficolta', nel quadratino tagliato delle pagine dell'Endgame. */
function LevelSwatch({ color }: { color: string | null }) {
  if (!color) return null;
  return <span aria-hidden className="p5-cut-sm inline-block h-3 w-3.5 shrink-0" style={{ backgroundColor: readableColor(color) }} />;
}

export function LevelChoice({
  t,
  target,
  value,
  onChange,
  beasts,
}: {
  t: Texts;
  target: TemplateTarget | null;
  value: TemplateLevel | null;
  onChange: (level: LevelRef) => void;
  beasts: boolean;
}) {
  if (!target) return <p className="m-0 text-[13px] text-ink-3">{t.primaBersaglio}</p>;
  // dalla piu' difficile, come i pulsanti delle pagine dell'Endgame (scelta dell'utente, 26/09)
  const levels = [...target.levels].reverse();
  return (
    <>
      <div role="radiogroup" aria-labelledby="passo-difficolta-titolo" className="flex flex-wrap gap-1.5">
        {levels.map((level) => {
          const checked = value === level;
          return (
            <label key={`${level.level ?? "x"}-${level.transcendent}`} className="cursor-pointer">
              <input
                type="radio"
                name="strategia-difficolta"
                value={`${level.level ?? ""}${level.transcendent ? "t" : ""}`}
                checked={checked}
                onChange={() => onChange(levelRef(level))}
                className="peer sr-only"
              />
              <span
                className={cx(
                  "rank-chip inline-flex h-10 items-center gap-2 border px-3 text-[13px] font-semibold",
                  "peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink",
                  rankChipColors(checked),
                )}
              >
                <LevelSwatch color={level.color} />
                {level.name}
                <span className={cx("text-[12px] font-normal", checked ? "text-ink-2" : "text-ink-3")}>{t.fasi(level.phases.length)}</span>
                {checked ? <IconCheck size={14} /> : null}
              </span>
            </label>
          );
        })}
      </div>
      {beasts && target.levels.length === 1 ? <p className="mt-2 mb-0 text-[12px] text-ink-3">{t.soloNormali}</p> : null}
    </>
  );
}

/**
 * Cosa limita la squadra alla difficolta' scelta: gli attributi ammessi e gli
 * eroi esclusi, con la card. E' la stessa regola che spegne gli eroi nella
 * scelta: qui si legge prima di cominciare.
 */
export function LevelLimits({
  t,
  level,
  attributes,
  heroes,
}: {
  t: Texts;
  level: TemplateLevel;
  attributes: readonly EditorAttribute[];
  heroes: ReadonlyMap<string, TemplateHero>;
}) {
  const allowed = level.allowedAttributes;
  const banned = level.banned.map((id) => heroes.get(id)).filter((hero): hero is TemplateHero => !!hero);
  return (
    <div className="p5-corner mt-4 border border-rule bg-paper-2 p-3 sm:p-4">
      <p className={cx(eyebrow, "m-0 text-ink-2")}>{t.limiti(level.name)}</p>
      <dl className="m-0 mt-3 grid gap-x-4 gap-y-3 sm:grid-cols-[max-content_minmax(0,1fr)] sm:items-start">
        <dt className={cx(eyebrow, "sm:leading-7")}>{t.attributiAmmessi}</dt>
        <dd className="m-0 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px]">
          {allowed
            ? allowed.map((code) => {
                const attribute = attributes.find((item) => item.code === code);
                return (
                  <span key={code} className="inline-flex items-center gap-1.5">
                    {attribute?.icon ? (
                      // eslint-disable-next-line @next/next/no-img-element -- le icone del gioco
                      <img src={attribute.icon} alt="" width={20} height={20} className="h-5 w-5 object-contain" />
                    ) : null}
                    {attribute?.name ?? code}
                  </span>
                );
              })
            : <span className="leading-7 text-ink-2">{t.tuttiAttributi}</span>}
        </dd>
        <dt className={cx(eyebrow, "sm:leading-7")}>{t.eroiEsclusi(banned.length)}</dt>
        <dd className="m-0 min-w-0">
          {banned.length === 0 ? (
            <span className="text-[13px] leading-7 text-ink-2">{t.nessunEscluso}</span>
          ) : (
            <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-1.5 p-0">
              {banned.map((hero) => (
                <li key={hero.id} className="flex min-w-0 items-center gap-2 bg-paper-3 p-1 pr-2">
                  {/* eslint-disable-next-line @next/next/no-img-element -- card gia' pronte */}
                  <img src={hero.card} alt="" width={32} height={32} loading="lazy" className="h-8 w-8 shrink-0" />
                  <span className="min-w-0 text-[12px] leading-tight">
                    <span className="block truncate text-ink-3" style={hero.color ? { color: hero.color } : undefined}>
                      {hero.epithet}
                    </span>
                    <span className="block truncate font-semibold">{hero.name}</span>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </dd>
      </dl>
    </div>
  );
}
