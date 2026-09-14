/**
 * Quali icone del gioco sono state estratte.
 *
 * GENERATO DA scripts/import-heroes.mts - NON MODIFICARE A MANO.
 *
 * Le icone stesse stanno in public/eroi/grand-cross/icone/ e NON sono versionate:
 * sono grafica di Netmarble, e si rimettono con `npm run eroi:import`. Questo
 * elenco serve a non mostrare un riquadro rotto a chi clona senza gli asset.
 *
 * La chiave e' il codice del gioco - 1-6 per la razza, 1-5 per l'attributo, la
 * sigla per la rarita' - perche' e' gia' il numero scritto nel nome del file
 * originale. Le fazioni non compaiono: il gioco non ha un'icona per loro.
 * Sotto `carta` c'e' la stella dei ranghi, una sola: il rango la ripete.
 */

export const GAME_ICONS: Readonly<Record<string, readonly string[]>> = {
  "razza": ["1","2","3","4","5","6"],
  "attributo": ["1","2","3","4","5"],
  "rarita": ["R","SR","SSR","UR","LR"],
  "carta": ["stella"],
};
