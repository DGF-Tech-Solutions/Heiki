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
 * Sotto `carta` ci sono le insegne dei ranghi: la stella delle carte A e B, una
 * sola che il rango ripete, e le sei pietre dell'ultimate, una per rango.
 * Sotto `condizione` le icone di dove si attiva una passiva, col suffisso del
 * file come chiave (`start_combat`, `sub`, `pvp_only`...).
 */

export const GAME_ICONS: Readonly<Record<string, readonly string[]>> = {
  "razza": ["1","2","3","4","5","6"],
  "attributo": ["1","2","3","4","5"],
  "rarita": ["R","SR","SSR","UR","LR"],
  "carta": ["stella","pietra_1","pietra_2","pietra_3","pietra_4","pietra_5","pietra_6"],
  "condizione": ["start_combat","sub","pvp_only","pvp_except","destroy_only","destroy_except","all_contents","creaturenest","creaturenest_except"],
};
