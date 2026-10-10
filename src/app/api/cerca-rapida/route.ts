/**
 * L'indice della ricerca rapida (quick-search.tsx): tutto quello che si puo'
 * aprire di un gioco, in una risposta sola e nelle due lingue, cosi' la ricerca
 * filtra nel browser mentre si scrive senza un giro sul server a ogni lettera.
 *
 *   GET /api/cerca-rapida?gioco=grand-cross
 *
 * Eroi, pagine della barra, boss degli Scontri finali, Bestie demoniache, set e
 * carte artefatto: circa 90 KB (20 compressi), che il browser tiene in cache. Solo dati del
 * gioco, niente dell'utente.
 */

import { NextResponse } from "next/server";
import { gameGroups } from "@/lib/games/catalog";
import { getGameModule } from "@/lib/games/registry";
import type { QuickIndex } from "@/lib/quick-search";

export function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("gioco") ?? "";
  const gameModule = getGameModule(slug);
  if (!gameModule) return NextResponse.json({ error: "gioco sconosciuto" }, { status: 404 });

  const heroes: QuickIndex["heroes"][number][] = (gameModule.roster?.heroes ?? []).map((hero) => [
    hero.id,
    hero.nameIt ?? hero.name,
    hero.epithetIt ?? hero.epithet,
    hero.name,
    hero.epithet,
    hero.group,
  ]);
  const it = gameGroups(slug, "it").flatMap((group) => group.items);
  const en = gameGroups(slug, "en").flatMap((group) => group.items);
  const pages: QuickIndex["pages"][number][] = it.map((item, i) => [item.label, en[i]?.label ?? item.label, item.path]);
  const name = (label: { it: string | null; en: string | null }) => [label.it ?? label.en ?? "", label.en ?? label.it ?? ""] as const;
  const items: QuickIndex["items"][number][] = [
    ...(gameModule.deathMatch?.bosses ?? []).map((boss) => ["boss", ...name(boss.name), `/scontri-finali/${boss.key}`] as const),
    ...(gameModule.creatureNest?.beasts ?? []).map((beast) => ["bestia", ...name(beast.name), `/bestie-demoniache/${beast.key}`] as const),
    ...(gameModule.artifacts?.sets ?? []).map((set) => ["set", ...name(set.name), `/set-artefatto/${set.number}`] as const),
    ...(gameModule.artifacts?.cards ?? []).map((card) => ["carta", ...name(card.name), `/carte-artefatto/${card.id}`] as const),
  ];

  const index: QuickIndex = { heroes, pages, items };
  return NextResponse.json(index, {
    // dati del gioco: cambiano con una patch, non da una richiesta all'altra
    headers: { "cache-control": "public, max-age=3600, stale-while-revalidate=86400" },
  });
}
