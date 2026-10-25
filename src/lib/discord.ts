/**
 * Gli avvisi su Discord per i moderatori.
 *
 * Richiesta dell'utente (10/10): la verifica della classe «magari collegata a un
 * bot Discord». Il bot che riceve le schermate e' stato valutato e lasciato: il
 * sito le riceve gia', e un bot va tenuto acceso, collegato agli account e
 * ospitato da qualche parte. Quello che il bot avrebbe dato davvero ai
 * moderatori e' sapere subito che c'e' una schermata da guardare: per questo
 * basta un webhook di Discord, un indirizzo a cui il sito manda un messaggio.
 *
 *   DISCORD_WEBHOOK_MODERAZIONE   l'indirizzo del webhook del canale dei moderatori
 *                                 (Discord: Impostazioni canale > Integrazioni >
 *                                 Webhook). Senza, nessun avviso e nessun errore.
 *
 * Cosa NON parte: nessun dato delle persone. Fino al 25/10 il messaggio diceva
 * chi (l'handle), la classe dichiarata e l'eroe del giorno, o l'autore e il
 * titolo di una guida: Discord sta negli Stati Uniti, e ogni handle diventava un
 * dato personale mandato fuori dall'UE da dichiarare nell'informativa. Ora
 * l'avviso dice solo che c'e' qualcosa da guardare e dove; chi e cosa li legge
 * il moderatore nella coda del sito, dietro l'accesso. Scelta dell'utente.
 */

import { siteUrl } from "@/lib/site";

interface Field {
  readonly name: string;
  readonly value: string;
}

/** Manda un messaggio al canale dei moderatori. Non lancia mai: un avviso perso non ferma niente. */
export async function notifyModerators(message: {
  title: string;
  /**
   * Solo dati del gioco (per esempio la modalita' e la difficolta' di una
   * guida), mai dati delle persone: niente handle, classe dichiarata, testi
   * scritti dagli utenti. Vedi la nota in cima.
   */
  fields?: readonly Field[];
  path: string;
}): Promise<boolean> {
  const url = process.env.DISCORD_WEBHOOK_MODERAZIONE;
  if (!url || !/^https:\/\/(?:[a-z]+\.)?discord(?:app)?\.com\/api\/webhooks\//.test(url)) return false;
  const link = `${siteUrl()}${message.path}`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        username: "Heiki",
        // niente @everyone o menzioni che arrivino dai dati di un utente
        allowed_mentions: { parse: [] },
        embeds: [
          {
            title: message.title.slice(0, 256),
            url: link,
            color: 0xe61421,
            fields: (message.fields ?? []).slice(0, 10).map((f) => ({
              name: f.name.slice(0, 256),
              value: f.value.slice(0, 1024) || "—",
              inline: true,
            })),
            timestamp: new Date().toISOString(),
          },
        ],
      }),
      signal: AbortSignal.timeout(5000),
    });
    return response.ok;
  } catch {
    return false;
  }
}
