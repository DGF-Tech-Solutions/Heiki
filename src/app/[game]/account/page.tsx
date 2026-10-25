import { permanentRedirect } from "next/navigation";

/**
 * Il vecchio indirizzo dell'account di gioco. Dal 25/10 l'account sta nel
 * profilo del sito, /profilo/<gioco> (richiesta dell'utente: il profilo e' uno
 * per tutti i giochi). Il reindirizzamento e' permanente: segnalibri, notifiche
 * gia' mandate e link condivisi arrivano alla pagina nuova.
 *
 * Una pagina e non una regola in next.config: un modello come /:gioco/account
 * prenderebbe anche /impostazioni/account (le impostazioni di accesso). Qui Next
 * ci arriva solo per uno slug di gioco, e il guscio del gioco ha gia' dato 404
 * agli altri.
 */
export default async function OldGameAccountPage({
  params,
  searchParams,
}: {
  params: Promise<{ game: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { game } = await params;
  // i parametri del vecchio indirizzo passano al nuovo
  const query = new URLSearchParams(
    Object.entries(await searchParams).flatMap(([key, value]) => [value ?? []].flat().map((item) => [key, item])),
  ).toString();
  permanentRedirect(`/profilo/${game}${query ? `?${query}` : ""}`);
}
