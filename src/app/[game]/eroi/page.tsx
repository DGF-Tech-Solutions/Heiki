import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumb } from "@/components/breadcrumb";
import { RosterBrowser } from "@/components/heroes/roster-browser";
import { cx, display, eyebrow } from "@/components/ui";
import { findGame } from "@/lib/games/catalog";
import { requireGameModule } from "@/lib/games/registry";

/**
 * Eroi.
 *
 * Il roster completo, quello che si sfoglia. E' diverso da Personaggi, che
 * elenca le unita' che il motore sa simulare: quelle hanno moltiplicatori
 * calibrati a mano e per ora sono una manciata. Qui ci sono tutte, perche' per
 * riconoscere un eroe e sapere che attributo ha non serve aver calibrato niente.
 *
 * Le due sezioni convergeranno man mano che il dataset cresce.
 */

interface Props {
  params: Promise<{ game: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { game } = await params;
  const entry = findGame(game);
  return {
    title: `Eroi di ${entry?.shortName ?? "gioco"} · GachaZone`,
    description: `Roster completo di ${entry?.name ?? "questo gioco"}, filtrabile per rarità e attributo.`,
  };
}

export default async function HeroesPage({ params }: Props) {
  const { game } = await params;

  const entry = findGame(game);
  if (!entry) notFound();

  const { roster } = requireGameModule(game);
  // La voce di menu non compare senza roster, ma l'indirizzo si puo' digitare.
  if (!roster) notFound();

  const rarest = roster.rarities[0];
  const counted = roster.heroes.filter((hero) => hero.rarity === rarest).length;

  return (
    <main className="pt-6 pb-20">
      <Breadcrumb items={[{ label: entry.shortName, href: `/${game}` }, { label: "Eroi" }]} />

      <header className="mb-5 border-b border-rule pb-5">
        <p className={eyebrow}>{entry.shortName}</p>
        <h1 className={cx(display, "mt-3 text-[clamp(26px,3.6vw,38px)]")}>Eroi</h1>
        <p className="mt-2.5 max-w-[68ch] text-sm text-ink-2">
          {roster.heroes.length} eroi, {counted} di grado {rarest}. Le card sono quelle del gioco,
          ricostruite dagli asset del client: cornice, sfondo di rarità e bollino dell&apos;attributo.
        </p>
      </header>

      <RosterBrowser game={game} roster={roster} />

      <p className="mt-8 border-t border-rule-2 pt-4 text-[13px] text-ink-3">
        Immagini e nomi appartengono a {entry.publisher} e sono qui a scopo di consultazione.
      </p>
    </main>
  );
}
