import { permanentRedirect } from "next/navigation";
import { defaultGameSlug } from "@/lib/games/catalog";

/**
 * La community stava qui prima che il sito venisse partizionato per gioco.
 * Un indirizzo che e' esistito non deve morire: chi ha il segnalibro, il link in
 * una chat o la pagina aperta da ieri finirebbe su un 404 senza capire perche'.
 */
export default function LegacyCommunityPage(): never {
  permanentRedirect(`/${defaultGameSlug()}`);
}
