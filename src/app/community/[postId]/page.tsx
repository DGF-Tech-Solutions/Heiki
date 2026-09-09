import { permanentRedirect } from "next/navigation";
import { defaultGameSlug } from "@/lib/games/catalog";

/** Vecchio indirizzo di una discussione, prima della partizione per gioco. */
export default async function LegacyPostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}): Promise<never> {
  const { postId } = await params;
  permanentRedirect(`/${defaultGameSlug()}/post/${postId}`);
}
