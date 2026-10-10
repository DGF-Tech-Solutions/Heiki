import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { gameGroups, listGames } from "@/lib/games/catalog";
import { getGameModule } from "@/lib/games/registry";
import { databaseReachable, db } from "@/lib/db";

/**
 * Mappa del sito.
 *
 * Include cio' che ha senso indicizzare: la radice, gli hub dei giochi, le
 * schede personaggio - che sono le pagine da cui arriva il traffico di ricerca -
 * e le discussioni pubbliche.
 *
 * Le discussioni si leggono dal database, che potrebbe non esserci: in quel caso
 * si pubblica la parte statica invece di far fallire la generazione. Una sitemap
 * incompleta e' meglio di una sitemap assente.
 *
 * Dal 27/09 (via le pagine del vecchio motore) le schede non c'erano piu': fino
 * al 03/10 qui stavano solo la radice, le guide e le pagine legali. Ora le
 * sezioni e le pagine di ogni eroe, boss, bestia, set e carta.
 *
 * Si costruisce a ogni richiesta (`force-dynamic`): altrimenti Next la genera una
 * volta durante la build, senza database e con l'indirizzo di ripiego
 * (localhost), e cosi' resta.
 */
export const dynamic = "force-dynamic";

/** sezioni del gioco che non vanno in un indice: sono di chi le apre */
const PERSONALI = new Set(["/account", "/account/eroi"]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const now = new Date();

  const entries: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${base}/premium`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/legale/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/legale/termini`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/legale/cookie`, changeFrequency: "yearly", priority: 0.2 },
  ];

  for (const game of listGames()) {
    if (!game.available) continue;
    const root = `${base}/${game.slug}`;
    const gameModule = getGameModule(game.slug);

    entries.push({ url: root, lastModified: now, changeFrequency: "hourly", priority: 0.9 });

    // le sezioni della barra laterale, dalla stessa fonte: una sezione nuova entra
    // qui da sola. Fuori la radice (gia' sopra) e le pagine personali.
    for (const group of gameGroups(game.slug)) {
      for (const item of group.items) {
        if (item.path === "" || PERSONALI.has(item.path)) continue;
        entries.push({ url: `${root}${item.path}`, changeFrequency: "weekly", priority: 0.7 });
      }
    }

    // le pagine di ogni eroe, boss, bestia, set e carta: sono quelle che si cercano
    for (const hero of gameModule?.roster?.heroes ?? []) {
      entries.push({ url: `${root}/eroi/${hero.id}`, changeFrequency: "weekly", priority: 0.8 });
    }
    for (const boss of gameModule?.deathMatch?.bosses ?? []) {
      entries.push({ url: `${root}/scontri-finali/${boss.key}`, changeFrequency: "monthly", priority: 0.6 });
    }
    for (const beast of gameModule?.creatureNest?.beasts ?? []) {
      entries.push({ url: `${root}/bestie-demoniache/${beast.key}`, changeFrequency: "monthly", priority: 0.6 });
    }
    for (const set of gameModule?.artifacts?.sets ?? []) {
      entries.push({ url: `${root}/set-artefatto/${set.number}`, changeFrequency: "monthly", priority: 0.5 });
    }
    for (const card of gameModule?.artifacts?.cards ?? []) {
      entries.push({ url: `${root}/carte-artefatto/${card.id}`, changeFrequency: "monthly", priority: 0.4 });
    }
  }

  if (await databaseReachable()) {
    try {
      const posts = await db.query.posts.findMany({
        columns: { id: true, updatedAt: true, hidden: true },
        with: { hub: { with: { game: true } } },
        limit: 2000,
      });

      for (const post of posts) {
        const slug = post.hub.game?.slug;
        if (!slug || post.hidden) continue;
        entries.push({
          url: `${base}/${slug}/post/${post.id}`,
          lastModified: post.updatedAt,
          changeFrequency: "weekly",
          priority: 0.5,
        });
      }

      const guides = await db.query.guides.findMany({
        columns: { slug: true, updatedAt: true, status: true },
        with: { game: true },
        limit: 2000,
      });

      for (const guide of guides) {
        if (guide.status !== "PUBLISHED" || !guide.game) continue;
        entries.push({
          url: `${base}/${guide.game.slug}/guide/${guide.slug}`,
          lastModified: guide.updatedAt,
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    } catch {
      // Parte statica pubblicata comunque.
    }
  }

  return entries;
}
