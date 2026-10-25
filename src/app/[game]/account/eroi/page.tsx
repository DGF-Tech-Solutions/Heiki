import { permanentRedirect } from "next/navigation";

/** Il vecchio indirizzo del box: dal 25/10 e' /profilo/<gioco>/eroi (vedi ../page.tsx). */
export default async function OldGameBoxPage({
  params,
  searchParams,
}: {
  params: Promise<{ game: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { game } = await params;
  const query = new URLSearchParams(
    Object.entries(await searchParams).flatMap(([key, value]) => [value ?? []].flat().map((item) => [key, item])),
  ).toString();
  permanentRedirect(`/profilo/${game}/eroi${query ? `?${query}` : ""}`);
}
