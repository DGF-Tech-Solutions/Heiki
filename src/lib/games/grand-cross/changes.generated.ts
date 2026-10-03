/**
 * I cambiamenti di Grand Cross da una patch all'altra, eroe per eroe.
 *
 * FONTE: il client, via python script/cambiamenti.py (eroi/cambiamenti.json):
 * le patch archiviate da script/archivio_patch.py, confrontate costruendo le
 * schede degli eroi con lo stesso codice. L'archivio comincia il 23/09/2026.
 *
 * GENERATO da scripts/import-changes.mts: non modificare a mano.
 */

import type { ChangesIndex } from "../changes-types";

export const CHANGES: ChangesIndex = {
  patches: ["2026-09-23","2026-09-30"],
  comparisons: [
  {
    from: "2026-09-23",
    to: "2026-09-30",
    newHeroes: [],
    heroes: {

    },
    touchups: {"2016501":[{"part":"skillsSpecial","which":2,"field":"explain"},{"part":"skillsSpecial","which":3,"field":"explain"},{"part":"skillsSpecial","which":4,"field":"explain"},{"part":"skillsSpecial","which":5,"field":"explain"},{"part":"skillsSpecial","which":6,"field":"explain"}]},
    other: [{"group":"abilita","name":{"it":"Abilità","en":"Skills"},"added":0,"removed":0,"changed":5},{"group":"eventi","name":{"it":"Eventi","en":"Events"},"added":0,"removed":0,"changed":4},{"group":"missioni","name":{"it":"Missioni e titoli","en":"Missions and titles"},"added":2,"removed":0,"changed":0},{"group":"contenuti","name":{"it":"Contenuti e battaglie","en":"Content and battles"},"added":0,"removed":0,"changed":1}],
    texts: {"added":4,"changed":2,"removed":0},
  },
  ],
};
