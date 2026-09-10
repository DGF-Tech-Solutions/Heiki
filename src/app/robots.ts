import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";

/**
 * Regole per i crawler.
 *
 * Si escludono le aree che non hanno senso in un indice: quelle personali
 * (impostazioni, notifiche), quelle dimostrative e quelle riservate. La ricerca
 * resta fuori per non generare migliaia di pagine con lo stesso contenuto.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/impostazioni", "/notifiche", "/anteprima", "/moderazione", "/admin", "/cerca"],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
