import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { listGames } from "@/lib/games/catalog";
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
 */
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

    entries.push(
      { url: `${base}/${game.slug}`, lastModified: now, changeFrequency: "hourly", priority: 0.9 },
      { url: `${base}/${game.slug}/personaggi`, changeFrequency: "weekly", priority: 0.8 },
      { url: `${base}/${game.slug}/nemici`, changeFrequency: "weekly", priority: 0.5 },
      { url: `${base}/${game.slug}/classifica`, changeFrequency: "weekly", priority: 0.7 },
      { url: `${base}/${game.slug}/strumenti`, changeFrequency: "weekly", priority: 0.6 },
      { url: `${base}/${game.slug}/guide`, changeFrequency: "weekly", priority: 0.7 },
    );

    const gameModule = getGameModule(game.slug);
    for (const character of gameModule?.characters ?? []) {
      entries.push({
        url: `${base}/${game.slug}/personaggi/${character.id}`,
        changeFrequency: "weekly",
        priority: 0.8,
      });
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
